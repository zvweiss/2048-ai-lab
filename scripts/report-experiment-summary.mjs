import fs from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith("--")) {
      out[key] = next;
      i++;
    } else {
      out[key] = "true";
    }
  }
  return out;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function pad(str, width) {
  return String(str).padEnd(width, " ");
}

function fmt1(n) {
  return Number.isFinite(n) ? n.toFixed(1) : "-";
}

function fmt0(n) {
  return Number.isFinite(n) ? String(Math.round(n)) : "-";
}

function loadJson(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function runSortKey(runId) {
  const m = /^run-(\d+)/.exec(runId);
  if (m) return Number(m[1]);
  return Number.MAX_SAFE_INTEGER;
}

function inferSeedFromRun(runId) {
  const seedMap = {
    "run-004": "1337",
    "run-005": "1337",
    "run-006": "2024",
    "run-007": "9001",
  };
  return seedMap[runId] ?? "-";
}

function getMaxTile(data) {
  if (Number.isFinite(data?.samples?.maxMaxTile)) {
    return Number(data.samples.maxMaxTile);
  }
  if (Array.isArray(data?.maxTiles) && data.maxTiles.length > 0) {
    return Math.max(...data.maxTiles.map(Number));
  }
  return NaN;
}

function getMeanScore(data) {
  return Number(data?.meanScore);
}

function getMedianScore(data) {
  return Number(data?.medianScore);
}

function getAgent(data) {
  return typeof data?.agent === "string" ? data.agent : "-";
}

function getSeed(data, runId) {
  if (data?.seedBase !== undefined && data?.seedBase !== null) {
    return String(data.seedBase);
  }
  return inferSeedFromRun(runId);
}

const args = parseArgs(process.argv.slice(2));
const repoRoot = process.cwd();

const runsArg = args.runs ?? "run-005,run-006,run-007";
const modelArg = args.model ?? "valuenet-v001";
const baselinesDirArg = args.baselinesDir ?? "docs/baselines";
const sortByArg = args.sortBy ?? "run"; // run | meanScore

const runs = runsArg
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

if (runs.length === 0) {
  fail("No runs specified. Example: --runs run-005,run-006,run-007");
}

const baselinesDir = path.join(repoRoot, baselinesDirArg);

const rows = runs.map((runId) => {
  const filename = `${modelArg}-${runId}.json`;
  const fullPath = path.join(baselinesDir, filename);
  const data = loadJson(fullPath);

  if (!data) {
    return {
      runId,
      agent: modelArg,
      seed: inferSeedFromRun(runId),
      meanScore: NaN,
      medianScore: NaN,
      bestTile: NaN,
      status: "missing",
      file: fullPath,
    };
  }

  return {
    runId,
    agent: getAgent(data),
    seed: getSeed(data, runId),
    meanScore: getMeanScore(data),
    medianScore: getMedianScore(data),
    bestTile: getMaxTile(data),
    status: "ok",
    file: fullPath,
  };
});

if (sortByArg === "meanScore") {
  rows.sort((a, b) => {
    const aScore = Number.isFinite(a.meanScore) ? a.meanScore : -Infinity;
    const bScore = Number.isFinite(b.meanScore) ? b.meanScore : -Infinity;
    return bScore - aScore;
  });
} else {
  rows.sort((a, b) => runSortKey(a.runId) - runSortKey(b.runId));
}

const validRows = rows.filter((r) => r.status === "ok");

console.log("");
console.log("=== EXPERIMENT SUMMARY ===");
console.log("");
console.log(`Model: ${modelArg}`);
console.log(`Runs: ${runs.join(", ")}`);
console.log("");

console.log(
  pad("Run", 12) +
    pad("Seed", 8) +
    pad("Mean Score", 14) +
    pad("Median Score", 15) +
    pad("Best Tile", 12) +
    "Status",
);
console.log("-".repeat(68));

for (const row of rows) {
  console.log(
    pad(row.runId, 12) +
      pad(row.seed, 8) +
      pad(fmt1(row.meanScore), 14) +
      pad(fmt1(row.medianScore), 15) +
      pad(fmt0(row.bestTile), 12) +
      row.status,
  );
}

console.log("");

if (validRows.length > 0) {
  const meanOfMeans =
    validRows.reduce((acc, r) => acc + r.meanScore, 0) / validRows.length;

  const bestRun = validRows.reduce((best, r) =>
    r.meanScore > best.meanScore ? r : best,
  );

  const worstRun = validRows.reduce((worst, r) =>
    r.meanScore < worst.meanScore ? r : worst,
  );

  let variance = 0;
  if (validRows.length > 1) {
    for (const row of validRows) {
      const d = row.meanScore - meanOfMeans;
      variance += d * d;
    }
    variance /= validRows.length - 1;
  }
  const stddev = Math.sqrt(variance);

  console.log("Summary:");
  console.log(`  loaded runs: ${validRows.length}/${rows.length}`);
  console.log(`  average mean score: ${fmt1(meanOfMeans)}`);
  console.log(`  stddev of mean score: ${fmt1(stddev)}`);
  console.log(
    `  best run: ${bestRun.runId} (${fmt1(bestRun.meanScore)}, tile ${fmt0(bestRun.bestTile)})`,
  );
  console.log(
    `  worst run: ${worstRun.runId} (${fmt1(worstRun.meanScore)}, tile ${fmt0(worstRun.bestTile)})`,
  );
  console.log("");
}

const missingRows = rows.filter((r) => r.status === "missing");
if (missingRows.length > 0) {
  console.log("Missing files:");
  for (const row of missingRows) {
    console.log(`  - ${row.runId}: ${row.file}`);
  }
  console.log("");
}

console.log("Markdown table:");
console.log("");
console.log("| Run | Seed | Mean Score | Median Score | Best Tile | Status |");
console.log("|---|---:|---:|---:|---:|---|");

for (const row of rows) {
  console.log(
    `| ${row.runId} | ${row.seed} | ${fmt1(row.meanScore)} | ${fmt1(
      row.medianScore,
    )} | ${fmt0(row.bestTile)} | ${row.status} |`,
  );
}

console.log("");
