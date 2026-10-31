# gestalt-skill

An agent skill and browser detector that audit, generate and repair web UI using Gestalt perception, with each finding labelled by how strong its evidence is.

[Türkçe](README.tr.md)

> **Status: first draft.** The rules run and pass their fixtures, but their precision on real pages has not been measured. Heuristic thresholds are uncalibrated.

## Why another design skill?

Most Gestalt advice online is confident and unsourced. This project started from a literature review and kept what held up:

- **No score.** No validated Gestalt score exists. Findings are sorted into `normative_failure`, `measured`, `candidate` and `judged`.
- **No invented numbers.** "1.5x spacing" comes from dot lattices, not interfaces. Heuristic thresholds are labelled as such and can be configured.
- **Groups must exist beyond the screen.** Visual groups are checked against tab order, semantics, narrow widths and reduced motion.

The sources are in [skills/gestalt/REFERENCES.md](skills/gestalt/REFERENCES.md), and the full review is in [docs/research](docs/research).

## Install

Needs Node 22+. The detector also needs Chrome, Edge or Chromium installed.

```bash
npx gestalt-skill install
```

This installs to the project's `.claude/skills` and `.agents/skills`, or to whichever agent folders it finds. Use `--providers=claude,codex,cursor` to choose and `--global` for your home folder.

Other routes:

```bash
npx skills add salveignis/gestalt-skill
```

In Claude Code, `/plugin marketplace add salveignis/gestalt-skill` then `/plugin install gestalt@gestalt-skill`. The command is then `/gestalt:gestalt`.

## Agent commands

| Command | What it does |
|---|---|
| `/gestalt audit [target]` | Measures the page, decides each candidate, and adds labelled judgments |
| `/gestalt generate [brief]` | Writes a grouping plan, builds from it, and verifies |
| `/gestalt fix [target]` | Repairs by shared cause with the weakest cue that works, then re-measures against a baseline |
| `/gestalt explain [topic]` | Explains a principle, its evidence and its limits |

## Terminal commands

```bash
npx gestalt-skill detect https://localhost:3000 --viewports 320,768,1280 --artifacts crops
npx gestalt-skill detect ./site --json --out before.json
npx gestalt-skill detect ./site --baseline before.json
npx gestalt-skill rules
npx gestalt-skill check
npx gestalt-skill update
npx gestalt-skill uninstall
```

The exit code is 0 with no findings, 2 with findings, and 1 if the scan failed. With `--baseline`, 2 means new findings appeared.

The detector has no dependencies. It drives an installed browser over the DevTools Protocol, serves local files only on 127.0.0.1, and sends no telemetry.

## What it checks

24 rules cover proximity, similarity, continuity, common region, closure, figure-ground, common fate, focal point and semantic parity. Run `npx gestalt-skill rules` for the list.

It can't detect meaning. It can show that a heading is closer to the previous section than to its text, but only a person or model can decide whether two things belong together. That's why most rules produce candidates with a question attached.

**Not covered yet:** hover and focus states, 200% text resize, and JS, canvas or WebGL motion. For opened menus and error states, pass a small script with `--setup`, or seed storage with `--init`. These scripts run in the audited page.

## Configuration

`gestalt.config.json` in the working directory:

```json
{
  "viewports": [360, 1440],
  "thresholds": { "labelAmbiguous": 1.5, "alignNearPx": 3 },
  "ignore": [{ "rule": "semantic.css-reorder", "selector": ".media", "reason": "Decorative image, order doesn't affect meaning" }]
}
```

An ignore needs a reason, and can be scoped with `page`.

## Contributing

The most useful contribution is a labelled corpus: real page crops marked as true or false for a rule, so that thresholds can be calibrated and precision published. See [CONTRIBUTING.md](CONTRIBUTING.md).

```bash
npm test
```

## License

MIT
