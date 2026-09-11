<!-- story: docs/stories/caterer-first-visit-audit-prompt.story.md -->

# CostCook: improve the landing page through a busy caterer's eyes

Answer this question: **How should we improve the landing page so a busy caterer immediately understands the value, trusts the claims, and knows whether to try CostCook?**

Roleplay as Dana, a caterer who has never seen CostCook. Conduct a detailed, evidence-based walkthrough of the landing page. Evaluate its messaging, section order, visual hierarchy, product proof, pricing, setup expectations, and calls to action. Use the app only as supporting evidence for the landing page's claims. This is a simulated persona evaluation, not real customer research. Report findings and proposed landing-page improvements only. Do not implement changes or audit app usability.

## 1. Be this person

You run a six-person catering operation, including yourself. You handle quotes, suppliers, menus, and the inevitable last-minute guest-count changes. You understand spreadsheets, recipe yields, portions, food cost, and kitchen work. You are not technical and have never heard the product team's terminology.

You have a ten-minute gap between services. Start on a phone; separately check the experience on a laptop. You have existing recipe cards, supplier invoices, and a working spreadsheet. You are not shopping for a software project. You want to know whether this helps you cost the next event and get the crew ready without creating more administration.

Your fictional backstory: an old supplier price recently made a quote less profitable than expected. You are cautious about unexplained numbers. Your question is: “My spreadsheet already has numbers. Why should I trust these?”

You will not book an onboarding call to understand the basic offer. Optional human help is fine; required hand-holding is a barrier. You are impatient, not incompetent. Do not pretend ordinary catering language is confusing just to generate findings.

## 2. Establish the evidence without giving Dana insider knowledge

- Landing repository: `/home/rayan147/kitchen-brain-landing`. Inspect the current working tree and record its branch, commit, and relevant uncommitted changes.
- App repository: `/home/rayan147/kitchen-brain-develop-demo`. Inspect the `develop` branch, not whichever branch happens to be checked out. Use read-only Git inspection or an isolated worktree; preserve existing work.
- Use `VERTICAL_MAP.md` only to locate supporting product evidence. Validate relevant entries against the selected revision: the map may be untracked or describe an older commit. It does not define the walkthrough's starting point or expand its scope into app verticals.
- Begin Dana's walkthrough at the landing homepage `/`. Check the primary CTA's immediate destination to establish whether its label sets the right expectation; do not proceed through signup, payment, or setup as an audit task.
- Record the landing browser URL, revision, and viewport. For app evidence, record the inspected revision and whether support comes from implementation, tests, or verified behavior. Do not assume a running demo or production site matches local `develop`.
- Keep source-code knowledge separate from Dana's experience. A README, source comment, glossary, or hidden route cannot answer her question unless the interface makes that answer available.
- If browser access, authentication, or a required service is unavailable, state the coverage limit. Mark source-only findings as inferred. Never invent a click, error, screenshot, timing, or completed journey.

## 3. First impression: what do you understand before scrolling?

Start at the landing page, not inside a seeded account. Describe your first five-second impression from the visible frame. Do not read the whole page first and then pretend the opening was clear.

In your own words, answer:

- What is this, who is it for, and what job would I use it for today?
- What would I stop doing in my spreadsheet? What would I still have to do?
- What catches my eye first? Does it help me make that decision?
- What is the obvious first action, and what do I expect after clicking it?
- Can I see the product before giving my email, card, or time to someone?

Treat the ten minutes as Dana's decision budget, not the evaluator's stopping rule. Mark the exact point she would leave. Continue afterward only as an explicitly labeled evaluator continuation; do not silently give her unlimited patience.

## 4. Walk the landing page in the order it invites

Narrate in first person. At every meaningful frame, state what you notice, what you think it means, what you expect next, and what you actually do. Log every avoidable pause, reread, guess, backtrack, and abandoned action. Include the exact words that caused it. Also note clear moments briefly so the report is not manufactured negativity.

On the natural first pass, follow only links Dana has a reason to choose. Inspect linked pricing, FAQ, setup explanations, or feature pages only when needed to answer a question the homepage raises. Record when an essential answer requires leaving the homepage. Then make a separate coverage pass over the homepage's remaining sections, navigation, product tour, and closing call to action. Do not turn this into a full marketing-site audit or pretend she naturally reads every linked page.

Specifically investigate:

- **The promise:** Can you explain “Cost it, buy it, prep it, pack it. Enter the numbers once” concretely? Which numbers must exist first? Does “once” hide recipe entry, price confirmation, or review work?
- **The proof:** Are screenshots readable at their rendered size? Are videos optional, controllable, and understandable without sound? Can you follow one event across the page without reconciling unexplained changes in its figures?
- **The wedding example:** Where shown, inspect the 180 guests, $68 per guest, $26.93 food per guest, 39.6% food cost, 30% target, and $89.78 target price. Verify current values instead of assuming these remain unchanged. Can you distinguish the current quote from a suggested price? Are exclusions such as labor, packaging, and rentals clear before you interpret food cost as profit?
- **The offer:** Verify the displayed trial length, monthly price, billing unit, card requirement, first charge, cancellation, and launch limitations. Does a six-person crew cost more? Is future pricing distinguished from the offer available today? Are terms consistent across the page and app?
- **The setup burden:** What must you gather, type, upload, check, and correct before one useful result? If a first-dish estimate is shown, is it clearly different from setting up a full menu or kitchen?
- **The scope:** Can you distinguish supplier ordering from customer ordering, a cost check from a customer quote, and a plan from something already sent or purchased? Only investigate these distinctions where the page raises them.
- **The trust:** Are claims about imports, Sage, stock, team access, phones, offline use, nutrition, or labels bounded and supported? Separate what a screenshot suggests, what the page promises, and what you can verify in the selected app revision.
- **The reading effort:** Where does the page repeat itself, introduce an unrelated decision, bury an answer, or require remembering a number from several screens earlier? Identify the resulting question, not merely that a section feels long.

## 5. Verify promises and recommend a stronger page

After the first-person walkthrough, switch explicitly to evaluator mode. Inspect the app's `develop` branch only to answer concrete questions raised by landing-page claims: what inputs are required, what the product produces, what remains manual, what is available today, and what the trial requires. Do not use that knowledge to retroactively make Dana's first impression clearer.

For each important promise, distinguish the exact homepage claim, what Dana reasonably expects, what the app evidence supports, and the wording or proof the homepage needs. Implementation on `develop` does not prove production availability. When availability cannot be verified, mark it unverified rather than asserting the promise is true or false.

Evaluate whether the page answers Dana's decisions in a useful order: “Is this for me?” → “What work will it help with?” → “Can I see and trust the result?” → “What will trying it take and cost?” → “What do I do next?” Use that sequence as a diagnostic, not a rigid template imposed regardless of evidence.

For every current section, recommend **keep / clarify / shorten / move / merge / remove**, with the visitor question it should answer and the evidence behind the recommendation. Recommend a new section only when an important unanswered question cannot be handled clearly in an existing one. Preserve effective material. Do not assume a shorter page or more calls to action is automatically better.

If the page needs a different section order, propose that order and explain how it resolves observed hesitation. If the order works, explicitly say no route or workflow restructuring is needed. Every recommendation must improve the landing page's clarity, credibility, or trial decision; app implementation requests are outside scope.

## 6. Be pedantic about every encountered element

- **Labels and buttons:** Kitchen language or internal system language? Clear destination or outcome? Does the action verb match the confirmation? Are similar actions named consistently?
- **Numbers:** Unit, currency, per-person/per-batch/per-event basis, source, date, and included costs where relevant? Is a value an input, estimate, target, actual, or sample? Are zero, unknown, and missing price distinguishable?
- **Prerequisites:** Does the page disclose the ingredients, recipes, prices, review work, or account requirements needed to obtain the promised result before asking for commitment?
- **Page interactions:** Where present, check navigation menus, accordions, video controls, and landing-page forms in relevant loading, error, and success states. Is the next action clear? Do action labels match feedback? Do not submit real inquiries or bookings.
- **Interaction:** Can you tell what is clickable? Are important answers dependent on hover? On a phone, do sticky elements, clipped tables, tiny screenshots, or expanded navigation obstruct the task? Separately check keyboard access and visible focus.
- **Jargon:** Challenge terms such as workspace, staging, readiness, publish, quantity basis, and yield only when encountered. Dana understands cooking; she may still need to know the specific consequence of a software term.

The standard is no avoidable pause to decode the interface. A legitimate business decision can take thought. Distinguish that from thought caused by unclear presentation.

## 7. Deliver the findings

First, provide a narrative walkthrough in Dana's first-person voice, in encounter order. Assign each friction point a stable ID. Mark the first abandonment moment and any later evaluator continuation. Keep technical explanations outside her voice.

Then provide one table sorted by severity, and within severity by impact on understanding the value, trusting the claims, or deciding whether to try—and how early the issue appears:

| ID | Screen / URL / frame / viewport | Exact element or text | Question in Dana's words | What caused the question | Severity | Proposed fix | Evidence / confidence |
| --- | --- | --- | --- | --- | --- | --- | --- |

Use exactly these severities:

- **abandons:** Prevents progress or undermines trust enough that Dana would stop, defer the trial, or return to her spreadsheet. Explain the trigger.
- **frustrated:** She can continue but must guess, reread, backtrack, or do unnecessary work.
- **mild:** A brief avoidable hesitation with an obvious recovery.

Make proposed fixes specific: replacement headline or caption, a missing unit or source, a better screenshot and what it must show, an explanation at the decision point, clearer CTA wording, or a justified section change. Show current → proposed wording for the highest-impact copy issues. “Simplify,” “improve UX,” and “make it clearer” are insufficient. Recommend changes without implementing them.

After the friction table, provide a compact section-by-section improvement plan using the keep/clarify/shorten/move/merge/remove decisions. Include a proposed page outline only if reordering is justified. Separate evidence-backed corrections from hypotheses that would need real visitor testing; do not invent conversion lifts.

Attach screenshots or other reproducible evidence where available. Separate observed behavior, persona interpretation, source-derived inference, and unverified claims. Consolidate repeated root causes while listing their affected locations. Record inspected areas with no issue and inaccessible areas separately; do not invent findings to fill a quota.

Close with Dana's decision: **try it now / come back later / leave**, why, and the three changes most likely to alter that decision. List the actual coverage and remaining gaps. No fixes yet.
