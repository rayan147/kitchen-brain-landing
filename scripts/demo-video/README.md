# Regenerating public/demo.{mp4,webm} and public/demo-poster.jpg

The landing page embeds a real screen recording of the CostCook app: silent,
captioned with on-screen cards, over a generated music bed. There is no speech
track and there will not be one. See `docs/demo-video-rebuild-2026-08-21.md`
for why, and for the decisions this rig is built around.

## What runs

Three files, and nothing else in this directory is live:

| File | Job |
| --- | --- |
| `beats.mjs` | The storyboard. Beats, their cards, their motion, and the runtime. **Edit copy here.** |
| `capture-silent.mjs` | Drives a running app, records one video per beat, writes `cut/meta.json`. |
| `assemble-silent.mjs` | Trims, joins, lays the bed, encodes both formats, cuts the poster. |
| `cards.html` | The title and end cards, rendered by the capture step. |
| `make-bed.mjs` | Synthesises the music bed the assembler normalises to -23 LUFS. |

## Regenerating, end to end

The app repo is `../kitchen-brain-develop-demo`. Nothing in this pipeline may
touch a real database: the seeder only writes `file:e2e/.scratch/demo.db` and
refuses anything else, every seeded vendor address is under the reserved
`example.com`, and the SMTP transport refuses non-loopback targets. Standing
policy since PR #29.

```sh
# --- in the app repo ---
docker compose up -d mailpit                          # SMTP capture, UI on :8025
HISTORY_SEED_DATE=2026-08-21 npm run demo:seed        # ~25s, pins date-derived figures
HISTORY_SEED_DATE=2026-08-21 npm run demo:capture     # ~90s: builds, drives the beat sheet,
                                                      # writes demo/out/screens + demo/out/landing
DEMO_BUILD=0 ./demo/serve.sh &                        # leave a preview up on :4181

# --- back here ---
APP=http://localhost:4181 node scripts/demo-video/capture-silent.mjs
node scripts/demo-video/assemble-silent.mjs
```

`demo:capture` has to run first and it is not optional: the marquee order is
created live by that spec, and `capture-silent.mjs` resolves its targets by
name against the world that spec leaves behind. `demo/serve.sh` exists because
the app's Playwright harness tears its own preview down when the run ends, and
this rig needs one that stays up.

The assembler prints the encoded duration and names the three places that have
to agree with it: the chip in `SeeItRun.astro`, the hero link in `Hero.astro`,
and the guard literal in `check-landing-claims.mjs`. They have drifted twice.
`ffprobe` is not installed here and `ffmpeg-static` does not ship one, so the
assembler's own figure is the source of truth.

## Two things that are easy to get wrong

**The caption bar is sized for a phone, not for the capture frame.** The cards
are burned in at 1600px wide, and `SeeItRun.astro` renders the player inside
`container-page`, which at a 390px viewport leaves the video **350px** wide. A
40px card therefore arrived at 8.75 CSS px on the device most of this page's
readers use, which is not small type, it is unreadable type. The bar is 64px
now. If you change it, do the arithmetic at 350px, not at 1600px, and re-read
every card afterwards for a third line.

**Dates move with the real clock, not with `HISTORY_SEED_DATE`.** The marquee
order is seeded three days out from today, so its weekday changes between
capture runs. A card naming a weekday has to be read off the run that shipped:
the 2:02 cut said Monday, and the next capture put the same order on Tuesday.

## Numbers before prose

Every figure on a card must be legible in the frame behind it, and must come
from **this** capture run. `demo/SCRIPT.md` in the app repo puts the rule
correctly: if a re-seeded capture shifts a figure, update the copy from the new
shots, never the reverse. Dates and date-derived figures move with
`HISTORY_SEED_DATE`; pin it and pin it the same for both repos.

## History, kept but not live

Five generations of this rig accumulated. Only the files in the table above are
part of the current pipeline. The rest are here for the record and none of them
is wired to anything:

- `record-demo.mjs`, `record-redesign.mjs`, `seed.mjs` — the first generation,
  against a chicken-piccata world that no longer exists. The README that
  described them was still the README of this directory until 2026-08-21.
- `capture-beats.mjs`, `beats.json`, `assemble.sh` — the second generation.
- `capture-walkthrough.mjs`, `narration.md`, `make_voiceover.py`, `speak.py`,
  `vo/`, `vo-silent/`, `voices/`, `venv/` — the narrated generation. It recorded
  against a deployed instance and produced artefacts nothing consumed. Its
  motion primitives (the injected cursor, the highlight ring that follows
  document coordinates, the eased scroll) were ported into
  `capture-silent.mjs`; that is the whole of its estate.

`speak.py`'s docstring is worth reading before touching any copy here. It
records the one lesson this rig actually learned: captions and speech are
different jobs, and making either a transliteration of the other ruins both.
