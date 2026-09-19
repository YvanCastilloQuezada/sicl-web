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

  it("preserves the three neighbors and exposes unresolved access honestly", () => {
    const proposal = buildSingleFacadeHouseProposal();
    expect(proposal.freeFacade).toBe("SOUTH");
    expect(proposal.neighbors).toEqual(["NORTH", "EAST", "WEST"]);
    expect(proposal.derivedCirculation).toEqual([]);
    expect(proposal.unknowns).toContain("NO_STAIR_AUTHORIZED");
    expect(proposal.unknowns).toContain("HOUSE_ENTRY_NOT_DEFINED");
    expect(proposal.unknowns).toContain("SECOND_FLOOR_ACCESS_NOT_DEFINED");
    expect(proposal.openingsAssumption).toContain("NOT_RESOLVED");
    expect(proposal.status).toBe("HYPOTHESIS");
  });
});
