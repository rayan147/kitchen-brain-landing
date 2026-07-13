# Kitchen Brain — Landing

Marketing one-pager for [Kitchen Brain](https://kitchen-brain-two.vercel.app): back-of-house
software for small caterers and meal-prep businesses. Single goal: book 15-minute demos.

**Production:** https://kitchen-brain-landing.vercel.app

## Stack

- [Astro](https://astro.build) (fully static output, no adapter)
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- Self-hosted fonts via Fontsource: Fraunces (display) + Instrument Sans (body)
- Hosted on Vercel — the GitHub repo is connected, so every merge to `main` deploys
  production automatically; PRs get preview deployments.

## Development

```sh
npm install
npm run dev      # local dev server
npm run check    # astro check (types)
npm run build    # production build to dist/
```

## Owner TODOs

Grows as sections ship; final list lands with the QA issue.

- [ ] Swap the Calendly placeholder URL for the real 15-min event link (arrives with the booking-widget issue)
