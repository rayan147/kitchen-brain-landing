import type React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_BODY } from "../fonts";
import { Logo } from "./Logo";
import { C, EASE_OUT, TYPE } from "../tokens";

// Price and trial arrive as props from the manifest, which takes them from the
// landing's src/lib/site.ts: the film never types its own price.
export const EndCard: React.FC<{
  displayPrice: string;
  trialDays: string;
  style?: React.CSSProperties;
}> = ({ displayPrice, trialDays, style }) => {
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
        opacity: interpolate(frame, [0, 0.5 * fps], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(...EASE_OUT),
        }),
        ...style,
      }}
    >
      <div style={{ textAlign: "center", color: C.ink }}>
        <Logo size={TYPE.title} />
        <div
          style={{
            fontFamily: FONT_BODY,
            fontSize: TYPE.endPrice,
            marginTop: 24,
          }}
        >
          {displayPrice}, per kitchen
        </div>
        <div
          style={{
            fontFamily: FONT_BODY,
            fontSize: TYPE.small,
            marginTop: 16,
            color: C.ink,
          }}
        >
          Try it free for {trialDays} days.
        </div>
        <div
          style={{
            fontFamily: FONT_BODY,
            fontSize: TYPE.endPrice,
            marginTop: 32,
            color: C.ink,
          }}
        >
          costcook.io
        </div>
      </div>
    </div>
  );
};
