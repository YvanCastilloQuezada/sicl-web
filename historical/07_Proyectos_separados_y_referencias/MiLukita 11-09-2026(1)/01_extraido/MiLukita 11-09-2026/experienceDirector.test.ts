import { describe, expect, it } from "vitest";
import { createExperienceProposal, scoreExperience } from "./experienceDirector";

describe("Experience Director", () => {
  it("returns unavailable instead of inventing an experience score", () => {
    const score = scoreExperience({}, "UNAVAILABLE");
    expect(score.total).toBeNull();
    expect(score.explanation).toContain("No hay datos");
  });
  it("creates review proposals without auto-design or auto-deploy", () => {
    const proposal = createExperienceProposal({ id: "QR-01", area: "QR", priority: "P1", problem: "QR pequeño", evidence: "Revisión manual", impact: "Puede dificultar el escaneo", recommendation: "Comparar en dispositivos físicos", dependency: "QA físico", effort: "MEDIUM" });
    expect(proposal.requiresHumanApproval).toBe(true);
    expect(proposal.autoDesignAllowed).toBe(false);
    expect(proposal.autoDeployAllowed).toBe(false);
  });
});
