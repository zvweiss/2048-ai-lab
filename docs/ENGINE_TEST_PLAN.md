# Engine Test Plan

## Purpose

This document defines the testing strategy for the core 2048 engine.

The goal is to guarantee that the game mechanics behave correctly and
remain stable during refactoring.

------------------------------------------------------------------------

# Test Categories

The engine test suite is organized into the following categories:

-   movement tests
-   merge rule tests
-   spawn rule tests
-   game‑over detection tests

------------------------------------------------------------------------

# Movement Tests

Movement tests verify that tiles slide correctly when a move is applied.

Scenarios include:

-   sliding tiles across empty spaces
-   tiles stopping at obstacles
-   moves that do not change the board

------------------------------------------------------------------------

# Merge Rule Tests

Merge tests verify that identical adjacent tiles merge correctly.

Scenarios include:

-   simple merge
-   double merge
-   blocked merge
-   merge order validation

------------------------------------------------------------------------

# Spawn Rule Tests

Spawn tests verify that new tiles appear correctly after valid moves.

These tests confirm:

-   tiles spawn only after board changes
-   spawn values follow the correct probability distribution

------------------------------------------------------------------------

# Game Over Tests

Game‑over detection is verified using:

-   full boards with no merges
-   full boards with remaining merges
-   partially filled boards

------------------------------------------------------------------------

# Regression Protection

All tests must run automatically in the project's continuous integration
pipeline.

Any failure indicates a regression in the engine logic.

The test suite acts as a safety net for future refactoring and
optimization.
