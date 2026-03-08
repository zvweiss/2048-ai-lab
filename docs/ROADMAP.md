# Roadmap

## Tier 1 — Educational (local)
- ValueNet predicts board value.
- 1-step lookahead chooses moves.
- Metrics: average score, max tile distribution.

## Tier 2 — Hybrid (local)
- ValueNet used as evaluator in shallow stochastic search.
- Target: occasional 32768 locally with enough training/compute.

## Tier 3 — Research-grade (local)
- Stabilization upgrades: replay buffer, n-step targets, symmetry augmentation, better evaluation suite.
- Target: 16384 almost always, 32768 consistently, 65536 measurable probability (hardware dependent).

## Public demo (always static)
- Ship pretrained models + inference only.
- No training exposed to end users.

# Performance Expectations and Tooling Ladder

The goal of this project is not to immediately build an elite 2048 AI.  
The goal is to construct a reinforcement learning system step-by-step, while measuring steady progress against reproducible baselines.

Progress in 2048 is not achieved simply by increasing training episodes.  
Higher max-tile performance requires improvements in architecture, training stability, evaluation discipline, and tooling.

A stronger agent usually requires improvements in:

- state encoding
- learning stability
- exploration strategy
- evaluation discipline
- compute efficiency
- search or policy quality

This document outlines realistic expectations for each stage of the project.

---

# Expected Max-Tile Ladder

## Random Baseline

Expected territory:

- usually 128 to 512
- sometimes 1024
- 2048 is extremely unlikely

Required tooling:

- deterministic game engine
- evaluation CLI
- reproducible random seeds
- baseline result storage

Purpose:

- sanity check
- lower-bound benchmark

---

## Expectimax Baseline

### Expectimax Depth 2

Expected territory:

- 1024 to 2048
- meaningful probability of reaching 2048

Required tooling:

- deterministic move generation
- expected spawn evaluation
- heuristic evaluation function
- reproducible evaluation presets

Purpose:

- strong classical baseline
- first serious benchmark for neural agents

---

### Expectimax Depth 3

Expected territory:

- 2048 more often
- occasional 4096

Required tooling:

- efficient evaluation
- deterministic search
- stable benchmarking scripts

Purpose:

- upper classical baseline
- reference point for neural progress

---

## ValueNet v001 (Current Milestone)

Architecture:

- simple state-value neural network
- TD(0) learning
- no replay buffer
- no target network
- simple scalar state encoding
- shallow expected-spawn policy

Expected territory:

- 512 to 2048
- reaching 2048 is a success milestone

Required tooling:

- training CLI
- evaluation CLI
- model save / load
- experiment runner
- experiment log
- reproducible baselines

Purpose:

- demonstrate real learning
- clearly outperform random
- establish the first neural baseline

Success criteria:

- learning curve trends upward
- neural agent beats random convincingly
- 2048 becomes achievable after sufficient training

---

## ValueNet v002 / v003

Likely improvements:

- replay buffer
- target network
- improved state encoding
- larger or more stable network
- improved exploration schedule
- batched training

Expected territory:

- 2048 more reliably
- some probability of 4096
- early exploration of 8192

Required tooling:

- experiment comparison tools
- faster training pipeline
- run management
- better logging and metrics

Purpose:

- stabilize training
- reduce variance
- narrow the gap with classical search

Success criteria:

- reliable 2048
- measurable probability of 4096
- significantly improved consistency

---

## Strong Neural 2048 Agent

Possible upgrades:

- richer state representation
- improved neural architecture
- better training objectives
- larger training budgets
- imitation learning from strong heuristics

Expected territory:

- 4096 to 8192
- occasional higher tiles

Required tooling:

- replay infrastructure
- checkpoint management
- baseline comparison tables
- learning-curve plotting
- long-run experiment automation

Purpose:

- transition from educational system to serious neural agent

---

## Research-Grade Hybrid System

Likely improvements:

- deeper neural networks
- improved reinforcement learning stability methods
- search + neural network hybrid approaches
- policy/value integration
- large-scale experiment tuning

Expected territory:

- 8192 to 16384+
- 32768 becomes a meaningful stretch goal
- 65536 becomes a long-term possibility

Required tooling:

- automated experiment orchestration
- benchmark regeneration scripts
- experiment dashboards
- checkpoint selection tools
- performance profiling

Purpose:

- explore advanced reinforcement learning approaches for 2048

---

# Interpreting the 65536 Tile

Is 65536 within reach?

For the overall project:
Yes — as a long-term research aspiration.

For ValueNet v001:
No — it is not a realistic expectation.

For a mature neural/search hybrid system:
It may become possible, but still difficult.

To seriously pursue 65536, the system would require:

- stable training infrastructure
- replay buffer and target network
- stronger neural architecture
- richer state encoding
- larger training budgets
- multiple experiment generations
- careful evaluation discipline

---

# Recommended Milestone Ladder

Milestone A  
Neural agent clearly beats random.

Milestone B  
Neural agent shows a reproducible upward learning curve.

Milestone C  
Neural agent reaches 2048 with meaningful frequency.

Milestone D  
Neural agent reaches 4096 with measurable probability.

Milestone E  
Advanced neural agent explores 8192 territory.

Milestone F  
Research-grade system investigates 16384, 32768, and eventually 65536.

---

# Project Mindset

The correct near-term question is not:

“Can this agent reach 65536?”

The correct question is:

“Can we build a reproducible reinforcement learning system that steadily improves and closes the gap with strong heuristic search?”

If the answer is yes, the project is progressing exactly as intended.





# Immediate Next Experiments (LAB-004)

## LAB-004 focuses on the first serious training experiments for the ValueNet architecture.
The goal is not to produce an elite 2048 agent immediately, but to observe measurable learning trends and compare them against existing baselines.

These experiments establish the first neural learning curve for the project.

⸻

## Goals of LAB-004
	1.	Train ValueNet v001 for progressively larger episode counts.
	2.	Measure performance against the existing baselines:
	•	Random agent
	•	Expectimax depth 2
	•	Expectimax depth 3
	3.	Record results in docs/EXPERIMENT_LOG.md.
	4.	Store evaluation outputs in docs/baselines/.
	5.	Observe whether the neural agent begins closing the gap to heuristic search.

⸻

## Experiment Series

The following experiment series should be run sequentially.

⸻

### Run 001 — Initial Neural Baseline

Training episodes:

20000

Command:

npm run exp:valuenet:v001:run-001

Evaluation:

500 games

Purpose:
	•	first meaningful neural training run
	•	verify training stability
	•	verify evaluation pipeline

Expected outcome:
	•	clear improvement over random
	•	learning curve beginning to emerge

⸻

### Run 002 — Medium Training Run

Training episodes:

50000

Command:

npm run exp:valuenet:v001 – –run run-002 –episodes 50000 –games 500 –seed 1337

Evaluation:

500 games

Purpose:
	•	observe continued learning progression
	•	check if ValueNet begins approaching Expectimax depth-2 strength

Expected outcome:
	•	higher mean score than run-001
	•	more frequent high tiles

⸻

### Run 003 — Extended Training Run

Training episodes:

100000

Command:

npm run exp:valuenet:v001 – –run run-003 –episodes 100000 –games 500 –seed 1337

Evaluation:

500 games

Purpose:
	•	determine whether learning saturates or continues improving
	•	establish a stable neural benchmark

Expected outcome:
	•	more consistent 2048 performance
	•	possible occasional 4096

⸻

## Metrics to Monitor

For each experiment, examine the following metrics:
	•	mean score
	•	median score
	•	score standard deviation
	•	mean number of steps
	•	max tile distribution
	•	probability of reaching tile thresholds

Important thresholds:
	•	P(tile ≥ 2048)
	•	P(tile ≥ 4096)
	•	P(tile ≥ 8192)

These values allow direct comparison with classical baselines.

⸻

## Result Recording

Each experiment run should produce:

Model artifacts stored in:

artifacts/models/valuenet-v001//

Evaluation results stored in:

docs/baselines/valuenet-v001-.json

Experiment log entries appended to:

docs/EXPERIMENT_LOG.md

This ensures all experiments remain reproducible and traceable.

⸻

## Evaluating Progress

The primary signal of success in LAB-004 is improvement across runs.

Specifically we want to observe:
	•	increasing mean score
	•	improved max tile distribution
	•	rising probability of reaching 2048

Even modest improvements confirm that the neural learning system is functioning correctly.

⸻

## Optional Future Tooling

After several experiments are recorded, the following tooling may be added:
	•	automatic learning-curve plotting from EXPERIMENT_LOG.md
	•	comparison tables between experiment runs
	•	evaluation dashboards

These tools will make long-term reinforcement learning progress easier to analyze.

⸻

## LAB-004 Success Criteria

### LAB-004 will be considered successful if:
	1.	Multiple ValueNet runs are executed reproducibly.
	2.	Results are logged and comparable.
	3.	The neural agent demonstrates measurable improvement across runs.
	4.	The system begins approaching the performance of classical baselines.

