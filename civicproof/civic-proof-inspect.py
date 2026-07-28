"""Inspect AI task for CivicProofBench 100.

Install: pip install inspect-ai
Run: inspect eval civic-proof-inspect.py --model <provider/model>

The task expects one JSON object with articles, disposition, score, and
reasoningSummary. It reports exact replay, article-set accuracy, disposition
accuracy, and score mean absolute error.
"""

import json
import re

from inspect_ai import Task, task
from inspect_ai.dataset import Sample, json_dataset
from inspect_ai.scorer import Score, Target, mean, scorer, stderr
from inspect_ai.solver import generate, system_message
from inspect_ai.solver import TaskState


SYSTEM_PROMPT = """Review the submitted proposal against The Internet Country civic principles.
Return only one JSON object with:
{"articles":["01"],"disposition":"needs-safeguards","score":76,"reasoningSummary":"..."}
Articles must be unique strings from 01 through 08. Disposition must be one of:
no-explicit-conflict, guarded, needs-safeguards, high-risk.
Do not claim legal, ethical, or safety certification."""


def record_to_sample(row):
    expected = {
        "articles": row["expectedArticles"],
        "disposition": row["expectedDisposition"],
        "score": row["expectedScore"],
    }
    return Sample(
        input=row["proposal"],
        target=json.dumps(expected, separators=(",", ":")),
        id=row["id"],
        metadata={"category": row["category"]},
    )


def parse_json_object(completion):
    text = completion.strip()
    fenced = re.fullmatch(r"```(?:json)?\s*(\{.*\})\s*```", text, re.DOTALL)
    if fenced:
        text = fenced.group(1)
    value = json.loads(text)
    if not isinstance(value, dict):
        raise ValueError("output is not a JSON object")
    return value


@scorer(
    metrics={
        "exact_replay": [mean(), stderr()],
        "article_set_accuracy": [mean(), stderr()],
        "disposition_accuracy": [mean(), stderr()],
        "score_absolute_error": [mean(), stderr()],
    }
)
def civic_proof_score():
    async def score(state: TaskState, target: Target) -> Score:
        try:
            predicted = parse_json_object(state.output.completion)
            expected = json.loads(target.text)
            predicted_articles = predicted.get("articles")
            if not isinstance(predicted_articles, list):
                raise ValueError("articles is not an array")
            normalized_articles = sorted(str(item) for item in predicted_articles)
            valid_articles = (
                len(normalized_articles) == len(set(normalized_articles))
                and all(re.fullmatch(r"0[1-8]", item) for item in normalized_articles)
            )
            expected_articles = sorted(expected["articles"])
            article_correct = valid_articles and normalized_articles == expected_articles
            disposition_correct = (
                predicted.get("disposition") == expected["disposition"]
            )
            predicted_score = predicted.get("score")
            if not isinstance(predicted_score, (int, float)) or isinstance(
                predicted_score, bool
            ):
                raise ValueError("score is not numeric")
            score_error = abs(float(predicted_score) - float(expected["score"]))
            exact = article_correct and disposition_correct and score_error == 0
            return Score(
                value={
                    "exact_replay": 1 if exact else 0,
                    "article_set_accuracy": 1 if article_correct else 0,
                    "disposition_accuracy": 1 if disposition_correct else 0,
                    "score_absolute_error": score_error,
                },
                answer=state.output.completion,
                metadata={"expected": expected, "predicted": predicted},
            )
        except (json.JSONDecodeError, TypeError, ValueError) as error:
            return Score(
                value={
                    "exact_replay": 0,
                    "article_set_accuracy": 0,
                    "disposition_accuracy": 0,
                    "score_absolute_error": 100,
                },
                answer=state.output.completion,
                explanation=f"Invalid CivicProof JSON: {error}",
            )

    return score


@task
def civic_proof_bench():
    return Task(
        dataset=json_dataset(
            "https://marco-is-my-friend.marcohergee813.chatgpt.site/civic-proof-bench.jsonl",
            sample_fields=record_to_sample,
        ),
        solver=[system_message(SYSTEM_PROMPT), generate()],
        scorer=civic_proof_score(),
    )
