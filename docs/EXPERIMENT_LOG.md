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
2026-03-05T19:02:32.986Z | valuenet-v001 | smoke | 5 | 5 | 1337 | artifacts/models/valuenet-v001/smoke/model.json | docs/baselines/valuenet-v001-smoke.json
2026-03-05T19:27:27.490Z | valuenet-v001 | run-test | 5 | 5 | 1337 | artifacts/models/valuenet-v001/run-test/model.json | docs/baselines/valuenet-v001-run-test.json
2026-03-05T19:54:18.893Z | valuenet-v001 | run-test | 5 | 5 | 1337 | artifacts/models/valuenet-v001/run-test/model.json | docs/baselines/valuenet-v001-run-test.json
2026-03-11T03:35:37.341Z | valuenet-v001 | baseline-v001 | episodes=100 | games=5 | seed=1337 | artifacts/models/valuenet-v001/baseline-v001/model.json | docs/baselines/valuenet-v001-baseline-v001.json
