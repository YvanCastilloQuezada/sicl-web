import { describe, expect, it } from "vitest";
import { ARKI_PLAN_SYMBOL_RULES, buildHousePlanSymbolLesson, validatePlanSymbolInstance } from "./arkiArchitecturalPlanSymbols";

describe("architectural plan symbols", () => {
  it("teaches distinct wall, door, window and clerestory semantics", () => {
    expect(ARKI_PLAN_SYMBOL_RULES.length).toBeGreaterThanOrEqual(20);
    expect(ARKI_PLAN_SYMBOL_RULES.map((rule) => rule.kind)).toEqual(expect.arrayContaining([
      "WALL", "DOOR_DOUBLE", "DOOR_UNEVEN_DOUBLE", "DOOR_OPPOSING", "DOOR_REVOLVING", "DOOR_POCKET", "DOOR_DOUBLE_POCKET", "DOOR_BYPASS", "DOOR_BIFOLD", "DOOR_DOUBLE_BIFOLD", "DOOR_SLIDING_GLASS", "DOOR_OVERHEAD", "WINDOW_CASEMENT", "WINDOW_GLIDER", "WINDOW_GARDEN", "WINDOW_BOW", "WINDOW_BAY", "WINDOW_HIGH", "OPENING_UNKNOWN",
    ]));
    expect(ARKI_PLAN_SYMBOL_RULES.find((rule) => rule.kind === "WINDOW_HIGH")?.requiredGeometry).toContain("height_semantics");
  });

  it("validates a hinged door symbol", () => {
    expect(validatePlanSymbolInstance({ id: "D-01", kind: "DOOR_HINGED", elementId: "ROOM-A-OPENING-1", status: "HYPOTHESIS", geometryParts: ["opening", "leaf", "hinge", "swing_arc"] })).toEqual([]);
  });

  it("prevents an unresolved opening from being silently treated as a door/window", () => {
    expect(validatePlanSymbolInstance({ id: "O-UNKNOWN-01", kind: "OPENING_UNKNOWN", elementId: "ROOM-A-OPENING-2", status: "HYPOTHESIS", geometryParts: ["reserved_gap", "unknown_status"] })).toContain("UNKNOWN_OPENING_MUST_REMAIN_UNKNOWN");
    expect(validatePlanSymbolInstance({ id: "O-UNKNOWN-02", kind: "OPENING_UNKNOWN", elementId: "ROOM-A-OPENING-3", status: "UNKNOWN", geometryParts: ["reserved_gap", "unknown_status"] })).toEqual([]);
  });

  it("keeps the lesson educational and human-reviewed", () => {
    const lesson = buildHousePlanSymbolLesson();
    expect(lesson.rules.length).toBeGreaterThanOrEqual(20);
    expect(lesson.humanReviewRequired).toBe(true);
  });
});
