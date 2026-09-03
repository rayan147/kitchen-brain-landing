# Surface brief: `/tour/main`

## Mode

Persuade. The visitor should understand the product by inspecting it, then start a trial or book a short demo.

## Workflow

The visitor is trying to inspect how CostCook carries one catering event across the whole working week so that they can decide whether to try it.

- **Start:** Editorial invitation and the seeded event ticket.
- **Frames:** One active feature stop, the persistent twelve-stop index, the seeded product workspace, contextual explanation, and previous/next actions.
- **Alternate path:** Jump directly to any stop or open the full feature explainer.
- **Recovery:** Previous stop, any indexed stop, or the complete feature index; no state-changing action occurs.
- **Success:** Finish all twelve stops and start with a real menu or book 15 minutes.

## Shape decision

Low-frequency, medium-complexity, read-only evaluation. Use a hybrid: normalize the dense product evidence to one active stop while denormalizing navigation so all twelve destinations remain directly reachable. A dedicated route is required because existing feature pages explain one area at a time and cannot preserve the event-spanning sequence.

## Direction contract

- Extend the established Kitchen Ticket world; do not replace the brand.
- **FORM:** Seeded connected-event product workspace; seed key `product-tour-connected-event`.
- Use one coherent illustrative event across all twelve stops.
- Keep every amount persistently labelled illustrative and every behavior within the shipped feature register.
- The product workspace should feel credible and dense without becoming a screenshot thumbnail.
- Desktop keeps the twelve-stop rail beside the product; mobile uses a native select and preserves previous/next actions.
- Keyboard tabs support Up, Down, Home, and End; focus and progress stay explicit.
- The route remains legible without relying on animation, and reduced motion removes progress animation.

## Built surface

- **Entry:** `/tour/main` opens with the Features breadcrumb, an editorial invitation, the `Alvarez–Whitman wedding` dataset ticket, and Start tour / Book 15 minutes actions.
- **Seed:** `product-tour-connected-event` binds one 180-guest wedding and the `Garden wedding supper` menu across the complete experience. The twelve stops are Recipes & food costing, Menus & quotes, Ingredients & supplier prices, Invoices & price-list import, Nutrition facts & allergens, Labels & printing, Orders, shop, prep & pack, Purchasing & receiving, Inventory, Purchases & month cost, Team & access, and Sage, the assistant. Labels & printing remains explicitly Coming and describes the sandbox build rather than the launch product.
- **Frame:** Each active stop renders the same product-workspace anatomy: app-area context and title, persistent illustrative chip, four metrics, an inspectable table, a status/evidence aside, a kitchen consequence, a short explanation, and an `Explore this feature` handoff.
- **Desktop interaction:** At 760px and wider, a vertical tab rail exposes every stop. The active tab uses roving `tabindex`; Up and Down wrap through the set, while Home and End move to the first and last stop and move focus with selection.
- **Mobile interaction:** Below 760px, the rail is replaced by a labelled native select. Evidence tables reflow into labelled row cards so every field remains visible without a hidden horizontal swipe. The selected option, active panel, progress text, progress bar, previous/next labels, and URL hash stay synchronized.
- **Sequence:** Previous and Next remain visible at every stop. Previous is disabled only on the first stop. The final Next label becomes `Finish the tour` and scrolls to the closing Start CostCook / Book 15 minutes decision.
- **Deep links:** Every selection writes `#tour-<stop-id>` with `history.replaceState`; loading a valid hash opens that stop and brings the workspace into the first quarter of the viewport. An absent or unknown hash recovers to the first stop.
- **Data truth:** The dataset ticket says `Illustrative`, the workspace introduction says all guided values are illustrative, and every stop repeats `Illustrative tour data`. These labels persist around every amount. The introduction says each stop follows its public status, and Labels & printing states Coming in both its metric and its explanation.
- **Resilience:** Without JavaScript, the first stop and its product evidence remain server-rendered and a `noscript` recovery link opens the complete feature index. The table may scroll within its own bounded frame, but the document does not scroll horizontally.
- **Motion:** Only the progress fill and final scroll handoff animate. `prefers-reduced-motion: reduce` removes the progress transition and makes the final handoff instant. The surface does not depend on motion for state or meaning.

## Surface boundary

The twelve-stop order, dataset identity, stop hashes, tour progress, finish handoff, and desktop-rail/mobile-select transformation belong to this route and must not be promoted into the global design system. The reusable system extension is narrower: embedded product proof may use a calm bounded workspace, Instrument Sans operational typography, tabular numbers, quiet rules, restrained status color, and persistent illustrative-data labels while remaining inside the Kitchen Ticket world.

## Visual proof constraints

- Inspect at 1440×900, 1280×800, 1024×768, 768×1024, and 390×844.
- Verify every stop can render, the last stop can complete, direct hashes open the requested stop, and the mobile select stays synchronized.
- Reject horizontal page overflow, clipped controls, unreadably compressed product data, and generic equal-card layout.

## Verification and disposition

- Static build coverage enforces the seed key, twelve tabs, twelve panels, all twelve feature destinations, illustrative labels, the route entry in the Features menu, and the absence of the removed coach kicker.
- Browser coverage exercises 1440×900, 1280×800, 1024×768, 768×1024, and 390×844; it also checks a direct Inventory hash and workspace landing position, mobile selection and labelled evidence-card reflow, all twelve stops, the final Sage state, reduced-motion finish behavior, 44px tour controls, console/network health, and 200% text at 320px without page overflow.
- Finish-review disposition: **Ship.** Both scored finish fixes were resolved before this surface was documented.
