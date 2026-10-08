# Plan: three blog guides for online ordering, the website form, and the whole event (2026-10-08)

Branch: `content/ordering-event-blogs` (from develop 8f6f292), worktree
`.gitworktrees/release-inbox`. Preview on http://127.0.0.1:4330. Nothing is
pushed until the owner asks.

App truth: kitchen-brain local develop 7a7e407d9 for labels and flows,
**checked against what production actually serves** before any how-to step
ships (see Gate 0). Feature claims come from `src/lib/features.ts`,
`src/lib/ordering-guide.ts` and the app source, never from memory.

## Why blog posts, when the feature pages exist

The feature pages say *what* ships. The blog's contract is "the working
shown": a worked number, the steps in order, and what to do when it goes
wrong. Each post below has to give the reader something its feature page
does not, or it is cut.

| Post | Feature page it hands off to | What only the post gives |
|---|---|---|
| 1. Take catering orders online | `/features/online-ordering` | The order from the client's side, screen by screen; the worked lunch for 40; which booking rule to pick for which kind of job |
| 2. Put the order form on your website | `/features/online-ordering` | A setup guide with checks; the note to send your web person; troubleshooting |
| 3. One event, from the first call to closeout | `/features/events-and-proposals` | Every step of the event workflow in order, what each feature does at that step, and one wedding or corporate event followed all the way through |

## Gate 0: confirm production first

Gate 0 is the RC-73 rule: never write a setup guide for something production can't do.

Checked 2026-10-08:
- `order.costcook.io/`, `/ordering.js` and `/ordering.css` return 200.
- The last kitchen-brain `production.yml` Deploy runs (2026-09-27) failed in 4 s, the Actions budget failure.
- The memory note from 2026-09-28 says production storefront is the 2026-09-09 build, which has no `/[store]/pay` route, so pay links 404.

Before writing posts 1 and 2:
1. Read the deployed storefront and app sha (`vercel api /v13/deployments/...` → `meta.gitCommitSha`).
2. Run `git merge-base --is-ancestor` against the commits that add the pay route, the widget and the Websites allow list.
3. If the pay route or the widget is not deployed, posts 1 and 2 stay unpublished, the same way the invoice email guide was held. **This also applies to the live `/features/online-ordering` page shipped today (bcdcd34).** If production is behind, that page's pay-link lines need the same hold, and the owner hears it first.

Code change, whatever the result: `src/lib/blog.ts` `comingFeatureRoutes` also
reads `orderingAvailability.isComing`. Then an ordering post is never built or
linked while ordering reads Coming. Leave the `design-patterns` refusal comment
already on that function, updated to say "two rules".

## Post 1: How to take catering orders online, and approve them before anyone pays

- Slug: `take-catering-orders-online`. Category: Running the event.
- Feature: `/features/online-ordering`, "See how online ordering works".
- About 1,100 words, 6 min.

Step-1 sentence: an owner-caterer who takes office lunches by phone and email
wants orders that arrive priced and paid, but each one is retyped, priced from
memory and chased for money.

Sections (each one an h2, so the table of contents gets them):
1. **The lunch order that came in by text.** Open on the retyped order: 40 becomes 14.
2. **What the client sees.** Your link or your website. They pick a menu, the guest count and pickup or delivery, and see the price before anyone calls. The price is never taken from their screen.
3. **What you see.** The request arrives priced, with food cost against your menu. You approve or decline, and a request is never "booked".
4. **Pick your booking rule.** The three Fixed menu rules side by side, with which kind of job each fits: repeat office client, new client, large job. A new account starts on no online payment.
5. **The worked lunch for 40.** The film's numbers, shown as working:
   - $1,273.08 charged by card.
   - Food cost 29.3% with misc.
   - The next day $2.47 over plan, 29.1% without misc.
   - These are the film's own figures, labelled as the film's example kitchen.
6. **Where it stops.** The five limits from `orderingLimits`, in plain words. Email only for pay links; 72 hours.
7. Hand off to post 2 and to the feature page.

Content pin in `check-blog.mjs`: the $1,273.08 line, and the sentence saying
approval under the default rule takes no money.

## Post 2: How to put a catering order form on your own website

- Slug: `catering-order-form-on-your-website`. Category: Running the event.
- Feature: `/features/online-ordering`.
- About 1,200 words, 6 to 7 min. Same shape as `supplier-invoices-by-email`, the best-performing setup guide.

Sections:
1. **Before you start.** Owner or manager. One menu already priced. Pickup or delivery set.
2. **Step 1: Set up the storefront.** The four tabs, short. Link to the feature page for the detail; don't repeat it.
3. **Step 2: Add your website** under "Websites that will show it". Exact address, up to 50. Why: the form shows only there.
4. **Step 3: Send the snippet.**
   - "Snippet for your web person", the two-line shape with placeholders, never a real site id.
   - A ready-to-send note for the web person: where to paste it, that it loads its own stylesheet and frame, and that it can't read the page around it.
5. **Step 4: Go live, then check it showed up.** The four Go live blockers. Send yourself a test order.
6. **If it doesn't show.** Troubleshooting, from the app's own states:
   - "Not taking online orders right now" means not live yet.
   - Address not on the list.
   - Pasted in the wrong place.
   - Only symptoms the app produces, verified in 7a7e407d9.
7. **Your link works without a website.** Copy, the QR code, and where to use it: menus, email signature, a printed flyer.

Not in this post: steps for Squarespace, Wix or WordPress. Nobody has tested
them; "your web person pastes it where the form should appear" is the claim.

Content pin: "Your web person pastes two lines" (the snap line, which the feature
page owns), plus the "Not taking online orders right now" troubleshooting line.

## Post 3: Running a catering event in CostCook, from the first call to closeout

- Slug: `catering-event-first-call-to-closeout`. Category: Running the event.
- Feature: `/features/events-and-proposals`, "See events and proposals".
- About 1,800 to 2,000 words, 9 to 10 min. This is the long one the owner asked for: "which feature it offers", in order.

One event followed through: the sample wedding or company dinner from the product
tour, so the numbers match `/tour`. Each section is one step, and each names
the app's own label and what it does:

1. **The call.** + New inquiry, before the date is decided; who follows up and when; the client record (contacts, venues, access notes).
2. **The menu, costed as you build it.** From costed recipes, a saved menu or a past event; live food cost; guests' restrictions checked against each dish.
3. **The proposal.** Preview exactly what the client sees, set how long the link stays open, send. Remind, extend, withdraw, update.
4. **The client says yes on their phone.** No login; Accept proposal or Ask for changes.
5. **The agreement.** The contract template with the proposal as Schedule A; e-signature or paper.
6. **The deposit.** **See Open question B.** Written only after it is settled.
7. **Confirm order is the booking.** What freezes (quantities, prices, prep notes); "This event is booked"; calendar room for the day; honest reopen.
8. **Buy it.** Purchase orders per supplier (email, print, or handle it yourself); the shopping list in whole packs by supplier; the shelf check; walk-in mode.
9. **Cook and pack it.** The prep list, labels with dates and allergens, the pack list with allergen badges, the equipment list for this event.
10. **Receive it.** The receiving checklist from the sent PO; short or wrong deliveries (link `delivery-arrived-wrong`).
11. **Close it out.** The event cost after: quote against purchases recorded on the event, shortfall evidence from open pack lines (link `expected-vs-actual-food-cost`).
12. **Where online orders fit.** A lunch order skips steps 1 to 5 and lands at step 7. Links posts 1 and 2.

Each step links its deeper guide when one exists, so this post is the trunk and the 11 current posts are its branches.

Kept out, because they're behind the deploy gate (A-05, A-17, RC-62):
- The proposal builder's charge lines.
- Choice groups.
- Payment terms.

Content pin: the "Confirm order is the booking" sentence.

## Blog plumbing

`normal-ui-workflow-audit`, focused mode, for the menu change. The other items
are build contracts.

- **Menu group.**
  - `BlogMenuContents.astro` hardcodes `['Cost the work', 'Plan and buy']`, and `content.config.ts` has the same enum.
  - The three new posts need a home. See Open question C.
  - If a third group is added: update both lists, check the Blog menu at 1440/1024/390 (column count, the disclosure on mobile), and re-run `verify-blog.mjs`.
- **Icons.** `menuIcon` is a closed list. Add `order` (post 1), `web` (post 2) and `calendar` (post 3), drawn in the same stroke as the existing set.
- **Count.**
  - Invoice email is live (`INVOICE_EMAIL_STATUS = 'yes'`), so today's count is 11, and the new posts make 14.
  - `check-blog.mjs` `countWords` stops at 'Thirteen': add 'Fourteen' and 'Fifteen'.
  - Add the three slugs to `expectedPosts`.
  - The ordering slugs are conditional on ordering being live, like the invoice email guide.
- **Read time.** `readMinutes` must equal ceil(words / 200), or the build fails.
- **Rules.** No em dashes; `order` numbers 12 to 14.
- **Feature pages hand back.**
  - `/features/online-ordering` gets a quiet "Set it up step by step" link to post 2.
  - `/features/events-and-proposals` links post 3.
  - Quiet links only, and the CTA cap still holds.
- **Story trackers.** `docs/stories/blog-<slug>.story.md` for each post, with the `<!-- story: -->` pointer as each post's first line.

## Review and verify

1. Truth pass: every label and step in posts 2 and 3 is checked against 7a7e407d9 source, and every availability claim against the deployed sha.
2. `kb-caterer-owner` reads each post as the caterer. `humanize-reviewer` reads the copy. Fix what they find before showing the owner.
3. `npm run build` (all contracts, the new pins), `npm run check:claims`, `npx astro check`.
4. On 4330: `verify-blog`, `verify-features-menu` and `verify-feature-family`, plus a look at 1440 and 390.
5. Show the owner on 4330. Merge and push only when they ask.

## Open questions for the owner

A. **Production.** If Gate 0 finds pay links still 404 on order.costcook.io, do we hold posts 1 and 2 *and* add the hold to today's live ordering page until the kitchen-brain deploy is unblocked (the Actions budget)?

B. **Deposits.** `features.ts` says production records the deposit by hand. The 2026-10-06 ruling says event payments are live. Post 3 waits for the deployed app to settle which one is true. Then it says either "ask for a deposit and record it" or "the client pays the deposit from a link".

C. **Blog menu.** Either a third group, "Take the order" (posts 1 to 3 together), or posts 1 and 2 under "Plan and buy" and post 3 under "Cost the work". A third group is clearer but is a menu layout change.
