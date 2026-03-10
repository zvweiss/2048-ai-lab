# Evaluation Standard

## Purpose

This document defines the official standard for comparing AI agents in
the 2048 AI Lab.

All agents must be evaluated using the same metrics and procedures to
ensure fair comparison.

------------------------------------------------------------------------

# Standard Evaluation Run

The standard evaluation run consists of:

500 complete games

Games must be played using deterministic seeds so that evaluation runs
can be reproduced.

------------------------------------------------------------------------

# Metrics Reported

Each evaluation must report the following metrics:

-   mean score
-   median score
-   score standard deviation
-   mean number of moves
-   median number of moves
-   maximum tile distribution

------------------------------------------------------------------------

# Max Tile Distribution

The distribution of the highest tile reached in each game must be
reported.

Typical tiles tracked:

-   128
-   256
-   512
-   1024
-   2048
-   4096
-   8192
-   16384
-   32768

This distribution provides a clearer view of agent capability than score
alone.

------------------------------------------------------------------------

# Probability Metrics

For each key tile level the probability of reaching that tile must be
calculated.

Example metrics:

-   probability of reaching 2048
-   probability of reaching 4096
-   probability of reaching 8192

These probabilities allow agents to be compared more meaningfully.

------------------------------------------------------------------------

# Baseline Comparisons

New agents should always be compared against baseline agents such as:

-   random agent
-   simple heuristic agents
-   expectimax agents

Baseline results must remain available for historical comparison.

------------------------------------------------------------------------

# Reporting Results

Evaluation results should be stored as structured data files.

Recommended format:

JSON

These files must be stored in:

docs/baselines/

Each evaluation file must include the experiment identifier and
evaluation configuration.

------------------------------------------------------------------------

# Interpretation Guidelines

When comparing agents:

-   higher mean score indicates stronger play
-   higher maximum tile probabilities indicate deeper strategic
    capability
-   lower variance may indicate more stable decision making

All comparisons should reference the same evaluation standard.

------------------------------------------------------------------------

# Strategic Outcome

By enforcing a consistent evaluation standard, the project ensures that
improvements in AI performance are measured fairly and transparently.

This makes the repository a reliable environment for experimentation and
learning.
