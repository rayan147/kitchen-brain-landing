import type React from "react";
import { C } from "../tokens";

export const PhoneFrame: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      position: "relative",
      width: 460,
      height: 940,
      borderRadius: 56,
      padding: 14,
      backgroundColor: C.ink,
      boxShadow:
        "0 1px 2px rgb(31 36 33 / 0.08), 0 24px 60px rgb(31 36 33 / 0.18)",
      ...style,
    }}
  >
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: 42,
        overflow: "hidden",
        backgroundColor: C.paper,
      }}
    >
      {children}
    </div>
  </div>
);
