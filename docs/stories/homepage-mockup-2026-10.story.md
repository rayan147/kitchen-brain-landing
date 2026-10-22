# Story Tracker — compact CostCook homepage

- **Piece:** Homepage based on the supplied October 2026 mockup
- **Headline:** Know the food cost before you quote the job.
- **Hero:** An owner-caterer pricing the next event between kitchen tasks
- **Content files:** `src/components/home/HomeHero.astro`, `HomeEventWalk.astro`, `HomeKitchen.astro`, `HomeConnections.astro`, `HomeClose.astro`

| # | Step | Done |
|---|---|---|
| 1 | Idea | ☑ |
| 2 | Character | ☑ |
| 3 | Plot | ☑ |
| 4 | Scenes | ☑ |
| 5 | Voices | ☑ |
| 6 | Dialogue | ☑ |
| 7 | Intention and obstacle | ☑ |
| 8 | Snap | ☑ |
| 9 | Scene | ☑ |
| 10 | Connection | ☑ |
| 11 | Revision | ☑ |

## 1. Idea

An owner-caterer wants to quote a 150-guest wedding with confidence, but scattered recipe prices and event tasks make the number hard to trust.

## 2. Character

- **Want:** Send a price today.
- **Need:** See the food cost and know what the team must do after the client accepts.
- **Wound:** A past quote whose food cost only became clear after the event.
- **Flaw:** Holding the true cost in memory while the written quote uses old prices.

## 3. Plot

| Beat | Page moment |
|---|---|
| Opening image | A quote is due while the kitchen is busy. |
| Theme | Know the food cost before the quote leaves. |
| Set-up | Recipes, supplier prices, and the event plan sit apart. |
| Catalyst | The client needs a per-guest price. |
| Debate | Can the caterer trust the cost and keep the event moving? |
| Break into two | The menu and guest count enter one event. |
| B story | The client accepts on a phone; the crew receives the lists. |
| Fun and games | A custom inquiry reaches a proposal, client decision and possible revision, agreement, deposit and booking; priced orders confirm by their own rules; confirmed kitchen orders then buy, receive, prep, pack and close out. |
| Midpoint | The sample service shows $95 per guest and 29.2% food cost. |
| Bad guys | A price can be missing; an integration can be unavailable. |
| All is lost | The number stays a guess until the event is over. |
| Finale | Start with the first dish and see its cost before the next quote. |

## 4. Scenes

| Section | Beats | Turn |
|---|---|---|
| Hero with real product frame | Opening to debate | Guess → inspectable number |
| Three entry paths and shared kitchen work | Break into two, B story, fun and games | Different confirmation routes → one kitchen plan |
| Food cost proof | Midpoint | Claimed result → visible working |
| Three outcomes | Fun and games | Feature list → practical consequences |
| Connections | Bad guys | Assumed integrations → honest availability |
| Close | All is lost, finale | Delay → first dish costed |

## 5. Voices

- **Reader:** “What do I charge a head?”, “What do I need to buy?”, “Did I actually make money?”
- **Product:** Calm, concrete, kitchen-literate. Avoid “seamless,” “powerful,” and “effortless.”

## 6. Dialogue

The hero supplies the price and the 30% food-cost target before the pitch, with the film beside the trial action and a founder booking link underneath. The event path shows three distinct ways to reach a confirmed kitchen order, including the proposal revision loop, signature and deposit on a custom inquiry; the kitchen handoffs follow. The food-cost frame shows four dish costs, their shares, and the correct total; the connection row gives each tool's job and availability; the close invites a first useful action with the full trial terms beside it.

## 7. Intention and obstacle

- **Intention:** Quote the event.
- **Obstacle:** The current food cost is uncertain.
- **Headline:** Know the food cost before you quote the job.
- **Subhead:** Price the job from your recipes, then let the client accept the proposal on their phone.

## 8. Snap

“If a price is missing, it tells you which one. It never slips in as zero.”

## 9. Scene

The caterer is at a prep table between calls, checking a wedding menu and the supplier prices before answering the client.

## 10. Connection

Second-person point of view throughout. The hero’s sample wedding becomes the event path; the path leads to the dish costs; the cost proof leads to what the kitchen can do; the connections strip addresses the last practical objection before the trial.

## 11. Revision

The earlier long frame-by-frame walk is shortened to three illustrated entry routes joining one event path. The October reference is carried into the warm cards, round icons, curved connector, and the final line that names the shared kitchen order. A later workflow review found that “Inquiry → Quote if needed → Booking” erased the client decision, possible revision, signed agreement and deposit request. The custom inquiry card now shows those boundaries before Book the event and Confirm order; acceptance alone does not book it. Online ordering remains a priced request until approval, and booking rules decide whether approval or client payment confirms. A direct phone job from a saved priced menu can skip a proposal and confirm its kitchen order. The shared rail begins at purchasing after confirmation, because event booking is not the common first step. The second hero reference places trial and promo video side by side, with founder booking below. Its proof card labels the quoted event price, estimated food cost, and the sample kitchen’s 30% food-cost target; the disclosure remains in the card. The food-cost reference becomes a four-row illustrative panel with dish photos, correct shares, a $22.96 total, and a 24.2% food-cost ratio at $95 per guest. The supplied mock's $23.96 and 25.2% conflict with its own four row amounts, so they were corrected. A disclosure keeps the current product capture inspectable. The connections reference expands the five compact status cards into one row of icon, purpose, and availability; live and coming words remain drawn from the release ledger. The close reference separates the reader's first action from the trial terms: the reader can start with one recipe and understands the card requirement before choosing the trial. “Estimated profit” was removed because food margin is not business profit. Final image: the reader costs the first dish before the next quote.

## UX brief

- **User:** Owner-caterer or restaurant owner who caters, often scanning on a phone during work.
- **Job:** Decide whether CostCook can price and run the next event.
- **Success:** Recognize the product, inspect a real cost screen, and start the trial or take the tour.
- **Pattern:** Short marketing story using existing header, buttons, product captures, and close. The hero presents one trial action with video and booking choices nearby; three entry cards clarify the optional paths.
- **States:** Static content plus a native video disclosure and transcript. No data loading or form states on this page.
- **Primary CTA:** Start free trial.
- **Copy:** Product claims stay within the release ledger; Coming connections are explicit.
- **Accessibility:** Semantic sections, heading order, readable captures, keyboard links and disclosures, native video controls and transcript, visible focus, responsive reflow.
- **Risks:** Mockup figures and profit wording could overclaim; use captured app numbers and food-cost language.

### Food-cost section redesign brief

- **User:** Owner-caterer scanning on desktop or phone before pricing an event.
- **Job:** See how four dishes contribute to the per-guest food cost and choose whether to inspect the pricing guide.
- **Success:** The four rows, $22.96 total, 24.2% share, and guide link are legible without opening the current product capture.
- **Pattern:** Existing cream band, Fraunces heading, product-proof surface, and shared workflow icons.
- **States:** Static illustrated sample; the native disclosure reveals the current product screen. There is no loading, empty, or error state for this static section.
- **Primary CTA:** How menus and quotes are priced.
- **Copy:** Name the food-cost calculation directly; call the panel illustrative and the disclosed image the current screen.
- **Accessibility:** Semantic heading order, keyboard disclosure, meaningful image alt, 320px layout, and no color-only meaning.
- **Risk:** The supplied mock's total was mathematically inconsistent with its four rows; the implemented total follows the rows.

### Connections and close redesign brief

- **User:** Owner-caterer deciding whether current integrations and trial terms fit their kitchen, on desktop or phone.
- **Job:** Distinguish Live from Coming, inspect limits if needed, then choose the trial or founder session.
- **Success:** All five connection cards state a concrete job and status; the trial action and full terms are visible together.
- **Pattern:** Existing warm homepage bands, shared availability constants, icon marks, primary button, and supporting links.
- **States:** Static release snapshot; no loading or empty state. Coming cards state that there is no announced date.
- **Primary CTA:** Start free trial. The integrations guide and founder booking are secondary navigation.
- **Copy:** A one-recipe starting point followed by the honest payment terms; no connection is described as live before release.
- **Accessibility:** Semantic list, text status alongside color, visible focus, 44px link targets, and reflow from 320px.
- **Risk:** Future connector descriptions can sound live; the Coming label and detailed limits link must stay clear. The reference's “Collect deposits” wording is replaced with the accurate client action: clients pay through the kitchen's Stripe account.

### Event-workflow correction brief

- **User:** Owner-caterer deciding whether the site understands a real custom booking, on desktop or phone.
- **Job:** See what happens after an inquiry, including client changes, signature, deposit and the separate kitchen confirmation.
- **Success:** The custom route shows proposal review and revision before agreement, deposit and booking; the remaining balance appears alongside kitchen work; the other routes do not inherit those steps.
- **Pattern:** Three existing route cards connecting to one icon rail; use vertical steps inside each card for the longer front half.
- **States:** Static workflow explanation; rejected or changed offers are described in the card, and online payment is conditional on booking rules.
- **Primary CTA:** Follow the sample wedding in the product tour.
- **Copy:** Distinguish proposal acceptance, signed agreement, Book the event and Confirm order; call the latter the kitchen handoff.
- **Accessibility:** Ordered route steps, explicit labels beside icons, a textual join statement, and a stacked phone layout.
- **Risk:** Booking differs between a custom event and an online order. Only purchasing onward belongs in the shared rail.

The remaining balance is a parallel track after confirmation. A booked custom event can request it when due while kitchen work continues; an online order with a paid deposit gets a separate balance pay link. This avoids implying that all payment finishes before purchasing or prep.

### Workflow mockup revision, 2026-10-22

The owner's “From Inquiry to Kitchen Workflow” reference keeps the same three entry routes and five kitchen stages. The story turns at the shared connector: different ways of confirming an order lead to one set of purchasing, receiving, prep, packing and closeout tasks. The redesign widens and warms the three cards, makes the curved join visible, adds directional arrows along the kitchen rail, and presents payments as one parallel band. The custom route still names revisions, signature, deposit and booking; the order route still makes payment conditional on the booking rule; the saved menu route still skips a proposal. The payment band names the remaining balance and the conditional card-balance reminder, preserving the owner's earlier correction.

The owner further asked to make the split-payment reminder explicit. The online route now states that a deposit rule sends a separate balance pay link and one email reminder. The payment band distinguishes the custom event's manually requested balance from its automatic reminder three days before the due date if still owed.

### Integration description truth pass, 2026-10-22

Checked the `kitchen-brain` `develop` checkout. The invoice inbox settings page says suppliers email invoices to a private address and each waits in review until confirmed, so the homepage card now names both actions. Square's counter report uses completed sales and current recipe prices, so its card says “today's recipe costs” rather than implying historical actual costs. Square stays marked Coming. Invoice email stays marked Live under the explicit owner ruling in RC-73, although the app's production infrastructure file still has its inbox worker disabled; that release-status discrepancy is recorded in the ledger and remains a separate verification item.

The owner removed the general “Coming connections have no announced date” line under the cards. Each card retains its own availability word, and the detailed integrations page still gives the limits for the planned connectors.

**Focused UX brief:** The reader is a caterer comparing entry routes on desktop or phone. The job is to locate the route that matches the next client request and see where it joins kitchen work. Success means the three routes, join, five stages and payment track can be understood in order without implying that acceptance or approval always means booking. The pattern is the existing static section with ordered lists and shared SVG icons. There are no loading, empty, or error states. The product tour remains the primary action in this section. Icons accompany text; the join has a text label; links retain visible focus and 44px targets; the layout reflows at 320px. The risk is shortening copy until a payment or confirmation boundary becomes false, so the product wording and claim ledger stay authoritative.
