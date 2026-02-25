import { describe, expect, it } from "vitest";
import { slideAndMerge, computeGameOver, applyMove } from "../src/engine.js";
import type { GameState, Grid } from "../src/types.js";
import { SeqRng } from "./test-rng.js";

function grid(rows: number[][]): Grid {
  // quick helper to keep tests readable
  return rows.map((r) => r.slice());
}

describe("slideAndMerge", () => {
  it("merges once per pair (no double-merge): [2,2,2,0] -> [4,2,0,0]", () => {
    const g = grid([
      [2, 2, 2, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);

    const res = slideAndMerge(g, "left");
    expect(res.grid[0]).toEqual([4, 2, 0, 0]);
    expect(res.scoreGained).toBe(4);
    expect(res.moved).toBe(true);
  });

  it("[2,2,2,2] -> [4,4,0,0] and score = 8", () => {
    const g = grid([
      [2, 2, 2, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);

    const res = slideAndMerge(g, "left");
    expect(res.grid[0]).toEqual([4, 4, 0, 0]);
    expect(res.scoreGained).toBe(8);
  });

  it("[2,0,2,2] -> [4,2,0,0] and score = 4", () => {
    const g = grid([
      [2, 0, 2, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);

    const res = slideAndMerge(g, "left");
    expect(res.grid[0]).toEqual([4, 2, 0, 0]);
    expect(res.scoreGained).toBe(4);
  });

  it("right move mirrors left behavior: [0,2,2,2] right -> [0,0,2,4]", () => {
    const g = grid([
      [0, 2, 2, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);

    const res = slideAndMerge(g, "right");
    expect(res.grid[0]).toEqual([0, 0, 2, 4]);
    expect(res.scoreGained).toBe(4);
  });

  it("up move works across rows", () => {
    const g = grid([
      [2, 0, 0, 0],
      [2, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);

    const res = slideAndMerge(g, "up");
    expect(res.grid[0][0]).toBe(4);
    expect(res.grid[1][0]).toBe(0);
    expect(res.scoreGained).toBe(4);
  });
});

describe("computeGameOver", () => {
  it("not game over if any empty cell exists", () => {
    const g = grid([
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 0, 2],
      [4, 8, 16, 32]
    ]);
    expect(computeGameOver(g)).toBe(false);
  });

  it("not game over if any merge exists", () => {
    const g = grid([
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2, 2],
      [4, 8, 16, 32]
    ]);
    expect(computeGameOver(g)).toBe(false);
  });

  it("game over if full and no merges", () => {
    const g = grid([
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2, 4],
      [8, 16, 32, 64]
    ]);
    expect(computeGameOver(g)).toBe(true);
  });
});

describe("applyMove (spawn + moved flag)", () => {
  it("does not spawn a tile if move is illegal (no change)", () => {
    const state: GameState = {
      grid: grid([
        [2, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ]),
      score: 0,
      isGameOver: false
    };

    const rng = new SeqRng([0.0, 0.0, 0.0]); // shouldn't be used
    const res = applyMove(state, "left", rng);

    expect(res.moved).toBe(false);
    expect(res.scoreGained).toBe(0);
    expect(res.next.grid).toEqual(state.grid);
  });

  it("spawns exactly one tile after a legal move", () => {
    const state: GameState = {
      grid: grid([
        [0, 0, 0, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ]),
      score: 0,
      isGameOver: false
    };

    // RNG sequence:
    // 1) choose empty index (0.0 => first empty)
    // 2) choose tile value (0.0 => 2)
    const rng = new SeqRng([0.0, 0.0]);

    const res = applyMove(state, "left", rng);
    expect(res.moved).toBe(true);

    // After move left: row becomes [2,0,0,0]
    // Then spawn one tile at first empty (which will be [0,1])
    const g = res.next.grid;

    // Count non-zeros should be 2 total (original tile + spawn)
    const nonzeros = g.flat().filter((x) => x !== 0);
    expect(nonzeros.length).toBe(2);
  });
});