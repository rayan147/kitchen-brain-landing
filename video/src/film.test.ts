import { describe, expect, it } from "vitest";
import {
  CHAPTER_SECONDS,
  FILM,
  SCENE_ORDER,
  TITLE,
  FADE_FRAMES,
  cameraOrigin,
  cameraStart,
  questionFadeFrames,
  captionsFor,
  resolveCaption,
  sceneFrames,
} from "./film";
import { ManifestSchema, type Manifest } from "./manifest";

const manifest: Manifest = {
  guests: "150",
  pricePerGuest: "$95.00",
  foodCostPct: "26.3%",
  proposalFoodCostPct: "25.8%",
  target: "30%",
  deposit: "$5,250.00",
  revenue: "$14,250.00",
  offerTotal: "$21,043.00",
  plannedFoodCost: "$3,750.87",
  actualFoodCost: "$3,675.88",
  dayAfterShare: "25.8%",
  mainPortions: "138",
  vegetarianPortions: "12",
  staffPeople: "8",
  staffHours: "7",
  displayPrice: "$49/month",
  trialDays: "15",
  developCommit: "e00299078",
  capturedOn: "2026-10-05",
  frames: [],
  frameSources: {},
};

describe("resolveCaption", () => {
  it("inserts the on-screen string verbatim", () => {
    expect(resolveCaption("Food cost {foodCostPct}.", manifest)).toBe(
      "Food cost 26.3%.",
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
    expect(captionsFor("menu", manifest).join(" ")).toContain("25.8%");
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
      "A yes is not a booking. Signed and paid is.",
    );
    const all = SCENE_ORDER.flatMap((id) => captionsFor(id, manifest)).join(
      "\n",
    );
    expect(all).not.toMatch(/Confirm order is/);
  });
  // The pay page is a phone capture (390 px at 3x): it plays in the phone,
  // beside the owner's ask for the deposit, not stretched to a desktop frame.
  it("shows the pay page in the phone, beside the ask for the deposit", () => {
    const pay = FILM.agreement.beats.find((b) =>
      b.frames.includes("events-pay-mobile.png"),
    );
    expect(pay?.layout).toBe("split");
    expect(pay?.frames).toEqual([
      "events-payment-request-desktop.png",
      "events-pay-mobile.png",
    ]);
  });
  // The offer frame is taller than the phone: the ring on the Accept bar only
  // lands if that beat holds the page at its bottom, where the bar is.
  it("holds the offer at its bottom while the ring circles the Accept bar", () => {
    const ringed = FILM.decision.beats.find((b) => b.ring);
    expect(ringed?.scroll).toEqual([100, 100]);
    expect(FILM.decision.beats[0].scroll?.[1]).toBe(100);
  });
  // Caterer review 2026-10-06: a food-only total read like a toy. The offer
  // now carries staff, rentals and a service fee, and the caption says so.
  it("quotes the whole offer, staff and rentals in", () => {
    expect(captionsFor("decision", manifest).join(" ")).toContain("$21,043.00");
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
  // The closeout opens the day after the event (Dec 28). The menu frame is not
  // replayed beside it: its Event totals print the planned food cost rounded
  // per guest ($4,039.50), a few cents off the closeout's own $4,039.96.
  it("ends on the closeout the day after the event, then the end card", () => {
    expect(sceneFrames("close")).toEqual(["events-closeout-desktop.png"]);
    expect(FILM.close.beats[FILM.close.beats.length - 1].layout).toBe("end");
  });
  // The card's dollar gap sets a plan that counts 2% misc against purchases
  // that do not (reported as an app defect), so the payoff is the share.
  // Superseded 2026-10-07 (owner): the closeout is now closed with the
  // kitchen's use recorded, so the share is final, not "likely".
  it("ends on the closeout's share of the price, against the target", () => {
    const close = captionsFor("close", manifest).join(" ");
    expect(close).toContain("The day after: 25.8%");
    expect(close).toContain("30%");
    expect(close).not.toContain("$3,675.88");
  });
  it("never quotes the closeout's actual figure without saying likely", () => {
    for (const id of SCENE_ORDER)
      for (const b of FILM[id].beats)
        if (b.caption?.includes("{actualFoodCost}"))
          expect(b.caption).toMatch(/\blikely\b/);
  });
  it("says only what the PO and pack frames show", () => {
    expect(captionsFor("kitchen", manifest)).toContain(
      "Each supplier gets only its own lines.",
    );
    expect(captionsFor("pack", manifest).join(" ")).toMatch(/allergens/i);
  });
  // Each beat is its own Sequence, so a repeated frame would snap the camera
  // back to scale 1 at the cut.
  it("starts the camera where the last beat left it when the frames repeat", () => {
    expect(cameraStart("menu", 0)).toBe(1);
    expect(cameraStart("menu", 1)).toBe(1.1);
    expect(cameraStart("decision", 1)).toBe(1);
    expect(cameraStart("agreement", 1)).toBe(1);
  });
  it("holds each chapter card long enough to read (at most 4 words a second)", () => {
    for (const id of SCENE_ORDER) {
      const chapter = FILM[id].chapter;
      if (!chapter) continue;
      const words = chapter.split(/\s+/).length;
      expect(words / (CHAPTER_SECONDS - 0.5), chapter).toBeLessThanOrEqual(4);
    }
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
    expect(sceneFrames("decision")).toEqual(["events-offer-mobile.png"]);
  });
});

describe("the re-walk (caterer and motion reviews, 2026-10-06)", () => {
  it("opens on her request from the ordering site, then the inquiry it became", () => {
    expect(sceneFrames("coldOpen")).toEqual([
      "events-request-mobile.png",
      "events-inquiry-desktop.png",
    ]);
    expect(captionsFor("coldOpen", manifest).join(" ")).not.toMatch(
      /No date yet/,
    );
  });
  it("asks how much to order without a 5 a.m. in the buying chapter", () => {
    expect(FILM.kitchen.chapter).not.toMatch(/5\u00a0a\.m\.|5 a\.m\./);
  });
  it("ties Confirm to the final count", () => {
    const confirm = FILM.kitchen.beats.find((b) =>
      b.frames.includes("events-confirm-desktop.png"),
    );
    expect(confirm?.caption).toMatch(/final count/i);
  });
  it("rings what each caption names on the frames that carry a figure", () => {
    for (const frame of [
      "events-agreement-desktop.png",
      "events-payments-paid-desktop.png",
      "events-shop-desktop.png",
      "events-confirm-desktop.png",
      "events-receiving-desktop.png",
      "events-pack-desktop.png",
      "events-closeout-desktop.png",
    ]) {
      const beat = SCENE_ORDER.flatMap((id) => FILM[id].beats).find((b) =>
        b.frames.includes(frame),
      );
      expect(beat?.ring, frame).toBeTruthy();
    }
  });
});

describe("chapter cards between scenes", () => {
  // The scene fade overlaps the outgoing screen for FADE_FRAMES; the question
  // waits it out, so the overlap reads as plain paper, never two texts at once.
  it("keeps the question hidden until the scene fade is over", () => {
    const [start, end] = questionFadeFrames(30);
    expect(start).toBe(FADE_FRAMES);
    expect(end).toBe(FADE_FRAMES + 15);
  });
});

describe("second review fixes (2026-10-07)", () => {
  // Motion S1: the scale carried over but the origin snapped, so the page
  // jumped sideways at the cut between the two menu beats.
  it("starts the camera's origin where the last beat left it when the frames repeat", () => {
    expect(cameraOrigin("menu", 0)).toBeNull();
    expect(cameraOrigin("menu", 1)).toEqual({ x: 22, y: 50 });
  });
  // Caterer: staff, rentals and the fee are claimed only now that the offer
  // frame runs down to its total and shows them as lines. Third round: the
  // staff line prints "56 × $38.00", so the caption says what 56 is.
  it("names staff by people and hours, and the rentals", () => {
    expect(captionsFor("decision", manifest).join(" ")).toMatch(
      /8 staff for 7 hours, the rentals/,
    );
  });
  // Caterer: her note asks for something for the vegetarians; the pack beat
  // shows the vegetarian plates and says so.
  it("answers her vegetarian request on the pack list", () => {
    expect(captionsFor("pack", manifest).join(" ")).toMatch(/vegetarian/);
  });
  // Caterer: the day-after share matching the quote is the point, said so.
  it("ties the day-after share back to the price she was quoted", () => {
    expect(captionsFor("close", manifest).join(" ")).toContain(
      "Quoted at 25.8%",
    );
  });
});

describe("closeout caption placement", () => {
  // Motion S3: at the bottom the caption covered the ringed share.
  it("puts the closeout caption on top, off the card's figures", () => {
    expect(FILM.close.beats[0].captionAt).toBe("top");
  });
});

describe("third review fixes (2026-10-07)", () => {
  // Caterer: the agreement frame is re-shot signed, so the caption is past.
  it("says the agreement is signed, as its frame now shows", () => {
    expect(captionsFor("agreement", manifest)[0]).toMatch(/Signed online/);
  });
  // Owner ruling 2026-10-07: the reminder now goes out three days before the
  // due day, and the paid frame says so; the caption names that lead.
  it("names the reminder's three days of notice", () => {
    expect(captionsFor("agreement", manifest).join(" ")).toMatch(
      /reminder three days ahead/,
    );
  });
  // Caterer: the split behind 0.92 portions, on the frame that prints it.
  it("names the 138 / 12 split on the prep list", () => {
    expect(captionsFor("prep", manifest)[0]).toMatch(
      /138 short rib, 12 stuffed peppers/,
    );
  });
  // Caterer: the vegetarian main is called out on her own offer.
  it("points out the vegetarian main on the offer", () => {
    expect(captionsFor("decision", manifest).join(" ")).toMatch(
      /12 vegetarians/,
    );
  });
});

describe("fourth pass (2026-10-07)", () => {
  // Advisor/caterer: counts typed into a caption go stale silently when the
  // wedding is walked again with other numbers; every count is a token.
  it("types no count into a caption; every number comes from the manifest", () => {
    for (const id of SCENE_ORDER) {
      for (const b of FILM[id].beats) {
        if (!b.caption) continue;
        expect(
          b.caption.replace(/\{\w+\}/g, ""),
          `${id}: ${b.caption}`,
        ).not.toMatch(/\d/);
      }
    }
  });
  // Motion: the cut into the Confirm dialog jumped about 4x in scale; the
  // dialog now eases in from a little smaller.
  it("eases into the Confirm dialog from below full size", () => {
    const i = FILM.kitchen.beats.findIndex(
      (b) => b.frames[0] === "events-confirm-desktop.png",
    );
    expect(cameraStart("kitchen", i)).toBeLessThan(1);
  });
});

describe("final closeout (2026-10-07)", () => {
  // Owner: "likely" read as unsure. The walk records what the kitchen used
  // and closes the review, so the card's share is final and the caption
  // states it without a hedge.
  it("states the day-after share without a hedge", () => {
    const close = captionsFor("close", manifest).join(" ");
    expect(close).not.toMatch(/likely/i);
    expect(close).toContain("The day after: 25.8%");
  });
});

describe("the client, not she (2026-10-07)", () => {
  // Owner: "who is a She?" Nobody talks about their own client that way. The
  // film names the client, and the snap line drops the pronoun.
  it("never calls the client she or her, in a caption or a chapter card", () => {
    for (const id of SCENE_ORDER) {
      const scene = FILM[id];
      const lines = [
        scene.chapter ?? "",
        ...scene.beats.map((b) => b.caption ?? ""),
      ];
      for (const line of lines)
        expect(line, `${id}: ${line}`).not.toMatch(/\b(she|her)\b/i);
    }
  });
  it("keeps the snap line, without the pronoun", () => {
    expect(captionsFor("agreement", manifest)).toContain(
      "A yes is not a booking. Signed and paid is.",
    );
  });
});
