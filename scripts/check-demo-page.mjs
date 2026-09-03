import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../dist/demo/index.html', import.meta.url), 'utf8');
const source = readFileSync(new URL('../src/components/sections/DemoRequest.astro', import.meta.url), 'utf8');
const failures = [];

// Considered Chain of Responsibility; not used because this is one fixed
// page contract whose independent build assertions should all report together.
const requireText = (text, label) => {
	if (!html.includes(text)) failures.push(`missing ${label}: ${text}`);
};

for (const [text, label] of [
	['Put one real job on the screen.', 'page identity'],
	['Bring the menu you would otherwise price twice.', 'story snap line'],
	['Prepare your demo', 'form identity'],
	['Start with the job.', 'kitchen step'],
	['Now name the person bringing it.', 'contact step'],
	['Your request is ready to send.', 'prepared-email state'],
	['Choose a 15-minute time', 'calendar handoff'],
	['A working session, not a feature parade.', 'bounded agenda'],
	['Not ready for a call?', 'self-serve recovery'],
	['request-demo-working-session', 'emitted direction contract'],
	['data-demo-form', 'progressive form hook'],
	['data-current-step="1"', 'server-rendered initial frame'],
	['data-recipient="rayan@costcook.io"', 'owner-supplied email boundary'],
	['href="/demo"', 'site-wide demo destination'],
	['docs/stories/request-demo.story.md', 'story source pointer']
]) requireText(text, label);

for (const step of ['1', '2', '3']) requireText(`data-step="${step}"`, `form step ${step}`);

for (const [text, label] of [
	["@media (scripting: none)", 'no-JavaScript frame override'],
	["form.dataset.phase = 'leaving'", 'outgoing transition phase'],
	["form.dataset.phase = 'entering'", 'incoming transition phase'],
	["form.dataset.emailHandoff = 'holding'", 'readable email-handoff hold'],
	["}, 1800);", 'email-handoff hold duration']
]) {
	if (!source.includes(text)) failures.push(`missing ${label}: ${text}`);
}
if (source.includes("form.dataset.enhanced = 'true'")) failures.push('client-only enhanced flag can expose all frames before first paint');
if (/demo-(?:intro|ticket) anim-enter/.test(source)) failures.push('demo workflow still competes with a page-load entrance animation');

const requiredFields = (html.match(/\srequired(?:=|\s|>)/g) ?? []).length;
if (requiredFields !== 7) failures.push(`expected 7 required demo fields, received ${requiredFields}`);

if (failures.length > 0) {
	console.error(`Demo page contract failed:\n- ${failures.join('\n- ')}`);
	process.exit(1);
}

console.log('Demo page contract passed: story, three-step handoff, seven required fields, calendar action, and self-serve recovery.');
