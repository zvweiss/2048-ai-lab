import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();

const BASELINES = [
  { name: "Random", file: "docs/baselines/random-v001.json" },
  { name: "Expectimax v001", file: "docs/baselines/expectimax-v001.json" },
  { name: "Expectimax depth3", file: "docs/baselines/expectimax-d3-g50.json" },
  { name: "ValueNet v001", file: "docs/baselines/valuenet-v001-run-001.json" }
];

function load(file) {
  const p = path.join(repoRoot, file);
  if (!fs.existsSync(p)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

function fmt(x) {
  if (x === null || x === undefined) return "-";
  return Number(x).toFixed(1);
}

console.log("");
console.log("=== BASELINE COMPARISON ===");
console.log("");

console.log(
  "Agent".padEnd(20) +
  "Mean Score".padEnd(14) +
  "Median".padEnd(10) +
  "MaxTile".padEnd(10)
);

console.log("-".repeat(54));

for (const b of BASELINES) {
  const r = load(b.file);

  if (!r) {
    console.log(
      b.name.padEnd(20) +
      "-".padEnd(14) +
      "-".padEnd(10) +
      "-"
    );
    continue;
  }

  const maxTile = `${r.samples.minMaxTile}..${r.samples.maxMaxTile}`;

  console.log(
    b.name.padEnd(20) +
    fmt(r.meanScore).padEnd(14) +
    fmt(r.medianScore).padEnd(10) +
    maxTile
  );
}

console.log("");