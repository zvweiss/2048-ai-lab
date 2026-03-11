import fs from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const val =
        argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : "true";
      out[key] = val;
    }
  }
  return out;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}

function fmt4(n) {
  return Number.isFinite(n) ? n.toFixed(4) : "-";
}

function fmtInt(n) {
  return Number.isFinite(n) ? String(Math.round(n)) : "-";
}

function asciiBars(values, width = 24) {
  if (values.length === 0) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;

  return values.map((v) => {
    const barLen = Math.max(1, Math.round(((v - min) / span) * width));
    return "█".repeat(barLen);
  });
}

const args = parseArgs(process.argv.slice(2));
const run = args.run;

if (!run) {
  fail(
    "Missing --run. Example: npm run report:learning-curve -- --run run-001",
  );
}

const repoRoot = process.cwd();
const csvPath = path.join(
  repoRoot,
  "artifacts",
  "models",
  "valuenet-v001",
  run,
  "learning-curve.csv",
);

if (!fs.existsSync(csvPath)) {
  fail(`Learning curve CSV not found: ${csvPath}`);
}

const raw = fs.readFileSync(csvPath, "utf-8").trim();
if (!raw) {
  fail(`Learning curve CSV is empty: ${csvPath}`);
}

const lines = raw.split(/\r?\n/);
if (lines.length < 2) {
  fail(`Learning curve CSV has no data rows: ${csvPath}`);
}

const header = lines[0].split(",");
const expected = [
  "episode",
  "score",
  "maxTile",
  "steps",
  "avgScoreWindow",
  "avgMaxTileWindow",
];

for (let i = 0; i < expected.length; i++) {
  if (header[i] !== expected[i]) {
    fail(
      `Unexpected CSV header.\nExpected: ${expected.join(",")}\nActual:   ${header.join(",")}`,
    );
  }
}

if (header.length !== expected.length) {
  fail(
    `Unexpected CSV column count.\nExpected: ${expected.length}\nActual:   ${header.length}`,
  );
}

const rows = lines.slice(1).map((line, index) => {
  const cols = line.split(",");
  if (cols.length !== expected.length) {
    fail(
      `Invalid CSV row at line ${index + 2}: expected ${expected.length} columns, got ${cols.length}`,
    );
  }

  const [episode, score, maxTile, steps, avgScoreWindow, avgMaxTileWindow] =
    cols;

  const row = {
    episode: toNum(episode),
    score: toNum(score),
    maxTile: toNum(maxTile),
    steps: toNum(steps),
    avgScoreWindow: toNum(avgScoreWindow),
    avgMaxTileWindow: toNum(avgMaxTileWindow),
  };

  for (const [key, value] of Object.entries(row)) {
    if (!Number.isFinite(value)) {
      fail(`Invalid numeric value for ${key} at line ${index + 2}: ${line}`);
    }
  }

  return row;
});

const first = rows[0];
const last = rows[rows.length - 1];

const bestScore = Math.max(...rows.map((r) => r.score));
const bestMaxTile = Math.max(...rows.map((r) => r.maxTile));

const scoreDelta = last.avgScoreWindow - first.avgScoreWindow;
const maxTileDelta = last.avgMaxTileWindow - first.avgMaxTileWindow;

console.log("");
console.log("=== LEARNING CURVE REPORT ===");
console.log("");
console.log(`Run: ${run}`);
console.log(`Rows: ${rows.length}`);
console.log(
  `Episode range: ${fmtInt(first.episode)} → ${fmtInt(last.episode)}`,
);
console.log("");
console.log("AvgScoreWindow:");
console.log(`  first: ${fmt4(first.avgScoreWindow)}`);
console.log(`  last:  ${fmt4(last.avgScoreWindow)}`);
console.log(`  delta: ${fmt4(scoreDelta)}`);
console.log("");
console.log("AvgMaxTileWindow:");
console.log(`  first: ${fmt4(first.avgMaxTileWindow)}`);
console.log(`  last:  ${fmt4(last.avgMaxTileWindow)}`);
console.log(`  delta: ${fmt4(maxTileDelta)}`);
console.log("");
console.log(`Best observed episode score: ${fmtInt(bestScore)}`);
console.log(`Best observed max tile: ${fmtInt(bestMaxTile)}`);
console.log("");

// Optional compact ASCII trend using up to 12 sampled points
const sampleCount = Math.min(12, rows.length);
if (sampleCount > 1) {
  console.log("AvgScoreWindow trend:");
  const sampled = [];
  for (let i = 0; i < sampleCount; i++) {
    const idx = Math.round((i * (rows.length - 1)) / (sampleCount - 1));
    sampled.push(rows[idx]);
  }

  const bars = asciiBars(sampled.map((r) => r.avgScoreWindow));
  for (let i = 0; i < sampled.length; i++) {
    const ep = String(sampled[i].episode).padStart(6, " ");
    const val = fmt4(sampled[i].avgScoreWindow).padStart(10, " ");
    console.log(`${ep} | ${bars[i]} ${val}`);
  }
  console.log("");
}
