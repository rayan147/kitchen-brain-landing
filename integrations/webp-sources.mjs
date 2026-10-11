// Serves the WebP beside each PNG capture without touching the 40-odd
// components that render captures. After the build, every page in dist/ is
// rewritten so a capture under /proof/ offers its WebP first:
//
//   <picture>                                      <picture>
//     <source media="M" srcset="a.png">              <source media="M" type="image/webp" srcset="a.webp">
//     <img src="b.png">                     ->       <source media="M" srcset="a.png">
//   </picture>                                       <source type="image/webp" srcset="b.webp">
//                                                    <img src="b.png">
//                                                  </picture>
//
// ORDER IS THE ART DIRECTION. Each WebP source copies the media of the PNG it
// doubles and sits right before it; the img's WebP goes after every media
// source. A bare WebP source placed first would win at every width and serve
// the desktop capture to phones.
//
// A lone <img> is wrapped in <picture data-webp>, which global.css sets to
// display: contents, so the img still lays out as its parent's child.
//
// Only PNGs listed in scripts/webp-manifest.json get a WebP; check-dist fails
// when a listed PNG's hash no longer matches (a re-shot capture with a stale
// WebP). Mobile review 2026-10-09: 9.3MB of PNG captures, no modern format.
//
// Considered Decorator (wrapping each component's image markup); not used
// because the change is one string transform over finished HTML, and putting
// it in every component is the drift this avoids.
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const manifestUrl = new URL('../scripts/webp-manifest.json', import.meta.url);

/** @param {string} html @param {Set<string>} listed */
export function addWebpSources(html, listed) {
	const webpFor = (url) => {
		const match = /^\/proof\/(.+)\.png$/.exec(url);
		return match && listed.has(`${match[1]}.png`) ? `/proof/${match[1]}.webp` : null;
	};
	const webpSource = (tag, webp) =>
		tag
			.replace(/\stype="[^"]*"/, '')
			.replace(/srcset="[^"]*"/, `type="image/webp" srcset="${webp}"`);

	const rewritePicture = (picture) => {
		let out = picture.replace(/<source\b[^>]*>/g, (tag) => {
			const webp = webpFor(/srcset="([^"]+)"/.exec(tag)?.[1] ?? '');
			return webp ? `${webpSource(tag, webp)}${tag}` : tag;
		});
		out = out.replace(/<img\b[^>]*>/, (img) => {
			const webp = webpFor(/\ssrc="([^"]+)"/.exec(img)?.[1] ?? '');
			return webp ? `<source type="image/webp" srcset="${webp}">${img}` : img;
		});
		return out;
	};

	// Pictures first, then lone imgs in the text between them.
	const parts = html.split(/(<picture\b[\s\S]*?<\/picture>)/);
	return parts
		.map((part, index) => {
			if (index % 2 === 1) return rewritePicture(part);
			return part.replace(/<img\b[^>]*>/g, (img) => {
				const webp = webpFor(/\ssrc="([^"]+)"/.exec(img)?.[1] ?? '');
				return webp ? `<picture data-webp><source type="image/webp" srcset="${webp}">${img}</picture>` : img;
			});
		})
		.join('');
}

async function* htmlFiles(dir) {
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) yield* htmlFiles(path);
		else if (path.endsWith('.html')) yield path;
	}
}

export default function webpSources() {
	return {
		name: 'costcook:webp-sources',
		hooks: {
			'astro:build:done': async ({ dir, logger }) => {
				const listed = new Set(Object.keys(JSON.parse(await readFile(manifestUrl, 'utf8'))));
				let pages = 0;
				for await (const file of htmlFiles(fileURLToPath(dir))) {
					const html = await readFile(file, 'utf8');
					const next = addWebpSources(html, listed);
					if (next !== html) {
						await writeFile(file, next);
						pages += 1;
					}
				}
				logger.info(`WebP sources added on ${pages} pages`);
			}
		}
	};
}
