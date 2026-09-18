import { describe, expect, it } from "vitest";
import { deriveArquiCapabilities } from "./arquiCapabilities";

describe("ARQUI P5 capability readiness", () => {
  it("scopes comparison readiness to its prerequisite", () => {
    expect(deriveArquiCapabilities({ alternatives: 1, photos: 0, pendingReview: 0, locationRegistered: false }).find((item) => item.id === "COMPARISON")?.status).toBe("BLOCKED");
    expect(deriveArquiCapabilities({ alternatives: 3, photos: 0, pendingReview: 0, locationRegistered: false }).find((item) => item.id === "COMPARISON")?.status).toBe("READY");
  });
  it("keeps visual proposals partial while human review is pending", () => {
    expect(deriveArquiCapabilities({ alternatives: 3, photos: 1, pendingReview: 2, locationRegistered: true }).find((item) => item.id === "VISUAL_FIELD_INTELLIGENCE")?.status).toBe("PARTIAL");
  });
  it("does not invent a registration requirement", () => {
    expect(deriveArquiCapabilities({ alternatives: 3, photos: 1, pendingReview: 0, locationRegistered: false }).find((item) => item.id === "REGISTERED_AR_VIEW")?.status).toBe("UNKNOWN");
  });
});
