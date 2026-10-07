import type React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { questionFadeFrames } from "../film";
import { FONT_DISPLAY } from "../fonts";
import { C, EASE_OUT, TYPE } from "../tokens";

// The homepage's quote style: Fraunces italic on cream behind an amber rule.
export const ChapterCard: React.FC<{
  question: string;
  style?: React.CSSProperties;
}> = ({ question, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = questionFadeFrames(fps);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: C.cream,
        display: "grid",
        placeItems: "center",
        ...style,
      }}
    >
      <div
        style={{
          borderLeft: `8px solid ${C.amber}`,
          paddingLeft: 48,
          maxWidth: 1400,
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: FONT_DISPLAY,
            fontStyle: "italic",
            fontSize: TYPE.chapter,
            lineHeight: 1.15,
            color: C.ink,
            opacity: interpolate(frame, fade, [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(...EASE_OUT),
            }),
            translate: interpolate(frame, fade, ["0px 20px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(...EASE_OUT),
            }),
          }}
        >
          “{question}”
        </p>
      </div>
    </div>
  );
};
