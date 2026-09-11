<!-- story: docs/stories/caterer-landing-review-2026-09-11.story.md -->

# CostCook landing page: a busy caterer's first visit

Method: rendered persona walkthrough plus independent assessments by `/root/visual_review` (design) and `/root/detector_evidence` (browser/detector). Design assessment finished before detector findings entered the synthesis. This is simulated evaluation, not interviews, measured customer behavior, or a conversion experiment. Recommendations only; the site was not changed.

## Narrative walkthrough

### Arrival: I understand the kind of work, but not the work of starting

“This is for caterers. Good. I see costing, buying, prep and packing, and I can tell where to start. The page looks calm and professional. It doesn't feel like restaurant software I have to adapt to catering.”

“‘Enter the numbers once’ sounds useful. Which numbers? I have a menu and a guest count. You still need to know what goes into every dish. Are my recipes already in here somehow, or do I have to enter them first?” **F01**

“‘The same numbers run to the pack list and back’ takes another read. Back to what? And ‘quote to shelf’ could mean ingredients arriving or finished food being stored. I understand the jobs named in the heading more readily than those sentences.” **F02**

“Fifteen days free, then $49/month per kitchen, unlimited crew during launch. Card up front, $0 today. Those are real answers, and I'm glad they're here. But ‘during launch’ makes me wonder whether adding my five teammates will cost more later.” **F08**

The first-frame answer is broadly successful: CostCook is back-of-house software for event-based kitchens; the primary action starts a trial; watching is an alternative. The remaining unanswered question is what she must contribute before the product can do the work. This is an evaluator's brief-exposure judgment from the [arrival screenshot](01-mobile-arrival.png), not an unprimed human five-second test; the evaluator had prior repository context.

### A little farther down: I want to check the arithmetic

“180 guests at $68 gives $12,240. Fine. Food is $26.93 per guest. Then you say ‘Charge at least $89.78 / guest.’ Why that price? Is that a recommendation for my market, or a calculation against a target?” **F03**

“The caption clears it up: a 30% food-cost target, food only, and the decision is mine. I like the options to change the protein, drop a dish, raise the price, or accept the margin. Put that condition with the first $89.78 instruction so I don't have to question it first.”

“I'm still mostly reading about the product. I have to scroll below this opening frame to see its actual panel. The mobile crop then shows the recommendation, but not the full calculation I'd want to inspect.” **F04**

The wedding arithmetic is coherent at the displayed precision: 180 × $68 = $12,240; $26.93 ÷ $68 is approximately 39.6%; $89.78 is consistent with a 30% target using the underlying food cost before display rounding. Do not treat the rounded per-guest value as the exact calculation input or relabel the food-cost percentage as profit.

### I try the proof before committing

“There is a ‘Demo’ link at the top. I expect to see the software. It takes me to arranging fifteen minutes with Rayan. That's reasonable help, but I said I don't have time for a call. ‘Book a demo’ would have saved me that detour.” **F05**

“Back on the homepage, ‘Watch the 2:53 product tour’ does what it says. The video plays. But on this phone the lists and figures are tiny. I can understand the caption ‘Eight of mirepoix. Six of stock.’ I can't comfortably read the quantities and rows that would let me check the claim.” **F04**

“‘Follow the order in writing’ is a useful alternative. I open it. Quote, shop, prep, receive, update: I can follow that. The nutrition and Sage parts add more things to learn before I have answered how much work it takes to begin.” **F06**

Playback and disclosure actions were actually exercised. The film was sampled at 15, 50, 100 and 155 seconds, with a further playing capture around 50 seconds. The [playing mobile capture](mobile-video-playing.png) shows readable narrative captioning but extremely small app rows. Native fullscreen is available; requiring an extra viewing mode to inspect proof is still a cost to this visitor. This is not a claim that every frame is unreadable or the film is broken.

### I look for the setup answer and make my decision

“I open Menu and choose ‘Your initial setup.’ That page immediately tells me I don't need my whole walk-in: one dish, one invoice, one recipe, about fifteen minutes, then review what was read. That's the answer I wanted beside the first trial button.” **F01**

“A dish is not my whole event menu. Now I know this is worth considering, but I don't have the papers ready and this gap is shorter than the first-dish estimate. I'm going to come back when I can actually check a dish.”

**First simulated abandonment point: defer the trial after finding the setup explanation.** The fifteen-minute estimate is not itself a usability defect; meaningful setup takes work. The avoidable problem is making Dana inspect proof and another page before she can understand that commitment. Moving the answer earlier may produce a better-informed deferral rather than an immediate signup, which is a valid outcome.

### Evaluator continuation: the rest of the homepage

The natural persona pass stops above. The following first-person reactions are a labeled coverage continuation, not a claim that Dana patiently read the entire page during her gap.

“The spreadsheet section understands my week. I particularly trust the explanation that missing prices must not quietly become zero. But I have now seen the same chain as a heading, a diagram, a film, a written tour, a problem story, and another set of outcomes. Which of these is adding the answer I still need?” **F06**

“The fit section tells me where the product stops. That's helpful. The permission limit is especially relevant: the crew can see costs. I don't need a custom permission system explained in detail to understand that consequence.”

“The yield example is convincing: 60 grams, 91% after coring, 66 grams to buy, $0.17. The additional ‘12% of the recipe-line subtotal’ gives me another percentage without showing the rest of that recipe. Why do I need that number here?” **F10**

“‘Paper in, staged facts out’ sounds like someone explaining software. I want to upload an invoice, check what it read, and approve the prices. ‘Four doors, one queue’ makes me translate the heading before the explanation helps.” **F07**

“Sage shows its sources and waits for approval. Good. ‘11 checks,’ ‘1 tool,’ ‘five jobs,’ and ‘nine rules’ make it sound as if I need to learn its internal categories. Give me one question I would ask and show the answer.” **F07**

“Nutrition, paperwork, Sage, team access, another explanation of event work, then features that aren't here yet. These may matter later. Right now they are a lot of decisions between the useful example and the trial explanation.” **F06**

“The roadmap says three additions. It names kitchen labels and says ‘the other three.’ I can only see two others. Which list is current?” **F09**

“‘One real order, start to finish’—is this an actual customer's wedding or a demonstration record? Showing working software is enough; say which kind of example it is.” **F11**

“Now, finally, ‘What it takes first’ explains the dishes, uploads, checking and typing. The trial ticket tells me day 16, how to cancel and what I can export. This is excellent decision material. I would have used it much earlier.” **F01**

On a laptop, local readability improves, but the written tour is already expanded and its disclosure summary is hidden. Watching and reading become a long sequence instead of clear alternatives. **F06** No new app routes or operational workflow restructuring is needed; the recommendation is to reorder and disclose homepage information.

## Prioritized friction table

Severity describes the likely consequence for this simulated persona: **abandons** = stops or defers; **frustrated** = continues with avoidable interpretation or investigation; **mild** = brief hesitation with easy recovery. Confidence in the observed interface can be high while confidence in the predicted behavior remains a hypothesis.

| ID | Screen / frame / viewport | Exact element | Dana's question | Cause | Severity | Proposed landing-page improvement | Evidence / confidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| F01 | `/`, opening CTA versus `#start`; phone and laptop | “Enter the numbers once”; “What it takes first”; cancellation answers | “What do I have to enter before this can cost my menu, and can I stop without a call?” | Setup and exit facts exist but are separated from the early commitment. Settled phone setup paragraph starts at y≈20,783. | **abandons** | Put a compact first-dish explanation beside the first trial decision, with required inputs, human review, approximate effort and cancellation deadline. Keep the detailed close. | [Arrival](01-mobile-arrival.png), [close](mobile-start.png), [setup destination](mobile-linked-onboarding.png), [settled metrics](settled-metrics.json). High observation confidence; deferral is simulated. |
| F04 | `/`, hero proof and `#demo`; 390×844 | Hero recommendation crop; inline 1600×1000 film rendered about 350×219 | “Can I actually read the numbers before I give you my card?” | App proof begins below the opening frame; sampled film rows are too small to inspect inline. The written alternative explains the process but does not replace visual numerical proof. | **frustrated** | Bring one complete, readable cost-check result earlier. Add two or three tightly cropped proof steps with HTML captions; preserve the full film as optional detail. Make mobile crops carry inputs, result and condition. | [Arrival](01-mobile-arrival.png), [playing film](mobile-video-playing.png), timestamp captures. High for sampled frames; no full-frame-by-frame film review. |
| F03 | `/`, quote step 03; both widths | “Charge at least $89.78 / guest” | “Why should I charge that much?” | The first recommendation omits the 30% target condition explained later. | **frustrated** | Replace with “$89.78 per guest to meet a 30% food-cost target.” Keep the food-only boundary and the existing sentence preserving the caterer's choice. | Hero rendered copy and [homepage text](homepage-text.txt). High. The calculation itself is not reported as wrong. |
| F05 | `/`, mobile header → `/demo` | Visible label “Demo” | “Am I watching something or booking a call?” | The visible shorthand hides the booking action. Its accessible name already says “Prepare and book a 15-minute CostCook demo,” but a sighted visitor sees only “Demo.” | **frustrated** | Use “Book a demo” where this links to scheduling; retain “Watch the tour” for the recording. If space is tight, move booking into Menu with the complete label. | Actual click and [destination](mobile-demo-destination.png); [destination text](linked-demo.txt). High. |
| F06 | `/`, LoopBand, `#demo`, `#problem`, `#outcomes`, `#more`; both widths | Repeated operational chain; desktop expanded “Follow the order in writing” | “Do I need to read all of this before I can decide?” | Several formats repeat the same story; secondary capabilities delay setup/exit reassurance. Desktop forces the written alternative open. | **frustrated** | Use one core event proof sequence. Merge repeated problem/outcome statements, offer watch/read as alternatives at both widths, and shorten optional capability summaries. Move trial preparation before deep mechanics. | Settled page: 23,617px mobile, 20,556px desktop. `#more` alone ≈4,536px / 4,971px. [Metrics](settled-metrics.json), [desktop tour](desktop-demo.png). High geometry confidence; proposed order needs visitor validation. |
| F08 | `/`, first price line; supporting `/pricing` and `/faq` | “unlimited crew during launch” | “Will my six-person team cost more later?” | Duration of the teammate entitlement is not explained. Pricing reassures that the subscription price is retained, but does not resolve that separate limit. | **frustrated** | State the actual future entitlement if decided; otherwise explicitly distinguish today's unlimited teammates from any undecided later limits. Link “launch terms” to that answer. Do not invent a permanent unlimited-seat promise. | Rendered hero, [pricing text](linked-pricing.txt), [FAQ text](linked-faq.txt). High on ambiguity; future commercial policy unverified. |
| F07 | `/`, `#more` and end of `#outcomes`; both widths | “Paper in, staged facts out”; “11 checks”; “1 tool”; “recipe lifecycle decisions”; “implementation detail” | “What does that let me do in my kitchen?” | Internal categories and technical nouns make the visitor translate before evaluating value. | **frustrated** | Use “Upload invoices. Check the prices before they change”; describe one sourced Sage answer and approval boundary; use “See all features” instead of “implementation detail.” Explain role consequences in kitchen terms. | Rendered section text; [expanded import](mobile-import-expanded.png). High. Ordinary kitchen terms such as yield and par are not treated as jargon. |
| F02 | `/`, opening explanation; both widths | “quote to shelf”; “to the pack list and back” | “Back to what?” | The loop's endpoint is metaphorical before receiving and future price updates have been explained. | **mild** | Name the result: “Use your recipes, prices and guest count to build the food-cost check, shopping list, prep plan and pack list. Approved purchase prices feed the next quote.” Split or shorten as needed. | [Arrival](01-mobile-arrival.png), current rendered copy. High. The main heading's kitchen verbs are a strength. |
| F09 | `/`, `#alternatives` roadmap; both widths | “Three additions”; “Kitchen labels … the other three” | “Are there three things coming, or four?” | Three cards exist: labels, par replenishment and Spanish. The sentence retained an obsolete count. | **mild** | Replace the paragraph with “Kitchen labels, par replenishment and Spanish are not available in the launch plan. No release dates are promised.” Avoid maintaining another prose count. | `TheOtherTools.astro:233`, `coming-plans.ts`, rendered page. High; definite copy defect. |
| F10 | `/`, `#yield`; both widths | “12% of the recipe-line subtotal” | “Twelve percent of which total?” | The surrounding proof explains one tomato line, without showing the full recipe subtotal. | **mild** | Remove this percentage from the compact proof, or show its denominator if it is necessary to the explanation. Keep 60 g → 66 g → $0.17 and the visible 91% explanation. | [Yield frame](mobile-yield.png), rendered text. High. |
| F11 | `/`, end of `#demo`; both widths | “That was one real order, start to finish” | “A real customer job or a sample order?” | Working software and customer provenance are not the same claim; “real” leaves the distinction implicit. | **mild** | Use “That was a sample wedding in the working product. Your menu will have different numbers.” Verify the example's provenance before final wording. | Page describes demo captures; repository evidence is a seeded demonstration. High on ambiguity; no allegation of a fabricated testimonial. |

## Section-by-section improvement plan

| Current section | Decision | Visitor question it should answer | Specific change and reason |
| --- | --- | --- | --- |
| Header/navigation | **Clarify** | “Watch, book, or try?” | Preserve distinct trial priority. Make the booking verb visible on mobile. Keep keyboard behavior and focus treatment. |
| Hero | **Clarify / shorten** | “What does this do for my next event?” | Keep audience and kitchen verbs. Consolidate the two explanatory paragraphs; replace the ambiguous return-loop language; make room for legible proof and first-dish preparation. |
| Hero quote check | **Clarify / move** | “Can I trust the result?” | Move a complete result earlier. Keep the sample inputs, food-only boundary, target condition and caterer's choice together. |
| LoopBand | **Merge** | “How do the same records carry through?” | Absorb its most useful price-in/paid-price-back point into the main proof sequence. Avoid maintaining another full chain before the film. |
| See it run + written guide | **Keep / shorten** | “Can I see the product work?” | Keep the film and accessible written alternative. Offer either rather than forcing the full written sequence on desktop. Put readable stills before the optional full tour. |
| What goes wrong | **Merge / shorten** | “Why change my spreadsheet?” | Pair the strongest pains directly with their demonstrated outcomes. Preserve the distinctive missing-price/missing-conversion explanation. |
| Who this is for | **Keep / shorten** | “Does my operation fit?” | Audience is already clear in the hero; keep concise disqualifiers and the crew-can-see-costs consequence. Leave detailed requirements on the linked comparison. |
| What it does instead | **Merge** | “What work stops being repeated?” | Make these four outcomes the main proof sequence rather than a second tour after the problem story. Retain the phone/offline limitation and approved-price behavior. |
| Trim and yield | **Keep / disclose detail** | “Can I inspect the costing math?” | A strong differentiator. Show a compact one-line calculation; make the full working optional. Remove the unrelated 12% unless its base is shown. |
| What else is in it — introduction | **Shorten** | “What other needs does it cover?” | Introduce optional needs without requiring the visitor to assess four more product areas before trial preparation. |
| Nutrition | **Shorten** | “Can I get nutrition estimates or a printed sheet?” | Preserve estimate/printing limitations. Put the detailed derivation and specialist boundaries on the existing feature path, still adjacent to any relevant claims. |
| Invoices and price lists | **Move / clarify** | “How will my recipes and prices get in?” | Bring the upload → review → approve explanation into the early setup summary. Keep format details optional. |
| Sage | **Shorten / clarify** | “Can it answer a useful question, and can I check it?” | Show one question, sourced answer and approval boundary. Remove the taxonomy of checks, jobs and rules from the default homepage read. |
| Team & access | **Keep / shorten** | “Can my crew use it, and what can they see?” | Put six-person cost and visibility implications ahead of role descriptions. Clarify the launch entitlement once policy is known. |
| The other tools | **Merge / shorten** | “Is this for event work or my everyday service?” | Consolidate fit explanation with Who this is for. Retain a comparison link for deliberate evaluation. |
| Coming soon | **Shorten / clarify** | “What would I not get today?” | Fix the count. Keep current availability honest, with the extended roadmap secondary to today's value. Do not promote par replenishment to shipped. |
| Founder | **Keep / move a short excerpt** | “Who is accountable for this?” | A brief chef/founder line and contact can support early proof; retain the full personal explanation later. Do not add invented testimonials or performance claims. |
| Start here + trial ticket + three answers | **Move key facts / keep close** | “What do I need, what will it cost, and can I leave?” | Reuse its strong preparation/cancellation answers near the first trial decision. Keep a final recap and action for visitors who read the detail. |
| Footer | **Keep** | “Where can I find a specific answer?” | Useful navigation and direct contact; no observed reason to restructure it. |

### Proposed order, as a testable editorial hypothesis

1. **Value + readable result:** audience, one event outcome, complete quote check, trial price/card facts and compact first-dish preparation.
2. **One event carried through:** quote → shop → prep/pack → approved price back, with brief before/after statements. Optional watch/read tour.
3. **What trying it takes:** one recipe and its ingredient-price evidence, review/correction, approximate first-dish effort, then build the rest of the menu; cancellation and export boundary.
4. **Why the numbers are trustworthy:** missing facts stop the total, yield example, sources, and brief founder accountability.
5. **Fit and optional needs:** crew visibility, nutrition, Sage, additional import formats, limits and future work with links for depth.
6. **Trial recap and next action:** choose the trial or a clearly labeled optional booked demo.

This uses existing material. No new route or application workflow is required. The ordering is a hypothesis grounded in observed separation and repetition, not a proven conversion lift.

### Highest-impact copy proposals

These are reviewable drafts, not edits to the site or newly verified commercial promises.

**Heading:** “Cost it, buy it, prep it, pack it. Enter the numbers once.” → **“Cost the event. Give the crew one shopping, prep and pack plan.”** The existing heading is understandable; test this alternative rather than treating replacement as mandatory.

**Opening explanation:** “The same numbers run to the pack list and back.” → **“Use your recipes, current prices and guest count to check food cost and build the shopping, prep and pack lists. When the guest count changes, the lists change with it.”**

**Preparation beside the early CTA:** **“Start with one dish: upload its recipe and the invoice or price sheet for its ingredients, review what CostCook read, and correct anything missing. Allow about 15 minutes for the first dish; a full menu needs its other dishes entered too.”** The fifteen minutes is an owner-approved approximation recorded in RC-10, not a timing measured in this review. Do not imply one arbitrary invoice must contain every ingredient.

**Quote step:** “Charge at least $89.78 / guest” → **“$89.78 per guest to meet a 30% food-cost target.”** Keep the food-only exclusions and existing choice-preserving caption.

**CTA reassurance:** Keep the existing per-kitchen price and card disclosure. Add the already documented **“Cancel before day 16 from Settings → Billing. No call required.”** Do not substitute “no commitment” for an auto-renewing trial.

**Import heading:** “Paper in, staged facts out, you confirm.” → **“Upload invoices. Check the prices before they change.”**

**Feature link:** “Need the implementation detail?” → **“Need to check a specific feature?”**

## Product evidence and claim boundaries

The supporting app ref was local `develop` at `88899a798247286b237b03e4403124a5973e9971`. Its checked-out branch remained `ux/buy-and-receive`; all app inspection used `git show develop:…` or `git grep … develop`. `VERTICAL_MAP.md` is untracked and describes `91bea814`, so it was treated as a locator rather than release proof.

| Homepage promise / question | Supporting evidence inspected on `develop` | Conclusion for the landing page |
| --- | --- | --- |
| $49/month, 15-day trial | `src/lib/server/billing/plan.ts`; subscription wiring in `src/lib/server/auth/index.ts` | Amount and duration agree with code. No Stripe transaction or live billing configuration was tested. |
| What happens after Start free trial? | `src/routes/start/+page.server.ts`: kitchen name/email validation, email link, billing destination | Immediate local CTA destination showed name/email and “Verify email and continue,” consistent with the claim that email verification precedes payment details. No submission. This local runtime's app revision was not independently identified. |
| Setup is more than a menu and headcount | `src/lib/features/onboarding/setup.ts`: kitchen, ingredients, allergens/food facts, recipes, first order; import review gate | Support exists for the setup dependency. Bring that requirement forward. RC-10 supports only an approximate, owner-approved duration. |
| Import reading does not remove review work | `src/lib/server/import/review-gate.ts`; review/commit file family located | Ambiguous facts require review; avoid “no typing” or “everything is automatic.” The full import workflow was not exercised. |
| Missing ingredient prices do not silently become free | `src/lib/domain/production/engine.ts:694` rejects nonpositive/missing pack cost with an instruction to add its price | Strong, specific credibility point to preserve. No full engine test suite was run for this report. |
| Previously opened order plans remain readable offline | `src/service-worker.ts`: GET caches, previous-page fallback, explicit no-cached-copy error | Homepage wording “one you opened earlier stays readable” is appropriately bounded. Does not prove offline editing or device-wide availability; do not broaden it. |
| Sage reads kitchen evidence | `src/lib/server/sage/tools.ts`: bounded schemas, source handles, kitchen scope and deterministic queries | Source-backed assistant framing is supported. Exact “11 checks / 1 tool” count was not independently enumerated; it is unnecessary homepage taxonomy, not a proven false count. |
| Par replenishment is Coming | `src/lib/domain/inventory/inventory-planning.ts`: recommendation = event need minus trusted stock; par evaluated separately; `inventory/commands.ts` builds from those recommendations | **Suspected contradiction rejected.** Par status and inventory shopping exist, but shopping does not replenish to the par floor. Keep the Coming boundary. |
| Kitchen labels have release restrictions | `src/lib/server/features/access.ts`: explicit `label_printing` flag, default false unless enabled | Do not remove the Coming label based on implementation alone. Browser nutrition sheets and kitchen/date labels are different promises. Deployed feature flags were not inspected. |

No production availability is certified by this branch inspection. Nutrition regulatory sufficiency, medical/allergen safety, competitor claims and future commercial policy were not assessed. The review preserves the site's stated boundaries rather than treating those as verified legal or safety conclusions.

## Browser evidence, strengths and coverage

**Environment:** existing Docker preview `http://127.0.0.1:4321/`, verified bind mount `/home/rayan147/kitchen-brain-landing` → `/site`. Landing branch `develop`, commit `40e8410`, including existing uncommitted content/navigation/pricing/proof changes. A separate attempted server on 4341 failed startup and exited; the existing preview was left running. See [provenance](provenance.json).

**Widths:** 390×844 phone and 1440×900 desktop. After scrolling and decoding visible lazy images, page heights were **23,617px (~28 phone viewports)** and **20,556px (~22.8 desktop viewports)**. Earlier captures recorded 23,385px on mobile before all lazy images settled; final geometry uses [settled-metrics.json](settled-metrics.json). This difference is not reported as a measured performance regression.

**Verified interactions:** header navigation; Enter/Escape on Features with focus returned; first nine keyboard stops with visible outlines; skip link; seven homepage disclosures opened and closed; native video playback and seeking; written tour; navigation to setup, pricing, FAQ and demo; immediate trial destination. No forms, inquiries, bookings, emails or payments submitted.

**Passed observations:** no page-level horizontal overflow at either width, no page errors in the normal homepage runs, video starts, mobile disclosures work, clear primary action, coherent typography/color/ticket treatment, explicit food-only exclusions, honest card requirement, readable price, direct founder contact, and a strong final preparation/cancellation section. Preserve these. A synthetic source transcript's adjacent text nodes are not automatically visible spacing defects; no finding is based solely on that artifact.

**Detector:** CLI scan of homepage, its ten section components and four additional blocks returned seven signals: five monospace-font warnings and two font-size advisories. The fallback fonts match an established numerical role omitted from the detector's design metadata; the scale advisories did not establish a user-facing defect. Browser overlay reported 74 signals while raw logs contained 83 warning lines, including hidden-menu occlusion false positives. These counts are not defect totals. The intended uppercase labels and ticket composition are not grounds for a generic redesign. No user-visible browser overlay is claimed; it ran only in headless automation. Raw [CLI](kb-assessment-b-detector.json), [browser](kb-assessment-b-browser.json), and [overlay](kb-assessment-b-overlay.json) evidence is retained.

**Independent design check:** product specificity is strong; the design could not become generic project-management marketing without rewriting its proof. Persuasion-scoped heuristic scores were status 3, real-world language 4, control 3, consistency 3, error prevention 3, recognition 2, minimalist presentation 2, help 3: **23/32**. Application accelerators and transaction error recovery were not applicable to this pass. Scores are qualitative diagnostics, not customer satisfaction measurements.

**Limits:** not a full-site or app usability audit, not production verification, not exhaustive screen-reader/WCAG certification, and not a full video-content audit. Tablet, browser zoom, real devices, slow-network behavior and submitted form states were not tested. Linked pages were inspected only to answer homepage questions. The exact future teammate policy and demo customer provenance remain unverified. Temporary browser sessions and the detector overlay server were closed; no source changes or build/test suite runs were needed for this recommendations-only report.

## Dana's decision

**Come back later.** “I understand why this could help, and the concrete numbers make it worth another look. I need a recipe and its prices in front of me, and the page takes too long to tell me that. I would return when I can test one dish properly.”

The three changes most likely to improve that decision are:

1. Put first-dish effort, required inputs and cancellation reassurance beside the early trial choice.
2. Show one complete, readable food-cost result on mobile, with its target and exclusions attached.
3. Carry one event through one proof sequence; make deeper mechanics, additional features and the full written tour optional.

Questions skipped: the requested deliverable is findings and proposed fixes only. No implementation approval is needed or requested in this report.
