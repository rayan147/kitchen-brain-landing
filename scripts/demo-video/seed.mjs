// Seeds the scratch demo DB with the landing page's chicken-piccata world.
// Run: node seed.mjs (from the scratchpad dir)
import { createClient } from '/home/rayan147/kitchen-brain-deploy/node_modules/@libsql/client/lib-esm/node.js';

const db = createClient({
	url: 'file:/tmp/claude-1000/-home-rayan147-kitchen-brain/cc4d86d5-ccfd-4404-8245-dd19e1d7d6dc/scratchpad/demo.db'
});

const LB = 453.592;
const run = (sql, args = []) => db.execute({ sql, args });

// Supplier
await run(`INSERT INTO suppliers (name) VALUES ('Restaurant Depot')`);

// Ingredients: name, base_unit, pack_name, qty, unit, base, cost_cents, density, unit_weight
const ingredients = [
	['Chicken breast, boneless', 'g', '40 lb case', 40, 'lb', 40 * LB, 11800, null, null],
	['Lemons', 'each', 'case of 95', 95, 'each', 95, 4200, null, 85],
	['Capers, nonpareil', 'g', '32 oz jar', 32, 'oz', 907.185, 799, null, null],
	['Butter, unsalted', 'g', '36 lb case', 36, 'lb', 36 * LB, 9200, null, null],
	['Flour, all-purpose', 'g', '50 lb bag', 50, 'lb', 50 * LB, 1850, null, null],
	['Olive oil, blended', 'ml', '1 gal jug', 3785, 'ml', 3785, 3400, 0.91, null],
	['Potatoes, Yukon gold', 'g', '50 lb sack', 50, 'lb', 50 * LB, 2400, null, null],
	['Parsley, flat-leaf', 'g', 'case of 12 bunches', 1360, 'g', 1360, 1800, null, null]
];
for (const [name, base, packName, qty, unit, sizeBase, cost, density, uw] of ingredients) {
	await run(
		`INSERT INTO ingredients (name, base_unit, category, supplier_id, density_g_per_ml, unit_weight_g,
		 pack_name, pack_size_qty, pack_size_unit, pack_size_base, pack_cost_cents)
		 VALUES (?, ?, 'demo', 1, ?, ?, ?, ?, ?, ?, ?)`,
		[name, base, density, uw, packName, qty, unit, sizeBase, cost]
	);
}
const ing = {};
for (const row of (await run(`SELECT id, name FROM ingredients`)).rows) ing[row.name] = row.id;

// Purchases (what was actually paid — food cost's ground truth)
const purchases = [
	[ing['Chicken breast, boneless'], '2026-07-08', 2, 23800, 'weekly'],
	[ing['Lemons'], '2026-07-08', 1, 4150, null],
	[ing['Capers, nonpareil'], '2026-07-01', 3, 2300, null],
	[ing['Butter, unsalted'], '2026-07-08', 1, 9350, null],
	[ing['Flour, all-purpose'], '2026-06-24', 1, 1850, null],
	[ing['Olive oil, blended'], '2026-07-01', 2, 6700, null],
	[ing['Potatoes, Yukon gold'], '2026-07-08', 2, 4700, null],
	[ing['Parsley, flat-leaf'], '2026-07-10', 1, 1800, null]
];
for (const [iid, date, packs, cost, note] of purchases) {
	await run(`INSERT INTO purchases (ingredient_id, date, packs, total_cost_cents, note) VALUES (?, ?, ?, ?, ?)`, [
		iid, date, packs, cost, note
	]);
}

// Sub-recipe: caper-lemon butter (batch: 5 qt)
await run(
	`INSERT INTO recipes (name, kind, batch_output_qty, batch_output_unit) VALUES ('Caper-lemon butter', 'sub', 5, 'qt')`
);
const subId = (await run(`SELECT id FROM recipes WHERE name='Caper-lemon butter'`)).rows[0].id;
const subLines = [
	[ing['Butter, unsalted'], 2800, 'g', 100, 'cubed, cold'],
	[ing['Capers, nonpareil'], 700, 'g', 100, 'drained'],
	[ing['Lemons'], 12, 'each', 45, 'juiced'],
	[ing['Parsley, flat-leaf'], 120, 'g', 80, 'chopped fine']
];
let sort = 0;
for (const [iid, qty, unit, yieldPct, note] of subLines) {
	await run(
		`INSERT INTO recipe_lines (recipe_id, sort, ingredient_id, qty, unit, yield_pct, prep_note) VALUES (?, ?, ?, ?, ?, ?, ?)`,
		[subId, sort++, iid, qty, unit, yieldPct, note]
	);
}

// Dish: chicken piccata (per portion), $11 sell
await run(
	`INSERT INTO recipes (name, kind, selling_price_cents, target_food_cost_pct) VALUES ('Chicken piccata', 'dish', 1100, 30)`
);
const piccataId = (await run(`SELECT id FROM recipes WHERE name='Chicken piccata'`)).rows[0].id;
sort = 0;
const piccataLines = [
	['ing', ing['Chicken breast, boneless'], 170, 'g', 88, 'pounded to 1/4 in, 6 oz portion'],
	['ing', ing['Flour, all-purpose'], 15, 'g', 100, 'for dredging'],
	['ing', ing['Olive oil, blended'], 15, 'ml', 100, null],
	['sub', subId, 25, 'ml', 100, 'to finish']
];
for (const [kind, refId, qty, unit, yieldPct, note] of piccataLines) {
	await run(
		`INSERT INTO recipe_lines (recipe_id, sort, ingredient_id, sub_recipe_id, qty, unit, yield_pct, prep_note)
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
		[piccataId, sort++, kind === 'ing' ? refId : null, kind === 'sub' ? refId : null, qty, unit, yieldPct, note]
	);
}

// Dish: roasted potatoes
await run(
	`INSERT INTO recipes (name, kind, selling_price_cents, target_food_cost_pct) VALUES ('Crispy Yukon potatoes', 'dish', 400, 30)`
);
const potId = (await run(`SELECT id FROM recipes WHERE name='Crispy Yukon potatoes'`)).rows[0].id;
sort = 0;
const potLines = [
	[ing['Potatoes, Yukon gold'], 200, 'g', 90, 'quartered'],
	[ing['Olive oil, blended'], 8, 'ml', 100, null],
	[ing['Parsley, flat-leaf'], 3, 'g', 80, 'chopped']
];
for (const [iid, qty, unit, yieldPct, note] of potLines) {
	await run(
		`INSERT INTO recipe_lines (recipe_id, sort, ingredient_id, qty, unit, yield_pct, prep_note) VALUES (?, ?, ?, ?, ?, ?, ?)`,
		[potId, sort++, iid, qty, unit, yieldPct, note]
	);
}

// Menu
await run(`INSERT INTO menus (name) VALUES ('Piccata dinner')`);
const menuId = (await run(`SELECT id FROM menus WHERE name='Piccata dinner'`)).rows[0].id;
await run(`INSERT INTO menu_items (menu_id, recipe_id, portions_per_guest) VALUES (?, ?, 1)`, [menuId, piccataId]);
await run(`INSERT INTO menu_items (menu_id, recipe_id, portions_per_guest) VALUES (?, ?, 1)`, [menuId, potId]);

console.log('seeded:', { piccataId, subId, potId, menuId });
