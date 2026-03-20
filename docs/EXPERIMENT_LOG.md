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

**2026-02-27**
Decided to implement Expectimax inside apps/trainer first.
Chose depth=3 initial target.
Heuristic v001: empties + smoothness + monotonicity + maxTile.
  
## valuenet-v001
**2026-03-05**
valuenet-v001 | smoke | 5 | 5 | 1337 | 
artifacts/models/valuenet-v001/smoke/model.json | 
docs/baselines/valuenet-v001-smoke.json   

**2026-03-05T19:27:27.490Z**
valuenet-v001 | run-test | 5 | 5 | 1337 |
artifacts/models/valuenet-v001/run-test/model.json |
docs/baselines/valuenet-v001-run-test.json

**2026-03-05T19:54:18.893Z**
valuenet-v001 | run-test | 5 | 5 | 1337 |
artifacts/models/valuenet-v001/run-test/model.json |
docs/baselines/valuenet-v001-run-test.json

**2026-03-11T03:35:37.341Z** 
valuenet-v001 | baseline-v001 | episodes=100 | games=5 | seed=1337 | 
artifacts/models/valuenet-v001/baseline-v001/model.json | 
docs/baselines/valuenet-v001-baseline-v001.json

**2026-03-11T16:29:01.911Z**
valuenet-v001 | test-check | episodes=100 | games=10 | seed=1337 | 
artifacts/models/valuenet-v001/test-check/model.json | 
docs/baselines/valuenet-v001-test-check.json
  
**2026-03-11T16:31:32.563Z**
valuenet-v001 | test-check | episodes=100 | games=10 | seed=1337 | 
artifacts/models/valuenet-v001/test-check/model.json | 
docs/baselines/valuenet-v001-test-check.json

**2026-03-11T16:40:07.542Z**
valuenet-v001 | test-check | episodes=100 | games=10 | seed=1337 | 
artifacts/models/valuenet-v001/test-check/model.json | 
docs/baselines/valuenet-v001-test-check.json

**2026-03-11T18:04:24.480Z**
valuenet-v001 | test-check | episodes=100 | games=10 | seed=1337 | 
artifacts/models/valuenet-v001/test-check/model.json 
| docs/baselines/valuenet-v001-test-check.json

**2026-03-11T18:11:47.403Z**
valuenet-v001 | test-check | episodes=100 | games=10 | seed=1337 | 
artifacts/models/valuenet-v001/test-check/model.json 
| docs/baselines/valuenet-v001-test-check.json

**2026-03-11T18:14:21.367Z**
valuenet-v001 | test-check | episodes=100 | games=10 | seed=1337 | 
artifacts/models/valuenet-v001/test-check/model.json 
| docs/baselines/valuenet-v001-test-check.json

**2026-03-11T18:18:05.544Z**
valuenet-v001 | test-check | episodes=100 | games=10 | seed=1337 | 
artifacts/models/valuenet-v001/test-check/model.json | 
docs/baselines/valuenet-v001-test-check.json

**2026-03-11T18:22:53.866Z**
valuenet-v001 | test-check | episodes=100 | games=10 | seed=1337 | 
artifacts/models/valuenet-v001/test-check/model.json | 
docs/baselines/valuenet-v001-test-check.json

**2026-03-11T21:24:42.232Z**
valuenet-v001 | run-001 | episodes=20000 | games=500 | seed=1337 | 
artifacts/models/valuenet-v001/run-001/model.json | 
docs/baselines/valuenet-v001-run-001.json

**2026-03-12T00:26:51.367Z**valuenet-v001 | run-002 | episodes=20000 | games=500 | seed=1337 | 
artifacts/models/valuenet-v001/run-002/model.json | 
docs/baselines/valuenet-v001-run-002.json

**2026-03-12T16:32:36.710Z**valuenet-v001 | run-003 | episodes=20000 | games=500 | seed=1337 | 
artifacts/models/valuenet-v001/run-003/model.json | 
docs/baselines/valuenet-v001-run-003.json

**2026-03-12T22:05:50.049Z**
valuenet-v001 | run-test | episodes=1000 | games=50 | seed=1337 | 
artifacts/models/valuenet-v001/run-test/model.json | 
docs/baselines/valuenet-v001-run-test.json

**2026-03-13T19:24:02.335Z**
valuenet-v001 | run-test | episodes=1000 | games=50 | seed=1337 | 
artifacts/models/valuenet-v001/run-test/model.json | 
docs/baselines/valuenet-v001-run-test.json

**2026-03-19T13:34:41.813Z**
valuenet-v001 | test-check | episodes=100 | games=10 | seed=1337 | 
artifacts/models/valuenet-v001/test-check/model.json | 
docs/baselines/valuenet-v001-test-check.json
2026-03-19T21:23:48.955Z | valuenet-v001 | run-004 | episodes=5000 | games=100 | seed=1337 | artifacts/models/valuenet-v001/run-004/model.json | docs/baselines/valuenet-v001-run-004.json
