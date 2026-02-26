import { newGame, applyMove, Direction, GameState } from "@zvi/ai-2048-core";
import { Mulberry32 } from "./rng.js";
import express, { type Request, type Response } from "express";
import http from "http";
import { WebSocketServer, type WebSocket } from "ws";

const app = express();
app.use(express.json());

app.get("/api/health", (_req: Request, res: Response) =>
  res.json({ ok: true }),
);

/**
 * This server is for LOCAL LAB MODE only.
 * It streams training progress / board frames to a dev UI via WebSocket.
 * Public deployment should be static (Angular only).
 */

let training = false;
app.post("/api/train/start", (_req: Request, res: Response) => {
  training = true;
  res.json({ ok: true, training });
});

app.post("/api/train/stop", (_req: Request, res: Response) => {
  training = false;
  res.json({ ok: true, training });
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });

wss.on("connection", (socket: WebSocket) => {
  socket.send(JSON.stringify({ type: "hello", message: "connected" }));

  // For seed: simulate "training" by playing random moves and streaming boards.
  const rng = new Mulberry32(Date.now() & 0xffffffff);
  let state: GameState = newGame(rng);
  let episode = 0;
  let stepInEpisode = 0;

  // rolling metrics
  let episodesCompleted = 0;
  let sumScore = 0;
  let sumMaxTile = 0;

  const windowSize = 50;
  const lastScores: number[] = [];
  const lastMaxTiles: number[] = [];

  const pushWindow = (arr: number[], v: number) => {
    arr.push(v);
    if (arr.length > windowSize) arr.shift();
  };

  const avg = (arr: number[]) =>
    arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  const maxTile = (grid: number[][]) => Math.max(...grid.flat());

  const interval = setInterval(() => {
    if (!training) return;

    // naive random move demo (replace with agent/trainer later)
    const dirs: Direction[] = ["up", "down", "left", "right"];
    const dir = dirs[Math.floor(rng.next() * dirs.length)];
    const res = applyMove(state, dir, rng);
    if (res.moved) {
      state = res.next;
      stepInEpisode++;
    }

    // episode boundary
    if (state.isGameOver) {
      const finalScore = state.score;
      const finalMaxTile = maxTile(state.grid);
      const steps = stepInEpisode;

      episodesCompleted++;
      sumScore += finalScore;
      sumMaxTile += finalMaxTile;
      pushWindow(lastScores, finalScore);
      pushWindow(lastMaxTiles, finalMaxTile);

      // send a summary event (handy for UI later)
      socket.send(
        JSON.stringify({
          type: "episodeEnd",
          episode,
          finalScore,
          finalMaxTile,
          steps,
          episodesCompleted,
          avgScoreAll: sumScore / episodesCompleted,
          avgScoreWindow: avg(lastScores),
        }),
      );

      episode++;
      state = newGame(rng);
      stepInEpisode = 0;
    }

    const curMax = maxTile(state.grid);

    const payload = {
      type: "trainProgress",
      episode,
      stepInEpisode,
      score: state.score,
      maxTile: curMax,

      // simple rolling placeholders (we'll improve next)
      episodesCompleted: episode,
      avgScoreAll: episodesCompleted ? sumScore / episodesCompleted : 0,
      avgMaxTileAll: episodesCompleted ? sumMaxTile / episodesCompleted : 0,
      avgScoreWindow: avg(lastScores),
      avgMaxTileWindow: avg(lastMaxTiles),

      board: state.grid,
    };

    if (socket.readyState === socket.OPEN) socket.send(JSON.stringify(payload));
  }, 200);

  socket.on("close", () => clearInterval(interval));
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Trainer server (local) on http://localhost:${PORT}`);
  console.log(`WS endpoint: ws://localhost:${PORT}/ws`);
});
