import type { Rng } from "../src/types.js";

/**
 * Deterministic RNG for tests.
 * Provide a sequence of numbers in [0,1). When it runs out, it repeats the last value.
 */
export class SeqRng implements Rng {
  private i = 0;
  constructor(private seq: number[]) {
    if (seq.length === 0) throw new Error("SeqRng requires a non-empty sequence");
  }
  next(): number {
    const idx = Math.min(this.i, this.seq.length - 1);
    const v = this.seq[idx];
    this.i++;
    return v;
  }
}