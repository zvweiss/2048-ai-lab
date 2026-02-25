# Repository Guide

This file explains what each part of the repo is for, without implying cleanup or deletion.  
Seed scaffolding is intentional and should be kept.

## Classification labels
- `Active now`: used by the current runnable flow.
- `Seed scaffold (keep)`: placeholder or generated structure intentionally kept for future work.
- `Planned future use`: documented target for upcoming tickets.

## Top-level structure
- `apps/`
  - `trainer/`: local Node/TypeScript backend for lab mode.
  - `ui/`: Angular SPA for local dashboard and deployable static demo.
- `packages/`
  - `core/`: shared 2048 engine/types used by trainer (and later UI inference support).
- `docs/`: architecture, roadmap, tickets, status, experiment log, and this guide.
- `scripts/`: helper scripts for creating/running/building UI and basic checks.

## Root files
- `package.json` — `Active now`  
  Workspace scripts for trainer/core/ui tasks.
- `package-lock.json` — `Active now`  
  Root dependency lockfile.
- `tsconfig.base.json` — `Active now`  
  Shared TypeScript defaults for internal packages.
- `.gitignore` — `Active now`  
  Ignores node/build outputs, Angular cache, artifacts, env files.
- `README.md` — `Active now`  
  Quick-start and project framing.
- `.vscode/launch.json` — `Seed scaffold (keep)`  
  Optional editor debug launch config.

## docs/
- `ARCHITECTURE.md` — `Active now`
- `PROJECT_STATUS.md` — `Active now`
- `ROADMAP.md` — `Active now`
- `TICKETS.md` — `Active now`
- `EXPERIMENT_LOG.md` — `Planned future use`  
  Template for recording real LAB runs.
- `REPO_GUIDE.md` — `Active now`

## packages/core
- `package.json` — `Active now`
- `tsconfig.json` — `Active now`
- `src/types.ts` — `Active now`  
  Shared contracts (`GameState`, `Direction`, RNG/spawn types).
- `src/engine.ts` — `Active now`  
  2048 logic: new game, move application, merge/spawn/game-over checks.
- `src/index.ts` — `Active now`  
  Package exports.

## apps/trainer
- `package.json` — `Active now`  
  Dev/build/train commands.
- `tsconfig.json` — `Active now`
- `src/server.ts` — `Active now`  
  Express + WebSocket server for local lab mode.
- `src/rng.ts` — `Active now`  
  Deterministic PRNG implementation.
- `src/cli.ts` — `Seed scaffold (keep)`  
  CLI placeholder for later full training pipeline.

## apps/ui
- `package.json` — `Active now`
- `package-lock.json` — `Active now`
- `angular.json` — `Active now`
- `proxy.conf.json` — `Active now`  
  Dev proxy from Angular to trainer REST/WS on port 3000.
- `tsconfig.json` / `tsconfig.app.json` / `tsconfig.spec.json` — `Active now`
- `README.md` — `Seed scaffold (keep)`  
  Standard Angular-generated README.
- `.vscode/launch.json` — `Seed scaffold (keep)`
- `.vscode/extensions.json` — `Seed scaffold (keep)`
- `src/main.ts` — `Active now`  
  Bootstraps `AppComponent` with `HttpClient`.
- `src/index.html` — `Active now`
- `src/styles.css` — `Seed scaffold (keep)`  
  Global style entrypoint; intentionally minimal right now.
- `public/favicon.ico` — `Seed scaffold (keep)`
- `src/app/app.component.ts` — `Active now`  
  Current dashboard component.
- `src/app/services/ai-api.service.ts` — `Active now`  
  REST calls to trainer endpoints.
- `src/app/services/ai-socket.service.ts` — `Active now`  
  WebSocket client and message stream.
- `src/app/app.css` — `Seed scaffold (keep)`  
  Component stylesheet slot; currently minimal/empty is acceptable.
- `src/app/app.ts` — `Seed scaffold (keep)`  
  Generated standalone app class, currently not bootstrapped.
- `src/app/app.config.ts` — `Seed scaffold (keep)`  
  Generated app config/routing provider scaffold.
- `src/app/app.routes.ts` — `Seed scaffold (keep)`  
  Route scaffold for future expansion.
- `src/app/app.html` — `Seed scaffold (keep)`  
  Generated template scaffold.

## scripts
- `create-angular-ui.sh` — `Active now`  
  One-time Angular project generation/bootstrap helper.
- `run-ui-dev.mjs` — `Active now`  
  Runs `ng serve --proxy-config proxy.conf.json`.
- `run-ui-build.mjs` — `Active now`  
  Runs Angular production build.
- `format-check.mjs` — `Seed scaffold (keep)`  
  Placeholder script until formatting/linting pipeline is wired.

## Operational flow (current)
1. `npm install` at repo root.
2. `npm run trainer:dev` to start local trainer server (`http://localhost:3000`, WS `/ws`).
3. `npm run ui:dev` to run Angular UI (`http://localhost:4200`) with proxy to trainer.

## Intentional seed policy
- Seed files are part of continuity scaffolding.
- Empty/minimal files can still be valid placeholders.
- Do not delete seed files unless a specific ticket explicitly replaces them.
