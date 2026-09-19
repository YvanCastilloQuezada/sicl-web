import { describe, expect, it } from "vitest";
import { auditFunctionalVoids, summarizeFunctionalVoids } from "./arkiFunctionalVoidAudit";
import { buildNeufertPlazolaCorrectedHouseProposal } from "./arkiNeufertPlazolaCorrectedHouse";

describe("functional void audit", () => {
  it("detects unassigned cells instead of treating white space as harmless", () => {
    const proposal = buildNeufertPlazolaCorrectedHouseProposal();
    const findings = auditFunctionalVoids(proposal.envelope, proposal.rooms, "N1", 0.5);
    expect(findings.length).toBeGreaterThan(0);
    expect(findings.every((finding) => finding.status === "UNASSIGNED_RESIDUAL")).toBe(true);
  });

  it("blocks a functional pass until every residual cell gets a declared role", () => {
    const proposal = buildNeufertPlazolaCorrectedHouseProposal();
    const summary = summarizeFunctionalVoids(proposal.envelope, proposal.rooms);
    expect(summary.status).toBe("REQUIRES_REPLAN");
    expect(summary.residualAreaM2).toBeGreaterThan(0);
    expect(summary.humanReviewRequired).toBe(true);
  });
});

