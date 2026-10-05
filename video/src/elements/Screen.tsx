import type React from "react";
import { useEffect, useState } from "react";
import {
  CanvasImage,
  Easing,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONT_BODY } from "../fonts";
import { C, EASE_OUT, TYPE } from "../tokens";

type Props = {
  src: string;
  focus?: { x: number; y: number; scale: number };
  // "fill-top" covers the box from the top edge: a tall phone capture fills
  // the phone frame instead of letterboxing inside it.
  fit?: "contain" | "fill-top";
  // For "fill-top": scroll the page from one vertical position to another
  // (0 = top, 100 = bottom) over the sequence, the way a thumb would.
  scroll?: [number, number];
  style?: React.CSSProperties;
};

// A missing frame renders a labelled slate rather than a blank: in Studio it
// says what to capture, and scripts/render-check.mjs refuses to render it.
export const Screen: React.FC<Props> = ({
  src,
  focus,
  fit = "contain",
  scroll = [0, 0],
  style,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const [exists, setExists] = useState<boolean | null>(null);
  const [handle] = useState(() => delayRender(`frame ${src}`));
  useEffect(() => {
    fetch(staticFile(`frames/${src}`), { method: "HEAD" })
      .then((r) => setExists(r.ok))
      .catch(() => setExists(false))
      .finally(() => continueRender(handle));
  }, [src, handle]);

  if (exists === null) return null;
  if (!exists) {
    return (
      <div
        style={{
          position: "absolute",
          inset: 80,
          display: "grid",
          placeItems: "center",
          border: `4px dashed ${C.amber}`,
          borderRadius: 16,
          color: C.amberDeep,
          fontFamily: FONT_BODY,
          fontSize: TYPE.small,
          ...style,
        }}
      >
        frame pending: {src}
      </div>
    );
  }
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        backgroundColor: C.offwhite,
        ...style,
      }}
    >
      <CanvasImage
        src={staticFile(`frames/${src}`)}
        premountFor={fps}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: fit === "fill-top" ? "cover" : "contain",
          objectPosition:
            fit === "fill-top"
              ? `50% ${interpolate(frame, [0, durationInFrames], scroll, {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(...EASE_OUT),
                })}%`
              : "50% 50%",
          transformOrigin: focus ? `${focus.x}% ${focus.y}%` : "50% 50%",
          scale: interpolate(
            frame,
            [0, durationInFrames],
            [1, focus?.scale ?? (fit === "fill-top" ? 1 : 1.04)],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(...EASE_OUT),
            },
          ),
        }}
      />
    </div>
  );
};
