import { describe, expect, it } from "vitest";
import { generateCustomHouseDesign } from "./arkiCustomHouseDesign";

describe("custom two-level house design", () => {
  it("realizes the requested residential program on a 300m2 site", () => {
    const plan = generateCustomHouseDesign();
    expect(plan.site.maxX * plan.site.maxY).toBe(300);
    expect(plan.rooms.filter((room) => room.programId === "BEDROOM")).toHaveLength(3);
    expect(plan.rooms.filter((room) => room.programId === "CLOSET")).toHaveLength(3);
    expect(plan.rooms.filter((room) => room.programId === "BATHROOM")).toHaveLength(3);
    expect(plan.rooms.filter((room) => room.programId === "KITCHEN")).toHaveLength(1);
    expect(plan.rooms.filter((room) => room.programId === "LIVING")).toHaveLength(1);
    expect(plan.rooms.filter((room) => room.programId === "DINING")).toHaveLength(1);
    expect(plan.rooms.filter((room) => room.programId === "GARAGE")).toHaveLength(1);
    expect(plan.rooms.filter((room) => room.programId === "TERRACE")).toHaveLength(1);
    expect(plan.carbonSummary.grossAreaM2).toBe(200);
    expect(plan.validation.conflicts).toEqual([]);
  });

  it("keeps stair and service shaft continuous across N1 and N2", () => {
    const plan = generateCustomHouseDesign();
    expect(plan.cores).toEqual([
      expect.objectContaining({ kind: "STAIR", levelIds: ["N1", "N2"], continuity: "CONTINUOUS" }),
      expect.objectContaining({ kind: "SERVICE_DUCT", levelIds: ["N1", "N2"], continuity: "CONTINUOUS" }),
    ]);
    expect(plan.routes[0].levelIds).toEqual(["N1", "N2"]);
    expect(plan.openings.filter((opening) => opening.kind === "DOOR").length).toBeGreaterThanOrEqual(12);
    expect(plan.validation.humanReviewRequired).toBe(true);
    expect(plan.validation.constructionDocumentation).toBe("NOT_GENERATED");
  });
});
