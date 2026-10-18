import { describe, expect, it } from "vitest";
import { executeCorporationWaves, evaluateWave2, executeWave3, executeWave4, executeWave5 } from "./arkiCorporationWaves";
import { createProjectIdentifier } from "./arkiIntegratedArchitectCycle";

describe("ARKI Corporation Waves 2–5", () => {
  it("Wave 2 preserves UNKNOWN when measurable evidence is absent", () => {
    const result = evaluateWave2({ measurements: [] });
    expect(result.status).toBe("PARTIAL");
    expect(result.unknowns.length).toBeGreaterThan(0);
    expect(result.humanReviewRequired).toBe(true);
  });

  it("Wave 3 exposes transparent budget/BIM limits instead of claiming native delivery", () => {
    const result = executeWave3([], []);
    expect(result.status).toBe("SPECIALIST_REQUIRED");
    expect(result.bim.exportStatus.RVT).toBe("REQUIRES_ADAPTER");
    expect(result.engineering.structure).toBe("SPECIALIST_REQUIRED");
  });

  it("Wave 4 distinguishes configured remote core from local-only collaboration", () => {
    const result = executeWave4({ jurisdiction: "PE", regulatorySources: [], users: [{ id: "u1", role: "ARCHITECT" }], coreEndpointConfigured: false });
    expect(result.status).toBe("BLOCKED");
    expect(result.core.persistence).toBe("LOCAL_ONLY");
    expect(result.collaboration.multiUserPersistence).toBe("NOT_DEMONSTRATED");
  });

  it("Wave 5 keeps agents advisory and learning candidates unpromoted", () => {
    const result = executeWave5();
    expect(result.status).toBe("READY_FOR_REVIEW");
    expect(result.research.learningCandidate).toBe("REGISTERED_NOT_PROMOTED");
    expect(result.agents.every((agent) => agent.humanGate.length > 0)).toBe(true);
  });

  it("runs all Waves through the same unified motor", () => {
    const result = executeCorporationWaves({
      projectId: createProjectIdentifier("WAVE"), projectName: "Wave test", typology: "CIVIC", brief: "Coordinate a civic building with public and service flows.", context: { location: "PE" }, constraints: ["Preserve separated flows"], activities: [{ id: "public", label: "public" }], relationships: [{ id: "r1", from: "public", to: "service", relation: "controlled" }], subjects: ["public", "service"], conditions: ["day"], unknowns: ["final code clauses"], envelope: { width: 30, height: 12 }, sourceIds: ["WAVE-TEST"], wave4: { jurisdiction: "PE", regulatorySources: [], users: [{ id: "u1", role: "ARCHITECT" }], coreEndpointConfigured: false },
    });
    expect(result.motor.motorVersion).toBe("ARKI-UNIFIED-MOTOR-1.0");
    expect(result.status).toBe("CORPORATION_WAVES_PARTIAL_WITH_BOUNDS");
    expect(result.humanAuthority).toBe("FINAL");
  });
});
