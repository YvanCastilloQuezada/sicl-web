import { describe, expect, it } from "vitest";
import {
  LUKITA_POINT_PUBLICATION_CONTRACT,
  canActivateLukitaPointWithoutHumanApproval,
  canSubmitLukitaPointForReview,
} from "./lukitaPointPublication";

describe("LukitaPoint publication contract", () => {
  it("defaults to private review and keeps activation human-gated", () => {
    expect(LUKITA_POINT_PUBLICATION_CONTRACT.defaultPrivacy).toBe("PRIVATE");
    expect(LUKITA_POINT_PUBLICATION_CONTRACT.neverAutomatic).toBe(true);
    expect(canActivateLukitaPointWithoutHumanApproval()).toBe(false);
  });

  it("accepts only complete consented drafts for review", () => {
    expect(canSubmitLukitaPointForReview({ name: "Plaza Demo", privacy: "PRIVATE", status: "DRAFT", consent: true, assetVersion: "glb-candidate-01" })).toBe(true);
    expect(canSubmitLukitaPointForReview({ name: "", privacy: "PRIVATE", status: "DRAFT", consent: true, assetVersion: "glb-candidate-01" })).toBe(false);
    expect(canSubmitLukitaPointForReview({ name: "Plaza Demo", privacy: "PUBLIC", status: "APPROVED", consent: true, assetVersion: "glb-candidate-01" })).toBe(false);
    expect(canSubmitLukitaPointForReview({ name: "Plaza Demo", privacy: "PRIVATE", status: "DRAFT", consent: false, assetVersion: "glb-candidate-01" })).toBe(false);
  });
});
