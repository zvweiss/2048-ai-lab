import { slideAndMerge } from "@zvi/ai-2048-core";
import type { Direction, Rng } from "@zvi/ai-2048-core";
import type { Agent, ChooseMoveInput, ChooseMoveOutput } from "./agent.js";

export function createRandomAgent(rng: Rng): Agent {
  return {
    id: "random",

    chooseMove(input: ChooseMoveInput): ChooseMoveOutput {
      const { grid } = input;

      const dirs: Direction[] = ["up", "down", "left", "right"];

      // Deterministic shuffle using rng
      for (let i = dirs.length - 1; i > 0; i--) {
        const j = Math.floor(rng.next() * (i + 1));
        [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
      }

      for (const d of dirs) {
        if (slideAndMerge(grid, d).moved) {
          return { dir: d };
        }
      }

      return { dir: null };
    }
  };
}