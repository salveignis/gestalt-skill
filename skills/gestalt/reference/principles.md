# Principles

Each entry gives what the principle says, its source, its web form, and how it fails. Strength of evidence is in [evidence.md](evidence.md).

**Terms.** "Gestalt laws" oversells them: Wertheimer's working word was *factor*. The 1938 translation's "Uniform Destiny" is common fate, and its "Direction" and "Good Curve" are good continuation. Figure-ground is a separate question from grouping: grouping asks what belongs together, figure-ground asks what is in front and which side owns an edge.

## Grouping by relation

**Proximity** (Wertheimer 1923). Nearer elements group. Lawful in lab displays, and what counts is relative distance.
- Web: `gap`, parent padding, nested stacks, two or more tiers.
- Fails as: uniform spacing everywhere; a label equidistant between fields; a heading closer to the section above; an action far from its object; a pair split when stacked on mobile.

**Similarity** (Wertheimer 1923). Like parts band together. Can defeat proximity at the right values.
- Web: component tokens, one style per role; interactive styling reserved for interactive things.
- Fails as: a pill tag that looks like a button; text in link colour; almost-identical values (7 and 8 px radius) that read as errors; state shown by colour alone (WCAG 1.4.1).

**Common region** (Palmer 1992). Elements within a bounded area group. Can override other cues, which is useful when spacing can't change.
- Web: `background`, `border`, `border-radius`; a card, panel or section.
- Fails as: boxes in boxes; a box per filter group when spacing already groups them; full-width bordered sections that form false floors; cards for homogeneous items that need comparison.

**Connectedness** (Palmer & Rock 1994). Elements joined by a line or uniform region read as a unit.
- Web: stepper connectors, tree lines, timeline rails, `border-inline-start`, pseudo-elements.
- Fails as: connectors that end short or break on wrap; a divider that joins what it should split.

**Good continuation** (Wertheimer 1923). Elements along a smooth line or direction cohere. Aligned edges act as this in layouts, but that link is an application, not a lab finding.
- Web: grid, subgrid, baseline alignment, shared edges, consistent indentation.
- Fails as: card footers at varying heights; an edge that almost lines up; a column that loses its line between sections.

**Closure** (Wertheimer 1923). Self-enclosed units are seen as units, and incomplete shapes can be completed.
- Web: icons on a consistent grid, partial-peek carousels, skeletons, implied edges.
- Fails as: a scroller with items ending cleanly at the edge, or a page with nothing crossing the fold, looks finished (illusion of completeness); a crop through text reads as a bug.

**Symmetry and parallelism** (listed for Wertheimer 1923 by Wagemans et al.). Symmetric or parallel parts cohere.
- Web: centred short compositions, equal tracks, mirrored structures.
- Fails as: centred long text or forms; symmetry imposed on unequal content.

**Common fate** (Wertheimer 1923; generalized by Sekuler & Bennett 2001 to shared luminance changes). What changes together groups. No direct UI experiment was found, so its use in UI is extrapolated.
- Web: shared duration and easing, `view-transition-class`, FLIP, group hover or selected states.
- Fails as: one member lagging or moving differently; stagger so large it reads as separate events; motion that ignores `prefers-reduced-motion`.

**Synchrony** (Lee & Blake 1999). Temporal structure alone may group, though mechanism and stimuli are contested. Don't rest a design argument on it.

## Depth and organisation

**Figure-ground.** A region is seen as figure with a shape, and the rest as ground passing behind. Determinants include convexity, symmetry and the lower region, all context-dependent.
- Web: surface roles, elevation, `<dialog>` with `::backdrop`, scrims, contrast, sticky headers.
- Fails as: low contrast; text on a busy photo; a modal that doesn't lift visually or take focus; too many elevation levels.

**Prägnanz.** The percept takes the simplest structure the conditions allow. Too imprecise to predict with, but useful as a design question: what is the simplest structure that still says this?
- Web: fewer tokens, levels and cue types.
- Fails as: border plus shadow plus fill on one surface; a new style for every exception.

**Uniform connectedness** (Palmer & Rock 1994). A connected uniform region tends to form a unit. Its claim to be the earliest stage is disputed (Peterson 1994; Kimchi 2000).

**Focal point** is a design term, not a Gestalt factor. It's kept here because it follows from figure-ground and contrast of scale.
- Web: scale, surrounding space, one primary action.
- Fails as: several equal primary actions; a hero with no clear next step.

**Past experience and objective set** (Wertheimer 1923). Habit and preceding context can bias grouping, although Wertheimer doubted habit as an explanation. For interfaces, this is a reason to follow familiar patterns and keep repeated patterns consistent.

## Cues in combination

- Proximity and similarity add in log-odds in tested lattices (Kubovy & van den Berg 2008), so a similarity cue can offset some spacing loss. Don't assume every pair adds.
- Common region beat connectedness in tested displays (Montoro et al. 2017). This is one pairing, not a ranking.
- Boundaries are extrinsic cues: they add elements to the page. When a boundary and spacing disagree, fix the disagreement instead of relying on the boundary.

## The semantic channel

Visual proximity carries nothing into the accessibility tree. About 72% of surveyed screen reader users find information on long pages via headings (WebAIM 2024, self-selected). At high zoom, whitespace forces panning and loses context (small studies). So for each meaningful group, ask: what is its semantic form, and what happens to it at 320 px? [patterns.md](patterns.md) has the pairings.
