import { describe, expect, it } from "vitest";
import { compileParametricGraphIR } from "./parametricGraphIr";
import { enrichParametricGraph } from "./enrichedParametricGraph";

describe("enriched hierarchical ARKI graph", () => {
  const ir = compileParametricGraphIR({
    contractVersion: "ARKI-PARAMETRIC-1.0",
    graphId: "harvested-path-routine",
    nodes: [
      { id: "boundary", op: "rectangle_points", params: { width: 50, height: 30 } },
      { id: "translated", op: "translate_points", params: { points: "$boundary", dx: 2, dy: 2 } },
      { id: "scaled", op: "scale_points", params: { points: "$translated", factor: 0.9 } },
    ],
    outputs: ["scaled"],
    units: "m",
    tolerance: 0.001,
    humanReviewRequired: true,
  }, { sourceFormat: "DYNAMO", sourceArtifact: "community-example.dyn" });

  it("capsulizes a complex routine behind a small architectural interface without losing internals", () => {
    const enriched = enrichParametricGraph({
      graph: ir,
      originStatement: "Imported from a Dynamo community graph and preserved by provenance.",
      capsules: [{
        capsuleId: "park-zone-generator",
        label: "Generate park zones",
        capability: "SPATIAL_SUBDIVISION",
        intent: "Organize activity zones inside a bounded park area.",
        scales: ["CAMPUS_PARK"],
        exposedPorts: [
          { name: "siteBoundary", role: "INPUT", dataType: "BOUNDARY_2D", required: true, architecturalMeaning: "Park design boundary" },
          { name: "activityWeights", role: "INPUT", dataType: "NUMBER_LIST", required: false, architecturalMeaning: "Relative program-area demand" },
          { name: "zones", role: "OUTPUT", dataType: "REGION_LIST", required: true, architecturalMeaning: "Candidate activity regions" },
        ],
        memberNodeIds: ["boundary", "translated", "scaled"],
        sourceArtifact: "community-example.dyn",
        origin: "DYNAMO_HARVEST",
        constraints: ["Remain inside site boundary"],
        executionCandidates: ["COMPAS", "DYNAMO_EXTERNAL_HOST"],
        semanticStatus: "DESCRIPTIVE_PROPOSAL",
      }],
    });

    expect(enriched.capsules[0].exposedPorts).toHaveLength(3);
    expect(enriched.graph.nodes).toHaveLength(3);
    expect(enriched.graph.edges).toHaveLength(2);
    expect(enriched.authority).toEqual({
      computationalGraph: "ARKI_GRAPH_IR",
      architecturalMeaning: "D2",
      operationalGeometry: "AGK",
      canonicalMutation: false,
    });
  });

  it("cannot silently promote harvested semantic annotations into canonical D-2 truth", () => {
    expect(() => enrichParametricGraph({
      graph: ir,
      originStatement: "test",
      capsules: [{
        capsuleId: "bad",
        label: "Bad",
        capability: "TEST",
        intent: "test",
        scales: ["BUILDING"],
        exposedPorts: [{ name: "out", role: "OUTPUT", dataType: "ANY", required: true, architecturalMeaning: "test" }],
        memberNodeIds: ["boundary"],
        sourceArtifact: null,
        origin: "ARKI_NATIVE",
        constraints: [],
        executionCandidates: [],
        semanticStatus: "CANONICAL" as never,
      }],
    })).toThrow("CAPSULE_CANNOT_ASSERT_D2_TRUTH:bad");
  });
});
