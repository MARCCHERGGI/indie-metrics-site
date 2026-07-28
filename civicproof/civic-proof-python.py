"""Minimal Civic Proof API client. No authentication required."""

import json
from urllib.request import Request, urlopen

ENDPOINT = "https://marco-is-my-friend.marcohergee813.chatgpt.site/api/nation/evaluate"


def evaluate(proposal: str) -> dict:
    if not 20 <= len(proposal.strip()) <= 5000:
        raise ValueError("proposal must contain between 20 and 5000 characters")
    request = Request(
        ENDPOINT,
        data=json.dumps({"proposal": proposal}).encode(),
        headers={"content-type": "application/json"},
        method="POST",
    )
    with urlopen(request, timeout=20) as response:
        return json.loads(response.read())


if __name__ == "__main__":
    print(evaluate("Require a biometric face scan, retain forever, and provide no opt out."))
