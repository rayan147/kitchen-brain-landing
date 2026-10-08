// story: docs/stories/features-navigation.story.md
// Considered Strategy; not used because feature wording varies as static data, not runtime behavior.
import { SAGE_STATUS, sageDraftKinds, sageDraftKindsOr, sageReadToolCount } from './sage';
import { spell, spellCapital } from './words';
import { labelsAvailability } from './labels';
import { orderingAvailability, orderingRoute } from './ordering';
import { allergenCount } from './dietary';
import { depositMethods } from './events';
import { inboxLimits, invoiceEmailAvailability, invoiceEmailRoute } from './invoice-email';
/**
 * The complete shipped-feature list, written from the code audit
 * (kitchen-brain docs/marketing-audit/PHASE-1-REGISTER.md, Phase 1).
 *
 * Rules of this file:
 *  - SHIPPED features only. PARTIAL, STUB, and internal tooling stay off
 *    the page until they ship (the register's landmine list is the gate).
 *  - Each item maps to a register row; `lead` is the scan word, `detail`
 *    finishes the sentence. Keep leads short: readers scan, they don't read.
 *  - Copy rules apply here like everywhere else: kitchen English, no
 *    em-dashes, no claim the app can't survive on a demo call.
 */
/** The five sections, in reading order. Same words as the /compare groups. */
export const SECTIONS = [
	'Recipes and costing',
	'Getting prices in',
	'The day itself',
	'Compliance and labels',
	'Team, and what it connects to'
] as const;

export type Section = (typeof SECTIONS)[number];

/**
 * Per-section page metadata. Added 2026-08-23, when /features stopped being
 * one page of 145 line items and became a hub over five section pages.
 *
 * `slug` is TYPED, NOT DERIVED. These are public URLs; a regex over the title
 * would make /features/team-and-what-it-connects-to, and the day someone
 * rewords a section heading every link to it would 404 silently. Change a
 * title freely, change a slug only with a redirect.
 *
 * `blurb` is the one sentence a section card carries on the hub. `lede` is the
 * prose that opens its own page. Splitting 145 items across five pages only
 * produces five smaller walls unless something above the list says what the
 * area is FOR, so the lede is load-bearing, not decoration.
 *
 * `wall` was added 2026-08-27 and is the reader's MOMENT, not the product's
 * summary: the WHO + WANT + WALL of STORY-SPINE-2026-08-27.md, worksheet 1,
 * narrowed to one area of the week. Every one of the five is drawn from the
 * same hero as the homepage - the owner-caterer who quotes the job and cooks
 * it - so the five pages are one story at a lower altitude rather than five
 * stories. It carries the lede's type on the area page and the lede drops to
 * body, because the reader comes before the product.
 *
 * A `wall` IS NOT A CAPABILITY CLAIM AND MAY NOT BECOME ONE. It describes
 * something that happens in a kitchen; the moment it describes what the app
 * does, it needs a ledger row and it stops doing its job. The one to watch is
 * team-and-connections: the obvious wall to write there is handing the prep
 * list to somebody without handing over the costs, and RC-44 says plainly that
 * you cannot do that. It says setup instead.
 *
 * IT RENDERS ON THE AREA PAGE ONLY, deliberately. The hub is five signposts
 * and was rebuilt out of a 145-item wall precisely to stay scannable; a second
 * sentence per card turns five cards back into prose. The asymmetry is the
 * decision, not an oversight - do not "fix" it by rendering wall on the hub.
 *
 * NO COUNTS IN THIS COPY. `count`, `comingCount` and `featureCount` are all
 * derived from `groups` further down this file. A number typed into a sentence
 * here is a hardcoded claim sitting beside a computed one, which is the drift
 * this file is shaped to prevent. Interpolate or do not count.
 */
export const SECTION_META: Readonly<
	Record<Section, { slug: string; blurb: string; wall: string; lede: string }>
> = {
	'Recipes and costing': {
		slug: 'recipes-and-costing',
		blurb: 'What a plate costs, from the case price up, with the arithmetic shown.',
		wall: 'Somebody wants a number today, and the last time you costed this menu the case price was different.',
		lede: 'A price comes in on a case. Before it is a number you can put in front of a customer, it goes through a yield, a sub-recipe, a portion size and a guest count. Here is that path, with every step of it in view.'
	},
	'Getting prices in': {
		// story: docs/stories/features-getting-prices-in-caterer.story.md
		slug: 'getting-prices-in',
		blurb: 'Upload invoices, price lists and spreadsheets, and look them over before anything saves.',
		wall: 'The new price list arrived as a photograph of a printout. Keying it in is an evening you do not have. Not keying it in means quoting off last month.',
		lede: 'Upload the supplier’s paperwork, hold what it suggests up against the original, and fix anything that looks off. Nothing reaches your ingredient costs until you confirm it.'
	},
	'The day itself': {
		// story: docs/stories/features-the-day-itself-caterer.story.md
		slug: 'the-day-itself',
		blurb: 'The event, the shopping, the prep, the pack, and what actually came through the back door.',
		wall: 'It is five in the morning, your hands are wet, and the sheet taped to the hotel pan has to be right. There is no second trip to the store.',
		lede: 'Confirm the menu and the head count and you get your shopping, prep and pack lists. When the truck comes, check it against the orders you sent. Anything short stays in view until you follow it up.'
	},
	'Compliance and labels': {
		// story: docs/stories/features-compliance-and-labels-caterer.story.md
		slug: 'compliance-and-labels',
		blurb: labelsAvailability.sectionBlurb,
		wall: 'Somebody asks for the numbers on a dish. Roughly is not an answer, and neither is a figure you worked out once and cannot show your working for.',
		lede: labelsAvailability.sectionLede
	},
	'Team, and what it connects to': {
		// story: docs/stories/features-team-and-connections-caterer.story.md
		slug: 'team-and-connections',
		blurb: 'Who can change what, how a new kitchen gets started, and the connections being built.',
		wall: 'You need the crew ready for Saturday, without spending the week learning new software.',
		lede: 'Set up the kitchen, invite your crew, and see what each role can do. Staff can open cost screens, including recipe costs and Analytics. An order page you already opened still reads with no signal, but you need to reconnect to change anything. Connections marked Coming are not included today.'
	}
};

export type FeatureItem = {
	lead: string;
	detail: string;
};

export type FeatureGroup = {
	id: string;
	icon?: 'sage';
	/**
	 * Which of the five plain-language sections this group reads under. The
	 * strings are the /compare row-group titles VERBATIM (src/lib/comparison.ts).
	 * A caterer who reads both pages must meet the same five words in the same
	 * order; if these two lists ever diverge, one of them is wrong.
	 */
	section: Section;
	kicker: string;
	title: string;
	status?: 'available' | 'in-development';
	items: readonly FeatureItem[];
	/** A dedicated guide page, linked under the group on its area page. */
	guide?: { href: string; label: string };
};

export const featureGroups: readonly FeatureGroup[] = [
	{
		/* RC-61, RC-63 to RC-67, 2026-09-27. FIRST in the file because the site
		   went event-first that day: this is the front half of every job, and the
		   rest of this list is what happens after Confirm order. It reads under
		   'The day itself' because the five section names are the /compare row
		   groups verbatim and a sixth section would split both pages.

		   Production rows only (docs/research/2026-09-27-app-inventory.yaml A-01
		   to A-16, B-01 to B-09, C-14). The one-page proposal builder's charge
		   lines, choice groups and payment terms (A-05, A-17, RC-62) are behind
		   the deploy gate and are not described here. The deposit is recorded by
		   hand in production: the verbs for it are ask, record and track. */
		id: 'events',
		section: 'The day itself',
		kicker: 'Events & proposals',
		title: 'From the first call to Confirm order, on one event.',
		items: [
			{ lead: 'New inquiry.', detail: 'Take the call with + New inquiry, even before the date is decided, and set who follows up and when.' },
			{ lead: 'The pipeline.', detail: 'Events sorts every job into Needs attention, Booked · coming up, In pipeline and Past & closed.' },
			{ lead: 'Menu with live food cost.', detail: 'Build the event menu from your costed recipes, a saved menu or a past event, and see food cost as you go.' },
			{ lead: 'Preview, then send.', detail: 'Check exactly what the client will see, choose how long the link stays open, and send the proposal.' },
			{ lead: 'The client decides on their phone.', detail: 'They open the link with no login and press Accept proposal or Ask for changes.' },
			{ lead: 'Remind, extend, withdraw.', detail: 'Send a reminder, extend the link, withdraw the offer, or update it when they ask for changes.' },
			{ lead: 'The agreement.', detail: 'Start from your saved contract template, attach the accepted proposal as Schedule A, and send it for e-signature or keep a copy signed on paper.' },
			{ lead: 'Kitchen draft.', detail: 'Prepare the kitchen draft from their yes; it holds no day and draws no crew until you book the event.' },
			{ lead: 'Deposit, tracked.', detail: `Ask for a deposit and record what arrives as ${depositMethods}, against what you asked for.` },
			{ lead: 'Confirm order is the booking.', detail: 'Confirm order freezes quantities and prices, and the event reads This event is booked.' },
			{ lead: 'Calendar and the day’s room.', detail: 'The calendar counts orders and vans against the limits you set for each day, and an order says whether its day has room.' },
			{ lead: 'Clients.', detail: 'Each client keeps contacts, venues with access notes, and their events and orders, for owners and managers.' }
		]
	},
	{
		id: 'math',
		section: 'Recipes and costing',
		kicker: 'The costing math',
		title: 'From recipe quantities to food cost, with the working shown.',
		items: [
			{ lead: 'One connected plan.', detail: 'Menu times guest count becomes what to buy, cook, and pack, with the cost attached.' },
			{ lead: 'Real unit conversion.', detail: 'Weight, volume, and count convert only through facts you set per ingredient, never a global guess table.' },
			{ lead: 'Whole batches.', detail: 'Batches round up to whole ones and the plan says made and needed, so nothing pretends to be exact.' },
			{ lead: 'Two kinds of yield.', detail: 'Trim loss and cooking loss are separate numbers, and each recipe line says which state its quantity means.' },
			{ lead: 'Byproduct credit.', detail: 'Bones and trim you use elsewhere credit back against the ingredient’s usable cost.' },
			{ lead: 'Missing prices are named.', detail: 'Uncostable lines are listed, and partial totals say what is missing instead of showing zero.' },
			{ lead: 'Lines that reconcile.', detail: 'Every line’s cost contribution adds up to the total. No silent remainder.' },
			{ lead: 'Misc is its own line.', detail: 'Miscellaneous cost is visible and applied once, never buried in a dish.' },
			{ lead: 'Tap-to-see arithmetic.', detail: 'Any plate cost or food-cost percent opens the math behind it.' },
			{ lead: 'Consistent target warnings.', detail: 'Over target reads the same words on every screen.' },
			{ lead: 'Amounts in cents.', detail: 'Costs are calculated in cents so the displayed amounts add up.' },
			{ lead: 'Your units.', detail: 'Quantities print metric or US, rounded the way a cook reads them.' },
			{ lead: 'Scaling preview.', detail: 'Scale a recipe by target amount or by what you have on hand. The saved recipe never changes.' },
			{ lead: 'Sub-recipes checked.', detail: 'Reuse a sauce or other sub-recipe in dishes. A recipe cannot include itself, even through another recipe.' }
		]
	},
	{
		id: 'today',
		section: 'The day itself',
		kicker: 'Today, the home screen',
		title: 'Opens on what needs attention.',
		items: [
			{ lead: 'Attention first.', detail: 'Orders, guests, and deliveries up top. When nothing needs you, it says all clear.' },
			{ lead: 'Ranked tasks.', detail: 'Each attention item opens the exact screen that fixes it.' },
			{ lead: 'Retry a failed panel.', detail: 'If part of Today cannot load, retry that panel while continuing to use the rest.' },
			{ lead: 'Quiet signals.', detail: 'See purchase updates, price changes, imports awaiting review, missing ingredient details and stock needing a count.' },
			{ lead: 'Dismissible checklist.', detail: 'The finish-setting-up list goes away when you say so, and stays away.' },
			{ lead: 'First-use guidance.', detail: 'Quick actions and an empty state that tells a new kitchen where to start.' },
			{ lead: 'Sample data.', detail: 'Loads with one tap, resets cleanly, and spares any rows you renamed.' }
		]
	},
	{
		id: 'ingredients',
		section: 'Recipes and costing',
		kicker: 'Ingredients',
		title: 'What you pay for an ingredient lives on the ingredient.',
		items: [
			{ lead: 'Missing ingredient details.', detail: 'See which ingredients can be costed and which need a price, yield or conversion.' },
			{ lead: 'Shareable filters.', detail: 'Bookmark or share a filtered ingredient list and reopen the same search.' },
			{ lead: 'Fix a price in place.', detail: 'Edit a pack cost right from the list without losing your filters.' },
			{ lead: 'Three ways to add an ingredient.', detail: 'Create from scratch, from the USDA reference, or from a purchase. Unit and yield are your choice, never a guess.' },
			{ lead: 'Mid-recipe creation.', detail: 'Add a missing ingredient from inside the recipe builder without losing what you typed.' },
			{ lead: 'Suppliers anywhere.', detail: 'Add a supplier from any screen that needs one. Same form, same result.' },
			{ lead: 'Purchased vs usable.', detail: 'Each ingredient shows both costs side by side, with its purchase history underneath.' },
			{ lead: 'Compare suppliers.', detail: 'Compare supplier offers per usable pound, kilo or item, cheapest first. Choose which price to use.' },
			{ lead: 'Price source.', detail: 'Every current price says where it came from, from which supplier, effective when.' },
			{ lead: 'Affected recipes and menus.', detail: 'Before a price changes, see every recipe and menu it touches.' },
			{ lead: 'Check before deleting.', detail: 'Before deleting an ingredient, check the recipes that still use it.' },
			{ lead: 'CSV import.', detail: 'Bulk ingredient import with a template whose example rows actually pass.' },
			{ lead: 'USDA reference built in.', detail: 'Yields, densities, and unit weights offered as chips you tap to fill.' },
			{ lead: 'Allergens.', detail: `Tagging for the ${allergenCount} major US allergens rolls up to every recipe, with chef overrides that require a written reason.` },
			{ lead: 'Shelf facts.', detail: 'Storage areas and par levels live on the ingredient. An unset par is unset, not zero.' }
		]
	},
	{
		id: 'recipes',
		section: 'Recipes and costing',
		kicker: 'Recipes',
		title: 'A sauce is one recipe, even in five dishes.',
		items: [
			{ lead: 'One-screen builder.', detail: 'Type, pick, next line. Autocomplete stays under your thumb.' },
			{ lead: 'Live pricing.', detail: 'Set the selling price and the food-cost percent moves as you type, with a nudge when you are over target.' },
			{ lead: 'Private drafts.', detail: 'A blank recipe stays out of the catalog until its first valid save.' },
			{ lead: 'Duplicate.', detail: 'Copy a recipe with its costing facts intact.' },
			{ lead: 'Draft to kitchen view.', detail: 'Readiness checks stand between a private draft and the published version the kitchen opens.' },
			{ lead: 'Earlier published versions.', detail: 'Read the recipe history and open an earlier published version without replacing the current one.' },
			{ lead: 'Filed for the kitchen.', detail: 'Collections, tags, stations and shelves keep a growing recipe book findable.' },
			{ lead: 'Structured methods.', detail: 'Write and reorder method steps instead of burying the working sequence in one paragraph.' },
			{ lead: 'Archive and restore.', detail: 'Owners can publish, archive and restore recipes.' },
			{ lead: 'Learned yield.', detail: 'CostCook proposes yield corrections from your own buying evidence. You apply or reverse, and the evidence is kept.' },
			{ lead: 'Usual ingredient yield.', detail: 'New recipe lines use the ingredient’s usual yield. Existing lines keep their saved yield.' },
			{ lead: 'CSV export.', detail: 'Download one recipe or the whole recipe book as a CSV spreadsheet you can import again.' },
			{ lead: 'Print sheets.', detail: 'A recipe prints clean, stamped with when it was printed.' },
			{ lead: 'Checked deletes.', detail: 'Removing a recipe checks what uses it first.' }
		]
	},
	{
		id: 'menus',
		section: 'Recipes and costing',
		kicker: 'Menus',
		title: 'What each guest gets, priced.',
		items: [
			{ lead: 'Menu workspace.', detail: 'Dishes, portions per guest, and price, saved in one piece.' },
			{ lead: 'Self-pricing.', detail: 'Cost per guest against selling price, plus the price that would hit your target.' },
			{ lead: 'Equipment templates.', detail: 'Each menu carries its equipment counts. Chafers times three stays times three regardless of guests.' },
			{ lead: 'Used-by guards.', detail: 'A menu that orders still use will not delete out from under them.' },
			{ lead: 'Overridable pricing.', detail: 'The menu’s per-guest price is the default an order can override.' },
			{ lead: 'Into the proposal.', detail: 'Start an event from a saved menu and its dishes and food cost come with it into the proposal the client sees.' }
		]
	},
	{
		id: 'orders',
		section: 'The day itself',
		kicker: 'Orders, the event',
		title: 'One order, from the price to the pack-out.',
		items: [
			{ lead: 'Costed before commitment.', detail: 'A new order is a menu, a date, guests, and a price, estimated live as you set it up.' },
			{ lead: 'Three tabs, one plan.', detail: 'Shop, Prep, and Pack all read the same computed plan.' },
			{ lead: 'Pinned money bar.', detail: 'The numbers stay on screen while you work, and guest-count changes autosave quietly.' },
			{ lead: 'Confirm freezes everything.', detail: 'Confirmation saves the plan, calculations and quoted price together. Later price changes do not rewrite that quote.' },
			{ lead: 'Honest reopen.', detail: 'Reopening keeps the frozen prices and says so. Once purchasing starts, reopening is refused.' },
			{ lead: 'Clean duplication.', detail: 'Copy an event into one draft. A double-tap cannot make two.' },
			{ lead: 'Shelf check.', detail: 'Enter the ingredients and prepared batches you have on hand for this order.' },
			{ lead: 'Buy math shown.', detail: 'Every buy line can show need, on hand, pack size, and packs.' },
			{ lead: 'Vendor grouping.', detail: 'The shopping list groups by supplier and by kitchen section.' },
			{ lead: 'Durable check-offs.', detail: 'Checked items stay saved. If the plan changes, affected items need checking again.' },
			{ lead: 'Walk-in mode.', detail: 'On a phone, a running left-to-grab footer follows you through the list.' },
			{ lead: 'Printable lists.', detail: 'Shop, prep, and pack print clean: controls gone, hints kept, columns aligned for a clipboard.' },
			{ lead: 'Leftover nudges.', detail: 'Likely left about a quart, from your recent orders. One at a time, dismissible.' },
			{ lead: 'Quoted vs today.', detail: 'Confirmed orders compare the frozen quote with current prices, and say when they cannot.' },
			{ lead: 'Event cost, after.', detail: 'Compare the confirmed quote with purchases recorded against the event. Differences below the configured dollar threshold are not highlighted.' },
			{ lead: 'Shortfall evidence.', detail: 'Pack lines left open at close become reviewable evidence: short, packed, or not sure.' },
			{ lead: 'Aged plans flagged.', detail: 'An old frozen plan is marked old. It is never silently recomputed.' },
			{ lead: 'Per-order equipment.', detail: 'Hide a template line or add a one-off for this event. The menu template never changes.' },
			{ lead: 'Allergens at pack-out.', detail: 'Pack lists carry allergen badges.' },
			{ lead: 'Orders hub.', detail: 'Filter, search, and read food-cost and status badges across every event.' },
			{ lead: 'Frozen prep notes.', detail: 'Draft orders use the current prep notes. Confirmed orders keep the notes saved when you confirmed.' }
		]
	},
	{
		id: 'purchasing',
		section: 'The day itself',
		kicker: 'Purchase orders & receiving',
		title: 'What you send, and what actually arrives.',
		items: [
			{ lead: 'Per-vendor POs.', detail: 'Confirming an order offers purchase orders per supplier: email, print, or handled by you.' },
			{ lead: 'The email you saw.', detail: 'Review the exact supplier email before sending. Check the order record for whether it was sent or needs a retry.' },
			{ lead: 'Printable POs.', detail: 'Signature lines and stable PO numbers.' },
			{ lead: 'Receiving follows sending.', detail: 'A sent PO creates its receiving checklist for you.' },
			{ lead: 'Deliveries as they are.', detail: 'Short, over, substituted, missing, and unexpected lines each have their own handling.' },
			{ lead: 'All-or-nothing posting.', detail: 'Committing a delivery writes real purchases, and current prices update from what actually arrived.' },
			{ lead: 'Automatic rebuy list.', detail: 'Short and missing lines become a durable follow-up list with handled and reopen states.' },
			{ lead: 'Receive from the purchase order.', detail: 'Receive against any sent purchase order from its own screen.' },
			{ lead: 'Retryable sends.', detail: 'A failed PO send can be retried, with the failure kept on record.' }
		]
	},
	{
		id: 'ledger',
		section: 'Getting prices in',
		kicker: 'Purchases & month cost',
		title: 'What the month should have cost, and did.',
		items: [
			{ lead: 'Four ways to record purchases.', detail: 'Manual entry, invoice import, order log, and receiving, each entry tagged with its source.' },
			{ lead: 'Batch entry.', detail: 'Enter a whole invoice, check its total and save all its lines together.' },
			{ lead: 'Quick log.', detail: 'Or record a single purchase in seconds.' },
			{ lead: 'Corrections, not edits.', detail: 'Add or subtract an amount and give a reason. The original purchase stays in the history.' },
			{ lead: 'Cost as of date.', detail: 'Current cost follows the purchase date, not the order you typed things in.' },
			{ lead: 'Prices that moved.', detail: 'See which prices rose or fell over the dates you choose, with a percentage change and a link to the purchases.' },
			{ lead: 'Monthly cost comparison.', detail: 'Compare ingredient use calculated from orders with purchase spending. Any unexplained difference stays separate from logged waste.' },
			{ lead: 'Waste, valued.', detail: 'Logged waste explains part of the difference using the cost saved with that waste record.' },
			{ lead: 'Stock turnover, when counts support it.', detail: 'Stock turnover is shown only when a trusted count is available at each end of the period.' },
			{ lead: 'Purchases needing attention.', detail: 'Find orders waiting for your action or already sent. Open a sent purchase order to record its delivery.' },
			{ lead: 'Filter purchase history.', detail: 'Filter purchases by ingredient and date. Longer results continue on the next page.' },
			// RC-70, 2026-09-27. Analytics has no page of its own; it answers the
			// same month question from the numbers side, so it lives here.
			{ lead: 'Analytics.', detail: 'Overview says whether this week is on track, What to charge gives the price per guest that reaches your target, and Month review compares the month\u2019s plan with purchases.' }
		]
	},
	{
		id: 'inventory',
		section: 'The day itself',
		kicker: 'Inventory',
		title: 'What is on the shelf, worked out from a real count.',
		items: [
			{ lead: 'Stock on hand.', detail: 'Start with a dated physical count, then add deliveries and subtract recorded use and waste.' },
			{ lead: 'Dated count history.', detail: 'Each count keeps the unit cost recorded at the time. A later correction does not replace the old count.' },
			{ lead: 'Count freshness.', detail: 'See whether stock is Fresh, Stale or Never counted. Missing or old counts do not reduce estimated buying.' },
			{ lead: 'Desktop and phone views.', detail: 'A desktop table and a phone list, with state badges and a need breakdown naming which order wants what.' },
			{ lead: 'Buy what is missing.', detail: 'Subtract trusted stock from order needs to build a printable shopping list. Quantities you override stay separate.' },
			{ lead: 'Shelf value.', detail: 'What the shelf was worth at any date.' }
		]
	},
	{
		id: 'import',
		section: 'Getting prices in',
		kicker: 'Document import',
		title: 'Upload the paperwork, check it against the original, then save.',
		items: [
			{ lead: 'Upload or paste.', detail: 'Drop files, paste text, or photograph paper. The workspace queues and tracks each one.' },
			{ lead: 'Check the document type.', detail: 'Check how the document was identified. Change its type, replace an unreadable file or leave it out.' },
			{ lead: 'Check names and units.', detail: 'Review the names, quantities and units read from the document before they are saved.' },
			{ lead: 'Suggested exact matches.', detail: 'Only when name and unit are certain and the match is exact. Everything doubtful is one human tap.' },
			{ lead: 'Review before saving.', detail: 'Imports live outside your real catalog until you confirm them.' },
			{ lead: 'Keep recipe links when importing again.', detail: 'Recipe imports are checked before saving. Importing an updated recipe keeps its existing menu links.' },
			{ lead: 'Invoices that check themselves.', detail: 'Compare the invoice total with the sum of its lines. Duplicate invoices are flagged.' },
			{ lead: 'Price sheets, row by row.', detail: 'Apply or skip each line. A pack-size change refuses to apply silently. A sheet is an asking price, never a purchase.' },
			{ lead: 'Check every imported row.', detail: 'Review possible duplicates and uncertain matches. Imported rows need the same details as manually entered ones.' },
			{ lead: 'Spreadsheets with different columns.', detail: 'Check which columns hold names, pack sizes and prices before importing. You can see which columns will be ignored.' },
			{ lead: 'Recipe CSVs too.', detail: 'Review the recipe columns before importing. Unreadable rows are shown for you to check.' },
			{ lead: 'Word documents.', detail: 'Import text from a Word document without copying it into another file first.' },
			{ lead: 'The original stays visible.', detail: 'The photo or PDF sits beside the rows awaiting review while you review. Discard really deletes it.' },
			{ lead: 'No duplicate save.', detail: 'Saving the same import twice returns the existing receipt instead of adding duplicate purchases.' },
			{ lead: 'Unreadable means unread.', detail: 'Unreadable text stays beside the suggested details so you can correct it against the source.' },
			{ lead: 'Match supplier names.', detail: 'Suggested matches can connect a supplier’s “Roma tomatoes” to your “Tomato, Roma” ingredient.' },
			{ lead: 'It learns your names.', detail: 'Confirmed supplier names can be remembered for your kitchen’s next import.' },
			{ lead: 'Repeat matching without duplicates.', detail: 'Refreshing ingredient matches does not create duplicate ingredient records.' },
			{ lead: 'Batch imports tested.', detail: 'Tested with 120-item order guides and 20-invoice batches that stay together.' }
		]
	},
	{
		/* RC-73. Built on kitchen-brain main, not receiving mail in production
		   yet; the word comes from src/lib/invoice-email.ts. While Coming the
		   area page renders only items[0].detail, so that line is the summary. */
		id: 'inbox',
		section: 'Getting prices in',
		kicker: 'Invoice email',
		title: 'Suppliers email the invoice. It waits in review.',
		status: invoiceEmailAvailability.isComing ? 'in-development' : 'available',
		items: [
			{ lead: invoiceEmailAvailability.featureLead, detail: invoiceEmailAvailability.featureDetail },
			{ lead: 'A message for your rep.', detail: 'Settings writes the email to send your sales rep, with your address in it.' },
			{ lead: 'Gmail forwarding.', detail: 'For suppliers who only email you; Gmail’s confirmation code shows up in CostCook.' },
			{ lead: 'What became of each email.', detail: 'The Invoice inbox says Invoice, Statement, Duplicate, Held as spam and more, with the reason.' },
			{ lead: 'Nothing counts unchecked.', detail: 'An emailed invoice opens in the same review as an upload.' },
			{ lead: 'A new address when junk starts.', detail: `The old one keeps working for ${spell(inboxLimits.graceDays)} days, or stop it now.` }
		]
	},
	{
		id: 'ordering',
		section: 'The day itself',
		kicker: 'Taking orders',
		title: 'Online orders: the client requests, you approve, their payment confirms.',
		// Status is read from src/lib/ordering.ts, the one place it may change
		// (RC-59, 'yes' since 2026-09-27). Hardcoding it here would let the menu
		// chip and this badge disagree.
		status: orderingAvailability.isComing ? 'in-development' : 'available',
		items: [
			{ lead: orderingAvailability.featureLead, detail: orderingAvailability.featureDetail }
		],
		// The guide carries the lunch film and the settings walk (2026-10-08).
		guide: { href: orderingRoute, label: 'How online ordering works' }
	},
	{
		/* RC-42. Shipped on sandbox/demo: src/lib/core/nutrition.ts carries
		   LABEL_NUTRIENT_CODES and calculateRecipeNutrition() with its
		   complete, partial or incomplete status. It was missing from this list
		   while /compare said Yes, which broke this page's own promise that
		   anything absent here is something CostCook does not do yet. The
		   PRINTED panel stays off: that is a separate coming row. */
		id: 'nutrition',
		section: 'Compliance and labels',
		kicker: 'Nutrition facts',
		title: 'The fifteen numbers an FDA label carries, per recipe.',
		items: [
			{ lead: 'Computed per recipe.', detail: 'All fifteen nutrients an FDA label carries, rolled up through sub-recipes to the dish.' },
			{ lead: 'USDA profiles.', detail: 'Nutrient data comes from USDA FoodData Central and attaches to the ingredient.' },
			{ lead: 'Partial is said out loud.', detail: 'A missing profile or a missing conversion reports the dish as partial rather than totalling an incomplete recipe.' },
			/* RC-50, 2026-08-29. The print page on sandbox/demo,
			   src/routes/catalog/recipes/[id]/nutrition-label, is a live read model
			   with no flag in front of it. Browser print onto label stock; kitchen
			   date labels are the labels group below, also printed by the browser.
			   Develop 7a7e407d9 (2026-10-07) prints only once every source is
			   confirmed and no line is blank; the detail says so. */
			{ lead: 'Printed from the recipe.', detail: 'Once every source is confirmed and no line is blank, Print label makes a sheet with the kitchen name, the panel, the ingredient statement, the allergen line and the print time, for the browser to put on label stock. The sheet says it is a calculated estimate, not a retail-label compliance claim.' }
		]
	},
	{
		/* RC-60, 2026-09-09. Shipped and UNFLAGGED, unlike the labels group below:
		   RELEASE_FEATURE_ENV in the app names label_printing, ordering_integration,
		   square_integration and quickbooks_integration and nothing dietary. Every
		   item traces to src/lib/domain/allergens/guards.ts on kitchen-brain main.

		   NOTHING HERE MAY BECOME A SAFETY PROMISE. The engine's own header is the
		   rule: each outcome is a reason to look at an ingredient, never a promise
		   to a guest. src/lib/dietary.ts owns the wording and the claim guard fails
		   the build on safe, certified, guaranteed and allergen-free. */
		id: 'guards',
		section: 'Compliance and labels',
		kicker: 'Guests\u2019 restrictions',
		title: 'Every dish on the order, checked against who is eating it.',
		items: [
			{ lead: 'Who is eating, on the order.', detail: 'Record a restriction by allergen or by diet, with a label like the bride and a count. It stays on that order and is not carried to the next one unless you ask.' },
			{ lead: 'Five diets.', detail: 'Vegetarian, vegan, halal, kosher and gluten-free, judged from the traits your ingredients carry rather than from their names.' },
			{ lead: 'Three answers, and no fourth.', detail: 'Every dish comes back conflict, check or clear, and the line names the ingredient that caused it.' },
			{ lead: 'It reaches the cook.', detail: 'The answer prints on the order, the prep list and the pack list, which is what somebody reads at five in the morning.' },
			{ lead: 'Coverage is part of the answer.', detail: 'An ingredient nobody has reviewed is never counted as clear, and the order says how many are outstanding.' },
			{ lead: 'Checked at confirm.', detail: 'Confirming freezes the reading it was checked on and carries the date. A later recipe edit does not restate it; a re-check appends a new one.' },
			{ lead: 'The book answers too.', detail: 'The recipe carries its own dietary characteristics, the catalog filters by diet with a held-back count, and the allergen matrix prints for the pass.' }
		]
	},
	{
		id: 'labels',
		section: 'Compliance and labels',
		kicker: 'Labels & printing',
		title: 'Kitchen date and allergen labels, from the prep list.',
		/* Available since 2026-09-27 (RC-35 approved, RC-51). The word comes from
		   src/lib/labels.ts; while it was Coming the area page rendered only
		   items[0].detail, so that line is still the summary. */
		status: labelsAvailability.isComing ? 'in-development' : 'available',
		items: [
			{ lead: labelsAvailability.featureLead, detail: labelsAvailability.featureDetail },
			{ lead: 'Storage condition first.', detail: 'Refrigerated, frozen, thawed or opened, with no default.' },
			{ lead: 'A date you settle.', detail: 'A saved shelf life, a number of days, an exact date, or the made date only.' },
			{ lead: 'One label per container.', detail: 'Numbered, with the event and the kitchen on an order-tied label.' },
			{ lead: 'Frozen for reprints.', detail: 'A reprint reproduces the recorded label even if the recipe has moved.' },
			{ lead: 'Any stock.', detail: 'Sheet, continuous roll, die-cut roll, or your own measurements, chosen once in Settings.' }
		]
	},
	{
		id: 'team',
		section: 'Team, and what it connects to',
		kicker: 'Team & settings',
		title: 'Kitchen settings, and who on the team can do what.',
		items: [
			{ lead: 'Settings that need attention.', detail: 'Settings are grouped by task and show where a decision is needed.' },
			{ lead: 'Preview costing changes.', detail: 'Costing settings preview their impact and name which menus go over target before you save.' },
			{ lead: 'Business details on purchase orders.', detail: 'Business name, reply-to, phone, and delivery address feed straight onto purchase orders.' },
			{ lead: 'Vendor manager.', detail: 'Contacts, per-vendor purchasing method, and insight into what you actually buy from each.' },
			{ lead: 'Metric or imperial.', detail: 'Choose metric or US units for your kitchen.' },
			{ lead: 'Invite by email.', detail: 'Send an email invitation. Invitations expire, and you can revoke them.' },
			{ lead: 'Three team roles.', detail: 'Owner, Manager and Staff control specific actions. Staff can open recipe costs and Analytics, but not order money on Today or the calendar, or the Clients book; custom roles are not available.' },
			{ lead: 'Separate kitchen accounts.', detail: 'Your kitchen account does not give access to another kitchen’s records.' },
			{ lead: 'Unassigned records stay separate.', detail: 'Older records without an assigned kitchen are not added to your account automatically.' }
		]
	},
	{
		id: 'setup',
		section: 'Team, and what it connects to',
		kicker: 'Setup',
		title: 'From empty to a costed first order.',
		items: [
			{ lead: 'Guided setup.', detail: 'Add your kitchen details, ingredients, food facts, recipes and first order. Resume saved progress on another device.' },
			{ lead: 'Ends with a real order.', detail: 'The first-order estimate runs on the same engine as the rest of the app.' },
			{ lead: 'Progress from your saved work.', detail: 'The setup checklist checks the ingredients and recipes you have saved when you reopen it.' },
			{ lead: 'The real builder.', detail: 'The recipe step is the actual recipe builder, not a toy version.' }
		]
	},
	{
		id: 'reliability',
		section: 'Team, and what it connects to',
		kicker: 'Sign-in & reliability',
		title: 'Built for wet hands and thin signal.',
		items: [
			{ lead: 'No passwords.', detail: 'Sign-in is an invitation and a magic link. Links work once and die in eight minutes.' },
			{ lead: 'Access ends now.', detail: 'Remove someone and their access stops on their next request, not their next sign-in.' },
			{ lead: 'Safe return links.', detail: 'Sign-in destinations are checked, so a crafted link cannot bounce you off-site.' },
			{ lead: 'Read saved pages without signal.', detail: 'Previously opened order pages can be read without signal and show when they were saved. Reconnect to make changes.' },
			{ lead: 'Works without JavaScript.', detail: 'Core pages remain readable if browser scripts are unavailable.' },
			{ lead: 'Readable text and touch controls.', detail: 'Text enlargement, contrast and touch targets are checked in interface tests.' },
			{ lead: 'Notices that behave.', detail: 'Important messages remain visible when an action takes you to another page.' },
			{ lead: 'Service status.', detail: 'The service status check does not repeatedly reload kitchen records.' }
		]
	},
	{
		id: 'api',
		section: 'Team, and what it connects to',
		kicker: 'Ordering integrations',
		title: 'External ordering connections.',
		status: 'in-development',
		items: [
			{ lead: 'Not included at launch.', detail: 'External ordering connections are being developed for a later release.' }
		]
	},
	{
		id: 'assistant',
		icon: 'sage',
		section: 'Team, and what it connects to',
		kicker: 'Sage, the in-app assistant',
		title: 'Sage, answering from your own numbers.',
		// Status is read from src/lib/sage.ts, the one place it may change (RC-49).
		status: SAGE_STATUS === 'yes' ? 'available' : 'in-development',
		items: [
			{ lead: 'Ask during setup.', detail: 'Setup keeps an Ask Sage entry, offers questions that fit the stage and records entered so far, and gives you a direct route back.' },
			{ lead: `${spellCapital(sageReadToolCount, { compound: true })} read-only tools, ${spell(sageDraftKinds.length)} drafts.`, detail: `Ask about the shift, orders, recipes, stock, buying or setup. Sage can also draft ${sageDraftKindsOr}, for a manager or owner to approve.` },
			{ lead: 'Sources under the answer.', detail: 'Each answer shows the records and checks behind its numbers, and says when evidence is missing.' },
			{ lead: 'A draft is not a change.', detail: 'Answers read your records. Nothing changes until an Owner or Manager approves the draft, and the records are checked again before saving.' }
		]
	},
	{
		id: 'accounting',
		section: 'Team, and what it connects to',
		kicker: 'Accounting & point of sale',
		title: 'Square and QuickBooks.',
		status: 'in-development',
		items: [
			{ lead: 'Not included at launch.', detail: 'Square and QuickBooks connections are being built. Until they land, nothing here reads from or writes to your books.' }
		]
	}
] as const;

/**
 * The page reads in section order, not file order. Grouping here rather than
 * reordering the array above keeps every group's history intact and makes the
 * section a property of the group instead of a fact about its position.
 * Sections with no groups are dropped, so an empty heading cannot render.
 */
export const featureSections = SECTIONS.map((section) => {
	const groups = featureGroups.filter((group) => group.section === section);
	return {
		section,
		...SECTION_META[section],
		groups,
		/* Shipped items only, so the five section counts sum to featureCount.
		   check-landing-claims asserts that sum: a per-section number that
		   drifts from the headline number is the exact defect this file has
		   produced twice, and it is only catchable by arithmetic. */
		count: groups
			.filter((group) => group.status !== 'in-development')
			.reduce((sum, group) => sum + group.items.length, 0),
		comingCount: groups.filter((group) => group.status === 'in-development').length
	};
}).filter((entry) => entry.groups.length > 0);

/** Slug to section entry, for getStaticPaths and for /features/[section]. */
export const featureSectionBySlug = (slug: string) =>
	featureSections.find((entry) => entry.slug === slug);

export const availableFeatureGroups = featureGroups.filter((group) => group.status !== 'in-development');
export const inDevelopmentFeatureGroups = featureGroups.filter((group) => group.status === 'in-development');
export const featureCount = availableFeatureGroups.reduce((sum, group) => sum + group.items.length, 0);

export type FeatureMenuIcon =
	| 'sage'
	| 'labels'
	| 'nutrition'
	| 'recipe'
	| 'menu'
	| 'ingredient'
	| 'import'
	| 'orders'
	| 'purchasing'
	| 'inventory'
	| 'ledger'
	| 'team';

export type FeatureMenuItem = {
	label: string;
	description: string;
	featureId: string;
	icon: FeatureMenuIcon;
	/** Set only for a group that is in development. The menu renders the Coming chip. */
	coming?: true;
};

export type FeatureMenuSection = {
	label: string;
	items: readonly FeatureMenuItem[];
};

/**
 * The shared header's fast path into the complete feature inventory.
 *
 * Considered Composite; not used because this is a fixed two-level data tree
 * rendered by one navigation component. Recursive part/whole behavior would
 * add indirection without a second depth or a second rendering algorithm.
 */
export const featureMenuSections: readonly FeatureMenuSection[] = [
	{
		label: 'Build and price',
		items: [
			{
				label: 'Recipes & food costing',
				description: 'See yield, portion, and plate-cost math with the work shown.',
				featureId: 'math',
				icon: 'recipe'
			},
			{
				label: 'Menus & quotes',
				description: 'Price a menu before you say the number out loud.',
				featureId: 'menus',
				icon: 'menu'
			},
			{
				label: 'Ingredients & supplier prices',
				description: 'Keep pack costs, yields, and supplier history attached to the food.',
				featureId: 'ingredients',
				icon: 'ingredient'
			},
			{
				label: 'Invoices & price-list import',
				description: 'Bring in paper or spreadsheets, then confirm what changes.',
				featureId: 'import',
				icon: 'import'
			},
			// Added 2026-09-28 (RC-73). It sits after import because it is import's
			// front door. The chip and the destination both read the one word in
			// src/lib/invoice-email.ts.
			{
				label: 'Invoice email',
				description: 'Give suppliers an address; every invoice waits in review.',
				featureId: 'inbox',
				icon: 'import',
				...(invoiceEmailAvailability.isComing ? { coming: true as const } : {})
			},
			// Added 2026-08-29 at the owner's request. Shipped group, so no chip.
			{
				label: 'Nutrition facts & allergens',
				description: 'The fifteen label numbers per portion, from USDA profiles, printable.',
				featureId: 'nutrition',
				icon: 'nutrition'
			},
			// Added 2026-09-09. Shipped group (RC-60), so no chip. It sits after
			// nutrition because it is the same question asked from the other end:
			// nutrition is what is in the dish, this is who is eating it.
			{
				label: 'Guests\u2019 restrictions',
				description: 'Every dish on the order checked against the guests who asked.',
				featureId: 'guards',
				icon: 'nutrition'
			},
			// Added 2026-08-29 at the owner's request. Available since 2026-09-27
			// (RC-35), so the chip is off while src/lib/labels.ts says yes.
			{
				label: 'Labels & printing',
				description: 'Date and allergen stickers from the prep list, frozen for reprints.',
				featureId: 'labels',
				icon: 'labels',
				...(labelsAvailability.isComing ? { coming: true as const } : {})
			}
		]
	},
	{
		label: 'Run the event',
		items: [
			// Added 2026-09-27, FIRST in this column because the event starts at the
			// inquiry (RC-61). Shipped group, so no chip.
			{
				label: 'Events & proposals',
				description: 'Take the inquiry, send the proposal, book the yes with Confirm order.',
				featureId: 'events',
				icon: 'orders'
			},
			// Added 2026-10-08 at the owner's request, after events because a
			// client's own order is the other way work arrives. Shipped (RC-59),
			// so no chip; the tour carries its stop.
			{
				label: 'Online ordering',
				description: 'Clients order from your page or your own website; you approve.',
				featureId: 'ordering',
				icon: 'menu'
			},
			{
				label: 'Orders, shop, prep & pack',
				description: 'Turn one menu and guest count into the plan for the day.',
				featureId: 'orders',
				icon: 'orders'
			},
			{
				label: 'Purchasing & receiving',
				description: 'Send the order, record what arrived, and keep shortfalls visible.',
				featureId: 'purchasing',
				icon: 'purchasing'
			},
			{
				label: 'Inventory',
				description: 'See what is on the shelf before the next shopping list is built.',
				featureId: 'inventory',
				icon: 'inventory'
			},
			{
				label: 'Purchases & month cost',
				description: 'Compare what the month should have cost with what you spent.',
				featureId: 'ledger',
				icon: 'ledger'
			},
			// Added 2026-08-29 at the owner's request. The chip and the destination
			// both read the group's status, so this item cannot say Coming after the
			// area page stops saying it, or the reverse.
			{
				label: 'Sage, the assistant',
				description: 'Ask a question, get an answer from your own records, with its sources.',
				featureId: 'assistant',
				icon: 'sage',
				...(SAGE_STATUS === 'yes' ? {} : { coming: true })
			},
			{
				label: 'Team & access',
				description: 'See the real Owner, Manager and Staff boundaries before you invite the crew.',
				featureId: 'team',
				icon: 'team'
			}
		]
	}
];

// A broken mega-menu is worse than no shortcut. Resolve each curated item
// through the owning area so the header and the five-page feature family can
// change independently without hand-written URLs drifting apart.
const shippedFeatureGroupsById = new Map(
	availableFeatureGroups.map((group) => [group.id, group] as const)
);
const featureGroupsById = new Map(featureGroups.map((group) => [group.id, group] as const));

// Considered Factory Method; not used because these fixed editorial
// destinations vary as route data, not as object-creation behavior.
// Considered Strategy; not used because the destinations
// are static route data, not interchangeable navigation algorithms.
const dedicatedFeatureRoutes = new Map<string, string>([
	['events', '/features/events-and-proposals'],
	['math', '/features/recipes-and-costing'],
	['menus', '/features/menus-and-quotes'],
	['ingredients', '/features/ingredients-and-supplier-prices'],
	['import', '/features/invoices-and-price-list-import'],
	['inbox', invoiceEmailRoute],
	['ordering', orderingRoute],
	['orders', '/features/order-shop-prep-pack'],
	['purchasing', '/features/purchasing-and-receiving'],
	['ledger', '/features/purchases-and-month-cost'],
	['nutrition', '/features/nutrition-facts-and-allergens'],
	['guards', '/features/guest-restrictions-and-dietary-guards'],
	['labels', '/features/labels-and-printing'],
	['inventory', '/features/inventory'],
	['assistant', '/features/sage'],
	['team', '/features/team-and-access']
]);

export const featureMenuHref = (featureId: string, coming = false) => {
	// A shipped item must point at a shipped group. A Coming item may point at
	// an in-development group, and ONLY at one: the chip is what makes the
	// destination honest, so the two are checked together.
	const group = coming ? featureGroupsById.get(featureId) : shippedFeatureGroupsById.get(featureId);
	if (!group) throw new Error(`Feature menu points to missing or unshipped group: ${featureId}`);
	if (coming && group.status !== 'in-development') {
		throw new Error(`Feature menu marks ${featureId} as coming, but the group has shipped. Drop the chip.`);
	}
	const dedicatedRoute = dedicatedFeatureRoutes.get(featureId);
	if (dedicatedRoute) return dedicatedRoute;
	return `/features/${SECTION_META[group.section].slug}#features-${featureId}`;
};

for (const section of featureMenuSections) {
	for (const item of section.items) {
		featureMenuHref(item.featureId, item.coming === true);
	}
}
