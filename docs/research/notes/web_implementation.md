# Gestalt Principles Mapped to Web Frontend Implementation (as of 30 Oct 2026)

Method notes that apply throughout:
- "Explicit" means the system's own page says it. "Inferred" means it is my derivation from documented values.
- Pages were read through a fetch or summary layer, or through browser text extraction. Values in tables were returned verbatim. Re-check a page before quoting its prose.
- CSS and HTML snippets marked "sketch" are my own illustrations. They are not copied from a source.
- Polaris's old docs (polaris.shopify.com, polaris-react.shopify.com) now redirect to [shopify.dev/docs/api/polaris](https://shopify.dev/docs/api/polaris), so Polaris values below come from the repo's token source. Those tokens may not reflect the current web-component layer.

## 1. Principle-by-principle implementation map

### Takeaway
Most principles map to a small set of CSS tools. Proximity uses `gap` and padding, common region uses surfaces, continuity uses grid alignment, and common fate uses shared timing. Design systems state proximity and similarity explicitly. Connectedness and symmetry have little explicit guidance, and closure appears only implicitly, through carousels and skeletons.

### Cited Findings
**Proximity**
- M3 distinguishes implicit grouping (proximity and open space) from explicit grouping (outlines, dividers, shadows). It also says buttons should sit close to the content they affect. — [M3 Spacing principles](https://m3.material.io/foundations/layout/grids-spacing/spacing)
- Carbon, Fluent and Atlassian all state that closeness reads as relatedness and that added space weakens it. — [Carbon](https://carbondesignsystem.com/elements/spacing/overview/); [Fluent](https://fluent2.microsoft.design/layout); [Atlassian](https://atlassian.design/foundations/spacing)
- Anti-pattern: an Add button placed among Next, Save as Draft and Cancel gets missed, because users judge a group by one item. — [NN/g Proximity](https://www.nngroup.com/articles/gestalt-proximity/)
- Anti-pattern: a Skip link in a far corner was overlooked by task-focused users. — [NN/g Proximity](https://www.nngroup.com/articles/gestalt-proximity/)

**Similarity**
- M3: similar elements should have the same spacing and sizing, and leading thumbnails, avatars and icons should always align. — [M3](https://m3.material.io/foundations/layout/grids-spacing/spacing)
- Atlassian: a table or list should use the same spacing throughout so it reads as one unit. — [Atlassian](https://atlassian.design/foundations/spacing)

**Common region**
- NN/g: a clear boundary can overpower other grouping cues, which helps when spacing can't change. — [NN/g Common Region](https://www.nngroup.com/articles/common-region/)
- Fix example: a Food Network card resolved which byline belonged to which recipe. — [NN/g Common Region](https://www.nngroup.com/articles/common-region/)
- M3 surfaces: overlapping containment areas should use different color roles. — [M3 Applying elevation](https://m3.material.io/styles/elevation/applying-elevation)

**Connectedness**
- M3 lists dividers and outlines as explicit grouping, but I found no system page that names connectedness as a principle. See Gaps.

**Closure**
- M3's hero carousel gives a "sneak peek of what's next". M3 also requires that items be fully visible except in the uncontained layout, where they flow past the screen edge. — [M3 Carousel guidelines](https://m3.material.io/components/carousel/guidelines)
- Skeleton screens preview structure with wireframe-like placeholders. — [NN/g Skeleton screens](https://www.nngroup.com/articles/skeleton-screens/)

**Continuity**
- Apple: people assume aligned items are related and read indented items as subordinate. — [Apple HIG Layout](https://developer.apple.com/design/human-interface-guidelines/layout)
- M3 labels "continuity" as placing related elements in a container, row or column, with a chip row as the example. That is broader than the classic definition. — [M3](https://m3.material.io/foundations/layout/grids-spacing/spacing)

**Common fate**
- Carbon: related movements should have a "unified relationship with each other". — [Carbon Motion](https://carbondesignsystem.com/elements/motion/overview/)
- Implementation details are in section 8.

**Symmetry**
- M3 basic dialogs are center-aligned with an icon and start-aligned without one. The center-aligned hero carousel adds a preview on the leading edge so the large item is centered. — [M3 Dialog specs](https://m3.material.io/components/dialogs/specs); [M3 Carousel](https://m3.material.io/components/carousel/guidelines)

**Figure-ground**
- See section 6.

**Prägnanz (simplicity)**
- M3: when applying shadows, "less is more", and fewer levels give each more power. — [M3 Applying elevation](https://m3.material.io/styles/elevation/applying-elevation)
- Refactoring UI: too many borders make a design feel busy and cluttered. — [Wathan & Schoger](https://medium.com/refactoring-ui/7-practical-tips-for-cheating-at-design-40c736799886)
- NN/g on mega menus: keep them simple and show each choice only once. — [NN/g Mega menus](https://www.nngroup.com/articles/mega-menus-work-well/)

**Focal point**
- M3: give the most important content generous spacing and the brightest surfaces, and place key actions consistently. — [M3](https://m3.material.io/foundations/layout/grids-spacing/spacing)
- Carbon and Fluent: more surrounding space signals importance. — [Carbon](https://carbondesignsystem.com/elements/spacing/overview/); [Fluent](https://fluent2.microsoft.design/layout)
- GOV.UK: multiple default buttons on a page reduce their impact. — [GOV.UK Button](https://design-system.service.gov.uk/components/button/)

### Inferences
| Principle | Primary CSS/HTML | Common anti-pattern | Fix |
|---|---|---|---|
| Proximity | `gap`, parent padding, nested stacks | Uniform spacing everywhere | Use two or more gap tiers and nest groups |
| Similarity | Component tokens, shared classes | Styled text that looks like a link | Reserve the link and button style for interactive elements |
| Common region | `background`, `border`, `border-radius`, `<section>` | Boxes in boxes | Remove the inner container and use space or a heading |
| Connectedness | `border-inline-start`, pseudo-element lines, SVG connectors | Lines that end short or break on wrap | Draw connectors from the same container and test wrapping |
| Closure | Overflow peek, scroll snap, skeletons | Peek that looks like clipping, or hides content from keyboard users | Keep a consistent partial size and add controls |
| Continuity | Grid, subgrid, baseline alignment | Card footers at varied heights | Subgrid rows, `align-items: baseline` |
| Common fate | Shared duration and easing, `view-transition-class` | Group members animating unrelatedly | Use one token set and a small stagger |
| Symmetry | `justify-content: center`, `place-items`, equal tracks | Forced centering of long text or forms | Center only short compositions and keep forms start-aligned |
| Figure-ground | `<dialog>`, `::backdrop`, surface roles, `z-index` | Low-contrast overlay, or text directly on a photo | Scrim, gradient, tested contrast |
| Prägnanz | Fewer tokens, levels and styles | Border, shadow and fill on the same item | Use one grouping cue per level |
| Focal point | Scale, whitespace, single primary button | Multiple primary CTAs | One primary per view or group |

### Gaps
- I found no design-system page naming connectedness, closure or Prägnanz as such. Those mappings are inference from components.

## 2. Spacing scales and within-group vs between-group rules

### Takeaway
Scales converge on 4/8 px multiples, and GOV.UK's 5 px base is the outlier. Nearly every system states that closer means more related, but few publish a numeric within-group vs between-group ratio. "Internal ≤ external" is practitioner lore I could not trace to a primary source, and some systems' tokens contradict a strict reading.

### Cited Findings
| System | Base | Documented values | Within vs between guidance | Status |
|---|---|---|---|---|
| Material 3 | 8dp (`space100`) | Defines only recommended units, and the scale is extensible | Padding inside, gap between, margin outside. Prefer parent padding and gaps over child margins | Explicit. Numeric token list not captured. [Spacing overview](https://m3.material.io/styles/spacing/overview) |
| Carbon | 2px start, not uniform | 2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 160 (`$spacing-01` to `-13`) | Closeness signals relatedness. `Stack` puts equal gaps in the parent | Explicit principle, no ratio. [Carbon](https://carbondesignsystem.com/elements/spacing/overview/) |
| Polaris (token source) | 4px steps | `space-025` 1, `050` 2, `100` 4, `150` 6, `200` 8, `300` 12, `400` 16, `500` 20, `600` 24, `800` 32, `1000` 40, `1200` 48, `1600` 64, `2000` 80, `2400` 96, `2800` 112, `3200` 128 | Aliases: button group gap = `space-200` (8), card gap = card padding = `space-400` (16), table cell padding = `space-150` (6) | Explicit tokens. [space.ts](https://raw.githubusercontent.com/Shopify/polaris/main/polaris-tokens/src/themes/base/space.ts); [size.ts](https://raw.githubusercontent.com/Shopify/polaris/main/polaris-tokens/src/size.ts) |
| Polaris web components | Named keywords | `small-500` to `small`, `base`, `large` to `large-500`. Page gives no px values | Tight means together, generous separates. All stack items share one gap, so nest stacks for variation | Explicit. [s-stack](https://shopify.dev/docs/api/app-home/web-components/layout-and-structure/stack) |
| Atlassian | 8px (`space.100`) | 0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80 | 0–8 compact and internal, 12–24 larger components, 32–80 page layout | Size tiers explicit. The within/between mapping is partly an interpretation. [Atlassian](https://atlassian.design/foundations/spacing) |
| Primer | 4px steps with 2 and 6 | 2, 4, 6, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 64, 80, 96, 112, 128 | Control gap 4–8, stack gap 8/16/24, stack padding 8/16/24 | Explicit tokens. No grouping prose found. [Primer size](https://primer.style/product/primitives/size/) |
| Fluent 2 | 4px with 2, 6, 10 for icon alignment | 0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 28, 32, 36, 40, 48, 52, 56 | Smaller spacers within components, larger for layout. No numeric rule | Explicit principle. [Fluent](https://fluent2.microsoft.design/layout) |
| GOV.UK | 5px | Units 0–9. Small: 0, 5, 10, 15, 15, 15, 20, 25, 30, 40. Large or static: 0, 5, 10, 15, 20, 25, 30, 40, 50, 60. Large means wider than 640px | No general prose rule, but form CSS encodes one (section 3) | Explicit scale. [GOV.UK](https://design-system.service.gov.uk/styles/spacing/) |
| USWDS | 8px multiples | 1px, 2px, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 72, 80, 120, plus larger layout sizes from 160px to 1400px | "No separate guidance" on grouping on this page | Explicit tokens. [USWDS](https://designsystem.digital.gov/design-tokens/spacing-units/) |
| Apple HIG | No general web scale | Group with negative space, container shapes or separators. Platform-specific values: tvOS primary content inset 60pt top and bottom, 80pt sides; visionOS button centers at least 60pt apart | Principle only | Explicit. [Apple Layout](https://developer.apple.com/design/human-interface-guidelines/layout) |

Sources for the "internal ≤ external" rule:
- Blake Crosley's post states that space between groups must exceed space within them. Its worked example is label to field 8px and field to field 24px. — [Five Spacing Decisions](https://blakecrosley.com/blog/five-spacing-decisions)
- A GitHub PR adopts "internal padding <= external gap" as a project guideline. It is a project document, not an authority. — [tastemaker PR #30](https://github.com/codeswithroh/tastemaker/pull/30)
- Every Layout treats margin as a property of the relationship between proximate elements. It injects it from the parent with `* + *`, and advises a 1.5 modular ratio when body line-height is 1.5. It does not state an inner-to-outer ratio on this page. — [Every Layout Stack](https://every-layout.dev/layouts/stack/)
- Refactoring UI's public article advises alternatives to borders (box shadow, others). I could only confirm the "Use fewer borders" tip, not a spacing ratio. — [Refactoring UI](https://medium.com/refactoring-ui/7-practical-tips-for-cheating-at-design-40c736799886)

### Inferences
- A defensible rule is "gap inside a group < gap between groups, by a visible step". It holds across the documented examples.
- "Padding ≤ outer gap" is not universal. Polaris sets card padding equal to card gap (both 16px) and Primer's stack padding and gap tiers match. M3 dialogs have 24dp padding but only 8–24dp internal gaps. A visible boundary reduces the need for extra outer space, consistent with NN/g's point that boundaries can replace spacing.
- Derived ratios from documented values (derived, not prescribed):
  - GOV.UK label to next group: 5px to 20px small (1:4), 5px to 30px large (1:6).
  - M3 dialog: buttons 8, title to body 16, body to actions 24, so 1:2:3.
  - Crosley: 8 to 24, so 1:3.
  - A practical starting range is 1:2 to 1:4 between adjacent tiers. This is my synthesis, not a standard.
- One-step jumps on a scale can be invisible (16 to 20). Skip at least one token between tiers.
- GOV.UK units 3, 4 and 5 all collapse to 15px on small screens, so a design relying on those for hierarchy loses it on mobile. Test the tiers at each breakpoint.

### Gaps
- No primary origin found for "internal ≤ external". It should be presented as practitioner heuristic.
- Refactoring UI's book text was not accessible, so don't attribute a ratio to it.
- M3's numeric spacing token list (Tokens tab) was not captured. Only `space100 = 8dp` and component examples were confirmed.
- No perceptual study was consulted here that sets a minimum inner-to-outer ratio.

## 3. Forms

### Takeaway
The clearest numeric encoding of proximity in any system is in form CSS. GOV.UK uses 5px label to input and 20/30px between groups, and Carbon uses 32px between items. Material floats the label inside the field, so that distance is not a separate gap.

### Cited Findings
- GOV.UK `.govuk-label` has `margin-bottom: govuk-spacing(1)`, which is 5px. Large label variants use unit 3 (15px). — [label mixin](https://raw.githubusercontent.com/alphagov/govuk-frontend/main/packages/govuk-frontend/src/govuk/components/label/_mixin.scss); [scale](https://design-system.service.gov.uk/styles/spacing/)
- GOV.UK `.govuk-form-group` uses responsive unit 6 at the bottom (20px small, 30px large). The last nested group has 0. — [form-group mixin](https://raw.githubusercontent.com/alphagov/govuk-frontend/main/packages/govuk-frontend/src/govuk/objects/_form-group.mixin.scss)
- GOV.UK `.govuk-error-message` has a `margin-bottom` of unit 3 (15px). — [error mixin](https://raw.githubusercontent.com/alphagov/govuk-frontend/main/packages/govuk-frontend/src/govuk/components/error-message/_mixin.scss)
- GOV.UK order is label, hint, error message, input. With a fieldset it is legend, hint, error, inputs. A red border on the group wrapper links them, and `aria-describedby` points to hint and error. — [GOV.UK Error message](https://design-system.service.gov.uk/components/error-message/)
- GOV.UK legends must be the fieldset's first element. Use a fieldset when you need to show a relationship between inputs. Radios, checkboxes and date inputs already include one. — [GOV.UK Fieldset](https://design-system.service.gov.uk/components/fieldset/)
- With one question per page, make the label or legend the page heading. — [GOV.UK Labels, legends, headings](https://design-system.service.gov.uk/get-started/labels-legends-headings/)
- GOV.UK button groups: `govuk-button-group`, with one primary per page and the primary aligned to the form's left edge. — [GOV.UK Button](https://design-system.service.gov.uk/components/button/)
- Carbon form: items `margin-bottom` 32px (`$spacing-07`), gutter 32px, title area bottom 40px (`$spacing-08`), button top 48px (`$spacing-09`). — [Carbon Form style](https://carbondesignsystem.com/components/form/style/)
- An older Carbon v10 page listed form items at 24px, so the value changed by version. — [Carbon v10](https://v10.carbondesignsystem.com/components/form/style)
- M3: every text field needs a label, always visible, not truncated, not multi-line. — [M3 Text fields](https://m3.material.io/components/text-fields/guidelines)
- M3 errors: swap supporting text for error text rather than adding it, to avoid shifting content. Ensure padding between fields can absorb multi-line errors. Add an error icon as a second cue. — [M3 Text fields](https://m3.material.io/components/text-fields/guidelines)
- M3 adjacent labels align to the container's leading edge. Don't intermix filled and outlined fields in the same form. — [M3 Text fields](https://m3.material.io/components/text-fields/guidelines)
- USWDS: stay vertical, align validation next to inputs, wrap related controls in fieldset with a legend, and keep visual order matching HTML. It notes a VoiceOver iOS fieldset issue that may need `aria-labelledby`. — [USWDS Form](https://designsystem.digital.gov/components/form/)
- NN/g: minimal spacing between a top-aligned label and its field makes the relationship apparent, with a larger gap before the next pair. — [NN/g Proximity](https://www.nngroup.com/articles/gestalt-proximity/)
- WCAG 1.3.1 lists H71 (fieldset, legend) and ARIA17 (grouping roles) as techniques. — [Understanding 1.3.1](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)

### Inferences
- GOV.UK's error sits on the side of the input nearest the question, and M3's replaces supporting text below the field. Both keep the error adjacent to its field. Pick one placement and keep it consistent.
- Reserving a line for error text trades vertical density for stability. Otherwise allow growth and use a larger between-field gap.

Sketch:
```html
<form class="form">
  <fieldset class="form-section">
    <legend>Delivery address</legend>
    <div class="field">
      <label for="line1">Address line 1</label>
      <p id="line1-err" class="error" hidden>Enter address line 1</p>
      <input id="line1" autocomplete="address-line1" aria-describedby="line1-err">
    </div>
  </fieldset>
</form>
```
```css
.form { display: grid; gap: var(--space-section); }           /* e.g. 48px */
.form-section { display: grid; gap: var(--space-field); border: 0; padding: 0; } /* e.g. 24px */
.field { display: grid; gap: var(--space-label); }            /* e.g. 4–8px */
.field:has(> input[aria-invalid="true"]) .error { display: block; }
```
Token values are examples.

### Gaps
- Carbon's label-to-input distance and M3's external field-to-field gap were not found. A Reddit thread shows practitioners also find the M3 gap undocumented, which is weak evidence only. — [Reddit thread mirror](https://red.127.pp.ua/r/androiddev/comments/1lfgzu0/material_design_3_unclear_about_spacing_between)
- GOV.UK's `.govuk-button-group` numeric gap was not captured. The mixin fetched did not contain the rule.
- USWDS's form CSS margins were not retrieved (repo paths returned 404).

## 4. Cards, lists, tables, nav, megamenus, pricing, filters, heroes

### Takeaway
Use the weakest cue that works, starting with space, then tone, then a border. Cards earn their boundary for mixed content but harm scanning and comparison for homogeneous items.

### Cited Findings
- Cards suit heterogeneous content and browsing, and are poor for scanning and comparing. Homogeneous items are usually better as lists or grids. — [NN/g Cards](https://www.nngroup.com/articles/cards-component/)
- A subtle shadow signals that a whole card is clickable. Secondary actions can sit inside, separated by a line. — [NN/g Cards](https://www.nngroup.com/articles/cards-component/)
- Common-region overkill: Backcountry's boxed filter groups were unnecessary because proximity already signaled grouping. Full-width bordered sections can create "false floors". — [NN/g Common Region](https://www.nngroup.com/articles/common-region/)
- NN/g advises checking whether whitespace is enough before adding borders. — [NN/g Common Region](https://www.nngroup.com/articles/common-region/)
- Refactoring UI suggests alternatives to a border, including box shadow, with secondary summaries also listing contrasting backgrounds and extra spacing. — [Refactoring UI](https://medium.com/refactoring-ui/7-practical-tips-for-cheating-at-design-40c736799886); [summary](https://dev.to/braydoncoyer/8-tips-to-improve-your-ui-designs-4mm)
- Crosley proposes the order proximity, then background shift, then stroke, reserving borders for tables and editable areas. This is a practitioner view. — [Crosley](https://blakecrosley.com/blog/five-spacing-decisions)
- M3 cards can be outlined or use shadow. M3 lists dividers as an explicit grouping device and carousels as implicit grouping. Filled and outlined cards sit at 0dp, elevated at 1dp. — [M3 Spacing](https://m3.material.io/foundations/layout/grids-spacing/spacing); [M3 Elevation tokens](https://m3.material.io/styles/elevation/tokens)
- Mega menus: use large two-dimensional panels divided into groups, ordered by workflow or importance, with strong panel borders (a subtle shadow may not signal more content). — [NN/g Mega menus](https://www.nngroup.com/articles/mega-menus-work-well/)
- Mega menu hover timing: wait about 0.5s stationary, show within about 0.1s, keep for about 0.5s after the pointer leaves, and allow diagonal travel. — [NN/g Mega menus](https://www.nngroup.com/articles/mega-menus-work-well/)
- Tables: a table should keep spacing uniform so it reads as one unit, and Polaris's table-cell padding alias is 6px. — [Atlassian](https://atlassian.design/foundations/spacing); [Polaris space.ts](https://raw.githubusercontent.com/Shopify/polaris/main/polaris-tokens/src/themes/base/space.ts)
- Hero: M3 says to frame important actions with negative space and give them the brightest surfaces. — [M3](https://m3.material.io/foundations/layout/grids-spacing/spacing)

### Inferences
| Pattern | Typical primary cue | Secondary cue | Overuse signal |
|---|---|---|---|
| Card grid | Common region | Internal proximity | Bordered sections inside a card, or shadow plus border plus tint |
| List | Proximity and alignment (leading edge) | Dividers only if rows are dense | Divider on every row plus row card |
| Table | Alignment (columns) | Horizontal rules or zebra | Full cell grid when rows scan fine |
| Nav | Proximity plus similarity | Active-state figure | Boxes around each link |
| Mega menu | Headed columns (proximity, heading) | Panel region | Border around each column |
| Pricing | Aligned rows (continuity via subgrid) | Region per plan, emphasis for one | Every plan equally highlighted |
| Filters | Heading plus proximity | `fieldset`, disclosure | Box per filter group |
| Hero | Figure-ground and focal point | Scale, space | Several equal CTAs |

Rule of thumb: use one visible container per hierarchy level, and when nesting, use tone or space inside instead of a second border.

### Gaps
- I found no eye-tracking data specific to pricing tables or to "boxes in boxes". The nesting rule is an inference.

## 5. Similarity, affordance consistency and use of color

### Takeaway
Similarity is both a grouping tool and an affordance contract, and color cannot carry it alone. Inline links need a non-color cue or 3:1 against surrounding text, and false similarity is usually a usability bug rather than a WCAG failure.

### Cited Findings
- WCAG 1.4.1 (A): color cannot be the only visual means of distinguishing. — [Understanding 1.4.1](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
- G183 uses 3:1 between inline links and surrounding text, as an added distinction. F73 is links not evident without color vision. — [Understanding 1.4.1](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
- Links styled identically to static text don't fail 1.4.1 but can still cause usability problems. — [Understanding 1.4.1](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
- Non-text contrast: a button needs no visible boundary if its text identifies it. Boundary, when it is the only indicator, must reach 3:1. Text inputs identified by border or fill need 3:1. — [Understanding 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
- 1.4.11 calls a contrasting outline best practice and recommends delineating controls for people with cognitive disabilities. — [Understanding 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
- Redundant cue example: M3 strongly recommends an error icon as a second visual indicator. — [M3 Text fields](https://m3.material.io/components/text-fields/guidelines)
- GOV.UK uses a visually hidden "Error:" prefix, giving a text cue beyond color. — [GOV.UK Error message](https://design-system.service.gov.uk/components/error-message/)
- M3 advises choosing a text-field variant most distinct from other components such as buttons, which guards against false similarity. — [M3 Text fields](https://m3.material.io/components/text-fields/guidelines)
- NN/g: proximity can outweigh color or shape. Matching fonts did not stop extra space from separating Search from navigation. — [NN/g Proximity](https://www.nngroup.com/articles/gestalt-proximity/)

### Inferences
- False-similarity checklist: colored headings in link color, pill tags styled like buttons, disabled-looking active states, inputs styled like read-only values.
- Encode state with at least two cues (color plus icon, weight or underline).

Sketch:
```css
.prose a { text-decoration: underline; text-underline-offset: .15em; }
.btn-primary { background: var(--color-action); color: var(--color-on-action); }
.tag { background: var(--color-surface-2); border-radius: 4px; cursor: default; } /* no action color */
```

### Gaps
- No controlled research was collected on how many redundant cues are optimal.

## 6. Figure-ground: scrims, elevation, sticky headers, text over images, dark mode

### Takeaway
M3 now defaults to tonal difference, with shadow and scrim as secondary methods and a scrim at 32%. WCAG's ratios are hard thresholds, and overlays need focus handling as well as paint.

### Cited Findings
- M3 uses scrim color role at 32% opacity beneath modals and expanded navigation menus. — [M3 Applying elevation](https://m3.material.io/styles/elevation/applying-elevation)
- M3 levels and dp: 0 = 0, 1 = 1, 2 = 3, 3 = 6, 4 = 8, 5 = 12. Resting range is 0 to +3, and +4/+5 are for interacted states. — [M3 Elevation tokens](https://m3.material.io/styles/elevation/tokens); [Applying elevation](https://m3.material.io/styles/elevation/applying-elevation)
- Examples at rest: modal dialog level 3; menu and scrolled app bar level 2; filled and outlined cards level 0. Hover or focus usually raises a level. — [M3 Elevation tokens](https://m3.material.io/styles/elevation/tokens)
- M3's elevated surface should show edges, overlap and distance. Surface roles are "not tied to elevation". Surface tint is deprecated. — [M3 Applying elevation](https://m3.material.io/styles/elevation/applying-elevation); [Tokens](https://m3.material.io/styles/elevation/tokens)
- M3 dialog: surface container high, 28dp corners, 280–560dp width, 24dp padding, 16dp title to body, 24dp body to actions, 8dp between buttons. — [M3 Dialog specs](https://m3.material.io/components/dialogs/specs)
- M2 dark overlay table, now legacy: 0dp 0%, 1dp 5%, 4dp 9%, 8dp 12%, 16dp 15%, 24dp 16%, reported via search summary of the page. The #121212 base is confirmed by secondary sources. — [M2 Dark theme](https://m2.material.io/design/color/dark-theme)
- Apple prefers a scroll edge effect over a solid background beneath controls, and Liquid Glass to separate controls from content. — [Apple Layout](https://developer.apple.com/design/human-interface-guidelines/layout)
- WCAG 1.4.3: 4.5:1 normal, 3:1 large (18pt, or 14pt bold, about 24px and 18.5px). No rounding. — [Understanding 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- WCAG technique F83: a background image without enough contrast with foreground text fails. — [Understanding 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- WCAG 1.4.11: 3:1 for needed UI and graphics, measured against adjacent colors, and 2.999:1 fails. — [Understanding 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
- Modal: focus moves in, outside becomes inert, and focus returns to the trigger on close. H102 uses `<dialog>`. — [Understanding 2.4.3](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html)
- F85: dialogs or menus not adjacent in focus order, or focus not returned on close. — [F85](https://www.w3.org/WAI/WCAG22/Techniques/failures/F85)
- Carbon `duration-slow-02` (700ms) is intended for background dimming. — [Carbon Motion](https://carbondesignsystem.com/elements/motion/overview/)

### Inferences
Sketch:
```css
dialog::backdrop { background: color-mix(in srgb, var(--scrim) 32%, transparent); }
.hero { position: relative; isolation: isolate; }
.hero img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: -2; }
.hero::after { content: ""; position: absolute; inset: 0; z-index: -1;
  background: linear-gradient(to top, rgb(0 0 0 / .7), transparent 60%); }
header.sticky { position: sticky; top: 0; background: var(--surface); }
html { scroll-padding-block-start: 5rem; } /* keep focused targets clear of the sticky header */
```
- The 32% M3 scrim is a visual value and doesn't guarantee content contrast. Test text at the lightest image region, because a gradient varies.
- In dark mode, shadows carry less, so differentiate surfaces by tone. This follows from M3's default tonal approach, but I did not find a statement specific to dark mode in M3.

### Gaps
- WCAG 2.4.11 Focus Not Obscured and sticky-header handling were not read in this session. Verify them before citing. `scroll-padding` above is my suggestion.
- M3's surface role hex values were not captured.

## 7. Closure and continuity: carousels, icons, skeletons, steppers, grids

### Takeaway
Partial peek works when the crop looks deliberate and the content has explicit controls and semantics. Alignment across components is now implementable with subgrid. Skeletons have specific timing conditions.

### Cited Findings
- M3 carousel layouts: multi-browse, uncontained, hero. Snap scrolling is recommended for multi-browse, hero and full-screen, and standard scrolling for uncontained. — [M3 Carousel](https://m3.material.io/components/carousel/guidelines)
- At the compact breakpoint a hero should show one large and one small item. — [M3 Carousel](https://m3.material.io/components/carousel/guidelines)
- APG carousel: a stop/start button, first in the tab sequence; stop on keyboard focus and hover; container role `region` or `group` with `aria-roledescription="carousel"`; slides `group` with `aria-roledescription="slide"`, labelled, possibly "3 of 10". — [APG Carousel](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/)
- Skeleton use: "exclusively for full-page loads" per NN/g. Under 1s none; about 2–10s skeleton for full page, spinner for a module; over 10s progress bar or estimate. Static or gray types are most common, and animated ones can distract. — [NN/g Skeleton](https://www.nngroup.com/articles/skeleton-screens/)
- Subgrid passes the parent's gap by default, can be overridden, and restarts line numbering. — [MDN Subgrid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid)
- `grid-template-rows` and `columns: subgrid` lets nested items align with the parent. — [MDN Grid & a11y](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Grid_layout_and_accessibility)
- M3: keep consistent horizontal spacing between cards of varying heights, and align leading elements. — [M3](https://m3.material.io/foundations/layout/grids-spacing/spacing)
- Every Layout: base vertical spacing on the standard line-height. — [Every Layout Stack](https://every-layout.dev/layouts/stack/)
- Apple: use consistent spacing in grids, because otherwise it no longer looks like a grid. — [Apple Layout](https://developer.apple.com/design/human-interface-guidelines/layout)

### Inferences
Sketch (card rows aligned across a grid, adapted from MDN's pattern):
```css
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr)); gap: var(--space-6); }
.card { display: grid; grid-row: span 3; grid-template-rows: subgrid; row-gap: var(--space-2); }
```
```html
<ul class="cards" role="list"><li class="card"><h3>…</h3><p>…</p><a href="…">…</a></li></ul>
```
Sketch (peek via scroll snap):
```css
.rail { display: grid; grid-auto-flow: column; grid-auto-columns: 80%;
  gap: var(--space-3); overflow-x: auto; scroll-snap-type: inline proximity; }
.rail > * { scroll-snap-align: start; }
```
- Peek should be large enough to look deliberate. A crop through text reads as a bug. No sourced threshold was found.
- Steppers are connectedness and continuity. Use `<ol>` with `aria-current="step"`, draw connectors as decorative pseudo-elements with logical properties, and switch to vertical on narrow containers.
- Icons rely on closure, so keep gaps consistent on the system's grid. Fluent adds 2, 6 and 10 values to align icon padding to its grid. — [Fluent](https://fluent2.microsoft.design/layout)

### Gaps
- CSS `::scroll-button` and `::scroll-marker` status could not be verified (Chrome doc URL 404).
- Sourced minimum peek width and icon-closure rules were not found. No stepper guidance was retrieved from a major system.
- Subgrid's Baseline status was not directly confirmed in this session, so check MDN or caniuse.

## 8. Common fate: animation, stagger, View Transitions, FLIP, motion tokens, reduced motion

### Takeaway
Group members should share duration and easing, with stagger small relative to total time. M3's easing and duration tokens are explicitly no longer maintained in favor of springs, though still usable. No major system source gave a stagger number.

### Cited Findings
**M3 easing and duration (legacy, "no longer maintained"):**
| Token | CSS |
|---|---|
| Emphasized decelerate | `cubic-bezier(0.05, 0.7, 0.1, 1.0)` |
| Emphasized accelerate | `cubic-bezier(0.3, 0.0, 0.8, 0.15)` |
| Emphasized | N/A in CSS, use Standard as a fallback |
| Standard | `cubic-bezier(0.2, 0.0, 0, 1.0)` |
| Standard decelerate | `cubic-bezier(0, 0, 0, 1)` |
| Standard accelerate | `cubic-bezier(0.3, 0, 1, 1)` |

- M3 durations: short 50/100/150/200ms; medium 250/300/350/400ms; long 450/500/550/600ms; extra-long 700/800/900/1000ms. — [M3 Tokens & specs](https://m3.material.io/styles/motion/easing-and-duration/tokens-specs)
- M3 examples: selection controls 200ms Standard; FAB to sheet 400ms Emphasized; card to full screen 500ms Emphasized. — [M3 Tokens & specs](https://m3.material.io/styles/motion/easing-and-duration/tokens-specs)
- M3 Expressive physics system (May 2025): springs with stiffness, damping, velocity; schemes expressive and standard; spatial and effects tokens; speeds fast, default, slow. Web is "compatible with Compose springs". — [M3 Motion physics](https://m3.material.io/styles/motion/overview/how-it-works)
- Effects springs are for color and opacity, without overshoot. — [M3 Motion physics](https://m3.material.io/styles/motion/overview/how-it-works)

**Carbon motion:**
| Token | Value | Use |
|---|---|---|
| `duration-fast-01` | 70ms | Button, toggle |
| `duration-fast-02` | 110ms | Fade |
| `duration-moderate-01` | 150ms | Small expansion, short distance |
| `duration-moderate-02` | 240ms | Expansion, toast |
| `duration-slow-01` | 400ms | Large expansion, important notifications |
| `duration-slow-02` | 700ms | Background dimming |

| Curve | Productive | Expressive |
|---|---|---|
| Standard | `cubic-bezier(0.2, 0, 0.38, 0.9)` | `cubic-bezier(0.4, 0.14, 0.3, 1)` |
| Entrance | `cubic-bezier(0, 0, 0.38, 0.9)` | `cubic-bezier(0, 0, 0.3, 1)` |
| Exit | `cubic-bezier(0.2, 0, 1, 0.9)` | `cubic-bezier(0.4, 0.14, 1, 1)` |

— [Carbon Motion](https://carbondesignsystem.com/elements/motion/overview/)

**Stagger**
- `sibling-index()` times a duration gives a stagger, and `CSS.supports()` plus a JS-set property is the fallback. — [Chrome guide](https://developer.chrome.com/docs/modern-web-guidance/guides/ui-behaviors/dynamic-sibling-animations?hl=de)
- LogRocket's example uses `calc((sibling-index() - 1) * var(--delay))` with 100ms, which is an example value and not a standard. — [LogRocket](https://blog.logrocket.com/css-staggered-animations/)
- Reported support: Chrome and Edge 138, Safari 26.2. This is a secondary source and should be rechecked. — [ICS Media](https://ics.media/en/entry/260116/)

**View Transitions**
- Same-document View Transitions reached Baseline Newly available with Firefox 144 (October 2025), including `view-transition-name`, `view-transition-class`, `match-element` and `:active-view-transition`. — [web.dev](https://web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available)
- `view-transition-class` styles many named elements through `::view-transition-group(.card)`. `match-element` animates individual list items. — [MDN View Transitions](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)
- Cross-document: `@view-transition { navigation: auto; }` on both documents. — [MDN View Transitions](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)

**FLIP**
- First, Last, Invert, Play. Do measurement in the 100ms window after input, and animate `transform` and `opacity`. — [Aerotwist](https://aerotwist.com/blog/flip-your-animations/)

**Accessibility**
- WCAG 2.2.2 Pause, Stop, Hide (A): moving, blinking or scrolling content that starts automatically, lasts more than 5s and runs in parallel needs a mechanism. Auto-updating has no 5s exception. — [Understanding 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
- WCAG 2.3.3 (AAA): interaction-triggered motion can be disabled unless essential, and C39 uses `prefers-reduced-motion`. — [Understanding 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html); [C39](https://www.w3.org/WAI/WCAG22/Techniques/css/C39)
- MDN shows replacing motion with an opacity dissolve rather than only removing it. — [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- Carbon: always provide alternatives for state transitions, and ensure messages can be communicated statically. — [Carbon Motion](https://carbondesignsystem.com/elements/motion/overview/)

### Inferences
Sketch:
```css
.list > * {
  --i: sibling-index(); /* fallback: set --i from JS */
  animation: rise 240ms cubic-bezier(0, 0, .38, .9) both;
  animation-delay: calc((var(--i) - 1) * 30ms);
}
::view-transition-group(.card) { animation-duration: 300ms; }
@keyframes rise { from { opacity: 0; translate: 0 .5rem; } }
@media (prefers-reduced-motion: reduce) {
  .list > * { animation-name: fade; animation-delay: 0ms; }
  ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation: none !important; }
}
@keyframes fade { from { opacity: 0; } }
```
- A larger stagger reads as separate events, while too little reads as a block. Cap total stagger so long lists don't lag, and stagger only the first screenful. The 30ms is my example, not a documented value.
- Use the same easing family across members. Offsets are the only thing to vary, because shared timing is what creates the common fate reading.

### Gaps
- No system-prescribed stagger value was found in Carbon or M3 pages.
- Cross-document View Transition Baseline status and Firefox support as of 2026 are unconfirmed.
- M3 spring numeric stiffness and damping weren't captured from the specs page.

## 9. Visual vs semantic mismatch

### Takeaway
A Gestalt grouping seen only on screen does not exist for assistive tech. Grouping must be expressed in markup, and order, reflow, spacing overrides and target size must keep it intact. DOM order is the default source of truth, with `reading-flow` still not Baseline.

### Cited Findings
**Criteria**
| SC | Level | Requirement | Key techniques and failures |
|---|---|---|---|
| 1.3.1 | A | Visual structure programmatically determined or in text | H71, ARIA17, H42, H48; F2, F43, F91, F92 |
| 1.3.2 | A | Correct reading sequence determinable when sequence affects meaning | C27 (DOM = visual), C6 with G57; F1 (CSS changes meaning) |
| 2.4.3 | A | Focus order preserves meaning and operability | C27, SCR26, H102; F44, F85 |
| 1.4.10 | AA | 320 CSS px width, 256 height (400% of 1280/1024) | Exceptions for 2D content, including data tables |
| 1.4.12 | AA | Line-height 1.5×, paragraph spacing 2×, letter 0.12×, word 0.16× | C36, C35, C28; F104 |
| 2.5.8 | AA | 24×24 CSS px, or spacing, inline, equivalent, UA, essential exceptions | |

Sources: [1.3.1](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html); [1.3.2](https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html); [2.4.3](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html); [1.4.10](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html); [1.4.12](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html); [2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html). Levels for 1.3.1, 1.3.2 and 1.4.10 come from general WCAG knowledge, because the fetched summaries didn't state them.

**Details**
- A visual order differing from programmatic order is acceptable when it doesn't change meaning. — [Understanding 1.3.2](https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html)
- Focus order need not match layout exactly but must be logical. Example: nav after main in source, placed left by CSS, can pass. — [Understanding 2.4.3](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html)
- The CSS spec says `order` and grid placement must be used only for visual, not logical, reordering. — [MDN Grid & a11y](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Grid_layout_and_accessibility)
- `reading-flow` and `reading-order` shipped in Chrome 137. Positive `tabindex` is ignored for direct children of a reading-flow container. — [Chrome blog](https://developer.chrome.com/blog/reading-flow)
- MDN marks it limited availability, experimental and not Baseline. — [MDN reading-flow](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/reading-flow)
- USWDS: don't rearrange form controls with CSS. — [USWDS Form](https://designsystem.digital.gov/components/form/)
- Reflow: table is excepted but cells aren't necessarily, surrounding headings and pagination must reflow, and a table can go in its own scroll container. — [Understanding 1.4.10](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- Text spacing: no clipping or overlap. Ellipsis acceptable only if full text is available. — [Understanding 1.4.12](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)
- Target size: a 24px diameter circle centered on an undersized target must not overlap another target or another undersized target's circle. — [Understanding 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- Fluent asks for 44×44 on iOS and web, and 48×48 on Android, above the WCAG AA floor. — [Fluent](https://fluent2.microsoft.design/layout)
- Mobile breaks grouping: Transport for London's stacked layout pushed two related links apart. — [NN/g Proximity](https://www.nngroup.com/articles/gestalt-proximity/)
- Apple: horizontally adjacent views may need to stack and rows may need to grow as text grows. Test with localizations and text sizes. — [Apple Layout](https://developer.apple.com/design/human-interface-guidelines/layout)
- M3: leading and trailing swap in RTL, and leading and trailing icons change position by direction. — [M3 Spacing overview](https://m3.material.io/styles/spacing/overview); [M3 Text fields](https://m3.material.io/components/text-fields/guidelines)
- `display: contents` lets children become grid items, while MDN points to Roselli's caution. Roselli reports past browser bugs, with tables fixed across engines by October 2023. Current status for lists and buttons is unverified. — [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Grid_layout_and_accessibility); [Roselli search set](https://adrianroselli.com/page/2)
- `list-style: none` can remove list semantics in Safari, and `role="list"` is the common workaround that validators flag as redundant. A December 2025 WebKit bug reports an iOS/macOS VoiceOver inconsistency. — [WebKit bug 304137](https://bugs.webkit.org/show_bug.cgi?id=304137); [Rocket Validator](https://rocketvalidator.com/html-validation/the-list-role-is-unnecessary-for-element-ul.md)
- RTL pitfalls: multi-value shorthands aren't logical, `translateX` needs an override, and JS-positioned dropdowns may use physical `left`. Mirror only directional imagery, and keep filenames and phone numbers LTR. — [Smashing](https://www.smashingmagazine.com/2022/12/deploying-css-logical-properties-on-web-apps/)

### Inferences
**Visual cue to semantic mapping:**
| Visual grouping | Semantic | Notes |
|---|---|---|
| Related inputs | `<fieldset><legend>` | Or `role="group"` + `aria-labelledby` for composites |
| Link cluster | `<nav aria-label>` + `<ul>` | Label when multiple navs exist |
| Repeating cards | `<ul>/<li>` + heading in each | Add `role="list"` only if you've tested the need |
| Page region | `<section aria-labelledby>` | An unnamed `section` adds little |
| Button cluster | `role="group"` with a label | Only when grouping adds meaning |
| Decorative divider | CSS, or `<hr>` when it's a thematic break | Don't use markup purely for visuals |
| Table look | `<table>` with `th scope` | Don't build tabular data from `div`s |

**Survival tests for a grouping:**
- Grouping via spacing alone can disappear in a linear screen-reader reading, so check it in the accessibility tree.
- Under 1.4.12 overrides, `gap` is unaffected, but paragraph spacing and line height can make a line gap look larger than a group gap, so test whether tiers remain distinct.
- At 400% or 320px, keep the label directly before its input and avoid `order` reversal between a label and its control.
- Translated labels: use `min-height`, not fixed `height`. Allow button groups to wrap with `flex-wrap`. Fixed widths break groups first.
- Sizing with `rem` in tokens means spacing scales with root font-size changes, but px does not. DTCG supports both.
- Use `order` only for decorative or independent items. For a "move image above title" card, keep the heading first in DOM and use grid placement, then tab-test.

### Gaps
- Current cross-browser status of `display: contents` for lists and buttons was not verified.
- Whether `gap` should scale under text-spacing overrides isn't addressed by WCAG in what I read. The tier-distinction concern above is my reasoning.
- I found no direct research about how screen-reader users benefit from `role=group` versus headings.

## 10. Modern CSS for implementation

### Takeaway
A modern Gestalt stack is parent-owned `gap`, grid/subgrid, container queries, `:has()`, logical properties, `color-mix()`, and semantic DTCG tokens. Polaris's stack component and M3's spacing guidance both reinforce parent-owned spacing.

### Cited Findings
- M3: define padding and gaps on the parent, and avoid margins on children as they usually aren't uniform and need more tokens. — [M3 Spacing overview](https://m3.material.io/styles/spacing/overview)
- Carbon's Stack lets components skip their own margins and leaves layout to the parent. — [Carbon](https://carbondesignsystem.com/elements/spacing/overview/)
- Polaris `s-stack` has flow-relative padding and responsive values via `@container` queries. It has one gap per stack, so nest stacks to vary it. — [s-stack](https://shopify.dev/docs/api/app-home/web-components/layout-and-structure/stack)
- Container queries: `container-type: inline-size`, `@container`, `cqi` units, and a component example of a form or button group switching layout. — [web.dev](https://web.dev/learn/css/container-queries)
- Style queries test a container's computed style such as a custom property. — [MDN Container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries)
- `:has()` is Baseline Widely available, in major browsers since December 2023. No nesting inside itself. Avoid broad anchors like `body:has()`, and prefer `>` or `+`. — [MDN :has()](https://developer.mozilla.org/en-US/docs/Web/CSS/:has)
- Logical properties adapt to `dir` and writing mode. `margin-inline-start` is left in LTR and right in RTL. — [MDN Logical properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values)
- `color-mix()` in `oklab` can derive borders and surfaces, e.g. 80% background with base color. — [web.dev](https://web.dev/articles/baseline-in-action-color-theme)
- `light-dark()` sets both values in one declaration with `color-scheme`. — [web.dev](https://web.dev/articles/baseline-in-action-color-theme)
- DTCG: latest published version 2025.10. The current draft is a Community Group report dated 8 September 2026 and marked not to implement, and it is not a W3C Standard. — [DTCG draft](https://www.designtokens.org/tr/drafts/format/)
- DTCG dimension: `$type: "dimension"`, `$value: { value, unit }`, unit only `px` or `rem`. Aliases are `{group.token}` or `$ref` JSON Pointer. — [DTCG draft](https://www.designtokens.org/tr/drafts/format/)
- Same-document transitions are Baseline as of October 2025, as cited in section 8. — [web.dev](https://web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available)

### Inferences
Sketch of semantic spacing tokens (DTCG). Token names and values are mine:
```json
{
  "space": { "$type": "dimension",
    "100": { "$value": { "value": 0.5, "unit": "rem" } },
    "300": { "$value": { "value": 1.5, "unit": "rem" } },
    "600": { "$value": { "value": 3, "unit": "rem" } }
  },
  "group": { "$type": "dimension",
    "within":  { "$value": "{space.100}", "$description": "Label to input, icon to text" },
    "between": { "$value": "{space.300}", "$description": "Field to field, card to card" },
    "section": { "$value": "{space.600}", "$description": "Between page sections" }
  }
}
```
Sketch of a responsive group that keeps proximity tiers:
```css
.product { container: product / inline-size; }
.product__body { display: grid; gap: var(--group-within); }
.product__grid { display: grid; gap: var(--group-between); }
@container product (inline-size >= 40rem) {
  .product__grid { grid-template-columns: 2fr 3fr; }
}
.note { border-inline-start: 4px solid var(--accent); padding-inline-start: var(--group-within); }
.card:has(> .card__media) { padding-block-start: 0; }
.panel { background: color-mix(in oklab, var(--surface) 92%, var(--accent)); }
```
- Name tokens by relationship (`group.within`, `group.between`) rather than only by size. This lets a linter or reviewer check that within is less than between, and makes the Gestalt rule machine-checkable. This is my recommendation, not a DTCG statement.
- Prefer container queries for card and form groups, so grouping survives in sidebars and multi-pane layouts where viewport width is misleading.

### Gaps
- Baseline status of container style queries, subgrid, `sibling-index()` and `reading-flow` in non-Chromium engines wasn't fully confirmed. Check MDN or caniuse before prescribing without fallback.
- Logical-property caveat from Smashing dates from 2022. Current older-Safari relevance is likely lower but not verified.
