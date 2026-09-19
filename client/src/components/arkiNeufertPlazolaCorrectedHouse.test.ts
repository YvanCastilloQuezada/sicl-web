import { describe, expect, it } from "vitest";
import { buildNeufertPlazolaCorrectedHouseProposal, validateCorrectedHouseMinimums } from "./arkiNeufertPlazolaCorrectedHouse";

describe("Neufert + Plazola corrected house", () => {
  it("contains the requested program and explicit functional organigram", () => {
    const proposal = buildNeufertPlazolaCorrectedHouseProposal();
    const ids = proposal.rooms.map((room) => room.programId);
    expect(ids.filter((id) => id === "BEDROOM_WITH_CLOSET")).toHaveLength(3);
    expect(ids.filter((id) => id === "BATHROOM")).toHaveLength(2);
    expect(ids).toContain("MASTER_BATHROOM");
    expect(ids).toContain("KITCHEN");
    expect(ids).toContain("GARAGE");
    expect(proposal.functionalOrganigram.sequence).toContain("KITCHEN_SERVICE");
    expect(proposal.functionalOrganigram.relations.some((r) => r.from === "KITCHEN" && r.to === "DINING")).toBe(true);
  });

  it("resolves entry, vertical access, zoning and the one-free-facade constraint", () => {
    const proposal = buildNeufertPlazolaCorrectedHouseProposal();
    expect(proposal.site.freeFacade).toBe("SOUTH");
    expect(proposal.site.neighbors).toEqual(["NORTH", "EAST", "WEST"]);
    expect(proposal.openings.some((o) => o.id === "DOOR-STREET-ENTRY")).toBe(true);
    expect(proposal.cores.find((core) => core.kind === "STAIR")?.continuity).toBe("CONTINUOUS");
    expect(proposal.zoning.private).toContain("MASTER-N2");
    expect(proposal.zoning.service).toContain("KITCHEN-N1");
  });

  it("passes the authorized conceptual minimum references", () => {
    expect(validateCorrectedHouseMinimums().allReferenceChecksPass).toBe(true);
  });

  it("preserves epistemic limits", () => {
    const proposal = buildNeufertPlazolaCorrectedHouseProposal();
    expect(proposal.epistemicStatus).toBe("HYPOTHESIS");
    expect(proposal.validation.humanReviewRequired).toBe(true);
    expect(proposal.validation.constructionDocumentation).toBe("NOT_GENERATED");
  });
});

