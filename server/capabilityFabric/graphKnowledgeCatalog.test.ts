import { describe, expect, it } from "vitest";
import { compileParametricGraphIR } from "./parametricGraphIr";
import { enrichParametricGraph } from "./enrichedParametricGraph";
import { indexEnrichedGraph } from "./graphKnowledgeCatalog";

describe("ARKI graph knowledge catalog", () => {
  it("indexes an enriched harvested graph by capability, intent and minimal interface", () => {
    const graph = compileParametricGraphIR({
      contractVersion: "ARKI-PARAMETRIC-1.0",
      graphId: "facade-morph",
      nodes: [
        { id: "base", op: "rectangle_points", params: { width: 8, height: 4 } },
        { id: "morph", op: "scale_points", params: { points: "$base", factor: 1.2 } },
      ],
      outputs: ["morph"],
      units: "m",
      tolerance: 0.001,
      humanReviewRequired: true,
    }, { sourceFormat: "DYNAMO", sourceArtifact: "community-facade.dyn" });

    const enriched = enrichParametricGraph({
      graph,
      originStatement: "Harvested and normalized from Dynamo.",
      capsules: [{
        capsuleId: "facade-morph",
        label: "Morph facade pattern",
        capability: "FACADE_GEOMETRY_MORPH",
        intent: "Adapt a facade pattern while preserving its parametric controls.",
        scales: ["BUILDING"],
        exposedPorts: [
          { name: "basePattern", role: "INPUT", dataType: "GEOMETRY", required: true, architecturalMeaning: "Source facade pattern" },
          { name: "morphFactor", role: "INPUT", dataType: "NUMBER", required: true, architecturalMeaning: "Controlled deformation magnitude" },
          { name: "facadeGeometry", role: "OUTPUT", dataType: "GEOMETRY", required: true, architecturalMeaning: "Candidate facade geometry" },
        ],
        memberNodeIds: ["base", "morph"],
        sourceArtifact: "community-facade.dyn",
        origin: "DYNAMO_HARVEST",
        constraints: ["Preserve source provenance"],
        executionCandidates: ["DYNAMO_EXTERNAL_HOST", "COMPAS"],
        semanticStatus: "DESCRIPTIVE_PROPOSAL",
      }],
    });

    const record = indexEnrichedGraph(enriched);
    expect(record.capabilities).toEqual(["FACADE_GEOMETRY_MORPH"]);
    expect(record.exposedInterfaces[0]).toEqual({
      capsuleId: "facade-morph",
      inputs: ["basePattern", "morphFactor"],
      outputs: ["facadeGeometry"],
    });
    expect(record.sourceArtifacts).toEqual(["community-facade.dyn"]);
    expect(record.fingerprint).toMatch(/^sha256:/);
    expect(record.canonicalMutation).toBe(false);
  });
});
