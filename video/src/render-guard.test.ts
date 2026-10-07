import { describe, expect, it } from "vitest";
import { frameProblems, sourceCounts } from "./render-guard";

const src = { host: "localhost", app: "05dfa4165" };
const base = {
  developCommit: "e00299078",
  frames: ["a.png", "b.png"],
  frameSources: { "a.png": src, "b.png": src },
};

describe("frameProblems", () => {
  it("passes when every film frame is on disk and was shot by the run", () => {
    expect(
      frameProblems(["a.png", "b.png"], base, new Set(["a.png", "b.png"])),
    ).toEqual([]);
  });
  it("names a frame that is missing on disk", () => {
    expect(
      frameProblems(
        ["a.png", "c.png"],
        {
          ...base,
          frames: ["a.png", "c.png"],
          frameSources: { "a.png": src, "c.png": src },
        },
        new Set(["a.png"]),
      ),
    ).toEqual(["missing frame c.png"]);
  });
  it("refuses a file on disk that the capture run did not shoot", () => {
    expect(
      frameProblems(["a.png", "old.png"], base, new Set(["a.png", "old.png"])),
    ).toEqual(["old.png was not shot from the app by this capture run"]);
  });
  it("refuses the pre-capture placeholder manifest", () => {
    expect(
      frameProblems(
        [],
        { developCommit: "PENDING-CAPTURE", frames: [], frameSources: {} },
        new Set(),
      ),
    ).toEqual(["manifest is the pre-capture placeholder"]);
  });
  it("refuses a frame with no recorded source (host and app)", () => {
    expect(
      frameProblems(
        ["a.png", "b.png"],
        { ...base, frameSources: { "a.png": src } },
        new Set(["a.png", "b.png"]),
      ),
    ).toEqual(["b.png has no recorded source (host and app)"]);
  });
});

describe("sourceCounts", () => {
  it("counts the film's frames by the host and app they came from", () => {
    expect(
      sourceCounts(["a.png", "b.png", "c.png"], {
        "a.png": src,
        "b.png": src,
        "c.png": { host: "test.app.costcook.io", app: "unrecorded" },
      }),
    ).toEqual([
      "2 from localhost at 05dfa4165",
      "1 from test.app.costcook.io at unrecorded",
    ]);
  });
});
