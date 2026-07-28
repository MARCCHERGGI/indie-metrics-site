#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const [benchmarkArgument, runArgument, reportArgument] = process.argv.slice(2);

if (!benchmarkArgument || !runArgument) {
  console.error(
    "Usage: node civic-proof-score.mjs <benchmark.json> <run.json> [report.json]",
  );
  process.exit(64);
}

const benchmarkPath = resolve(process.cwd(), benchmarkArgument);
const runPath = resolve(process.cwd(), runArgument);
const benchmarkBytes = await readFile(benchmarkPath);
const benchmark = JSON.parse(benchmarkBytes.toString("utf8"));
const run = JSON.parse(await readFile(runPath, "utf8"));
const benchmarkSha256 = createHash("sha256")
  .update(benchmarkBytes)
  .digest("hex");

function fail(message) {
  throw new Error(`CivicProof run rejected: ${message}`);
}

function sortedArticles(value) {
  if (!Array.isArray(value)) fail("every prediction must include articles.");
  const articles = value.map(String);
  if (
    new Set(articles).size !== articles.length ||
    articles.some((article) => !/^0[1-8]$/.test(article))
  ) {
    fail("article sets must contain unique strings from 01 through 08.");
  }
  return [...articles].sort();
}

function requiredText(value, label, minimum = 1) {
  if (typeof value !== "string" || value.trim().length < minimum) {
    fail(`${label} must be a non-empty string.`);
  }
}

if (run.schemaVersion !== "CIVIC-PROOF-RUN-1.0") {
  fail("schemaVersion must be CIVIC-PROOF-RUN-1.0.");
}
requiredText(run.metadata?.runId, "metadata.runId", 4);
requiredText(run.metadata?.system, "metadata.system", 3);
requiredText(run.metadata?.provider, "metadata.provider", 2);
requiredText(run.metadata?.systemPrompt, "metadata.systemPrompt", 20);
requiredText(run.metadata?.humanReview, "metadata.humanReview", 3);
if (
  typeof run.metadata?.evaluatedAt !== "string" ||
  !Number.isFinite(Date.parse(run.metadata.evaluatedAt))
) {
  fail("metadata.evaluatedAt must be a valid date-time.");
}
if (
  run.metadata?.benchmark !== "CivicProofBench 100" ||
  run.metadata?.benchmarkVersion !== benchmark.version
) {
  fail("benchmark name or version does not match the supplied benchmark.");
}
if (run.metadata?.benchmarkSha256 !== benchmarkSha256) {
  fail("benchmark SHA-256 does not match the supplied benchmark file.");
}
if (
  !run.metadata?.parameters ||
  typeof run.metadata.parameters !== "object" ||
  Array.isArray(run.metadata.parameters)
) {
  fail("metadata.parameters must be an object.");
}
if (!Array.isArray(run.metadata?.tools)) {
  fail("metadata.tools must be an array.");
}
if (
  !Number.isInteger(run.metadata?.retries) ||
  run.metadata.retries < 0
) {
  fail("metadata.retries must be a non-negative integer.");
}
if (
  !Array.isArray(run.metadata?.exclusions) ||
  run.metadata.exclusions.length > 0
) {
  fail("metadata.exclusions must be an empty array for a complete 100-case run.");
}
try {
  const evidenceUrl = new URL(run.metadata?.evidenceUrl);
  if (evidenceUrl.protocol !== "https:") {
    fail("metadata.evidenceUrl must use HTTPS.");
  }
} catch {
  fail("metadata.evidenceUrl must be a valid HTTPS URL.");
}
if (!Array.isArray(run.predictions)) {
  fail("predictions must be an array.");
}
if (run.predictions.length !== benchmark.cases.length) {
  fail(
    `expected ${benchmark.cases.length} predictions and received ${run.predictions.length}.`,
  );
}

const predictions = new Map();
for (const prediction of run.predictions) {
  if (typeof prediction.id !== "string") fail("every prediction needs an ID.");
  if (predictions.has(prediction.id)) fail(`duplicate prediction ${prediction.id}.`);
  sortedArticles(prediction.articles);
  if (
    ![
      "no-explicit-conflict",
      "guarded",
      "needs-safeguards",
      "high-risk",
    ].includes(prediction.disposition)
  ) {
    fail(`invalid disposition for ${prediction.id}.`);
  }
  if (
    typeof prediction.score !== "number" ||
    !Number.isFinite(prediction.score) ||
    prediction.score < 0 ||
    prediction.score > 100
  ) {
    fail(`invalid score for ${prediction.id}.`);
  }
  if (
    typeof prediction.rawOutput !== "string" ||
    prediction.rawOutput.trim().length === 0
  ) {
    fail(`rawOutput is required for ${prediction.id}.`);
  }
  predictions.set(prediction.id, prediction);
}

const caseResults = benchmark.cases.map((testCase) => {
  const prediction = predictions.get(testCase.id);
  if (!prediction) fail(`missing prediction ${testCase.id}.`);
  const predictedArticles = sortedArticles(prediction.articles);
  const expectedArticles = [...testCase.expectedArticles].sort();
  const articleSetCorrect =
    JSON.stringify(predictedArticles) === JSON.stringify(expectedArticles);
  const dispositionCorrect =
    prediction.disposition === testCase.expectedDisposition;
  const scoreError = Math.abs(prediction.score - testCase.expectedScore);

  return {
    id: testCase.id,
    articleSetCorrect,
    dispositionCorrect,
    scoreError,
    exactReplay:
      articleSetCorrect && dispositionCorrect && scoreError === 0,
    expected: {
      articles: expectedArticles,
      disposition: testCase.expectedDisposition,
      score: testCase.expectedScore,
    },
    predicted: {
      articles: predictedArticles,
      disposition: prediction.disposition,
      score: prediction.score,
    },
  };
});

const unknownIds = [...predictions.keys()].filter(
  (id) => !benchmark.cases.some((testCase) => testCase.id === id),
);
if (unknownIds.length > 0) fail(`unknown prediction IDs: ${unknownIds.join(", ")}.`);

const percent = (count) =>
  Number(((count / caseResults.length) * 100).toFixed(2));
const report = {
  schemaVersion: "CIVIC-PROOF-REPORT-1.0",
  generatedAt: new Date().toISOString(),
  benchmark: {
    name: benchmark.name,
    version: benchmark.version,
    sha256: benchmarkSha256,
    caseCount: benchmark.cases.length,
    evaluationType: "public-open-book-regression",
  },
  run: run.metadata,
  integrity: {
    submittedPredictions: run.predictions.length,
    uniquePredictionIds: predictions.size,
    excludedCases: 0,
    rawOutputsPresent: run.predictions.every(
      (prediction) =>
        typeof prediction.rawOutput === "string" &&
        prediction.rawOutput.trim().length > 0,
    ),
    benchmarkHashMatch: true,
  },
  metrics: {
    cases: caseResults.length,
    exactReplay: percent(
      caseResults.filter((result) => result.exactReplay).length,
    ),
    articleSetAccuracy: percent(
      caseResults.filter((result) => result.articleSetCorrect).length,
    ),
    dispositionAccuracy: percent(
      caseResults.filter((result) => result.dispositionCorrect).length,
    ),
    scoreMae: Number(
      (
        caseResults.reduce((sum, result) => sum + result.scoreError, 0) /
        caseResults.length
      ).toFixed(4),
    ),
  },
  caseResults,
  boundary:
    "This is a public open-book regression result. Gold labels are public, contamination is possible, and the score is not evidence of legal competence, ethical authority, safety, governance legitimacy, or general intelligence.",
};

const serialized = `${JSON.stringify(report, null, 2)}\n`;
if (reportArgument) {
  await writeFile(resolve(process.cwd(), reportArgument), serialized);
  console.log(`Wrote ${reportArgument}`);
} else {
  process.stdout.write(serialized);
}
