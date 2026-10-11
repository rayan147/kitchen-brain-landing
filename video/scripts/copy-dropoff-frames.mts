// Pulls the office lunch's capture run (public/proof/film-dropoff, copied from
// scripts/capture-film.mjs with FILM=dropoff) into public/frames-dropoff, or
// with FILM=sage the Sage film's (public/proof/film-sage, from
// scripts/capture-sage-film.mjs) into public/frames-sage, with
// the end card's price and trial read from the landing's src/lib/site.ts. It
// clears that folder's PNGs first, so a frame from an older run cannot survive.
// Only frames the capture record lists are copied. Run: npm run frames:dropoff
// or npm run frames:sage
import {
  copyFile,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { DropoffManifestSchema } from "../src/manifest-dropoff";
import { SageManifestSchema } from "../src/manifest-sage";

const root = resolve(import.meta.dirname, "..");
// Considered a lookup like render-check.mts; not used: two folders, one flag.
const sage = process.env.FILM === "sage";
const out = resolve(root, sage ? "public/frames-sage" : "public/frames-dropoff");
const source = resolve(
  root,
  sage ? "../public/proof/film-sage" : "../public/proof/film-dropoff",
);

const site = await readFile(resolve(root, "../src/lib/site.ts"), "utf8");
const displayPrice = site.match(
  /PUBLIC_LAUNCH_PRICE_DISPLAY\?\.trim\(\) \|\| '([^']+)'/,
)?.[1];
const trialDays = site.match(/trialDays: (\d+)/)?.[1];
if (!displayPrice || !trialDays)
  throw new Error(
    "src/lib/site.ts no longer carries displayPrice/trialDays where this script reads them",
  );
const captured = JSON.parse(
  await readFile(resolve(source, "manifest.json"), "utf8"),
) as {
  frames?: string[];
};

await mkdir(out, { recursive: true });
for (const f of await readdir(out))
  if (f.endsWith(".png")) await rm(resolve(out, f));
const copied: string[] = [];
for (const f of captured.frames ?? []) {
  if (!existsSync(resolve(source, f))) continue;
  await copyFile(resolve(source, f), resolve(out, f));
  copied.push(f);
}
const manifest = (sage ? SageManifestSchema : DropoffManifestSchema).parse({
  ...captured,
  displayPrice,
  trialDays,
  frames: copied,
});
await writeFile(
  resolve(out, "manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(`manifest written; ${copied.length} frames copied`);
