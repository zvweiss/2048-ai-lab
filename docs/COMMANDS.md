# Commands

## Dev (Local Lab)
- Build core: `npm run core:build`
- Run trainer server (REST+WS): `npm run trainer:dev`
- Create Angular UI (one-time): `bash scripts/create-angular-ui.sh`
- Run Angular UI: `npm run ui:dev`

## Evaluation (LAB-001)
- Eval random agent (500 games): `npm run eval:500`
- Eval random agent (1000 games): `npm run eval:1000`
- Custom: `npm run trainer:eval -- --games 750 --seed 1337`

## Evaluation Presets
- Expectimax Baseline v001 (depth=2, 200 games): `npm run eval:expectimax:v001`
- Expectimax Depth 3 (50 games): `npm run eval:expectimax:d3:g50`

## Notes
- Evaluation outputs are saved under `artifacts/eval/` (gitignored).
- Public deployment remains static (Angular only).
