# Architecture (Track A)

## Goals
- Local-only RL training in Node (private lab).
- Public deployment is a static Angular SPA (GitHub Pages compatible).
- Shared 2048 rules/encoding in a single package to avoid drift.
- APP tickets (engineering) separated from LAB tickets (experiments).

## Monorepo layout
- `apps/ui` — Angular SPA (deployable, static)
- `apps/trainer` — Node + TS (private, local)
- `packages/core` — shared 2048 engine/types/encoding

## Data artifacts
- `artifacts/` (gitignored): local training outputs, logs, raw eval runs.
- `apps/ui/src/assets/models/v###/` (committed): models you choose to publish/deploy.

## Optional local live dashboard
- During local training, `apps/trainer` can run a small web server:
  - REST commands: start/stop/eval
  - WebSocket stream: progress + board frames
- The Angular UI can connect via proxy during development.
- This is **not required** for public deployment.

## Future track (out of scope)
Multi-user university platform (auth/quotas/queues/storage) is explicitly out of scope for Track A.
