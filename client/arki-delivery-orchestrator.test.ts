import { describe, expect, it } from "vitest";
import { buildArkiDeliveryPackage, validateArkiDeliveryPackage } from "./src/components/arkiDeliveryOrchestrator";

describe("ARKI delivery orchestrator", () => {
  it("derives consistent conceptual outputs from the canonical model", () => {
    const delivery = buildArkiDeliveryPackage();
    expect(validateArkiDeliveryPackage(delivery)).toBe(true);
    expect(delivery.drawingViews.map((view) => view.kind)).toEqual(expect.arrayContaining(["FLOOR_PLAN", "SITE_PLAN", "BUILDING_SECTION", "EXTERIOR_ELEVATION"]));
    expect(delivery.consistency.noAutomaticDecision).toBe(true);
  });
  it("does not present external workflows as locally verified", () => {
    const delivery = buildArkiDeliveryPackage();
    expect(delivery.artifacts.find((item) => item.kind === "IFC")?.state).toBe("EXTERNAL_VALIDATION_REQUIRED");
    expect(delivery.artifacts.find((item) => item.kind === "GEOJSON")?.state).toBe("REQUIRES_DATA");
    expect(delivery.externalDependencies).toContain("Revit runtime");
  });
});
