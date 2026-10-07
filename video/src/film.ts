import type { Manifest } from "./manifest";

// story: docs/stories/promo-video.story.md
// The film follows develop's own event workflow (src/lib/events/derive.ts):
// Inquiry (here, a request from the kitchen's ordering site), Menu & service
// (where the job is priced), Proposal and Client decision, Agreement and
// deposit, Book the event, then kitchen planning and Confirm order. One table drives the scenes, their
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
  // Where the caption sits: at the bottom unless what it names is there.
  captionAt?: "top";
};

type Scene = { chapter: string | null; seconds: number; beats: Beat[] };

// Long enough for the longest question (12 words) at 4 words a second after
// its half-second fade-in.
export const CHAPTER_SECONDS = 3.5;

// Rings and focus points are measured off the frames of the 2026-10-07 walk
// (percent of each frame's box); retune them whenever a frame is re-shot.
export const FILM: Record<SceneId, Scene> = {
  // She asks on the kitchen's ordering site; it lands as an inquiry.
  coldOpen: {
    chapter: null,
    seconds: 11.5,
    beats: [
      { from: 0, to: 2.5, layout: "title", frames: [] },
      {
        from: 2.5,
        to: 7,
        layout: "phone",
        frames: ["events-request-mobile.png"],
        caption:
          "She asks on your site. A Saturday in June, {guests} guests, plated.",
        scroll: [0, 60],
      },
      {
        from: 7,
        to: 11.5,
        layout: "screen",
        frames: ["events-inquiry-desktop.png"],
        caption: "It lands as an inquiry. Nothing to retype.",
        ring: { x: 3, y: 2, width: 40, height: 7 },
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
        ring: { x: 17, y: 50, width: 39, height: 19 },
      },
      {
        from: 8.5,
        to: 13.5,
        layout: "screen",
        frames: ["events-menu-desktop.png"],
        caption: "Under your {target} target. You know it before you send.",
        focus: { x: 80, y: 60, scale: 1.15 },
        ring: { x: 67, y: 70, width: 28, height: 10 },
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
        layout: "phone",
        frames: ["events-offer-mobile.png"],
        caption: "The offer reaches her phone: {offerTotal} for the day.",
        scroll: [0, 100],
      },
      {
        from: 8,
        to: 12.5,
        layout: "phone",
        frames: ["events-offer-mobile.png"],
        caption: "Accept, or ask for changes. Her call.",
        ring: { x: 1, y: 93, width: 98, height: 6 },
        scroll: [100, 100],
      },
    ],
  },
  // The agreement out for signature, the card deposit asked and paid, then
  // Book the event once everything it asks for is in (booking-requirements.ts).
  agreement: {
    chapter: "Signed, and deposit paid?",
    seconds: 21,
    beats: [
      {
        from: 3.5,
        to: 7,
        layout: "screen",
        frames: ["events-agreement-desktop.png"],
        caption: "Built from the offer she accepted. She signs online.",
        ring: { x: 52, y: 45, width: 19, height: 6.5 },
      },
      {
        from: 7,
        to: 11,
        layout: "split",
        frames: ["events-payment-request-desktop.png", "events-pay-mobile.png"],
        caption: "Ask for {deposit}. She pays by card from the link.",
        focus: { x: 0, y: 50, scale: 2.2 },
      },
      {
        from: 11,
        to: 14.5,
        layout: "screen",
        frames: ["events-payments-paid-desktop.png"],
        caption: "Paid. The balance reminder goes out ten days before.",
        ring: { x: 11, y: 57, width: 48, height: 8 },
      },
      {
        from: 14.5,
        to: 18.5,
        layout: "screen",
        frames: ["events-book-event-desktop.png"],
        caption: "Her yes is not a booking. Signed and paid is.",
        // Pulled back a touch, so the strip and its ring clear the frame edge.
        focus: { x: 50, y: 50, scale: 0.95 },
        ring: { x: 1.5, y: 63, width: 22, height: 28 },
      },
      {
        from: 18.5,
        to: 21,
        layout: "screen",
        frames: ["events-booked-desktop.png"],
        caption: "Booked.",
      },
    ],
  },
  kitchen: {
    chapter: "How much do I order so I\u2019m not short?",
    seconds: 17.5,
    beats: [
      {
        from: 3.5,
        to: 9,
        layout: "screen",
        frames: ["events-shop-desktop.png"],
        caption: "Whole packs, by supplier, for {guests}.",
        ring: { x: 62, y: 23, width: 18, height: 8 },
      },
      {
        from: 9,
        to: 13,
        layout: "screen",
        frames: ["events-confirm-desktop.png"],
        caption: "Final count in. Confirm, and prices and quantities lock.",
        ring: { x: 74, y: 62, width: 21, height: 27 },
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
          "Check in the trucks. Anything short stays under Still to get.",
        // Pushes in from below the bottom left corner, so Still to get rises
        // clear of the caption.
        focus: { x: 0, y: 130, scale: 1.6 },
        ring: { x: 1.5, y: 68, width: 60, height: 14 },
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
        ring: { x: 6, y: 30.5, width: 23, height: 7 },
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
        caption: "Tick each dish into the van. Allergens print on the label.",
        ring: { x: 12, y: 46.5, width: 21, height: 4.5 },
      },
    ],
  },
  // The closeout opens the day after the event and says "likely" until the
  // kitchen records what it used. Its dollar gap sets a plan that counts 2%
  // misc against purchases that do not (an app defect, reported), so the
  // payoff is the likely share of the price, against the target set at the
  // start.
  close: {
    chapter: null,
    seconds: 12,
    beats: [
      {
        from: 0,
        to: 7,
        layout: "screen",
        frames: ["events-closeout-desktop.png"],
        caption:
          "Priced at {proposalFoodCostPct} before her yes. The day after: likely still {likelyShare}, under your {target} target.",
        // From the bottom right corner, so the ringed share rises to the middle
        // and leads; the caption sits on top, off the card's figures.
        focus: { x: 100, y: 85, scale: 1.6 },
        captionAt: "top",
        ring: { x: 72, y: 72, width: 25, height: 26 },
      },
      { from: 7, to: 12, layout: "end", frames: [] },
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

/**
 * Where the camera's origin starts: the previous beat's focus point when both
 * show the same frames, so carrying the scale over does not also snap the
 * origin (which shifts the page sideways at the cut), else null.
 */
export function cameraOrigin(
  scene: SceneId,
  index: number,
): { x: number; y: number } | null {
  const beats = FILM[scene].beats;
  const prev = beats[index - 1];
  if (!prev?.focus || prev.frames.join() !== beats[index].frames.join())
    return null;
  return { x: prev.focus.x, y: prev.focus.y };
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

/**
 * The frames over which a chapter card's question fades up: after the scene
 * fade that brings the card in, so the outgoing screen and the question never
 * share the screen, then over half a second.
 */
export function questionFadeFrames(fps: number): [number, number] {
  return [FADE_FRAMES, FADE_FRAMES + Math.round(0.5 * fps)];
}
