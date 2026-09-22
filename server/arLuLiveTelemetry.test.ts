import { describe, expect, it } from "vitest";
import { AR_LU_AGENT_TELEMETRY, AR_LU_IDEA_REGISTRY, AR_LU_PROVIDER_CATALOG } from "../shared/arLuLiveTelemetry";

describe("AR-LU live orchestration telemetry", () => {
  it("exposes LUCA ideas and frozen records in the same registry", () => {
    expect(AR_LU_IDEA_REGISTRY.some((item) => item.id.startsWith("LUCA-"))).toBe(true);
    expect(AR_LU_IDEA_REGISTRY.some((item) => item.status === "FROZEN")).toBe(true);
  });
  it("classifies provider candidates without enabling them", () => {
    expect(AR_LU_PROVIDER_CATALOG.length).toBeGreaterThanOrEqual(9);
    expect(AR_LU_PROVIDER_CATALOG.every((provider) => provider.source.startsWith("https://"))).toBe(true);
    expect(AR_LU_PROVIDER_CATALOG.some((provider) => provider.status === "READY_FOR_SANDBOX")).toBe(true);
  });
  it("keeps a visible telemetry record for each core assistant", () => {
    expect(AR_LU_AGENT_TELEMETRY.map((agent) => agent.name)).toEqual(["ARKI", "LUCA", "VISION", "COSTOS"]);
  });
});
