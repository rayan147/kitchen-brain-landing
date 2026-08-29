/**
 * Spelled numbers, for prose.
 *
 * Counts that appear in body copy are spelled, like every other number on this
 * site ("Fourteen allergens", "Two to twelve events"), and they stay COMPUTED
 * so a sentence cannot drift from the list it describes. The word is a
 * rendering of the count, not a second copy of it. Anything past twelve falls
 * back to the numeral rather than inventing prose nobody proofread.
 *
 * This lives in its own module rather than in comparison.ts, where it started.
 * That file's header says it comes off the site together with /compare if the
 * RC-40 approval is ever withdrawn, and three surfaces that have nothing to do
 * with the comparison now count things out loud. A page should not fail to
 * build because a competitor page was retired.
 */
const WORDS = [
	'zero', 'one', 'two', 'three', 'four', 'five', 'six',
	'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'
];

export const spell = (n: number): string => WORDS[n] ?? String(n);

/** The same word, opening a sentence. */
export const spellCapital = (n: number): string => spell(n).replace(/^./, (c) => c.toUpperCase());
