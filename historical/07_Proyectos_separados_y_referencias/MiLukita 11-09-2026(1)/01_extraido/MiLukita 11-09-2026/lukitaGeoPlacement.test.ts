import { describe, expect, it } from "vitest";
import { isGeoPlacementPresentationOnly, validateGeoDraft, type LukitaGeoDraft } from "./lukitaGeoPlacement";

const draft: LukitaGeoDraft = { name: "Plaza piloto", type: "AR_LUKITA", latitude: -12.0464, longitude: -77.0428, heightMeters: 1.65, scale: 1, orientationDegrees: 0, visibility: "PRIVATE" };

describe("lukita geo placement contract", () => {
  it("allows a valid private draft locally but never publishes", () => {
    const result = validateGeoDraft(draft);
    expect(result.canSaveLocalDraft).toBe(true);
    expect(result.canPublish).toBe(false);
    expect(result.reason).toBe("LOCAL_DRAFT_ONLY");
  });
  it("requires human review for public-intent drafts", () => {
    const result = validateGeoDraft({ ...draft, visibility: "PUBLIC_REVIEW" });
    expect(result.requiresReview).toBe(true);
    expect(result.canPublish).toBe(false);
    expect(result.reason).toBe("HUMAN_REVIEW_REQUIRED");
  });
  it("rejects missing or invalid location and dimensions", () => {
    expect(validateGeoDraft({ ...draft, latitude: null, longitude: null }).reason).toBe("LOCATION_REQUIRED");
    expect(validateGeoDraft({ ...draft, latitude: 120 }).reason).toBe("INVALID_COORDINATES");
    expect(validateGeoDraft({ ...draft, scale: 9 }).reason).toBe("INVALID_DIMENSIONS");
  });
  it("remains presentation-only", () => {
    expect(isGeoPlacementPresentationOnly()).toEqual({ readsLocation: true, storesLocally: true, publishesAutomatically: false, writesMjpCore: false, accessesWallet: false, accessesRng: false });
  });
});
