import { describe, expect, it } from "vitest";
import { deriveArquiDiagnostics } from "./arquiDiagnostics";

describe("ARQUI P4 diagnostics", () => {
  it("surfaces pending review without inventing a requirement", () => {
    const result = deriveArquiDiagnostics({ pendingReview: 2, alternatives: 3, locationRegistered: true, hasAnalysis: false });
    expect(result[0].category).toBe("PENDING_REVIEW");
    expect(result[0].severity).toBe("REVIEW_REQUIRED");
  });
  it("blocks comparison only when the existing prerequisite is unmet", () => {
    const result = deriveArquiDiagnostics({ pendingReview: 0, alternatives: 1, locationRegistered: true, hasAnalysis: false });
    expect(result.some((item) => item.category === "BLOCKED")).toBe(true);
  });
  it("keeps missing registration as unknown, not invalid", () => {
    const result = deriveArquiDiagnostics({ pendingReview: 0, alternatives: 3, locationRegistered: false, hasAnalysis: false });
    expect(result.find((item) => item.id === "registration-unknown")?.category).toBe("UNKNOWN");
  });
});
