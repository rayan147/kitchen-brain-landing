import { z } from "zod";

// The Sage film's capture record (scripts/capture-sage-film.mjs,
// public/proof/film-sage/manifest.json), plus the end card's price and trial
// from the landing's src/lib/site.ts. The allowance figures are the strings the
// app printed (the panel's note, the billing line) or read from its config at
// the captured commit; the film never types its own "2,000".
const credits = z.string().regex(/^\d{1,3}(,\d{3})*$/);
export const SageManifestSchema = z.object({
  allowanceNote: z.string().startsWith("Sage has used "),
  billingLine: z.string().startsWith("Sage: "),
  used: credits,
  periodCredits: credits,
  trialCredits: credits,
  resetsOn: z.string().min(1),
  answerCost: z.string().regex(/^\$\d+\.\d{2}$/),
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

export type SageManifest = z.infer<typeof SageManifestSchema>;
