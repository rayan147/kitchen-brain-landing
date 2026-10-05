import type { Manifest } from "./manifest";

// The film reads the homepage redesign's capture run (one wedding, one set of
// frames for both, shot from the develop app). This maps that run's frame ids
// and manifest onto the film's names. A frame the run has not shot is absent,
// and the render guard reports it.
// Considered Adapter; not used because there is one source and one target and
// the translation is a table plus one function.

export const FRAME_MAP: Record<string, string> = {
  "inquiry-mobile.png": "events-inquiry-mobile.png",
  "menu-service.png": "events-menu-desktop.png",
  "proposal-sent-desktop.png": "events-proposal-sent-desktop.png",
  "proposal-mobile.png": "events-offer-mobile.png",
  "agreement.png": "events-agreement-desktop.png",
  "payment-request.png": "events-payment-request-desktop.png",
  "pay-mobile.png": "events-pay-mobile.png",
  "book-event.png": "events-book-event-desktop.png",
  "shop-list.png": "events-shop-desktop.png",
  "confirm-dialog.png": "events-confirm-desktop.png",
  "receiving.png": "events-receiving-desktop.png",
  "prep-list.png": "events-prep-desktop.png",
};

const FIGURES = [
  "guests",
  "pricePerGuest",
  "foodCostPct",
  "foodCostPctProposalBuilder",
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
    foodCostPct: s.foodCostPct,
    proposalFoodCostPct: s.foodCostPctProposalBuilder,
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
