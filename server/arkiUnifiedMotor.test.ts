import { describe, expect, it } from "vitest";
import { executeArkiUnifiedMotor, unifiedMotorCapability, type UnifiedMotorInput } from "./arkiUnifiedMotor";

const input: UnifiedMotorInput = {
  projectId: "RES-TAU-500-004", projectName: "Restaurante integrado", typology: "RESTAURANT", brief: "Restaurant for 500 people with public, service, supply and waste flows.", context: { location: "Peru", occupancy: 500 }, constraints: ["Separate public and service flows", "Conceptual geometry only", "Human review required"],
  activities: [{ id: "public", label: "public dining", subjects: ["guest"], capacity: 500, frequency: "daily", duration: "long", temporalOverlap: true, privacy: "shared" }, { id: "service", label: "supply and waste service", subjects: ["staff"], capacity: 30, frequency: "daily", duration: "medium", temporalOverlap: true, accessControl: "staff", privacy: "controlled" }],
  relationships: [{ id: "r1", from: "public", to: "service", relation: "controlled service interface", subjects: ["guest", "staff"], state: "open", frequency: "daily", time: "operating-hours", control: "staff-mediated" }], subjects: ["guest", "staff"], conditions: ["service route reaches kitchen and storage", "waste route is evaluated separately"], unknowns: ["local code and egress capacity require professional review"], envelope: { width: 20, height: 40 }, sourceIds: ["SRC-RESTAURANT-BRIEF", "SRC-TYPOLOGY-REGISTRY"],
};

describe("ARKI-UNIFIED-MOTOR-1.0", () => {
  it("routes active, frozen, blocked and not-demonstrated pieces through one trace", () => {
    const result = executeArkiUnifiedMotor(input);
    expect(result.motorVersion).toBe("ARKI-UNIFIED-MOTOR-1.0");
    expect(result.status).toBe("PASS_WITH_BOUNDS");
    expect(result.triad.oneMotor).toBe(true);
    expect(result.triad.components.map((component) => component.id)).toEqual(["ARKI_SUPER_ARCHITECT", "ARKI_GRAPHIC_INTELLIGENCE", "ARKI_ETI_BIM"]);
    expect(result.triad.canonicalIdentity).toBe("ONE_PROJECT_STATE");
    expect(result.pieceRegistry.length).toBeGreaterThanOrEqual(10);
    expect(result.routing.find((item) => item.pieceId === "D6.2-M")?.route).toBe("EXECUTE");
    expect(result.routing.find((item) => item.pieceId === "MC-02")?.route).toBe("REFERENCE");
    expect(result.routing.find((item) => item.pieceId === "DG-01B")?.route).toBe("HOLD");
    expect(result.routing.find((item) => item.pieceId === "BIM-DWG-REVIT-GIS")?.route).toBe("HOLD");
  });

  it("preserves frozen and blocked status instead of silently activating it", () => {
    const result = executeArkiUnifiedMotor(input);
    const capability = unifiedMotorCapability(result);
    expect(capability.oneMotor).toBe(true);
    expect(capability.frozenPiecesPreserved).toEqual(expect.arrayContaining(["MC-02", "MC-03", "FKCG-02"]));
    expect(capability.blockedPiecesHeld).toEqual(expect.arrayContaining(["DG-01B", "BIM-DWG-REVIT-GIS"]));
    expect(capability.canUseFrozenAsEvidence).toBe(true);
    expect(capability.canSilentlyActivateFrozen).toBe(false);
    expect(capability.canClaimProfessionalCompletion).toBe(false);
    expect(capability.triad.representationPolicy).toBe("SAME_SEMANTIC_IDENTITY_MULTIPLE_CONTROLLED_REPRESENTATIONS");
  });

  it("supports a requested subset while retaining the same motor and human authority", () => {
    const result = executeArkiUnifiedMotor({ ...input, requestedPieces: ["D6.2-M", "PARTI-CONTRACT-1.0", "MC-02", "DG-01B"] });
    expect(result.pieceRegistry.map((item) => item.id)).toEqual(["D6.2-M", "PARTI-CONTRACT-1.0", "MC-02", "DG-01B"]);
    expect(result.humanAuthority).toBe("FINAL");
    expect(result.cycle.evaluation.humanDecision).toBe("PENDING");
  });
});
