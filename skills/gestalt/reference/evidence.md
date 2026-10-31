# Evidence

Read this before citing a study, number or rule. Full citations and links are in [../REFERENCES.md](../REFERENCES.md). Some items below were read only as abstracts or summaries, and that file says which. Check the original before quoting a number publicly.

## What is reasonably supported

- Wertheimer's factors combine and compete, and their strength depends on values (Wertheimer 1923).
- Proximity is lawful in dot lattices: grouping depends on relative distance (Kubovy et al. 1998), and proximity and similarity add in log-odds (Kubovy & van den Berg 2008). Lab results only.
- Structure helps search on static desktop displays: group count and size predicted search time on character displays (Tullis 1984, out-of-sample r = .80), and good grouping and alignment went with faster search and higher preference on GUIs (Parush et al. 1998, N = 75).
- Visual cues help when they match semantic groups, in menu search (Halverson & Hornof, N = 36). This is the most decision-relevant result for UI work.
- WCAG thresholds are normative. They establish compliance, not perceptual effects.

## Conditional or small

- Top-aligned labels on mobile portrait: qualitative, and dated (Baymard 2013).
- False floors: 6 of 8 users missed the scroll on one site (NN/g 2016).
- Metrics explain about a third to a half of variance in appeal or complexity ratings (Miniukovich & De Angeli 2015; Reinecke & Gajos 2013). That concerns appeal, not grouping or task success.

## Weak or contested

- Top versus right-aligned labels on desktop: 11 subjects split evenly (Das et al. 2008), and no N or statistics (Penzo 2006).
- Common region over proximity: not settled, even in the lab.
- Automatic grouping: F1 0.59 to 0.78 against view hierarchies and designer layers on mobile (Xie et al. 2022), with no human-perception study.
- Models judging UI: GPT-4 feedback precision was 0.60 against 0.83 for experts, and semantic grouping was its weakest category (2024 mockup study). Experts also agree weakly with one another (kappa 0.11 to 0.31).

## Not found

These may exist, but searches didn't find them:
- A modern web or mobile experiment isolating one Gestalt principle, or comparing cards with whitespace.
- Human-labelled ground truth for perceptual groups in UIs.
- Whether visual groups map to the experience of screen reader or zoom users.
- Common fate as a UI grouping cue, or measured vestibular outcomes from web motion.
- Low contrast or ADHD effects on UI grouping.
- A validated composite score, UI gap ratio, or just-noticeable near-miss alignment.

Most performance evidence dates from 1984 to 2008, on desktop or character displays. Transfer to modern, scrolling, responsive pages is an assumption.

## Claims to avoid

| Claim | Status | Say instead |
|---|---|---|
| "The whole is greater than the sum of its parts" | Probably a misquote; Koffka is usually credited with "different" or "something else" (verify before quoting) | The whole is perceived as its own structure |
| A fixed list of 5 to 7 laws | False. Lists differ, and factors have been added over time | Factors that bias organisation |
| Laws are innate, experience doesn't matter | False | Both autonomous processes and learning matter |
| Proximity always beats similarity | False | At these values, this cue dominated |
| A known ranking of principles | Not established | Pairwise, value-dependent results |
| Grouping is fully pre-attentive | Too strong | It can affect behaviour without report, and demand varies |
| Global perception first, universally | Too strong (Himba evidence) | Often, depending on task and culture |
| "1.5x spacing" as research | Unsupported for UI; comes from dot lattices | A heuristic, uncalibrated |
| Internal padding ≤ external gap | Practitioner lore, contradicted by Polaris tokens | Within-group gap smaller than between-group gap |
| Grouping lifts conversion by X% | No isolated evidence found | Don't claim it |
| A "Gestalt score" | No validation | Findings by class and condition |

## Thresholds in the detector

| Setting | Default | Basis |
|---|---|---|
| WCAG contrast | 4.5, 3 | Normative |
| Reflow width | 320 | Normative |
| Label ratio | 1.5 | Heuristic; don't cite the lattice figure as support |
| Tier ratio | 1.25 | Heuristic |
| Near length | 2 px | Heuristic |
| Near colour | 0.03 OKLab | Heuristic |
| Alignment near-miss | 1 to 4 px | Heuristic |
| Reduced-motion size | 400 ms | Heuristic |

Override these in `gestalt.config.json` under `thresholds`. To calibrate, label about 200 or more crops from your domain, pick the cut that meets your precision target, and publish the corpus with the threshold.
