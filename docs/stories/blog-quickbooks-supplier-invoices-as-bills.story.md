# Story Tracker — Send supplier invoices to QuickBooks without typing them twice

## My story

- **Piece:** Worked blog guide (HELD while QuickBooks is Coming)
- **Title:** Send supplier invoices to QuickBooks without typing them twice
- **My hero:** An owner-caterer who checks every supplier invoice in CostCook and then retypes it into QuickBooks on Sunday night for the bookkeeper
- **Content file:** `src/content/blog/quickbooks-supplier-invoices-as-bills.md`
- **Source of truth:** kitchen-brain main ed6ff5f01 and develop 3e933bcc1, read 2026-10-12: `src/routes/settings/integrations/quickbooks`, `QuickBooksSetupSteps.svelte` (the four step titles), `QuickBooksBillSection.svelte` ("A timeout is not permission to make a second bill.", "CostCook stopped trying. No second bill was made.", "The workspace owner sends invoices to QuickBooks."), `CanonicalSourceReview.svelte` ("Send it to QuickBooks too"), `SupplierCreditsSection.svelte`, `docs/integrations/quickbooks.md` (no auto-send setting; one vendor per supplier; never creates an account; vendor only on the owner's press).
- **Publication:** held by `src/lib/blog.ts` while `QUICKBOOKS_STATUS` is Coming (owner, 2026-10-12).

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

An owner who already checked an invoice against the truck wants it in the books, but has to type it into QuickBooks a second time.

### Step 2 — Your Character

- **Want:** Sunday night back.
- **Need:** The checked invoice to reach QuickBooks as it was checked, once.
- **Wound:** A bill entered twice, or a typo the accountant found in April.
- **Flaw:** Not trusting anything that sends money records on its own.

### Step 3 — The Plot

| Beat | In this guide |
|---|---|
| Opening Image | Sunday night, retyping Tuesday's Harbor Foods invoice |
| Theme Stated | "You've already checked that invoice once." |
| Set-up | What it does, in one line, and that it works one way |
| Catalyst | Connect your QuickBooks company |
| Debate | Will it mess up my chart of accounts? It never creates one |
| Break into Two | Match suppliers to vendors |
| Fun and Games | Three ways to send, each a press |
| Midpoint | Paid status read back, never paid |
| Bad Guys Close In | The timeout: will it double the bill? |
| All Is Lost | Avoided: "No second bill was made." |
| Break into Three | What it doesn't do, plainly |
| Final Image | Sunday night, nothing retyped |

### Step 4 — From Beats to Scenes

Opening; what it does; Steps 1 to 5 (connect, accounts, suppliers, send, where it stands); when the connection hiccups; what it doesn't do; Sunday night after.

### Step 5 — Character Voices

- **Reader:** "My bookkeeper", "the books", "typing it in again".
- **Product:** the four step titles and the quoted strings above.

### Step 6 — Writing Dialogue

Each step turns distrust into control: you pick the accounts, you confirm the matches, you press send, and a timeout cannot double a bill.

### Step 7 — Sorkin Dialogue

Title: send it, against typing it twice.

### Step 8 — Cool Talk (the one snap line)

**"Typing it again is how the $139.60 case of chicken turns into $193.60."** The transposed digits every bookkeeper has met; the case price is the product tour's (40 lb at $139.60).

### Step 9 — Bringing a Scene to Life

The dock on Tuesday with a short case of chicken; the laptop on Sunday night.

### Step 10 — Connecting Your Scenes

Second person, one supplier (Harbor Foods, invoice #44817) from the dock to the bookkeeper paying it.

### Step 11 — Revise and Finish

Cut: the develop-only customer-invoice sync (receivables go to QuickBooks automatically on develop, the opposite of the bills path; it belongs in its own guide once it is on main), exact account labels (they differ between main and develop), any date, any other accounting product.

## Checked 2026-10-12: a short delivery is a supplier credit

Confirmed on kitchen-brain main ed6ff5f01 and develop 3e933bcc1. `SupplierCreditsSection.svelte:35` on the invoice page: "Short or damaged delivery? Record the credit your supplier gave you. It goes to QuickBooks as a credit against this supplier, linked to this invoice." The owner records it (Record a supplier credit: credit number, date, reviewed lines) and presses Send credit to QuickBooks. `src/lib/server/accounting/supplier-credits.ts` refuses a credit whose invoice has no bill in QuickBooks yet ("A supplier credit must link to an exported invoice in this company."). Nothing in receiving creates a credit. The guide now says all three.

## Gate before this guide publishes

- [ ] `QUICKBOOKS_STATUS` is 'yes' (see `src/lib/connections.ts`).
- [ ] Re-read every step against the build that went live; settle the account labels ("Food purchases account"/"Fees account" on main, "Food and ingredients"/"Fees on invoices" on develop) and quote whichever shipped. Category accounts and vendor creation are develop-only today.
- [ ] Captures, live company, with alt text and figcaptions: settings after connecting; accounts card; supplier matches; an invoice's QuickBooks section before and after sending.
- [ ] Replace the capture comments with the images; recompute readMinutes.
