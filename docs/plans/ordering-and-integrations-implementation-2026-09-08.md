# Ordering and Integrations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put CostCook's own ordering capability on the site as one status-driven `Coming` feature, and stop the two third-party connections sharing a status they do not share. Nothing claims anything a caterer starting today cannot reach. (Revised 2026-09-08: the `/integrations` page this plan opened with is withdrawn. See the revision note below.)

**Architecture:** Two independent pieces. Piece 2 (`/integrations`) moves the two third-party connection groups out of `src/lib/features.ts` into `src/lib/integrations.ts` and renders them on a footer-linked page. Piece 1 (`src/lib/ordering.ts`) copies the `src/lib/labels.ts` precedent exactly: one exported status constant drives a per-surface copy object, and every public surface reads it so a single edit flips the whole site.

**Tech Stack:** Astro 7 (static, no adapter), Tailwind v4, TypeScript. Guards are plain Node ESM scripts under `scripts/`, run from `npm run build`'s `postbuild` chain.

**Spec:** `docs/plans/ordering-and-integrations-2026-09-08.md`

**Branch:** `develop`.

---

## REVISION 2026-09-08: Piece 2 is withdrawn

Executing Task 2 turned up what the spec and this plan both missed:
`src/components/sections/Integrations.astro` already exists and renders on
`/features/team-and-connections`, and its header comment records the decision
this plan tried to reverse, with reasons:

> WHY NOT A DEDICATED PAGE. Two Coming rows and one shipped argument is not a
> page; a page of nothing but Coming reads as a roadmap and costs trust with
> the exact reader this site is built for. It becomes its own route when there
> are four shipped connections to put on it, not before.

That section also leads with an argument this plan did not have: prices get in
with no connector at all, because the intake reads the paper the supplier
already sends, so Square and QuickBooks come second and read as additions
rather than as the answer.

`/compare` already carries the rows too: `Point of sale`, `Accounting` and
`An API to build against`, all `costcook: 'coming'`, with Parsley and meez
cells already researched. `Integrations.astro` reads two of them out of
`comparison.ts` rather than retyping them, and `check-landing-claims.mjs`
pins both to `coming` with the flag-not-branch check. The coupling this plan
proposed to build already exists.

**Tasks 1 to 6 are withdrawn.** They would have duplicated a section,
contradicted a documented decision, and broken the guard that keeps the
section and the table agreeing. `docs/stories/integrations.story.md` stays:
its Step 11 named the exact defect Task 2A now fixes.

**Task 2A replaces them**, below. **Tasks 7 to 12 stand unchanged**: CostCook's
own storefront and widget appear nowhere on the site, and "The day itself" is
still the right home for them.

---

## Task 2A: Stop flattening Square and QuickBooks into one status

RC-45 says the two are in genuinely different states: Square is BUILT and
gated behind a flag that defaults off, while QuickBooks is "genuinely unbuilt
... exists only as a key in the `ReleaseFeature` union ... there is no
provider, route or job anywhere under `src/`". Two live surfaces give them the
same status, and it is the softer one that is wrong.

`src/lib/availability.ts` already has the vocabulary for the distinction:
`comingDefinition` reads "Each feature names whether it is being built or is
already behind a release flag." Nothing on either surface uses that second
half.

**Files:**
- Modify: `src/lib/comparison.ts` (the `Point of sale` and `Accounting` row notes)
- Modify: `src/components/sections/Integrations.astro` (the heading and the framing paragraph)

- [ ] **Step 1: Separate the two notes in `comparison.ts`**

`costcook: 'coming'` does not change on either row; the guard pins it and it is
still true of the app a reader would start today. Only the notes change:

```ts
			{
				label: 'Point of sale',
				sheet: 'build',
				costcook: 'coming',
				note: 'Square is built and sits behind a release flag that is switched off, so nothing publishes to your till and no sale comes back today.',
				parsley: 'Business, $379',
				meez: 'Enterprise, custom'
			},
			{
				label: 'Accounting',
				sheet: 'build',
				costcook: 'coming',
				note: 'QuickBooks Online is not started. It is a reserved name in the app with nothing behind it yet, queued after Square.',
				parsley: NOT_LISTED,
				meez: 'Restaurant365 sync, $199/month plus setup fee'
			},
```

`costcook` stays ahead of `note` in the object literal, which matters: the
guard slices 220 characters from `label: 'Point of sale'` and requires
`costcook: 'coming'` inside that window.

- [ ] **Step 2: Stop the section saying both are being built**

In `src/components/sections/Integrations.astro`, the heading reads "Two
connections being built" and the paragraph under it reads "Coming means the
same here as it does on the comparison page: being built now, and not in the
app you would start today." Both assert active work on QuickBooks. Replace
them with:

```astro
			<h3 class="text-h3 font-semibold">Two connections, at two different distances</h3>
			<p class="mt-4 max-w-[62ch] text-ink-soft">
				Coming means the same here as it does on the comparison page: not in the app
				you would start today. It does not mean these two are at the same stage, and
				the lines below say which is which. There is no date on either, because a date
				is a promise and neither has earned one yet.
			</p>
```

- [ ] **Step 3: Build and confirm both surfaces moved together**

```bash
npm run build 2>&1 | tail -5 && npm run check:claims
grep -o "not started" dist/features/team-and-connections/index.html | head -1
grep -c "QuickBooks is being built" dist/compare/index.html dist/features/team-and-connections/index.html
```

Expected: both guards pass, the new wording appears on the feature area, and
zero hits for the old claim on either page.

- [ ] **Step 4: Commit**

```bash
git add src/lib/comparison.ts src/components/sections/Integrations.astro
git commit -m "fix(connections): Square is switched off, QuickBooks is not started, and they are not the same"
```

---

## Global Constraints

Copied verbatim from the spec and `CLAUDE.md`. Every task's requirements implicitly include this section.

- **No em-dashes in user-facing text.** Not in copy, not in data files that render copy.
- **No stock SaaS phrases.** No "in one click", no "seamlessly", no "automatically" without a named boundary.
- **"Kitchen Brain" never appears in prospect-facing copy.** It is the internal repo name only.
- **One primary CTA.** `cta` in `src/lib/site.ts` ("Start CostCook"). `/integrations` adds **no** `btn-primary`. Quiet secondaries are capped at two site-wide; this plan adds none.
- **Shipped-only rule in `src/lib/features.ts`:** "SHIPPED features only. PARTIAL, STUB, and internal tooling stay off the page until they ship."
- **`ORDERING_STATUS = 'coming'`** on the spec's evidence: `apps/ordering` has no Vercel project, `order.costcook.io` is NXDOMAIN, and `FEATURE_ORDERING_INTEGRATION_ENABLED` is unset in production, which `featureDefault()` reads as off for every workspace. Verified 2026-09-08.
- **The four `notClaimed` boundaries** may never be contradicted by any surface: a submission is *awaiting kitchen confirmation* and never a confirmed event; the browser submits selections **without prices** and the server calculates every amount; Stripe is a **handoff** with an explicit "payment not required" state; the widget protocol has five outbound states and **no inbound command**.
- **`/compare` is out of scope for this plan.** `src/lib/comparison.ts`'s header records RC-40's release check as "re-read both and update `VERIFIED_ON` before this ships or ships again". Adding one row obligates re-verifying every competitor cell against two living pricing pages, which is a research deliverable, not a copy change. No existing guard forces the row: the shared-status-to-compare requirement is written per-feature (a loop over the three hardcoded `comingPlans` keys at `check-landing-claims.mjs:352-357`, plus the labels-specific check at `:398`), never generically. So `orderingAvailability` ships with no compare row and nothing goes red. **Follow-up work, beginning with the re-verification.**
- **Test cycle.** This repo has **no unit-test runner** (no vitest, no jest; `package.json` holds only endpoint scripts and browser verifiers). The cycle for every task is: add the assertion to a guard script, run `npm run build`, observe the named failure, implement, run `npm run build`, observe pass. Do not go looking for a test framework.
- **Every new file carries a design-pattern note**: either `Pattern: / Why: / Alternative rejected:` or the refusal form `Considered <Pattern>; not used because …`. Match the surrounding files.
- **Every user-facing copy file carries a `story:` pointer** to its tracker in `docs/stories/`.

## Deviations from the spec, decided during planning

Three. Each is a correction, not a shortcut.

1. **Two groups move, not one.** The spec named only `accounting` ("Square and QuickBooks", `features.ts:437`). There is also `id: 'api'`, kicker "Ordering integrations", title "External ordering connections.", `status: 'in-development'`, same section. Both are third-party connection stories; both move to `/integrations`.
2. **`api` is renamed on the way out.** Its kicker is literally "Ordering integrations". After Piece 1 the word "ordering" means CostCook's own storefront, so leaving that name in place would give a reader two different "ordering" stories on two pages. It becomes **"The CostCook API"**, which is what the app's own settings card calls it. **Its claim level does not change**: it stays in development, still "Not included at launch".
3. **RC-45, not a new RC-60.** RC-45 already states the Square and QuickBooks claim precisely, including the flag-not-branch evidence rule and the release check. Minting RC-60 would duplicate it, which is the exact drift the ledger exists to prevent. `/integrations` rests on RC-45; the ledger gains **ownership** rows, not a new claim. **RC-59 is still minted, for ordering only.**

Two facts an executor would otherwise go hunting for:

- `grep -rn "featureId: 'api'\|featureId: 'accounting'" src/` returns **zero hits**. Neither group is referenced from `featureMenuSections`, so removing them cannot trip the `featureMenuHref` startup loop at the bottom of `features.ts`.
- `featureSections` computes `count` from **shipped groups only** (`.filter((group) => group.status !== 'in-development')`). Both groups being removed are `in-development`, so the five per-section counts and the `featureCount` sum that `check-landing-claims.mjs` asserts are **unchanged**. The section keeps two groups (`assistant`, `team`), so the `.filter((entry) => entry.groups.length > 0)` guard cannot drop it.

---

## File Structure

**Piece 2, `/integrations`:**

| File | Responsibility |
| --- | --- |
| `docs/stories/integrations.story.md` | Create. Story Tracker for the page's copy. |
| `src/lib/integrations.ts` | Create. The three connection entries as data, plus the page's shared copy. The only place a connection's status word lives. |
| `src/components/sections/IntegrationsPage.astro` | Create. Renders `src/lib/integrations.ts`. All markup, no claims of its own. |
| `src/pages/integrations.astro` | Create. Route shell: `Base` layout, title, description, direction contract. |
| `src/components/SiteNav.astro` | Modify. One new `<symbol id="resource-menu-connections">`. |
| `src/lib/site.ts` | Modify. One new `resourceNav` entry in the "Make the decision" group. |
| `src/lib/features.ts` | Modify. Remove the `api` and `accounting` groups; reword the section `blurb` and `lede` that promise them. |
| `src/lib/faq.ts` | Modify. The `integrations` answer points at the new page. |
| `scripts/check-integrations-page.mjs` | Create. Built-HTML contract guard. |
| `scripts/check-landing-claims.mjs` | Modify. New surfaces in `surfaceFiles`; the Square and QuickBooks status pins. |
| `scripts/verify-feature-parity.mjs` | Modify. One row in `routes` for viewport and console coverage. |
| `package.json` | Modify. Wire the new guard into `postbuild`. |
| `docs/release-claim-ledger.md` | Modify. Landing-page ownership rows for the new surface. |

**Piece 1, ordering:**

| File | Responsibility |
| --- | --- |
| `docs/stories/taking-orders.story.md` | Create. Story Tracker for the ordering copy. |
| `src/lib/ordering.ts` | Create. `ORDERING_STATUS`, `orderingAvailability`, `ordering`. The one place the status word lives. |
| `src/lib/features.ts` | Modify. One new group in "The day itself"; one new feature-menu item. |
| `src/lib/faq.ts` | Modify. One new answer. |
| `scripts/check-landing-claims.mjs` | Modify. Surface file, status pin, four forbidden-claim regexes. |
| `docs/release-claim-ledger.md` | Modify. RC-59 and its ownership row. |

**No `verify-integrations.mjs`.** The existing `verify-*.mjs` scripts are 200 to 400 line Chromium/CDP harnesses. `/integrations` is a short static page with no interaction, no motion and no captures, so a bespoke harness would be several hundred lines guarding nothing the static contract guard does not already reach. Viewport, console-error and failed-request coverage comes from adding one row to `verify-feature-parity.mjs`, which already drives exactly that sweep across five viewports.

---

## Task 0: Baseline

No files change. This exists so a later failure is attributable.

- [ ] **Step 1: Confirm the branch**

```bash
cd ~/kitchen-brain-landing
git status --short && git rev-parse --abbrev-ref HEAD
```

Expected: `develop`, and a clean tree apart from this plan file.

- [ ] **Step 2: Run the full build and record the result**

```bash
npm run build 2>&1 | tail -30
```

Expected: the build completes and every `check-*.mjs` in the `postbuild` chain prints its pass line, ending with the last one in the chain. If anything is red **stop and report it**; do not start Task 1 on a red baseline.

---

## Task 1: Story Tracker for the integrations page

The global story-content rule is that the tracker comes **before** a word of copy. The copy in Tasks 2 and 3 below is the **draft** this tracker validates: fill the tracker first, then write the copy, and let Step 11 (Revise and Finish) change the draft if it should.

**Files:**
- Create: `docs/stories/integrations.story.md`

**Interfaces:**
- Consumes: nothing.
- Produces: the path `docs/stories/integrations.story.md`, cited by the `story:` pointer in `src/lib/integrations.ts`.

- [ ] **Step 1: Read an existing tracker to copy its shape**

```bash
cat docs/stories/homepage-coming-plans.story.md
```

It has a `## My story` block (Piece, Title / headline, My hero's name, Content file(s)), a `## The 11 steps` table with `☒` marks, and one `### Step N` section per row.

- [ ] **Step 2: Write the tracker**

Same 11-step structure. The content that must appear:

- **Piece:** The connections page (`/integrations`)
- **Title / headline:** What CostCook connects to, and what it does not yet.
- **My hero's name:** The owner-caterer who already runs Square out front and pays a bookkeeper for QuickBooks
- **Content file(s):** `src/lib/integrations.ts`, `src/components/sections/IntegrationsPage.astro`, `src/pages/integrations.astro`
- **Step 1 (The Idea):** A caterer who already runs Square and QuickBooks wants to know whether CostCook joins them or becomes a third island, and the answer is buried inside a feature group he will never open.
- **Step 2 (Character):** Want, know whether this replaces double entry. Need, a straight answer about what is not built, so he can judge the rest of the site by how this page behaves. Wound, bought software on a roadmap item that never arrived. Flaw, reads "in development" as "soon".
- **Step 11 (Revise and Finish):** the ending is not a CTA. It is the sentence that says what a caterer does in the meantime, and it holds because it does not ask for anything.

- [ ] **Step 3: Commit**

```bash
git add docs/stories/integrations.story.md
git commit -m "docs(integrations): the story before the page"
```

---

## Task 2: `src/lib/integrations.ts`

**Files:**
- Create: `src/lib/integrations.ts`

**Interfaces:**
- Consumes: `comingDefinition` from `src/lib/availability.ts`.
- Produces:
  - `export type IntegrationStatus = 'in-development' | 'not-started'`
  - `export interface Integration { id: string; name: string; kicker: string; status: IntegrationStatus; lead: string; detail: string; notYet: string }`
  - `export const integrations: readonly Integration[]`
  - `export const integrationsPage: { title: string; heading: string; lede: string; statusHeading: string; closing: string; seoTitle: string; seoDescription: string }`

- [ ] **Step 1: Add the guard assertion first, so the build names what is missing**

Append to `scripts/check-landing-claims.mjs`, immediately **before** the `const forbiddenClaims = [` line (currently line 981):

```js
// RC-45. Square is built behind a flag that is off; QuickBooks is not started.
// The two words live in src/lib/integrations.ts and are pinned here, because
// the whole point of moving them onto their own page was to stop a reader
// meeting a softer version of this than the ledger carries.
const integrationsSource = surfaces[surfaceFiles.indexOf('src/lib/integrations.ts')];
requireText(integrationsSource, "id: 'square'", 'integrations Square entry');
requireText(integrationsSource, "id: 'quickbooks'", 'integrations QuickBooks entry');
requireText(integrationsSource, "id: 'api'", 'integrations CostCook API entry');
requireText(integrationsSource, 'Not included at launch.', 'integrations launch boundary');
if (/\b(connected to|reads from|writes to) your books\b/i.test(integrationsSource)) {
	failures.push('integrations: RC-45 forbids describing either connection as reaching a caterer books');
}
if (!/status: 'not-started'/.test(integrationsSource)) {
	failures.push('integrations: RC-45 says QuickBooks is not implemented; one entry must read not-started');
}
```

- [ ] **Step 2: Run the build and watch it fail**

```bash
npm run build 2>&1 | grep -A5 "Landing claim check failed"
```

Expected: FAIL. `surfaceFiles.indexOf` returns `-1` for a file not in the list, so `surfaces[-1]` is `undefined` and the run throws on `.includes`. That is the intended signal that Step 3 has not happened yet.

- [ ] **Step 3: Add the file to `surfaceFiles`**

In `scripts/check-landing-claims.mjs`, in the `surfaceFiles` array, directly after the `'src/lib/coming-plans.ts',` entry (line 88):

```js
	// The connections page's only data file. Public copy, so it goes through
	// the forbidden-claims scan, and its two status words are pinned above.
	'src/lib/integrations.ts',
```

- [ ] **Step 4: Write the file**

Create `src/lib/integrations.ts`:

```ts
/**
 * What CostCook connects to, as data. story: docs/stories/integrations.story.md
 *
 * WHY THIS IS ITS OWN FILE AND ITS OWN PAGE. These three lived inside two
 * feature groups in src/lib/features.ts, in a section a reader opens to learn
 * about the crew. A caterer who already runs Square out front and pays a
 * bookkeeper for QuickBooks asks this question early and directly, and the
 * answer he needs is a No with its edges, not a line item.
 *
 * WHAT MAY NOT BE SAID (RC-45). That either connection is in the app a visitor
 * would start today. That anything here reads from or writes to a caterer's
 * books. Any date at all: RC-45 says both carry none.
 *
 * THE TWO STATUSES ARE NOT THE SAME AND MAY NOT BE FLATTENED. Square is BUILT
 * and gated: the client, catalog jobs, settings routes, OAuth callback and
 * webhooks all exist in the app and every execution path runs through
 * `integrationExecutionAllowed(businessId, 'square_integration', ...)`, a
 * deploy-time flag that defaults off. QuickBooks is genuinely UNBUILT: it is a
 * key in the `ReleaseFeature` union and in the override enum, and there is no
 * provider, route or job behind it. Writing "both are being built" would be
 * false in one direction and misleading in the other.
 *
 * THE RELEASE CHECK IS THE FLAG, NEVER THE BRANCH. Confirm
 * FEATURE_SQUARE_INTEGRATION_ENABLED is unset or false in the deployed
 * environment and that no business carries an enabling row in
 * businessFeatureOverrides. If Square is on for anyone in production, this
 * file, /features and /pricing are all wrong together.
 *
 * Considered Strategy; not used because these are dated status facts rendered
 * by one page, not interchangeable behaviour selected at runtime.
 */
import { comingDefinition } from './availability';

export type IntegrationStatus = 'in-development' | 'not-started';

export interface Integration {
	id: string;
	name: string;
	kicker: string;
	status: IntegrationStatus;
	/** The scan line. Identical across all three on purpose: the answer is one word. */
	lead: string;
	/** What is actually true today, with the boundary in the same breath. */
	detail: string;
	/** What it will do when it lands. Never when. */
	notYet: string;
}

export const integrations: readonly Integration[] = [
	{
		id: 'square',
		name: 'Square',
		kicker: 'Point of sale',
		status: 'in-development',
		lead: 'Not included at launch.',
		detail:
			'The Square connection is built in the app and sits behind a release flag that is switched off, so nothing publishes to your point of sale and no sale comes back today. Built is not the same as available, and this is the distance between them.',
		notYet:
			'When the flag opens, approved dishes publish to your Square catalog and completed sales come back as evidence of what actually sold.'
	},
	{
		id: 'quickbooks',
		name: 'QuickBooks Online',
		kicker: 'Accounting',
		status: 'not-started',
		lead: 'Not included at launch.',
		detail:
			'This one is further back. QuickBooks Online exists in the app as a reserved name and nothing else: no connection, no export, no job behind it. It is queued behind Square rather than being worked on now.',
		notYet:
			'The intended shape is that supplier invoices you have already approved leave as QuickBooks bills for your bookkeeper to review. None of that is written yet.'
	},
	{
		id: 'api',
		name: 'The CostCook API',
		kicker: 'Your own systems',
		status: 'in-development',
		lead: 'Not included at launch.',
		detail:
			'A published way for an outside system, including whatever you use to take orders now, to read and write your kitchen records is being developed for a later release. Nothing outside CostCook can reach your records through it today.',
		notYet:
			'Until it lands, what leaves CostCook leaves the ways it already does: a purchase order as an email you can read before it sends, and your data as an export.'
	}
];

/**
 * The page's own words. Kept beside the data so a status change and the
 * sentence that frames it cannot be edited apart.
 *
 * NO PRIMARY CTA ON THIS PAGE. CLAUDE.md caps the site at one, and a page
 * whose entire subject is three things that do not work yet is the worst
 * place on the site to ask for a card.
 */
export const integrationsPage = {
	heading: 'What CostCook connects to, and what it does not yet.',
	lede: 'You already run something out front and someone already does your books. The honest answer today is that CostCook does not join either of them yet. Here is exactly where each one stands, because you should be able to judge the rest of this site by how straight this page is.',
	comingDefinition,
	statusHeading: 'Where each one actually stands',
	closing:
		'None of this is in the price, and none of it carries a date. What CostCook does today it does on its own: the menu, the costing, the shopping, the prep, the pack and what came through the back door. If that part is worth having on its own, the connections can arrive later without you having changed anything.',
	seoTitle: 'What CostCook connects to | Square, QuickBooks and the API',
	seoDescription:
		'Where the Square, QuickBooks Online and CostCook API connections actually stand today. Square is built behind a flag that is off, QuickBooks is not started, and none of it is in the app you would start today.'
} as const;
```

- [ ] **Step 5: Run the build and watch the guard pass**

```bash
npm run build 2>&1 | grep "Landing claim ledger"
```

Expected: `Landing claim ledger and public-copy guard passed.`

- [ ] **Step 6: Commit**

```bash
git add src/lib/integrations.ts scripts/check-landing-claims.mjs
git commit -m "feat(integrations): the three connections as data, with the two statuses kept apart"
```

---

## Task 3: The `/integrations` page and its way in

**Files:**
- Create: `src/components/sections/IntegrationsPage.astro`
- Create: `src/pages/integrations.astro`
- Modify: `src/components/SiteNav.astro` (one new `<symbol>`, after `resource-menu-contact` at line 124-126)
- Modify: `src/lib/site.ts` (one new `resourceNav` entry)

**Interfaces:**
- Consumes: `integrations`, `integrationsPage` from Task 2.
- Produces: the route `/integrations`; the DOM hooks `data-integration-status`, `id="integrations-heading"`, `id="where-each-stands"` that Task 5's guard asserts.

- [ ] **Step 1: Add the section component**

Create `src/components/sections/IntegrationsPage.astro`:

```astro
---
import { integrations, integrationsPage } from '../../lib/integrations';

// Considered Template Method; not used because this page is one fixed
// composition over a three-row table, not an algorithm with overridable steps.
// The status word is data (src/lib/integrations.ts); this file is markup only
// and makes no claim of its own.
const statusWord: Record<string, string> = {
	'in-development': 'Being built',
	'not-started': 'Not started'
};
---

<section class="container-page py-16 sm:py-24" aria-labelledby="integrations-heading">
	<p class="text-xs font-mono uppercase tracking-[0.18em] text-amber-deep">CONNECTIONS</p>
	<h1 id="integrations-heading" class="mt-3 max-w-3xl text-balance font-display text-4xl sm:text-5xl">
		{integrationsPage.heading}
	</h1>
	<p class="mt-6 max-w-2xl text-lg text-ink-soft">{integrationsPage.lede}</p>

	<h2 id="where-each-stands" class="mt-16 font-display text-2xl">{integrationsPage.statusHeading}</h2>
	<p class="mt-2 max-w-2xl text-sm text-ink-soft">{integrationsPage.comingDefinition}</p>

	<ul role="list" class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
		{
			integrations.map((entry) => (
				<li
					class="flex flex-col rounded border border-hairline bg-softamber/40 p-6"
					data-integration={entry.id}
				>
					<p class="text-xs font-mono uppercase tracking-[0.18em] text-ink-soft">{entry.kicker}</p>
					<h3 class="mt-2 font-display text-xl">{entry.name}</h3>
					<p
						class="mt-3 inline-flex w-fit items-center rounded-full border border-hairline px-3 py-1 text-xs font-medium text-ink-soft"
						data-integration-status={entry.status}
					>
						{statusWord[entry.status]}
					</p>
					<p class="mt-4 text-sm font-medium">{entry.lead}</p>
					<p class="mt-2 text-sm text-ink-soft">{entry.detail}</p>
					<p class="mt-4 border-t border-dashed border-hairline pt-4 text-sm text-ink-soft">
						{entry.notYet}
					</p>
				</li>
			))
		}
	</ul>

	<p class="mt-16 max-w-2xl text-lg">{integrationsPage.closing}</p>
</section>
```

- [ ] **Step 2: Add the route**

Create `src/pages/integrations.astro`:

```astro
---
import Base from '../layouts/Base.astro';
import IntegrationsPage from '../components/sections/IntegrationsPage.astro';
import { integrationsPage } from '../lib/integrations';

const directionContract = [
	'THESIS: Three connections that do not work yet, each with its own distance from working; refuse a single flattened "coming soon".',
	'OWN-WORLD: CostCook Kitchen Ticket paper, softamber fields, dashed ticket rules, mono micro-labels, ink type.',
	'STORY: A caterer who already runs Square and pays for QuickBooks asks whether this joins them, and gets the No with its edges.',
	'FIRST VIEWPORT: The heading and the straight answer; the three status cards begin below it.',
	'FORM: Code-led editorial route; one three-card ruled table, no motion, no captures, no primary CTA.',
	'FINISH: Navigation, no-JS, reduced motion, keyboard, 200% text, desktop, mobile, build contract and ledger all close.'
].join(' ');
---

<Base
	title={integrationsPage.seoTitle}
	description={integrationsPage.seoDescription}
	path="/integrations"
	directionContract={directionContract}
>
	<IntegrationsPage />
</Base>
```

- [ ] **Step 3: Add the menu icon symbol**

In `src/components/SiteNav.astro`, directly after the `resource-menu-contact` symbol block (which closes at line 126) and before `</defs>`:

```astro
			<symbol id="resource-menu-connections" viewBox="0 0 20 20">
				<circle cx="5.5" cy="10" r="2.25" /><circle cx="14.5" cy="5.5" r="2.25" /><circle cx="14.5" cy="14.5" r="2.25" /><path d="m7.6 8.9 4.8-2.4M7.6 11.1l4.8 2.4" />
			</symbol>
```

- [ ] **Step 4: Add the navigation entry**

In `src/lib/site.ts`, in the `resourceNav` array, directly after the `How we compare` entry and before `FAQ`:

```ts
	{
		label: 'What it connects to',
		href: '/integrations',
		header: 'resources',
		group: 'Make the decision',
		icon: 'connections',
		description: 'See where the Square, QuickBooks and API connections actually stand.'
	},
```

This entry flows into three places at once, by construction: `resourcesMenu.items` is `resourceNav`, the flat `nav` array spreads it, and `SiteFooter.astro` maps the whole of `nav`. No footer edit is needed.

- [ ] **Step 5: Build and open the page**

```bash
npm run build 2>&1 | tail -20
ls dist/integrations/index.html
```

Expected: build passes, the file exists. Then check the page in the running dev server:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:5173/integrations
```

Expected: `200`. If the dev server is not running, start it with `ASTRO_DEV_BACKGROUND=1 npx astro dev --port 5173` (Astro 7 otherwise detects an agent, forces `--background`, and times out at 30s while this project needs about 41s to come up).

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/IntegrationsPage.astro src/pages/integrations.astro src/components/SiteNav.astro src/lib/site.ts
git commit -m "feat(integrations): give the connection question its own page, and a way in"
```

---

## Task 4: Take the two groups out of the feature inventory

**Files:**
- Modify: `src/lib/features.ts` (remove the `api` group at lines 408-418 and the `accounting` group at lines 435-445; reword `SECTION_META['Team, and what it connects to']`)
- Modify: `src/lib/faq.ts` (the `integrations` answer, lines 183-189)

**Interfaces:**
- Consumes: `/integrations` from Task 3.
- Produces: nothing new. This task only removes and rewords.

- [ ] **Step 1: Delete the `api` group**

Remove this whole object from the `featureGroups` array:

```ts
	{
		id: 'api',
		section: 'Team, and what it connects to',
		kicker: 'Ordering integrations',
		title: 'External ordering connections.',
		status: 'in-development',
		items: [
			{ lead: 'Not included at launch.', detail: 'External ordering connections are being developed for a later release.' }
		]
	},
```

- [ ] **Step 2: Delete the `accounting` group**

Remove this whole object, the last entry in `featureGroups`. Take the trailing comma on the `assistant` group with it so the array still parses:

```ts
	{
		id: 'accounting',
		section: 'Team, and what it connects to',
		kicker: 'Accounting & point of sale',
		title: 'Square and QuickBooks.',
		status: 'in-development',
		items: [
			{ lead: 'Not included at launch.', detail: 'Square and QuickBooks connections are being built. Until they land, nothing here reads from or writes to your books.' }
		]
	}
```

- [ ] **Step 3: Reword the section blurb and lede**

Both currently promise the groups that just left. In `SECTION_META`, replace the `'Team, and what it connects to'` entry's `blurb` and `lede`:

```ts
	'Team, and what it connects to': {
		slug: 'team-and-connections',
		blurb: 'Who can change what, and how a new kitchen gets from empty to a first costed order.',
		wall: 'The kitchen is empty on Monday and there is a job on Saturday. Everything in here is the distance between those two.',
		lede: 'Everything around the edges: getting a kitchen from empty to a first costed order, who on the crew can change what, and how the app behaves on a phone with one bar. What CostCook connects to is its own question, answered in full on the <a href="/integrations">connections page</a>.'
	}
```

Note `blurb` loses "and the connections being built" and `lede` loses "The connection work in this section is still being built and is marked Coming rather than folded into the shipped list." Both sentences become false the moment the groups leave.

- [ ] **Step 4: Point the FAQ answer at the new page**

In `src/lib/faq.ts`, replace the `integrations` entry's `answer` (line 185-187), leaving `claims` unchanged:

```ts
				answer: [
					'Not in the app you would start today. Square is built behind a release flag that is off, QuickBooks Online is not started, and an API is being developed for a later release. None of the three carries a date. The <a href="/integrations">connections page</a> says where each one stands.'
				],
```

- [ ] **Step 5: Build**

```bash
npm run build 2>&1 | tail -20
```

Expected: pass. The section counts do not move (both removed groups were `in-development`, and `count` filters those out), the section keeps its `assistant` and `team` groups so it is not dropped, and no `featureMenuSections` item pointed at either id.

- [ ] **Step 6: Confirm the old claims are gone from the built feature area**

```bash
grep -c "Square and QuickBooks\|External ordering connections" dist/features/team-and-connections/index.html || echo "0 (expected)"
grep -o "connections page" dist/features/team-and-connections/index.html | head -1
```

Expected: zero hits for the old titles, one hit for the new crosslink.

- [ ] **Step 7: Commit**

```bash
git add src/lib/features.ts src/lib/faq.ts
git commit -m "refactor(features): the connection question leaves the crew section for its own page"
```

---

## Task 5: Guards for `/integrations`

**Files:**
- Create: `scripts/check-integrations-page.mjs`
- Modify: `package.json` (the `postbuild` chain)
- Modify: `scripts/verify-feature-parity.mjs` (the `routes` array, line 9-13)

**Interfaces:**
- Consumes: the DOM hooks from Task 3, the data file from Task 2.
- Produces: a guard that fails the build if the page drifts from the ledger.

- [ ] **Step 1: Write the guard**

Create `scripts/check-integrations-page.mjs`:

```js
import { readFile } from 'node:fs/promises';

// The connections page contract. The thing this guard exists for is that the
// two statuses stay apart: Square is built and gated, QuickBooks is not
// started, and the page may never flatten them into one "coming soon" or let
// either read as reaching a caterer's books (RC-45).
const pagePath = new URL('../dist/integrations/index.html', import.meta.url);
const featuresAreaPath = new URL('../dist/features/team-and-connections/index.html', import.meta.url);
const integrationsSource = await readFile(new URL('../src/lib/integrations.ts', import.meta.url), 'utf8');
const faqSource = await readFile(new URL('../src/lib/faq.ts', import.meta.url), 'utf8');
const [html, featuresAreaHtml] = await Promise.all([
	readFile(pagePath, 'utf8'),
	readFile(featuresAreaPath, 'utf8')
]);

const required = [
	'id="integrations-heading"',
	'id="where-each-stands"',
	'data-integration="square"',
	'data-integration="quickbooks"',
	'data-integration="api"',
	'data-integration-status="in-development"',
	'data-integration-status="not-started"',
	'Not included at launch.',
	'behind a release flag that is switched off',
	'reserved name and nothing else',
	'href="/integrations"'
];
const missing = required.filter((fragment) => !html.includes(fragment));
if (missing.length > 0) throw new Error(`Integrations page build is missing: ${missing.join(', ')}`);

// Three cards, no more and no fewer. A fourth connection is a ledger question
// before it is a markup one.
if ((html.match(/data-integration="/g) ?? []).length !== 3) {
	throw new Error('Integrations page must render exactly three connections.');
}
// Exactly one may read not-started: RC-45 says QuickBooks alone is unbuilt.
if ((html.match(/data-integration-status="not-started"/g) ?? []).length !== 1) {
	throw new Error('Integrations page: RC-45 puts exactly one connection at not-started.');
}

const forbidden = [
	[/\bavailable now\b/i, 'an availability claim RC-45 denies'],
	[/\b(connected to|reads from|writes to) your books\b/i, 'a connection to a caterer books'],
	[/\b(coming|available|ships?|lands?|arrives?) (in|by|this|next) \b/i, 'a date, which RC-45 says neither connection carries'],
	[/\bsandbox(?:\/demo| build)\b/i, 'internal provenance'],
	[/\bkitchen brain\b/i, 'the internal repo name in prospect-facing copy']
];
for (const [pattern, label] of forbidden) {
	if (pattern.test(html)) throw new Error(`Integrations page carries ${label}: ${pattern}`);
}

// One primary CTA per site, and this is not the page that carries it.
if (html.includes('btn-primary')) {
	throw new Error('Integrations page must not carry a primary CTA; CLAUDE.md caps the site at one.');
}

// The groups left features.ts for this page. If either claim came back, the
// reader now meets it in two places with two different statuses.
for (const stale of ['Square and QuickBooks.', 'External ordering connections.']) {
	if (featuresAreaHtml.includes(stale)) {
		throw new Error(`The feature area still carries "${stale}"; it belongs to /integrations now.`);
	}
}
if (!featuresAreaHtml.includes('href="/integrations"')) {
	throw new Error('The crew feature area must send the connection question to /integrations.');
}
if (!faqSource.includes('href="/integrations"')) {
	throw new Error('The FAQ integrations answer must point at /integrations.');
}
if (!integrationsSource.includes('docs/stories/integrations.story.md')) {
	throw new Error('src/lib/integrations.ts must carry its story pointer.');
}

// Considered Strategy; not used because this guard validates one stable page
// contract and has no interchangeable validation algorithms.
console.log('Connections page contract passed.');
```

- [ ] **Step 2: Wire it into `postbuild`**

In `package.json`, append to the end of the `postbuild` value (it is one long `&&` chain; the last entry is currently `node scripts/check-onboarding-page.mjs`):

```
 && node scripts/check-integrations-page.mjs
```

A guard that is not in this chain runs nowhere.

- [ ] **Step 3: Add the viewport row**

In `scripts/verify-feature-parity.mjs`, add to the `routes` array (after the `team` entry on line 12):

```js
	{ slug: 'integrations', path: '/integrations', h1: 'What CostCook connects to, and what it does not yet.', selector: '[data-integration]', count: 3 }
```

This gives the page the same five-viewport sweep, console-error check and failed-request check the three feature routes get, without a bespoke harness.

- [ ] **Step 4: Prove the guard actually fails**

Temporarily break the page, confirm the guard catches it, then restore:

```bash
sed -i "s/id=\"where-each-stands\"/id=\"where-each-stands-BROKEN\"/" src/components/sections/IntegrationsPage.astro
npm run build 2>&1 | grep "Integrations page build is missing"
git checkout src/components/sections/IntegrationsPage.astro
```

Expected: the grep prints the missing-fragment error. A guard never observed failing is not a guard.

- [ ] **Step 5: Build clean**

```bash
npm run build 2>&1 | grep "Connections page contract passed"
```

Expected: the pass line.

- [ ] **Step 6: Run the viewport sweep**

```bash
npm run build && npm run preview -- --port 4321 &
sleep 5
node scripts/verify-feature-parity.mjs
```

Expected: it reports the integrations route alongside the three existing ones, with no console errors and no failed requests. If Chromium is unavailable in this environment, record that and move on; the static contract guard is the blocking one.

- [ ] **Step 7: Commit**

```bash
git add scripts/check-integrations-page.mjs scripts/verify-feature-parity.mjs package.json
git commit -m "test(integrations): pin the page contract, and keep the two statuses apart"
```

---

## Task 6: The ledger owns the new surface

**Files:**
- Modify: `docs/release-claim-ledger.md` (the `## Landing-page ownership` table, and the two rows that go stale)

**Interfaces:**
- Consumes: nothing.
- Produces: the ownership rows `check-landing-claims.mjs` reads when an FAQ answer names `RC-45`.

- [ ] **Step 1: Add the ownership row**

In the `## Landing-page ownership` table, after the `Feature areas (/features/[section])` row:

```
| Connections (`/integrations`, `src/lib/integrations.ts`, the Resources menu and footer entry, the FAQ `integrations` answer) | RC-45 for all three statuses, the no-date rule and the release check. The page states Square as built behind a flag that is off and QuickBooks as not started; RC-45's evidence paragraph carries both, and flattening them into one status is the failure this surface guards against. |
```

- [ ] **Step 2: Correct the two rows that just went stale**

The row `Feature areas (/features/[section])` currently reads "...RC-45 for the Coming integration groups and RC-46/RC-49 for shipped Sage". Those groups are gone. Replace that row's claims cell with:

```
Every RC the group items rest on, unchanged by the 2026-08-23 split; RC-46/RC-49 for shipped Sage. The Coming integration groups moved to `/integrations` on 2026-09-08; RC-45 is owned there now.
```

The row `What it connects to` describes a homepage section resting on RC-09, RC-38, RC-39 and RC-45. Confirm whether that section still names Square or QuickBooks:

```bash
grep -rn "Square\|QuickBooks" src/components/sections/ || echo "no component names either"
```

If nothing names them, drop `RC-45` from that row's claims cell. If something does, leave the row alone and report which component.

- [ ] **Step 3: Commit**

```bash
git add docs/release-claim-ledger.md
git commit -m "docs(ledger): RC-45 moves to the page that now answers for it"
```

**Piece 2 is complete and shippable here.** Everything above stands on its own: it corrects a claim that is already live and depends on nothing below.

---

## Task 7: Story Tracker for the ordering copy

Same rule as Task 1: the tracker comes before the copy. The copy in Task 8 is the draft it validates.

**Files:**
- Create: `docs/stories/taking-orders.story.md`

**Interfaces:**
- Consumes: nothing.
- Produces: the path cited by the `story:` pointer in `src/lib/ordering.ts`.

- [ ] **Step 1: Write the tracker**

Same 11-step structure as `docs/stories/integrations.story.md`. The content that must appear:

- **Piece:** Taking orders (the `Coming` feature group and its FAQ answer)
- **Title / headline:** The order arrives the way you would have written it down.
- **My hero's name:** The owner-caterer taking Saturday's order over the phone with wet hands
- **Content file(s):** `src/lib/ordering.ts`, `src/lib/features.ts`, `src/lib/faq.ts`
- **Step 1 (The Idea):** A caterer wants the enquiry to arrive as something he can quote from, but every order still comes as a phone call he transcribes twice and a text he cannot find on Friday.
- **Step 2 (Character):** Want, stop re-typing the enquiry. Need, to be told plainly that this is built and unreachable, so he does not choose CostCook for it and then wait. Wound, chose a product for a screenshot of something that never shipped. Flaw, hears "built" as "available".
- **Step 8 (Cool Talk):** the one line of snap is the boundary, not the feature: an order that arrives is still an order you have to say yes to.
- **Step 11 (Revise and Finish):** the ending is the word Coming, and it has to be the least ambiguous word on the page.

- [ ] **Step 2: Commit**

```bash
git add docs/stories/taking-orders.story.md
git commit -m "docs(ordering): the story before the claim"
```

---

## Task 8: `src/lib/ordering.ts`

**Files:**
- Create: `src/lib/ordering.ts`

**Interfaces:**
- Consumes: `Verdict` type from `src/lib/comparison.ts` (type-only import, the way `src/lib/labels.ts` does it).
- Produces:
  - `export const ORDERING_STATUS: Verdict`
  - `export const orderingStatusWord: string`
  - `export const orderingAvailability: { isComing: boolean; verdict: Verdict; word: string; featureLead: string; featureDetail: string; menuDescription: string; faqStatus: readonly string[] }`
  - `export const ordering: { name: string; verified: { sha: string; branch: string; on: string }; modes: readonly { lead: string; detail: string }[]; stages: readonly string[]; notClaimed: readonly string[] }`

- [ ] **Step 1: Add the status pin to the claims guard first**

In `scripts/check-landing-claims.mjs`, immediately after the labels block (the `printerRow` check that currently ends at line 400):

```js
// Ordering: built in the app, deployed nowhere, marked Coming (RC-59). The one
// word lives in src/lib/ordering.ts and is pinned here until the ledger row
// changes with it. The evidence is the deployment, not the branch: there is no
// Vercel project for the storefront, order.costcook.io does not resolve, and
// FEATURE_ORDERING_INTEGRATION_ENABLED is unset in production, which
// featureDefault() reads as off for every workspace.
const orderingSource = surfaces[surfaceFiles.indexOf('src/lib/ordering.ts')];
if (!/ORDERING_STATUS = 'coming'/.test(orderingSource)) {
	failures.push('ordering status: RC-59 says the storefront is not deployed; ORDERING_STATUS must read coming until the ledger row changes');
}
requireText(orderingSource, 'awaiting kitchen confirmation', 'ordering copy carries the confirmation boundary');
requireText(orderingSource, 'without prices', 'ordering copy carries the price-authority boundary');
requireText(orderingSource, 'no inbound command', 'ordering copy carries the widget protocol boundary');
```

And add the file to `surfaceFiles`, directly after the `'src/lib/integrations.ts',` entry added in Task 2:

```js
	// The ordering status word and every sentence that reads it. Public copy,
	// and the highest-risk claim on the site: the capability is built and
	// unreachable, which is the exact shape a reader rounds up.
	'src/lib/ordering.ts',
```

- [ ] **Step 2: Run the build and watch it fail**

```bash
npm run build 2>&1 | grep -A5 "Landing claim check failed"
```

Expected: FAIL, because `src/lib/ordering.ts` does not exist yet and `read()` throws on it.

- [ ] **Step 3: Write the file**

Create `src/lib/ordering.ts`:

```ts
/**
 * Taking orders, as data. story: docs/stories/taking-orders.story.md
 *
 * BUILT, AND REACHABLE BY NOBODY. Read off kitchen-brain `develop` on
 * 2026-09-08: `apps/ordering` is a complete standalone storefront (no
 * database, no auth, no internal imports, five stages) and
 * `packages/widget-loader` is a dependency-free IIFE under a 12 KiB budget
 * that mounts a sandboxed iframe. Both are documented in that repo's
 * docs/architecture/. Neither is deployed.
 *
 * THE EVIDENCE IS THE DEPLOYMENT, NOT THE BRANCH. Three checks, all run
 * 2026-09-08: `vercel project ls` returns three projects and none of them is
 * the storefront; `order.costcook.io`, the canonical origin named in the
 * architecture doc, is NXDOMAIN; and `FEATURE_ORDERING_INTEGRATION_ENABLED`
 * is absent from the app's production environment, which `featureDefault()`
 * reads as off for every workspace. A caterer who starts a trial today cannot
 * take an order. That sentence is why the word below is `coming`.
 *
 * WHAT MAY NOT BE SAID. Four boundaries, each traced to the app's own
 * architecture documents, each a sentence no surface may contradict:
 *
 *  1. A submission is described as awaiting kitchen confirmation, and is never
 *     a confirmed event. The hosted app is deliberate about this; the landing
 *     page may not upgrade it.
 *  2. The browser sends menu, item, portion and modifier selections without
 *     prices. The server re-resolves publication and availability and computes
 *     every amount. No surface may suggest a customer's browser knows a price.
 *  3. Stripe is a handoff. The hosted app has an explicit state saying no
 *     online charge and no confirmation occurred, so no surface may turn this
 *     into a promise about money reaching a caterer.
 *  4. The widget protocol has five outbound states and no inbound command: no
 *     navigation, HTML, script, customer-contact or payment payload crosses
 *     into the frame. Approved embed origins are defence in depth, not
 *     authorization.
 *
 * FLIPPING THE WORD. When a Vercel project exists for the storefront, DNS
 * resolves, the flag is on, and one real order has been placed end to end, set
 * ORDERING_STATUS to 'yes' here and update RC-59 in the same commit. The
 * feature group's status and the menu chip both read it, so they cannot
 * disagree. The claim guard pins the word until the ledger row changes.
 *
 * NOT YET HERE, AND ON PURPOSE: no `comparisonNote` and no `seoDescription`.
 * A /compare row obligates re-verifying two competitors' living pricing pages
 * against VERIFIED_ON (RC-40), and a dedicated page obligates captures of a
 * storefront nobody can reach. Both arrive with the deployment, not before.
 *
 * No pattern: a table the sections render.
 */
import type { Verdict } from './comparison';

export const ORDERING_STATUS = 'coming' as Verdict;

export const orderingStatusWord = ORDERING_STATUS === 'yes' ? 'Available now' : 'Coming';
const orderingIsComing = ORDERING_STATUS !== 'yes';

/** One status flip, with each public surface receiving copy for its own job. */
export const orderingAvailability = {
	isComing: orderingIsComing,
	verdict: ORDERING_STATUS,
	word: orderingStatusWord,
	featureLead: orderingIsComing ? 'Built, not deployed, marked Coming.' : 'Available now.',
	featureDetail: orderingIsComing
		? 'A customer picks from the menu you published, sizes the choices, gives you the date and the headcount, leaves their contact, and reads it back before sending. It arrives awaiting kitchen confirmation, which means you still say yes to it. The storefront and the embeddable widget are built and are not deployed anywhere a customer could reach, so this stays marked Coming.'
		: 'A customer picks from the menu you published, sizes the choices, gives you the date and the headcount, leaves their contact, and reads it back before sending. It arrives awaiting kitchen confirmation, which means you still say yes to it.',
	menuDescription: orderingIsComing
		? 'A storefront and an embeddable widget, built and not yet deployed.'
		: 'Take the enquiry on your own page or on your own site.',
	faqStatus: orderingIsComing
		? [
				'Not in the app you would start today. The storefront and the widget are built and are not deployed anywhere a customer could reach them, so this stays marked Coming and carries no date.',
				'When it lands, a customer picks from a menu you published, sizes the choices, gives you the date, the headcount and their contact, and reads it back before sending. What arrives is awaiting kitchen confirmation rather than a booked event, and you still say yes to it. Every price is worked out by CostCook after the selections arrive; the customer’s browser sends what they chose without prices and never a number of its own. Card details are a handoff to Stripe, and the app says plainly when no online charge happened.'
			]
		: [
				'Yes. A customer picks from a menu you published, sizes the choices, gives you the date, the headcount and their contact, and reads it back before sending. What arrives is awaiting kitchen confirmation rather than a booked event, and you still say yes to it.',
				'Every price is worked out by CostCook after the selections arrive; the customer’s browser sends what they chose without prices and never a number of its own. Card details are a handoff to Stripe, and the app says plainly when no online charge happened.'
			]
} as const;

export const ordering = {
	name: 'Taking orders',
	/** Provenance stays here and in the ledger, never in public capture labels. */
	verified: { sha: 'develop', branch: 'develop', on: '2026-09-08' },
	modes: [
		{
			lead: 'A page of your own.',
			detail: 'A hosted storefront on its own address, separate from the app, holding no login and no database of its own.'
		},
		{
			lead: 'Or a piece of your site.',
			detail: 'One small script that mounts a sandboxed frame on a site you already have. It is under 12 KiB and pulls in nothing else.'
		}
	],
	stages: ['Menu', 'Choices', 'Event', 'Contact', 'Review'],
	/** The four boundaries, in the words a surface would have to keep. */
	notClaimed: [
		'What arrives is awaiting kitchen confirmation. It is not a booked event and nothing on the site may say it is.',
		'The browser sends the selections without prices. CostCook re-reads what is published and available and works out every amount.',
		'Stripe is a handoff, and the app states plainly when no online charge and no confirmation happened.',
		'The widget speaks five states outward and takes no inbound command: nothing navigates, injects or reaches into the frame.',
		'None of this is in the subscription a caterer would start today.'
	]
} as const;
```

- [ ] **Step 4: Run the build and watch the guard pass**

```bash
npm run build 2>&1 | grep "Landing claim ledger"
```

Expected: `Landing claim ledger and public-copy guard passed.`

- [ ] **Step 5: Commit**

```bash
git add src/lib/ordering.ts scripts/check-landing-claims.mjs
git commit -m "feat(ordering): one status word, and the four things it may never say"
```

---

## Task 9: Ordering on `/features`

The lockstep requirement from the spec lives here. `featureMenuHref` throws if a menu item is marked `coming` while its group has shipped, and the loop at the bottom of `features.ts` runs it for every item at module load, so a mismatch fails the build rather than shipping. **Both** the group's `status` and the menu item's `coming` flag must derive from `orderingAvailability.isComing`; hardcoding either makes the flip decorative and breaks the build the day it happens.

**Files:**
- Modify: `src/lib/features.ts` (import, one group, one menu item)

**Interfaces:**
- Consumes: `orderingAvailability` from Task 8.
- Produces: the feature id `ordering`, reachable at `/features/the-day-itself#features-ordering` through `featureMenuHref`'s section-anchor fallback (it takes no entry in `dedicatedFeatureRoutes`, because a dedicated page would need captures of a storefront nobody can reach).

- [ ] **Step 1: Import the availability object**

At the top of `src/lib/features.ts`, beside the existing two imports:

```ts
import { SAGE_STATUS } from './sage';
import { labelsAvailability } from './labels';
import { orderingAvailability } from './ordering';
```

- [ ] **Step 2: Add the group**

In the `featureGroups` array, as the last entry of the "The day itself" section (place it directly before the group whose `section` is `'Compliance and labels'`, so the array still reads in section order):

```ts
	{
		id: 'ordering',
		section: 'The day itself',
		kicker: 'Taking orders',
		title: 'The enquiry, arriving as something you can quote from.',
		// Status is read from src/lib/ordering.ts, the one place it may change
		// (RC-59). Hardcoding it here would let the menu chip and this badge
		// disagree the day the storefront is deployed.
		status: orderingAvailability.isComing ? 'in-development' : 'available',
		items: [
			{ lead: orderingAvailability.featureLead, detail: orderingAvailability.featureDetail }
		]
	},
```

- [ ] **Step 3: Add the menu item**

In `featureMenuSections`, in the `'Run the event'` group, after the `Purchasing & receiving` item:

```ts
			// The chip and the destination both read the group's status, so this
			// item cannot say Coming after the area page stops saying it, or the
			// reverse. featureMenuHref throws on that mismatch at module load.
			{
				label: 'Taking orders',
				description: orderingAvailability.menuDescription,
				featureId: 'ordering',
				icon: 'orders',
				...(orderingAvailability.isComing ? { coming: true as const } : {})
			},
```

- [ ] **Step 4: Prove the lockstep guard is real**

Temporarily hardcode the group as shipped while the menu item still says Coming, and watch the build refuse it:

```bash
sed -i "s/status: orderingAvailability.isComing ? 'in-development' : 'available',/status: 'available',/" src/lib/features.ts
npm run build 2>&1 | grep "marks ordering as coming"
git checkout src/lib/features.ts
```

Expected: `Feature menu marks ordering as coming, but the group has shipped. Drop the chip.` Then re-apply Steps 1 to 3. If the grep prints nothing, the two are not actually coupled and Steps 2 and 3 are wrong.

- [ ] **Step 5: Build and confirm the page**

```bash
npm run build 2>&1 | tail -20
grep -o 'id="features-ordering"' dist/features/the-day-itself/index.html
grep -c "Taking orders" dist/features/index.html
```

Expected: build passes; the anchor exists on the area page; the label appears on the hub.

The per-section counts do not move: the new group is `in-development`, and `count` filters those out. `comingCount` for "The day itself" goes from 1 to 2.

- [ ] **Step 6: Commit**

```bash
git add src/lib/features.ts
git commit -m "feat(features): taking orders joins the day itself, marked Coming from one word"
```

---

## Task 10: The FAQ answer and RC-59

**Files:**
- Modify: `src/lib/faq.ts` (one new entry in the `fit` group)
- Modify: `docs/release-claim-ledger.md` (RC-59 and its ownership row)

**Interfaces:**
- Consumes: `orderingAvailability.faqStatus` from Task 8.
- Produces: RC-59, which `check-landing-claims.mjs` requires to exist because the new answer's `claims` names it.

- [ ] **Step 1: Write the ledger row first**

The guard fails an answer whose claim row does not exist, so the row comes first. In `docs/release-claim-ledger.md`, after the RC-58 row:

```
| RC-59 | CostCook has a customer-facing ordering capability, a hosted storefront and an embeddable widget, which is BUILT and NOT DEPLOYED, is not in the app a visitor would start today, and carries no date. A submission is awaiting kitchen confirmation and never a confirmed event. The customer's browser submits menu, item, portion and modifier selections WITHOUT PRICES; the server re-resolves publication and availability and computes every amount. Stripe is a handoff, and the hosted app carries an explicit state saying no online charge and no confirmation occurred. The widget protocol has five outbound states and no inbound command. | Owner-approved release boundary | Read off kitchen-brain `develop` 2026-09-08: `apps/ordering` (standalone SvelteKit, no database, no auth, five stages), `packages/widget-loader` (dependency-free IIFE, 12 KiB budget, sandboxed iframe), `src/routes/settings/ordering/{,site,stripe/refresh}`, and the two architecture documents `docs/architecture/hosted-ordering.md` and `docs/architecture/ordering-widget.md`, which are the source of all four boundaries above. THE CLAIM RESTS ON THE DEPLOYMENT, NOT THE BRANCH. Three checks, 2026-09-08: `vercel project ls` returns `kitchen-brain-landing`, `kitchen-brain-demo` and `kitchen-brain` and no ordering project; `order.costcook.io`, the canonical origin named in the architecture doc, is NXDOMAIN, as are `ordering.` and `orders.`; `vercel env ls production --project kitchen-brain` contains no `FEATURE_ORDERING_INTEGRATION_ENABLED`, and `featureDefault()` in `src/lib/server/features/access.ts` returns true only for the strings `true` or `1`, so an unset variable is off for every workspace. | RELEASE OWNER MUST CHECK THE DEPLOYMENT, not the branch: confirm a Vercel project exists for `apps/ordering`, that `order.costcook.io` resolves to it, that `FEATURE_ORDERING_INTEGRATION_ENABLED` is set in the deployed environment, and that one real order has been placed end to end. Until all four are true, `ORDERING_STATUS` stays `coming`. When they are, flip the word and update this row in the same commit. |
```

- [ ] **Step 2: Add the ownership row**

In the `## Landing-page ownership` table, after the Connections row from Task 6:

```
| Taking orders (`src/lib/ordering.ts`, the feature menu item, the `/features` group, the FAQ `ordering` answer) | RC-59 for the built-not-deployed boundary, the Coming word, and all four of the confirmation, price-authority, Stripe-handoff and widget-protocol boundaries. One status word, `src/lib/ordering.ts`. |
```

- [ ] **Step 3: Add the FAQ answer**

In `src/lib/faq.ts`, add the import beside the existing ones:

```ts
import { orderingAvailability } from './ordering';
```

Then add this entry to the `fit` group, directly after the `integrations` entry:

```ts
			{
				id: 'ordering',
				question: 'Can customers order from me through CostCook?',
				answer: orderingAvailability.faqStatus,
				claims: ['RC-59']
			},
```

- [ ] **Step 4: Prove the ledger coupling**

```bash
sed -i "s/claims: \['RC-59'\]/claims: ['RC-99']/" src/lib/faq.ts
npm run build 2>&1 | grep "RC-99"
git checkout src/lib/faq.ts
```

Expected: the guard names RC-99 as a claim with no ledger row. Then re-apply Step 3.

- [ ] **Step 5: Build**

```bash
npm run build 2>&1 | tail -20
grep -c "Can customers order from me through CostCook?" dist/faq/index.html
```

Expected: build passes, one hit.

- [ ] **Step 6: Commit**

```bash
git add src/lib/faq.ts docs/release-claim-ledger.md
git commit -m "docs(ordering): RC-59, and the answer that rests on it"
```

---

## Task 11: The four forbidden claims

These guard the specific lies this feature makes easy. They run against `publicCopy`, which is every file in `surfaceFiles` concatenated, **comments included**. So the boundary comments in `src/lib/ordering.ts` were written to state each rule without containing the phrase it forbids; keep it that way when editing them.

**Files:**
- Modify: `scripts/check-landing-claims.mjs` (the `forbiddenClaims` array)

**Interfaces:**
- Consumes: everything above.
- Produces: nothing.

- [ ] **Step 1: Add the four patterns**

In `scripts/check-landing-claims.mjs`, at the end of the `forbiddenClaims` array (after the named-spreadsheet-product entry):

```js
	// RC-59. The four sentences an ordering feature makes it easy to write and
	// impossible to defend on a demo call.
	[/\bconfirms? the (order|booking) automatically\b/i, 'automatic order confirmation (RC-59: a submission awaits kitchen confirmation)'],
	[/\b(gets?|getting) you paid\b/i, 'a payment promise (RC-59: Stripe is a handoff, and the app states when no charge occurred)'],
	[/\bcustomers? sees? (the|their|a) price\b[^.]{0,40}\binstantly\b/i, 'a price computed in the browser (RC-59: selections travel without prices)'],
	[/\btakes? orders? while you (sleep|cook)\b/i, 'the stock automation promise the confirmation gate contradicts'],
```

- [ ] **Step 2: Prove each one fires**

Four checks. Each writes a forbidden sentence into a scanned surface, confirms the guard names it, and reverts:

```bash
for phrase in "It confirms the order automatically." "It gets you paid." "Your customer sees the price instantly." "It takes orders while you sleep."; do
  cp src/lib/ordering.ts /tmp/ordering.bak
  printf '\n// %s\n' "$phrase" >> src/lib/ordering.ts
  npm run check:claims 2>&1 | grep -c "forbidden" | xargs -I{} echo "$phrase -> {} failure(s)"
  cp /tmp/ordering.bak src/lib/ordering.ts
done
rm /tmp/ordering.bak
```

Expected: each line reports at least one failure. A zero means that regex does not match what it was written for and must be fixed before moving on.

- [ ] **Step 3: Confirm clean**

```bash
npm run check:claims
```

Expected: `Landing claim ledger and public-copy guard passed.` If it fails, a boundary comment in `src/lib/ordering.ts` contains a phrase it was meant to forbid. Reword the comment, never the regex.

- [ ] **Step 4: Commit**

```bash
git add scripts/check-landing-claims.mjs
git commit -m "test(ordering): fail the build on the four sentences this feature invites"
```

---

## Task 12: Close it out

**Files:** none changed unless something is found.

- [ ] **Step 1: Full clean build**

```bash
rm -rf dist
npm run build 2>&1 | tail -40
```

Expected: every guard in the `postbuild` chain prints its pass line, including `Connections page contract passed.` and `Landing claim ledger and public-copy guard passed.`

- [ ] **Step 2: Type check**

```bash
npx astro check 2>&1 | tail -20
```

Expected: no new errors. Record the count if the baseline from Task 0 already had some.

- [ ] **Step 3: Walk the routes**

With the dev server running on 5173 (`ASTRO_DEV_BACKGROUND=1 npx astro dev --port 5173`):

```bash
for p in / /integrations /features /features/the-day-itself /features/team-and-connections /faq /compare; do
  printf "%-34s %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 http://127.0.0.1:5173$p)"
done
```

Expected: `200` on all seven.

- [ ] **Step 4: Read the two new surfaces as a reader**

Open `/integrations` and `/features/the-day-itself` in a browser at 390px and at 1440px. Check three things by eye, because no guard reaches them: the three connection cards do not read as one flattened status; the ordering group's Coming badge is visible without expanding anything; and nothing on either page wraps or overflows at 390px.

- [ ] **Step 5: Confirm the word can still flip**

```bash
sed -i "s/ORDERING_STATUS = 'coming'/ORDERING_STATUS = 'yes'/" src/lib/ordering.ts
npm run build 2>&1 | grep -E "ORDERING_STATUS must read coming|Available now"
git checkout src/lib/ordering.ts
```

Expected: the claim guard refuses the flip because RC-59 has not changed. That is the pin working. It also proves the `'yes'` branches of every ternary compile, which is the thing that rots silently.

- [ ] **Step 6: Final commit and report**

```bash
git add -A && git status --short
git log --oneline develop ^origin/develop
```

Report the commit list, what shipped in each piece, and the two follow-ups this plan deliberately left: the `/compare` ordering row (which begins with re-verifying both competitor pricing pages and updating `VERIFIED_ON`), and the dedicated `/features/taking-orders` page with captures (which begins with the storefront actually being deployed).

---

## Self-Review

**Spec coverage.** Every section of `docs/plans/ordering-and-integrations-2026-09-08.md` maps to a task: the problem and evidence to Task 8's file header and RC-59; "Why not under Integrations" to Task 3 and Task 4 (Ordering lands in "The day itself"; only third-party connections go to `/integrations`); "Why not its own /features section" to Task 9 (a group inside an existing section, no sixth `SECTIONS` entry, so `verify-compare.mjs`'s hardcoded fives are untouched); Piece 1 to Tasks 7 to 11; Piece 2 to Tasks 1 to 6; guards to Tasks 5 and 11; the claim ledger to Tasks 6 and 10; stories to Tasks 1 and 7; sequencing to the task order, with Piece 2 shippable at Task 6.

Three spec items are deliberately **not** covered, each with its reason stated in Global Constraints or Deviations: the `/compare` row (RC-40 re-verification), RC-60 (RC-45 already carries the claim), and a bespoke `verify-integrations.mjs` (replaced by a row in `verify-feature-parity.mjs`).

**Placeholder scan.** No TBD, no "add error handling", no "similar to Task N". Every code step carries the literal code. Every command carries its expected output.

**Type consistency.** `orderingAvailability.isComing` is the single boolean read by both `features.ts` call sites (Task 9 Steps 2 and 3). `orderingAvailability.featureLead` and `.featureDetail` are strings feeding `FeatureItem`, which is `{ lead: string; detail: string }`. `.menuDescription` is a string feeding `FeatureMenuItem.description`. `.faqStatus` is `readonly string[]`, matching `FaqEntry.answer`'s `readonly string[]`. `icon: 'orders'` is a member of the `FeatureMenuIcon` union. `IntegrationStatus` is `'in-development' | 'not-started'` and both members are used, once and twice respectively. `integrationsPage.comingDefinition` re-exports the shared string from `availability.ts` rather than restating it.
