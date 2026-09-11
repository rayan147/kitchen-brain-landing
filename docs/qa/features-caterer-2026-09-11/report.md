# Feature pages: caterer first-visit fixes

The `/features` hub, four category pages and thirteen specialist pages now explain kitchen tasks, required inputs, results and limitations in plainer language. This is a persona-based review, not a test with actual caterers. No routes were added, removed or renamed.

## Workflow and scope

The reader runs a six-person catering operation, understands spreadsheets and is deciding between services whether to try CostCook without an onboarding call. She enters through `/features`, the shared Features menu, a category page or a direct specialist link; scans the example; optionally opens details; then starts a trial, prepares for setup or books a demo.

Evaluation frequency is assumed low, without analytics. Complexity is medium because the visitor must understand inputs and costs. Reading and disclosure actions are reversible and low risk; trusting pricing, dietary or access claims carries higher risk. Specialist pages keep their existing dedicated routes, while category pages retain the grouped feature inventory. This hybrid remains appropriate: no route or workflow restructuring is needed.

Equivalent roles remain consistent: breadcrumb for location, task heading, input/result explanation, labelled example, optional detail, limitations, trial and booking choices. Shared `FeatureTrialTerms` reads the existing plan values and supplies card, billing unit, cancellation and setup links. No Strategy pattern is needed: the variation is static content rather than runtime behavior; the refusal is recorded in the source.

There are no new forms or submission states in this scope. Existing product explanations name the important recovery paths: correct an imported row, count stale stock, retry a supplier email, keep delivery shortfalls open, review uncertain dietary information and decline a Sage draft. Marketing success is reaching the chosen next step. Signup, payment, bookings and product mutations were not submitted.

## Fixes, sorted by impact

| Impact | Where | Question before the fix | Implemented answer |
|---|---|---|---|
| Abandons | Trial decisions across the family | “Do I need a card? Is $49 for each cook? How do I cancel?” | Shared 15-day trial, per-kitchen price, card requirement, $0 today, Settings → Billing cancellation and preparation/plan links. |
| Abandons | Menus and quotes examples | “Why don’t the dish costs add up? What target gives $89.78?” | Separate the tour quote from the four-dish example. Four dishes total $12.00 per guest; a 30% food-cost target gives $40.00. Label the tour’s 30% target and food-only exclusions. |
| Abandons | Team access | “Can my cooks see the costs, and what does each role mean?” | Direct role descriptions, visible cost-screen access and no-custom-role limit; shared launch crew terms and unannounced later limits. |
| Abandons | Dietary results | “Does Clear mean I can serve it without another check?” | Clear describes reviewed records, not a guarantee about served food. Keep detect-never-certify, unknown-ingredient and halal/kosher limits. |
| Frustrated | Feature headings, descriptions and lists | “What does this do for my next event?” | Lead with costing a dish, comparing suppliers, checking deliveries, stock, prep or packing. Replace internal architecture terms with actions and consequences. |
| Frustrated | Import pages and lists | “What are staged facts? When do my prices change?” | Upload → review against original → correct uncertainty → confirm/save; retain duplicate and pack-change checks. |
| Frustrated | Recipes example | “Thirty percent of what?” | State $164.16 / 24 portions = $6.84; $6.84 / $22.50 selling price = 30.4%. Separate crowded currency values into two columns. |
| Frustrated | Inventory and reliability | “Can an old count reduce buying? Can I edit without signal?” | Old/missing counts do not reduce buying; previously opened order pages are readable offline, with changes requiring reconnection. |
| Frustrated | Sage | “What can I ask? What can it change?” | Practical questions, source records, role limits and an Owner/Manager-approved shopping-list draft; remove tool, fixture and kill-switch terminology. |
| Frustrated | Labels and integrations | “Will this work if I start today?” | Explicit preview/Coming language before commitment. Labels and the connections remain unavailable; no release status changed. |
| Frustrated | Monthly costs | “Is the whole difference waste? Do these four rows equal the total?” | Explain planned ingredient use versus purchases, logged waste and unexplained remainder. Identify the four displayed purchases as a sample of the 47-record month. |
| Mild | Demo actions | “Is this a video or a booking?” | Booking links explicitly name a demo; video actions retain their durations. |
| Mild | Optional feature inventories | “Do I have to read all these details?” | Ingredients, inventory and monthly purchase lists start collapsed, preserving native disclosure behavior. |

## Route coverage

All routes below were inspected as rendered content, including expanded disclosures, at 390×844 and 1440×900. The family regression also covers 1280×800, 1024×768, 768×1024 and 320px with 200% text.

| Route under `/features` | Main improvement |
|---|---|
| `/` | Task-led overview, clear availability and self-service choice |
| `/getting-prices-in` | Paperwork review, purchase sources and confirmed price changes |
| `/the-day-itself` | Confirmed event, shopping, prep, packing and delivery recovery |
| `/compliance-and-labels` | Nutrition estimates, guest restrictions and unavailable date labels |
| `/team-and-connections` | Setup, roles, offline reading and integration limits |
| `/recipes-and-costing` | First recipe inputs, selling-price denominator and readable costs |
| `/menus-and-quotes` | Per-guest quote, explicit target and reconciled sample figures |
| `/ingredients-and-supplier-prices` | Comparable usable-unit prices and affected recipes |
| `/invoices-and-price-list-import` | Review before saving, clear uncertainty and duplicate handling |
| `/inventory` | Count first, record changes, use only trustworthy stock |
| `/purchasing-and-receiving` | Ordered versus received quantities/prices and shortfall follow-up |
| `/order-shop-prep-pack` | Required confirmation and three distinct progress lists |
| `/purchases-and-month-cost` | Planned cost versus spending, sample ledger rows and unexplained difference |
| `/nutrition-facts-and-allergens` | Ingredient sources, missing information and estimate limits |
| `/guest-restrictions-and-dietary-guards` | Clear review-result language and no certification implication |
| `/labels-and-printing` | Unavailable preview, storage/date choices and reprint explanation |
| `/sage` | Kitchen questions, source checking and human approval |
| `/team-and-access` | Own sign-ins, role actions, visible costs and launch crew terms |

## Verification

- `npm run build`: all 42 pages built; all postbuild page and claim contracts passed. Existing exact-heading checks follow the revised copy; structural, release and safety assertions remain in place.
- `npm run check`: 0 errors, 0 warnings; two pre-existing unused-variable hints in unrelated verification scripts. Landing claim guard passed.
- `COSTCOOK_QA_URL=http://127.0.0.1:4341 npm run verify:feature-family`: passed 25 routes at five viewports plus 320px/200% text. Added the dietary route and assertions for feature-page card/cancellation/billing-unit disclosures and unambiguous booking labels.
- Supplementary Playwright review: 18 feature routes, 36 desktop/mobile frames, zero horizontal overflow, broken local anchors, ambiguous booking links or JavaScript errors. Native disclosures and headings verified without JavaScript on every route. See [verification.json](verification.json).
- First-pass issues resolved: import/Sage actions below the laptop fold, crowded recipe amounts, and initially expanded long lists. Shorter headings preserve the action position without weakening viewport checks.
- `git diff --check`: passed.
- Impeccable detector: 18 advisory font-size findings in existing feature CSS. The cited font-size declarations were not changed by this wording task; these are recorded as existing design-system cleanup, not claimed as fixed.

Representative screenshots: [recipes desktop](recipes-and-costing-1440.png), [menu mobile](menus-and-quotes-390.png), [imports desktop](invoices-and-price-list-import-1440.png), [team mobile](team-and-access-390.png). The directory includes every feature route at both sizes and expanded text extracts.

## Evidence and limits

Capability meaning follows the existing feature register and release ledger, including previously inspected application evidence. This task did not independently certify a new production deployment or alter plan entitlements. Calculated examples are labelled; customer testimonials and time-saving statistics were not invented. Post-launch teammate limits remain unannounced.

Each specialist page’s existing Story Tracker includes the eleven-step revision. The four category pages have individual `features-<category>-caterer.story.md` trackers, referenced from their shared data. Changes are local on `develop`; no commit, push or deployment was performed.
