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
    fontSize: "clamp(2.375rem, 1.2rem + 4.2vw, 4.5rem)"
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
---

# Design System: CostCook

## Overview

**Creative North Star: "The Kitchen Ticket"**

CostCook's incumbent marketing identity is practical, warm, and quiet: an off-white ground, restrained green actions, amber operational accents, and fine rules that recall kitchen tickets without turning the site into a theme. Fraunces gives decisions and page identity an editorial voice; Instrument Sans keeps supporting information direct and easy to scan.

Contact follows the same founder-direct voice. Public visitors get a dedicated `/contact` destination with email, phone, and demo actions; existing users are directed to authenticated **Contact support** inside CostCook, where account context can accompany the message.

**Key Characteristics:**

- Warm off-white, green, and amber palette
- Fraunces display type paired with Instrument Sans body type
- Quiet border rules and sparse, purposeful elevation
- Direct actions with explicit outcomes and accessible touch targets
- Founder-direct contact language without an anonymous form

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

**The Founder-Direct Rule.** Contact copy speaks as Rayan and names the outcome—email, call, book a demo, or contact support—without invented service guarantees.

## Layout

Pages use a centered container capped at 72rem with fluid horizontal gutters. Sections alternate between two fluid vertical registers. The contact screen uses a single reading column at narrow widths and a 7:5 content-to-guidance split on large screens; the lower demo band repeats that relationship. This is a focused, low-complexity workflow, so the dedicated route and current screen structure should remain intact.

Contact entry points remain discoverable beside the homepage price, on the pricing page, and in shared navigation and footer destinations. These links converge on `/contact`; they do not duplicate the page's content in place.

## Elevation & Depth

The system is flat by default. Borders, background bands, and paper contrast create most separation; compact ticket imagery may use a restrained two-layer shadow. The contact workflow itself uses rules and a soft-green band rather than floating cards.

**The Flat-by-Default Rule.** Use elevation for physical ticket-like artifacts, not routine contact information or navigation.

## Shapes

Primary actions are full pills, a warm counterpoint to the serif display face. Most content containers remain square and are separated with thin rules instead of rounded cards. Focus outlines follow each element's existing shape.

## Components

### Buttons

- **Shape:** Full pill for primary actions.
- **Primary:** Working-green fill, white semibold text, and generous horizontal padding.
- **Hover / Focus:** Deep-green hover; a two-pixel green focus outline with a two-pixel offset; active state moves down one pixel.
- **Quiet link:** Deep-green semibold underlined text. Vertical padding expands the hit area to at least 44px without disrupting inline rhythm.

The homepage contact action beside the price keeps the quiet-link treatment and a minimum 44px target. Contact-page email and demo actions use the primary button; phone, sign-in, and contextual links use the quieter link language according to hierarchy.

### Cards / Containers

- **Corner Style:** Square by default.
- **Background:** Off-white page ground; soft green for the closing demo band.
- **Shadow Strategy:** None for the contact information and guidance blocks.
- **Border:** Hairline or warm ticket-rule separators.

### Navigation

Shared navigation uses compact Instrument Sans links with 44px minimum targets. `Contact` is part of the same shared navigation source as the other destinations, so header and footer placement do not drift. The persistent start action remains visually primary.

### Contact workflow

The public contact surface offers email, phone, and demo actions. It does not present an anonymous form or promise a response time. Existing users are sent to authenticated in-app **Contact support** rather than the public path. Safety copy must continue to warn visitors not to send passwords, payment card details, or other sensitive information.

## Do's and Don'ts

### Do:

- **Do** preserve the existing off-white, green, amber, Fraunces, Instrument Sans, and quiet-rule identity when extending contact surfaces.
- **Do** keep public email, phone, and demo actions explicit and outcome-labeled.
- **Do** route existing users to authenticated in-app **Contact support**.
- **Do** maintain at least a 44px target for the homepage contact action and shared navigation actions.
- **Do** retain the warning against sharing sensitive information.

### Don't:

- **Don't** add an anonymous public contact form without a new product decision.
- **Don't** invent response-time, availability, or service-level claims.
- **Don't** turn contact guidance into a floating SaaS card or introduce a new visual identity for the route.
