import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { join } from "node:path";

const uiDir = join(process.cwd(), "apps", "ui");
if (!existsSync(join(uiDir, "angular.json"))) {
  console.error("apps/ui is not an Angular project yet.");
  console.error("Run: bash scripts/create-angular-ui.sh");
  process.exit(1);
}

const cmd = process.platform === "win32" ? "npx.cmd" : "npx";
const args = ["ng", "build"];
const p = spawn(cmd, args, { cwd: uiDir, stdio: "inherit" });
p.on("exit", (code) => process.exit(code ?? 0));
