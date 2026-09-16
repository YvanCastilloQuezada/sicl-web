import { afterEach, describe, expect, it, vi } from "vitest";
import { createCorePreference, fetchCanonicalHistory, fetchCanonicalSnapshot } from "./coreHttpClient";

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
});
