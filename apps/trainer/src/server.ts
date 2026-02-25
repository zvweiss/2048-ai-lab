import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { newGame, applyMove, Direction, GameState } from "@zvi/ai-2048-core";
import { Mulberry32 } from "./rng.js";

const app = express();
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));

/**
 * This server is for LOCAL LAB MODE only.
 * It streams training progress / board frames to a dev UI via WebSocket.
 * Public deployment should be static (Angular only).
 */

let training = false;
app.post("/api/train/start", (_req, res) => {
  training = true;
  res.json({ ok: true, training });
});

app.post("/api/train/stop", (_req, res) => {
  training = false;
  res.json({ ok: true, training });
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });

wss.on("connection", (socket) => {
  socket.send(JSON.stringify({ type: "hello", message: "connected" }));

  // For seed: simulate "training" by playing random moves and streaming boards.
  const rng = new Mulberry32(Date.now() & 0xffffffff);
  let state: GameState = newGame(rng);
  let episode = 0;

  const interval = setInterval(() => {
    if (!training) return;

    // naive random move demo (replace with agent/trainer later)
    const dirs: Direction[] = ["up", "down", "left", "right"];
    const dir = dirs[Math.floor(rng.next() * dirs.length)];
    const res = applyMove(state, dir, rng);
    if (res.moved) state = res.next;

    // episode boundary
    if (state.isGameOver) {
      episode++;
      state = newGame(rng);
    }

    const payload = {
      type: "trainProgress",
      episode,
      epsilon: Math.max(0.05, 1.0 - episode / 5000),
      avgScore: state.score, // placeholder; will become rolling avg
      loss: Math.max(0.0001, 1.0 / Math.sqrt(episode + 1)),
      board: state.grid
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
