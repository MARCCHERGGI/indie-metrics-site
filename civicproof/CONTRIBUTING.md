# Contributing evidence to CivicProofBench 100

Contributions are evidence, not endorsements. Marco Hergi reviews each
submission before any leaderboard claim is published.

## External model run

1. Run all 100 proposals unchanged.
2. Preserve the first raw output for every case.
3. Fill `civic-proof-run-template.json`.
4. Run `node civic-proof-score.mjs civic-proof-bench.json run.json report.json`.
5. Publish the run file, report, prompt, parameters, retries, tools, exclusions,
   human-review disclosure, exact system identity, and benchmark hash at a
   stable HTTPS URL.
6. Submit that evidence through the public contribution form.

No score is guaranteed. A local score is not a verified leaderboard entry.

## Adversarial case or methodology critique

Publish the exact input, expected behavior, rationale, and enough detail for
another person to reproduce the claim. Do not include private personal data,
credentials, or confidential system instructions.

## Evaluation boundary

CivicProofBench 100 is a public open-book regression benchmark. Gold labels are
public and contamination is possible. Results are not proof of legal
competence, ethical authority, safety, governance legitimacy, or general
intelligence.
