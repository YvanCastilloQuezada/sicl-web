import { describe, expect, it } from "vitest";
import { GEO_RETENTION_DAYS, canPublishGeoScene, canWriteMjpCore, createGeoGovernance, isGeoRecordExpired, requestHumanReview } from "./lukitaGeoGovernance";

describe("Lukita geo governance", () => {
  it("creates an approximate, local-only record with bounded retention", () => {
    const now = 1_700_000_000_000;
    const record = createGeoGovernance("scene-1", now);
    expect(record.reviewState).toBe("LOCAL_DRAFT");
    expect(record.coordinatesPrecision).toBe("approximate");
    expect(record.expiresAt - record.createdAt).toBe(GEO_RETENTION_DAYS * 24 * 60 * 60 * 1000);
    expect(canPublishGeoScene(record)).toBe(false);
    expect(canWriteMjpCore(record)).toBe(false);
  });

  it("requires a distinct reviewer role", () => {
    const record = createGeoGovernance("scene-2", 1_700_000_000_000);
    expect(() => requestHumanReview(record, "operator")).toThrow("SEPARATION_OF_DUTIES_REQUIRED");
    expect(requestHumanReview(record, "admin").reviewState).toBe("HUMAN_REVIEW_REQUIRED");
  });

  it("detects expiry deterministically", () => {
    const now = 1_700_000_000_000;
    const record = createGeoGovernance("scene-3", now);
    expect(isGeoRecordExpired(record, now + 1)).toBe(false);
    expect(isGeoRecordExpired(record, record.expiresAt)).toBe(true);
  });
});
