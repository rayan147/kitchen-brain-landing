---
title: "How to import your ingredients, invoices and recipes into CostCook"
menuTitle: "Import ingredients, invoices and recipes"
description: "A step-by-step guide with a screenshot at every step: import your ingredient list, then your supplier invoices, then your recipes. What you need before you start, and what to do when something goes wrong."
publishedDate: 2026-10-08
category: Buying & suppliers
menuGroup: Plan and buy
menuIcon: invoice
featured: false
order: 22
readMinutes: 14
featureHref: /features/invoices-and-price-list-import
featureLabel: See imports staged for review in CostCook
---
<!-- story: docs/stories/blog-import-invoices-recipes-ingredient-lists.story.md -->
<!-- Read off kitchen-brain main ed6ff5f01 and develop 6450d7c54 on 2026-10-12 (RC-79).
     Every label and limit below is on both. Do not add develop-only wording (the
     late-invoice price hold, the column-mapper subtitles) until main carries it.
     Written as a how-to (owner, 2026-10-12): numbered steps, one action each,
     a screenshot at each step and for each problem.
     CAPTURES (v2, 2026-10-12): 37 tight crops at 390 px, the control each step
     names ringed in amber, from a localhost build of kitchen-brain develop
     9bd986496 (import code identical to 6450d7c54 apart from two mapper
     subtitles) with the Harbor & Hearth sample kitchen. Its reader is the fixed
     test reader: the two ingredient rows were edited in review to match what was
     pasted (Leek, Canola oil); the invoices are PDFs made for the shoot and read
     by the app's rules reader; the recipe came in through Map recipe columns; the
     "Couldn't read" note was written into the sample database. Re-shoot when a
     real reader is available locally. -->

By the end of this guide, your ingredients, your supplier invoices and your recipes will be in CostCook, and your recipes will be costed.

You do it in three parts, in this order:

1. **Ingredients**: the things you buy.
2. **Invoices**: what you paid for them.
3. **Recipes**: what you make from them.

Do recipes last. Every recipe line has to match an ingredient that's already in CostCook. If it isn't there, you have to create it on the spot, with a pack and a price.

The screenshots come from CostCook on a phone, with a sample kitchen. The button to press is ringed in amber.

## Before you start

You need:

- **An owner or manager login.** Staff can't import.
- **Your ingredient list.** A spreadsheet, a PDF, or a photo of a written list.
- **Your supplier invoices**, as a PDF or a photo. A spreadsheet invoice won't record a purchase (see Part 2).
- **Your recipes.** Photos of the cards, PDFs, Word files, a spreadsheet, or a link to a recipe page.

Nothing is saved until you press the save button at the end of each review. Until then you can throw it away.

## Part 1: Import your ingredient list

1. Open **Import and review**.
2. Under "What are you bringing in?", choose **Ingredient list**.

![The Add documents card. Under What are you bringing in?, Ingredient list is selected and ringed. Below: Take a photo or choose a file, PDF, photo, CSV, Excel, or DOCX, with Take photo, Choose files and Paste text instead.](/proof/blog/import-invoices-recipes-ingredient-lists/p1-01-choose-mobile.png "Choose Ingredient list.")

3. Add your list with **Choose files** or **Take photo**. To paste it, press **Paste text instead**, paste, and press **Add to queue**.

![The Paste source text box with Ingredient list chosen. The source text reads: Leek, 25 lb case, $38.00 and Canola oil, 18 L jug, $41.50. Add to queue is ringed.](/proof/blog/import-invoices-recipes-ingredient-lists/p1-02-paste-mobile.png "One ingredient per line, with its pack and price.")

4. Press **Extract sources**.

![The Read and review card: 1 document ready to read. CostCook reads each document and matches it to your ingredients. Nothing is added until you check it. Extract sources is ringed.](/proof/blog/import-invoices-recipes-ingredient-lists/p1-03-extract-mobile.png "Extract sources reads what you added.")

With one document, the review opens by itself. With several, each gets a card: wait for "Held for your review", then press **Review**.

![A card for order-guide.xlsx marked Needs review, with the Review button ringed. Its progress shows three ticks: Uploading, Reading ingredients and matching your catalog, Held for your review.](/proof/blog/import-invoices-recipes-ingredient-lists/p1-06-queue-card-mobile.png "Several documents? Press Review on each card.")

5. You'll see **Review ingredients**, one row per ingredient.

![Review ingredients: Each line is a new ingredient. Check the details, fix any that need it, then add them all at once. Nothing lands in your catalog until you do. 2 ingredients to add, with Add all 2 ingredients ringed, and Discard list.](/proof/blog/import-invoices-recipes-ingredient-lists/p1-04-review-mobile.png "Nothing is added until you press Add all.")

6. Open each row marked **Needs review** and check its pack: the **pack label**, **what the pack contains** (a number and a unit), and a **cost** above $0.

![The Purchase pack section of the Canola oil row: Pack label 18 L jug, Pack contains 18, Unit Liter (L), Cost 41.50. The three filled fields are ringed.](/proof/blog/import-invoices-recipes-ingredient-lists/p1-05-row-mobile.png "Every ingredient needs a pack label, what the pack holds, and a cost.")

7. Press **Add all**. Your ingredients are saved, and you land on **Ingredients**.

**Tip:** if some rows look like ingredients you already have, CostCook says so. Press **Skip the … I already have** so you don't end up with two prices for one thing.

![A warning: 2 of 2 look like ingredients you already have. Adding them again gives you two of each, with separate prices. The Skip the 2 I already have button is ringed.](/proof/blog/import-invoices-recipes-ingredient-lists/p1-tip-skip-mobile.png "Already in your kitchen? Skip it.")

**Tip:** a photo works for a written list or a readable label, not a photo of the food. The app says so: "Photos of loose food cannot supply quantities or prices."

### Optional: use the CostCook template instead

If you'd rather fill in a spreadsheet yourself:

1. On **Import and review**, open **Map supplier columns**.
2. Follow the link to **Ingredients CSV import**.
3. Press **Download the template** and fill it in. Don't change the first row:

![Import ingredients: Each row in the file becomes a new ingredient. Start from the template so the columns line up, with Download the template ringed. Below: CSV or Excel file and Add these ingredients.](/proof/blog/import-invoices-recipes-ingredient-lists/p1-07-template-mobile.png "Start from the template.")

```text
name,baseUnit,category,supplier,densityGPerMl,unitWeightG,packName,packSizeQty,packSizeUnit,packCost
```

4. Upload it and press **Add these ingredients**.

This route has **no review screen**. Every correct row is saved at once. Rows with a problem are listed under **Rejected rows** with the reason. Fix those and upload just them again. The template takes up to 1,000 rows.

![Result: Imported 1 ingredient. Rejected rows (3): Capers, Cost must be more than $0; Lemon, Pack label is required; Cream, Not a recognized unit.](/proof/blog/import-invoices-recipes-ingredient-lists/p1-08-template-result-mobile.png "Good rows go in. Each rejected row says why.")

## Part 2: Import a supplier invoice

1. Open **Import and review** and choose **Invoice**. The file choice now says "PDF or photo".

![The Add documents card with Invoice selected and ringed: What you paid for a delivery. It updates your costs. Take a photo or choose a file, PDF or photo.](/proof/blog/import-invoices-recipes-ingredient-lists/p2-01-choose-mobile.png "Choose Invoice.")

2. Add the invoice: **Choose files** for a PDF, or **Take photo** for each page, then **Add document to queue**. Check that the small print, quantities and totals are readable in your photos.
3. Press **Extract sources**.

![The Read and review card with 1 document ready to read and Extract sources ringed.](/proof/blog/import-invoices-recipes-ingredient-lists/p2-02-extract-mobile.png "Extract sources reads the invoice.")

4. You'll see **Review extracted records**: the supplier, invoice number and date CostCook read, and anything you must decide before it can be saved.

![Invoice GV-4476: 1 decision required before import. Lemon: this line prices a 115 ct, but the catalog pack is case 40 ct. Below: Supplier GREEN VALLEY PRODUCE, Invoice number GV-4476, Invoice date 2026-10-06.](/proof/blog/import-invoices-recipes-ingredient-lists/p2-03-header-mobile.png "What it read, and what still needs you.")

5. **Check the supplier.** If it isn't matched, pick it from your list, or type the name and press **Create supplier on import**.

![Choose the invoice supplier: Supplier ready. Green Valley Produce is matched to this invoice.](/proof/blog/import-invoices-recipes-ingredient-lists/p2-04-supplier-mobile.png "The supplier is matched.")

6. **Give every line a home.** Lines that match your ingredients say **Matched**.

![Two invoice lines: Russet potato, Matched, Russet potato; Yellow onion, Matched, Yellow onion.](/proof/blog/import-invoices-recipes-ingredient-lists/p2-06-matched-mobile.png "Matched lines need nothing from you.")

For the rest, match an ingredient, press **Create new ingredient**, or exclude the line (a pallet deposit, for example). If the invoice's pack doesn't match your ingredient's pack, CostCook stops and offers the fix.

![The Lemon line, Needs review: 1 case, pack 115 ct, $54.00. Why this is blocked: this line prices a 115 ct, but the catalog pack is case 40 ct. Use 2.875 packs, or fix the catalog pack. The Use 2.875 packs button is ringed.](/proof/blog/import-invoices-recipes-ingredient-lists/p2-05-blocked-mobile.png "A pack that doesn’t match is stopped, not guessed. One press fixes it.")

7. **Confirm anything CostCook was unsure of**, like a quantity or a price.
8. **Check the totals.** The printed total sits beside what the lines add up to.

![Printed subtotal $119.45, Lines as reviewed $119.45, Subtotal difference $0.00, Printed total $119.45.](/proof/blog/import-invoices-recipes-ingredient-lists/p2-07-totals-mobile.png "The lines add up to the printed total.")

9. Press **Import invoice and update costs**.

![The Import invoice and update costs button, ringed.](/proof/blog/import-invoices-recipes-ingredient-lists/p2-08-import-mobile.png "The last press.")

You'll see "Invoice imported", how many purchase records were created, and which ingredient costs changed.

![Invoice imported. Saved. The original stays with this import. What changed: Invoice #3, 3 purchase records created, View purchases. Russet potato, View ingredient. 1 current cost changed.](/proof/blog/import-invoices-recipes-ingredient-lists/p2-09-imported-mobile.png "Each line is now a purchase. Here, the potato price moved.")

**Got the invoice as a spreadsheet?** It goes to price-sheet review instead. That updates the prices you choose, but it doesn't record a purchase. To record the purchase, import the PDF or a photo.

## Part 3: Import your recipes

1. Open **Import and review** and choose **Recipe**.

![The Add documents card with Recipe selected and ringed: A dish or batch with its ingredients and amounts. Take photo, Choose files, Paste text instead, and Paste a link.](/proof/blog/import-invoices-recipes-ingredient-lists/p3-01-choose-mobile.png "Choose Recipe.")

2. Add the recipe with **Choose files**, **Take photo** or **Paste text instead**. For a recipe web page, press **Paste a link** (the link must start with https://) and **Add to queue**.

![The Paste a recipe link box: CostCook opens the page and reads it like pasted text. The recipe stays in review until you approve it. A recipe link is filled in and Add to queue is ringed.](/proof/blog/import-invoices-recipes-ingredient-lists/p3-02-link-mobile.png "A link is read like pasted text.")

3. Press **Extract sources**. The review opens, and the top says how many lines are ready and how many need you.

![Review: Mushroom chicken marsala. Nothing goes into your catalog until you finish this review. 2 of 5 lines ready, 3 lines need you. 2 of 5 lines matched automatically against your catalog. Filters: All, Needs review (3), Ready, Errors.](/proof/blog/import-invoices-recipes-ingredient-lists/p3-03-summary-mobile.png "Two lines matched on their own. Three need you.")

4. For each line that isn't ready, do one of these:
   - **It's close to one of yours:** CostCook proposes it. Press **Confirm match** if it's right, or **Change match**.

![The Cremini mushrooms line, 60 g, Needs review: Close, not the same name: Mushroom, cremini.](/proof/blog/import-invoices-recipes-ingredient-lists/p3-04-close-match-mobile.png "Close enough? Confirm the match it proposes.")

   - **It's new:** press **Create new**.

![The Porcini powder line, 2 g, Needs review: Not in your ingredients yet. Is this already in your ingredients? Match existing, and Create new ringed.](/proof/blog/import-invoices-recipes-ingredient-lists/p3-05-new-line-mobile.png "Not in your kitchen yet: create it.")

   Fill in the pack label, pack quantity, purchase unit and pack cost, then press **Save ingredient details**.

![Purchase information: A pack and current cost are required before this ingredient can enter the catalog. Pack label 1 lb bag, Pack quantity 1, Purchase unit Pound (lb), Pack cost 38.00, Supplier optional. Save ingredient details is ringed.](/proof/blog/import-invoices-recipes-ingredient-lists/p3-06-new-ingredient-mobile.png "A new ingredient needs its pack and price.")

5. If a line says "Pick a unit", choose one from the list (g, oz, lb, ml, tbsp and so on) and fix the quantity.

![The Shallot line, 1 knob, marked Unit unclear and Needs review. Pick a unit. Quantity 1, and the Choose a unit picker ringed.](/proof/blog/import-invoices-recipes-ingredient-lists/p3-07-pick-unit-mobile.png "Knob isn’t a unit CostCook knows, so it asks.")

6. If the recipe uses a sub-recipe, like a sauce or a braise, enter what one batch makes: a quantity and a unit.
7. When every line is ready, press **Create recipe**. If the file held several recipes, press **Import reviewed recipes**.

![All line decisions are complete. Review the recipe details above, then use the final action below. The Create recipe button is ringed.](/proof/blog/import-invoices-recipes-ingredient-lists/p3-08-ready-mobile.png "Every line ready: create the recipe.")

8. The recipe opens, saved and costed. Check the lines once before you cook from it.

![Recipe imported. Check it before using it, with Check recipe lines and Review nutrition and dietary facts. Mushroom chicken marsala, Version 1, Live.](/proof/blog/import-invoices-recipes-ingredient-lists/p3-09-created-mobile.png "Saved, and live.")

![Pricing per portion: Plate cost $2.75, Sells for Not set. Food cost unavailable until a price is set, against a 30% target.](/proof/blog/import-invoices-recipes-ingredient-lists/p3-10-plate-cost-mobile.png "Costed straight away, at your current prices.")

**Tip:** if a recipe with the same name already exists, CostCook asks whether to update it or create a separate recipe.

**Tip:** not finished? Press **Finish later**. Your decisions are kept.

## If something goes wrong

### "Couldn't read"

The rest of the document still comes through. Retake those pages, or retype those lines, and import them on their own.

![A red notice: Couldn’t read: Hvy crm 12/1 qt (price smudged); last line, torn. Retype those lines and import them separately.](/proof/blog/import-invoices-recipes-ingredient-lists/err-unreadable-mobile.png "What it couldn’t read is listed, not skipped quietly. (Example note.)")

### "Cost must be more than $0"

Add the pack price. An ingredient without a price can't be costed.

![The Olive oil row with cost $0: Needs a fix: Cost must be more than $0: an ingredient with no price can’t be costed.](/proof/blog/import-invoices-recipes-ingredient-lists/err-cost-mobile.png "No price, no ingredient.")

### "Already exists: rename it or remove this row"

You already have an ingredient with that name. Remove the row, or rename it if it's a different product.

![The Yellow onion row: "Yellow onion" already exists: rename it or remove this row.](/proof/blog/import-invoices-recipes-ingredient-lists/err-exists-mobile.png "One name, one ingredient.")

### "This appears to duplicate invoice"

That invoice is already imported. Press the link to open it, and don't import it again.

![2 decisions required before import: This appears to duplicate invoice #1, and a Lemon pack mismatch. The link Open invoice #1 that this repeats is ringed.](/proof/blog/import-invoices-recipes-ingredient-lists/err-duplicate-mobile.png "The same invoice twice is stopped.")

### "Invoice totals differ"

The lines don't add up to the printed total. Check each line's quantity and price against the paper.

![3 decisions required before import, including Invoice totals differ by $3.00 and Printed subtotal and calculated lines differ by $3.00.](/proof/blog/import-invoices-recipes-ingredient-lists/err-totals-mobile.png "It tells you how far off, to the cent.")

### "No invoice number could be identified."

Retake the photo so the invoice number is readable, then use **Replace this source**.

![Reading stopped for this source. No invoice number could be identified. Reading this file again will not change the result. Upload a clearer copy in the replace section below.](/proof/blog/import-invoices-recipes-ingredient-lists/err-no-number-mobile.png "An invoice needs its number.")

### A file "is too large"

Photos can be up to 12 MB, other files up to 3.5 MB.

![big-invoice.pdf is too large (3.5 MB maximum).](/proof/blog/import-invoices-recipes-ingredient-lists/err-too-large-mobile.png "Over the limit, the file isn’t added.")

### Only part of your Excel file came in

Only the first tab is read. Save each other tab as its own file.

![Read the first tab, "Produce". Tabs left out: Dairy, Dry goods. Save one of those as its own file to import it.](/proof/blog/import-invoices-recipes-ingredient-lists/err-first-tab-mobile.png "It names the tabs it left out.")

### "Header must be exactly" (template)

Download the template again and paste your rows under its first row.

![Header must be exactly: name,baseUnit,category,supplier,densityGPerMl,unitWeightG,packName,packSizeQty,packSizeUnit,packCost: download the template to start.](/proof/blog/import-invoices-recipes-ingredient-lists/err-header-mobile.png "The template’s first row has to stay as it is.")

## Limits

- **Photos:** up to 12 MB each, and up to 6 photos per document.
- **Other files** (PDF, spreadsheet, Word): up to 3.5 MB each. PDFs up to 50 pages.
- **Pasted text:** up to 20,000 characters.
- **One batch:** up to 100 documents. Stay on the page until they're read, or the unread ones are lost.

## Undo and changes

**Before you save:** press **Discard import** (or **Discard list** for an ingredient list). The staged rows and the uploaded files are deleted. Nothing in your catalog changes.

**After you save:** there's no undo. Change things where they now live: edit the recipe or the ingredient, or correct the purchase in **Purchases**.
