import { describe, expect, it } from "vitest";
import { safeAuditData } from "@shared/audit";

describe("safeAuditData", () => {
  it("preserves traceable fields and removes sensitive fields recursively", () => {
    const result = safeAuditData({
      event_type: "DECISION_RECORDED",
      entity_id: "DEC-1",
      project_id: "SICL-1",
      data: { actor_id: "actor-1", authorization: "Bearer hidden", nested: { secret: "hidden", rationale: "approved" } },
    });

    expect(result).toMatchObject({ event_type: "DECISION_RECORDED", entity_id: "DEC-1", project_id: "SICL-1" });
    expect(JSON.stringify(result)).not.toContain("hidden");
    expect(JSON.stringify(result)).toContain("rationale");
  });
});


  it("keeps Council and human audit records traceable while filtering secrets", () => {
    const result = safeAuditData({
      council: { finding: "TRADE_OFF", comparisons: [{ id: "CMP-1", method: "WEIGHTED_SUM" }] },
      human_review: { review_id: "REV-1", authority_basis: "PRODUCT_OWNER", timestamp: "2026-08-23T00:00:00Z", token: "hidden" },
      decision: { decision_id: "DEC-1", authority_basis: "PRODUCT_OWNER", observed_version: 4, secret_key: "hidden" },
    });
    expect(result).toMatchObject({ council: { finding: "TRADE_OFF" }, human_review: { review_id: "REV-1", authority_basis: "PRODUCT_OWNER" }, decision: { decision_id: "DEC-1", observed_version: 4 } });
    expect(JSON.stringify(result)).not.toContain("hidden");
  });
