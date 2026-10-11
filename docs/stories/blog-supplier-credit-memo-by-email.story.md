# Story Tracker: Blog, a supplier credit memo by email

## My story

- **Piece:** blog guide, `/blog/supplier-credit-memo-by-email` (2026-10-08).
  The third invoice-email post: the setup guide gets mail in, the review
  guide checks invoice lines, this one handles the email that is the
  opposite of an invoice. Hands off to `/features/invoice-email`.
- **Hero:** the owner or manager who caught a short case at the door and now
  has the credit in their inbox.
- **Content file:** `src/content/blog/supplier-credit-memo-by-email.md`.
- **Evidence (kitchen-brain 7a7e407d9, read 2026-10-08):**
  - inbox classification `src/lib/server/inbox/classify.ts:55,84`;
  - outcome copy `src/lib/inbox/outcomes.ts:48-51,114,132`;
  - document detection `src/lib/import/parsers/invoice.ts:73-76`;
  - review alert `CanonicalSourceReview.svelte:412-421`, button `:1161`;
  - size-only totals `server/import/document-rules.ts:64-70`;
  - blocks `invoice-commit.ts:744-748`; no purchases `invoice-commit.ts:733,947`, `inbox.test.ts:220-224`;
  - month line `purchases/repository.ts:723-738`, `MonthFoodCostHeader.svelte:261-265,316-324`;
  - receiving `ReceivingLine.svelte:84,192`, `ReceivingProgressSummary.svelte:37`.
- **Not claimed:** that a credit lowers food spend, prices, recipe or event
  cost; a link to the credited invoice; a credit request from receiving;
  QuickBooks supplier credits (QuickBooks is Coming on this site).
- **Gate:** none of its own. It publishes with invoice email (`src/lib/blog.ts`,
  `INVOICE_EMAIL_STATUS`), the same rule as the setup guide.

| # | Step | Done |
|---|------|------|
| 1 | The Idea | [x] |
| 2 | Your Character | [x] |
| 3 | The Plot | [x] |
| 4 | From Beats to Scenes | [x] |
| 5 | Character Voices | [x] |
| 6 | Writing Dialogue | [x] |
| 7 | Sorkin Dialogue | [x] |
| 8 | Cool Talk | [x] |
| 9 | Bringing a Scene to Life | [x] |
| 10 | Connecting Your Scenes | [x] |
| 11 | Revise and Finish | [x] |

### Step 1: The Idea
> An **owner-caterer who was shorted a case** wants **the credit counted
> without wrecking their costs**, but **the obvious fix, knocking it off the
> ingredient, makes chicken look cheap for a week**.

### Step 2: Character
- **Want:** get the $139.60 back on the books.
- **Need:** a cost record where what was paid and what came back are both visible.
- **Wound:** a quote priced on a "cheap" case that was really a credit.
- **Flaw:** fixes the number wherever it is easiest to type.

### Step 3: The Plot
| Beat | In this piece |
|------|---------------|
| 1 Opening Image | One case short on Tuesday, a credit memo PDF on Thursday. |
| 2 Theme | A credit fixes what you paid, not what chicken costs. |
| 3 Set-Up | Same invoice address; the inbox card. |
| 4 Catalyst | The card reads Credit memo. |
| 5 Debate | Is the inbox enough? (No, review reads the document.) |
| 6 Break into Two | The "This is a credit memo" box. |
| 7 B Story | Suppliers print the sign three ways. |
| 8 Fun and Games | The totals check that ignores the sign. |
| 9 Midpoint | Confirm: no purchases, no prices. |
| 10 Bad Guys | A credit read as an invoice adds chicken you never got. |
| 11 All Is Lost | The limits: no link, no event cost, no request. |
| 12 Finale | The weekly habit: filter, look for the box, confirm. |

### Step 4: Scenes
1. Opening (short case, the easy wrong fix)
2. Send it to the same address
3. Check that review sees a credit
4. Make the total match
5. What changes after you confirm it
6. Where it stops
7. The habit that keeps it clean (hand-offs)

### Step 5: Voices
- Reader: "shorted", "knock it off", "the rep", "the credit".
- Product: the app's labels verbatim (Invoice inbox, Invoices and credits,
  Change what this email is, This is a credit memo, Import invoice and update
  costs, Fewer came).

### Step 6: Turns
Opening: tempted to edit the price, then sees why not. Address: unsure where
it goes, then the card. Review: trusts the inbox label, then checks the box.
Total: worried about the minus sign, then relieved. After: fears costs moved,
sees them steady with the credit named. Limits: assumes too much, then knows
the edges.

### Step 7: Headline
"Your supplier emailed a credit memo. Where does it go?" (intention: book the
credit; obstacle: the wrong place is easy).

### Step 8: Snap line (one)
"A credit fixes what you paid. It says nothing about what chicken costs."

### Step 9: Scene
Thursday morning, the PDF on the phone, Tuesday's short case still on the
follow-up list.

### Step 10: Connection
Second person throughout; each section ends on the next action. Links back
to the setup guide, the review guide and the delivery guide.

### Step 11: Revise
Cut QuickBooks supplier credits (Coming here). Cut the inference that a
total-only memo is blocked. Kept the button label and explained it, because
the reader will see "update costs" and worry.
