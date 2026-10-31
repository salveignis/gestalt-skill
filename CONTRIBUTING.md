# Contributing

## Most useful right now

1. **Labelled pages.** For a rule, collect real page crops and mark each finding true or false. This is what lets a threshold be calibrated and a precision figure be published.
2. **Source checks.** `skills/gestalt/REFERENCES.md` says how each source was read. If you have access to one listed under "Known gaps", correct the claim that rests on it.
3. **False positives.** Open an issue with the URL or a minimal HTML file, the finding, and why it's wrong.

## Rules

- A new rule needs a fixture that triggers it, in `tests/fixtures/`, and a test.
- Choose the evidence class honestly. Use `measured` only when the meaning is close to certain, and `candidate` with a `question` when it depends on intent.
- State where a threshold came from in `threshold.provenance`. "Heuristic, uncalibrated" is an acceptable answer. An invented citation is not.
- Keep the runtime free of dependencies.

## Claims

Cite the original wherever possible, and say so if you've only read a summary. Add it to `REFERENCES.md` with its access level.

## Development

```bash
npm test
```

```bash
npm pack --dry-run
```
