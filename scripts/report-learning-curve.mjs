// // import fs from "node:fs";
// // import path from "node:path";

// // function parseArgs(argv) {
// //   const out = {};
// //   for (let i = 0; i < argv.length; i++) {
// //     const a = argv[i];
// //     if (a.startsWith("--")) {
// //       const key = a.slice(2);
// //       const val =
// //         argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : "true";
// //       out[key] = val;
// //     }
// //   }
// //   return out;
// // }

// // function fail(message) {
// //   console.error(message);
// //   process.exit(1);
// // }

// // function toNum(v) {
// //   const n = Number(v);
// //   return Number.isFinite(n) ? n : NaN;
// // }

// // function fmt4(n) {
// //   return Number.isFinite(n) ? n.toFixed(4) : "-";
// // }

// // function fmtInt(n) {
// //   return Number.isFinite(n) ? String(Math.round(n)) : "-";
// // }

// // function asciiBars(values, width = 24) {
// //   if (values.length === 0) return [];
// //   const min = Math.min(...values);
// //   const max = Math.max(...values);
// //   const span = max - min || 1;

// //   return values.map((v) => {
// //     const barLen = Math.max(1, Math.round(((v - min) / span) * width));
// //     return "█".repeat(barLen);
// //   });
// // }

// // const args = parseArgs(process.argv.slice(2));
// // const run = args.run;

// // if (!run) {
// //   fail(
// //     "Missing --run. Example: npm run report:learning-curve -- --run run-001",
// //   );
// // }

// // const repoRoot = process.cwd();
// // const csvPath = path.join(
// //   repoRoot,
// //   "artifacts",
// //   "models",
// //   "valuenet-v001",
// //   run,
// //   "learning-curve.csv",
// // );

// // if (!fs.existsSync(csvPath)) {
// //   fail(`Learning curve CSV not found: ${csvPath}`);
// // }

// // const raw = fs.readFileSync(csvPath, "utf-8").trim();
// // if (!raw) {
// //   fail(`Learning curve CSV is empty: ${csvPath}`);
// // }

// // const lines = raw.split(/\r?\n/);
// // if (lines.length < 2) {
// //   fail(`Learning curve CSV has no data rows: ${csvPath}`);
// // }

// // const header = lines[0].split(",");
// // const expected = [
// //   "episode",
// //   "score",
// //   "maxTile",
// //   "steps",
// //   "avgScoreWindow",
// //   "avgMaxTileWindow",
// // ];

// // for (let i = 0; i < expected.length; i++) {
// //   if (header[i] !== expected[i]) {
// //     fail(
// //       `Unexpected CSV header.\nExpected: ${expected.join(",")}\nActual:   ${header.join(",")}`,
// //     );
// //   }
// // }

// // if (header.length !== expected.length) {
// //   fail(
// //     `Unexpected CSV column count.\nExpected: ${expected.length}\nActual:   ${header.length}`,
// //   );
// // }

// // const rows = lines.slice(1).map((line, index) => {
// //   const cols = line.split(",");
// //   if (cols.length !== expected.length) {
// //     fail(
// //       `Invalid CSV row at line ${index + 2}: expected ${expected.length} columns, got ${cols.length}`,
// //     );
// //   }

// //   const [episode, score, maxTile, steps, avgScoreWindow, avgMaxTileWindow] =
// //     cols;

// //   const row = {
// //     episode: toNum(episode),
// //     score: toNum(score),
// //     maxTile: toNum(maxTile),
// //     steps: toNum(steps),
// //     avgScoreWindow: toNum(avgScoreWindow),
// //     avgMaxTileWindow: toNum(avgMaxTileWindow),
// //   };

// //   for (const [key, value] of Object.entries(row)) {
// //     if (!Number.isFinite(value)) {
// //       fail(`Invalid numeric value for ${key} at line ${index + 2}: ${line}`);
// //     }
// //   }

// //   return row;
// // });

// // const first = rows[0];
// // const last = rows[rows.length - 1];

// // const bestScore = Math.max(...rows.map((r) => r.score));
// // const bestMaxTile = Math.max(...rows.map((r) => r.maxTile));

// // const scoreDelta = last.avgScoreWindow - first.avgScoreWindow;
// // const maxTileDelta = last.avgMaxTileWindow - first.avgMaxTileWindow;

// // console.log("");
// // console.log("=== LEARNING CURVE REPORT ===");
// // console.log("");
// // console.log(`Run: ${run}`);
// // console.log(`Rows: ${rows.length}`);
// // console.log(
// //   `Episode range: ${fmtInt(first.episode)} → ${fmtInt(last.episode)}`,
// // );
// // console.log("");
// // console.log("AvgScoreWindow:");
// // console.log(`  first: ${fmt4(first.avgScoreWindow)}`);
// // console.log(`  last:  ${fmt4(last.avgScoreWindow)}`);
// // console.log(`  delta: ${fmt4(scoreDelta)}`);
// // console.log("");
// // console.log("AvgMaxTileWindow:");
// // console.log(`  first: ${fmt4(first.avgMaxTileWindow)}`);
// // console.log(`  last:  ${fmt4(last.avgMaxTileWindow)}`);
// // console.log(`  delta: ${fmt4(maxTileDelta)}`);
// // console.log("");
// // console.log(`Best observed episode score: ${fmtInt(bestScore)}`);
// // console.log(`Best observed max tile: ${fmtInt(bestMaxTile)}`);
// // console.log("");

// // // Optional compact ASCII trend using up to 12 sampled points
// // const sampleCount = Math.min(12, rows.length);
// // if (sampleCount > 1) {
// //   console.log("AvgScoreWindow trend:");
// //   const sampled = [];
// //   for (let i = 0; i < sampleCount; i++) {
// //     const idx = Math.round((i * (rows.length - 1)) / (sampleCount - 1));
// //     sampled.push(rows[idx]);
// //   }

// //   const bars = asciiBars(sampled.map((r) => r.avgScoreWindow));
// //   for (let i = 0; i < sampled.length; i++) {
// //     const ep = String(sampled[i].episode).padStart(6, " ");
// //     const val = fmt4(sampled[i].avgScoreWindow).padStart(10, " ");
// //     console.log(`${ep} | ${bars[i]} ${val}`);
// //   }
// //   console.log("");
// // }

// import fs from "node:fs";
// import path from "node:path";

// function parseArgs(argv) {
//   const out = {};
//   for (let i = 0; i < argv.length; i++) {
//     const a = argv[i];
//     if (!a.startsWith("--")) continue;
//     const key = a.slice(2);
//     const next = argv[i + 1];
//     if (next && !next.startsWith("--")) {
//       out[key] = next;
//       i++;
//     } else {
//       out[key] = "true";
//     }
//   }
//   return out;
// }

// function fail(message) {
//   console.error(message);
//   process.exit(1);
// }

// function toNum(v) {
//   const n = Number(v);
//   return Number.isFinite(n) ? n : NaN;
// }

// function fmt4(n) {
//   return Number.isFinite(n) ? n.toFixed(4) : "-";
// }

// function fmtInt(n) {
//   return Number.isFinite(n) ? String(Math.round(n)) : "-";
// }

// function asciiBars(values, width = 24) {
//   if (values.length === 0) return [];
//   const min = Math.min(...values);
//   const max = Math.max(...values);
//   const span = max - min || 1;

//   return values.map((v) => {
//     const normalized = (v - min) / span;
//     const barLen = Math.max(1, Math.round(normalized * width));
//     return "█".repeat(barLen);
//   });
// }

// function printMetricSummary(label, first, last) {
//   const delta = last - first;
//   console.log(`${label}:`);
//   console.log(`  first: ${fmt4(first)}`);
//   console.log(`  last:  ${fmt4(last)}`);
//   console.log(`  delta: ${fmt4(delta)}`);
//   console.log("");
// }

// function printAsciiTrend(label, rows, key, sampleCount = 12) {
//   if (rows.length < 2) return;

//   const sampled = [];
//   const n = Math.min(sampleCount, rows.length);

//   for (let i = 0; i < n; i++) {
//     const idx = Math.round((i * (rows.length - 1)) / (n - 1));
//     sampled.push(rows[idx]);
//   }

//   const values = sampled.map((r) => r[key]).filter(Number.isFinite);
//   if (values.length !== sampled.length) return;

//   const bars = asciiBars(values);

//   console.log(`${label} trend:`);
//   for (let i = 0; i < sampled.length; i++) {
//     const ep = String(sampled[i].episode).padStart(6, " ");
//     const val = fmt4(sampled[i][key]).padStart(10, " ");
//     console.log(`${ep} | ${bars[i]} ${val}`);
//   }
//   console.log("");
// }

// const args = parseArgs(process.argv.slice(2));
// const run = args.run;

// if (!run) {
//   fail(
//     "Missing --run. Example: npm run report:learning-curve -- --run run-001",
//   );
// }

// const repoRoot = process.cwd();
// const csvPath = path.join(
//   repoRoot,
//   "artifacts",
//   "models",
//   "valuenet-v001",
//   run,
//   "learning-curve.csv",
// );

// if (!fs.existsSync(csvPath)) {
//   fail(`Learning curve CSV not found: ${csvPath}`);
// }

// const raw = fs.readFileSync(csvPath, "utf-8").trim();
// if (!raw) {
//   fail(`Learning curve CSV is empty: ${csvPath}`);
// }

// const lines = raw.split(/\r?\n/);
// if (lines.length < 2) {
//   fail(`Learning curve CSV has no data rows: ${csvPath}`);
// }

// const headers = lines[0].split(",").map((h) => h.trim());

// const requiredColumns = [
//   "episode",
//   "score",
//   "maxTile",
//   "steps",
//   "avgScoreWindow",
//   "avgMaxTileWindow",
// ];

// for (const col of requiredColumns) {
//   if (!headers.includes(col)) {
//     fail(
//       `Missing required column: ${col}\nActual header: ${headers.join(",")}`,
//     );
//   }
// }

// const rows = lines.slice(1).map((line) => {
//   const parts = line.split(",");
//   const obj = {};

//   for (let i = 0; i < headers.length; i++) {
//     obj[headers[i]] = parts[i] ?? "";
//   }

//   return {
//     episode: toNum(obj.episode),
//     score: toNum(obj.score),
//     maxTile: toNum(obj.maxTile),
//     steps: toNum(obj.steps),
//     avgScoreWindow: toNum(obj.avgScoreWindow),
//     avgMaxTileWindow: toNum(obj.avgMaxTileWindow),
//     maxTileInCorner: headers.includes("maxTileInCorner")
//       ? toNum(obj.maxTileInCorner)
//       : NaN,
//     pMaxTileInCornerWindow: headers.includes("pMaxTileInCornerWindow")
//       ? toNum(obj.pMaxTileInCornerWindow)
//       : NaN,
//     epsilon: headers.includes("epsilon") ? toNum(obj.epsilon) : NaN,
//   };
// });

// const first = rows[0];
// const last = rows[rows.length - 1];

// const bestScore = Math.max(...rows.map((r) => r.score));
// const bestMaxTile = Math.max(...rows.map((r) => r.maxTile));

// console.log("");
// console.log("=== LEARNING CURVE REPORT ===");
// console.log("");
// console.log(`Run: ${run}`);
// console.log(`Rows: ${rows.length}`);
// console.log(
//   `Episode range: ${fmtInt(first.episode)} → ${fmtInt(last.episode)}`,
// );
// console.log("");

// printMetricSummary("AvgScoreWindow", first.avgScoreWindow, last.avgScoreWindow);
// printMetricSummary(
//   "AvgMaxTileWindow",
//   first.avgMaxTileWindow,
//   last.avgMaxTileWindow,
// );

// console.log(`Best observed episode score: ${fmtInt(bestScore)}`);
// console.log(`Best observed max tile: ${fmtInt(bestMaxTile)}`);
// console.log("");

// if (
//   Number.isFinite(first.pMaxTileInCornerWindow) &&
//   Number.isFinite(last.pMaxTileInCornerWindow)
// ) {
//   printMetricSummary(
//     "pMaxTileInCornerWindow",
//     first.pMaxTileInCornerWindow,
//     last.pMaxTileInCornerWindow,
//   );
// }

// if (Number.isFinite(first.epsilon) && Number.isFinite(last.epsilon)) {
//   printMetricSummary("Epsilon", first.epsilon, last.epsilon);
// }

// printAsciiTrend("AvgScoreWindow", rows, "avgScoreWindow");
// printAsciiTrend("AvgMaxTileWindow", rows, "avgMaxTileWindow");

// if (
//   Number.isFinite(first.pMaxTileInCornerWindow) &&
//   Number.isFinite(last.pMaxTileInCornerWindow)
// ) {
//   printAsciiTrend("pMaxTileInCornerWindow", rows, "pMaxTileInCornerWindow");
// }

// if (Number.isFinite(first.epsilon) && Number.isFinite(last.epsilon)) {
//   printAsciiTrend("Epsilon", rows, "epsilon");
// }

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

function fmtPct(n) {
  return Number.isFinite(n) ? `${(n * 100).toFixed(1)}%` : "-";
}

function asciiBars(values, width = 24) {
  if (values.length === 0) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;

  return values.map((v) => {
    const normalized = (v - min) / span;
    const barLen = Math.max(1, Math.round(normalized * width));
    return "█".repeat(barLen);
  });
}

function printMetricSummary(label, first, last) {
  const delta = last - first;
  console.log(`${label}:`);
  console.log(`  first: ${fmt4(first)}`);
  console.log(`  last:  ${fmt4(last)}`);
  console.log(`  delta: ${fmt4(delta)}`);
  console.log("");
}

function printPercentMetricSummary(label, first, last) {
  const delta = last - first;
  console.log(`${label}:`);
  console.log(`  first: ${fmtPct(first)}`);
  console.log(`  last:  ${fmtPct(last)}`);
  console.log(`  delta: ${fmtPct(delta)}`);
  console.log("");
}

function printAsciiTrend(label, rows, key, options = {}) {
  if (rows.length < 2) return;

  const { sampleCount = 12, width = 24, formatter = fmt4 } = options;

  const sampled = [];
  const n = Math.min(sampleCount, rows.length);

  for (let i = 0; i < n; i++) {
    const idx = Math.round((i * (rows.length - 1)) / (n - 1));
    sampled.push(rows[idx]);
  }

  const values = sampled.map((r) => r[key]).filter(Number.isFinite);
  if (values.length !== sampled.length) return;

  const bars = asciiBars(values, width);

  console.log(`${label} trend:`);
  for (let i = 0; i < sampled.length; i++) {
    const ep = String(sampled[i].episode).padStart(6, " ");
    const val = formatter(sampled[i][key]).padStart(10, " ");
    console.log(`${ep} | ${bars[i]} ${val}`);
  }
  console.log("");
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

const headers = lines[0].split(",").map((h) => h.trim());

const requiredColumns = [
  "episode",
  "score",
  "maxTile",
  "steps",
  "avgScoreWindow",
  "avgMaxTileWindow",
];

for (const col of requiredColumns) {
  if (!headers.includes(col)) {
    fail(
      `Missing required column: ${col}\nActual header: ${headers.join(",")}`,
    );
  }
}

const rows = lines.slice(1).map((line) => {
  const parts = line.split(",");
  const obj = {};

  for (let i = 0; i < headers.length; i++) {
    obj[headers[i]] = parts[i] ?? "";
  }

  return {
    episode: toNum(obj.episode),
    score: toNum(obj.score),
    maxTile: toNum(obj.maxTile),
    steps: toNum(obj.steps),
    avgScoreWindow: toNum(obj.avgScoreWindow),
    avgMaxTileWindow: toNum(obj.avgMaxTileWindow),
    maxTileInCorner: headers.includes("maxTileInCorner")
      ? toNum(obj.maxTileInCorner)
      : NaN,
    pMaxTileInCornerWindow: headers.includes("pMaxTileInCornerWindow")
      ? toNum(obj.pMaxTileInCornerWindow)
      : NaN,
    epsilon: headers.includes("epsilon") ? toNum(obj.epsilon) : NaN,
  };
});

const first = rows[0];
const last = rows[rows.length - 1];

const bestScore = Math.max(...rows.map((r) => r.score));
const bestMaxTile = Math.max(...rows.map((r) => r.maxTile));

console.log("");
console.log("=== LEARNING CURVE REPORT ===");
console.log("");
console.log(`Run: ${run}`);
console.log(`Rows: ${rows.length}`);
console.log(
  `Episode range: ${fmtInt(first.episode)} → ${fmtInt(last.episode)}`,
);
console.log("");

printMetricSummary("AvgScoreWindow", first.avgScoreWindow, last.avgScoreWindow);
printMetricSummary(
  "AvgMaxTileWindow",
  first.avgMaxTileWindow,
  last.avgMaxTileWindow,
);

console.log(`Best observed episode score: ${fmtInt(bestScore)}`);
console.log(`Best observed max tile: ${fmtInt(bestMaxTile)}`);
console.log("");

if (
  Number.isFinite(first.pMaxTileInCornerWindow) &&
  Number.isFinite(last.pMaxTileInCornerWindow)
) {
  printPercentMetricSummary(
    "Corner (Max Tile in Corner %)",
    first.pMaxTileInCornerWindow,
    last.pMaxTileInCornerWindow,
  );
}

if (Number.isFinite(first.epsilon) && Number.isFinite(last.epsilon)) {
  printMetricSummary("Epsilon (exploration rate)", first.epsilon, last.epsilon);
}

printAsciiTrend("AvgScoreWindow", rows, "avgScoreWindow", {
  width: 24,
  formatter: fmt4,
});

printAsciiTrend("AvgMaxTileWindow", rows, "avgMaxTileWindow", {
  width: 24,
  formatter: fmt4,
});

if (
  Number.isFinite(first.pMaxTileInCornerWindow) &&
  Number.isFinite(last.pMaxTileInCornerWindow)
) {
  printAsciiTrend(
    "Corner (Max Tile in Corner %)",
    rows,
    "pMaxTileInCornerWindow",
    {
      width: 16,
      formatter: fmtPct,
    },
  );
}

if (Number.isFinite(first.epsilon) && Number.isFinite(last.epsilon)) {
  printAsciiTrend("Epsilon (exploration rate)", rows, "epsilon", {
    width: 12,
    formatter: fmt4,
  });
}
