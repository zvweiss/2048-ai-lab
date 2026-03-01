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


