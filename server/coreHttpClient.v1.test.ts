import { afterEach, describe, expect, it, vi } from "vitest";
import { appendCoreReasoningExecution, createCorePreference, fetchCanonicalHistory, fetchCanonicalSnapshot } from "./coreHttpClient";

describe("RFC-002 canonical v1 envelope", () => {
  afterEach(() => {
    delete process.env.SICL_CORE_URL;
    delete process.env.SICL_CORE_SERVICE_TOKEN;
    vi.unstubAllGlobals();
  });

  it("unwraps the canonical snapshot envelope without exposing the service token", async () => {
    process.env.SICL_CORE_URL = "https://core.example.test";
    process.env.SICL_CORE_SERVICE_TOKEN = "secret-token";
    const fetchSpy = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      contract_version: "1.0", status: "OK", code: "OK", message: "ok", project_id: "P-1", observed_version: 3,
      data: { snapshot: { project_id: "P-1", preferences: [] } },
    }), { status: 200 }));
    vi.stubGlobal("fetch", fetchSpy);
    await expect(fetchCanonicalSnapshot("P-1")).resolves.toMatchObject({ contract_version: "1.0", project_id: "P-1", observed_version: 3, snapshot: { project_id: "P-1" } });
    expect(JSON.stringify(fetchSpy.mock.calls)).toContain("authorization");
  });

  it("loads history from the canonical project-scoped endpoint", async () => {
    process.env.SICL_CORE_URL = "https://core.example.test";
    process.env.SICL_CORE_SERVICE_TOKEN = "service-token";
    const fetchSpy = vi.fn().mockResolvedValue(new Response(JSON.stringify({ contract_version: "1.0", status: "OK", code: "OK", message: "ok", project_id: "P-1", observed_version: 4, data: { events: [{ type: "PREFERENCE_RECORDED" }] } }), { status: 200 }));
    vi.stubGlobal("fetch", fetchSpy);
    await expect(fetchCanonicalHistory("P-1")).resolves.toMatchObject({ observed_version: 4, events: [{ type: "PREFERENCE_RECORDED" }] });
    expect(fetchSpy).toHaveBeenCalledWith("https://core.example.test/v1/projects/P-1/history", expect.anything());
  });

  it("maps the existing preference payload to the canonical write body", async () => {
    process.env.SICL_CORE_URL = "https://core.example.test";
    process.env.SICL_CORE_SERVICE_TOKEN = "service-token";
    const fetchSpy = vi.fn().mockResolvedValue(new Response(JSON.stringify({ contract_version: "1.0", status: "OK", code: "OK", message: "ok", project_id: "P-1", observed_version: 2, data: { preference: { statement: "low energy" } } }), { status: 200 }));
    vi.stubGlobal("fetch", fetchSpy);
    await createCorePreference("P-1", { name: "Energy", justification: "low energy" });
    expect(JSON.parse(fetchSpy.mock.calls[0][1].body as string)).toMatchObject({ name: "Energy", justification: "low energy", statement: "low energy" });
  });
  it("writes the strict snake_case reasoning execution contract and preserves observed_version", async () => {
    process.env.SICL_CORE_URL = "https://core.example.test";
    process.env.SICL_CORE_SERVICE_TOKEN = "service-token";
    const fetchSpy = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      contract_version: "1.0", status: "OK", code: "OK", message: "ok", project_id: "P-1", observed_version: 7,
      data: { status: "RECORDED", execution_id: "EX-1", event_id: 41 },
    }), { status: 200 }));
    vi.stubGlobal("fetch", fetchSpy);
    const request = {
      execution_id: "EX-1", kind: "PROJECT_BRAIN" as const, fingerprint: "a".repeat(64), input_fingerprint: "b".repeat(64),
      payload: { output: "bounded" }, epistemic_status: "HYPOTHESIS" as const, human_authority_ref: null,
      source_refs: ["SRC-1"], actor: "ARKI_PROJECT_BRAIN", created_at: "2026-09-29T12:00:00.000Z",
    };
    await expect(appendCoreReasoningExecution("P-1", request)).resolves.toMatchObject({
      status: "RECORDED", execution_id: "EX-1", event_id: 41, observed_version: 7,
    });
    const sent = JSON.parse(String((fetchSpy.mock.calls[0]?.[1] as RequestInit).body));
    expect(sent).toEqual(request);
    expect(sent).not.toHaveProperty("engine");
    expect(sent).not.toHaveProperty("expected_project_version");
  });
});
