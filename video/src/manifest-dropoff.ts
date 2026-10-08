import { z } from "zod";

// The office lunch's capture record (scripts/capture-film.mjs with FILM=dropoff,
// public/proof/film-dropoff/manifest.json), plus the end card's price and trial
// from the landing's src/lib/site.ts. Every figure is the string the app
// printed: the money tab of the paid order, the pack list, the closeout card.
export const DropoffManifestSchema = z.object({
  guests: z.string().regex(/^\d+$/),
  // What the client paid by card, the whole order up front.
  paid: z.string().min(1),
  quoted: z.string().min(1),
  // The order's food cost as its price card prints it: with misc. The closeout
  // share leaves misc out, so a caption never sets one against the other.
  foodCostWithMisc: z.string().min(1),
  targetPct: z.string().min(1),
  packsToBuy: z.string().min(1),
  mainPortions: z.string().regex(/^\d+$/),
  vegetarianPortions: z.string().regex(/^\d+$/),
  closeoutPlanned: z.string().min(1),
  closeoutActual: z.string().min(1),
  closeoutOver: z.string().min(1),
  closeoutDirection: z.enum(["over", "under"]),
  closeoutPct: z.string().min(1),
  // Recorded and the review closed: the share carries no "(likely)".
  closeoutFinal: z.literal(true),
  displayPrice: z.string().min(1),
  trialDays: z.string().min(1),
  appSha: z.string().min(7),
  capturedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  frames: z.array(z.string().regex(/\.png$/)),
  frameSources: z.record(
    z.string(),
    z.object({ host: z.string().min(1), app: z.string().min(1) }),
  ),
});

export type DropoffManifest = z.infer<typeof DropoffManifestSchema>;
