import { describe, expect, it } from "vitest";
import { ENTERPRISE_CAPABILITIES, enterpriseCapabilityMatrix, planEnterpriseRun } from "./arkiEnterpriseArchitecture";
import { commercialApiContract, handleCommercialApiRequest } from "./arkiCommercialApi";

describe("ARKI enterprise boundary", () => {
  it("exposes all requested enterprise domains without claiming unavailable integrations", () => {
    const domains = new Set(ENTERPRISE_CAPABILITIES.map((item) => item.domain));
    expect(domains.size).toBe(8);
    expect(enterpriseCapabilityMatrix().some((item) => item.status === "NOT_DEMONSTRATED")).toBe(false);
    expect(ENTERPRISE_CAPABILITIES.some((item) => item.id === "ECO-01" && item.status === "PLANNED")).toBe(true);
  });

  it("keeps enterprise planning on the existing unified motor", () => {
    const result = planEnterpriseRun({ projectId: "ENT-DEM-001-001", projectName: "Demo", typology: "Office", brief: "A bounded conceptual project brief.", context: {}, constraints: ["human review"], activities: [], relationships: [], subjects: [], conditions: [], unknowns: [], envelope: { width: 20, height: 20 }, sourceIds: [] });
    expect(result.architectureVersion).toBe("ARKI-ENTERPRISE-ARCH-1.0");
    expect(result.motor.motorVersion).toBe("ARKI-UNIFIED-MOTOR-1.0");
    expect(result.humanAuthority).toBe("FINAL");
  });

  it("keeps the commercial API as a governed facade, not a second brain", () => {
    expect(commercialApiContract().brainSeparated).toBe(true);
    const response = handleCommercialApiRequest({ apiVersion: "v1", tenantId: "tenant-a", actorId: "user-a", plan: "PROFESSIONAL", operation: "CAPABILITIES", idempotencyKey: "001" });
    expect(response.status).toBe("ACCEPTED");
    expect(response.audit.humanReviewRequired).toBe(true);
    expect(response.result).toHaveProperty("capabilities");
  });
});
