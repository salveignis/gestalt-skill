# Automated and semi-automated detection of Gestalt violations in web pages

Evidence labels used throughout:
- **[VALIDATED]**: measured in a published study. The study's population and task are stated, because most of them are not web pages.
- **[NORMATIVE]**: set by a standard. This is a compliance fact, not proof of a perceptual effect.
- **[TOOL]**: what a tool does according to its documentation or its output.
- **[HEURISTIC]**: an engineering choice made in these notes. It has no empirical provenance and must be calibrated.

Source-reading limits: Block-o-Matic evaluation page returned a bot block; two PDFs (AIM poster, Koch paper) could not be read in full; impeccable's rule logic ships in a compiled binary, so only its catalog and docs were read. See Gaps under each question.

## Which violations can be detected by which channel?

### Takeaway
Browser measurement can reliably establish geometric and style *facts*, but it cannot establish that a fact is a Gestalt *violation*, because that needs intent. The engine should separate measured fact, heuristic candidate and judged finding, and never promote a candidate to a violation without a judgment step.

### Cited Findings
- Image-only perceptual grouping reached F1 0.593 on Android screenshots and 0.783 on 20 Figma prototypes; using runtime metadata for widgets raised app-screenshot F1 to 0.672 at the same matching tolerance [VALIDATED, mobile, not web] — [Xie et al. 2022](https://ar5iv.labs.arxiv.org/html/2206.10352)
- The same paper reports that runtime metadata includes occluded or hidden widgets, which produced completely wrong groupings in some cases, and that some perceptually acceptable groupings were scored as wrong — [Xie et al. 2022](https://ar5iv.labs.arxiv.org/html/2206.10352)
- GPT-4 feedback on mockups, compared with 12 experts on 12 UIs: precision 0.603 vs 0.829, recall 0.380 vs 0.336, F1 0.466 vs 0.478. Semantic Grouping had the lowest average accuracy of its guideline categories [VALIDATED, mockups] — [Generating Automatic Feedback on UI Mockups](https://arxiv.org/html/2403.13139)
- Human agreement is itself weak: Fleiss' kappa 0.112 for accuracy of feedback in that study — [same study](https://arxiv.org/html/2403.13139); 0.29 to 0.31 for critique quality scoring in UICrit — [UICrit](https://arxiv.org/html/2407.08850v3)
- Human critiques scored 0.75 against 0.48 for the best LLM setup, and experts preferred human sets 81% of the time [VALIDATED, mobile screens] — [UICrit](https://arxiv.org/html/2407.08850v3)
- Combining source-level pattern rules with rendered-page rules is an existing production split: impeccable applies pattern rules to JSX/TSX and needs a URL for rendered rules such as low contrast and tiny text [TOOL] — [impeccable README](https://github.com/pbakaus/impeccable)

### Inferences
Capability matrix. All "false-positive risks" are reasoned from mechanism unless linked in later sections.

| Violation | DOM/computed/geometry | Static code | Screenshot | Human or LLM | Main false-positive risks | Maximum claim |
|---|---|---|---|---|---|---|
| Ambiguous label spacing | Strong, association is known from `for`/`aria-labelledby` | Finds association only | Confirms ink gap | Only for unassociated labels | Line-height inflates gaps; inline labels; dense tables | Measured geometry, candidate violation |
| Proximity contradicts structure | Medium, group tree vs DOM/AX | Weak | Medium, detection errors | Needed to confirm | Wrapper divs; several valid groupings; card grids | Candidate |
| Style near-duplicates | Strong for rendered default state | Strong for declared values, blind to usage | Weak | Decide intent | Semantic variants; state; theme; opacity layering | Measured, intent unknown |
| Inconsistent buttons/links | Medium, role-scoped | Medium | Weak | Primary vs secondary hierarchy | Deliberate hierarchy; third-party widgets | Candidate |
| Alignment near-miss | Strong | None | Optical check | Optical intent | Sub-pixels, optical adjustments, centered items, transforms | Candidate |
| Figure-ground, solid colors | Strong through axe | Weak | Not needed | No | Disabled controls, decorative text | Normative failure |
| Text over image or gradient | Weak alone (axe says needs review) | None | Strong | Sometimes | Carousels, video, lazy images, animation frame | Measured sample |
| Occlusion | Strong with sampling | None | Confirms | Rarely | Intentional overlap, sticky headers, modals | Measured fact, intent often clear |
| Common fate | Medium, WAAPI capture | Medium (durations, easing inventory) | Video only | Yes | Staggers, JS-driven animation unseen | Candidate |
| Reduced-motion handling | Strong, diff between modes | Medium | Video helps | Essentiality | Essential motion, opacity fades left on purpose | Measured difference |
| Tab order vs visual order | Strong measurement; ambiguous reference | Partial (`tabindex`, `order`) | No | Reading-order judgment | Multi-column, RTL, sidebars | Candidate, serious if inversion is local |
| Missing group semantics | Medium, AX tree | Medium (`wcag/h71`) | No | Need for group description | H71 is not always required | Candidate |
| Closure, continuity, figure-ground meaning, hierarchy, "belonging" | Very weak | None | Weak | Required | Not applicable, no defensible metric | Judged only, labelled as opinion |

Routing rule: LLM judgment should receive one bounded question, the crop with overlay, and the measured numbers. It should not free-form discover Gestalt issues as a primary detector, because grouping was its weakest area above, and of 100 distinct violations in that study 62 were found by humans only, 29 by both and 9 by GPT-4 only ([same study](https://arxiv.org/html/2403.13139)).

### Gaps
- I found no study validating any automated Gestalt detector on real web pages against human perception of violations. Everything found measures group inference or general critique, mostly on mobile or mockups.
- I found no paper benchmarking LLMs on perceptual grouping against Gestalt human judgments. The closest is [UI-Vision's layout grounding task](https://arxiv.org/pdf/2503.15661), which is desktop GUI and was seen only as a search snippet.

## How can a perceptual-group tree be computed and compared with the DOM/semantic tree?

### Takeaway
Use DOM geometry for primitives and a transparent recursive clustering for the tree, then borrow Xie's connectedness, similarity, proximity and continuity sequence. Treat a tree mismatch as a *lead* rather than a violation, and report only when perception crosses a meaningful semantic boundary.

### Cited Findings
- Xie et al. was published at ESEC/FSE 2022, not UIST 2022 as the brief assumed — [FSE 2022 listing](https://2022.esec-fse.org/details/fse-2022-research-papers/60/Psychologically-Inspired-Unsupervised-Inference-of-Perceptual-Groups-of-GUI-Widgets-)
- Its pipeline: enhanced UIED detection; connectedness finds rectangular containers; DBSCAN similarity passes cluster non-text by center X, center Y and area, and text by top and left; proximity pairs adjacent groups of same orientation and count; continuity repairs missing or misclassified widgets — [Xie et al. 2022](https://ar5iv.labs.arxiv.org/html/2206.10352)
- The paper does not report DBSCAN eps or minPts. Its merge threshold (count difference below 4) was set empirically from the same ground truth used in evaluation — [Xie et al. 2022](https://ar5iv.labs.arxiv.org/html/2206.10352)
- Widget detection alone reached only precision 0.580, recall 0.680, F1 0.626 at IoU above 0.9 — [Xie et al. 2022](https://ar5iv.labs.arxiv.org/html/2206.10352)
- Baseline Screen Recognition reached F1 0.092 on detected widgets for app screenshots — [Xie et al. 2022](https://ar5iv.labs.arxiv.org/html/2206.10352)
- The implementation is public and builds on UIED; the repository also describes using grouping to flag elements that align with a group but are excluded from it — [gui-perceptual-grouping](https://github.com/mulongxie/gui-perceptual-grouping)
- Koch and Oulasvirta (CHI 2016 extended abstract) is preliminary work that treats Gestalt laws as parsing heuristics and outputs a hierarchical grouping — [researchr](https://researchr.org/publication/KochO16); a later paper describes it as implementing four Gestalt laws for web page design — [Reverse-Engineering Information Presentations](https://ar5iv.labs.arxiv.org/html/2201.05194)
- VIPS (2003) is a top-down segmentation that assigns each hierarchy node a Degree of Coherence based on visual perception — [MSR-TR-2003-79](https://microsoft.com/en-us/research/wp-content/uploads/2016/02/tr-2003-79.pdf). Evidence cited for it concerned pseudo-relevance feedback, an information-retrieval task, not perceived grouping — [search summary of Yu et al.](https://liner.com/review/improving-pseudorelevance-feedback-in-web-information-retrieval-using-web-page)
- A segmentation evaluation of BOM, Block Fusion, VIPS and JVIPS suggests relative quality depends on page category (known from a search snippet only) — [HAL](https://hal.archives-ouvertes.fr/hal-01500681)
- CDP `Accessibility.getFullAXTree` is experimental, includes ignored nodes and returns a flat `nodes` array — [CDP mirror](https://cdpstatus.reactnative.dev/devtools-protocol/tot/Accessibility); [playwright-cdp](https://docs.rs/playwright-cdp/0.3.0/playwright_cdp/accessibility/)

### Inferences
Pseudo-code, all parameters [HEURISTIC]:

```text
primitives = visible text fragments (Range.getClientRects per text node)
           + replaced media + form controls + painted boxes (background/border/shadow)
filter: display, visibility, opacity 0, zero area, clipped, aria-hidden mismatch noted,
        occluded per elementsFromPoint sampling        # Xie's metadata failure mode

tree(R):                                                 # XY-cut, then local clustering
  if R has painted container children: split by containers first   # common region wins
  find largest whitespace cuts on X and Y
  scale = median line height or local font size in R
  gaps = sorted cut sizes / scale
  if a clear break exists in gaps: split by larger class, recurse
  else: agglomerative single-link on edge distance, stop at largest relative jump
  record each split: gap sizes, break strength, cue used

compare(perceptual, semantic):
  for each perceptual group G:
    a = lowest common ancestor among G's DOM nodes
    flag only if G crosses: <form>, <fieldset>, landmark, heading section, list, table row, card
    or a semantic unit is split across visually separated groups
  store as lead + overlay, never as a score
```

- Choose edge-to-edge distance rather than center distance, since card and text sizes vary widely.
- XY-cut suits orthogonal web layouts; DBSCAN suits repeated items; agglomerative suits hierarchy. Start with XY-cut plus local agglomerative, because each decision can be explained in a report. Global eps in DBSCAN is fragile across varied density, and Xie gives no values to reuse.
- Do not port UIED to live pages as the main path. A browser already offers exact primitives, and Xie's detection error rate would become false findings. Keep pixel analysis for canvas, images with text and verification.
- Report grouping alternatives. If two parses are close in break strength, the layout is ambiguous or both are valid, and the engine should not choose silently.

### Gaps
- "GUI Gestalt" as a named tool: I found no such work. The closest result is Xie's repository.
- Block-o-Matic evaluation details: the HAL page returned an access block, so author, ground truth and numbers are unverified.
- Koch and Oulasvirta's algorithm: only abstract-level information was retrieved. Graph-cut use could not be confirmed. Do not cite it as a graph-cut method.
- I found no newer web-specific perceptual-group inference with human validation; one general search does not prove none exists.
- `getBoundingClientRect` and `Range.getClientRects` behavior comes from prior knowledge, not fetched in this session.

## How should ambiguous spacing be measured, and is any threshold defensible?

### Takeaway
A relative in-group versus between-group gap comparison has psychophysical support in form, but I found no empirically grounded UI threshold. Ship a graded ratio, publish its default as a heuristic, and use known label-control association to make the strongest case.

### Cited Findings
- The Pure Distance Law states that grouping probability in dot lattices depends only on the relative inter-dot distance between competing organizations [VALIDATED, dot lattices] — [Kubovy et al. 1998 summary](https://www.bohrium.com/en/paper-details/on-the-lawfulness-of-grouping-by-proximity/812454929091264514-11891); [full text location](https://lirias.kuleuven.be/retrieve/93542)
- Perceptual organization of dot lattices is described as multistable and probabilistic competition rather than a fixed switch — [Kubovy and Wagemans 1995 record](https://bvbvf1.bib-bvb.de/vufind/PrimoRecord/cdi_proquest_journals_195579134)
- A later summary notes limits of the pure distance account regarding global and configural properties. This came through a search summary, and the exact citing page was not confirmed; [PMC8142711](https://pmc.ncbi.nlm.nih.gov/articles/PMC8142711) is a candidate
- The impeccable catalog's `monotonous-spacing` rule identifies same-value spacing as a problem and recommends tight groupings and generous section separations; the catalog gives no empirical source [TOOL] — local `impeccable detect --list-rules` output, [installed skill](https://github.com/pbakaus/impeccable)

### Inferences
- What transfers from lattices is the *form* (use relative gaps, expect a gradient). What does not transfer is a number: UI elements differ in size, color, enclosure and text, and these cues interact.
- Label test, the highest-confidence spacing check, because the DOM gives intent:

```text
for label L with associated control C:
  own   = edge gap(L ink box, C)
  other = min edge gap(L ink box, any other control D in the same flow axis)
  ratio = other / max(own, 1)
  ratio < 1.0              -> measured: label is closer to another control    [high confidence]
  1.0 <= ratio < 1.5       -> ambiguous candidate                             [HEURISTIC default]
  ratio >= 1.5             -> no finding
  suppress if: a border/card encloses L and C but not D; label is inline-left with baseline alignment;
               visually hidden; floating-label pattern; D is in a different column
```

- General test: in a repeated group, `between_min / within_max` near 1 indicates no separation. Emit the ratio and the bucket. Suggested buckets [HEURISTIC]: below 1 inverted, 1 to 1.25 no clear separation, 1.25 to 2 weak, above 2 clear. They are starting points to calibrate, not research results. Do not write "research shows 1.5x".
- Gap measurement must use ink where feasible. Line boxes include half-leading, so `line-height: 2` can invert a verdict. A screenshot-trimmed ink box, or font metric correction, reduces this.
- Common region, connectors, color and alignment can override proximity. A proximity finding needs a check that no stronger explicit cue is present.
- Calibration: collect 200 or more labelled crops from the target domain and pick the cut that reaches an agreed precision. Report the corpus with the threshold.

### Gaps
- I found no controlled study deriving a label-to-field or group-gap ratio for web forms. Numbers such as "2x" common in design advice were not traced to evidence in this research.
- The exact Kubovy attraction function was not retrieved.

## How can similarity violations and near-duplicate tokens be detected?

### Takeaway
Pair static inventories, which show what is declared, with computed-style clustering scoped by role, which shows what renders. These can prove near-duplication exists, but not whether it is unintended.

### Cited Findings
- Project Wallace's `css-analyzer` provides 200+ metrics with total, unique and uniqueness ratio counts for colors, font sizes, line heights, radii, shadows, animation durations and easing. It takes a CSS string, so it is static [TOOL] — [css-analyzer](https://github.com/projectwallace/css-analyzer)
- `stylelint-declaration-strict-value` requires chosen properties to use a variable, function or keyword rather than a raw value [TOOL] — [npm](https://npmjs.com/package/stylelint-declaration-strict-value)
- Adoption caveat: Wagtail's config comments out parts of this rule until the team is ready — [config mirror](https://www.github.com/Imshk/wagtail/blob/main/.stylelintrc.js)
- impeccable has advisory `design-system-color`, `design-system-radius` and `design-system-font-size` rules, plus a non-advisory `design-system-font`, driven by local DESIGN.md context [TOOL] — local rule catalog and [`detect --help`](https://github.com/pbakaus/impeccable)

### Inferences
```text
for each rendered element: role = AX role or tag family + text/icon + size class
signature = {fg, bg, border, font-size, weight, family, radius, padding-x, padding-y, height}
for role-group:
  value clusters per property (colors in OKLab; lengths in px)
  near-duplicate = distinct values with small distance and very unequal frequency
  e.g. colors within small OKLab distance; lengths differing 1–2 px      [HEURISTIC]
  finding = rare value + dominant value + count + selectors + example crops
```

- Prioritize asymmetry: 42 buttons at 8px radius and 2 at 7px is a stronger lead than 20 and 20, which may be two deliberate variants.
- Compare within role and region, because a tag at 14px and a body text at 15px are not competing.
- Capture states. Hover, focus and disabled are invisible in a default computed-style pass; forcing pseudo-states or real interaction is needed.
- False-positive sources: alpha compositing that creates apparent new colors; `rem` and fluid `clamp()` values generating viewport-specific lengths; anti-aliasing in screenshots; third-party embeds; theme variants; dynamic data colors; primary and secondary hierarchy.
- Static-only failures: dead CSS inflates uniqueness; CSS-in-JS and utility classes need the built output. Computed-only failures: only rendered routes are covered. Use both and record coverage.
- Do not treat uniqueness ratio as a quality score. It has no validated good value in the sources read.

### Gaps
- CSS Stats: the repository page gave only a one-line description, so its metrics were not verified.
- Style Dictionary: not researched in this session. From general knowledge it is a token transformation tool rather than an auditor, which needs verification.
- I found no published threshold for "almost the same" tokens.

## How can near-miss alignment be detected, and what do grid metrics offer?

### Takeaway
Near-miss detection is straightforward to measure, and false positives are the real engineering problem. I found no validated 1 to 4 px threshold. AIM provides computational layout metrics, but they serve as descriptive signals rather than pass or fail evidence.

### Cited Findings
- AIM is an online service and open codebase for GUI evaluation that accepts a URL or screenshot and offers 17 metrics in its original description, ranging from visual clutter to visual learnability — [AIM record](https://aaltodoc.aalto.fi/items/a5da620f-fcbc-4e88-b0f4-e4143fc7147f); [AIM repo](https://github.com/aalto-ui/aim)
- Per the search summary of the poster, its grid quality metric measures alignment to grids and is implemented in MATLAB — [AIM poster](https://acris.aalto.fi/ws/portalfiles/portal/30261274/ELEC_oulasvirta_et_al_2018_002_.pdf)
- AIM's repository warns that some metrics are very CPU intensive and some need large model files through Git LFS — [AIM repo](https://github.com/aalto-ui/aim)
- GPT-4 did well on numerical consistency checks such as alignment and size in one study's account, suggesting that measurement can be supplied or checked deterministically — [mockup feedback study, search summary](https://arxiv.org/pdf/2403.13139)

### Inferences
```text
edges = for each visible primitive: left, right, top, bottom, center-x, center-y, text baseline
round to device pixels; ignore differences below 1 device px
within a region (same container or section):
  cluster each edge type into alignment lines
  anchor = line with >= 3 members
  near-miss = element edge within 1–4 CSS px of an anchor, not on it      [HEURISTIC range]
report: element, anchor members, delta, viewport count, overlay
```

- Promote confidence when the same delta persists across viewports and the anchor has many members. A one-off delta in one viewport may be sub-pixel rounding.
- Suppress: transformed or animating elements, optical icon adjustments, center-aligned items checked only on left edge, text boxes whose side bearing differs from glyph ink, negative-margin bleed, inline text flow, scrollbars, and different containers that only coincidentally approach alignment.
- Use a grid-fit descriptor: share of edges explained by the top k alignment lines. Report it per region and viewport, with no pass mark. Compare it only with the same product over time.
- Do not ship AIM as a dependency initially, given its setup weight. Reimplement only what is understood, after reading the metric source.

### Gaps
- AIM's current metric list, grid formula and validation data: the poster PDF could not be parsed and the repo page does not list metrics.
- Figma plugins and visual-linting tools for alignment were not investigated in the time available. I can make no claims about them.
- I found no empirical just-noticeable-difference study for web-element edge misalignment that would justify 1 to 4 px.

## How should figure-ground problems be measured?

### Takeaway
Run axe first and treat its needs-review results as a work queue, not as passes. Use pixel sampling for text over images, gradients and overlap. WCAG 2 remains the compliance reference, while APCA should be a clearly separate advisory reading.

### Cited Findings
- axe `color-contrast` is a WCAG 2 AA rule that can yield failure or needs review; `color-contrast-enhanced` is AAA and disabled by default [TOOL] — [axe rule descriptions](https://raw.githubusercontent.com/dequelabs/axe-core/develop/doc/rule-descriptions.md)
- Incomplete results carry message keys such as `bgImage`, `bgOverlap` and `bgGradient` — [Rocket Validator](https://rocketvalidator.com/accessibility-validation/axe/4.12/color-contrast.md); [axe locale file](https://app.unpkg.com/axe-core@4.11.2/files/locales/nl.json)
- axe contributors chose not to model gradients or semi-transparent backgrounds as ranges and pointed toward screenshot-based testing — [axe issue 708](https://github.com/dequelabs/axe-core/issues/708)
- False positives have also been reported around `clip` and `opacity` — [axe issue 1987](https://github.com/dequelabs/axe-core/issues/1987)
- impeccable's rule text states 4.5:1 for body and 3:1 for large text, and has a separate `text-occlusion` rule for text painted under an opaque element or another text run [NORMATIVE threshold, TOOL rule] — local rule catalog, [installed skill](https://github.com/pbakaus/impeccable)
- `document.elementsFromPoint` returns boxes topmost to bottommost and uses viewport-relative coordinates — [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/elementsFromPoint)
- APCA is a WCAG 3 candidate rather than a normative requirement, and secondary sources give conflicting Lc thresholds (seen through a search summary, so each number was not matched to a page) — [APCA introduction](https://github.com/Myndex/apca-introduction); [WCAG 3 preview article](https://nexasphere.io/library/wcag-3-0-preview-for-designers); [developer-tool threshold page](https://mintlify.com/drzkn/AccessibilityHub/resources/contrast-thresholds)

### Inferences
```text
text over complex background:
  1. capture region with text
  2. re-render same frame with text color transparent; capture background plate
  3. for pixels under glyph box: compute contrast of text color against each background pixel
  4. report p5 / median / worst contrast and share below the WCAG threshold
  5. pause animation and wait for images and fonts before both captures

occlusion:
  for each text rect: scroll into view, sample a 3x3 point grid
    stack = elementsFromPoint(p)
    if the top non-descendant painted element covers the text: occlusion candidate
  allow: known dialog state, sticky header (rescroll and retest), intended overlay ancestor
```

- Distinguish layers of outcome: axe failure (normative), axe needs review followed by pixel measurement (measured sample), and scrim judgment (LLM or human when legibility depends on a busy image rather than ratio).
- Ratios cannot express image busyness. Add local luminance variance under text as a descriptor, without a pass mark.
- Sampling must use real geometry. Transformed overlays and `pointer-events: none` layers may need independent pixel confirmation, since hit testing can skip non-hit-testable overlays. This behavior comes from prior knowledge because the MDN page is silent.
- Dark mode needs a separate pass. Passing in light says nothing about dark.

### Gaps
- Full axe contrast source and complete message-key list were not read.
- Current WCAG 3 draft contrast text was not read. Use no Lc threshold as a pass mark until this is checked.

## How can common fate and motion be audited?

### Takeaway
`getAnimations()` captures CSS and WAAPI animations only when they are in effect, so triggers must be driven. Reduced-motion can be tested by behavioral diff. A "common fate violation" stays a candidate unless a person or LLM confirms that the elements belong together.

### Cited Findings
- `document.getAnimations()` returns an array of Animation objects currently in effect, including CSS Animations, CSS Transitions and Web Animations — [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/getAnimations)
- Playwright `page.emulateMedia` supports `reducedMotion` of `reduce`, `no-preference` or null — [Playwright Page API](https://playwright.dev/docs/api/class-page)
- Wallace reports static animation durations and easing inventories [TOOL] — [css-analyzer](https://github.com/projectwallace/css-analyzer)
- impeccable's audit guidance states that a global `0.01ms` motion kill can destroy useful feedback, and that reduced motion needs an intentional alternative [TOOL opinion] — [audit.md](https://github.com/pbakaus/impeccable)

### Inferences
```text
for mode in [no-preference, reduce]:
  emulateMedia({reducedMotion: mode}); load
  trigger = load, scroll steps, hover/focus on interactive, open/close disclosures
  after each trigger, poll getAnimations() at short intervals with getTiming(), target, keyframes
  record: target, property, duration, delay, easing, iterations, trigger

common-fate candidates, among elements in the same perceptual group and trigger:
  mismatched duration or easing without a stagger pattern
  a member that does not animate while its peers do
  stagger = delays forming a regular progression -> do not flag

reduced-motion diff:
  infinite or large translate/scale motion persisting -> measured candidate
  all feedback removed with state change invisible -> candidate
```

- Polling can miss brief animations, so also inspect `transitionrun` and `animationstart` events.
- rAF, GSAP, canvas, WebGL and video will likely be invisible to this API. Screenshot diffing or instrumentation is needed, and the report should state this coverage gap. This limit is reasoned from API scope, not sourced.
- Static presence of `prefers-reduced-motion` proves little. Behavior is the test.
- Motion thresholds are not established here: no duration or easing should be reported as "wrong" based only on these sources.

### Gaps
- I found no empirical work validating an automated common-fate violation metric for web UI.
- Scroll-driven animations and View Transitions capture was not checked.
- MDN does not explicitly document `getAnimations()` shadow-root coverage.

## How can semantic versus visual mismatches be detected?

### Takeaway
Actual Tab traversal can be compared with computed visual order, filling a gap that major tools leave to manual checks. Grouping semantics are a candidate check only, because WCAG's fieldset technique is conditional.

### Cited Findings
- Lighthouse lists logical tab order under Manual checks and tells testers to tab through — [Chrome docs](https://developer.chrome.com/docs/lighthouse/accessibility/logical-tab-order)
- WCAG Technique C27 uses a manual comparison of visual order and DOM order, relating to 1.3.2 and 2.4.3 — [W3C C27](https://www.w3.org/WAI/WCAG21/Techniques/css/C27.html)
- axe's `focus-order-semantics` is experimental, disabled by default and concerns whether focusable elements have suitable roles; the rule list shows no rule specifically for fieldset or radiogroup grouping [TOOL] — [axe rule descriptions](https://raw.githubusercontent.com/dequelabs/axe-core/develop/doc/rule-descriptions.md)
- `label-content-name-mismatch` and `heading-order` are available, with `target-size` disabled by default in the list read — [axe rule descriptions](https://raw.githubusercontent.com/dequelabs/axe-core/develop/doc/rule-descriptions.md)
- `tabindex`, flex `order`, `row-reverse`, grid areas and absolute positioning are common causes of mismatch — [W3C C27](https://www.w3.org/WAI/WCAG21/Techniques/css/C27.html); [Evinced](https://knowledge.evinced.com/system-validations/tab-order); [getwcag](https://getwcag.com/en/accessibility-guide/focus-order-semantics)
- Commercial precedent exists: AudioEye has a focus-order mismatch rule — [AudioEye](https://developer.audioeye.com/rules/Element_FocusOrder_MisMatch)
- H71 does not require a fieldset when each control's label is already clear — [W3C H71](https://www.w3.org/WAI/WCAG21/Techniques/html/H71)
- html-validate provides static rules including `wcag/h71`, `input-missing-label`, `aria-label-misuse` and `heading-level` — [html-validate](https://html-validate.org/rules/index.html)

### Inferences
```text
tabPath = []
focus body; repeat press Tab until cycle or limit:
  el = document.activeElement (descend into shadow roots)
  tabPath.push(el, rect, focus-visible style difference)
visualOrder = sort(tabPath, by region, then row band, then inline direction)  # RTL aware
report: inversion pairs, Kendall tau as descriptive, large jumps, overlay with numbered path
```

- Report local inversions, such as in a form or toolbar, as high priority. A global statistic is hard to interpret across multi-column layouts, because there may be multiple valid visual orders.
- Use real Tab presses: DOM order misses `tabindex`, focus management and inert behavior.
- Group semantics check: a visual cluster of radios, checkboxes or related inputs with no fieldset, `role=group` or `radiogroup` becomes a candidate. An LLM or human decides whether a group description is needed, in line with H71.
- AX comparison: flag only names missing, roles contradicting appearance (e.g. a link styled as a button is a judgment case, not a fault), and control grouping lost. Parent-child differences are often just tree pruning.
- Separate 'fails standard' from 'perceptual mismatch' in the report.

### Gaps
- Pa11y was not investigated; it was not verified beyond the brief's mention.
- No empirical threshold exists in these sources for an acceptable visual versus Tab order correlation.

## What can be learned from existing agent-oriented design audit tools, especially impeccable?

### Takeaway
impeccable offers a practical delivery model (deterministic rule catalog, agent hook, CLI, JSON, browser overlay, suppression), but its catalog targets anti-patterns and craft quality rather than Gestalt group inference. A Gestalt skill should complement it and avoid reproducing its numeric health total.

### Cited Findings
- README claims 62 deterministic rules, with no LLM or API key; the local catalog contains 62 rule IDs split into 31 `slop` and 31 `quality` [TOOL] — [README](https://github.com/pbakaus/impeccable); local `impeccable detect --list-rules`, skill 4.8.0, engine 0.1.18
- Three surfaces: an agent hook scanning edited UI files; CLI for files, directories or URLs through installed Chrome or Edge; a Chrome extension overlaying findings on live pages [TOOL] — [README](https://github.com/pbakaus/impeccable)
- Output options are `--json` and `--github`; exit code 2 means findings and 1 means a target could not be scanned [TOOL] — [README](https://github.com/pbakaus/impeccable)
- Local help shows `--viewport`, `--scope type,layout`, `--no-advisory`, config and inline ignores, plus hiding of consent managers and product tours or preloaders before a scan [TOOL] — local `impeccable detect --help`
- Relevant rules include `nested-cards`, `monotonous-spacing`, `flat-type-hierarchy`, `text-occlusion`, `low-contrast`, `cramped-padding`, `skipped-heading`, `heading-rhythm`, `text-overflow`, and `design-system-*`. The catalog has no rule named for gap-ratio grouping, near-miss alignment or style-cluster near-duplicates, based on catalog names and descriptions [TOOL] — local rule catalog
- Some rule copy embeds numbers such as `flat-type-hierarchy` 1.25x and `body-text-viewport-edge` 16px or 12px; no empirical source is given in the catalog — local rule catalog
- Suppression can be global by value with a reason, or per-file by comment — [README](https://github.com/pbakaus/impeccable)
- The audit playbook keeps deterministic findings separate from assessment, assigns P0 to P3, and scores 5 dimensions 0 to 4 into a total out of 20 with rating bands — [audit.md](https://github.com/pbakaus/impeccable)
- Lighthouse custom audits pair a gatherer with an audit and a config — [Lighthouse recipe](https://github.com/GoogleChrome/lighthouse/blob/main/docs/recipes/custom-audit)

### Inferences
- Reuse the design: per-rule IDs, advisory tier, reasoned ignores, overlay hiding, JSON, deterministic before judgment.
- Do not reuse the design: 0 to 4 totals for Gestalt, since no validation links them to perceived quality.
- Integrate by consuming `impeccable detect --json` when it is present, then dedupe by selector and rule family. Keep the Gestalt engine standalone so it does not depend on one binary.
- Lighthouse plugin packaging is optional. A Playwright runner is a better fit initially because interaction, multi-state capture and screenshots dominate.

### Gaps
- impeccable rule implementations were not read, because the installed engine is compiled and the GitHub source was not examined at file level. Whether `monotonous-spacing` measures anything equivalent to gap ratio is unknown.
- Report JSON schema was not captured. Run the tool against a sample to see it before integrating.
- Lighthouse `details` format and node selector API were not retrieved.
- Other agent-facing design linters were not surveyed.

## How should the report and stress testing be structured to avoid fake precision?

### Takeaway
Report evidence, not a composite Gestalt score. Weak human agreement and lack of validation do not justify a decimal score. Each finding should show its evidence class, measurements, scope across test conditions, overlay and what would disprove it.

### Cited Findings
- Reflow requires 320 CSS px width for vertically scrolling content and 256 CSS px height for horizontally scrolling content. 1280 CSS px at 400% is equivalent to 320 [NORMATIVE] — [WCAG Understanding Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- Two-dimensional content such as maps, data tables and persistent toolbars can be excepted, with limits [NORMATIVE] — [WCAG Understanding Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- 200% text resizing is a separate requirement, and two-dimensional scrolling at 200% can be acceptable when the zoomed viewport falls below Reflow sizes [NORMATIVE] — [WCAG Understanding Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- Playwright offers `viewport`, `deviceScaleFactor`, `colorScheme` and `locale` — [Playwright emulation](https://playwright.dev/docs/emulation); and through `emulateMedia`, `contrast`, `forcedColors` and `reducedMotion` — [Playwright Page API](https://playwright.dev/docs/api/class-page)
- Low rater kappas (0.112; about 0.30) and hallucinations in critique pipelines limit claims to ground truth quality — [mockup study](https://arxiv.org/html/2403.13139); [UICrit](https://arxiv.org/html/2407.08850v3)
- Performance in the mockup study declined across iterative rounds: Accurate from 52% to 39% — [mockup study](https://arxiv.org/html/2403.13139)

### Inferences
Finding schema:

```yaml
id: gestalt.proximity.label-ambiguous
evidence_class: measured | candidate | judged | normative_failure
confidence: high | medium | low      # rule precision from calibration, otherwise "uncalibrated"
principle: proximity
selector: "#shipping label[for=zip]"
measurements: {own_gap_px: 14, other_gap_px: 12, ratio: 0.86, method: ink-box}
threshold: {value: 1.0, provenance: "heuristic, uncalibrated"}
conditions: {failed: ["375x812 light"], passed: ["1280x800 light"], not_run: ["400%"]}
artifacts: {crop: "...", overlay: "..."}
suppressions_checked: [common_region, baseline_inline]
impact: "User may attach the label to the wrong field"
falsifier: "Enclosing card or user test shows correct association"
fix_hint: "Increase separation from the previous field"
```

- Report layout: scope and coverage; normative failures; measured high-confidence findings; candidates needing review; judged opinions; passed checks and not-run checks; rule calibration status.
- Use P0 to P3 only for user consequence, and keep it distinct from confidence. A candidate can be potentially severe yet low confidence.
- Permitted summaries: counts per evidence class and condition, and trend against a baseline of the same page. Do not use a percentage score, letter grade or "Gestalt compliance 87/100". If a product demand forces a roll-up, publish it as ordinal and show its inputs.
- Test matrix, with provenance:

| Condition | Value | Basis |
|---|---|---|
| Reflow | 320 px width, 256 px height where relevant | Normative |
| Zoom | 200% and 400% from 1280-based viewport | Normative framing; emulation by smaller viewport is an approximation |
| Common viewports | 375, 768, 1280, 1920 | Convention, [HEURISTIC], replace with analytics |
| Text resizing | Text-only 200%, not just page zoom | Normative requirement, method [HEURISTIC] |
| Long translation | Pseudolocale at about +40% | [HEURISTIC] multiplier, use real long locales when available |
| RTL | `dir=rtl` and a real RTL locale if supported | Forced `dir` may reveal false faults when the product does not ship RTL |
| Dark | `colorScheme: dark`, plus the app's own toggle | Class-based themes will not respond to emulation |
| Forced colors, more contrast, reduced motion | `emulateMedia` | Tool support, relevance to be scoped |

- Multi-condition results give natural evidence. A group break appearing only at 768 px is much more actionable than one global claim.
- Stabilize before measuring: freeze animations for geometry passes, wait for fonts and images, dismiss or record consent banners, seed data, record the state tested.
- Precision first: begin with a small rule set, label findings in a held-out corpus, and publish precision per rule. Any rule below the chosen bar stays advisory. Recall is unknowable without a labeled corpus and should be reported as unknown.
- Recommended build order, based on the value of intent certainty and low implementation risk: (1) axe wrapper plus needs-review queue; (2) label-control proximity; (3) Tab path overlay; (4) reduced-motion diff; (5) role-scoped near-duplicates; (6) alignment near-miss; (7) occlusion and text-over-image sampling; (8) perceptual tree comparison; (9) LLM adjudication packets.

### Gaps
- I found no validated composite score for Gestalt quality on the web, and no published precision for a rule of this kind on real pages. A pilot is needed before claiming any precision.
- The +40% expansion figure is a design convention that was not sourced here.
- Browser zoom cannot be fully replicated by viewport emulation. Fidelity of this approach versus true browser zoom was not tested.
