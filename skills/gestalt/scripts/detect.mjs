#!/usr/bin/env node
// Gestalt detector: measures geometric and style facts in a real browser and
// reports them by evidence class. It deliberately produces no overall score.
import { createReadStream, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { basename, dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { launch } from './browser.mjs';

const here = dirname(fileURLToPath(import.meta.url));

export const DEFAULT_THRESHOLDS = {
  labelAmbiguous: 1.5,
  tierClear: 1.25,
  tierMinWithinPx: 4,
  nearLengthPx: 2,
  nearColorOklab: 0.03,
  alignNearPx: 4,
  nestedWidthShare: 0.5,
  peekMinPx: 12,
};

export const RULES = [
  ['figure-ground.contrast', 'normative_failure', 'Text below the WCAG 1.4.3 AA ratio on a solid background'],
  ['figure-ground.text-occluded', 'measured', 'Painted element on top of text'],
  ['figure-ground.text-over-complex-background', 'candidate', 'Text on an image or gradient, needs pixel sampling'],
  ['proximity.label-closer-to-other', 'measured', 'Label closer to another control than to its own'],
  ['proximity.label-ambiguous', 'candidate', 'Label nearly equidistant between controls'],
  ['proximity.heading-floats', 'measured|candidate', 'Heading at least as far from its content as from the section above'],
  ['proximity.group-tiers-blurred', 'measured|candidate', 'Repeated groups barely separated, or tiers inverted'],
  ['similarity.near-duplicate-length', 'candidate', 'Almost-identical radius, padding, size or height within a role'],
  ['similarity.near-duplicate-color', 'candidate', 'Almost-identical fill within a role'],
  ['continuity.near-miss-alignment', 'candidate', 'Edge 1-4 px off a shared alignment line'],
  ['common-region.box-in-box', 'candidate', 'Bordered or shadowed box inside another'],
  ['pragnanz.cue-stacking', 'candidate', 'Border and shadow on the same surface'],
  ['closure.scroll-no-cue', 'candidate', 'Horizontal scroller with no visible sign of more content'],
  ['closure.false-floor', 'candidate', 'Nothing crosses the first-screen fold on a scrolling page'],
  ['common-fate.reduced-motion-persists', 'measured', 'Large or endless motion remains under prefers-reduced-motion'],
  ['common-fate.sibling-timing-mismatch', 'candidate', 'Sibling animations with different duration or easing'],
  ['focal.competing-primaries', 'candidate', 'Several same-fill primary actions in one scope'],
  ['semantic.tab-order-inversion', 'candidate', 'Tab moves backward within one form, nav or section'],
  ['semantic.positive-tabindex', 'measured', 'Positive tabindex overrides natural order'],
  ['semantic.focus-offscreen', 'candidate', 'Focus lands somewhere that cannot be seen'],
  ['semantic.control-group-unmarked', 'candidate', 'Radios or checkboxes with no group semantics'],
  ['semantic.link-cluster-unmarked', 'candidate', 'Header or footer link group without nav'],
  ['semantic.css-reorder', 'candidate', 'CSS changes the visual order of interactive content'],
  ['structure.reflow-overflow', 'candidate', 'Page scrolls sideways at 320 CSS px'],
];

const FREEZE = `(() => {
  const s = document.createElement('style');
  s.textContent = '*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}';
  document.documentElement.append(s);
})()`;

const SETTLE = `(async () => {
  await document.fonts?.ready;
  const h = document.documentElement.scrollHeight;
  for (let y = 0; y < Math.min(h, 12000); y += innerHeight * 0.8) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 40));
  }
  window.scrollTo(0, 0);
  await Promise.allSettled([...document.images].filter((i) => !i.complete).map((i) => new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 1500); })));
  await new Promise((r) => setTimeout(r, 150));
})()`;

const MOTION = `(() => {
  const out = [];
  for (const a of document.getAnimations()) {
    const t = a.effect?.target;
    if (!t || !a.effect.getTiming) continue;
    const timing = a.effect.getTiming();
    const keys = a.effect.getKeyframes ? a.effect.getKeyframes().flatMap(Object.keys) : [];
    const path = [];
    for (let e = t; e && e !== document.body && path.length < 4; e = e.parentElement) {
      const peers = e.parentElement ? [...e.parentElement.children].filter((c) => c.tagName === e.tagName) : [];
      const cls = [...e.classList].filter((c) => /^[A-Za-z][\\w-]*$/.test(c)).slice(0, 2).join('.');
      path.unshift(e.tagName.toLowerCase() + (cls ? '.' + cls : '') + (peers.length > 1 ? ':nth-of-type(' + (peers.indexOf(e) + 1) + ')' : ''));
    }
    const parent = t.parentElement;
    out.push({
      selector: path.join(' > '),
      parent: parent ? [...document.querySelectorAll('*')].indexOf(parent) : -1,
      signature: t.tagName + '.' + [...t.classList].sort().join('.'),
      duration: Number(timing.duration) || 0,
      delay: timing.delay || 0,
      easing: timing.easing,
      iterations: timing.iterations === Infinity ? 'infinite' : timing.iterations,
      moves: keys.some((k) => ['transform', 'translate', 'scale', 'rotate', 'left', 'top', 'right', 'bottom'].includes(k)),
    });
  }
  return out;
})()`;

const LONG_TEXT = `(() => {
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  for (let n = w.nextNode(); n; n = w.nextNode()) {
    if (n.textContent.trim().length > 1 && !n.parentElement.closest('script,style')) nodes.push(n);
  }
  for (const n of nodes) {
    const t = n.textContent.trim();
    n.textContent = n.textContent + ' ' + t.slice(0, Math.ceil(t.length * 0.4));
  }
})()`;

const FOCUS_INFO = `(() => {
  let el = document.activeElement;
  while (el && el.shadowRoot && el.shadowRoot.activeElement) el = el.shadowRoot.activeElement;
  if (!el || el === document.body) return null;
  el.dataset.gestaltTab = el.dataset.gestaltTab || String(Math.random());
  const r = el.getBoundingClientRect();
  const scope = el.closest('form,nav,[role=toolbar],[role=tablist],menu');
  const path = [];
  for (let e = el; e && e !== document.body && path.length < 4; e = e.parentElement) {
    if (e.id) { path.unshift('#' + e.id); break; }
    const peers = e.parentElement ? [...e.parentElement.children].filter((c) => c.tagName === e.tagName) : [];
    path.unshift(e.tagName.toLowerCase() + (peers.length > 1 ? ':nth-of-type(' + (peers.indexOf(e) + 1) + ')' : ''));
  }
  return {
    key: el.dataset.gestaltTab,
    selector: path.join(' > '),
    tabindex: el.tabIndex,
    left: r.left + scrollX, right: r.right + scrollX, top: r.top + scrollY, bottom: r.bottom + scrollY,
    width: r.width, height: r.height,
    inView: r.width > 1 && r.height > 1 && r.right > 0 && r.bottom > 0 && r.left < innerWidth && r.top < innerHeight,
    scope: scope ? scope.tagName + '#' + [...document.querySelectorAll('form,nav,[role=toolbar],[role=tablist],menu')].indexOf(scope) : null,
    rtl: getComputedStyle(el).direction === 'rtl',
  };
})()`;

function motionFindings(normal, reduced) {
  const findings = [];
  for (const a of reduced) {
    if (a.moves && (a.iterations === 'infinite' || a.duration >= 400)) {
      findings.push({
        rule: 'common-fate.reduced-motion-persists', selector: a.selector, evidence: 'measured', principle: 'common-fate',
        measurements: { duration_ms: a.duration, iterations: a.iterations, mode: 'reduce' },
        threshold: { value: 400, provenance: 'heuristic for size of motion; WCAG 2.3.3 (AAA) and C39 frame the check' },
        impact: 'Movement continues for people who asked for less motion.',
        fix_hint: 'Replace movement with a short fade inside a prefers-reduced-motion block; keep state changes visible.',
      });
    }
  }
  const byGroup = new Map();
  for (const a of normal) {
    if (a.parent < 0) continue;
    const key = `${a.parent}|${a.signature}`;
    if (!byGroup.has(key)) byGroup.set(key, []);
    byGroup.get(key).push(a);
  }
  for (const group of byGroup.values()) {
    if (group.length < 2) continue;
    const durations = new Set(group.map((a) => a.duration));
    const easings = new Set(group.map((a) => a.easing));
    if (durations.size > 1 || easings.size > 1) {
      findings.push({
        rule: 'common-fate.sibling-timing-mismatch', selector: group[0].selector, evidence: 'candidate', principle: 'common-fate',
        measurements: { members: group.length, durations_ms: [...durations], easings: [...easings] },
        threshold: { value: null, provenance: 'heuristic; a stagger varies delay, not duration or easing' },
        question: 'Do these siblings belong together, and should they move as one?',
        impact: 'Elements that should read as one group move on different timing.',
        fix_hint: 'Share one duration and easing token; vary only delay when a stagger is intended.',
      });
    }
  }
  return findings;
}

async function tabFindings(page) {
  const findings = [];
  const path = [];
  const seen = new Set();
  await page.evaluate('window.scrollTo(0,0); document.activeElement?.blur?.();');
  for (let i = 0; i < 80; i += 1) {
    await page.pressTab();
    const info = await page.evaluate(FOCUS_INFO);
    if (!info || seen.has(info.key)) break;
    seen.add(info.key);
    path.push(info);
    if (info.tabindex > 0) {
      findings.push({
        rule: 'semantic.positive-tabindex', selector: info.selector, evidence: 'measured', principle: 'semantic-parity',
        measurements: { tabindex: info.tabindex },
        threshold: { value: 0, provenance: 'WCAG 2.4.3 failure technique F44 context' },
        impact: 'Positive tabindex pulls focus out of the visual and DOM order.',
        fix_hint: 'Remove the positive tabindex and fix DOM order.',
      });
    }
    if (!info.inView) {
      findings.push({
        rule: 'semantic.focus-offscreen', selector: info.selector, evidence: 'candidate', principle: 'semantic-parity',
        measurements: { width: info.width, height: info.height },
        threshold: { value: null, provenance: 'WCAG 2.4.7 context; measured after the browser scrolled to focus' },
        question: 'Is this control supposed to be reachable while it cannot be seen?',
        impact: 'Keyboard focus lands on something the user cannot see.',
        fix_hint: 'Reveal it on focus, or use inert or hidden while it is closed.',
      });
    }
  }
  for (let i = 1; i < path.length; i += 1) {
    const a = path[i - 1];
    const b = path[i];
    if (!a.scope || a.scope !== b.scope) continue;
    const sameRow = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 0;
    const up = !sameRow && b.bottom <= a.top;
    const back = sameRow && (a.rtl ? b.left >= a.right : b.right <= a.left);
    if (up || back) {
      findings.push({
        rule: 'semantic.tab-order-inversion', selector: b.selector, evidence: 'candidate', principle: 'semantic-parity',
        measurements: { from: a.selector, to: b.selector, direction: up ? 'upward' : 'backward in the row' },
        threshold: { value: null, provenance: 'WCAG 2.4.3 and technique C27; automated tools leave this manual' },
        question: 'Does this focus jump preserve the meaning of the form or navigation?',
        impact: 'Tab order runs against the visual order inside one group.',
        fix_hint: 'Match DOM order to the visual order within the group.',
      });
    }
  }
  return { findings, stops: path.length };
}

function htmlFiles(dir, limit, out = []) {
  for (const name of readdirSync(dir).sort()) {
    if (out.length >= limit) break;
    if (name.startsWith('.') || ['node_modules', 'dist', 'build', 'vendor', 'test', 'tests', 'fixtures', '__tests__', 'gestalt-skill'].includes(name)) continue;
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) htmlFiles(full, limit, out);
    else if (extname(name) === '.html') out.push(full);
  }
  return out;
}

const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.avif': 'image/avif', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.mp4': 'video/mp4' };

function serve(root) {
  const server = createServer((req, res) => {
    let path;
    try { path = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch { res.writeHead(400).end(); return; }
    let file = resolve(root, `.${path}`);
    if (file !== root && !file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
    if (!existsSync(file)) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'content-type': MIME[extname(file).toLowerCase()] || 'application/octet-stream' });
    createReadStream(file).pipe(res);
  });
  return new Promise((ok) => server.listen(0, '127.0.0.1', () => ok(server)));
}

async function resolveTargets(targets, maxPages) {
  const pages = [];
  const servers = [];
  for (const target of targets) {
    if (/^https?:\/\//.test(target)) { pages.push({ label: target, url: target }); continue; }
    const full = resolve(target);
    if (!existsSync(full)) throw new Error(`Target not found: ${target}`);
    const isDir = statSync(full).isDirectory();
    const root = isDir ? full : dirname(full);
    const files = isDir ? htmlFiles(full, maxPages) : [full];
    if (!files.length) throw new Error(`No .html files in ${target}. For an app, start its dev server and pass the URL.`);
    const server = await serve(root);
    servers.push(server);
    const { port } = server.address();
    for (const file of files) {
      const rel = relative(root, file).split(sep).map(encodeURIComponent).join('/');
      pages.push({ label: relative(process.cwd(), file) || basename(file), url: `http://127.0.0.1:${port}/${rel}` });
    }
  }
  return { pages, servers };
}

function fingerprint(f) { return `${f.page}|${f.rule}|${f.selector}`; }

function loadConfig(path) {
  const file = path || 'gestalt.config.json';
  if (!existsSync(file)) {
    if (path) throw new Error(`Config not found: ${path}`);
    return {};
  }
  const config = JSON.parse(readFileSync(file, 'utf8'));
  for (const entry of config.ignore || []) {
    if (!entry.reason) throw new Error(`Every ignore entry needs a reason: ${JSON.stringify(entry)}`);
  }
  return config;
}

export async function detect(targets, options = {}) {
  const config = loadConfig(options.config);
  const thresholds = { ...DEFAULT_THRESHOLDS, ...config.thresholds };
  const viewports = options.viewports || config.viewports || [320, 768, 1280];
  const modes = [{ name: 'light' }];
  if (options.dark) modes.push({ name: 'dark', dark: true });
  if (options.rtl) modes.push({ name: 'rtl', rtl: true });
  if (options.longText) modes.push({ name: 'long-text', longText: true });
  const probeSource = readFileSync(join(here, 'probe.js'), 'utf8');
  const { pages, servers } = await resolveTargets(targets, options.maxPages || 20);
  const initSource = options.init ? readFileSync(options.init, 'utf8') : null;
  const setupSource = options.setup ? readFileSync(options.setup, 'utf8') : null;
  if (options.artifacts && existsSync(options.artifacts)) {
    for (const name of readdirSync(options.artifacts)) {
      if (/^\d+-[a-z-]+\.png$/.test(name)) rmSync(join(options.artifacts, name));
    }
  }
  const browser = await launch();
  const merged = new Map();
  const errors = [];
  const conditions = [];
  const coverage = [];

  try {
    for (const target of pages) {
      for (const width of viewports) {
        for (const mode of modes) {
          const condition = `${width}px ${mode.name}`;
          if (!conditions.includes(condition)) conditions.push(condition);
          const height = width <= 480 ? 780 : 800;
          const page = await browser.newPage();
          try {
            let normal = [];
            let reduced = [];
            if (initSource) await page.init(initSource);
            // Motion is captured once per page, at the widest viewport, to keep scans short.
            const captureMotion = mode.name === 'light' && width === Math.max(...viewports);
            if (captureMotion) {
              await page.setup({ width, height, reducedMotion: true });
              await page.goto(target.url);
              await page.evaluate(SETTLE);
              reduced = await page.evaluate(MOTION);
            }
            await page.setup({ width, height, dark: mode.dark, reducedMotion: false });
            await page.goto(target.url);
            normal = captureMotion ? await page.evaluate(MOTION) : [];
            await page.evaluate(SETTLE);
            if (captureMotion) normal = normal.concat(await page.evaluate(MOTION));
            if (setupSource) await page.evaluate(`(async () => {\n${setupSource}\n})()`);
            await page.evaluate(FREEZE);
            if (mode.rtl) await page.evaluate("document.documentElement.dir='rtl'");
            if (mode.longText) await page.evaluate(LONG_TEXT);
            await page.evaluate('new Promise((r) => setTimeout(r, 120))');
            const result = await page.evaluate(`${probeSource}\n(${JSON.stringify({ thresholds })})`);
            const tab = mode.name === 'light' ? await tabFindings(page) : { findings: [], stops: 0 };
            const motion = captureMotion ? motionFindings(normal, reduced) : [];
            if (result.errors.length) errors.push(...result.errors.map((e) => `${target.label} ${condition}: ${e}`));
            coverage.push({ page: target.label, condition, tab_stops: tab.stops, animations_seen: normal.length, truncated: result.truncated });
            for (const finding of [...result.findings, ...tab.findings, ...motion]) {
              const entry = { page: target.label, ...finding };
              const key = fingerprint(entry);
              if (!merged.has(key)) {
                merged.set(key, { ...entry, conditions: { failed: [] } });
                if (options.artifacts && finding.rect) entry.capture = true;
              }
              if (!merged.get(key).conditions.failed.includes(condition)) merged.get(key).conditions.failed.push(condition);
              if (options.artifacts && finding.rect && !merged.get(key).artifact) {
                const { left, top, width: w, height: h } = finding.rect;
                const pad = 48;
                const clip = { x: Math.max(0, left - pad), y: Math.max(0, top - pad), width: Math.min(w + pad * 2, 1600), height: Math.min(h + pad * 2, 1200) };
                if (clip.width > 1 && clip.height > 1) {
                  mkdirSync(options.artifacts, { recursive: true });
                  const name = `${merged.size}-${finding.rule.replace(/\W+/g, '-')}.png`;
                  const out = join(options.artifacts, name);
                  try {
                    writeFileSync(out, await page.screenshot(clip));
                    merged.get(key).artifact = out;
                  } catch { /* a failed crop does not invalidate the finding */ }
                }
              }
            }
          } catch (error) {
            errors.push(`${target.label} ${condition}: ${error.message}`);
          } finally {
            await page.close().catch(() => {});
          }
        }
      }
    }
  } finally {
    await browser.close();
    for (const server of servers) server.close();
  }

  const ignored = [];
  const findings = [];
  for (const finding of merged.values()) {
    delete finding.rect;
    // Only conditions where the rule ran can count as passed.
    const ran = conditions.filter((c) => {
      if (finding.rule.startsWith('common-fate.')) return c === `${Math.max(...viewports)}px light`;
      if (/^semantic\.(tab-order|positive-tabindex|focus-offscreen)/.test(finding.rule)) return c.endsWith(' light');
      return true;
    });
    finding.conditions.passed = ran.filter((c) => !finding.conditions.failed.includes(c));
    const hit = (config.ignore || []).find((i) => i.rule === finding.rule && (!i.selector || i.selector === finding.selector) && (!i.page || i.page === finding.page));
    if (hit) ignored.push({ page: finding.page, rule: finding.rule, selector: finding.selector, reason: hit.reason });
    else findings.push(finding);
  }
  const order = { normative_failure: 0, measured: 1, candidate: 2 };
  findings.sort((a, b) => order[a.evidence] - order[b.evidence] || a.rule.localeCompare(b.rule));

  const report = {
    tool: 'gestalt-skill detect',
    calibration: 'Rule precision is not yet measured. Heuristic thresholds are uncalibrated starting points.',
    counts: { normative_failure: 0, measured: 0, candidate: 0 },
    scope: { pages: pages.map((p) => p.label), conditions, not_run: ['200% text resize', 'hover and focus states', 'interaction states such as open menus or errors', 'JS-driven, canvas or WebGL motion'], coverage },
    findings,
    ignored,
    errors,
  };
  for (const f of findings) report.counts[f.evidence] += 1;

  if (options.baseline) {
    const previous = JSON.parse(readFileSync(options.baseline, 'utf8'));
    const before = new Set(previous.findings.map(fingerprint));
    const after = new Set(findings.map(fingerprint));
    const suppressed = new Set(ignored.map(fingerprint));
    report.diff = {
      fixed: previous.findings.filter((f) => !after.has(fingerprint(f)) && !suppressed.has(fingerprint(f))).map((f) => ({ rule: f.rule, selector: f.selector, page: f.page })),
      suppressed: previous.findings.filter((f) => suppressed.has(fingerprint(f))).length,
      new: findings.filter((f) => !before.has(fingerprint(f))).map((f) => ({ rule: f.rule, selector: f.selector, page: f.page })),
      remaining: findings.filter((f) => before.has(fingerprint(f))).length,
    };
  }
  return report;
}

export function formatReport(report) {
  const lines = [];
  const titles = { normative_failure: 'Fails a standard', measured: 'Measured', candidate: 'Candidates, need a decision' };
  lines.push(`Scope: ${report.scope.pages.length} page(s) at ${report.scope.conditions.join(', ')}`);
  for (const evidence of ['normative_failure', 'measured', 'candidate']) {
    const items = report.findings.filter((f) => f.evidence === evidence);
    if (!items.length) continue;
    lines.push('', `${titles[evidence]} (${items.length})`);
    for (const f of items) {
      lines.push(`  ${f.rule}  ${f.page}`);
      lines.push(`    ${f.selector}`);
      lines.push(`    ${JSON.stringify(f.measurements)}`);
      lines.push(`    failed: ${f.conditions.failed.join(', ')}${f.conditions.passed.length ? ` | passed: ${f.conditions.passed.join(', ')}` : ''}`);
      lines.push(`    ${f.impact}`);
      if (f.question) lines.push(`    decide: ${f.question}`);
      lines.push(`    fix: ${f.fix_hint}`);
      if (f.artifact) lines.push(`    crop: ${f.artifact}`);
    }
  }
  if (!report.findings.length) lines.push('', 'No findings under the checks that ran. This does not mean the layout is good.');
  if (report.ignored.length) lines.push('', `Ignored with a reason: ${report.ignored.length}`);
  if (report.diff) lines.push('', `Against baseline: ${report.diff.fixed.length} fixed, ${report.diff.suppressed} suppressed, ${report.diff.new.length} new, ${report.diff.remaining} remaining`);
  if (report.errors.length) lines.push('', 'Errors:', ...report.errors.map((e) => `  ${e}`));
  lines.push('', `Not run: ${report.scope.not_run.join('; ')}`, report.calibration);
  return lines.join('\n');
}

export const DETECT_USAGE = `Usage: detect <url|file.html|dir> [...] [options]

  --json                Print the full report as JSON
  --out <file>          Also write the JSON report to a file
  --viewports <list>    Widths, comma-separated (default 320,768,1280)
  --dark                Add a prefers-color-scheme: dark pass
  --rtl                 Add a dir=rtl pass
  --long-text           Add a pass with text about 40% longer
  --artifacts <dir>     Save a crop of each finding
  --baseline <file>     Compare with an earlier JSON report
  --config <file>       Config path (default gestalt.config.json)
  --max-pages <n>       Page limit for a directory (default 20)
  --init <file.js>      Run before page scripts, e.g. to seed localStorage
  --setup <file.js>     Run after load, before measuring, e.g. to open a menu
                        (may use await). Both execute in the audited page.
  --fail-on <class>     Lowest class that exits 2: normative_failure, measured
                        or candidate (default candidate)
  --list-rules          List rules and their evidence class

Exit codes: 0 no findings, 2 findings, 1 scan error.
With --baseline, exit 2 means new findings appeared.`;

export async function runDetect(argv) {
  const options = {};
  const targets = [];
  let json = false;
  let out;
  let failOn = 'candidate';
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--json') json = true;
    else if (arg === '--dark') options.dark = true;
    else if (arg === '--rtl') options.rtl = true;
    else if (arg === '--long-text') options.longText = true;
    else if (arg === '--out') { out = argv[i += 1]; }
    else if (arg === '--viewports') { options.viewports = argv[i += 1].split(',').map(Number).filter(Boolean); }
    else if (arg === '--artifacts') { options.artifacts = argv[i += 1]; }
    else if (arg === '--baseline') { options.baseline = argv[i += 1]; }
    else if (arg === '--config') { options.config = argv[i += 1]; }
    else if (arg === '--max-pages') { options.maxPages = Number(argv[i += 1]); }
    else if (arg === '--init') { options.init = argv[i += 1]; }
    else if (arg === '--setup') { options.setup = argv[i += 1]; }
    else if (arg === '--fail-on') { failOn = argv[i += 1]; }
    else if (arg === '--help' || arg === '-h') { console.log(DETECT_USAGE); return 0; }
    else if (arg === '--list-rules') {
      for (const [rule, evidence, text] of RULES) console.log(`${rule.padEnd(44)} ${evidence.padEnd(20)} ${text}`);
      return 0;
    } else if (arg.startsWith('-')) { console.error(`Unknown option: ${arg}\n\n${DETECT_USAGE}`); return 1; }
    else targets.push(arg);
  }
  if (!targets.length) { console.error(DETECT_USAGE); return 1; }
  try {
    const report = await detect(targets, options);
    if (out) writeFileSync(out, JSON.stringify(report, null, 2));
    console.log(json ? JSON.stringify(report, null, 2) : formatReport(report));
    const scanned = report.scope.coverage.length > 0;
    if (!scanned) return 1;
    if (report.diff) return report.diff.new.length ? 2 : 0;
    const levels = ['normative_failure', 'measured', 'candidate'];
    const limit = levels.indexOf(failOn);
    if (limit < 0) { console.error(`Unknown --fail-on value: ${failOn}`); return 1; }
    return report.findings.some((f) => levels.indexOf(f.evidence) <= limit) ? 2 : 0;
  } catch (error) {
    console.error(`gestalt: ${error.message}`);
    return 1;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = await runDetect(process.argv.slice(2));
}
