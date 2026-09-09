# Story Tracker — the homepage copy-density pass

Not a new story. A **revision pass** over the story the homepage already tells,
run because the page had grown to 3,288 visible words on a phone for a reader
CLAUDE.md gives under a minute. Brief: `BRIEF-copy-density-2026-09-09.md`.

## My story

- **Piece:** landing page revision (13 stops, homepage only)
- **Title / headline:** unchanged. No headline on the page was rewritten.
- **My hero's name (the reader, as a person):** Dana, owner-operator of a
  6-person catering kitchen, reading on a phone between a delivery and a prep
  shift, arrived from a cold email she nearly deleted.
- **Content file(s):** `src/lib/nutrition.ts`, `src/lib/sage.ts`,
  `src/components/sections/NutritionFacts.astro`, `Sage.astro`,
  `TheOtherTools.astro`, `TheProblem.astro`, `BuiltForKitchens.astro`,
  `PaperIn.astro`, `StartHere.astro`

## The 11 steps

| # | Step | What you build | Done |
|---|------|----------------|------|
| 1 | The Idea | One sentence: WHO + WANT + WALL. | ☑ |
| 2 | Your Character | Hero's insides: want, need, wound, flaw. | ☑ |
| 3 | The Plot | 12 beats on the Save the Cat map. | ☑ |
| 4 | From Beats to Scenes | 12 beats → the sections you will write. | ☑ |
| 5 | Character Voices | The reader's voice and the product's voice. | ☑ |
| 6 | Writing Dialogue | Each section turns a value, the McKee way. | ☑ |
| 7 | Sorkin Dialogue | Headline and subhead as intention vs obstacle. | ☑ (unchanged, audited) |
| 8 | Cool Talk | One line of snap. | ☑ |
| 9 | Bringing a Scene to Life | Senses and setting for the key scene. | ☑ (unchanged) |
| 10 | Connecting Your Scenes | Hand-offs between sections; POV locked. | ☑ |
| 11 | Revise and Finish | Cut, sharpen, make the ending land. | ☑ |

---

### Step 1 — The Idea

> An **owner-operator caterer reading on a phone mid-shift** who wants **to
> decide in under a minute whether this is worth fifteen** but **cannot,
> because the page says everything it knows.**

The wall in this revision is not the product's. It is the page's. That makes
this a revision story, and its antagonist is our own thoroughness.

### Step 2 — Your Character

- **Want (surface):** to know if this thing is real before her hands are free.
- **Need (real):** to stop being sold to. She wants to be told, once, and left
  to decide.
- **Wound (the bad day):** the last platform that promised the same loop, took
  a card, and needed four evenings of setup she never got back. She now reads
  marketing pages for what they are hiding.
- **Flaw (the habit):** she skims. She will not read paragraph three. A claim
  made twice does not reassure her twice; it reads as a page trying too hard,
  which is the exact tell she is scanning for.

That last line is the finding. **The duplications were not neutral. For this
reader they were negative.** Repetition is how a page sounds like it is
convincing itself.

### Step 3 — The Plot (12 beats)

The beats did not change. This pass audited which sections carried which beat,
and cut copy that belonged to a beat some *other* section owns.

| Beat | In this piece | Touched? |
|------|---------------|----------|
| 1 Opening Image — life before | Hero, the first screen | no |
| 2 Theme Stated | Hero subhead | no |
| 3 Set-Up — the grind, the flaw | `#problem` lede | **yes**, it pre-announced the four tickets under it |
| 4 Catalyst — the wall hits | the four `#problem` tickets | no, pinned and load-bearing |
| 5 Debate — objections | `#who` limits, `#start` card questions | no |
| 6 Break into Two — product enters | `#demo` footage | no |
| 7 B Story — who it is really for | `#trust` founder | **yes**, it had lent its heading to beat 3 |
| 8 Fun and Games — the mechanics | `#yield` `#nutrition` `#intake` `#sage` `#access` | **yes**, this is where the mass was |
| 9 Midpoint — first real win | `#outcomes`, `#demo` | no |
| 10 Bad Guys Close In | `#alternatives`, the boundaries | **yes**, it re-told beat 4 |
| 11 All Is Lost | the rival turn | no |
| 12 Finale + Final Image | `#start` | **yes**, it re-answered its own diligence block |

**The one structural finding.** Beat 8 holds five of the thirteen stops and 55%
of the words. Every mechanic argued at the same volume as the diagnosis the page
rests on, so nothing looked load-bearing. Beat 8 is where a page gets long,
because every mechanic is genuinely worth explaining and no single one is the
one to cut.

### Step 4 — From Beats to Scenes

No section was added, removed, merged or reordered. That was out of scope by the
brief (`§0`), and the order has been settled three times, twice by measurement.

### Step 5 — Character Voices

Unchanged and audited as unchanged. The reader's words (short, pot-and-pan
concrete: "short at the dock", "my own week", "before you hand over a card") and
the product's (flat, declarative, no adverbs). What the pass had to protect: a
compressed sentence drifts toward the product's voice, because qualifiers are
the first thing a trim removes and qualifiers are where the honesty lives.

Guarded by running `npm run check` after **every** section rather than at the
end. The forbidden-claim list in `check-landing-claims.mjs` exists precisely for
sentences that a shortening pass produces.

### Step 6 — Dialogue (McKee): the turn in each section

Every value turn was left intact. The test applied to each cut was: **does the
section still turn without this sentence?** Where the answer was yes, the
sentence was somewhere else on the page too.

- `#problem` exposed → named. Kept. It lost the clause that pre-announced the
  tickets and the credential that belongs to `#trust`.
- `#nutrition` asked-for → answerable. Kept. It lost five detail paragraphs'
  worth of enumeration that the cue rail beneath each one already listed.
- `#sage` suspicious → bounded. Kept, and the boundaries were **not** cut: the
  section's own h3 is "Useful because the boundaries are visible", so a version
  that hid them would argue against itself. What went was the same sentence said
  six times.
- `#intake` how-does-it-get-in → one queue, your gate. Kept. The prose paragraph
  was reading the diagram aloud.
- `#alternatives` maybe-something-else → go and ask them this. Kept. The turn
  still names the forty guests, because a question needs a real number; it no
  longer re-narrates the Saturday `#problem` already gave her.
- `#trust` a-product → a person. Kept, and **strengthened**: its h2 was being
  spoiled 8,000px earlier.
- `#start` interested → willing. Kept.

### Step 7 — Sorkin: headline / subhead

- **Intention:** decide in under a minute.
- **Obstacle:** the page's own completeness.
- **Headline:** not rewritten. No h1, h2 or h3 on the page changed wording.

One h3 subhead was deleted rather than rewritten: "Evidence, access and action
stay separate", which named the three group labels that render immediately
beneath it as their labels.

### Step 8 — Cool Talk: the one snap line

The page's snap line was already there and this pass **protected** it by taking
its competition away:

> It never quietly becomes zero.

It used to be the tail of a two-sentence body whose first sentence repeated
`#problem`'s pinned rule, and it was one of four places the page made this
point. It is now the whole line, in `#trust`, and `#start` no longer says it a
fourth time at the close.

### Step 9 — Bringing a Scene to Life

Untouched. The physical scenes are in `#problem`'s tickets (the dock, the
folder, the copy of last month's sheet) and they were the one part of the fat
sections that no cut went near, because a scene is what a skimmer keeps.

### Step 10 — Connecting Your Scenes

- **POV:** second person, locked, with one deliberate first-person testimony
  block in `#trust`. The provenance cut **tightened** this: first person now
  appears in exactly one place instead of leaking into `#problem`.
- **Hand-offs:** `SectionHandoff` derives every one from `src/lib/stops.ts`. No
  hand-off line was edited, so no hand-off can have been broken.

### Step 11 — Revise and Finish

- **Word count before → after:** 3,288 → **2,963** mobile-visible words
  (−325, −9.9%). Desktop 3,692 → 3,367. Paragraphs 127 → 125; sentences
  193 → 181.
- **Height:** 29,088 → **27,979px** at 390×844 (−1,109px). 34.5 → 33.2 mobile
  viewports. Desktop 22,017 → 21,487px.
- **Claims removed because they could not be shown:** none. That is the point of
  the next line.

**What was removed, and where each thing is still said.** Nothing was removed
for being unprovable. Every cut was a claim the page made **twice or more**:

| removed from | the claim | still said in |
|---|---|---|
| `#nutrition` 5 detail paragraphs | the sheet's contents, the three allergen evidence sources, the USDA match states, blank-not-zero | the cue rail directly beneath each one, and `NutritionFactsAllergensFeature.astro` |
| `#nutrition` lede | blank-not-zero | point 3 of the same section |
| `#nutrition` caption + point 4 | "not a retail-label compliance claim" | `notClaimed[0]`, now in the guard's exact words |
| `#sage` lede + `.sage-promise` | eleven read, one prepares, you approve | the approval-path band, which shows it |
| `#sage` lede | the four line-marking states | the missing-evidence guardrail, which lists all four (the lede listed three) |
| `#alternatives` turn | the forty guests moving three lists | `#problem` moment 2 |
| `#alternatives` lede + figcaption | "special dinners and changing menus"; "a restaurant can run both" | `#who` lede; the pinned lede sentence above it |
| `#problem` lede | every copy of the sheet holds the old price | the next paragraph, which is the flaw beat |
| `#problem` line 3 | "I cooked professionally for twelve years" | the h2 of `#trust`, beside the portrait |
| `#trust` consequences | the missing-fact rule; the four connected plans | `#problem`'s pinned sentence; this section's own lede |
| `#intake` review prose | differences listed, nothing written, unclear text quoted | the queue diagram beside it, as three labels |
| `#start` figcaption | missing facts stop the total | `#problem`, `#trust` |
| `#start` trial boundary | the Settings → Billing cancel path | the "How do I cancel?" answer below it |

- **Final Image (the CTA sentence):** unchanged. `cta.label` is rendered verbatim
  by contract, and the close still opens on the same action the page opened on.

## What this pass did NOT do, and why it is the owner's call

The brief targeted ~690 words for ~2,550px. This delivered **325 words for
1,109px, 47% of it.** The gap is not unfinished work; it is where the character
of the cut changes.

Every one of the 325 was a **duplicate**: a claim the page states somewhere else,
often within a screen. Those cuts cost the page nothing, which is why they did
not need asking about.

The remaining ~365 words would have to come out of claims the page makes
**once**. The two obvious blocks:

- `#sage`'s six guardrails, ~150 words, and
- `#nutrition`'s "What it is not", ~60 words.

Both have a feature page that could hold them. Both are also the reason a
skeptic believes the sections around them, and CLAUDE.md's second design
principle is that a prettier lie loses to a plainer truth. Removing a boundary
to save 600px makes the page shorter and the claims weaker at the same time.

**That is a decision about what the homepage promises, not about its length, so
it is not one to make inside a density pass.** If the owner wants the remaining
365, the honest version is: move the boundaries to the feature pages and accept
that the homepage now asks to be trusted rather than showing why it can be.

What that would buy, **as a prediction and not a measurement**: at this pass's
measured 3.41px per word, 365 words is about 1,250px, landing near 26,700px
against the 30,000px ceiling. Treat it as an upper bound. Both blocks are dense
boundary prose sitting in sections with a lot of non-text height, and the
predicted rate has now come in high twice running (8+ predicted, then 4.2, then
3.41 delivered).
