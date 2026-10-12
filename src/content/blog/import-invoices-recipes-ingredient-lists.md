---
title: "How to import your ingredients, invoices and recipes into CostCook"
description: "A step-by-step guide with a screenshot at every step: import your ingredient list, then your supplier invoices, then your recipes. What you need before you start, and what to do when something goes wrong."
publishedDate: 2026-10-12
category: Buying & suppliers
menuGroup: Plan and buy
menuIcon: invoice
featured: false
order: 22
readMinutes: 13
featureHref: /features/invoices-and-price-list-import
featureLabel: See imports staged for review in CostCook
---
<!-- story: docs/stories/blog-import-invoices-recipes-ingredient-lists.story.md -->
<!-- Read off kitchen-brain main ed6ff5f01 and develop 6450d7c54 on 2026-10-12 (RC-79).
     Every label and limit below is on both. Do not add develop-only wording (the
     late-invoice price hold, the column-mapper subtitles) until main carries it.
     Written as a how-to (owner, 2026-10-12): numbered steps, one action each,
     a screenshot at each step and for each problem.
     CAPTURES: shot 2026-10-12 at 390 px from a local build of kitchen-brain develop
     9bd986496 (import code identical to 6450d7c54 apart from two mapper subtitles)
     with the Harbor & Hearth sample kitchen. That build reads with a fixed test
     reader, so the ingredient rows are the reader's sample rows; the invoice PDFs
     were generated for the shoot and read by the app's rules reader; the recipe
     came in through Map recipe columns; the "Couldn't read" note was written into
     the sample database to show how the notice looks. Re-shoot from production
     data when a real reader is available locally. -->

By the end of this guide, your ingredients, your supplier invoices and your recipes will be in CostCook, and your recipes will be costed.

You do it in three parts, in this order:

1. **Ingredients**: the things you buy.
2. **Invoices**: what you paid for them.
3. **Recipes**: what you make from them.

Do recipes last. Every recipe line has to match an ingredient that's already in CostCook. If it isn't there, you have to create it on the spot, with a pack and a price.

The screenshots come from CostCook on a phone, with a sample kitchen.

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

![The Import and review screen. Under "What are you bringing in?", Ingredient list is selected, with the line "A list of things you buy, to add as ingredients." Below: Take a photo or choose a file, PDF, photo, CSV, Excel, or DOCX, with Take photo, Choose files and Paste text instead.](/proof/blog/import-invoices-recipes-ingredient-lists/01-choose-ingredient-list-mobile.png "Choose what you're bringing in first.")

3. Add your list with **Choose files** or **Take photo**. To paste it, press **Paste text instead**, paste, and press **Add to queue**.

![The Paste source text box. What is it? is set to Ingredient list. The source text reads: Yellow onion, 50 lb sack, $18.50 and Olive oil, 3 L tin, $32.00. Buttons: Add to queue and Cancel.](/proof/blog/import-invoices-recipes-ingredient-lists/02-paste-list-mobile.png "Pasting works too: one ingredient per line, with its pack and price.")

4. Press **Extract sources**. With one document, the review opens by itself. With several, each one gets a card: wait for "Held for your review", then press **Review**.

![A document card for order-guide.xlsx marked Needs review, with a Review button. Its progress shows three ticks: Uploading, Reading ingredients and matching your catalog, Held for your review.](/proof/blog/import-invoices-recipes-ingredient-lists/03-queue-card-mobile.png "Three ticks, then press Review.")

5. You'll see **Review ingredients**, one row per ingredient. If some look like ingredients you already have, CostCook says so. Press **Skip the … I already have** to leave those out.

![Review ingredients. A warning reads "2 of 2 look like ingredients you already have. Adding them again gives you two of each, with separate prices," with a Skip the 2 I already have button. Below: 2 ingredients to add, Add all 2 ingredients, and Discard list.](/proof/blog/import-invoices-recipes-ingredient-lists/04-review-ingredients-mobile.png "Already have it? Skip it, so you don't end up with two prices for one thing.")

6. Open each row marked **Needs review** and check it. Every ingredient needs:
   - a **name**, and whether it's measured by weight, volume or count;
   - a **pack label**, like "case 6 × #10" or "3 L tin";
   - **what the pack contains**, a number and a unit;
   - a **cost** above $0.

![An open row for Olive oil: Name, Measured by Volume, Category Pantry, Supplier, then Purchase pack with Pack label 3 L tin, Pack contains 3, Unit Liter (L), and Cost 32.00.](/proof/blog/import-invoices-recipes-ingredient-lists/05-ingredient-row-mobile.png "Every row needs a pack label, what the pack contains, and a cost.")

7. Press **Add all**. Your ingredients are saved, and you land on **Ingredients**.

**Tip:** a photo works for a written list or a readable label, not a photo of the food. The app says so: "Photos of loose food cannot supply quantities or prices."

### Optional: use the CostCook template instead

If you'd rather fill in a spreadsheet yourself:

1. On **Import and review**, open **Map supplier columns**.
2. Follow the link to **Ingredients CSV import**.
3. Press **Download the template** and fill it in. Don't change the first row:

```text
name,baseUnit,category,supplier,densityGPerMl,unitWeightG,packName,packSizeQty,packSizeUnit,packCost
```

4. Upload it and press **Add these ingredients**.

This route has **no review screen**. Every correct row is saved at once. Rows with a problem are listed under **Rejected rows** with the reason. Fix those and upload just them again. The template takes up to 1,000 rows.

![The template result. "Nothing was imported. Every row needs a fix first." Rejected rows (4): Sherry vinegar already exists; Capers, Cost must be more than $0; Lemon, Pack label is required; Cream, Not a recognized unit.](/proof/blog/import-invoices-recipes-ingredient-lists/06-template-result-mobile.png "Each rejected row says what's wrong, in plain words.")

## Part 2: Import a supplier invoice

1. Open **Import and review** and choose **Invoice**. The file choice now says "PDF or photo".

![Import and review with Invoice selected: "What you paid for a delivery. It updates your costs." Below: Take a photo or choose a file, PDF or photo, with Take photo and Choose files.](/proof/blog/import-invoices-recipes-ingredient-lists/07-choose-invoice-mobile.png "Invoices come in as a PDF or a photo.")

2. Add the invoice: **Choose files** for a PDF, or **Take photo** for each page, then **Add document to queue**. Check that the small print, quantities and totals are readable in your photos.
3. Press **Extract sources**. You'll see **Review extracted records**, with the supplier, invoice number and date CostCook read, and a list of anything you must decide.

![Review extracted records for gv-4474.pdf, Ready to review, with Open original PDF. Invoice GV-4474: "1 decision required before import." Then Supplier GREEN VALLEY PRODUCE, Invoice number GV-4474, Invoice date 2026-10-06.](/proof/blog/import-invoices-recipes-ingredient-lists/08-invoice-review-top-mobile.png "What it read, and what it still needs from you.")

4. **Choose the supplier.** Pick it from your list, or type a name and press **Create supplier on import**.

![Choose the invoice supplier: Supplier ready, Green Valley Produce is matched to this invoice. Use an existing supplier, Use selected supplier, New supplier name, Create supplier on import.](/proof/blog/import-invoices-recipes-ingredient-lists/09-invoice-supplier-mobile.png "The supplier is matched. If it isn't, pick it or create it here.")

5. **Give every line a home.** Lines that match your ingredients say **Matched**. For the rest, match an ingredient, press **Create new ingredient**, or exclude the line (a pallet deposit, for example). If the invoice's pack doesn't match your ingredient's pack, CostCook stops and offers the fix.

![The Lemon line, Needs review: SKU GV-305, 1 case, pack 115 ct, $54.00. Why this is blocked: this line prices a 115 ct, but the catalog pack is case 40 ct. Use 2.875 packs, or fix the catalog pack. A Use 2.875 packs button, and Create new ingredient.](/proof/blog/import-invoices-recipes-ingredient-lists/10-invoice-line-blocked-mobile.png "A pack that doesn't match is stopped, not guessed. One press fixes it.")

6. **Confirm anything CostCook was unsure of**, like a quantity or a price.
7. **Check the totals.** The printed total sits beside what the lines add up to.

![Printed subtotal $118.01, Lines as reviewed $118.01, Subtotal difference $0.00, Printed total $118.01.](/proof/blog/import-invoices-recipes-ingredient-lists/11-invoice-totals-mobile.png "The lines add up to the printed total.")

8. Press **Import invoice and update costs**. You'll see "Invoice imported" and how many purchase records were created.

![Invoice imported. "Saved. The original stays with this import." What changed: Invoice #2, 3 purchase records created, with View purchases.](/proof/blog/import-invoices-recipes-ingredient-lists/12-invoice-imported-mobile.png "Done: each line is now a purchase, and your costs follow it.")

**Got the invoice as a spreadsheet?** It goes to price-sheet review instead. That updates the prices you choose, but it doesn't record a purchase. To record the purchase, import the PDF or a photo.

## Part 3: Import your recipes

1. Open **Import and review** and choose **Recipe**.

![Import and review with Recipe selected: "A dish or batch with its ingredients and amounts." Take photo, Choose files, Paste text instead, and Paste a link.](/proof/blog/import-invoices-recipes-ingredient-lists/13-choose-recipe-mobile.png "Recipes can also come from a link.")

2. Add the recipe with **Choose files**, **Take photo** or **Paste text instead**. For a recipe web page, press **Paste a link** (the link must start with https://) and **Add to queue**.

![The Paste a recipe link box: "CostCook opens the page and reads it like pasted text. The recipe stays in review until you approve it." A Recipe link field, Add to queue and Cancel.](/proof/blog/import-invoices-recipes-ingredient-lists/14-paste-link-mobile.png "A link is read like pasted text.")

3. Press **Extract sources**. The review opens. The top says how many lines are ready and how many need you.

![Review: Chicken francese. "3 of 5 lines ready, 2 lines need you." The Pecorino line, 12 g, Needs review, Not in your ingredients yet, with Match existing, Create new, a catalog search and Confirm match.](/proof/blog/import-invoices-recipes-ingredient-lists/15-recipe-review-mobile.png "Lines that matched your ingredients are done. The rest wait for you.")

4. For each line that isn't ready, do one of these:
   - **It's already in your ingredients:** press **Match existing**, find it, and press **Confirm match**.
   - **It's new:** press **Create new**. Fill in the pack label, pack quantity, purchase unit and pack cost, then press **Save ingredient details**.

![Creating Pecorino. Purchase information: "A pack and current cost are required before this ingredient can enter the catalog." Pack label 5 lb wedge, Pack quantity 5, Purchase unit Pound (lb), Pack cost 48.75, then Save ingredient details.](/proof/blog/import-invoices-recipes-ingredient-lists/16-new-ingredient-mobile.png "A new ingredient needs its pack and price before the recipe can use it.")

5. If a line says "Pick a unit", choose one from the list (g, oz, lb, ml, tbsp and so on) and fix the quantity.

![The Shallot line, 1 knob, marked Unit unclear and Needs review. "Pick a unit", with Quantity 1 and Unit (choose).](/proof/blog/import-invoices-recipes-ingredient-lists/17-pick-unit-mobile.png "Knob isn’t a unit CostCook knows, so it asks.")

6. If the recipe uses a sub-recipe, like a sauce or a braise, enter what one batch makes: a quantity and a unit.
7. When the top says every line is ready, press **Create recipe**. If the file held several recipes, press **Import reviewed recipes**.

![5 of 5 lines ready, 0 lines need you. Chicken francese, Ready to create. Create recipe, then Finish later: Your line decisions are saved.](/proof/blog/import-invoices-recipes-ingredient-lists/18-recipe-ready-mobile.png "Every line ready. Press Create recipe.")

8. The recipe opens, saved and costed. Check the lines once before you cook from it.

![Recipe imported. Check it before using it. Chicken francese, Version 1, Live. Cost: all 5 lines priced. Plate cost $2.66, Sells for Not set, Price for a 30% target $8.87.](/proof/blog/import-invoices-recipes-ingredient-lists/19-recipe-created-mobile.png "Saved and costed straight away, at your current prices.")

**Tip:** if a recipe with the same name already exists, CostCook asks whether to update it or create a separate recipe.

**Tip:** not finished? Press **Finish later**. Your decisions are kept.

## If something goes wrong

### "Couldn't read"

The rest of the document still comes through. Retake those pages, or retype those lines, and import them on their own.

![A red notice: "Couldn't read: Hvy crm 12/1 qt (price smudged); last line, torn. Retype those lines and import them separately."](/proof/blog/import-invoices-recipes-ingredient-lists/err-unreadable-mobile.png "What it couldn't read is listed, not skipped quietly. (Example note.)")

### "Cost must be more than $0"

Add the pack price. An ingredient without a price can't be costed.

![The Olive oil row with cost $0: "Needs a fix: Cost must be more than $0: an ingredient with no price can't be costed."](/proof/blog/import-invoices-recipes-ingredient-lists/err-cost-mobile.png "No price, no ingredient.")

### "Already exists: rename it or remove this row"

You already have an ingredient with that name. Remove the row, or rename it if it's a different product.

![Yellow onion, Olive oil need a fix before they can be added. The Yellow onion row: "Yellow onion" already exists: rename it or remove this row.](/proof/blog/import-invoices-recipes-ingredient-lists/err-exists-mobile.png "One name, one ingredient.")

### "This appears to duplicate invoice"

That invoice is already imported. Press the link to open it, and don't import it again.

![Invoice GV-4471: 2 decisions required before import. This appears to duplicate invoice #1. A link: Open invoice #1 that this repeats.](/proof/blog/import-invoices-recipes-ingredient-lists/err-duplicate-mobile.png "The same invoice twice is stopped.")

### "Invoice totals differ"

The lines don't add up to the printed total. Check each line's quantity and price against the paper.

![Invoice GV-4472: 3 decisions required before import, including "Invoice totals differ by $3.00" and "Printed subtotal and calculated lines differ by $3.00."](/proof/blog/import-invoices-recipes-ingredient-lists/err-totals-mobile.png "It tells you how far off, to the cent.")

### "No invoice number could be identified."

Retake the photo so the invoice number is readable, then use **Replace this source**.

![Reading stopped for this source. No invoice number could be identified. Reading this file again will not change the result. Upload a clearer copy in the replace section below.](/proof/blog/import-invoices-recipes-ingredient-lists/err-no-number-mobile.png "An invoice needs its number.")

### A file "is too large"

Photos can be up to 12 MB, other files up to 3.5 MB.

![big-invoice.pdf is too large (3.5 MB maximum).](/proof/blog/import-invoices-recipes-ingredient-lists/err-too-large-mobile.png "Over the limit, the file isn't added.")

### Only part of your Excel file came in

Only the first tab is read. Save each other tab as its own file.

![Read the first tab, "Produce". Tabs left out: Dairy, Dry goods. Save one of those as its own file to import it.](/proof/blog/import-invoices-recipes-ingredient-lists/err-first-tab-mobile.png "It names the tabs it left out.")

### "Header must be exactly" (template)

Download the template again and paste your rows under its first row.

![Header must be exactly: name,baseUnit,category,supplier,densityGPerMl,unitWeightG,packName,packSizeQty,packSizeUnit,packCost: download the template to start.](/proof/blog/import-invoices-recipes-ingredient-lists/err-header-mobile.png "The template's first row has to stay as it is.")

## Limits

- **Photos:** up to 12 MB each, and up to 6 photos per document.
- **Other files** (PDF, spreadsheet, Word): up to 3.5 MB each. PDFs up to 50 pages.
- **Pasted text:** up to 20,000 characters.
- **One batch:** up to 100 documents. Stay on the page until they're read, or the unread ones are lost.

## Undo and changes

**Before you save:** press **Discard import** (or **Discard list** for an ingredient list). The staged rows and the uploaded files are deleted. Nothing in your catalog changes.

**After you save:** there's no undo. Change things where they now live: edit the recipe or the ingredient, or correct the purchase in **Purchases**.
