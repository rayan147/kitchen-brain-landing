---
name: CostCook
description: A quiet, founder-direct marketing system for independent catering kitchens.
colors:
  ink: "#1f2421"
  ink-soft: "#49524c"
  green: "#2f7d5b"
  green-deep: "#256549"
  amber-deep: "#8f5716"
  offwhite: "#f4f6f4"
  softgreen: "#e5f1ea"
  hairline: "#d3ddd6"
  ticket-rule: "#e4d3b4"
  paper: "#fdfefd"
typography:
  display:
    fontFamily: "Fraunces Variable, ui-serif, Georgia, serif"
    fontSize: "clamp(2.125rem, 1.35rem + 2.9vw, 3.75rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Fraunces Variable, ui-serif, Georgia, serif"
    fontSize: "clamp(1.75rem, 1.35rem + 1.8vw, 2.625rem)"
    fontWeight: 600
    lineHeight: 1.12
  body:
    fontFamily: "Instrument Sans Variable, ui-sans-serif, system-ui, sans-serif"
    fontWeight: 400
  label:
    fontFamily: "Instrument Sans Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.14em"
  supporting:
    micro: "0.6875rem"
    labelSmall: "0.75rem"
    caption: "0.8125rem"
    bodySmall: "0.875rem"
    body: "1rem"
    bodyLarge: "1.125rem"
    recordSmall: "1.25rem"
    record: "1.5rem"
rounded:
  pill: "999px"
spacing:
  page-gutter: "clamp(1.25rem, 4vw, 3rem)"
  section: "clamp(5rem, 3.5rem + 7vw, 9rem)"
  section-tight: "clamp(3rem, 2rem + 4vw, 5.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.green}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "1rem 1.75rem"
  button-primary-hover:
    backgroundColor: "{colors.green-deep}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "1rem 1.75rem"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.green-deep}"
    rounded: "{rounded.pill}"
    padding: "0.9rem 1.5rem"
---

# Design System: CostCook

## Overview

**Creative North Star: "The Kitchen Ticket"**

CostCook's incumbent marketing identity is practical, warm, and quiet: an off-white ground, restrained green actions, amber operational accents, and fine rules that recall kitchen tickets without turning the site into a theme. Fraunces gives decisions and page identity an editorial voice; Instrument Sans keeps supporting information direct and easy to scan.

Contact follows the same founder-direct voice. Public visitors get a dedicated `/contact` destination with email, phone, and demo actions; existing users are directed to authenticated **Contact support** inside CostCook, where account context can accompany the message.

When marketing needs to show connected product evidence, the same visual world can tighten into a calm, seeded workspace. Editorial Fraunces remains outside and at key explanatory handoffs; dense product labels, tables, statuses, and tabular numbers use Instrument Sans inside a bounded paper surface. This is product proof within the marketing system, not a separate dashboard identity.

**Key Characteristics:**

- Warm off-white, green, and amber palette
- Fraunces display type paired with Instrument Sans body type
- Quiet border rules and sparse, purposeful elevation
- Direct actions with explicit outcomes and accessible touch targets
- Founder-direct contact language without an anonymous form
- Calm, bounded product-proof workspaces with explicit data provenance

## Colors

The palette stays low-noise: warm neutrals hold the page, green carries actions, and amber is reserved for compact operational emphasis.

### Primary

- **Working Green:** The default fill for primary actions and the brand mark.
- **Deep Working Green:** Hover states and accessible text links on light surfaces.

### Secondary

- **Deep Amber:** Small labels and eyebrows; the lighter amber is decorative rather than small-text color.

### Neutral

- **Ink:** Headings and primary text.
- **Soft Ink:** Supporting copy and secondary navigation.
- **Off-white:** The default page ground.
- **Paper:** Bright, contained surfaces and focus-adjacent utility surfaces.
- **Soft Green:** A quiet contrasting band for secondary calls to action.
- **Hairline:** Dividers and understated link decoration.
- **Ticket Rule:** Warm dividers used by the ticket motif and the contact guidance panel.

**The Quiet Accent Rule.** Green identifies actions; amber provides small operational emphasis. Neither becomes a broad decorative wash.

## Typography

**Display Font:** Fraunces Variable (with ui-serif, Georgia, serif fallbacks)
**Body Font:** Instrument Sans Variable (with ui-sans-serif, system-ui, sans-serif fallbacks)

**Character:** Fraunces makes page titles feel human and assured. Instrument Sans keeps workflow explanations, contact guidance, labels, and navigation plainspoken.

### Hierarchy

- **Display** (600, fluid display scale, 1.05): Primary page identity and hero statements.
- **Headline** (600, fluid headline scale, 1.12): Major section headings.
- **Body** (400): Explanations and task guidance, generally constrained to about 54–62 characters per line where the implementation does so.
- **Label** (600, compact, 0.14em letter spacing, uppercase): Eyebrows and short operational labels.
- **Supporting roles** (0.6875–1.5rem): Micro data, compact labels, captions, body copy, and record titles use the shared semantic stops rather than route-local sizes.

**The Founder-Direct Rule.** Contact copy speaks as Rayan and names the outcome—email, call, book a demo, or contact support—without invented service guarantees.

## Layout

Pages use a centered container capped at 72rem with fluid horizontal gutters. Sections alternate between two fluid vertical registers. The contact screen uses a single reading column at narrow widths and a 7:5 content-to-guidance split on large screens; the lower demo band repeats that relationship. This is a focused, low-complexity workflow, so the dedicated route and current screen structure should remain intact.

Contact entry points remain discoverable beside the homepage price, on the pricing page, and in shared navigation and footer destinations. These links converge on `/contact`; they do not duplicate the page's content in place.

Dense product proof keeps one working frame active inside a bounded shell rather than shrinking several frames into thumbnails or repeating them as equal cards. Wide layouts may hold stable local navigation beside the evidence. When that rail no longer leaves the evidence legible, replace it with a native compact control and preserve the same choices and sequence. Wide tables may scroll inside their own frame; the page itself must not overflow.

## Elevation & Depth

The system is flat by default. Borders, background bands, and paper contrast create most separation; compact ticket imagery may use a restrained two-layer shadow. A large, interactive product-proof shell may use a broader two-layer shadow to read as one contained artifact, while its internal metrics, tables, and asides remain border-led and flat. The contact workflow itself uses rules and a soft-green band rather than floating cards.

**The Flat-by-Default Rule.** Use elevation for physical ticket-like artifacts and bounded product proof, not routine contact information, navigation, or every internal panel.

## Shapes

Primary actions are full pills, a warm counterpoint to the serif display face. Most content containers remain square and are separated with thin rules instead of rounded cards. A bounded product-proof shell may use gently rounded outer corners while the data surfaces inside it stay square and rule-separated. Focus outlines follow each element's existing shape.

## Components

### Buttons

- **Shape:** Full pill for primary actions.
- **Primary:** Working-green fill, white semibold text, and generous horizontal padding.
- **Hover / Focus:** Deep-green hover; a two-pixel green focus outline with a two-pixel offset; active state moves down one pixel.
- **Outline:** Transparent paper-compatible ground, a Working-green border, Deep Working Green text, and the same pill silhouette; hover uses Soft Green without competing with the primary action.
- **Quiet link:** Deep-green semibold underlined text. Vertical padding expands the hit area to at least 44px without disrupting inline rhythm.

The homepage contact action beside the price keeps the quiet-link treatment and a minimum 44px target. Contact-page email and demo actions use the primary button; phone, sign-in, and contextual links use the quieter link language according to hierarchy.

### Cards / Containers

- **Corner Style:** Square by default.
- **Background:** Off-white page ground; soft green for the closing demo band.
- **Shadow Strategy:** None for the contact information and guidance blocks.
- **Border:** Hairline or warm ticket-rule separators.

### Navigation

Shared navigation uses compact Instrument Sans links with 44px minimum targets. `Contact` is part of the same shared navigation source as the other destinations, so header and footer placement do not drift. The persistent start action remains visually primary.

### Embedded product proof

Product proof is a bounded, paper-like workspace inside the marketing page. Use Instrument Sans, compact labels, tabular numerals, pale rules, and restrained green or amber status emphasis inside the frame. Keep one primary evidence frame visible, preserve direct access to the available views, and keep explanatory copy attached to the evidence it interprets. Synthetic records and amounts must carry a persistent, plainly worded illustrative label; a one-time disclaimer elsewhere on the page is insufficient.

### Contact workflow

The public contact surface offers email, phone, and demo actions. It does not present an anonymous form or promise a response time. A dedicated demo-request surface may gather named business, workflow, and contact context when each field makes the working session more useful, but the handoff remains founder-direct and visitor-controlled rather than entering an implied sales queue. Existing users are sent to authenticated in-app **Contact support** rather than the public path. Safety copy must continue to warn visitors not to send passwords, payment card details, or other sensitive information.

**The Prepared-Handoff Rule.** A static marketing form may prepare a visitor-owned email, but it must distinguish “ready to send” from “sent,” keep the message inspectable in the visitor's email app, and never imply receipt before the visitor sends it.

## Do's and Don'ts

### Do:

- **Do** preserve the existing off-white, green, amber, Fraunces, Instrument Sans, and quiet-rule identity when extending contact surfaces.
- **Do** keep public email, phone, and demo actions explicit and outcome-labeled.
- **Do** route existing users to authenticated in-app **Contact support**.
- **Do** maintain at least a 44px target for the homepage contact action and shared navigation actions.
- **Do** retain the warning against sharing sensitive information.
- **Do** label seeded or constructed product records and amounts as illustrative beside the product proof where the values remain visible.
- **Do** use tabular numerals and quiet rules when presenting operational amounts for comparison.
- **Do** tell visitors when a contact or demo action prepares an email rather than sending data from the site.

### Don't:

- **Don't** add an anonymous public contact form without a new product decision.
- **Don't** invent response-time, availability, or service-level claims.
- **Don't** turn contact guidance into a floating SaaS card or introduce a new visual identity for the route.
- **Don't** present a seeded product workspace as a live account or let decorative dashboard chrome outrank the evidence.
- **Don't** show a sent, received, or confirmed state until the underlying system can prove that state.
