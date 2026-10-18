import { describe, expect, it } from "vitest";
import { emptySnapshot } from "./siclCore";
import { executeD63G, type D63Input } from "./arkiD63GeometricBridge";

describe("D6.3-G traceable topology-to-geometry bridge", () => {
  const input: D63Input = {
    executionId: "D63G-MICRO-001", projectId: "D63G-PROJECT", brief: "A small public service with an orientation activity and a controlled staff intake activity.", typology: "CIVIC_SERVICE_MICROCASE",
    activities: [{ id: "public-orientation", label: "public orientation", subjects: ["visitor"], capacity: 8, frequency: "daily", duration: "short", temporalOverlap: true, privacy: "shared" }, { id: "staff-intake", label: "staff intake", subjects: ["staff"], capacity: 3, frequency: "daily", duration: "medium", temporalOverlap: true, accessControl: "staff", privacy: "controlled" }],
    subjects: ["visitor", "staff"], relationships: [{ id: "r1", from: "public-orientation", to: "staff-intake", relation: "controlled service interface", subjects: ["visitor", "staff"], state: "open", frequency: "daily", time: "business-hours", control: "staff-mediated" }],
    conditions: ["visitor and staff activities may overlap"], constraints: ["No rooms, walls, doors or solution geometry are supplied."], unknowns: ["exact service capacity after peak demand is unknown"], perturbation: { id: "p1", statement: "staff-mediated control is unavailable at peak", changes: { separationCondition: "stronger separation" } }, envelope: { width: 18, height: 12, status: "EXPLICIT_PROJECT_DIMENSION" }, separationCondition: "staff-mediated control must remain legible and non-overlapping",
  };

  it("passes G1-G12 and demonstrates two geometries for one topology", () => {
    const snapshot = { ...emptySnapshot(), knowledge: [{ id: "KN-D63-1", kind: "INVARIANT", title: "Topology precedes geometry", statement: "Topology is not geometry.", epistemicStatus: "FACT", sourceIds: ["SRC"], evidenceIds: [], version: 1 }] };
    const result = executeD63G(input, snapshot, 1, "D6.3-G-test");
    expect(result.finalStatus).toBe("PASS");
    expect(Object.values(result.gates).every((value) => value === "PASS")).toBe(true);
    expect(result.candidateA.id).not.toBe(result.candidateB.id);
    expect(result.meaningfulDifference.status).toBe("PASS");
    expect(result.validationA.geometricValidity).toBe("PASS");
    expect(result.validationB.geometricValidity).toBe("PASS");
    expect(result.reasoning.retrievedKnowledge.map((item) => item.id)).toContain("KN-D63-1");
  });

  it("keeps geometry traceable and parameters exploratory rather than verified", () => {
    const result = executeD63G(input, emptySnapshot(), 1, "D6.3-G-test");
    expect(result.mutations).toHaveLength(2);
    expect(result.mutations.every((item) => item.parameterStatus === "EXPLORATORY_PARAMETER")).toBe(true);
    expect(result.mutations.every((item) => item.parentGeometryId && item.designMoveId && item.resultGeometryId)).toBe(true);
    expect(result.validationA.whyTrace[0]).toContain("PROJECT_INPUT/RETRIEVED_KNOWLEDGE");
    expect(result.geometricRequirements[0].unknown.length).toBeGreaterThan(0);
    expect(result.validationA.functionalValidity).toBe("UNKNOWN");
    expect(result.validationA.regulatoryValidity).toBe("NOT_EVALUATED");
  });

  it("propagates one controlled perturbation without indiscriminate regeneration", () => {
    const result = executeD63G(input, emptySnapshot(), 1, "D6.3-G-test");
    expect(result.perturbation).toMatchObject({ affectedRequirement: "GREQ-INTERFACE-001", reevaluation: "BUFFER_PARAMETER_ONLY", lineagePreserved: true, status: "PASS" });
    expect(result.perturbation.unaffectedDependencies).toContain("PROJECT_INPUT:envelope");
  });
});
