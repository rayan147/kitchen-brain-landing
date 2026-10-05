import { describe, expect, it } from "vitest";
import {
  FILM,
  SCENE_ORDER,
  captionsFor,
  resolveCaption,
  sceneFrames,
} from "./film";
import { ManifestSchema, type Manifest } from "./manifest";

const manifest: Manifest = {
  guests: "150",
  pricePerGuest: "$95.00",
  foodCostPct: "28.4%",
  proposalFoodCostPct: "28.3%",
  target: "30%",
  deposit: "$3,500.00",
  revenue: "$14,250.00",
  displayPrice: "$49/month",
  trialDays: "15",
  developCommit: "e00299078",
  capturedOn: "2026-10-05",
  frames: [],
};

describe("resolveCaption", () => {
  it("inserts the on-screen string verbatim", () => {
    expect(resolveCaption("Food cost {foodCostPct}.", manifest)).toBe(
      "Food cost 28.4%.",
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

describe("FILM follows develop's event workflow", () => {
  // src/lib/events/derive.ts: Inquiry, Menu & service, Proposal, Client
  // decision, Agreement, Booked; then kitchen planning and Confirm order.
  it("runs the scenes in the app's own order", () => {
    expect(SCENE_ORDER).toEqual([
      "coldOpen",
      "menu",
      "proposal",
      "decision",
      "agreement",
      "book",
      "kitchen",
      "close",
    ]);
  });
  it("prices the job in the proposal, before the client decides", () => {
    expect(SCENE_ORDER.indexOf("proposal")).toBeLessThan(
      SCENE_ORDER.indexOf("decision"),
    );
    // The proposal frame prints its own figure (28.3% on this build), which can
    // differ from the order page's (28.4%); each caption quotes its own frame.
    expect(captionsFor("proposal", manifest).join(" ")).toContain("28.3%");
    expect(captionsFor("close", manifest).join(" ")).toContain("28.3%");
  });
  it("books at Book the event, never at Confirm order", () => {
    const all = SCENE_ORDER.flatMap((id) => captionsFor(id, manifest)).join(
      "\n",
    );
    expect(all).not.toMatch(/Confirm order is/);
    const book = captionsFor("book", manifest).join(" ");
    expect(book).toContain("Her yes is not a booking.");
  });
});

describe("FILM captions and beats", () => {
  it("every scene resolves against a full manifest", () => {
    for (const id of SCENE_ORDER)
      expect(() => captionsFor(id, manifest)).not.toThrow();
  });
  it("carries no em dash, en dash or exclamation point", () => {
    const all = Object.values(FILM)
      .flatMap((s) => [s.chapter ?? "", ...s.beats.map((b) => b.caption ?? "")])
      .join("\n");
    expect(all).not.toMatch(/[—–!]/);
  });
  it("keeps every beat inside its scene", () => {
    for (const id of SCENE_ORDER) {
      for (const b of FILM[id].beats) {
        expect(b.from).toBeGreaterThanOrEqual(0);
        expect(b.to).toBeLessThanOrEqual(FILM[id].seconds);
        expect(b.from).toBeLessThan(b.to);
      }
    }
  });
  it("lists the app frames each scene shows", () => {
    expect(sceneFrames("decision")).toEqual([
      "events-proposal-sent-desktop.png",
      "events-offer-mobile.png",
    ]);
  });
});
