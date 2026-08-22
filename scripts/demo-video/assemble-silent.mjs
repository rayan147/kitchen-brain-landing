/**
 * Assemble the silent captioned walkthrough into public/demo.{mp4,webm} and
 * public/demo-poster.jpg.
 *
 *   node scripts/demo-video/assemble-silent.mjs
 *
 * This is the step the narrated rig never had: capture-walkthrough.mjs and
 * make_voiceover.py both produced artefacts nothing consumed, so there was no
 * path from footage to public/. assemble.sh belongs to an older generation,
 * reads different filenames, and strips audio.
 *
 * Reads scripts/demo-video/cut/meta.json, trims each beat by its `trimStart`
 * (Playwright starts the tape at context creation, so the head of every clip is
 * a blank or half-painted screen), joins them with a short dip to white, lays a
 * music bed over the whole thing, and encodes twice. Captions are already
 * burned into the frames by the capture step, so there is no subtitle pass and
 * nothing to keep in sync.
 *
 * THERE IS NO NARRATION ANY MORE. The voiceover path (speak.py, vo-silent/, the
 * per-beat adelay and the sidechain duck) is gone rather than disabled, so the
 * only audio decision left is the bed's level. See beats.mjs for why.
 *
 * ffmpeg comes from ffmpeg-static, which lives in the container's node_modules
 * volume; run this inside the site container, or point FFMPEG at a host binary.
 */
import { readFile, mkdir, rm, writeFile } from 'node:fs/promises';
import { BEATS } from './beats.mjs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';

const run = promisify(execFile);
const CUT = path.resolve(process.env.CUT_DIR ?? 'scripts/demo-video/cut');
const PUBLIC = path.resolve(process.env.PUBLIC_DIR ?? 'public');
const WORK = path.join(CUT, 'work');

const FFMPEG =
	process.env.FFMPEG ??
	(await import('ffmpeg-static').then((m) => m.default).catch(() => 'ffmpeg'));

/** Fade opening and closing the cut. */
const FADE_IN = 0.5;
const FADE_OUT = 0.8;
const FPS = 25;
const SIZE = '1600:1000';
/**
 * Programme loudness of the finished cut, in LUFS.
 *
 * A target, not a gain multiplier, and that distinction is the bug fix. The
 * bed used to sit under narration at a fixed `volume=` figure chosen by ear
 * against a voice. With the voice gone that figure was all that was left, and
 * it measured -50.8 LUFS — roughly 28 dB below anything audible on a laptop.
 * The video shipped silent and nothing in the pipeline noticed, because a
 * silent track and a very quiet one are the same shape.
 *
 * A gain figure can never catch that: it is relative to whatever make-bed
 * happens to synthesise, so editing the bed silently re-levels the film.
 * Measuring the result instead means the mix is right by construction.
 *
 * -23 is deliberately low. Broadcast sits at -23 and streaming platforms
 * around -14, but this is a bed under an interface on a landing page, very
 * often opened in a background tab. It should read as "something is playing",
 * never as a reason to reach for mute.
 *
 * The ducking that used to live in the mix went with the narration — there is
 * nothing left to duck against, and a sidechain compressor keyed on a silent
 * track just pumps the music against nothing.
 */
const BED_LUFS = -23;
/** Ceiling for the bed's true peak, in dBFS, leaving headroom for the encoders. */
const BED_PEAK = -2;

async function ffmpeg(args) {
	try {
		return await run(FFMPEG, args, { maxBuffer: 1 << 28 });
	} catch (err) {
		console.error(err.stderr?.slice(-2000) ?? err.message);
		throw err;
	}
}

const meta = JSON.parse(await readFile(path.join(CUT, 'meta.json'), 'utf8'));

/**
 * ASSEMBLY ORDER COMES FROM THE STORYBOARD, NOT FROM THE FILENAMES.
 *
 * This used to be `Object.keys(meta).sort()`, which is a lexicographic sort of
 * b0, b1, ... b10 — and 'b10' sorts before 'b2'. The shipped 1:51 cut therefore
 * played its closing beat (quoted price versus today) third, and the poster
 * offset, computed with `ids.indexOf(POSTER_BEAT)` against the same wrong
 * sequence, was not the frame its comment claimed. Ids are zero padded now,
 * which would have hidden the bug rather than fixed it, so the order is taken
 * from BEATS instead and the class of bug is gone.
 *
 * It is also load-bearing for the multi-event beat: capture-silent.mjs records
 * that one LAST because submitting it writes three orders to the demo database,
 * and it belongs in the middle of the cut.
 */
const ids = BEATS.map((beat) => beat.id).filter((id) => meta[id]);
const missing = BEATS.map((b) => b.id).filter((id) => !meta[id]);
if (missing.length) console.warn(`  ! no footage for ${missing.join(', ')}; assembling without`);
await rm(WORK, { recursive: true, force: true });
await mkdir(WORK, { recursive: true });

// Pass 1 — trim each beat's loading head and normalise to a common encode, so
// the concat below never has to reconcile differing timebases.
const trimmed = [];
for (const id of ids) {
	const src = path.join(CUT, meta[id].file);
	const out = path.join(WORK, `${id}.mp4`);

	// Every beat carries a silent stereo track. It is never heard — the bed is
	// laid over the whole cut in pass 3 — but the concat demuxer needs every
	// segment to have the same streams in the same order, and a run of clips
	// where some have audio and some do not joins into a file whose audio stops
	// partway through.
	//
	// -t pins the output to the hold this beat was recorded for. Relying on
	// -shortest instead is not safe here: anullsrc is an infinite stream, and on
	// one beat ffmpeg ran the video out to 103 seconds from an 11-second source
	// rather than stopping at the shorter input.

	// A short dip to white at each end of every beat. The join below is a plain
	// concat, so this is where the transition has to live: chained xfade filters
	// need every offset computed from exact durations and one wrong offset
	// silently drops a beat. Hard cuts between full screens are most of why the
	// previous cut read as a slideshow, and 0.18s either side is enough to read
	// as one continuous session without turning into a flicker across twelve
	// beats. White because the page and the cards are cream paper; a dip to
	// black would read as a different film.
	const dip = Math.min(0.18, meta[id].hold / 8);
	await ffmpeg([
		'-y',
		'-ss',
		String(meta[id].trimStart.toFixed(2)),
		'-i',
		src,
		'-f',
		'lavfi',
		'-i',
		'anullsrc=r=48000:cl=stereo',
		'-vf',
		`scale=${SIZE},fps=${FPS},format=yuv420p,` +
			`fade=t=in:st=0:d=${dip.toFixed(2)}:color=white,` +
			`fade=t=out:st=${(meta[id].hold - dip).toFixed(2)}:d=${dip.toFixed(2)}:color=white`,
		'-t',
		String(meta[id].hold.toFixed(2)),
		'-map',
		'0:v',
		'-map',
		'1:a',
		'-c:a',
		'aac',
		'-b:a',
		'160k',
		'-ar',
		'48000',
		'-ac',
		'2',
		'-c:v',
		'libx264',
		'-crf',
		'23',
		'-preset',
		'medium',
		out
	]);
	trimmed.push(out);
	console.log(`  trimmed ${id}`);
}

// Pass 2 — join. A plain concat demuxer cut, because each clip already fades
// out to white and the next fades in from it (pass 1), so the transition is
// baked into the segments and the join has no offsets to get wrong.
const listFile = path.join(WORK, 'list.txt');
await writeFile(listFile, trimmed.map((f) => `file '${f}'`).join('\n'));
const joined = path.join(WORK, 'joined.mp4');
await ffmpeg(['-y', '-f', 'concat', '-safe', '0', '-i', listFile, '-c', 'copy', joined]);
console.log('  joined');

// Pass 3 — fade the head and tail, then encode the two delivery formats.
const faded = path.join(WORK, 'faded.mp4');
const { stderr } = await ffmpeg(['-i', joined, '-hide_banner']).catch((e) => e);
const m = /Duration: (\d+):(\d+):([\d.]+)/.exec(stderr ?? '');
const total = m ? Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]) : 45;
console.log(`  total ${total.toFixed(1)}s`);

// The bed: generated rather than sourced, so there is no licence to track.
// Pass MUSIC=/path/to.mp3 to use a real track instead; it is mixed the same way.
const bed = process.env.MUSIC ?? path.join(WORK, 'bed.wav');
if (!process.env.MUSIC) {
	await run(process.execPath, [path.join(path.dirname(new URL(import.meta.url).pathname), 'make-bed.mjs'), String(Math.ceil(total)), bed], { maxBuffer: 1 << 28 });
	console.log('  generated bed');
}

// The bed replaces the joined file's silent track outright rather than mixing
// with it — mixing silence in only adds a stream that can dropout-transition
// the gain around. `atrim` pins the music to the picture: make-bed is asked for
// ceil(total) seconds, so it is always a fraction longer, and without the trim
// that fraction becomes music playing over a black frame after the fade.
// One graph for both streams: mixing -af with -filter_complex mapping is
// rejected outright, and the video fade has to live here too once -map is used.
await ffmpeg([
	'-y',
	'-i',
	joined,
	'-i',
	bed,
	'-filter_complex',
	`[0:v]fade=t=in:st=0:d=${FADE_IN}:color=white,` +
		`fade=t=out:st=${(total - FADE_OUT).toFixed(2)}:d=${FADE_OUT}:color=white,format=yuv420p[vout];` +
		`[1:a]atrim=0:${total.toFixed(2)},asetpts=PTS-STARTPTS,` +
		`loudnorm=I=${BED_LUFS}:TP=${BED_PEAK}:LRA=7,aresample=48000,` +
		`afade=t=out:st=${(total - FADE_OUT).toFixed(2)}:d=${FADE_OUT}[aout]`,
	'-map',
	'[vout]',
	'-map',
	'[aout]',
	'-c:a',
	'aac',
	'-b:a',
	'160k',
	'-c:v',
	'libx264',
	'-crf',
	'23',
	'-preset',
	'medium',
	faded
]);

await mkdir(PUBLIC, { recursive: true });
await ffmpeg([
	'-y',
	'-i',
	faded,
	'-c:a',
	'aac',
	'-b:a',
	'128k',
	'-c:v',
	'libx264',
	'-pix_fmt',
	'yuv420p',
	'-crf',
	'26',
	'-preset',
	'medium',
	'-movflags',
	'+faststart',
	path.join(PUBLIC, 'demo.mp4')
]);
console.log('  encoded demo.mp4');

await ffmpeg([
	'-y',
	'-i',
	faded,
	'-c:a',
	'libopus',
	'-b:a',
	'96k',
	'-c:v',
	'libvpx-vp9',
	'-pix_fmt',
	'yuv420p',
	'-crf',
	'34',
	'-b:v',
	'0',
	'-row-mt',
	'1',
	path.join(PUBLIC, 'demo.webm')
]);
console.log('  encoded demo.webm');

// Poster: the order's money summary — guests, price per guest, revenue and the
// food-cost percent all legible in one frame, which is the single most
// persuasive still in the cut. Derived from the beat offsets rather than a
// hardcoded second, so re-timing a beat cannot silently move the poster
// onto a transition or a half-drawn screen. Taken partway into the beat, after
// its caption has appeared.
const POSTER_BEAT = 'b03';
const posterAt = Math.min(
	total - 2,
	ids.slice(0, ids.indexOf(POSTER_BEAT)).reduce((s, id) => s + meta[id].hold, 0) +
		(meta[POSTER_BEAT]?.hold ?? 8) * 0.55
);
await ffmpeg([
	'-y',
	'-ss',
	String(posterAt.toFixed(2)),
	'-i',
	faded,
	'-frames:v',
	'1',
	'-q:v',
	'4',
	path.join(PUBLIC, 'demo-poster.jpg')
]);
console.log(`  poster at ${posterAt.toFixed(1)}s`);

const label = `${Math.floor(Math.round(total) / 60)}:${String(Math.round(total) % 60).padStart(2, '0')}`;
console.log(`\ndone. total ${total.toFixed(1)}s (${label})`);
console.log(
	'The chip in SeeItRun.astro, the hero link in Hero.astro and the guard literal\n' +
		`in check-landing-claims.mjs all have to say ${label}. They have drifted twice.`
);
