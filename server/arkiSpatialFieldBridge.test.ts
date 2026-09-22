import { describe, expect, it } from "vitest";
import {
  ARKI_SPATIAL_FIELD_BRIDGE,
  SpatialBridgeError,
  assertNoDeviceDecisionOrPublication,
  authorizeSpatialBridgeOperation,
  bridgeEvidenceSummary,
  buildSpatialObservation,
  observationEvent,
  observationRecord,
  openSpatialBridgeSession,
} from "./arkiSpatialFieldBridge";

describe("ARKI Spatial Field Bridge", () => {
  const base = { projectId: "PRJ-001", userId: 7, deviceId: "milu-device-01", scopes: ["sfb:project:read", "sfb:project:observe"], observedProjectVersion: 3, coreAvailable: true };

  it("declares one canonical Core and no mobile decision authority", () => {
    expect(ARKI_SPATIAL_FIELD_BRIDGE.canonicalWrite).toBe("SICL_CORE_ONLY");
    expect(ARKI_SPATIAL_FIELD_BRIDGE.decisionCommitFromDevice).toBe(false);
    expect(bridgeEvidenceSummary().c001RealityMapStatus).toBe("BLOCKED");
  });

  it("opens only an authenticated, scoped, online session against Core", () => {
    const session = openSpatialBridgeSession(base);
    expect(session.projectId).toBe(base.projectId);
    expect(session.mode).toBe("ONLINE");
    expect(session.provenance).toBe("MILUQUITA_FIELD_SESSION");
  });

  it("fails closed when Core is unavailable or the scope is missing", () => {
    expect(() => authorizeSpatialBridgeOperation({ operation: "FIELD_OBSERVATION", mode: "ONLINE", scopes: ["sfb:project:observe"], coreAvailable: false, deviceId: "device", expectedProjectVersion: 1 })).toThrowError(expect.objectContaining({ code: "BRIDGE_CORE_REQUIRED" }));
    expect(() => openSpatialBridgeSession({ ...base, scopes: [], coreAvailable: true })).toThrowError(expect.objectContaining({ code: "BRIDGE_SCOPE_REQUIRED" }));
  });

  it("rejects degraded/offline canonical synchronization", () => {
    expect(() => authorizeSpatialBridgeOperation({ operation: "FIELD_OBSERVATION", mode: "DEGRADED", scopes: ["sfb:project:observe"], coreAvailable: true, deviceId: "device", expectedProjectVersion: 1 })).toThrowError(expect.objectContaining({ code: "BRIDGE_MODE_BLOCKED" }));
  });

  it("creates a provisional observation with explicit provenance and human review", () => {
    const session = openSpatialBridgeSession(base);
    const observation = buildSpatialObservation({ session, kind: "HIT_TEST", payload: { x: 1, y: 2, z: 3 }, confidence: "MEDIUM", expectedProjectVersion: 3, coreAvailable: true });
    expect(observation.epistemicStatus).toBe("AI_PROPOSED");
    expect(observation.humanReviewRequired).toBe(true);
    expect(observation.provenance).toContain("SOURCE:MILUQUITA");
    expect(observationRecord(observation).data.sourceSystem).toBe("MILUQUITA");
    expect(observationEvent(observation, 7).type).toBe("MILUQUITA_FIELD_OBSERVATION_RECEIVED");
  });

  it("rejects stale project versions and privileged device actions", () => {
    const session = openSpatialBridgeSession(base);
    expect(() => buildSpatialObservation({ session, kind: "GPS", payload: { lat: 0, lon: 0 }, expectedProjectVersion: 2, coreAvailable: true })).toThrowError(expect.objectContaining({ code: "BRIDGE_VERSION_REQUIRED" }));
    expect(() => assertNoDeviceDecisionOrPublication("PUBLISH")).toThrowError(expect.objectContaining({ code: "BRIDGE_DECISION_FORBIDDEN" }));
  });
});
