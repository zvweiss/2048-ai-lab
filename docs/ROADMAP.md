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
