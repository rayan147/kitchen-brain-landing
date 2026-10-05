import { z } from "zod";

// Every figure is the exact string the app printed, read by the capture run
// from the element it photographed. Nothing here is typed by hand.
export const ManifestSchema = z.object({
  guests: z.string().min(1),
  pricePerGuest: z.string().min(1),
  foodCostPct: z.string().min(1),
  deposit: z.string().min(1),
  revenue: z.string().min(1),
  displayPrice: z.string().min(1),
  trialDays: z.string().min(1),
  developCommit: z.string().min(7),
  capturedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type Manifest = z.infer<typeof ManifestSchema>;
