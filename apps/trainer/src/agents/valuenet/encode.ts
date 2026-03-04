import type { Grid } from "@zvi/ai-2048-core";

export const VALUE_NET_INPUT_SHAPE = [4, 4, 1] as const;
export const VALUE_NET_INPUT_SIZE = 16;

/**
 * Locked v001 encoding:
 * - 0 => 0
 * - v>0 => log2(v)/16
 * Output is row-major, length 16.
 */
export function encodeGrid(grid: Grid): Float32Array {
  const out = new Float32Array(VALUE_NET_INPUT_SIZE);
  let i = 0;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const v = grid[r][c];
      out[i++] = v === 0 ? 0 : Math.log2(v) / 16;
    }
  }
  return out;
}

