# EXPERIMENTS — 2048 AI Lab

This document records individual experiment runs, configurations, and observations.

The purpose of this file is to provide a reproducible and traceable record of how the system behaves under different training conditions.

Unlike ROADMAP.md (research direction) and INSIGHTS.md (conceptual understanding), this file captures **empirical results**.

---

## How to Use This File

Each experiment should:

- have a unique run ID
- record full configuration
- include key metrics
- include observations and interpretation

Experiments should be reproducible using the recorded parameters.

---

## Template

### Run ID

run-XXX

### Date

YYYY-MM-DD

### Configuration

- episodes:
- evaluation games:
- seed:
- epsilon:
- model:
- notes:

### Results

- AvgScoreWindow (final):
- AvgMaxTileWindow (final):
- Best score:
- Best tile:
- Corner ownership (final):

### Learning Behavior

- curve shape:
- variance:
- stability:

### Observations

- key behaviors:
- anomalies:
- notable events:

### Interpretation

- Did learning occur?
- Was the policy stable?
- Did structure emerge?
- Did corner strategy appear?

### Next Steps

- ideas for improvement
- follow-up experiments

---

## Experiments

---

### Run-005

### Date

2026-03-18

### Configuration

- episodes: 5000
- evaluation games: 100
- seed: 1337
- epsilon: decay (0.10 → 0.01)
- model: valuenet-v001
- notes: first run with epsilon decay

### Results

- AvgScoreWindow (final): ~3000
- AvgMaxTileWindow (final): ~230
- Best score: 6076
- Best tile: 512
- Corner ownership (final): ~0.02

### Learning Behavior

- curve shape: gradual upward trend
- variance: high
- stability: low to moderate

### Observations

- epsilon decays correctly and reaches minimum
- occasional 512 tiles achieved
- scores fluctuate significantly
- corner ownership remains near zero

### Interpretation

- learning is present but unstable
- policy is improving but not structured
- corner strategy has not emerged
- value network still shallow

### Next Steps

- run multiple seeds for comparison
- increase training length
- observe corner metric over longer runs

---

## Cross-Run Comparison

| Run     | Seed | Episodes | Final Score | Best Tile | Corner % |
| ------- | ---- | -------- | ----------- | --------- | -------- |
| run-005 | 1337 | 5000     | ~3000       | 512       | ~0.02    |

(Add additional runs as they are completed)

---

## Best Run So Far

- Run ID:
- Configuration:
- Final AvgScoreWindow:
- Best Tile:
- Corner Ownership:

---

## Observational Patterns

This section captures recurring patterns across experiments.

- learning is noisy early in training
- improvements are not monotonic
- large tiles (512+) appear before stable strategy
- corner strategy has not yet emerged

(Update as new insights appear)

---

## Notes

- Always compare multiple seeds before drawing conclusions
- Single runs can be misleading due to stochasticity
- Focus on trends, not individual outliers
