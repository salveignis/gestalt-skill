import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtempSync, existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { detect } from '../skills/gestalt/scripts/detect.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const bad = join(here, 'fixtures/bad.html');
const good = join(here, 'fixtures/good.html');
const cli = join(here, '../cli/bin/cli.mjs');
const run = promisify(execFile);

const badReport = await detect([bad], { viewports: [320, 1280] });
const rulesFired = new Set(badReport.findings.map((f) => f.rule));

const EXPECTED = [
  'proximity.label-closer-to-other',
  'proximity.heading-floats',
  'proximity.group-tiers-blurred',
  'similarity.near-duplicate-length',
  'continuity.near-miss-alignment',
  'figure-ground.contrast',
  'common-region.box-in-box',
  'pragnanz.cue-stacking',
  'closure.scroll-no-cue',
  'common-fate.reduced-motion-persists',
  'focal.competing-primaries',
  'semantic.control-group-unmarked',
  'semantic.link-cluster-unmarked',
  'semantic.css-reorder',
];

for (const rule of EXPECTED) {
  test(`bad fixture fires ${rule}`, () => assert.ok(rulesFired.has(rule), [...rulesFired].join('\n')));
}

test('reports no score and keeps measurements', () => {
  assert.equal(badReport.score, undefined);
  const label = badReport.findings.find((f) => f.rule === 'proximity.label-closer-to-other');
  assert.ok(label.measurements.ratio < 1);
  assert.ok(label.conditions.failed.length > 0);
});

test('conditions never repeat and only count where a rule ran', () => {
  for (const f of badReport.findings) {
    assert.equal(new Set(f.conditions.failed).size, f.conditions.failed.length, f.rule);
  }
  const motion = badReport.findings.find((f) => f.rule === 'common-fate.reduced-motion-persists');
  assert.deepEqual(motion.conditions.passed, []);
});

test('setup script changes what is measured', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'gestalt-setup-'));
  const setup = join(dir, 'setup.js');
  writeFileSync(setup, "document.querySelector('.low').style.color = '#111';");
  const report = await detect([bad], { viewports: [1280], setup });
  assert.ok(!report.findings.some((f) => f.rule === 'figure-ground.contrast'));
  rmSync(dir, { recursive: true, force: true });
});

test('probe checks run without internal errors', () => assert.deepEqual(badReport.errors, []));

test('good fixture stays free of proximity and semantic findings', async () => {
  const report = await detect([good], { viewports: [320, 1280] });
  assert.deepEqual(report.errors, []);
  const fired = report.findings.filter((f) => /^(proximity|semantic|figure-ground|similarity)\./.test(f.rule)).map((f) => `${f.rule} ${f.selector}`);
  assert.deepEqual(fired, []);
});

test('baseline diff reports fixed findings', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'gestalt-test-'));
  const baseline = join(dir, 'base.json');
  writeFileSync(baseline, JSON.stringify({ findings: [{ page: 'x', rule: 'a.b', selector: 'y' }] }));
  const report = await detect([good], { viewports: [1280], baseline });
  assert.equal(report.diff.fixed.length, 1);
  rmSync(dir, { recursive: true, force: true });
});

test('cli installs, refuses unmanaged overwrite and uninstalls', async () => {
  const cwd = mkdtempSync(join(tmpdir(), 'gestalt-cli-'));
  await run('node', [cli, 'install', '--providers=claude,codex'], { cwd });
  const marker = join(cwd, '.claude/skills/gestalt/.gestalt-install.json');
  assert.ok(existsSync(marker));
  assert.ok(existsSync(join(cwd, '.agents/skills/gestalt/SKILL.md')));
  assert.ok(JSON.parse(readFileSync(marker, 'utf8')).version);
  rmSync(marker);
  await assert.rejects(run('node', [cli, 'install', '--providers=claude'], { cwd }));
  await run('node', [cli, 'install', '--providers=claude', '--force'], { cwd });
  await run('node', [cli, 'uninstall'], { cwd });
  assert.ok(!existsSync(join(cwd, '.claude/skills/gestalt')));
  rmSync(cwd, { recursive: true, force: true });
});

test('terminal audit points to the agent', async () => {
  await assert.rejects(run('node', [cli, 'audit']), /runs inside your agent/);
});
