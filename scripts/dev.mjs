import { spawn } from "node:child_process";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

const isWindows = process.platform === "win32";
const localPython = isWindows
  ? ".venv\\Scripts\\python.exe"
  : ".venv/bin/python";
const python = existsSync(localPython)
  ? localPython
  : isWindows
    ? "python"
    : "python3";

const api = spawn(
  python,
  ["-m", "uvicorn", "backend.app:app", "--reload", "--port", "8000"],
  { stdio: "inherit" },
);
const web = spawn(process.execPath, ["node_modules/vite/bin/vite.js"], {
  stdio: "inherit",
});
const children = [api, web];
let stopping = false;

function stop(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (!child.pid) continue;
    if (isWindows) {
      try {
        execFileSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], {
          stdio: "ignore",
        });
      } catch {
        // The process may already have stopped.
      }
    } else {
      child.kill("SIGTERM");
    }
  }
  process.exit(exitCode);
}

for (const child of children) {
  child.on("exit", (code) => stop(code ?? 0));
  child.on("error", (error) => {
    console.error(error.message);
    stop(1);
  });
}

process.on("SIGINT", () => stop());
process.on("SIGTERM", () => stop());
