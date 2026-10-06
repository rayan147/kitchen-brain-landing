import type { Manifest } from "./manifest";

// story: docs/stories/promo-video.story.md
// The film follows develop's own event workflow (src/lib/events/derive.ts):
// Inquiry, Menu & service (where the job is priced), Proposal and Client
// decision, what Book the event still needs, Agreement and deposit, then
// kitchen planning and Confirm order. One table drives the scenes, their
// timing and the WebVTT file, so the three cannot drift apart.
// Considered Template Method for scenes; not used because every scene is the
// same shape (a chapter card, then timed beats), which is data, not behaviour.

export const SCENE_ORDER = [
  "coldOpen",
  "menu",
  "decision",
  "agreement",
  "kitchen",
  "receive",
  "prep",
  "pack",
  "close",
] as const;
export type SceneId = (typeof SCENE_ORDER)[number];

export const TITLE = "Know what the job makes before you cook it.";

// Percent of the frame box. `focus` pushes the camera toward (x, y) up to
// `scale`; `ring` circles what the caption names.
export type Ring = { x: number; y: number; width: number; height: number };
export type Focus = { x: number; y: number; scale: number };

// A beat is one stretch of screen time, in seconds from the scene's start.
// "screen": one desktop frame. "phone": one phone frame, placed where the
// split screen puts it. "split": desktop left, phone right. "title" and "end"
// are the film's two cards.
export type Beat = {
  from: number;
  to: number;
  layout: "screen" | "phone" | "split" | "title" | "end";
  frames: string[];
  caption?: string;
  ring?: Ring;
  focus?: Focus;
  scroll?: [number, number];
};

type Scene = { chapter: string | null; seconds: number; beats: Beat[] };

// Long enough for the longest question (12 words) at 4 words a second after
// its half-second fade-in.
export const CHAPTER_SECONDS = 3.5;

// Rings and focus points are first placements, read off the review stills;
// they are tuned against the final captures.
export const FILM: Record<SceneId, Scene> = {
  coldOpen: {
    chapter: null,
    seconds: 7,
    beats: [
      { from: 0, to: 3, layout: "title", frames: [] },
      {
        from: 3,
        to: 7,
        layout: "phone",
        frames: ["events-inquiry-mobile.png"],
        caption: "A wedding. About {guests} guests. No date yet.",
        scroll: [0, 45],
      },
    ],
  },
  // Develop prints the price, food cost and target on the event's step 2,
  // Menu & service, so that is where the job is priced.
  menu: {
    chapter: "What do I charge a head?",
    seconds: 13.5,
    beats: [
      {
        from: 3.5,
        to: 8.5,
        layout: "screen",
        frames: ["events-menu-desktop.png"],
        caption: "{pricePerGuest} a guest. Food cost {proposalFoodCostPct}.",
        focus: { x: 22, y: 50, scale: 1.1 },
        ring: { x: 18, y: 49, width: 48, height: 14 },
      },
      {
        from: 8.5,
        to: 13.5,
        layout: "screen",
        frames: ["events-menu-desktop.png"],
        caption: "Under your {target} target. You know it before you send.",
        focus: { x: 22, y: 50, scale: 1.1 },
        ring: { x: 70, y: 66, width: 29, height: 8 },
      },
    ],
  },
  decision: {
    chapter: "Can she say yes from her phone?",
    seconds: 12.5,
    beats: [
      {
        from: 3.5,
        to: 8,
        layout: "split",
        frames: ["events-proposal-sent-desktop.png", "events-offer-mobile.png"],
        caption: "The proposal goes to her phone. No login.",
        focus: { x: 4, y: 55, scale: 1.25 },
        scroll: [0, 100],
      },
      {
        from: 8,
        to: 12.5,
        layout: "split",
        frames: ["events-proposal-sent-desktop.png", "events-offer-mobile.png"],
        caption: "Accept proposal, or Ask for changes. Her call.",
        focus: { x: 4, y: 55, scale: 1.25 },
        ring: { x: 1, y: 91, width: 98, height: 8 },
        scroll: [100, 100],
      },
    ],
  },
  // Shot on test.app.costcook.io, where DocuSeal and Stripe test mode are set
  // up: the agreement out for signature, the card deposit asked and paid, then
  // Book the event once everything it asks for is in (booking-requirements.ts).
  agreement: {
    chapter: "Signed, and deposit paid?",
    seconds: 21.5,
    beats: [
      {
        from: 3.5,
        to: 7,
        layout: "screen",
        frames: ["events-agreement-desktop.png"],
        caption: "Built from the offer she accepted. She signs online.",
      },
      {
        from: 7,
        to: 9.5,
        layout: "screen",
        frames: ["events-payment-request-desktop.png"],
        caption: "Ask for {deposit}.",
      },
      {
        from: 9.5,
        to: 12.5,
        layout: "screen",
        frames: ["events-pay-mobile.png"],
        caption: "She pays by card from the link.",
      },
      {
        from: 12.5,
        to: 15.5,
        layout: "screen",
        frames: ["events-payments-paid-desktop.png"],
        caption: "Paid. The balance reminder sends itself.",
      },
      {
        from: 15.5,
        to: 19.5,
        layout: "screen",
        frames: ["events-book-event-desktop.png"],
        caption: "Her yes is not a booking. Signed and paid is.",
      },
      {
        from: 19.5,
        to: 21.5,
        layout: "screen",
        frames: ["events-booked-desktop.png"],
        caption: "Booked.",
      },
    ],
  },
  kitchen: {
    chapter: "How much do I buy so I\u2019m not short at 5\u00a0a.m.?",
    seconds: 17.5,
    beats: [
      {
        from: 3.5,
        to: 9,
        layout: "screen",
        frames: ["events-shop-desktop.png"],
        caption: "Whole packs, by supplier, for {guests}.",
        ring: { x: 58, y: 23, width: 14, height: 8 },
      },
      {
        from: 9,
        to: 13,
        layout: "screen",
        frames: ["events-confirm-desktop.png"],
        caption: "Confirm when the plan is ready. Prices and quantities lock.",
        ring: { x: 73, y: 60, width: 19, height: 17 },
      },
      {
        from: 13,
        to: 17.5,
        layout: "screen",
        frames: ["events-po-desktop.png"],
        caption: "Each supplier gets only its own lines.",
      },
    ],
  },
  // After the plan is confirmed: the delivery (/orders/<id>/receiving), the
  // prep list (/orders/<id>/prep), then the van (/orders/<id>/pack).
  receive: {
    chapter: "Did it all come off the truck?",
    seconds: 9.5,
    beats: [
      {
        from: 3.5,
        to: 9.5,
        layout: "screen",
        frames: ["events-receiving-desktop.png"],
        caption:
          "Tick off the delivery. Anything short stays under Still to get.",
      },
    ],
  },
  prep: {
    chapter: "What does the crew start on at 5\u00a0a.m.?",
    seconds: 9.5,
    beats: [
      {
        from: 3.5,
        to: 9.5,
        layout: "screen",
        frames: ["events-prep-desktop.png"],
        caption:
          "The prep list for {guests}, in the order the kitchen works it.",
      },
    ],
  },
  pack: {
    chapter: "Is everything in the van?",
    seconds: 8.5,
    beats: [
      {
        from: 3.5,
        to: 8.5,
        layout: "screen",
        frames: ["events-pack-desktop.png"],
        caption: "Tick each dish as it goes into the van.",
      },
    ],
  },
  // The closeout opens the day after the event and says "likely" until the
  // kitchen records what it used, so the caption says it too. The menu frame
  // is not replayed here: its Event totals round the planned food cost per
  // guest ($4,039.50), a few cents off the closeout's own planned figure.
  close: {
    chapter: null,
    seconds: 11,
    beats: [
      {
        from: 0,
        to: 6,
        layout: "screen",
        frames: ["events-closeout-desktop.png"],
        caption:
          "Priced before her yes. Checked the day after: likely {actualFoodCost} against {plannedFoodCost} planned.",
        ring: { x: 2, y: 57, width: 44, height: 11 },
      },
      { from: 6, to: 11, layout: "end", frames: [] },
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

/**
 * The camera scale a beat starts from: where the previous beat left it when
 * both show the same frames (each beat is its own Sequence, so otherwise the
 * zoom snaps back to 1 at the cut), else 1.
 */
export function cameraStart(scene: SceneId, index: number): number {
  const beats = FILM[scene].beats;
  const prev = beats[index - 1];
  if (!prev?.focus) return 1;
  return prev.frames.join() === beats[index].frames.join()
    ? prev.focus.scale
    : 1;
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
