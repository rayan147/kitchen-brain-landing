import { describe, expect, it } from "vitest";
import { FILM, SCENE_ORDER } from "./film";
import type { Manifest } from "./manifest";
import { toVtt } from "./vtt";

const manifest: Manifest = {
  guests: "150",
  pricePerGuest: "$95.00",
  foodCostPct: "28.4%",
  proposalFoodCostPct: "28.3%",
  target: "30%",
  deposit: "$3,500.00",
  revenue: "$14,250.00",
  displayPrice: "$49/month",
  trialDays: "15",
  developCommit: "e00299078",
  capturedOn: "2026-10-05",
  frames: [],
};

describe("toVtt", () => {
  const vtt = toVtt(manifest);
  it("is a WebVTT file", () => {
    expect(vtt.startsWith("WEBVTT\n\n")).toBe(true);
  });
  it("carries every caption once, resolved", () => {
    const total = SCENE_ORDER.reduce(
      (n, id) => n + FILM[id].beats.filter((b) => b.caption).length,
      0,
    );
    expect(vtt.match(/ --> /g)?.length).toBe(total);
    expect(vtt).not.toMatch(/\{\w+\}/);
  });
  it("times the first caption from its beat", () => {
    expect(vtt).toContain(
      "00:00:03.000 --> 00:00:07.000\nA wedding. About 150 guests. No date yet.",
    );
  });
  it("orders cues by start time", () => {
    const starts = [...vtt.matchAll(/^(\d\d):(\d\d):(\d\d\.\d{3}) -->/gm)].map(
      (m) => Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]),
    );
    expect(starts).toEqual([...starts].sort((a, b) => a - b));
  });
});
