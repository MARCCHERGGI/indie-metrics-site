# Mistral Small 3.1 on CivicProofBench 100

This directory contains the first complete external open-model run published by
the CivicProof project.

## Result

- Model: `mistral-ai/mistral-small-2503`
- GitHub Models catalog version: `1`
- Evaluated: 2026-07-28T21:00:31.351Z
- Cases: 100 of 100
- Exact replay: 34%
- Article-set accuracy: 99%
- Disposition accuracy: 55%
- Score MAE: 14.92
- Retries: 0
- Exclusions: 0
- Human review: none
- Workflow evidence: https://github.com/MARCCHERGGI/indie-metrics-site/actions/runs/30398743931

## Files

- `run.json`: complete metadata, prompt, parameters, predictions, and raw output links
- `report.json`: strict scorer output and all per-case comparisons
- `raw-responses.json`: all ten requests and unedited provider responses

SHA-256:

- `run.json`: `c965baaa02720458a7a9076c9c549bdcabce1353039635f05537d20db75013a7`
- `report.json`: `054083a63d6149d8208e98e6527fdc210691be1e09ec9519ed05c3584bbce414`
- `raw-responses.json`: `fb84ddd2e4f56f916f59868a21bb32a7c4cc4fa057c19d0f50029b261b388447`

## Verification boundary

The run was executed by CivicProof project-maintainer CI through GitHub Models.
It is reproducible external-model evidence, but it is not an independent
third-party evaluation. The benchmark and gold labels are public, so
contamination is possible. One finite score outside the schema range was
clamped to the nearest allowed boundary by the disclosed parser; the untouched
model value remains in `raw-responses.json`.
