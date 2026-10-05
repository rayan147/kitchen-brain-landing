import type React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_BODY } from "../fonts";
import { C, EASE_OUT, TYPE } from "../tokens";

// `duration` is the caption's on-screen length in frames: it fades out over
// its last 0.25 s instead of vanishing at the cut. `maxWidth` narrows it in a
// split screen so it never covers the phone.
export const Caption: React.FC<{
  text: string;
  duration: number;
  maxWidth?: number;
  style?: React.CSSProperties;
}> = ({ text, duration, maxWidth = 1400, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        left: 120,
        bottom: 72,
        maxWidth,
        padding: "24px 36px",
        backgroundColor: C.paper,
        color: C.ink,
        borderLeft: `8px solid ${C.green}`,
        borderRadius: 12,
        fontFamily: FONT_BODY,
        fontSize: TYPE.caption,
        lineHeight: 1.3,
        fontWeight: 600,
        boxShadow:
          "0 1px 2px rgb(31 36 33 / 0.06), 0 10px 28px rgb(31 36 33 / 0.08)",
        opacity: interpolate(
          frame,
          [0, 0.4 * fps, duration - 0.25 * fps, duration],
          [0, 1, 1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...EASE_OUT),
          },
        ),
        translate: interpolate(frame, [0, 0.4 * fps], ["0px 24px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(...EASE_OUT),
        }),
        ...style,
      }}
    >
      {text}
    </div>
  );
};
