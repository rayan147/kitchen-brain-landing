# Story Tracker: Invoice email (feature page)

## My story

- **Piece:** feature explainer, `/features/invoice-email` (new, 2026-09-28).
  The front door of the invoice review that `/features/invoices-and-price-list-import`
  explains.
- **Hero:** Dana, owner-caterer. Three suppliers email invoices to three
  different inboxes; she uploads them when she remembers, so her costs run a
  week behind the prices she is paying.
- **Content files:** `src/pages/features/invoice-email.astro`,
  `src/components/sections/InvoiceEmailFeature.astro`, `src/lib/invoice-email.ts`
  (the one status word and every sentence that depends on it).
- **Evidence:** inventory row F-03 (hands off to F-02), read again off
  kitchen-brain origin/main ed6ff5f01 on 2026-09-28:
  `src/routes/settings/invoice-inbox/+page.svelte` and `+page.server.ts`,
  `src/routes/purchases/inbox/+page.svelte`,
  `src/lib/components/purchases/InboxMessage.svelte`, `src/lib/inbox/outcomes.ts`,
  `src/lib/inbox/trust.ts`, `src/lib/server/inbox/{address,attachments,process,receive,ocr-budget}.ts`,
  `src/lib/server/onboarding/permissions.ts` (owner or manager).
- **Status gate:** production receives no mail yet (`infra/cdk/environments.ts:156`
  `worker: false`, `nameServers: []`; `dig MX in.costcook.io` empty on
  2026-09-28). `INVOICE_EMAIL_STATUS` is `coming` until all three flip
  conditions in `src/lib/invoice-email.ts` hold. Ledger RC-73.

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
> An **owner-caterer** who wants **this week's supplier prices in her costs**
> but **gets invoices by email in three places and uploads them only when she
> remembers**.

### Step 2: Character
- **Want:** stop downloading PDFs to upload them again.
- **Need:** invoices that land where they get checked, with nobody carrying them.
- **Wound:** quoted an event on last month's butter price.
- **Flaw:** "I'll upload them Sunday." Sunday never has room.

### Step 3: The Plot
| Beat | In this piece |
|------|---------------|
| 1 Opening Image | The invoice is already sitting in an email. |
| 2 Theme | Nothing counts until you check it. |
| 3 Set-Up | Three suppliers, three inboxes, one upload habit that slips. |
| 4 Catalyst | Every kitchen gets its own invoice address. |
| 5 Debate | "Then anyone can send junk into my costs." (No: it waits in review.) |
| 6 Break into Two | Send the sales rep the message the app writes for you. |
| 7 B Story | The supplier who only emails you: Gmail forwarding. |
| 8 Fun and Games | The Invoice inbox, and what became of each email, in the app's words. |
| 9 Midpoint | An emailed invoice opens in the same review as an upload. |
| 10 Bad Guys | Limits: file types, daily caps, statements kept not imported, the Gmail code. |
| 11 All Is Lost | Keep uploading by hand, a week late. |
| 12 Finale | Start the trial and send the rep the message. |

### Step 4: Scenes
| § | Section | Turn |
|---|---------|------|
| 1 | Hero: the invoice already in your email, status line | scattered → one address |
| 2 | Three ways in: sales rep, Gmail, change the address | effort → a message to paste |
| 3 | What became of each email | "did it arrive?" → one look |
| 4 | Same review as an upload | fear of junk → nothing counts unchecked |
| 5 | Where it stops | doubt → named edges |
| 6 | Close: CTA, setup guide, related guides | reading → doing |

### Step 5: Voices
- **Reader:** "the Sysco invoice", "my rep", "did it come in", "junk".
- **App (exact):** Settings > Invoice email; "Ask your suppliers to send invoices
  here"; "Your invoice address"; "Message for your sales rep"; "Forward from
  Gmail"; "Change the address"; "Make a new address"; "Stop the old address
  now"; "See what has arrived"; Purchases > Invoice inbox; "All email",
  "Invoices and credits", "Not imported", "Held or needs a look"; outcome labels
  and reasons from `OUTCOME_COPY`; "New sender"; "Let it through"; "Change what
  this email is"; "Review".
- **Banned:** automatic, auto-import, hands-free, seamless, "never touch it
  again", "reads every invoice", any accuracy claim about the reading.

### Step 6: Turns (one per section, see Step 4).

### Step 7: Sorkin
- **Headline:** "Your supplier already emails the invoice. Give them the address."
- **Subhead:** Each kitchen gets a private invoice address; what arrives waits
  in review, and nothing reaches your costs until you confirm it.

### Step 8: Snap
> The worst a stranger can do is add to your review list.

(The app's own sentence on Settings > Invoice email. Quoted, not invented.)

### Step 9: Scene
- Monday night after service, phone in hand, scrolling past a produce PDF in
  one inbox and a dairy PDF in another.

### Step 10: Connection
- POV "you" throughout. Each section ends on the next thing you would open in
  the app (the address → the inbox → the review).

### Step 11: Revise
- **Removed:** captures. Production receives no mail, and a real `in-test`
  address in a screenshot would be an address someone could write to. The
  page shows the app's words as text inside ticket frames instead, with a
  placeholder address shape, never a working one.
- **Removed:** the SPF/DKIM/DMARC detail. The page says what the owner sees
  ("The sender could not be verified"), not how.
- **Removed:** "reads every invoice". Past 100 pages a day a document waits to
  be read tomorrow, and a spreadsheet attachment is not read at all.
- **Kept honest:** the status line under the subhead reads the one word in
  `src/lib/invoice-email.ts`; while it is `coming`, every surface says Coming
  and the setup guide is not published.
- **Final Image:** unchanged `cta.label`.

### Revision 2026-10-07: chef audit of the feature and resource routes
- The badge reads "In the app today", not "Available now".
