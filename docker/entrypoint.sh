#!/usr/bin/env bash
# Dev-only container entrypoint for the landing page. Mirrors the app repo's
# shape (kitchen-brain docker/entrypoint.sh): install → serve, with deps owned
# by a named volume so the host working tree stays clean.
set -euo pipefail

# npm ci is a clean, lockfile-exact install. Skipped only when the volume is
# both warm AND current: npm writes this marker after a complete install, and a
# marker newer than package-lock.json means no dependency bump has landed since.
install_dependencies() {
	if [ -f node_modules/.package-lock.json ] && [ node_modules/.package-lock.json -nt package-lock.json ]; then
		echo "→ dependencies already installed and current — skipping npm ci."
		return
	fi
	echo "→ installing dependencies (npm ci, from package-lock.json)…"
	npm ci
}

# exec astro directly rather than `npm run dev`: npm forks an intermediate shell
# that turns the SIGTERM from `compose down` into a spurious error line.
serve() {
	echo "→ starting astro dev on http://localhost:4321 …"
	# --force: Astro records a running dev server in the bind-mounted source, and
	# a container killed without a clean shutdown leaves that record behind. This
	# container owns its port outright, so a stale marker must never block boot.
	exec node_modules/.bin/astro dev --host 0.0.0.0 --port 4321 --force
}

install_dependencies

# A one-off override command (`docker compose run --rm site npm run build`, a
# shell, …) runs instead of the dev-server boot.
if [ "$#" -gt 0 ]; then
	exec "$@"
fi

serve
