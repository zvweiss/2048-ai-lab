import { applyMove, computeGameOver, newGame } from "@zvi/ai-2048-core";
import type { GameState, Rng } from "@zvi/ai-2048-core";
import type { Agent } from "./agents/agent.js";

export type EvalConfig = {
  games: number;
  seedBase?: number; // base seed for determinism
  agentConfig?: Record<string, unknown>;
};

export type EvalResult = {
  agent: string;
  games: number;
  seedBase: number;
  agentConfig?: Record<string, unknown>;

  meanScore: number;
  medianScore: number;
  stdScore: number;

  meanSteps: number;
  medianSteps: number;

  maxTileHistogram: Record<string, number>;
  pAtLeast: Record<string, number>;

  samples: {
    minScore: number;
    maxScore: number;
    minMaxTile: number;
    maxMaxTile: number;
  };

  scores: number[];
  maxTiles: number[];
  steps: number[];
};

export function evaluateAgent(
  cfg: EvalConfig,
  mkRng: (seed: number) => Rng,
  agentFactory: (rng: Rng) => Agent,
): EvalResult {
  const games = cfg.games;
  const seedBase = cfg.seedBase ?? 1337;

  const scores: number[] = [];
  const maxTiles: number[] = [];
  const stepsArr: number[] = [];
  const maxTileHistogram: Record<string, number> = {};

  for (let i = 0; i < games; i++) {
    const rng = mkRng((seedBase + i) >>> 0);
    const agent = agentFactory(rng);

    let state: GameState = newGame(rng);
    let steps = 0;

    while (!state.isGameOver) {
      const { dir } = agent.chooseMove({ grid: state.grid, score: state.score });

      if (!dir) {
        // No legal moves (or agent gives up) → confirm terminal
        state = { ...state, isGameOver: computeGameOver(state.grid) };
        break;
      }

      const res = applyMove(state, dir, rng);
      if (!res.moved) {
        // Agent produced illegal move -> terminate (bug signal)
        state = { ...state, isGameOver: true };
        break;
      }

      state = res.next;
      steps++;
    }

    const score = state.score;
    const mTile = maxTile(state);

    scores.push(score);
    maxTiles.push(mTile);
    stepsArr.push(steps);

    maxTileHistogram[String(mTile)] = (maxTileHistogram[String(mTile)] ?? 0) + 1;
  }

  scores.sort((a, b) => a - b);
  maxTiles.sort((a, b) => a - b);
  stepsArr.sort((a, b) => a - b);

  const meanScore = mean(scores);
  const medianScore = medianSorted(scores);
  const stdScore = std(scores, meanScore);

  const meanSteps = mean(stepsArr);
  const medianSteps = medianSorted(stepsArr);

  const thresholds = [2048, 4096, 8192, 16384, 32768, 65536];
  const pAtLeast: Record<string, number> = {};
  for (const t of thresholds) {
    pAtLeast[String(t)] = scores.length ? countAtLeast(maxTiles, t) / scores.length : 0;
  }

  // stable agent id
  const agentId = agentFactory(mkRng(seedBase)).id;

  return {
    agent: agentId,
    games,
    seedBase,
    agentConfig: cfg.agentConfig,

    meanScore,
    medianScore,
    stdScore,

    meanSteps,
    medianSteps,

    maxTileHistogram,
    pAtLeast,

    samples: {
      minScore: scores[0] ?? 0,
      maxScore: scores[scores.length - 1] ?? 0,
      minMaxTile: maxTiles[0] ?? 0,
      maxMaxTile: maxTiles[maxTiles.length - 1] ?? 0,
    },

    scores,
    maxTiles,
    steps: stepsArr,
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

function std(xs: number[], meanVal: number): number {
  if (xs.length <= 1) return 0;
  let s = 0;
  for (const x of xs) {
    const d = x - meanVal;
    s += d * d;
  }
  return Math.sqrt(s / (xs.length - 1));
}

function countAtLeast(sortedMaxTiles: number[], t: number): number {
  let lo = 0, hi = sortedMaxTiles.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sortedMaxTiles[mid] >= t) hi = mid;
    else lo = mid + 1;
  }
  return sortedMaxTiles.length - lo;
}