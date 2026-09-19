import { describe, expect, it } from "vitest";
import { buildIntegratedProductFoundation } from "./src/components/arkiIntegratedProductFoundation";
import { buildPermitDocumentationPackage, validatePermitDocumentationPackage } from "./src/components/arkiPermitDocumentationOrchestrator";

describe("ARKI permit documentation orchestration", () => {
  it("creates the six-phase package without claiming permit or construction readiness", () => {
    const pkg = buildPermitDocumentationPackage(buildIntegratedProductFoundation("HOUSE-A21"));
    expect(pkg.gates).toHaveLength(6);
    expect(pkg.status).toBe("NOT_READY_FOR_PERMIT");
    expect(pkg.permitReady).toBe(false);
    expect(pkg.constructionReady).toBe(false);
    expect(pkg.noAutomaticApproval).toBe(true);
    expect(pkg.gates.find((gate) => gate.phase === "P3_REGULATORY_APPLICABILITY")?.state).toBe("REQUIRES_DATA");
    expect(validatePermitDocumentationPackage(pkg)).toBe(true);
  });

  it("preserves human review as a required final gate even with profile inputs", () => {
    const pkg = buildPermitDocumentationPackage(buildIntegratedProductFoundation("HOUSE-A21"), {
      jurisdiction: "TEST_JURISDICTION",
      projectUseType: "RESIDENTIAL",
      projectStage: "PERMIT_REVIEW",
      humanReviewerAssigned: true,
      humanReviewConfirmed: true,
    });
    expect(pkg.gates.find((gate) => gate.phase === "P5_PROFESSIONAL_REVIEW")?.state).toBe("PENDING_HUMAN_REVIEW");
    expect(pkg.gates.every((gate) => gate.humanReviewRequired)).toBe(true);
    expect(pkg.permitReady).toBe(false);
  });

  it("accepts an explicit RNE VERIFIED package without promoting the permit package", () => {
    const pkg = buildPermitDocumentationPackage(buildIntegratedProductFoundation("HOUSE-A21"), {
      jurisdiction: "PERU",
      projectUseType: "RESIDENTIAL",
      projectStage: "ANTEPROYECTO",
      regulatoryComplianceStatus: "VERIFIED",
      regulatoryVerificationRefs: ["rne-verification:HOUSE-A21:2026-001"],
    });
    expect(pkg.gates.find((gate) => gate.phase === "P3_REGULATORY_APPLICABILITY")?.state).toBe("PASS_WITH_OBSERVATIONS");
    expect(pkg.gates.find((gate) => gate.phase === "P3_REGULATORY_APPLICABILITY")?.evidence).toContain("rne-verification:HOUSE-A21:2026-001");
    expect(pkg.permitReady).toBe(false);
    expect(pkg.constructionReady).toBe(false);
  });

  it("never converts missing engineering data into a success", () => {
    const pkg = buildPermitDocumentationPackage(buildIntegratedProductFoundation("HOUSE-A21"));
    const engineeringGate = pkg.gates.find((gate) => gate.phase === "P2_ENGINEERING_COORDINATION");
    expect(engineeringGate?.state).toBe("REQUIRES_DATA");
    expect(engineeringGate?.missingInputs).toContain("structural calculations");
  });
});
