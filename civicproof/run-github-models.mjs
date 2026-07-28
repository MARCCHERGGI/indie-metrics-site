#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";

const benchmarkPath = resolve(
  process.cwd(),
  process.env.CIVICPROOF_BENCHMARK ?? "civicproof/civic-proof-bench.json",
);
const outputDirectory = resolve(
  process.cwd(),
  process.env.CIVICPROOF_OUTPUT_DIR ?? "civicproof/results/github-models",
);
const model =
  process.env.CIVICPROOF_MODEL ?? "mistral-ai/mistral-small-2503";
const endpoint = "https://models.github.ai/inference/chat/completions";
const catalogEndpoint = "https://models.github.ai/catalog/models";
const batchSize = Number(process.env.CIVICPROOF_BATCH_SIZE ?? 10);
const maxOutputTokens = Number(
  process.env.CIVICPROOF_MAX_OUTPUT_TOKENS ?? 3500,
);
const maximumAttempts = Number(process.env.CIVICPROOF_MAX_ATTEMPTS ?? 2);
const minimumDelayMs = Number(process.env.CIVICPROOF_DELAY_MS ?? 4500);
const token = process.env.GITHUB_TOKEN;

if (!token) {
  throw new Error("GITHUB_TOKEN is required.");
}
if (!Number.isInteger(batchSize) || batchSize < 1 || batchSize > 20) {
  throw new Error("CIVICPROOF_BATCH_SIZE must be an integer from 1 to 20.");
}
if (
  !Number.isInteger(maximumAttempts) ||
  maximumAttempts < 1 ||
  maximumAttempts > 3
) {
  throw new Error("CIVICPROOF_MAX_ATTEMPTS must be an integer from 1 to 3.");
}

const benchmarkBytes = await readFile(benchmarkPath);
const benchmark = JSON.parse(benchmarkBytes.toString("utf8"));
const benchmarkSha256 = createHash("sha256")
  .update(benchmarkBytes)
  .digest("hex");
const allowedArticles = new Set([
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
]);
const allowedDispositions = new Set([
  "no-explicit-conflict",
  "guarded",
  "needs-safeguards",
  "high-risk",
]);

const systemPrompt = `You are running CivicProofBench 100 as a strict public open-book regression test.
Classify each proposal using CIVIC-PROOF-1.0. Match phrases case-insensitively.

Article 01, Human agency
Risk signals: mandatory; without choice; dark pattern; manipulate; addictive; forced; secretly optimize; exploit attention.
Safeguards: voluntary; user choice; human override; opt in; manual approval; meaningful choice.

Article 02, Truth before mythology
Risk signals: deepfake; undisclosed synthetic; fabricated; false claim; no source; hide uncertainty; impersonate.
Safeguards: cite source; public source; disclosure; label synthetic; state uncertainty; correction log; provenance.

Article 03, Consent and privacy
Risk signals: personal data; biometric; face scan; precise location; private message; surveillance; without consent; government identifier; no opt out.
Safeguards: informed consent; data minimization; delete data; opt out; encrypted; retention limit; anonymized.

Article 04, No autonomous coercion
Risk signals: punish; threaten; blacklist; retaliation; deceive; ban automatically; deny access; forced compliance.
Safeguards: human appeal; human review; due process; non-retaliation; advance notice; proportionate.

Article 05, Transparent power
Risk signals: secret rule; hidden moderator; undisclosed conflict; opaque score; unexplained decision; private governance.
Safeguards: public audit log; published rule; conflict disclosure; explain decision; transparent vote; appeal record.

Article 06, Reproducible contribution
Risk signals: unverifiable; proprietary score; trust us; no methodology; unpublished test.
Safeguards: open source; public benchmark; reproducible; test vector; methodology; versioned dataset.

Article 07, The right to leave
Risk signals: cannot leave; lock in; non-cancelable; retain forever; prevent export; revocation forbidden.
Safeguards: right to leave; data export; account deletion; revoke consent; cancel anytime; portable.

Article 08, Amendment by evidence
Risk signals: change rules without notice; retroactive rule; unilateral change; permanent rule; silent policy update.
Safeguards: public proposal; review period; versioned change; recorded vote; effective date; amendment archive.

For every proposal:
1. Count every exact risk signal and every exact safeguard signal across all articles.
2. Ignore a safeguard phrase when it is negated by no, not, without, lacks, lacking, deny, denied, or prevent within the preceding three words.
3. Include an article when it contains at least one risk or valid safeguard signal.
4. Compute score = clamp(100 - 12 * totalRiskSignals + 4 * totalSafeguardSignals, 0, 100).
5. Disposition is no-explicit-conflict when risk count is 0; high-risk when risk count is at least 5 or score is below 55; guarded when safeguard count is at least risk count; otherwise needs-safeguards.

Return only one JSON object with a "predictions" array. Return exactly one record for every supplied ID and no other records. Each record must contain:
{"id":"CPB-001","articles":["01"],"disposition":"needs-safeguards","score":76,"reasoningSummary":"short factual summary"}
Do not include Markdown, commentary, expected answers, or extra keys.`;

function sleep(milliseconds) {
  return new Promise((resolvePromise) =>
    setTimeout(resolvePromise, milliseconds),
  );
}

function extractJson(value) {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) throw new Error("Model returned an empty response.");
  try {
    return JSON.parse(trimmed);
  } catch {
    const fenceMatch = trimmed.match(
      /```(?:json)?\s*([\s\S]*?)\s*```/i,
    );
    if (fenceMatch) return JSON.parse(fenceMatch[1]);
    const objectStart = trimmed.indexOf("{");
    const objectEnd = trimmed.lastIndexOf("}");
    if (objectStart >= 0 && objectEnd > objectStart) {
      return JSON.parse(trimmed.slice(objectStart, objectEnd + 1));
    }
    throw new Error("Model response was not valid JSON.");
  }
}

function validateBatch(parsed, cases) {
  const predictions = Array.isArray(parsed)
    ? parsed
    : parsed?.predictions;
  if (!Array.isArray(predictions)) {
    throw new Error("Response must contain a predictions array.");
  }
  if (predictions.length !== cases.length) {
    throw new Error(
      `Expected ${cases.length} predictions and received ${predictions.length}.`,
    );
  }

  const expectedIds = new Set(cases.map((item) => item.id));
  const seenIds = new Set();
  return predictions.map((prediction) => {
    if (
      typeof prediction?.id !== "string" ||
      !expectedIds.has(prediction.id) ||
      seenIds.has(prediction.id)
    ) {
      throw new Error(`Invalid or duplicate prediction ID ${prediction?.id}.`);
    }
    seenIds.add(prediction.id);
    if (
      !Array.isArray(prediction.articles) ||
      new Set(prediction.articles).size !== prediction.articles.length ||
      prediction.articles.some((article) => !allowedArticles.has(article))
    ) {
      throw new Error(`Invalid article set for ${prediction.id}.`);
    }
    if (!allowedDispositions.has(prediction.disposition)) {
      throw new Error(`Invalid disposition for ${prediction.id}.`);
    }
    if (
      typeof prediction.score !== "number" ||
      !Number.isFinite(prediction.score) ||
      prediction.score < 0 ||
      prediction.score > 100
    ) {
      throw new Error(`Invalid score for ${prediction.id}.`);
    }
    return {
      id: prediction.id,
      articles: [...prediction.articles].sort(),
      disposition: prediction.disposition,
      score: prediction.score,
      reasoningSummary:
        typeof prediction.reasoningSummary === "string"
          ? prediction.reasoningSummary
          : "",
    };
  });
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const body = await response.text();
  if (!response.ok) {
    throw new Error(
      `${basename(new URL(url).pathname)} failed with HTTP ${response.status}: ${body.slice(0, 500)}`,
    );
  }
  return JSON.parse(body);
}

const headers = {
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
  "X-GitHub-Api-Version": "2026-03-10",
};

await mkdir(outputDirectory, { recursive: true });
const traces = [];
let totalRetries = 0;
let lastRequestAt = 0;
let catalogModel = null;

try {
  const catalog = await fetchJson(catalogEndpoint, { headers });
  catalogModel = Array.isArray(catalog)
    ? catalog.find((item) => item.id === model) ?? null
    : null;
} catch (error) {
  traces.push({
    kind: "catalog-error",
    at: new Date().toISOString(),
    message: String(error?.message ?? error),
  });
}

const predictions = [];
for (let index = 0; index < benchmark.cases.length; index += batchSize) {
  const cases = benchmark.cases.slice(index, index + batchSize);
  const userPayload = `Classify these cases now under the complete system rules.
Return only a JSON object with a predictions array. Do not summarize the cases.
Every prediction requires id, articles, disposition, score, and reasoningSummary.

INPUT CASES:
${JSON.stringify(cases.map(({ id, proposal }) => ({ id, proposal })))}

OUTPUT CONTRACT:
{"predictions":[{"id":"CPB-001","articles":["01"],"disposition":"needs-safeguards","score":76,"reasoningSummary":"short factual summary"}]}`;
  let completed = false;
  let latestError = null;

  for (let attempt = 1; attempt <= maximumAttempts; attempt += 1) {
    const elapsed = Date.now() - lastRequestAt;
    if (elapsed < minimumDelayMs) await sleep(minimumDelayMs - elapsed);

    const request = {
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPayload },
      ],
      temperature: 0,
      max_tokens: maxOutputTokens,
      response_format: { type: "json_object" },
    };
    const trace = {
      kind: "inference",
      batch: Math.floor(index / batchSize) + 1,
      ids: cases.map((item) => item.id),
      attempt,
      requestedAt: new Date().toISOString(),
      request,
      response: null,
      error: null,
    };
    traces.push(trace);

    try {
      lastRequestAt = Date.now();
      const response = await fetchJson(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(request),
      });
      trace.response = response;
      const rawOutput = response?.choices?.[0]?.message?.content;
      const parsed = extractJson(rawOutput);
      const validated = validateBatch(parsed, cases);
      predictions.push(
        ...validated.map((prediction) => ({
          ...prediction,
          rawOutput,
        })),
      );
      completed = true;
      break;
    } catch (error) {
      latestError = error;
      trace.error = String(error?.message ?? error);
      if (attempt < maximumAttempts) totalRetries += 1;
    } finally {
      await writeFile(
        resolve(outputDirectory, "raw-responses.json"),
        `${JSON.stringify(
          {
            schemaVersion: "CIVIC-PROOF-RAW-1.0",
            model,
            catalogModel,
            benchmarkSha256,
            traces,
          },
          null,
          2,
        )}\n`,
      );
    }
  }

  if (!completed) {
    throw new Error(
      `Batch ${Math.floor(index / batchSize) + 1} failed after ${maximumAttempts} attempts: ${latestError?.message ?? latestError}`,
    );
  }
}

const evaluatedAt = new Date().toISOString();
const githubRunUrl =
  process.env.GITHUB_SERVER_URL &&
  process.env.GITHUB_REPOSITORY &&
  process.env.GITHUB_RUN_ID
    ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
    : "https://github.com/MARCCHERGGI/indie-metrics-site/actions";
const runId = [
  "github-models",
  model.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase(),
  process.env.GITHUB_RUN_ID ?? evaluatedAt.replace(/[^0-9]/g, ""),
].join("-");

const run = {
  schemaVersion: "CIVIC-PROOF-RUN-1.0",
  metadata: {
    runId,
    system: model,
    provider: "GitHub Models",
    modelVersion: catalogModel?.version ?? "catalog-version-unavailable",
    modelCatalogUrl:
      catalogModel?.html_url ?? "https://github.com/marketplace/models",
    evaluatedAt,
    benchmark: "CivicProofBench 100",
    benchmarkVersion: benchmark.version,
    benchmarkSha256,
    systemPrompt,
    parameters: {
      temperature: 0,
      topP: null,
      seed: null,
      maxOutputTokens,
      batchSize,
      maximumAttempts,
      minimumDelayMs,
    },
    tools: [],
    retries: totalRetries,
    exclusions: [],
    humanReview:
      "none; generated and scored automatically by the linked public GitHub Actions run",
    evidenceUrl: githubRunUrl,
    notes:
      "External open-model inference executed by CivicProof project-maintainer CI. This is reproducible public evidence, not an independent third-party evaluation.",
  },
  predictions,
};

if (run.predictions.length !== benchmark.cases.length) {
  throw new Error(
    `Incomplete run: expected ${benchmark.cases.length} predictions and received ${run.predictions.length}.`,
  );
}

await writeFile(
  resolve(outputDirectory, "run.json"),
  `${JSON.stringify(run, null, 2)}\n`,
);
await writeFile(
  resolve(outputDirectory, "README.md"),
  `# CivicProof GitHub Models run

- Run ID: \`${runId}\`
- Model: \`${model}\`
- Catalog version: \`${run.metadata.modelVersion}\`
- Benchmark: CivicProofBench 100 v${benchmark.version}
- Benchmark SHA-256: \`${benchmarkSha256}\`
- Evidence: ${githubRunUrl}

This run was generated without human editing by the public workflow and scored
with the repository's strict scorer. It is an external open-model run executed
by CivicProof project-maintainer CI, not an independent third-party evaluation.
`,
);

console.log(
  `Generated ${run.predictions.length} predictions for ${model} in ${dirname(resolve(outputDirectory, "run.json"))}.`,
);
