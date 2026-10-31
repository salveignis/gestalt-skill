# Audit

Find where the visual structure disagrees with the content's meaning, and show the evidence. Change no code in this command.

## 1. Establish scope

Identify the target: a URL, a local file, a directory, or a component. For an app, start or find its dev server and audit the URL. Audit the states that matter, not only the default one: a form with errors, an open menu, an open dialog, an empty list. The detector loads each page and does not click, so write a small script for each state: `--init` seeds storage before page scripts run, and `--setup` runs after load, for example to open a menu. Run each state as its own scan.

A directory scan opens each file with no query string or stored data. Check that each page shows real content, because a template that needs a product ID or a filled cart measures only its empty state.

Before looking at the numbers, write down what the page is for and, in one line per item, the groups that its content implies. That is your reference. Without it, you cannot tell a real grouping fault from a measurement.

## 2. Measure

```bash
node <skill-dir>/scripts/detect.mjs <target> --json --out gestalt-report.json --artifacts gestalt-crops
```

The default widths are 320, 768 and 1280. Add `--dark` if the site has a dark theme using `prefers-color-scheme`. Add `--long-text` if it is translated, and `--rtl` only if it ships a right-to-left locale. Replace the widths with analytics-based ones when the project has them. Scan time grows with pages × widths × modes, so narrow these on a large site.

If `impeccable detect --json` is available, its findings can sit alongside these. Remove duplicates by selector and family, and keep the evidence labels of this skill.

If the scan cannot run, say so, review the code, and label everything `judged`.

## 3. Adjudicate candidates

Do not pass candidates through unread. For each one, look at its crop and numbers and answer the finding's `question`, one finding at a time. Free-form discovery is where models perform worst, and semantic grouping is their weakest category, so answer bounded questions rather than hunting for impressions.

- Confirmed: keep it as `candidate` with your reason, and promote only if the evidence is now close to certain.
- Rejected: move it to a "Checked and dismissed" list with your reason.
- Unsure: keep it, and state what would settle it.

Common false positives:
- `proximity.heading-floats`: display headings with an eyebrow, or a heading in a side column.
- `similarity.*`: real variants, state styles, third-party embeds.
- `continuity.near-miss-alignment`: optical adjustment of icons or glyphs.
- `closure.false-floor`: a deliberate full-height hero with another scroll cue. Viewport height varies, so never treat this as more than a prompt to look.
- `semantic.tab-order-inversion`: a sidebar last in the DOM, or links in CSS columns. Both can be logical.
- `continuity.near-miss-alignment`: page gutter against the padding of another block.
- `common-region.box-in-box`: a real nested level, such as a code block in a card.
- `semantic.css-reorder`: an order change that does not affect meaning, which WCAG allows.
- `semantic.control-group-unmarked`: H71 is conditional. If every label is clear alone, a fieldset may not be needed.

## 4. Look for what cannot be measured

Then inspect the rendered page yourself, at a narrow and a wide width, and label what you add `judged`:

- **Squint test:** blur your attention. How many groups do you see, and do they match the list from step 1?
- **False grouping:** does anything look related but not be, such as a tag that looks like a button, a heading in link colour, or an ad-like block?
- **Split groups:** are related things separated, such as an action far from its object, or a total far from its line items? Does stacking on mobile break a pair apart?
- **Focal point:** is there one clear next step per view?
- **Continuity:** do repeated cards line up across their inner rows?
- **Closure:** does a carousel or scroller show that more exists, and is the crop deliberate?
- **Common fate:** do things that belong together move together? Does anything move for no reason?
- **Screen reader order:** read the DOM or accessibility tree in order. Does it tell the same groups, with headings and named groups?

## 5. Report

Use this order. Give the user the top of it in chat, and save the full report when it is long.

```markdown
# Gestalt audit: <target>

## Scope
Pages, widths, states and themes run. What was not run.

## What the structure says
Two or three sentences: the page's intended groups, and where the visual groups match or depart from them.

## Fails a standard
## Measured
## Candidates: decided, with your reason
## Judged: my opinion from looking

For each finding:
- **<rule or short title>**: `selector`
- Evidence: numbers, plus the widths where it failed and passed
- Why it matters: the concrete user consequence
- Severity: P0 blocks a task; P1 likely error or missed content; P2 slows or confuses; P3 polish
- Fix direction, and what would prove this finding wrong

## Checked and dismissed
## Coverage and limits
Counts per class. Rule precision is not yet calibrated.
```

Severity and confidence are separate. A finding can be severe and uncertain. Rank within a class by severity, and group findings that share one cause, including the same finding across pages, because one spacing token fix may close ten of them. Do not add a score.
