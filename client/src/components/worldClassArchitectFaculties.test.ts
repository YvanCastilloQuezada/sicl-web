import { describe, expect, it } from "vitest";
import { assessWorldClassArchitectFaculties, validateWorldClassFacultyModel, WORLD_CLASS_ARCHITECT_FACULTIES } from "./worldClassArchitectFaculties";

describe("world-class architect faculties", () => {
  it("defines exactly twelve non-duplicated faculties", () => {
    expect(WORLD_CLASS_ARCHITECT_FACULTIES).toHaveLength(12);
    expect(new Set(WORLD_CLASS_ARCHITECT_FACULTIES.map((item) => item.id)).size).toBe(12);
  });

  it("integrates evidence from A21-A27 without claiming certification", () => {
    const assessment = assessWorldClassArchitectFaculties({ projectId: "HOSPITAL-001", evidenceByFaculty: {
      DESIGN_JUDGMENT: { state: "PARTIAL", evidenceRefs: ["A26"], strengths: ["aesthetic questions recorded"] },
      TYPOLOGICAL_MASTERY: { state: "PARTIAL", evidenceRefs: ["A27"], strengths: ["hospital units modeled"] },
      SPATIAL_REASONING: { state: "PARTIAL", evidenceRefs: ["A21", "A24"], strengths: ["program-space relations"] },
      MULTILEVEL_COHERENCE: { state: "PARTIAL", evidenceRefs: ["A22", "A23"], strengths: ["continuous core"] },
      UNIVERSAL_ACCESS: { state: "REQUIRES_EVIDENCE", evidenceRefs: ["A27"], openQuestions: ["local review"] },
      SAFETY_RESILIENCE: { state: "PARTIAL", evidenceRefs: ["A27"], strengths: ["fire route reachable"] },
    } });
    expect(assessment.faculties).toHaveLength(12);
    expect(assessment.readiness).toBe("REQUIRES_PROJECT_EVIDENCE");
    expect(assessment.humanAuthority).toBe("PRESERVED");
    expect(assessment.noAutomaticCertification).toBe(true);
    expect(assessment.crossFacultyTensions).toContain("beauty versus affordability");
    expect(validateWorldClassFacultyModel(assessment)).toBe(true);
  });

  it("detects conflicting faculty evidence instead of hiding it", () => {
    const assessment = assessWorldClassArchitectFaculties({ projectId: "CONFLICT-001", evidenceByFaculty: { SAFETY_RESILIENCE: { state: "CONFLICTING", evidenceRefs: ["A27:fire"] } } });
    expect(assessment.readiness).toBe("CONFLICTING");
    expect(assessment.faculties.find((item) => item.facultyId === "SAFETY_RESILIENCE")?.state).toBe("CONFLICTING");
  });

  it("keeps missing faculty evidence explicit", () => {
    const assessment = assessWorldClassArchitectFaculties({ projectId: "EMPTY-001" });
    expect(assessment.missingCapabilities).toHaveLength(12);
    expect(assessment.faculties.every((item) => item.state === "NOT_ASSESSED")).toBe(true);
    expect(validateWorldClassFacultyModel(assessment)).toBe(true);
  });
});
