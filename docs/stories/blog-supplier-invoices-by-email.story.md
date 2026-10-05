# Story Tracker: Blog, set up invoice email

## My story

- **Piece:** blog guide, `/blog/supplier-invoices-by-email` (2026-09-28).
  A setup walkthrough that hands off to `/features/invoice-email`.
- **Hero:** the owner or manager who has just started a trial and has fifteen
  minutes between lunch service and prep.
- **Content file:** `src/content/blog/supplier-invoices-by-email.md`.
- **Evidence:** same as `docs/stories/features-invoice-email.story.md`. The
  steps are the app's settings page in its own order.
- **Gate:** the post is built only when `INVOICE_EMAIL_STATUS` is `yes`
  (`src/lib/blog.ts`, pinned by `scripts/check-blog.mjs`). A setup guide for a
  Coming feature would send a reader's suppliers to an address that cannot
  receive mail.

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
> An **owner or manager** who wants **supplier invoices to arrive in CostCook
> by themselves** but **does not know what to tell the sales rep, or how to get
> the ones that only come to their own Gmail**.

### Step 2: Character
- **Want:** a setup done once, today.
- **Need:** every supplier's invoice arriving where it gets checked.
- **Wound:** a forwarding rule that silently never worked.
- **Flaw:** sets things up halfway, then trusts them.

### Step 3: The Plot
| Beat | In this piece |
|------|---------------|
| 1 Opening Image | Three suppliers, three habits: rep emails, portal PDF, a photo by text. |
| 2 Theme | Set it up once, then check that it worked. |
| 3 Set-Up | Where the address lives (Settings > Invoice email). |
| 4 Catalyst | Copy the message for your sales rep. |
| 5 Debate | Should the rep send to you or straight to CostCook? (Straight.) |
| 6 Break into Two | Gmail forwarding for the suppliers who only email you. |
| 7 B Story | The confirmation code, and where it shows up. |
| 8 Fun and Games | The filter, then the test email. |
| 9 Midpoint | The test shows up in the Invoice inbox. |
| 10 Bad Guys | Held as spam, Nothing to read, Over today's limit, the junk address. |
| 11 All Is Lost | Setting it up and never checking the first one. |
| 12 Finale | Review the first real invoice; open the feature guide. |

### Step 4: Scenes (sections, each an H2)
1. Before you start (who can do it, what you need)
2. Step 1: Find your invoice address
3. Step 2: Send your sales rep the message
4. Step 3: Forward the ones that come to your Gmail
5. Step 4: Check that the first one arrived
6. When an email does not turn into an invoice
7. If the address starts getting junk
8. Close: review the first invoice (hands off to the feature page)

### Step 5: Voices
- **Reader:** "my rep", "the ones that come to me", "did it work".
- **App (exact):** as the feature page tracker, plus the Gmail labels the
  steps name: Settings, "Forwarding and POP/IMAP", "Forward it to".
- **Banned:** automatic, auto-import, hands-free, seamless, "set and forget".

### Step 6: Turns
Each step ends on a thing the reader can check (the address copied, the rep
emailed, the code entered, the test in the inbox).

### Step 7: Sorkin
- **Title:** "How to get supplier invoices emailed straight into CostCook"
- **Opening turn:** the invoice already arrives by email; the work is getting
  it to the one place it gets checked.

### Step 8: Snap
> Forwarding is not on until Gmail's code is entered, and the code shows up in
> CostCook, not in your Gmail.

### Step 9: Scene
- Between lunch and prep, laptop on the pass, the rep's last email open in the
  next tab.

### Step 10: Connection
- POV "you". Steps numbered in the settings page's order, so the reader can
  follow with the page open beside it.

### Step 11: Revise
- Cut the explanation of why the address is private to one sentence.
- Cut the Gmail screenshot plan: Gmail's settings move; the step names its
  labels instead.
- The close hands off to the feature page with `featureHref`, and to the
  existing invoice review guide for what to check once it arrives.
