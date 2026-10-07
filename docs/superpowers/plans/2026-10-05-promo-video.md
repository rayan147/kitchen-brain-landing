# Promo Video Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A ~88 s, 16:9 Remotion film that follows one wedding through CostCook (develop build) from inquiry to booked, with chef-question chapter cards, burned-in captions whose figures come only from a capture manifest, and a claims-check block that holds it to the release-claim ledger.

**Architecture:** A self-contained `video/` Remotion package in the landing repo (own `package.json`, excluded from Astro). Captions live as data in `film.ts`; figures are tokens resolved from `frames/manifest.json`, which the capture script writes from the same page elements it photographs. Phase A (video package) does not depend on Phase B (capture); missing frames render a visible "frame pending" slate in Studio and fail the render guard.

**Tech Stack:** Remotion 4.0.533 (`remotion`, `@remotion/cli`, `@remotion/transitions`, `@remotion/google-fonts`, `zod`), React 19, TypeScript, Vitest; Playwright via the kitchen-brain checkout (capture); Remotion's bundled ffmpeg (`npx remotion ffmpeg`) for loudness.

**Spec:** `docs/superpowers/specs/2026-10-05-promo-video-design.md` · **Story:** `docs/stories/promo-video.story.md`

## Global Constraints

- Worktree: `/home/rayan147/kitchen-brain-landing/.gitworktrees/promo-video`, branch `feat/promo-video`. Every path below is relative to it unless absolute.
- Capture source: kitchen-brain **`develop`**, exported clean with `git archive`, **after** `fix/offer-walk-fixes-2026-10-05` is merged into it. Never production main. Record the exact commit.
- Deposit path: card rail, Stripe **test mode**, ordering app running locally. Invoice: real import pipeline (`IMPORT_AI_PROVIDER=google`), never the stub.
- Captions: no em dash (`—`), no en dash (`–`), no `!`. Second person. Figures only as `{tokens}`.
- Banned in captions: `no typing`, `nothing re-keyed`, `fully automatic`, `seamless`, `in one click`, `invoice email`, any `book`/`booked`/`booking` except the snap line `Her yes is not a booking. Confirm order is.` and captions after it.
- Client-side button names allowed in captions: `Accept proposal`, `Ask for changes`, `Pay`. No closeout frame, no signing frame.
- Price and trial come from `src/lib/site.ts` (`displayPrice`, `trialDays`), never typed.
- Video: 1920×1080, 30 fps. Caption type ≥ 44 px. Fonts Instrument Sans (body) and Fraunces (display). Colours from `src/styles/global.css` `@theme`.
- Animation: `useCurrentFrame()` + inline `interpolate()`; `Easing.bezier(0.16, 1, 0.3, 1)` default; `scale`/`translate` properties, never `transform`; no CSS transitions. Every timed element `premountFor={fps}`.
- Audio: bed from `scripts/demo-video/make-bed.mjs`; final mix `loudnorm=I=-23:TP=-2:LRA=7`; verify integrated -23 ± 1 LU, true peak ≤ -2 dBTP.
- Render to MP4 only when the owner explicitly asks.
- Commits end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **A caption whose token has no manifest value** (frame not captured yet, or a key renamed): must fail loudly (Zod parse / resolver throws), never render `{foodCostPct}` or `undefined`. Pinned in Task 2.
2. **A manifest figure in a different format than the caption expects** (`28.4%` vs `28.4`, `$3,500.00` vs `3500`): the manifest stores the exact on-screen string, the resolver inserts it verbatim. Pinned in Task 2.
3. **A frame file listed in `film.ts` but missing on disk:** Studio shows a labelled slate; `npm run render:check` fails. Pinned in Task 3/Task 4.
4. **Copy drift into banned territory** (an em dash pasted from a doc, "booked" before the snap line): the claims-check block fails. Pinned in Task 5 with a deliberately broken run.
5. **Test-copy leaking into a frame** ("This test site only emails approved addresses", "stub", workspace name "Maple & Main"): the capture FORBIDDEN list throws before the screenshot is written. Pinned in Task 7.

---

## Phase A: the video package (independent of capture)

### Task 1: Scaffold `video/` and keep it out of the site build

**Files:**
- Create: `video/` (via `create-video`), `video/vitest.config.ts`
- Modify: `tsconfig.json` (exclude), `.gitignore`

**Interfaces:**
- Produces: `video/package.json` scripts `studio`, `test`, `typecheck`, `still`, `render:check`.

- [ ] **Step 1: Scaffold**

```bash
cd /home/rayan147/kitchen-brain-landing/.gitworktrees/promo-video
npx create-video@latest --yes --blank --no-tailwind video
cd video && npm i
npx remotion add @remotion/transitions @remotion/google-fonts zod
npm i -D vitest
```

- [ ] **Step 2: Scripts and Vitest config**

In `video/package.json` set `"scripts"` to:

```json
{
  "studio": "remotion studio",
  "test": "vitest run",
  "typecheck": "tsc --noEmit",
  "still": "remotion still",
  "render:check": "node scripts/render-check.mjs",
  "render": "remotion render PromoFilm out/promo.mp4"
}
```

`video/vitest.config.ts`:

```ts
import {defineConfig} from 'vitest/config';

export default defineConfig({test: {include: ['src/**/*.test.ts']}});
```

- [ ] **Step 3: Exclude from the site**

Append `"video"` to the `exclude` array in `tsconfig.json`. Append to `.gitignore`:

```
# Remotion package working files
video/node_modules/
video/out/
```

- [ ] **Step 4: Verify the site is unaffected and Studio opens**

Run: `npm run check` (repo root). Expected: same result as on `develop` (no new errors mentioning `video/`).
Run: `cd video && npx remotion studio --no-open` (background). Expected: prints a `http://localhost:3000` URL; open it in the browser and see the blank composition. Leave Studio running for the rest of Phase A.

- [ ] **Step 5: Commit**

```bash
git add tsconfig.json .gitignore video
git commit -m "feat(video): scaffold the Remotion package, kept out of the site build"
```

### Task 2: Manifest schema and caption resolution

**Files:**
- Create: `video/src/manifest.ts`, `video/src/film.ts`, `video/src/film.test.ts`, `video/public/frames/manifest.json`

**Interfaces:**
- Produces:
  - `ManifestSchema` (Zod) and `type Manifest = { guests: string; pricePerGuest: string; foodCostPct: string; deposit: string; revenue: string; displayPrice: string; trialDays: string; developCommit: string; capturedOn: string }`
  - `resolveCaption(template: string, manifest: Manifest): string` (throws `Error('unresolved token {x}')`)
  - `type SceneId = 'coldOpen' | 'charge' | 'proposal' | 'deposit' | 'buy' | 'invoices' | 'close'`
  - `FILM: Record<SceneId, { chapter: string | null; frames: string[]; captions: string[] }>`
  - `captionsFor(scene: SceneId, manifest: Manifest): string[]`

- [ ] **Step 1: Write the failing tests**

`video/src/film.test.ts`:

```ts
import {describe, expect, it} from 'vitest';
import {FILM, captionsFor, resolveCaption} from './film';
import {ManifestSchema, type Manifest} from './manifest';

const manifest: Manifest = {
  guests: '150',
  pricePerGuest: '$95.00',
  foodCostPct: '28.4%',
  deposit: '$3,500.00',
  revenue: '$14,250.00',
  displayPrice: '$49/month',
  trialDays: '15',
  developCommit: 'abc1234',
  capturedOn: '2026-10-06',
};

describe('resolveCaption', () => {
  it('inserts the on-screen string verbatim', () => {
    expect(resolveCaption('Food cost {foodCostPct}.', manifest)).toBe('Food cost 28.4%.');
  });
  it('throws on a token the manifest does not carry', () => {
    expect(() => resolveCaption('Margin {margin}.', manifest)).toThrow('unresolved token {margin}');
  });
});

describe('ManifestSchema', () => {
  it('refuses a manifest missing a figure', () => {
    const {foodCostPct: _, ...rest} = manifest;
    expect(ManifestSchema.safeParse(rest).success).toBe(false);
  });
});

describe('FILM captions', () => {
  it('every scene resolves against a full manifest', () => {
    for (const id of Object.keys(FILM) as (keyof typeof FILM)[]) {
      expect(() => captionsFor(id, manifest)).not.toThrow();
    }
  });
  it('carries no em dash, en dash or exclamation point', () => {
    const all = Object.values(FILM).flatMap((s) => [s.chapter ?? '', ...s.captions]).join('\n');
    expect(all).not.toMatch(/[—–!]/);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd video && npm test`
Expected: FAIL, cannot resolve `./film` / `./manifest`.

- [ ] **Step 3: Implement**

`video/src/manifest.ts`:

```ts
import {z} from 'zod';

// Every figure is the exact string the app printed, read by the capture
// script from the element it photographed. Nothing here is typed by hand.
export const ManifestSchema = z.object({
  guests: z.string().min(1),
  pricePerGuest: z.string().min(1),
  foodCostPct: z.string().min(1),
  deposit: z.string().min(1),
  revenue: z.string().min(1),
  displayPrice: z.string().min(1),
  trialDays: z.string().min(1),
  developCommit: z.string().min(7),
  capturedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type Manifest = z.infer<typeof ManifestSchema>;
```

`video/src/film.ts`:

```ts
import type {Manifest} from './manifest';

// Considered Template Method for scenes (shared chapter card, screen, caption
// skeleton); not used because React composition already shares that shell and
// each scene's motion differs. Captions vary as data, so they are a table.
// story: docs/stories/promo-video.story.md

export type SceneId = 'coldOpen' | 'charge' | 'proposal' | 'deposit' | 'buy' | 'invoices' | 'close';

type Scene = {chapter: string | null; frames: string[]; captions: string[]};

export const FILM: Record<SceneId, Scene> = {
  coldOpen: {
    chapter: null,
    frames: ['events-inquiry-mobile.png'],
    captions: ['A wedding. About {guests} guests. No date yet.'],
  },
  charge: {
    chapter: 'What do I charge a head?',
    frames: ['events-pricing-desktop.png'],
    captions: ['{pricePerGuest} a guest. Food cost {foodCostPct}. You see it before you quote.'],
  },
  proposal: {
    chapter: 'Will she say yes without a meeting?',
    frames: ['events-proposal-sent-desktop.png', 'events-offer-mobile.png'],
    captions: ['The proposal goes to her phone. No login.', 'Accept proposal, or Ask for changes. Her call.'],
  },
  deposit: {
    chapter: 'How do I get the deposit without chasing anyone?',
    frames: [
      'events-payment-request-desktop.png',
      'events-pay-mobile.png',
      'events-payments-paid-desktop.png',
      'events-balance-reminder-email.png',
      'events-confirm-desktop.png',
    ],
    captions: [
      'Request {deposit} by email. She pays from the link on her phone.',
      'On the day the balance is due, the reminder goes out for you.',
      'Her yes is not a booking. Confirm order is.',
      'Prices and quantities freeze.',
    ],
  },
  buy: {
    chapter: "How much do I buy so I'm not short at 5 a.m.?",
    frames: ['events-shop-desktop.png'],
    captions: ['Whole packs, by supplier, for {guests}.'],
  },
  invoices: {
    chapter: 'Do I have to type in every invoice?',
    frames: ['events-import-review-desktop.png'],
    captions: ['Upload it. Confirm what it read. Type what it could not.'],
  },
  close: {
    chapter: null,
    frames: ['events-pricing-desktop.png'],
    captions: ['{pricePerGuest} a guest. {foodCostPct} food cost. Known before the call ended.'],
  },
};

export function resolveCaption(template: string, manifest: Manifest): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = (manifest as Record<string, string | undefined>)[key];
    if (value === undefined) throw new Error(`unresolved token {${key}}`);
    return value;
  });
}

export function captionsFor(scene: SceneId, manifest: Manifest): string[] {
  return FILM[scene].captions.map((c) => resolveCaption(c, manifest));
}
```

`video/public/frames/manifest.json` (placeholder values are allowed ONLY here and only until Task 7 overwrites the file; `developCommit` marks them):

```json
{
  "guests": "150",
  "pricePerGuest": "$95.00",
  "foodCostPct": "00.0%",
  "deposit": "$3,500.00",
  "revenue": "$14,250.00",
  "displayPrice": "$49/month",
  "trialDays": "15",
  "developCommit": "PENDING-CAPTURE",
  "capturedOn": "2026-10-05"
}
```

- [ ] **Step 4: Run tests**

Run: `cd video && npm test`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add video/src/manifest.ts video/src/film.ts video/src/film.test.ts video/public/frames/manifest.json
git commit -m "feat(video): captions as data, figures resolved from the capture manifest"
```

### Task 3: Brand tokens, fonts and elements

**Files:**
- Create: `video/src/tokens.ts`, `video/src/fonts.ts`, `video/src/elements/{Caption,ChapterCard,Screen,Highlight,PhoneFrame,SplitScreen,EndCard}.tsx`, `video/src/useManifest.ts`
- Modify: `video/src/Root.tsx`

**Interfaces:**
- Consumes: `Manifest`, `ManifestSchema` (Task 2).
- Produces (all named exports, all accept optional `style?: React.CSSProperties`):
  - `C` colour map, `TYPE` sizes from `tokens.ts`; `FONT_BODY`, `FONT_DISPLAY` from `fonts.ts`
  - `<Caption text={string} />` lower-third, ≥ 44 px
  - `<ChapterCard question={string} />` Fraunces italic on cream, amber rule (homepage quote style)
  - `<Screen src={string} focus?={{x:number;y:number;scale:number}} />` still image with frame-driven push-in; renders a labelled "frame pending: <file>" slate when the file is missing
  - `<Highlight x y width height />` green ring, document-percent coordinates
  - `<PhoneFrame>{children}</PhoneFrame>` 390-wide phone at 2× scale
  - `<SplitScreen left={ReactNode} right={ReactNode} />`
  - `<EndCard displayPrice trialDays />`
  - `useManifest(): Manifest | null` (loads `staticFile('frames/manifest.json')` with `delayRender`, Zod-parsed)

- [ ] **Step 1: Tokens and fonts**

`video/src/tokens.ts` (values copied from `src/styles/global.css` `@theme`; keep in step with it):

```ts
export const C = {
  ink: '#1f2421',
  inkSoft: '#49524c',
  green: '#2f7d5b',
  greenDeep: '#256549',
  amber: '#b9762a',
  amberDeep: '#8f5716',
  paper: '#fdfefd',
  offwhite: '#f4f6f4',
  cream: '#faf5ea',
  ticketRule: '#e4d3b4',
  hairline: '#d3ddd6',
} as const;

// 1080p sizes. Captions must stay readable when the film plays 390 px wide.
export const TYPE = {caption: 48, chapter: 72, title: 96, endPrice: 64, small: 36} as const;
```

`video/src/fonts.ts`:

```ts
import {loadFont as loadFraunces} from '@remotion/google-fonts/Fraunces';
import {loadFont as loadInstrumentSans} from '@remotion/google-fonts/InstrumentSans';

export const {fontFamily: FONT_DISPLAY} = loadFraunces('italic', {weights: ['400', '600'], subsets: ['latin']});
export const {fontFamily: FONT_BODY} = loadInstrumentSans('normal', {weights: ['400', '600'], subsets: ['latin']});
```

- [ ] **Step 2: `useManifest` and `Screen` (with the pending slate)**

`video/src/useManifest.ts`:

```ts
import {useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';
import {ManifestSchema, type Manifest} from './manifest';

export function useManifest(): Manifest | null {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [handle] = useState(() => delayRender('manifest'));
  useEffect(() => {
    fetch(staticFile('frames/manifest.json'))
      .then((r) => r.json())
      .then((json: unknown) => setManifest(ManifestSchema.parse(json)))
      .finally(() => continueRender(handle));
  }, [handle]);
  return manifest;
}
```

`video/src/elements/Screen.tsx`:

```tsx
import type React from 'react';
import {useEffect, useState} from 'react';
import {CanvasImage, Easing, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, TYPE} from '../tokens';
import {FONT_BODY} from '../fonts';

type Props = {src: string; focus?: {x: number; y: number; scale: number}; style?: React.CSSProperties};

export const Screen: React.FC<Props> = ({src, focus, style}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const [exists, setExists] = useState<boolean | null>(null);
  const [handle] = useState(() => delayRender(`frame ${src}`));
  useEffect(() => {
    fetch(staticFile(`frames/${src}`), {method: 'HEAD'})
      .then((r) => setExists(r.ok))
      .finally(() => continueRender(handle));
  }, [src, handle]);

  if (exists === false) {
    return (
      <div style={{position: 'absolute', inset: 80, display: 'grid', placeItems: 'center', border: `4px dashed ${C.amber}`, color: C.amberDeep, fontFamily: FONT_BODY, fontSize: TYPE.small, ...style}}>
        frame pending: {src}
      </div>
    );
  }
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', backgroundColor: C.offwhite, ...style}}>
      <CanvasImage
        src={staticFile(`frames/${src}`)}
        premountFor={fps}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          transformOrigin: focus ? `${focus.x}% ${focus.y}%` : '50% 50%',
          scale: interpolate(frame, [0, durationInFrames], [1, focus?.scale ?? 1.04], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      />
    </div>
  );
};
```

- [ ] **Step 3: The other elements**

`video/src/elements/Caption.tsx`:

```tsx
import type React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, TYPE} from '../tokens';
import {FONT_BODY} from '../fonts';

export const Caption: React.FC<{text: string; style?: React.CSSProperties}> = ({text, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div
      style={{
        position: 'absolute', left: 120, right: 120, bottom: 72, padding: '24px 36px', maxWidth: 1400,
        backgroundColor: C.paper, color: C.ink, borderLeft: `8px solid ${C.green}`, borderRadius: 12,
        fontFamily: FONT_BODY, fontSize: TYPE.caption, lineHeight: 1.3, fontWeight: 600,
        boxShadow: '0 1px 2px rgb(31 36 33 / 0.06), 0 10px 28px rgb(31 36 33 / 0.08)',
        opacity: interpolate(frame, [0, 0.4 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)}),
        translate: interpolate(frame, [0, 0.4 * fps], ['0px 24px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)}),
        ...style,
      }}
    >
      {text}
    </div>
  );
};
```

`video/src/elements/ChapterCard.tsx`:

```tsx
import type React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, TYPE} from '../tokens';
import {FONT_DISPLAY} from '../fonts';

export const ChapterCard: React.FC<{question: string; style?: React.CSSProperties}> = ({question, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{position: 'absolute', inset: 0, backgroundColor: C.cream, display: 'grid', placeItems: 'center', ...style}}>
      <div style={{borderLeft: `8px solid ${C.amber}`, paddingLeft: 48, maxWidth: 1400}}>
        <p
          style={{
            margin: 0, fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontSize: TYPE.chapter, lineHeight: 1.15, color: C.ink,
            opacity: interpolate(frame, [0, 0.5 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)}),
            translate: interpolate(frame, [0, 0.5 * fps], ['0px 20px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)}),
          }}
        >
          “{question}”
        </p>
      </div>
    </div>
  );
};
```

`video/src/elements/Highlight.tsx`:

```tsx
import type React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../tokens';

// Coordinates are percentages of the Screen box, so a re-captured frame of the
// same layout keeps its ring without re-measuring pixels.
type Props = {x: number; y: number; width: number; height: number; style?: React.CSSProperties};

export const Highlight: React.FC<Props> = ({x, y, width, height, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div
      style={{
        position: 'absolute', left: `${x}%`, top: `${y}%`, width: `${width}%`, height: `${height}%`,
        border: `6px solid ${C.green}`, borderRadius: 16,
        opacity: interpolate(frame, [0, 0.3 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        scale: interpolate(frame, [0, 0.4 * fps], [1.15, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1), output: 'perceptual-scale'}),
        ...style,
      }}
    />
  );
};
```

`video/src/elements/PhoneFrame.tsx`:

```tsx
import type React from 'react';
import {C} from '../tokens';

export const PhoneFrame: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{position: 'relative', width: 460, height: 940, borderRadius: 56, padding: 14, backgroundColor: C.ink, boxShadow: '0 1px 2px rgb(31 36 33 / 0.08), 0 24px 60px rgb(31 36 33 / 0.18)', ...style}}>
    <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 44, overflow: 'hidden', backgroundColor: C.paper}}>{children}</div>
  </div>
);
```

`video/src/elements/SplitScreen.tsx`:

```tsx
import type React from 'react';
import {C} from '../tokens';

export const SplitScreen: React.FC<{left: React.ReactNode; right: React.ReactNode; style?: React.CSSProperties}> = ({left, right, style}) => (
  <div style={{position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1.45fr 1fr', gap: 48, padding: 72, backgroundColor: C.offwhite, ...style}}>
    <div style={{position: 'relative', borderRadius: 16, overflow: 'hidden', backgroundColor: C.paper}}>{left}</div>
    <div style={{position: 'relative', display: 'grid', placeItems: 'center'}}>{right}</div>
  </div>
);
```

`video/src/elements/EndCard.tsx`:

```tsx
import type React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, TYPE} from '../tokens';
import {FONT_BODY, FONT_DISPLAY} from '../fonts';

export const EndCard: React.FC<{displayPrice: string; trialDays: string; style?: React.CSSProperties}> = ({displayPrice, trialDays, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fade = interpolate(frame, [0, 0.5 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)});
  return (
    <div style={{position: 'absolute', inset: 0, backgroundColor: C.paper, display: 'grid', placeItems: 'center', opacity: fade, ...style}}>
      <div style={{textAlign: 'center', color: C.ink}}>
        <div style={{fontFamily: FONT_DISPLAY, fontSize: TYPE.title, fontStyle: 'normal'}}>CostCook</div>
        <div style={{fontFamily: FONT_BODY, fontSize: TYPE.endPrice, marginTop: 24}}>{displayPrice}, per kitchen</div>
        <div style={{fontFamily: FONT_BODY, fontSize: TYPE.small, marginTop: 16, color: C.inkSoft}}>{trialDays}-day free trial · costcook.io</div>
      </div>
    </div>
  );
};
```

- [ ] **Step 4: Register an Elements folder and check stills**

Replace `video/src/Root.tsx` with:

```tsx
import {Composition, Folder} from 'remotion';
import {Caption} from './elements/Caption';
import {ChapterCard} from './elements/ChapterCard';
import {EndCard} from './elements/EndCard';

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="Elements">
      <Composition id="Caption" component={Caption} width={1920} height={1080} fps={30} durationInFrames={60} defaultProps={{text: 'Prices and quantities freeze.'}} />
      <Composition id="ChapterCard" component={ChapterCard} width={1920} height={1080} fps={30} durationInFrames={60} defaultProps={{question: 'What do I charge a head?'}} />
      <Composition id="EndCard" component={EndCard} width={1920} height={1080} fps={30} durationInFrames={90} defaultProps={{displayPrice: '$49/month', trialDays: '15'}} />
    </Folder>
  </>
);
```

Run: `cd video && npm run typecheck` → Expected: no errors.
Run: `npx remotion still ChapterCard out/chapter.png --frame=45` and `npx remotion still EndCard out/end.png --frame=60`
Expected: PNGs written; open both with the Read tool and check: Fraunces italic question on cream with amber rule; end card centred, no clipped text.

- [ ] **Step 5: Commit**

```bash
git add video/src
git commit -m "feat(video): brand tokens, fonts and the seven film elements"
```

### Task 4: Scenes and the PromoFilm composition

**Files:**
- Create: `video/src/scenes/{ColdOpen,Charge,Proposal,Deposit,Buy,Invoices,Close}.tsx`, `video/src/PromoFilm.tsx`, `video/scripts/render-check.mjs`
- Modify: `video/src/Root.tsx`

**Interfaces:**
- Consumes: `FILM`, `captionsFor`, `SceneId` (Task 2); every element and `useManifest` (Task 3).
- Produces: compositions `PromoFilm` (2640 frames) and one per scene in a `Scenes` folder; `video/src/site.ts` re-exporting `displayPrice`/`trialDays` from the landing's `src/lib/site.ts` is NOT used (Remotion's bundler cannot read Astro's `import.meta.env`); the end card reads them from the manifest, which Task 7 fills from `src/lib/site.ts`.

Scene lengths (frames at 30 fps): coldOpen 180, charge 420, proposal 480, deposit 480, buy 360, invoices 300, close 420 (end card from frame 300). Transitions: `fade()` 15 frames between scenes, 6 transitions, so total = 2640 − 90 = **2550** frames (85 s). Use 2550 as `PromoFilm` duration.

- [ ] **Step 1: One scene file (Charge) as the shape every scene follows**

`video/src/scenes/Charge.tsx`:

```tsx
import {Sequence, useVideoConfig} from 'remotion';
import {Caption} from '../elements/Caption';
import {ChapterCard} from '../elements/ChapterCard';
import {Highlight} from '../elements/Highlight';
import {Screen} from '../elements/Screen';
import {FILM, captionsFor} from '../film';
import {useManifest} from '../useManifest';

export const Charge: React.FC = () => {
  const {fps} = useVideoConfig();
  const manifest = useManifest();
  if (!manifest) return null;
  const [caption] = captionsFor('charge', manifest);
  return (
    <>
      <Sequence name="Chapter" durationInFrames={2 * fps} premountFor={fps}>
        <ChapterCard question={FILM.charge.chapter ?? ''} />
      </Sequence>
      <Sequence name="Pricing panel" from={2 * fps} premountFor={fps}>
        <Screen src={FILM.charge.frames[0]} focus={{x: 50, y: 40, scale: 1.12}} />
        <Sequence name="Food cost ring" from={2 * fps} premountFor={fps}>
          <Highlight x={36} y={30} width={26} height={24} />
        </Sequence>
        <Sequence name="Caption" from={fps} premountFor={fps}>
          <Caption text={caption} />
        </Sequence>
      </Sequence>
    </>
  );
};
```

The ring coordinates are first guesses; Step 4 adjusts them against the real frame.

- [ ] **Step 2: The other six scenes**

Write each with the same structure (chapter card 2 s when `FILM[id].chapter` is not null, then frames, then captions in order):

`ColdOpen.tsx`: title "Know what the job makes before you cook it." in Fraunces 96 px on cream for 2 s (no ChapterCard; a plain `<div>` styled like ChapterCard without quotes), then `<PhoneFrame><Screen src="events-inquiry-mobile.png" focus={{x:50,y:30,scale:1.06}} /></PhoneFrame>` centred on `C.offwhite`, caption 0 from 2.5 s.

`Proposal.tsx`: ChapterCard 2 s, then `<SplitScreen left={<Screen src="events-proposal-sent-desktop.png" />} right={<PhoneFrame><Screen src="events-offer-mobile.png" focus={{x:50,y:92,scale:1.08}} /></PhoneFrame>} />`; caption 0 at 3 s, caption 1 at 9 s; `Highlight` on the Accept proposal button inside the PhoneFrame from 9 s.

`Deposit.tsx`: ChapterCard 2 s; 2–7 s SplitScreen (`events-payment-request-desktop.png` | PhoneFrame `events-pay-mobile.png`) with caption 0; 7–10 s `events-payments-paid-desktop.png`; 10–13 s `events-balance-reminder-email.png` with caption 1; 13–16 s `events-confirm-desktop.png` with caption 2 then caption 3 at 14.5 s, `Highlight` on Confirm order.

`Buy.tsx`: ChapterCard 2 s, `events-shop-desktop.png` with `focus={{x:50,y:20,scale:1.1}}`, caption 0 at 3 s.

`Invoices.tsx`: ChapterCard 2 s, `events-import-review-desktop.png`, caption 0 at 3 s.

`Close.tsx`: 0–10 s `events-pricing-desktop.png` with the same `Highlight` as Charge and caption 0 at 1 s; from 10 s `<EndCard displayPrice={manifest.displayPrice} trialDays={manifest.trialDays} />`.

Every `<Sequence>` gets `name` and `premountFor={fps}`.

- [ ] **Step 3: PromoFilm and registrations**

`video/src/PromoFilm.tsx`:

```tsx
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {useVideoConfig} from 'remotion';
import {Buy} from './scenes/Buy';
import {Charge} from './scenes/Charge';
import {Close} from './scenes/Close';
import {ColdOpen} from './scenes/ColdOpen';
import {Deposit} from './scenes/Deposit';
import {Invoices} from './scenes/Invoices';
import {Proposal} from './scenes/Proposal';

export const PromoFilm: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence name="Cold open" durationInFrames={180} premountFor={fps}><ColdOpen /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
      <TransitionSeries.Sequence name="What do I charge a head" durationInFrames={420} premountFor={fps}><Charge /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
      <TransitionSeries.Sequence name="Proposal" durationInFrames={480} premountFor={fps}><Proposal /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
      <TransitionSeries.Sequence name="Deposit" durationInFrames={480} premountFor={fps}><Deposit /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
      <TransitionSeries.Sequence name="Buy" durationInFrames={360} premountFor={fps}><Buy /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
      <TransitionSeries.Sequence name="Invoices" durationInFrames={300} premountFor={fps}><Invoices /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
      <TransitionSeries.Sequence name="Close" durationInFrames={420} premountFor={fps}><Close /></TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
```

In `Root.tsx` add a `<Folder name="Scenes">` with one `<Composition>` per scene (ids `ColdOpen`, `Charge`, `Proposal`, `Deposit`, `Buy`, `Invoices`, `Close`; durations as listed above; 1920×1080, 30 fps) and, outside the folders, `<Composition id="PromoFilm" component={PromoFilm} width={1920} height={1080} fps={30} durationInFrames={2550} />`.

- [ ] **Step 4: Render guard and stills**

`video/scripts/render-check.mjs`:

```js
// Refuses a render while any frame the film names is missing, or the manifest
// still carries the pre-capture placeholder. A film with a "frame pending"
// slate or a 00.0% figure must never leave this folder.
import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const root = resolve(import.meta.dirname, '..');
const film = readFileSync(resolve(root, 'src/film.ts'), 'utf8');
const frames = [...new Set([...film.matchAll(/'([a-z0-9-]+\.png)'/g)].map((m) => m[1]))];
const missing = frames.filter((f) => !existsSync(resolve(root, 'public/frames', f)));
const manifest = JSON.parse(readFileSync(resolve(root, 'public/frames/manifest.json'), 'utf8'));
const problems = [
  ...missing.map((f) => `missing frame ${f}`),
  ...(manifest.developCommit === 'PENDING-CAPTURE' ? ['manifest is the pre-capture placeholder'] : []),
];
if (problems.length) {
  console.error(`render check failed:\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log(`render check passed: ${frames.length} frames, develop ${manifest.developCommit}`);
```

Copy the frames that already exist: `cp ../public/proof/events-inquiry-mobile.png ../public/proof/events-offer-mobile.png ../public/proof/events-confirm-desktop.png public/frames/`.

Run: `npm run render:check` → Expected: FAIL listing the eight new frames and the placeholder manifest (proves the guard).
Run: `npm run typecheck && npm test` → Expected: PASS.
In Studio, step through `PromoFilm`; then `npx remotion still PromoFilm out/s-<n>.png --frame=<f>` for frames 100, 400, 800, 1300, 1700, 2000, 2400. Read each PNG: captions inside 120 px side margins, no text overflow, pending slates where frames are missing, Fraunces on chapter cards.

- [ ] **Step 5: Commit**

```bash
git add video/src video/scripts video/public/frames/*.png
git commit -m "feat(video): seven scenes, the PromoFilm timeline and the render guard"
```

### Task 5: Claims-check block for the film

**Files:**
- Modify: `scripts/check-landing-claims.mjs` (insert before the final `if (failures.length > 0)` block)

**Interfaces:**
- Consumes: `video/src/film.ts` (as text), `video/public/frames/manifest.json`, `docs/release-claim-ledger.md`.

- [ ] **Step 1: Add the block**

```js
// 2026-10-05 PROMO VIDEO. The film's captions are public copy: same ledger,
// same house rules. Read as text so this check needs no TypeScript build.
{
	const film = await read('video/src/film.ts');
	// Every quoted string in film.ts; imports and scene ids ride along harmlessly.
	const captions = [...film.matchAll(/'([^'\n]+)'|"([^"\n]+)"/g)]
		.map((m) => m[1] ?? m[2])
		.filter((t) => !/\.png$/.test(t));
	const text = captions.join('\n');
	if (/[—–]/.test(text)) failures.push('promo video: a caption carries an em or en dash');
	if (/!/.test(text)) failures.push('promo video: a caption carries an exclamation point');
	for (const banned of [/no typing/i, /nothing re-?keyed/i, /fully automatic/i, /seamless/i, /in one click/i, /invoice email/i, /closeout/i, /signature/i]) {
		if (banned.test(text)) failures.push(`promo video: banned phrase ${banned}`);
	}
	const snap = 'Her yes is not a booking. Confirm order is.';
	requireText(film, snap, 'promo video snap line');
	const beforeSnap = film.slice(0, film.indexOf(snap));
	if (/\bbook(ed|ing)?\b/i.test(beforeSnap.replace(/\/\/.*$/gm, ''))) failures.push('promo video: "book/booked/booking" before Confirm order (RC-61)');
	for (const button of film.matchAll(/(Accept proposal|Ask for changes|Decline|Sign|Approve)/g)) {
		if (!['Accept proposal', 'Ask for changes'].includes(button[1])) failures.push(`promo video: client button "${button[1]}" is not one of the two captured (RC-63)`);
	}
	if (/\$\d|\d+(\.\d+)?%/.test(text)) failures.push('promo video: a figure is typed into a caption; use a {token} from the manifest');
	const manifest = JSON.parse(await read('video/public/frames/manifest.json'));
	const pricing = await read('src/lib/site.ts');
	if (manifest.developCommit !== 'PENDING-CAPTURE' && !pricing.includes(`trialDays: ${manifest.trialDays}`)) {
		failures.push(`promo video: manifest trialDays ${manifest.trialDays} disagrees with src/lib/site.ts`);
	}
	if (/closeout|sign/.test([...film.matchAll(/'([a-z0-9-]+\.png)'/g)].map((m) => m[1]).join(' '))) {
		failures.push('promo video: a closeout or signing frame is in the film (RC-69 / RC-64)');
	}
}
```

- [ ] **Step 2: Prove it fails**

Temporarily change the Prices caption in `video/src/film.ts` to `'Prices and quantities freeze — booked!'`.
Run: `node scripts/check-landing-claims.mjs`
Expected: exit 1 listing the dash, the exclamation point and (if placed before the snap line) RC-61.
Revert the caption.

- [ ] **Step 3: Prove it passes**

Run: `node scripts/check-landing-claims.mjs`
Expected: `Landing claim ledger and public-copy guard passed.`

- [ ] **Step 4: Commit**

```bash
git add scripts/check-landing-claims.mjs
git commit -m "test(claims): hold the promo film's captions to the ledger"
```

---

## Phase B: capture from develop (starts when offer-walk-fixes is in develop)

### Task 6: Stand up develop with Stripe test mode, the ordering app, Mailpit and the real import reader

No repo files change; this task ends with a verified running stack and its notes.

- [ ] **Step 1: Gate on the merge**

```bash
git -C ~/kitchen-brain fetch -q
git -C ~/kitchen-brain merge-base --is-ancestor fix/offer-walk-fixes-2026-10-05 develop && echo MERGED || echo "NOT MERGED: stop and tell the owner"
git -C ~/kitchen-brain log -1 --format='%H %ad' --date=iso develop
```

Expected: `MERGED`. Record the develop SHA; it goes in the manifest and the ledger.

- [ ] **Step 2: Export develop and seed the events world**

Follow the header of `scripts/capture-events-proof.mjs` (lines 33–62) with these substitutions: `git archive develop` instead of `origin/main`; a new scratch dir under the session scratchpad; `IMPORT_AI_PROVIDER=google` and `GOOGLE_GENERATIVE_AI_API_KEY="$GOOGLE_GEN_AI"` (key lives in `~/.zshenv`) instead of `IMPORT_AI_PROVIDER=stub`; append the Stripe variables by sourcing `~/kitchen-brain-develop-demo/.env.stripe.local` (never print it); set `CRON_SECRET=demo-only-cron` and `KITCHEN_BRAIN_APP_ORIGIN=http://localhost:4188`. Rename the kitchen to Harbor & Hearth Catering exactly as the header says. Start Mailpit: `docker run -d --name costcook-promo-mailpit -p 8025:8025 -p 1025:1025 axllent/mailpit`.

- [ ] **Step 3: Ordering app and Stripe listener**

Start `apps/ordering` from the same export with its own dev/preview script on port 4189, `ORDERING_APP_ORIGIN=http://localhost:4189` in the main app's env. Start `~/.local/bin/stripe listen --api-key "$STRIPE_SECRET_KEY" --forward-to localhost:4188/api/auth/stripe/webhook --forward-connect-to localhost:4188/api/ordering/v1/payments/stripe/webhook` detached; put its `whsec_` into the app env as `STRIPE_WEBHOOK_SECRET` / the ordering webhook secret, then restart the app.

- [ ] **Step 4: Verify the stack**

- `curl -s -o /dev/null -w '%{http_code}' http://localhost:4188/login` → `200`
- `curl -s -o /dev/null -w '%{http_code}' http://localhost:4189/` → `200` or `404` (app up)
- Sign in as the owner in a browser tab, open Settings > Business profile, write Payment instructions "Card through the link, or a check to Harbor & Hearth Catering." (autosaves "All changes saved"), and connect Stripe test mode from Settings (Connect Stripe) so the card rail is offered on the event deposit.
- Upload any one-page PDF on `/import?kind=invoice` and confirm the review screen appears (real reader works); then re-seed (the walk refuses a used database).

### Task 7: Capture script: develop, new date, eight new frames, manifest

**Files:**
- Modify: `scripts/capture-events-proof.mjs`
- Create: `scripts/fixtures/harbor-produce-invoice.pdf` (generated in Step 2), `video/scripts/copy-frames.mjs`

**Interfaces:**
- Produces: `public/proof/events-*.png` (re-shot + new), `public/proof/events-manifest.json` matching `ManifestSchema`, mirrored into `video/public/frames/`.

- [ ] **Step 1: Header, date and FORBIDDEN**

- Header: replace the "production origin/main" paragraph with "kitchen-brain develop, exported clean with git archive (owner ruling 2026-10-05: marketing frames come from develop). Record the commit in events-manifest.json."
- `EVENT.date`: the Saturday about two weeks after the shoot day (e.g. shooting 2026-10-07 → `'2026-10-24'`). Update every alt/copy in `src/lib/proof.ts` and the events page that names "October 10" in the same commit (`grep -rn "October 10" src` lists them).
- `FORBIDDEN`: add `/This test site only emails/`, `/\bstub\b/i`.
- Add near the top: `const DEVELOP_COMMIT = process.env.DEVELOP_COMMIT ?? ''; if (!/^[0-9a-f]{7,40}$/.test(DEVELOP_COMMIT)) throw new Error('DEVELOP_COMMIT=<sha of the exported develop> is required');` and `const figures = {};`.

- [ ] **Step 2: The sample invoice**

Generate a one-page PDF from HTML with the same Chromium (no new dependency): supplier "Harbor Produce Co.", invoice no. "HP-20417", five lines that appear on this wedding's shop list (read them off the shop frame in Step 6 first: take the first five ingredient names under the produce supplier group), plausible pack sizes and prices, a total. Save as `scripts/fixtures/harbor-produce-invoice.pdf` and commit it (a fixture, not a claim; the review frame shows what the real reader made of it).

```js
async function makeInvoicePdf(lines) {
	const page = await browser.newPage();
	const rows = lines.map((l) => `<tr><td>${l.name}</td><td>${l.pack}</td><td>${l.qty}</td><td>$${l.price.toFixed(2)}</td></tr>`).join('');
	await page.setContent(`<html><body style="font:14px Helvetica;padding:48px"><h1>Harbor Produce Co.</h1><p>Invoice HP-20417 · Bill to Harbor &amp; Hearth Catering</p><table border="1" cellpadding="6" style="border-collapse:collapse;width:100%"><tr><th>Item</th><th>Pack</th><th>Qty</th><th>Price</th></tr>${rows}</table></body></html>`);
	await page.pdf({path: resolve(import.meta.dirname, 'fixtures/harbor-produce-invoice.pdf'), format: 'Letter'});
	await page.close();
}
```

- [ ] **Step 3: Proposal-sent frame (after `waitForURL(/\/decision/)`, before Copy offer link)**

```js
	{
		await page.getByRole('list', { name: 'Offer tracking' }).getByText('Sent', { exact: true }).waitFor();
		const card = page.locator('main section').filter({ has: page.getByRole('heading', { name: 'Current offer' }) });
		const title = page.getByRole('heading', { level: 1, name: /^Waiting on / });
		const box = await union([title, card], 0);
		await shoot(page, 'events-proposal-sent-desktop', { x: box.x - 24, y: box.y - 24, width: box.width + 48, height: box.height + 48 });
	}
```

(The page is at 1440 here; `Current offer` is `lg:block`.)

- [ ] **Step 4: Pricing frame (right after the kitchen-draft frame)**

```js
	const orderHrefForPricing = await draft.getByRole('link', { name: 'Open the kitchen draft', exact: true }).getAttribute('href');
	await page.goto(`${APP}${orderHrefForPricing}?tab=shop`);
	await hydrate(page);
	{
		const panel = page.getByRole('region', { name: 'Order financial summary' });
		await panel.waitFor();
		figures.pricePerGuest = `$${await page.locator('#perGuestPrice').inputValue()}`;
		figures.guests = await page.locator('#guestCount').inputValue();
		figures.foodCostPct = (await panel.locator('.cost-reading strong').first().innerText()).trim();
		const b = await docBox(panel);
		await shoot(page, 'events-pricing-desktop', { x: b.x - 24, y: b.y - 24, width: b.r - b.x + 48, height: b.b - b.y + 48 });
	}
	await page.goto(eventUrl);
	await hydrate(page);
```

- [ ] **Step 5: Card-rail deposit, request, pay, paid, reminder (replaces the old step 5 "deposit asked")**

Keep the two lines after the old step 5 that set `orderHref` and `orderId`; the confirm, calendar and closeout steps use them. The closeout step stays as it is (its frame is not in the film).

```js
	await draft.getByLabel('Deposit amount').fill(EVENT.deposit);
	const cardRail = draft.getByRole('radio', { name: /card/i });
	await cardRail.check({ force: true });
	if (!(await cardRail.isChecked())) throw new Error('the card rail did not select; is Stripe connected in test mode?');
	await draft.getByRole('button', { name: 'Ask for a deposit', exact: true }).click();
	await draft.locator('[data-ui-role="payment-request"]').first().waitFor();
	await page.reload();
	await hydrate(page);
	await draft.getByRole('button', { name: /^Request payment/ }).first().click();
	await draft.getByRole('status').filter({ hasText: /Sent to|Going out to/ }).waitFor();
	figures.deposit = (await draft.getByText(/^\$[\d,]+\.\d{2}$/).first().innerText()).trim();
	{
		const heading = draft.getByRole('heading', { name: 'Deposit', exact: true });
		const list = draft.getByRole('list', { name: 'Payments to request' });
		const box = await union([heading, list], 24);
		await shoot(page, 'events-payment-request-desktop', box);
	}
	// The client's link, from the email Mailpit caught.
	const payUrl = await (async () => {
		for (let i = 0; i < 40; i += 1) {
			const list = await (await fetch('http://localhost:8025/api/v1/search?query=' + encodeURIComponent(`to:${EVENT.email}`))).json();
			for (const m of list.messages ?? []) {
				const msg = await (await fetch(`http://localhost:8025/api/v1/message/${m.ID}`)).json();
				const hit = (msg.Text ?? '').match(/Pay here: (\S+)/);
				if (hit) return hit[1];
			}
			await page.waitForTimeout(500);
		}
		throw new Error('no payment-request email with a pay link reached Mailpit');
	})();
	{
		const client = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
		const cp = await client.newPage();
		await cp.goto(payUrl);
		await hydrate(cp);
		await cp.getByRole('heading', { name: 'Pay what you agreed' }).waitFor();
		await shoot(cp, 'events-pay-mobile', { x: 0, y: 0, width: 390, height: 844 }, { fullPage: false });
		await cp.getByRole('button', { name: /^Pay \$/ }).click();
		// Stripe test checkout. If the pay page embeds the Payment Element
		// instead of redirecting, fill the iframe fields with the same values.
		await cp.waitForURL(/checkout\.stripe\.com|\/pay\//, { timeout: 30_000 });
		if (cp.url().includes('checkout.stripe.com')) {
			await cp.locator('#email').fill(EVENT.email).catch(() => {});
			await cp.locator('#cardNumber').fill('4242 4242 4242 4242');
			await cp.locator('#cardExpiry').fill('12 / 34');
			await cp.locator('#cardCvc').fill('123');
			await cp.locator('#billingName').fill(EVENT.client);
			await cp.locator('#billingPostalCode').fill('04101').catch(() => {});
			await cp.getByTestId('hosted-payment-submit-button').click();
		}
		await cp.getByText('Payment received.', { exact: false }).waitFor({ timeout: 60_000 });
		await client.close();
	}
	// Money tab after the webhook.
	await page.goto(`${APP}${orderHrefForPricing}?tab=money`);
	await hydrate(page);
	{
		const card = page.locator('#order-panel-money [data-ui-role="order-payments"]');
		await card.getByText(/paid/).first().waitFor({ timeout: 30_000 });
		const b = await docBox(card);
		await shoot(page, 'events-payments-paid-desktop', { x: b.x - 24, y: b.y - 24, width: b.r - b.x + 48, height: b.b - b.y + 48 });
		// The balance reminder: move the balance's due day to today through the
		// owner's own control, then run the daily digest the cron would run.
		const move = card.getByText('Move the due day', { exact: true });
		if ((await move.count()) === 0) throw new Error('no movable balance row: the accepted proposal carried no balance schedule; set payment terms with a balance in the proposal step');
		await move.first().click();
		await card.locator('input[name="balanceDueOn"]').first().fill(todayInKitchen());
		await card.getByRole('button', { name: 'Save due day' }).first().click();
		await page.waitForTimeout(1500);
		const r = await page.request.post(`${APP}/api/internal/notifications/digest`, { headers: { authorization: 'Bearer demo-only-cron' } });
		if (!r.ok()) throw new Error(`digest refused: ${r.status()}`);
	}
	{
		let id = null;
		for (let i = 0; i < 60 && !id; i += 1) {
			const list = await (await fetch('http://localhost:8025/api/v1/search?query=' + encodeURIComponent('subject:"balance is due"'))).json();
			id = list.messages?.[0]?.ID ?? null;
			if (!id) await page.waitForTimeout(1000);
		}
		if (!id) throw new Error('no balance-reminder email reached Mailpit');
		const mail = await browser.newPage({ viewport: { width: 640, height: 900 }, deviceScaleFactor: 2 });
		await mail.goto(`http://localhost:8025/view/${id}.html`);
		await shoot(mail, 'events-balance-reminder-email', { x: 0, y: 0, width: 640, height: Math.min(900, await mail.evaluate(() => document.body.scrollHeight)) });
		await mail.close();
	}
```

Before this step, the proposal step must set payment terms that include a balance (deposit now, balance before the event). On the branch the proposal's "tax and terms" step carries them; add the fill there and assert the offer page lists a balance. If `/digest` uses a different auth header than `Bearer`, read `integrationInternalAuthorized` in the export and match it.

- [ ] **Step 6: Shop frame (after Confirm order, before the calendar)**

```js
	await page.goto(`${APP}${orderHref}?tab=shop`);
	await hydrate(page);
	{
		const head = page.locator('.group-head').first();
		const lines = page.locator('[role="rowgroup"]').first();
		const box = await union([head, lines], 16);
		await shoot(page, 'events-shop-desktop', box);
	}
```

- [ ] **Step 7: Invoice review frame**

```js
	await page.goto(`${APP}/import?kind=invoice`);
	await hydrate(page);
	await page.setInputFiles('#import-source-files', resolve(import.meta.dirname, 'fixtures/harbor-produce-invoice.pdf'));
	await page.getByRole('article', { name: /harbor-produce-invoice/ }).getByText('Ready').waitFor({ timeout: 120_000 });
	await page.getByRole('button', { name: 'Extract sources' }).click();
	await page.waitForURL(/\/import\/[^/?]+$/, { timeout: 180_000 }).catch(async () => {
		await page.getByRole('article', { name: /harbor-produce-invoice/ }).getByRole('link', { name: 'Review' }).click();
	});
	await hydrate(page);
	{
		const h1 = page.getByRole('heading', { level: 1 });
		const table = page.getByRole('table').first();
		const box = await union([h1, table], 24);
		await shoot(page, 'events-import-review-desktop', box);
	}
```

The invoice review screen's heading and row names may differ from the price-sheet review the research read; if `getByRole('table')` finds none, clip the main column under the h1 and note the actual heading in the capture notes.

- [ ] **Step 8: Manifest**

Before `console.log(...frames written...)`:

```js
	const site = await (await import('node:fs/promises')).readFile(resolve(import.meta.dirname, '../src/lib/site.ts'), 'utf8');
	figures.displayPrice = site.match(/PUBLIC_LAUNCH_PRICE_DISPLAY\?\.trim\(\) \|\| '([^']+)'/)[1];
	figures.trialDays = site.match(/trialDays: (\d+)/)[1];
	figures.developCommit = DEVELOP_COMMIT;
	figures.capturedOn = todayInKitchen();
	await (await import('node:fs/promises')).writeFile(`${OUT}/events-manifest.json`, JSON.stringify(figures, null, 2) + '\n');
```

`revenue` is read off the confirm dialog: in the existing confirm step (step 6 of the walk), before clicking Confirm order, add `figures.revenue = (await confirm.getByText(/^\$[\d,]+\.\d{2}$/).last().innerText()).trim();`.

- [ ] **Step 9: Mirror into the video**

`video/scripts/copy-frames.mjs`:

```js
import {copyFile, readdir} from 'node:fs/promises';
import {resolve} from 'node:path';

const from = resolve(import.meta.dirname, '../../public/proof');
const to = resolve(import.meta.dirname, '../public/frames');
for (const f of await readdir(from)) {
	if (/^events-.*\.png$/.test(f)) await copyFile(resolve(from, f), resolve(to, f));
}
await copyFile(resolve(from, 'events-manifest.json'), resolve(to, 'manifest.json'));
console.log('frames and manifest copied');
```

Add `"frames": "node scripts/copy-frames.mjs"` to `video/package.json`.

- [ ] **Step 10: Run the walk**

```bash
DEVELOP_COMMIT=<sha from Task 6> APP=http://localhost:4188 DB=<scratch>/e2e/.scratch/demo.db KB_DIR=<scratch export> node scripts/capture-events-proof.mjs
cd video && npm run frames && npm run render:check && npm test
```

Expected: all frames written with no FORBIDDEN throw; `render check passed: 12 frames, develop <sha>`; tests pass. Open every new PNG with the Read tool: no "stub", no test-site line, Harbor & Hearth everywhere, October date matches `EVENT.date`.

- [ ] **Step 11: Commit**

```bash
git add scripts/capture-events-proof.mjs scripts/fixtures public/proof/events-* src/lib/proof.ts video/public/frames video/scripts/copy-frames.mjs video/package.json
git commit -m "feat(capture): the events walk from develop, card deposit to reminder, and the film's manifest"
```

### Task 8: Ledger, site copy and the events-page check

**Files:**
- Modify: `docs/release-claim-ledger.md` (RC-65 row and the never-claim line 124), any page copy naming the old date, `scripts/check-landing-claims.mjs` (comingPlanKeys `eventPayments` if the FAQ answer changes)

- [ ] **Step 1: RC-65**

Rewrite RC-65 to: requesting a deposit or balance by email, the client paying by card from the emailed link, and the balance reminder on the due day, as shipped on develop `<sha>`; evidence `public/proof/events-payment-request-desktop.png`, `events-pay-mobile.png`, `events-payments-paid-desktop.png`, `events-balance-reminder-email.png`; tier "develop (owner ruling 2026-10-05)". Remove the line-124 never-claim bullet. Leave the FAQ `event-payments` answer and `comingPlanKeys` alone unless the owner asks: the site's own copy change is a separate ruling. Note that in the row.

- [ ] **Step 2: Run every check**

Run: `node scripts/check-landing-claims.mjs && node scripts/check-events-proposals-page.mjs && npm run build`
Expected: all pass. If `check-events-proposals-page.mjs` pins a sentence the re-shoot changed (e.g. the date), update the page and the check together.

- [ ] **Step 3: Commit**

```bash
git add docs/release-claim-ledger.md src scripts
git commit -m "docs(ledger): RC-65 card deposits, pay links and the balance reminder, captured from develop"
```

---

## Phase C: sound and finish

### Task 9: Music bed and loudness

**Files:**
- Create: `video/public/audio/bed.wav` (generated), `video/public/audio/SOURCE.md`
- Modify: `video/src/PromoFilm.tsx`

- [ ] **Step 1: Generate the bed**

```bash
node scripts/demo-video/make-bed.mjs 86 video/public/audio/bed.wav
```

`video/public/audio/SOURCE.md`: "Generated by scripts/demo-video/make-bed.mjs (synthesised, no licence). Level is set by loudnorm after render, never by a gain figure."

- [ ] **Step 2: Add it to the film**

In `PromoFilm.tsx`, wrap the `TransitionSeries` in a fragment and add `<Audio src={staticFile('audio/bed.wav')} premountFor={fps} />` (import `Audio` from `@remotion/media` after `npx remotion add @remotion/media`; `staticFile` from `remotion`). Add a 1 s fade-out with `volume={(f) => interpolate(f, [2520, 2550], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}`.

- [ ] **Step 3: Verify in Studio, then commit**

Play `PromoFilm` in Studio with sound. Commit:

```bash
git add video/public/audio video/src/PromoFilm.tsx video/package.json
git commit -m "feat(video): the synthesised music bed"
```

### Task 10: Story revision, captions file and render (render only on the owner's word)

- [ ] **Step 1: Story Step 11 with real figures**

Re-read every caption with the manifest filled, beside its frame. Cut any caption the frame does not show at that moment. Update `docs/stories/promo-video.story.md` Step 11 with the final figures and the develop SHA.

- [ ] **Step 2: Captions as WebVTT**

`video/scripts/write-vtt.mjs` emits `out/promo.vtt` from `FILM` + manifest using the scene start frames from Task 4 (cold open 0, charge 165, proposal 570, deposit 1035, buy 1500, invoices 1845, close 2130; caption offsets as in each scene). Add `"vtt": "node --experimental-strip-types scripts/write-vtt.mjs"`.

- [ ] **Step 3: On the owner's explicit request only: render and level**

```bash
cd video && npm run render:check && npm run render
npx remotion ffmpeg -i out/promo.mp4 -af loudnorm=I=-23:TP=-2:LRA=7,aresample=48000 -c:v copy out/promo-leveled.mp4
npx remotion ffmpeg -i out/promo-leveled.mp4 -af ebur128=peak=true -f null - 2>&1 | tail -12
```

Expected: integrated loudness between -24 and -22 LUFS; true peak ≤ -2 dBFS. Then copy `out/promo-leveled.mp4` → `public/promo.mp4`, a still at frame 400 → `public/promo-poster.jpg`, `out/promo.vtt` → `public/promo.vtt`.

- [ ] **Step 4: Commit**

```bash
git add docs/stories/promo-video.story.md video/scripts/write-vtt.mjs video/package.json public/promo.*
git commit -m "feat(video): promo film rendered from develop <sha>, leveled to -23 LUFS"
```
