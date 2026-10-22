import { describe, expect, it } from "vitest";
import { compileParametricGraphIR } from "./parametricGraphIr";

describe("ARKI parametric graph IR", () => {
  it("turns implicit runtime references into explicit graph edges", () => {
    const ir = compileParametricGraphIR({
      contractVersion: "ARKI-PARAMETRIC-1.0",
      graphId: "space-plan",
      nodes: [
        { id: "boundary", op: "rectangle_points", params: { width: 20, height: 12 } },
        { id: "shifted", op: "translate_points", params: { points: "$boundary", dx: 2, dy: 3 } },
        { id: "scaled", op: "scale_points", params: { points: "$shifted", factor: 1.1 } },
      ],
      outputs: ["scaled"],
      units: "m",
      tolerance: 0.001,
      humanReviewRequired: true,
    }, { sourceFormat: "HARVESTED_ROUTINE", sourceArtifact: "Refinery.SpacePlanning" });

    expect(ir.edges).toEqual([
      { fromNodeId: "boundary", fromPort: "result", toNodeId: "shifted", toPort: "points" },
      { fromNodeId: "shifted", fromPort: "result", toNodeId: "scaled", toPort: "points" },
    ]);
    expect(ir.provenance).toEqual({
      sourceFormat: "HARVESTED_ROUTINE",
      sourceArtifact: "Refinery.SpacePlanning",
    });
  });

  it("fails closed when a graph references a missing node", () => {
    expect(() => compileParametricGraphIR({
      contractVersion: "ARKI-PARAMETRIC-1.0",
      graphId: "broken",
      nodes: [{ id: "moved", op: "translate_points", params: { points: "$missing", dx: 1, dy: 1 } }],
      outputs: ["moved"],
      units: "m",
      tolerance: 0.001,
      humanReviewRequired: true,
    })).toThrow("GRAPH_REFERENCE_NOT_FOUND:missing");
  });
});
