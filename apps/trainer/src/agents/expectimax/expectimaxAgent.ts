import { cloneGrid, slideAndMerge } from "@zvi/ai-2048-core"; // adjust
import type { Direction, Grid } from "@zvi/ai-2048-core";
import type { Agent, ChooseMoveInput, ChooseMoveOutput } from "../agent";
import { evaluateGrid } from "./heuristic.js";

// Keep consistent move ordering for determinism/debug.
const DIRS: Direction[] = ["up", "left", "right", "down"];

export interface ExpectimaxParams {
  depth: number;      // typical: 3 or 4
  p2: number;         // usually 0.9
}

export function createExpectimaxAgent(params: ExpectimaxParams): Agent {
  const { depth, p2 } = params;

  return {
    id: "expectimax",
    chooseMove(input: ChooseMoveInput): ChooseMoveOutput {
      const { grid } = input;

      let bestDir: Direction | null = null;
      let bestVal = -Infinity;
      const perMove: Record<string, number> = {};

      for (const dir of DIRS) {
        const { moved, grid: g2, scoreGained } = slideAndMerge(grid, dir);
        if (!moved) continue;

        // After player move comes a chance node (spawn), hence depth-1.
        const val =
          scoreGained +
          expectValueAfterSpawn(g2, depth - 1, p2);

        perMove[dir] = val;
        if (val > bestVal) {
          bestVal = val;
          bestDir = dir;
        }
      }

      return {
        dir: bestDir,
        debug: { bestVal, perMove, depth, p2 }
      };
    }
  };
}

/**
 * Chance node: enumerate all empty cells and both tile values.
 * Expected value = average over positions and tile probabilities.
 */
function expectValueAfterSpawn(grid: Grid, depth: number, p2: number): number {
  const empties = listEmptyCells(grid);
  if (empties.length === 0) {
    // No spawn possible; just evaluate/max node next.
    return maxValue(grid, depth, p2);
  }

  const p4 = 1 - p2;
  let acc = 0;

  // Uniform over empty cell choice
  const invN = 1 / empties.length;

  for (const { r, c } of empties) {
    // Spawn 2
    {
      const g2 = placeTile(grid, r, c, 2);
      acc += invN * p2 * maxValue(g2, depth, p2);
    }
    // Spawn 4
    {
      const g4 = placeTile(grid, r, c, 4);
      acc += invN * p4 * maxValue(g4, depth, p2);
    }
  }

  return acc;
}

/**
 * Player node: choose best move.
 * Depth counts remaining plies including this max node.
 */
function maxValue(grid: Grid, depth: number, p2: number): number {
  if (depth <= 0) return evaluateGrid(grid);

  let best = -Infinity;
  let any = false;

  for (const dir of DIRS) {
    const { moved, grid: g2, scoreGained } = slideAndMerge(grid, dir);
    if (!moved) continue;
    any = true;

    const val = scoreGained + expectValueAfterSpawn(g2, depth - 1, p2);
    if (val > best) best = val;
  }

  // No legal moves => terminal
  if (!any) return evaluateGrid(grid) - 1e9;

  return best;
}

function listEmptyCells(grid: Grid): Array<{ r: number; c: number }> {
  const out: Array<{ r: number; c: number }> = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) out.push({ r, c });
    }
  }
  return out;
}

function placeTile(grid: Grid, r: number, c: number, v: number): Grid {
  const g = cloneGrid(grid);
  g[r][c] = v;
  return g;
}