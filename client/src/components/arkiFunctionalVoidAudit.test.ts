import { describe, expect, it } from "vitest";
import { auditFunctionalCapabilityDeficits, auditFunctionalVoids, summarizeFunctionalVoids } from "./arkiFunctionalVoidAudit";
import { buildNeufertPlazolaCorrectedHouseProposal } from "./arkiNeufertPlazolaCorrectedHouse";
import { assessV3Capability } from "./arkiV3KnowledgeDelta";

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

  it("distinguishes a capability deficit from an empty geometric cell", () => {
    const findings = auditFunctionalCapabilityDeficits([assessV3Capability({ capabilityId: "CAP-KITCHEN", requirementId: "SYS-KITCHEN", necessity: "ESSENTIAL", realizationModes: ["INTERNAL"], persistenceModes: ["PERMANENT"], providerSystemIds: ["KITCHEN"], interfaceState: "VALID", availability: "AVAILABLE", performance: "SUPPORTED", evidence: [] })]);
    expect(findings).toHaveLength(1);
    expect(findings[0].deficit).toBe("CAPACITY");
    expect(findings[0].humanReviewRequired).toBe(true);
  });
});
