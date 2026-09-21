import { describe, expect, it } from "vitest";
import { activationSummary, executeActivationRun } from "./arkiActivationOrchestrator";
import type { UnifiedMotorInput } from "./arkiUnifiedMotor";

const input: UnifiedMotorInput = {
  projectId: "ACT-TER-250-001", projectName: "Activación total terminal", typology: "TRANSPORT", brief: "Interprovincial transport terminal with public, vehicle, service and waste flows.", context: { location: "Peru", fleet: 250 }, constraints: ["separate public and service flows", "conceptual geometry only", "human review required"], activities: [{ id: "public", label: "passenger service", subjects: ["passenger"], capacity: 250, frequency: "daily", duration: "long", temporalOverlap: true, privacy: "shared" }, { id: "service", label: "vehicle service", subjects: ["staff"], capacity: 30, frequency: "daily", duration: "medium", temporalOverlap: true, accessControl: "staff", privacy: "controlled" }], relationships: [{ id: "r1", from: "public", to: "service", relation: "controlled interface", subjects: ["passenger", "staff"], state: "open", frequency: "daily", time: "operating-hours", control: "staff-mediated" }], subjects: ["passenger", "staff"], conditions: ["public and service routes remain legible"], unknowns: ["local regulation and professional review"], envelope: { width: 100, height: 200 }, sourceIds: ["SRC-TERMINAL-BRIEF", "SRC-UNIFIED-REGISTRY"]
};

describe("ARKI activation run", () => {
  it("accounts for every registered piece in one activation run", () => {
    const run = executeActivationRun(input);
    const summary = activationSummary(run);
    expect(summary.allPiecesAccountedFor).toBe(true);
    expect(summary.total).toBeGreaterThanOrEqual(10);
    expect(summary.promoted).toBeGreaterThan(0);
    expect(summary.frozenRetained).toBeGreaterThan(0);
    expect(summary.blockedRetained).toBeGreaterThan(0);
    expect(summary.notDemonstratedRetained).toBeGreaterThan(0);
    expect(summary.noSilentActivation).toBe(true);
  });

  it("activates proven pieces and retains frozen or blocked pieces with next gates", () => {
    const run = executeActivationRun(input);
    expect(run.promoted).toEqual(expect.arrayContaining(["D6.2-M", "D6.3-G", "PARTI-CONTRACT-1.0", "ARKI-INTEGRATED-ARCHITECT-1.0"]));
    expect(run.frozenRetained).toEqual(expect.arrayContaining(["MC-02", "MC-03", "FKCG-02"]));
    expect(run.blockedRetained).toContain("DG-01B");
    expect(run.notDemonstratedRetained).toContain("BIM-DWG-REVIT-GIS");
    expect(run.records.every((record) => record.humanReviewRequired)).toBe(true);
    expect(run.invariants).toContain("HUMAN_AUTHORITY_FINAL");
  });

  it("does not convert documentation or freeze into a false PASS", () => {
    const run = executeActivationRun(input);
    expect(run.records.find((record) => record.pieceId === "MC-02")?.gateStatus).toBe("HOLD");
    expect(run.records.find((record) => record.pieceId === "DG-01B")?.gateStatus).toBe("HOLD");
    expect(run.records.find((record) => record.pieceId === "BIM-DWG-REVIT-GIS")?.disposition).toBe("RETAINED_NOT_DEMONSTRATED");
  });
});
