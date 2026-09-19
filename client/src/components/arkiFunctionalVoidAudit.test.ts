import { describe, expect, it } from "vitest";
import { auditFunctionalVoids, summarizeFunctionalVoids } from "./arkiFunctionalVoidAudit";
import { buildNeufertPlazolaCorrectedHouseProposal } from "./arkiNeufertPlazolaCorrectedHouse";

describe("functional void audit", () => {
  it("finds no unassigned cells after the functional rezoning", () => {
    const proposal = buildNeufertPlazolaCorrectedHouseProposal();
    const findings = auditFunctionalVoids(proposal.envelope, proposal.rooms, "N1", 0.5);
    expect(findings).toHaveLength(0);
  });

  it("reports a functional pass when every cell has a declared role", () => {
    const proposal = buildNeufertPlazolaCorrectedHouseProposal();
    const summary = summarizeFunctionalVoids(proposal.envelope, proposal.rooms);
    expect(summary.status).toBe("PASS");
    expect(summary.residualAreaM2).toBe(0);
    expect(summary.humanReviewRequired).toBe(true);
  });
});
