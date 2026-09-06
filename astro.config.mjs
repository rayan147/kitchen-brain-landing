// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Still fully static, still no adapter: Vercel serves the dist/ output.
// The one piece of server behaviour on this site, the contact endpoint, is a
// plain Vercel function in /api rather than an Astro route, precisely so this
// stays true. An adapter would move the build to .vercel/output/static, and
// the twenty postbuild guards that read dist/ would stop guarding anything.
// See the header of api/support.ts.
export default defineConfig({
	site: 'https://costcook.io',
	integrations: [sitemap()],
	vite: {
		plugins: [tailwindcss()],
		build: {
			// Never inline the hoisted script bundle: the CSP in vercel.json
			// allows script-src 'self' with no 'unsafe-inline'.
			assetsInlineLimit: 0
		}
	}
});
