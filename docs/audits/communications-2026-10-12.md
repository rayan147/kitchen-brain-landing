# CostCook communications review — 2026-10-12

Branch: `copy/english-chef-communications-audit`, based on `origin/develop` at `3bb019a` in its own worktree. Scope: public marketing site copy, navigation language, guide content, form outcomes, and the homepage film. This review used independent English-editor and chef/caterer passes, then checked proposed claims against the public claim ledger and the app source. No route or workflow restructuring was needed; the five feature areas and all public URLs stay in place.

## Coverage

The build emits **55 routes**: 32 static pages, four dynamic feature-area pages, and 19 published blog articles. Four form outcome pages are `noindex`. The two draft Square and QuickBooks blog guides are excluded by the publishing rule and were not counted as live routes.

| Family | Routes reviewed | Reader's task | Frequency assumption | Complexity and risk | Shape decision |
|---|---|---|---|---|---|
| First decision | `/`, `/pricing`, `/compare`, `/who-its-for`, `/faq` | Decide whether a trial fits the kitchen | Common for prospects; no analytics supplied | Medium; price and capability claims affect purchase decisions | Keep direct pages and shared primary action |
| See the product | `/features`, five `/features/[section]` pages, 17 dedicated feature guides, `/tour/main`, `/onboarding` | Trace a kitchen job through app capability and limits | Occasional, inference from site role | Medium to high; many product boundaries | Keep five-area hub and task-specific guides; clarify two area names |
| Contact and demo | `/contact`, `/contact/sent`, `/contact/not-sent`, `/demo`, `/demo/sent`, `/demo/not-sent` | Ask or book, then know what sent and what still needs doing | Occasional | High when a failed send loses a lead; recovery is reversible | Keep staged form and direct recovery; clarify sent vs booked |
| Learn a kitchen task | `/blog` and 19 published `/blog/[slug]` pages | Work one calculation or operating decision | Occasional, no analytics supplied | Medium; a wrong figure or safety claim can mislead | Keep question-led articles and their practical handoffs |

Representative flows checked: trial decision → pricing/FAQ → Start; feature hub → area → guide; proposal acceptance → booking → kitchen order; demo request → sent or failure → calendar/contact; invoice email → inbox status → review; blog index → calculation → related feature. Error recovery and success copy were read on all four outcome pages. The site is static, so live form delivery and authenticated app states were assessed from source and existing contracts rather than submitting real messages.

## Changes made

| Route or family | Problem | Correction and evidence |
|---|---|---|
| Home and film | “What the job makes” could imply profit; payment sounded mandatory; film said signed and paid alone books | Headline and film title now name **food cost**. The hero says card deposit is optional and sent by email link. The film says “Signed and paid. Now book the event.” App booking has a separate Book action and a recorded-reason exception. |
| Events guide and event article | Event booking and order confirmation were merged in prose | The event remains one record through booking; the kitchen draft is separate and stays tentative until Confirm order. The shared acceptance line includes the Book anyway reason path. |
| Menus and quotes guide | Reopening claimed frozen prices survive | It now says reopening drops the snapshot and returns to current prices and quantities, matching `src/lib/server/orders/repository.ts` in the app. |
| Feature hub and comparison | “The day itself” covered pre-event inquiries; “Team, and what it connects to” was awkward | Shared headings now read “Events and kitchen work” and “Team and connections.” Slugs and route paths remain stable. |
| Blog index | A 30% target sat beside figures that actually produce 39.6% food cost | The ticket now labels 39.6% as above target. Arithmetic: $26.93 ÷ $68 ≈ 39.6%; the full article already showed it. |
| Invoice-email guide and setup article | Copy implied every email reaches invoice review, an address cannot be guessed, and unfamiliar mail has no nuisance cost | Inbox status is distinguished from invoice review; only confirmed invoices alter costs. The absolute secrecy and “worst a stranger can do” lines were removed. |
| Credit-memo guide | “Off your cost” was hard to reconcile with unchanged recipe, event, and monthly food-spend values | The opening and feature outcome now place the credit separately below monthly food spend and state which costs stay unchanged. |
| Demo outcomes | A sent request read like a booked appointment; failure page guaranteed alternatives | Success asks the reader to choose a time. Failure offers email, phone, and calendar without a guarantee. |
| Pricing, integrations, onboarding, online ordering, labels, dietary guide | Coming features sounded like paid add-ons; optional setup looked required; shorthand and labels obscured choices | Availability, conditional Stripe/email use, manual setup entry, payment choice, changeable label stock, and guest dietary needs now read directly. |
| Two blog guides | The online-ordering defaults and decline window were unclear; an allergen label implied a safety guarantee | The guide separates default rules from selectable payment outcomes and limits declining to before payment. The label guide asks the cook to verify recipe and ingredient sources. |

Existing story trackers were revised beside every changed explanatory page; source pointers remain in place. Static wording was kept as data. **Pattern decision:** considered Strategy, but there is no runtime-swappable behavior; `src/lib/features.ts` and `video/src/film.ts` record the refusal at their editorial-data seams.

## Verification

- Before edits, `npm run build` passed all 55 generated routes and page contracts.
- Browser sweeps before and after edits at **390×844, 768×900, 1024×900, 1280×900, and 1440×900** visited every route. All 55 had exactly one H1, no body-level horizontal overflow, no blank page and no uncaught page error. Eight first-viewport captures of Home, Events, Blog, and Demo sent were inspected at phone and desktop widths.
- `npm run check` passed with zero errors and six pre-existing unused-variable hints.
- `npm run build` passed after copy edits, including page, SEO, link and claim contracts.
- `verify:homepage` passed at six viewports including 200% text and keyboard/mobile navigation. `verify:feature-family` passed 25 routes at five widths plus 200% text. `verify:demo` passed send, failed-send recovery, focus, no-JavaScript and responsive checks. `verify:blog` passed index, article, menu, 200% text and no-JavaScript checks. The first `verify:homepage` invocation lacked `COSTCOOK_QA_URL` and tried the script's default port 4321, so it failed to read page state; rerunning against the actual preview port 4325 passed.
- In `video/`, 74 tests, typecheck and render provenance checks passed. The 1:55 film rendered successfully; title and booking frames were inspected in the encoded master. MP4 and WebM at 1080p and 720p were encoded and shipped. The final `npm run build` passed with all four formats present.

The Impeccable edit hook reported existing radius/font/color token findings in untouched CSS declarations of changed components. None was introduced by these copy edits; no design-system suppressions were added.

## Follow-up evidence and limits

- `/compare` still states its full matrix was verified **August 30, 2026**. Current base prices and plan names were checked on the official [Parsley pricing](https://www.parsleysoftware.com/pricing/) and [meez pricing](https://www.getmeez.com/pricing) pages and matched the displayed amounts. The 44 capability rows were not reverified, so the page-wide date was not advanced. It remains visibly dated.
- The app's credit-memo review button reportedly says **“Import invoice and update costs”** even when a credit will not update ingredient costs. This review corrected the public guide but did not edit the separate app repository. The app label needs a product-side copy fix.
- The `/contact` “usually the same day” wording was retained: `docs/stories/contact-support.story.md` records the owner's explicit approval. Removing it would overwrite a current owner decision.
- The copy review did not change pricing, product behavior, URLs, payment processing, or third-party integrations.
