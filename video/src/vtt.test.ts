import { describe, expect, it } from "vitest";
import { FILM } from "./film";
import type { Manifest } from "./manifest";
import { toVtt } from "./vtt";

const manifest: Manifest = {
  guests: "150",
  pricePerGuest: "$95.00",
  foodCostPct: "28.3%",
  deposit: "$3,500.00",
  revenue: "$14,250.00",
  displayPrice: "$49/month",
  trialDays: "15",
  developCommit: "e00299078",
  capturedOn: "2026-10-05",
};

describe("toVtt", () => {
  const vtt = toVtt(manifest);
  it("is a WebVTT file", () => {
    expect(vtt.startsWith("WEBVTT\n\n")).toBe(true);
  });
  it("carries every caption once, resolved", () => {
    const total = Object.values(FILM).reduce(
      (n, s) => n + s.captions.length,
      0,
    );
    expect(vtt.match(/ --> /g)?.length).toBe(total);
    expect(vtt).toContain("A wedding. About 150 guests. No date yet.");
    expect(vtt).not.toMatch(/\{\w+\}/);
  });
  it("times the first caption from 2.5 s to the cold open's end", () => {
    expect(vtt).toContain("00:00:02.500 --> 00:00:06.000\nA wedding.");
  });
  it("orders cues by start time", () => {
    const starts = [...vtt.matchAll(/^(\d\d):(\d\d):(\d\d\.\d{3}) -->/gm)].map(
      (m) => Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]),
    );
    expect(starts).toEqual([...starts].sort((a, b) => a - b));
  });
});
