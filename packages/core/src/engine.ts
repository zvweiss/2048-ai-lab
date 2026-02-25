import { DEFAULT_SPAWN, Direction, GameState, Grid, MoveResult, Rng, SpawnConfig } from "./types.js";

export function emptyGrid(): Grid {
  return Array.from({ length: 4 }, () => Array(4).fill(0));
}

export function cloneGrid(g: Grid): Grid {
  return g.map((row) => row.slice());
}

export function newGame(rng: Rng, spawn: SpawnConfig = DEFAULT_SPAWN): GameState {
  let state: GameState = { grid: emptyGrid(), score: 0, isGameOver: false };
  state = spawnRandomTile(state, rng, spawn);
  state = spawnRandomTile(state, rng, spawn);
  state.isGameOver = computeGameOver(state.grid);
  return state;
}

export function applyMove(state: GameState, dir: Direction, rng: Rng, spawn: SpawnConfig = DEFAULT_SPAWN): MoveResult {
  const { grid, score } = state;
  const before = cloneGrid(grid);

  const { moved, scoreGained, grid: afterMove } = slideAndMerge(before, dir);
  if (!moved) {
    return { moved: false, scoreGained: 0, next: { ...state } };
  }

  let next: GameState = {
    grid: afterMove,
    score: score + scoreGained,
    isGameOver: false
  };

  next = spawnRandomTile(next, rng, spawn);
  next.isGameOver = computeGameOver(next.grid);
  return { moved: true, scoreGained, next };
}

/**
 * Core 2048 mechanic (slide + merge). This is intentionally kept pure (no RNG/spawn here).
 * NOTE: This seed implementation is minimal and correct enough for early scaffolding,
 * but we will add comprehensive unit tests in APP-002.
 */
export function slideAndMerge(grid: Grid, dir: Direction): { moved: boolean; scoreGained: number; grid: Grid } {
  const g = cloneGrid(grid);
  let moved = false;
  let scoreGained = 0;

  const getLine = (i: number): number[] => {
    const line: number[] = [];
    for (let j = 0; j < 4; j++) {
      if (dir === "left") line.push(g[i][j]);
      if (dir === "right") line.push(g[i][3 - j]);
      if (dir === "up") line.push(g[j][i]);
      if (dir === "down") line.push(g[3 - j][i]);
    }
    return line;
  };

  const setLine = (i: number, line: number[]) => {
    for (let j = 0; j < 4; j++) {
      const v = line[j];
      if (dir === "left") g[i][j] = v;
      if (dir === "right") g[i][3 - j] = v;
      if (dir === "up") g[j][i] = v;
      if (dir === "down") g[3 - j][i] = v;
    }
  };

  for (let i = 0; i < 4; i++) {
    const line = getLine(i);
    const { out, gained, didMove } = compressMergeCompress(line);
    if (didMove) moved = true;
    scoreGained += gained;
    setLine(i, out);
  }

  return { moved, scoreGained, grid: g };
}

function compressMergeCompress(line: number[]): { out: number[]; gained: number; didMove: boolean } {
  const original = line.slice();
  const nonzero = line.filter((x) => x !== 0);
  const merged: number[] = [];
  let gained = 0;

  for (let i = 0; i < nonzero.length; i++) {
    const a = nonzero[i];
    const b = nonzero[i + 1];
    if (b !== undefined && a === b) {
      const m = a + b;
      merged.push(m);
      gained += m;
      i++; // skip next
    } else {
      merged.push(a);
    }
  }

  while (merged.length < 4) merged.push(0);

  const didMove = merged.some((v, idx) => v !== original[idx]);
  return { out: merged, gained, didMove };
}

export function spawnRandomTile(state: GameState, rng: Rng, spawn: SpawnConfig = DEFAULT_SPAWN): GameState {
  const empties: Array<{ r: number; c: number }> = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (state.grid[r][c] === 0) empties.push({ r, c });
    }
  }
  if (empties.length === 0) return state;

  const idx = Math.floor(rng.next() * empties.length);
  const { r, c } = empties[idx];

  const p = rng.next();
  const v = p < spawn.p2 ? 2 : 4;

  const grid = cloneGrid(state.grid);
  grid[r][c] = v;
  return { ...state, grid };
}

export function computeGameOver(grid: Grid): boolean {
  // any empty?
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (grid[r][c] === 0) return false;

  // any merge possible?
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const v = grid[r][c];
      if (r + 1 < 4 && grid[r + 1][c] === v) return false;
      if (c + 1 < 4 && grid[r][c + 1] === v) return false;
    }
  }
  return true;
}
