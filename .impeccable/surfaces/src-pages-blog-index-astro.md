---
version: 1
slug: "src-pages-blog-index-astro"
primary_target: "src/pages/blog/index.astro"
related_targets: ["src/pages/blog/[slug].astro", "src/components/BlogPostRow.astro", "src/components/SiteNav.astro", "src/lib/site.ts", "src/content.config.ts", "docs/stories/blog.story.md"]
---

# Blog route-family surface brief

## Thesis

A working chef should leave with the number worked through, not another list of software opinions. Refuse the generic publication grid, stock-photo article cards, decorative article hero, floating table of contents, and product pitch disguised as instruction.

## Audience and job

The reader is an independent caterer, restaurant owner, or working chef-owner with a menu, guest count, supplier price, or quote decision already in front of them. They need to find the relevant kitchen question, inspect the arithmetic and its limits, and carry a defensible answer into the next job.

## Route-family workflow shape

This is a frequent, low-risk, information-dense read workflow with two complementary screens. The `/blog` index is deliberately denormalized for fast question selection: topic, reading time, title, description, and date remain comparable in one ruled list. Each `/blog/[slug]` route is deliberately normalized around one question and one reading sequence. Keep the index and article routes separate; no modal reader, tabbed article body, client-side search dependency, or further workflow restructuring is needed.

The user is trying to **work through one kitchen number** so that **the next quote, buy, recipe, or event decision keeps its assumptions visible**. The normal path is index question selection → article identity → formula → bounded example → exceptions → next operational job. Breadcrumb and related guides provide recovery from a mismatched article; the product handoff and related reading provide the successful next actions.

## Index direction

CostCook's warm counter becomes a ruled working notebook: paper, ink, green actions, amber measurements, Fraunces decisions, and Instrument Sans explanations. The first viewport pairs the editorial promise on the left with a real 180-guest calculation on the right, and the featured guide begins at the fold. The page proceeds question → arithmetic → boundary → next job. Use the direction seed `blog-working-through-the-number`.

## Article direction

Each article is a calm long-form working sheet that takes one kitchen question all the way through. Breadcrumb, article identity, category, date, and reading time establish context; the first useful paragraph begins without a decorative hero image. The article proceeds formula → example → exceptions → next job, with amber arithmetic, green handoffs, and ruled paper evidence. Use the direction seed `blog-article-working-shown`.

## Semantic roles and reading behavior

- The index promise and article title use Fraunces as the primary decision role.
- Topic, reading time, publication date, byline, and guide-path labels remain compact supporting evidence in Instrument Sans.
- Index entries are full-width ruled rows, not interchangeable cards; the row preserves the same metadata order in full and compact contexts.
- Formula and example blocks use tabular numerals, remain horizontally safe, and stay adjacent to the prose that defines their inputs and limits.
- The article guide path may sit beside the reading column on wide screens; on narrower screens it returns before the body in source order with the same direct anchors.
- Green marks links and next actions. Amber marks compact measurement or category context and does not become a decorative wash.

## Content and truth boundaries

Article copy and frontmatter live in `src/content/blog`; the index story source is `docs/stories/blog.story.md`. Do not copy exact article language, amounts, titles, category inventories, or one-off route composition into the global design system. Worked amounts must remain real product data or explicitly illustrative, and every conclusion must keep its assumptions, exclusions, or missing evidence close enough to prevent it reading as a guarantee.

## Accessibility, resilience, and recovery

All reading, topic navigation, breadcrumbs, guide anchors, related links, and calls to action remain available without JavaScript. Links retain visible focus and at least 44-pixel standalone targets where they function as navigation controls. At narrow widths, the editorial split and article metadata stack without changing meaning; article working blocks may scroll internally, but the page must not overflow. The route remains legible at 200% text zoom and honors reduced motion.

There are no loading or destructive states in this static route family. A missing or mismatched article is recovered through the Blog breadcrumb and related guides; content-schema and build checks prevent malformed published entries from shipping. Success is the reader reaching a worked answer with its boundary intact and seeing a relevant next job, not a transient confirmation state.

## Verification and finish contract

Static checks cover content schema, unique routes, index/article metadata, article structure, structured data, Blog navigation, direction contracts, and no-JavaScript output. Browser checks cover the six-guide Blog disclosure, the index and a representative article at desktop and mobile widths, keyboard focus, direct anchors, responsive stacking, internal working-block overflow, page overflow, reduced motion, and console/network health.

The independent finish reviewer disposition is **ship**, with no material fixes remaining. The route family is finished when its durable read-surface rules are recorded in `DESIGN.md` and `.impeccable/design.json` without changing the approved feature code or article content.

## Surface boundary

The 180-guest first-viewport calculation, featured-guide composition, exact topic set, article metadata values, individual formulas, guide headings, related-article selection, and route-specific calls to action belong to this route family. The durable global rule is narrower: practical read surfaces lead with the question, keep arithmetic and assumptions inspectable, expose boundaries before the handoff, and end with the next operational job.
