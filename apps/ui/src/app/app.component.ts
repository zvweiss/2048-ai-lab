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
