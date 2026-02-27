import type { Grid } from "@zvi/ai-2048-core";

export function evaluateGrid(grid: Grid): number {
  const empty = countEmpty(grid);
  const maxTile = maxValue(grid);

  // Penalize rough boards (big adjacent jumps).
  const smooth = -smoothnessPenalty(grid);

  // Reward monotonic structure (encourages gradients/corner strategy).
  const mono = monotonicityScore(grid);

  // Weights (start here; tune later)
  return (
    empty * 200 +
    smooth * 1 +
    mono * 10 +
    Math.log2(Math.max(2, maxTile)) * 100
  );
}

function countEmpty(g: Grid): number {
  let n = 0;
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (g[r][c] === 0) n++;
  return n;
}

function maxValue(g: Grid): number {
  let m = 0;
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) m = Math.max(m, g[r][c]);
  return m;
}

function smoothnessPenalty(g: Grid): number {
  let pen = 0;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const v = g[r][c];
      if (v === 0) continue;
      const lv = Math.log2(v);
      if (r + 1 < 4 && g[r + 1][c] !== 0) pen += Math.abs(lv - Math.log2(g[r + 1][c]));
      if (c + 1 < 4 && g[r][c + 1] !== 0) pen += Math.abs(lv - Math.log2(g[r][c + 1]));
    }
  }
  return pen;
}

function monotonicityScore(g: Grid): number {
  // Reward rows/cols that are consistently increasing or decreasing in log-space.
  let score = 0;

  // Rows
  for (let r = 0; r < 4; r++) {
    const row = g[r].map(v => (v === 0 ? 0 : Math.log2(v)));
    score += bestMonotoneDirection(row);
  }

  // Cols
  for (let c = 0; c < 4; c++) {
    const col = [0,1,2,3].map(r => g[r][c]).map(v => (v === 0 ? 0 : Math.log2(v)));
    score += bestMonotoneDirection(col);
  }

  return score;
}

function bestMonotoneDirection(arr: number[]): number {
  // Two directions: non-increasing vs non-decreasing
  let inc = 0;
  let dec = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    const a = arr[i];
    const b = arr[i + 1];
    if (a <= b) inc += (b - a);
    if (a >= b) dec += (a - b);
  }
  // Smaller "violations" is better; invert
  return -Math.min(inc, dec);
}