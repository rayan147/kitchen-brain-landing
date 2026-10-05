import { describe, expect, it } from "vitest";
import { frameProblems } from "./render-guard";

const base = { developCommit: "e00299078", frames: ["a.png", "b.png"] };

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
        { ...base, frames: ["a.png", "c.png"] },
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
        { developCommit: "PENDING-CAPTURE", frames: [] },
        new Set(),
      ),
    ).toEqual(["manifest is the pre-capture placeholder"]);
  });
});
