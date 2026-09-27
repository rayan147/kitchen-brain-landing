# Lane B notes: Clients

Discovery on 2026-09-27. This lane was read-only. Production is `~/kitchen-brain-develop-demo` at `ed6ff5f01`, and that HEAD equals `origin/main`. The rows are in `B.yaml`: 10 rows, all **production**, with none assumed-today and none off-page. B-09 is shared with lane D and B-10 with lane A, so drop one copy of each when the lanes are merged.

## The walk, in a caterer's words

1. **The phone rings.** You open **Clients** from the sidebar. Only an owner or manager sees it, because a cook never gets the client list. You type part of a name or a number into "Name or phone" and tap **Search clients**. The search also matches email and any old names a client had before a merge.
2. **Not there? Save them on the same screen.** The "Add a client" card sits beside the list. You choose Person or Company (nothing is preselected), type a name, and optionally add phone, email and a note. Then tap **Save client**. If the phone or the exact name is already in the book, the app asks: "You already have … Two records for one client split its orders between them." You can then choose **Open {name}** or **Save a second client**. A save lands on the new profile with "{name} is saved."
3. **The profile** holds three things:
   - **Details**, with **Edit details** and **Save details**.
   - **Events and orders**, grouped as Upcoming, No date yet and Past, each linking to its event or order.
   - **Contacts** (who books, with a role) and **Venues** (address, state, ZIP and access instructions, for example a gate code).
4. **Their next order starts from the profile.** **Start an order for this client** opens a new order with the client already picked. Then you choose the contact and venue. The preview "This order will carry" shows exactly what gets copied, and adds: "Copied when you save. Editing the client later leaves this order as it is."
5. **Later, the client's address changes in the book.** The order card says the details differ. It offers **Update this order from {name}** or **Keep this order as it is**, and it never updates the order by itself.
6. **Tidy-up.** **Review possible duplicates** lists clients that share a phone or an exact name. From there you can:
   - **Archive** one. It is reversible, and history is kept.
   - Open **Review a merge of A and B**, pick which one to keep, and press **Merge into {name}**. A merge cannot be undone, and the screen says so. The other record becomes an "Also known as" alias and a read-only record that points to the one you kept.
   - Link orders that were typed before the client was saved. This includes storefront requests. They then show up in the client's history.
7. **From an inquiry.** On a new inquiry, the client box reads "Search or add a client" and offers "Add "{name}" as new client". An event without a client shows **+ Add or choose client**, then **Link client**. Both of these save a new Client too.

## Where clients come from, and where they don't

A client record is written in exactly one place, `repository.ts:90-97`, and only two paths call it:

- the manual **Save client** on /customers;
- the inquiry and event paths (new inquiry, **Link client** on the workspace, and **Edit details**).

These paths **never** create a client:

- online ordering or storefront requests, which store the customer they typed on the order;
- Square;
- QuickBooks;
- any import or sample data;
- the proposal builder in the assumed-today worktree. It *reads* the book to fill the proposal's recipient name and email, and does not create or link a Client.

Orders with typed names join a client only when the owner links them explicitly, under "Orders typed before the client was saved".

## Limits to say plainly (for truth-pass copy)

- **Owners and managers only.** Cooks cannot open Clients.
- **No money on the client page.** The profile shows no totals, deposits, balances, invoices or lifetime spend, by design (`ClientHistory.svelte:15-16`).
- **Event lines don't show booking progress.** An event line reads only "Inquiry", "Inquiry with a kitchen draft" or "Lost inquiry". A proposal sent, signed, booked or paid event is not shown as such on the profile.
- **The profile can start an order, not an inquiry.** There is no "new event for this client" button, and /events/new does not preselect a client.
- **Duplicate detection is exact.** It matches the same phone string or the same exact name only. It does not use email, fuzzy names or normalized phone formats.
- **The inquiry path skips the duplicate question.** Adding a client from an inquiry does not ask "You already have …". The combobox does show matching saved clients first.
- **Merge is permanent.** It cannot be undone; archive is the safe option.
- **Paging.** The list shows 100 clients at a time, and search finds the rest.
- **No import.** Clients cannot be brought in from a spreadsheet, Square or QuickBooks. PRD 01 puts automatic historical imports out of scope.
- **No sending from Clients.** There is no email, marketing, lead scoring or follow-up task list inside Clients. PRD 01 puts these out of scope. Follow-up dates live on inquiries (lane A).
- **Sage has no client tool.** Sage can't look up or change clients: grep of `src/lib/server/sage` finds no directory reads.
- **The audit trail is hidden.** The app records who changed a client and when (`customer_record_changes` has actor, time and source), but no screen shows it. It is not a caterer-facing feature.

## PRD 01 (front-of-house/01-customers-inquiries.md)

- **Built:** user stories 1, 2, 3, 5, 7 and 8, and 6 of the 7 acceptance criteria.
- **Partial:**
  - Story 4, past and upcoming events. The history lists them, but it has no booked or payment state and no "new event for this client" button.
  - Story 6, duplicates. There is no email key.
  - The "second event from a customer" criterion. It works through /events/new, but not in one step from the profile.
- **Not built:** nothing in scope.

Details are in `B.yaml` under `prd_status`.

## Test evidence caveat

In the 2026-09-26 full walk (`~/kb-qa-suites`), every client spec passed except `e2e/order-client-selection.spec.ts:52`, which failed at 1280 and 390. It failed on `selectOption` against the new searchable Venue picker. Develop's copy of that spec has since been updated (lines 63-65), but no re-run is recorded. Treat B-09's selection flow as proven by code and unit tests, not by a green end-to-end run.

## Owner questions

1. **Should the landing call them "clients" or "customers"?** The app says "Clients" on screen, and CONTEXT.md avoids "customer" on screen. The landing says "customer" everywhere and never mentions a client book, contacts, venues, history or duplicates.
2. **Is the missing "new inquiry for this client" button intended?** The profile starts only orders. Should the landing avoid "start a repeat booking from the client's page" until an inquiry door exists?
3. **Should the inquiry path ask the duplicate question too?** On /customers, the app asks before saving a second record with the same phone or name. When a client is added from an inquiry, it does not ask. Is that intentional?
4. **Should the client profile show money** (lifetime spend, open balances) or booked status? Today it deliberately shows neither. Is that the final design, or should copy stay silent about client value?
5. **Does `design/client-to-order-guidance` (1 commit, 2026-09-24) merge soon?** It reworks /customers and the client-to-order handoff. If it merges, B-01, B-04 and B-09 labels may change.
6. **Can `codex/541-archive-customers` be deleted?** It is stale, and merging it would remove the merge review.

## Capture-worthy frames

1. **Repeat client profile (B-04).** Show Upcoming and Past lines under "Events and orders", with the button **Start an order for this client**. This frame best supports "they called again; it's all here".
2. **Order client preview (B-09).** Show "This order will carry" with Name, Phone, Address and Access (a gate code). It makes "stop retyping the delivery address" concrete.
3. **Duplicate prompt on save (B-01).** Show "You already have …" at 390px with **Open {name}** and **Save a second client**.
4. **Merge review (B-07).** Two cards side by side, one chosen, with the outcome sentence and "A merge cannot be undone; if you are not sure, archive one instead."
5. *(Optional)* **Drift notice on an order.** Show **Update this order from {name}** / **Keep this order as it is**. It matches the "nothing changes behind your back" voice.
