// Pulls the shared capture run (the homepage redesign's) into the film:
// frames renamed by FRAME_MAP, manifest translated by toFilmManifest, price
// and trial read from the landing's src/lib/site.ts. Run:
//   npm run frames                      (default source below)
//   SHARED_DIR=<dir> npm run frames     (any other run's output)
import { copyFile, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { FRAME_MAP, toFilmManifest } from "../src/shared-capture.ts";

const root = resolve(import.meta.dirname, "..");
const shared =
  process.env.SHARED_DIR ??
  "/home/rayan147/kitchen-brain-landing/.gitworktrees/homepage-redesign/public/proof/home";

const site = await readFile(resolve(root, "../src/lib/site.ts"), "utf8");
const displayPrice = site.match(
  /PUBLIC_LAUNCH_PRICE_DISPLAY\?\.trim\(\) \|\| '([^']+)'/,
)?.[1];
const trialDays = site.match(/trialDays: (\d+)/)?.[1];
if (!displayPrice || !trialDays)
  throw new Error(
    "src/lib/site.ts no longer carries displayPrice/trialDays where this script reads them",
  );

const manifest = toFilmManifest(
  JSON.parse(await readFile(resolve(shared, "manifest.json"), "utf8")),
  { displayPrice, trialDays },
);
await writeFile(
  resolve(root, "public/frames/manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);

const copied: string[] = [];
const absent: string[] = [];
for (const [from, to] of Object.entries(FRAME_MAP)) {
  if (!existsSync(resolve(shared, from))) {
    absent.push(from);
    continue;
  }
  await copyFile(resolve(shared, from), resolve(root, "public/frames", to));
  copied.push(`${from} -> ${to}`);
}
console.log(`manifest written (app ${manifest.developCommit})`);
console.log(`copied ${copied.length}:\n  ${copied.join("\n  ")}`);
if (absent.length)
  console.log(`not in the shared run yet: ${absent.join(", ")}`);
