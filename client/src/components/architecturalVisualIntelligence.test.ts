import { describe, expect, it } from "vitest";
import { applyRoomOperation, generateVerifiedResidentialPlan } from "./residentialConstructivePlan";
import { buildMultilevelView, buildTruthfulOverlays, comparePresentationStates, composeReviewBoard, orchestratePresentation } from "./architecturalVisualIntelligence";

describe("A28 P2-P6 architectural visual intelligence", () => {
  it("coordinates N1/N2 with shared orientation, scale and cores", () => {
    const levels = buildMultilevelView();
    expect(levels.map((level) => level.levelId)).toEqual(["N1", "N2"]);
    expect(levels.every((level) => level.orientation === "NORTH_UP" && level.scale === "SHARED_SITE_SCALE" && !level.stale)).toBe(true);
    expect(levels[0].coreIds).toContain("STAIR-CORE");
    expect(levels[1].coreIds).toContain("STAIR-CORE");
  });

  it("shows legitimate context/proxies and preserves unavailable analysis states", () => {
    const overlays = buildTruthfulOverlays();
    expect(overlays.find((overlay) => overlay.type === "DAYLIGHT_PROXY")?.state).toBe("PROXY");
    expect(overlays.find((overlay) => overlay.type === "THERMAL_CONTEXT")?.state).toBe("OBSERVED");
    expect(overlays.find((overlay) => overlay.type === "REGULATORY_STATUS")?.state).toBe("NOT_ASSESSED");
    expect(overlays.find((overlay) => overlay.type === "ACCESSIBILITY_EVIDENCE")?.result).toContain("NOT_COMPLIANCE");
  });

  it("composes a review board from existing views without a second truth model", () => {
    const board = composeReviewBoard();
    expect(board.blocks).toContain("PLAN_N1");
    expect(board.blocks).toContain("PLAN_N2");
    expect(board.blocks).toContain("OVERLAY_LEGEND");
    expect(board.provenance).toContain("A20-P3R");
    expect(board.warnings.some((warning) => warning.includes("NOT_ASSESSED"))).toBe(true);
  });

  it("compares before/after and exposes change without selecting a winner", () => {
    const source = generateVerifiedResidentialPlan();
    const result = applyRoomOperation(source, "MOVE_ROOM", "BED-01", { dx: -0.2 }).plan;
    const comparison = comparePresentationStates(source, result);
    expect(comparison.synchronized).toBe(true);
    expect(comparison.differences).toContain("BED-01: footprint changed");
    expect(comparison.winnerCreated).toBe(false);
    expect(comparison.humanSelection).toBe("NONE");
  });

  it("orchestrates natural-language presentation requests with truthful gaps", () => {
    const solar = orchestratePresentation("SHOW_SOLAR");
    expect(solar.unavailable).toContain("REAL_SOLAR_SIMULATION");
    expect(solar.decisionCreated).toBe(false);
    expect(solar.humanReviewRequired).toBe(true);
    const review = orchestratePresentation("PREPARE_REVIEW_BOARD");
    expect(review.board.id).toBe("HOUSE-001-REVIEW-BOARD");
  });
});
