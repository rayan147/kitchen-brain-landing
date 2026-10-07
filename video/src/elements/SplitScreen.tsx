import type React from "react";
import { C } from "../tokens";

// The caterer's screen on the left, the client's phone on the right.
export const SplitScreen: React.FC<{
  left: React.ReactNode;
  right: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ left, right, style }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      display: "grid",
      gridTemplateColumns: "1.45fr 1fr",
      gap: 48,
      padding: 72,
      backgroundColor: C.offwhite,
      ...style,
    }}
  >
    <div
      style={{
        position: "relative",
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: left ? C.paper : "transparent",
      }}
    >
      {left}
    </div>
    <div
      style={{ position: "relative", display: "grid", placeItems: "center" }}
    >
      {right}
    </div>
  </div>
);
