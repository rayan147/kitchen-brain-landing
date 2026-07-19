#!/usr/bin/env python3
"""Voiceover + caption-timing builder for the narrated demo (issue #57).

Reads beats.json, synthesizes one audio file per beat with edge-tts
(word-boundary events give exact times), aligns each caption line to
the narration span it covers, trims tail silence, and normalizes
loudness toward -16 LUFS. Timings come from TTS word boundaries, so
replacing a bN.mp3 with a founder-read take invalidates that beat's
caption timings in timings.json; the assembly step would need to
re-time that beat (not implemented here).

Usage:
  venv/bin/python make_voiceover.py --ffmpeg /path/to/ffmpeg [--outdir vo]

Outputs (in --outdir):
  bN.mp3          per-beat voice, tail-trimmed, loudness-normalized
  timings.json    per beat: duration + per-caption {text, start, end} (s)
  preview.srt     whole-VO subtitle preview (beats separated by 0.6s)
"""

import argparse
import asyncio
import json
import re
import subprocess
import sys
from pathlib import Path

import edge_tts

HERE = Path(__file__).parent
PAD_TAIL = 0.35  # seconds kept after the last word
GAP = 0.6  # inter-beat gap in the preview srt


def tokens(text: str) -> list[str]:
    return text.split()


def norm_word(w: str) -> str:
    return re.sub(r"[^a-z0-9']", "", w.lower())


async def synth(beat: dict, voice: str, rate: str, out_mp3: Path) -> list[dict]:
    """Synthesize one beat; return word-boundary events (seconds)."""
    tts = edge_tts.Communicate(
        beat["narration"], voice=voice, rate=rate, boundary="WordBoundary"
    )
    words = []
    with open(out_mp3, "wb") as f:
        async for chunk in tts.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                words.append(
                    {
                        "text": chunk["text"],
                        "start": chunk["offset"] / 1e7,
                        "end": (chunk["offset"] + chunk["duration"]) / 1e7,
                    }
                )
    return words


def align(beat: dict, words: list[dict]) -> list[dict]:
    """Map each caption line to (start, end) via its narration span."""
    narration_toks = tokens(beat["narration"])
    span_toks = [tokens(span) for _, span in beat["captions"]]
    if any(not s for s in span_toks):
        raise SystemExit(f"{beat['id']}: a caption has an empty narration span")
    if [t for s in span_toks for t in s] != narration_toks:
        raise SystemExit(
            f"{beat['id']}: caption spans do not concatenate to the narration"
        )
    # Word events sometimes merge/split tokens; align by normalized text walk.
    ei = 0
    tok_times = []
    for tok in narration_toks:
        target = norm_word(tok)
        if ei >= len(words):
            print(f"  warn: events exhausted before token '{tok}'", file=sys.stderr)
        # consume events until the accumulated text covers this token
        start = words[min(ei, len(words) - 1)]["start"]
        end = words[min(ei, len(words) - 1)]["end"]
        acc = ""
        while ei < len(words) and len(acc) < len(target):
            acc += norm_word(words[ei]["text"])
            end = words[ei]["end"]
            ei += 1
        if not acc.startswith(target[: len(acc)]) and target not in acc:
            print(f"  warn: token '{tok}' vs events '{acc}'", file=sys.stderr)
        tok_times.append({"start": start, "end": end})
    out, i = [], 0
    for (caption, _), toks in zip(beat["captions"], span_toks):
        seg = tok_times[i : i + len(toks)]
        out.append(
            {"text": caption, "start": round(seg[0]["start"], 3), "end": round(seg[-1]["end"], 3)}
        )
        i += len(toks)
    # captions display until the next line arrives (no flicker)
    for a, b in zip(out, out[1:]):
        a["end"] = b["start"]
    return out


def ts(s: float) -> str:
    ms = int(round(s * 1000))
    return f"{ms//3600000:02d}:{ms%3600000//60000:02d}:{ms%60000//1000:02d},{ms%1000:03d}"


def run_ffmpeg(ffmpeg: str, args: list[str]) -> str:
    r = subprocess.run([ffmpeg, "-hide_banner", "-y", *args], capture_output=True, text=True)
    if r.returncode != 0:
        raise SystemExit(r.stderr[-2000:])
    return r.stderr


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--ffmpeg", required=True)
    ap.add_argument("--outdir", default=str(HERE / "vo"))
    args = ap.parse_args()

    cfg = json.loads((HERE / "beats.json").read_text())
    outdir = Path(args.outdir)
    outdir.mkdir(exist_ok=True)

    timings, srt_lines, srt_n, t0 = {}, [], 1, 0.0
    for beat in cfg["beats"]:
        raw = outdir / f"{beat['id']}.raw.mp3"
        final = outdir / f"{beat['id']}.mp3"
        print(f"{beat['id']}: synthesizing…")
        words = asyncio.run(synth(beat, cfg["voice"], cfg["rate"], raw))
        caps = align(beat, words)
        dur = round(words[-1]["end"] + PAD_TAIL, 3)
        caps[-1]["end"] = dur
        # Trim tail + one-pass loudnorm (dynamic mode; it never
        # time-stretches, so word-boundary offsets stay valid).
        try:
            run_ffmpeg(
                args.ffmpeg,
                ["-i", str(raw), "-t", f"{dur}",
                 "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
                 "-ar", "48000", "-b:a", "128k", str(final)],
            )
        finally:
            raw.unlink(missing_ok=True)
        timings[beat["id"]] = {
            "duration": dur,
            "min_hold": beat["min_hold"],
            "screen": beat["screen"],
            "captions": caps,
        }
        for c in caps:
            srt_lines += [str(srt_n), f"{ts(t0 + c['start'])} --> {ts(t0 + c['end'])}", c["text"], ""]
            srt_n += 1
        t0 += dur + GAP
        print(f"  {dur}s, {len(caps)} caption lines")

    (outdir / "timings.json").write_text(json.dumps(timings, indent="\t") + "\n")
    (outdir / "preview.srt").write_text("\n".join(srt_lines) + "\n")
    total = sum(t["duration"] for t in timings.values())
    print(f"done: {total:.1f}s of narration across {len(timings)} beats")


if __name__ == "__main__":
    main()
