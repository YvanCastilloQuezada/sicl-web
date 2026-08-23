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
