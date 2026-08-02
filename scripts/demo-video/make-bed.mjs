/**
 * Generate the walkthrough's music bed.
 *
 *   node scripts/demo-video/make-bed.mjs <seconds> <out.wav>
 *
 * Synthesised here rather than sourced, so there is no licence to track and
 * nothing that can be claimed against the video later. To use a real track
 * instead, skip this entirely and pass MUSIC=/path/to.mp3 to
 * assemble-silent.mjs — the mix normalises whatever it is given to a fixed
 * loudness, so a real track drops in without re-levelling anything.
 *
 * WHAT THIS REPLACED, AND WHY IT WAS WRONG
 * The first version was three sustained sine tones — an open fifth with no
 * third, chosen so the bed "would not editorialise". Under narration that was
 * defensible; it was never meant to be listened to. With the voice gone it
 * became the only thing playing, and a static drone with no rhythm and no
 * harmony does not read as music. It reads as equipment left switched on.
 *
 * So this has the two things that were deliberately missing. It has a THIRD —
 * it is in a major key and it commits to sounding pleased about the product.
 * And it has a PULSE, which is what actually carries a viewer through 68
 * seconds of screenshots: a cut lands on a beat or it does not, and a bed with
 * no beat makes every cut feel arbitrary.
 *
 * It is still deliberately unobtrusive. Plucks decay fast, the drums are felt
 * more than heard, and there is no melody line — a tune competes with reading,
 * and every frame of this film is asking to be read.
 *
 * Written as a small synthesiser rather than an ffmpeg filter graph. lavfi can
 * make tones but it cannot easily make notes: per-note envelopes, a chord
 * progression and a drum pattern come out as an unreadable wall of filter
 * chains, and this is the part most likely to be tuned by ear later.
 */
import { writeFile } from 'node:fs/promises';

const SR = 48000;
const BPM = 104;
const BEAT = 60 / BPM;
/** Four beats to the bar, one chord per bar. */
const BAR = BEAT * 4;

const seconds = Number(process.argv[2] ?? 60);
const out = process.argv[3] ?? 'scripts/demo-video/cut/bed.wav';

/** Equal temperament, in semitones from A4. */
const NOTE = (semitones) => 440 * Math.pow(2, semitones / 12);

/**
 * D major, I–V–vi–IV. The most agreeable progression in circulation, which is
 * exactly why it is here: this sits under a sales video, not a film. Each entry
 * is a bass root plus the chord's notes, in semitones from A4.
 *
 * VOICED IN ONE REGISTER, ON PURPOSE. Named from the root upward — D, A, B, G —
 * each chord lands an interval higher than the last, and four bars in, the
 * figure has climbed most of an octave. Measured per eighth, that made bar four
 * peak at 0.89 against bar one's 0.35: the bed audibly swelled every cycle,
 * which under a screenshot reads as the film building to something it never
 * reaches. Close voicings hold everything inside G3–D5 and the basses inside a
 * fifth, so the progression moves in colour and not in volume.
 */
const PROGRESSION = [
	{ root: -31, notes: [-7, -3, 2, 5] }, // D  — D4 F#4 A4 D5
	{ root: -24, notes: [-12, -8, -5, 0] }, // A  — A3 C#4 E4 A4
	{ root: -22, notes: [-10, -7, -3, 2] }, // Bm — B3 D4 F#4 B4
	{ root: -26, notes: [-14, -10, -7, -2] } // G  — G3 B3 D4 G4
];

/**
 * Which chord tone the arpeggio plays on each eighth of a bar. Up and part-way
 * back rather than straight up-and-down: a strict figure is audibly a pattern
 * by the second bar, and once a listener can predict it they start listening to
 * it instead of reading the screen.
 */
const ARP = [0, 1, 2, 3, 2, 3, 1, 2];

const left = new Float64Array(Math.ceil(seconds * SR));
const right = new Float64Array(left.length);

/** Mix one voice in at `start` seconds, panned `pan` across -1 (L) to 1 (R). */
function add(start, dur, gain, pan, sample) {
	const from = Math.max(0, Math.round(start * SR));
	const to = Math.min(left.length, Math.round((start + dur) * SR));
	const gl = gain * Math.min(1, 1 - pan);
	const gr = gain * Math.min(1, 1 + pan);
	for (let i = from; i < to; i++) {
		const v = sample((i - from) / SR);
		left[i] += v * gl;
		right[i] += v * gr;
	}
}

/** Plucked tone: a decaying sine with a little second harmonic for body. */
const pluck = (hz, decay) => (t) =>
	Math.exp(-t * decay) *
	(Math.sin(2 * Math.PI * hz * t) + 0.28 * Math.sin(4 * Math.PI * hz * t));

/** Bass: holds through the bar rather than plucking, so the chord has a floor. */
const bass = (hz, dur) => (t) => {
	const env = Math.min(1, t * 40) * Math.min(1, (dur - t) * 8) * Math.exp(-t * 0.7);
	return env * (Math.sin(2 * Math.PI * hz * t) + 0.12 * Math.sin(6 * Math.PI * hz * t));
};

/** Kick: pitch falling 120Hz to 45Hz, gone in a fifth of a second. */
const kick = () => (t) => {
	const hz = 45 + 75 * Math.exp(-t * 32);
	return Math.exp(-t * 18) * Math.sin(2 * Math.PI * hz * t);
};

/**
 * Hat: high-passed noise. The one-pole filter is written out rather than using
 * a raw noise burst — unfiltered noise at this level reads as tape hiss, which
 * is precisely the "equipment left switched on" impression being avoided.
 */
const hat = () => {
	let prev = 0;
	let prevOut = 0;
	return (t) => {
		const n = Math.random() * 2 - 1;
		prevOut = 0.86 * (prevOut + n - prev);
		prev = n;
		return prevOut * Math.exp(-t * 55);
	};
};

for (let b = 0; b * BAR < seconds; b++) {
	const barAt = b * BAR;
	const chord = PROGRESSION[b % PROGRESSION.length];

	add(barAt, BAR, 0.5, 0, bass(NOTE(chord.root), BAR));

	for (let e = 0; e < 8; e++) {
		const at = barAt + e * (BEAT / 2);
		if (at > seconds) break;
		// Pan alternates eighth by eighth so the figure moves across the stereo
		// field instead of sitting on top of the bass in the middle.
		add(at, BEAT, 0.2, e % 2 ? 0.35 : -0.35, pluck(NOTE(chord.notes[ARP[e]]), 7.5));
	}

	// The chord held quietly underneath. Without it the plucks sound like a
	// music box on an empty stage; with it they sound like an instrument.
	for (const n of chord.notes) add(barAt, BAR * 1.05, 0.055, 0, pluck(NOTE(n), 1.1));

	for (const beat of [0, 2]) add(barAt + beat * BEAT, 0.3, 0.42, 0, kick());
	for (let e = 1; e < 8; e += 2) add(barAt + e * (BEAT / 2), 0.055, 0.1, 0.2, hat());
}

// Fades long enough that the bed arrives and leaves rather than switching on
// and off. The picture's own fades are 0.5s and 0.8s, and audio that snaps while
// the picture dissolves is the tell of a bed bolted on afterwards.
const FADE_IN = 1.6;
const FADE_OUT = 2.4;
for (let i = 0; i < left.length; i++) {
	const t = i / SR;
	const g = Math.min(1, t / FADE_IN) * Math.max(0, Math.min(1, (seconds - t) / FADE_OUT));
	left[i] *= g;
	right[i] *= g;
}

// Normalise to a fixed peak. The mix downstream targets a loudness, so this only
// has to be consistent and clip-free, not any particular level.
let peak = 0;
for (let i = 0; i < left.length; i++) {
	peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
}
const scale = peak > 0 ? 0.89 / peak : 0;

const frames = left.length;
const buf = Buffer.alloc(44 + frames * 4);
buf.write('RIFF', 0);
buf.writeUInt32LE(36 + frames * 4, 4);
buf.write('WAVEfmt ', 8);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20); // PCM
buf.writeUInt16LE(2, 22); // stereo
buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28); // byte rate
buf.writeUInt16LE(4, 32); // block align
buf.writeUInt16LE(16, 34); // bits per sample
buf.write('data', 36);
buf.writeUInt32LE(frames * 4, 40);
const pcm = (v) => Math.max(-32768, Math.min(32767, Math.round(v * scale * 32767)));
for (let i = 0; i < frames; i++) {
	buf.writeInt16LE(pcm(left[i]), 44 + i * 4);
	buf.writeInt16LE(pcm(right[i]), 46 + i * 4);
}
await writeFile(out, buf);
console.log(`wrote ${out} (${seconds}s, ${BPM} BPM, D major)`);
