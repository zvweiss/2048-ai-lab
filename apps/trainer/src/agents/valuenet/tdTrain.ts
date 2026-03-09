import { applyMove, newGame } from "@zvi/ai-2048-core";
import type { Direction, GameState } from "@zvi/ai-2048-core";
import { Mulberry32 } from "../../rng.js";
import { createValueNetAgent } from "./valueNetAgent.js";
import { createValueNet, predictV, type ValueNetModel, trainOnSample } from "./valueNet.js";

export type TdTrainConfig = {
  episodes: number;
  seed: number;
  gamma?: number;
  epsilon?: number;
  learningRate?: number;
  p2?: number;
  logEvery?: number;
};

export type TdTrainResult = {
  runId: string;
  episodes: number;
  seed: number;
  gamma: number;
  epsilon: number;
  learningRate: number;
  p2: number;
  totalSteps: number;
  meanScore: number;
  medianScore: number;
  minScore: number;
  maxScore: number;
  minMaxTile: number;
  maxMaxTile: number;
  meanLoss: number;
};

export async function trainValueNetTd(
  cfg: TdTrainConfig,
): Promise<{ model: ValueNetModel; result: TdTrainResult }> {
  const episodes = cfg.episodes;
  const seed = cfg.seed;
  const gamma = cfg.gamma ?? 0.99;
  const epsilon = cfg.epsilon ?? 0.1;
  const learningRate = cfg.learningRate ?? 0.001;
  const p2 = cfg.p2 ?? 0.9;
  //const logEvery = cfg.logEvery ?? 1000;
  const logEvery = 100;

  const rng = new Mulberry32(seed);
  const model = createValueNet({ learningRate });

  const scores: number[] = [];
  const maxTiles: number[] = [];
  const losses: number[] = [];
  let totalSteps = 0;

  for (let ep = 0; ep < episodes; ep++) {
    let state: GameState = newGame(rng);
    let steps = 0;

    while (!state.isGameOver) {
      const agent = createValueNetAgent({ model, epsilon, p2, rng });
      const { dir } = agent.chooseMove({ grid: state.grid, score: state.score });

      if (!dir) break;

      const prevState = state;
      const res = applyMove(state, dir as Direction, rng);
      if (!res.moved) break;

      const reward = res.scoreGained;
      const next = res.next;
      const target = next.isGameOver ? reward : reward + gamma * predictV(model, next.grid);

      const loss = await trainOnSample(model, prevState.grid, target);
      losses.push(loss);

      state = next;
      steps++;
      totalSteps++;
    }

    scores.push(state.score);
    maxTiles.push(maxTile(state));

    if ((ep + 1) % logEvery === 0 || ep === episodes - 1) {
      console.log(
        `[valuenet-train] episode=${ep + 1}/${episodes} score=${state.score} steps=${steps}`,
      );
    }
  }

  const sortedScores = [...scores].sort((a, b) => a - b);
  const sortedMaxTiles = [...maxTiles].sort((a, b) => a - b);
  const meanLoss = losses.length ? losses.reduce((a, b) => a + b, 0) / losses.length : 0;

  return {
    model,
    result: {
      runId: `valuenet-v001-seed${seed}-ep${episodes}`,
      episodes,
      seed,
      gamma,
      epsilon,
      learningRate,
      p2,
      totalSteps,
      meanScore: mean(scores),
      medianScore: medianSorted(sortedScores),
      minScore: sortedScores[0] ?? 0,
      maxScore: sortedScores[sortedScores.length - 1] ?? 0,
      minMaxTile: sortedMaxTiles[0] ?? 0,
      maxMaxTile: sortedMaxTiles[sortedMaxTiles.length - 1] ?? 0,
      meanLoss,
    },
  };
}

function maxTile(s: GameState): number {
  let m = 0;
  for (const row of s.grid) for (const v of row) if (v > m) m = v;
  return m;
}

function mean(xs: number[]): number {
  if (xs.length === 0) return 0;
  let sum = 0;
  for (const x of xs) sum += x;
  return sum / xs.length;
}

function medianSorted(xs: number[]): number {
  const n = xs.length;
  if (n === 0) return 0;
  const mid = Math.floor(n / 2);
  return n % 2 === 1 ? xs[mid] : (xs[mid - 1] + xs[mid]) / 2;
}

