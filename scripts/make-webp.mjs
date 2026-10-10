// Writes a WebP beside every PNG capture under public/proof and records each
// PNG's hash in scripts/webp-manifest.json. Run it after any capture script:
//
//   node scripts/make-webp.mjs
//
// Why committed files and not a build step: sharp is not a dependency of this
// site (Vercel would have to install a native binary for every deploy), and
// the captures change a few times a month. The build reads the manifest
// instead (integrations/webp-sources.mjs) and check-dist fails when a PNG's
// hash no longer matches, so a re-shot PNG cannot ship beside a stale WebP.
//
// sharp comes from the primary checkout's node_modules; if it is missing,
// `npm i --no-save sharp` first.
//
// Considered Strategy (one encoder per format); not used because there is one
// output format and one encoder setting.
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { readdir, readFile, stat, unlink, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
let sharp;
try {
	sharp = require('sharp');
} catch {
	console.error('make-webp: sharp is not installed; run `npm i --no-save sharp` and try again');
	process.exit(1);
}

const root = fileURLToPath(new URL('../public/proof', import.meta.url));
const manifestPath = fileURLToPath(new URL('./webp-manifest.json', import.meta.url));

async function* pngs(dir) {
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) yield* pngs(path);
		else if (path.endsWith('.png')) yield path;
	}
}

const manifest = {};
let pngBytes = 0;
let webpBytes = 0;
const kept = [];
for await (const file of pngs(root)) {
	const png = await readFile(file);
	const size = (await stat(file)).size;
	const lossy = await sharp(png).webp({ quality: 82, effort: 5 }).toBuffer();
	const nearLossless = await sharp(png).webp({ nearLossless: true, quality: 82, effort: 5 }).toBuffer();
	const best = nearLossless.length < lossy.length ? nearLossless : lossy;
	const webpPath = file.replace(/\.png$/, '.webp');
	const key = relative(root, file);
	// A WebP that saves less than 15% is not worth a second request path:
	// the PNG ships alone and any old WebP is removed.
	if (best.length > size * 0.85) {
		kept.push(key);
		await unlink(webpPath).catch(() => {});
		continue;
	}
	await writeFile(webpPath, best);
	manifest[key] = createHash('sha256').update(png).digest('hex');
	pngBytes += size;
	webpBytes += best.length;
}

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
await writeFile(manifestPath, `${JSON.stringify(sorted, null, '\t')}\n`);
console.log(JSON.stringify({ webp: Object.keys(sorted).length, pngBytes, webpBytes, pngOnly: kept }));
