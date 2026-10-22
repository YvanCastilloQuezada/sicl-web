import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const folder = new URL(".", import.meta.url);
const read = (name: string) =>
  readFileSync(new URL(name, folder), "utf8");

describe("ACE85 provenance propagation", () => {
  it("does not hardcode educational authority in HTTP views", () => {
    const viewer = read("UPAO001SpatialViewer.tsx");
    const comparison = read("UPAO001SpatialComparison.tsx");

    const viewerMain = viewer.split(
      "export default function UPAO001SpatialViewer()"
    )[1];

    expect(viewerMain).toBeTruthy();
    expect(viewerMain).toContain(
      "authorityStatus={authority.status}"
    );
    expect(comparison).toContain(
      "authorityStatus={authorityStatus}"
    );
    expect(comparison).toContain(
      "authorityStatus={authority.status}"
    );
    expect(comparison).toContain(
      'authorityStatus === "DERIVED"'
    );
    expect(viewer).toContain(
      'authorityStatus === "DERIVED"'
    );
  });
});
