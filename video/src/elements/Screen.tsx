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
import { C, TYPE } from "../tokens";

// Camera moves run the length of the beat and ease in and out, so the frame
// never lurches at the cut and then freezes. The fast-out curve is for
// entrances only.
const CAMERA = Easing.inOut(Easing.cubic);

type Props = {
  src: string;
  focus?: { x: number; y: number; scale: number };
  // "fill-top" fits the capture to the box's width from the top edge: a tall
  // phone capture scrolls inside the phone, a short one sits at its top.
  fit?: "contain" | "fill-top";
  // For "fill-top": scroll the page from one vertical position to another
  // (0 = top, 100 = bottom) over the sequence, the way a thumb would.
  scroll?: [number, number];
  // The scale the camera starts from: where the previous beat left it when the
  // frame repeats, so the cut does not snap the zoom back.
  startScale?: number;
  // Overlays (a ring) drawn inside the camera and inside the picture's own
  // box, so their percentages are of the capture, not of the frame around it.
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

// A missing frame renders a labelled slate rather than a blank: in Studio it
// says what to capture, and scripts/render-check.mjs refuses to render it.
export const Screen: React.FC<Props> = ({
  src,
  focus,
  fit = "contain",
  scroll = [0, 0],
  startScale = 1,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  // The capture's own size, so the picture's box can be laid out exactly and
  // a ring placed in percent of the capture lands on what it names.
  const [size, setSize] = useState<{ w: number; h: number } | false | null>(
    null,
  );
  const [handle] = useState(() => delayRender(`frame ${src}`));
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setSize({ w: img.naturalWidth, h: img.naturalHeight });
      continueRender(handle);
    };
    img.onerror = () => {
      setSize(false);
      continueRender(handle);
    };
    img.src = staticFile(`frames/${src}`);
  }, [src, handle]);
  const exists = size === null ? null : size !== false;
  const scrolled = interpolate(
    frame,
    [Math.round(0.5 * fps), durationInFrames],
    scroll,
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: CAMERA },
  );

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
        backgroundColor: C.appPage,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          containerType: "size",
          transformOrigin: focus ? `${focus.x}% ${focus.y}%` : "50% 50%",
          scale: interpolate(
            frame,
            [0, durationInFrames],
            [startScale, focus?.scale ?? (fit === "fill-top" ? 1 : 1.04)],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: CAMERA,
            },
          ),
        }}
      >
        <div
          style={pictureBox(size as { w: number; h: number }, fit, scrolled)}
        >
          <CanvasImage
            src={staticFile(`frames/${src}`)}
            premountFor={fps}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
            }}
          />
          {children}
        </div>
      </div>
    </div>
  );
};

// The picture's box inside the screen, in container units: "contain" centres
// the whole capture; "fill-top" fits its width and slides a tall one by
// `scrolled` percent (0 = top, 100 = bottom).
function pictureBox(
  size: { w: number; h: number },
  fit: "contain" | "fill-top",
  scrolled: number,
): React.CSSProperties {
  const a = size.w / size.h;
  if (fit === "fill-top") {
    const h = `calc(100cqw / ${a})`;
    return {
      position: "absolute",
      left: 0,
      width: "100cqw",
      height: h,
      top: `min(0px, calc((100cqh - ${h}) * ${scrolled / 100}))`,
    };
  }
  const w = `min(100cqw, calc(100cqh * ${a}))`;
  const h = `min(100cqh, calc(100cqw / ${a}))`;
  return {
    position: "absolute",
    width: w,
    height: h,
    left: `calc((100cqw - ${w}) / 2)`,
    top: `calc((100cqh - ${h}) / 2)`,
  };
}
