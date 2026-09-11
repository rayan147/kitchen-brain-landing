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
	'Give your crew their own sign-in.',
	'Owner',
	'Manager',
	'Staff',
	'Actions restricted by role',
	'Choose who can open each screen',
	'Before you invite:',
	'Staff can open cost screens',
	'Workspace access',
	'Protected work',
	'If hiding costs is essential, CostCook is not the right fit today.',
	'aria-current="page"',
	'class="container-page onward feature-onward"',
	'Can I hide food costs from a cook?',
	'Invite the crew knowing what they can see and do.'
];

const missing = required.filter((fragment) => !html.includes(fragment));
if (missing.length > 0) throw new Error(`Team & Access build is missing: ${missing.join(', ')}`);
if ((html.match(/data-team-disclosure/g) ?? []).length !== 4) {
	throw new Error('Team & Access must render four FAQ disclosures.');
}
if ((html.match(/<dt[^>]*>Workspace access<\/dt>/g) ?? []).length !== 3
	|| (html.match(/<dt[^>]*>Protected work<\/dt>/g) ?? []).length !== 3
	|| (html.match(/<dt[^>]*>Boundary<\/dt>/g) ?? []).length !== 3) {
	throw new Error('Team & Access must compare every role with the same three semantic facts.');
}
// The homepage stopped being a stop called #access on 2026-09-09 and became a
// block inside #more; see src/components/sections/WhatElse.astro. What this
// contract is for is unchanged: the homepage introduces team and access, and it
// points at the page that carries it in full.
if (!homeHtml.includes('data-more-block="access"') || !homeHtml.includes('href="/features/team-and-access"')) {
	throw new Error('Homepage is missing the Team & Access introduction or destination.');
}
if (!featureHubHtml.includes('href="/features/team-and-connections"')) {
	throw new Error('Feature hub lost the owning Team and connections area.');
}

// Considered Strategy; not used because this validates one stable built-page
// contract and has no interchangeable validation algorithms.
console.log('Team & Access page contract passed.');
