/**
 * Spelled numbers, for prose.
 *
 * Counts that appear in body copy are spelled, like every other number on this
 * site ("Nine allergens", "Two to twelve events"), and they stay COMPUTED
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

const TEENS = ['thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

/**
 * THE OPT-IN PAST TWELVE, 2026-09-27. Sage's tool count ("twenty-two
 * read-only tools") was proofread as a word and typed by hand in four
 * places. `compound` spells 13 to 99 for a caller whose sentence was written
 * for the word; the default stays a numeral, because the FAQ description
 * spells a count that grows past twelve and was proofread as "37".
 */
const spellCompound = (n: number): string | undefined => {
	if (!Number.isInteger(n) || n < 13 || n > 99) return undefined;
	if (n < 20) return TEENS[n - 13];
	const ones = n % 10;
	return ones === 0 ? TENS[n / 10] : `${TENS[Math.floor(n / 10)]}-${WORDS[ones]}`;
};

export const spell = (n: number, options: { compound?: boolean } = {}): string =>
	WORDS[n] ?? (options.compound ? spellCompound(n) : undefined) ?? String(n);

/** The same word, opening a sentence. */
export const spellCapital = (n: number, options: { compound?: boolean } = {}): string =>
	spell(n, options).replace(/^./, (c) => c.toUpperCase());
