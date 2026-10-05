// Refuses a render while any frame the film names is missing, or the manifest
// still carries the pre-capture placeholder. A film with a "frame pending"
// slate or a placeholder figure must never leave this folder.
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const film = readFileSync(resolve(root, "src/film.ts"), "utf8");
const frames = [
  ...new Set([...film.matchAll(/"([a-z0-9-]+\.png)"/g)].map((m) => m[1])),
];
const missing = frames.filter(
  (f) => !existsSync(resolve(root, "public/frames", f)),
);
const manifest = JSON.parse(
  readFileSync(resolve(root, "public/frames/manifest.json"), "utf8"),
);
const problems = [
  ...missing.map((f) => `missing frame ${f}`),
  ...(manifest.developCommit === "PENDING-CAPTURE"
    ? ["manifest is the pre-capture placeholder"]
    : []),
];
if (problems.length) {
  console.error(`render check failed:\n- ${problems.join("\n- ")}`);
  process.exit(1);
}
console.log(
  `render check passed: ${frames.length} frames, develop ${manifest.developCommit}`,
);
