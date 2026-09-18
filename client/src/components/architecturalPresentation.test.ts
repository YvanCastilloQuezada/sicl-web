import { describe, expect, it } from "vitest";
import { buildHousePresentation } from "./architecturalPresentation";

describe("A28 professional architectural presentation", () => {
  it("composes truthful house blocks from canonical and derived data", () => {
    const board = buildHousePresentation();
    expect(board.projectId).toBe("HOUSE-001-EXPLICIT");
    expect(board.levels.map((level) => level.levelId)).toEqual(["N1", "N2"]);
    expect(board.boardBlocks).toContain("PLAN_N1");
    expect(board.boardBlocks).toContain("PLAN_N2");
    expect(board.boardBlocks).toContain("DAYLIGHT_PROXY");
    expect(board.metrics.find((metric) => metric.name === "THERMAL_COMFORT")?.state).toBe("NOT_ASSESSED");
    expect(board.metrics.find((metric) => metric.name === "CARBON")?.state).toBe("PROXY");
    expect(board.warnings).toContain("Outdoor air temperature is not indoor operative temperature or comfort.");
    expect(board.provenance.length).toBeGreaterThan(3);
  });
});
