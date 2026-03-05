import { appendFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, "..");

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const val = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : "true";
    out[key] = val;
  }
  return out;
}

function run(cmd, args, cwd) {
  return new Promise((resolvePromise, rejectPromise) => {
    const p = spawn(cmd, args, { cwd, stdio: "inherit" });
    p.on("exit", (code) => {
      if (code === 0) resolvePromise();
      else rejectPromise(new Error(`${cmd} ${args.join(" ")} failed with exit code ${code}`));
    });
    p.on("error", rejectPromise);
  });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const runId = String(args.run ?? "");
  const episodes = Number(args.episodes ?? "20000");
  const games = Number(args.games ?? "500");
  const seed = Number(args.seed ?? "1337");

  if (!runId) {
    console.error("Missing --run. Example: --run run-001");
    process.exit(1);
  }
  if (!Number.isFinite(episodes) || episodes <= 0) {
    console.error("Invalid --episodes. Example: --episodes 20000");
    process.exit(1);
  }
  if (!Number.isFinite(games) || games <= 0) {
    console.error("Invalid --games. Example: --games 500");
    process.exit(1);
  }
  if (!Number.isFinite(seed)) {
    console.error("Invalid --seed. Example: --seed 1337");
    process.exit(1);
  }

  const modelRelDir = `artifacts/models/valuenet-v001/${runId}`;
  const modelRelPath = `${modelRelDir}/model.json`;
  const evalRelPath = `docs/baselines/valuenet-v001-${runId}.json`;

  mkdirSync(join(repoRoot, "artifacts", "models", "valuenet-v001"), { recursive: true });
  mkdirSync(join(repoRoot, "docs", "baselines"), { recursive: true });

  const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

  await run(
    npmCmd,
    [
      "run",
      "trainer:train:valuenet",
      "--",
      "--episodes",
      String(episodes),
      "--seed",
      String(seed),
      "--out",
      modelRelDir,
    ],
    repoRoot,
  );

  if (!existsSync(join(repoRoot, modelRelPath))) {
    throw new Error(`Training finished but model file was not found: ${modelRelPath}`);
  }

  await run(
    npmCmd,
    [
      "run",
      "trainer:eval",
      "--",
      "--agent",
      "valuenet-v001",
      "--games",
      String(games),
      "--seed",
      String(seed),
      "--model",
      modelRelPath,
      "--out",
      evalRelPath,
    ],
    repoRoot,
  );

  const timestamp = new Date().toISOString();
  const logLine = `${timestamp} | valuenet-v001 | ${runId} | episodes=${episodes} | games=${games} | seed=${seed} | ${modelRelPath} | ${evalRelPath}\n`;
  appendFileSync(join(repoRoot, "docs", "EXPERIMENT_LOG.md"), logLine, "utf-8");

  console.log("Experiment completed.");
  console.log(`Model: ${modelRelPath}`);
  console.log(`Eval:  ${evalRelPath}`);
  console.log("Log entry appended to docs/EXPERIMENT_LOG.md");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
