import { spawn } from "node:child_process";
import { mkdir, rm } from "node:fs/promises";

const outputDirectory = "dist";
const archive = `${outputDirectory}/securl-check-a-link-0.1.0.zip`;
const runtimeFiles = [
  "manifest.json",
  "background.js",
  "checker-url.js",
  "icons",
];

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

await new Promise((resolve, reject) => {
  const child = spawn("zip", ["-X", "-r", archive, ...runtimeFiles], {
    stdio: "inherit",
  });

  child.once("error", reject);
  child.once("exit", (code) => {
    if (code === 0) resolve();
    else reject(new Error(`zip exited with status ${code}`));
  });
});

console.log(`Created ${archive}`);
