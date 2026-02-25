#!/usr/bin/env bash
set -euo pipefail

# Creates the Angular app under apps/ui using your local Angular CLI.
# Keeps things minimal and standalone-friendly.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
UI_DIR="$ROOT_DIR/apps/ui"

if [ -d "$UI_DIR" ] && [ -f "$UI_DIR/angular.json" ]; then
  echo "apps/ui already looks like an Angular project. Skipping."
  exit 0
fi

mkdir -p "$ROOT_DIR/apps"

echo "Creating Angular app at apps/ui ..."
cd "$ROOT_DIR/apps"

# You can tweak these flags as you like.
# --standalone is default in modern Angular; included for clarity.
# --routing true because we will likely want routes later.
# --style css for simplicity (you can change to scss later).
# --skip-tests to reduce noise.
# --skip-git because this is a monorepo.
npx -y @angular/cli new ui   --standalone   --routing   --style=css   --skip-tests   --skip-git

echo "Adding proxy config and starter services/components ..."

# Proxy config
cat > "$UI_DIR/proxy.conf.json" <<'JSON'
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  },
  "/ws": {
    "target": "ws://localhost:3000",
    "ws": true,
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
JSON

# Minimal dashboard component replacement (standalone AppComponent)
cat > "$UI_DIR/src/app/app.component.ts" <<'TS'
import { Component, computed, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AiSocketService, TrainProgressMsg } from "./services/ai-socket.service";
import { AiApiService } from "./services/ai-api.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="font-family: system-ui; padding: 16px; max-width: 900px; margin: 0 auto;">
      <h2>2048 AI Dashboard (Seed)</h2>

      <div style="display:flex; gap:12px; margin: 12px 0;">
        <button (click)="connect()">Connect WS</button>
        <button (click)="start()">Start Training</button>
        <button (click)="stop()">Stop Training</button>
      </div>

      <div style="display:flex; gap:24px; align-items:flex-start;">
        <div>
          <h3>Stats</h3>
          <div>Episode: <b>{{ stats()?.episode ?? "-" }}</b></div>
          <div>Epsilon: <b>{{ stats()?.epsilon?.toFixed(3) ?? "-" }}</b></div>
          <div>Avg Score: <b>{{ stats()?.avgScore ?? "-" }}</b></div>
          <div>Loss: <b>{{ stats()?.loss?.toFixed(5) ?? "-" }}</b></div>
        </div>

        <div>
          <h3>Board</h3>
          <div style="display:grid; grid-template-columns: repeat(4, 70px); gap:8px; background:#bbada0; padding:8px; border-radius:8px;">
            <ng-container *ngFor="let r of board(); let i = index">
              <ng-container *ngFor="let v of r; let j = index">
                <div style="width:70px; height:70px; display:flex; align-items:center; justify-content:center;
                            border-radius:8px; background:#cdc1b4; font-weight:700; font-size:18px;">
                  {{ v === 0 ? "" : v }}
                </div>
              </ng-container>
            </ng-container>
          </div>
        </div>
      </div>

      <pre style="margin-top:16px; background:#111; color:#eee; padding:12px; border-radius:8px; overflow:auto;">{{ latestRaw() }}</pre>
    </div>
  `
})
export class AppComponent {
  latest = signal<any>(null);

  constructor(private sock: AiSocketService, private api: AiApiService) {
    this.sock.latest$.subscribe((m) => this.latest.set(m));
  }

  connect() { this.sock.connect(); }
  start() { this.api.startTraining().subscribe(); }
  stop() { this.api.stopTraining().subscribe(); }

  stats = computed(() => {
    const m = this.latest();
    return m?.type === "trainProgress" ? (m as TrainProgressMsg) : null;
  });

  board = computed(() => this.stats()?.board ?? Array.from({ length: 4 }, () => Array(4).fill(0)));
  latestRaw = computed(() => JSON.stringify(this.latest(), null, 2) ?? "");
}
TS

mkdir -p "$UI_DIR/src/app/services"

# WebSocket service
cat > "$UI_DIR/src/app/services/ai-socket.service.ts" <<'TS'
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
TS

# REST service
cat > "$UI_DIR/src/app/services/ai-api.service.ts" <<'TS'
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class AiApiService {
  constructor(private http: HttpClient) {}

  health() { return this.http.get<{ ok: boolean }>("/api/health"); }
  startTraining() { return this.http.post<{ ok: boolean; training: boolean }>("/api/train/start", {}); }
  stopTraining() { return this.http.post<{ ok: boolean; training: boolean }>("/api/train/stop", {}); }
}
TS

# Ensure HttpClient is provided (Angular 15+ standalone)
# Patch main.ts to provideHttpClient if not already present
MAIN_TS="$UI_DIR/src/main.ts"
if ! grep -q "provideHttpClient" "$MAIN_TS"; then
  # naive but effective replacement for the default bootstrap snippet
  cat > "$MAIN_TS" <<'TS'
import { bootstrapApplication } from "@angular/platform-browser";
import { provideHttpClient } from "@angular/common/http";
import { AppComponent } from "./app/app.component";

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient()]
}).catch((err) => console.error(err));
TS
fi

echo "Done. You can run:"
echo "  cd apps/ui"
echo "  npx ng serve --proxy-config proxy.conf.json"
