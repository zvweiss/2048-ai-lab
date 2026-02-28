# PROJECT STATUS

## Project: 2048 AI Lab
Owner: Zvi Weiss  
Architecture: Monorepo (core + trainer + ui)  
Primary Focus: Reinforcement Learning + Classical Search (Expectimax)

---

# Current Branch

feature/expectimax-v001

---

# Stable Baseline (Committed)

## Random Agent v001

- Games: 500
- Seed Base: 1337
- Mean Score: 1093.768
- Median Score: 1018
- Std Dev: 556.9
- Max Tile: 256
- 2048 reached: 0%

File:
docs/baselines/random-v001.json

This establishes the deterministic statistical reference for future agents.

---

# Repository Structure (High-Level)

packages/
  core/            -> Pure 2048 engine (rules, merge, spawn)
apps/
  trainer/         -> Evaluation + agents + experiments
  ui/              -> Angular SPA
docs/
  baselines/       -> Versioned statistical contracts
  ARCHITECTURE.md
  ROADMAP.md
  EXPERIMENT_LOG.md

---

# Expectimax v001 – Status

## Implemented

- Agent interface (apps/trainer)
- Expectimax algorithm (depth-limited)
  - Proper max node (player)
  - Proper chance node (enumerated spawns)
  - Uses slideAndMerge (pure engine)
- Heuristic v001:
  - Empty cell reward
  - Smoothness penalty
  - Monotonicity score
  - Max tile bonus

## Not Yet Completed

- Trainer CLI integration for expectimax
- Parameter wiring (depth, p2)
- Evaluation run (200 games)
- Baseline creation: expectimax-v001.json
- CI guardrails for expectimax

---

# Next Concrete Steps

1. Wire agent selection into trainer CLI
2. Run 200-game eval (depth=3)
3. Validate performance jump vs random
4. Create docs/baselines/expectimax-v001.json
5. Define CI statistical guardrails

---

# Target Acceptance Criteria (Depth=3)

- Mean score > 2500
- 256 tile common
- 512 tile present
- Clear improvement over random baseline

---

# Long-Term Roadmap

Random
→ Heuristic
→ Expectimax
→ Neural (DQN)
→ Self-play improvement
→ Model export + UI visualization

---

Last Updated: 2026-02-27
