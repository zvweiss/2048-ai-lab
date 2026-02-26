export type TrainProgressMsg = {
  type: "trainProgress";
  episode: number;
  stepInEpisode: number;
  score: number;
  maxTile: number;

  episodesCompleted: number;
  avgScoreAll: number;
  avgMaxTileAll: number;

  avgScoreWindow: number;
  avgMaxTileWindow: number;

  board: number[][];
};