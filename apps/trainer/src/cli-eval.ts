import fs from "node:fs";
import path from "node:path";
import { newGame } from "@zvi/ai-2048-core";
import { Mulberry32 } from "./rng.js";
import { evaluateRandomAgent } from "./eval.js";

function parseArgs(argv: string[]) {
  const out: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const val = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : "true";
      out[key] = val;
    }
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));
const games = Number(args.games ?? "500");
const seedBase = Number(args.seed ?? "1337");

if (!Number.isFinite(games) || games <= 0) {
  console.error("Invalid --games. Example: --games 500");
  process.exit(1);
}

const result = evaluateRandomAgent(
  { games, seedBase },
  (seed) => new Mulberry32(seed),
  (rng) => newGame(rng),
);

// Write artifacts
const artifactsDir = path.join(process.cwd(), "..", "..", "artifacts", "eval");
fs.mkdirSync(artifactsDir, { recursive: true });

const ts = new Date().toISOString().replace(/[:.]/g, "-");
const filename = `random-g${games}-seed${seedBase}-${ts}.json`;
const outPath = path.join(artifactsDir, filename);

fs.writeFileSync(outPath, JSON.stringify(result, null, 2), "utf-8");

// Print summary
console.log("=== EVAL SUMMARY (Random Agent) ===");
console.log(`Games: ${games}`);
console.log(`Seed base: ${seedBase}`);
console.log(`Mean score:   ${result.meanScore.toFixed(1)}`);
console.log(`Median score: ${result.medianScore.toFixed(1)}`);
console.log(`Std score:    ${result.stdScore.toFixed(1)}`);
console.log(`Mean steps:   ${result.meanSteps.toFixed(1)}`);
console.log(`Median steps: ${result.medianSteps.toFixed(1)}`);
console.log(`Max tile: min=${result.samples.minMaxTile} max=${result.samples.maxMaxTile}`);
console.log("P(tile >= T):", result.pAtLeast);
console.log(`Saved: ${outPath}`);