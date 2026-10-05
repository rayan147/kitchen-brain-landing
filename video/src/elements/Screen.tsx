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
  style?: React.CSSProperties;
};

// A missing frame renders a labelled slate rather than a blank: in Studio it
// says what to capture, and scripts/render-check.mjs refuses to render it.
export const Screen: React.FC<Props> = ({ src, focus, style }) => {
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
          objectFit: "contain",
          transformOrigin: focus ? `${focus.x}% ${focus.y}%` : "50% 50%",
          scale: interpolate(
            frame,
            [0, durationInFrames],
            [1, focus?.scale ?? 1.04],
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
