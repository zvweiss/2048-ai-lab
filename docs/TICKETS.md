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
Status: DONE

#### Architecture Decisions (Locked)
	The following design decisions are frozen for LAB-003 v001.  
	Codex must implement exactly this architecture without deviation.

---

##### 1. State Encoding
Input: 4x4 board.

Encoding rule:

- For each tile value v:
  - If v == 0 → encoded value = 0
  - Else → encoded value = log2(v) / 16

Shape:

- [4, 4, 1]
- Flatten before dense layers

No multi-channel encoding in v001.

Rationale:
- Normalized bounded input
- Deterministic
- Pedagogically clean
- Easy to extend later

---

##### 2. Reward Definition

Reward per step:

r = scoreGained

No additional shaping.

Specifically:

- No empty-cell bonus
- No max-tile bonus
- No monotonicity bonus
- No survival reward

Rationale:
- Keeps TD update mathematically clean
- Preserves comparability to random and expectimax baselines
- Avoids hidden bias

---

##### 3. Training Algorithm

Algorithm:

- TD(0)
- On-policy
- Update every step
- No replay buffer
- No target network

TD target:

If terminal:
  target = r
Else:
  target = r + gamma * V(s')

Defaults:

- gamma = 0.99
- epsilon = 0.10
- learning rate = 0.001

Rationale:
- Minimal complexity
- Easy debugging
- Clear learning signal
- Suitable first neural milestone

---

##### 4. Acting Policy

Training policy:

- epsilon-greedy over:
  scoreGained + ExpectedSpawn(V(s'))

Evaluation policy:

- Pure greedy (epsilon = 0)

Expected spawn value must:

- Enumerate all empty cells
- Use probability 0.9 for tile 2
- Use probability 0.1 for tile 4
- Average uniformly over empty cell positions

Rationale:
- Consistent with existing expectimax spawn logic
- Deterministic
- Stronger than naive one-step greedy

---

##### 5. Determinism Requirements

- Game dynamics must remain fully deterministic under fixed seed.
- Evaluation of a saved model must be reproducible.
- Training need not produce bit-identical weights, but trajectories must respect seeded RNG.

---

Any deviation from the above decisions requires explicit revision of this ticket before implementation.

### LAB-003.1 — Experiment Runner (Train → Eval → Log Pipeline)
Status: DONE

Create a reproducible experiment runner that performs:

1. Train ValueNet model
2. Evaluate the trained model
3. Save evaluation results
4. Append experiment metadata to docs/EXPERIMENT_LOG.md

The experiment must be runnable with a single command.

Example:

npm run exp:valuenet:v001 -- --run run-001 --episodes 20000 --games 500 --seed 1337

Constraints:

- Do NOT modify the training algorithm.
- Do NOT modify evaluation math.
- Only orchestrate existing CLI tools.
- Use Node.js script under scripts/.
- Preserve deterministic seeds.
- Output paths must resolve from repo root.

Files Allowed to Modify:

scripts/run-experiment-valuenet-v001.mjs (NEW)
package.json (repo root)
docs/EXPERIMENT_LOG.md (append entries)

Required Implementation:

1. Create script:

scripts/run-experiment-valuenet-v001.mjs

The script must:

- Parse arguments:
  --run
  --episodes
  --games
  --seed

- Run training via:

npm run trainer:train:valuenet

- Run evaluation via:

npm run trainer:eval

- Store outputs in:

artifacts/models/valuenet-v001/<run-id>/
docs/baselines/valuenet-v001-<run-id>.json

- Append entry to:

docs/EXPERIMENT_LOG.md

Format:

timestamp | agent | run-id | episodes | games | seed | model-path | eval-path

2. Update root package.json scripts

Add:

"exp:valuenet:v001": "node scripts/run-experiment-valuenet-v001.mjs"

Optional preset:

"exp:valuenet:v001:run-001":
"node scripts/run-experiment-valuenet-v001.mjs --run run-001 --episodes 20000 --games 500 --seed 1337"

Verification:

Run:

npm run exp:valuenet:v001 -- --run run-test --episodes 5 --games 5 --seed 1337

Expected:

1. Training executes
2. Model saved under artifacts/models/valuenet-v001/run-test/
3. Evaluation JSON written to docs/baselines/
4. EXPERIMENT_LOG.md receives a new entry

Commit Message:

LAB-003.1: Add reproducible experiment runner for ValueNet training/evaluation

### LAB-003.2 — Batch ValueNet inference + tensor memory hygiene

Status: DONE

Objective:
Speed up ValueNet training by batching neural network inference calls used
during ExpectedSpawn(V(s')) evaluation.

Currently the agent evaluates each spawned state individually.
This results in many small model.predict() calls per move.

Instead we will:
- construct all spawned states
- evaluate them in a single batch inference
- compute expectations from the batch outputs

This change must NOT alter the algorithm or policy behavior.

Constraints:
- Do NOT change state encoding.
- Do NOT change reward definition.
- Do NOT change TD(0) update rule.
- Do NOT change epsilon policy.
- Do NOT change expected spawn probabilities.
- Do NOT introduce new dependencies.
- Must produce numerically equivalent results within floating tolerance.
- Ensure TensorFlow tensors are properly disposed (no memory leaks).

Files Allowed to Modify:

apps/trainer/src/agents/valuenet/valueNet.ts  
apps/trainer/src/agents/valuenet/valueNetAgent.ts  
apps/trainer/src/agents/valuenet/tdTrain.ts (only if required)

Required Implementation:

1) Implement batched inference helper

Add a function in valueNet.ts:

predictBatch(grids: Grid[]): number[]

Behavior:
- Encode each grid using the existing encoding.
- Create a single tensor batch.
- Run model.predict(batch).
- Return an array of scalar values (one per grid).
- Dispose intermediate tensors (use tf.tidy or manual disposal).

2) Refactor ExpectedSpawn evaluation

Replace sequential calls of:

V(grid_1)
V(grid_2)
...

with:

predictBatch([grid_1, grid_2, ...])

Then compute expectation using:

E[V(s')] =
Σ_empty_cells (1 / N_empty) *
  (p2 * V(grid_with_2) + p4 * V(grid_with_4))

3) Ensure tensor lifecycle safety

All tensors created inside training loops must be disposed.

Use either:
- tf.tidy blocks
or
- manual tensor.dispose()

4) Maintain identical behavior

The following must remain unchanged:

- state encoding
- epsilon-greedy logic
- TD update formula
- spawn probability (0.9 / 0.1)
- deterministic RNG usage

Verification:

Run:

npm --workspace apps/trainer run train:valuenet -- --episodes 50 --seed 1337

Expected:

- Training completes faster than before.
- No runtime errors.
- No NaN values in training output.
- Model artifacts still written to artifacts/models/.

Optional performance test:

time npm --workspace apps/trainer run train:valuenet -- --episodes 200 --seed 1337

Expected:
Runtime noticeably shorter than previous implementation.

Commit Message:

LAB-003.2: Batch ValueNet inference for ExpectedSpawn + tensor memory hygiene

## LAB-004 — Experiment Instrumentation + Learning Curve Analysis
Status: TODO

Objective:

Establish proper experiment instrumentation for neural training so that
learning dynamics can be observed, compared, and reproduced across runs.

LAB-003 introduced a functioning ValueNet TD(0) training pipeline with
model export and evaluation. However, the current system only records
final experiment statistics.

LAB-004 adds the ability to observe how the neural agent improves during
training by tracking learning curves and storing intermediate metrics.

This enables:

• detection of training plateaus  
• comparison of hyperparameter choices  
• reproducible experiment reporting  
• preparation for larger RL experiments  

The goal of LAB-004 is **observability**, not algorithmic improvements.

No changes to the learning algorithm should occur during this phase.

---

Scope of LAB-004:

1. Track learning metrics during training
2. Persist learning curves alongside model artifacts
3. Standardize experiment logging
4. Enable post-training analysis of learning progress

The first implementation task is LAB-004.1.

---

Constraints:

• Do not change the ValueNet architecture  
• Do not change the TD(0) update rule  
• Do not change reward definition  
• Do not modify evaluation logic  
• Maintain deterministic behavior under fixed seed  
• Preserve existing artifact directory structure  

All instrumentation must be **additive**.

---

Artifacts produced by LAB-004:

Each experiment run should contain:

artifacts/models/valuenet-v001/<run-name>/

Example contents:

model.json  
weights.bin  
config.json  
results.json  
learning-curve.csv   ← new artifact

---

Relationship to other LABs:

LAB-002  
Benchmark heuristic baseline

LAB-003  
Introduce ValueNet training and evaluation

LAB-004  
Add instrumentation to understand training dynamics

Future LAB-005 will focus on **algorithmic improvements**.


---------------------------------------------------------------------


## LAB-004.1 — Add Learning Curve Logging for ValueNet Training
Status: DONE

Objective:

Record training metrics during ValueNet training in order to produce a
learning curve describing the agent's improvement over time.

Metrics should be written to a CSV file stored alongside the trained model.

This allows visualization and comparison of training runs.

---

Required Output File:

artifacts/models/valuenet-v001/<run-name>/learning-curve.csv

---

CSV Format:

episode,score,maxTile,steps,avgScoreWindow,avgMaxTileWindow

Where:

episode           = training episode number  
score             = final score of that episode  
maxTile           = maximum tile reached in the episode  
steps             = number of moves taken in that episode  
avgScoreWindow    = rolling average score over recent episodes  
avgMaxTileWindow  = rolling average maxTile over recent episodes  

---

Logging Policy:

Training metrics should be written every N episodes.

Default parameters:

logInterval = 100
windowSize  = 100

Meaning:

• metrics recorded every 100 episodes
• rolling averages computed over the last 100 episodes

These values should remain constants in the training script.

---

Console Output Update:

Training console output should include rolling averages.

Example:

[valuenet-train] ep=100/20000 score=1840 maxTile=256 avgScore100=1622.4 avgMaxTile100=198.4

---

Files Allowed to Modify:

apps/trainer/src/agents/valuenet/tdTrain.ts  
apps/trainer/src/cli-train-valuenet.ts  

No other files should be modified.

---

Implementation Requirements:

1. Track per-episode statistics already available during training.

2. Maintain rolling windows for:

score  
maxTile  

3. Compute rolling averages.

4. Append rows to learning-curve.csv during training.

5. Ensure file creation happens inside the current run directory.

6. Ensure CSV writing is deterministic and reproducible.

---

Verification:

Run a short training job:

npm run trainer:train:valuenet -- --episodes 500 --seed 1337 --out artifacts/models/valuenet-v001/run-test

Expected results:

1. File exists:

artifacts/models/valuenet-v001/run-test/learning-curve.csv

2. File contains multiple rows.

3. First line is header:

episode,score,maxTile,steps,avgScoreWindow,avgMaxTileWindow

4. Console output includes rolling averages.

---

Clarifications:

- Pass `outDir` from `apps/trainer/src/cli-train-valuenet.ts` into `trainValueNetTd` via the training config.
- Write `learning-curve.csv` from `tdTrain.ts` inside the current run directory.
- Use fixed constants:
  - `logInterval = 100`
  - `windowSize = 100`
- Serialize `avgScoreWindow` and `avgMaxTileWindow` using stable fixed precision (`toFixed(4)`).

---

Commit Message:

LAB-004.1: Add learning curve logging for ValueNet training

---

## LAB-004.2 — Validate and Finalize Learning Curve Reporting Script
Status: TODO

Objective:

Review and validate the existing learning curve reporting tool introduced
after LAB-004.1.

The repository already contains:

scripts/report-learning-curve.mjs

and the root command:

npm run report:learning-curve

This ticket ensures the implementation is correct, stable, and aligned
with the learning-curve CSV format introduced in LAB-004.1.

No new functionality is required beyond validation and small fixes.

---

Scope:

1. Verify the script correctly reads:

   artifacts/models/valuenet-v001/<run-name>/learning-curve.csv

2. Confirm CSV parsing works for the format produced by LAB-004.1.

3. Validate that the script prints a clear training summary.

4. Ensure the script fails cleanly if the CSV file does not exist.

5. Confirm the script does not introduce external dependencies.

---

Expected Console Output:

The script should produce output similar to:

=== LEARNING CURVE REPORT ===

Run: run-001
Rows: 200
Episode range: 100 → 20000

AvgScoreWindow:
  first: 1622.4000
  last:  4188.2300
  delta: 2565.8300

AvgMaxTileWindow:
  first: 198.0800
  last:  412.5600
  delta: 214.4800

Best observed episode score: 12844
Best observed max tile: 1024

---

Non-Goals:

This ticket must NOT:

• modify training logic  
• modify TD learning implementation  
• change the CSV format introduced in LAB-004.1  
• introduce plotting libraries  
• introduce external dependencies  

ASCII trend output is **NOT required for acceptance**.

If present, it must not introduce additional dependencies.

---

Files Allowed to Modify:

scripts/report-learning-curve.mjs

package.json (only if command wiring requires adjustment)

No other files should be modified.

---

Verification:

Run:

npm run report:learning-curve -- --run run-test

Expected behavior:

1. Script reads:

   artifacts/models/valuenet-v001/run-test/learning-curve.csv

2. Script prints a readable training summary.

3. Script exits cleanly if the run directory does not exist.

Example failure case:

npm run report:learning-curve -- --run missing-run

Expected result:

Clear error message indicating the CSV file could not be found.

---

Deliverables:

1. Verified working script
2. Clean console output
3. Clear error handling for missing files

---

Commit Message:

LAB-004.2: Validate and finalize learning curve reporting script

## LAB-004.3 — Track Corner Ownership During Training

Objective

Add a structural metric to the training logs that measures whether the largest tile on the board ends in a corner.

This metric helps detect when the neural agent begins to discover the corner strategy, which is a well-known emergent behavior in successful 2048 agents.

Unlike score metrics alone, this structural metric reveals whether the policy is beginning to maintain stable board geometry.

⸻

Background

Strong human and AI 2048 strategies usually keep the largest tile anchored in a corner.

Example stable board:

1024 512 256 128
64 32 16 8
4 2 0 0
0 0 0 0

This structure:
	•	maximizes merge opportunities
	•	reduces board chaos
	•	preserves monotonic ordering

Reinforcement learning agents often rediscover this structure naturally, without being explicitly programmed to do so.

Tracking this metric during training helps identify when the agent begins to develop structured play.

⸻

Required Changes

Extend the existing training CSV logging to include two additional columns:

maxTileInCorner
pMaxTileInCornerWindow

⸻

Column Definitions

maxTileInCorner

Binary value per episode.

1 → at least one instance of the maximum tile is located in a corner
0 → otherwise

Corner positions:
	•	(0,0)
	•	(0,3)
	•	(3,0)
	•	(3,3)

⸻

pMaxTileInCornerWindow

Rolling average over the same window used for:
	•	avgScoreWindow
	•	avgMaxTileWindow

This value represents the fraction of recent episodes where the maximum tile ended in a corner.

Example value:

0.42

Meaning:

42% of recent games ended with the maximum tile in a corner.

⸻

CSV Format After Change

Example row:

episode,score,maxTile,steps,avgScoreWindow,avgMaxTileWindow,maxTileInCorner,pMaxTileInCornerWindow
100,1460,128,144,2616.4000,222.0800,1,0.37

⸻

Implementation Notes

Corner detection logic:

Return 1 if the maximum tile is located in any of these positions:
	•	grid[0][0]
	•	grid[0][3]
	•	grid[3][0]
	•	grid[3][3]

Otherwise return 0.

The rolling window calculation should mirror the logic already used for:
	•	avgScoreWindow
	•	avgMaxTileWindow

⸻

Files Allowed to Modify

apps/trainer/src/agents/valuenet/tdTrain.ts

No other files should be modified.

⸻

Acceptance Criteria

After running:

npm run exp:valuenet:v001 – –run run-test –episodes 1000 –games 50 –seed 1337

The generated CSV should include the new columns:
	•	maxTileInCorner
	•	pMaxTileInCornerWindow

Example snippet:

episode,score,maxTile,steps,avgScoreWindow,avgMaxTileWindow,maxTileInCorner,pMaxTileInCornerWindow
100,1460,128,144,2616.4000,222.0800,1,0.34
200,3336,256,272,2131.0800,183.3600,1,0.38
300,1296,128,135,2117.8800,186.5600,0,0.33

⸻

Expected Research Insight

Early training:

pMaxTileInCornerWindow ≈ 0.25 – 0.40

As training improves:

pMaxTileInCornerWindow ≈ 0.60 – 0.80

This increase usually precedes major improvements in score and max tile.

⸻

Priority

Low

This ticket improves training observability, not core learning behavior.

⸻

Why this ticket is valuable

This transforms the project from tracking only reward metrics into tracking policy structure, which is how reinforcement learning experiments are typically analyzed in research environments.

