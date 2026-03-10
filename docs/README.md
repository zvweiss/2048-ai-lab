# 2048 AI Lab Documentation

This directory contains the technical documentation for the **2048 AI Lab project**.  
The documents describe the architecture of the system, the rules of the game engine, the methodology for running experiments, and the development workflow for contributors.

The goal of this documentation is to keep the project **reproducible, testable, and understandable** as it evolves from a simple game engine into a full AI experimentation platform.

---

## Architecture

These documents describe how the system is structured and how the main components interact.

### ARCHITECTURE.md

High-level system design of the project.  
Explains the relationship between the engine, trainer, agents, and UI.

### AGENT_INTERFACE_SPEC.md

Defines the standard interface that all AI agents must implement.  
Ensures that different agent types can be evaluated without modifying the trainer.

### ENGINE_INVARIANTS.md

Defines the fundamental rules of the 2048 environment.  
These rules must never change across engine implementations.

---

## Engine Development

These documents guide the development and verification of the game engine.

### ENGINE_TEST_PLAN.md

Defines the unit testing strategy for the grid engine.

### BITBOARD_ROADMAP.md

Describes the long-term plan for introducing a high-performance bitboard engine.

### BITBOARD_TEST_STRATEGY.md

Defines the testing strategy that guarantees the bitboard engine behaves exactly like the grid engine.

---

## AI Experiments

These documents define how experiments are conducted and evaluated.

### EXPERIMENT_PROTOCOL.md

Defines the procedure for running experiments so that results are reproducible.

### EVALUATION_STANDARD.md

Defines the metrics used to compare AI agents.

### EXPERIMENT_LOG.md

Records the history of experiments performed in the project.

### baselines/

Contains stored evaluation results for baseline agents.

---

## Project Management

These documents track the evolution of the project.

### ROADMAP.md

Long-term direction of the project.

### TICKETS.md

List of development tasks and milestones.

### PROJECT_STATUS.md

Current state of the project.

---

## Developer Guide

These documents help contributors understand how to work with the repository.

### ENGINEERING_PLAYBOOK.md

Development practices and engineering rules.

### COMMANDS.md

Common development and evaluation commands.

### REPO_GUIDE.md

Overview of the repository structure and purpose of each major directory.

---

## Working Context

### SESSION_CONTEXT.md

Temporary notes used to preserve working context during active development sessions.

This file is not part of the permanent project documentation and may be updated frequently.

---

## Strategic Goal

The documentation structure is designed to support three objectives:

- Engineering clarity — a well-defined architecture and development workflow  
- Scientific discipline — reproducible experiments and fair evaluation standards  
- Educational value — clear explanations of reinforcement learning concepts through the 2048 environment

Together, these documents transform the repository from a simple codebase into a **structured AI experimentation lab**.
