import { describe, expect, it } from "vitest";
import {
  CORE_INTEGRITY_TARGETS,
  OBSERVABILITY_AGENT_METRICS,
  OBSERVABILITY_NOT_IMPLEMENTED,
  OBSERVABILITY_ROUTES,
  canClaimFromMetric,
  deriveSystemStatus,
  isCoreIsolated,
  isCriticalOverride,
  noDataMetric,
  shouldDeduplicateAlert,
} from "./observabilityContract";

describe("MiLukita observability contract", () => {
  it("represents missing telemetry as NO_DATA rather than false green", () => {
    expect(noDataMetric()).toEqual({ value: null, status: "NO_DATA", dataStatus: "UNAVAILABLE" });
    expect(deriveSystemStatus({ critical: false, degraded: false, warning: false, dataSufficient: false })).toBe("NO_DATA");
    expect(deriveSystemStatus({ critical: true, degraded: false, warning: false, dataSufficient: true })).toBe("CRITICAL");
    expect(OBSERVABILITY_AGENT_METRICS).toEqual(["HEALTH", "QUALITY", "IMPACT", "GOVERNANCE", "TRUST"]);
  });

  it("applies critical overrides and never turns a metric into a claim by itself", () => {
    expect(isCriticalOverride({ coreIntegrityCritical: true, authorityViolation: false, averageScore: 99 })).toBe(true);
    expect(isCriticalOverride({ coreIntegrityCritical: false, authorityViolation: true, averageScore: 99 })).toBe(true);
    expect(canClaimFromMetric({ value: 99, dataStatus: "REAL", dataTrust: "AUTHORITATIVE", baselineReady: true })).toBe(false);
    expect(CORE_INTEGRITY_TARGETS.unauthorizedCoreAccess).toBe(0);
    expect(CORE_INTEGRITY_TARGETS.resultAlterationAttempts).toBe(0);
  });

  it("preserves core isolation and groups repeated alerts by correlation", () => {
    expect(isCoreIsolated({ coreAccess: "NONE", coreImpact: "NONE" })).toBe(true);
    expect(isCoreIsolated({ coreAccess: "BLOCKED", coreImpact: "ATTEMPTED" })).toBe(false);
    expect(shouldDeduplicateAlert({ correlationId: "incident-1", lifecycle: "OPEN" }, { correlationId: "incident-1" })).toBe(true);
    expect(shouldDeduplicateAlert({ correlationId: "incident-1", lifecycle: "CLOSED" }, { correlationId: "incident-1" })).toBe(false);
  });

  it("declares persistence and production integrations as not implemented", () => {
    expect(OBSERVABILITY_ROUTES).toContain("/control-room");
    expect(OBSERVABILITY_ROUTES).toContain("/control-room/core");
    expect(OBSERVABILITY_NOT_IMPLEMENTED).toContain("PERSISTENT_TELEMETRY_PIPELINE");
    expect(OBSERVABILITY_NOT_IMPLEMENTED).toContain("PRODUCTION_CONTROL_ROOM_CERTIFICATION");
  });
});
