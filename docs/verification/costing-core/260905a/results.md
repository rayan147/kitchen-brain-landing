# RC-16 to RC-25 verification — the costing core

These ten rows are the original costing core of the ledger, and until today
they were the only rows in it whose evidence column named no file, no sha and
no artifact. RC-20 in particular had thirty-one characters of evidence
(*"Ingredient and recipe engines"*) and a new homepage claim resting on it.

Two harnesses sit beside this file. Everything reported as PASS was **executed**
against the engine at the sha below. A row the harnesses cannot reach is
reported as source-only, not as passed.

**Application sha.** `a34149cb4a1e8bc36c69fbf88da2ef74924d650c`, branch
`sandbox/demo`, dated 2026-09-05. That branch is the marketed release, and it is
the only branch a cell or a claim may be read from.

**Run.** 2026-09-05, from a detached worktree at that sha with its own isolated
`npm ci`.

## What was run, and why not vitest

For RC-20, two test files ship at that sha and cover the two halves of the claim:

- `src/lib/domain/production/engine.zero-price.test.ts` — a price that is absent
- `src/lib/domain/production/engine.uncostable.test.ts` — a conversion fact that
  is absent

**vitest cannot start in this environment.** It fails before collection with
`RESOLVE_ERROR: Could not resolve 'node:module' in \0rolldown/runtime.js`, on the
shared `node_modules` and on a clean isolated `npm ci` alike, so the failure is
environmental rather than a dependency state. `verify-rc20.ts` beside this file
therefore re-runs the assertions of those two files directly against the engine,
through `tsx`, with no bundler in the path. It asserts only what RC-20 claims.

## RC-20: 5 of 5

| Assertion | Result |
|---|---|
| A missing pack price refuses the recipe and names the ingredient | PASS |
| A whole order refuses rather than quoting off free food | PASS |
| The same recipe costs normally once a real price exists | PASS |
| A volume line on a weight ingredient with no density names the ingredient and the fix | PASS |
| Nothing is flagged when every line can convert | PASS |

## The engine's own words

These are the strings the running code produced, not paraphrases:

```
Ingredient "Beef tenderloin" has no pack price: add what a whole muscle costs
Cannot convert volume to mass for this ingredient without density (g per ml)
```

Both name the ingredient **and** the fix. That is what licenses the homepage
sentence *"holds the costing and names the line it is waiting on"*.

## What this does NOT establish

A price that is **present and typed wrong**. Nothing in the engine detects one,
and nothing in a spreadsheet does either. RC-20 covers absence only, and
`check-landing-claims.mjs` fails the build if any surface reaches past it.

The refusal is also an `EngineError` with code `INVALID_INPUT`, which is how
order screens surface it. This artifact tests the engine, not those screens; a
claim about what a specific screen displays would need its own capture.


## RC-16, RC-18, RC-19, RC-21, RC-22, RC-23: 7 of 7

`verify-costing-block.ts`, same sha, same method.

| Row | Assertion | Result |
|---|---|---|
| RC-16 | An ingredient spec carries pack price, pack size and supplier context, and all three reach the plate | PASS |
| RC-18 | A sub-recipe costs through to the plate (100 g of a 1 kg / 800c sub = 80c) | PASS |
| RC-19 | Line contributions are reported and sum to the recipe cost with no remainder | PASS |
| RC-21 | Menu cost per guest scales by portions, and misc is its own line on top | PASS |
| RC-22 | Buying rounds up to whole packs (1 g buys one; 1,001 g buys two) | PASS |
| RC-22 | The plan groups shopping lines and carries the supplier | PASS |
| RC-23 | On-hand reduces buying and never the requirement (need stays 1,000 g, buying drops to 600 g) | PASS |

One correction came out of writing it. The harness first called
`menuCostPerGuestCents` with a fourth miscellaneous argument, and it has only
three. RC-21 is still accurate: misc is a separate line applied over the menu
(`menuMiscCents`, `plateCost` in `src/lib/domain/profitability/foodcost.ts`),
which is what "its own line" means elsewhere on the site. The engine function
deliberately does not fold it in.

## Not executed, and honestly so

Three rows are UI and server behaviour rather than pure engine, and no
assertion here reaches them. They get a real source path and this sha, and
nothing stronger is claimed for them:

| Row | Source at this sha | Why not executed |
|---|---|---|
| RC-17 | `src/routes/catalog/recipes/` (`new`, `[id]`, and the import path) | Three creation doors are route behaviour |
| RC-24 | `src/routes/orders/[id]/prep/+page.server.ts` and `+page.svelte` | Persistent checks are server state |
| RC-25 | `src/routes/orders/[id]/pack/+page.server.ts` and `+page.svelte` | Persistent checks are server state |

Those three want a browser walk of a seeded order, the way `/first-dish` was
captured. That is the next piece of work on this block, not something this
artifact covers.

## Running these harnesses

They import from the **application** repo, not this one, so they live here as
evidence rather than as code this site compiles (`tsconfig.json` excludes
`artifacts`). To re-run at a release sha:

```
cd <kitchen-brain>
git worktree add --detach .worktrees/rc20 sandbox/demo
cd .worktrees/rc20 && npm ci && npx svelte-kit sync
mkdir -p .rc20 && cp <this directory>/verify-*.ts .rc20/
./node_modules/.bin/tsx .rc20/verify-rc20.ts
./node_modules/.bin/tsx .rc20/verify-costing-block.ts
```

The worktree needs its own `npm ci`: resolution walks up to the parent repo's
`node_modules` otherwise, and the parent may be on a different lockfile.
