import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchCanonicalCouncil, fetchCanonicalSnapshot } from "./coreHttpClient";
import { safeAuditData } from "@shared/audit";

describe("SICL integration hardening adaptation", () => {
  afterEach(() => {
    delete process.env.SICL_CORE_URL;
    delete process.env.SICL_CORE_SERVICE_TOKEN;
    vi.unstubAllGlobals();
  });

  it("keeps canonical Council, contractual 404 and safe audit trace in one flow", async () => {
    process.env.SICL_CORE_URL = "https://core.example.test";
    process.env.SICL_CORE_SERVICE_TOKEN = "service-token-test";
    const councilEnvelope = { contract_version: "sicl-core-http/0.1", project_id: "SICL-1", observed_version: 4, read_only: true, readOnly: true, finding: "TRADE_OFF", comparisons: [{ comparison_id: "CMP-1", method: "WEIGHTED_SUM" }], multi_comparisons: [], tradeoffs: [{ id: "T-1", status: "EXPLICIT" }], recommendations: [{ recommendation_id: "REC-1", source: "ANALYTICAL" }] };
    const notFoundEnvelope = { error: "PROJECT_NOT_FOUND", detail: "No canonical project exists", trace_id: "trace-404" };
    vi.stubGlobal("fetch", vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify(councilEnvelope), { status: 200, headers: { "content-type": "application/json" } }))
      .mockResolvedValueOnce(new Response(JSON.stringify(notFoundEnvelope), { status: 404, headers: { "content-type": "application/json" } })));

    const council = await fetchCanonicalCouncil("SICL-1");
    const missing = await fetchCanonicalSnapshot("SICL-404");
    const safeAudit = safeAuditData({ council, human_review: { review_id: "REV-1", authority_basis: "PRODUCT_OWNER", token: "hidden" } });

    expect(council).toMatchObject({ finding: "TRADE_OFF", comparisons: [{ comparison_id: "CMP-1" }], recommendations: [{ recommendation_id: "REC-1" }] });
    expect(missing).toMatchObject({ not_found: true, status: 404, error: "PROJECT_NOT_FOUND", envelope: notFoundEnvelope });
    expect(JSON.stringify(safeAudit)).toContain("PRODUCT_OWNER");
    expect(JSON.stringify(safeAudit)).not.toContain("hidden");
  });
});
