# Story Tracker — Connect your tools (/features/integrations)

## My story

- **Piece:** Feature guide page plus a third Features menu column
- **Title:** What CostCook plugs into today, and what it doesn't yet.
- **My hero:** An owner-caterer who already pays for Square at a counter or QuickBooks for the books, and wants to know before the trial whether CostCook fits them
- **Content files:** `src/components/sections/IntegrationsFeature.astro`, `src/pages/features/integrations.astro`, `src/lib/connections.ts`, the Connect your tools column in `src/lib/features.ts`, three stops in `src/lib/tour.ts`
- **Source of truth:** kitchen-brain main ed6ff5f01 (production) and develop 3e933bcc1, read 2026-10-12. Ledger RC-45 and RC-78.
- **Owner rulings, 2026-10-12:** Coming, posts held; the column leads with what is shipped; no other connector is named.

## The 11 steps

| # | Step | Done |
|---|------|------|
| 1 | The Idea | ☑ |
| 2 | Your Character | ☑ |
| 3 | The Plot | ☑ |
| 4 | From Beats to Scenes | ☑ |
| 5 | Character Voices | ☑ |
| 6 | Writing Dialogue | ☑ |
| 7 | Sorkin Dialogue | ☑ |
| 8 | Cool Talk | ☑ |
| 9 | Bringing a Scene to Life | ☑ |
| 10 | Connecting Your Scenes | ☑ |
| 11 | Revise and Finish | ☑ |

### Step 1 — The Idea

An owner-caterer who runs Square at a counter and QuickBooks for the books wants to know whether CostCook fits the tools they already pay for, and has been burned by "integrations" that turned out to be a logo on a page.

### Step 2 — Your Character

- **Want:** A yes or no about Square and QuickBooks before spending a trial on it.
- **Need:** The straight answer, plus what works today, so the trial is not wasted waiting.
- **Wound:** A sales call where "we integrate with that" meant a CSV export.
- **Flaw:** Writing off a tool when one connection is missing, even when the rest would save the week.

### Step 3 — The Plot

| Beat | On this page |
|---|---|
| Opening Image | Square on the counter, QuickBooks on the laptop, CostCook in neither |
| Theme Stated | "What CostCook plugs into today, and what it doesn't yet." |
| Set-up | The connections ticket: five lines, each with its word |
| Catalyst | The Coming line in the first screen: no real account, not in the trial, no date |
| Debate | Is it worth starting without them? |
| Break into Two | Working today: Stripe, invoice email, e-signature, files |
| B Story | Prices arrive with no supplier connection at all |
| Fun and Games | Square's four steps, then QuickBooks' four, in the app's own titles |
| Midpoint | What each one doesn't do: no stock taken off the shelf, nothing sent without a press |
| Bad Guys Close In | "Can I connect it in the trial?" Not yet. |
| All Is Lost | Avoided by saying it first, in the hero |
| Final Image | Start on what works today; your costs don't wait on Square or QuickBooks |

### Step 4 — From Beats to Scenes

1. Hero: the honest headline, the Coming line, the connections ticket.
2. Working today: four cards, each one job and one limit.
3. Square: who it is for, four steps, what stays, what it doesn't do, the snap line.
4. QuickBooks Online: who it is for, four steps, the app's boundary, what it doesn't do.
5. Questions: five answers.
6. Close: start on what works today.

### Step 5 — Character Voices

- **Reader:** "Does it work with my Square?" "My bookkeeper retypes every invoice."
- **Product:** the app's own words, quoted: "Connecting is not publishing.", "CostCook never pays a bill, or sends the same invoice twice.", the four QuickBooks step titles.

### Step 6 — Writing Dialogue

Each section turns one value. Hero: doubt to a clear answer. Working today: "nothing fits" to "four things fit now". Square and QuickBooks: hope to an exact picture of what they will and won't do. Questions: last objections to none.

### Step 7 — Sorkin Dialogue

The headline wants something against an obstacle: the reader wants a yes, the page gives the truth first ("and what it doesn't yet").

### Step 8 — Cool Talk (the one snap line)

**"If you only book catering events, you can skip this integration."** The app's own sentence on its Square page: a product telling the reader not to bother with one of its connectors.

### Step 9 — Bringing a Scene to Life

The Saturday market stall with a Square register, and the Sunday night laptop with QuickBooks open and a stack of checked invoices beside it.

### Step 10 — Connecting Your Scenes

Second person throughout, founder "I" only in the FAQ, as on every feature page. Hand-offs: "Next: the two that aren't ready.", "Next: QuickBooks Online.", "Next: questions."

### Step 11 — Revise and Finish

Cut: logos, a roadmap, every name of an unbuilt connector, the develop-only customer-invoice sync. The close is the final image: start the trial on what works today.

## Revision — English review (2026-10-12)

All 22 findings applied. The connector warning no longer reuses the /compare note ("does not import its sales" sat above "Sales come back"); it now reads "You can't connect … today, and there is no date. Here is what it does in testing." The lede and status line merged so the first screen says Coming once. The link from /features/team-and-connections says "where Square and QuickBooks stand", not "will do". The tour's Square callout quotes the app verbatim. In the QuickBooks guide the reader, not CostCook, is the subject who sends; the paid read-back replaces "works one way"; the short case is handled once, as a vendor credit (re-check against the app before publishing).

## Revision — Label printers as planned (2026-10-12)

Owner request: printing as Coming. A direct connection to a label printer is planned and not built (only the browser and a simulator exist in kitchen-brain develop), so it is worded as planned, never as built or being tested, with no brand and no guide. It is the column's fifth item and the page's last section before the questions, and its tour stop shows the browser print that works today. Labels & printing in Build and price is unchanged.

## Gate before a connector flips to 'yes'

- A real account connects on kitchen-brain origin/main, with the flag on in production.
- Re-read the four steps against that build; update `src/lib/connections.ts` and RC-45/RC-78 in the same commit.
- The guide's captures are shot (see its tracker).
