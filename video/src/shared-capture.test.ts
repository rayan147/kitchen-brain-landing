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
  deposit: "$3,500.00",
  closeoutPlanned: "$4,039.96",
  closeoutActual: "$4,093.50",
  appSha: "e00299078",
  capturedOn: "2026-10-05",
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
      deposit: "$3,500.00",
      revenue: "$14,250.00",
      plannedFoodCost: "$4,039.96",
      actualFoodCost: "$4,093.50",
      displayPrice: "$49/month",
      trialDays: "15",
      developCommit: "e00299078",
      capturedOn: "2026-10-05",
      frames: ["events-offer-mobile.png"],
    });
  });
  it("names the missing key when the shared manifest lacks a figure", () => {
    const { targetPct: _omitted, ...rest } = peer;
    expect(() => toFilmManifest(rest, site, [])).toThrow("targetPct");
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
