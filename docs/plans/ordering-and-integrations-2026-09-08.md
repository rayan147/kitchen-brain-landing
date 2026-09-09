# Ordering and Integrations on the landing site

Design spec. Written 2026-09-08. Status: approved, not yet implemented.

## The problem

CostCook has built a customer-facing ordering capability — a hosted storefront
and an embeddable widget — and the landing site says nothing about it. The one
integration claim the site does make (`src/lib/features.ts:437`, "Square and
QuickBooks", "Not included at launch") is buried inside a feature group where a
prospect looking for it will not find it.

The owner asked whether Ordering should be grouped under a new "Integrations"
header tab alongside Square and QuickBooks. This spec says no, and explains
what to do instead.

## What is actually built, and what is actually live

Read off `kitchen-brain` `develop` (and `main`, which carries the same files) on
2026-09-08.

Built:

- `apps/ordering` — an independently deployed SvelteKit app. No database, no
  Better Auth, no internal imports. Five-stage workflow: menu, choices, event,
  contact, review. Documented in `docs/architecture/hosted-ordering.md`.
- `packages/widget-loader` — a dependency-free IIFE loader under a 12 KiB
  budget that mounts a sandboxed iframe. Five outbound states, no inbound
  command. Documented in `docs/architecture/ordering-widget.md`.
- `/settings/ordering`, `/settings/ordering/site`, and a Stripe handoff
  (`0a39b7e0 feat(ordering): offer Stripe during storefront setup`).
- `/settings/integrations` in the app, already listing three cards: CostCook
  API, Square, QuickBooks Online.

Not live. Three independent checks, all run 2026-09-08:

1. `vercel project ls` returns exactly three projects — `kitchen-brain-landing`
   (costcook.io), `kitchen-brain-demo` (demo.costcook.io), and `kitchen-brain`
   (app.costcook.io). There is no ordering project. `apps/ordering` has never
   been deployed.
2. `order.costcook.io`, `ordering.costcook.io` and `orders.costcook.io` are all
   NXDOMAIN. `docs/architecture/hosted-ordering.md` names `order.costcook.io`
   as the canonical origin; that host does not exist.
3. `vercel env ls production --project kitchen-brain` contains no
   `FEATURE_ORDERING_INTEGRATION_ENABLED`. `featureDefault()` in
   `src/lib/server/features/access.ts` returns true only for `'true'` or `'1'`,
   so an unset variable means the flag is **off for every workspace in
   production**. The Stripe variables that are present
   (`STRIPE_PRICE_LAUNCH_MONTHLY`, `STRIPE_TRIAL_DAYS`,
   `STRIPE_WEBHOOK_SECRET`, `STRIPE_SECRET_KEY`) are subscription billing for
   the CostCook trial, not the ordering payment handoff.

QuickBooks is further back still. `docs/integrations/quickbooks.md` opens:
"Status: **blocked by the Square Sandbox acceptance gate; not implemented**."

**Therefore a caterer who starts a 15-day trial today cannot take an order.**
Every design decision below follows from that sentence.

## Why Ordering does not go under "Integrations"

Three reasons, in order of weight.

1. **It is first-party.** The storefront, the widget, the intake API and the
   Stripe handoff are all CostCook. Square and QuickBooks are connections to
   systems the caterer already pays for. Filing them together tells a skeptical
   prospect that taking orders requires another vendor — the opposite of what
   was built, and the opposite of how [CaterZen] and [HoneyCart] position a
   branded storefront (the pitch is escaping third-party marketplaces).
2. **A header tab would be mostly vapor.** Ordering is undeployed and
   QuickBooks is unstarted. Navigation slots one and two carry the most
   engagement ([Webstacks], [Amply]); spending one on two unbuilt things is the
   weakest available use of it. Both sources say an integrations page belongs
   in the footer unless third-party connections are central to the product's
   value. Here they are not, yet.
3. **CLAUDE.md caps the header.** "One slot, one claim", quiet secondaries
   capped at two. A fourth header destination pressures the single-CTA
   discipline the homepage is built on.

## Why Ordering does not get its own `/features` section either

The obvious alternative — a sixth section, "Taking orders" — is blocked twice.

`src/lib/features.ts` admits **shipped features only**: "PARTIAL, STUB, and
internal tooling stay off the page until they ship." Ordering is not shipped in
the only sense that matters to a reader, because it is not reachable.

And the section list is coupled to `/compare`. `SECTIONS` is documented as the
comparison row-group titles verbatim, and `scripts/verify-compare.mjs` hardcodes
five group tables, five columns per group, and a five-row legend (assertions at
lines 145, 148, 259). A sixth section obligates a sixth comparison row group,
which means competitor-by-competitor evidence for Parsley and Meez dated against
`VERIFIED_ON`. That is a research deliverable, not a copy change, and it is not
worth doing for a capability nobody can use.

## The design

Two pieces. They share no data and must be independently shippable — coupling
them means neither lands until both do.

### Piece 1 — `src/lib/ordering.ts`

Modeled directly on `src/lib/labels.ts`, which solves exactly this problem
already: kitchen labels are fully built behind `FEATURE_LABEL_PRINTING_ENABLED`,
and one `LABELS_STATUS` constant drives every public surface.

```
export const ORDERING_STATUS = 'coming' as Verdict;
```

Set to `'coming'` on the evidence in this spec. The file header records why, in
the style of `labels.ts`: built, undeployed, no Vercel project, flag unset in
production, verified 2026-09-08. Flip to `'yes'` when a real order has been
placed through a deployed storefront, and every surface below follows.

An `orderingAvailability` object supplies per-surface copy for both states —
`isComing`, `verdict`, `word`, `featureLead`, `featureDetail`, `pageSentence`,
`comparisonNote`, `faqStatus`, `seoDescription`, `homepageTradeoff` — matching
the shape of `labelsAvailability` so the two files read the same way.

An `ordering` object carries the descriptive content: the two delivery modes
(hosted storefront, embedded widget), the five customer stages, and a
`verified: { sha, branch, on }` provenance stamp naming the kitchen-brain commit
the description was read from.

**`notClaimed` — the boundaries.** Each traces to the app's own architecture
docs, and each is a sentence the page may never contradict:

- A submission is *awaiting kitchen confirmation*, never a confirmed event. The
  hosted app says this deliberately; the landing page may not upgrade it.
- The browser submits opaque menu, item, portion and modifier selections
  **without prices**. Kitchen Brain re-resolves publication and availability and
  calculates every amount. The customer never sees a number the kitchen did not
  compute.
- Stripe is a **handoff**. The hosted app has an explicit "payment not required"
  state that says no online charge or confirmation occurred. The page may not
  say CostCook gets you paid.
- The widget protocol has five outbound states and **no inbound command** — no
  navigation, HTML, script, customer-contact or payment payload. Approved embed
  origins are data and defense in depth, not authorization.
- Ordering is not in the subscription a caterer would start today.

**Where it surfaces.** Inside the existing "The day itself" section, as a
feature group with `status: 'in-development'`. Not a new section, so no sixth
compare group.

**The lockstep requirement.** `featureMenuHref` (`src/lib/features.ts`) throws
if a menu item is marked `coming` while its group has shipped, or points at an
unshipped group when not marked. So `ORDERING_STATUS` must drive **both** the
group's `status` field and the feature-menu item's `coming` flag. Hardcoding
either one makes the switch decorative and breaks the build the day it flips.
Derive both from `orderingAvailability.isComing`.

**The comparison row.** `check-landing-claims.mjs` requires that a shared
availability status be consumed by `/compare` (the guard at lines 352-357 pins
this for each coming plan; `labelsAvailability.verdict` is consumed the same way
at `comparison.ts:396`). Ordering therefore needs one row inside the existing
"The day itself" group, with `costcook: orderingAvailability.verdict` and
`note: orderingAvailability.comparisonNote`.

That row's competitor cells are a research task, not a guess: `parsley` and
`meez` cells must reflect what those companies' own pricing pages listed as of
`VERIFIED_ON` (currently August 30, 2026). If that check is not performed, the
row may not ship. Marking a cell `NOT_LISTED` is itself a dated claim about a
competitor's page and is covered by RC-40.

### Piece 2 — `/integrations`

A small page, linked from the footer and from the Resources menu. Never the
header.

`src/lib/integrations.ts` holds the data, moved out of the "Square and
QuickBooks" group at `features.ts:437`:

- **Square** — built in the app (`/settings/integrations/square` and its catalog
  screen), behind `FEATURE_SQUARE_INTEGRATION_ENABLED`, awaiting its Sandbox
  acceptance gate. Publishes approved dishes and brings completed POS sales back
  as external sales evidence.
- **QuickBooks Online** — not implemented, explicitly blocked by the Square
  gate. Exports approved supplier invoices as reviewed QuickBooks bills, when it
  exists. No date is promised.

Both carry the shared "Coming" vocabulary from `src/lib/availability.ts`
(`comingDefinition`) rather than inventing new status words. The page adds no
primary CTA; `check-landing-claims.mjs` caps quiet secondaries at two.

`features.ts:437` loses its group and the section lede for "Team, and what it
connects to" is reworded, since it currently promises that the connection work
appears in that section.

## Guards and tests

This repo ships a `check-*.mjs` and a `verify-*.mjs` per feature page. Both
pieces follow it.

- `scripts/check-taking-orders-page.mjs` and `scripts/verify-taking-orders.mjs`
- `scripts/check-integrations-page.mjs` and `scripts/verify-integrations.mjs`
- Both new surfaces are appended to `surfaceFiles` in
  `check-landing-claims.mjs`, so their copy passes the forbidden-claims scan.
- `verify-feature-parity.mjs` and `verify-features-menu.mjs` cover the new
  feature group and menu entry.

New `forbiddenClaims` entries, each guarding a specific lie this feature makes
easy:

| Pattern | What it stops |
| --- | --- |
| `/\bconfirms? the (order\|booking) automatically\b/i` | Upgrading "awaiting kitchen confirmation" into a confirmation |
| `/\b(gets\|get) you paid\b/i` | Turning the Stripe handoff into a payments product |
| `/\bcustomers? (see\|sees) (the\|their) price\b[^.]{0,40}\binstantly\b/i` | Implying prices are computed in the browser |
| `/\btakes orders? while you (sleep\|cook)\b/i` | The stock automation promise, which the intake gate contradicts |

## Claim ledger

Two new rows in `docs/release-claim-ledger.md`. Highest existing is RC-58.

- **RC-59** — Ordering: what the storefront and widget do, the
  awaiting-confirmation boundary, the price-authority boundary, the Stripe
  handoff boundary, and the deployment status that pins `ORDERING_STATUS` to
  `coming`.
- **RC-60** — Integrations: Square's flag-gated built state and QuickBooks'
  not-implemented state, and the rule that neither may be described as
  connected to a caterer's books.

The ledger's surface table gains matching rows for the new page, the feature
group, the compare row, the FAQ answers and the footer link.

## Stories

Per the global story-content rule, each piece of user-facing copy is built as
one story and its tracker saved beside the content, with a `<!-- story: -->`
pointer in the source:

- `docs/stories/taking-orders.story.md`
- `docs/stories/integrations.story.md`

## Sequencing

1. Piece 2 first. `/integrations` depends on nothing, corrects a claim that is
   already live, and can ship alone.
2. Piece 1 second, as `coming`.
3. When ordering is genuinely deployed — a Vercel project for `apps/ordering`,
   DNS for `order.costcook.io`, `FEATURE_ORDERING_INTEGRATION_ENABLED` set, and
   one real order placed end to end — flip `ORDERING_STATUS` to `'yes'` and
   update RC-59 in the same commit. Only then is a promotion to its own
   `/features` section and a sixth `/compare` row group worth costing.

[Webstacks]: https://www.webstacks.com/blog/saas-navigation-menu
[Amply]: https://www.joinamply.com/academy/how-to-design-your-saas-site-navigation
[CaterZen]: https://www.caterzen.com/catering-online-ordering-software
[HoneyCart]: https://gethoneycart.com/online-catering-software-vs-third-party-sites/
