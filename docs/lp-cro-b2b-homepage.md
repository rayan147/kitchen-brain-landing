# B2B Homepage CRO Audit — CostCook

Audited 2026-08-23 against `http://localhost:4321/`. Screenshots captured with Playwright/Chromium, full-page at 1440x900 and 390x844, plus per-section captures at 390px for legibility. Reveal animations settled and lazy images forced before capture; the Astro dev toolbar was suppressed so it could not be mistaken for page furniture.

> **Status, 2026-08-23 — implementation pass.** Six findings are built and verified;
> four are blocked on facts only the owner has. Built: hero card disclosure, mobile
> poster (new `demo-poster-mobile.jpg` + `scripts/build-mobile-poster.py`), demo-section
> CTA, founder provenance surfaced at the problem statement, `/compare` routed from the
> misfit list, plus two defects found while verifying — a missing space in the close
> ("first?Book 15 minutes") and the 200%-text overflow at 360 that this document had
> left open. Blocked: privacy/terms pages, the launch-price direction, the FAQ answers,
> and any named-customer proof. `pnpm check` and `pnpm build` pass; measured at 390px the
> largest CTA gap fell from 10.1 viewports to 5.8, and no route overflows at any width
> including 200% text. Nothing is committed.

## Samenvatting

The page is unusually well-built and its problems are almost all disclosure problems rather than persuasion problems: it under-tells the visitor what starting actually involves. Three Critical issues:

- Hero asks for a card without saying a card is required
- Plan named "Launch" with no statement of whether $49 is introductory
- No privacy policy, terms or data-handling statement anywhere on the site

Detected as B2B SaaS, low-ticket ($49/month = the €50-500/m tier), MKB-B2B / micro (customer kitchens are 1-15 staff; the vendor is one founder). Economic buyer, technical buyer and end-user are THE SAME PERSON — the owner-operator who quotes the job and cooks it — so multi-stakeholder layering does not apply. Screenshots: desktop full-page, mobile full-page, and nine per-section mobile captures.

**Distribution note.** Findings land at 4 Critical / 6 Important / 0 Nice-to-have against this skill's 3-5 / 4-6 / 1-4 target. The Nice-to-have bucket is empty because there were no cosmetic findings to make — spacing, hierarchy, typography and copy quality are already strong. Padding that bucket to hit the template would have meant inventing work.

## Calibration

- **B2B service type:** B2B SaaS, low-ticket ($49/month = the €50-500/m tier)
- **Organization size:** MKB-B2B / micro (customer kitchens are 1-15 staff; the vendor is one founder)
- **Dominant visitor role:** Economic buyer, technical buyer and end-user are THE SAME PERSON — the owner-operator who quotes the job and cooks it
- **Deal size:** Low-ticket, $588 first-year ACV
- **Sales cycle:** Short (<30 days); self-serve trial is the primary motion
- **Lead-magnet strategy:** Demo-driven / trial-driven. No whitepaper or calculator strategy exists.

This calibration overrides several of the skill's defaults. Notes on where, in the category sweep.

## Category sweep

- **1. Above-the-fold value proposition & business-impact positionering** — Findings (1 critical, 1 important)
- **2. Service-routing & navigation clarity** — Findings (1 important) — routing is otherwise clean; five feature areas, pricing and comparison all reachable from the header
- **3. Customer logos & social proof grid** — Findings — merged into #4 below; no logo grid exists to assess
- **4. Case studies & named-customer proof** — Findings (1 important, research-first)
- **5. ROI/impact-bewijs en metrics** — Findings (1 important) — real figures exist in the demo footage but are not surfaced as proof
- **6. Trust signals & B2B credibility** — Findings (1 critical)
- **7. Lead-magnet propositie op homepage** — No findings — the 15-day trial IS the entry-point offer for a low-ticket self-serve SaaS. A whitepaper or gated asset would add a competing conversion path to a page whose stated discipline is one goal. Deliberately not flagged.
- **8. Multi-stakeholder content layering** — No findings — not applicable. The economic buyer, technical buyer and end-user are the same person. There is no buying committee to layer content for, and inventing persona tracks would contradict the audience definition.
- **9. CTA strategy multi-path matched aan visitor-job** — Findings (1 important)
- **10. FAQ & B2B objection handling** — Findings (1 important)
- **11. Mobile experience** — Findings (1 critical) — mobile is the dominant device for this audience, inverting the usual B2B desktop assumption

## Findings

ICE is scored `(I + C + E) / 3` on a 1-10 scale. Note: this skill's text specifies `(I + C + E) / 3 x 10`, which would produce 0-100 scores and is inconsistent with its own 7.5 / 5.0 thresholds. The 0-10 reading is the one that matches the thresholds and is used throughout.

### 🔴 Critical findings

#### 🔴 1. Hero asks for a card without saying a card is required

**Category:** 1. Above-the-fold value proposition & business-impact positionering  |  **ICE 8.7** (I=7, C=9, E=10)

**Diagnosis**

The only primary CTA in the first viewport is "Start CostCook". The line directly beneath it reads, visible in screenshot: "15 days free, then $49/month per kitchen workspace. Nothing to install." A payment card IS required — Stripe collects details before the trial begins — and the hero does not say so. The disclosure exists exactly once on the page, in the closing section: "Stripe collects payment details, charges $0 today, and begins billing at $49/month per kitchen workspace after the trial unless you cancel." Measured in the rendered page, those two statements sit 8,455px apart at 390px width, which is roughly ten mobile viewports. MECLABS' Conversion Sequence Heuristic treats anxiety as a subtractive term applied at the moment of the ask, not at the moment the page eventually gets around to disclosure. A cost discovered after the click is the textbook case.

**Recommendation**

Add the card disclosure to the hero support line, adjacent to the primary CTA. Concrete copy, matching the page's existing register: "15 days free, then $49/month per kitchen workspace. Card up front, charged $0 today. Nothing to install." Do not add a cancellation claim in the same breath unless self-serve cancellation is verified to exist — an unverifiable reassurance next to a verified cost reads worse than the cost alone.

**Test specification**

- **Hypothesis:** If the card requirement is disclosed adjacent to the hero CTA rather than ten viewports below it, then completion rate from CTA-click to Stripe-submit will increase, because MECLABS anxiety is resolved before the click rather than discovered after it.
- **Variant A:** Hero support line: "15 days free, then $49/month per kitchen workspace. Nothing to install."
- **Variant B:** Hero support line: "15 days free, then $49/month per kitchen workspace. Card up front, charged $0 today. Nothing to install."
- **Primary metric:** Trial-start completion rate (CTA click → Stripe submit)
- **Secondary metrics:** Hero CTA CTR (expected to fall), bounce rate, scroll-depth past hero
- **Expected impact:** +8% to +20% on click-to-completion; hero CTA CTR may fall 5-15%
- **ICE:** I=7, C=9, E=10 → 8.7
- **Source:** MECLABS Conversion Sequence Heuristic (anxiety axis); Baymard checkout-transparency research

#### 🔴 2. Plan named "Launch", teammates "during launch" — page will not say if $49 is introductory

**Category:** 3. Pricing clarity (cross-cut with #1 positionering)  |  **ICE 8.3** (I=7, C=8, E=10)

**Diagnosis**

On the pricing page the plan is called "CostCook Launch" at $49/month, and the included-features list reads, visible in screenshot: "Unlimited teammates during launch." Nothing on the page defines when launch ends, what the price becomes afterwards, or whether the unlimited-teammate term survives it. For a low-ticket self-serve SaaS the pricing page must carry the entire commercial decision without a sales conversation, because there is no sales conversation. April Dunford's positioning work treats an undefined commercial term as a positioning failure rather than a copy detail: the buyer cannot place the product on a price axis they can plan against. The price number itself is otherwise clean — currency, period and basis ("per kitchen workspace") are all present, which is more than most SaaS pricing pages manage. This is the single defect in an otherwise well-built pricing surface.

**Recommendation**

State the direction of travel in one sentence next to the price. If the price is stable: "It is called the launch plan because it is early, not because the price is a promotion. If it ever goes up, it goes up for kitchens that join later, not for yours." If it genuinely is introductory, say that instead — silence is worse than either. Separately, define whether "unlimited teammates" is permanent or bounded to the launch period.

**Test specification**

- **Hypothesis:** If the pricing page states whether $49 is introductory and what happens to the teammate allowance, then trial-start rate from the pricing page will increase, because the buyer can complete the commercial decision without contacting anyone.
- **Variant A:** "Unlimited teammates during launch" with no definition of the launch period.
- **Variant B:** Same, plus an explicit one-sentence statement of price stability and teammate-allowance duration.
- **Primary metric:** Trial-start rate from /pricing
- **Secondary metrics:** Pricing-page exit rate, contact-page traffic originating from /pricing
- **Expected impact:** +5% to +12% on trial-start rate from /pricing
- **ICE:** I=7, C=8, E=10 → 8.3
- **Source:** April Dunford, Obviously Awesome (positioning as commercial clarity); MECLABS anxiety axis

#### 🔴 3. No privacy policy, no terms, no data-handling statement — on a page that ingests supplier pricing

**Category:** 6. Trust signals & B2B credibility  |  **ICE 7.7** (I=7, C=8, E=8)

**Diagnosis**

The rendered footer contains, in full: brand name, email, phone, Pricing, Every feature, How we compare, Contact, Sign in, Book a demo, copyright. Visible in screenshot: there is no privacy-policy link and no terms link in the footer, and a sitewide grep across all six routes returns no policy page of any kind. This sits against a page that asks the visitor to photograph their price board, upload supplier invoices and hand over card details. Edelman's B2B Trust Barometer places data-handling and vendor-risk among the top pre-purchase anxieties for business buyers, and Cialdini's authority principle depends on visible institutional markers. The absence is more consequential here than on a typical low-ticket SaaS homepage because the product's core intake feature explicitly asks for the customer's commercial data. Legal adequacy of any such policy is out of scope for this audit; presence and reachability at the point of the ask are in scope.

**Recommendation**

Add privacy and terms links to the footer, and add one plain sentence near the trial CTA covering what happens to the customer's data — specifically whether recipes, supplier prices and costed events can be exported and what happens to them on cancellation. Do not draft policy language as marketing copy; the finding is that the question is unanswered, not that the wording is weak.

**Test specification**

- **Hypothesis:** If a privacy policy, terms, and a plain-language data statement are reachable from the footer and adjacent to the trial CTA, then trial-start completion will increase, because vendor-risk anxiety is resolved at the point of commitment.
- **Variant A:** Footer with no policy links; no data-handling statement anywhere on the site.
- **Variant B:** Footer with Privacy and Terms; one data-ownership sentence adjacent to the close CTA.
- **Primary metric:** Trial-start completion rate
- **Secondary metrics:** Footer link CTR, time-on-page at the close section
- **Expected impact:** +3% to +10% on trial-start completion
- **ICE:** I=7, C=8, E=8 → 7.7
- **Source:** Edelman B2B Trust Barometer; Cialdini authority principle; Baymard trust-signal research

#### 🔴 4. Video poster illegible at 390px and its key line occluded by the native control bar

**Category:** 11. Mobile experience  |  **ICE 7.7** (I=7, C=8, E=8)

**Diagnosis**

Visible in screenshot at 390px: the demo video's poster frame renders as a dense application spreadsheet — vendor rows, quantity columns and sub-recipe panels — at a size where none of the figures are readable. The poster's deliberate message, the line "Charge $89.78 a head to hit 30.", is rendered across the bottom of the frame and is approximately half-covered by Chromium's native video control bar, which occupies the same band. A separate dark "Watch · 2 min 30 sec" chip overlays the upper-left of the poster. The result is that the single strongest proof asset on the page presents, on the dominant device, as an unreadable screenshot with its headline obscured. This audience reads on a phone mid-shift, which inverts the usual B2B desktop-dominance assumption and makes this a primary-device defect rather than a secondary one. Baymard's mobile research treats occluded or illegible primary imagery as a comprehension failure, not an aesthetic one.

**Recommendation**

Use a mobile-specific poster frame cropped to a single legible element — the food-cost panel with the $89.78 figure at readable size — rather than a downscaled full-application view. Position the poster's text line clear of the bottom 60px where native controls render. The play chip already exists and can carry the duration, so the poster does not need to.

**Test specification**

- **Hypothesis:** If the mobile poster is replaced with a legible cropped frame whose text clears the native control band, then video play-rate on mobile will increase, because the poster communicates a specific outcome rather than an unreadable interface.
- **Variant A:** Shared desktop poster, downscaled to 390px, text line overlapping the control bar.
- **Variant B:** Mobile-specific cropped poster, key figure legible, text clear of the control band.
- **Primary metric:** Video play-rate on mobile
- **Secondary metrics:** Video completion rate, scroll-depth past the demo section, mobile trial-start rate
- **Expected impact:** +15% to +35% on mobile play-rate
- **ICE:** I=7, C=8, E=8 → 7.7
- **Source:** Baymard Institute mobile-usability research; Nielsen Norman image-legibility guidance

### 🟠 Important findings

#### 🟠 8. Founder provenance is the strongest trust asset and sits at 78% page depth

**Category:** 5. ROI/impact-bewijs en metrics  |  **ICE 7.3** (I=6, C=7, E=9)

**Diagnosis**

Visible in screenshot: the "Built by a chef. Set up with your real work." section carries a full name, a photograph, and the claim "I spent twelve years cooking professionally before becoming a software engineer." It renders at 7,448px of a 9,604px mobile page — roughly 78% depth — and at 6,736px of 8,271px on desktop. In the absence of any named-customer proof (finding 7), this is the single strongest credibility asset the page owns, and Edelman's B2B Trust Barometer ranks founder and practitioner credibility highly for small-vendor purchases specifically. Placing it below the fold of the fold means the reader evaluates the entire product argument before learning who built it and why that person would understand their week. For a cold-email visitor arriving skeptical, the provenance is the argument that makes the rest credible rather than a closing detail.

**Recommendation**

Surface the practitioner claim earlier — a single line near the problem section, not a relocation of the whole block. Concrete: one sentence in or adjacent to "The spreadsheet works until the job changes." attributing the observation to twelve years of cooking. Keep the full block with photograph where it is; this is about earning the right to make the problem statement, not about moving the biography.

**Test specification**

- **Hypothesis:** If the twelve-years-cooking provenance is surfaced adjacent to the problem section rather than only at 78% depth, then scroll-depth past the problem section will increase, because the diagnosis carries practitioner authority at the point it is made.
- **Variant A:** Provenance appears only at 78% page depth.
- **Variant B:** One provenance line near the problem section; full block unchanged at its current position.
- **Primary metric:** Scroll-depth past the problem section
- **Secondary metrics:** Time-on-page, video play-rate, trial-start rate
- **Expected impact:** +5% to +12% on scroll-depth past problem section
- **ICE:** I=6, C=7, E=9 → 7.3
- **Source:** Edelman B2B Trust Barometer (practitioner credibility); Cialdini authority principle

#### 🟠 5. No primary CTA for 10.1 mobile viewports between hero and close

**Category:** 9. CTA strategy multi-path matched aan visitor-job  |  **ICE 7.0** (I=7, C=7, E=7)

**Diagnosis**

Measured in the rendered page at 390x844: the hero primary CTA ends at approximately 520px and the next primary appears at 9,043px, on a page 9,604px tall. The header is position:static and scrolls away — verified at -2,123px after a 4,000px scroll — so no persistent CTA rescues the interval. That is 8,523px, about 10.1 viewports, in which a motivated reader has no primary action available. The gap is most costly immediately after the demo section, which ends at 4,230px: the reader has just watched real product footage price a wedding, and the page's answer to the resulting intent is five more viewports of scrolling. Fogg's Behavior Model requires motivation, ability and trigger to coincide; here motivation peaks where no trigger exists. Note that multi-CTA is correct on a multi-purpose homepage and single-CTA dogma does not apply — but this page is closer to single-purpose than a typical B2B homepage, so the recommendation is one additional trigger, not a CTA on every section.

**Recommendation**

Place one primary CTA at the close of the demo section, after the player rather than beside it. Note that the component carries an explicit comment stating a CTA there was removed on purpose because it "was one of six competing next-actions"; the page now carries two primaries and three quiet links, so the condition that justified the removal no longer holds. This is a deliberate reversal of a documented decision and should be treated as such, not as a defect fix.

**Test specification**

- **Hypothesis:** If one primary CTA is placed at the end of the demo section, then trial-start rate will increase, because the trigger becomes available at the point where the proof has just created motivation.
- **Variant A:** No CTA between hero (520px) and close (9,043px).
- **Variant B:** One primary CTA rendering the same label, positioned at the end of the demo section (~4,200px).
- **Primary metric:** Trial-start rate
- **Secondary metrics:** Scroll-depth distribution, close-section CTA CTR (may fall as starts shift earlier)
- **Expected impact:** +4% to +12% on trial-start rate
- **ICE:** I=7, C=7, E=7 → 7.0
- **Source:** Fogg Behavior Model (trigger timing); WiderFunnel LIFT model (urgency/clarity placement)

#### 🟠 6. No FAQ anywhere; the three post-trial questions go unanswered

**Category:** 10. FAQ & B2B objection handling  |  **ICE 7.0** (I=6, C=7, E=8)

**Diagnosis**

Visible in screenshot across the full-page capture at both widths: the homepage carries no FAQ block and no objection-handling section of any kind. For a self-serve motion this is the section that would normally absorb the questions a sales call would otherwise field. Three specific questions are unanswered anywhere on the site: how to cancel, whether data can be exported, and what happens to the workspace after the trial ends if the buyer does nothing. The page states "unless you cancel" as a subordinate clause and never says how cancellation works. MECLABS' anxiety axis, adapted to B2B, treats unanswered exit-questions at the point of commitment as direct subtractions from conversion. Homepage FAQ should stay light — this is not a service page — but three questions is light.

**Recommendation**

Add a compact three-question block near the close, above the final CTA. Answer only: how to cancel, whether the customer's recipes and price history can be exported, and what happens at day 16. Verify each answer against the shipped application before publishing — an FAQ that promises a cancellation route the product does not have is worse than no FAQ.

**Test specification**

- **Hypothesis:** If a three-question FAQ answering cancellation, export and end-of-trial billing is placed above the close CTA, then trial-start completion will increase, because the exit-anxiety questions are resolved at the point of commitment.
- **Variant A:** No FAQ; "unless you cancel" as the only cancellation language.
- **Variant B:** Three-question FAQ block immediately above the close CTA.
- **Primary metric:** Trial-start completion rate
- **Secondary metrics:** Close-section scroll-depth, contact-page traffic, demo-booking rate
- **Expected impact:** +4% to +10% on trial-start completion
- **ICE:** I=6, C=7, E=8 → 7.0
- **Source:** MECLABS anxiety axis (B2B-adapted); Marketing Sherpa B2B objection-handling patterns

#### 🟠 9. "How we compare" is the highest-intent nav item and sits third with no in-page route

**Category:** 2. Service-routing & navigation clarity  |  **ICE 6.7** (I=5, C=6, E=9)

**Diagnosis**

Visible in screenshot: the header carries Features (as a disclosure), Pricing, How we compare, Contact, Sign in, and the primary CTA. The /compare page is a genuinely strong asset — it names two competitors and concedes six rows to them — and for an evaluating buyer comparing three tools it is the highest-intent destination on the site. It is reachable only from the header and footer; no in-page section routes to it, while /features gets an explicit in-page link ("See everything it does, area by area") from the outcomes section. Mark Hurst's information-scent model predicts that a destination with no contextual link from the body is discovered mainly by visitors already looking for it. The buyer most likely to want it is the one who arrived from a cold email and is checking whether this is credible against tools they already know.

**Recommendation**

Add one quiet in-page link to /compare from the section where the comparison question naturally arises — most plausibly after the misfit list, where the reader has just been told what the product is not for and the adjacent question is what to buy instead. Keep it quiet, not a primary; the page's single-primary discipline should hold.

**Test specification**

- **Hypothesis:** If a contextual link to /compare is placed after the misfit list, then /compare pageviews from the homepage will increase, because the link appears at the moment the comparison question is active.
- **Variant A:** /compare reachable only from header and footer.
- **Variant B:** Additional quiet in-page link following the "who it is not for" list.
- **Primary metric:** /compare pageviews originating from the homepage
- **Secondary metrics:** Homepage bounce rate, trial-start rate from /compare
- **Expected impact:** +20% to +50% on /compare entries from homepage (small base)
- **ICE:** I=5, C=6, E=9 → 6.7
- **Source:** Mark Hurst information scent; Nielsen Norman recognition-over-recall (heuristic #6)

#### 🟠 7. Zero named customers, case studies or customer logos anywhere on the page

**Category:** 4. Case studies & named-customer proof  |  **ICE 6.3** (I=8, C=8, E=3)

**Diagnosis**

Visible in screenshot across the full 8,271px desktop capture: there is no customer-logo strip, no named-customer testimonial, no case study and no customer count anywhere on the homepage. Edelman's B2B Trust Barometer and Forrester's case-study research both place named-customer proof at the top of first-touch credibility signals for B2B buyers, and on a B2B homepage a logo grid is conventionally the highest-leverage trust element available. The honest reading here is that this is a pre-customer or early-customer product rather than a page that neglected its proof: the page substitutes founder provenance, real product footage and a published misfit list, which is a coherent strategy rather than an absence. This finding is therefore scored with low Ease — it cannot be fixed by page work, only by acquiring a referenceable customer.

**Recommendation**

Do not fabricate, compose or imply proof — no "trusted by" line, no customer count, no anonymised testimonial. The buildable action is to instrument the acquisition: ask the first paying customer for two sentences naming the thing that surprised them, with full name, kitchen name and role. One identified owner-operator caterer outranks any number of logos for this audience. Until that exists, the strongest honest proof already on the page should be moved earlier — see finding 8.

**Test specification**

- **Hypothesis:** Test not recommended yet — research first: (1) identify whether any current customer will go on record with name and kitchen; (2) collect one testimonial with full attribution; (3) only then test placement against the current founder-provenance block.
- **Primary metric:** Trial-start rate (once testable)
- **Secondary metrics:** Time-on-page, scroll-depth to proof section
- **Expected impact:** Not estimable without a proof asset to test
- **ICE:** I=8, C=8, E=3 → 6.3
- **Source:** Edelman B2B Trust Barometer; Forrester case-study impact research; Cialdini social proof

#### 🟠 10. Hero states the mechanism but never quantifies the outcome

**Category:** 1. Above-the-fold value proposition (secondary)  |  **ICE 6.3** (I=5, C=6, E=8)

**Diagnosis**

Visible in screenshot, the hero reads: "Cost it, buy it, prep it, pack it. Enter the numbers once." with the supporting line "A catering order is one job pretending to be six." This is strong, specific, differentiated positioning and it describes the mechanism accurately. What it does not do is quantify the outcome in the buyer's currency — hours, or margin points. The demo section later carries real figures (39.6% food cost against a 30% target, $89.78 per guest to hit it) that never appear above the fold. Hormozi's value equation treats perceived value as outcome divided by time and effort; the hero currently supplies the effort reduction ("once") without the outcome magnitude. This is deliberately scored at the low end of Important rather than Critical: the mechanism-led hero is a defensible positioning choice for a skeptical audience that distrusts quantified marketing claims, and a fabricated or unverifiable number here would cost more than the vagueness does.

**Recommendation**

Consider testing one verifiable outcome figure in the hero support line, drawn from the demo footage rather than invented — the food-cost visibility before quoting is the defensible one. Only test this if a real figure can be cited; the audience explicitly distrusts round marketing numbers, and an unverifiable claim would damage the page's strongest asset, which is its credibility.

**Test specification**

- **Hypothesis:** If the hero support line carries one verifiable outcome figure alongside the mechanism, then hero CTA CTR will increase, because outcome magnitude is supplied at the point of first evaluation.
- **Variant A:** Mechanism-only hero support line.
- **Variant B:** Same line plus one cited, verifiable outcome figure.
- **Primary metric:** Hero CTA CTR
- **Secondary metrics:** Scroll-depth, video play-rate, trial-start rate
- **Expected impact:** +3% to +8% on hero CTA CTR
- **ICE:** I=5, C=6, E=8 → 6.3
- **Source:** Hormozi value equation; MECLABS Conversion Sequence Heuristic (value-force term)

### 🟢 Nice-to-have findings

None. See the distribution note above.

## Test roadmap

- **Sprint 1** — Card disclosure in hero — trial-start completion — ICE 8.7. Ship as a judgement call, not a test; no instrument exists to read it.
- **Sprint 1** — Pricing-term clarity (launch price + teammate allowance) — trial-start rate from /pricing — ICE 8.3. Requires a commercial decision first, not a copy decision.
- **Sprint 2** — Privacy, terms and data-ownership statement — trial-start completion — ICE 7.7. Depends on policy pages existing; blocks nothing else.
- **Sprint 2** — Mobile poster replacement — mobile video play-rate — ICE 7.7. Independent of all other work.
- **Sprint 3** — Demo-section CTA — trial-start rate — ICE 7.0. Reverses a documented decision; needs owner sign-off before build.
- **Sprint 3** — Three-question FAQ — trial-start completion — ICE 7.0. Depends on verifying cancellation and export in the app.
- **Sprint 4** — Founder provenance surfaced earlier — scroll-depth past problem — ICE 7.3. Cheap; deferred only because it competes for the same reader attention as Sprint 3.
- **Backlog** — /compare in-page route (ICE 6.7) and hero outcome figure (ICE 6.3). The second only if a verifiable number exists.

B2B homepage test windows depend heavily on traffic volume. Traffic here is unknown and the site has no analytics, so none of these are currently runnable as tests. They are ranked as build-order, not as an experiment queue.

## Audit limitations

- No analytics of any kind. No sessions, no conversion counts, no device split, no scroll data. Every expected-impact range below is a published-benchmark estimate, not a forecast for this page.
- No behavioural data on any finding. Nothing here is validated against observed visitor behaviour on this specific page.
- Mobile full-page capture is 9,604px and downsamples past legibility as a single image. Mobile assessment was performed on per-section captures at 390px; the full-page capture was used for structure and geometry only.
- The application behind the trial was not accessed. Cancellation mechanics, data export and end-of-trial behaviour are unverified — findings 3 and 6 name them as questions, and their recommended copy must be verified before publishing.
- Time to first value was not measured, so no trial-versus-demo path recommendation is made in this audit.
- No competitor audit was performed. /compare was read as an internal asset for routing purposes only.
- Traffic volume is unknown, so test-window feasibility cannot be assessed. At low traffic several of these tests are not runnable and should ship as judgement calls.

---

## Reconciliation with `docs/lp-audit.md`

Two audits, two skill packs, same page and same day. The overlap is large and uninteresting:
both put the undisclosed card requirement first, both flag the missing privacy and terms
pages, both flag the "during launch" pricing ambiguity, both flag the mobile CTA gap, both
flag the founder provenance sitting too deep, and both refuse to invent social proof. Where
they disagree is more useful.

### 1. The mobile video poster — the first audit was wrong

| | Verdict |
|---|---|
| `lp-audit.md`, finding 12 | **Minor.** "The poster frame does a lot of work and is well chosen, so this is a minor finding, not a rewrite." Effort marked `—`, recommendation: leave it alone. |
| This audit, finding 4 | **Critical, ICE 7.7.** Poster illegible at 390px, key line occluded by the native control bar. |

**I take this audit's side, and the first document contains a real error.** The difference is
method, not judgement. In the first pass I assessed the poster from the component's source
comment — which explains at length why that frame was chosen over the vendor-grouped shop
list — and from the desktop rendering, where it is fine. This pass required a mobile
screenshot, and the mobile screenshot shows the deliberate line "Charge $89.78 a head to hit
30." rendered across the bottom of the frame, roughly half-covered by Chromium's native
control bar, over a spreadsheet too dense to read at that width.

The source comment was correct about the problem and its fix did not survive contact with
the device. That is precisely the failure mode this skill's screenshot hard-stop exists to
catch, and it caught it. `lp-audit.md` finding 12 should be treated as superseded.

### 2. Sequencing of the CTA gap

`lp-audit.md` put the mobile CTA gap in its top five with a full diff. This audit scores it
ICE 7.0 — Important, sprint 3 — behind the poster fix and the policy pages.

**I take this audit's ranking.** The finding is identical and equally real; what changed is
the sequencing logic. The CTA insertion reverses a documented decision recorded in the
component ("No CTA here on purpose… one of six competing next-actions"), so it needs owner
sign-off before build. The poster replacement and the policy links need no such decision.
Ordering by ICE surfaces that difference; ordering by severity alone hid it.

### 3. Expected-impact percentages — a methodological disagreement worth naming

This is the sharpest difference between the two packs, and it is not about the page.

The first pack's skills carry explicit guardrails against exactly this: *"Do not convert a
missing trust signal into a predicted lift"*, *"Do not claim a conversion lift number"*,
*"Whether these lift completion is a hypothesis to measure; trust defects are diagnosed from
absence, not from performance data."* `lp-audit.md` states no percentage anywhere.

This skill requires an `Expected impact: +X% to +Y%` field on every finding, and this audit
duly carries ten of them.

**I take the first pack's side.** There is no analytics on this site, no conversion count,
and no traffic figure. Every range in this document is a published-benchmark estimate
transplanted onto a page whose baseline nobody knows. They are in the deliverable because
the skill's format demands them and because they carry some ordinal signal — the +15-35%
on mobile play-rate really is a bigger expected move than the +3-8% on hero CTR. **Do not
put them in a business case.** If either document's treatment of impact should be trusted,
it is the one that declined to produce numbers.

### 4. Where this skill's defaults were overridden

Two of the eleven categories were returned as "no findings" against the skill's own
expectations, both because of the calibration rather than the page:

- **Lead-magnet propositie (category 7)**, skill default Important: the 15-day trial *is* the
  entry-point offer for low-ticket self-serve SaaS. A gated whitepaper would add a competing
  conversion path to a page whose stated discipline is one goal.
- **Multi-stakeholder content layering (category 8)**, skill default Important: the economic
  buyer, technical buyer and end-user are the same person. There is no buying committee.
  Inventing persona tracks would contradict the audience definition.

The skill is written for B2B homepages where "Contact sales" is the price and a buying
committee exists. Applied literally to a $49 self-serve product sold to one owner-operator,
several of its defaults are wrong, and following them would have produced findings that
directly damage the page.

### 5. "Who this is not for" — an independent check

`lp-audit.md` pre-emptively defended this section against a conversion-leak reading and
argued the case on the merits. Worth recording that this audit, running a different
framework with different categories, **did not flag it either** — and in fact used it as the
natural placement for the `/compare` routing link (finding 9). Two independent passes, no
finding against it. The section is fine.

### 6. Complements rather than conflicts

- **FAQ (finding 6)** is new here. `lp-audit.md` identified the same content gaps —
  cancellation, export, end of trial — but treated them as copy additions to existing
  sections; this audit proposes a container for them. Same underlying gap, different shape.
- **`/compare` routing (finding 9)** is new here and does not contradict anything earlier.
- **Hero outcome quantification (finding 10)** sits in mild tension with `lp-audit.md`'s
  instruction not to flatten the voice. That is why it is scored lowest of the ten and
  gated on a verifiable figure existing. If no such figure exists, it should not be built.

### Net

Of ten findings here, six restate the earlier audit in this skill's format, three are new
(FAQ, `/compare` routing, hero quantification), and **one reverses it** — the mobile poster,
where the earlier document was wrong because it had not looked at the right screenshot.
