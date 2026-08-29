import { readFile } from 'node:fs/promises';

const pagePath = new URL('../dist/features/team-and-access/index.html', import.meta.url);
const homePath = new URL('../dist/index.html', import.meta.url);
const featureHubPath = new URL('../dist/features/index.html', import.meta.url);
const [html, homeHtml, featureHubHtml] = await Promise.all([
	readFile(pagePath, 'utf8'),
	readFile(homePath, 'utf8'),
	readFile(featureHubPath, 'utf8')
]);

const required = [
	'id="features-team"',
	'id="team-access-heading"',
	'Three roles. A short list of real boundaries.',
	'Owner',
	'Manager',
	'Staff',
	'Role-aware sensitive actions',
	'Fine-grained screen permissions',
	'Can I hide food costs from a cook?',
	'Invite the crew with the boundary understood.'
];

const missing = required.filter((fragment) => !html.includes(fragment));
if (missing.length > 0) throw new Error(`Team & Access build is missing: ${missing.join(', ')}`);
if ((html.match(/data-team-disclosure/g) ?? []).length !== 4) {
	throw new Error('Team & Access must render four FAQ disclosures.');
}
if (!homeHtml.includes('id="access"') || !homeHtml.includes('href="/features/team-and-access"')) {
	throw new Error('Homepage is missing the Team & Access introduction or destination.');
}
if (!featureHubHtml.includes('href="/features/team-and-connections"')) {
	throw new Error('Feature hub lost the owning Team and connections area.');
}

// Considered Strategy; not used because this validates one stable built-page
// contract and has no interchangeable validation algorithms.
console.log('Team & Access page contract passed.');
