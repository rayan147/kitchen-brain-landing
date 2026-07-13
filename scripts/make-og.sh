#!/usr/bin/env bash
# Regenerates public/og.png (1200×630) from scripts/og-card.html using
# headless Chromium/Chrome. Run from anywhere; fails loudly.
set -euo pipefail
cd "$(dirname "$0")/.."

browser=""
for c in chromium-browser chromium google-chrome; do
	if command -v "$c" >/dev/null; then
		browser=$c
		break
	fi
done
[ -n "$browser" ] || {
	echo "error: no chromium/chrome found on PATH" >&2
	exit 1
}

"$browser" --headless --hide-scrollbars --disable-gpu --allow-file-access-from-files \
	--window-size=1200,630 --screenshot=public/og.png \
	"file://$PWD/scripts/og-card.html"
echo "wrote public/og.png"
