# Story Tracker — Guests' restrictions and dietary guards

**Slug** `dietary-guards`
**Produced** 2026-09-09
**Covers** `src/lib/dietary.ts` and every surface that reads it: the `/compare`
row, the FAQ answer, the boundary list on `/features/nutrition-facts-and-allergens`,
and the feature page at `/features/guest-restrictions-and-dietary-guards`.
**Ledger** RC-60.
**Upstream** The app's own two trackers are the source of every sentence here:
`docs/stories/dietary-characteristics.story.md` (the standing-catalog side) and
`docs/stories/order-dietary-guards.story.md` (the per-order side), in
kitchen-brain. Maya is their hero and she is the same person as ours; where
their words work, this page uses theirs.

---

## Step 0 — What this pass is correcting

Until 2026-09-09 the landing site said, on four published surfaces, that
CostCook does not assess dietary characteristics and infers nothing from an
ingredient name. That was true when it was written on 2026-08-30 and it was a
**false negative** by the time anyone read it: the capability had shipped,
unflagged, and `/compare` was showing a Coming row against two products that
list it.

The truth pass is its own commit and it did not wait for this page. The one
thing worth saying about it in story terms: a Coming row is a promise, and the
only honest way for one to leave the page is by shipping.

## Step 1 — The Idea

**WHO** An owner-caterer taking a booking by text: "two celiac, one halal, the
bride is allergic to tree nuts." **WANT** Every dish on Saturday's order checked
against those four people. **WALL** The only record of who is allergic to what is
a message on her phone, and nothing has ever asked the catalog what is actually
in a dish.

## Step 2 — Your Character

Taken from the app's tracker, because it is the same person and the wound is
already written:

- **Want** To hand the cook a pack list that already says "pesto, not for the bride".
- **Need** To trust that a quiet screen means every ingredient was actually
  looked at, not that nobody looked.
- **Wound** A nut-allergic guest, a pesto, and a Sunday-morning phone call. She
  plated a substitute in time. She still thinks about it.
- **Flaw** She tags nothing, because the last tool made her tag everything and
  then said nothing useful back.

The flaw is the whole page's problem. Any sentence that reads as "now enter all
your data" loses her at the fold.

## Step 3 — The Plot (12 beats)

| Beat | On the page |
|---|---|
| Opening Image | A text message. A pack list that never mentions it. |
| Theme Stated | It detects, it never certifies. Unknown is never clear. |
| Set-Up | Ingredients entered, priced, costed. Nobody asked what they carry. |
| Catalyst | The order gets a place to say who is eating. |
| Debate | "Do I have to tag everything?" Setup drafts the rows; you review. |
| Break into Two | bride, Tree nuts, 1 guest. Now the order knows. |
| B Story | The 5 a.m. cook, who reads the pack list, not the text thread. |
| Fun and Games | Five diets, the nine major US allergens, one answer per dish. |
| Midpoint | "Conflict. Pesto: walnuts (contains)." Seen before confirm. |
| Bad Guys Close In | Three ingredients nobody reviewed. Halal depends on the source. |
| All Is Lost | The catalog moves after confirm. Does the answer still hold? |
| Final Image | The cook reads it off the hotel pan. The text thread stays on the phone. |

## Step 4 — From Beats to Scenes (the feature page, 7 sections)

| § | Section | Beats | Turn (− → +) |
|---|---|---|---|
| 1 | Hero | 1, 2 | a message on a phone → a line on the pack list |
| 2 | The problem | 1, 3 | the catalog was never asked |
| 3 | Who is eating | 4, 6 | text thread → on the order |
| 4 | The three answers | 8, 9 | vague worry → one ingredient, one way out |
| 5 | Coverage | 10 | "no news is good news" → "four not reviewed" |
| 6 | What it will not tell you | 10, 11 | a tool that flatters → one that stops |
| 7 | Standing catalog + close | 7, 12 | per-order only → the book answers too |

## Step 5 — Character Voices

**Hers:** contains, may contain, don't know, review, the bride, check, not for
the bride, celiac, halal.
**The product's:** calm, declarative, no exclamation. Banned outright, and pinned
in `check-landing-claims.mjs`: safe, certified, guaranteed, allergen-free.

## Step 6 — Writing Dialogue (McKee)

The one turn the whole page exists for: **"no news is good news" → "no news says
how many ingredients were never looked at."** Every competitor's version of this
feature turns green and stops. Section 5 is not a caveat section; it is the
scene where the product earns the rest of the page.

## Step 7 — Sorkin Dialogue

- **Intention** Get every guest's restriction onto the lists the cook reads.
- **Obstacle** The catalog knows what is in a dish; nothing knows who is eating it.
- **Headline** "Two celiac, one halal, the bride is allergic to tree nuts."
  It wants something: it is the booking, in her words, before the page has said
  a single thing about software.

## Step 8 — Cool Talk (the snap line)

> **CostCook detects, it never certifies.**

One line, and it is the product's own, from the engine's header. It is also the
page's boundary, which is why nothing else on the page is allowed to be the
snap: the rendered example ("Conflict. Pesto: walnuts (contains). bride, Tree
nuts") is proof, not the line.

## Step 9 — Bringing a Scene to Life

Two rooms. The first is a phone at a prep bench on a Tuesday, a booking arriving
by text between two other things. The second is 5 a.m. on Saturday, a cook who
has never seen that text, reading a hotel pan label. The page's job is to put a
line in the second room that was written in the first.

## Step 10 — Connecting Your Scenes

Second person, throughout. The page hands off to
`/features/nutrition-facts-and-allergens` for the recipe-level allergen and
nutrition work, which is the neighbouring subject and a different job: what is in
the dish, rather than who is eating it.

## Step 11 — Revise and Finish

**No proof captures exist for this capability.** `public/proof` carries nothing
for guards, restrictions, the matrix or the diet filter, and they cannot be made
from here. `PaperIn.astro` set the precedent for exactly this situation: the
honest options were a gap or a mock, and a page whose argument is that the number
never lies does not mock a screen. So the page is figure-led with diagrams built
from the shipped vocabulary, every one of them labelled from the engine, and it
says so in its header. When a capture exists, it belongs here and its alt text is
prospect-facing copy like every other alt on the site.

**Ends on:** the reader's life after, in her words. The cook reads it off the
pan. Nothing on this page promises her a guest is safe, because the product does
not, and saying so is the reason she might believe the rest.

---

## Delivered 2026-09-09 — the page

`/features/guest-restrictions-and-dietary-guards`, seven sections in the order
Step 4 sets: the booking as the headline, the wall, who is eating, the three
answers, coverage, the four limits, the standing book, then the questions and
the close.

**Measured:** 6,164px at 1440x900 and 7,363px at 390x844, no horizontal overflow
at 1440, 1280, 1024, 834, 768 or 390, no heading-level skips, both CTAs at 48px.

**Wired:** a feature group of seven items in `features.ts` (which raises the
derived `featureCount` rather than any typed number), a Features dropdown item, a
dedicated route, a thirteenth product-tour stop, a `check-dist` feature-area row,
the built-page contract `scripts/check-guest-restrictions-page.mjs` in
`postbuild`, and a link both ways with
`/features/nutrition-facts-and-allergens`.

**What the contract pins, and why each one:** the detect-never-certify boundary;
the four forbidden words scanned over the rendered prose with the denial sentence
stripped; the five diets by `data-diet`, because a diet quietly dropped narrows a
capability claim and nothing else would notice; exactly `Conflict,Check,Clear` in
order, because a fourth outcome would be invented rather than shipped; the four
limits still numbering four; the halal and kosher cap, the unreviewed cap and the
confirm freeze as literal sentences rather than only as data; and the worked
example still labelled illustrative for as long as no capture exists (RC-48).

**Step 11, the cut.** Two things came out of the draft. A "how it works in four
steps" section, because it retold the three-answers section with numbers on it.
And a line in the hero promising the guards run "automatically", which is true of
the machine and wrong for this reader: her flaw is that the last tool made her
tag everything and said nothing useful, so the hero earns her attention with the
booking in her own words and lets the product arrive at the Catalyst, where it
belongs.

**Ends on:** the cook reading it off the pan, and the text thread staying on the
phone. Nothing on the page tells her a guest is safe, and that is the reason the
rest of it is worth believing.


## Caterer first-visit revision · 2026-09-11

- [x] 1 Idea: A busy caterer wants to decide whether this part of CostCook fits her kitchen, but technical wording obscures the task and its limits.
- [x] 2 Character: Six-person operation; spreadsheet competent; wants a quick answer, needs evidence, distrusts vague promises and delays setup.
- [x] 3 Plot: service gap → need for clarity → scattered records → a client question → doubt about setup → inspect CostCook → crew handoff → task examples → labelled result → missing evidence → risk of assuming → informed next step.
- [x] 4 Scenes: orientation, kitchen problem, first action, example, limits, questions, next step; each moves from uncertainty to an explicit answer. Existing layout retained.
- [x] 5 Voice: Plain kitchen English; reader questions are persona assumptions, not testimonials. No seamless, powerful or robust.
- [x] 6 Dialogue: Availability precedes commitment; every next step names its outcome.
- [x] 7 Intention/obstacle: Find the relevant kitchen task without decoding implementation terms.
- [x] 8 Snap: Keep the existing concrete kitchen image; remove abstract slogans that compete with it.
- [x] 9 Scene: A phone at the prep bench between services.
- [x] 10 Connection: You throughout; choose a task, inspect what it does, read limits, decide.
- [x] 11 Revision: Built pages, shared consumers, status wording, five responsive widths and 320px/200% text verified. Report: `docs/qa/features-caterer-2026-09-11/report.md`.

## Claim correction · 2026-09-27 (allergen count)

- [x] 11 Revision: "Fourteen allergens" was false; the app tags the fixed US nine (milk, egg, fish, crustacean shellfish, tree nuts, peanuts, wheat, soy, sesame; kitchen-brain drizzle/0034_dizzy_klaw.sql). The count word is now computed from `allergenNames` in `src/lib/dietary.ts`. Beats, scenes, point of view and snap line unchanged; only the number moved. Gap report S3.
