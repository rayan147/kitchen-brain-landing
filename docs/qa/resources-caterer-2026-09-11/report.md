# Resources: caterer first-visit review and fixes

The Resources menu and its six destinations now explain what to read, what to prepare, what the examples mean, and what happens when you try CostCook or contact Rayan. Contact success and failure pages are included. All work is local on `develop`; no commit, push or deployment was performed.

## Walkthrough

The reader is a simulated first-time visitor: a competent caterer with six people, comfortable with spreadsheets, checking the site between services. This is a heuristic review, not an observed user study.

“I need to know which page will answer my question.” The menu now describes sample screens, setup preparation, kitchen fit, costs and contact. The footer no longer asks her to interpret a count of “paths.” Desktop and mobile retain the same destinations.

“Do I need an account to see this?” The tour says no account is needed and identifies its screens as illustrative. The stop count is derived from the actual thirteen stops. Recipe food cost names the selling-price denominator; menu figures show their calculation and explain that revenue left after food still has to cover other costs. Partial invoice and delivery tables say their totals cover records beyond those shown. The guide no longer invites clicks on static table rows. Coming date labels stay visibly unavailable.

“Does it fit my kitchen?” The fit page leads with changing menus, dates and guest counts, and gives a direct link to unsupported requirements. Its example distinguishes regular restaurant service from the event planned in CostCook. Staff access to cost screens is stated plainly.

“How much work is setup?” One recipe and current supplier prices are the starting point. The approximate fifteen-minute first-dish allowance is qualified by missing details, not presented as a guarantee. Review and correction replace absolute promises about preparation and repeated typing. Five stages, the worked food-cost example, next shopping list and crew invitations remain accessible. The sample $1.62 explicitly includes the 2% miscellaneous amount.

“What will I pay, and what can this replace?” Trial terms are beside signup choices. The comparison identifies dated pricing-page evidence and spreadsheet maintenance work. Offline access means reading previously loaded orders and reconnecting to save. Integration notes say what is unavailable today. Receipt saving, rather than simply checking a box, records a delivery. Spreadsheet cells acknowledge unsupported CostCook requirements without claiming that any spreadsheet automatically meets them.

“Where is the answer about my guests?” The nutrition answer had a second, unrelated answer appended to it. Guest allergies and diets now have their own question and stable link. There are 37 visible answers, also represented in structured data. The card answer describes automatic billing on day 16; the summary says the card is required.

“Did my question send?” Contact names Rayan and email replies before opening the form. Success now says the question was sent and the reply will go to the visitor’s address; it no longer says the original question was sent to that address. Failure states give recovery actions; the enhanced form retains the draft. No messages were sent during QA.

## Sorted findings

| Severity | Screen / element | Question in her head | Cause | Implemented correction |
|---|---|---|---|---|
| Frustrated | FAQ / nutrition answer | “Which question is this answering now?” | Guest restriction answer appended without a heading | Separate anchored question; 37-answer and structured-data checks |
| Frustrated | Setup and closing signup actions | “Does clicking this require a card?” | Missing nearby full terms | Shared trial, per-kitchen price and cancellation terms |
| Frustrated | Tour / numerical examples | “What is that percentage based on?” | Missing denominator, partial tables with whole-record totals | Explicit formulas, units and scope |
| Frustrated | Contact / success | “Why did you send my question to me?” | Reply address described as message recipient | Distinguish sent question from reply destination |
| Frustrated | Setup / preparation promises | “What if those papers don’t have everything?” | Absolute preparation and typing claims | Explain review, missing data and approximate timing |
| Frustrated | Comparison / offline and integrations | “Can my crew save changes without signal?” | Overbroad offline wording and implementation jargon | Read-only offline boundary; plain unavailable states |
| Frustrated | Enlarged text / tour, FAQ, comparison, contact | “Where did the rest of the words go?” | Grid minimums and unbroken headings/actions | Shrinkable grid children and wrapping text |
| Mild | Resources / descriptions | “Which one should I open?” | Abstract workflow/path wording | Concrete guide purposes |
| Mild | Tour / first screen | “Seeded? Twelve or thirteen?” | Internal vocabulary and stale count | Sample-screen framing; derived count |
| Mild | Comparison / plan summary | “Are there four plans plus another one?” | Incorrect tier count | Three priced plans plus Enterprise |
| Mild | Kitchen fit / example caption | “Why is a line through this sentence?” | Positioned separator crossed wrapping copy | Caption owns its border |
| Mild | Booking links | “Fifteen minutes doing what?” | Duration-only labels | Book a 15-min demo |

## Workflow and semantic-role inventory

Frequency is assumed from the evaluation persona, not analytics. Reads and navigation are reversible; signup and messages have consequences.

| Workflow | Screens / frames / actions | Frequency / complexity / density / risk | Shape decision |
|---|---|---|---|
| Choose evidence | Shared Resources closed/open, mobile Menu; choose one of six links | Occasional / low / medium / low | Keep grouped shared navigation |
| Inspect a sample event | Tour hero, thirteen tabs or mobile selector, Previous/Next/Finish, feature links; no-JS feature-index fallback | Occasional / medium / high / low | Hybrid: one active scene, direct access to every stop |
| Assess fit | Hero, fit signals, connected work, unsupported needs, trial | Once / medium / medium / medium | Keep one readable decision page |
| Prepare setup | Hero terms, three-part map, five stages, example, recovery, next recipe and crew | Once / medium / high / medium | Keep stages together with jump links |
| Compare options | Fit summary, dated prices, legend, five comparison areas, limitations, trial | Once / high / high / medium | Keep rows comparable; mobile stacked rows |
| Answer a concern | FAQ summary, four group links, 37 open answers and stable anchors | Occasional / medium / high / medium | Keep searchable open answers |
| Ask Rayan | Contact, form/dialog, required-field validation, submitting, failure/retry, success/receipt, no-JS response routes | Occasional / low / medium / medium | Keep existing form and recovery paths |

No routes or workflow stages were added, removed or renamed. The additional FAQ entry repairs question grouping. Equivalent roles retain the established heading, action, supporting-copy and status styles. Shared trial data supplies billing terms; shared FAQ data supplies visible and structured answers; flat menu/tour data remains appropriate. Strategy was considered and rejected because the variation is content, not runtime behavior. Existing component layout seams handle the small reflow corrections.

Error/recovery: guide navigation does not write; tour controls preserve direct stop access; missing setup facts and failed saves are described with recovery; contact validation prevents incomplete sends, mocked failures retain drafts, and no-JS failure offers email/call/retry. Success: a tour reaches its final choice, setup explains its first shopping list, and contact has both an acknowledgement and persistent receipt with focus return.

## Evidence and limits

Existing product evidence and release ledger remain the authority for availability. No release flag, entitlement or later crew limit changed. Setup timing remains an owner-provided approximation. No live billing or application deployment was certified.

[Parsley pricing](https://www.parsleysoftware.com/pricing/) and [meez pricing](https://www.getmeez.com/pricing) were consulted on 2026-09-11. The plan-summary count was corrected. Parsley invoice scanning now includes its $69/month add-on instead of implying Enterprise is the only path; meez additional viewer locations identify the Premium base plan. The table retains its August 30 overall verification date: this task checked those specific pricing issues, not every competitor row. A full pricing recheck remains part of the existing release process.

The Impeccable scan reported 101 advisory existing token discrepancies and one existing side-tab warning. Tour tabs are retained because they allow direct access to thirteen samples and transform to a select on mobile. No new font, color or radius values were introduced; this was not a visual-system redesign.

## Verification

Results and screenshots: `verification.json`, menu, route, tour-stop and contact-state PNGs in this directory. Automated checks cover eight routes at five widths, enlarged text, all tour stops, shared menu destinations, no-JS reading, and mocked contact validation/error/retry/success. Build and claim contracts cover the related shared consumers. See the final command logs in this directory.


Visual review: desktop and mobile screenshots were inspected for page identity, the first useful action, example labeling and reading order. Menu focus is visible; the fit-page caption no longer crosses its separator; the tour's Coming state remains visible beside its example. The complete thirteen-stop screenshots wait for transitions to finish before capture. Headings and billing-ticket content reflow at enlarged text sizes rather than being clipped.

Scope exclusions: actual signup, payment, email delivery and the external booking service were not exercised. Contact success/failure responses are deterministic local mocks. The no-JavaScript tour provides the first sample and a working link to the full feature index; its interactive tour controls require JavaScript.

Final results:

- `npm run build`: passed, including all post-build page contracts.
- `npm run check`: passed; zero errors, zero warnings, two pre-existing unused-variable hints.
- `COSTCOOK_QA_URL=http://127.0.0.1:4343 node scripts/verify-resources.mjs`: passed; eight routes × five widths, 200% text, thirteen interactive stops, both menu modes, no-JS recovery, and mocked contact validation/failure/retry/success.
- `git diff --check`: passed.

Initial verification caught actual text reflow defects, which were fixed. Test harness corrections wait for the selected tour panel and its transition, include mobile-hidden desktop tabs when counting stops, locate native summary controls by their accessible label, and test the actual no-JS feature-index fallback. None removes an implemented workflow check.


## Follow-up correction

The user identified a closing-section regression on the tour and kitchen-fit pages after this review. Trial text inside an auto-sized button column squeezed the headings without page overflow. The original visual-completion claim missed those lower sections. Fixed and covered by `scripts/verify-resource-closings.mjs`; see `docs/qa/resources-closing-regression/report.md`.
