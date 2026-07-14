// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Fully static one-pager — no adapter; Vercel serves the dist/ output.
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
