import { describe, expect, it } from "vitest";
import {
  FILM,
  SCENE_ORDER,
  TITLE,
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
      "decision",
      "agreement",
      "kitchen",
      "receive",
      "prep",
      "pack",
      "close",
    ]);
  });
  it("prices the job on Menu & service, before the client decides", () => {
    // Develop prints price a guest, food cost and target on the event's step 2.
    expect(SCENE_ORDER.indexOf("menu")).toBeLessThan(
      SCENE_ORDER.indexOf("decision"),
    );
    expect(captionsFor("menu", manifest).join(" ")).toContain("28.3%");
  });
  it("books after signed and paid, at Book the event, never at Confirm order", () => {
    // booking-requirements.ts: an accepted proposal, every signer, the deposit
    // the agreement names, a day with room. Then Book the event; the order is
    // confirmed later, when the kitchen plan is ready.
    const frames = FILM.agreement.beats.map((b) => b.frames.join());
    const book = frames.indexOf("events-book-event-desktop.png");
    expect(book).toBeGreaterThan(
      frames.indexOf("events-payments-paid-desktop.png"),
    );
    expect(frames[book + 1]).toBe("events-booked-desktop.png");
    expect(FILM.agreement.beats[book].caption).toBe(
      "Her yes is not a booking. Signed and paid is.",
    );
    const all = SCENE_ORDER.flatMap((id) => captionsFor(id, manifest)).join(
      "\n",
    );
    expect(all).not.toMatch(/Confirm order is/);
  });
  // The pay page was captured in a 659 px window, not a phone: inside a
  // phone frame it shrinks to half size and its copy cannot be read.
  it("shows the pay page on its own, full frame, not inside a phone", () => {
    const pay = FILM.agreement.beats.find((b) =>
      b.frames.includes("events-pay-mobile.png"),
    );
    expect(pay?.layout).toBe("screen");
    expect(pay?.frames).toEqual(["events-pay-mobile.png"]);
  });
  it("says what the paid frame shows about the balance reminder", () => {
    const paid = FILM.agreement.beats.find((b) =>
      b.frames.includes("events-payments-paid-desktop.png"),
    );
    expect(paid?.caption).toMatch(/reminder/i);
  });
});

describe("after the kitchen plan, the delivery then the prep", () => {
  // Develop: /orders/<id>/receiving, then /orders/<id>/prep.
  it("receives before it preps, both after the shop list", () => {
    const k = SCENE_ORDER.indexOf("kitchen");
    expect(SCENE_ORDER.indexOf("receive")).toBe(k + 1);
    expect(SCENE_ORDER.indexOf("prep")).toBe(k + 2);
  });
  it("shows the receiving and prep screens", () => {
    expect(sceneFrames("receive")).toEqual(["events-receiving-desktop.png"]);
    expect(sceneFrames("prep")).toEqual(["events-prep-desktop.png"]);
  });
});

describe("review fixes (motion designer + caterer, 2026-10-05)", () => {
  it("says the deposit link is a card payment", () => {
    expect(captionsFor("agreement", manifest).join(" ")).toMatch(
      /pays by card from the link/,
    );
  });
  it("never runs the same frames twice in a row without something new on them", () => {
    for (const id of SCENE_ORDER) {
      FILM[id].beats.forEach((b, i) => {
        const prev = FILM[id].beats[i - 1];
        if (prev && prev.frames.join() === b.frames.join())
          expect(b.ring ?? b.focus).toBeTruthy();
      });
    }
  });
  it("ends on the price it was quoted at, then the end card, until the closeout is shot", () => {
    // The closeout opens the day after the event (Dec 28); until then the
    // film closes on the Menu & service frame it priced the job on.
    expect(sceneFrames("close")).toEqual(["events-menu-desktop.png"]);
    expect(FILM.close.beats[FILM.close.beats.length - 1].layout).toBe("end");
  });
  it("gives every caption time to be read (at most 3.2 words a second once it shows)", () => {
    for (const id of SCENE_ORDER) {
      for (const b of FILM[id].beats) {
        if (!b.caption) continue;
        const words = resolveCaption(b.caption, manifest).split(/\s+/).length;
        expect(
          words / (b.to - b.from - 0.5),
          `${id}: ${b.caption}`,
        ).toBeLessThanOrEqual(3.2);
      }
    }
  });
  it("carries the title card's words in the table", () => {
    expect(TITLE).toBe("Know what the job makes before you cook it.");
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
