import { describe, expect, it } from "vitest";
import { buildVisualFieldProposals, type VisualIngestObservation } from "./visual-field";

const observation = (description: string): VisualIngestObservation => ({
  observation_class: "DIMENSION",
  description,
  qualifier: "APPROXIMATE",
  uncertainty: "requires human verification",
});

describe("visual ingestion proposal mapping", () => {
  it("creates source-linked provisional IDs deterministically", () => {
    const proposals = buildVisualFieldProposals([observation("A"), observation("B")], "SRC-77", "vision-model-x");
    expect(proposals.map((p) => p.evidence_id)).toEqual(["VAI-SRC-77-1", "VAI-SRC-77-2"]);
  });
  it("keeps AI observations epistemically provisional and review-gated", () => {
    const [proposal] = buildVisualFieldProposals([observation("Observed text")], "SRC-1");
    expect(proposal.status).toBe("AI_PROPOSED");
    expect(proposal.epistemic_status).toBe("AI_PROPOSED");
    expect(proposal.human_review_required).toBe(true);
    expect(proposal.model).toBeUndefined();
  });
  it("returns no proposals for empty observations without fabricating", () => {
    expect(buildVisualFieldProposals([], "SRC-EMPTY")).toEqual([]);
  });
});
