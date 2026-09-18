import { describe, expect, it } from "vitest";
import { buildFinalPropagationProof, buildIntegratedProductFoundation, buildPersistentProjectState, restorePersistentProjectState, serializePersistentProjectState, validateIntegratedProductFoundation } from "./src/components/arkiIntegratedProductFoundation";
import type { S2Operation } from "./src/components/arkiAdvancedSpatialEditing";

const operation = { operationId: "S2:MOVE_ROOM:HOUSE-A21:N1:ACCESS:FINAL", kind: "MOVE_ROOM", actor: "HUMAN_ARCHITECT", targetSpaceId: "HOUSE-A21:N1:ACCESS", parameters: { dx: -0.5, dy: 0 }, parentId: "HOUSE-A21-S1-CONCEPTUAL-FLOOR-PLAN", reason: "Human-authorized V-FINAL proof", provenance: ["S2"], authorization: "AUTHORIZED", affectedRelationships: [], affectedGeometry: [], eventIndex: 1 } as S2Operation;

describe("ARKI Macroorders 04–05 integrated product foundation", () => {
  it("connects one project identity across regulation, site, BIM, engineering, drawings and cost", () => {
    const foundation = buildIntegratedProductFoundation();
    expect(validateIntegratedProductFoundation(foundation)).toBe(true);
    expect(foundation.regulatory[0].result).toBe("NO_COMPLIANCE_CLAIM");
    expect(foundation.site.buildableZones).toBe("REQUIRES_DATA");
    expect(foundation.bim.modelVersion).toBe(foundation.model.modelVersion);
    expect(foundation.engineering.records.length).toBeGreaterThan(0);
    expect(foundation.drawings.length).toBe(4);
  });
  it("keeps quantity and cost provenance separate without fabricated rates", () => {
    const foundation = buildIntegratedProductFoundation();
    expect(foundation.quantities.length).toBeGreaterThan(0);
    expect(foundation.quantities.every((item) => item.rate === null && item.cost === null)).toBe(true);
    expect(foundation.quantities.every((item) => item.rateState === "UNKNOWN")).toBe(true);
  });
  it("restores the same coherent state from the local persistence envelope", () => {
    const state = buildPersistentProjectState();
    const restored = restorePersistentProjectState(serializePersistentProjectState(state));
    expect(restored.schemaVersion).toBe("ARKI-PERSISTENCE-1");
    expect(restored.model.modelVersion).toBe(state.model.modelVersion);
    expect(restored.engineering.records.length).toBe(state.engineering.records.length);
    expect(restored.drawings.map((view) => view.viewId)).toEqual(state.drawings.map((view) => view.viewId));
    expect(restored.humanAuthority).toBe("PRESERVED");
  });
  it("proves V-FINAL propagation while keeping Revit external and review human", () => {
    const proof = buildFinalPropagationProof(operation);
    expect(proof.architecture.length).toBeGreaterThan(0);
    expect(proof.drawings).toEqual(expect.arrayContaining([expect.stringContaining("FLOOR_PLAN"), expect.stringContaining("SECTION"), expect.stringContaining("ELEVATION")]));
    expect(proof.visual).toEqual(["3D", "PLAN", "SECTION", "ELEVATION"]);
    expect(proof.regulation).toBe("NO_COMPLIANCE_CLAIM");
    expect(proof.cost).toBe("UNKNOWN_RATES");
    expect(proof.engineering.reEvaluationRequired).toBe(true);
    expect(proof.engineering.geometricMutation).toBe("NOT_EXECUTED");
    expect(proof.humanReviewRequired).toBe(true);
    expect(proof.externalRevit).toBe("EXTERNAL_REVIT_VALIDATION_PENDING");
  });
  it("rejects persistence envelopes that attempt to change authority semantics", () => {
    const state = buildPersistentProjectState();
    const invalid = JSON.parse(serializePersistentProjectState(state));
    invalid.humanAuthority = "AUTOMATED";
    expect(() => restorePersistentProjectState(JSON.stringify(invalid))).toThrow("Invalid ARKI persistence envelope");
  });
});
