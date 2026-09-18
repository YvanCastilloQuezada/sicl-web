import { describe, expect, it } from "vitest";
import { compareCirculationEvidenceGraphs, deriveCirculationEvidenceGraph, validateCirculationEvidenceGraph } from "./circulationEvidenceGraph";
import type { SpatialRepresentation } from "./UPAO001SpatialViewer";

function representation(alternativeId: string, metadata: Record<string, unknown> = {}): SpatialRepresentation {
  return {
    id: `rep-${alternativeId}`, alternative_id: alternativeId, spatial_scope: "edificacion", representation_version: "S2", generator_version: "test", coordinate_system: "LOCAL", units: "m", input_fingerprint: "fixture", north_degrees: 0,
    elements: [{ id: "CIRC-01", element_type: "CirculationElement", geometry: { type: "polyline", coordinates: [[0, 0], [4, 0]] }, metadata, labels: { es: "Circulación principal" } }],
  };
}

describe("A20-P1 circulation evidence graph", () => {
  it("observes circulation but does not infer a route, loop, accessibility, or compliance", () => {
    const graph = deriveCirculationEvidenceGraph(representation("A"));
    expect(graph.nodes.map((node) => node.id)).toContain("CIRC-01");
    expect(graph.continuity).toBe("UNKNOWN");
    expect(graph.loop).toBe("UNKNOWN");
    expect(graph.spine).toBe("UNKNOWN");
    expect(graph.accessibleRoute).toBe("NOT_ASSESSED");
    expect(graph.compliance).toBe("NOT_ASSESSED");
    expect(graph.provenance).toContain("actual CirculationElement metadata");
    expect(validateCirculationEvidenceGraph(graph)).toBe(true);
  });

  it("creates only explicit edges from declared metadata", () => {
    const graph = deriveCirculationEvidenceGraph(representation("A", { access_point: "NORTH", connects_to: ["SPACE-01"], direction: "EAST" }));
    expect(graph.edges.map((edge) => edge.id)).toEqual(["CIRC-01:access->CIRC-01", "CIRC-01->SPACE-01"]);
    expect(graph.edges[1].state).toBe("OBSERVED");
    expect(graph.nodes.find((node) => node.id === "SPACE-01")?.state).toBe("UNVERIFIED");
    expect(graph.accessibleRoute).toBe("NOT_ASSESSED");
  });

  it("reports A/B graph changes without repairing or judging them", () => {
    const source = deriveCirculationEvidenceGraph(representation("A", { connects_to: ["SPACE-01"] }));
    const result = deriveCirculationEvidenceGraph(representation("B", { connects_to: ["SPACE-02"] }));
    const comparison = compareCirculationEvidenceGraphs(source, result);
    expect(comparison.edgeChanges.some((item) => item.id === "CIRC-01->SPACE-01" && item.change === "BROKEN")).toBe(true);
    expect(comparison.edgeChanges.some((item) => item.id === "CIRC-01->SPACE-02" && item.change === "CHANGED")).toBe(true);
    expect(comparison.humanReviewRequired).toBe(true);
    expect(comparison.noAutomaticRepair).toBe(true);
    expect(comparison.accessibleRoute).toBe("NOT_ASSESSED");
    expect(comparison.compliance).toBe("NOT_ASSESSED");
  });

  it("keeps an access point separate from an accessibility claim", () => {
    const graph = deriveCirculationEvidenceGraph(representation("A", { access_point: "SOUTH" }));
    expect(graph.nodes.some((node) => node.kind === "ACCESS")).toBe(true);
    expect(graph.accessibleRoute).toBe("NOT_ASSESSED");
    expect(graph.compliance).toBe("NOT_ASSESSED");
  });
});
