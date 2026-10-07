import { z } from "zod";

// Every figure is the exact string the app printed, read by the capture run
// from the element it photographed. `frames` lists the files that run shot
// from the app: the render guard refuses any frame not on it, so nothing
// mocked, drawn or left over from an older build reaches the film.
export const ManifestSchema = z.object({
  guests: z.string().min(1),
  pricePerGuest: z.string().min(1),
  // The order page's figure, and the proposal builder's: the app can print
  // them a tenth apart for the same wedding, and a caption quotes the one on
  // its own frame.
  foodCostPct: z.string().min(1),
  proposalFoodCostPct: z.string().min(1),
  target: z.string().min(1),
  deposit: z.string().min(1),
  revenue: z.string().min(1),
  // The offer's total before tax, food plus staff, rentals and the service fee.
  offerTotal: z.string().min(1),
  // The food-cost closeout, the day after the event: what the plan said the
  // food would cost and what was paid, both off the closeout's own card.
  plannedFoodCost: z.string().min(1),
  actualFoodCost: z.string().min(1),
  // The closeout's "Food cost, share of the event price", once the kitchen's
  // use is recorded and the review closed, so it carries no "(likely)".
  dayAfterShare: z.string().min(1),
  // Counts the captions name, off the pack list (plates per dish) and the
  // offer's staff line as entered (people and hours make its "56 × $38.00").
  mainPortions: z.string().regex(/^\d+$/),
  vegetarianPortions: z.string().regex(/^\d+$/),
  staffPeople: z.string().regex(/^\d+$/),
  staffHours: z.string().regex(/^\d+$/),
  displayPrice: z.string().min(1),
  trialDays: z.string().min(1),
  developCommit: z.string().min(7),
  capturedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  frames: z.array(z.string().regex(/\.png$/)),
  // Where each frame came from: one walk on test, its storefront and pay page
  // on the ordering site, and the closeout on a local copy, so one host
  // cannot speak for all of them.
  frameSources: z.record(
    z.string(),
    z.object({ host: z.string().min(1), app: z.string().min(1) }),
  ),
});

export type Manifest = z.infer<typeof ManifestSchema>;
