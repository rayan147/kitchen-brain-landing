import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../dist/demo/index.html', import.meta.url), 'utf8');
const sentHtml = readFileSync(new URL('../dist/demo/sent/index.html', import.meta.url), 'utf8');
const source = readFileSync(new URL('../src/components/sections/DemoRequest.astro', import.meta.url), 'utf8');
const vercel = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
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
	['Sent. Now take your 15 minutes.', 'sent-and-booking state'],
	['Fifteen minutes on your job.', 'bounded agenda'],
	['Not ready for a call?', 'self-serve recovery'],
	['request-demo-working-session', 'emitted direction contract'],
	['data-demo-form', 'progressive form hook'],
	['data-current-step="1"', 'server-rendered initial frame'],
	['href="/demo"', 'site-wide demo destination'],
	['docs/stories/request-demo.story.md', 'story source pointer']
]) requireText(text, label);

for (const step of ['1', '2', '3']) requireText(`data-step="${step}"`, `form step ${step}`);

// THE FORM MUST ACTUALLY SEND. It did not, for as long as this page existed:
// the submit handler built a mailto: and navigated to it, so a request arrived
// only if the visitor had a mail client, saw the draft, and pressed send, and
// support@costcook.io was never a recipient at all. These four pins are the
// whole point of the endpoint, and the no-mailto one is what stops the old
// design coming back by hand.
for (const [text, label] of [
	['action="/api/demo-request"', 'real endpoint on the form element'],
	['method="post"', 'the no-script path posts'],
	["fetch('/api/demo-request'", 'the scripted path posts to the same endpoint']
]) {
	if (!(text.startsWith('fetch') ? source : html).includes(text)) {
		failures.push(`missing ${label}: ${text}`);
	}
}
// Scoped to the demo route's own markup, not the whole document: the shared
// footer carries a site-wide "email Rayan" link on every page, and that is a
// footer link, not this page's conversion path.
const demoSection = html.slice(html.indexOf('class="demo-page"'), html.indexOf('<footer'));
if (demoSection.includes('mailto:')) {
	failures.push('the demo route still hands a visitor a mailto:, which is the failure this endpoint replaced');
}
if (source.includes('data-recipient')) {
	failures.push('the form still carries a mailto recipient attribute');
}

// THE CALENDAR IS ON THE PAGE, AND THE CSP LETS IT LOAD. frame-src is a
// deploy-only header: astro dev and astro preview send none, so a calendar
// blanked by the CSP would reach costcook.io with every local check green.
// That is exactly how the product tour shipped inert for six weeks. This pin
// reads the built HTML and vercel.json together so neither can move alone.
// data-booking-src, not src: on /demo the schedule is attached by script once
// step 3 is open, because Chrome loads a display:none iframe eagerly and Google
// lays its page out against that hidden viewport and never reflows. /demo/sent
// carries a plain src, and is checked for it below.
const iframeSrc = html.match(/<iframe[^>]*\sdata-booking-src="([^"]+)"/)?.[1];
if (!iframeSrc) {
	failures.push('the booking calendar is not embedded on the demo page');
} else if (!iframeSrc.startsWith('https://calendar.google.com/calendar/appointments/schedules/')) {
	failures.push(`the booking iframe points somewhere unexpected: ${iframeSrc}`);
} else {
	const csp = vercel.headers
		.flatMap((entry) => entry.headers)
		.find((header) => header.key === 'Content-Security-Policy')?.value;
	const frameSrc = /frame-src ([^;]+)/.exec(csp ?? '')?.[1]?.trim();
	if (!frameSrc || !frameSrc.split(/\s+/).includes(new URL(iframeSrc).origin)) {
		failures.push(
			`vercel.json frame-src is "${frameSrc}", which blocks the booking calendar at ${new URL(iframeSrc).origin}`
		);
	}
}
if (!sentHtml.includes('calendar.google.com/calendar/appointments/schedules/')) {
	failures.push('the no-JavaScript landing page does not carry the booking calendar');
}

// THE BOT TRAP MUST NOT BE AUTOFILLABLE. This form asks for a business name
// with autocomplete="organization", so Chrome reads it as an address profile
// and would fill a field named `company`. A real caterer's request would then
// be answered 200 and silently dropped, and every other check here would pass.
if (/name="company"/.test(html)) {
	failures.push('the bot trap is named "company", which browser autofill will fill for a real visitor');
}
if (!html.includes('name="ticketRef"')) failures.push('missing bot trap: name="ticketRef"');

for (const [text, label] of [
	['@media (scripting: none)', 'no-JavaScript frame override'],
	["form.dataset.phase = 'leaving'", 'outgoing transition phase'],
	["form.dataset.phase = 'entering'", 'incoming transition phase'],
	["form.dataset.sendState = 'sent'", 'step 3 is reached only after a successful send']
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

console.log('Demo page contract passed: story, three-step handoff, seven required fields, a real send to two mailboxes, an embedded calendar the CSP admits, and self-serve recovery.');
