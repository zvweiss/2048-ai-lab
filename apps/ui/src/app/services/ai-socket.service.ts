import { Injectable, NgZone } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export type TrainProgressMsg = {
  type: "trainProgress";
  episode: number;
  epsilon: number;
  avgScore: number;
  loss: number;
  board: number[][];
};

export type HelloMsg = { type: "hello"; message: string };
export type ServerMsg = TrainProgressMsg | HelloMsg | { type: string; [k: string]: any };

@Injectable({ providedIn: "root" })
export class AiSocketService {
  private ws?: WebSocket;
  public latest$ = new BehaviorSubject<ServerMsg | null>(null);

  constructor(private zone: NgZone) {}

  connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) return;

    const url = `ws://${location.host}/ws`; // proxied to localhost:3000/ws
    this.ws = new WebSocket(url);

    this.ws.onmessage = (evt) => {
      const msg = JSON.parse(evt.data) as ServerMsg;
      this.zone.run(() => this.latest$.next(msg));
    };
  }

  disconnect() {
    this.ws?.close();
    this.ws = undefined;
  }
}
