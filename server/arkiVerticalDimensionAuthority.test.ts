import { describe, expect, it } from "vitest";
import { buildPartiProof, validatePartiContract, type PartiContract } from "./arkiPartiContract";
import type { VerticalDecision } from "../shared/arkiVerticalDecision";

function baseParti(): PartiContract {
  return structuredClone(buildPartiProof().partis[0]);
}

function resolvedElevation(value: number): PartiContract {
  const parti = baseParti();
  const id = parti.verticalSystem.levels![0].elevationDecisionId;
  parti.verticalDecisions = parti.verticalDecisions.map((d) => d.decisionId === id ? {
    ...d, selectedDimension_mm: value, reasoning: "Architect establishes level datum.",
    status: "RESOLVED", epistemicStatus: "HYPOTHESIS", decisionAuthority: "ARCHITECTURAL_DECISION",
    evidence: [{ kind: "ARCHITECT_DECISION", ref: "ARCH-ELEV-TEST" }], unknowns: [], humanAuthorityRequired: true,
  } : d);
  return parti;
}

describe("VERTICAL_DIMENSION_AUTHORITY frozen contract", () => {
  it.each([-3200, 0, 3200])("accepts ELEVATION=%i without treating elevation as positive height", (value) => {
    expect(validatePartiContract(resolvedElevation(value)).violations).not.toContain("VERTICAL_POSITIVE_DIMENSION_REQUIRED");
    expect(validatePartiContract(resolvedElevation(value)).status).toBe("PASS");
  });

  it("rejects Neufert/Plazola references without a real corpus locator", () => {
    const parti = resolvedElevation(0);
    parti.verticalDecisions[0].designReferences = [{ kind: "NEUFERT", description: "test reference", evidenceRef: "EVID-NEUFERT" }];
    expect(validatePartiContract(parti).violations).toContain("VERTICAL_CORPUS_LOCATOR_REQUIRED");
  });

  it("fails closed when a bibliographic corpusRef is syntactically present but not verified", () => {
    const parti = resolvedElevation(0);
    parti.verticalDecisions[0].designReferences = [{ kind: "PLAZOLA", description: "hangar reference", evidenceRef: "EVID-PLAZOLA", corpusLocator: { corpusRef: "PLAZOLA_V10_P412", volume: "10", page: "412" } }];
    expect(validatePartiContract(parti).violations).toContain("VERTICAL_CORPUS_REF_UNVERIFIED");
    expect(validatePartiContract(parti, new Set(["PLAZOLA_V10_P412"])).violations).not.toContain("VERTICAL_CORPUS_REF_UNVERIFIED");
  });

  it("blocks RESOLVED when regulatory applicability still requires determination", () => {
    const parti = resolvedElevation(0);
    parti.verticalDecisions[0].regulatoryConstraints = [{ kind: "MIN", height_mm: 2200, sourceAuthority: "RNE", applicability: "REQUIRES_DETERMINATION", evidenceRef: "RNE-TEST" }];
    expect(validatePartiContract(parti).violations).toContain("VERTICAL_APPLICABILITY_UNRESOLVED");
  });

  it("never permits SIMULATION evidence to become FACT", () => {
    const parti = resolvedElevation(0);
    parti.verticalDecisions[0].epistemicStatus = "FACT";
    parti.verticalDecisions[0].evidence = [{ kind: "SIMULATION", ref: "SIM-01", note: "thermal hypothesis" }];
    expect(validatePartiContract(parti).violations).toContain("VERTICAL_SIMULATION_NOT_FACT");
  });

  it("rejects incompatible resolved decisions at the same target and dimension", () => {
    const parti = resolvedElevation(0);
    const first = parti.verticalDecisions[0];
    const second: VerticalDecision = { ...structuredClone(first), decisionId: "SECOND-ELEVATION", selectedDimension_mm: 100 };
    parti.verticalDecisions.push(second);
    expect(validatePartiContract(parti).violations).toContain("VERTICAL_SAME_SPECIFICITY_CONFLICT");
  });

  it("keeps FLOOR_TO_FLOOR and CLEAR_HEIGHT orthogonal by target/dimension contract", () => {
    const parti = resolvedElevation(0);
    const levelId = parti.verticalSystem.levels![0].levelId;
    const ftf: VerticalDecision = {
      decisionId: "FTF-01", target: { kind: "LEVEL", levelId }, dimensionKind: "FLOOR_TO_FLOOR", selectedDimension_mm: 3200,
      regulatoryConstraints: [], designReferences: [], designDrivers: [], reasoning: "Vertical level modulation.",
      status: "RESOLVED", epistemicStatus: "HYPOTHESIS", decisionAuthority: "ARCHITECTURAL_DECISION",
      evidence: [{ kind: "ARCHITECT_DECISION", ref: "ARCH-FTF" }], provenance: ["PARTI:vertical"], unknowns: [], conflicts: [], humanAuthorityRequired: true,
    };
    parti.verticalDecisions.push(ftf);
    parti.verticalSystem.levels![0].floorToFloorDecisionId = ftf.decisionId;
    expect(validatePartiContract(parti).status).toBe("PASS");
    expect(ftf.dimensionKind).not.toBe("CLEAR_HEIGHT");
  });

  it("requires a condition for CONDITIONAL design drivers", () => {
    const parti = resolvedElevation(0);
    parti.verticalDecisions[0].designDrivers = [{ kind: "CLIMATE", description: "hot climate", influence: "CONDITIONAL" }];
    expect(validatePartiContract(parti).violations).toContain("VERTICAL_CONDITIONAL_DRIVER_CONDITION_REQUIRED");
  });
});
