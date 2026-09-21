import { describe, expect, it } from "vitest";
import { ARKI_LIFECYCLE_PHASES, buildSemanticBimRepresentation, calculateLifecycleBudget, executeLifecycleCycle, type UnifiedMotorInput } from "./arkiProjectLifecycle";

const input: UnifiedMotorInput = { projectId: "LIF-CYC-001-001", projectName: "Lifecycle demo", typology: "MIXED_USE", brief: "A project tracked from conception through operations and maintenance.", context: { location: "Peru" }, constraints: ["human review"], activities: [], relationships: [], subjects: [], conditions: [], unknowns: [], envelope: { width: 30, height: 40 }, sourceIds: [] };

describe("ARKI project lifecycle", () => {
  it("defines all lifecycle phases through post-occupancy", () => {
    expect(ARKI_LIFECYCLE_PHASES).toContain("CONCEPTION");
    expect(ARKI_LIFECYCLE_PHASES).toContain("CONSTRUCTION");
    expect(ARKI_LIFECYCLE_PHASES).toContain("OPERATION");
    expect(ARKI_LIFECYCLE_PHASES).toContain("MAINTENANCE_AND_RENEWAL");
    expect(ARKI_LIFECYCLE_PHASES).toContain("POST_OCCUPANCY_EVALUATION");
    expect(ARKI_LIFECYCLE_PHASES.length).toBe(12);
  });

  it("calculates a transparent initial and lifecycle budget", () => {
    const budget = calculateLifecycleBudget([
      { id: "design", category: "DESIGN", description: "design", quantity: 1, unitCost: 10000, currency: "USD", source: "estimate", confidence: "ESTIMATE" },
      { id: "build", category: "CONSTRUCTION", description: "construction", quantity: 1000, unitCost: 800, currency: "USD", source: "estimate", confidence: "ESTIMATE" },
      { id: "ops", category: "OPERATIONS", description: "annual operations", quantity: 1, unitCost: 50000, currency: "USD", source: "owner", confidence: "ESTIMATE" },
      { id: "maint", category: "MAINTENANCE", description: "annual maintenance", quantity: 1, unitCost: 25000, currency: "USD", source: "owner", confidence: "UNKNOWN" },
    ], 0.1, 20);
    expect(budget.directCost).toBe(810000);
    expect(budget.contingency).toBe(81000);
    expect(budget.totalInitialCost).toBe(891000);
    expect(budget.lifecycleCost).toBe(2391000);
    expect(budget.unknowns).toContain("maint");
    expect(budget.humanReviewRequired).toBe(true);
  });

  it("creates a semantic BIM representation without falsely claiming native exports", () => {
    const bim = buildSemanticBimRepresentation([{ id: "space-1", category: "SPACE", name: "Lobby", level: "N1", geometryStatus: "CONCEPTUAL", properties: { area_m2: 120 }, sourceIds: ["SRC-1"] }]);
    expect(bim.schema).toBe("ARKI-BIM-SEMANTIC-1.0");
    expect(bim.exportStatus.JSON).toBe("PREPARED");
    expect(bim.exportStatus.RVT).toBe("REQUIRES_ADAPTER");
    expect(bim.exportStatus.DWG).toBe("REQUIRES_ADAPTER");
    expect(bim.humanReviewRequired).toBe(true);
  });

  it("runs lifecycle orchestration on top of the same motor", () => {
    const run = executeLifecycleCycle(input, "OPERATION");
    expect(run.lifecycleVersion).toBe("ARKI-LIFECYCLE-1.0");
    expect(run.currentPhase).toBe("OPERATION");
    expect(run.motor.motorVersion).toBe("ARKI-UNIFIED-MOTOR-1.0");
    expect(run.humanAuthority).toBe("FINAL");
  });
});
