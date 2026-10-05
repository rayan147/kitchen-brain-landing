import type React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_DISPLAY } from "../fonts";
import { C, EASE_OUT, TYPE } from "../tokens";

// The homepage's quote style: Fraunces italic on cream behind an amber rule.
export const ChapterCard: React.FC<{
  question: string;
  style?: React.CSSProperties;
}> = ({ question, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
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
            opacity: interpolate(frame, [0, 0.5 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(...EASE_OUT),
            }),
            translate: interpolate(
              frame,
              [0, 0.5 * fps],
              ["0px 20px", "0px 0px"],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(...EASE_OUT),
              },
            ),
          }}
        >
          “{question}”
        </p>
      </div>
    </div>
  );
};
