"""Synthesise the walkthrough narration.

    COQUI_TOS_AGREED=1 ENGINE=xtts scripts/demo-video/venv/bin/python \
        scripts/demo-video/speak.py

Writes scripts/demo-video/vo-silent/bN.wav plus timings.json, which
capture-silent.mjs reads so each screen holds for exactly as long as its line
takes to say.

WHY IT USED TO SOUND LIKE A ROBOT, IN ORDER OF BLAME

  1. The script. beats.mjs used to require `speak` to be a transliteration of
     the on-screen `caption`, and captions are telegraphic by design. No
     synthesiser rescues headline prose read aloud; it is not a sentence anybody
     would say. That is fixed in beats.mjs, not here, and it was the big one.

  2. One synthesis call per beat. XTTS predicts prosody across whatever it is
     handed, and its intonation flattens badly over a 35-word single shot — it
     runs out of contour and drones. We now split each line on sentence
     boundaries, synthesise each separately, and rejoin with a real breath of
     silence between them. Same words, markedly different delivery.

  3. Pace. The default is a shade brisk for a voice reading money out loud.
     SPEED below trims it.

TWO ENGINES, AND THE CHOICE IS A LICENSING ONE

  ENGINE=xtts   Coqui XTTS v2. Sounds close to human. Its weights ship under
                the Coqui Public Model License, which FORBIDS COMMERCIAL USE,
                and Coqui shut down in 2024 so there is nobody left to sell a
                commercial licence. Owner-selected; the risk is the owner's.
                Needs no espeak: XTTS carries its own tokenizer, which is why
                it works on this machine where the other Coqui models do not.

  ENGINE=piper  Piper. Small VITS model built to run on low-power hardware,
                which is exactly why it sounds synthetic. Clean to install, no
                system packages.

THE VOICE CAN BE THE OWNER'S, WITHOUT HIM READING THE SCRIPT
XTTS clones from a short reference clip. Record ~20 seconds of speaking — any
words at all, read a paragraph of the newspaper — as a quiet mono wav, then:

    REF_WAV=scripts/demo-video/voices/owner.wav ENGINE=xtts ... speak.py

Every line then comes out in that timbre. This is a far smaller ask than reading
the final narration, and it survives script changes: re-record the video with
new copy and the voice is still his. The CPML position is unchanged — the model
is still non-commercial — so the only fully clean option remains the owner
reading the eight lines himself and dropping them in as vo-silent/bN.wav, which
this rig picks up without any code change.
"""

from __future__ import annotations

import json
import os
import re
import subprocess
import sys
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "vo-silent"
VOICE = ROOT / "voices" / "en_US-lessac-medium.onnx"
PY = ROOT / "venv" / "bin" / "python"

ENGINE = os.environ.get("ENGINE", "xtts").lower()

# A built-in XTTS speaker, so no reference recording is needed. Chosen for an
# unhurried, level delivery: this narration states numbers, it does not sell.
# REF_WAV overrides it with a clone of a real voice (see module docstring).
XTTS_MODEL = "tts_models/multilingual/multi-dataset/xtts_v2"
XTTS_SPEAKER = os.environ.get("XTTS_SPEAKER", "Damien Black")
REF_WAV = os.environ.get("REF_WAV")

# Slightly under 1.0. A voice reading dollar figures at conversational speed
# reads as hurried, because the listener needs a moment per number that ordinary
# prose does not require.
SPEED = float(os.environ.get("SPEED", "0.94"))

# Silence between sentences, in seconds. A synthesiser's own sentence gap is
# near-zero; a person breathes. Long enough to hear, short enough not to read as
# a mistake.
PAUSE = float(os.environ.get("PAUSE", "0.28"))

SAMPLE_RATE = 24000  # XTTS native; Piper output is resampled to match.


def load_beats() -> list[dict]:
    """Read the storyboard from the one place it is defined, via node."""
    script = (
        "import {BEATS} from './scripts/demo-video/beats.mjs';"
        "console.log(JSON.stringify(BEATS.map(b=>({id:b.id,speak:b.speak}))));"
    )
    proc = subprocess.run(
        ["node", "--input-type=module", "-e", script],
        cwd=ROOT.parent.parent,
        capture_output=True,
        text=True,
        check=True,
    )
    return json.loads(proc.stdout.strip())


def sentences(line: str) -> list[str]:
    """Split a spoken line into sentences for separate synthesis.

    Splits on sentence-ending punctuation only. Em dashes stay inside their
    sentence: they are a pause the model already renders well, and breaking on
    them strands three-word fragments that come back sounding clipped.
    """
    parts = [s.strip() for s in re.split(r"(?<=[.!?])\s+", line) if s.strip()]
    return parts or [line]


def duration_of(path: Path) -> float:
    with wave.open(str(path)) as w:
        return w.getnframes() / float(w.getframerate())


def join_wavs(parts: list[Path], dest: Path, pause: float) -> None:
    """Concatenate mono wavs with `pause` seconds of silence between them."""
    with wave.open(str(parts[0])) as first:
        params = first.getparams()
    gap = b"\x00" * int(params.framerate * pause) * params.sampwidth * params.nchannels
    with wave.open(str(dest), "wb") as out:
        out.setparams(params)
        for i, part in enumerate(parts):
            if i:
                out.writeframes(gap)
            with wave.open(str(part)) as w:
                out.writeframes(w.readframes(w.getnframes()))


def make_xtts():
    """Load XTTS v2 and return a synthesise(text, path) callable."""
    import torch
    from TTS.api import TTS

    # torch 2.6 flipped weights_only to True, which refuses the checkpoint's
    # pickled config objects. These are Coqui's own classes from a checkpoint we
    # just downloaded from Coqui, so allow-listing them is not a trust decision.
    try:
        from TTS.config.shared_configs import BaseDatasetConfig
        from TTS.tts.configs.xtts_config import XttsConfig
        from TTS.tts.models.xtts import XttsArgs, XttsAudioConfig

        torch.serialization.add_safe_globals(
            [XttsConfig, XttsAudioConfig, BaseDatasetConfig, XttsArgs]
        )
    except Exception:
        pass

    tts = TTS(XTTS_MODEL, progress_bar=False)
    who = (
        {"speaker_wav": REF_WAV} if REF_WAV else {"speaker": XTTS_SPEAKER}
    )

    def synth(text: str, dest: Path) -> None:
        tts.tts_to_file(
            text=text, language="en", speed=SPEED, file_path=str(dest), **who
        )

    return synth


def make_piper():
    def synth(text: str, dest: Path) -> None:
        subprocess.run(
            [str(PY), "-m", "piper", "--model", str(VOICE), "-f", str(dest)],
            input=text,
            text=True,
            check=True,
            capture_output=True,
        )

    return synth


def main() -> int:
    if ENGINE == "piper" and not VOICE.exists():
        print(f"missing voice: {VOICE}\n  python -m piper.download_voices "
              f"en_US-lessac-medium --data-dir {VOICE.parent}", file=sys.stderr)
        return 1
    if REF_WAV and not Path(REF_WAV).exists():
        print(f"REF_WAV does not exist: {REF_WAV}", file=sys.stderr)
        return 1

    beats = load_beats()
    OUT.mkdir(parents=True, exist_ok=True)
    scratch = OUT / "parts"
    scratch.mkdir(exist_ok=True)

    synth = make_xtts() if ENGINE == "xtts" else make_piper()
    if REF_WAV:
        print(f"cloning voice from {REF_WAV}")

    timings = {}
    for beat in beats:
        dest = OUT / f"{beat['id']}.wav"
        parts = []
        for i, sentence in enumerate(sentences(beat["speak"])):
            part = scratch / f"{beat['id']}-{i}.wav"
            synth(sentence, part)
            parts.append(part)
        if len(parts) == 1:
            parts[0].replace(dest)
        else:
            join_wavs(parts, dest, PAUSE)
        seconds = duration_of(dest)
        timings[beat["id"]] = {
            "file": dest.name,
            "seconds": round(seconds, 3),
            "sentences": len(parts),
        }
        print(f"  ✓ {beat['id']} {seconds:5.2f}s  ({len(parts)} sent)  {beat['speak'][:52]}")

    total = sum(v["seconds"] for v in timings.values())
    (OUT / "timings.json").write_text(json.dumps(timings, indent=2))
    print(f"\nwrote {len(timings)} lines to {OUT} ({total:.1f}s of narration)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
