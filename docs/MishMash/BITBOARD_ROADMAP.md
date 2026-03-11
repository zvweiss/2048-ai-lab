# Bitboard Migration Roadmap

## Purpose

This document describes the long-term plan for introducing a
bitboard-based engine into the 2048 AI Lab.

The current grid-based implementation in packages/core remains the
reference engine for correctness.

The future bitboard implementation will provide a high-performance
execution backend for search and reinforcement learning experiments.

------------------------------------------------------------------------

# Architectural Principles

## Dual Engine Model

The project will maintain two engines:

-   Grid Engine --- reference implementation for correctness
-   Bitboard Engine --- high-performance implementation for search and
    simulation

The grid engine acts as the oracle for validating the bitboard engine.

Both engines must produce identical game behavior.

------------------------------------------------------------------------

# Bitboard Representation

The bitboard engine will represent the entire 4×4 board as a single
64‑bit value.

Each tile occupies four bits storing the exponent of two.

Example mapping:

empty = 0\
2 = 1\
4 = 2\
8 = 3\
16 = 4

Total storage:

16 cells × 4 bits = 64 bits

------------------------------------------------------------------------

# Roadmap Milestones

## BB‑001 --- Bitboard Representation

Introduce the BitBoard type and conversion utilities.

Deliverables:

-   BitBoard type
-   gridToBitboard conversion
-   bitboardToGrid conversion
-   round‑trip validation tests

Acceptance criteria:

gridToBitboard followed by bitboardToGrid must return the original
board.

------------------------------------------------------------------------

## BB‑002 --- Bitboard Move Logic

Implement slide and merge using bitboard operations.

Deliverables:

-   row extraction logic
-   merge logic
-   board reconstruction
-   transpose support for vertical moves

Acceptance criteria:

Move results must match the grid engine exactly.

------------------------------------------------------------------------

## BB‑003 --- Row Lookup Tables

Introduce precomputed tables for row transitions.

There are 65,536 possible row states.

Tables will include:

-   resulting row after move
-   score gained from merges

This allows constant‑time move evaluation.

------------------------------------------------------------------------

## BB‑004 --- Engine Equivalence Testing

Introduce a comprehensive test suite comparing grid and bitboard
engines.

Tests verify:

-   move validity
-   score gained
-   resulting board
-   game‑over detection

------------------------------------------------------------------------

## BB‑005 --- Performance Benchmarking

Introduce benchmarks comparing the two engines.

Metrics include:

-   moves per second
-   rollout speed
-   search node expansion rate

------------------------------------------------------------------------

## BB‑006 --- Trainer Integration

Allow the trainer to choose engine backend.

Example concept:

trainer runs using either grid engine or bitboard engine.

------------------------------------------------------------------------

# Strategic Outcome

The project evolves into a dual‑engine architecture:

Grid Engine → correctness and clarity

Bitboard Engine → performance and large‑scale AI experiments
