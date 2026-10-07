import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadInstrumentSans } from "@remotion/google-fonts/InstrumentSans";

// Fraunces carries the chapter questions (italic) and the end-card wordmark
// (upright); both styles share one family name.
loadFraunces("italic", { weights: ["400"], subsets: ["latin"] });
export const { fontFamily: FONT_DISPLAY } = loadFraunces("normal", {
  weights: ["400", "600"],
  subsets: ["latin"],
});
export const { fontFamily: FONT_BODY } = loadInstrumentSans("normal", {
  weights: ["400", "600"],
  subsets: ["latin"],
});
