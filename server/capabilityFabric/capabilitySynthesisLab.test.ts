import { describe, expect, it } from "vitest";
import { inventionArchiveCell, validateComposition, type CapabilityComposition } from "./capabilitySynthesisLab";

describe("capability synthesis lab", () => {
  const candidate: CapabilityComposition = {
    candidateId: "invent-park-visibility-paths",
    goalCapability: "VISIBILITY_AWARE_PEDESTRIAN_LAYOUT",
    primitives: [
      {
        primitiveId: "isovist",
        capability: "ISOVIST_VISIBILITY",
        inputs: [{ name: "space", dataType: "REGION_2D", semanticRole: "walkable domain" }],
        outputs: [{ name: "field", dataType: "SCALAR_FIELD_2D", semanticRole: "visibility field" }],
        sourceRefs: ["refinery-space-planning-toolkit"],
        deterministic: true,
        licenseGate: "PASS",
      },
      {
        primitiveId: "path",
        capability: "PEDESTRIAN_PATH_NETWORK",
        inputs: [{ name: "costField", dataType: "SCALAR_FIELD_2D", semanticRole: "routing cost" }],
        outputs: [{ name: "network", dataType: "GRAPH_2D", semanticRole: "pedestrian network" }],
        sourceRefs: ["space-analysis"],
        deterministic: "UNKNOWN",
        licenseGate: "EXTERNAL_ONLY",
      },
    ],
    links: [{
      fromPrimitiveId: "isovist",
      fromPort: "field",
      toPrimitiveId: "path",
      toPort: "costField",
      dataType: "SCALAR_FIELD_2D",
    }],
    noveltyClaims: ["Use visibility as a routing cost rather than only an evaluation metric."],
    requiredOracles: ["PATH_VALIDITY", "BOUNDARY_CONTAINMENT", "VISIBILITY_RECOMPUTATION"],
    status: "SANDBOX_PROPOSAL",
    canonicalMutation: false,
  };

  it("accepts a typed multi-library composition only into sandbox", () => {
    expect(validateComposition(candidate)).toEqual({ acceptedForSandbox: true, failures: [] });
    expect(candidate.status).toBe("SANDBOX_PROPOSAL");
    expect(candidate.canonicalMutation).toBe(false);
  });

  it("fails closed on incompatible ports", () => {
    const bad = structuredClone(candidate);
    bad.links[0].dataType = "MESH_3D";
    expect(validateComposition(bad).failures).toContain(
      "TYPE_MISMATCH:isovist.field->path.costField",
    );
  });

  it("fails closed when a component has unknown licensing", () => {
    const bad = structuredClone(candidate);
    bad.primitives[1].licenseGate = "UNKNOWN";
    expect(validateComposition(bad).failures).toContain("LICENSE_UNKNOWN:path");
  });

  it("archives diverse useful inventions by behavior rather than one global winner", () => {
    expect(inventionArchiveCell({
      candidateId: "x",
      feasibility: 0.9,
      usefulness: 0.8,
      novelty: 0.7,
      robustness: 0.9,
      architecturalRelevance: 1,
      evidenceCoverage: 0.8,
    })).toBe("novelty:3|utility:4|architecture:4");
  });
});
