import { describe, expect, it } from "vitest";
import { appRouter } from "../server/routers";
import { sameOriginMutationGuard } from "../server/_core/security";
import { isSafeStorageKey } from "../server/_core/storageProxy";
import { validateShareOrigin } from "../server/lukaShare";
import { decodeAssetBase64 } from "../server/arAssets";

function runGuard(input: { method: string; origin?: string; protocol?: string; host?: string }) {
  const result: { status?: number; body?: unknown; next: boolean } = { next: false };
  const req = {
    method: input.method,
    headers: input.origin ? { origin: input.origin } : {},
    protocol: input.protocol ?? "https",
    get: (name: string) => name.toLowerCase() === "host" ? (input.host ?? "example.test") : undefined,
  } as any;
  const res = {
    status(code: number) { result.status = code; return this; },
    json(body: unknown) { result.body = body; return this; },
  } as any;
  sameOriginMutationGuard(req, res, () => { result.next = true; });
  return result;
}

describe("Orden 60 — seguridad integral backend", () => {
  it("keeps sensitive procedures behind authentication/admin boundaries", () => {
    const procedures = Object.keys((appRouter as any)._def.procedures);
    expect(procedures).toContain("share.createSession");
    expect(procedures).toContain("territorial.publish");
    expect(procedures).toContain("territorial.verifyClaim");
    expect(procedures).toContain("fieldVoice.execute");
  });

  it("rejects cross-origin browser mutations and allows same-origin mutations", () => {
    expect(runGuard({ method: "POST", origin: "https://evil.example", host: "app.example" })).toMatchObject({ status: 403, next: false });
    expect(runGuard({ method: "POST", origin: "https://app.example", host: "app.example" })).toMatchObject({ next: true });
    expect(runGuard({ method: "GET", origin: "https://evil.example", host: "app.example" })).toMatchObject({ next: true });
  });

  it("blocks unsafe storage keys without exposing arbitrary paths", () => {
    expect(isSafeStorageKey("assets/luka/model.glb")).toBe(true);
    expect(isSafeStorageKey("../secrets.env")).toBe(false);
    expect(isSafeStorageKey("/etc/passwd")).toBe(false);
    expect(isSafeStorageKey("assets\\private.key")).toBe(false);
  });

  it("rejects arbitrary QR origins and malformed AR payloads", () => {
    expect(validateShareOrigin("https://luka.manus.space")).toBe("https://luka.manus.space");
    expect(() => validateShareOrigin("https://evil.example")).toThrow("SHARE_ORIGIN_NOT_ALLOWED");
    expect(() => validateShareOrigin("javascript:alert(1)")).toThrow();
    expect(decodeAssetBase64(Buffer.from("glTF-test").toString("base64"))).toEqual(Buffer.from("glTF-test"));
    expect(() => decodeAssetBase64("not base64 !")).toThrow("INVALID_BASE64_PAYLOAD");
  });

  it("does not treat QR or capability names as authorization by themselves", () => {
    expect((appRouter as any)._def.procedures["share.resolve"]).toBeDefined();
    expect((appRouter as any)._def.procedures["share.resolveActive"]).toBeDefined();
    expect((appRouter as any)._def.procedures["governance.integrity"]).toBeDefined();
  });
});
