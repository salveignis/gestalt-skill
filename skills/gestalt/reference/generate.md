# Generate

Plan the groups first and draw them second. Most grouping faults come from styling before deciding what belongs together. This command governs structure, and any brand, palette, typeface or existing design system takes priority over taste here. Pair it with the project's own design system or another design skill for visual direction.

## 1. Read the context

Look for existing tokens, components and layout conventions, and reuse them. Note the content, the primary task and the smallest supported width.

## 2. Write the grouping plan

Before writing markup, write a short plan. Show it in your reply, and save it to a file only if the user wants one:

```text
Page goal: <one sentence>
Focal point: <the single next step per view>

Tree (a group is what the user would name as one thing):
  Section: Delivery address  [tier: section]
    Group: Name             [tier: between]
      Pair: label + input   [tier: within]
    ...

Per level:
  Level | Primary cue   | Second cue only if needed | Semantic element
  Pair  | proximity     | none                      | label + input
  Group | proximity     | alignment                 | div / li
  Set   | heading+space | none                      | fieldset + legend
  Page  | space         | tone                      | section + heading
```

Test the plan against these questions:
- Does each visual group mean something you could name? If not, remove the group.
- Is each named thing a group? Cues that imply a false structure are worse than none.
- Is there more than one boundary on any level? Remove one.
- Does each meaningful group have a semantic element, a heading, or a good reason not to?
- What becomes of each group at 320 px? Name what wraps or stacks, and what must stay adjacent.

## 3. Build tokens by relationship

Name spacing for what it does, so the rule can be checked. Copy or adapt `assets/gestalt-tokens.css`, or map the same names onto existing tokens:

- `--gap-within`: label to input, icon to text, title to subtitle
- `--gap-between`: field to field, card to card
- `--gap-section`: section to section

Keep at least one step of the scale between tiers, since a one-step jump such as 16 to 20 px can be invisible. A ratio of 1:2 to 1:4 between adjacent tiers is a practical starting point, consistent with documented values such as GOV.UK's 5 to 20 or 30 px. It is a heuristic, not a finding from research. Check that tiers stay distinct at each breakpoint.

## 4. Implement

Follow [patterns.md](patterns.md) for the component at hand. Throughout:

- Parents own spacing, with `gap` and padding. Avoid margins on children. Nest stacks when gaps differ.
- Keep DOM order equal to reading order. Avoid `order` and `row-reverse` for interactive content.
- Use container queries for components that appear in several widths, and logical properties for insets.
- Use `rem` for spacing tokens so that it scales with text.
- Align repeated inner rows with subgrid, with a tested fallback where needed.
- Allow growth with `min-height`, wrapping and no fixed text heights, because translation breaks fixed groups first.
- Give a group's members one duration and easing. Vary only delay, and provide a `prefers-reduced-motion` alternative that keeps state changes visible.
- Use one primary action per view or group.

## 5. Verify

Do not call it finished until you have measured the result:

```bash
node <skill-dir>/scripts/detect.mjs <target> --json --out gestalt-report.json --artifacts gestalt-crops
```

Fix `normative_failure` and `measured` findings. Decide each `candidate` and record your reason. The exit code stays 2 while candidates remain, even once they are decided, so use `--fail-on measured` in scripts or record decisions as reasoned ignores. Then look at the page rendered at a narrow and a wide width, and compare the groups you see with the plan. Say what you verified and which states you did not.
