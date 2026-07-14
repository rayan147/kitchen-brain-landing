#!/usr/bin/env bash
# Assembles the director's cut: stills get exact durations + a slow Ken
# Burns drift; scroll clips are normalized and tail-frozen; beats join
# through 0.4s dip-to-white transitions; global fade in/out; encodes
# H.264 + VP9 + poster.
set -euo pipefail
cd "$(dirname "$0")/cut"
FF=$(node -p "require('/tmp/claude-1000/-home-rayan147-kitchen-brain/cc4d86d5-ccfd-4404-8245-dd19e1d7d6dc/scratchpad/node_modules/ffmpeg-static')" 2>/dev/null || node -p "require('ffmpeg-static')")

still() { # in.png dur out.mp4  — 2560x1600 -> 1280x800 with 4.5% drift
	"$FF" -hide_banner -loglevel error -loop 1 -i "$1" -t "$2" -filter_complex \
		"zoompan=z='1+0.045*on/($2*25)':d=$2*25:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1280x800:fps=25,format=yuv420p" \
		-c:v libx264 -crf 20 -preset medium -y "$3"
}

vid() { # in.webm tailfreeze out.mp4 — normalize + freeze last frame
	"$FF" -hide_banner -loglevel error -i "$1" -vf \
		"scale=1280:800,fps=25,tpad=stop_mode=clone:stop_duration=$2,format=yuv420p" \
		-c:v libx264 -crf 20 -preset medium -y "$3"
}

still b1-title.png 3.5 c1.mp4
still b2-orders.png 4.5 c2.mp4
still b3-detail.png 5.0 c3.mp4
vid   b4-shopping.webm 1.5 c4.mp4
vid   b5-prep.webm 1.5 c5.mp4
still b6-pack.png 4.0 c6.mp4
still b7-cost.png 6.5 c7.mp4
still b8-end.png 4.0 c8.mp4

# durations for xfade offsets
D=(); for i in 1 2 3 4 5 6 7 8; do
	D+=("$({ "$FF" -i c$i.mp4 2>&1 || true; } | grep -oP 'Duration: \K[0-9:.]+' | awk -F: '{print $1*3600+$2*60+$3}')")
done
X=0.4
O1=$(echo "${D[0]} - $X" | bc)
O2=$(echo "$O1 + ${D[1]} - $X" | bc)
O3=$(echo "$O2 + ${D[2]} - $X" | bc)
O4=$(echo "$O3 + ${D[3]} - $X" | bc)
O5=$(echo "$O4 + ${D[4]} - $X" | bc)
O6=$(echo "$O5 + ${D[5]} - $X" | bc)
O7=$(echo "$O6 + ${D[6]} - $X" | bc)
TOTAL=$(echo "$O7 + ${D[7]}" | bc)
FADEOUT=$(echo "$TOTAL - 0.8" | bc)
echo "durations: ${D[@]} | total ≈ $TOTAL"

"$FF" -hide_banner -loglevel error \
	-i c1.mp4 -i c2.mp4 -i c3.mp4 -i c4.mp4 -i c5.mp4 -i c6.mp4 -i c7.mp4 -i c8.mp4 \
	-filter_complex "\
[0:v][1:v]xfade=transition=fadewhite:duration=$X:offset=$O1[v1];\
[v1][2:v]xfade=transition=fadewhite:duration=$X:offset=$O2[v2];\
[v2][3:v]xfade=transition=fadewhite:duration=$X:offset=$O3[v3];\
[v3][4:v]xfade=transition=fadewhite:duration=$X:offset=$O4[v4];\
[v4][5:v]xfade=transition=fadewhite:duration=$X:offset=$O5[v5];\
[v5][6:v]xfade=transition=fadewhite:duration=$X:offset=$O6[v6];\
[v6][7:v]xfade=transition=fadewhite:duration=$X:offset=$O7[v7];\
[v7]fade=t=in:st=0:d=0.6:color=white,fade=t=out:st=$FADEOUT:d=0.8:color=white,format=yuv420p[vout]" \
	-map "[vout]" -c:v libx264 -crf 23 -preset medium -movflags +faststart -an -y directors-cut.mp4

"$FF" -hide_banner -loglevel error -i directors-cut.mp4 -c:v libvpx-vp9 -crf 34 -b:v 0 -an -y directors-cut.webm
{ "$FF" -i directors-cut.mp4 2>&1 || true; } | grep Duration
du -h directors-cut.mp4 directors-cut.webm
