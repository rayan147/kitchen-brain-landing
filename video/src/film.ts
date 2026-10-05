import type { Manifest } from "./manifest";

// story: docs/stories/promo-video.story.md
// Considered Template Method for scenes (a shared chapter card, screen and
// caption skeleton); not used because React composition already shares that
// shell and each scene's motion differs. Captions vary as data, so they are a
// table, and every figure in them is a {token} filled from the manifest.

export type SceneId =
  | "coldOpen"
  | "charge"
  | "proposal"
  | "deposit"
  | "buy"
  | "invoices"
  | "close";

type Scene = { chapter: string | null; frames: string[]; captions: string[] };

export const FILM: Record<SceneId, Scene> = {
  coldOpen: {
    chapter: null,
    frames: ["events-inquiry-mobile.png"],
    captions: ["A wedding. About {guests} guests. No date yet."],
  },
  charge: {
    chapter: "What do I charge a head?",
    frames: ["events-pricing-desktop.png"],
    captions: [
      "{pricePerGuest} a guest. Food cost {foodCostPct}. You see it before you quote.",
    ],
  },
  proposal: {
    chapter: "Will she say yes without a meeting?",
    frames: ["events-proposal-sent-desktop.png", "events-offer-mobile.png"],
    captions: [
      "The proposal goes to her phone. No login.",
      "Accept proposal, or Ask for changes. Her call.",
    ],
  },
  deposit: {
    chapter: "How do I get the deposit without chasing anyone?",
    frames: [
      "events-payment-request-desktop.png",
      "events-pay-mobile.png",
      "events-payments-paid-desktop.png",
      "events-balance-reminder-email.png",
      "events-confirm-desktop.png",
    ],
    captions: [
      "Request {deposit} by email. She pays from the link on her phone.",
      "On the day the balance is due, the reminder goes out for you.",
      "Her yes is not a booking. Confirm order is.",
      "Prices and quantities freeze.",
    ],
  },
  buy: {
    chapter: "How much do I buy so I'm not short at 5 a.m.?",
    frames: ["events-shop-desktop.png"],
    captions: ["Whole packs, by supplier, for {guests}."],
  },
  invoices: {
    chapter: "Do I have to type in every invoice?",
    frames: ["events-import-review-desktop.png"],
    captions: ["Upload it. Confirm what it read. Type what it could not."],
  },
  close: {
    chapter: null,
    frames: ["events-pricing-desktop.png"],
    captions: [
      "{pricePerGuest} a guest. {foodCostPct} food cost. Known before the call ended.",
    ],
  },
};

export function resolveCaption(template: string, manifest: Manifest): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = (manifest as Record<string, string | undefined>)[key];
    if (value === undefined) throw new Error(`unresolved token {${key}}`);
    return value;
  });
}

export function captionsFor(scene: SceneId, manifest: Manifest): string[] {
  return FILM[scene].captions.map((c) => resolveCaption(c, manifest));
}
