import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchCanonicalSnapshot } from "./coreHttpClient";

describe("coreHttpClient", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("does not call a core service when no URL is configured", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    await expect(fetchCanonicalSnapshot("SICL-1")).resolves.toBeUndefined();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("fetches only the canonical snapshot endpoint without browser credentials", async () => {
    vi.stubEnv("SICL_CORE_URL", "https://core.example.test/");
    vi.stubEnv("SICL_CORE_SERVICE_TOKEN", "service-token-test");
    const fetchSpy = vi.fn().mockResolvedValue(new Response(JSON.stringify({ contract_version: "sicl-core-http/0.1", project_id: "SICL-1", observed_version: 3, snapshot: { events: [] } }), { status: 200, headers: { "content-type": "application/json" } }));
    vi.stubGlobal("fetch", fetchSpy);
    await expect(fetchCanonicalSnapshot("SICL-1")).resolves.toMatchObject({ observed_version: 3 });
    expect(fetchSpy).toHaveBeenCalledWith("https://core.example.test/v1/projects/SICL-1/snapshot", { headers: { accept: "application/json", authorization: expect.stringMatching(/^Bearer /) } });
  });

  it("preserves adapter failures instead of turning them into success", async () => {
    vi.stubEnv("SICL_CORE_URL", "https://core.example.test");
    vi.stubEnv("SICL_CORE_SERVICE_TOKEN", "service-token-test");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 503 })));
    await expect(fetchCanonicalSnapshot("SICL-1")).rejects.toThrow("503");
  });
});


describe("SiclCoreHttpError", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("preserves upstream status and safe error envelope", async () => {
    vi.stubEnv("SICL_CORE_URL", "https://core.example.test");
    vi.stubEnv("SICL_CORE_SERVICE_TOKEN", "service-token-test");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: "CONCURRENCY_CONFLICT", detail: "expected project version 1, got 2" }), { status: 409, headers: { "content-type": "application/json" } })));
    const { createCoreRecommendation } = await import("./coreHttpClient");
    await expect(createCoreRecommendation("SICL-1", { recommendation_id: "REC-1" })).rejects.toMatchObject({ status: 409, errorCode: "CONCURRENCY_CONFLICT", message: expect.stringContaining("expected project version") });
  });
});


  it("preserves the upstream 404 envelope for canonical reads", async () => {
    vi.stubEnv("SICL_CORE_URL", "https://core.example.test");
    vi.stubEnv("SICL_CORE_SERVICE_TOKEN", "service-token-test");
    const envelope = { error: "PROJECT_NOT_FOUND", detail: "No canonical project exists", trace_id: "trace-404" };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify(envelope), { status: 404, headers: { "content-type": "application/json" } })));
    const result = await fetchCanonicalSnapshot("SICL-404");
    expect(result).toMatchObject({ not_found: true, status: 404, error: "PROJECT_NOT_FOUND", detail: "No canonical project exists", envelope });
  });

  it("sends hierarchical scopes to canonical project creation", async () => {
    vi.stubEnv("SICL_CORE_URL", "https://core.example.test");
    vi.stubEnv("SICL_CORE_SERVICE_TOKEN", "service-token-test");
    const fetchSpy = vi.fn().mockResolvedValue(new Response(JSON.stringify({ contract_version: "sicl-core-http/0.2", project_id: "SICL-SCOPE", observed_version: 1, snapshot: { project: {} } }), { status: 200, headers: { "content-type": "application/json" } }));
    vi.stubGlobal("fetch", fetchSpy);
    const { createCoreProject } = await import("./coreHttpClient");
    await createCoreProject("SICL-SCOPE", "Territorial scenario", { spatialScope: { scale: "COUNTRY", id: "PE", name: "Peru" }, temporalScope: { horizon: "2050", scenario: "resilient-growth" } });
    const request = fetchSpy.mock.calls[0]?.[1] as RequestInit;
    expect(JSON.parse(String(request.body))).toMatchObject({ spatial_scope: { scale: "COUNTRY", id: "PE", name: "Peru" }, temporal_scope: { horizon: "2050", scenario: "resilient-growth" } });
  });


it("fetches the read-only operations research catalog without exposing service credentials", async () => {
  vi.stubEnv("SICL_CORE_URL", "https://core.example.test");
  vi.stubEnv("SICL_CORE_SERVICE_TOKEN", "service-token-test");
  const fetchSpy = vi.fn().mockResolvedValue(new Response(JSON.stringify({
    contract_version: "sicl-core-http/0.2",
    read_only: true,
    methods: [{ method: "TRANSPORTATION_LP", required_inputs: ["supply"], required_units: ["flow_unit"], required_constraints: ["supply_capacity"], required_assumptions: ["known_supply_and_demand"], required_provenance: ["source_id", "source_timestamp", "source_version"], output_fields: ["status", "flows"], feasibility_states: ["OPTIMAL", "INFEASIBLE", "INSUFFICIENT_DATA", "UNKNOWN"], sensitivity_outputs: ["method", "parameters", "limitations"], version: "0.1" }],
  }), { status: 200, headers: { "content-type": "application/json" } }));
  vi.stubGlobal("fetch", fetchSpy);
  const { fetchOperationsResearchMethods } = await import("./coreHttpClient");
  const result = await fetchOperationsResearchMethods();
  expect(result).toMatchObject({ read_only: true, methods: [{ method: "TRANSPORTATION_LP", required_constraints: ["supply_capacity"], required_provenance: ["source_id", "source_timestamp", "source_version"], feasibility_states: ["OPTIMAL", "INFEASIBLE", "INSUFFICIENT_DATA", "UNKNOWN"], sensitivity_outputs: ["method", "parameters", "limitations"] }] });
  expect(JSON.stringify(result)).not.toContain("service-token-test");
  expect(fetchSpy).toHaveBeenCalledWith("https://core.example.test/v1/operations-research/methods", { method: "GET", headers: { accept: "application/json", authorization: "Bearer service-token-test" } });
});


it("writes canonical preferences with explicit scope and provenance", async () => {
  vi.stubEnv("SICL_CORE_URL", "https://core.example.test");
  vi.stubEnv("SICL_CORE_SERVICE_TOKEN", "service-token-test");
  const fetchSpy = vi.fn().mockResolvedValue(new Response(JSON.stringify({ contract_version: "sicl-core-http/0.3", project_id: "SICL-PREF", observed_version: 2, preference: { preference_id: "PREF-1" } }), { status: 200, headers: { "content-type": "application/json" } }));
  vi.stubGlobal("fetch", fetchSpy);
  const { createCorePreference } = await import("./coreHttpClient");
  await createCorePreference("SICL-PREF", { preference_id: "PREF-1", name: "Regional identity", justification: "Declared", domain: "AESTHETIC", strength: "STRONG", scope_type: "PROJECT", scope_id: "SICL-PREF", provenance: ["brief-1"], expected_project_version: 1, event_id: "evt-1" });
  const request = fetchSpy.mock.calls[0]?.[1] as RequestInit;
  expect(fetchSpy.mock.calls[0]?.[0]).toBe("https://core.example.test/v1/projects/SICL-PREF/preferences");
  expect(JSON.parse(String(request.body))).toMatchObject({ preference_id: "PREF-1", scope_type: "PROJECT", scope_id: "SICL-PREF", provenance: ["brief-1"], expected_project_version: 1 });
  expect(request.headers).toMatchObject({ authorization: "Bearer service-token-test", "content-type": "application/json" });
});


describe("[6] Developer promotion Core client", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("records bound HumanReview without inventing defaults or status", async () => {
    vi.stubEnv("SICL_CORE_URL", "https://core.example.test");
    vi.stubEnv("SICL_CORE_SERVICE_TOKEN", "service-token-test");
    const response = { human_review: { review_id: "REV-1", status: "APPROVED", referenced_entity_type: "DEVELOPER_PROPOSAL", referenced_entity_id: "dev-1", referenced_fingerprint: "a".repeat(64) } };
    const fetchSpy = vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: response }), { status: 200, headers: { "content-type": "application/json" } }));
    vi.stubGlobal("fetch", fetchSpy);
    const { recordCoreHumanReview } = await import("./coreHttpClient");
    const payload = {
      actor: "architect", timestamp: "2026-09-29T18:00:00Z", review: "Approved",
      reason: "Architecture review", authority: "PRODUCT_OWNER",
      referenced_entity_type: "DEVELOPER_PROPOSAL" as const, referenced_entity_id: "dev-1", referenced_fingerprint: "a".repeat(64),
    };
    await recordCoreHumanReview("P-1", payload);
    const request = fetchSpy.mock.calls[0][1] as RequestInit;
    expect(JSON.parse(String(request.body))).toEqual(payload);
    expect(JSON.parse(String(request.body))).not.toHaveProperty("status");
  });

  it("posts the exact promotion triple", async () => {
    vi.stubEnv("SICL_CORE_URL", "https://core.example.test");
    vi.stubEnv("SICL_CORE_SERVICE_TOKEN", "service-token-test");
    const fetchSpy = vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: {
      status: "COMMITTED", proposal_id: "dev-1", snapshot_id: "D2-1", d2_version: 7, effects_status: "COMPLETE", reason: "PROMOTED",
    } }), { status: 200, headers: { "content-type": "application/json" } }));
    vi.stubGlobal("fetch", fetchSpy);
    const { promoteDeveloperProposal } = await import("./coreHttpClient");
    const requestBody = { proposal_id: "dev-1", proposal_fingerprint: "b".repeat(64), human_review_id: "REV-1" };
    await promoteDeveloperProposal("P-1", requestBody);
    expect(fetchSpy.mock.calls[0][0]).toBe("https://core.example.test/v1/projects/P-1/developer-promotions");
    expect(JSON.parse(String((fetchSpy.mock.calls[0][1] as RequestInit).body))).toEqual(requestBody);
  });

  it("aborts a promotion transport that exceeds the Core timeout", async () => {
    vi.useFakeTimers();
    vi.stubEnv("SICL_CORE_URL", "https://core.example.test");
    vi.stubEnv("SICL_CORE_SERVICE_TOKEN", "service-token-test");
    vi.stubGlobal("fetch", vi.fn().mockImplementation((_url: string, init: RequestInit) =>
      new Promise((_resolve, reject) => {
        init.signal?.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError")));
      })
    ));
    const { promoteDeveloperProposal } = await import("./coreHttpClient");
    const pending = promoteDeveloperProposal("P-1", {
      proposal_id: "dev-1", proposal_fingerprint: "b".repeat(64), human_review_id: "REV-1",
    });
    const rejection = expect(pending).rejects.toMatchObject({ name: "AbortError" });
    await vi.advanceTimersByTimeAsync(15_000);
    await rejection;
    vi.useRealTimers();
  });

  it("reads the exact version-addressed D-2 snapshot", async () => {
    vi.stubEnv("SICL_CORE_URL", "https://core.example.test");
    vi.stubEnv("SICL_CORE_SERVICE_TOKEN", "service-token-test");
    const fetchSpy = vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: { snapshot: {
      snapshot_id: "D2-7", project_id: "P-1", version: 7, elements: [], content_hash: "h", actor: "core", source_event_id: 1, created_at: "t",
    } } }), { status: 200, headers: { "content-type": "application/json" } }));
    vi.stubGlobal("fetch", fetchSpy);
    const { fetchCoreD2Snapshot } = await import("./coreHttpClient");
    await fetchCoreD2Snapshot("P-1", 7);
    expect(fetchSpy.mock.calls[0][0]).toBe("https://core.example.test/v1/projects/P-1/d2/snapshots/7");
  });
});


describe("[6.7-T630-C.4] V1.5 Core error wire compatibility", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("preserves FastAPI detail.code, detail.message and positive integer Retry-After", async () => {
    vi.stubEnv("SICL_CORE_URL", "https://core.example.test");
    vi.stubEnv("SICL_CORE_SERVICE_TOKEN", "service-token-test");
    const envelope = { detail: {
      status: "ERROR", code: "RETRIABLE_BUSY_EXHAUSTED", message: "promotion deadline exhausted",
      data: { status: "RETRIABLE_BUSY_EXHAUSTED", proposal_id: "dev-1", reason: "promotion deadline exhausted" },
    } };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify(envelope), {
      status: 503, headers: { "content-type": "application/json", "Retry-After": "1" },
    })));
    const { promoteDeveloperProposal } = await import("./coreHttpClient");
    await expect(promoteDeveloperProposal("P-1", {
      proposal_id: "dev-1", proposal_fingerprint: "b".repeat(64), human_review_id: "REV-1",
    })).rejects.toMatchObject({
      status: 503, errorCode: "RETRIABLE_BUSY_EXHAUSTED", retryAfter: 1, envelope,
      message: expect.stringContaining("promotion deadline exhausted"),
    });
  });

  it.each(["0", "-1", "1.5", "soon", ""])("does not invent Retry-After from invalid value %j", async (retryAfter) => {
    vi.stubEnv("SICL_CORE_URL", "https://core.example.test");
    vi.stubEnv("SICL_CORE_SERVICE_TOKEN", "service-token-test");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      detail: { status: "ERROR", code: "RETRIABLE_BUSY_EXHAUSTED", message: "busy", data: {} },
    }), { status: 503, headers: { "Retry-After": retryAfter } })));
    const { promoteDeveloperProposal } = await import("./coreHttpClient");
    await expect(promoteDeveloperProposal("P-1", {
      proposal_id: "dev-1", proposal_fingerprint: "b".repeat(64), human_review_id: "REV-1",
    })).rejects.toMatchObject({ status: 503, errorCode: "RETRIABLE_BUSY_EXHAUSTED", retryAfter: null });
  });

  it("preserves HTTP evidence without inventing causal identity for malformed JSON", async () => {
    vi.stubEnv("SICL_CORE_URL", "https://core.example.test");
    vi.stubEnv("SICL_CORE_SERVICE_TOKEN", "service-token-test");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("not-json", { status: 500 })));
    const { promoteDeveloperProposal } = await import("./coreHttpClient");
    await expect(promoteDeveloperProposal("P-1", {
      proposal_id: "dev-1", proposal_fingerprint: "b".repeat(64), human_review_id: "REV-1",
    })).rejects.toMatchObject({ status: 500, retryAfter: null });
  });
});
