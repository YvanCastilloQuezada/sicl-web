import { describe, expect, it } from "vitest";
import type { BimViewerModel } from "./arkiBimViewer";
import { F7_ADAPTER_AUTHORITY_CONTRACT, projectCostModelToF7, projectMepCoordinationToF7 } from "./arkiProfessionalAdapters";

const baseModel: BimViewerModel = {
  modelId: "M1", name: "MEP", format: "ARK", version: "1", units: "m", coordinateSystem: "LOCAL",
  sourceIds: ["SRC-1"], humanReviewRequired: true,
  elements: [{
    id: "PIPE-1", kind: "PIPE", name: "Pipe", discipline: "MEP", sourceId: "SRC-1",
    box: { min: [0, 0, 0], max: [1, 1, 1] },
    properties: { system: "SANITARY", elevationM: 1 },
  }],
};

describe("F7 existing-capability adapters", () => {
  it("keeps MEP adapter noncanonical and exposes specialist review", () => {
    const result = projectMepCoordinationToF7({
      projectionId: "MEP-P1", models: [baseModel], semanticIds: ["S1"], agkObjectIds: ["AGK-1"], sourceClaimIds: ["C1"],
    });
    expect(F7_ADAPTER_AUTHORITY_CONTRACT.canonicalMutation).toBe(false);
    expect(result.projection.discipline).toBe("MEP");
    expect(result.projection.specialistReviewRequired).toBe(true);
  });

  it("turns incomplete cost provenance into visible F7 issues instead of PASS", () => {
    const result = projectCostModelToF7({
      projectionId: "COST-P1", projectId: "P1", currency: "PEN",
      semanticIds: ["S1"], agkObjectIds: ["AGK-1"], sourceClaimIds: ["C1"],
      lines: [{
        id: "L1", type: "INPUT_UNIT_PRICE", description: "Wall", unit: "m2", quantity: 10, unitPrice: 100,
        currency: "PEN", confidence: "DECLARED", taxStatus: "UNKNOWN",
      }],
    });
    expect(result.projection.evidenceState).toBe("PARTIAL");
    expect(result.issues.length).toBeGreaterThan(0);
    expect(result.projection.unknowns).toEqual(expect.arrayContaining([
      "COST_WARNING:MISSING_SOURCE:L1",
      "COST_WARNING:TAX_STATUS_UNKNOWN:L1",
      "COST_WARNING:REGION_UNKNOWN:L1",
    ]));
  });
});
