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
  // The food-cost closeout, the day after the event: what the plan said the
  // food would cost and what was paid, both off the closeout's own card.
  plannedFoodCost: z.string().min(1),
  actualFoodCost: z.string().min(1),
  displayPrice: z.string().min(1),
  trialDays: z.string().min(1),
  developCommit: z.string().min(7),
  capturedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  frames: z.array(z.string().regex(/\.png$/)),
});

export type Manifest = z.infer<typeof ManifestSchema>;
