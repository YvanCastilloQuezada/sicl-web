import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchCanonicalSnapshot } from "./coreHttpClient";

describe("coreHttpClient service authentication", () => {
  afterEach(() => {
    delete process.env.SICL_CORE_URL;
    delete process.env.SICL_CORE_SERVICE_TOKEN;
    vi.unstubAllGlobals();
  });

  it("sends the service bearer token only server-side", async () => {
    process.env.SICL_CORE_URL = "https://core.example.test";
    process.env.SICL_CORE_SERVICE_TOKEN = "service-token-test";
    const fetchSpy = vi.fn().mockResolvedValue(new Response(JSON.stringify({ contract_version: "sicl-core-http/0.1", project_id: "SICL-1", observed_version: 1, snapshot: {} }), { status: 200, headers: { "content-type": "application/json" } }));
    vi.stubGlobal("fetch", fetchSpy);
    const result = await fetchCanonicalSnapshot("SICL-1");
    expect(fetchSpy).toHaveBeenCalledWith("https://core.example.test/v1/projects/SICL-1/snapshot", { headers: { accept: "application/json", authorization: "Bearer service-token-test" } });
    expect(JSON.stringify(result)).not.toContain("service-token-test");
  });

  it("fails closed when a configured core URL has no service token", async () => {
    process.env.SICL_CORE_URL = "https://core.example.test";
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    await expect(fetchCanonicalSnapshot("SICL-1")).rejects.toThrow("SICL_CORE_SERVICE_TOKEN is required");
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

  it("delegates recommendation, review and decision writes with the service token", async () => {
    process.env.SICL_CORE_URL = "https://core.example.test";
    process.env.SICL_CORE_SERVICE_TOKEN = "service-token-test";
    const fetchSpy = vi.fn().mockImplementation(() => Promise.resolve(new Response(JSON.stringify({ contract_version: "sicl-core-http/0.1", project_id: "SICL-1", observed_version: 2 }), { status: 200, headers: { "content-type": "application/json" } })));
    vi.stubGlobal("fetch", fetchSpy);
    const { createCoreRecommendation, recordCoreHumanReview, recordCoreDecision } = await import("./coreHttpClient");
    await createCoreRecommendation("SICL-1", { recommendation_id: "REC-1" });
    await recordCoreHumanReview("SICL-1", { review_id: "REV-1" });
    await recordCoreDecision("SICL-1", { decision_id: "DEC-1" });
    expect(fetchSpy).toHaveBeenCalledTimes(3);
    expect(fetchSpy.mock.calls.every(([, init]) => (init as RequestInit).headers && JSON.stringify((init as RequestInit).headers).includes("service-token-test"))).toBe(true);
  });

  it.each([401, 409, 422])("propagates adapter status %s", async (status) => {
    process.env.SICL_CORE_URL = "https://core.example.test";
    process.env.SICL_CORE_SERVICE_TOKEN = "service-token-test";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status })));
    const { createCoreRecommendation } = await import("./coreHttpClient");
    await expect(createCoreRecommendation("SICL-1", {})).rejects.toThrow(String(status));
  });

  it("loads the canonical read-only Council model", async () => {
    process.env.SICL_CORE_URL = "https://core.example.test";
    process.env.SICL_CORE_SERVICE_TOKEN = "service-token-test";
    const fetchSpy = vi.fn().mockResolvedValue(new Response(JSON.stringify({ contract_version: "sicl-core-http/0.1", project_id: "SICL-1", observed_version: 1, read_only: true, readOnly: true, finding: "CANONICAL_ANALYTICAL_ARTIFACTS", comparisons: [], multi_comparisons: [], tradeoffs: [], recommendations: [] }), { status: 200 }));
    vi.stubGlobal("fetch", fetchSpy);
    const { fetchCanonicalCouncil } = await import("./coreHttpClient");
    await expect(fetchCanonicalCouncil("SICL-1")).resolves.toMatchObject({ read_only: true, readOnly: true });
    expect(fetchSpy).toHaveBeenCalledWith("https://core.example.test/v1/projects/SICL-1/council", { headers: { accept: "application/json", authorization: "Bearer service-token-test" } });
  });
