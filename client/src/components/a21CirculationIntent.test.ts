import { describe, expect, it } from "vitest";
import { buildA21P3Graph, buildA21P3NegativeControls, validateA21P3Graph } from "./a21CirculationIntent";

describe("A21-P3 architectural circulation intent", () => {
  it("builds the HOUSE-A21 graph without creating geometry", () => {
    const model = buildA21P3Graph();
    expect(validateA21P3Graph(model)).toBe(true);
    expect(model.graphId).toBe("HOUSE-A21-CIRCULATION-INTENT");
    expect(model.routes.map((route) => route.routeId)).toEqual(expect.arrayContaining(["HOUSE-A21:R01:ACCESS-TO-SOCIAL", "HOUSE-A21:R03:PRIVATE-CONTROLLED", "HOUSE-A21:R05:VERTICAL"]));
    expect(model.noGeometryMutation).toBe(true);
    expect(model.nodes.some((node) => node.nodeId === "STAIR")).toBe(false);
    expect(model.warnings.join(" ")).toContain("not corridor geometry");
  });
  it("preserves the missing social-bath access as unknown", () => {
    const model = buildA21P3Graph();
    const route = model.routes.find((item) => item.routeId === "HOUSE-A21:R06:SOCIAL-BATH");
    expect(route?.epistemicState).toBe("UNKNOWN");
    expect(model.intentObservations.find((item) => item.intentId === route?.routeId)?.result).not.toBe("OBSERVED");
  });
  it("keeps negative controls bounded and non-certifying", () => {
    const negative = buildA21P3NegativeControls();
    expect(negative.conflictPreserved).toBe(true);
    expect(negative.incompleteRoute).toBe(true);
    expect(negative.verticalNoStairInference).toBe(true);
    expect(negative.accessibilityNotAssessed).toBe(true);
    expect(negative.regulatoryNotAssessed).toBe(true);
  });
});
