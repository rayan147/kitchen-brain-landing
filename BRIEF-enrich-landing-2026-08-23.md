# Brief: enrich costcook.io beyond the one workflow

**Written** 2026-08-23. **For** whoever picks up the next landing work (agent or human).
**Status** IMPLEMENTED 2026-08-23. All five workstreams shipped; see the record at the
foot of this file for what was built, what the brief got wrong, and what is still open.

---

## 0. Read this first, or you will fail the build

### Baseline this brief assumes

The tree is **not** clean `main`. The following is present but uncommitted:

- `src/pages/compare.astro` and `src/lib/comparison.ts` (the Parsley/meez comparison, RC-40)
- `src/components/sections/PaperIn.astro` (seventh homepage stop, AI file intake)
- `docs/release-claim-ledger.md` rows RC-38 through RC-43
- `scripts/check-landing-claims.mjs` updated for all of the above
- `src/lib/features.ts` groups `assistant` (Sage) and `accounting` (Square, QuickBooks), both `in-development`
- `src/lib/site.ts` nav entry `{ label: 'Compared', href: '/compare' }`

If those files are missing, stop and find out what happened to them before building on this.

### Non-negotiables

These come from `CLAUDE.md` and `scripts/check-landing-claims.mjs`. Every one of them
has already broken a build or a claim at least once.

1. **The guard scans whole files, comments included.** A forbidden phrase in a code
   comment fails the build exactly like one in a heading. This has happened. Describe
   a forbidden phrase, do not quote it.
2. **Any new homepage section must be registered in three places** in
   `check-landing-claims.mjs`: `surfaceFiles` (line 7), the component require-list
   (line 49), and `expectedSectionOrder` (line 77). Order is enforced. A section
   inserted at the wrong index fails.
3. **Every prospect-facing claim needs an RC row** in `docs/release-claim-ledger.md`,
   and the loop bound (line 145, currently `43`) must be raised to the highest row.
4. **One primary action.** Every `btn-primary` on the homepage renders `cta.label`
   verbatim from `site.ts`. The close section may not render `demoCta.label` as a
   primary. Quiet secondaries are capped at two.
5. **Capabilities are read off `sandbox/demo` and nothing else.** Not local `main`,
   not a branch that happens to be checked out. Three comparison cells shipped wrong
   in one afternoon for exactly this reason; the rule is written into the header of
   `src/lib/comparison.ts`.
6. **Voice.** No em-dashes in user-facing text. No stock SaaS phrases. "Kitchen Brain"
   never appears in prospect-facing copy. Light mode only. No colors outside the
   `@theme` block in `global.css`.
7. **Status vocabulary is already decided.** `/compare` uses Yes / Coming / No /
   Not listed, with a legend rendered as page copy. Reuse it. Do not invent a second
   status language ("beta", "soon", "roadmap") somewhere else on the site.

### Out of scope, deliberately

- **Testimonials, customer logos, case studies, star ratings, "trusted by" bars.**
  None exist. None may be fabricated, softened into "kitchens like yours", or
  implied. When there is a real customer who consents, that is a separate decision.
- **A blog, a resources hub, a help center, a newsletter capture.** Not requested,
  and each one is a second funnel competing with the single CTA.
- **New demo footage.** See workstream D.
- **Any second primary action anywhere.**

---

## 1. Why the page looks empty next to theirs

Three different causes. They need three different fixes, so do not treat them as one
backlog.

**Deliberate.** The one-pager discipline is a decision, documented in `site.ts:59-70`:
the in-page anchors were removed from the header because "a header that indexes its
own scroll is noise on a one-pager", and the mobile header budget is one link. The
homepage is a billboard; `/features` is the reference. That structure is correct and
this brief does not undo it. What it got wrong is assuming a billboard has to be a
*narrow* billboard.

**Could not be claimed yet.** Square, QuickBooks, Sage and the printed nutrition panel
were absent because the truth pass kept unbuilt things off the page. That was right at
the time. The decision to market in-flight work as visibly labeled Coming is three days
old (RC-40, 2026-08-23), and the site has not caught up with it yet. `features.ts` has
the four in-development groups; nothing links to them from anywhere a prospect looks.

**An actual oversight.** There is no sign-in link. A trial user who lands on
costcook.io on day 6 has no way into the product from the marketing site. There is no
bucket that justifies this. Fix it first, it is the cheapest item here and the only
one with an existing user actively hurt by it.

---

## 2. What they do that we should answer, and how

The user named six things. Each gets one workstream. Nothing else gets added.

| Their thing | Our honest analogue | Workstream |
|---|---|---|
| Login button | Sign in link, magic link, returning trial user | **A** |
| Feature dropdown menu | Navigable `/features`, not a mega-menu | **B** |
| "Explain their features" | `/features` gains structure and in-development groups | **B** |
| "Who they serve" | One audience, stated plainly, including who it is not for | **C** |
| Videos | Make the one real 2:30 tour discoverable | **D** |
| Integrations | An integrations section with honest Coming rows | **E** |

---

## Workstream A: sign in (do this first)

**Verified on `origin/sandbox/demo`:** `src/routes/login/+page.svelte` exists. Page
title is `Sign in | CostCook`. It is a magic-link flow: "Enter the email your kitchen
invited. We will send a one-time sign-in link."

**Do:**

- Add to `src/lib/site.ts`, beside `cta`:
  ```ts
  /** Returning users. The app calls this "Sign in", so the page does too. */
  export const signIn = {
      label: 'Sign in',
      ariaLabel: 'Sign in to CostCook',
      href: 'https://app.costcook.io/login',
      target: '_self'
  } as const;
  ```
  Use the app's own word. "Log in" and "Sign in" on the same product is a small lie
  about how carefully anything else was built.
- Render it in `SiteNav.astro` as a **plain text link immediately left of the CTA
  pill**, visible at every breakpoint including mobile. It is not a `nav` array entry
  and it does not consume the `earlyVisible` budget, because it is not a destination
  a prospect is choosing between. Keep the 44px tap target.
- Render it in `SiteFooter.astro` alongside "Book a demo".

**Do not** put it in the `nav` array. That array is prospect navigation and its mobile
budget is one slot, which Pricing owns for a reason.

**Guard:** add `requireText(siteSource, 'app.costcook.io/login', 'sign-in destination')`
and a check that `SiteNav.astro` renders `signIn.label`. No RC row needed: this is a
destination, not a claim.

**Acceptance:** at 390px the header carries wordmark, Pricing, Sign in, and the Start
pill without wrapping to three lines. Verify in a browser, not by reading classes.

---

## Workstream B: make the features navigable

**The collision, resolved.** meez has a hover mega-menu. We are not building one.
Principle 3 says nothing hidden, and the reader is on a phone mid-shift where hover
does not exist. A dropdown would also need real sub-destinations, and `/features` is
currently one `EveryFeature` component rendering sixteen groups on one page.

**The decision: flat nav, structured page.** Do not split `/features` into routes.
Sixteen groups become sixteen thin pages nobody finds, sixteen new guard entries, and
sixteen chances for the claim ledger to drift out of sync. Instead:

- Give `/features` a **sticky in-page sub-nav** listing the group titles, with anchors.
  Sticky at `sm` and up; at mobile widths render it as a plain jump list at the top of
  the page rather than a sticky bar eating a phone viewport.
- Group the sixteen entries under **four or five plain-language headings** that match
  how a caterer thinks about their week, not how the code is organised. Suggested:
  *Costing and recipes* / *Buying and receiving* / *The day itself* /
  *Labels and compliance* / *Your team and your setup*. These should be the same
  vocabulary as the `/compare` row groups. If they are not, one of the two is wrong.
- **Surface the in-development groups.** `labels`, `api`, `assistant`, `accounting`
  currently all carry the title "In development", which means four groups share a
  heading and none of them says what it is. Give each a real title (Sage, the in-app
  assistant / Square and QuickBooks / Printed nutrition labels / API access) and let
  the `status: 'in-development'` field render the Coming badge. Reuse the `/compare`
  badge, do not build a second one.
- Add a short lead paragraph at the top of `/features` saying what the page is and
  that Coming means being built now, not planned. One sentence.

**Nav:** the `nav` array becomes Pricing / Every feature / Compared / Contact, unchanged
in content. Two open items fold in here:

- **"Compared" as a label.** It reads as a fragment. "How we compare" is clearer and
  fits the row. Change it unless the owner prefers the terse version.
- **`/pricing` does not link to `/compare`.** It should. A visitor on the pricing page
  looking at $49 is exactly the person who wants to see it against $129 to $379. One
  quiet text link under the plan, not a button.

**Guard:** `surfaceFiles` already contains `features.ts`. Pin the Coming badge text and
pin that no group title is the bare string "In development" any more.

---

## Workstream C: who this is for

**The collision, resolved.** meez and Parsley segment by customer type because they
serve restaurants, groups, ghost kitchens, and hotels. CostCook serves owner-operator
caterers and meal-prep businesses, 1 to 15 staff. One segment. **Do not invent four
personas to fill a grid.** That is the exact move that makes a page read like a
marketing department.

The honest and stronger version is one homepage section that names the fit and the
misfit. For a skeptic arriving from a cold email, "this is not for you if" buys more
trust than any list of who it is for.

**Do:**

- New section, `src/components/sections/WhoThisIsFor.astro`.
- Placement: **between `TheProblem` and `SeeItRun`**. The reader has just been told
  their pain; the next question is whether the tool is aimed at someone like them, and
  it must be answered before the proof video, not after. Note this shifts
  `expectedSectionOrder` and the index becomes nine stops. Update the comment block in
  `index.astro`, which currently says eight.
- Content: who it is for (catering and meal prep, 1 to 15 staff, the person who both
  cooks and quotes), and plainly who it is not for (a single-location restaurant
  running a fixed daily menu, a multi-location group needing per-site inventory, a
  kitchen that needs lot tracking for FSMA). The last three are real absences already
  documented as No rows in `comparison.ts`, so this section costs nothing new in
  claims and reuses verified facts.
- No CTA. No cards with icons. This is a paragraph and a short list.

**Guard:** register in all three places. **Ledger:** RC-44, recording that the misfit
list is the same set as the `/compare` No rows, so the two cannot drift apart.

---

## Workstream D: video

**Scope: discoverability only. No new footage.**

Reason: new clips mean re-running the `scripts/demo-video` capture chain against the
seeded demo database, and the runtime literal has to stay in sync across
`SeeItRun.astro`, `Hero.astro`, and the guard. The chain log records that literal
drifting twice already. Any new footage also requires the sr-only transcript to match
it exactly (principle 4), and the demo seeder's hard guards may not be weakened to
make a shot easier.

**Do:**

- Link the existing 2:30 tour from `/features` and from `/compare`. Both pages
  currently ask a reader to evaluate capability with no moving proof anywhere on them.
- Use the existing chip/link pattern from `SeeItRun.astro`. Same literal, "2:30".

**If** the owner does want new footage, that is its own brief: it needs the beat list,
the transcript, and a chain run, and it is not a side effect of this work.

---

## Workstream E: integrations

**The risk.** An integrations page where every row says Coming costs trust rather than
building it. So the page cannot be only the two in-flight connectors.

**Do:**

- New page `/integrations`, or a section on `/features` if the page stays short. Prefer
  the section until there are at least four shipped rows; a thin dedicated page reads
  as a placeholder.
- **Lead with what ships**, which is the honest headline nobody else makes: CostCook
  does not need an integration to get prices in, because it reads the paper. Supplier
  invoices, order guides, price sheets, photos of a delivery slip. That is RC-38,
  RC-09, RC-39 and it is already built and already on the homepage in `PaperIn`.
  Verify the current door list against `sandbox/demo` before writing the count.
- Then the Coming rows: **Square** and **QuickBooks**, labeled Coming with the same
  badge as everywhere else. Say what each will do in one sentence, in shipped-behavior
  terms, and do not name a date.
- **Sage** is not an integration, it is a product surface. It belongs in workstream B
  under features, not here.

**Ledger:** RC-45 (Square), RC-46 (QuickBooks), each recording that the row claims
in-development status only and promises no date. Raise the guard loop bound to 46.

**Guard:** pin that the Square and QuickBooks rows carry the Coming status. If either
ever ships, that is a deliberate move with an evidence check against `sandbox/demo`,
not a quiet edit.

---

## 3. Order of work

1. **A** (sign in). Independent, small, an existing user is hurt today.
2. **B** (features navigable, nav labels, pricing to compare link). Unblocks E.
3. **E** (integrations). Reuses B's badge and grouping.
4. **C** (who this is for). Touches homepage order, so do it when nothing else is
   mid-flight on `index.astro`.
5. **D** (video links). Trivial, do it last or alongside anything.

---

## 4. Definition of done

- `pnpm build` passes, meaning the claim guard passes.
- `astro check` clean.
- Every new claim has an RC row and the loop bound matches the highest row.
- Every capability statement traces to a file on `origin/sandbox/demo`, cited in the
  RC row.
- Browser verification at 390, 768, 1024, 1440. Header does not wrap at 390. Sticky
  sub-nav does not eat the viewport at 390. Focus order through the new nav links is
  sane and focus rings follow element radius.
- The homepage still opens and closes on the same single primary action, and still
  carries at most two quiet secondaries.
- No section added to the homepage without a matching entry in `expectedSectionOrder`.

## 5. Owner decisions still open

- **Nav label:** keep "Compared" or change to "How we compare"?
- **In-app support** is still unmarketed. The ledger excludes a service-response
  promise without owner-approved evidence. Supply wording you will stand behind on a
  demo call and it can go into workstream B.
- **Recipe management:** the deployed behavior is covered by RC-17/18/19 and got no
  in-development row. If the upgrade being built is big enough to name, say so and it
  gets one.
- **Release ledger pin is stale.** It pins demo-base at `6a29e88e`; `sandbox/demo` is
  at `b858a483`. This must be refreshed before deployment and it is a release-owner
  call, not an agent's.

---

## 6. Implementation record, 2026-08-23

All five workstreams are built. `pnpm check` (astro check plus the claim guard)
and `pnpm build` both pass. Verified in Chrome at 360, 390, 700, 768, 800, 1024
and 1440.

### Where the brief was wrong, and what was done instead

- **The five section titles.** The brief invented paraphrases ("Costing and
  recipes", "Labels and compliance"). The shipped `/compare` group titles are
  *Recipes and costing / Getting prices in / The day itself / Compliance and
  labels / Team, and what it connects to*. Those are RC-40 approved and already
  rendering, so they won. The guard now reads them out of `comparison.ts` and
  requires each one in `features.ts`, so the two pages cannot drift.
- **The `labels` group is not nutrition labels.** The brief proposed titling it
  "Printed nutrition labels". Its own copy is kitchen label workflows, and
  `/compare` carries printed nutrition panels as a separate coming row. Titled
  "Kitchen label printing."
- **RC-44 as the brief described it would have been a false ledger row.** The
  brief said the misfit list "is the same set as the /compare No rows". It is
  not: there are six No rows, all capability statements, and "a single-location
  restaurant on a fixed daily menu" is not among them and is not a capability at
  all. RC-44 pins a MAPPING instead: three misfits to their named No rows, and
  the restaurant to RC-01, positioning.
- **The loop bound is 46, not 46-by-the-brief's-route.** The brief planned
  RC-44/45/46 as who-this-is-for, Square, QuickBooks. Square and QuickBooks are
  one boundary and share RC-45. RC-46 went to Sage, which the brief did not
  notice was already claimed on `/compare` and `/features` with no ledger row at
  all.
- **`pnpm build` does not run the guard.** The brief's definition of done says
  it does. `postbuild` runs `check-dist.mjs` only; the claim guard runs under
  `pnpm check` and `pnpm check:claims`. Use `pnpm check`.

### Found while building, fixed

- **Full nutrition facts were missing from `/features`** while `/compare` said
  Yes and RC-42 backed it, which broke that page's own promise that anything
  absent is something CostCook does not do yet. Added as a group. No new claim.
- **`/pricing` named two of four in-development groups.** A page that quotes a
  price while naming half of what is not in it is the wrong half to get wrong.
  Its cards now map `inDevelopmentFeatureGroups`, and `pricing.astro` was added
  to the guard's scanned surfaces, which it had never been.
- **The header wrapped to two lines at exactly 768px.** Sign in plus the longer
  "How we compare" label left the right-hand group wanting 583px in 580. Gap
  tightened from `gap-x-5` to `gap-x-4` below `lg`. One line from 360 to 1440.
- **Three counts were typed against computed lists** ("Four groups", "Four
  kitchens", "Four things"). All three now spell a computed length, the same
  discipline `comparison.ts` already used.
- **A stale comment in `compare.astro`** said eight rows say no. There are six.

### Still open, and still the owner's call

- **In-app support** stays unmarketed. The ledger excludes a service-response
  promise without owner-approved evidence, and no wording was supplied.
- **Recipe management** got no in-development row. RC-17/18/19 cover the
  deployed behavior; whether the upgrade is big enough to name is a product call.
- **The release ledger pin is still stale** (`6a29e88e` against `sandbox/demo`
  at `b858a483`). Deliberately not touched: the guard pins that SHA, and
  refreshing it is a release-owner decision, not an agent's. It must be
  refreshed before deployment.

### Corrections made after review, and one thing the owner has to decide

**RC-45 was written on a wrong reading of the branch, and the corrected version
matters.** The first draft said no Square, QuickBooks or Sage source exists on
`origin/sandbox/demo`. That was based on a filename grep whose only hits were
`usage*` files matching on the letters in "sage", which is not evidence of
anything. Re-run properly against source rather than paths:

- **QuickBooks really is unbuilt.** `quickbooks_integration` exists only as a
  key in the `ReleaseFeature` union and in the feature-override enum. No
  provider, no route, no job.
- **Sage really is unbuilt.** Not even a reserved feature-flag key.
- **Square is substantially built.** `src/lib/server/integrations/square/`
  (client, api, catalog targets, jobs, access), `/settings/integrations/square`
  including a catalog mapping screen, and OAuth callback plus webhook endpoints
  under `/api/integrations/square`.

Every Square execution path is gated on
`integrationExecutionAllowed(businessId, 'square_integration', env.FEATURE_SQUARE_INTEGRATION_ENABLED)`,
a deploy-time flag with a per-business override, defaulting off. So the
"Coming" cell is honest **only while that flag is off in production**. That is
not something a repository can answer.

> **Release owner:** before this deploys, confirm `FEATURE_SQUARE_INTEGRATION_ENABLED`
> is unset or false in the deployed environment and that no business carries an
> enabling row in `businessFeatureOverrides`. If Square is live for anyone, the
> Coming cell on /compare, /features and /pricing is a false statement in the
> wrong direction (underclaiming), and Square should move to Yes.

**The guard does not run on deploy.** `CLAUDE.md` says `check-landing-claims.mjs`
"fails the build if either primary drifts". It does not: `postbuild` runs
`check-dist.mjs` only, `vercel.json` sets no `buildCommand`, and there are no
GitHub workflows, so a Vercel deploy runs `pnpm build` and never touches the
claim guard. Every pin in that file, old and new, is currently local-only. The
one-line fix is to make `postbuild` run both scripts, but that changes what can
block a production deploy, so it is left as an owner decision rather than a
quiet edit.

**Also corrected after review:** `spell()` was moved out of `comparison.ts` into
`src/lib/words.ts`. Three surfaces that have nothing to do with the comparison
had started importing it, and `comparison.ts` documents itself as a file that
comes off the site together with /compare if RC-40 is withdrawn. The homepage
should not fail to build because a competitor page was retired. The anchor
scroll margin on /features went from `scroll-mt-24` to `scroll-mt-32`: the
sticky bar wraps to two rows (118px) between 640 and roughly 800, and 96px of
clearance was leaning on the heading's own top padding to stay visible. And one
misfit line contradicted itself, saying role gating exists and then that it does
not; it now says only what its source row says.

## 7. Follow-up, same day: /features was still a wall, /compare was unguided

The owner read the shipped `/features` and rejected it: "jumbo and huge, who has
time to go over all these." Correct, and the brief's workstream B was wrong
about the fix. B treated navigability as a wayfinding problem and answered it
with a sticky in-page sub-nav, which made a 145-item page scrollable without
making it readable. The owner also asked, twice, for the thing the earlier pass
had argued against: a dropdown, and a page per group of features.

### What changed

`/features` is now a hub over five area pages.

| Before | After |
| --- | --- |
| One page, 18 groups, 145 items, sticky sub-nav | `/features` hub: five cards, zero items |
| No per-area route | `/features/[section]`, five routes, 20 to 44 items each |
| "Every feature" flat header link | `Features` disclosure in the header, listing the five areas |
| Four groups titled "In development" | Real titles, Coming badges carrying their count |

The five areas are the `/compare` row-group titles verbatim, which the guard
already enforced; the split reuses that vocabulary rather than inventing a
second one. Slugs are TYPED in `SECTION_META`, not derived from the headings,
so rewording a heading cannot silently 404 every inbound link to a public URL.

The header control is `<details>`, not a hover mega-menu. That was the earlier
pass's stated objection to a dropdown and it was an objection to the wrong
thing: hover is the problem, disclosure is not. It opens on click and on Enter
at every width, closes on Escape (returning focus to the trigger) and on
click-away, and works with JavaScript off. It is visible from `sm` up; below
that the header budget is one link and Pricing owns it, and the hub itself is
the same five choices on a page.

### /compare

Owner: "more visibly guided? icons? space." Three changes.

1. A hairline mark beside the word in the CostCook column: a check, a dashed
   ring (the ticket motif at 12px), a rule. Both markup paths, the table and
   the phone card list.
2. The CostCook column is tinted cream the whole way down, so the eye has one
   anchor to run along across five separate tables.
3. Each group carries the same "Area n of five" eyebrow as the hub, and the
   competitor column headers now repeat "their pricing page" in every group.

That third one is the honesty fix, not a spacing fix. The legend defining
"Not listed" sits at the top of the page; by group four the reader has scrolled
past the only thing that says what the word means, and that is the one cell
whose meaning going fuzzy is a claim problem.

**The mark never travels.** It renders in the CostCook column and nowhere else.
A glyph beside "Not listed" would round a hedge about someone's pricing page
into a verdict about their product, which is exactly what RC-40's condition
forbids, and a glyph is copy. The columns look asymmetric on purpose. The pull
to tidy that up is the failure mode, so `check-landing-claims.mjs` now fails if
a competitor cell renders a mark, if either markup path loses one, or if the
mark ever ships without its word.

### Found while building

- `comparison.ts`'s own header still said there were "eight" `no` rows. There
  are six. `compare.astro` had been corrected in the previous pass and the data
  file had not.
- `Integrations.astro`'s header comment still carried the pre-correction RC-45
  claim that no Square code exists on `sandbox/demo`. It does; the claim rests
  on `FEATURE_SQUARE_INTEGRATION_ENABLED`. Comment and guard message both fixed.
- At 200% text on a 390px viewport, the `/compare` phone cards reached 410px in
  a 390px viewport and scrolled the page sideways. The fixed-width label column
  now wraps its value underneath instead.
- Two run-together sentences from JSX whitespace collapse ("worried about.Four",
  "see it run.Book 15 minutes").
- The area cards' Coming badge read as though a whole area were unbuilt. It
  carries the count now ("1 coming"), because four of the five things in that
  area ship today.

### Still the owner's call

Unchanged from §6: the Square flag in production, the guard not running on
deploy, the stale ledger pin.
