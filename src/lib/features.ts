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
export type FeatureItem = {
	lead: string;
	detail: string;
};

export type FeatureGroup = {
	id: string;
	kicker: string;
	title: string;
	status?: 'available' | 'in-development';
	items: readonly FeatureItem[];
};

export const featureGroups: readonly FeatureGroup[] = [
	{
		id: 'math',
		kicker: 'The costing math',
		title: 'One engine, whole numbers, shown work.',
		items: [
			{ lead: 'One production engine.', detail: 'Menu times guest count becomes what to buy, cook, and pack, with the cost attached.' },
			{ lead: 'Real unit conversion.', detail: 'Weight, volume, and count convert only through facts you set per ingredient, never a global guess table.' },
			{ lead: 'Whole batches.', detail: 'Batches round up to whole ones and the plan says made and needed, so nothing pretends to be exact.' },
			{ lead: 'Two kinds of yield.', detail: 'Trim loss and cooking loss are separate numbers, and each recipe line says which state its quantity means.' },
			{ lead: 'Byproduct credit.', detail: 'Bones and trim you use elsewhere credit back against the ingredient’s usable cost.' },
			{ lead: 'Missing prices are named.', detail: 'Uncostable lines are listed, and partial totals say what is missing instead of showing zero.' },
			{ lead: 'Lines that reconcile.', detail: 'Every line’s cost contribution adds up to the total. No silent remainder.' },
			{ lead: 'Misc is its own line.', detail: 'Miscellaneous cost is visible and applied once, never buried in a dish.' },
			{ lead: 'Tap-to-see arithmetic.', detail: 'Any plate cost or food-cost percent opens the math behind it.' },
			{ lead: 'One percent vocabulary.', detail: 'Over target reads the same words on every screen.' },
			{ lead: 'Whole-cent money.', detail: 'Money is integer cents end to end. No floating-point drift.' },
			{ lead: 'Your units.', detail: 'Quantities print metric or US, rounded the way a cook reads them.' },
			{ lead: 'Scaling preview.', detail: 'Scale a recipe by target amount or by what you have on hand. The saved recipe never changes.' },
			{ lead: 'Safe nesting.', detail: 'Sub-recipes nest inside dishes, and cycles are refused before they can corrupt a cost.' }
		]
	},
	{
		id: 'today',
		kicker: 'Today, the home screen',
		title: 'Opens on what needs attention.',
		items: [
			{ lead: 'Attention first.', detail: 'Orders, guests, and deliveries up top. When nothing needs you, it says all clear.' },
			{ lead: 'Ranked tasks.', detail: 'Each attention item opens the exact screen that fixes it.' },
			{ lead: 'Partial failure survives.', detail: 'If one panel breaks, the rest of Today still loads, with a retry on just the broken one.' },
			{ lead: 'Quiet signals.', detail: 'Purchase pulse, price drift, staged imports, catalog blockers, inventory attention. No digging.' },
			{ lead: 'Dismissible checklist.', detail: 'The finish-setting-up list goes away when you say so, and stays away.' },
			{ lead: 'First-use guidance.', detail: 'Quick actions and an empty state that tells a new kitchen where to start.' },
			{ lead: 'Sample data.', detail: 'Loads with one tap, resets cleanly, and spares any rows you renamed.' }
		]
	},
	{
		id: 'ingredients',
		kicker: 'Ingredients',
		title: 'Buying facts that stay attached to the food.',
		items: [
			{ lead: 'Catalog health.', detail: 'The catalog opens with what is costable and what still needs a fact.' },
			{ lead: 'Shareable filters.', detail: 'Search and filters mirror into the URL, so a filtered list can be bookmarked or sent.' },
			{ lead: 'Fix a price in place.', detail: 'Edit a pack cost right from the list without losing your filters.' },
			{ lead: 'Three doors in.', detail: 'Create from scratch, from the USDA reference, or from a purchase. Unit and yield are your choice, never a guess.' },
			{ lead: 'Mid-recipe creation.', detail: 'Add a missing ingredient from inside the recipe builder without losing what you typed.' },
			{ lead: 'Suppliers anywhere.', detail: 'Add a supplier from any screen that needs one. Same form, same result.' },
			{ lead: 'Purchased vs usable.', detail: 'Each ingredient shows both costs side by side, with its purchase history underneath.' },
			{ lead: 'Compare suppliers.', detail: 'Concurrent offers compare per usable unit, cheapest first, adopted with a tap.' },
			{ lead: 'Price provenance.', detail: 'Every current price says where it came from, from which supplier, effective when.' },
			{ lead: 'Blast radius.', detail: 'Before a price changes, see every recipe and menu it touches.' },
			{ lead: 'Guarded deletes.', detail: 'Deleting an ingredient walks its uses first. Nothing orphans quietly.' },
			{ lead: 'CSV import.', detail: 'Bulk ingredient import with a template whose example rows actually pass.' },
			{ lead: 'USDA reference built in.', detail: 'Yields, densities, and unit weights offered as chips you tap to fill.' },
			{ lead: 'Allergens.', detail: 'Fourteen-allergen tagging rolls up to every recipe, with chef overrides that require a written reason.' },
			{ lead: 'Shelf facts.', detail: 'Storage areas and par levels live on the ingredient. An unset par is unset, not zero.' }
		]
	},
	{
		id: 'recipes',
		kicker: 'Recipes',
		title: 'A sauce is one recipe, even in five dishes.',
		items: [
			{ lead: 'One-screen builder.', detail: 'Type, pick, next line. Autocomplete stays under your thumb.' },
			{ lead: 'Live pricing.', detail: 'Set the selling price and the food-cost percent moves as you type, with a nudge when you are over target.' },
			{ lead: 'Private drafts.', detail: 'A blank recipe stays out of the catalog until its first valid save.' },
			{ lead: 'Duplicate.', detail: 'Copy a recipe with its costing facts intact.' },
			{ lead: 'Full lifecycle.', detail: 'Switch dish and sub-recipe kinds, publish, rename, and change batch yield without starting over.' },
			{ lead: 'Learned yield.', detail: 'CostCook proposes yield corrections from your own buying evidence. You apply or reverse, and the evidence is kept.' },
			{ lead: 'Inherited defaults.', detail: 'New lines take the ingredient’s usual yield. Old lines never rewrite.' },
			{ lead: 'CSV export.', detail: 'The whole book or one recipe, in columns that round-trip through the importer.' },
			{ lead: 'Print sheets.', detail: 'A recipe prints clean, stamped with when it was printed.' },
			{ lead: 'Checked deletes.', detail: 'Removing a recipe checks what uses it first.' }
		]
	},
	{
		id: 'menus',
		kicker: 'Menus',
		title: 'What each guest gets, priced.',
		items: [
			{ lead: 'Menu workspace.', detail: 'Dishes, portions per guest, and price, saved in one piece.' },
			{ lead: 'Self-pricing.', detail: 'Cost per guest against selling price, plus the price that would hit your target.' },
			{ lead: 'Equipment templates.', detail: 'Each menu carries its equipment counts. Chafers times three stays times three regardless of guests.' },
			{ lead: 'Used-by guards.', detail: 'A menu that orders still use will not delete out from under them.' },
			{ lead: 'Overridable pricing.', detail: 'The menu’s per-guest price is the default an order can override.' }
		]
	},
	{
		id: 'orders',
		kicker: 'Orders, the event',
		title: 'Quote it, freeze it, run it.',
		items: [
			{ lead: 'Costed before commitment.', detail: 'A new order is a menu, a date, guests, and a price, estimated live as you set it up.' },
			{ lead: 'Three tabs, one plan.', detail: 'Shop, Prep, and Pack all read the same computed plan.' },
			{ lead: 'Pinned money bar.', detail: 'The numbers stay on screen while you work, and guest-count changes autosave quietly.' },
			{ lead: 'Confirm freezes everything.', detail: 'Plan, math, and money snapshot in one transaction. The quote you gave is the quote that stays.' },
			{ lead: 'Honest reopen.', detail: 'Reopening keeps the frozen prices and says so. Once purchasing starts, reopening is refused.' },
			{ lead: 'Clean duplication.', detail: 'Copy an event into one draft. A double-tap cannot make two.' },
			{ lead: 'Shelf check.', detail: 'On-hand steppers for ingredients and batches, scoped to the order so they cannot go stale.' },
			{ lead: 'Buy math shown.', detail: 'Every buy line can show need, on hand, pack size, and packs.' },
			{ lead: 'Vendor grouping.', detail: 'The shopping list groups by supplier and by kitchen section.' },
			{ lead: 'Durable check-offs.', detail: 'Checks persist on the server, and a plan change clears exactly the checks it staled.' },
			{ lead: 'Walk-in mode.', detail: 'On a phone, a running left-to-grab footer follows you through the list.' },
			{ lead: 'Printable lists.', detail: 'Shop, prep, and pack print clean: controls gone, hints kept, columns aligned for a clipboard.' },
			{ lead: 'Leftover nudges.', detail: 'Likely left about a quart, from your recent orders. One at a time, dismissible.' },
			{ lead: 'Quoted vs today.', detail: 'Confirmed orders compare the frozen quote with current prices, and say when they cannot.' },
			{ lead: 'Event cost, after.', detail: 'The frozen quote against actual attributed spend, with a materiality floor in dollars.' },
			{ lead: 'Shortfall evidence.', detail: 'Pack lines left open at close become reviewable evidence: short, packed, or not sure.' },
			{ lead: 'Aged plans flagged.', detail: 'An old frozen plan is marked old. It is never silently recomputed.' },
			{ lead: 'Per-order equipment.', detail: 'Hide a template line or add a one-off for this event. The menu template never changes.' },
			{ lead: 'Allergens at pack-out.', detail: 'Pack lists carry allergen badges.' },
			{ lead: 'Orders hub.', detail: 'Filter, search, and read food-cost and status badges across every event.' },
			{ lead: 'Frozen prep notes.', detail: 'Drafts read live prose. Confirmed orders read only the copy frozen at confirmation.' }
		]
	},
	{
		id: 'purchasing',
		kicker: 'Purchase orders & receiving',
		title: 'What you send, and what actually arrives.',
		items: [
			{ lead: 'Per-vendor POs.', detail: 'Confirming an order offers purchase orders per supplier: email, print, or handled by you.' },
			{ lead: 'The email you saw.', detail: 'The PO review shows the exact body sent, and the record is written only after the send succeeds.' },
			{ lead: 'Printable POs.', detail: 'Signature lines and stable PO numbers.' },
			{ lead: 'Receiving follows sending.', detail: 'A sent PO creates its receiving checklist for you.' },
			{ lead: 'Deliveries as they are.', detail: 'Short, over, substituted, missing, and unexpected lines each have their own handling.' },
			{ lead: 'All-or-nothing posting.', detail: 'Committing a delivery writes real purchases, and current prices update from what actually arrived.' },
			{ lead: 'Automatic rebuy list.', detail: 'Short and missing lines become a durable follow-up list with handled and reopen states.' },
			{ lead: 'A door per PO.', detail: 'Receive against any sent purchase order from its own screen.' },
			{ lead: 'Retryable sends.', detail: 'A failed PO send can be retried, with the failure kept on record.' }
		]
	},
	{
		id: 'ledger',
		kicker: 'Purchases & month cost',
		title: 'What the month should have cost, and did.',
		items: [
			{ lead: 'One ledger, four doors.', detail: 'Manual entry, invoice import, order log, and receiving, each entry tagged with its source.' },
			{ lead: 'Batch entry.', detail: 'A whole invoice of lines, priced live, committed all or nothing.' },
			{ lead: 'Quick log.', detail: 'Or record a single purchase in seconds.' },
			{ lead: 'Corrections, not edits.', detail: 'A signed adjustment with a required reason joins the record. History is never restated.' },
			{ lead: 'Cost as of date.', detail: 'Current cost follows the purchase date, not the order you typed things in.' },
			{ lead: 'Prices that moved.', detail: 'Drift over your chosen window with signed percents, one tap from the summary to the full review.' },
			{ lead: 'Month verdict.', detail: 'Theoretical usage against actual spend, with the unaccounted gap named, never auto-blamed as waste.' },
			{ lead: 'Waste, valued.', detail: 'Logged waste re-labels part of the gap at frozen sticker cost. No reason taxonomy to maintain.' },
			{ lead: 'Turnover, earned.', detail: 'Inventory turnover computes only when two trusted counts bracket the period.' },
			{ lead: 'Working rails.', detail: 'Waiting-on-you and sent-order lists, and every sent PO doubles as its receiving door.' },
			{ lead: 'Filters that scale.', detail: 'Ledger filters by ingredient and date, with paging past 50 rows.' }
		]
	},
	{
		id: 'inventory',
		kicker: 'Inventory',
		title: 'The shelf, computed, never guessed.',
		items: [
			{ lead: 'Computed on-hand.', detail: 'Derived from dated movements. A count overrules from its date forward. No running total to drift.' },
			{ lead: 'Append-only counts.', detail: 'Pack cost freezes at count time, so a back-dated correction cannot restate history.' },
			{ lead: 'A trust gate.', detail: 'Fresh, stale, or never counted is said out loud. Estimates the math cannot back are refused, not invented.' },
			{ lead: 'Two shapes.', detail: 'A desktop table and a phone list, with state badges and a need breakdown naming which order wants what.' },
			{ lead: 'Gap shopping list.', detail: 'Need minus trusted shelf becomes one durable list, rebuilt in place, chef overrides kept separate, printable.' },
			{ lead: 'Shelf value.', detail: 'What the shelf was worth at any date.' }
		]
	},
	{
		id: 'import',
		kicker: 'Import & AI intake',
		title: 'Paper in, staged facts out, you confirm.',
		items: [
			{ lead: 'Any door in.', detail: 'Drop files, paste text, or photograph paper. The workspace queues and tracks each one.' },
			{ lead: 'Classified, timed, retryable.', detail: 'Six document kinds with confidence scores, OCR fallback, and reclassify, replace, or exclude.' },
			{ lead: 'AI on a leash.', detail: 'Extraction runs behind a strict schema. Units arrive as text for review, never trusted ids.' },
			{ lead: 'A careful auto-accept.', detail: 'Only when name and unit are certain and the match is exact. Everything doubtful is one human tap.' },
			{ lead: 'Staging, not writing.', detail: 'Imports live outside your real catalog until you confirm them.' },
			{ lead: 'Safe recipe commits.', detail: 'One transaction, cycle-checked first. Re-importing replaces in place so menus stay linked.' },
			{ lead: 'Invoices that check themselves.', detail: 'Stated totals compare against computed ones, and duplicates are fingerprinted.' },
			{ lead: 'Price sheets, row by row.', detail: 'Apply or skip each line. A pack-size change refuses to apply silently. A sheet is an asking price, never a purchase.' },
			{ lead: 'Bulk add with verdicts.', detail: 'Duplicate-match scores are shown, ambiguity is surfaced, and every row passes the same validation as the manual form.' },
			{ lead: 'Foreign CSVs.', detail: 'The model proposes a column mapping, a deterministic parser reads every cell, ignored columns are disclosed.' },
			{ lead: 'Recipe CSVs too.', detail: 'Same mapping pattern. Unreadable rows are surfaced, never dropped.' },
			{ lead: 'Word documents.', detail: 'DOCX parses deterministically, with no model involved at all.' },
			{ lead: 'The original stays visible.', detail: 'The photo or PDF sits beside the staged rows while you review. Discard really deletes it.' },
			{ lead: 'Receipts, not repeats.', detail: 'Committing twice by accident replays the same receipt. Never double rows.' },
			{ lead: 'Unreadable means unread.', detail: 'What the model could not read is quoted back verbatim, next to what it staged.' },
			{ lead: 'Semantic matching.', detail: 'Vector search tuned against labelled fixtures, so Roma tomatoes find tomato, Roma.' },
			{ lead: 'It learns your names.', detail: 'Every confirm teaches an alias per kitchen. The review pile shrinks with use.' },
			{ lead: 'Safe re-runs.', detail: 'Embedding backfill is idempotent. Running it again is safe, not a bill.' },
			{ lead: 'Caterer scale.', detail: 'Tested with 120-item order guides and 20-invoice batches that stay together.' }
		]
	},
	{
		id: 'labels',
		kicker: 'Labels & printing',
		title: 'In development',
		status: 'in-development',
		items: [
			{ lead: 'Not included at launch.', detail: 'Kitchen label workflows and printer-ready output are being prepared for a later release.' }
		]
	},
	{
		id: 'team',
		kicker: 'Team & settings',
		title: 'Five cards, not a maze.',
		items: [
			{ lead: 'A settings hub.', detail: 'Five category cards with live attention lines pointing at what needs a decision.' },
			{ lead: 'Knobs with consequences.', detail: 'Costing settings preview their impact and name which menus go over target before you save.' },
			{ lead: 'Profile is letterhead.', detail: 'Business name, reply-to, phone, and delivery address feed straight onto purchase orders.' },
			{ lead: 'Vendor manager.', detail: 'Contacts, per-vendor purchasing method, and insight into what you actually buy from each.' },
			{ lead: 'Metric or imperial.', detail: 'A per-kitchen choice, read on every request.' },
			{ lead: 'Magic-link invites.', detail: 'Invite teammates by email, with expiry and revoke.' },
			{ lead: 'Isolation by construction.', detail: 'Every kitchen’s data is scoped per request. Cross-kitchen reads are refused, and unscoped writes fail loudly.' },
			{ lead: 'No guessed ownership.', detail: 'Records from before a kitchen existed stay marked unowned rather than being assigned to one.' }
		]
	},
	{
		id: 'setup',
		kicker: 'Setup',
		title: 'From empty to a costed first order.',
		items: [
			{ lead: 'Six guided stages.', detail: 'Resumable on any device, role-aware, and never duplicating what you already made.' },
			{ lead: 'Ends with a real order.', detail: 'The first-order estimate runs on the same engine as the rest of the app.' },
			{ lead: 'A checklist that cannot lie.', detail: 'Progress is derived from your actual catalog on every load, so it cannot go stale.' },
			{ lead: 'The real builder.', detail: 'The recipe step is the actual recipe builder, not a toy version.' }
		]
	},
	{
		id: 'reliability',
		kicker: 'Sign-in & reliability',
		title: 'Built for wet hands and thin signal.',
		items: [
			{ lead: 'No passwords.', detail: 'Sign-in is an invitation and a magic link. Links work once and die in eight minutes.' },
			{ lead: 'Access ends now.', detail: 'Remove someone and their access stops on their next request, not their next sign-in.' },
			{ lead: 'Safe return links.', detail: 'Sign-in destinations are checked, so a crafted link cannot bounce you off-site.' },
			{ lead: 'Works in the walk-in.', detail: 'Order pages keep working with no signal, marked with when they were cached.' },
			{ lead: 'Works without JavaScript.', detail: 'Every page renders on the server first. Scripts improve it, they do not carry it.' },
			{ lead: 'Accessibility, pinned.', detail: '44-pixel targets, AA contrast, and 200 percent text survival are held by tests, not intentions.' },
			{ lead: 'Notices that behave.', detail: 'Messages survive redirects, never repeat, and work without JS.' },
			{ lead: 'A cheap health check.', detail: 'The status endpoint answers from a short cache, so a flood cannot amplify into database traffic.' }
		]
	},
	{
		id: 'api',
		kicker: 'Ordering integrations',
		title: 'In development',
		status: 'in-development',
		items: [
			{ lead: 'Not included at launch.', detail: 'External ordering connections are being developed for a later release.' }
		]
	}
] as const;

export const availableFeatureGroups = featureGroups.filter((group) => group.status !== 'in-development');
export const inDevelopmentFeatureGroups = featureGroups.filter((group) => group.status === 'in-development');
export const featureCount = availableFeatureGroups.reduce((sum, group) => sum + group.items.length, 0);

export type FeatureMenuIcon =
	| 'recipe'
	| 'menu'
	| 'ingredient'
	| 'import'
	| 'orders'
	| 'purchasing'
	| 'inventory'
	| 'ledger';

export type FeatureMenuItem = {
	label: string;
	description: string;
	featureId: string;
	icon: FeatureMenuIcon;
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
			}
		]
	},
	{
		label: 'Run the event',
		items: [
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
			}
		]
	}
];

// A broken mega-menu is worse than no shortcut. Fail the build if its curated
// destinations drift away from the shipped feature inventory.
const shippedFeatureIds = new Set(availableFeatureGroups.map((group) => group.id));
for (const section of featureMenuSections) {
	for (const item of section.items) {
		if (!shippedFeatureIds.has(item.featureId)) {
			throw new Error(`Feature menu points to missing or unshipped group: ${item.featureId}`);
		}
	}
}
