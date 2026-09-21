import { describe, expect, it } from "vitest";
import { buildPartiProof, evaluateAdversarialParti, validatePartiContract, validatePartiProof } from "./arkiPartiContract";

describe("PARTI-CONTRACT-1.0 documentary contract", () => {
  it("requires the complete parti record without creating a new engine", () => {
    const proof = buildPartiProof();
    expect(proof.contractVersion).toBe("PARTI-CONTRACT-1.0");
    expect(proof.partis).toHaveLength(3);
    expect(proof.partis.every((parti) => validatePartiContract(parti).status === "PASS")).toBe(true);
    expect(proof.partis.every((parti) => parti.intention && parti.originConditions.length && parti.organizingRules.length && parti.functionalRelationships.length && parti.hierarchies.length && parti.circulation.length && parti.scale && parti.typology && parti.limits.length && parti.unknowns.length && parti.provenance.length)).toBe(true);
  });

  it("traces three distinct partis through topology and geometry", () => {
    const proof = buildPartiProof();
    expect(new Set(proof.partis.map((item) => item.intention)).size).toBe(3);
    expect(proof.partis.every((item) => item.topologyId.startsWith("D63G-MICRO-TOPOLOGY-") && item.geometryIds.length > 0)).toBe(true);
    expect(proof.bridgeResults).toHaveLength(3);
    expect(proof.bridgeResults.every((item) => item.finalStatus === "PASS")).toBe(true);
    expect(proof.gates.G3_PARTI_TO_TOPOLOGY).toBe("PASS");
    expect(proof.gates.G4_TOPOLOGY_TO_GEOMETRY).toBe("PASS");
  });

  it("rejects an adversarial parti that is geometrically valid but functionally wrong", () => {
    const proof = buildPartiProof();
    const adversarial = evaluateAdversarialParti(proof.partis[0]);
    expect(adversarial.geometricValidity).toBe("PASS");
    expect(adversarial.functionalValidity).toBe("FAIL");
    expect(adversarial.rulePreservation).toBe("FAIL");
    expect(adversarial.decision).toBe("REJECT");
    expect(proof.mutations.some((item) => item.status === "REJECTED" && item.backtrackTo === "PARTI")).toBe(true);
  });

  it("records mutation/backtracking and bounded typology transfer", () => {
    const proof = buildPartiProof();
    expect(proof.mutations.some((item) => item.backtrackTo === "TOPOLOGY")).toBe(true);
    expect(proof.transfer).toMatchObject({ targetTypology: "LIBRARY", mode: "ADAPT", humanReviewRequired: true });
    expect(proof.transfer.nonTransferredRules.length).toBeGreaterThan(0);
    expect(proof.gates.G7_MUTATION_BACKTRACK).toBe("PASS");
    expect(proof.gates.G9_TRANSFER_BOUNDARY).toBe("PASS");
  });

  it("passes the complete documentary proof while preserving human authority", () => {
    const proof = buildPartiProof();
    expect(proof.finalStatus).toBe("PASS");
    expect(validatePartiProof(proof)).toBe("PASS");
    expect(proof.evaluations.every((item) => item.humanReviewRequired)).toBe(true);
    expect(proof.evaluations.every((item) => item.functionalValidity === "UNKNOWN")).toBe(true);
    expect(proof.gates.G8_HUMAN_AUTHORITY).toBe("PASS");
  });
});
