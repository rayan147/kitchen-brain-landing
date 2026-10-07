import type React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASE_OUT } from "../tokens";

// Coordinates are percentages of the Screen box, so a re-captured frame with
// the same layout keeps its ring without re-measuring pixels.
type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
  style?: React.CSSProperties;
};

export const Highlight: React.FC<Props> = ({ x, y, width, height, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
        border: `6px solid ${C.green}`,
        borderRadius: 16,
        opacity: interpolate(frame, [0, 0.3 * fps], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        scale: interpolate(frame, [0, 0.4 * fps], [1.15, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(...EASE_OUT),
          output: "perceptual-scale",
        }),
        ...style,
      }}
    />
  );
};
