// Writes the film's WebVTT (out/promo.vtt, or out/dropoff.vtt with FILM=dropoff)
// from its table and manifest, so the player and screen readers get the same
// words the film burns in.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { WEDDING } from "../src/film";
import { DROPOFF } from "../src/film-dropoff";
import { ManifestSchema } from "../src/manifest";
import { DropoffManifestSchema } from "../src/manifest-dropoff";
import { SAGE } from "../src/film-sage";
import { SageManifestSchema } from "../src/manifest-sage";
import { toVttOf } from "../src/vtt";

// FILM=dropoff writes out/dropoff.vtt, FILM=sage out/sage.vtt; the default is
// the wedding's promo.vtt. A lookup, as in render-check.mts: the films differ
// only in data.
const FILMS = {
  dropoff: { film: DROPOFF, schema: DropoffManifestSchema, name: "dropoff.vtt" },
  sage: { film: SAGE, schema: SageManifestSchema, name: "sage.vtt" },
} as const;
const picked = FILMS[process.env.FILM as keyof typeof FILMS];
const film = picked?.film ?? WEDDING;

const root = resolve(import.meta.dirname, "..");
const json: unknown = JSON.parse(
  await readFile(
    resolve(root, "public", film.framesDir, "manifest.json"),
    "utf8",
  ),
);
const manifest = picked ? picked.schema.parse(json) : ManifestSchema.parse(json);
const name = picked?.name ?? "promo.vtt";
await mkdir(resolve(root, "out"), { recursive: true });
await writeFile(resolve(root, "out", name), toVttOf(film, manifest));
console.log(`wrote out/${name}`);
