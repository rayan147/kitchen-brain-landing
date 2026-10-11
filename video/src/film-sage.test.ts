import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { SAGE, SAGE_ORDER } from "./film-sage";
import { FPS, captionsOf, filmFramesList, totalFramesOf } from "./film-model";
import { SageManifestSchema } from "./manifest-sage";

// The committed capture record, with the end card's two site figures, which
// the frame copy adds from src/lib/site.ts.
const captured: unknown = JSON.parse(
  readFileSync(
    resolve(import.meta.dirname, "../../public/proof/film-sage/manifest.json"),
    "utf8",
  ),
);
const manifest = SageManifestSchema.parse({
  ...(captured as object),
  displayPrice: "$49/month",
  trialDays: "15",
});
const captions = SAGE_ORDER.flatMap((id) => captionsOf(SAGE, id, manifest));

describe("the Sage film", () => {
  it("resolves every caption from the capture record", () => {
    expect(captions.join(" ")).not.toMatch(/[{}]|undefined/);
  });

  it("states both allowances as the app printed them", () => {
    const line = captions.find((c) => c.includes("credits each paid month"));
    expect(line).toBe(
      `${manifest.periodCredits} Sage credits each paid month, ${manifest.trialCredits} during the free trial.`,
    );
    expect(manifest.allowanceNote).toContain(`of ${manifest.periodCredits} credits`);
    expect(manifest.billingLine).toContain(`of ${manifest.periodCredits} credits used`);
  });

  it("gives every frame a recorded source", () => {
    for (const f of filmFramesList(SAGE)) {
      expect(manifest.frames).toContain(f);
      expect(manifest.frameSources[f]).toBeDefined();
    }
  });

  it("runs under thirty seconds on whole frames", () => {
    for (const id of SAGE_ORDER)
      expect(Number.isInteger(SAGE.scenes[id].seconds * FPS)).toBe(true);
    expect(totalFramesOf(SAGE) / FPS).toBeLessThan(30);
  });

  it("ends on the end card", () => {
    const last = SAGE.scenes[SAGE_ORDER[SAGE_ORDER.length - 1]].beats.at(-1);
    expect(last?.layout).toBe("end");
  });
});
