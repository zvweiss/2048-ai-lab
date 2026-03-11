# Bitboard Engine Test Strategy

The goal of the bitboard engine is not simply to create a faster version
of the current game engine. The goal is to introduce a high-performance
execution backend while preserving the exact game mechanics defined by
the grid engine.

The grid engine remains the reference implementation of the 2048 rules.

The bitboard engine must therefore produce results that are identical to
the grid engine for every board state and every move.

This document defines how correctness will be verified before the
bitboard engine is used in large-scale experiments.

------------------------------------------------------------------------

# Reference Engine Principle

Optimized algorithms often become difficult to reason about directly.

Bitboard implementations are extremely compact and efficient but are
harder to debug and verify.

For this reason the project follows a reference engine model.

The grid engine defines the correct behavior of the system.

The bitboard engine must reproduce that behavior exactly.

All validation therefore focuses on engine equivalence rather than
isolated implementation tests.

------------------------------------------------------------------------

# Core Equivalence Requirement

For every board state and move direction both engines must produce
identical results.

The following properties must always match:

-   move validity
-   score gained from the move
-   resulting board configuration
-   game-over detection

If any difference appears between the engines, the bitboard
implementation must be considered incorrect.

------------------------------------------------------------------------

# Test Layers

The verification process is divided into three layers of increasing
strength.

Each layer increases confidence in the correctness of the optimized
engine.

The three layers are:

-   deterministic board tests
-   random board equivalence tests
-   full rollout equivalence tests

------------------------------------------------------------------------

# Deterministic Board Tests

Deterministic tests use carefully chosen board states that verify the
most important merge rules of the game.

These tests ensure that the bitboard implementation respects the
official mechanics of 2048.

Typical scenarios include:

Single merge

2 2 0 0 becomes

4 0 0 0

Double merge

2 2 4 4 becomes

4 8 0 0

Blocked merge

2 2 2 0 becomes

4 2 0 0

No movement

2 4 8 16 remains

2 4 8 16

Full board with no possible merges

2 4 8 16 32 64 128 256 512 1024 2 4 8 16 32 64

Result

No move possible.

These deterministic scenarios verify the core merge rules and ensure the
bitboard logic follows the same behavior as the grid engine.

------------------------------------------------------------------------

# Random Board Equivalence Tests

Random board testing verifies correctness across a much larger space of
possible board configurations.

Random boards are generated using valid tile values.

For each generated board the following process is executed:

1.  apply the move using the grid engine
2.  apply the move using the bitboard engine
3.  compare the results

The engines must agree on:

-   whether the move was valid
-   the score gained from the move
-   the resulting board configuration
-   the game-over state

If a mismatch occurs the test fails immediately and reports the board
state that caused the divergence.

Random testing is extremely effective at revealing subtle errors in
optimized logic.

------------------------------------------------------------------------

# Full Rollout Equivalence Tests

The strongest validation method is full game rollout comparison.

Both engines begin from the same initial board state.

The engines then execute the same sequence of moves.

After every move the following properties must remain identical:

-   board configuration
-   accumulated score
-   game-over state

If the engines diverge at any step the test fails and reports the step
where the divergence occurred.

This test ensures the engines remain equivalent across long sequences of
gameplay.

------------------------------------------------------------------------

# Test Harness Location

The equivalence test harness will be located inside the core engine test
directory.

packages/core/test

The tests will be executed automatically as part of the project's test
suite.

------------------------------------------------------------------------

# Continuous Integration

Equivalence tests must run during the following development activities:

-   local development runs
-   continuous integration pipelines
-   milestone validation for the bitboard engine

A failing equivalence test must block promotion of the bitboard engine.

------------------------------------------------------------------------

# Failure Reporting

When a mismatch occurs the test harness should report enough information
to reproduce the problem immediately.

This includes:

-   the initial board state
-   the move direction
-   the result produced by the grid engine
-   the result produced by the bitboard engine

Clear reporting dramatically reduces debugging time.

------------------------------------------------------------------------

# Acceptance Criteria for Bitboard Promotion

The bitboard engine can only be used in training experiments when the
following conditions are satisfied:

-   deterministic board tests pass
-   large random board equivalence runs produce no mismatches
-   full rollout simulations remain identical to the grid engine

Only after these conditions are satisfied can the bitboard engine be
used for large-scale AI experiments.

------------------------------------------------------------------------

# Strategic Outcome

The testing strategy ensures that performance improvements never
compromise correctness.

The grid engine remains the authoritative definition of the game rules.

The bitboard engine becomes the high-performance execution backend used
for search algorithms and reinforcement learning experiments.

By maintaining strict equivalence testing, the project achieves both
reliability and performance.
