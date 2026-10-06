import type { Manifest } from "./manifest";

// The film reads its own capture run (scripts/capture-film.mjs: one wedding,
// local develop for the kitchen half, test.app.costcook.io for the agreement,
// deposit and booking), which the homepage can reuse. This maps that run's frame ids
// and manifest onto the film's names. A frame the run has not shot is absent,
// and the render guard reports it.
// Considered Adapter; not used because there is one source and one target and
// the translation is a table plus one function.

export const FRAME_MAP: Record<string, string> = {
  "inquiry-mobile.png": "events-inquiry-mobile.png",
  "menu-service.png": "events-menu-desktop.png",
  "proposal-sent-desktop.png": "events-proposal-sent-desktop.png",
  "proposal-mobile.png": "events-offer-mobile.png",
  "agreement-desktop.png": "events-agreement-desktop.png",
  "payment-request-desktop.png": "events-payment-request-desktop.png",
  "pay-mobile.png": "events-pay-mobile.png",
  "payments-paid-desktop.png": "events-payments-paid-desktop.png",
  "book-event-desktop.png": "events-book-event-desktop.png",
  "booked-desktop.png": "events-booked-desktop.png",
  "shop-desktop.png": "events-shop-desktop.png",
  "confirm-desktop.png": "events-confirm-desktop.png",
  "po-desktop.png": "events-po-desktop.png",
  "receiving-desktop.png": "events-receiving-desktop.png",
  "prep-desktop.png": "events-prep-desktop.png",
  "pack-desktop.png": "events-pack-desktop.png",
};

const FIGURES = [
  "guests",
  "pricePerGuest",
  "proposalFoodCostPct",
  "targetPct",
  "deposit",
  "revenue",
  "appSha",
  "capturedOn",
] as const;

export function toFilmManifest(
  shared: Record<string, unknown>,
  site: { displayPrice: string; trialDays: string },
  copied: string[],
): Manifest {
  const missing = FIGURES.filter(
    (k) => typeof shared[k] !== "string" || shared[k] === "",
  );
  if (missing.length)
    throw new Error(`shared manifest lacks ${missing.join(", ")}`);
  const s = shared as Record<(typeof FIGURES)[number], string>;
  return {
    guests: s.guests,
    pricePerGuest: s.pricePerGuest,
    foodCostPct:
      typeof shared.foodCostPct === "string"
        ? shared.foodCostPct
        : s.proposalFoodCostPct,
    proposalFoodCostPct: s.proposalFoodCostPct,
    target: s.targetPct,
    deposit: s.deposit,
    revenue: s.revenue,
    displayPrice: site.displayPrice,
    trialDays: site.trialDays,
    developCommit: s.appSha,
    capturedOn: s.capturedOn,
    frames: copied,
  };
}
