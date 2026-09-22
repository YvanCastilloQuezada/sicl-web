import { describe, expect, it } from "vitest";
import { directFederatedAssistants, federatedAssistantSummary } from "../shared/federatedAssistantDirector";

describe("ARKI federated assistant director", () => {
  it("catalogs both products and disables Core mutation for every assistant", () => {
    const summary = federatedAssistantSummary();
    expect(summary.arki).toBeGreaterThan(0);
    expect(summary.luca).toBeGreaterThan(0);
    expect(summary.total).toBe(summary.arki + summary.luca);
    expect(summary.allCoreMutationDisabled).toBe(true);
  });

  it("routes spatial requests to LUCA and compatible ARKI assistants with trace", () => {
    const decision = directFederatedAssistants({ request: "captura GPS y campaña de realidad aumentada", sourceCommit: "luca-commit-001", evidence: ["shared/agentRegistry.ts", "shared/lukitaGeoGovernance.ts"] });
    expect(decision.handoffStatus).toBe("HUMAN_REVIEW");
    expect(decision.selected.some((assistant) => assistant.product === "LUCA")).toBe(true);
    expect(decision.trace).toContain("CORE_WRITE:FORBIDDEN");
    expect(decision.noSecretTransfer).toBe(true);
  });

  it("blocks untraceable handoffs and approves only with explicit human authority", () => {
    expect(directFederatedAssistants({ request: "coordinar asistentes", sourceCommit: "", evidence: [] }).handoffStatus).toBe("BLOCKED");
    expect(directFederatedAssistants({ request: "coordinar asistentes", sourceCommit: "arki-001", evidence: ["server/arkiAgentRegistry.ts"], humanApproved: true }).handoffStatus).toBe("APPROVED");
  });
});
