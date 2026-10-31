// Runs inside the page. Evaluated as an expression: (function probe(cfg) {...})(cfg)
// Reports measured facts as findings. It never decides intent: every finding
// carries an evidence class and, where a person or model must decide, a question.
(function probe(cfg) {
  const T = cfg.thresholds;
  const findings = [];
  const CONTROL = 'input:not([type=hidden]),select,textarea';
  const MAX_ELEMENTS = 6000;
  const all = [...document.querySelectorAll('body *')].slice(0, MAX_ELEMENTS);
  const css = (el) => getComputedStyle(el);
  const round = (n, d = 1) => Math.round(n * 10 ** d) / 10 ** d;

  function visible(el) {
    const r = el.getBoundingClientRect();
    if (r.width <= 1 || r.height <= 1) return false;
    for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
      const s = css(e);
      if (s.display === 'none' || s.visibility === 'hidden' || Number(s.opacity) === 0) return false;
    }
    return true;
  }

  function selector(el) {
    if (el.id && /^[A-Za-z][\w-]*$/.test(el.id)) return `#${el.id}`;
    const parts = [];
    for (let e = el; e && e !== document.body && parts.length < 4; e = e.parentElement) {
      if (e.id && /^[A-Za-z][\w-]*$/.test(e.id)) { parts.unshift(`#${e.id}`); break; }
      let part = e.tagName.toLowerCase();
      const classes = [...e.classList].filter((c) => /^[A-Za-z][\w-]*$/.test(c)).slice(0, 2);
      if (classes.length) part += `.${classes.join('.')}`;
      const peers = e.parentElement ? [...e.parentElement.children].filter((c) => c.tagName === e.tagName) : [];
      if (peers.length > 1) part += `:nth-of-type(${peers.indexOf(e) + 1})`;
      parts.unshift(part);
    }
    return parts.join(' > ');
  }

  function pageRect(el) {
    const r = el.getBoundingClientRect();
    return { left: r.left + scrollX, right: r.right + scrollX, top: r.top + scrollY, bottom: r.bottom + scrollY, width: r.width, height: r.height };
  }

  // Text ink approximation: Range rects use the font's content area, not the
  // line box, so line-height does not inflate the gap.
  function textRect(el) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let box = null;
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (!n.textContent.trim()) continue;
      if (n.parentElement && n.parentElement.closest(CONTROL)) continue;
      const range = document.createRange();
      range.selectNodeContents(n);
      for (const r of range.getClientRects()) {
        if (!r.width || !r.height) continue;
        const b = { left: r.left + scrollX, right: r.right + scrollX, top: r.top + scrollY, bottom: r.bottom + scrollY };
        box = box
          ? { left: Math.min(box.left, b.left), right: Math.max(box.right, b.right), top: Math.min(box.top, b.top), bottom: Math.max(box.bottom, b.bottom) }
          : b;
      }
    }
    return box;
  }

  function edgeGap(a, b) {
    const dx = Math.max(0, Math.max(a.left, b.left) - Math.min(a.right, b.right));
    const dy = Math.max(0, Math.max(a.top, b.top) - Math.min(a.bottom, b.bottom));
    return Math.hypot(dx, dy);
  }

  const overlapX = (a, b) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > 0;
  const overlapY = (a, b) => Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 0;

  // Colours are normalised through a canvas so oklch(), color() and named
  // colours all come back as sRGB.
  const colorCtx = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 1;
    return c.getContext('2d', { willReadFrequently: true });
  })();
  const colorCache = new Map();
  function rgba(color) {
    if (colorCache.has(color)) return colorCache.get(color);
    colorCtx.clearRect(0, 0, 1, 1);
    colorCtx.fillStyle = '#000';
    colorCtx.fillStyle = color;
    colorCtx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = colorCtx.getImageData(0, 0, 1, 1).data;
    const out = { r, g, b, a: a / 255 };
    colorCache.set(color, out);
    return out;
  }
  const over = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  });
  const linear = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  const luminance = (c) => 0.2126 * linear(c.r) + 0.7152 * linear(c.g) + 0.0722 * linear(c.b);
  const contrast = (a, b) => {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };
  function oklab(c) {
    const [r, g, b] = [linear(c.r), linear(c.g), linear(c.b)];
    const l = Math.cbrt(0.4122 * r + 0.5363 * g + 0.0514 * b);
    const m = Math.cbrt(0.2119 * r + 0.6807 * g + 0.1074 * b);
    const s = Math.cbrt(0.0883 * r + 0.2817 * g + 0.6300 * b);
    return [0.2105 * l + 0.7936 * m - 0.0041 * s, 1.978 * l - 2.4286 * m + 0.4506 * s, 0.0259 * l + 0.7828 * m - 0.8087 * s];
  }

  function hasBorder(s) {
    return ['Top', 'Right', 'Bottom', 'Left'].every((side) => parseFloat(s[`border${side}Width`]) > 0 && s[`border${side}Style`] !== 'none' && rgba(s[`border${side}Color`]).a > 0.05);
  }
  const hasShadow = (s) => s.boxShadow && s.boxShadow !== 'none';
  const hasFill = (s) => rgba(s.backgroundColor).a > 0.05 || s.backgroundImage !== 'none';
  const isPainted = (el) => { const s = css(el); return hasBorder(s) || hasShadow(s) || hasFill(s); };

  function add(rule, el, evidence, principle, data) {
    findings.push({
      rule,
      selector: typeof el === 'string' ? el : selector(el),
      evidence,
      principle,
      rect: typeof el === 'string' ? null : pageRect(el),
      ...data,
    });
  }

  // ---------------------------------------------------------------- proximity
  function labels() {
    const controls = [...document.querySelectorAll(CONTROL)].filter(visible);
    for (const label of document.querySelectorAll('label')) {
      const control = label.control;
      if (!control || !visible(label) || !visible(control)) continue;
      const text = textRect(label);
      if (!text) continue;
      const box = pageRect(control);
      if (overlapX(text, box) && overlapY(text, box)) continue; // floating label
      const own = edgeGap(text, box);
      let other = Infinity;
      let nearest = null;
      for (const d of controls) {
        if (d === control) continue;
        const dBox = pageRect(d);
        if (!overlapX(text, dBox) && !overlapY(text, dBox)) continue; // different column and row
        const gap = edgeGap(text, dBox);
        if (gap < other) { other = gap; nearest = d; }
      }
      if (!nearest) continue;
      const nearestBox = pageRect(nearest);
      if (overlapY(text, box) && !overlapY(text, nearestBox)) continue; // inline label on its own row
      // A boundary around label + control that excludes the other control outranks spacing.
      let region = false;
      for (let e = control.parentElement; e && e !== document.body; e = e.parentElement) {
        if (!e.contains(label)) continue;
        if (e.contains(nearest)) break;
        if (hasBorder(css(e)) || hasFill(css(e))) region = true;
      }
      if (region) continue;
      const ratio = other / Math.max(own, 1);
      const m = { own_gap_px: round(own), other_gap_px: round(other), ratio: round(ratio, 2), nearest: selector(nearest), method: 'text-range' };
      if (ratio < 1) {
        add('proximity.label-closer-to-other', label, 'measured', 'proximity', {
          measurements: m,
          threshold: { value: 1, provenance: 'geometric fact' },
          impact: 'The label sits closer to another control than to its own, so it may be read as belonging to the wrong field.',
          fix_hint: 'Reduce the label-to-control gap and raise the gap between field groups, using a larger spacing token.',
        });
      } else if (ratio < T.labelAmbiguous) {
        add('proximity.label-ambiguous', label, 'candidate', 'proximity', {
          measurements: m,
          threshold: { value: T.labelAmbiguous, provenance: 'heuristic, uncalibrated' },
          question: 'Looking at this crop, is it instantly clear which control this label belongs to?',
          impact: 'The label is nearly equidistant between two controls.',
          fix_hint: 'Separate field groups with a larger gap than the label-to-control gap.',
        });
      }
    }
  }

  function headings() {
    for (const h of document.querySelectorAll('h1,h2,h3,h4,h5,h6')) {
      if (!visible(h)) continue;
      const prev = h.previousElementSibling;
      const next = h.nextElementSibling;
      if (!prev || !next || !visible(prev) || !visible(next)) continue;
      const hBox = textRect(h);
      if (!hBox) continue;
      const pBox = textRect(prev) || pageRect(prev);
      const nBox = textRect(next) || pageRect(next);
      const above = hBox.top - pBox.bottom;
      const below = nBox.top - hBox.bottom;
      if (above <= 0 || below <= 0 || !overlapX(hBox, pBox) || !overlapX(hBox, nBox)) continue;
      // An eyebrow directly above a heading is a tight group, not a floating heading.
      const eyebrow = (prev.textContent || '').trim().length < 40 && parseFloat(css(prev).fontSize) < parseFloat(css(h).fontSize);
      if (eyebrow) continue;
      if (below >= above) {
        add('proximity.heading-floats', h, below > above * 1.25 ? 'measured' : 'candidate', 'proximity', {
          measurements: { gap_above_px: round(above), gap_below_px: round(below), method: 'text-range' },
          threshold: { value: 1, provenance: 'geometric fact: below should be smaller than above' },
          question: 'Does this heading read as the title of what follows, or does it float between sections?',
          impact: 'The heading is at least as far from its content as from the previous section.',
          fix_hint: 'Make the space above the heading clearly larger than the space below it.',
        });
      }
    }
  }

  function tiers() {
    const seen = new Set();
    for (const parent of all) {
      const kids = [...parent.children].filter(visible);
      if (kids.length < 2) continue;
      const divided = (k) => ['Top', 'Bottom', 'Left', 'Right'].some((side) => parseFloat(css(k)[`border${side}Width`]) > 0 && css(k)[`border${side}Style`] !== 'none');
      const groups = kids.filter((k) => [...k.children].filter(visible).length >= 2 && !isPainted(k) && !divided(k));
      if (groups.length < 2 || groups.length !== kids.length) continue;
      const sig = (k) => `${k.tagName}.${k.className}`;
      if (new Set(groups.map(sig)).size > 1) continue;
      if (seen.has(parent)) continue;
      seen.add(parent);
      let within = 0;
      for (const g of groups) {
        const inner = [...g.children].filter(visible).map(pageRect).sort((a, b) => a.top - b.top);
        for (let i = 1; i < inner.length; i += 1) within = Math.max(within, inner[i].top - inner[i - 1].bottom);
      }
      let between = Infinity;
      // Content extents, not border boxes: padding is part of the visible gap.
      const boxes = groups.map((g) => [...g.children].filter(visible).map(pageRect).reduce((u, r) => ({
        left: Math.min(u.left, r.left), right: Math.max(u.right, r.right), top: Math.min(u.top, r.top), bottom: Math.max(u.bottom, r.bottom),
      })));
      for (let i = 0; i < boxes.length; i += 1) {
        for (let j = i + 1; j < boxes.length; j += 1) between = Math.min(between, edgeGap(boxes[i], boxes[j]));
      }
      if (within < T.tierMinWithinPx || !isFinite(between)) continue;
      const ratio = between / within;
      if (ratio >= T.tierClear) continue;
      add('proximity.group-tiers-blurred', parent, ratio < 1 ? 'measured' : 'candidate', 'proximity', {
        measurements: { within_max_px: round(within), between_min_px: round(between), ratio: round(ratio, 2), groups: groups.length },
        threshold: { value: T.tierClear, provenance: 'heuristic, uncalibrated' },
        question: 'Can you see where one repeated item ends and the next begins?',
        impact: ratio < 1 ? 'Items inside a group are further apart than the groups themselves.' : 'Repeated groups are barely separated from each other.',
        fix_hint: 'Raise the between-group gap by at least one visible token step, or add a single boundary per group.',
      });
    }
  }

  // --------------------------------------------------------------- similarity
  function nearDuplicates() {
    const families = new Map();
    const push = (key, el) => { if (!families.has(key)) families.set(key, []); families.get(key).push(el); };
    for (const el of all) {
      if (!visible(el)) continue;
      if (el.matches('button,[role=button],input[type=submit],input[type=button]')) {
        // Icon and text buttons, or toolbar and content buttons, are different roles.
        const label = (el.textContent || el.value || '').trim();
        const area = el.closest('header,nav,footer,aside,dialog,[role=toolbar]');
        push(`button:${label.length > 1 ? 'text' : 'icon'}:${area ? area.tagName : 'content'}`, el);
      }
      else if (el.matches('input:not([type=hidden],[type=checkbox],[type=radio],[type=submit],[type=button]),select,textarea')) push('field', el);
      else if (el.matches('h1,h2,h3,h4,h5,h6')) push(`heading:${el.tagName.toLowerCase()}`, el);
    }
    const lengthProps = ['borderTopLeftRadius', 'fontSize', 'paddingLeft', 'paddingTop', 'height'];
    for (const [family, els] of families) {
      if (els.length < 4) continue;
      for (const prop of lengthProps) {
        if (family.startsWith('heading') && prop !== 'fontSize') continue;
        const counts = new Map();
        for (const el of els) {
          const v = prop === 'height' ? round(el.getBoundingClientRect().height) : parseFloat(css(el)[prop]);
          if (!Number.isNaN(v)) { if (!counts.has(v)) counts.set(v, []); counts.get(v).push(el); }
        }
        const ranked = [...counts].sort((a, b) => b[1].length - a[1].length);
        if (ranked.length < 2) continue;
        const [domValue, domEls] = ranked[0];
        for (const [value, rare] of ranked.slice(1)) {
          const delta = Math.abs(value - domValue);
          if (delta === 0 || delta > T.nearLengthPx) continue;
          if (domEls.length < rare.length * 3 || domEls.length < 3) continue;
          add('similarity.near-duplicate-length', rare[0], 'candidate', 'similarity', {
            measurements: { family, property: prop, dominant: domValue, dominant_count: domEls.length, rare: value, rare_count: rare.length },
            threshold: { value: T.nearLengthPx, provenance: 'heuristic, uncalibrated' },
            question: 'Is this small difference a deliberate variant, or an accident?',
            impact: 'A near-identical value breaks a pattern without reading as a real difference.',
            fix_hint: `Use the dominant value (${domValue}px) unless this is a named variant.`,
          });
        }
      }
      if (family.startsWith('heading')) continue;
      const colors = new Map();
      for (const el of els) {
        const c = rgba(css(el).backgroundColor);
        if (c.a < 0.95) continue;
        const key = `${c.r},${c.g},${c.b}`;
        if (!colors.has(key)) colors.set(key, { c, els: [] });
        colors.get(key).els.push(el);
      }
      const ranked = [...colors.values()].sort((a, b) => b.els.length - a.els.length);
      if (ranked.length < 2) continue;
      const dom = ranked[0];
      const domLab = oklab(dom.c);
      for (const entry of ranked.slice(1)) {
        const lab = oklab(entry.c);
        const dist = Math.hypot(lab[0] - domLab[0], lab[1] - domLab[1], lab[2] - domLab[2]);
        if (dist > 0 && dist < T.nearColorOklab && dom.els.length >= entry.els.length * 3) {
          add('similarity.near-duplicate-color', entry.els[0], 'candidate', 'similarity', {
            measurements: { family, oklab_distance: round(dist, 3), dominant: `rgb(${dom.c.r},${dom.c.g},${dom.c.b})`, rare: `rgb(${entry.c.r},${entry.c.g},${entry.c.b})`, rare_count: entry.els.length },
            threshold: { value: T.nearColorOklab, provenance: 'heuristic, uncalibrated' },
            question: 'Is this almost-identical colour a deliberate state or variant?',
            impact: 'Two nearly identical fills read as one style applied inconsistently.',
            fix_hint: 'Point both at one colour token.',
          });
        }
      }
    }
  }

  // --------------------------------------------------------------- continuity
  function alignment() {
    const regions = document.querySelectorAll('main > *, section, form, article, header, footer');
    const reported = new Set();
    for (const region of regions) {
      if (!visible(region)) continue;
      if (css(region).textAlign === 'center') continue;
      const items = [...region.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,img,input,select,textarea,button,table,figure,blockquote')]
        .filter((el) => {
          if (!visible(el)) return false;
          const s = css(el);
          if (s.transform !== 'none' || s.display === 'inline' || s.textAlign === 'center') return false;
          const r = el.getBoundingClientRect();
          return r.width >= 32 && (!el.parentElement || css(el.parentElement).textAlign !== 'center');
        })
        .slice(0, 300);
      if (items.length < 4) continue;
      // Compare edges only inside one surface: a card's padding and the page
      // gutter are different lines, even when they land a pixel or two apart.
      const surfaces = new Map();
      for (const el of items) {
        let surface = region;
        for (let e = el.parentElement; e && e !== region; e = e.parentElement) {
          if (isPainted(e)) { surface = e; break; }
        }
        if (!surfaces.has(surface)) surfaces.set(surface, []);
        surfaces.get(surface).push(el);
      }
      for (const members of surfaces.values()) {
      const lines = new Map();
      for (const el of members) {
        const x = Math.round(pageRect(el).left);
        if (!lines.has(x)) lines.set(x, []);
        lines.get(x).push(el);
      }
      const anchors = [...lines].filter(([, els]) => els.length >= 3);
      for (const [x, els] of lines) {
        if (els.length >= 3) continue;
        const anchor = anchors.find(([a]) => Math.abs(a - x) >= 1 && Math.abs(a - x) <= T.alignNearPx);
        if (!anchor) continue;
        for (const el of els) {
          if (reported.has(el)) continue;
          reported.add(el);
          add('continuity.near-miss-alignment', el, 'candidate', 'continuity', {
            measurements: { edge: 'left', element_x: x, anchor_x: anchor[0], delta_px: Math.abs(anchor[0] - x), anchor_members: anchor[1].length },
            threshold: { value: T.alignNearPx, provenance: 'heuristic, uncalibrated' },
            question: 'Is this offset optical and intended, or a stray misalignment?',
            impact: 'An edge that almost lines up reads as a mistake rather than a decision.',
            fix_hint: 'Align to the shared edge, or move it clearly off the line.',
          });
        }
      }
      }
    }
  }

  // ------------------------------------------------------------ common region
  function nestedBoxes() {
    const isBox = (el) => {
      if (el.matches('input,select,textarea,button,a,img,svg,video,canvas,[role=button]')) return false;
      const s = css(el);
      return (hasBorder(s) || hasShadow(s)) && el.getBoundingClientRect().height > 40;
    };
    for (const el of all) {
      if (!visible(el) || !isBox(el)) continue;
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        if (!isBox(p) || !visible(p)) continue;
        const inner = el.getBoundingClientRect();
        const outer = p.getBoundingClientRect();
        if (inner.width / outer.width >= T.nestedWidthShare) {
          add('common-region.box-in-box', el, 'candidate', 'common-region', {
            measurements: { outer: selector(p), width_share: round(inner.width / outer.width, 2) },
            threshold: { value: T.nestedWidthShare, provenance: 'heuristic, uncalibrated' },
            question: 'Does the inner boundary add a grouping level the space cannot carry alone?',
            impact: 'A boundary inside a boundary adds noise without adding a level of meaning.',
            fix_hint: 'Remove the inner border or shadow; use space, a heading or a tonal change inside.',
          });
        }
        break;
      }
    }
  }

  function cueStacking() {
    let count = 0;
    for (const el of all) {
      if (count >= 10) break;
      if (!visible(el) || el.matches('input,select,textarea,button,a,[role=button]')) continue;
      const s = css(el);
      if (hasBorder(s) && hasShadow(s) && el.getBoundingClientRect().height > 40) {
        count += 1;
        add('pragnanz.cue-stacking', el, 'candidate', 'pragnanz', {
          measurements: { border: s.borderTopWidth, shadow: s.boxShadow.slice(0, 60) },
          threshold: { value: null, provenance: 'heuristic: one boundary cue per level' },
          question: 'Do border and shadow here carry different meanings, or do they repeat each other?',
          impact: 'Two boundary cues on one element say the same thing twice.',
          fix_hint: 'Keep the cue that the surface system already uses and drop the other.',
        });
      }
    }
  }

  // ------------------------------------------------------------ figure-ground
  function textElements() {
    const out = new Set();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n && out.size < 800; n = walker.nextNode()) {
      if (n.textContent.trim().length < 2) continue;
      const el = n.parentElement;
      if (!el || el.closest('script,style,noscript,[aria-hidden=true]')) continue;
      if (visible(el)) out.add(el);
    }
    return [...out];
  }

  function contrastCheck() {
    const groups = new Map();
    const reviewed = new Set();
    for (const el of textElements()) {
      if (el.closest(':disabled,[aria-disabled=true]')) continue;
      const s = css(el);
      const fg = rgba(s.color);
      if (fg.a === 0) continue;
      let bg = { r: 255, g: 255, b: 255, a: 1 };
      const layers = [];
      let complex = null;
      for (let e = el; e; e = e.parentElement) {
        const es = css(e);
        const layered = e.querySelector(':scope > img, :scope > picture, :scope > video');
        const covering = layered && ['absolute', 'fixed'].includes(css(layered).position);
        const pseudo = ['::before', '::after'].some((p) => {
          const ps = getComputedStyle(e, p);
          return ps.content !== 'none' && ps.backgroundImage !== 'none' && ['absolute', 'fixed'].includes(ps.position);
        });
        if (es.backgroundImage !== 'none' || covering || pseudo) { complex = e; break; }
        const c = rgba(es.backgroundColor);
        if (c.a > 0) layers.push(c);
        if (c.a === 1) break;
      }
      if (complex) {
        if (!reviewed.has(complex) && reviewed.size < 15) {
          reviewed.add(complex);
          add('figure-ground.text-over-complex-background', el, 'candidate', 'figure-ground', {
            measurements: { background_element: selector(complex) },
            threshold: { value: 4.5, provenance: 'WCAG 1.4.3, must be sampled per pixel' },
            question: 'Against the lightest part of this background, can the text be read easily?',
            impact: 'A gradient or image behind text cannot be checked from styles alone.',
            fix_hint: 'Add a scrim or solid plate, then sample the worst region.',
          });
        }
        continue;
      }
      for (const layer of layers.reverse()) bg = over(layer, bg);
      const ratio = contrast(over(fg, bg), bg);
      const size = parseFloat(s.fontSize);
      const large = size >= 24 || (size >= 18.66 && Number(s.fontWeight) >= 700);
      const need = large ? 3 : 4.5;
      if (ratio < need) {
        const key = `${s.color}|${bg.r},${bg.g},${bg.b}|${need}`;
        if (!groups.has(key)) groups.set(key, { el, ratio, need, count: 0, fg: s.color, bg: `rgb(${round(bg.r, 0)},${round(bg.g, 0)},${round(bg.b, 0)})` });
        groups.get(key).count += 1;
      }
    }
    for (const g of groups.values()) {
      add('figure-ground.contrast', g.el, 'normative_failure', 'figure-ground', {
        measurements: { ratio: round(g.ratio, 2), required: g.need, foreground: g.fg, background: g.bg, instances: g.count },
        threshold: { value: g.need, provenance: 'WCAG 2.2 SC 1.4.3 (AA)' },
        impact: 'Text does not separate from its ground at the AA minimum.',
        fix_hint: 'Change the token pair so the ratio meets the requirement in every theme.',
      });
    }
  }

  function occlusion() {
    const els = textElements().slice(0, 150);
    const sx = scrollX;
    const sy = scrollY;
    for (const el of els) {
      const r0 = el.getBoundingClientRect();
      if (r0.width < 8 || r0.height < 8) continue;
      window.scrollTo(0, Math.max(0, r0.top + scrollY - innerHeight / 3));
      const r = el.getBoundingClientRect();
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) continue;
      const top = document.elementFromPoint(x, y);
      if (!top || top === el || el.contains(top) || top.contains(el)) continue;
      let pinned = false;
      for (let e = top; e; e = e.parentElement) {
        const p = css(e).position;
        if (p === 'fixed' || p === 'sticky') { pinned = true; break; }
      }
      if (pinned) continue;
      if (!isPainted(top) && !top.matches('img,video,canvas,svg')) continue;
      add('figure-ground.text-occluded', el, 'measured', 'figure-ground', {
        measurements: { covered_by: selector(top) },
        threshold: { value: null, provenance: 'hit-test at the text centre' },
        impact: 'Another painted element sits on top of this text.',
        fix_hint: 'Fix the stacking or layout so text stays on top of its ground.',
      });
    }
    window.scrollTo(sx, sy);
  }

  // ------------------------------------------------------------------ closure
  function scrollCues() {
    for (const el of all) {
      if (!visible(el)) continue;
      const s = css(el);
      if (!['auto', 'scroll'].includes(s.overflowX) || el.scrollWidth <= el.clientWidth + 8) continue;
      if (el.offsetHeight - el.clientHeight > 0) continue; // visible scrollbar
      const box = el.getBoundingClientRect();
      const kids = [...el.children].filter(visible).map((k) => k.getBoundingClientRect());
      const crossed = kids.some((k) => k.left < box.right - T.peekMinPx && k.right > box.right + 1);
      if (crossed) continue;
      const near = 48;
      const hasControls = [...document.querySelectorAll('button,[role=button]')].some((c) => {
        if (el.contains(c) || !visible(c)) return false;
        const r = c.getBoundingClientRect();
        return r.right > box.left - near && r.left < box.right + near && r.bottom > box.top - near && r.top < box.bottom + near;
      });
      if (hasControls) continue;
      add('closure.scroll-no-cue', el, 'candidate', 'closure', {
        measurements: { client_width: el.clientWidth, scroll_width: el.scrollWidth },
        threshold: { value: T.peekMinPx, provenance: 'heuristic, uncalibrated' },
        question: 'Would a user notice that more content lies off to the side?',
        impact: 'Items end cleanly at the edge, so the row looks complete.',
        fix_hint: 'Let the next item peek past the edge, or add visible controls.',
      });
    }
  }

  function falseFloor() {
    const docH = document.documentElement.scrollHeight;
    if (docH < innerHeight * 1.2) return;
    window.scrollTo(0, 0);
    const y = innerHeight - 2;
    let straddled = false;
    for (let i = 1; i <= 7 && !straddled; i += 1) {
      for (const el of document.elementsFromPoint((innerWidth * i) / 8, y)) {
        if (el === document.body || el === document.documentElement) continue;
        const r = el.getBoundingClientRect();
        // Anything smaller than a page section that crosses the fold is a continuation cue.
        if (r.height > innerHeight * 1.2 || r.width >= innerWidth * 0.98) continue;
        if (r.top < y - T.peekMinPx && r.bottom > y + T.peekMinPx) { straddled = true; break; }
      }
    }
    if (!straddled) {
      add('closure.false-floor', 'body', 'candidate', 'closure', {
        measurements: { viewport_height: innerHeight, document_height: docH },
        threshold: { value: T.peekMinPx, provenance: 'heuristic, uncalibrated' },
        question: 'Does the first screen look finished, hiding that the page continues?',
        impact: 'No content crosses the fold, so the page may look complete.',
        fix_hint: 'Let content cross the fold; avoid strong lines or large gaps at that height.',
      });
    }
  }

  // ---------------------------------------------------------------- focal point
  function primaries() {
    const scopes = document.querySelectorAll('header,section,form,main > *,dialog');
    const reported = new Set();
    for (const scope of scopes) {
      if (!visible(scope)) continue;
      const counts = new Map();
      for (const b of scope.querySelectorAll('button,[role=button],a[class*=btn],a[class*=button],input[type=submit]')) {
        if (!visible(b) || b.closest('li,article,tr')) continue;
        const c = rgba(css(b).backgroundColor);
        if (c.a < 0.95) continue;
        const max = Math.max(c.r, c.g, c.b);
        const min = Math.min(c.r, c.g, c.b);
        if (max === 0 || (max - min) / max < 0.2) continue; // neutral fill
        const key = `${c.r},${c.g},${c.b}`;
        if (!counts.has(key)) counts.set(key, []);
        counts.get(key).push(b);
      }
      for (const [key, buttons] of counts) {
        if (buttons.length < 2 || reported.has(buttons[0])) continue;
        buttons.forEach((b) => reported.add(b));
        add('focal.competing-primaries', scope, 'candidate', 'focal-point', {
          measurements: { filled_buttons: buttons.length, fill: `rgb(${key})`, examples: buttons.slice(0, 3).map(selector) },
          threshold: { value: 2, provenance: 'design-system guidance (GOV.UK, M3), not a perceptual threshold' },
          question: 'Is there one clear next step here, or do these actions compete?',
          impact: 'Several actions share the strongest treatment, so none stands out.',
          fix_hint: 'Keep one primary and step the others down to a secondary style.',
        });
      }
    }
  }

  // ------------------------------------------------------------------ semantics
  function groupSemantics() {
    const names = new Map();
    for (const input of document.querySelectorAll('input[type=radio],input[type=checkbox]')) {
      if (!input.name || !visible(input)) continue;
      if (!names.has(input.name)) names.set(input.name, []);
      names.get(input.name).push(input);
    }
    for (const [name, inputs] of names) {
      if (inputs.length < 2) continue;
      if (inputs[0].closest('fieldset,[role=group],[role=radiogroup]')) continue;
      add('semantic.control-group-unmarked', inputs[0], 'candidate', 'semantic-parity', {
        measurements: { name, controls: inputs.length },
        threshold: { value: 2, provenance: 'WCAG technique H71, which is conditional' },
        question: 'Does each label make sense alone, without the question that groups them?',
        impact: 'The set looks grouped on screen, but assistive technology gets no group or question.',
        fix_hint: 'Wrap the set in fieldset and legend, or a labelled role=group or radiogroup.',
      });
    }
    for (const parent of document.querySelectorAll('header,footer')) {
      if (parent.querySelector('nav')) continue;
      const links = [...parent.querySelectorAll('a[href]')].filter(visible);
      if (links.length >= 3) {
        add('semantic.link-cluster-unmarked', parent, 'candidate', 'semantic-parity', {
          measurements: { links: links.length },
          threshold: { value: 3, provenance: 'heuristic, uncalibrated' },
          question: 'Is this group of links a navigation block?',
          impact: 'Links grouped on screen have no named navigation landmark.',
          fix_hint: 'Use nav with an aria-label, and a list when the set is a list.',
        });
      }
    }
  }

  function cssReorder() {
    const reportedParents = new Set();
    for (const el of all) {
      if (!visible(el)) continue;
      const s = css(el);
      const reversed = /reverse/.test(s.flexDirection) && s.display.includes('flex');
      const ordered = el.parentElement && css(el.parentElement).display.match(/flex|grid/) && s.order !== '0';
      if (!reversed && !ordered) continue;
      const target = reversed ? el : el.parentElement;
      if (reportedParents.has(target)) continue;
      reportedParents.add(target);
      if (!target.querySelector('a[href],button,input,select,textarea,[tabindex]')) continue;
      add('semantic.css-reorder', el, 'candidate', 'semantic-parity', {
        measurements: reversed ? { flex_direction: s.flexDirection } : { order: s.order, container: selector(target) },
        threshold: { value: null, provenance: 'WCAG 1.3.2, 2.4.3 and technique C27: allowed unless meaning changes' },
        question: 'Does the visual order still match the reading and focus order where it matters?',
        impact: 'CSS changes visual order without changing DOM order.',
        fix_hint: 'Reorder the DOM, or confirm that order does not affect meaning.',
      });
    }
  }

  function reflow() {
    if (innerWidth > 320) return;
    const root = document.documentElement;
    const scrolls = root.scrollWidth > root.clientWidth + 1;
    let widest = null;
    let right = 0;
    for (const el of all) {
      if (!visible(el) || el.closest('table,pre,code,[data-gestalt-2d]')) continue;
      let exempt = false;
      for (let e = el; e && e !== document.body; e = e.parentElement) {
        const es = css(e);
        if (['auto', 'scroll'].includes(es.overflowX) || es.position === 'fixed' || es.transform !== 'none') { exempt = true; break; }
      }
      if (exempt) continue;
      const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!scrolls && !hasText) continue; // when the page clips, only cut-off text counts
      const r = el.getBoundingClientRect();
      if (r.right > right && r.right > root.clientWidth + 1) { right = r.right; widest = el; }
    }
    if (!scrolls && !widest) return;
    add('structure.reflow-overflow', widest || 'html', 'candidate', 'structure', {
      measurements: { viewport: innerWidth, scroll_width: root.scrollWidth, overflow_right: round(right), behaviour: scrolls ? 'page scrolls sideways' : 'content clipped' },
      threshold: { value: 320, provenance: 'WCAG 2.2 SC 1.4.10 (AA); two-dimensional content is excepted' },
      question: 'Is this overflow caused by content allowed to scroll in two dimensions, such as a data table or map?',
      impact: scrolls ? 'The page scrolls sideways at 320 CSS px, which pulls groups apart.' : 'Content is cut off at 320 CSS px and cannot be reached.',
      fix_hint: 'Let the offending element wrap or shrink, and keep any scroll inside its own container.',
    });
  }

  const checks = { labels, headings, tiers, nearDuplicates, alignment, nestedBoxes, cueStacking, contrastCheck, scrollCues, falseFloor, primaries, groupSemantics, cssReorder, reflow, occlusion };
  const errors = [];
  for (const [name, check] of Object.entries(checks)) {
    try { check(); } catch (error) { errors.push(`${name}: ${error.message}`); }
  }
  return { findings, errors, title: document.title, truncated: document.querySelectorAll('body *').length > MAX_ELEMENTS };
})
