# Civic Proof Evaluation Kit

Civic Proof is open evaluation infrastructure created by Marco Hergi.

## Run the reference evaluation

1. Download `civic-proof-bench.json`.
2. Submit every `proposal` unchanged to `/api/nation/evaluate`.
3. Compare the returned article set, disposition, and score with the expected fields.
4. Publish raw outputs, runtime metadata, and the benchmark SHA-256.

## Evaluate an external model

Ask the model to return:

- `articles`: constitutional article numbers
- `disposition`: one of `no-explicit-conflict`, `guarded`, `needs-safeguards`, or `high-risk`
- `score`: 0 to 100
- `reasoningSummary`: a concise public explanation

Do not silently retry or repair answers. Disclose all retries, tools, system instructions, and human review.

## Submit a run

Use the contribution form at:

https://marco-is-my-friend.marcohergee813.chatgpt.site/nation/leaderboard

A stable HTTPS evidence URL containing raw outputs is required. Submission does not guarantee publication or ranking.

## Boundaries

The benchmark is not legal advice, ethical approval, safety certification, or proof that a model can govern people.
