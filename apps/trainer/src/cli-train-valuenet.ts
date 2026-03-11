import fs from "node:fs";
import path from "node:path";
import { saveValueNet } from "./agents/valuenet/valueNet.js";
import { trainValueNetTd } from "./agents/valuenet/tdTrain.js";

const repoRoot = path.resolve(process.cwd(), "..", "..");

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

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const episodes = Number(args.episodes ?? "20000");
  const seed = Number(args.seed ?? "1337");
  const gamma = Number(args.gamma ?? "0.99");
  const epsilon = Number(args.epsilon ?? "0.1");
  const learningRate = Number(args.lr ?? "0.001");
  const p2 = Number(args.p2 ?? "0.9");
  const outArg = String(
    args.out ?? `artifacts/models/valuenet-v001/run-${new Date().toISOString().replace(/[:.]/g, "-")}`,
  );

  if (!Number.isFinite(episodes) || episodes <= 0) {
    console.error("Invalid --episodes. Example: --episodes 20000");
    process.exit(1);
  }
  if (!Number.isFinite(seed)) {
    console.error("Invalid --seed. Example: --seed 1337");
    process.exit(1);
  }
  if (!Number.isFinite(gamma) || gamma <= 0 || gamma > 1) {
    console.error("Invalid --gamma. Example: --gamma 0.99");
    process.exit(1);
  }
  if (!Number.isFinite(epsilon) || epsilon < 0 || epsilon > 1) {
    console.error("Invalid --epsilon. Example: --epsilon 0.1");
    process.exit(1);
  }
  if (!Number.isFinite(learningRate) || learningRate <= 0) {
    console.error("Invalid --lr. Example: --lr 0.001");
    process.exit(1);
  }
  if (!Number.isFinite(p2) || p2 <= 0 || p2 >= 1) {
    console.error("Invalid --p2. Example: --p2 0.9");
    process.exit(1);
  }

  const outDir = path.isAbsolute(outArg) ? outArg : path.join(repoRoot, outArg);
  fs.mkdirSync(outDir, { recursive: true });

  const { model, result } = await trainValueNetTd({
    episodes,
    seed,
    gamma,
    epsilon,
    learningRate,
    p2,
    outDir,
  });

  await saveValueNet(model, outDir);

  const config = {
    agent: "valuenet-v001",
    episodes,
    seed,
    gamma,
    epsilon,
    learningRate,
    p2,
  };

  fs.writeFileSync(path.join(outDir, "config.json"), JSON.stringify(config, null, 2), "utf-8");
  fs.writeFileSync(path.join(outDir, "results.json"), JSON.stringify(result, null, 2), "utf-8");

  console.log("=== TRAIN SUMMARY (valuenet-v001) ===");
  console.log(`Episodes: ${episodes}`);
  console.log(`Seed: ${seed}`);
  console.log(`Gamma: ${gamma}`);
  console.log(`Epsilon: ${epsilon}`);
  console.log(`Learning rate: ${learningRate}`);
  console.log(`Mean score: ${result.meanScore.toFixed(1)}`);
  console.log(`Median score: ${result.medianScore.toFixed(1)}`);
  console.log(`Max tile range: ${result.minMaxTile}..${result.maxMaxTile}`);
  console.log(`Model saved: ${path.join(outDir, "model.json")}`);
  console.log(`Config saved: ${path.join(outDir, "config.json")}`);
  console.log(`Results saved: ${path.join(outDir, "results.json")}`);

  model.dispose();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
