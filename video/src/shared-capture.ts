import type { Manifest } from "./manifest";

// The film reads its own capture record (public/proof/film/manifest.json,
// written by scripts/capture-film-local.mjs: the Nair & Castellano wedding, the
// homepage's own, carried forward on local develop). This maps that record's
// frame ids and figures onto the film's names. A frame the record does not
// list is absent, and the render guard reports it.
// Considered Adapter; not used because there is one source and one target and
// the translation is a table plus one function.

export const FRAME_MAP: Record<string, string> = {
  "inquiry-mobile.png": "events-inquiry-mobile.png",
  "menu-service.png": "events-menu-desktop.png",
  "proposal-mobile.png": "events-offer-mobile.png",
  "accepted-mobile.png": "events-accepted-mobile.png",
  "payments-paid-desktop.png": "events-payments-paid-desktop.png",
  "agreement-desktop.png": "events-agreement-desktop.png",
  "book-event-desktop.png": "events-book-event-desktop.png",
  "booked-desktop.png": "events-booked-desktop.png",
  "shop-desktop.png": "events-shop-desktop.png",
  "confirm-desktop.png": "events-confirm-desktop.png",
  "po-desktop.png": "events-po-desktop.png",
  "receiving-desktop.png": "events-receiving-desktop.png",
  "prep-desktop.png": "events-prep-desktop.png",
  "pack-desktop.png": "events-pack-desktop.png",
  "closeout-desktop.png": "events-closeout-desktop.png",
};

const FIGURES = [
  "guests",
  "pricePerGuest",
  "proposalFoodCostPct",
  "targetPct",
  "deposit",
  "revenue",
  "offerTotal",
  "closeoutPlanned",
  "closeoutActual",
  "closeoutPct",
  "balance",
  "balanceDue",
  "mainPortions",
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
    offerTotal: s.offerTotal,
    plannedFoodCost: s.closeoutPlanned,
    actualFoodCost: s.closeoutActual,
    dayAfterShare: s.closeoutPct,
    balance: s.balance,
    balanceDue: s.balanceDue,
    mainPortions: s.mainPortions,
    displayPrice: site.displayPrice,
    trialDays: site.trialDays,
    developCommit: s.appSha,
    capturedOn: s.capturedOn,
    frames: copied,
    frameSources: filmSources(shared.frameSources, copied),
  };
}

const SOURCE_KEY = Object.fromEntries(
  Object.entries(FRAME_MAP).map(([from, to]) => [to, from]),
);

// Each copied frame's host and app, under its film name. A frame with no
// recorded source is left out here and refused by the render guard.
function filmSources(
  sources: unknown,
  copied: string[],
): Manifest["frameSources"] {
  const all = (sources ?? {}) as Record<
    string,
    { host?: unknown; app?: unknown }
  >;
  return Object.fromEntries(
    copied.flatMap((film) => {
      const s = all[SOURCE_KEY[film]];
      return typeof s?.host === "string" && typeof s.app === "string"
        ? [[film, { host: s.host, app: s.app }]]
        : [];
    }),
  );
}
