# Kitchen Brain — Landing

Marketing one-pager for [Kitchen Brain](https://app.costcook.io): back-of-house
software for small caterers and meal-prep businesses. Single goal: book 15-minute demos.

**Production:** https://costcook.io (the vercel.app hostname redirects)

## Stack

- [Astro](https://astro.build) (fully static output, no adapter)
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- Self-hosted fonts via Fontsource: Fraunces (display, with optical sizing) + Instrument Sans (body)
- Calendly inline embed, lazy-loaded; Vercel Web Analytics (cookieless)
- Hosted on Vercel — the GitHub repo is connected, so every merge to `main` deploys
  production automatically; PRs get preview deployments. Security headers (CSP etc.)
  live in `vercel.json`.

## Development

```sh
npm install
cp .env.example .env   # then set PUBLIC_CALENDLY_URL
npm run dev            # local dev server
npm run check          # astro check (types)
npm run build          # production build to dist/
```

Open Graph image: edit `scripts/og-card.html`, then `./scripts/make-og.sh`
(needs Chromium/Chrome on PATH) to regenerate `public/og.png`.

## Owner TODOs — swap these before real traffic

Everything below ships as a clearly-marked placeholder. Each also carries a
`TODO(owner)` comment at the exact spot in the code.

- [x] **Calendly link** — set to https://calendly.com/rayan361/kitchen-brain-demo (2026-07-13) — set `PUBLIC_CALENDLY_URL` to your real 15-minute event
      link in the Vercel project's env vars (all environments) and in local `.env`,
      then redeploy (the value is baked in at build time). Placeholder lives in
      `src/lib/site.ts`. Must be an `https://calendly.com/...` URL (build enforces it).
- [x] **Contact email** — rayan@costcook.io (2026-07-14).
- [ ] **Founder signature** — `founderName` in `src/lib/site.ts` (currently "Rayan"; confirm).
- [ ] **Analytics** — enable Web Analytics for the `kitchen-brain-landing` project in
      the Vercel dashboard (Project → Analytics → Enable). Until then the analytics
      script 404s harmlessly (it's the only console error on the page).
- [x] **Custom domain** — costcook.io live (2026-07-14); site.ts/astro.config/robots.txt
      updated. Optional follow-up: add Organization JSON-LD now that the domain and
      contact details are real.
- [ ] **OG image (optional)** — `public/og.png` is a real branded card, not a stub;
      swap only if you want photography instead. Regenerate via `scripts/make-og.sh`.

## QA snapshot (2026-07-14, production)

- Landing mobile: **99 perf / 100 a11y**; app login mobile: **100 perf / 100 a11y**
- Lighthouse desktop: **100 performance / 100 accessibility** / 96 best-practices / 100 SEO
  (best-practices ding = the expected analytics 404 above)
- All anchor targets present (`#what` `#why` `#chef` `#book`); assets, sitemap,
  robots 200; Calendly embed verified lazy (no third-party request until the
  booking section approaches); direct-link fallback works with JS disabled;
  WCAG 2.2 AA contrast verified across all surface/text token pairs; reduced
  motion honored for both motion registers; 320px-viewport reflow clean.
