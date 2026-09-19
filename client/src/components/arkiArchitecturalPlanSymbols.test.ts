import { describe, expect, it } from "vitest";
import { ARKI_PLAN_SYMBOL_RULES, buildHousePlanSymbolLesson, validatePlanSymbolInstance } from "./arkiArchitecturalPlanSymbols";

describe("architectural plan symbols", () => {
  it("teaches distinct wall, door, window and clerestory semantics", () => {
    expect(ARKI_PLAN_SYMBOL_RULES.map((rule) => rule.kind)).toEqual([
      "WALL", "DOOR_HINGED", "DOOR_SLIDING", "WINDOW", "WINDOW_HIGH", "OPENING_UNKNOWN",
    ]);
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
    expect(lesson.rules).toHaveLength(6);
    expect(lesson.humanReviewRequired).toBe(true);
  });
});
