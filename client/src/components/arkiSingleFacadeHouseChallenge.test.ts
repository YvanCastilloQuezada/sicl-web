import { describe, expect, it } from "vitest";
import { buildSingleFacadeHouseChallenge, deriveSingleFacadeHouseProposal } from "./arkiSingleFacadeHouseChallenge";

describe("single free facade house challenge", () => {
  it("passes only the site and room program, not circulation or stairs", () => {
    const challenge = buildSingleFacadeHouseChallenge();
    expect(challenge.site.areaM2).toBe(300);
    expect(challenge.site.neighbors).toEqual(["NORTH", "EAST", "WEST"]);
    expect(challenge.site.freeFacade).toBe("SOUTH");
    expect(challenge.explicitCirculationRequirements).toEqual([]);
    expect(challenge.explicitVerticalRequirements).toEqual([]);
    expect(challenge.requestedProgram).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: "BEDROOM_WITH_CLOSET", quantity: 3 }),
      expect.objectContaining({ id: "MASTER_BATHROOM", quantity: 1 }),
      expect.objectContaining({ id: "BATHROOM", quantity: 2 }),
      expect.objectContaining({ id: "KITCHEN", quantity: 1 }),
      expect.objectContaining({ id: "LIVING", quantity: 1 }),
      expect.objectContaining({ id: "DINING", quantity: 1 }),
      expect.objectContaining({ id: "GARAGE", quantity: 1 }),
      expect.objectContaining({ id: "TERRACE", quantity: 1 }),
    ]));
  });

  it("marks circulation and vertical access as derived rather than user-specified", () => {
    const proposal = deriveSingleFacadeHouseProposal();
    expect(proposal.derivedElements.notUserSpecified).toBe(true);
    expect(proposal.derivedElements.circulation).toEqual(["HALL-N1", "HALL-N2"]);
    expect(proposal.derivedElements.verticalConnection).toEqual(["STAIR-CORE-CONTINUOUS"]);
    expect(proposal.facadeStrategy.freeFacade).toBe("SOUTH");
    expect(proposal.facadeStrategy.northEastWest).toContain("NO_EXTERNAL_OPENINGS");
  });
});
