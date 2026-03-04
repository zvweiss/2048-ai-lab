import type { Direction, Grid } from "@zvi/ai-2048-core"; // adjust to your actual package name/path

export type AgentId = "random" | "expectimax" | "valuenet-v001";

export interface ChooseMoveInput {
  grid: Grid;
  score: number;
}

export interface ChooseMoveOutput {
  dir: Direction | null; // null => no legal moves
  debug?: Record<string, unknown>;
}

export interface Agent {
  id: AgentId;
  chooseMove(input: ChooseMoveInput): ChooseMoveOutput;
}
