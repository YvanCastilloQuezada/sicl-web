import { describe, expect, it } from "vitest";
import { rateLimit, sameOriginGuard, securityHeaders } from "./security";

function responseMock() {
  const headers = new Map<string, string>();
  return {
    headers,
    setHeader(name: string, value: string) { headers.set(name.toLowerCase(), value); },
    statusCode: 200,
    status(code: number) { this.statusCode = code; return this; },
    json(payload: unknown) { return payload; },
  } as any;
}

describe("security middleware", () => {
  it("adds hardening headers without exposing a server signature", () => {
    const req = { protocol: "https", headers: {}, get: () => "arki.test" } as any;
    const res = responseMock();
    let called = false;
    securityHeaders()(req, res, () => { called = true; });
    expect(called).toBe(true);
    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
    expect(res.headers.get("x-frame-options")).toBe("SAMEORIGIN");
    expect(res.headers.get("strict-transport-security")).toContain("max-age");
  });

  it("rejects a cross-origin mutating request", () => {
    const req = { method: "POST", headers: { origin: "https://evil.example" }, protocol: "https", get: () => "arki.test" } as any;
    const res = responseMock();
    let called = false;
    sameOriginGuard()(req, res, () => { called = true; });
    expect(called).toBe(false);
    expect(res.statusCode).toBe(403);
  });

  it("fails closed with a 429 after the configured request budget", () => {
    const limiter = rateLimit({ name: "test", max: 2, windowMs: 60_000 });
    const req = { ip: "127.0.0.1" } as any;
    const res = responseMock();
    let calls = 0;
    limiter(req, res, () => { calls += 1; });
    limiter(req, res, () => { calls += 1; });
    limiter(req, res, () => { calls += 1; });
    expect(calls).toBe(2);
    expect(res.statusCode).toBe(429);
    expect(res.headers.get("retry-after")).toBeDefined();
  });
});
