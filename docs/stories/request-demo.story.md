# Story Tracker — Request a CostCook demo

## My story

- **Piece:** Demo-request landing page and qualification flow
- **Title / headline:** Put one real job on the screen.
- **My hero's name:** A chef-owner or catering operator deciding whether CostCook fits their kitchen
- **Content file(s):** `src/components/sections/DemoRequest.astro`, `src/pages/demo.astro`, `src/pages/demo/sent.astro`, `src/pages/demo/not-sent.astro`

### Revision, 2026-09-06 — the send became real

The page's last scene used to turn nothing. Step 3 said "Your request is ready
to send", handed the visitor's own mail client a draft, and then told the truth
about itself: "CostCook has not claimed your request was sent." Beat 12 was not
a Final Image, it was a to-do list. The one thing the hero came to do, they
still had to go and do somewhere else.

The form now posts to `/api/demo-request`, both mailboxes receive it, and the
booking calendar is on the page rather than in a new tab beside an "Email Rayan
directly" exit. Steps 3, 4, 6, 10 and 11 are revised below. Nothing above them
changed: the hero, the wound and the flaw are the same, which is why the fix
was to the ending and not to the argument.

## The 11 steps

| # | Step | What you build | Done |
|---|------|----------------|------|
| 1 | The Idea | One sentence: WHO + WANT + WALL. | ☒ |
| 2 | Your Character | Hero's insides: want, need, wound, flaw. | ☒ |
| 3 | The Plot | 12 beats on the Save the Cat map. | ☒ |
| 4 | From Beats to Scenes | 12 beats → the 6 sections you will write. | ☒ |
| 5 | Character Voices | The reader's voice and the product's voice. | ☒ |
| 6 | Writing Dialogue | Each section turns a value, the McKee way. | ☒ |
| 7 | Sorkin Dialogue | Headline and subhead as intention vs obstacle. | ☒ |
| 8 | Cool Talk | One line of snap. | ☒ |
| 9 | Bringing a Scene to Life | Senses and setting for the key scene. | ☒ |
| 10 | Connecting Your Scenes | Hand-offs between sections; POV locked. | ☒ |
| 11 | Revise and Finish | Cut, sharpen, make the ending land. Done. | ☒ |

---

### Step 1 — The Idea

> A chef-owner or catering operator who wants to see whether CostCook fits one real job but does not want to sit through a generic sales tour.

### Step 2 — Your Character

- **Want (surface):** See their own kind of work move through CostCook before committing.
- **Need (real):** Leave the call knowing whether the product fits and what setup would require.
- **Wound (the bad day):** A past software demo spent the whole call on polished features and never reached the menu, price, or prep problem they came with.
- **Flaw (the habit):** They keep researching alone because a sales call feels like surrendering control.

### Step 3 — The Plot (12 beats)

| Beat | In this piece |
|------|---------------|
| 1 Opening Image — life before | You have a real menu, guest count, or supplier sheet open beside yet another generic product tab. |
| 2 Theme Stated — the truth they'll learn | A useful demo starts with the job you need to run, not a rehearsed feature list. |
| 3 Set-Up — the daily grind, the flaw on display | You compare screenshots and promises while the actual job remains yours to price twice. |
| 4 Catalyst — the bad day / the wall hits | The quote, order, or prep plan is due before your research is finished. |
| 5 Debate — “can it be different?” | You wonder whether booking means a long pitch, a hard sell, or handing over too much information. |
| 6 Break into Two — they try the new way | You tell Rayan what kind of kitchen and workflow to put on screen. |
| 7 B Story — the relationship it protects | The conversation stays chef-to-chef and your judgment remains the decision point. |
| 8 Fun and Games — promise of the premise | Follow the chosen job from menu and head count to cost, shopping, prep, and pack work. |
| 9 Midpoint — first real win, with a number | You press send and it is sent. Rayan has the job you named before you have looked away from the page. |
| 10 Bad Guys Close In — edge cases, doubts | If the send fails you are told so, and everything you typed is still in front of you. If the calendar will not load, one link opens it in a tab. Neither is dressed up. |
| 11 All Is Lost / Dark Night | Another generic demo would leave the real job untouched and tomorrow's deadline unchanged. |
| 12 Finale + Final Image | The 15 minutes are on your calendar, booked on the same page you started on, with one real job already named for the call. |

### Step 4 — From Beats to Scenes (6 sections)

| § | Section | Beats it carries | Value turn (− → +) |
|---|---------|------------------|--------------------|
| 1 | Put one real job on the screen | 1–2 | generic pitch → specific working session |
| 2 | Prepare the demo request | 3–6 | guarded research → controlled first step |
| 3 | What we will follow | 7–8 | feature list → one connected kitchen job |
| 4 | Sent, and the calendar | 9–10, 12 | asked → sent, and a time you can pick without leaving |
| 5 | What happens in 15 minutes | 8–10 | vague meeting → known agenda and boundaries |
| 6 | Choose the useful next step | 11–12 | another tab open → a time chosen or a self-serve route taken |

### Step 5 — Character Voices

- **Reader's words for the problem:** “show me my workflow,” “one real menu,” “guest count,” “what does setup take,” “I do not want a sales pitch.” These are grounded in the repository's contact and feature-page language; no testimonial language is invented.
- **Product voice:** calm, direct, kitchen-literate.
- **Banned words:** seamless, powerful, effortless.

### Step 6 — Dialogue (McKee): the turn in each section

- You expect a generic walkthrough → the page asks for one real kitchen job.
- You expect a lead form → the first frame asks only what makes the demo useful.
- You expect disconnected features → the agenda follows one event end to end.
- You expect a mystery submit → it says "Sent" only after it is, and the calendar opens under that sentence.
- You expect a long pitch → the agenda is bounded to 15 minutes and names what it can cover.
- You expect pressure → you can book, tour the product, or start without a call.

### Step 7 — Sorkin: headline / subhead

- **Intention:** Decide whether CostCook can run the reader's real work.
- **Obstacle:** Generic demos spend the call proving the software exists rather than answering the kitchen's question.
- **Headline:** Put one real job on the screen.
- **Subhead:** Tell Rayan what your kitchen needs to run. In 15 minutes, follow that work through CostCook and leave knowing whether it fits.

### Step 8 — Cool Talk: the one snap line

> Bring the menu you would otherwise price twice.

### Step 9 — Bringing a Scene to Life

- **Where they are:** Between an office desk and a prep table, with a menu, guest count, or supplier sheet already open.
- **What they see / hear / feel:** The job is due; the real numbers are in reach; another generic product video feels like delay.
- **Time of day:** A working afternoon when the next quote or order cannot wait for a long evaluation.

### Step 10 — Connecting Your Scenes

- **POV:** Second person (“you”) throughout.
- **Hand-offs:** “Start with the job.” → “Now name the person bringing it.” → “This goes to Rayan's inbox when you send it.” → “Sent. Now take your 15 minutes.” → “If a call is not the next step, keep moving.”

### Step 11 — Revise and Finish

- **Word count before → after:** 612 → 327 words of visible explanatory copy. The
  2026-09-06 revision is net neutral: the hedging in step 3 came out, one
  sentence of "sent, now pick a time" went in.
- **Claims removed because they could not be shown:** response-time promises,
  qualification guarantees, customer counts, conversion claims.
- **The claim that came BACK, 2026-09-06:** "an assertion that the static site
  sends form data itself" was on the removed list, and it was right to be: the
  site could not. The truth pass is a check on the copy, not a licence to leave
  the product not doing the thing. The page now sends, so the sentence is now
  showable, and it is the sentence the whole page was missing.
- **Claims still refused:** the page never says a time is booked. It cannot know:
  the calendar is Google's, inside a frame that tells us nothing, so "your
  request is sent" and "a time is booked only once you choose one and Google
  confirms it" are two different sentences and stay that way.
- **Final Image (the CTA sentence):** Sent. Now take your 15 minutes.

**Snap line:** “Bring the menu you would otherwise price twice.”
