import { describe, expect, it } from "vitest";
import { buildPartiProof, validatePartiContract, type PartiContract } from "./arkiPartiContract";
import type { VerticalDecision } from "../shared/arkiVerticalDecision";
import type { VerticalSpecialVolume } from "../shared/arkiVerticalSystem";

function resolvedDecision(decision: VerticalDecision, value: number): VerticalDecision {
  return {
    ...decision,
    selectedDimension_mm: value,
    reasoning: "Architecturally resolved for special-volume base contract testing.",
    status: "RESOLVED",
    epistemicStatus: "HYPOTHESIS",
    decisionAuthority: "ARCHITECTURAL_DECISION",
    evidence: [{ kind: "ARCHITECT_DECISION", ref: "ARCH-SPECIAL-BASE-TEST" }],
    unknowns: [],
    conflicts: [],
    humanAuthorityRequired: true,
  };
}

function baseHybrid(): PartiContract {
  const parti = structuredClone(buildPartiProof().partis[0]);
  const level = parti.verticalSystem.levels![0];
  parti.verticalDecisions = parti.verticalDecisions.map((decision) =>
    decision.decisionId === level.elevationDecisionId ? resolvedDecision(decision, 0) : decision,
  );

  const specialDecision: VerticalDecision = {
    decisionId: "SPECIAL-VOLUME-01-HEIGHT",
    target: { kind: "SPECIAL_VOLUME", volumeId: "SPECIAL-VOLUME-01", members: ["SPACE-01"] },
    dimensionKind: "SPECIAL_VERTICAL",
    selectedDimension_mm: 6000,
    regulatoryConstraints: [],
    designReferences: [],
    designDrivers: [],
    reasoning: "Architecturally resolved special vertical extent.",
    status: "RESOLVED",
    epistemicStatus: "HYPOTHESIS",
    decisionAuthority: "ARCHITECTURAL_DECISION",
    evidence: [{ kind: "ARCHITECT_DECISION", ref: "ARCH-SPECIAL-HEIGHT-TEST" }],
    provenance: ["PARTI:vertical"],
    unknowns: [],
    conflicts: [],
    humanAuthorityRequired: true,
  };
  parti.verticalDecisions.push(specialDecision);
  parti.verticalSystem.kind = "HYBRID";
  parti.verticalSystem.specialVolumes = [{
    volumeId: "SPECIAL-VOLUME-01",
    kind: "ATRIUM",
    members: ["SPACE-01"],
    volumeDecisionId: specialDecision.decisionId,
    architecturalBase: {
      kind: "LEVEL_BASE",
      levelId: level.levelId,
      authorization: "ELEVATION_AS_BASE",
    },
  }];
  return parti;
}

function volume(parti: PartiContract): VerticalSpecialVolume {
  return parti.verticalSystem.specialVolumes![0];
}

describe("VERTICAL_SPECIAL_VOLUME_ARCHITECTURAL_BASE", () => {
  it("accepts an explicitly declared LEVEL_BASE backed by a resolved level ELEVATION", () => {
    expect(validatePartiContract(baseHybrid()).status).toBe("PASS");
  });

  it("keeps architecturalBase optional instead of inventing NONE", () => {
    const parti = baseHybrid();
    delete volume(parti).architecturalBase;
    expect(validatePartiContract(parti).status).toBe("PASS");
  });

  it("does not require architecturalBase by typology", () => {
    const parti = baseHybrid();
    volume(parti).kind = "AUDITORIUM";
    delete volume(parti).architecturalBase;
    expect(validatePartiContract(parti).status).toBe("PASS");
  });

  it("does not require architecturalBase for another exception kind", () => {
    const parti = baseHybrid();
    volume(parti).kind = "HANGAR";
    delete volume(parti).architecturalBase;
    expect(validatePartiContract(parti).status).toBe("PASS");
  });

  it("rejects a malformed runtime discriminant", () => {
    const parti = baseHybrid();
    (volume(parti) as unknown as { architecturalBase: { kind: string; levelId: string; authorization: string } }).architecturalBase.kind = "INVALID_KIND";
    expect(validatePartiContract(parti).violations).toContain("SPECIAL_VOLUME_ARCHITECTURAL_BASE_KIND_INVALID");
  });

  it("rejects a missing referenced level", () => {
    const parti = baseHybrid();
    volume(parti).architecturalBase!.levelId = "MISSING-LEVEL";
    expect(validatePartiContract(parti).violations).toContain("SPECIAL_VOLUME_ARCHITECTURAL_BASE_LEVEL_NOT_FOUND");
  });

  it("rejects a missing elevation decision", () => {
    const parti = baseHybrid();
    parti.verticalSystem.levels![0].elevationDecisionId = "MISSING-ELEVATION";
    expect(validatePartiContract(parti).violations).toContain("SPECIAL_VOLUME_ARCHITECTURAL_BASE_ELEVATION_DECISION_NOT_FOUND");
  });

  it("rejects an elevation decision targeting another level", () => {
    const parti = baseHybrid();
    const id = parti.verticalSystem.levels![0].elevationDecisionId;
    const decision = parti.verticalDecisions.find((candidate) => candidate.decisionId === id)!;
    decision.target = { kind: "LEVEL", levelId: "OTHER-LEVEL" };
    expect(validatePartiContract(parti).violations).toContain("SPECIAL_VOLUME_ARCHITECTURAL_BASE_ELEVATION_DECISION_TARGET_MISMATCH");
  });

  it("rejects a referenced decision whose dimension is not ELEVATION", () => {
    const parti = baseHybrid();
    const id = parti.verticalSystem.levels![0].elevationDecisionId;
    const decision = parti.verticalDecisions.find((candidate) => candidate.decisionId === id)!;
    decision.dimensionKind = "CLEAR_HEIGHT";
    expect(validatePartiContract(parti).violations).toContain("SPECIAL_VOLUME_ARCHITECTURAL_BASE_ELEVATION_DECISION_KIND_MISMATCH");
  });

  it("rejects an UNKNOWN elevation authority", () => {
    const parti = baseHybrid();
    const id = parti.verticalSystem.levels![0].elevationDecisionId;
    const decision = parti.verticalDecisions.find((candidate) => candidate.decisionId === id)!;
    decision.status = "UNKNOWN";
    decision.selectedDimension_mm = null;
    decision.reasoning = "";
    decision.decisionAuthority = "UNRESOLVED";
    decision.evidence = [];
    decision.unknowns = ["Base elevation unresolved."];
    expect(validatePartiContract(parti).violations).toContain("SPECIAL_VOLUME_ARCHITECTURAL_BASE_ELEVATION_DECISION_NOT_RESOLVED");
  });

  it("rejects a CONFLICTING elevation authority", () => {
    const parti = baseHybrid();
    const id = parti.verticalSystem.levels![0].elevationDecisionId;
    const decision = parti.verticalDecisions.find((candidate) => candidate.decisionId === id)!;
    decision.status = "CONFLICTING";
    decision.selectedDimension_mm = null;
    decision.conflicts = ["Two incompatible surveyed datums."];
    expect(validatePartiContract(parti).violations).toContain("SPECIAL_VOLUME_ARCHITECTURAL_BASE_ELEVATION_DECISION_NOT_RESOLVED");
  });

  it("rejects RESOLVED elevation with a null selected value", () => {
    const parti = baseHybrid();
    const id = parti.verticalSystem.levels![0].elevationDecisionId;
    const decision = parti.verticalDecisions.find((candidate) => candidate.decisionId === id)!;
    decision.selectedDimension_mm = null;
    expect(validatePartiContract(parti).violations).toContain("SPECIAL_VOLUME_ARCHITECTURAL_BASE_ELEVATION_DECISION_VALUE_MISSING");
  });

  it.each([-1500, 0, 1500])("accepts resolved base elevation %i mm", (elevation) => {
    const parti = baseHybrid();
    const id = parti.verticalSystem.levels![0].elevationDecisionId;
    const decision = parti.verticalDecisions.find((candidate) => candidate.decisionId === id)!;
    decision.selectedDimension_mm = elevation;
    expect(validatePartiContract(parti).violations).not.toContain("SPECIAL_VOLUME_ARCHITECTURAL_BASE_ELEVATION_DECISION_VALUE_MISSING");
    expect(validatePartiContract(parti).status).toBe("PASS");
  });

  it("does not confuse SPECIAL_VERTICAL extent with architectural base elevation", () => {
    const parti = baseHybrid();
    const special = parti.verticalDecisions.find((decision) => decision.dimensionKind === "SPECIAL_VERTICAL")!;
    special.selectedDimension_mm = 9000;
    const elevation = parti.verticalDecisions.find((decision) => decision.dimensionKind === "ELEVATION")!;
    elevation.selectedDimension_mm = 750;
    expect(validatePartiContract(parti).status).toBe("PASS");
    expect(special.selectedDimension_mm).not.toBe(elevation.selectedDimension_mm);
  });

  it("does not use FLOOR_TO_FLOOR as architectural base authority", () => {
    const parti = baseHybrid();
    const level = parti.verticalSystem.levels![0];
    const elevation = parti.verticalDecisions.find((decision) => decision.decisionId === level.elevationDecisionId)!;
    elevation.dimensionKind = "FLOOR_TO_FLOOR";
    expect(validatePartiContract(parti).violations).toContain("SPECIAL_VOLUME_ARCHITECTURAL_BASE_ELEVATION_DECISION_KIND_MISMATCH");
  });

  it("does not infer a base from shared membership alone", () => {
    const parti = baseHybrid();
    const level = parti.verticalSystem.levels![0];
    level.members = ["SPACE-01"];
    delete volume(parti).architecturalBase;
    expect(validatePartiContract(parti).status).toBe("PASS");
  });

  it("does not infer a base from a resolved level when declaration is absent", () => {
    const parti = baseHybrid();
    delete volume(parti).architecturalBase;
    const elevation = parti.verticalDecisions.find((decision) => decision.dimensionKind === "ELEVATION")!;
    expect(elevation.status).toBe("RESOLVED");
    expect(validatePartiContract(parti).status).toBe("PASS");
  });

  it("preserves the explicit authorization token", () => {
    const parti = baseHybrid();
    expect(volume(parti).architecturalBase?.authorization).toBe("ELEVATION_AS_BASE");
    expect(validatePartiContract(parti).status).toBe("PASS");
  });

  it("keeps the relation structural and independent of special-volume kind", () => {
    const kinds: VerticalSpecialVolume["kind"][] = ["DOUBLE_HEIGHT", "VOID", "ATRIUM", "AUDITORIUM", "INDUSTRIAL_VOLUME", "HANGAR", "EQUIPMENT_REQUIREMENT", "TECHNICAL_SPACE", "SPLIT_LEVEL", "OTHER"];
    for (const kind of kinds) {
      const parti = baseHybrid();
      volume(parti).kind = kind;
      expect(validatePartiContract(parti).status).toBe("PASS");
    }
  });

  it("does not introduce a generic architectural-base failure code", () => {
    const parti = baseHybrid();
    volume(parti).architecturalBase!.levelId = "MISSING-LEVEL";
    const violations = validatePartiContract(parti).violations;
    expect(violations).not.toContain("SPECIAL_VOLUME_ARCHITECTURAL_BASE_INVALID");
    expect(violations).toContain("SPECIAL_VOLUME_ARCHITECTURAL_BASE_LEVEL_NOT_FOUND");
  });
});
