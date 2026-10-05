import { describe, expect, it } from "vitest";
import { FILM } from "./film";
import { ManifestSchema } from "./manifest";
import { FRAME_MAP, toFilmManifest } from "./shared-capture";

const peer = {
  guests: "150",
  pricePerGuest: "$95.00",
  revenue: "$14,250.00",
  foodCostPct: "28.3%",
  target: "30%",
  deposit: "$3,500.00",
  appSha: "e00299078",
  capturedOn: "2026-10-05",
};
const site = { displayPrice: "$49/month", trialDays: "15" };

describe("toFilmManifest", () => {
  it("carries the shared run's figures verbatim and adds the site's price", () => {
    const m = toFilmManifest(peer, site);
    expect(ManifestSchema.parse(m)).toEqual({
      guests: "150",
      pricePerGuest: "$95.00",
      foodCostPct: "28.3%",
      deposit: "$3,500.00",
      revenue: "$14,250.00",
      displayPrice: "$49/month",
      trialDays: "15",
      developCommit: "e00299078",
      capturedOn: "2026-10-05",
    });
  });
  it("names the missing key when the shared manifest lacks a figure", () => {
    const { foodCostPct: _omitted, ...rest } = peer;
    expect(() => toFilmManifest(rest, site)).toThrow("foodCostPct");
  });
});

describe("FRAME_MAP", () => {
  it("only targets frames the film actually uses", () => {
    const used = new Set(Object.values(FILM).flatMap((s) => s.frames));
    for (const target of Object.values(FRAME_MAP))
      expect(used.has(target)).toBe(true);
  });
});
