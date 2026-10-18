import { describe, expect, it } from "vitest";
import { evaluateLegalEvidence, getLrciContractSummary, canLrciExecute, canLrciMutateCore } from "./legalAgent";

const completeInput = {
  domain: "REGULATORY" as const,
  claim: "La interfaz puede publicar una afirmación regulatoria",
  source: "internal-policy-v1",
  evidence: "technical-control-record",
  jurisdiction: "PE",
  effectiveDate: "2026-08-27",
  expiresAt: "2027-08-27",
  confidence: 0.5,
  scope: "pilot-virtual-only",
};

describe("LRCI · agente jurídico restrictivo", () => {
  it("expone el contrato DEFINED, DISABLED, autonomía 0 y sin integraciones", () => {
    const summary = getLrciContractSummary();
    expect(summary.status).toBe("DEFINED");
    expect(summary.implementation).toBe("NOT_STARTED");
    expect(summary.execution).toBe("DISABLED");
    expect(summary.autonomy).toBe(0);
    expect(summary.authority).toBe("ADVISORY_ONLY");
    expect(summary.humanReview).toBe("REQUIRED");
    expect(summary.externalIntegrations).toBe("NONE");
    expect(summary.mjpCoreAccess).toBe("NONE");
    expect(summary.metrics.find(metric => metric.id === "LEGAL_RISK_DETECTION")).toMatchObject({ value: 0, state: "ZERO_BY_DESIGN" });
    expect(summary.metrics.find(metric => metric.id === "REGULATORY_COVERAGE")).toMatchObject({ value: null, state: "NO_DATA" });
  });

  it("devuelve NO_DATA cuando falta fuente, jurisdicción, vigencia o evidencia", () => {
    const result = evaluateLegalEvidence({ domain: "REGULATORY", claim: "claim" });
    expect(result.state).toBe("NO_DATA");
    expect(result.claimAllowed).toBe(false);
    expect(result.publishAllowed).toBe(false);
    expect(result.executeAllowed).toBe(false);
    expect(result.missing).toEqual(expect.arrayContaining(["source", "evidence", "jurisdiction", "effectiveDate", "confidence", "scope"]));
  });

  it("aplica POLICY_BLOCKED antes de cualquier estado favorable", () => {
    const result = evaluateLegalEvidence({ ...completeInput, policyBlocked: true });
    expect(result.state).toBe("POLICY_BLOCKED");
    expect(result.reason).toBe("internal_policy_blocked");
    expect(result.claimAllowed).toBe(false);
  });

  it("marca SOURCE_EXPIRED y exige revisión profesional", () => {
    const result = evaluateLegalEvidence({ ...completeInput, expiresAt: "2020-01-01" }, Date.parse("2026-08-27"));
    expect(result.state).toBe("SOURCE_EXPIRED");
    expect(result.requiresProfessionalReview).toBe(true);
    expect(result.executeAllowed).toBe(false);
  });

  it("no convierte evidencia técnica en aprobación jurídica sin revisión humana", () => {
    const result = evaluateLegalEvidence(completeInput);
    expect(result.state).toBe("REQUIRES_PROFESSIONAL_REVIEW");
    expect(result.claimAllowed).toBe(false);
    expect(result.publishAllowed).toBe(false);
  });

  it("permite registrar HUMAN_APPROVED sólo como estado de alcance, sin habilitar ejecución", () => {
    const result = evaluateLegalEvidence({ ...completeInput, humanReview: { reviewerId: "professional-1", reviewedAt: Date.parse("2026-08-27"), scope: "pilot-virtual-only", jurisdiction: "PE" } }, Date.parse("2026-08-27"));
    expect(result.state).toBe("HUMAN_APPROVED");
    expect(result.claimAllowed).toBe(false);
    expect(result.publishAllowed).toBe(false);
    expect(result.executeAllowed).toBe(false);
  });

  it("bloquea cualquier acción de ejecución y cualquier mutación de MJP CORE", () => {
    for (const action of ["READ", "ANALYZE", "PROPOSE", "SIGN_CONTRACT", "DECLARE_COMPLIANCE_DEFINITIVELY", "MODIFY_MJP_CORE"]) {
      expect(canLrciExecute(action)).toBe(false);
    }
    for (const surface of ["RNG", "RESULTS", "WALLET", "LEDGER", "SETTLEMENT", "MJP_TV_MANIFEST"]) {
      expect(canLrciMutateCore(surface)).toBe(false);
    }
  });
});
