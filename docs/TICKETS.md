# Tickets (Jira-lite)

## APP Tickets (Engineering)

### APP-001 Seed monorepo structure + docs
Status: DONE
Notes: Seed created with `apps/trainer`, `packages/core`, `/docs`, and Angular creation script.

### APP-002 Implement 2048 engine in packages/core + correctness tests
Status: DONE
Notes: Move/merge rules, spawn rules, terminal detection. Add unit tests.

### APP-003 Integrate core engine into trainer WS stream (replace fake board)
Status: DONE

### APP-004 Add Angular inference loader for published models in assets
Status: TODO
Notes: Load `model.json` + weights from `/assets/models/v###/` and run inference in browser.

### APP-005 Add model artifact export/copy pipeline (trainer -> ui assets)
Status: TODO

---

## LAB Tickets (RL Lab / Experiments)

### LAB-001 Define evaluation suite + metrics schema
Status: DONE
Notes: mean/median score, max-tile histogram, P(16384), P(32768), P(65536).
Eval CLI + artifact JSON schema + presets scripts + commands doc.

### LAB-002 Benchmark heuristic baseline agent
Status: DONE
Notes: Establish baseline curves and distributions for comparison.

### LAB-003 ValueNet v001 training run (simple TD) + eval
Status: TODO
Notes: Record config + results in EXPERIMENT_LOG.md.

