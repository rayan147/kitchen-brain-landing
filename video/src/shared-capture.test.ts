import { describe, expect, it } from "vitest";
import { FILM } from "./film";
import { ManifestSchema } from "./manifest";
import { FRAME_MAP, toFilmManifest } from "./shared-capture";

const peer = {
  guests: "150",
  pricePerGuest: "$95.00",
  revenue: "$14,250.00",
  proposalFoodCostPct: "28.3%",
  targetPct: "30%",
  deposit: "$5,250.00",
  offerTotal: "$21,043.00",
  closeoutPlanned: "$3,750.87",
  closeoutActual: "$3,675.88",
  closeoutPct: "25.8%",
  balance: "$10,750.00",
  balanceDue: "Wed, Dec 9",
  mainPortions: "300",
  appSha: "e00299078",
  capturedOn: "2026-10-05",
  frameSources: {
    "proposal-mobile.png": { host: "localhost", app: "57a4c7f34", via: "x" },
    "not-in-film.png": { host: "localhost", app: "x" },
  },
};
const site = { displayPrice: "$49/month", trialDays: "15" };

describe("toFilmManifest", () => {
  // The film's own capture run (scripts/capture-film.mjs) writes the menu
  // screen's food cost as proposalFoodCostPct; the order-page figure is
  // optional and falls back to it.
  it("carries the shared run's figures verbatim, the site's price, and the frames copied", () => {
    const m = toFilmManifest(peer, site, ["events-offer-mobile.png"]);
    expect(ManifestSchema.parse(m)).toEqual({
      guests: "150",
      pricePerGuest: "$95.00",
      foodCostPct: "28.3%",
      proposalFoodCostPct: "28.3%",
      target: "30%",
      deposit: "$5,250.00",
      revenue: "$14,250.00",
      offerTotal: "$21,043.00",
      plannedFoodCost: "$3,750.87",
      actualFoodCost: "$3,675.88",
      dayAfterShare: "25.8%",
      balance: "$10,750.00",
      balanceDue: "Wed, Dec 9",
      mainPortions: "300",
      displayPrice: "$49/month",
      trialDays: "15",
      developCommit: "e00299078",
      capturedOn: "2026-10-05",
      frames: ["events-offer-mobile.png"],
      frameSources: {
        "events-offer-mobile.png": { host: "localhost", app: "57a4c7f34" },
      },
    });
  });
  it("names the missing key when the shared manifest lacks a figure", () => {
    const { targetPct: _omitted, ...rest } = peer;
    expect(() => toFilmManifest(rest, site, [])).toThrow("targetPct");
  });
});

describe("the capture record on disk", () => {
  // The film's figures come from public/proof/film/manifest.json and nowhere
  // else; this reads the real record, so a re-walk with other numbers fails
  // here before a render can quote a stale one.
  it("translates the shipped record, every figure present", async () => {
    const { readFile } = await import("node:fs/promises");
    const shared = JSON.parse(
      await readFile(
        new URL("../../public/proof/film/manifest.json", import.meta.url),
        "utf8",
      ),
    ) as Record<string, unknown>;
    const m = ManifestSchema.parse(
      toFilmManifest(shared, site, Object.values(FRAME_MAP)),
    );
    expect(m.offerTotal).toBe(shared.offerTotal);
    expect(m.dayAfterShare).toBe(shared.closeoutPct);
    expect(shared.closeoutFinal).toBe(true);
    expect(Object.keys(m.frameSources).sort()).toEqual(
      Object.values(FRAME_MAP).sort(),
    );
  });
  it("lists every frame the film maps as shot or reused, with its source", async () => {
    const { readFile } = await import("node:fs/promises");
    const shared = JSON.parse(
      await readFile(
        new URL("../../public/proof/film/manifest.json", import.meta.url),
        "utf8",
      ),
    ) as { frames: string[]; frameSources: Record<string, { via: string }> };
    for (const f of Object.keys(FRAME_MAP)) {
      expect(shared.frames, f).toContain(f);
      expect(shared.frameSources[f]?.via, f).toBeTruthy();
    }
  });
});

describe("FRAME_MAP", () => {
  it("covers every app frame the film shows, and nothing else", () => {
    const used = new Set(
      Object.values(FILM).flatMap((s) => s.beats.flatMap((b) => b.frames)),
    );
    expect(new Set(Object.values(FRAME_MAP))).toEqual(used);
  });
});
