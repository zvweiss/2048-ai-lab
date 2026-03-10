# Experiment Protocol

## Purpose

This document defines the standard procedure for running experiments in
the 2048 AI Lab project.

The goal is to ensure that all experiments are reproducible, comparable,
and well documented.

All agents must be evaluated using the same methodology.

------------------------------------------------------------------------

# Experiment Identification

Each experiment must have a unique identifier.

Format:

agent-name/version

Examples:

random/v001 expectimax/v001 dqn/v001

The identifier must be used consistently in logs, artifacts, and
evaluation outputs.

------------------------------------------------------------------------

# Experiment Configuration

Each experiment must record the following configuration parameters:

-   agent name
-   agent version
-   number of evaluation games
-   random seed base
-   engine backend (grid or bitboard)
-   training configuration (if applicable)

All parameters must be included in the experiment output.

------------------------------------------------------------------------

# Evaluation Procedure

Each agent must be evaluated using a fixed number of games.

Recommended baseline evaluation:

500 games

Evaluation must be performed with deterministic random seeds so that
results can be reproduced.

------------------------------------------------------------------------

# Metrics to Record

Every experiment must record the following metrics:

-   mean score
-   median score
-   standard deviation of scores
-   mean number of steps
-   median number of steps
-   maximum tile histogram
-   probability of reaching key tiles (2048, 4096, 8192, etc.)

These metrics provide a comprehensive picture of agent performance.

------------------------------------------------------------------------

# Artifact Storage

All experiment outputs must be stored under:

docs/baselines/

Files must be named according to the experiment identifier.

Example:

random-v001.json

------------------------------------------------------------------------

# Logging Results

After evaluation, results must be recorded in the experiment log.

The log should include:

-   experiment identifier
-   date
-   configuration summary
-   evaluation metrics
-   observations or notes

------------------------------------------------------------------------

# Reproducibility Requirement

Every experiment must be reproducible.

This means the following information must always be recorded:

-   seed base
-   number of evaluation games
-   engine version
-   agent configuration

If these elements are missing, the experiment result is considered
invalid.

------------------------------------------------------------------------

# Strategic Outcome

Following a strict experiment protocol ensures that improvements in the
project are measurable and scientifically valid.

It prevents inconsistent comparisons and ensures that the project
evolves with clear and trustworthy benchmarks.
