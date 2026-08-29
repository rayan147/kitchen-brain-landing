# CostCook · Story Spine

**Status** DRAFTED 2026-08-27, then built. Worksheets 1–4 filled in for the homepage.
Sections 5–8 of the source framework are declined with a reason (§5). Section 6
records what shipped.

The source is the Young Writers *Story Tracker* roadmap: WHO + WANT + WALL →
want/need/wound/flaw → twelve Save the Cat beats → six-to-eight scenes → voice,
dialogue, senses → point of view → revise. "Keep every worksheet — together they
ARE your story," so this file is kept rather than thrown away after the build.

The reusable part is §1–§3. The five feature areas in `src/lib/features.ts`
(`recipes-and-costing`, `getting-prices-in`, `the-day-itself`,
`compliance-and-labels`, `team-and-connections`) each get their own §4, drawn
against this same hero and this same wall. They are not started here.

---

## 1 · The Idea — WHO + WANT + WALL

> A chef who books the job, quotes the job and cooks the job **wants** to know
> what a plate costs before the price leaves their mouth — **but** every time the
> job changes, the number moves and the sheet does not.

- **WHO** the chef-owner planning event-driven work: an independent caterer or a
  restaurant owner running catering, special dinners, or changing menus. Books
  events, quotes per-guest, logs invoices at the register with one hand. Also
  the 5 a.m. cook, phone in a walk-in, wet hands (RC-01, RC-44).
- **WANT** a price they can say out loud and still make money on.
- **WALL** the job changes. A supplier price moves, the client adds forty guests,
  a case arrives short. Every change is another place to retype the math.

This is the sentence the page already argues. It is written down here so the
feature pages argue the same one.

---

## 2 · The Character — want, need, wound, flaw

| | |
|---|---|
| **WANT** (what they'd ask for) | A faster spreadsheet. A costing calculator. |
| **NEED** (what actually solves it) | One set of numbers that cannot disagree with itself. |
| **WOUND** (what it already cost) | Quoting a job off a price that had moved, and finding out at the invoice. |
| **FLAW** (what they keep doing) | Trusting the copy. Every job starts as last job's sheet, saved under a new name. |

**The want/need gap is the whole pitch.** A faster spreadsheet is still six
sheets that can disagree. The page has argued the NEED well since it was
written. It had never named the WANT it is refusing, and a reader who came for a
calculator needs to be told plainly that they are being offered something else.

**The FLAW is what makes a reader recognise themselves.** "The spreadsheet works
until the job changes" diagnoses the tool. "Every job starts as last job's sheet,
saved under a new name" describes the reader — and describes them without blame,
because it is the correct move given the tools they have.

**The WOUND is the one beat only the owner can finish.** What ships is the
version already signed on the page — the founder saying these are his own weeks.
A real one (one event, one number, one date) would be stronger and is the single
highest-value line anyone could add to this page. It cannot be written for him
and it must not be invented.

---

## 3 · The Plot — twelve beats

The finding that shaped this build: **the page was already story-shaped.** Nine
of the twelve beats were on it before today, in the right order. So this is not a
rewrite of nine sections. It is four missing beats.

| # | Beat | Where it lives | State |
|---|---|---|---|
| 1 | Opening Image | `Hero` — cost it, buy it, prep it, pack it | was there |
| 2 | Theme Stated | Hero lede — "one job pretending to be six" | was there |
| 3 | Setup | `TheProblem` — four moments | was there |
| 3b | **Flaw named** | `TheProblem` lede | **added** |
| 3c | **Wound named** | `TheProblem` provenance line | **added** |
| 4 | Catalyst | "The client adds forty guests" | was there |
| 5 | Debate | `WhoThisIsFor` — is this aimed at me? | was there |
| 6 | Break Into Two | `PaperIn` — how the prices get in | was there |
| 7 | Fun and Games | `SeeItRun`, `CustomerOutcomes` | was there |
| 8 | Midpoint | `TheYield` — the hard part, done right | was there |
| 9 | **Bad Guys Close In** | `TheOtherTools` — the category | **added** |
| 10 | **All Is Lost** | `TheOtherTools` — what you give up | **added** |
| 11 | Break Into Three | `BuiltForKitchens` — built by a chef | was there |
| 12 | Final Image | `StartHere` — put one real order through it | was there |

Beats 9 and 10 share one section on purpose. They are adjacent in the source
framework, and on this page they are one thought: here are the tools that look
like the answer, and here is the honest cost of picking this one instead.

**Why beat 10 was unwritten.** `WhoThisIsFor` carries a limits list, which looks
like All Is Lost but is not — it runs at 30% depth and does Debate work before
the demo plays. All Is Lost lands after the reader wants the thing. Different
beat, different job, and this page's own rule is that a claim does not get
stronger by being made twice: so the two lists share no rows. `WhoThisIsFor` is
about **fit** (the event-driven work, regardless of whether the same owner also
runs regular restaurant service). `TheOtherTools` is about **capability** (right
work, missing feature).

---

## 4 · Beats to Scenes

Nine scenes before, ten now. No scene was moved, renamed or cut, so every
encoded decision in those files survives by default rather than by vigilance —
the mis-centred hero, the refused persona grid, the yield argument that came off
the page rather than onto the ledger, the tripled trial terms.

```
Hero  →  TheProblem  →  WhoThisIsFor  →  SeeItRun  →  CustomerOutcomes
      →  TheYield  →  PaperIn  →  TheOtherTools  →  BuiltForKitchens  →  StartHere
                                   ^^^^^^^^^^^^^ new
```

`TheOtherTools` sits eighth: after the reader has seen the thing work
(`SeeItRun`), been told what it does (`CustomerOutcomes`), watched it do the
hard part (`TheYield`) and learned how the prices get in (`PaperIn`) — and
before the maker signs it. That is where the objection actually forms.

---

## 5 · Voice — worksheets 5–8, declined

The framework's worksheets 5–8 are Character Voices, McKee dialogue, **Sorkin
crackle** and **Tarantino snap**. They are declined, and the reason is in
`CLAUDE.md`: the brand is documented as "competent, calm, unfussy… a sharp knife,
not a dashboard," writing "plain kitchen English… no jargon, no exclamation
points," and "quiet by default." Crackle and snap are the register this product
is defined against. There is also no dialogue on a landing page to write.

What does carry over from those worksheets is worksheet 9 — **feelings, senses,
setting**. That is already the strongest thing about this page's voice ("the case
has the skins on", "five pounds eleven ounces with the skins on, and you paid for
the skins", "wet hands", "5 a.m."), and it is the register the new copy is
written in.

Worksheet 10's **point of view** is settled and unchanged: first person from the
chef who built it, second person to the chef reading it. Never "users".

---

## 6 · What shipped, 2026-08-27

**Beat 3b, the flaw** — `TheProblem` lede. One sentence, naming what the reader
does rather than what their tool does.

**Beat 3c, the wound** — `TheProblem` provenance. Expanded from the existing
signed line. Adds no new specifics, because inventing the founder's own history
is not available.

**Beats 9 and 10** — `src/components/sections/TheOtherTools.astro`, new, plus a
drawn figure contrasting a regular service week with a set of special-event
dates. A restaurant can run both. Names nobody: RC-40 scopes named competitors
to `/compare`, so the homepage argues the category and links to the table.
Backed by new row **RC-47**.

**The give-up rows** are four that do not repeat `WhoThisIsFor`'s three limits,
so nothing is said twice: printed nutrition labels (coming), buying that tops up
to par (no), dietary characteristics (no), English only (no). Three `no` and one
`coming`, and the framing sentence says so — `/compare`'s legend exists to keep
those two apart and a heading reading all four as absent would undo it.

**Guard** — `expectedSectionOrder` gains the tenth stop, `surfaceFiles` gains the
new component so its copy and its comments go through the forbidden-claims scan
like every other surface. `surfaceFiles[0]` and `[1]` are read by position and
were not touched.

### Visuals — buildable now vs blocked

| Candidate | State |
|---|---|
| The week-vs-dates figure in `TheOtherTools` | **shipped**, drawn in SVG like `LoopBand` |
| A crop of the import diff review, in `PaperIn` | **blocked** — needs a staged import batch the walkthrough seed does not create (app repo) |
| A crop per `CustomerOutcomes` card | **blocked, and probably wrong** — the four cards span four surfaces, so one crop argues a quarter of the claim |
| A drawn figure for the five feature areas | **buildable**, not started — belongs with the feature-page pass |

Drawn figures are available today and screenshots are not; that is the split, and
it is about capture availability rather than about whether visuals are wanted.
Any inline `<svg>` must carry intrinsic `width`/`height` or `check-dist.mjs`
fails the build.

---

## 7 · The feature pages, 2026-08-27

**One story at a lower altitude, not six more stories.** A reader on
`/features/getting-prices-in` has either been through the arc already or landed
cold from search. Either way they are checking whether one part of their week is
covered, not being persuaded again. So worksheet 1 applies per area and the rest
of the framework does not re-apply: the beats, the scenes and the point of view
are settled at page level.

### What shipped

**Five WALL sentences**, one per area, in `SECTION_META.wall` — beside `blurb`
and `lede`, which is where the file already keeps the strings the hub and the
area page must not disagree about. Each names a moment in a kitchen, drawn from
the same hero as the homepage.

| Area | Wall |
|---|---|
| Recipes and costing | Somebody wants a number today, and the last time you costed this menu the case price was different. |
| Getting prices in | The new price list arrived as a photograph of a printout. Keying it in is an evening you do not have. Not keying it in means quoting off last month. |
| The day itself | It is five in the morning, your hands are wet, and the sheet taped to the hotel pan has to be right. There is no second trip to the store. |
| Compliance and labels | Somebody asks for the numbers on a dish. Roughly is not an answer, and neither is a figure you worked out once and cannot show your working for. |
| Team, and what it connects to | The kitchen is empty on Monday and there is a job on Saturday. Everything in here is the distance between those two. |

**The reader comes before the product.** The wall takes the lede's type; the lede
drops to body underneath it. Opening on "this area contains X" asks somebody to
care about a category before they have been reminded why they clicked.

**A wall is never a capability claim.** The one that had to be caught in drafting
is team-and-connections: the obvious wall there is handing the prep list to
somebody at 5 a.m. without handing over the costs, and RC-44 says plainly that
you cannot do that. It says setup instead.

**Walls render on the area page only.** The hub is five signposts and was rebuilt
out of a 145-item wall to stay scannable. A second sentence per card turns five
cards back into prose. The asymmetry is the decision.

**The hub** gains one line naming the five areas as the homepage's chain taken
apart, so a reader arriving from the arc does not meet five unrelated
departments. Its `h1` is untouched: a reference page's promise is completeness,
and that heading is doing that work on purpose.

### Visuals — three of five

A figure earns its place when the **argument is geometric** — when the shape
makes the point faster than the paragraph above it.

| Area | Figure |
|---|---|
| Recipes and costing | **Built.** The path a case price walks: case → unit → edible → plate → event, with the operation named above each stop. |
| Getting prices in | **Built.** Four doors → one queue → **you confirm** → your prices. The gate is the only stop drawn in amber, because it is the only one that is a promise rather than a mechanism. |
| Compliance and labels | **Built.** Fifteen filled marks against an empty dashed panel. More honest than a badge, because a badge is what a reader skips. |
| The day itself | **Declined.** Its shape is the loop, and the loop is drawn twice already. LoopBand's own comment: two drawings of one chain that disagree are worse than no drawing. |
| Team and connections | **Declined.** Setup, roles, offline behaviour and two unbuilt connectors are a list, not a shape. A figure added so all five pages match is the persona-grid mistake, drawn instead of written. |

### The rule these figures cost us

**Drawings are pixels; their labels are text.** Three separate ways rem units
broke a figure across this and the homepage pass:

1. A rem-sized dot grew to 12px inside an 8.2px column at 200% text — clipped
   *inside* its row, while the page-level overflow check still read zero.
2. `min-w-0` fixes page overflow by removing the very floor that was keeping
   each cell as wide as its glyph, so it trades one failure for the other.
3. A `minmax(9rem, 1fr)` grid track has a 288px floor once the root doubles,
   which is wider than a 360px phone's content box, and the page scrolls
   sideways (WCAG 1.4.10).

The probe is per-child collision and `scrollWidth`, at 200% text, at 360 — not
`document.scrollWidth` alone.
