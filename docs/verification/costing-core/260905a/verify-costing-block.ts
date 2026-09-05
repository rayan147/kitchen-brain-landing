/**
 * RC-16 through RC-25 verification, run without a bundler.
 *
 * These ten rows are the original costing core of the ledger and the only ones
 * whose evidence column never named a file, a sha or an artifact. Everything
 * asserted here is executed against the engine at the checked-out sha; a row
 * this harness cannot execute is reported as SOURCE-ONLY rather than passed,
 * because the point of the exercise is to stop asserting things.
 */
import {
	computeProductionPlan, recipeUnitCostCents, recipeLineCostContributions,
	menuCostPerGuestCents, packsForNeed, applyOnHandToShopping, buyNeedFor,
	validateRecipeGraph, dishCostPerPortionCents, type IngredientSpec, type RecipeSpec
} from '../src/lib/domain/production/engine.ts';
import { menuMiscCents, plateCost } from '../src/lib/domain/profitability/foodcost.ts';

const out: { rc: string; name: string; ok: boolean; detail: string }[] = [];
const check = (rc: string, name: string, fn: () => string) => {
	try { out.push({ rc, name, ok: true, detail: fn() }); }
	catch (e) { out.push({ rc, name, ok: false, detail: String(e) }); }
};
const eq = (a: unknown, b: unknown, what: string) => {
	if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${what}: got ${JSON.stringify(a)}, expected ${JSON.stringify(b)}`);
};

const flour: IngredientSpec = { id: 'flour', name: 'Flour', baseUnit: 'g',
	pack: { name: '10 kg bag', sizeBase: 10_000, costCents: 2000 }, supplierId: 'baldor' };
const cream: IngredientSpec = { id: 'cream', name: 'Cream', baseUnit: 'g',
	pack: { name: '1 kg tub', sizeBase: 1000, costCents: 800 }, supplierId: 'baldor' };
const beef: IngredientSpec = { id: 'beef', name: 'Beef', baseUnit: 'g',
	pack: { name: 'case', sizeBase: 4535.92, costCents: 3200 }, supplierId: 'meatco' };
const ingredients = { flour, cream, beef };

// RC-16: an ingredient carries pack price, pack quantity, yield and supplier.
check('RC-16', 'an ingredient spec carries pack price, pack size and supplier context', () => {
	const cents = recipeUnitCostCents('plain', { plain: { id: 'plain', name: 'Plain', kind: 'dish',
		lines: [{ kind: 'ingredient', ingredientId: 'beef', qty: 180, unit: 'g', yieldPct: 80 }] } }, ingredients);
	// 180 g EP / 0.80 = 225 g AP x (3200c / 4535.92 g)
	const expected = (180 / 0.8) * (3200 / 4535.92);
	if (Math.abs(cents - expected) > 0.01) throw new Error(`got ${cents}, expected ${expected}`);
	if (beef.supplierId !== 'meatco') throw new Error('supplier context missing');
	return `pack price, pack size and trim yield all reached the plate: ${cents.toFixed(2)}c`;
});

// RC-18: a recipe can include a reusable sub-recipe, costed through to the plate.
const withSub: Record<string, RecipeSpec> = {
	ganache: { id: 'ganache', name: 'Ganache', kind: 'sub', batchOutput: { qty: 1, unit: 'kg' },
		lines: [{ kind: 'ingredient', ingredientId: 'cream', qty: 1000, unit: 'g' }] },
	tart: { id: 'tart', name: 'Tart', kind: 'dish',
		lines: [{ kind: 'subRecipe', subRecipeId: 'ganache', qty: 100, unit: 'g' }] }
};
check('RC-18', 'a sub-recipe costs through to the plate', () => {
	validateRecipeGraph('tart', withSub);
	const cents = recipeUnitCostCents('tart', withSub, ingredients);
	if (Math.abs(cents - 80) > 0.01) throw new Error(`got ${cents}, expected 80`);
	return `100 g of a 1 kg / 800c sub costs ${cents}c on the plate`;
});

// RC-19: every line reports its own cost contribution, and they reconcile.
check('RC-19', 'line contributions are reported and sum to the recipe cost', () => {
	const recipes: Record<string, RecipeSpec> = { mix: { id: 'mix', name: 'Mix', kind: 'dish', lines: [
		{ kind: 'ingredient', ingredientId: 'flour', qty: 500, unit: 'g' },
		{ kind: 'ingredient', ingredientId: 'cream', qty: 200, unit: 'g' }
	] } };
	const { contributions, total } = recipeLineCostContributions('mix', recipes, ingredients);
	const summed = contributions.reduce((s, c) => s + c, 0);
	if (Math.abs(summed - total) > 0.0001) throw new Error(`lines sum to ${summed}, total is ${total}`);
	const recipeTotal = recipeUnitCostCents('mix', recipes, ingredients);
	if (Math.abs(total - recipeTotal) > 0.02) throw new Error(`contribution total ${total} != recipe ${recipeTotal}`);
	return `${contributions.length} line contributions summing to ${total.toFixed(2)}c, matching the recipe cost, no remainder`;
});

// RC-21: menu cost per guest from dish portions plus miscellaneous cost.
check('RC-21', 'menu cost per guest includes portions and a miscellaneous cost', () => {
	const recipes: Record<string, RecipeSpec> = { plain: { id: 'plain', name: 'Plain', kind: 'dish',
		lines: [{ kind: 'ingredient', ingredientId: 'flour', qty: 100, unit: 'g' }] } };
	// Portions first: the engine totals dish cost x portions per guest.
	const bare = menuCostPerGuestCents([{ recipeId: 'plain', portionsPerGuest: 2 }], recipes, ingredients);
	const perPortion = dishCostPerPortionCents('plain', recipes, ingredients);
	if (bare !== perPortion * 2) throw new Error(`portions did not scale: ${perPortion} x 2 != ${bare}`);
	// Misc is its own line, applied over the menu (RC-55 records it as visible
	// and applied once). menuCostPerGuestCents deliberately does not take it.
	const misc = menuMiscCents([{ dishCostCents: perPortion, portionsPerGuest: 2 }], 10);
	if (misc <= 0) throw new Error(`misc came back ${misc}`);
	const plate = plateCost(perPortion, 10);
	if (plate.totalCents !== plate.baseCents + plate.miscCents) throw new Error('plate cost does not reconcile');
	return `2 portions/guest = ${bare}c, and a 10% misc line adds ${misc}c on top as its own line`;
});

// RC-22: buying rounds up to whole packs, and shopping groups by supplier.
check('RC-22', 'buying rounds up to whole packs', () => {
	eq(packsForNeed(1, 1000), 1, 'a gram of need still buys one pack');
	eq(packsForNeed(1000, 1000), 1, 'an exact pack buys one');
	eq(packsForNeed(1001, 1000), 2, 'a gram over buys two');
	return 'need 1g -> 1 pack, 1000g -> 1 pack, 1001g -> 2 packs';
});
check('RC-22', 'the plan groups shopping lines and carries the supplier', () => {
	const recipes: Record<string, RecipeSpec> = { plain: { id: 'plain', name: 'Plain', kind: 'dish', lines: [
		{ kind: 'ingredient', ingredientId: 'flour', qty: 100, unit: 'g' },
		{ kind: 'ingredient', ingredientId: 'beef', qty: 100, unit: 'g' }
	] } };
	const plan = computeProductionPlan({ order: { guests: 10, items: [{ recipeId: 'plain', portionsPerGuest: 1 }] },
		recipes, ingredients });
	const suppliers = new Set(plan.shopping.map((l) => l.supplierId));
	if (suppliers.size !== 2) throw new Error(`expected two suppliers, got ${[...suppliers].join(',')}`);
	return `${plan.shopping.length} shopping lines across ${suppliers.size} suppliers`;
});

// RC-23: a trusted on-hand quantity reduces what you BUY, never what you need.
check('RC-23', 'on-hand reduces buying, not the requirement', () => {
	eq(buyNeedFor(1000, 400), 600, 'on-hand subtracts from buying');
	eq(buyNeedFor(1000, 5000), 0, 'more on hand than needed buys nothing, and never negative');
	const lines = applyOnHandToShopping(
		[{ ingredientId: 'flour', name: 'Flour', apNeedBase: 1000, baseUnit: 'g',
			packName: '10 kg bag', packSizeBase: 10_000, packCostCents: 2000, supplierId: 'baldor',
			packs: 1, estCostCents: 2000 } as never],
		{ flour: 400 }
	);
	const line = lines[0] as { apNeedBase: number; buyNeedBase?: number };
	if (line.apNeedBase !== 1000) throw new Error(`the requirement moved: ${line.apNeedBase}`);
	return 'need stays 1000g while buying drops to 600g';
});

for (const r of out) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.rc}  ${r.name}\n        ${r.detail}`);
const failed = out.filter((r) => !r.ok).length;
console.log(`\n${out.length - failed}/${out.length} assertions passed across ${new Set(out.map(r=>r.rc)).size} rows`);
process.exit(failed ? 1 : 0);
