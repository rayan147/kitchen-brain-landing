import { describe, expect, it } from "vitest";
import { FILM, captionsFor, resolveCaption } from "./film";
import { ManifestSchema, type Manifest } from "./manifest";

const manifest: Manifest = {
  guests: "150",
  pricePerGuest: "$95.00",
  foodCostPct: "28.3%",
  deposit: "$3,500.00",
  revenue: "$14,250.00",
  displayPrice: "$49/month",
  trialDays: "15",
  developCommit: "e00299078",
  capturedOn: "2026-10-05",
};

describe("resolveCaption", () => {
  it("inserts the on-screen string verbatim", () => {
    expect(resolveCaption("Food cost {foodCostPct}.", manifest)).toBe(
      "Food cost 28.3%.",
    );
  });
  it("throws on a token the manifest does not carry", () => {
    expect(() => resolveCaption("Margin {margin}.", manifest)).toThrow(
      "unresolved token {margin}",
    );
  });
});

describe("ManifestSchema", () => {
  it("refuses a manifest missing a figure", () => {
    const { foodCostPct: _omitted, ...rest } = manifest;
    expect(ManifestSchema.safeParse(rest).success).toBe(false);
  });
});

describe("FILM captions", () => {
  it("every scene resolves against a full manifest", () => {
    for (const id of Object.keys(FILM) as (keyof typeof FILM)[]) {
      expect(() => captionsFor(id, manifest)).not.toThrow();
    }
  });
  it("carries no em dash, en dash or exclamation point", () => {
    const all = Object.values(FILM)
      .flatMap((s) => [s.chapter ?? "", ...s.captions])
      .join("\n");
    expect(all).not.toMatch(/[—–!]/);
  });
});
