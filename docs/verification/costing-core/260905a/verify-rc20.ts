/**
 * RC-20 verification, run without a bundler.
 *
 * vitest cannot start in this environment (rolldown fails to resolve node
 * builtins, on a clean isolated `npm ci` as well as the shared one), so this
 * re-runs the assertions of the two committed test files directly against the
 * engine at the checked-out sha, using Node's native type stripping.
 *
 *   src/lib/domain/production/engine.zero-price.test.ts   (a missing price)
 *   src/lib/domain/production/engine.uncostable.test.ts   (a missing conversion)
 *
 * It asserts only what RC-20 claims: costing STOPS and the blocking ingredient
 * is NAMED. It does not assert anything about a price that is present and wrong.
 */
import {
	EngineError,
	computeProductionPlan,
	recipeUnitCostCents,
	firstUncostableIngredient,
	type IngredientSpec,
	type RecipeSpec
} from '../src/lib/domain/production/engine.ts';

const results: { name: string; ok: boolean; detail: string }[] = [];
const check = (name: string, fn: () => string) => {
	try { results.push({ name, ok: true, detail: fn() }); }
	catch (error) { results.push({ name, ok: false, detail: String(error) }); }
};

const beef = (costCents: number): IngredientSpec => ({
	id: 'beef', name: 'Beef tenderloin', baseUnit: 'g',
	pack: { name: 'whole muscle', sizeBase: 1000, costCents }
});
const salt: IngredientSpec = {
	id: 'salt', name: 'Salt', baseUnit: 'g',
	pack: { name: 'box', sizeBase: 1000, costCents: 500 }
};
const recipes: Record<string, RecipeSpec> = {
	steak: { id: 'steak', name: 'Steak', kind: 'dish', lines: [
		{ kind: 'ingredient', ingredientId: 'beef', qty: 200, unit: 'g', yieldPct: 60 },
		{ kind: 'ingredient', ingredientId: 'salt', qty: 2, unit: 'g' }
	] }
};

// --- A price that is absent: costing must refuse, and name the line. ---
check('a missing pack price refuses the recipe and names the ingredient', () => {
	try {
		const cost = recipeUnitCostCents('steak', recipes, { beef: beef(0), salt });
		throw new Error(`costed anyway, returning ${cost}`);
	} catch (error) {
		const message = (error as Error).message;
		if (!/Beef tenderloin/.test(message)) throw new Error(`did not name the ingredient: ${message}`);
		if (!/no pack price/.test(message)) throw new Error(`did not name the fix: ${message}`);
		if (!(error instanceof EngineError)) throw new Error('not an EngineError');
		return message;
	}
});

check('a whole order refuses rather than quoting off free food', () => {
	try {
		computeProductionPlan({ order: { guests: 100, items: [{ recipeId: 'steak', portionsPerGuest: 1 }] },
			recipes, ingredients: { beef: beef(0), salt } });
		throw new Error('the order planned anyway');
	} catch (error) {
		if (!(error instanceof EngineError)) throw new Error(`threw ${error}`);
		return (error as Error).message;
	}
});

check('the same recipe costs normally once a real price exists', () => {
	const cents = recipeUnitCostCents('steak', recipes, { beef: beef(5000), salt });
	if (Math.abs(cents - 1667.67) > 0.01) throw new Error(`got ${cents}, expected 1667.67`);
	return `${cents}c`;
});

// --- A conversion fact that is absent: the blocking ingredient must be named. ---
const conv: Record<string, IngredientSpec> = {
	flour: { id: 'flour', name: 'Flour', baseUnit: 'g', pack: { name: '10 kg bag', sizeBase: 10_000, costCents: 2000 } },
	cream: { id: 'cream', name: 'Cream', baseUnit: 'g', pack: { name: '1 kg tub', sizeBase: 1000, costCents: 800 } }
};
check('a volume line on a weight ingredient with no density names the ingredient and the fix', () => {
	const blocked = firstUncostableIngredient('soup',
		{ soup: { id: 'soup', name: 'Soup', kind: 'dish',
			lines: [{ kind: 'ingredient', ingredientId: 'cream', qty: 100, unit: 'ml' }] } }, conv);
	if (blocked?.name !== 'Cream') throw new Error(`named ${blocked?.name}`);
	if (!/density/.test(blocked?.message ?? '')) throw new Error(`fix not named: ${blocked?.message}`);
	return `${blocked.name}: ${blocked.message}`;
});

check('nothing is flagged when every line can convert', () => {
	const blocked = firstUncostableIngredient('bread',
		{ bread: { id: 'bread', name: 'Bread', kind: 'dish',
			lines: [{ kind: 'ingredient', ingredientId: 'flour', qty: 500, unit: 'g' }] } }, conv);
	if (blocked !== null) throw new Error(`flagged ${JSON.stringify(blocked)}`);
	return 'null';
});

for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}\n        ${r.detail}`);
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} RC-20 assertions passed`);
process.exit(failed ? 1 : 0);
