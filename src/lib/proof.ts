import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * The pixel size of a capture in public/proof, read from the PNG itself at
 * build time.
 *
 * WHY NOT TYPE THE NUMBERS. The event captures are re-taken whenever the app
 * changes (scripts/capture-events-proof.mjs), and the offer frame went from
 * 780x2204 to 780x2260 in one afternoon. A typed width and height would ship a
 * stretched screenshot the next time that happens, and nothing else would
 * notice. The IHDR chunk is always the first chunk of a PNG, so width and
 * height sit at bytes 16 to 24.
 *
 * Considered Proxy (a cached image-metadata service); not used because this
 * runs once per image per build and a plain function is the whole job.
 */
export function pngSize(publicPath: string): { width: number; height: number } {
	const file = readFileSync(join(process.cwd(), 'public', publicPath));
	if (file.toString('ascii', 12, 16) !== 'IHDR') {
		throw new Error(`${publicPath} is not a PNG this build can measure`);
	}
	return { width: file.readUInt32BE(16), height: file.readUInt32BE(20) };
}
