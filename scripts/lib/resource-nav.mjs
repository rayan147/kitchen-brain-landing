import { readFileSync } from 'node:fs';

/**
 * How many Resources destinations the header carries, read from the
 * `resourceNav` list in src/lib/site.ts for verify-features-menu.mjs. The
 * script typed 5 (and 8 for the phone menu) and went stale on 2026-08-20,
 * when Contact joined the list (4335147); it failed from then on.
 *
 * WHY DERIVING DOES NOT WEAKEN THE CHECK. The browser still counts the links,
 * icons and descriptions actually rendered and compares them with the list,
 * so a destination dropped by the menu component fails. MIN_RESOURCES is the
 * floor for a destination dropped from the list itself; lowering it is a
 * decision, recorded here.
 *
 * Read by regex, not imported: site.ts is TypeScript and its imports carry no
 * extension, which Node's type stripping cannot resolve.
 *
 * Considered Singleton (a cached nav model); not used because each script is
 * its own process and reads the file once.
 */
export const MIN_RESOURCES = 6;

const source = readFileSync(new URL('../../src/lib/site.ts', import.meta.url), 'utf8');
const start = source.indexOf('const resourceNav = [');
const end = source.indexOf('\n]', start);
if (start === -1 || end === -1) throw new Error('resource-nav: could not find resourceNav in src/lib/site.ts');

export const resourceCount = (source.slice(start, end).match(/\bhref:/g) ?? []).length;
if (resourceCount < MIN_RESOURCES) {
	throw new Error(`resource-nav: src/lib/site.ts lists ${resourceCount} Resources destinations, below the floor of ${MIN_RESOURCES}`);
}

/** The phone Menu shows every resource plus Pricing, Blog and Sign in. */
export const mobileMenuLinkCount = resourceCount + 3;
