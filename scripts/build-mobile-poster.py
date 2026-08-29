#!/usr/bin/env python3
"""Build public/demo-poster-mobile.jpg from public/demo-poster.jpg.

WHY THIS EXISTS. The wide poster carries its caption band across the bottom of
the frame. At 390px that band is exactly where the browser's native video
control bar draws, so the one line the poster exists to deliver rendered half
covered, over an app screenshot too dense to read at that scale.

This rebuilds the same frame for the phone: the SAME rendered caption moved to
the top, over a crop of the Next-step panel alone, with the bottom of the frame
left empty so the control bar covers nothing.

The caption is reused as pixels rather than re-typeset, so the mobile poster
carries the identical words in the identical face. No font files needed.

Re-run after any re-record of the cut:  python3 scripts/build-mobile-poster.py
The crop boxes below are tied to the 1600x1000 layout of the source frame; if
the app's layout moves, they move.
"""
from PIL import Image

SRC = 'public/demo-poster.jpg'
DST = 'public/demo-poster-mobile.jpg'
OUT_W, OUT_H = 800, 500          # 1.6:1, matching the video's declared aspect
CAPTION_BOX = (0, 770, 1600, 1000)     # the rendered caption band
PANEL_BOX = (980, 112, 1440, 285)      # the Next-step panel, the must-stay-legible element
GAP = 12

def main() -> None:
    src = Image.open(SRC).convert('RGB')
    if src.size != (1600, 1000):
        raise SystemExit(f'{SRC} is {src.size}, expected (1600, 1000) — re-check the crop boxes')

    def band(box):
        c = src.crop(box)
        return c.resize((OUT_W, round(c.height * OUT_W / c.width)), Image.LANCZOS)

    cap, panel = band(CAPTION_BOX), band(PANEL_BOX)
    canvas = Image.new('RGB', (OUT_W, OUT_H), src.getpixel((1200, 300)))
    canvas.paste(cap, (0, 0))
    canvas.paste(panel, (0, cap.height + GAP))

    bottom = cap.height + GAP + panel.height
    if bottom > OUT_H:
        raise SystemExit(f'content runs to {bottom}px in a {OUT_H}px frame — the crops overflow')
    canvas.save(DST, quality=88, optimize=True, progressive=True)
    print(f'{DST}: caption {cap.size}, panel {panel.size}, '
          f'{OUT_H - bottom}px clear at the bottom for the control bar')

if __name__ == '__main__':
    main()
