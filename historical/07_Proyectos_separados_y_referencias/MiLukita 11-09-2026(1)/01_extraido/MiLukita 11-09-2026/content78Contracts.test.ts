import { describe, expect, it } from "vitest";
import { classifyUnknownTransaction, financialFailSafe, revenueConcentration } from "./financialOs";
import { auditClaim, lukitaCannotOverrideGame, pageQualityDecision } from "./experienceQualityOs";

describe("Contenido 78 contracts", () => {
  it("enforces NO DATA -> NO CLAIM for financial transactions", () => {
    const result = classifyUnknownTransaction();
    expect(result.evidence).toBe("UNKNOWN");
    expect(result.approvalStatus).toBe("REQUIRES_HUMAN");
    expect(result.confidence).toBeNull();
  });
  it("uses a configurable threshold for revenue concentration", () => {
    expect(revenueConcentration(70, 100, 0.6)).toMatchObject({ value: 0.7, alert: true, evidence: "FACT" });
    expect(revenueConcentration(null, 100).evidence).toBe("UNKNOWN");
  });
  it("fails safe without stopping the core experience", () => {
    expect(financialFailSafe()).toBe("CONTINUE_MILUKITA_BLOCK_SENSITIVE_ACTIONS");
    expect(lukitaCannotOverrideGame()).toBe(false);
  });
  it("blocks production claims for simulated state", () => {
    expect(auditClaim("funciona 24/7", "SIMULATED")).toMatchObject({ status: "BLOCKED", evidence: "SIMULATED" });
    expect(auditClaim("evento activo", null).reason).toBe("NO DATA -> NO CLAIM");
  });
  it("requires human review when quality evidence is unknown", () => {
    const checks = Object.fromEntries(["content", "truth", "visual", "ux", "accessibility", "performance", "mobile", "tv", "qr", "analytics", "regulatory"].map((key) => [key, key === "truth" ? "UNKNOWN" : "FACT"]));
    expect(pageQualityDecision({ pageId: "home", surfaces: ["WEB"], checks: checks as never, qualityScore: null, status: "PROPOSED", blockers: [] })).toBe("REQUIRES_HUMAN");
  });
});
