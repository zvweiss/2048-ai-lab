<!-- # Research Notes

## Why RL agents rediscover the corner strategy

## Emergence of the Corner Strategy

Human 2048 players typically adopt a strategy where the largest tile is anchored in a corner and tiles form a monotonic gradient across the board.

Interestingly, reinforcement learning agents trained with value networks often rediscover this strategy without it being explicitly programmed.

This occurs because the corner structure:

• stabilizes merge opportunities  
• reduces board entropy  
• increases long-term expected reward  

Tracking the location of the maximum tile during training allows us to observe when this behavior begins to emerge.

This phenomenon is similar to what occurred with TD-Gammon, where reinforcement learning rediscovered strategic principles that human experts had developed through intuition.

## Exploration vs policy stability

## False learning plateaus

## Value approximation in 2048

## Relationship to TD-Gammon

# 2048 AI Lab — Insights

This document captures conceptual insights discovered during the development of the 2048 AI Lab project.

Unlike the ROADMAP or TICKETS documents, this file focuses on **ideas, explanations, and surprising behaviors observed in experiments**.

---

# Reinforcement Learning Rediscovering Human Strategy

One of the most fascinating aspects of reinforcement learning is that agents often rediscover strategies that human experts previously developed through intuition.

A famous historical example is **TD-Gammon**, where a reinforcement learning system discovered positional strategies that differed from conventional human play and later influenced expert understanding of the game.

This project explores a similar phenomenon in the game **2048**.

---

# Emergence of the Corner Strategy

Human players frequently anchor the largest tile in a corner and maintain a monotonic gradient across the board.

Example structure:

[2048 1024 512 256]  
[128  64   32  16]  
[8    4    2   0 ]  
[0    0    0   0 ]

This strategy stabilizes the board and increases merge opportunities.

Remarkably, reinforcement learning agents often rediscover this strategy **without it being explicitly programmed**.

This occurs because the structure:

• reduces board entropy  
• maximizes merge probability  
• stabilizes long-term value estimates

Tracking the position of the maximum tile during training allows us to observe when this behavior emerges.

---

# Exploration vs Policy Stability

Reinforcement learning systems balance two competing objectives:

exploration — trying new strategies  
exploitation — using known successful strategies

This balance is controlled by the epsilon parameter.

Early training:

epsilon ≈ high → heavy exploration

Later training:

epsilon ≈ low → policy stabilization

As epsilon decreases, performance often improves suddenly because destructive random moves occur less frequently.

---

# False Learning Plateaus

Learning curves in reinforcement learning frequently appear flat for long periods.

This does not necessarily mean the agent has stopped learning.

Instead, the agent may still be improving its internal value estimates while exploration continues to disrupt board structure.

Once exploration decreases sufficiently, performance improvements may appear suddenly.

---

# Relationship to Dynamic Programming

Reinforcement learning can be viewed as an approximate form of dynamic programming.

Instead of computing exact value functions for all states, the system gradually learns approximate values through interaction with the environment.

This perspective connects modern reinforcement learning methods with classical dynamic programming ideas that predate modern AI.

---

# Human-AI Collaboration

Humans define:

• the environment  
• the reward structure  
• the learning architecture  
• the interpretation of results

The machine explores the space of strategies.

The most powerful outcomes arise from the **partnership between human framing and machine exploration**. -->

# INSIGHTS — 2048 AI Lab

This document captures key insights, surprising observations, and conceptual breakthroughs encountered during the development of the 2048 reinforcement learning system.

Unlike ROADMAP.md (which describes planned evolution) and TICKETS.md (which defines implementation work), this file documents *understanding*.

---

## 1. Learning is Not Smooth — It Happens in Jumps

Early intuition suggests that learning should improve gradually over time.

In practice, reinforcement learning often behaves differently.

Observed pattern:

- long periods of slow or noisy improvement
- followed by sudden jumps in performance

These jumps correspond to the discovery of better strategies.

This is best understood as a **phase transition in policy quality** rather than incremental improvement.

---

## 2. Strategy Emerges — It Is Not Programmed

At no point do we explicitly encode strategies such as:

- keeping the largest tile in a corner
- building monotonic rows
- merging in a structured direction

Yet, over time, the agent begins to exhibit these behaviors.

This demonstrates a core principle of reinforcement learning:

> The agent does not learn rules — it learns value.

The policy emerges as a consequence of maximizing expected future reward.

---

## 3. The Corner Strategy Is Inevitable

One of the most striking observations in 2048 AI systems is that almost all successful agents rediscover the same strategy:

- anchor the largest tile in a corner
- maintain a monotonic gradient
- avoid breaking structure

This happens even when:

- no heuristics are provided
- no rules are hardcoded
- the agent starts from random play

This suggests that the strategy is not arbitrary — it is a natural consequence of the value structure of the game.

---

## 4. Bellman’s Equation Drives Structure

The value function is governed by Bellman’s equation:

V(s) = expected reward + expected value of next states

States that preserve future merging potential receive higher value.

Corner-based layouts:

- preserve ordering
- reduce chaos
- increase merge probability

Therefore, they are assigned higher value by the network.

Over time, the agent converges toward these states.

---

## 5. Exploration vs Exploitation Is Critical

Using a fixed epsilon leads to conflicting behavior:

- too much exploration prevents stability
- too little exploration prevents discovery

The epsilon decay schedule resolves this:

- early training → exploration
- late training → exploitation

This produces more stable learning curves and stronger policies.

---

## 6. Seed Sensitivity Is Real

Running the same experiment with different random seeds produces different results.

Observed behavior:

- some runs discover strong strategies
- some runs remain mediocre
- some runs fail to improve significantly

This is due to:

- stochastic exploration
- early trajectory differences
- feedback loops in learning

Conclusion:

> A single run is not sufficient to evaluate an RL system.

---

## 7. Learning Is Path Dependent

Small differences early in training can lead to large differences later.

Example:

- one run encounters structured states early
- value function improves
- better actions reinforce structure

Another run may never enter this loop.

This creates different “learning paths” across seeds.

---

## 8. Positive Feedback Loops Drive Improvement

Once the agent starts producing slightly better states:

- those states generate better training targets
- the network improves
- improved network produces even better states

This creates a reinforcing cycle.

This explains why:

- improvements accelerate after a certain point
- performance jumps appear suddenly

---

## 9. The Corner Metric Reveals Hidden Learning

Score alone is not sufficient to understand learning.

The `pMaxTileInCornerWindow` metric reveals:

- whether structure is emerging
- whether the agent is learning long-term planning

Typical pattern:

- early training → near zero
- mid training → small increase
- later → sharp rise

That sharp rise often precedes major score improvements.

---

## 10. Epsilon Decay Reveals the True Policy

With high epsilon:

- behavior is noisy
- policy is masked by randomness

As epsilon decreases:

- behavior becomes consistent
- learned policy becomes visible

Late-stage training shows what the agent has truly learned.

---

## 11. RL Systems Behave Like Physical Systems

The training process resembles physical systems with:

- multiple equilibria
- sensitivity to initial conditions
- phase transitions

Small perturbations can push the system toward different stable behaviors.

This makes RL closer to experimental science than deterministic programming.

---

## 12. Value Functions Encode Intuition

Human players describe strategy using intuition:

- “keep the board ordered”
- “don’t break structure”

The neural network encodes similar ideas numerically in the value function.

This is not symbolic reasoning, but it produces similar behavior.

---

## 13. The Agent Does Not Understand — It Optimizes

Even when the agent appears strategic, it is not reasoning in a human sense.

It is:

- evaluating states
- estimating future outcomes
- selecting actions that maximize expected value

The appearance of intelligence is an emergent effect of optimization.

---

## 14. Observability Is Essential

Without logging and metrics:

- learning appears opaque
- debugging is difficult
- improvements are hard to interpret

With proper instrumentation:

- patterns become visible
- hypotheses can be tested
- progress becomes measurable

LAB-004 and LAB-005 made this possible.

---

## 15. The Project Is Now a Research Environment

The system now supports:

- reproducible experiments
- controlled variation (seeds, epsilon)
- measurable outcomes
- interpretable learning curves

This transforms the project from a coding exercise into a **reinforcement learning research platform**.

---

## Closing Thought

The most important realization is this:

> The agent is not taught strategy — it discovers it.

And the role of the human is not to encode intelligence directly, but to:

- define the environment
- define the reward
- design the learning system
- interpret the results

The intelligence that emerges is a collaboration between human design and machine optimization.
