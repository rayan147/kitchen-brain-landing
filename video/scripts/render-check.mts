// Refuses a render unless every frame the film shows is on disk and was shot
// from the app by the capture run the manifest names. See src/render-guard.ts.
import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { FILM, SCENE_ORDER, sceneFrames } from "../src/film";
import { ManifestSchema } from "../src/manifest";
import { frameProblems, sourceCounts } from "../src/render-guard";

const out = resolve(import.meta.dirname, "../public/frames");
const manifest = ManifestSchema.parse(
  JSON.parse(await readFile(resolve(out, "manifest.json"), "utf8")),
);
const filmFrames = [...new Set(SCENE_ORDER.flatMap((id) => sceneFrames(id)))];
const problems = frameProblems(
  filmFrames,
  manifest,
  new Set(await readdir(out)),
);
if (problems.length) {
  console.error(`render check failed:\n- ${problems.join("\n- ")}`);
  process.exit(1);
}
console.log(
  `render check passed: ${filmFrames.length} app frames, ${Object.keys(FILM).length} scenes\n  ${sourceCounts(filmFrames, manifest.frameSources).join("\n  ")}`,
);
