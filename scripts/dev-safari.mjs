import { spawn } from "node:child_process";
import { platform } from "node:os";

const next = spawn("next", ["dev", "--webpack"], {
  stdio: ["inherit", "pipe", "pipe"],
});

let opened = false;
let localUrl = null;

function openSafari(url) {
  if (opened || platform() !== "darwin") {
    return;
  }

  opened = true;
  spawn("open", ["-a", "Safari", url], {
    detached: true,
    stdio: "ignore",
  }).unref();
}

function handleOutput(chunk, stream) {
  const text = chunk.toString();
  stream.write(chunk);

  const match = text.match(/https?:\/\/localhost:\d+/);
  if (match) {
    localUrl = match[0];
  }

  if (localUrl && text.includes("Ready")) {
    openSafari(localUrl);
  }
}

next.stdout.on("data", (chunk) => handleOutput(chunk, process.stdout));
next.stderr.on("data", (chunk) => handleOutput(chunk, process.stderr));

next.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    next.kill(signal);
  });
}
