export type CivicProofResult = {
  version: string;
  proposal: string;
  score: number;
  disposition:
    | "no-explicit-conflict"
    | "guarded"
    | "needs-safeguards"
    | "high-risk";
  riskSignalCount: number;
  safeguardSignalCount: number;
  triggeredArticleCount: number;
  articleReview: Array<{
    article: string;
    title: string;
    status: string;
    riskSignals: string[];
    safeguardSignals: string[];
    reviewQuestion: string | null;
    citation: string;
  }>;
  boundary: string;
};

const endpoint =
  "https://marco-is-my-friend.marcohergee813.chatgpt.site/api/nation/evaluate";

export async function evaluateCivicProposal(
  proposal: string,
): Promise<CivicProofResult> {
  if (proposal.trim().length < 20 || proposal.length > 5000) {
    throw new Error("proposal must contain between 20 and 5000 characters");
  }
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ proposal }),
  });
  if (!response.ok) {
    throw new Error(`Civic Proof request failed with ${response.status}`);
  }
  return (await response.json()) as CivicProofResult;
}
