# Agent Interface Specification

## Purpose

This document defines the standard interface that all AI agents must
implement in the 2048 AI Lab project.

The goal is to ensure that all agent types can be evaluated, compared,
and integrated into the trainer without changing the surrounding
infrastructure.

This specification applies to:

-   random agents
-   heuristic agents
-   expectimax agents
-   reinforcement learning agents
-   neural-network agents
-   hybrid agents

------------------------------------------------------------------------

# Design Principle

The trainer should interact with every agent through a stable interface.

The trainer must not need to know how an agent works internally.

An agent may use:

-   randomness
-   search
-   learned value functions
-   policy networks
-   cached evaluation
-   hybrid methods

But it must still conform to the same external contract.

------------------------------------------------------------------------

# Core Agent Responsibilities

Every agent must be able to do the following:

-   receive the current game state
-   choose an action
-   report when no legal move exists
-   optionally provide debug metadata

The agent must not modify the engine state directly.

The engine remains responsible for applying moves and generating the
next state.

------------------------------------------------------------------------

# Standard Agent Identity

Each agent must expose a stable identity.

Minimum required identity fields:

-   agent name
-   agent version

Examples:

-   random-v001
-   expectimax-v001
-   dqn-v001

The trainer and evaluation output should record this identity exactly.

------------------------------------------------------------------------

# Standard Input

Each agent receives the current game state in a representation supported
by the active engine.

At minimum the agent input should make the following available:

-   current board state
-   current score
-   game-over status
-   available legal moves, if precomputed by the trainer

The agent must treat the input as read-only.

------------------------------------------------------------------------

# Standard Output

Each agent must return one of the following:

-   a legal move direction
-   null if no legal move exists

Valid move directions are:

-   left
-   right
-   up
-   down

The agent must never return an invalid direction.

------------------------------------------------------------------------

# Optional Debug Output

Agents may optionally return debug information to support development
and analysis.

Examples include:

-   per-move evaluation scores
-   selected depth
-   policy probabilities
-   estimated state value
-   cache hit counts

Debug output must not be required for normal trainer execution.

------------------------------------------------------------------------

# Purity Requirement

The agent interface should behave as a pure decision function whenever
possible.

Given the same input state and deterministic configuration, the same
move should be returned.

This requirement is especially important for:

-   expectimax agents
-   heuristic agents
-   trained inference-only neural agents

Randomized agents are allowed to use controlled randomness, but the
randomness must be reproducible when seeded.

------------------------------------------------------------------------

# Engine Independence

The agent interface must remain independent of board representation
details.

Agents should conceptually depend on game state, not on whether the
underlying engine uses:

-   2D arrays
-   bitboards
-   tensor encodings
-   alternative optimized formats

This rule is critical for future migration to the bitboard engine.

------------------------------------------------------------------------

# Trainer Responsibilities

The trainer is responsible for:

-   constructing the agent
-   supplying the current game state
-   applying the chosen move through the engine
-   recording metrics and results

The trainer must not embed agent-specific decision logic.

All intelligence belongs inside the agent.

------------------------------------------------------------------------

# Agent Construction

Agents should be created through explicit constructors or factory
functions.

Examples of configuration include:

-   search depth
-   heuristic version
-   exploration settings
-   model file path
-   evaluation mode

This ensures that agent configuration is visible, versioned, and
reproducible.

------------------------------------------------------------------------

# Reproducibility Requirement

Every agent must be configurable in a reproducible way.

At minimum the following must be recordable:

-   agent identity
-   parameter values
-   random seed, if used
-   engine backend
-   evaluation configuration

If these elements are not captured, experiment results are incomplete.

------------------------------------------------------------------------

# Examples of Agent Families

## Random Agent

Chooses among legal moves using controlled randomness.

## Heuristic Agent

Chooses moves using a fixed board evaluation rule.

## Expectimax Agent

Chooses moves using search over future moves and probabilistic spawns.

## Reinforcement Learning Agent

Chooses moves using a learned policy or value estimate.

## Hybrid Agent

Combines search with learned evaluation.

All of these agents must satisfy the same interface contract.

------------------------------------------------------------------------

# Acceptance Criteria for Interface Compliance

An agent is considered compliant if it satisfies all of the following:

-   it can be created by the trainer using explicit configuration
-   it accepts the standard input state
-   it returns a legal move or null
-   it does not mutate the engine state directly
-   it can be evaluated by the trainer without custom control logic

------------------------------------------------------------------------

# Strategic Outcome

A stable agent interface allows the project to grow without
architectural drift.

It enables:

-   consistent evaluation
-   interchangeable agent implementations
-   simpler trainer design
-   easier debugging
-   safer refactoring
-   future engine migration

This interface is the contract that connects intelligence to the game
environment.
