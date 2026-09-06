# Your Initial Setup Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `/onboarding` from "what setup asks for" into a three-part guide, "Your initial setup", that also answers "what do I do next" and "how do I bring in the rest of my kitchen", using only shipped app behaviour.

**Architecture:** One Astro route, one section component, data arrays rendered by the template. Three parts (Before / The five stages / After setup) with an in-page map in the hero ticket. Two guard layers stay: `check-landing-claims.mjs` greps the source, `check-onboarding-page.mjs` reads the built HTML, `verify-onboarding.mjs` drives a browser. Every new claim gets a pin in both static guards before the copy lands (test first).

**Tech Stack:** Astro 5, Tailwind v4 tokens in `src/styles/global.css`, Node scripts (`node scripts/*.mjs`), CDP browser harness in `scripts/verify-onboarding.mjs`.

**Spec:** `docs/superpowers/specs/2026-09-06-initial-setup-guide-design.md`
**Research:** `docs/research/onboarding-guide-best-practices-2026-09-06.md`
**Story:** `docs/stories/onboarding.story.md` (rerun in Task 1; no copy before it)

## Global Constraints

- Worktree: `/home/rayan147/kitchen-brain-landing-initial-setup`, branch `feat/initial-setup-guide`. All commands run from there.
- URL stays `/onboarding`. Label, title, breadcrumb, H1 eyebrow: `Your initial setup`.
- The H1 sentence stays `You do not need to enter your whole walk-in.` (page identity, pinned in two scripts).
- Pinned strings that MUST survive verbatim: `Four stages in, it prints`, `5 stages`, `about fifteen minutes`, `Sage stays open beside`, `never fills a stage in for you`, `2% misc (the default)`, `“check”, never “clear”`, the seven arithmetic values, the four guard phrases, the three door leads, `is written to your catalog`, `quoted back to you rather than guessed at`.
- Forbidden on this page (guard fails the build): `sample data`; `set up in` / `in under N minutes` / `guaranteed`; `(photograph|snap|upload|drop in|scan)` within 60 chars of `(invoice|price list|price sheet|recipe)`; Sage `fills|enters|fixes|completes|writes|sets up`; `rarely/never type`; `fixes the problem`. New in this plan: `custom role`, `permission builder`, `per-screen`, `extracts`, `reads (it|them) correctly`, `automatically`.
- Copy rules: no em-dashes, no exclamation points, no "seamless/powerful/robust/in one click", second person throughout, product name is CostCook, never Kitchen Brain.
- Exactly two `btn-primary` in the component, both `{cta.label}`; a third comes from the shared sticky bar in the built page (the built check expects 3).
- Motion: `.anim-enter` and `[data-reveal]` only. Colours: tokens only. Contrast AA.
- Krug rules applied to every section (restated, not quoted): the reader scans, so lead with the most informative word; one obvious next action per part; links look like links; cut every sentence that only describes; the page must pass the trunk test from any scroll position (site, page, part, next action); on a 390px phone, allow zoom, expect no hover, one chunk per screen height.
- Commit after every task with the trailer:
  ```
  Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01SLPNbeNW878jgRs5zwo6jr
  ```

---

## File map

| File | Responsibility |
|---|---|
| `docs/stories/onboarding.story.md` | The story. Rerun first; every later line traces to it. |
| `src/components/sections/OnboardingPage.astro` | The whole page: data arrays (`parts`, `stages`, `doors`, `arithmetic`, `guards`, `completion`, `menuTrack`, `crewTrack`) and markup. |
| `src/pages/onboarding.astro` | Title, description, direction contract. |
| `src/lib/site.ts` | `resourceNav` entry label and description. |
| `src/lib/faq.ts` | Setup answer link text; one new row "What do I do after setup?". |
| `scripts/check-landing-claims.mjs` | Source pins (lines 726–784 today). |
| `scripts/check-onboarding-page.mjs` | Built-HTML pins. |
| `scripts/verify-onboarding.mjs` | Browser assertions. |
| `docs/release-claim-ledger.md` | Surface row for `/onboarding` (line 144 today). |

---

### Task 1: Rerun the story tracker

**Files:**
- Modify: `docs/stories/onboarding.story.md`

**Interfaces:**
- Produces: the section list and hand-off lines that Tasks 3–5 render verbatim. Section ids: `before`, `stages`, `after`. Snap line unchanged.

- [ ] **Step 1: Replace the header and Steps 1–4**

Replace everything from `# Story Tracker` through the end of the Step 4 table with:

```markdown
# Story Tracker — Your initial setup

## My story

- **Piece:** Resource route explaining what setup asks for, where it leaves you, and how the rest of the kitchen comes in (`/onboarding`)
- **Title / headline:** You do not need to enter your whole walk-in
- **My hero's name:** The owner-caterer with the trial page open in one tab, not pressing Start, who has a second question behind the first: and then what?
- **Content file(s):** `src/pages/onboarding.astro`, `src/components/sections/OnboardingPage.astro`

## The 11 steps

| # | Step | What you build | Done |
|---|------|----------------|------|
| 1 | The Idea | One sentence: WHO + WANT + WALL. | ☒ |
| 2 | Your Character | Hero's insides: want, need, wound, flaw. | ☒ |
| 3 | The Plot | 12 beats on the Save the Cat map. | ☒ |
| 4 | From Beats to Scenes | 12 beats → the sections you will write. | ☒ |
| 5 | Character Voices | The reader's voice and the product's voice. | ☒ |
| 6 | Writing Dialogue | Each section turns a value, the McKee way. | ☒ |
| 7 | Sorkin Dialogue | Headline and subhead as intention vs obstacle. | ☒ |
| 8 | Cool Talk | One line of snap. | ☒ |
| 9 | Bringing a Scene to Life | Senses and setting for the key scene. | ☒ |
| 10 | Connecting Your Scenes | Hand-offs between sections; POV locked. | ☒ |
| 11 | Revise and Finish | Cut, sharpen, make the ending land. Done! | ☒ |

### Step 1 — The Idea

> An owner-caterer who wants to know whether CostCook is worth one evening, but believes she has to enter her entire walk-in first, and even if she gets one dish in, cannot picture the day her crew uses it without her.

### Step 2 — Your Character

- **Want:** Know what setup will cost her in time, and what she is supposed to do the morning after.
- **Need:** One real number out of her own kitchen, and a Shop list her crew can work from without her standing over them.
- **Wound:** The last tool wanted her whole catalog before it did anything. The one before that she set up alone, and nobody else ever logged in.
- **Flaw:** She judges software by how much it asks of her up front, so she never gets far enough to find out whether it works, and she assumes rolling it out to the crew is her job alone.

### Step 3 — The Plot

| Beat | In this piece |
|------|---------------|
| 1 Opening Image | Trial page open in one tab, tomorrow's prep list in the other. Thumb over Start. Not pressing it. |
| 2 Theme Stated | Setup asks for one dish, not your walk-in. Then the rest of the kitchen follows the same doors. |
| 3 Set-Up | Every tool before this wanted the whole catalog first, and every one was set up alone. |
| 4 Catalyst | She opens the app. Empty kitchen, and the old dread: where do I even start. |
| 5 Debate | "I do not have a week for data entry." "Even if I do it, then what?" "My crew will never use it." |
| 6 Break into Two | The guide opens on a question, not a form. One dish. |
| 7 B Story | The roast chicken plate she has cooked four hundred times. Her own knowledge is the data. |
| 8 Fun and Games | Five stages, each asking for the next thing that one dish needs. |
| 9 Midpoint | $1.62. The plate cost, with the case price and the trim beside it. |
| 10 Bad Guys Close In | The guards: blank price, wrong unit, Start over, wifi drop. Then the harder one: "Your kitchen is ready", and she is alone on the completion screen. |
| 11 All Is Lost | The alternative is another season where the number in her head and the number on the invoice differ, and the crew works from a text message. |
| 12 Finale + Final Image | The next dish comes in through the same doors. She invites the two people who work this week; they get a link, no password, and open the Shop list she built. On their own phones. |

### Step 4 — From Beats to Scenes

| § | Section | id | Beats | Value turn |
|---|---------|----|-------|------------|
| 0 | Hero: You do not need to enter your whole walk-in | — | 1–2 | wall → doorway, with a map of three parts |
| 1 | Part 1 · Before you start | `before` | 3–6 | vague dread → named fear → one optional question |
| 2 | Part 2 · The five stages | `stages` | 7–10 | vague → concrete → checkable → tested |
| 3 | Part 3 · After setup: where the app leaves you | `after` | 10 | done → next action named |
| 3b | The rest of your menu | `after-menu` | 12 | "now the other 40 dishes by hand" → same doors, staged review |
| 3c | The rest of your crew | `after-crew` | 12 | "I roll this out alone" → a link, no password, a list waiting |
| 3d | Close | — | 12 | undecided → started |
```

- [ ] **Step 2: Update Steps 5–10**

Append to Step 5 reader's words: `then what, my crew, roll it out, who can see the costs, one login for everyone`. Add to banned: `custom role, permission, automatically, extracts, reads it correctly, roll out in a day`.

Replace the Step 6 list with:

```markdown
- §0 "This will want everything I have" → "It wants one dish, and here are the three questions this page answers."
- §1 "I am bad at this" → "The empty screen is the problem, and it asks one optional question."
- §2 "Five stages sounds like a week" → "Five stages is one dish's worth of facts, and I can check the number."
- §3 "It says ready. Now what?" → "It names the next screen: the shopping list."
- §3b "So I key the other forty dishes by hand" → "Same doors as the first: paper in, staged facts back, my last word on every line."
- §3c "Rolling this out is on me" → "Two emails, two links, no passwords, and they land on a list, not an empty kitchen."
- §3d "Is this worth an evening?" → "One dish, and you will know. Then the crew will too."
```

Replace Step 7 subhead with: `Setup asks for one dish you already cook and takes about fifteen minutes. Four stages in, it prints that dish's plate cost with the arithmetic beside it. This page also says what comes after, and how the rest of your kitchen gets in.`

Step 8 unchanged. Step 9 unchanged. Replace the Step 10 hand-off list with:

```markdown
  - §0 → §1: the map's first row, "Before you start".
  - §1 → §2: "Those answers are optional. These five are the work."
  - §2 → §3: "Stage five ends on a screen that says your kitchen is ready. Here is what it offers next."
  - §3 → §3b: "The first dish was the hard one. The rest come in the same way."
  - §3b → §3c: "A catalog nobody else opens is a spreadsheet with a login. This is how the crew gets one."
  - §3c → §3d: "Invite after the first order exists, so they arrive to a list."
```

- [ ] **Step 3: Append a Step 11 revision note**

```markdown
- **After-setup revision (2026-09-06):** the owner named the two questions the
  page left open: what do I do next, and how do I onboard the rest of my
  kitchen. Both have shipped answers and both are now Part 3. What went in is
  read off `sandbox/demo` that day: `SetupCompletionSummary.svelte` (heading
  "Your kitchen is ready", actions "Open shopping list" and "Go to Today"),
  the import queue (RC-38, RC-39), Sage's recipe door (RC-58), later prices
  (RC-08), and Settings > Team (`settings/team/+page.svelte`: invite by email,
  "They will receive a one-time link to join this kitchen. No password is
  needed.", `INVITED_ROLE = 'STAFF'`, RC-52). What stayed out: any word on
  what extraction returns, any role behaviour beyond RC-52, any rollout
  duration. Parts 1 and 2 were cut by about a third (Krug: omit needless
  words); the page gained a three-row map in the hero ticket so a reader
  picks the question they came with.
```

- [ ] **Step 4: Commit**

```bash
git add docs/stories/onboarding.story.md
git commit -m "docs(story): rerun the onboarding tracker for the three-part guide"
```

---

### Task 2: Rename the destination everywhere it is named

**Files:**
- Modify: `src/lib/site.ts:124-130`
- Modify: `src/lib/faq.ts:288`
- Modify: `scripts/verify-onboarding.mjs:230`
- Modify: `src/pages/onboarding.astro`

**Interfaces:**
- Produces: nav label `Your initial setup`; page `<title>` `Your initial setup in CostCook | One dish, then the rest of your kitchen`.

- [ ] **Step 1: Change the browser assertion first**

In `scripts/verify-onboarding.mjs` line 230, replace `'Your first dish'` with `'Your initial setup'`.

- [ ] **Step 2: Build and run it to see it fail**

```bash
npm run build && node scripts/verify-onboarding.mjs
```
Expected: FAIL with `desktop: navigation is not active (Your first dish)`.

- [ ] **Step 3: Rename in site.ts**

```ts
	{
		label: 'Your initial setup',
		href: '/onboarding',
		header: 'resources',
		group: 'See it work',
		icon: 'dish',
		description: 'One dish to start, then how the rest of your menu and your crew get in.'
	},
```

- [ ] **Step 4: Rename in the page shell**

In `src/pages/onboarding.astro` replace the `title` and `description` props:

```astro
	title="Your initial setup in CostCook | One dish, then the rest of your kitchen"
	description="Setup asks for one dish you already cook, not your whole walk-in. See the five stages, the plate cost they end on, what the app offers next, and how your crew gets in."
```

And in `directionContract`, replace the `STORY:` line with:

```ts
	'STORY: Data-entry dread becomes one dish, five stages, a checkable $1.62, then the two questions the old page left open: what next (the shopping list, Today), and how the rest of the menu and the crew get in (the same doors, a one-time link, Staff).',
```
and `FORM:` with `'FORM: Code-led editorial route; initial-setup-guide; three numbered parts under one settling setup ticket that doubles as the page map.'`.

- [ ] **Step 5: Update the FAQ link text**

In `src/lib/faq.ts` line 288 change the anchor text to `See the five stages, the number they end on, and what comes after`.

- [ ] **Step 6: Update the built-output pin for the direction contract**

In `scripts/check-onboarding-page.mjs` replace `['first-dish-onboarding', 'emitted direction contract'],` with `['initial-setup-guide', 'emitted direction contract'],`.

- [ ] **Step 7: Build and run all three checks**

```bash
npm run build && node scripts/check-landing-claims.mjs && node scripts/check-onboarding-page.mjs && node scripts/verify-onboarding.mjs
```
Expected: all pass (the page body is unchanged so far).

- [ ] **Step 8: Commit**

```bash
git add src/lib/site.ts src/lib/faq.ts src/pages/onboarding.astro scripts/verify-onboarding.mjs scripts/check-onboarding-page.mjs
git commit -m "feat(onboarding): rename the route to Your initial setup"
```

---

### Task 3: Hero map and Part 1

**Files:**
- Modify: `src/components/sections/OnboardingPage.astro` (frontmatter, hero, the two bands after it, styles)
- Modify: `scripts/check-onboarding-page.mjs`
- Modify: `scripts/verify-onboarding.mjs`

**Interfaces:**
- Produces: `parts` array; section ids `before`, `stages`, `after`; classes `fd-map`, `fd-map-n`, `fd-part`, `fd-part-label`.

- [ ] **Step 1: Add built-output pins that fail today**

In `scripts/check-onboarding-page.mjs`, after the `ticketStages` check add:

```js
// The hero ticket is the page map: three parts, each an in-page anchor, each
// with a done-when line. A reader picks the question they came with (Krug:
// a mindless choice) and every anchor must resolve to a section id.
const mapRows = (html.match(/class="fd-map-n"/g) ?? []).length;
if (mapRows !== 3) failures.push(`expected 3 map rows in the setup ticket, received ${mapRows}`);
for (const id of ['before', 'stages', 'after']) {
	if (!html.includes(`href="#${id}"`)) failures.push(`map does not link to #${id}`);
	if (!new RegExp(`<section[^>]*\\bid="${id}"`).test(html)) failures.push(`no section carries id="${id}"`);
}
const partLabels = (html.match(/class="fd-part-label"/g) ?? []).length;
if (partLabels !== 3) failures.push(`expected 3 part labels (Part N of 3), received ${partLabels}`);
```

- [ ] **Step 2: Build and run to see it fail**

```bash
npm run build && node scripts/check-onboarding-page.mjs
```
Expected: FAIL listing `expected 3 map rows`, the three anchors, and `part labels`.

- [ ] **Step 3: Add the `parts` data**

In the component frontmatter, after `const stages = [...] as const;` add:

```ts
/**
 * The page map. Three parts, three questions a reader arrives with, one
 * finish line each. The hero ticket renders it and every row is an in-page
 * anchor, so the first choice on the page is a mindless one.
 */
const parts = [
	{
		n: '1',
		id: 'before',
		label: 'Before you start',
		done: 'Done when you know it wants one dish, not your walk-in.'
	},
	{
		n: '2',
		id: 'stages',
		label: 'The five stages',
		done: 'Done when one dish has a plate cost you can check on paper.'
	},
	{
		n: '3',
		id: 'after',
		label: 'After setup',
		done: 'Done when the next dish and the first teammate are in.'
	}
] as const;
```

Also update the header comment's pattern note to:

```ts
// Considered Template Method and Strategy for the three parts; not used
// because the parts are one fixed composition with no runtime variation.
// The stage, door, guard and after-setup tables are data, not a variant
// hierarchy.
```

- [ ] **Step 4: Rewrite the hero**

Replace the hero `<section class="fd-hero">` block with:

```astro
	<section class="fd-hero" aria-labelledby="fd-heading">
		<div class="container-page fd-hero-layout">
			<div class="fd-hero-copy">
				<nav aria-label="Breadcrumb" class="feature-breadcrumb">
					<a href="/">Home</a><span aria-hidden="true">/</span><span>Your initial setup</span>
				</nav>
				<p class="eyebrow">Your initial setup</p>
				<h1 id="fd-heading" class="feature-display">You do not need to enter your whole walk-in.</h1>
				<p class="fd-lede">
					Setup asks for one dish you already cook and takes about fifteen minutes.
					Four stages in, it prints that dish&rsquo;s plate cost with the arithmetic beside it.
					This page also says what comes after, and how the rest of your kitchen gets in.
				</p>
				<div class="fd-actions">
					<a href={cta.href} target={cta.target} rel={cta.rel} aria-label={cta.ariaLabel} class="btn-primary">{cta.label}</a>
					<a href="#the-number" class="btn-quiet">See the number it ends on</a>
				</div>
			</div>

			<figure class="fd-ticket anim-enter" aria-labelledby="fd-ticket-title">
				<div class="fd-ticket-head">
					<p id="fd-ticket-title">This page</p>
					<span>3 parts &middot; 5 stages &middot; 1 dish</span>
				</div>
				<ol class="fd-ticket-stages fd-map" role="list">
					{parts.map((part) => (
						<li>
							<a href={`#${part.id}`} class="fd-map-link">
								<span class="fd-ticket-n fd-map-n">{part.n}</span>
								<span class="fd-map-text">
									<span class="fd-map-label">{part.label}</span>
									<span class="fd-map-done">{part.done}</span>
								</span>
							</a>
						</li>
					))}
				</ol>
				<figcaption>Pick the question you came with. Each part ends with one next step.</figcaption>
			</figure>
		</div>
	</section>
```

Note: `5 stages` must remain in the ticket (RC-10 pin). The `.fd-ticket-n` class stays on the map numbers so the old ticket count check is replaced, not broken: change the `ticketStages` assertion in `check-onboarding-page.mjs` from `!== 5` to `!== 3` with the comment `// The ticket now maps three parts; the five stage rows are counted below.` and in `verify-onboarding.mjs` change `ticketStages === 5` to `ticketStages === 3` (both desktop and any mobile line that reads it).

- [ ] **Step 5: Merge the two Part 1 bands into one**

Replace the `fd-empty-heading` band and the `fd-welcome-heading` band with one section:

```astro
	<section class="fd-band fd-part" id="before" aria-labelledby="fd-before-heading">
		<div class="container-page" data-reveal>
			<div class="fd-prose">
				<p class="eyebrow fd-part-label">Part 1 of 3 &middot; Before you start</p>
				<h2 id="fd-before-heading">The dread has a shape. Setup asks one question instead.</h2>
				<p>
					You have done this before. The last tool wanted your whole catalog before it would do
					anything, and the half-filled spreadsheet is still on the desktop.
				</p>
				<p>
					CostCook opens on a question, not a form: what kind of kitchen you run, what you want
					out of it first, and the name of one dish you already cook. Every answer is optional.
					Name the dish and the screens after it say its name back to you.
				</p>
				<p class="fd-handoff">Those answers are optional. These five are the work.</p>
			</div>
		</div>
	</section>
```

- [ ] **Step 6: Add the map styles**

In `<style>`, after the `.fd-ticket figcaption` rule add:

```css
	/* The map rows are links: underline on the label, a hit area of at least
	   44px, and no reliance on hover (Krug ch. 10: no cursor, no hover). */
	.fd-map-link {
		display: flex;
		align-items: baseline;
		gap: 0.75rem;
		width: 100%;
		min-height: 2.75rem;
		color: inherit;
		text-decoration: none;
	}

	.fd-map-text {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.fd-map-label {
		text-decoration: underline;
		text-underline-offset: 4px;
		text-decoration-color: var(--color-hairline-strong);
	}

	.fd-map-link:hover .fd-map-label,
	.fd-map-link:focus-visible .fd-map-label {
		text-decoration-color: var(--color-green-deep);
	}

	.fd-map-done {
		color: var(--color-ink-soft);
		font-size: var(--text-body-sm);
		font-weight: 400;
		line-height: 1.45;
	}

	/* Anchored parts land with the part label visible under the sticky header. */
	.fd-part {
		scroll-margin-top: 5rem;
	}
```

- [ ] **Step 7: Build and run all checks**

```bash
npm run build && node scripts/check-landing-claims.mjs && node scripts/check-onboarding-page.mjs && node scripts/verify-onboarding.mjs
```
Expected: `check-onboarding-page` still fails on `#stages` and `#after` (added in Tasks 4 and 5). Everything else passes. If the claims guard fails on `You do not need to enter` or `about fifteen minutes`, the hero text drifted; restore it.

- [ ] **Step 8: Commit**

```bash
git add src/components/sections/OnboardingPage.astro scripts/check-onboarding-page.mjs scripts/verify-onboarding.mjs
git commit -m "feat(onboarding): hero map of three parts, Part 1 cut to one band"
```

---

### Task 4: Part 2 with done-when lines

**Files:**
- Modify: `src/components/sections/OnboardingPage.astro` (stages data, stages band)
- Modify: `scripts/check-onboarding-page.mjs`

**Interfaces:**
- Consumes: `stages` array. Adds `done: string` per stage, read from `SETUP_STAGE_GUIDE[stage].steps` on `sandbox/demo` (the app's own checkmarks).
- Produces: section `id="stages"`, class `fd-stage-done`.

- [ ] **Step 1: Add the built-output pin**

In `scripts/check-onboarding-page.mjs` after the `stageRows` check add:

```js
// Each stage row names the app's own last checkmark for that stage, so a
// reader inside the app knows when the stage is finished (research pattern
// 2: a countable done-marker per step).
const doneLines = (html.match(/class="fd-stage-done"/g) ?? []).length;
if (doneLines !== 5) failures.push(`expected 5 done-when lines, received ${doneLines}`);
for (const text of ['Add one supplier', 'Review the food facts', 'Answer every ingredient once', 'Check the plate cost', 'cost the order']) {
	requireText(text, `stage done-when line from SETUP_STAGE_GUIDE (${text})`);
}
```

- [ ] **Step 2: Build and run to see it fail**

```bash
npm run build && node scripts/check-onboarding-page.mjs
```
Expected: FAIL with `expected 5 done-when lines, received 0`.

- [ ] **Step 3: Add `done` to each stage**

The values are the LAST entry of `steps` for each stage in the app's `stage-guide.ts` (read 2026-09-06 on `sandbox/demo`):

```ts
const stages = [
	{
		n: '1',
		label: 'Kitchen and suppliers',
		body: 'Your kitchen’s name, one supplier so prices have a buying source, and the food-cost target every plate is judged against.',
		done: 'Add one supplier'
	},
	{
		n: '2',
		label: 'Ingredients',
		body: 'The ingredients of that one dish: what you buy, how big the pack is, what it costs, and what survives the knife. On an empty kitchen this stage opens on three doors, and only one of them is a form.',
		done: 'Review the food facts CostCook found'
	},
	{
		n: '3',
		label: 'Food facts',
		body: 'Nutrition, allergens and diet facts, drafted where CostCook could and yours to confirm. Skip one you are unsure of and every order using it reads “check”, never “clear”.',
		done: 'Answer every ingredient once'
	},
	{
		n: '4',
		label: 'Recipes',
		body: 'The dish itself: its lines in costing units, and how many portions the batch makes.',
		done: 'Check the plate cost'
	},
	{
		n: '5',
		label: 'Menu and first order',
		body: 'A date and a guest count. The order becomes shopping, prep, packing, and a food-cost result.',
		done: 'Add guests and a date, then cost the order'
	}
] as const;
```

- [ ] **Step 4: Render it**

Give the stages section `id="stages"` and the classes `fd-band fd-part`, change its eyebrow to `<p class="eyebrow fd-part-label">Part 2 of 3 &middot; The five stages</p>`, and inside each `.fd-stage` after `.fd-stage-body` add:

```astro
						<p class="fd-stage-done"><span class="fd-stage-done-k">Done when</span> {stage.done}.</p>
```

Change the section's final hand-off line from `Stage four ends on a number.` to keep that sentence (it is the hand-off to `#the-number`), and leave the number, guards and close bands where they are for now; Task 5 moves the close.

Styles, after `.fd-stage-body`:

```css
	.fd-stage-done {
		grid-column: 2;
		margin: 0.35rem 0 0;
		color: var(--color-ink);
		font-size: var(--text-body-sm);
		line-height: 1.5;
	}

	.fd-stage-done-k {
		color: var(--color-amber-deep);
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		font-size: var(--text-eyebrow);
	}
```

- [ ] **Step 5: Build and run all checks**

```bash
npm run build && node scripts/check-landing-claims.mjs && node scripts/check-onboarding-page.mjs && node scripts/verify-onboarding.mjs
```
Expected: only the `#after` failures remain.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/OnboardingPage.astro scripts/check-onboarding-page.mjs
git commit -m "feat(onboarding): Part 2 rows say when each stage is done"
```

---

### Task 5: Part 3, After setup

**Files:**
- Modify: `src/components/sections/OnboardingPage.astro` (data, new bands, close)
- Modify: `scripts/check-landing-claims.mjs:726-784`
- Modify: `scripts/check-onboarding-page.mjs`
- Modify: `docs/release-claim-ledger.md:144`

**Interfaces:**
- Produces: section `id="after"`, sub-sections `id="after-menu"` and `id="after-crew"`, classes `fd-after-track`, `fd-completion`.

- [ ] **Step 1: Add source pins to the claims guard**

In `scripts/check-landing-claims.mjs`, after the `if (!/5 stages/.test(onboardingSource))` block add:

```js
// Part 3, after setup. Each line is read off sandbox/demo on 2026-09-06 and
// pinned so the page can neither drop the boundary nor sharpen the claim.
// 3a: the completion screen (SetupCompletionSummary.svelte).
requireText(onboardingSource, 'Your kitchen is ready', 'after-setup completion heading');
requireText(onboardingSource, 'Open shopping list', 'after-setup first action');
requireText(onboardingSource, 'Go to Today', 'after-setup second action');
// 3b: the import queue (RC-38) and its two boundaries (RC-39, RC-08).
requireText(onboardingSource, 'a photo, a PDF, a spreadsheet, a Word document or pasted text', 'after-setup five doors (RC-38)');
requireText(onboardingSource, 'quoted back', 'after-setup unreadable-is-not-guessed (RC-39)');
requireText(onboardingSource, 'without rewriting confirmed orders', 'after-setup later prices boundary (RC-08)');
// 3c: Settings > Team (RC-52). The role boundary and the Staff-sees-costs
// caveat travel with the invite claim or the claim comes off.
requireText(onboardingSource, 'one-time link', 'after-setup invite mechanism (RC-52)');
requireText(onboardingSource, 'No password', 'after-setup no-password boundary (RC-52)');
requireText(onboardingSource, 'join as Staff', 'after-setup invited role (RC-52)');
requireText(onboardingSource, 'Staff can open cost screens', 'after-setup Staff-sees-costs caveat (RC-52)');
requireText(onboardingSource, '/features/team-and-access', 'after-setup link to the full boundary (RC-52)');
for (const [pattern, label] of [
	[/\bcustom roles?\b(?![^.]{0,40}\b(not|no)\b)/i, 'a custom role (RC-52: none exists)'],
	[/\bpermission builder\b|\bper-screen\b/i, 'per-screen permissions (RC-52 forbids the grid)'],
	[/\bextracts?\b|\breads? (it|them|your \w+) (correctly|accurately)\b/i, 'extraction accuracy (stubbed at both test layers)'],
	[/\bautomatically\b/i, 'automation the ledger does not cover'],
	[/\b(roll|rolled) out in\b/i, 'a rollout duration (nothing supports one)'],
]) {
	if (pattern.test(onboardingSource)) failures.push(`onboarding states ${label}`);
}
```

- [ ] **Step 2: Add built-output pins**

In `scripts/check-onboarding-page.mjs`, before the `primaries` check add:

```js
// Part 3 must survive the build with both tracks and their boundaries.
const tracks = (html.match(/class="fd-after-track"/g) ?? []).length;
if (tracks !== 2) failures.push(`expected 2 after-setup tracks (menu, crew), received ${tracks}`);
for (const [text, label] of [
	['Your kitchen is ready', 'completion heading'],
	['Open shopping list', 'completion first action'],
	['Go to Today', 'completion second action'],
	['pasted text', 'the five doors (RC-38)'],
	['quoted back', 'unreadable-is-not-guessed (RC-39)'],
	['one-time link', 'invite mechanism (RC-52)'],
	['join as Staff', 'invited role (RC-52)'],
	['Staff can open cost screens', 'Staff-sees-costs caveat (RC-52)'],
	['href="/features/team-and-access"', 'link to the Team &amp; Access guide'],
	['id="after-menu"', 'menu track anchor'],
	['id="after-crew"', 'crew track anchor']
]) requireText(text, label);
```

- [ ] **Step 3: Build and run to see both fail**

```bash
npm run build; node scripts/check-landing-claims.mjs; node scripts/check-onboarding-page.mjs
```
Expected: both FAIL on the new pins only.

- [ ] **Step 4: Add the Part 3 data**

In the frontmatter after `guards`:

```ts
/**
 * Part 3. Every line read off `sandbox/demo` on 2026-09-06.
 * 3a: `src/lib/components/setup/SetupCompletionSummary.svelte`.
 * 3b: the import queue (RC-38, RC-39), Sage's recipe door (RC-58), later
 *     prices (RC-08). Nothing about what extraction returns (RC-55 stub).
 * 3c: `src/routes/settings/team/+page.svelte` and `+page.server.ts`
 *     (`INVITED_ROLE = 'STAFF'`), RC-52. No role behaviour beyond that row.
 */
const completion = {
	heading: 'Your kitchen is ready',
	items: ['Costing settings', 'Business profile', '1 supplier', 'Your ingredients', 'Dish: the one you named', 'Menu', 'Order for your guests'],
	next: 'Next: check what you need to buy',
	actions: ['Open shopping list', 'Go to Today']
} as const;

const menuTrack = [
	{
		lead: 'Same doors as the first dish.',
		body: 'One queue takes a photo, a PDF, a spreadsheet, a Word document or pasted text, and comes back as staged facts for you to confirm. What it could not read is quoted back as it appeared, never guessed.'
	},
	{
		lead: 'A recipe card goes to Sage.',
		body: 'Hand it a card, a photo, a PDF, text or a link and read the draft it makes. The dish is yours before it is costed.'
	},
	{
		lead: 'Prices keep moving. Orders do not.',
		body: 'Every purchase you log updates the catalog and any draft costs, without rewriting confirmed orders. The plate cost you checked tonight is still checkable next month.'
	}
] as const;

const crewTrack = [
	{
		lead: 'Settings, then Team.',
		body: 'Type an email address. They receive a one-time link to join this kitchen. No password is needed.'
	},
	{
		lead: 'They join as Staff.',
		body: 'Staff works from the shared kitchen record. Manager adds setup, teammate administration and the Sage checks that show price movement. Owner adds billing and the recipe lifecycle.'
	},
	{
		lead: 'Know the boundary before you send.',
		body: 'Staff can open cost screens, and there is no custom role. If that is a problem for your kitchen, read the full boundary first.'
	}
] as const;
```

- [ ] **Step 5: Add the Part 3 markup**

Replace the existing close band (`fd-close`) with the following, placed after the guards band:

```astro
	<section class="fd-band fd-band-cream fd-part" id="after" aria-labelledby="fd-after-heading">
		<div class="container-page" data-reveal>
			<div class="fd-prose">
				<p class="eyebrow fd-part-label">Part 3 of 3 &middot; After setup</p>
				<h2 id="fd-after-heading">Stage five ends on a screen that says your kitchen is ready. Here is what it offers next.</h2>
			</div>
			<figure class="fd-completion" aria-labelledby="fd-completion-title">
				<div class="fd-ticket-head">
					<p id="fd-completion-title">{completion.heading}</p>
					<span>Setup &middot; complete</span>
				</div>
				<ul class="fd-completion-items" role="list">
					{completion.items.map((item) => <li>{item}</li>)}
				</ul>
				<p class="fd-completion-next">{completion.next}</p>
				<p class="fd-completion-actions">
					{completion.actions.map((label) => <span class="fd-completion-action">{label}</span>)}
				</p>
				<figcaption>
					The completion screen as the app prints it. If you named a goal at the welcome, the first
					line answers it in your words: what the event really costs, what to buy for a date, or whether
					a price change hurt you.
				</figcaption>
			</figure>
			<p class="fd-handoff">The first dish was the hard one. The rest come in the same way.</p>
		</div>
	</section>

	<section class="fd-band fd-part" id="after-menu" aria-labelledby="fd-menu-heading">
		<div class="container-page" data-reveal>
			<div class="fd-prose">
				<p class="eyebrow">The rest of your menu</p>
				<h2 id="fd-menu-heading">The next forty dishes are not forty evenings.</h2>
			</div>
			<ul class="fd-doors-list fd-after-track" role="list" aria-labelledby="fd-menu-heading">
				{menuTrack.map((row) => (
					<li>
						<p class="fd-door-lead">{row.lead}</p>
						<p class="fd-door-body">{row.body}</p>
					</li>
				))}
			</ul>
			<p class="fd-handoff">A catalog nobody else opens is a spreadsheet with a login. This is how the crew gets one.</p>
		</div>
	</section>

	<section class="fd-band fd-band-cream fd-part" id="after-crew" aria-labelledby="fd-crew-heading">
		<div class="container-page" data-reveal>
			<div class="fd-prose">
				<p class="eyebrow">The rest of your crew</p>
				<h2 id="fd-crew-heading">Two emails, two links, no passwords.</h2>
				<p>
					Invite after the first order exists, so they arrive to a shopping list and a prep list,
					not an empty kitchen. Whoever works this week first; the rest can follow.
				</p>
			</div>
			<ul class="fd-doors-list fd-after-track" role="list" aria-labelledby="fd-crew-heading">
				{crewTrack.map((row) => (
					<li>
						<p class="fd-door-lead">{row.lead}</p>
						<p class="fd-door-body">{row.body}</p>
					</li>
				))}
			</ul>
			<p class="fd-doors-gate">
				Invited teammates join as Staff today. The full Owner, Manager and Staff boundary, and what
				each can and cannot open, is on the <a href="/features/team-and-access">Team and Access guide</a>.
			</p>
		</div>
	</section>

	<section class="fd-band fd-close" aria-labelledby="fd-close-heading">
		<div class="container-page" data-reveal>
			<div class="fd-prose">
				<p class="eyebrow">Where this leaves you</p>
				<h2 id="fd-close-heading">One dish with a price on it, and a list your crew can open without you.</h2>
				<p>
					The shopping list is where the <a href="/tour/main">product tour</a> picks up. The alternative
					is another season where the number in your head and the number on the invoice are two
					different numbers, and the crew works from a text message.
				</p>
				<p class="fd-final">One dish, and you will know. Then they will too.</p>
				<div class="fd-actions">
					<a href={cta.href} target={cta.target} rel={cta.rel} aria-label={cta.ariaLabel} class="btn-primary">{cta.label}</a>
				</div>
			</div>
		</div>
	</section>
```

Also change the guards band's last line so it hands off: after the `fd-guards` list add `<p class="fd-handoff">Which leaves the question the old page never answered: what happens after stage five.</p>`.

- [ ] **Step 6: Styles for the completion figure**

```css
	/* The completion screen redrawn on ticket paper: the same head rule as
	   the hero ticket, so the reader sees the map and the finish line as the
	   same object. Not a screenshot: the app's chrome would date faster than
	   its words. */
	.fd-completion {
		max-width: 40rem;
		margin: 1.75rem 0 0;
		padding: 1.25rem 1.25rem 1rem;
		background: var(--color-cream);
		border: 1px solid var(--color-ticket-rule);
		border-radius: 0.25rem;
		box-shadow: var(--shadow-ticket);
	}

	.fd-completion-items {
		display: grid;
		gap: 0.35rem 1rem;
		margin: 0.75rem 0 0;
		padding: 0;
		list-style: none;
		color: var(--color-ink);
		font-size: var(--text-body-sm);
	}

	@media (min-width: 40rem) {
		.fd-completion-items {
			grid-template-columns: 1fr 1fr;
		}
	}

	.fd-completion-items li::before {
		content: '\2713\00a0';
		color: var(--color-green-deep);
	}

	.fd-completion-next {
		margin-top: 1rem;
		padding-top: 0.75rem;
		border-top: 1px dashed var(--color-ticket-rule);
		color: var(--color-ink);
		font-weight: 600;
	}

	.fd-completion-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 0.6rem;
	}

	/* Rendered as labels, not buttons: they name the app's actions and go
	   nowhere on this page, so they must not look clickable (Krug ch. 3). */
	.fd-completion-action {
		padding: 0.3rem 0.6rem;
		border: 1px dashed var(--color-ticket-rule);
		border-radius: 0.25rem;
		color: var(--color-ink-soft);
		font-size: var(--text-body-sm);
	}

	.fd-completion figcaption {
		padding-top: 0.85rem;
		color: var(--color-ink-soft);
		font-size: var(--text-body-sm);
		line-height: 1.5;
	}

	.fd-after-track {
		max-width: 44rem;
	}
```

- [ ] **Step 7: Ledger surface row**

In `docs/release-claim-ledger.md` line 144, append to the row's RC list: `; RC-08, RC-38 and RC-39 for the after-setup menu track; RC-52 for the crew track (invite by email, one-time link, join as Staff, Staff can open costs, no custom role); the completion screen lines are read off SetupCompletionSummary.svelte on sandbox/demo 2026-09-06`.

- [ ] **Step 8: Build and run every check**

```bash
npm run build && node scripts/check-landing-claims.mjs && node scripts/check-onboarding-page.mjs && node scripts/verify-onboarding.mjs
```
Expected: all pass. If `primaries !== 3` fails, a `btn-primary` was added or lost; the component must hold exactly two. If the forbidden-pattern scan trips on `photo ... recipe` in `menuTrack[1]`, keep `photo` (the pattern needs the full word `photograph`) and do not introduce `upload`, `scan`, `snap` or `drop in`.

- [ ] **Step 9: Commit**

```bash
git add src/components/sections/OnboardingPage.astro scripts/check-landing-claims.mjs scripts/check-onboarding-page.mjs docs/release-claim-ledger.md
git commit -m "feat(onboarding): Part 3 answers what next and how the crew gets in"
```

---

### Task 6: FAQ row for the second question

**Files:**
- Modify: `src/lib/faq.ts` (the `start` group, after the `setup` entry)

- [ ] **Step 1: Add the guard pin first**

In `scripts/check-landing-claims.mjs`, near the existing FAQ checks (search for `faqSource`), add:

```js
requireText(faqSource, 'href="/onboarding#after-crew"', 'faq: after-setup crew answer links to the guide');
```

Run `node scripts/check-landing-claims.mjs`. Expected: FAIL on that pin.

- [ ] **Step 2: Add the row**

```ts
			{
				id: 'after-setup',
				question: 'What do I do after setup, and how does my crew get in?',
				answer: [
					'Setup ends on a screen that says your kitchen is ready and offers the shopping list for your first order. The next dishes come in through the same doors as the first: a photo, a PDF, a spreadsheet, a Word document or pasted text, staged for you to confirm.',
					'To bring in the crew, open Settings, then Team, and type an email address. They receive a one-time link, need no password, and join as Staff. Staff can open cost screens and there is no custom role. <a href="/onboarding#after-crew">See the after-setup part of the guide</a>.'
				],
				claims: ['RC-38', 'RC-39', 'RC-52']
			},
```

- [ ] **Step 3: Run the guard and build**

```bash
node scripts/check-landing-claims.mjs && npm run build
```
Expected: pass.

- [ ] **Step 4: Commit**

```bash
git add src/lib/faq.ts scripts/check-landing-claims.mjs
git commit -m "feat(faq): what to do after setup and how the crew gets in"
```

---

### Task 7: Browser verification and evidence

**Files:**
- Modify: `scripts/verify-onboarding.mjs`
- Create: `.impeccable/review/onboarding-*.png` (the script writes them)

- [ ] **Step 1: Extend the probe**

In the `probe` function of `scripts/verify-onboarding.mjs`, add to the returned object:

```js
			mapLinks: [...document.querySelectorAll('.fd-map-link')].map((a) => a.getAttribute('href')),
			mapTargets: [...document.querySelectorAll('.fd-map-link')].every((a) => !!document.querySelector(a.getAttribute('href'))),
			parts: document.querySelectorAll('.fd-part-label').length,
			tracks: document.querySelectorAll('.fd-after-track').length,
			trunk: (() => {
				// Trunk test from Part 3: with the page scrolled to #after, is the
				// part label inside the viewport and is there one visible primary
				// or next-step link below it?
				const after = document.querySelector('#after');
				if (!after) return false;
				after.scrollIntoView();
				const label = after.querySelector('.fd-part-label')?.getBoundingClientRect();
				return !!label && label.top >= 0 && label.top < window.innerHeight;
			})(),
```

And add assertions after the desktop block:

```js
	assert(desktop.mapLinks.length === 3, `desktop: expected 3 map links, received ${desktop.mapLinks.length}`);
	assert(desktop.mapTargets, 'desktop: a map link points at a missing section');
	assert(desktop.parts === 3, `desktop: expected 3 part labels, received ${desktop.parts}`);
	assert(desktop.tracks === 2, `desktop: expected 2 after-setup tracks, received ${desktop.tracks}`);
	assert(desktop.trunk, 'desktop: Part 3 fails the trunk test (part label not visible after anchor scroll)');
```

and in the mobile block:

```js
	assert(mobile.mapTargets, 'mobile: a map link points at a missing section');
	assert(mobile.trunk, 'mobile: Part 3 fails the trunk test at 390px');
	assert(mobile.minTarget >= 44, `mobile: smallest route action is ${mobile.minTarget}px`);
```

Make sure the `minTarget` selector list includes `.fd-map-link` so the map rows are measured: change `'.fd-actions a, .feature-breadcrumb a'` to `'.fd-actions a, .feature-breadcrumb a, .fd-map-link'`.

- [ ] **Step 2: Run the full verification**

```bash
npm run build && node scripts/verify-onboarding.mjs
```
Expected: PASS, and fresh captures at 1440x900, 390x844 and 200% text under `.impeccable/review/`.

- [ ] **Step 3: Look at the three captures**

Open each PNG (Read tool). Check: the map rows read as links; the three part labels are visible; the completion figure sits on cream ticket paper with the same head rule as the hero ticket; no horizontal overflow; at 390px each part's heading and its next-step line fit within one screen height of each other.

- [ ] **Step 4: Manual no-JS and keyboard passes**

Run the built site with `npx astro preview` in the background and open `/onboarding` with JavaScript disabled (the verify script already does a no-JS pass; confirm it still asserts the Part 3 headings). Then Tab from the top: breadcrumb, primary CTA, quiet link, three map links, then into the page. Every focus ring must be visible and no `[data-reveal]` section may stay hidden once focused.

- [ ] **Step 5: Word count**

```bash
node -e "const s=require('fs').readFileSync('dist/onboarding/index.html','utf8');const t=s.replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>|<[^>]+>/g,' ').replace(/\s+/g,' ');console.log(t.split(' ').length)"
```
Record the number in the story tracker's Step 11. Parts 1 and 2 must be shorter than the 470-word prose count they replaced; Part 3 adds at most 300 words of prose.

- [ ] **Step 6: Commit the evidence**

```bash
git add scripts/verify-onboarding.mjs .impeccable/review/onboarding-*.png docs/stories/onboarding.story.md
git commit -m "test(onboarding): map anchors, part labels, trunk test, fresh captures"
```

---

### Task 8: Final report and PR

- [ ] **Step 1: Run everything once more**

```bash
npm run build && node scripts/check-landing-claims.mjs && node scripts/check-onboarding-page.mjs && node scripts/verify-onboarding.mjs && npm test --if-present
```

- [ ] **Step 2: Push and open the PR against `develop`**

```bash
git push -u origin feat/initial-setup-guide
gh pr create --base develop --title "feat(onboarding): Your initial setup, one guide in three parts" --body-file - <<'EOF'
## What

`/onboarding` becomes "Your initial setup": Before / The five stages / After setup. The After part is new and answers the two questions the old page left open, what to do next and how the rest of the kitchen gets in, using only shipped behaviour (completion screen, import queue, Settings > Team).

## Evidence

- Spec: docs/superpowers/specs/2026-09-06-initial-setup-guide-design.md
- Research: docs/research/onboarding-guide-best-practices-2026-09-06.md
- Story: docs/stories/onboarding.story.md (all 11 steps rerun)
- Guards: check-landing-claims, check-onboarding-page, verify-onboarding all green; captures in .impeccable/review/

## Boundaries kept

No duration beyond "about fifteen minutes" (RC-10). Nothing on extraction results (RC-55). No role behaviour beyond RC-52. No sample data.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01SLPNbeNW878jgRs5zwo6jr
EOF
```
