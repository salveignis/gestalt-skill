# Fix

Repair the structure with the smallest change that makes the groups true, then prove it by measuring again. Refinement preserves: keep the design's identity, copy and behaviour unless the user asks for more.

## 1. Baseline

Use the user's report if there is one. Otherwise measure first, under the same conditions you will use afterward:

```bash
node <skill-dir>/scripts/detect.mjs <target> --json --out gestalt-before.json --artifacts gestalt-crops
```

Save this report outside version control, or tell the user where it is. If there is no audit yet, write down the page's intended groups first. Then adjudicate candidates as in [audit.md](audit.md) before touching code. Do not fix what you rejected.

## 2. Find the shared cause

Group findings by cause and fix at the highest sensible level:

1. A token or scale, for example two tiers with almost the same value
2. A shared component or layout primitive
3. A page's composition
4. A one-off element, only as a last resort

Ten findings often come from one missing tier. A patch on each element makes the system less consistent, which is its own similarity fault.

## 3. Choose the weakest repair

Go down this list and stop at the first that works. Adding a box should not be the first move.

| Problem | Try first | Then | Avoid |
|---|---|---|---|
| Things that belong together look apart | Reduce the inner gap | Align them; then a shared surface | A new border around everything |
| Unrelated things look together | Increase the outer gap | A heading or divider | Colour alone |
| Ambiguous label | Tighten the label gap and widen the field gap | Group with fieldset | Tweaking one field only |
| Floating heading | Space above larger than below | | Equal margins |
| Boxes in boxes | Remove the inner boundary; use space or tone | Flatten the hierarchy | Removing both levels |
| Border plus shadow | Keep the cue the system uses | | |
| Near-duplicate value | Use the dominant token | Name a real variant | A third value |
| Near-miss alignment | Use the shared edge | Move it clearly off | Magic-number nudges |
| Competing primaries | One primary, others step down | Move secondary actions | Making every button smaller |
| Low contrast | Change the token pair, in every theme | | Per-element overrides |
| Text over image | Scrim or plate, then sample the worst region | Move the text | Assuming a 32% scrim is enough |
| Scroller without a cue | Peek the next item past the edge | Visible controls | Hiding the scroller |
| Mismatched motion | One shared token | Vary delay only | Removing all feedback |
| Motion under reduced-motion | A short fade instead | Remove if decorative | A global 0.01 ms kill that hides state changes |
| Tab order against visual order | Fix DOM order | `reading-flow` only as an enhancement | Positive `tabindex` |
| Visual group without semantics | `fieldset`, `nav`, `ul`, headings | Labelled `role=group` | ARIA over a native element |

Cues add and compete, so a fix can create a new conflict. Moving something closer to its partner also moves it relative to its other neighbours. Look at the surrounding tier, not just the pair.

Before you change a value that has a purpose you can't see, such as a token used elsewhere or an offset in a component library, check where it's used.

## 4. Verify

Run under the same conditions, against the baseline:

```bash
node <skill-dir>/scripts/detect.mjs <target> --json --baseline gestalt-before.json --out gestalt-after.json
```

Exit 2 means new findings appeared. The diff separates what was fixed from what was suppressed, so never report suppressed findings as fixed. Look at any new finding, because repair often moves a problem elsewhere. Then:

- View the changed area at a narrow and a wide width.
- Tab through the changed area.
- Run the project's tests and type checks if there are any.

If a finding stays because it is intentional, record it in `gestalt.config.json` with a reason. A reason is required.

```json
{ "ignore": [{ "rule": "semantic.css-reorder", "page": "index.html", "selector": ".media", "reason": "Decorative image, no effect on meaning" }] }
```

## 5. Report

State what changed and why, the before and after counts per class, anything left and why, and what you did not verify. Report the counts as a diff, never as a score. A clean scan means only that the checks that ran found nothing, so don't present it as proof that the layout is good.
