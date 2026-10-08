/**
 * Assemble the Sage feature-page walkthrough from authentic product captures.
 * story: docs/stories/sage-feature.story.md
 *
 * Considered Strategy; not used because MP4 and WebM share one fixed edit and
 * differ only at the final codec arguments. There is no runtime algorithm to
 * swap, so a small data table keeps the build inspectable.
 */
import { mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import ffmpegPath from 'ffmpeg-static';

if (!ffmpegPath) throw new Error('ffmpeg-static did not provide a binary.');

const root = new URL('../../', import.meta.url);
const proof = new URL('public/proof/', root);
const setup = new URL('sage-onboarding.png', proof);
const workspace = new URL('sage-setup-workspace.png', proof);
const answer = new URL('sage-answer.png', proof);
const poster = new URL('sage-walkthrough-poster.jpg', proof);
const master = new URL('sage-walkthrough-master.mp4', proof);
const finalCard = new URL('sage-walkthrough-final.png', proof);
const captions = new URL('sage-walkthrough.vtt', proof);

mkdirSync(proof, { recursive: true });

const font = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';
const bold = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf';
const cream = '0xF4F1E8';
const green = '0x2F7D5B';

const cardResult = spawnSync(
	'convert',
	[
		'-size', '1920x1080', `xc:#${green.slice(2)}`,
		'-font', bold, '-fill', 'white', '-pointsize', '94', '-annotate', '+150+360', 'Ask your kitchen.',
		'-annotate', '+150+485', 'Check the answer.',
		'-font', font, '-pointsize', '38', '-annotate', '+155+650', 'Every number links to the record it came from.',
		'-pointsize', '32', '-annotate', '+155+790', 'In the app today',
		finalCard.pathname
	],
	{ encoding: 'utf8' }
);
if (cardResult.status !== 0) throw new Error(String(cardResult.stderr).slice(-4000));

const filter = [
	`[0:v]scale=1550:872:force_original_aspect_ratio=decrease,pad=1550:872:(ow-iw)/2:(oh-ih)/2:white,` +
		`drawbox=x=0:y=0:w=1550:h=8:color=${green}:t=fill,` +
		`pad=1920:1080:(ow-iw)/2:52:color=${cream}[s0]`,
	`[1:v]scale=1510:872:force_original_aspect_ratio=increase,crop=1510:872:(iw-ow)/2:(ih-oh)/2,` +
		`pad=1920:1080:(ow-iw)/2:52:color=${cream}[s1]`,
	`[2:v]scale=1510:872:force_original_aspect_ratio=increase,crop=1510:872:(iw-ow)/2:(ih-oh)/2,` +
		`pad=1920:1080:(ow-iw)/2:52:color=${cream}[s2]`,
	`[3:v]scale=1920:1080[final]`,
	`[s0][s1][s2][final]concat=n=4:v=1:a=0,format=yuv420p[out]`
].join(';');

const render = (output, codecArgs) => {
	const result = spawnSync(
		ffmpegPath,
		[
			'-y',
			'-loop', '1', '-t', '5', '-i', setup.pathname,
			'-loop', '1', '-t', '5', '-i', workspace.pathname,
			'-loop', '1', '-t', '5', '-i', answer.pathname,
			'-loop', '1', '-t', '5', '-i', finalCard.pathname,
			'-filter_complex', filter,
			'-map', '[out]',
			'-r', '30',
			...codecArgs,
			output.pathname
		],
		{ encoding: 'utf8' }
	);
	if (result.status !== 0) throw new Error(String(result.stderr).slice(-4000));
};

render(master, ['-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-movflags', '+faststart']);

const outputs = [
	{ file: new URL('sage-walkthrough.mp4', proof), args: ['-c:v', 'libx264', '-preset', 'slow', '-crf', '22', '-movflags', '+faststart'] },
	{ file: new URL('sage-walkthrough.webm', proof), args: ['-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '32', '-row-mt', '1'] }
];

for (const output of outputs) {
	const subtitleFilter = `subtitles=${captions.pathname}:force_style='FontName=DejaVu Sans,FontSize=12,PrimaryColour=&H001F2517,BorderStyle=1,Outline=0,Shadow=0,MarginV=24,Alignment=2'`;
	const result = spawnSync(ffmpegPath, ['-y', '-i', master.pathname, '-vf', subtitleFilter, ...output.args, output.file.pathname], {
		encoding: 'utf8'
	});
	if (result.status !== 0) throw new Error(String(result.stderr).slice(-4000));
}

const posterResult = spawnSync(
	ffmpegPath,
	['-y', '-ss', '0.4', '-i', master.pathname, '-frames:v', '1', '-q:v', '2', poster.pathname],
	{ encoding: 'utf8' }
);
if (posterResult.status !== 0) throw new Error(String(posterResult.stderr).slice(-4000));

console.log('Built Sage walkthrough MP4, WebM and poster from authentic product captures.');
