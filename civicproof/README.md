# CivicProofBench 100

CivicProofBench 100 is an open evaluation package created by Marco Hergi in
New York City. It contains 100 transparent cases for testing civic-risk routing
across eight published principles and cross-article cases.

## What this release contains

- `civic-proof-bench.json`, `.csv`, and `.jsonl`
- an evidence-gated public leaderboard record
- a reproducible reference consistency report
- a browser-local scorer and zero-dependency Node.js scorer
- strict run and report schemas
- a JSON-aware Inspect AI task with four published metrics
- a release verifier and read-only GitHub Actions workflow
- zero-auth Python and TypeScript clients
- a dataset card, model card, citation record, and CC0 dedication

## Verified launch result

The deterministic CIVIC-PROOF-1.0 reference engine exactly reproduced all
100 fixed cases. That proves consistency with its own published rules only. It
does not establish legal correctness, ethical authority, AI safety, real-world
harm prediction, community legitimacy, or superiority over an external model.

External models receive no score until the exact system identity, prompts,
parameters, raw outputs, retries, tools, exclusions, and benchmark hash are
available at a stable public evidence URL.

## First external open-model result

Mistral Small 3.1 completed all 100 cases through a public GitHub Actions run.
The strict score was 34% exact replay, 99% article-set accuracy, 55% disposition
accuracy, and 14.92 score MAE. The complete system prompt, parameters, raw
responses, prediction file, per-case report, and file hashes are published in
[`results/mistral-small-2503-2026-07-28`](./results/mistral-small-2503-2026-07-28).

This was executed by CivicProof project-maintainer CI. It is external-model
evidence, not independent third-party validation.

## Run it

For a complete external run, copy the template to `run.json`, fill all 100
predictions, then run:

```bash
node civic-proof-score.mjs civic-proof-bench.json run.json report.json
```

The scorer rejects a mismatched benchmark hash, incomplete metadata, exclusions,
duplicate or unknown IDs, missing predictions, invalid fields, and missing raw
outputs.

To run a provider model through Inspect AI:

```bash
inspect eval civic-proof-inspect.py --model <provider/model>
```

Or call the public deterministic reference API:

```bash
curl -X POST \
  -H "content-type: application/json" \
  -d '{"proposal":"Publish every rule change with a public audit trail and appeal process."}' \
  https://marco-is-my-friend.marcohergee813.chatgpt.site/api/nation/evaluate
```

## Public evidence

- Leaderboard: https://marco-is-my-friend.marcohergee813.chatgpt.site/nation/leaderboard
- Browser-local scorer: https://marco-is-my-friend.marcohergee813.chatgpt.site/nation/leaderboard/run
- Reference report: https://marco-is-my-friend.marcohergee813.chatgpt.site/nation/leaderboard/reference
- Contribution protocol: https://marco-is-my-friend.marcohergee813.chatgpt.site/nation/leaderboard#submit-evidence
- Complete ZIP: https://marco-is-my-friend.marcohergee813.chatgpt.site/civic-proof-evaluation-kit-v2.1.0.zip

## Evaluation boundary

CivicProofBench 100 is a public open-book regression benchmark. Gold labels are
public and contamination is possible. A score is not proof of legal competence,
ethical authority, safety, governance legitimacy, or general intelligence.

## License

The dataset is dedicated under CC0 1.0. Software examples are provided under
the MIT License unless a file states otherwise.
