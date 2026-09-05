# Plan: the onboarding story on the landing site

Date: 2026-09-04 · Source of truth: `kitchen-brain@sandbox/demo`

## 1. What the sandbox/demo branch actually ships

The onboarding is `/setup` in the app: a five-stage guide, labelled on screen
`Step N of 5` (`SetupProgress.svelte:79`, `SETUP_STAGES` in
`src/lib/features/onboarding/setup.ts`).

**On the stage count.** The 2026-08-17 rehearsal artifact reports a `4 of 6` /
`3 of 6` progress readout and treats "costing defaults" as a tracked stage.
That counter no longer exists on `sandbox/demo`: `grep "of 6"` over
`src/routes/setup` and `src/lib/components/setup` returns nothing,
`costing-defaults` survives only as a boolean in `initialSetupMiscCostPct`
(`setup.ts:8`), and both `completedStages` and `nextStage` are derived from
`SETUP_STAGES` (`progress.ts:281-283`). The six-counter was consolidated into
five after that artifact was written. **Five is the shipped number**, and the
page may print it.

| # | Stage id      | On-screen label       | What it wants |
|---|---------------|-----------------------|---------------|
| 1 | `kitchen`     | Kitchen and suppliers | Business name, one supplier, target food cost |
| 2 | `ingredients` | Ingredients           | The ingredients of **one** dish: pack, pack price, costing unit, trim yield |
| 3 | `allergens`   | Food facts            | Confirm drafted nutrition, one tap per allergen, diet facts |
| 4 | `recipes`     | Recipes               | A sub-recipe if shared, then one dish, then its plate cost |
| 5 | `first-order` | Menu and first order  | Guests + date -> shopping, prep, pack, event food cost |

Before stage 1 there is a **welcome**: two optional questions (kitchen kind,
goal) and one optional dish name, which then personalises later stage copy
(`stageCopy()` in `stage-guide.ts`). Every answer is optional; a blank welcome
is a skip.

`stage-guide.ts` already carries, per stage, a `why`, a `needs` list, a `steps`
list and a `terms` glossary, in the chef-to-chef voice. Sage reads the same
lines. **This is in-app documentation that already ships.**

## 2. What is verified, and what is not

From `artifacts/onboarding-rehearsal/260817a/results.md` (2026-08-17):

**Verified — safe to claim**
- 32/32 browser tests green against a freshly migrated empty database.
- The worked number: `Roast chicken plate`, one line of 180 g chicken thigh,
  $32.00 per 10 lb case, 80% trim yield ->
  `$1.59 ingredient lines + $0.03 misc (2%) = $1.62 plate cost`.
  The `$0.03` depends on `DEFAULT_ONBOARDING_MISC_COST_PCT = 2`, so the copy
  must say "at the 2% default" or the total is conditional. Finding #2's fix
  is confirmed present on the branch: `progress.ts:175` composes through the
  shared `plateCost(..., settings.miscCostPct)`, so the stage card and the
  builder cannot disagree.
- The price guard: an ingredient cannot leave the pack step without a price.
- The unit guard: a volume unit on a weight ingredient is refused, and the
  message names the fix (add density).
- `Start over` resets guide progress only; ingredients, recipes, menus and
  orders survive. Confirmed against the database.
- An offline save keeps every typed value on screen and retries safely
  (finding #1, fixed and held by a test).
- Resaving the first supplier does not duplicate it.

**Not verified — must stay off the page**
- Real invoice / recipe PDF extraction quality (`IMPORT_AI_PROVIDER: 'stub'`
  in both test layers). No PDF was extracted for real.
- The `Load sample data` path: presence only. Untested at both layers.
- Screen-reader behaviour. Keyboard operation is covered; AT is not.
- **Any duration.** Nothing in the artifacts supports "set up in N minutes".
  Do not invent one. The shape ("one dish, one supplier, five stages") is the
  honest and stronger claim for this audience.

**There is no public sandbox.** `https://app.costcook.io/demo` returns 404 in
production. The app's `/demo` route 404s unless `SEED_DEMO_EMAIL` /
`SEED_DEMO_PASSWORD` are set, and only the Demo Instance sets them. So the
piece cannot say "try it yourself" and must not link there. Note the name
collision: the landing site's own `/demo` is the **booking** page
(`demoCta.href`), not a sandbox.

## 3. Recommendation: a route in "See it work", not a blog post

**Blog does not fit, structurally.** `src/content/config.ts` pins
`category` to four kitchen-problem enums (Costing & pricing, Recipes & yield,
Running the event, Buying & suppliers), `menuGroup` to two (Cost the work,
Plan and buy), and requires `featureHref` to be a `/features/*` page. An
onboarding walkthrough is none of those, and there is no `/features/setup` to
point at. Every existing post answers a kitchen question a chef would search
for; none is about the product's own screens. Shipping this as a post means
widening three enums and inventing a feature target.

**In-app docs are already shipped.** `stage-guide.ts` is the how-to, it is
personalised, and Sage reads it. A second copy on the marketing site would
drift from it within a release.

**The real gap is the prospect's objection**, and it is unanswered anywhere on
the site: *"I will have to enter my whole walk-in before this does anything."*
The onboarding's design answer is **one dish**. That is a decision-stage
argument, and it belongs next to `/tour/main` and `/who-its-for` in the
`resourceNav` "See it work" group. The FAQ has no setup answer either
(`src/lib/faq.ts` mentions setup only under roles and Sage).

**Proposal:** one new route, `/first-dish` (working title), in "See it work".
`/tour/main` already follows an existing kitchen through a 180-guest wedding;
this covers the hour before that tour can happen. They do not overlap.

## 4. The spine

One claim per slot, each traceable to the table in section 1 or 2.

1. **The fear, named.** "You are not entering your walk-in." Setup asks for one
   dish you already know.
2. **The welcome.** Two optional questions and a dish name. Skippable; a blank
   welcome still works. Everything after speaks in your dish's name.
3. **Five stages, in order** — the table above, one line each, in the app's own
   labels so a reader who starts recognises every screen.
4. **The number.** The $1.62 trace, shown as arithmetic a chef can check by
   hand. This is the strongest asset on the page.
5. **What it refuses to do.** The price guard and the unit guard, quoted. A
   tool that refuses a bad line is the trust argument, not a feature.
6. **You cannot break it.** `Start over` keeps your records; an offline save
   keeps your typing.
7. **Where it hands off.** Stage 5 ends at Shop, which is where `/tour/main`
   begins. Link across.
8. **Close** on `cta.label` from `site.ts`, verbatim.

## 5. Build steps

1. `story-content` skill first: run the 11 steps, save
   `docs/stories/first-dish.story.md`, and put the `<!-- story: -->` pointer in
   the page source. (Global rule; no copy before the tracker.)
2. `normal-ui-workflow-audit` in focused mode: the affected workflow is the
   decision path (nav -> resource route -> primary CTA); confirm explicitly
   whether the resource group needs restructuring at five items.
3. `src/components/sections/FirstDishPage.astro` + `src/pages/first-dish.astro`,
   following the `who-its-for` pair as the model.
4. Register in `resourceNav` (`src/lib/site.ts`), group `See it work`, with an
   `icon` and a one-line `description`. Do not hardcode any anchor or invent a
   CTA label; the close renders `cta.label`.
5. **Append** both new files to the end of `surfaceFiles` in
   `scripts/check-landing-claims.mjs` so the forbidden-claims scan covers
   them, and add a claim pin for the $1.62 arithmetic. Do not insert into that
   array: `siteSource` and `heroSource` resolve by position, and adding
   `pricing.astro` previously pushed `StartHere` off `at(-1)`. Confirm nothing
   near the end resolves by index before appending.
   Watch the forbidden patterns this page will drift toward:
   `no data entry`, `nothing is re-keyed`, `handles it automatically`.
   Spine slot 5 is the safe register for that instinct.
6. Add one FAQ row: "What does setup actually involve?" -> short answer +
   link. `src/lib/faq.ts` is already scanned.
7. Design: ticket motif, no em-dashes, no stock SaaS phrases, AA contrast,
   `.anim-enter` / `[data-reveal]` only.

## 6. Verification

- `node scripts/check-landing-claims.mjs` green.
- `npm run build` green.
- Browser check at 390x844 and 1440x900; the arithmetic block must scroll
  inside its own container, never the page.
- Keyboard pass: focus rings, and animations snapping to final state on focus.
- Re-read every sentence against section 2. Anything not in the verified list
  comes off the page.

## 7. Open question for the owner

Format. The route is the recommendation. A blog post is possible but costs a
schema widening (`category`, `menuGroup`, `menuIcon`) plus a `featureHref`
target that does not exist. Both is also possible: the route now, and a
separate kitchen-question post later ("What do I need before I can cost my
first dish?") that fits the existing enums and links to the route.
