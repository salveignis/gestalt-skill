# Patterns

Values marked *documented* come from a named system. Everything else is a starting point. A project's design system takes priority over all of this.

## Spacing

- The defensible rule is: the gap within a group is visibly smaller than the gap between groups.
- "Padding must be ≤ outer gap" has no primary source and is not universal. Polaris sets card padding and card gap both to 16 px (*documented*). A visible boundary reduces the need for extra outer space.
- Documented ratios, derived from published values: GOV.UK label to next group, 5 px to 20 px small and 30 px large; M3 dialog 8, 16, 24 dp; Carbon form items 32 px, title area 40 px, buttons 48 px above.
- Scales converge on 4 or 8 px multiples. GOV.UK's 5 px base is the outlier, and its units 3 to 5 collapse to 15 px on small screens, so check tiers at each breakpoint.

## Forms

- Label to input within; field to field between; section above that. Top-aligned labels are the defensible default on mobile portrait. On desktop, evidence doesn't support an absolute rule.
- Don't use a placeholder as the label. Baymard reports major usability problems with inline labels. Evidence on floating labels is thin and mixed.
- Group related inputs with `fieldset` and `legend`. A legend comes first in the fieldset. Radios, checkboxes and date parts almost always need it.
- Errors sit adjacent to the field, with an icon or text prefix as a second cue. Connect with `aria-describedby`. Leave room so a multi-line error doesn't collapse the tiers.
- Keep one primary button, aligned to the form's edge, close to the last field.

```html
<form class="stack-section">
  <fieldset class="stack-between">
    <legend>Delivery address</legend>
    <div class="stack-within">
      <label for="line1">Address line 1</label>
      <input id="line1" autocomplete="address-line1" aria-describedby="line1-err">
      <p id="line1-err" class="error" hidden>Enter address line 1</p>
    </div>
  </fieldset>
</form>
```

## Component cue map

| Pattern | Primary cue | Second cue | Overuse signal | Semantics |
|---|---|---|---|---|
| Card grid | Common region | Inner proximity | Bordered sections in a card; shadow, border and tint together | `ul`/`li`, heading in each |
| List | Proximity, leading edge | Dividers if rows are dense | Divider plus row card | `ul`/`ol` |
| Table | Column alignment | Horizontal rules or zebra | Full cell grid | `table`, `th scope` |
| Nav | Proximity, similarity | Active-state figure | Box around each link | `nav aria-label`, list |
| Megamenu | Headed columns | Panel region | Border around each column | `nav`, headings, lists |
| Pricing | Rows aligned by subgrid | Region per plan, emphasis for one | All plans highlighted | Lists or `table` |
| Filters | Heading and proximity | `fieldset`, disclosure | Box per filter group | `fieldset`, `legend` |
| Hero | Figure-ground, focal point | Scale, space | Several equal CTAs | `h1`, one primary link |
| Steppers | Connectedness | Current-state figure | Lines that break on wrap | `ol`, `aria-current="step"` |
| Dialog | Figure-ground | Scrim | Dialog over dialog | `<dialog>`, focus moves in and returns |

Cards suit mixed content and browsing, and are weak for scanning and comparing (NN/g). For homogeneous items, try a list or grid without boundaries first.

**Megamenu timing** (NN/g): wait about 0.5 s stationary before opening on hover, show within about 0.1 s, and allow diagonal travel. Each choice appears once.

## Aligned cards with subgrid

```css
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr)); gap: var(--gap-between); }
.card { display: grid; grid-row: span 3; grid-template-rows: subgrid; row-gap: var(--gap-within); }
```

## Peek for closure

```css
.rail { display: grid; grid-auto-flow: column; grid-auto-columns: 80%; gap: var(--gap-between);
  overflow-x: auto; scroll-snap-type: inline proximity; }
.rail > * { scroll-snap-align: start; }
```

Keep the peek large enough to look deliberate. No sourced minimum was found. Carousels need keyboard-reachable controls. Auto-advancing ones need a stop control first in tab order, and must stop on focus and hover (APG, WCAG 2.2.2).

**Skeletons** (NN/g): for full-page loads of about 2 to 10 s. None under 1 s, a spinner for a single module, and progress or an estimate past 10 s.

## Figure-ground

- M3 defaults to tonal difference, with shadow and scrim secondary. Its scrim is 32% (*documented*), and elevation levels are 0, 1, 3, 6, 8, 12 dp. Fewer levels give each more force.
- Contrast is 4.5:1 for text, 3:1 for large text (WCAG 1.4.3), and 3:1 for needed UI boundaries and states (1.4.11). No rounding.
- A scrim value doesn't guarantee contrast. Sample text against the lightest region of the image.
- A modal needs focus moved in, the outside inert, and focus returned on close. Use `<dialog>`.
- Test dark mode separately, since passing in light says nothing about dark. Shadows carry less there, so separate surfaces by tone.

```css
dialog::backdrop { background: color-mix(in srgb, var(--scrim) 32%, transparent); }
html { scroll-padding-block-start: 5rem; } /* keeps focus clear of a sticky header */
```

## Motion

Members of a group share duration and easing. Vary delay only. Stagger only the first screenful and cap the total. No major system documents a stagger value.

Documented tokens: Carbon `duration-fast-02` 110 ms, `moderate-02` 240 ms, `slow-01` 400 ms; entrance `cubic-bezier(0, 0, .38, .9)`. M3's duration and easing tokens are marked no longer maintained in favour of springs, though still usable, such as Standard `cubic-bezier(.2, 0, 0, 1)`.

```css
.list > * { animation: rise 240ms cubic-bezier(0, 0, .38, .9) both;
  animation-delay: calc((var(--i) - 1) * 30ms); } /* 30 ms is an example; set --i from JS or sibling-index() */
@keyframes rise { from { opacity: 0; translate: 0 .5rem; } }
@keyframes fade { from { opacity: 0; } }
@media (prefers-reduced-motion: reduce) {
  .list > * { animation-name: fade; animation-delay: 0ms; }
}
```

Replace motion rather than only removing it, and keep state changes visible. WCAG 2.2.2 (A) requires a way to stop automatic motion that lasts over 5 s. WCAG 2.3.3 (AAA) covers motion triggered by interaction.

## Keep groups intact

| Visual group | Semantic form |
|---|---|
| Related inputs | `fieldset` + `legend`, or `role=group` + `aria-labelledby` for composites |
| Link cluster | `nav aria-label` + list |
| Repeated cards | `ul`/`li` with a heading in each |
| Page region | `section aria-labelledby`, since an unnamed section adds little |
| Button cluster | Labelled `role=group`, only if grouping adds meaning |
| Tabular look | `table` with `th scope` |

- **Order:** keep DOM equal to the reading order. CSS `order` and placement are for visual reordering only (1.3.2, 2.4.3, C27). `reading-flow` is not Baseline as of this writing, so it can't be relied on.
- **Reflow:** content must work at 320 CSS px (1.4.10), which equals 1280 at 400%. A data table may scroll inside its own container.
- **Text spacing:** content can't clip when line height is 1.5×, paragraph spacing 2×, letter 0.12× and word 0.16× (1.4.12). Larger line gaps can blur tiers, so test them.
- **Target size:** 24×24 CSS px minimum, or spacing to match (2.5.8). Tight button clusters are the usual failure.
- **Translation:** use `min-height`, wrapping button groups, and no fixed text widths.
- **RTL:** logical properties for insets; `translateX` needs an override; mirror only directional imagery.

## Modern CSS

`gap`, grid, subgrid, container queries, `:has()` and logical properties are the core tools. `color-mix()` and `light-dark()` handle surface derivation. Check current browser support before relying on subgrid, style queries, `sibling-index()`, cross-document View Transitions or `reading-flow` without a fallback.
