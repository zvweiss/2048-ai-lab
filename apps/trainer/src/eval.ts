import { applyMove, computeGameOver, slideAndMerge } from "@zvi/ai-2048-core";
import type { Direction, GameState, Rng } from "@zvi/ai-2048-core";

export type EvalConfig = {
  games: number;
  seedBase?: number; // base seed for determinism
};

export type EvalResult = {
  agent: "random";
  games: number;
  seedBase: number;

  meanScore: number;
  medianScore: number;
  stdScore: number;

  meanSteps: number;
  medianSteps: number;

  maxTileHistogram: Record<string, number>;
  pAtLeast: Record<string, number>; // e.g. {"2048":0.12, "16384":0.001}

  samples: {
    minScore: number;
    maxScore: number;
    minMaxTile: number;
    maxMaxTile: number;
  };

  scores: number[]; // useful for debugging; you can remove later if you want
  maxTiles: number[];
  steps: number[];
};

export function evaluateRandomAgent(
  cfg: EvalConfig,
  mkRng: (seed: number) => Rng,
  mkNewGame: (rng: Rng) => GameState,
) : EvalResult {
  const games = cfg.games;
  const seedBase = cfg.seedBase ?? 1337;

  const scores: number[] = [];
  const maxTiles: number[] = [];
  const stepsArr: number[] = [];

  const maxTileHistogram: Record<string, number> = {};

  for (let i = 0; i < games; i++) {
    const rng = mkRng((seedBase + i) >>> 0);

    let state = mkNewGame(rng);
    let steps = 0;

    while (!state.isGameOver) {
      const dir = chooseRandomLegalMove(state, rng);
      if (!dir) {
        // No legal moves (should coincide with game over)
        state = { ...state, isGameOver: computeGameOver(state.grid) };
        break;
      }

      const res = applyMove(state, dir, rng);
      // applyMove can return moved:false if something weird happens;
      // but since we picked a legal move, moved should be true.
      if (res.moved) {
        state = res.next;
        steps++;
      } else {
        // fallback: break to avoid infinite loop
        state = { ...state, isGameOver: true };
      }
    }

    const score = state.score;
    const mTile = maxTile(state);

    scores.push(score);
    maxTiles.push(mTile);
    stepsArr.push(steps);

    const key = String(mTile);
    maxTileHistogram[key] = (maxTileHistogram[key] ?? 0) + 1;
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

  return {
    agent: "random",
    games,
    seedBase,
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

/**
 * Choose a legal move without consuming spawn RNG.
 * We “peek” legality using slideAndMerge (pure; no spawning).
 */
function chooseRandomLegalMove(state: GameState, rng: Rng): Direction | null {
  const dirs: Direction[] = ["up", "down", "left", "right"];

  // Shuffle dirs deterministically using rng
  for (let i = dirs.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1));
    [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
  }

  for (const d of dirs) {
    const peek = slideAndMerge(state.grid, d);
    if (peek.moved) return d;
  }
  return null;
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
  // sorted ascending; find first index >= t
  let lo = 0, hi = sortedMaxTiles.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sortedMaxTiles[mid] >= t) hi = mid;
    else lo = mid + 1;
  }
  return sortedMaxTiles.length - lo;
}