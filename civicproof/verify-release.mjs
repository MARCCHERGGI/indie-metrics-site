#!/usr/bin/env node

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const benchmarkBytes = await readFile(resolve(root, "civic-proof-bench.json"));
const benchmark = JSON.parse(benchmarkBytes.toString("utf8"));
const template = JSON.parse(
  await readFile(resolve(root, "civic-proof-run-template.json"), "utf8"),
);
const manifest = JSON.parse(
  await readFile(resolve(root, "civic-proof-release-manifest.json"), "utf8"),
);
const hash = createHash("sha256").update(benchmarkBytes).digest("hex");

assert.equal(benchmark.name, "CivicProofBench 100");
assert.equal(benchmark.cases.length, 100);
assert.equal(new Set(benchmark.cases.map((item) => item.id)).size, 100);
assert.equal(template.schemaVersion, "CIVIC-PROOF-RUN-1.0");
assert.equal(template.metadata.benchmarkSha256, hash);
assert.equal(template.predictions.length, 100);
assert.equal(new Set(template.predictions.map((item) => item.id)).size, 100);
assert.equal(manifest.integrity.benchmarkSha256, hash);
assert.equal(manifest.integrity.caseCount, 100);

console.log(`Verified CivicProofBench 100 release ${manifest.version}: ${hash}`);
