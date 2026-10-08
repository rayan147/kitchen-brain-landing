import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { DROPOFF, DROPOFF_ORDER } from "./film-dropoff";
import {
  FADE_FRAMES,
  FPS,
  captionsOf,
  filmFramesList,
  resolveCaption,
  totalFramesOf,
} from "./film-model";
import { DropoffManifestSchema } from "./manifest-dropoff";

// The committed capture record, with the end card's two site figures, which
// the frame copy adds from src/lib/site.ts.
const captured: unknown = JSON.parse(
  readFileSync(
    resolve(
      import.meta.dirname,
      "../../public/proof/film-dropoff/manifest.json",
    ),
    "utf8",
  ),
);
const manifest = DropoffManifestSchema.parse({
  ...(captured as object),
  displayPrice: "$49/month",
  trialDays: "15",
});
const beats = DROPOFF_ORDER.flatMap((id) => DROPOFF.scenes[id].beats);
const captions = DROPOFF_ORDER.flatMap((id) =>
  captionsOf(DROPOFF, id, manifest),
);
const percent = (s: string) => Number(s.replace("%", ""));

describe("the office lunch film", () => {
  it("resolves every caption from the capture record", () => {
    expect(captions).toHaveLength(beats.filter((b) => b.caption).length);
    expect(captions.join(" ")).not.toMatch(/[{}]/);
  });

  // The plan said about 40 s; the owner took the recommendation (2026-10-08)
  // to keep every caption's reading time instead, which lands near 46 s.
  it("runs under fifty seconds", () => {
    const seconds = totalFramesOf(DROPOFF) / FPS;
    expect(seconds).toBeGreaterThan(38);
    expect(seconds).toBeLessThan(50);
    expect(FADE_FRAMES).toBe(15);
  });

  it("shows only frames the capture run shot, each with its source", () => {
    for (const f of filmFramesList(DROPOFF)) {
      expect(manifest.frames).toContain(f);
      expect(manifest.frameSources[f]).toBeDefined();
    }
  });

  // House rules for customer copy, and the wedding film's fix: "the client",
  // never a pronoun guess.
  it("speaks in plain kitchen English", () => {
    for (const c of captions) {
      expect(c).not.toMatch(/—|!/);
      expect(c).not.toMatch(/\b(she|her|he|his|likely)\b/i);
    }
  });

  it("gives every caption time to be read, at three and a half words a second", () => {
    for (const b of beats.filter((beat) => beat.caption)) {
      const words = resolveCaption(b.caption!, manifest).split(/\s+/).length;
      expect(words / (b.to - b.from - 0.5)).toBeLessThanOrEqual(3.5);
    }
  });

  it("carries the snap line once", () => {
    expect(captions.filter((c) => c.includes("chased the money"))).toHaveLength(
      1,
    );
  });

  // The arrival's food cost counts misc and the closeout's share does not, so
  // a caption going from one to the other would show the cost falling when
  // the card says it came in over plan.
  it("never sets the order's food cost against the closeout's share", () => {
    for (const c of captions)
      expect(
        c.includes(manifest.foodCostWithMisc) &&
          c.includes(manifest.closeoutPct),
      ).toBe(false);
  });

  it("says under the target only when the closeout share is under it", () => {
    const close = captions[captions.length - 1];
    expect(close).toContain(manifest.closeoutPct);
    expect(close.includes("under")).toBe(
      percent(manifest.closeoutPct) < percent(manifest.targetPct),
    );
  });
});
