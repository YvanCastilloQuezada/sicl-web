
import { describe, expect, it } from "vitest";
import { sdk } from "./sdk";
import { ENV } from "./env";

describe("MO22 authentication isolation", () => {
  it("verifies a valid session for this application", async () => {
    const token = await sdk.signSession({
      openId: "mo22-test-user",
      appId: ENV.appId,
      name: "MO22 Test",
    });

    const session = await sdk.verifySession(token);
    expect(session?.appId).toBe(ENV.appId);
  });

  it("rejects a signed session for another application", async () => {
    const token = await sdk.signSession({
      openId: "mo22-test-user",
      appId: "MO22_FOREIGN_APPLICATION",
      name: "MO22 Test",
    });

    const req = {
      headers: {
        cookie: "",
        authorization: `Bearer ${token}`,
      },
    };

    await expect(
      sdk.authenticateRequest(req as any)
    ).rejects.toThrow(/Invalid session cookie or application/);
  });

  it("rejects a session with an invalid signature", async () => {
    const token = await sdk.signSession({
      openId: "mo22-test-user",
      appId: ENV.appId,
      name: "MO22 Test",
    });

    const session = await sdk.verifySession(token + "invalid");
    expect(session).toBeNull();
  });
});
