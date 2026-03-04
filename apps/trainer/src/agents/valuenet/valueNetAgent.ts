import { cloneGrid, slideAndMerge } from "@zvi/ai-2048-core";
import type { Direction, Grid, Rng } from "@zvi/ai-2048-core";
import type { Agent, ChooseMoveInput, ChooseMoveOutput } from "../agent.js";
import type { ValueNetModel } from "./valueNet.js";
import { predictV } from "./valueNet.js";

const DIRS: Direction[] = ["up", "left", "right", "down"];

export interface ValueNetAgentParams {
  model: ValueNetModel;
  epsilon?: number;
  p2?: number;
  rng?: Rng;
}

export function createValueNetAgent(params: ValueNetAgentParams): Agent {
  const epsilon = params.epsilon ?? 0;
  const p2 = params.p2 ?? 0.9;
  const rng = params.rng;

  return {
    id: "valuenet-v001",
    chooseMove(input: ChooseMoveInput): ChooseMoveOutput {
      const scoredMoves: Array<{ dir: Direction; q: number }> = [];
      const perMove: Record<string, number> = {};

      for (const dir of DIRS) {
        const { moved, grid: g2, scoreGained } = slideAndMerge(input.grid, dir);
        if (!moved) continue;

        const q = scoreGained + expectedSpawnValue(params.model, g2, p2);
        scoredMoves.push({ dir, q });
        perMove[dir] = q;
      }

      if (scoredMoves.length === 0) return { dir: null };

      if (rng && epsilon > 0 && rng.next() < epsilon) {
        const idx = Math.floor(rng.next() * scoredMoves.length);
        return { dir: scoredMoves[idx].dir, debug: { policy: "epsilon", perMove } };
      }

      let best = scoredMoves[0];
      for (let i = 1; i < scoredMoves.length; i++) {
        if (scoredMoves[i].q > best.q) best = scoredMoves[i];
      }

      return { dir: best.dir, debug: { policy: "greedy", perMove, bestQ: best.q } };
    },
  };
}

function expectedSpawnValue(model: ValueNetModel, grid: Grid, p2: number): number {
  const empties = listEmptyCells(grid);
  if (empties.length === 0) return predictV(model, grid);

  const p4 = 1 - p2;
  const invN = 1 / empties.length;
  let acc = 0;

  for (const { r, c } of empties) {
    const g2 = placeTile(grid, r, c, 2);
    const g4 = placeTile(grid, r, c, 4);
    acc += invN * (p2 * predictV(model, g2) + p4 * predictV(model, g4));
  }

  return acc;
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

