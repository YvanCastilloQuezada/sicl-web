import { describe, expect, it } from "vitest";
import { executeV61ControlledProof } from "./arkiV61ControlledProof";

describe("ARKI v6.1 controlled synthesis, transfer and learning proof", () => {
  it("executes cases A–F without adding domain-specific repair engines", () => {
    const result = executeV61ControlledProof();
    expect(result.cases).toHaveLength(6);
    expect(result.cases.every((item) => item.report.noAutomaticCanonization)).toBe(true);
    expect(result.cases.every((item) => item.report.humanAuthority)).toBe(true);
    expect(result.cases.every((item) => item.strategiesGenerated.length === 0)).toBe(true);
    expect(result.cases.every((item) => item.candidateCount === 0)).toBe(true);
    expect(result.cases.every((item) => item.mutationCount === 0)).toBe(true);
  });

  it("demonstrates transfer restraint for laboratory biosafety", () => {
    const result = executeV61ControlledProof();
    const laboratory = result.cases.find((item) => item.caseId === "D_LABORATORY_RESTRAINT");
    expect(laboratory?.report.transfer[0]?.decision).toBe("DO_NOT_TRANSFER");
    expect(laboratory?.report.transfer[0]?.adaptationBurden).toBe("STRUCTURALLY_INCOMPATIBLE");
  });

  it("keeps hospital transfer at ADAPT rather than copying restaurant geometry", () => {
    const result = executeV61ControlledProof();
    const hospital = result.cases.find((item) => item.caseId === "C_HOSPITAL_TRANSFER");
    expect(hospital?.report.transfer[0]?.decision).toBe("ADAPT");
    expect(hospital?.report.geometryMutations).toHaveLength(0);
  });

  it("does not claim L5–L10 or learning without generated evidence and persistence", () => {
    const result = executeV61ControlledProof();
    expect(result.autonomy.L5_GENERATES_STRATEGIES.status).toBe("NOT_DEMONSTRATED");
    expect(result.autonomy.L6_GENERATES_CANDIDATES.status).toBe("NOT_DEMONSTRATED");
    expect(result.autonomy.L7_MUTATES_SYNTHESIZES.status).toBe("NOT_DEMONSTRATED");
    expect(result.autonomy.L10_GENERALIZES.status).toBe("NOT_DEMONSTRATED");
    expect(result.learningMatrix.every((item) => item.k1 === "No promoted learning candidate")).toBe(true);
  });

  it("passes the runtime–curriculum–book consistency gate", () => {
    const result = executeV61ControlledProof();
    expect(result.triplePropagation.consistency).toBe("DEMONSTRATED");
    expect(result.triplePropagation.curriculum).toContain("NOT_LEARNED");
    expect(result.triplePropagation.book).toContain("HUMAN_REVIEW_REQUIRED");
  });
});
