export type Grid = number[][]; // 4x4 grid of tile values (0 for empty)

export type Direction = "up" | "down" | "left" | "right";

export interface GameState {
  grid: Grid;
  score: number;
  isGameOver: boolean;
}

export interface MoveResult {
  moved: boolean;
  scoreGained: number;
  next: GameState;
}

export interface SpawnConfig {
  p2: number; // probability of spawning a 2
  p4: number; // probability of spawning a 4
}

export const DEFAULT_SPAWN: SpawnConfig = { p2: 0.9, p4: 0.1 };

export interface Rng {
  next(): number; // returns float in [0,1)
}
