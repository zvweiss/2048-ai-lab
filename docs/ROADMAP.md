<!-- # Roadmap

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

## LAB-005 — Controlled Exploration and Training Stability

LAB-005 introduces an epsilon decay schedule into the ValueNet training loop.

Earlier experiments used a fixed exploration rate. While this allows learning to occur, it mixes two conflicting goals:

- exploration of new trajectories
- exploitation of the learned value function

The epsilon decay schedule gradually shifts the agent from exploration to exploitation over the course of training.

Early episodes explore broadly, while later episodes increasingly rely on the learned value network.

### Research Goal

The goal of LAB-005 is to determine whether controlled exploration produces more stable learning and stronger policies.

To evaluate this, experiments will be run with identical configurations but different random seeds.

Because reinforcement learning is stochastic, small differences early in training can lead to significantly different policies.

Running multiple seeds allows us to evaluate:

- robustness of learning
- variance across runs
- sensitivity to early exploration trajectories

### Planned Experiments

The initial experiment plan consists of running the same configuration with three different seeds.

Example runs:

- run-005 (seed 1337)
- run-006 (seed 2024)
- run-007 (seed 9001)

Each run will produce:

- learning curves
- corner ownership metrics
- final evaluation statistics

Comparing these runs allows us to determine whether the training process reliably converges toward strong policies, or whether results depend heavily on random initialization.

### Expected Observations

If the epsilon decay schedule improves learning stability, we expect to observe:

- more consistent learning curves across seeds
- higher final scores
- increased corner ownership probability
- more frequent appearance of large tiles (512, 1024, etc.)

If results vary widely between seeds, this indicates that the current training setup remains sensitive to stochastic factors, and further algorithm improvements may be needed.
 -->

 # 2048 AI Lab — Roadmap

This document describes the evolution of the project from basic experimentation toward a structured reinforcement learning research environment.

The goal is not only to build a strong 2048-playing agent, but also to understand how learning systems develop strategy in stochastic environments.

---

## LAB-003 — ValueNet Training Pipeline

LAB-003 introduces a neural network–based value function for evaluating board states.

### Objectives

- Implement a ValueNet model
- Train using TD(0)
- Integrate model inference into gameplay
- Export trained models
- Evaluate performance

### Outcome

At the end of LAB-003, the system supports:

- training a value network
- running evaluation games
- saving and loading models
- reproducible experiment runs

However, observability is still limited. We can measure performance, but not understand *how* the agent learns.

---

## LAB-004 — Observability and Learning Curves

LAB-004 introduces instrumentation to make learning behavior visible.

### Objectives

- log training metrics to CSV
- track rolling averages
- visualize learning curves
- introduce structural metrics (corner ownership)

### Key Metrics

- `AvgScoreWindow`
- `AvgMaxTileWindow`
- `maxTileInCorner`
- `pMaxTileInCornerWindow`

### Research Motivation

Performance alone does not reveal strategy.

Two agents with similar scores may behave very differently.

To understand learning, we must observe:

- how performance evolves
- whether structure emerges
- how policies stabilize

### Key Insight

The **corner ownership metric** provides a proxy for strategic understanding.

Strong 2048 play is characterized by:

- keeping the largest tile in a corner
- building monotonic rows
- merging toward that corner

Tracking this metric allows us to detect whether the agent discovers this structure.

### Outcome

LAB-004 transforms the project from a training system into an **observable learning system**.

We can now track:

- learning progress
- policy structure
- training stability

---

## LAB-005 — Controlled Exploration and Training Stability

LAB-005 introduces an epsilon decay schedule into the ValueNet training loop.

Earlier experiments used a fixed exploration rate. While this allows learning to occur, it mixes two conflicting goals:

- exploration of new trajectories
- exploitation of the learned value function

The epsilon decay schedule gradually shifts the agent from exploration to exploitation over the course of training.

Early episodes explore broadly, while later episodes increasingly rely on the learned value network.

---

### Research Goal

The goal of LAB-005 is to determine whether controlled exploration produces more stable learning and stronger policies.

To evaluate this, experiments will be run with identical configurations but different random seeds.

Because reinforcement learning is stochastic, small differences early in training can lead to significantly different policies.

Running multiple seeds allows us to evaluate:

- robustness of learning
- variance across runs
- sensitivity to early exploration trajectories

---

### The Three-Seed Experiment

A common methodology in reinforcement learning research is to repeat the same experiment multiple times with different random seeds.

For LAB-005 the experiment plan is:

- run-005 (seed 1337)
- run-006 (seed 2024)
- run-007 (seed 9001)

Each run uses identical parameters and training settings.

The only difference is the random seed controlling:

- environment randomness
- exploration choices
- initial stochastic trajectories

Each run produces:

- learning curves
- corner ownership metrics
- evaluation results

---

### Why Multiple Seeds Matter

In reinforcement learning, early stochastic events can strongly influence the long-term learning trajectory.

Two identical training runs may produce very different outcomes depending on what the agent experiences during the early episodes.

This phenomenon is sometimes referred to as **seed sensitivity**.

A single run therefore cannot reliably characterize the performance of a learning algorithm.

Running multiple seeds allows us to distinguish between:

- a consistently strong learning method
- a fragile method that succeeds only under favorable randomness

---

### Expected Observations

Typical outcomes across seeds may look like:

| Run     | Final Avg Score | Best Tile | Corner Ownership |
| ------- | --------------- | --------- | ---------------- |
| run-005 | moderate        | 512       | medium           |
| run-006 | strong          | 1024      | high             |
| run-007 | weak            | 256       | low              |

Even though all runs use the same code and hyperparameters.

This variation reflects the stochastic nature of reinforcement learning.

---

### Strategy Emergence and Phase Transitions

An especially interesting phenomenon in 2048 training is the sudden emergence of the **corner strategy**.

The corner strategy keeps the largest tile in a corner and builds monotonic rows toward that corner.

Human players discovered this strategy through experience.

Reinforcement learning agents often rediscover the same structure.

This usually appears as a sudden transition in two metrics:

- `AvgScoreWindow`
- `pMaxTileInCornerWindow`

Example learning behavior:

Score curve

low → slowly rising → sudden jump → stable improvement

Corner ownership curve

near zero → gradual increase → sharp transition → high probability

When this transition occurs, the agent has typically discovered the structural strategy underlying strong 2048 play.

---

### What This Experiment Will Reveal

The three-seed experiment allows us to determine whether the current training setup reliably discovers this strategy.

Possible outcomes include:

1. Consistent discovery across seeds  
   The learning curves and corner metrics converge similarly across runs.  
   This indicates the algorithm is robust.

2. Partial discovery  
   One or two runs discover the corner strategy while others do not.  
   This suggests the algorithm is promising but still sensitive to stochastic effects.

3. No discovery  
   All runs remain weak and corner ownership remains low.  
   This indicates further improvements are needed.

---

### Long-Term Research Direction

The ultimate goal of these experiments is to understand how reinforcement learning agents discover structured strategies in stochastic environments.

2048 serves as a compact experimental environment in which:

- stochastic dynamics
- value function learning
- policy emergence

can be studied in a controlled setting.

The instrumentation introduced in LAB-004 and LAB-005 provides the observability needed to track how these behaviors emerge during training.

---

## Summary

The project has evolved through three major stages:

LAB-003  
→ neural network training pipeline

LAB-004  
→ observability and learning analysis

LAB-005  
→ controlled exploration and experimental rigor

Together, these stages form the foundation of a reproducible reinforcement learning research environment.
