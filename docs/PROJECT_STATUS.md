# Project Status — 2048 AI (Personal RL Lab + Deployable Demo)

**Date:** 2026-02-24  
**Scope (NOW):** Track A — local Node trainer + deployable static Angular demo  
**Explicitly NOT in scope:** Track B — university multi-user training platform

## Current phase
- Seeding monorepo + continuity docs
- Establishing APP vs LAB ticket tracks
- Establishing shared core contracts (engine/types/encoding interfaces)

## What works today
- Repo seed scaffold
- Node trainer dev server (stub) with REST + WebSocket progress stream
- Angular UI creation script that generates an SPA and connects via proxy to WS/REST

## Next steps (high-level)
1. Stabilize `packages/core` engine API and write move-correctness tests.
2. Integrate real board frames into the WS stream (replace fake board).
3. Add model artifact format + Angular loader (inference in browser from `/assets/models/v###/`).
4. Add trainer CLI skeleton (local) that outputs artifacts to `artifacts/` and copies selected versions into the UI assets.
