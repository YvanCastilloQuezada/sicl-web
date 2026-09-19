import { describe, expect, it } from "vitest";
import { buildSingleFacadeHouseProposal } from "./arkiSingleFacadeHouseProposal";

describe("single facade house proposal", () => {
  it("contains the complete requested program", () => {
    const proposal = buildSingleFacadeHouseProposal();
    const ids = proposal.rooms.map((room) => room.programId);
    expect(ids.filter((id) => id === "BEDROOM_WITH_CLOSET")).toHaveLength(3);
    expect(ids.filter((id) => id === "MASTER_BATHROOM")).toHaveLength(1);
    expect(ids.filter((id) => id === "BATHROOM")).toHaveLength(3);
    expect(ids).toContain("KITCHEN");
    expect(ids).toContain("LIVING");
    expect(ids).toContain("DINING");
    expect(ids).toContain("GARAGE");
    expect(ids).toContain("TERRACE");
  });

  it("preserves the three neighbors and labels circulation as derived", () => {
    const proposal = buildSingleFacadeHouseProposal();
    expect(proposal.freeFacade).toBe("SOUTH");
    expect(proposal.neighbors).toEqual(["NORTH", "EAST", "WEST"]);
    expect(proposal.derivedCirculation).toContain("STAIR-CORE-N1");
    expect(proposal.openingsAssumption).toBe("SOUTH_FACADE_AND_INTERIOR_COURTYARD_ONLY");
    expect(proposal.status).toBe("HYPOTHESIS");
  });
});
