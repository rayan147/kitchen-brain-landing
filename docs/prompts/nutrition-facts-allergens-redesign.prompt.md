<!-- story: docs/stories/nutrition-facts-allergens-feature.story.md -->

# Redesign prompt: Nutrition Facts & Allergens

Redesign `/features/nutrition-facts-and-allergens` as a persuasive specialist page built around two connected product chapters:

1. **Nutrition Facts Software** — calculate the fifteen values carried by a Nutrition Facts panel per recipe or portion from matched USDA FoodData Central profiles, preserve missing values as missing, and print a calculated estimate from the recipe.
2. **Allergen Management Software** — record fourteen allergen tags at ingredient level from supplier records, package labels, or kitchen review; roll them into recipes and pack lists; and keep incomplete review visible.

The reader is a meal-prep owner or working chef who needs to answer a customer and label a container without making up certainty. CostCook supports their judgment; it never becomes the hero.

## Research-informed structure

Use [meez’s nutrition labeling page](https://www.getmeez.com/nutrition-labeling) only as information-architecture evidence for separating nutrition analysis, allergen handling, printable output, expert boundaries, and FAQs. Do not copy its interface, layout, imagery, testimonials, figures, compliance language, or claims.

CostCook’s feature register, release-claim ledger, `src/lib/nutrition.ts`, and authentic captures remain the only public source of truth.

## Route and workflow decision

Create the dedicated route and point the existing `Nutrition facts & allergens` feature-menu entry to it. Keep the complete compliance inventory at `/features/compliance-and-labels`.

Marketing evaluation is low-frequency, high-information, and high-risk because the reader is judging nutrition and food-safety evidence. Use a hybrid specialist page:

1. Explain the one-recipe/two-answer thesis in the first viewport.
2. Show the failure mode before introducing product behavior.
3. Keep two anchor destinations visible: Nutrition Facts and Allergen Management.
4. Keep the explanation denormalized for comparison, but make evidence, missing states, and print boundaries explicit.
5. Use authentic CostCook captures rather than generated product UI.
6. Place the detailed inventory and FAQs in native disclosures.
7. End with Start CostCook and Book 15 minutes.

No child routes, tabs, calculator, upload form, carousel, or broader navigation restructuring is needed.

## Story and page sequence

### 1. Hero

- H1: **One recipe. Two answers you cannot guess at.**
- Subhead: **Compute the fifteen Nutrition Facts values per portion, roll evidence-backed allergen tags into the recipe, and keep every missing fact visible before you print.**
- Primary CTA: `Start CostCook`
- Secondary CTA: `Book 15 minutes`
- Preserve the breadcrumb back to `Every feature`.

Use the authentic Chicken Shawarma panel as the dominant proof. Pull the visible 245 calories, 45.4 g protein, 2.7 g carbohydrate, and blank fat value into a concise adjacent strip. The blank is part of the proof.

### 2. The split

Show the current workaround as:

`RECIPE → NUTRITION SHEET` and `RECIPE → ALLERGEN NOTE`

Then show the break when the recipe changes. End with: **The same ingredient line should carry the cost, the nutrient source, and the allergen evidence.**

### 3. Two-product navigator

Create an accessible `nav` labeled `On this page` with substantial links to:

- `Nutrition facts` — Per portion, from matched source profiles, with blanks left blank.
- `Allergen management` — Ingredient evidence rolled into recipes and pack lists, with incomplete review visible.

### 4. Nutrition Facts Software

Use the real `nutrition-panel.png` capture and explain:

- Four headline macros and the fifteen Nutrition Facts nutrients.
- Per-recipe, per-portion, and per-batch calculations where supported.
- USDA FoodData Central profiles chosen for each ingredient.
- Sub-recipes rolling into the dish.
- Missing profiles or conversions producing partial/incomplete states rather than false totals.
- Browser printing from the recipe.

The section’s value turn is “a number” to “a number with its source and boundary.”

### 5. Allergen Management Software

Build a code-native evidence path:

`SUPPLIER RECORD / PACKAGE LABEL / KITCHEN REVIEW → INGREDIENT → RECIPE → PACK LIST`

Explain:

- Fourteen allergen tags at ingredient level.
- Evidence must come from a supplier record, package label, or kitchen review.
- Catalog allergen facts are curated allow-list data; a name match does not invent food-safety data.
- Recipe roll-up includes sub-recipes.
- Chef overrides require a written reason.
- Pack lists carry allergen badges.
- Unreviewed ingredients remain visibly incomplete.
- No screen makes an allergen-free claim.

Do not imply legal compliance, cross-contact control, supplier-reformulation monitoring, dietary-characteristic assessment, or automatic inference from ingredient names.

### 6. Printable proof

Use `public/proof/nutrition-label.png` as an authentic portrait sheet. Pair it with a compact contents list:

- Kitchen name
- Nutrition Facts panel
- Ingredient statement in recipe order
- Allergen line and incomplete-review state
- Nutrition sources
- Print time
- Calculated-estimate boundary

State that the browser can print this onto label stock. Keep the separate label-printer integration marked in development.

Use the page’s one snap line: **A blank row beats a made-up zero.**

### 7. Capabilities and boundaries

Derive nutrition capability copy from `nutrition` in the shipped feature inventory and directly relevant allergen capability copy from the ingredient and order groups. Do not create a second source of truth for shipped behavior.

Place four boundaries beside the inventory:

- Not a retail-label regulatory compliance claim.
- Dietary characteristics are not assessed.
- Ingredient statements are in recipe order, not regulatory weight order.
- Direct label-printer integration remains in development; browser printing ships.

### 8. Frequently asked questions

Use six native disclosures:

1. What is nutrition facts software?
2. Where does CostCook get nutrient values?
3. What happens when a nutrient value is missing?
4. How does CostCook track allergens?
5. Does CostCook make an allergen-free or compliance claim?
6. Can I print a nutrition label today?

### 9. Closing outcome

- Heading: **Print the answer. Keep the evidence.**
- Body: **Bring one real recipe, match the ingredients you know, and leave every missing fact visible until you know it too.**
- Primary CTA: `Book 15 minutes`
- Secondary CTA: `Start CostCook`

Keep quiet onward links to Recipes & Food Costing, Ingredients & Supplier Prices, and Every CostCook feature.

## Visual direction

Extend CostCook’s Kitchen Ticket world with a distinctive `proof label` motif:

- Warm off-white and paper for the working recipe.
- Ink-heavy Nutrition Facts rules as structural graphic elements, not decoration.
- Green for reviewed/source-backed states and actions.
- Amber for incomplete evidence and boundaries.
- Fraunces for editorial decisions; Instrument Sans for kitchen explanation; monospaced numerals only for measured values.
- Square evidence sheets, crop rails, fine rules, and restrained physical shadow only on authentic paper-like captures.
- Vary the page topology: asymmetrical hero, broken two-column handoff, full-width label band, evidence chain, portrait print proof, disclosures, anchored close.

Do not use generic icon cards, glass, gradients, a hero metric template, decorative dashboards, invented food photography, or generated product UI.

## Accessibility and responsive behavior

- Preserve application identity, breadcrumb, H1, context, and a clear next action on the deep link.
- Keep one logical heading hierarchy.
- Name the local navigator and evidence diagrams accessibly.
- Keep standalone controls at least 44×44 pixels.
- Never use color alone for complete, partial, reviewed, incomplete, or in-development states.
- Reflow evidence paths into vertical sequences on narrow screens.
- Use deliberate crops and nearby transcriptions so screenshot text does not carry the claim alone.
- Preserve all claims and CTAs without JavaScript or images.
- Respect reduced motion and survive 200% text zoom without horizontal overflow.

## Verification

- The route builds and appears in the feature menu.
- The H1, two product chapters, four boundaries, six FAQs, and both authentic proof assets render.
- Nutrition and allergen claims remain within the claim ledger and feature register.
- The menu deep link resolves to the specialist route while the complete compliance area remains reachable.
- Native disclosures work with keyboard and Space.
- Five viewports pass: 1440×900, 1280×800, 1024×768, 768×1024, and 390×844.
- There are no console errors, failed requests, clipping, or horizontal overflow.
- `npm run check`, `npm run build`, the claim guard, and the specialist-page verifier pass.

