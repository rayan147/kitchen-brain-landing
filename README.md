# CostCook — Landing

Marketing one-pager for [CostCook](https://app.costcook.io): back-of-house
software for small caterers and meal-prep businesses. Single goal: book 15-minute demos.

**Production:** https://costcook.io (the vercel.app hostname redirects)

## Stack

- [Astro](https://astro.build) (fully static output, no adapter)
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- Self-hosted fonts via Fontsource: Fraunces (display, with optical sizing) + Instrument Sans (body)
- Google Calendar appointment-schedule link; Vercel Web Analytics (cookieless)
- Hosted on Vercel — the GitHub repo is connected, so every merge to `main` deploys
  production automatically; PRs get preview deployments. Security headers (CSP etc.)
  live in `vercel.json`.

## Development

```sh
npm install
npm run dev            # local dev server
npm run check          # astro check (types)
npm run build          # production build to dist/
```

Open Graph image: edit `scripts/og-card.html`, then `./scripts/make-og.sh`
(needs Chromium/Chrome on PATH) to regenerate `public/og.png`.

## Owner TODOs — swap these before real traffic

Everything below ships as a clearly-marked placeholder. Each also carries a
`TODO(owner)` comment at the exact spot in the code.

- [x] **Google Calendar booking page** — owner-supplied link stored once in
      `src/lib/site.ts` and used by every booking CTA (2026-08-03).
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

## QA record

- 2026-07-14: Landing mobile: **99 perf / 100 a11y**; app login mobile:
  **100 perf / 100 a11y**. Lighthouse desktop: **100 performance / 100 accessibility** /
  96 best-practices / 100 SEO
  (best-practices ding = the expected analytics 404 above)
- 2026-08-03: All current anchor targets resolve. Every booking CTA opens the
  owner-supplied Google Calendar appointment page in a new tab, with no inline scheduler.
- 2026-08-04: Reordered the one-page visitor workflow so product proof follows the
  problem and costing chain, simplified the hero, clarified the linear chain, and
  combined founder trust with the final fit-check CTA. Product claims remain pinned
  to `docs/release-claim-ledger.md`.
