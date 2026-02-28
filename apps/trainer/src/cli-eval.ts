import fs from "node:fs";
import path from "node:path";
import { Mulberry32 } from "./rng.js";
import { evaluateAgent } from "./eval.js";
import { createRandomAgent } from "./agents/random.js";
import { createExpectimaxAgent } from "./agents/expectimax/expectimaxAgent.js";
import type { Rng } from "@zvi/ai-2048-core";
import type { Agent } from "./agents/agent.js";

const repoRoot = path.resolve(process.cwd(), "..", "..");

function parseArgs(argv: string[]) {
  const out: Record<string, string> = {};
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

const args = parseArgs(process.argv.slice(2));

const agent = String(args.agent ?? "random"); // random | expectimax
const games = Number(args.games ?? "500");
const seedBase = Number(args.seed ?? "1337");
const outArg = args.out ? String(args.out) : null;

// expectimax params
const depth = Number(args.depth ?? "3");
const p2 = Number(args.p2 ?? "0.9");

if (!Number.isFinite(games) || games <= 0) {
  console.error("Invalid --games. Example: --games 500");
  process.exit(1);
}
if (!Number.isFinite(seedBase)) {
  console.error("Invalid --seed. Example: --seed 1337");
  process.exit(1);
}
if (agent !== "random" && agent !== "expectimax") {
  console.error("Invalid --agent. Use --agent random | expectimax");
  process.exit(1);
}
if (agent === "expectimax" && (!Number.isFinite(depth) || depth <= 0)) {
  console.error("Invalid --depth. Example: --depth 3");
  process.exit(1);
}
if (agent === "expectimax" && !(p2 > 0 && p2 < 1)) {
  console.error("Invalid --p2. Example: --p2 0.9");
  process.exit(1);
}

const mkRng = (seed: number): Rng => new Mulberry32(seed);

const agentFactory: (rng: Rng) => Agent =
  agent === "expectimax"
    ? (_rng: Rng) => createExpectimaxAgent({ depth, p2 })
    : (rng: Rng) => createRandomAgent(rng);

const agentConfig = agent === "expectimax" ? { depth, p2, p4: 1 - p2 } : {};

const result = evaluateAgent(
  { games, seedBase, agentConfig },
  mkRng,
  agentFactory,
);

// Determine output path
let outPath: string;

if (outArg) {
  outPath = path.isAbsolute(outArg) ? outArg : path.join(repoRoot, outArg);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
} else {
  // default to artifacts
  const artifactsDir = path.join(repoRoot, "artifacts", "eval");
  fs.mkdirSync(artifactsDir, { recursive: true });

  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `${agent}-g${games}-seed${seedBase}-${ts}.json`;
  outPath = path.join(artifactsDir, filename);
}

fs.writeFileSync(outPath, JSON.stringify(result, null, 2), "utf-8");

// Print summary
console.log(`=== EVAL SUMMARY (${result.agent}) ===`);
console.log(`Games: ${games}`);
console.log(`Seed base: ${seedBase}`);
if (agent === "expectimax") console.log(`Config: depth=${depth} p2=${p2}`);
console.log(`Mean score:   ${result.meanScore.toFixed(1)}`);
console.log(`Median score: ${result.medianScore.toFixed(1)}`);
console.log(`Std score:    ${result.stdScore.toFixed(1)}`);
console.log(`Mean steps:   ${result.meanSteps.toFixed(1)}`);
console.log(`Median steps: ${result.medianSteps.toFixed(1)}`);
console.log(
  `Max tile: min=${result.samples.minMaxTile} max=${result.samples.maxMaxTile}`,
);
console.log("P(tile >= T):", result.pAtLeast);
console.log(`Saved: ${outPath}`);
