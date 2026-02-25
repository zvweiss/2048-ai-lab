# 2048 AI (Seed Repo)

This repository is structured as a **personal RL lab + deployable Angular demo**.

- **Public demo (deployable)**: `apps/ui` (Angular SPA). Can be deployed to GitHub Pages (static).
- **Private RL lab (local only)**: `apps/trainer` (Node + TypeScript; later uses `@tensorflow/tfjs-node` to train).
- **Shared core**: `packages/core` (2048 engine + shared types + encoders).

## Quick start (seed)
1) Install deps at repo root:
```bash
npm install
```

2) Start the trainer (local only):
```bash
npm run trainer:dev
```

3) Create the Angular app (one-time) using the provided script:
```bash
bash scripts/create-angular-ui.sh
```

4) Run the Angular UI (dev server):
```bash
npm run ui:dev
```

## Notes
- This seed repo **does not** include a full generated Angular project yet (to keep the seed small). The script will create it using your local Angular CLI.
- Model artifacts you *choose to deploy* should be copied into:
  - `apps/ui/src/assets/models/v###/model.json`
  - `apps/ui/src/assets/models/v###/*.bin`
- Local training outputs should go to `artifacts/` (gitignored).

See `/docs` for project status, tickets, architecture, and experiment log.
