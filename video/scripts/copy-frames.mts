// Pulls the shared capture run (the homepage redesign's, shot from the develop
// app) into the film: frames renamed by FRAME_MAP, manifest translated by
// toFilmManifest, price and trial read from the landing's src/lib/site.ts.
// It first clears every PNG in public/frames, so a frame from an older run or
// any other source cannot survive into the film. Run:
//   npm run frames                      (default source below)
//   SHARED_DIR=<dir> npm run frames     (any other run's output)
import { copyFile, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { FRAME_MAP, toFilmManifest } from "../src/shared-capture";

const root = resolve(import.meta.dirname, "..");
const out = resolve(root, "public/frames");
const shared = process.env.SHARED_DIR ?? resolve(root, "../public/proof/film");

const site = await readFile(resolve(root, "../src/lib/site.ts"), "utf8");
const displayPrice = site.match(
  /PUBLIC_LAUNCH_PRICE_DISPLAY\?\.trim\(\) \|\| '([^']+)'/,
)?.[1];
const trialDays = site.match(/trialDays: (\d+)/)?.[1];
if (!displayPrice || !trialDays)
  throw new Error(
    "src/lib/site.ts no longer carries displayPrice/trialDays where this script reads them",
  );
const sharedManifest = JSON.parse(
  await readFile(resolve(shared, "manifest.json"), "utf8"),
) as Record<string, unknown>;

for (const f of await readdir(out))
  if (f.endsWith(".png")) await rm(resolve(out, f));
const copied: string[] = [];
const absent: string[] = [];
for (const [from, to] of Object.entries(FRAME_MAP)) {
  if (!existsSync(resolve(shared, from))) {
    absent.push(from);
    continue;
  }
  await copyFile(resolve(shared, from), resolve(out, to));
  copied.push(to);
}
const manifest = toFilmManifest(
  sharedManifest,
  { displayPrice, trialDays },
  copied,
);
await writeFile(
  resolve(out, "manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(
  `manifest written (app ${manifest.developCommit}); ${copied.length} frames copied`,
);
if (absent.length)
  console.log(`not in the shared run yet: ${absent.join(", ")}`);
