import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class AiApiService {
  constructor(private http: HttpClient) {}

  health() { return this.http.get<{ ok: boolean }>("/api/health"); }
  startTraining() { return this.http.post<{ ok: boolean; training: boolean }>("/api/train/start", {}); }
  stopTraining() { return this.http.post<{ ok: boolean; training: boolean }>("/api/train/stop", {}); }
}
