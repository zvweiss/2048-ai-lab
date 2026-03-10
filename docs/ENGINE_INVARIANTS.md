# Engine Invariants

## Purpose

This document defines the non‑negotiable rules of the 2048 game engine
used in this repository.

All engine implementations must obey these invariants.

These rules apply to:

-   grid engine
-   bitboard engine
-   simulation environments
-   AI training systems

------------------------------------------------------------------------

# Canonical Game Definition

The engine implements the mechanics of the original 2048 game.

The board is a 4×4 grid.

Each cell contains either:

-   empty
-   a tile whose value is a power of two

Valid tile values include:

2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048 and higher powers of two.

------------------------------------------------------------------------

# Move Directions

Valid move directions:

-   left
-   right
-   up
-   down

Moves operate on the entire board simultaneously.

All tiles slide as far as possible in the chosen direction.

------------------------------------------------------------------------

# Merge Rules

Two adjacent tiles with equal value merge into a single tile whose value
is the sum of the two tiles.

Examples:

2 + 2 → 4\
4 + 4 → 8

The score gained equals the value of the merged tile.

------------------------------------------------------------------------

# Single Merge Rule

A tile may merge only once per move.

Example:

2 2 2 2 moving left becomes

4 4 0 0

not

8 0 0 0

------------------------------------------------------------------------

# Spawn Rules

A new tile appears only if a move changes the board.

The new tile is placed in a random empty cell.

Spawn probabilities:

2 → 90 percent\
4 → 10 percent

------------------------------------------------------------------------

# Game Over Condition

The game ends when:

-   the board contains no empty cells
-   no adjacent tiles share the same value

------------------------------------------------------------------------

# Determinism Requirement

Given the same initial board, sequence of moves, and RNG seed, the
engine must produce identical results.

This requirement ensures reproducibility for testing and reinforcement
learning experiments.

------------------------------------------------------------------------

# Engineering Principle

The engine defines the physics of the environment.

Agents may improve strategy but must never modify the game mechanics.
