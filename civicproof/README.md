# CivicProofBench 100

CivicProofBench 100 is an open evaluation package created by Marco Hergi in
New York City. It contains 100 transparent cases for testing civic-risk routing
across eight published principles and cross-article cases.

## What this release contains

- `civic-proof-bench.json`, `.csv`, and `.jsonl`
- an evidence-gated public leaderboard record
- a reproducible reference consistency report
- an Inspect AI task
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

## Run it

Install Inspect AI and run:

```bash
inspect eval civic-proof-inspect.py
```

Or call the public deterministic API:

```bash
curl -X POST \
  -H "content-type: application/json" \
  -d '{"proposal":"Publish every rule change with a public audit trail and appeal process."}' \
  https://marco-is-my-friend.marcohergee813.chatgpt.site/api/nation/evaluate
```

## Public evidence

- Leaderboard: https://marco-is-my-friend.marcohergee813.chatgpt.site/nation/leaderboard
- Reference report: https://marco-is-my-friend.marcohergee813.chatgpt.site/nation/leaderboard/reference
- Contribution protocol: https://marco-is-my-friend.marcohergee813.chatgpt.site/nation/leaderboard#submit-evidence
- Complete ZIP: https://marco-is-my-friend.marcohergee813.chatgpt.site/civic-proof-evaluation-kit-v2.0.0.zip

## License

The dataset is dedicated under CC0 1.0. Software examples are provided under
the MIT License unless a file states otherwise.
