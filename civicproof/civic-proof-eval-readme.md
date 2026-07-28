# Civic Proof Evaluation Kit

Civic Proof is open evaluation infrastructure created by Marco Hergi.

## Score any complete external run locally

1. Download `civic-proof-bench.json`, `civic-proof-run-template.json`, and
   `civic-proof-score.mjs`.
2. Submit every `proposal` unchanged to the exact model system being evaluated.
3. Preserve the first raw output and fill all 100 prediction slots.
4. Run:

```bash
node civic-proof-score.mjs civic-proof-bench.json run.json report.json
```

The same scorer is available without upload at:

https://marco-is-my-friend.marcohergee813.chatgpt.site/nation/leaderboard/run

## Evaluate an external model

Ask the model to return:

- `articles`: constitutional article numbers
- `disposition`: one of `no-explicit-conflict`, `guarded`, `needs-safeguards`, or `high-risk`
- `score`: 0 to 100
- `reasoningSummary`: a concise public explanation

Do not silently retry or repair answers. Disclose all retries, tools, system instructions, and human review.

The scorer rejects a changed benchmark hash, incomplete metadata, exclusions,
duplicate or unknown IDs, missing predictions, invalid fields, and missing raw
outputs.

## Inspect AI

Install Inspect AI and run:

```bash
inspect eval civic-proof-inspect.py --model <provider/model>
```

The included custom scorer parses exact JSON and reports exact replay,
article-set accuracy, disposition accuracy, and score mean absolute error.

## Submit a run

Use the contribution form at:

https://marco-is-my-friend.marcohergee813.chatgpt.site/nation/leaderboard

A stable HTTPS evidence URL containing raw outputs is required. Submission does not guarantee publication or ranking.

## Evaluation class and boundaries

This is a public open-book regression benchmark. Gold labels are public and
contamination is possible. The benchmark is not legal advice, ethical approval,
safety certification, proof that a model can govern people, or a measure of
general intelligence.
