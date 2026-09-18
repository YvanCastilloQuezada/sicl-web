import { describe, expect, it } from "vitest";
import { buildEngineeringIntelligence, buildEngineeringProof, validateEngineeringIntelligence } from "./src/components/arkiBuildingEngineeringIntelligence";

describe("ARKI Building Engineering Intelligence E1-E48", () => {
  it("registers 48 disciplines with bounded applicability", () => {
    const result = buildEngineeringIntelligence("HOUSING");
    expect(result.disciplines).toHaveLength(48);
    expect(result.disciplines.map((item) => item.code)).toEqual(Array.from({ length: 48 }, (_, index) => `E${index + 1}`));
    expect(result.disciplines.every((item) => item.performanceWithoutCalculation === "UNKNOWN")).toBe(true);
  });
  it("differentiates applicability by project type", () => {
    const proof = buildEngineeringProof();
    expect(proof.disciplineApplicability).toBe(true);
    expect(proof.healthcare.disciplines.find((item) => item.name === "DATA_CENTER_INFRASTRUCTURE")?.applicability.MISSION_CRITICAL_DATA_CENTER).toBe("APPLICABLE");
    expect(proof.housing.disciplines.find((item) => item.name === "MEDICAL_GASES")?.applicability.HOUSING).toBe("NOT_APPLICABLE");
  });
  it("reserves technical rooms, shafts, routes and maintenance paths conceptually", () => {
    const proof = buildEngineeringProof();
    expect(proof.technicalSpaceReservation).toBe(true);
    expect(proof.integratedCore).toBe(true);
    expect(proof.housing.reservations.every((item) => item.epistemicState === "CONCEPTUAL")).toBe(true);
  });
  it("builds dependencies and conceptual routing without claiming final coordination", () => {
    const proof = buildEngineeringProof();
    expect(proof.dependencyGraph).toBe(true);
    expect(proof.conceptualRouting).toBe(true);
    expect(proof.routeConflictDetection).toBe(true);
    expect(proof.housing.conflicts.some((item) => item.geometryRequired)).toBe(true);
  });
  it("propagates engineering consequences without automatic mutation", () => {
    const proof = buildEngineeringProof();
    expect(proof.feedback).toBe(true);
    expect(proof.housing.impacts[0].affectedSystems).toContain("ELEVATORS");
    expect(proof.housing.impacts[0].affectedSystems).toContain("HVAC");
    expect(proof.housing.impacts[0].geometricMutation).toBe("NOT_EXECUTED");
    expect(proof.housing.impacts[0].freshReadbackRequired).toBe(true);
  });
  it("preserves epistemic control and no-fake-number boundaries", () => {
    const proof = buildEngineeringProof();
    expect(proof.validation).toBe(true);
    expect(validateEngineeringIntelligence(proof.dataCenter)).toBe(true);
    expect(proof.noFakeNumbers).toBe(true);
    expect(proof.unknownPreservation).toBe(true);
    expect(proof.housing.performance.structural).toBe("UNKNOWN");
    expect(proof.housing.performance.hydraulic).toBe("UNKNOWN");
    expect(proof.housing.performance.electrical).toBe("UNKNOWN");
    expect(proof.housing.performance.hvac).toBe("UNKNOWN");
    expect(proof.housing.noAutomaticDecision).toBe(true);
    expect(proof.housing.noAutomaticWinner).toBe(true);
    expect(proof.housing.humanAuthority).toBe("PRESERVED");
  });
});
