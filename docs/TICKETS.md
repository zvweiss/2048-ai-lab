# Tickets (Jira-lite)

## APP Tickets (Engineering)

### APP-001 Seed monorepo structure + docs
Status: DONE
Notes: Seed created with `apps/trainer`, `packages/core`, `/docs`, and Angular creation script.

### APP-002 Implement 2048 engine in packages/core + correctness tests
Status: DONE
Notes: Move/merge rules, spawn rules, terminal detection. Add unit tests.

### APP-003 Integrate core engine into trainer WS stream (replace fake board)
Status: DONE

### APP-004 Add Angular inference loader for published models in assets
Status: TODO
Notes: Load `model.json` + weights from `/assets/models/v###/` and run inference in browser.

### APP-005 Add model artifact export/copy pipeline (trainer -> ui assets)
Status: TODO

---

## LAB Tickets (RL Lab / Experiments)

### LAB-001 Define evaluation suite + metrics schema
Status: DONE
Notes: mean/median score, max-tile histogram, P(16384), P(32768), P(65536).
Eval CLI + artifact JSON schema + presets scripts + commands doc.

### LAB-002 Benchmark heuristic baseline agent
Status: DONE
Notes: Establish baseline curves and distributions for comparison.

### LAB-002.1 — Fix Repo-Root Output Paths + Add Eval Presets
Status: DONE

Objective:
	1.	Ensure –out paths in apps/trainer/src/cli-eval.ts resolve relative to repo root, not apps/trainer.
	2.	Ensure default artifacts/ directory is created at repo root.
	3.	Add root-level preset scripts for:
	•	Expectimax baseline v001 (depth=2, 200 games)
	•	Expectimax depth=3 (50 games)
	4.	Remove temporary debug log “[cli-eval] started”.
	5.	Update docs/COMMANDS.md.

Constraints:
	•	Do not change agent logic.
	•	Do not change evaluation math.
	•	Preserve deterministic behavior.
	•	Do not introduce new dependencies.
	•	Only modify specified files.

Files Allowed to Modify:
	•	apps/trainer/src/cli-eval.ts
	•	package.json (repo root)
	•	docs/COMMANDS.md

Required Code Changes:
	1.	Add repoRoot resolution

In apps/trainer/src/cli-eval.ts, after imports add:

const repoRoot = path.resolve(process.cwd(), “..”, “..”);
	2.	Fix –out path resolution

Replace:

outPath = path.isAbsolute(outArg) ? outArg : path.join(process.cwd(), outArg);

With:

outPath = path.isAbsolute(outArg) ? outArg : path.join(repoRoot, outArg);
	3.	Fix artifacts directory location

Replace:

const artifactsDir = path.join(process.cwd(), “..”, “..”, “artifacts”, “eval”);

With:

const artifactsDir = path.join(repoRoot, “artifacts”, “eval”);
	4.	Remove temporary debug log

Delete this line if present:

console.log(”[cli-eval] started”, process.argv.slice(2));
	5.	Add preset scripts to root package.json

Under the root “scripts” section add:

“eval:expectimax:v001”: “npm run trainer:eval – –agent expectimax –games 200 –seed 1337 –depth 2 –p2 0.9 –out docs/baselines/expectimax-v001.json”,
“eval:expectimax:d3:g50”: “npm run trainer:eval – –agent expectimax –games 50 –seed 1337 –depth 3 –p2 0.9 –out docs/baselines/expectimax-d3-g50.json”
	6.	Update docs/COMMANDS.md

Add:

Evaluation Presets

Expectimax Baseline v001 (depth=2, 200 games)

npm run eval:expectimax:v001

Expectimax Depth 3 (50 games)

npm run eval:expectimax:d3:g50

Verification:
	1.	Run:
npm run eval:expectimax:v001

Expected:
	•	docs/baselines/expectimax-v001.json created
	•	Summary shows “=== EVAL SUMMARY (expectimax) ===”
	•	Games: 200

	2.	Run:
npm run eval:expectimax:d3:g50

Expected:
	•	docs/baselines/expectimax-d3-g50.json created

	3.	Manual test:
npm run trainer:eval – –agent expectimax –games 5 –out docs/baselines/test.json

Expected:
	•	File written to repo-root docs/baselines/
	•	No files created under apps/trainer/docs/

Commit Message:

LAB-002.1: Fix repo-root path resolution + add expectimax eval presets


### LAB-003 ValueNet v001 training run (simple TD) + eval
Status: TODO
Notes: Record config + results in EXPERIMENT_LOG.md.
1) New agent

Agent id: valuenet-v001
Implements chooseMove({grid, score}) -> {dir, debug} using ValueNet + shallow expected-spawn lookahead.

2) Training CLI

A trainer script that runs self-play and TD updates:
	•	Run episodes with ε-greedy (using current policy)
	•	Store transitions (s, r, s', done)
	•	TD target: y = r + gamma * V(s') (or r if terminal)
	•	Optimize MSE between V(s) and y

3) Model artifacts

Save model checkpoints:
	•	artifacts/models/valuenet-v001/<run-id>/model.json + weights.bin
	•	Save config.json and results.json alongside

4) Eval integration

Extend cli-eval.ts:
	•	--agent valuenet-v001 --model <path>
	•	Evaluate using existing evaluateAgent(...)
	•	Output JSON to docs/baselines/valuenet-v001.json (or artifacts)

5) Experiment logging

Append one entry to docs/EXPERIMENT_LOG.md with:
	•	run id, date
	•	config (episodes, lr, gamma, epsilon schedule, batch size, seed)
	•	eval results (meanScore, pAtLeast, maxTile range)
	•	model path

⸻

Minimal file layout (what gets added)

Inside apps/trainer/src/:
	•	agents/valuenet/
	•	encode.ts (grid → tensor features)
	•	valueNet.ts (tfjs model create/load/save, predictV)
	•	valueNetAgent.ts (policy using 1-step lookahead + expected spawn)
	•	tdTrain.ts (training loop)
	•	cli-train-valuenet.ts (new CLI entrypoint)
	•	Update:
	•	cli-eval.ts (add agent option)
	•	agents/agent.ts (extend AgentId union)
	•	root package.json scripts (preset commands)

⸻

Commands we will end up with
	•	Train:
	•	npm run trainer:train:valuenet -- --episodes 20000 --seed 1337 --out artifacts/models/valuenet-v001/run-001
	•	Eval:
	•	npm run trainer:eval -- --agent valuenet-v001 --games 200 --seed 1337 --model artifacts/models/valuenet-v001/run-001/model.json --out docs/baselines/valuenet-v001.json

(And we’ll add short preset scripts so you don’t remember flags.)

⸻

What Codex should implement vs what we decide here

We decide here (architecture):
	•	TD target formula
	•	state encoding (simple, deterministic)
	•	epsilon schedule
	•	eval protocol

Codex implements (bulk coding):
	•	tfjs model code
	•	encoding module
	•	TD training loop
	•	agent wiring into CLI
	•	saving/loading artifacts
	•	EXPERIMENT_LOG entry format