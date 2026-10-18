import { describe, expect, it } from "vitest";
import { noAgentCanWriteProtectedCore, safeCapabilitiesFor, assessSafeCapability } from "./agentSafeCapability";

describe("agent safe capability contract", () => {
  it("exposes a bounded contract for every registered backlog agent", () => {
    expect(safeCapabilitiesFor("audience-intelligence").find((item) => item.capability === "CONTRACT")?.available).toBe(true);
    expect(safeCapabilitiesFor("social").find((item) => item.capability === "EVIDENCE_PATH")?.available).toBe(true);
    expect(safeCapabilitiesFor("legal_compliance_intelligence").find((item) => item.capability === "AUTHORITY_BOUNDARY")?.available).toBe(true);
  });
  it("keeps persistent or external capabilities explicitly unavailable", () => {
    expect(assessSafeCapability("distribution", "OBSERVABILITY").reason).toBe("PERSISTENT_OR_EXTERNAL_EVIDENCE_REQUIRED");
    expect(assessSafeCapability("unknown", "CONTRACT").reason).toBe("AGENT_NOT_REGISTERED");
  });
  it("denies protected-core writes for every agent", () => {
    expect(noAgentCanWriteProtectedCore("marketing")).toBe(false);
    expect(noAgentCanWriteProtectedCore("legal_compliance_intelligence")).toBe(false);
  });
});
