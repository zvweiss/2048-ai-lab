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
- npm run eval:expectimax:v001 (Expectimax baseline v001, d2, 200 games)

## Notes
- Evaluation outputs are saved under `artifacts/eval/` (gitignored).
- Public deployment remains static (Angular only).