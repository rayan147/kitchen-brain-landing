# Story Tracker — founding kitchen price

- **Piece:** Price terms beside the trial decision on the homepage, pricing page, feature guides, comparison and FAQ.
- **Reader:** An owner-caterer checking the bill before starting a trial.
- **Source:** Owner-provided terms, 2026-10-23: "$49/month for our first 20 kitchens; locked in for life. Regular price $99/month per kitchen, unlimited crew."

| Step | Done |
|---|---|
| 1. Idea | ☑ |
| 2. Character | ☑ |
| 3. Plot | ☑ |
| 4. Scenes | ☑ |
| 5. Voices | ☑ |
| 6. Dialogue | ☑ |
| 7. Intention and obstacle | ☑ |
| 8. Snap | ☑ |
| 9. Scene | ☑ |
| 10. Connection | ☑ |
| 11. Revision | ☑ |

## 1. Idea

An owner-caterer wants to try CostCook but needs to know whether the visible $49 rate is permanent, who qualifies, and what a kitchen outside the offer pays.

## 2. Character

- **Want:** Try the software at a known monthly cost.
- **Need:** Understand the offer limit, regular price, billing unit and crew allowance before giving a card.
- **Wound:** A trial whose later bill differed from the advertised price.
- **Flaw:** Reading the large price and skipping the qualifying line.

## 3. Plot

| Beat | Price decision |
|---|---|
| Opening image | A quote is due and the owner is comparing monthly bills. |
| Theme | Show the amount and its conditions together. |
| Set-up | $49 appears beside the trial action. |
| Catalyst | The owner asks whether it is a promotion. |
| Debate | Are there extra crew fees or a later price increase? |
| Break into two | The owner reads the founding offer. |
| B story | The kitchen crew is included, not billed by seat. |
| Fun and games | The same terms follow the reader across the homepage, guides and pricing page. |
| Midpoint | $49/month is available to the first 20 kitchens and is locked in for life. |
| Bad guys | A kitchen outside the offer pays the $99/month regular price. |
| All is lost | A hidden condition would make the trial button untrustworthy. |
| Finale | The reader can start the trial knowing the amount, eligibility and billing date. |

## 4. Scenes

| Scene | Beats | Turn |
|---|---|---|
| Homepage hero | Opening through debate | Visible price → qualified price |
| Product proof and workflow | Break into two through midpoint | Price question → useful product context |
| Pricing page and FAQ | Midpoint through bad guys | Vague promotion → explicit terms |
| Homepage close | Finale | Uncertain trial → informed choice |

## 5. Voices

- **Reader:** “Is $49 the real bill?”, “Does my sous cost extra?”, “What if I miss the offer?”
- **Product:** Plain, exact, unhurried. Avoid “exclusive,” “act now,” and a countdown.

## 6. Dialogue

Each price surface names the $49 founding rate, the first-20 condition, the $99 regular rate and unlimited crew before the reader reaches the trial action. The FAQ gives the same answer when the reader comes looking for a catch.

## 7. Intention and obstacle

- **Intention:** Start a trial with a predictable bill.
- **Obstacle:** An introductory price can hide an eligibility limit or later rate.
- **Headline:** Existing homepage and pricing headlines stay in place.
- **Supporting line:** Founding price for the first 20 kitchens, locked in for life; regular price $99/month per kitchen.

## 8. Snap

“First 20 kitchens” is the one concrete offer detail; no invented countdown or remaining-spots number is added.

## 9. Scene

The owner has a phone beside the prep list and checks the price once before starting the trial. The qualifying words must be on the same screen as the button.

## 10. Connection

Second-person point of view where prose addresses the owner. The price beside the homepage action leads to the fuller pricing page; the FAQ repeats the terms; the closing action repeats the same promise.

## 11. Revision

The previous open-ended “launch price will rise later” wording is removed. The owner-provided first-20 limit and $99 regular price replace it. No availability counter or deadline is implied. The trial, card, cancellation and per-kitchen terms remain visible. “Prices plus tax” follows the app's billing plan, which adds sales tax on top.

### Availability clarification, 2026-10-23

The owner pointed out that “for the first 20 kitchens” leaves a visitor unsure whether those places are already taken. The opening beat and the price decision now say **“Founding offer open now”** before stating the cap. This answers the current-availability question without inventing a remaining-spots count. When the offer closes, the status and checkout price must change together; the static site cannot determine that from Stripe on its own.

## UX brief and check

- **User:** Owner-caterer on a phone or desktop, deciding whether to start a trial.
- **Job:** Understand the founding rate and what billing will cost.
- **Success:** Current availability, the $49 rate, first-20 limit, lifetime lock, $99 regular price, per-kitchen unit, unlimited crew, tax and trial terms are visible before action.
- **Pattern:** Existing trial terms beside the CTA and one detailed pricing page; the same shared plan data feeds FAQ and comparison.
- **States:** Static price copy. No loading, empty, partial or error state on these pages; checkout owns payment errors.
- **Primary CTA:** Start free trial.
- **Copy:** Owner-provided founding offer; tax follows the app plan.
- **Accessibility:** Text states eligibility without color, links retain visible focus and 44px targets, layout reflows at phone width.
- **Risks:** The app has one $49 Stripe plan and no automatic first-20 counter; the founder must track eligibility and change the app price when the offer fills.

Checklist: ☑ terms next to the action; ☑ no fabricated remaining-spots counter; ☑ explicit tax and card terms; ☑ semantic text and links; ☑ desktop and phone no overflow; ☑ existing primary action retained.
