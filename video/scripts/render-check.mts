// Refuses a render unless every frame the film shows is on disk and was shot
// from the app by the capture run the manifest names. See src/render-guard.ts.
import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { WEDDING } from "../src/film";
import { DROPOFF } from "../src/film-dropoff";
import { filmFramesList } from "../src/film-model";
import { ManifestSchema } from "../src/manifest";
import { DropoffManifestSchema } from "../src/manifest-dropoff";
import { SAGE } from "../src/film-sage";
import { SageManifestSchema } from "../src/manifest-sage";
import { frameProblems, sourceCounts } from "../src/render-guard";

// FILM=dropoff checks the office lunch, FILM=sage the Sage film; the default
// is the wedding.
const which = process.env.FILM;
const dropoff = which === "dropoff";
const sage = which === "sage";
const film = dropoff ? DROPOFF : sage ? SAGE : WEDDING;
const out = resolve(import.meta.dirname, "../public", film.framesDir);
const json: unknown = JSON.parse(
  await readFile(resolve(out, "manifest.json"), "utf8"),
);
const manifest =
  dropoff || sage
    ? (({ appSha, ...m }) => ({ ...m, developCommit: appSha }))(
        (dropoff ? DropoffManifestSchema : SageManifestSchema).parse(json),
      )
    : ManifestSchema.parse(json);
const filmFrames = filmFramesList(film);
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
  `render check passed: ${filmFrames.length} app frames, ${film.order.length} scenes\n  ${sourceCounts(filmFrames, manifest.frameSources).join("\n  ")}`,
);
