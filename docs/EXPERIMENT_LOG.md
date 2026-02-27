# Experiment Log

Record LAB runs here. Keep entries short and reproducible.

## Template
- **Run ID:** LAB-XXX / v###
- **Date:**
- **Model:** (ValueNet/DQN/etc)
- **Config:** (episodes, lr, gamma, epsilon schedule, replay size, etc)
- **Compute:** (CPU/GPU, machine)
- **Results:** (mean score, max tile distribution, key probabilities)
- **Notes:** (observations, next changes)

## Expectimax -v001

- **Date 2026-02-27**
- Decided to implement Expectimax inside apps/trainer first.
- Chose depth=3 initial target.
- Heuristic v001: empties + smoothness + monotonicity + maxTile.
