import { describe, expect, it } from "vitest";
import { ARKI_POWER_PACK_FOR_LUCA, arluPowerTransferSummary, authorizeLucaPowerUse, createLucaPowerTransferManifest } from "../shared/arluPowerTransfer";

describe("AR-LU power transfer", () => {
  it("contains a bounded, traceable pack for Luca", () => {
    const summary = arluPowerTransferSummary();
    expect(summary.count).toBe(7);
    expect(summary.canMutateCore).toBe(false);
    expect(summary.transfersSecrets).toBe(false);
    expect(ARKI_POWER_PACK_FOR_LUCA.every((power) => power.requiresHumanGate && !power.canMutateCore && !power.transfersSecrets)).toBe(true);
  });

  it("requires source, target and rollback provenance", () => {
    expect(() => createLucaPowerTransferManifest({ sourceCommit: "", targetCommit: "luca", rollbackPoint: "rb" })).toThrow("SOURCE_TARGET_COMMITS_AND_ROLLBACK_REQUIRED");
    const manifest = createLucaPowerTransferManifest({ sourceCommit: "arki", targetCommit: "luca", rollbackPoint: "checkpoint-1" });
    expect(manifest.status).toBe("HUMAN_REVIEW");
    expect(manifest.excludedDomains).toContain("MJP_CORE");
  });

  it("fails closed without human approval, readiness or safe state", () => {
    expect(authorizeLucaPowerUse({ powerId: "POWER-MANIAC-GUARDRAILS", humanApproved: false, targetRuntimeReady: true, changesCanonicalState: false, transfersSecrets: false }).reason).toBe("HUMAN_REVIEW_REQUIRED");
    expect(authorizeLucaPowerUse({ powerId: "POWER-MANIAC-GUARDRAILS", humanApproved: true, targetRuntimeReady: false, changesCanonicalState: false, transfersSecrets: false }).reason).toBe("TARGET_RUNTIME_NOT_READY");
    expect(authorizeLucaPowerUse({ powerId: "POWER-MANIAC-GUARDRAILS", humanApproved: true, targetRuntimeReady: true, changesCanonicalState: true, transfersSecrets: false }).reason).toBe("CANONICAL_MUTATION_FORBIDDEN");
    expect(authorizeLucaPowerUse({ powerId: "POWER-MANIAC-GUARDRAILS", humanApproved: true, targetRuntimeReady: true, changesCanonicalState: false, transfersSecrets: true }).reason).toBe("SECRET_TRANSFER_FORBIDDEN");
  });

  it("allows only the approved bounded use", () => {
    const result = authorizeLucaPowerUse({ powerId: "POWER-DETERMINISTIC-EVIDENCE", humanApproved: true, targetRuntimeReady: true, changesCanonicalState: false, transfersSecrets: false });
    expect(result.allowed).toBe(true);
    if (result.allowed) expect(result.power.id).toBe("POWER-DETERMINISTIC-EVIDENCE");
  });
});
