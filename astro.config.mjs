// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import webpSources from './integrations/webp-sources.mjs';
import { satteri } from '@astrojs/markdown-satteri';
import blogFigures from './integrations/blog-figures.mjs';
import { isNonIndexablePath } from './src/lib/seo-routes.mjs';

// Still fully static, still no adapter: Vercel serves the dist/ output.
// The one piece of server behaviour on this site, the contact endpoint, is a
// plain Vercel function in /api rather than an Astro route, precisely so this
// stays true. An adapter would move the build to .vercel/output/static, and
// the twenty postbuild guards that read dist/ would stop guarding anything.
// See the header of api/support.ts.
export default defineConfig({
	site: 'https://costcook.io',
	// webpSources runs after the build: each /proof/ capture offers its WebP.
	integrations: [
		sitemap({
			// Considered Strategy; not used because the preferred URL form is one
			// deployment rule, not behavior selected at runtime.
			// Algorithm: one pass over Astro's generated URLs. Why: sitemap entries
			// grow with published pages. Complexity: O(n) URLs, O(1) extra space.
			// Alternative rejected: a second pass over the generated XML.
			filter: (page) => !isNonIndexablePath(new URL(page).pathname),
			serialize(item) {
				const url = new URL(item.url);
				if (url.pathname !== '/') url.pathname = url.pathname.replace(/\/$/, '');
				return { ...item, url: url.href };
			}
		}),
		webpSources()
	],
	// Blog guides: a markdown image of an app capture becomes a sized figure.
	// satteri() keeps Astro 7's default processor and its defaults (GFM,
	// smart punctuation); only the hast plugin is added.
	markdown: { processor: satteri({ hastPlugins: [blogFigures] }) },
	vite: {
		plugins: [tailwindcss()],
		// .gitworktrees/ holds every local worktree of this repo (about 10 GB
		// on 2026-09-27). It is git-ignored and excluded from tsconfig, but
		// Vite's watcher crawled it and `astro dev` timed out after 30s in the
		// primary checkout. No pattern: one ignore entry.
		server: {
			watch: { ignored: ['**/.gitworktrees/**'] }
		},
		build: {
			// Never inline the hoisted script bundle: the CSP in vercel.json
			// allows script-src 'self' with no 'unsafe-inline'.
			assetsInlineLimit: 0
		}
	}
});
