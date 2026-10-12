import { readdirSync, readFileSync } from 'node:fs';

/**
 * The weekly blog schedule, read once for every script that checks it:
 * check-blog.mjs (build), verify-blog.mjs and verify-features-menu.mjs
 * (browser). Same rule as src/lib/blog.ts: a post dated after the build is
 * not built or linked yet. BLOG_NOW (an ISO date) stands in for the clock.
 *
 * No pattern: a date per file and one comparison.
 */
const content = new URL('../../src/content/blog/', import.meta.url);

export const blogNow = process.env.BLOG_NOW ? new Date(process.env.BLOG_NOW) : new Date();

export const publishedDates = Object.fromEntries(
	readdirSync(content)
		.filter((name) => name.endsWith('.md'))
		.map((name) => {
			const date = readFileSync(new URL(name, content), 'utf8').match(/^publishedDate: (\S+)$/m)?.[1];
			if (!date) throw new Error(`blog-schedule: ${name} has no publishedDate`);
			return [name.replace(/\.md$/, ''), new Date(date)];
		})
);

export const isDue = (slug) => publishedDates[slug] <= blogNow;

/** Posts written and dated, waiting for their Thursday. */
export const scheduledSlugs = Object.keys(publishedDates).filter((slug) => !isDue(slug));
