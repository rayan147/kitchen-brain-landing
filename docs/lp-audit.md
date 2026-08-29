# CostCook landing page audit

Audited 2026-08-23 against `http://localhost:4321/` (homepage) with `/pricing` pulled
in where triage routed there. Source read from `src/components/sections/*`; geometry
and rendering verified in Chromium at 1440x900 and 390x844, full-page.

Skills used are from the `landing-pages-claude-skills` pack. **They are not installed**
in `~/.claude/skills/` — the install step was blocked and never ran. They were read from
the clone at `/tmp/lp-skills` and followed directly. Same methodology; worth knowing if
you want to re-run any of this yourself.

> **Status, 2026-08-23 — implementation pass.** Six findings are built and verified;
> four are blocked on facts only the owner has. Built: hero card disclosure, mobile
> poster (new `demo-poster-mobile.jpg` + `scripts/build-mobile-poster.py`), demo-section
> CTA, founder provenance surfaced at the problem statement, `/compare` routed from the
> misfit list, plus two defects found while verifying — a missing space in the close
> ("first?Book 15 minutes") and the 200%-text overflow at 360 that this document had
> left open. Blocked: privacy/terms pages, the launch-price direction, the FAQ answers,
> and any named-customer proof.
>
> **2026-08-26.** Two of those four are now closed against verified facts. The launch
> price is stated as introductory with existing kitchens grandfathered (`/pricing`), and
> the three-question FAQ is live in the close, written off `sandbox/demo` at `c736dbf6`:
> cancellation is self-serve through the Stripe billing portal at Settings → Billing
> (owner-only, `ownerBusiness()` throws 403 for other roles); the recipe book exports as
> CSV but ingredient prices do not, and the copy says so. Still open: privacy/terms, and
> named-customer proof (pre-launch, no customers yet). `pnpm check` and `pnpm build` pass; measured at 390px the
> largest CTA gap fell from 10.1 viewports to 5.8, and no route overflows at any width
> including 200% text. Nothing is committed.

---

## 1. Triage (`landing-page-triage`)

The skill asks five questions and routes on the answers. Two of the inputs arrived as
unfilled `<<FILL IN>>` placeholders, so they are recorded as unavailable rather than
guessed at.

| Answer | Value | Available |
|---|---|---|
| Monthly conversions (raw count) | Not supplied | No |
| Traffic source split, conversions by source | Placeholder left unfilled | No |
| Mobile vs desktop rate, with sessions each | Not supplied | No |
| Form starts vs finishes | No form on the page; the ask is an offsite Stripe flow at `app.costcook.io` | N/A |
| Ad copy, read next to the page | No campaigns running — stated | N/A by fact |

Analytics: placeholder left unfilled. Treated as none.

**Routed on:** row 7 of the routing table — *"The page asks for money or card details →
`trust-signal-audit`, then `pricing-page-clarity-review` — At the ask, unanswered
hesitation is the dominant cause."*

This is the first row whose condition can be checked without analytics, and Stripe
collecting card details before the trial makes it factually true. Rows 1–6 all require
data that does not exist, so they cannot be evaluated, let alone matched.

**Not running:**

- `paid-traffic-message-match-audit` — no ad copy exists. Note that triage's *fallback*
  row would have routed here first; it is inapplicable by fact, not by preference.
- `google-ads-landing-page-experience-review` — no Google Ads account in play.
- `traffic-temperature-match-review` — needs a source split that does not exist.
- `landing-page-scale-readiness-check` — no spend increase pending.
- `landing-page-ab-test-readout` — no test has run.
- Everything device- and form-related (`mobile-conversion-review`,
  `form-friction-finder`, `popup-and-overlay-timing-review`) — the inputs that would
  justify them are unavailable, and there is no form on the page to audit.

Per your instruction, every paid-traffic skill is skipped, and this is that statement.

**Add this week:** one thing — count trial starts. Not a rate, a raw number, by hand from
Stripe if necessary. Everything below is diagnosed from absence, which is legitimate but
cannot tell you whether the page converts.

**What no skill here can conclude:** whether the page has a conversion problem at all.
With no analytics and no conversion count, a tracking gap, a traffic problem and a page
problem are indistinguishable. Nothing in this document should be read as "this is why
it isn't converting" — it is "these are the questions the page leaves unanswered."

---

## 2. Findings

14 rows, duplicates merged across skills. Severity uses the skills' own vocabulary
(Disqualifying / Costly / Minor). **Blocking** is mine, for the three rows where the
finding is that a verdict *cannot be reached* — not that the page is defective.
Effort is S/M/L. A `—` in Effort means the recommendation is to leave it alone.

| # | Issue | Page section | Skill | Severity | Effort |
|---|---|---|---|---|---|
| 1 | Hero CTA asks for a start without saying a card is required; disclosed 8,455px later | `Hero.astro` → `StartHere.astro` | trust-signal-audit | Disqualifying | S |
| 2 | No privacy policy and no terms link anywhere on the site, while Stripe takes card details | `SiteFooter.astro` | trust-signal-audit | Disqualifying | S |
| 3 | Price may be introductory and the page won't say — plan is "Launch", teammates unlimited "during launch" | `/pricing` | pricing-page-clarity-review | Costly | S |
| 4 | No primary CTA for ~10.1 mobile viewports (hero CTA ends 520px, next at 9,043px of 9,604px) | `index.astro` | trust-signal-audit (position rule) | Costly | M |
| 5 | "unless you cancel" never says how to cancel | `StartHere.astro`, `/pricing` | trust-signal-audit + pricing-page-clarity-review | Costly | S |
| 6 | Nothing says what happens to your recipes and prices if you leave | `StartHere.astro`, `/pricing` | trust-signal-audit | Costly | S |
| 7 | Zero named customers, testimonials, logos or counts | whole page | social-proof-strength-audit | Costly | L |
| 8 | Demo path effectively invisible — "Book 15 minutes" appears once, at 9,123px of 9,604px | `StartHere.astro` | trial-vs-demo-path-decision | Costly | S |
| 9 | Time to first value never measured — blocks the trial-vs-demo verdict entirely | product, not page | trial-vs-demo-path-decision | Blocking | S |
| 10 | No customer verbatims exist, so an objection map cannot honestly be built | n/a | objection-map-builder | Blocking | S |
| 11 | Strongest proof on the page (founder provenance) sits 78% of the way down | `BuiltForKitchens.astro` | social-proof-strength-audit | Costly | S |
| 12 | ~~Best proof asset gated behind a click~~ **SUPERSEDED** — the mobile poster is illegible at 390px and its key line is occluded by the native control bar. See `lp-cro-b2b-homepage.md` finding 4 (Critical, ICE 7.7). | `SeeItRun.astro` | social-proof-strength-audit → landingpage-b2b-leadgen-homepage | **Critical** | M |
| 13 | "$0 today" — the strongest risk-reversal phrase available — appears once, at the very bottom | `StartHere.astro` | trust-signal-audit | Costly | S |
| 14 | No analytics at all; no conversion count exists | n/a | landing-page-triage | Blocking | S |

---

## 3. The top five, expanded

### 1. The hero asks for a card without saying so

**What's wrong.** The only primary CTA above the fold is `Start CostCook`. The line under
it reads:

> **15 days free**, then $49/month per kitchen workspace. Nothing to install.

A card is required. The hero does not say so. The disclosure exists exactly once, in
`StartHere.astro`:

> 15 days free. Stripe collects payment details, charges $0 today, and begins billing at
> $49/month per kitchen workspace after the trial unless you cancel.

Measured, those two are **8,455px apart on mobile** — ten full viewports. The
`trust-signal-audit` decision rule is "position is the whole finding… report distance
from the ask, not presence on the site." A reader who converts from the hero — the only
primary they can see without scrolling — hits a card field they were not told about.

For your buyer specifically, this is the worst possible surprise. The page's whole
posture is *I will tell you the awkward thing before you find it out* — that is what the
misfit list is for. Discovering the card requirement at Stripe contradicts the page's own
best argument about itself.

**The fix.** Say it in the hero. It costs one clause and it is the same voice.

**File:** `src/components/sections/Hero.astro`

```diff
 		<p class="mx-auto mt-4 max-w-[52ch] text-sm text-ink-soft">
-			<strong class="font-semibold text-ink">{launchPlan.trialDays} days free</strong>, then {launchPlan.displayPrice} per kitchen workspace. Nothing to install.
+			<strong class="font-semibold text-ink">{launchPlan.trialDays} days free</strong>, then {launchPlan.displayPrice} per kitchen workspace. Card up front, charged $0 today. Nothing to install.
 		</p>
```

Note I have **not** written "cancel anytime" or named a cancellation route — see finding
5. I could not verify from this repo that self-serve cancellation exists in the app, and
you said every claim has to be one you could defend.

**Guard: no update needed.** I checked. `check-landing-claims.mjs:316` pins the hero with
`requireText(heroSource, 'launchPlan.displayPrice', ...)` — it pins the *expression*, not
the sentence around it. This diff keeps `{launchPlan.displayPrice}` intact, so the guard
passes unchanged.

---

### 2. No privacy policy, no terms, at a page that takes card details

**What's wrong.** The rendered footer is, in full:

> CostCook · rayan@costcook.io · 973-870-6309 · Pricing · Every feature · How we compare ·
> Contact · Sign in · Book a demo · © 2026 CostCook

There is no privacy policy and no terms of service on the site. I checked sitewide, not
just the homepage: `grep -ril 'privacy|terms of service|Terms' src/ public/` returns exactly
one hit, and it is a code comment in `site.ts:68` ("Public launch terms shown wherever a
visitor decides whether to start"). No policy page, no link, on any of the six routes.
Grepping the homepage sections for `secur`, `export` and `refund` returns nothing either.

`trust-signal-audit` asks which of the cautious-buyer questions go unanswered at the
moment of the ask:

| Question | Answered | Distance from the ask | Severity |
|---|---|---|---|
| Who runs this | Yes — full name, photo, 12 years cooking, phone, email | Same page, 78% down | Minor |
| What happens to my data | **No** | Nowhere | Disqualifying |
| What if it goes wrong / can I get out | Partially — "unless you cancel", no mechanism | Bottom only | Costly |
| Can I reach a human | Yes — real phone number and direct email | Footer | **Strength** |

The legal adequacy of any policy is explicitly out of scope for this skill and I am not
giving you legal advice. What is in scope: the question is asked, and the page has no
answer at any distance.

**The fix.** Two footer links. This is the cheapest disqualifying-severity fix on the list.

**File:** `src/components/SiteFooter.astro` (link list), with pages to follow.

```diff
 const footerLinks = nav.flatMap((item) =>
 	item.href === '/pricing' ? [item, { label: 'Every feature', href: featuresMenu.href }] : [item]
-);
+).concat([
+	{ label: 'Privacy', href: '/privacy' },
+	{ label: 'Terms', href: '/terms' }
+]);
```

`footerLinks` is derived from `nav` rather than written out, so the two links are appended
rather than inserted into a literal. They stay out of `nav` itself on purpose: `nav` is
prospect navigation with a one-slot mobile header budget, and these belong in the footer
only.

I have not drafted the policy text — `trust-signal-audit` explicitly forbids it ("do not
draft policy text; say what question needs answering"), and it is not mine to write.

---

### 3. The page will not say whether $49 is the real price

**What's wrong.** On `/pricing`:

> **CostCook Launch** — $49/month
> …
> Included at launch: … **Unlimited teammates during launch**

The plan is called *Launch*. Teammates are unlimited *during launch*. Nothing on the page
says when launch ends, what happens to the price when it does, or whether the $49 a buyer
signs up at today is the price they keep.

`pricing-page-clarity-review` treats a mandatory cost or term that surfaces later as a
trust defect, not a polish item: "the visitor finds out later, and later is on a sales
call or a refund request." Here the deferred term is the price itself, and the buyer is
someone who has been burned by exactly this move by bigger platforms.

The price *number* is otherwise clean — currency, period and basis are all present
("$49/month per kitchen workspace"), which is more than most pricing pages manage. This
is the one defect on the page.

**The fix.** Say which way it goes. Either version below is defensible; pick the true one.

**File:** `src/pages/pricing.astro`

```diff
 					<p class="mt-3 max-w-[54ch] text-ink-soft">Start with {launchPlan.trialDays} days free. Stripe securely collects payment details, charges $0 today, and begins monthly billing after the trial unless you cancel.</p>
+					<p class="mt-3 max-w-[54ch] text-ink-soft">It is called the launch plan because it is early, not because the price is a promotion. If it ever goes up, it goes up for kitchens that join later, not for yours.</p>
```

If that is **not** true — if $49 is introductory — then the honest line is the opposite,
and it still beats silence:

```diff
+					<p class="mt-3 max-w-[54ch] text-ink-soft">This is launch pricing and it will not stay here forever. What I will not do is move it under a kitchen that already signed up.</p>
```

Only ship a version you will honour. I cannot tell which is true from this repo.

---

### 4. Ten mobile viewports with no way to start

**What's wrong.** Measured at 390x844, page height 9,604px:

| | y |
|---|---|
| Hero `Start CostCook`, bottom edge | ~520px |
| Next primary CTA | 9,043px |

Nothing in between. I checked whether the header rescues it: `getComputedStyle(header)
.position` is `static`, and after a 4,000px scroll the header sits at **-2,123px** — off
screen. So the reader has no primary CTA for **8,523px, about 10.1 viewports.**

The moment this costs most is right after the video. `#demo` ends at 4,230px — a reader
has just watched real product footage price a wedding, and the page's answer to "alright,
how do I try it" is to keep scrolling for another five viewports.

**This was already tried and removed — read this before you act on it.**
`SeeItRun.astro` carries an explicit comment where the CTA would go:

> No CTA here on purpose. This section sits third now, and a Start link at this depth was
> one of six competing next-actions. The reader is still being shown the thing; the ask
> belongs at the close.

So this is not an oversight, and I am not going to pretend I found something you missed.
What I am saying is that the stated *reason* has expired. The removal was justified by
"one of six competing next-actions." Counting what is actually on the homepage today:
hero primary, tour link, the `/features` link in outcomes, close primary, close demo link.
Two primaries and three quiet links. The condition that justified pulling the CTA — a
crowded field of competing asks — is not the page you have now, and the cost of the
decision (10.1 viewports with nothing to click) was probably not measured when it was made.

The second half of the comment is still true and still an argument against me: "the reader
is still being shown the thing." A reader mid-film is not ready to be asked. That is why
the placement below is *after* the section, not beside the player.

**The fix.** One primary at the close of the section. Not a floating bar — that breaks
"nothing hidden, nothing jumpy" and it is exactly what this reader arrived braced for.

**File:** `src/components/sections/SeeItRun.astro`

```diff
 		</div>
 
-		<!-- No CTA here on purpose. This section sits third now, and a Start link
-		     at this depth was one of six competing next-actions. The reader is
-		     still being shown the thing; the ask belongs at the close. -->
+		<!-- One primary, restored 2026-08-23. It was pulled when this section
+		     competed with five other next-actions; the page now carries two
+		     primaries and three quiet links, and the measured cost of having
+		     none here was 8,523px (10.1 mobile viewports) with nothing to click.
+		     It sits AFTER the player, not beside it: a reader mid-film is still
+		     being shown the thing. -->
+		<div class="mt-10 border-t border-ticket-rule pt-6" data-reveal>
+			<p class="max-w-[54ch] text-ink-soft">
+				That was one real order, start to finish. Yours will have different numbers.
+			</p>
+			<a
+				href={cta.href}
+				target={cta.target}
+				rel={cta.rel}
+				aria-label={cta.ariaLabel}
+				class="btn-primary mt-5"
+			>
+				{cta.label}
+			</a>
+			<p class="mt-4 text-sm text-ink-soft">
+				{launchPlan.trialDays} days free. Card up front, charged $0 today.
+			</p>
+		</div>
 	</div>
 </section>
```

The frontmatter currently has **no imports at all** — it is a comment block between bare
`---` fences. Both names need adding:

```diff
 ---
+import { cta, launchPlan } from '../../lib/site';
+
 // Screen tour of the actual build (public/demo.mp4, H.264 + AAC).
```

**Guard: this passes, which is itself worth knowing.** `check-landing-claims.mjs:335` loops
over `[['hero', heroSource], ['close', startHereSource]]` only, and asserts each *contains*
a `btn-primary` rendering `cta.label`. There is no count assertion and `SeeItRun` is not in
the loop, so a third primary fires nothing. Line 340 forbids only `demoCta.label` as a
primary in the close. The diff renders `cta.label` verbatim, so it satisfies the spirit of
F1 as well as the letter.

That means **the guard will not stop you shipping this, and it will not stop you shipping
something worse.** The "one slot, one claim" discipline in CLAUDE.md is doing the work here,
not the script. This remains the one item in the top five I would expect you to reject on
design grounds, and rejecting it is a defensible call — the finding is real, the fix is a
judgment about how much the discipline is worth.

### 5. "unless you cancel" — and then nothing

**What's wrong.** The page's only cancellation language is one subordinate clause:

> …begins billing at $49/month per kitchen workspace after the trial **unless you cancel**.

It never says how, whether you can do it yourself, or how long it takes. And nothing
anywhere says what becomes of your recipes, supplier prices and costed events if you go.

For this buyer that second question is the sharper one. The page spends a whole section
(`PaperIn`) persuading them to photograph their price board and upload their invoices —
to put their kitchen's real numbers in. Asking someone to hand over their data and
declining to say whether they can get it back is the specific hesitation that lands at
the card field.

**The fix.** Two sentences at the close, next to the ask. Same voice.

**File:** `src/components/sections/StartHere.astro`

```diff
 				<p class="mt-3 text-ink-soft">
 					{launchPlan.trialDays} days free. Stripe collects payment details, charges $0
 					today, and begins billing at {launchPlan.displayPrice} per kitchen workspace after
 					the trial unless you cancel. Nothing to install.
 				</p>
+				<p class="mt-3 text-ink-soft">
+					Cancelling is a mail to me and it is done the same day. Your recipes and your
+					price history are yours; ask and you get them as a spreadsheet, whether you
+					stay or not.
+				</p>
```

**Verify both claims before shipping this.** "Same day" is a promise about you, so only
you can confirm it. The export claim needs to be true — if there is no export today, say
what there is instead, or cut the second sentence. Do not ship the sentence and build the
feature later.

---

## 4. Biggest single bet

**Put the card disclosure in the hero.** Finding 1, one clause.

Why this over the CTA gap, which is the bigger structural defect: it is the only fix that
costs nothing structurally, needs no design decision, contradicts no principle in
CLAUDE.md, and repairs a contradiction in the page's own argument. The page's strongest
move is telling this reader the unwelcome thing early — four kitchens are told to buy
something else, in a section you have deliberately protected. Letting them find the card
requirement at Stripe is the one place the page does the opposite of what it preaches.

**What I would expect it to move — honestly: raw trial starts may go down.** Some people
click *Start CostCook* today because they think it is free and cardless. Telling them
earlier will stop some of those clicks. What it should move is the drop-off between
clicking the CTA and finishing Stripe, and the number of people who arrive at a demo call
already trusting the page.

**And I cannot verify any of that**, because there is no analytics and no conversion
count. That is finding 14 and it is why "count trial starts this week" is the one
measurement worth adding. Ship this as a trust fix on principle, not as a conversion
experiment — you have no instrument to read the experiment with.

---

## 5. Where two skills refused to run

Both of these are outputs, not gaps.

### `trial-vs-demo-path-decision` — cannot decide without time to first value

| Input | Value | Source |
|---|---|---|
| Time to first value | **Unknown** | — |
| Mandatory human steps before value | **Unknown** | — |
| ACV | $588/yr ($49 × 12) | Supplied |
| Cycle length | Unknown | — |
| Approver | Owner-operator quotes, cooks and signs — no separate approver | Supplied |

The skill is explicit: *"Nothing at all: the output is the walkthrough instruction, not a
path recommendation… recommending trial or demo without knowing time to first value would
be a guess wearing a table."*

So: **no path verdict.** What to do instead, which takes one afternoon — sign up for
CostCook with a clean account and a stopwatch. Record every step from signup to the first
moment the product shows you something useful, including anything you had to do by hand.
That walkthrough decides the question.

Two things I *can* say from the page alone:

- **The premise in your brief does not match the page.** You described two CTAs
  competing. Measured, `Book 15 minutes` appears **once**, at y=9,123 of a 9,604px page —
  one line below the close, deliberately quiet. They are not competing. If anything the
  demo is *under*-available: for a cold-email skeptic who will not hand over a card, it is
  the only door, and it is 11 viewports down. The finding is under-availability, not
  competition.
- The $588 ACV is small enough that a 15-minute call costs a meaningful share of first-year
  revenue. That is the pack's own labelled heuristic, not a researched threshold, and it
  points at self-serve primary. It is not a substitute for the stopwatch.

### `objection-map-builder` — cannot build a map without verbatims

Hard guardrail: *"With no customer verbatims, do not produce an objection map… An
objection map invented from the page is the team's assumptions with a table around them."*

You asked me to map objections to sections. I am declining to invent the left-hand column.
Here is the source list instead, in the skill's priority order, scored for you:

| # | Source | Available to you today? |
|---|---|---|
| 1 | **Your own sent folder** — search replies for question marks; anything you've answered twice is an objection in the prospect's words | **Yes.** You have `rayan@costcook.io` and Gmail is connected to this session. Fastest path by a distance. |
| 2 | Last five sales calls, written in the prospect's phrasing, not yours | Yes, from memory. Small sample — say so. |
| 3 | Comments and DMs on any post about CostCook | Unknown |
| 4 | Competitor reviews — Parsley and meez on G2/Capterra | Yes. Category objections, not yours — a limitation to state. |
| 5 | One-question email to ten lost prospects: what made you decide against it? | Yes |

Source 1 is sitting in your mailbox right now. Say the word and I will pull the recurring
questions out of your sent mail and build the map properly — with real quotes, mapped to
the sections that should answer them.

---

## 6. Social proof, without fabricating any

`social-proof-strength-audit` inventory of what is actually on the page:

| Proof element | Attribution | Objection it answers | Position | Resembles reader | Verdict |
|---|---|---|---|---|---|
| 2:30 product film, real numbers | The product itself | "Is this real or a mockup" | 3,538px (37%) | Their exact job | **Keep — strongest on the page** |
| Founder: full name, photo, 12 years cooking | Full | "Does whoever built this understand my week" | 7,448px (78%) | Yes | Keep, **move earlier** |
| `yield-lines` screenshot, real figures | Product | "Does it actually do the trim math" | 5,585px | Yes | Keep |
| Real phone number + direct email | Full | "Will anyone answer" | Footer | Yes | Keep — rare and valuable |
| "Who this is not for", four disqualifiers | — | "Will they tell me the truth" | 2,295px (24%) | Yes | **Keep — do not touch** |
| Testimonials / logos / customer counts | None exist | — | — | — | **Do not fabricate** |

**Strongest proof on the page:** the film. It is real product footage with real arithmetic
and it answers the only question a cold-email skeptic actually has.

> **Correction (same day).** This paragraph originally called the poster "well chosen" and
> the finding "minor, not a rewrite." That was assessed from the component's source comment
> and the desktop rendering. A 390px screenshot shows the poster's key line half-covered by
> the native video control bar, over a spreadsheet too dense to read at that width. The
> finding is Critical, not minor. See `lp-cro-b2b-homepage.md` finding 4.

**Objections with no proof against them:** "has anyone like me actually run this?" Nothing
on the page speaks to that and nothing honest can until you have a customer.

**The strongest honest version you can build today**, in order of what I would do first:

1. **Move the founder provenance up.** It is the closest thing you have to a testimonial
   and it sits at 78% depth. "I spent twelve years cooking professionally" belongs where
   the reader is deciding whether you understand their week — near the problem section,
   not below the fold of the fold.
2. **Let the film's specificity carry more weight.** "This is the working product, not a
   mockup" is a claim. The Alvarez-Whitman wedding at 180 guests, 39.6% food cost against
   a 30% target, $89.78 to hit it — those are proof. A line naming one or two of those
   numbers next to the player does work the sentence cannot.
3. **Say the number of kitchens running it, when there is one to say** — with a date, and
   defined. `social-proof-strength-audit` marks any count without a definition and a date
   as unverified. Not yet.
4. **Then go and get one real testimonial.** Full name, kitchen, role. One from an
   owner-operator caterer outranks eight logos. Ask your first paying customer for two
   sentences about the thing that surprised them.

What I will not do, and what the skill forbids: draft a testimonial, imply a customer
count, or add a "trusted by" line. There is no honest version of those today.

---

## 7. Not a problem — checked and deliberately left alone

**"Who this is not for" stays. I'm overruling the conversion-leak reading.**

A leak-finder pattern flags it on sight: four reasons to leave, at 24% depth, before the
proof. I am not flagging it, for three reasons. Every one of the four lines maps to a
documented `no` row on `/compare` (RC-44), so cutting it does not remove the objection —
it relocates the discovery to the demo call, where it costs a booked meeting instead of a
bounce. It is placed to answer "is this mine?" *before* the film plays, which is correct
sequencing: proof shown to a reader unsure the product is theirs is wasted. And it is the
single strongest trust asset the page has for a cold-email skeptic — the thing a marketing
department would never ship, which is exactly why it lands. Keep it where it is.

**The mobile fold passes.** At 390x844: eyebrow, h1, lede, `Start CostCook` (~438px),
price line and the tour link all sit inside the first viewport. Several skills would want
to flag hero length by reflex. Measured, it is fine.

**One plan, no tiers.** `pricing-page-clarity-review` counts decisions and flags choice
load above three plans. There is one plan, currency, period and basis all present. There
is nothing to fix and adding tiers to look more like a real SaaS would be a downgrade.

**No contact form — good.** The skill flags a contact form as the *only* support route,
because it signals nobody will answer. You publish a phone number and a direct address to
a named human. That is stronger than what most of this category offers. Don't replace it
with a form.

**11.4 mobile viewports is not "too long".** Long-form is right for a considered purchase
by a skeptical reader. The problem is not the length, it is that there is nothing to click
inside it (finding 4). Fix the CTA gap, keep the page.

**The sr-only transcript.** ~500 words of hidden text could read as keyword stuffing to a
crude SEO check. It is a WCAG 1.2.1 requirement, it matches the footage, and it stays.

**The dev-toolbar overlay** sitting on the LoopBand in my mobile capture is the Astro dev
toolbar, not a page defect. It will not exist in the build.

**Voice.** Nothing in here asks you to flatten it. "The case has the skins on" and "you
paid for the skins" are the best writing on the page and they are doing conversion work,
not decoration — that section makes an argument no competitor makes. Every rewrite above
is one clause of plain disclosure in the same register. Where the voice costs you
anything, it is by omission, never by tone: the page is so committed to not overselling
that it under-tells the reader what starting actually involves. That is findings 1, 5 and
6, and all three are fixed by saying more, not by sounding different.

---

## 8. What is still missing

| Missing input | Blocks | Cost to get |
|---|---|---|
| Any conversion count | Whether there is a page problem at all | An hour in Stripe |
| Time to first value | The trial-vs-demo verdict | One afternoon with a stopwatch |
| Customer verbatims | The objection map | Your sent folder, today |
| Traffic volume and source | Whether any of this is worth sequencing | Placeholder left unfilled |
| Whether $49 is introductory | Finding 3's copy direction | You already know |
| Whether self-serve cancel and data export exist | Finding 5's copy | Check the app |

Nothing in this document has been applied.
