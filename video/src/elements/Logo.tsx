import type React from "react";
import { FONT_DISPLAY } from "../fonts";
import { C } from "../tokens";

// The site's lockup (src/components/BrandLockup.astro): the green mark from
// public/brand/costcook-icon.svg beside "CostCook" set in Fraunces 600.
// `size` is the wordmark's font size; the mark is 1.375em, as on the site.
export const Logo: React.FC<{ size: number; style?: React.CSSProperties }> = ({
  size,
  style,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: size * 0.3,
      fontFamily: FONT_DISPLAY,
      fontWeight: 600,
      fontSize: size,
      lineHeight: 1,
      color: C.ink,
      ...style,
    }}
  >
    <svg
      viewBox="0 0 64 64"
      width={size * 1.375}
      height={size * 1.375}
      fill="none"
      aria-hidden="true"
    >
      <path
        fill={C.green}
        fillRule="evenodd"
        d="M49.6 30.1 Q47 24 44 22 L59 11 A6 6 0 0 0 50.5 2.5 L36 17 A23 23 0 1 0 49.6 45.9 L40.2 42.5 A13 13 0 1 1 40.2 33.5 Z M56.8 6.8 A1.8 1.8 0 1 1 53.2 6.8 A1.8 1.8 0 1 1 56.8 6.8 Z"
      />
    </svg>
    CostCook
  </div>
);
