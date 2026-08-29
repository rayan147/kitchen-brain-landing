/**
 * The FAQ, as data. story: docs/stories/faq.story.md
 *
 * EVERY ANSWER NAMES ITS ROWS. `claims` lists the release-claim-ledger rows an
 * answer rests on, and scripts/check-landing-claims.mjs fails the build if any
 * of them is not in docs/release-claim-ledger.md. An answer with no row to
 * stand on is not allowed in this file; the fix is a ledger row first, then
 * the answer. Rows are read off the marketed release, never a branch.
 *
 * WHAT AN ANSWER MAY NOT DO. Soften a `no`. Promise a date for a `coming`.
 * Say what another product cannot do (RC-40, RC-47 scope that to /compare).
 * Use the two no-typing phrases the ledger excludes. Say "margin" when the
 * number is food cost.
 *
 * ORDER. Groups run in the order the reader asks them: the money first,
 * because that is what a cold-email visitor opens this page for, then fit,
 * then mechanics, then getting started. Within a group, most-asked first.
 *
 * No pattern: this is a table. The page renders it once; nothing selects
 * among behaviours. Considered a Builder for answers with links; not used
 * because a link is a string with markup, and there are three of them.
 */
import { launchPlan, site } from './site';

export interface FaqEntry {
	/** Stable id for deep links (#cancel). Lowercase, hyphenated. */
	id: string;
	question: string;
	/** Plain paragraphs. A paragraph may contain one inline <a>; nothing else. */
	answer: readonly string[];
	claims: readonly string[];
}

export interface FaqGroup {
	id: string;
	title: string;
	entries: readonly FaqEntry[];
}

const price = launchPlan.displayPrice;
const days = launchPlan.trialDays;

export const faq: readonly FaqGroup[] = [
	{
		id: 'money',
		title: 'The trial, the bill, and leaving',
		entries: [
			{
				id: 'trial',
				question: 'What does the trial actually cost?',
				answer: [
					`Nothing for ${days} days. Stripe takes a card when you start and charges $0 that day. On day sixteen billing begins at ${price} per kitchen workspace unless you cancelled first, and there is no invoice for the ${days} days.`
				],
				claims: ['RC-34']
			},
			{
				id: 'card',
				question: 'Why a card up front?',
				answer: [
					'So that the trial ends the way a subscription ends, by you cancelling or not, rather than by a sales call. The card is held by Stripe and is not charged during the trial.'
				],
				claims: ['RC-34']
			},
			{
				id: 'cancel',
				question: 'How do I cancel?',
				answer: [
					'The workspace owner cancels from Settings, then Billing, through Stripe. No email to me, no notice period, no talking anyone out of it. Cancel inside the trial and nothing is ever charged.'
				],
				claims: ['RC-34']
			},
			{
				id: 'price',
				question: `Is ${price} the price, or a promotion?`,
				answer: [
					`${price} is the launch price and it will not stay there. When it moves it moves for kitchens that sign up after, never for yours. The price you start on is the price you keep.`
				],
				claims: ['RC-34']
			},
			{
				id: 'seats',
				question: 'Do I pay per person?',
				answer: [
					'No. The subscription belongs to the kitchen workspace, not to each teammate. The verified owner manages billing and invites the crew, and teammates are unlimited during launch.'
				],
				claims: ['RC-34']
			},
			{
				id: 'export',
				question: 'Can I take my work with me if I leave?',
				answer: [
					'The whole recipe book exports as a spreadsheet from the recipe list, any time. Ingredient prices do not export yet. That one is on me to build.'
				],
				claims: ['RC-34']
			}
		]
	},
	{
		id: 'fit',
		title: 'Whether it fits your kitchen',
		entries: [
			{
				id: 'who',
				question: 'Who is this for?',
				answer: [
					'Catering and meal prep run by an owner-operator with a small crew. You price jobs that change, you buy for dates rather than a steady week, and nobody down the hall owns the spreadsheet. Everything in the app starts from an event with a guest count.'
				],
				claims: ['RC-01', 'RC-03', 'RC-44']
			},
			{
				id: 'restaurant',
				question: 'I run a restaurant. Will CostCook fit?',
				answer: [
					'Yes, for the part of your business that moves by event, menu, date, and guest count: catering, special dinners, and other changing menus. CostCook carries that plan through recipe costing, shopping, prep, pack, purchasing, and food cost. You can run regular restaurant service alongside that work and still belong here. The <a href="/compare">comparison page</a> shows the product limits that may still matter to you.'
				],
				claims: ['RC-01', 'RC-03', 'RC-21', 'RC-22', 'RC-24', 'RC-25', 'RC-26', 'RC-30', 'RC-40', 'RC-44']
			},
			{
				id: 'locations',
				question: 'We have more than one kitchen. Can each see its own shelf?',
				answer: [
					'No. CostCook is one kitchen workspace. There is no per-site inventory and no roll-up across sites.'
				],
				claims: ['RC-44']
			},
			{
				id: 'permissions',
				question: 'Can I give a cook the prep list without showing them the costs?',
				answer: [
					'No. Owner and manager roles gate setup and billing. Beyond that there is no per-screen control, so anyone on the workspace can open the costs.'
				],
				claims: ['RC-44']
			},
			{
				id: 'fsma',
				question: 'Does it do lot tracking for FSMA 204?',
				answer: ['No. CostCook does not provide the lot tracking a facility under a traceability rule needs.'],
				claims: ['RC-44']
			},
			{
				id: 'labels',
				question: 'Does it do nutrition labels?',
				answer: [
					'Yes. The fifteen nutrients an FDA panel carries are computed per recipe, per portion, from USDA FoodData Central records you match to each ingredient, and a recipe says plainly when a value is missing rather than counting it as zero. Print nutrition label on the recipe makes a sheet with the panel, the ingredient statement and the allergen line for your browser to print onto label stock. The sheet says it is a calculated estimate, not a retail-label compliance claim.',
					'Kitchen date and allergen stickers are a separate thing, built behind a release flag and marked Coming; see the next answer. Dietary characteristics (vegan, gluten-free and the like) are not assessed and nothing is inferred from an ingredient name.'
				],
				claims: ['RC-42', 'RC-47', 'RC-50']
			},
			{
				id: 'label-printing',
				question: 'Does it print kitchen labels with a use-by date?',
				answer: [
					'Built, behind a flag, and marked Coming. Tap Label on the prep list, the pack list, a recipe or an ingredient; choose refrigerated, frozen, thawed or opened; settle the use-by date yourself (a saved shelf life, a number of days, an exact date, or the made date only, and the app never guesses one); count the containers; and print through your browser onto a 30-up sticker sheet, a 58 or 62 mm thermal roll, a 2 by 1 inch die-cut roll or stock you measure. What the sticker said is frozen on the record, so a reprint is the label that went on the container.',
					'It is behind a release flag and not included in the launch subscription, so every mention of it here says Coming. There is no direct connection to a label printer; the output is the print dialog.'
				],
				claims: ['RC-35', 'RC-51']
			},
			{
				id: 'spanish',
				question: 'Is there a Spanish version?',
				answer: ['No. English only.'],
				claims: ['RC-47']
			},
			{
				id: 'sage',
				question: 'What is Sage?',
				answer: [
					'An assistant inside CostCook that answers questions from the records you already keep: what needs attention for Saturday, the orders on a date, why a dish costs what it costs, which prices moved, what came up short in receiving. Every answer shows where its numbers came from, and the one thing it can prepare, a shopping list draft, waits for you to approve it. It cannot reach another kitchen and it never changes a record on its own.',
					'Sage is available now and stays within reach during setup. Its starting questions follow the setup stage and the records entered so far, and a Back to setup action returns you to the unfinished stage. See the <a href="/features/sage">Sage feature guide and video</a>.'
				],
				claims: ['RC-46', 'RC-49']
			},
			{
				id: 'integrations',
				question: 'Does it connect to Square or QuickBooks?',
				answer: [
					'Not in the app you would start today. Both connections are in development and carry no date. The same is true of an API. Anything marked Coming on the <a href="/compare">comparison page</a> is being built, not planned, and none of it is in the launch price.'
				],
				claims: ['RC-35', 'RC-45', 'RC-46']
			},
			{
				id: 'margin',
				question: 'Will it tell me my margin?',
				answer: [
					'It tells you food cost: the theoretical food cost of an event, the food-cost percentage against a target you set, and the selling price that would meet that target. Labor and overhead are not in it, so the number is food cost and it is never called margin.'
				],
				claims: ['RC-04', 'RC-05', 'RC-30']
			}
		]
	},
	{
		id: 'how',
		title: 'How the work moves',
		entries: [
			{
				id: 'quote',
				question: 'How does a quote get its food cost?',
				answer: [
					'Pick a costed menu, enter the guest count and the price per head, and the draft order shows revenue, theoretical food cost, food cost per guest and the percentage against your target, before anything is sent. While it is a draft, those numbers follow your current ingredient prices.'
				],
				claims: ['RC-03', 'RC-04', 'RC-06']
			},
			{
				id: 'frozen',
				question: 'If a supplier price changes after I quote, does my quote change?',
				answer: [
					'No. Confirming an order freezes its plan, its costing inputs and its money. Later prices update your catalog and any draft orders, and the confirmed event shows you quoted-versus-today so you can see the drift, but nothing rewrites it.'
				],
				claims: ['RC-07', 'RC-08']
			},
			{
				id: 'guests',
				question: 'The client added forty guests. What do I retype?',
				answer: [
					'The guest count.',
					'Recipes scale from it, shared ingredients roll together, whole packs recalculate, and the Shop, Prep and Pack tabs stay on the same plan.'
				],
				claims: ['RC-03', 'RC-22', 'RC-24', 'RC-25']
			},
			{
				id: 'shopping',
				question: 'What does the shopping list look like?',
				answer: [
					'Grouped by supplier, rounded to the whole packs you actually buy, with a supplier subtotal. Sub-recipes like a stock or a mirepoix are treated as batches to make rather than things to shop for, and entering what you already have on hand reduces the buying.'
				],
				claims: ['RC-18', 'RC-22']
			},
			{
				id: 'orders',
				question: 'Does it send the purchase orders?',
				answer: [
					'Confirming an order emails one purchase order per supplier, each with its own number, in whole packs. Email is email: the app records the send, and I do not promise delivery into anyone’s inbox.'
				],
				claims: ['RC-26', 'RC-33']
			},
			{
				id: 'receiving',
				question: 'What happens when the truck is short?',
				answer: [
					'Receiving records what the delivery actually was against what you ordered: full, over, short, substituted, missing, or unexpected, with the received value beside the ordered value. Nothing posts until you say so.'
				],
				claims: ['RC-27', 'RC-37']
			},
			{
				id: 'price-back',
				question: 'How does the price I paid get back into my costing?',
				answer: [
					'The newest qualifying purchase, by purchase date, can become the current price of that ingredient, with the receiving it came from on record. It moves future costing and draft orders. It never rewrites a confirmed event.'
				],
				claims: ['RC-08', 'RC-28']
			},
			{
				id: 'multi-event',
				question: 'Can I shop and prep for several events at once?',
				answer: [
					'Yes, for the planning. Two to twelve events can be created together and open a combined Shop, Prep and Pack workspace that totals the shopping and the prep across all of them, with the pack list keeping a column per event. Confirming, freezing prices and sending purchase orders all stay per order; the combined run does not confirm or buy.'
				],
				claims: ['RC-36']
			},
			{
				id: 'inventory',
				question: 'Is the inventory a live count?',
				answer: [
					'No. A physical count sets the baseline; purchases, waste and completed Pack move it from there, and the app tells you how fresh the number is. You can set a par level per ingredient and it will tell you whether you are below it, judged only from a trusted count. It will not buy you back up to par.'
				],
				claims: ['RC-31', 'RC-43']
			}
		]
	},
	{
		id: 'start',
		title: 'Getting started, and getting help',
		entries: [
			{
				id: 'prices-in',
				question: 'How do my supplier prices get in?',
				answer: [
					'Photograph the price list, drop in the PDF or the Word document, upload the spreadsheet, or paste the text. Everything goes through one queue and comes back as staged facts for you to confirm. Nothing is written to your costing until you commit it, and whatever could not be read is quoted back as it appeared rather than guessed. Keying an awkward invoice in by hand is still a supported way to do it.'
				],
				claims: ['RC-09', 'RC-26', 'RC-38', 'RC-39']
			},
			{
				id: 'catalog',
				question: 'Do I have to type every ingredient?',
				answer: [
					'No. A catalog of roughly 1,500 ingredient names with vendor aliases is preloaded as the match target for whatever you import. It carries names and aliases only, never prices, so no cost basis is chosen for you.'
				],
				claims: ['RC-41']
			},
			{
				id: 'recipes-in',
				question: 'How do my recipes get in?',
				answer: [
					'The same queue: a photo, a PDF, a spreadsheet, a document or pasted text, read and staged for you to confirm. Recipes can carry sub-recipes and a trim yield on each line, and the yield moves how much you buy as well as what the plate costs.'
				],
				claims: ['RC-16', 'RC-19', 'RC-38']
			},
			{
				id: 'phone',
				question: 'Does it work on a phone in a walk-in with one bar?',
				answer: [
					'Yes. It was built to be read on a phone mid-shift and it works with no signal and with JavaScript off.'
				],
				claims: ['RC-40']
			},
			{
				id: 'help',
				question: 'Who answers when I write?',
				answer: [
					`I do. Email <a href="mailto:${site.email}">${site.email}</a> or call ${site.phone}. Inside the app, Contact support sends your account email and the screen you are on with the message.`
				],
				claims: ['RC-01']
			},
			{
				id: 'demo',
				question: 'Can someone run my menu through it before I start?',
				answer: [
					'Yes. Book fifteen minutes and bring one menu and a guest count. We put it through and you see the shopping list, the prep sheet, the pack list and the food cost it gives back. Your numbers, not a sales demo’s.'
				],
				claims: ['RC-01']
			}
		]
	}
];

export const faqCount = faq.reduce((sum, group) => sum + group.entries.length, 0);
