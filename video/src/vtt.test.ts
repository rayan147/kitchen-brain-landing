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
  deposit: "$5,250.00",
  revenue: "$14,250.00",
  offerTotal: "$21,043.00",
  plannedFoodCost: "$3,750.87",
  actualFoodCost: "$3,675.88",
  likelyShare: "25.8%",
  displayPrice: "$49/month",
  trialDays: "15",
  developCommit: "e00299078",
  capturedOn: "2026-10-05",
  frames: [],
  frameSources: {},
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
  // The burned-in caption fades up half a second into its beat; the cue
  // starts with it, not before.
  it("times the first caption from when it shows on screen", () => {
    expect(vtt).toContain(
      "00:00:03.000 --> 00:00:07.000\nShe asks on your site. A Saturday in June, 150 guests, plated.",
    );
  });
  // Scene fades overlap by half a second; a player that stacks overlapping
  // cues would show two captions at once.
  it("never overlaps one cue with the next", () => {
    const times = [...vtt.matchAll(/^(\S+) --> (\S+)$/gm)].map((m) =>
      [m[1], m[2]].map((t) => {
        const [h, mm, ss] = t.split(":");
        return Number(h) * 3600 + Number(mm) * 60 + Number(ss);
      }),
    );
    for (let i = 1; i < times.length; i++)
      expect(times[i - 1][1]).toBeLessThanOrEqual(times[i][0]);
  });
  it("orders cues by start time", () => {
    const starts = [...vtt.matchAll(/^(\d\d):(\d\d):(\d\d\.\d{3}) -->/gm)].map(
      (m) => Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]),
    );
    expect(starts).toEqual([...starts].sort((a, b) => a - b));
  });
});
