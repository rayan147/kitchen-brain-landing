# CostCook Landing

Marketing site for CostCook, catering software that runs an event from the
first inquiry to closeout: inquiry, priced proposal the client accepts on
their phone, agreement, deposit tracked, Confirm order, then shop, prep, pack
and food cost against the agreed price (repositioned 2026-09-27; story in
`docs/stories/homepage-event-story.story.md`).
Single goal: start the 15-day free trial. The booking link (`demoCta`) is the
one quiet alternative for a visitor who will not start cold, never a second
primary action. Fully static Astro + Tailwind v4, deployed to Vercel on every
merge to `main`.

## Design Context

### Users

Owner-operator caterers and restaurants that cater, selling events (1–15
staff; meal-prep kitchens are served on /who-its-for), usually reading
on a phone, often mid-shift, arriving skeptical from a cold email or text. They
have been burned by big-platform sales funnels. The job to be done: decide in
under a minute whether a 15-minute demo is worth their time. Every claim must
survive that demo call — the page may not promise anything the app doesn't
ship today (the "truth pass" discipline; unbuilt features have open issues in
kitchen-brain and stay off the page until shipped).

### Brand Personality

Chef-to-chef, plainspoken, earned. Three words: honest, warm, unhurried.
The voice is one founder-chef talking shop ("Straight up: this is early"),
never a marketing department. Emotional goal: relief and trust, not hype.
Copy rules: no em-dashes in user-facing text (PR #49), no stock SaaS phrases
("in one click"), sentence-level claims verified against the app
(kitchen-brain CONTEXT.md is the glossary; "Kitchen Brain" never appears as a
product name in prospect-facing copy).

### Aesthetic Direction

Editorial print, not SaaS. Fraunces Variable (display, optical sizing on) over
Instrument Sans (body). The one repeated accent device is the kitchen-ticket
motif: cream/softamber surfaces, dashed ticket rules, mono micro-labels
("SHOP · PREP · PACK"), a 1.5° paper tilt. Palette is cream/off-white paper,
deep ink, kitchen green, amber — all defined once in `src/styles/global.css`
`@theme` with contrast ratios annotated; never introduce ad-hoc colors. Light
mode only. Anti-references: generic AI-gradient SaaS pages, dashboard
screenshots in perspective frames, dark "developer tool" landing pages.

### Design Principles

1. **Print discipline.** Type does the work: fluid modular scale, balanced
   headings, hairline rules. Decoration is limited to the ticket motif and
   amber eyebrows. If an element wouldn't survive on paper, question it.
2. **Truth before polish.** Copy claims trace to shipped app behavior. A
   prettier lie loses to a plainer truth.
3. **Nothing hidden, nothing jumpy.** Motion is transform/opacity only, two
   registers (`.anim-enter`, `[data-reveal]`), inert under
   `prefers-reduced-motion`, and content is never hidden for no-JS visitors.
   Keyboard focus snaps animations to their final state.
4. **AA is the floor.** Contrast notes live next to the tokens; amber is
   decoration/large-text only (`amber-deep` for small text). Focus rings
   follow element radius. The sr-only demo transcript must match the footage.
5. **One slot, one claim.** Each section owns one promise, and every path
   to conversion points at one place: the primary CTA's label and target
   (`cta`) live in `src/lib/site.ts`, and every `btn-primary` on the homepage
   renders `cta.label` verbatim. The homepage opens and closes on the same
   action; `check-landing-claims.mjs` fails the build if either primary drifts
   or if the close ships the demo link as a second primary. Quiet secondaries
   are capped at two ("Book 15 minutes", "See every shipped feature"). New
   links must not hardcode the anchor or invent new labels.
