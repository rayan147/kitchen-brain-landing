import type { Manifest } from "./manifest";

// story: docs/stories/promo-video.story.md
// The film follows develop's own event workflow (src/lib/events/derive.ts):
// Inquiry, Menu & service, Proposal, Client decision, Agreement, Booked, then
// kitchen planning and Confirm order. One table drives the scenes, their
// timing and the WebVTT file, so the three cannot drift apart.
// Considered Template Method for scenes; not used because every scene is the
// same shape (a chapter card, then timed beats), which is data, not behaviour.

export const SCENE_ORDER = [
  "coldOpen",
  "menu",
  "proposal",
  "decision",
  "agreement",
  "book",
  "kitchen",
  "close",
] as const;
export type SceneId = (typeof SCENE_ORDER)[number];

export type Ring = { x: number; y: number; width: number; height: number };

// A beat is one stretch of screen time, in seconds from the scene's start.
// "screen": one desktop frame. "phone": one phone frame. "split": desktop
// left, phone right. "title" and "end" are the film's two cards.
export type Beat = {
  from: number;
  to: number;
  layout: "screen" | "phone" | "split" | "title" | "end";
  frames: string[];
  caption?: string;
  ring?: Ring;
  scroll?: [number, number];
};

type Scene = { chapter: string | null; seconds: number; beats: Beat[] };

export const CHAPTER_SECONDS = 2;

export const FILM: Record<SceneId, Scene> = {
  coldOpen: {
    chapter: null,
    seconds: 6,
    beats: [
      { from: 0, to: 2, layout: "title", frames: [] },
      {
        from: 2,
        to: 6,
        layout: "phone",
        frames: ["events-inquiry-mobile.png"],
        caption: "A wedding. About {guests} guests. No date yet.",
        scroll: [0, 45],
      },
    ],
  },
  menu: {
    chapter: "What are we serving, and how?",
    seconds: 10,
    beats: [
      {
        from: 2,
        to: 10,
        layout: "screen",
        frames: ["events-menu-desktop.png"],
        caption:
          "Pick the menu and the service. That is the scope of the proposal.",
      },
    ],
  },
  proposal: {
    chapter: "What do I charge a head?",
    seconds: 14,
    beats: [
      {
        from: 2,
        to: 14,
        layout: "screen",
        frames: ["events-proposal-pricing-desktop.png"],
        caption:
          "{pricePerGuest} a guest. Food cost {foodCostPct} against your {target} target. You see it before you send.",
      },
    ],
  },
  decision: {
    chapter: "Will she say yes without a meeting?",
    seconds: 16,
    beats: [
      {
        from: 2,
        to: 9,
        layout: "split",
        frames: ["events-proposal-sent-desktop.png", "events-offer-mobile.png"],
        caption: "The proposal goes to her phone. No login.",
      },
      {
        from: 9,
        to: 16,
        layout: "split",
        frames: ["events-proposal-sent-desktop.png", "events-offer-mobile.png"],
        caption: "Accept proposal, or Ask for changes. Her call.",
        scroll: [0, 100],
      },
    ],
  },
  agreement: {
    chapter: "How do I get it in writing, and the deposit?",
    seconds: 16,
    beats: [
      {
        from: 2,
        to: 8,
        layout: "screen",
        frames: ["events-agreement-desktop.png"],
        caption:
          "The agreement comes from the offer she accepted. It goes out for her signature.",
      },
      {
        from: 8,
        to: 16,
        layout: "split",
        frames: ["events-payment-request-desktop.png", "events-pay-mobile.png"],
        caption:
          "Request the {deposit} deposit by email. She pays from the link.",
      },
    ],
  },
  book: {
    chapter: null,
    seconds: 10,
    beats: [
      {
        from: 0,
        to: 10,
        layout: "screen",
        frames: ["events-book-event-desktop.png"],
        caption:
          "Her yes is not a booking. Signed, paid and a day with room is.",
      },
    ],
  },
  kitchen: {
    chapter: "How much do I buy so I'm not short at 5 a.m.?",
    seconds: 14,
    beats: [
      {
        from: 2,
        to: 9,
        layout: "screen",
        frames: ["events-shop-desktop.png"],
        caption: "Whole packs, by supplier, for {guests}.",
      },
      {
        from: 9,
        to: 14,
        layout: "screen",
        frames: ["events-confirm-desktop.png"],
        caption:
          "Confirm the order when the plan is ready. Prices and quantities freeze.",
      },
    ],
  },
  close: {
    chapter: null,
    seconds: 14,
    beats: [
      {
        from: 0,
        to: 10,
        layout: "screen",
        frames: ["events-proposal-pricing-desktop.png"],
        caption:
          "{pricePerGuest} a guest. {foodCostPct} food cost. Known before she said yes.",
      },
      { from: 10, to: 14, layout: "end", frames: [] },
    ],
  },
};

export function resolveCaption(template: string, manifest: Manifest): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = (manifest as unknown as Record<string, unknown>)[key];
    if (typeof value !== "string") throw new Error(`unresolved token {${key}}`);
    return value;
  });
}

export function captionsFor(scene: SceneId, manifest: Manifest): string[] {
  return FILM[scene].beats.flatMap((b) =>
    b.caption ? [resolveCaption(b.caption, manifest)] : [],
  );
}

export function sceneFrames(scene: SceneId): string[] {
  return [...new Set(FILM[scene].beats.flatMap((b) => b.frames))];
}

export const FPS = 30;
export const FADE_FRAMES = 15;

/** Start of each scene in seconds, with the fades between scenes overlapping. */
export function sceneStarts(): Record<SceneId, number> {
  let t = 0;
  const starts = {} as Record<SceneId, number>;
  for (const id of SCENE_ORDER) {
    starts[id] = t;
    t += FILM[id].seconds - FADE_FRAMES / FPS;
  }
  return starts;
}

export function filmFrames(): number {
  const total = SCENE_ORDER.reduce((n, id) => n + FILM[id].seconds * FPS, 0);
  return total - (SCENE_ORDER.length - 1) * FADE_FRAMES;
}
