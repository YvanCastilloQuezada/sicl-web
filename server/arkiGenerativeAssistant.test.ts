import { describe, expect, it } from "vitest";
import { analyzeNativeGeometry } from "../shared/arkiNativeGenerator";
import { approveProposal, assistantCatalog, proposeFromNaturalLanguage, rejectProposal, simulateProposal } from "../shared/arkiGenerativeAssistant";

describe("ARKI generative assistant", () => {
  const current = { kind: "RECTANGULAR_MASS" as const, width: 24, depth: 16, height: 3.2, floors: 2, courtyardRatio: 0.25 };

  it("translates natural language into a non-mutating proposal", () => {
    const proposal = proposeFromNaturalLanguage("Diseña un estadio para 80000 personas en Iquitos", current);
    expect(proposal.templateId).toBe("TROPICAL_STADIUM");
    expect(proposal.status).toBe("AI_PROPOSED");
    expect(proposal.humanReviewRequired).toBe(true);
    expect(proposal.provider).toBe("DETERMINISTIC_FIRST_PARTY");
  });

  it("simulates before/after without changing the active geometry", () => {
    const proposal = proposeFromNaturalLanguage("hotel con patio central", current);
    const simulation = simulateProposal(current, proposal);
    expect(current.width).toBe(24);
    expect(simulation.requiresRecalculation).toBe(true);
    expect(simulation.after.templateId).toBe("COURTYARD_HOTEL");
  });

  it("keeps approval as an explicit separate transition", () => {
    const proposal = proposeFromNaturalLanguage("casa compacta", current);
    expect(approveProposal(proposal).status).toBe("ACCEPTED");
    expect(rejectProposal(proposal).status).toBe("REJECTED");
  });

  it("reports risk and review for high-impact proposals", () => {
    const proposal = proposeFromNaturalLanguage("estadio 80000 Iquitos", current);
    expect(proposal.risk).toBe("HIGH");
    expect(simulateProposal(current, proposal).after.humanReviewRequired).toBe(true);
    expect(analyzeNativeGeometry(proposal.params as never).humanReviewRequired).toBe(true);
  });

  it("does not advertise remote providers as connected", () => {
    expect(assistantCatalog()).toMatchObject({ provider: "DETERMINISTIC_FIRST_PARTY", remoteProviders: "PENDING_EXPLICIT_CONFIGURATION", proposalIsNotApproval: true });
  });
});
