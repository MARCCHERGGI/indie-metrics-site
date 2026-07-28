---
pretty_name: CivicProofBench 100
license: cc0-1.0
task_categories:
  - text-classification
language:
  - en
tags:
  - ai-governance
  - civic-technology
  - evaluation
  - transparency
size_categories:
  - n<1K
---

# CivicProofBench 100

CivicProofBench 100 is a public evaluation dataset authored by Marco Hergi. It contains 100 proposals for testing transparent civic-risk routing across eight articles of The Internet Country founding constitution.

## Dataset structure

Each row includes:

- `id`
- `category`
- `proposal`
- `expectedArticles`
- `expectedDisposition`
- `expectedScore`

The dataset contains 12 cases for each constitutional category and four cross-article cases.

## Reproducibility

The reference engine is deterministic. It normalizes the proposal, filters direct safeguard negation, matches published phrases, routes matches to constitutional articles, and applies:

`score = clamp(100 - 12 * riskSignalCount + 4 * safeguardSignalCount)`

The benchmark file SHA-256 is published in `/civic-proof-leaderboard.json`.

## Intended uses

- Test whether an AI can identify explicitly stated civic risks.
- Compare article routing and disposition accuracy.
- Challenge a transparent rules engine with adversarial cases.
- Teach evaluation, provenance, and accountable human review.

## Limitations

The benchmark does not measure legality, ethics, safety, public legitimacy, or real-world harm probability. Lexical cases are intentionally narrow. External models must publish raw outputs and methodology before leaderboard inclusion.

## Creator

Marco Hergi, New York City

Canonical project: https://marco-is-my-friend.marcohergee813.chatgpt.site/nation/leaderboard

License: CC0-1.0
