import { Rng } from "@zvi/ai-2048-core";

export class Mulberry32 implements Rng {
  private a: number;
  constructor(seed = 0x12345678) {
    this.a = seed >>> 0;
  }
  next(): number {
    // mulberry32 PRNG
    let t = (this.a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}
