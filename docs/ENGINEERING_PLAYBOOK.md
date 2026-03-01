# ENGINEERING PLAYBOOK
## 2048 AI Lab
Author: Zvi Weiss
Status: Active
Intent: Research-Grade AI Engineering Discipline

---

## 1. Philosophy

This repository is not a toy project.

It is a controlled AI research environment with:

- Deterministic evaluation
- Statistical baselines
- Versioned agents
- CI-enforced guardrails
- Clear promotion workflow

The goal is not to “make it work.”
The goal is to make it reproducible, comparable, and evolvable.

---

## 2. Architectural Invariants (Non-Negotiable)

### 2.1 Core Engine Purity

Location:
packages/core

Rules:

- Must remain pure.
- No randomness except via injected RNG.
- No agent logic.
- No search logic.
- No heuristics.

The engine defines the game contract.
Agents depend on it.
The engine does not depend on agents.

---

### 2.2 Trainer Responsibility

Location:
apps/trainer

Responsibilities:

- Agent orchestration
- Evaluation loop
- Statistics aggregation
- Baseline JSON output
- Deterministic seeded runs

The trainer is the experimental harness.

---

### 2.3 UI Responsibility

Location:
apps/ui

- Visualization only
- No core game logic duplication
- No AI logic embedded

UI consumes trainer outputs or sockets.

---

## 3. Branching Strategy

master:
- Always stable
- Always reproducible
- Always passing CI

feature/*:
- Experimental
- Agent development
- Heuristic tuning
- Architecture exploration

No direct commits to master without merge.

---

## 4. Agent Versioning Policy

Every agent must follow semantic versioning by performance contract.

Format:
<agent-name>-v00X

Examples:

random-v001
expectimax-v001
expectimax-v002
dqn-v001

A version increments when:

- Heuristic changes
- Search depth changes
- Architecture changes
- Training method changes

Baseline files are immutable once committed.

---

## 5. Baseline Protocol

Location:
docs/baselines/

Each baseline JSON must include:

- agent
- games
- seedBase
- meanScore
- medianScore
- stdScore
- maxTileHistogram
- pAtLeast
- samples

No baseline may be overwritten.
New performance → new version.

---

## 6. Experiment Protocol

Before Running:

1. Clean working tree
2. Correct branch checked out
3. Deterministic seed defined
4. Games >= 200 (minimum statistical credibility)

Run:

npm run trainer:eval -- \
  --agent expectimax \
  --depth 3 \
  --games 500 \
  --seedBase 1337

After Run:

- Save output to artifacts/runs/
- If accepted, promote to docs/baselines/
- Log decision in EXPERIMENT_LOG.md

---

## 7. CI Guardrails

CI protects statistical integrity.

Each stable agent must define:

- Acceptable meanScore range
- Required tile distribution
- p(>=2048) threshold if applicable

Example:

Random v001:
- meanScore ∈ [950, 1250]
- p(>=2048) == 0

Expectimax v001:
- meanScore > 2500
- 512 tile must appear
- meanSteps > random meanSteps

If violated → CI fails.

---

## 8. Promotion Lifecycle

Prototype → Stable → Baseline → Guarded → Tagged

1. Develop in feature branch
2. Validate via local eval
3. Create baseline JSON
4. Define CI guardrails
5. Merge to master
6. Tag release

Example:
git tag expectimax-v001
git push --tags

---

## 9. Determinism Requirements

All evaluation must be:

- Seeded
- Repeatable
- Independent of system clock
- Independent of hardware

RNG must be injected.
No Math.random in agents.

---

## 10. Performance Ladder Strategy

This project evolves along a deliberate ladder:

1. Random baseline
2. Heuristic baseline
3. Expectimax
4. Expectimax + optimizations
5. Neural DQN
6. Hybrid (Search + NN)
7. Self-play improvement
8. Model export + UI visualization

No skipping conceptual layers.

---

## 11. Experiment Logging Discipline

All non-trivial design decisions must be logged in:

docs/EXPERIMENT_LOG.md

Log must include:

- Date
- Decision
- Rationale
- Tradeoff
- Outcome

This prevents institutional memory loss.

---

## 12. Risk Mitigation

Before large refactors:

- Run recursive tree view
- Confirm module boundaries
- Run full test suite
- Run baseline eval

No architectural rewrite without evaluation validation.

---

## 13. Definition of "Research-Grade"

The project is research-grade if:

- Results are reproducible
- Statistical claims are defensible
- Architecture enforces separation of concerns
- Baselines are immutable
- CI prevents regression

---

## 14. North Star

This repository is a laboratory.

It exists to explore:

- Reinforcement Learning
- Search algorithms
- Statistical evaluation
- Neural approximations
- Hybrid systems

With discipline.

---

Last Updated: 2026-02-27

# BRANCHING & RELEASE POLICY

## Philosophy

This repository is both:

- A reproducible RL research lab
- A software engineering project with deterministic baselines

Therefore:

- Stability and reproducibility are first-class requirements
- Experimental work must not destabilize master
- Baselines must remain reproducible over time

---

## Branch Types

### master

Purpose: Stable, reproducible, always runnable.

Rules:

- Must build and typecheck
- Must pass verification script (if present)
- Must run evaluation presets successfully
- Must preserve deterministic behavior

What belongs on master:

- Stable engine code
- Evaluation infrastructure
- Baseline JSON files in docs/baselines/
- Stable neural milestones
- Documentation updates

What must NOT be merged directly:

- Experimental neural prototypes
- Incomplete features
- Nondeterministic changes
- Large unverified refactors

---

### feature/*

Purpose: Ticket-scoped development intended for merge into master.

Naming examples:

- feature/lab-003-valuenet-v001
- feature/lab-004-policy-net-v001

Rules:

- One logical ticket per branch
- Minimal scope creep
- Commit messages must start with ticket id (e.g., LAB-003)
- Must satisfy acceptance criteria before merge

---

### exp/*

Purpose: Exploratory research branches.

Naming examples:

- exp/valuenet-encoding-8ch
- exp/dqn-replay-buffer
- exp/tdlambda

Rules:

- May break tests
- May be nondeterministic
- May be incomplete
- Must never merge directly into master

Promotion process:

1. Create a new feature/* branch
2. Extract minimal clean implementation
3. Merge via normal feature workflow

---

## Starting a New Feature Branch

git checkout master    
git pull   
git checkout -b feature/your-ticket-name<br>
git push -u origin feature/your-ticket-name

Example:  
git checkout -b feature/lab-003-valuenet-v001

---

## Keeping a Feature Branch Updated

git checkout feature/your-ticket-name<br>
git fetch origin<br>
git rebase origin/master

---

## Merge Procedure (feature → master)

### Ensure master is up to date:

git checkout master<br>
git pull

Merge using explicit merge commit:

git merge --no-ff feature/your-ticket-name<br>
git push

---

## Tagging Policy

Tags mark reproducible milestones.

After merging a stable LAB ticket:

git tag lab-002.1<br>
git push origin lab-002.1

Neural milestones should be tagged:

git tag lab-003-v001<br>
git push origin lab-003-v001

Tags allow full historical reproduction of:

- Code
- Baselines
- Experiment log state

---

## Artifact Policy

Tracked in git:

- docs/baselines/*.json
- docs/EXPERIMENT_LOG.md

Not tracked:

- artifacts/models/
- artifacts/eval/
- Large generated logs

Artifacts remain reproducible but not versioned.

---

## Commit Message Convention

Format:

LAB-XXX: short description

Examples:

LAB-002.1: Fix repo-root eval output paths
LAB-003: Add ValueNet v001 TD training
EXP: Try multi-channel encoding

---

## Determinism Requirement

Any code merged into master must:

- Respect seeded RNG behavior
- Produce reproducible evaluation results
- Avoid hidden randomness

Determinism is required for all baselines.

Any code merged into master must:

- Respect seeded RNG behavior
- Produce reproducible evaluation results
- Avoid hidden randomness

Determinism is required for all baselines.
