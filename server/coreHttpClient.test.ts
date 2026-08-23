import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchCanonicalSnapshot } from "./coreHttpClient";

describe("coreHttpClient", () => {
  afterEach(() => {
    delete process.env.SICL_CORE_URL;
    vi.unstubAllGlobals();
  });

  it("does not call a core service when no URL is configured", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    await expect(fetchCanonicalSnapshot("SICL-1")).resolves.toBeUndefined();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("fetches only the canonical snapshot endpoint without browser credentials", async () => {
    process.env.SICL_CORE_URL = "https://core.example.test/";
    const fetchSpy = vi.fn().mockResolvedValue(new Response(JSON.stringify({ contract_version: "sicl-core-http/0.1", project_id: "SICL-1", observed_version: 3, snapshot: { events: [] } }), { status: 200, headers: { "content-type": "application/json" } }));
    vi.stubGlobal("fetch", fetchSpy);
    await expect(fetchCanonicalSnapshot("SICL-1")).resolves.toMatchObject({ observed_version: 3 });
    expect(fetchSpy).toHaveBeenCalledWith("https://core.example.test/v1/projects/SICL-1/snapshot", { headers: { accept: "application/json", authorization: expect.stringMatching(/^Bearer /) } });
  });

  it("preserves adapter failures instead of turning them into success", async () => {
    process.env.SICL_CORE_URL = "https://core.example.test";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 503 })));
    await expect(fetchCanonicalSnapshot("SICL-1")).rejects.toThrow("503");
  });
});


describe("SiclCoreHttpError", () => {
  afterEach(() => {
    delete process.env.SICL_CORE_URL;
    delete process.env.SICL_CORE_SERVICE_TOKEN;
    vi.unstubAllGlobals();
  });

  it("preserves upstream status and safe error envelope", async () => {
    process.env.SICL_CORE_URL = "https://core.example.test";
    process.env.SICL_CORE_SERVICE_TOKEN = "service-token-test";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: "CONCURRENCY_CONFLICT", detail: "expected project version 1, got 2" }), { status: 409, headers: { "content-type": "application/json" } })));
    const { createCoreRecommendation } = await import("./coreHttpClient");
    await expect(createCoreRecommendation("SICL-1", { recommendation_id: "REC-1" })).rejects.toMatchObject({ status: 409, errorCode: "CONCURRENCY_CONFLICT", message: expect.stringContaining("expected project version") });
  });
});


  it("preserves the upstream 404 envelope for canonical reads", async () => {
    process.env.SICL_CORE_URL = "https://core.example.test";
    process.env.SICL_CORE_SERVICE_TOKEN = "service-token-test";
    const envelope = { error: "PROJECT_NOT_FOUND", detail: "No canonical project exists", trace_id: "trace-404" };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify(envelope), { status: 404, headers: { "content-type": "application/json" } })));
    const result = await fetchCanonicalSnapshot("SICL-404");
    expect(result).toMatchObject({ not_found: true, status: 404, error: "PROJECT_NOT_FOUND", detail: "No canonical project exists", envelope });
  });

  it("sends hierarchical scopes to canonical project creation", async () => {
    process.env.SICL_CORE_URL = "https://core.example.test";
    process.env.SICL_CORE_SERVICE_TOKEN = "service-token-test";
    const fetchSpy = vi.fn().mockResolvedValue(new Response(JSON.stringify({ contract_version: "sicl-core-http/0.2", project_id: "SICL-SCOPE", observed_version: 1, snapshot: { project: {} } }), { status: 200, headers: { "content-type": "application/json" } }));
    vi.stubGlobal("fetch", fetchSpy);
    const { createCoreProject } = await import("./coreHttpClient");
    await createCoreProject("SICL-SCOPE", "Territorial scenario", { spatialScope: { scale: "COUNTRY", id: "PE", name: "Peru" }, temporalScope: { horizon: "2050", scenario: "resilient-growth" } });
    const request = fetchSpy.mock.calls[0]?.[1] as RequestInit;
    expect(JSON.parse(String(request.body))).toMatchObject({ spatial_scope: { scale: "COUNTRY", id: "PE", name: "Peru" }, temporal_scope: { horizon: "2050", scenario: "resilient-growth" } });
  });
