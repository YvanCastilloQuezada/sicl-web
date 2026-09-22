import { describe, expect, it } from "vitest";
import { buildArkiContextQrPayload, classifyArkiQrAction, isArkiContextQrExpired } from "../shared/arkiContextGate";

describe("ARKI A★ context gate", () => {
  it("builds an expiring experience QR without secrets or Core authority", () => {
    const now = new Date("2026-09-22T04:00:00.000Z");
    const payload = buildArkiContextQrPayload({ baseUrl: "https://arki.example", route: "/arki", kind: "EXPERIENCE_QR", now });
    expect(payload.url).toContain("qrKind=EXPERIENCE_QR");
    expect(payload.url).toContain("coreAccess=NONE");
    expect(payload.credentialsIncluded).toBe(false);
    expect(payload.revocable).toBe(true);
    expect(isArkiContextQrExpired(payload, new Date("2026-09-22T04:09:59.000Z"))).toBe(false);
    expect(isArkiContextQrExpired(payload, new Date("2026-09-22T04:10:00.000Z"))).toBe(true);
  });
  it("keeps Experience QR and Control QR as different actions", () => {
    expect(classifyArkiQrAction("EXPERIENCE_QR")).toBe("OPEN_EXPERIENCE");
    expect(classifyArkiQrAction("CONTROL_QR")).toBe("PREPARE_CONTROLLED_PAIRING");
  });
});
