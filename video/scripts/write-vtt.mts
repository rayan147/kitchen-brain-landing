// Writes out/promo.vtt from film.ts and the current manifest, so the player
// and screen readers get the same words the film burns in.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { ManifestSchema } from "../src/manifest";
import { toVtt } from "../src/vtt";

const root = resolve(import.meta.dirname, "..");
const manifest = ManifestSchema.parse(
  JSON.parse(
    await readFile(resolve(root, "public/frames/manifest.json"), "utf8"),
  ),
);
await mkdir(resolve(root, "out"), { recursive: true });
await writeFile(resolve(root, "out/promo.vtt"), toVtt(manifest));
console.log("wrote out/promo.vtt");
