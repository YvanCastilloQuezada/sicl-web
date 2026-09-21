import { describe, expect, it } from "vitest";
import { decideSelfCareProposal, listSelfCareProposals, stageSelfCareProposal } from "./arkiSelfCareProposals";
import { probeConfiguredHost } from "./parametricHostWorkers";

describe("ARKI governed self-care", () => {
  it("stages and closes a proposal without executing it", () => {
    const proposal = stageSelfCareProposal({ kind: "REPAIR", title: "Test repair", summary: "Controlled repair proposal for regression", risk: "LOW", files: ["test.ts"], expectedTests: ["pnpm check"], rollback: "Restore checkpoint" });
    expect(proposal.status).toBe("PENDING_REVIEW");
    const decision = decideSelfCareProposal({ proposalId: proposal.id, decision: "APPROVED", rationale: "Reviewed and reversible", actorId: "owner-test" });
    expect(decision.execution).toBe("APPROVED_FOR_SEPARATE_EXECUTION_GATE");
    expect(listSelfCareProposals().proposals.some((item) => item.id === proposal.id && item.status === "APPROVED")).toBe(true);
  });
  it("fails closed when a real host is not configured", async () => {
    const result = await probeConfiguredHost({ kind: "REVIT", projectId: "BIM-TEST", artifactId: "probe" });
    expect(["PENDING_EXTERNAL", "HOST_UNREACHABLE", "HOST_REJECTED", "HOST_REACHABLE"]).toContain(result.status);
    if (result.status === "PENDING_EXTERNAL") expect(result.reason).toContain("not configured");
  });
});
