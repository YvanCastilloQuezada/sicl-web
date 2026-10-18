import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function context(): TrpcContext {
  return {
    user: {
      id: 77,
      openId: "share-test-user",
      email: "share@example.com",
      name: "Share Test",
      loginMethod: "test",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("share router backend contract", () => {
  it("rejects protected API destinations before database access", async () => {
    const caller = appRouter.createCaller(context());
    await expect(caller.share.createTarget({
      targetType: "PUBLIC_LUKA",
      destinationPath: "/api/trpc/share.resolve",
      capability: "PUBLIC_EXPERIENCE",
      metadata: {},
    })).rejects.toThrow();
  });

  it("rejects MJP/core markers before persistence", async () => {
    const caller = appRouter.createCaller(context());
    await expect(caller.share.createTarget({
      targetType: "CONTENT",
      destinationPath: "/mjp-core/runtime",
      capability: "PUBLIC_EXPERIENCE",
    })).rejects.toThrow(/protegida/);
  });

  it("rejects session TTL outside the public API contract", async () => {
    const caller = appRouter.createCaller(context());
    await expect(caller.share.createSession({
      sharePublicId: "SHARE-AAAAAAAAAAAAAAAAAAAA",
      expiresInSeconds: 86_401,
      origin: "https://example.com",
    })).rejects.toThrow();
  });

  it("rejects malformed public resolution identifiers", async () => {
    const caller = appRouter.createCaller(context());
    await expect(caller.share.resolve({ publicId: "MJP-INVALID" })).rejects.toThrow();
  });
});
