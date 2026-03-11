# SESSION CONTEXT

This document exists to preserve architectural and experimental continuity
in case the chat session or development session is interrupted.

---

# Where We Are

Branch:
feature/expectimax-v001

Goal:
Implement depth-limited Expectimax agent inside apps/trainer.

Core engine is stable and should NOT be modified.

---

# Design Decisions Made

1. Expectimax uses slideAndMerge (pure engine).
2. applyMove() is NOT used inside tree search (because it spawns randomly).
3. Chance nodes enumerate:
   - All empty cells
   - Tile=2 with p=0.9
   - Tile=4 with p=0.1
4. Depth counts plies (max + chance).
5. Heuristic v001:
   - empty cells heavily weighted
   - smoothness penalty
   - monotonicity reward
   - log2(maxTile) reward

---

# Current Implementation Files

apps/trainer/src/agents/
  agent.ts
  expectimax/
    expectimaxAgent.ts
    heuristic.ts (or heuristics.ts depending on final naming)

---

# What Still Needs Wiring

- Trainer CLI must:
  - Parse --agent expectimax
  - Parse --depth
  - Instantiate expectimax agent
- Evaluation loop must:
  - Use applyMove for real rollout
  - Use agent.chooseMove() each step
- JSON result must follow random-v001 schema

---

# Invariants (Do Not Break)

- packages/core remains pure
- slideAndMerge is deterministic
- spawnRandomTile is used only in real game rollout
- Baselines stored under docs/baselines

---

# Recovery Instructions (If Session Dies)

1. git checkout feature/expectimax-v001
2. Read PROJECT_STATUS.md
3. Read this file
4. Continue wiring trainer integration
5. Run 200-game eval
6. Create expectimax-v001 baseline

No memory of prior chat required.

---

# Strategic Principle

master = stable deterministic baseline  
feature/* = experimental agents  

Commit frequently. Tag milestones.

---

Last Updated: 2026-02-27