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

// The landing's own Sage data, read as text: the page and the film must say
// the same allowance and the same words.
const siteSage = readFileSync(
  resolve(import.meta.dirname, "../../src/lib/sage.ts"),
  "utf8",
);
const siteNumber = (key: string) =>
  Number(siteSage.match(new RegExp(`${key}: (\\d+)`))?.[1]).toLocaleString(
    "en-US",
  );
const transcriptBlock = siteSage.match(/transcript: \[([\s\S]*?)\]/)?.[1] ?? "";
const transcript = [...transcriptBlock.matchAll(/^\s*['"](.+)['"],?$/gm)].map(
  (m) => m[1],
);

describe("the Sage film", () => {
  it("carries the same allowance as the page's src/lib/sage.ts", () => {
    expect(manifest.periodCredits).toBe(siteNumber("periodCredits"));
    expect(manifest.trialCredits).toBe(siteNumber("trialCredits"));
  });

  it("matches the page's transcript word for word", () => {
    expect(transcript).toEqual(captions);
  });

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
    const beats = SAGE.scenes[SAGE_ORDER[SAGE_ORDER.length - 1]].beats;
    const last = beats[beats.length - 1];
    expect(last?.layout).toBe("end");
  });
});
