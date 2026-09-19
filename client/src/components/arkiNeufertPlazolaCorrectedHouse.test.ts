import { describe, expect, it } from "vitest";
import { buildNeufertPlazolaCorrectedHouseProposal, validateCorrectedHouseMinimums } from "./arkiNeufertPlazolaCorrectedHouse";
import { findDuplicateResidentialWalls } from "./residentialConstructivePlan";

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
    expect(proposal.openConnections).toEqual([
      expect.objectContaining({ fromRoomId: "KITCHEN-N1", toRoomId: "DINING-N1", kind: "OPEN_CONNECTION" }),
    ]);
    expect(proposal.openings.some((opening) => opening.fromRoomId === "DINING-N1" && opening.toRoomId === "KITCHEN-N1")).toBe(false);
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
    const checks = validateCorrectedHouseMinimums();
    expect(checks.allReferenceChecksPass).toBe(true);
    expect(checks.wallsPass).toBe(true);
    expect(checks.doorPass).toBe(true);
    expect(checks.mainDoorPass).toBe(true);
    expect(checks.daylightPass).toBe(true);
    expect(checks.doorHeightPass).toBe(true);
    expect(checks.sillHeightPass).toBe(true);
    expect(checks.windowHeightPass).toBe(true);
    expect(checks.floorToCeilingPass).toBe(true);
  });

  it("models RNE-relevant vertical dimensions explicitly", () => {
    const proposal = buildNeufertPlazolaCorrectedHouseProposal();
    expect(proposal.floorToCeilingM).toBe(2.4);
    expect(proposal.levelHeightsM).toEqual({ N1: 2.4, N2: 2.4 });
    expect(proposal.openings.filter((opening) => opening.kind === "DOOR").every((opening) => opening.heightM === 2.1)).toBe(true);
    expect(proposal.openings.filter((opening) => opening.kind === "WINDOW").every((opening) => opening.heightM === 1.2 && opening.sillHeightM === 1.0)).toBe(true);
  });

  it("uses one shared physical wall between adjacent rooms", () => {
    const proposal = buildNeufertPlazolaCorrectedHouseProposal();
    expect(findDuplicateResidentialWalls(proposal.walls)).toEqual([]);
    expect(proposal.walls.find((wall) => wall.id === "PART-N2-MASTER")?.roomIds).toEqual(["MASTER-N2", "TERRACE-N2"]);
  });

  it("keeps the lightwell open through every modeled level", () => {
    const proposal = buildNeufertPlazolaCorrectedHouseProposal();
    const duct = proposal.cores.find((core) => core.kind === "SERVICE_DUCT");
    expect(duct?.continuity).toBe("CONTINUOUS");
    expect(duct?.openToLastLevel).toBe(true);
    expect(duct?.openToLevels).toEqual(["N1", "N2"]);
    expect(proposal.rooms.find((room) => room.id === "COURTYARD-N2")?.programId).toBe("COURTYARD_VOID");
  });

  it("keeps the stair identical and above the 2.50m by 3.00m minimum", () => {
    const proposal = buildNeufertPlazolaCorrectedHouseProposal();
    const n1 = proposal.rooms.find((room) => room.id === "STAIR-N1")?.footprint;
    const n2 = proposal.rooms.find((room) => room.id === "STAIR-N2")?.footprint;
    expect(n1).toEqual(n2);
    expect(n1 && n1.maxX - n1.minX).toBeGreaterThanOrEqual(2.5);
    expect(n1 && n1.maxY - n1.minY).toBeGreaterThanOrEqual(3);
    expect(validateCorrectedHouseMinimums().stairSizePass).toBe(true);
  });

  it("preserves epistemic limits", () => {
    const proposal = buildNeufertPlazolaCorrectedHouseProposal();
    expect(proposal.epistemicStatus).toBe("HYPOTHESIS");
    expect(proposal.validation.humanReviewRequired).toBe(true);
    expect(proposal.validation.constructionDocumentation).toBe("NOT_GENERATED");
  });
});
