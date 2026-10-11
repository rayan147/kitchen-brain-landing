# CostCook search and AI discovery implementation plan

Date: 2026-10-10

Branch: `research/seo-ai-discovery-20261010` from `develop` (`ab176ed`)

Evidence: [SEO and AI discovery research](../research/seo-ai-discovery-2026-10-10.md)

## Outcome and scope

Make CostCook's public pages discoverable, indexable, clearly relevant to the right buyers, and useful enough to earn search traffic and AI citations. Measure qualified visits and trial/demo actions alongside search visibility. A number-one ranking or an assistant recommendation cannot be guaranteed.

Provisional audience: independent caterers in the US searching in English. Confirm geography, buyer, and priority query family with the owner before changing positioning or publishing new content. Candidate families to validate in Search Console: catering management software, catering food-cost software, catering recipe costing, and catering proposal software. These are research hypotheses, not measured demand.

The visitor workflow is search result → relevant guide or feature page → proof and pricing → trial or demo. Its current route shape is sufficient. No route or workflow restructuring is planned unless user or search data reveals a specific gap.

## Phase 0 — Establish the baseline

1. Check whether `https://costcook.io` is verified in Google Search Console and Bing Webmaster Tools. If access is unavailable, record the exact access needed; do not infer index coverage from `site:` searches.
2. Submit `https://costcook.io/sitemap-index.xml` in both tools. Inspect the homepage, `/features/`, `/pricing/`, `/blog/food-cost-per-guest/`, and one current product page for fetch status, index status, selected canonical, and rendered content.
3. Export the available 3-month baseline by page and query: impressions, clicks, click-through rate, average position, indexed pages, Bing AI citations, and ChatGPT referral visits. Record trial starts and demo bookings attributable to organic/referral traffic if analytics supports them.
4. Compare the live deployment with `develop` before editing: the live sitemap contains more articles and feature URLs than this branch. Identify the source of those live pages and avoid reverting them in a later merge.

**Exit:** a dated baseline and a verified list of actual crawl/index issues. Search Console/Bing access is the only external dependency for this phase.

## Phase 1 — Fix technical discovery and index intent

1. Pick one URL form. Align `src/layouts/Base.astro` canonicals, Astro sitemap output in `astro.config.mjs`, internal links, and Vercel redirects. Verify each representative URL has one preferred 200 response and the alternate resolves to it. Treat the current slash mismatch as signal cleanup, not a proven indexing cause.
2. Exclude `/contact/sent/`, `/contact/not-sent/`, `/demo/sent/`, and `/demo/not-sent/` from the sitemap and mark them `noindex`. Keep those pages and their no-JavaScript recovery/success flows usable. Do not block them in `robots.txt`, since crawlers need access to read `noindex`.
3. Verify `robots.txt`, HTTP responses, CDN/WAF behavior, and server logs for Googlebot, Bingbot, `OAI-SearchBot`, `Claude-SearchBot`, and `Claude-User`. Decide separately whether model-training crawlers `GPTBot` and `ClaudeBot` are permitted. Do not add bot rules merely for decoration if the existing allow-all policy works.
4. Validate the generated sitemap contains only intended canonical pages; provide `lastmod` only where it reflects actual changes. Consider IndexNow after the base indexing and canonical checks pass, especially for new or updated articles.

**Exit:** representative pages are fetchable and index-eligible; sitemap, canonicals, links, and redirects agree; utility states stay functional but are excluded from indexing. Run the repo build/postbuild checks and browser checks for affected routes at desktop and phone widths.

## Phase 2 — Clarify relevance and trust on existing pages

1. Use actual query data to choose one primary buyer intent per page. Review homepage, feature index, pricing, who-it's-for, comparison, and high-intent feature pages for descriptive titles, visible headings, first-screen explanation, internal links, and truthful product scope.
2. Distinguish `costcook.io` from the unrelated `costcook.app` in visible identity and factual organization data. Add `Organization` structured data on the homepage. Defer `SoftwareApplication` rich-result markup because Google also requires a genuine rating or review, which this repo does not have. Keep truthful `Article` markup; do not expand `FAQPage` markup as a ranking tactic.
3. Keep proof specific: actual product captures, sample calculations with assumptions, founder attribution, current pricing, and documented limits. Check every claim against `src/lib/features.ts` and `docs/release-claim-ledger.md` before publication.
4. For any new or rewritten prospect-facing copy, complete the `story-content` tracker and source pointer. Apply the route-family frontend workflow audit to changed pages, including semantic roles, error/recovery, success, mobile, and keyboard behavior.

**Exit:** each high-value page has a distinct buyer question and verifiable answer; schema matches visible content; build and browser verification pass. Do not rewrite a page solely to insert exact-match keywords.

## Phase 3 — Earn topic coverage and references

1. Compare query and conversion data with existing articles. Strengthen the best matching guides first: food cost per guest, case-to-portion cost, menu pricing, supplier invoice checks, and whole-pack shopping. Add firsthand examples or product evidence only where it answers an unresolved reader question.
2. Publish a small number of new guides only for genuine gaps. Each needs a clear question, original working or field experience, stated assumptions, source/author, related internal links, and a useful next step. Avoid near-duplicate pages for keyword variations.
3. Seek legitimate relevant references from partners, associations, customers, or industry publications when there is a real relationship and permission to cite it. Do not buy links, fabricate reviews, or claim endorsements.

**Exit:** each changed or new page has a named query intent, evidence source, story tracker, internal links, and a measurable trial/demo path. Review performance before commissioning the next set.

## Phase 4 — Measure and iterate

Review monthly by query family and landing page. Track index coverage and selected canonicals, Google/Bing impressions and clicks, Bing AI cited pages and grounding query groups, ChatGPT referrals, and qualified trial/demo conversions. Use the Google generative AI report if available. Record dates of releases and external changes; treat visibility trends as observational, not proof that one edit caused them.

After a few weeks, prioritize the largest verified constraint: crawl/index failures first, then pages with impressions but weak click-through or conversion, then uncovered buyer questions. Recheck product claims and prices whenever content is updated.

## Immediate work order

1. Obtain or confirm owner access to Search Console, Bing Webmaster Tools, and organic conversion analytics.
2. Reconcile live deployment versus `develop` so implementation starts from the actual published state.
3. Implement and verify canonical/sitemap/utility-page cleanup.
4. Choose the target market and query family from owner direction plus measured queries, then begin the page/content work.

## Implementation status — 2026-10-10

- The implementation branch now starts from `origin/develop` at `119df4a` and includes its 19 published guides. The production deployment checked on 2026-10-10 was `origin/main` at `1615d5e`. The branch carries only SEO changes relative to the current develop base.
- Phase 1 code is implemented: Vercel redirects trailing-slash variants to the slashless URLs already used by internal links; sitemap URLs match those canonicals; four form outcome routes are excluded from the sitemap and carry `noindex` while remaining usable. `scripts/check-seo.mjs` runs after every build.
- The first Phase 2 change is implemented: the homepage title names catering software, and factual `Organization` data identifies the brand and founder. `SoftwareApplication` rich-result markup is deferred because Google requires a real rating or review and the repo has no approved one.
- Production and `PUBLIC_NOINDEX=1` staging builds passed. `npm run check`, homepage browser verification, contact browser verification, and demo browser verification passed. The browser checks covered phone layouts, 200% text, reduced motion, focus, and no-JavaScript paths. The route exclusion rule is shared by sitemap generation and the build guard; the guard also rejects sitemap URLs without built indexable pages. The production redirect behavior still needs a live post-deployment check.
- Phase 0 search baselines remain unavailable: no connected Google Search Console or Bing Webmaster account is exposed here. Vercel's project API reports `web_analytics_not_enabled`, even though the site loads its analytics script in production. A Google Search Console connection has been suggested; no account action has been taken.
- Phases 3–4 depend on a selected market/query family and real search/conversion data. The current US-English independent-caterer target remains a provisional assumption.
