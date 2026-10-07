import type React from "react";
import { useLayoutEffect, useRef, useState } from "react";
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
  const box = useRef<HTMLDivElement>(null);
  const words = useRef<HTMLSpanElement>(null);
  const [lineWidth, setLineWidth] = useState<number | null>(null);
  // Balanced wrapping shortens the lines but a box keeps its max width, so a
  // two-line caption sat in a box with a wide empty right side. The box is
  // sized to its widest laid-out line instead, measured once the font is in
  // and divided by the preview's own scale (Studio shows the canvas scaled).
  // Considered a text-measuring library; not used because the browser has
  // already laid the lines out, and reading them back needs no new dependency.
  useLayoutEffect(() => {
    const measure = () => {
      if (!box.current || !words.current) return;
      const scale =
        box.current.getBoundingClientRect().width / box.current.offsetWidth ||
        1;
      const range = document.createRange();
      range.selectNodeContents(words.current);
      const widest = Math.max(
        ...[...range.getClientRects()].map((r) => r.width),
      );
      // Under border-box the width also carries the padding and the rule.
      const cs = getComputedStyle(box.current);
      const chrome =
        cs.boxSizing === "border-box"
          ? box.current.offsetWidth -
            box.current.clientWidth +
            parseFloat(cs.paddingLeft) +
            parseFloat(cs.paddingRight)
          : 0;
      setLineWidth(Math.ceil(widest / scale) + 2 + chrome);
    };
    measure();
    void document.fonts.ready.then(measure);
  }, [text]);
  return (
    <div
      ref={box}
      style={{
        position: "absolute",
        left: 120,
        bottom: 72,
        maxWidth,
        width: lineWidth ?? undefined,
        padding: "24px 36px",
        backgroundColor: C.paper,
        color: C.ink,
        borderLeft: `8px solid ${C.green}`,
        borderRadius: 12,
        fontFamily: FONT_BODY,
        fontSize: TYPE.caption,
        lineHeight: 1.3,
        // No one-word last line ("Her / call.").
        textWrap: "balance",
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
      <span ref={words}>{text}</span>
    </div>
  );
};
