import { afterEach, describe, expect, it, vi } from "vitest";
import { SiclCoreHttpError, checkCoreHealth, classifyCoreError, proxyCoreRequest } from "./coreHttpClient";

afterEach(() => {
  delete process.env.SICL_CORE_URL;
  delete process.env.SICL_CORE_SERVICE_TOKEN;
  vi.restoreAllMocks();
});

describe("RFC-024 operational completion", () => {
  it("classifies missing configuration and authentication separately", () => {
    expect(classifyCoreError(new Error("SICL_CORE_URL is required"))).toBe("CORE_UNAVAILABLE");
    expect(classifyCoreError(new Error("SICL_CORE_SERVICE_TOKEN is required"))).toBe("CORE_UNAUTHORIZED");
  });

  it("classifies upstream authorization and HTTP failures", () => {
    expect(classifyCoreError(new SiclCoreHttpError(401, "UNAUTHORIZED"))).toBe("CORE_UNAUTHORIZED");
    expect(classifyCoreError(new SiclCoreHttpError(503, "SERVICE_UNAVAILABLE"))).toBe("CORE_HTTP_ERROR");
  });

  it("performs the read-only health check with server-side authorization", async () => {
    process.env.SICL_CORE_URL = "https://core.example.test";
    process.env.SICL_CORE_SERVICE_TOKEN = "service-token-test";
    const fetchSpy = vi.fn().mockResolvedValue(new Response(JSON.stringify({ contract_version: "1.0", status: "OK", observed_version: 11, data: { scales: [] } }), { status: 200 }));
    vi.stubGlobal("fetch", fetchSpy);

    await expect(checkCoreHealth()).resolves.toMatchObject({ status: "ok", contract_version: "1.0", observed_version: 11 });
    expect(fetchSpy).toHaveBeenCalledWith("https://core.example.test/v1/scales", { method: "GET", headers: { accept: "application/json", authorization: "Bearer service-token-test" } });
    expect(JSON.stringify(fetchSpy.mock.calls)).not.toContain("CORE_UNAVAILABLE");
  });

  it("adds a bounded timeout to proxy requests", async () => {
    process.env.SICL_CORE_URL = "https://core.example.test";
    process.env.SICL_CORE_SERVICE_TOKEN = "service-token-test";
    const fetchSpy = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchSpy);

    await proxyCoreRequest("/v1/scales", { method: "GET" });
    const request = fetchSpy.mock.calls[0]?.[1] as RequestInit;
    expect(request.signal).toBeInstanceOf(AbortSignal);
    expect(request.headers).toMatchObject({ authorization: "Bearer service-token-test" });
  });
});
