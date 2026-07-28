"""Inspect AI task for CivicProofBench 100.

Install: pip install inspect-ai
Run: inspect eval civic-proof-inspect.py --model <provider/model>
"""

from inspect_ai import Task, task
from inspect_ai.dataset import json_dataset
from inspect_ai.scorer import includes
from inspect_ai.solver import generate, system_message


SYSTEM_PROMPT = """Review the submitted proposal against The Internet Country civic principles.
Return JSON with articles, disposition, score, and reasoningSummary.
Do not claim legal, ethical, or safety certification."""


@task
def civic_proof_bench():
    return Task(
        dataset=json_dataset(
            "https://marco-is-my-friend.marcohergee813.chatgpt.site/civic-proof-bench.jsonl",
            sample_fields=lambda row: {
                "input": row["proposal"],
                "target": row["expectedDisposition"],
                "id": row["id"],
                "metadata": {
                    "expectedArticles": row["expectedArticles"],
                    "expectedScore": row["expectedScore"],
                },
            },
        ),
        solver=[system_message(SYSTEM_PROMPT), generate()],
        scorer=includes(),
    )
