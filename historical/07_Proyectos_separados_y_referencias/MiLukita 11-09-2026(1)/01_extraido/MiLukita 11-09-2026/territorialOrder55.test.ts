import { describe, expect, it } from "vitest";
import { appRouter } from "../server/routers";
import { canPublishWorldObject, canTransitionWorldObject, isRuntimeVisible, validateTerritorialGeo, validateWorldObjectConsistency } from "./territorialTrust";

describe("Order 55 World Engine backend contract", () => {
  it("exposes lifecycle, version, validation, publication and archive procedures", () => {
    const procedures = Object.keys((appRouter as any)._def.procedures);
    for (const name of [
      "territorial.getWorldObject",
      "territorial.create",
      "territorial.updateObject",
      "territorial.getVersion",
      "territorial.getPublishedVersion",
      "territorial.validateWorldObject",
      "territorial.archiveWorldObject",
      "territorial.invalidateWorldObject",
      "territorial.publishWorldObject",
      "territorial.getPublishedWorld",
      "territorial.runtimePublished",
    ]) expect(procedures).toContain(name);
  });

  it("validates coordinate ranges, precision, timestamps and optional bounds", () => {
    expect(validateTerritorialGeo({ latitude: "-8.111", longitude: "-79.021", accuracyMeters: 12, capturedAt: "2026-09-07T00:00:00.000Z", bounds: { minLatitude: -9, maxLatitude: -7, minLongitude: -80, maxLongitude: -78 } }).valid).toBe(true);
    expect(validateTerritorialGeo({ latitude: 91, longitude: -79, accuracyMeters: 12 }).errors).toContain("INVALID_LATITUDE");
    expect(validateTerritorialGeo({ latitude: -8, longitude: -181, accuracyMeters: -1 }).errors).toEqual(expect.arrayContaining(["INVALID_LONGITUDE", "INVALID_PRECISION"]));
    expect(validateTerritorialGeo({ latitude: -8, longitude: -79, accuracyMeters: 12, capturedAt: "not-a-date" }).errors).toContain("INVALID_TIMESTAMP");
    expect(validateTerritorialGeo({ latitude: -8, longitude: -79, accuracyMeters: 12, bounds: { minLatitude: -7, maxLatitude: -6, minLongitude: -80, maxLongitude: -78 } }).errors).toContain("OUTSIDE_TERRITORIAL_BOUNDS");
  });

  it("preserves the publication gate and runtime filtering", () => {
    expect(canTransitionWorldObject("CAPTURED", "UNDER_REVIEW")).toBe(true);
    expect(canTransitionWorldObject("VERIFIED", "OUTDATED")).toBe(true);
    expect(canTransitionWorldObject("ARCHIVED", "PUBLISHED")).toBe(false);
    expect(canPublishWorldObject("VERIFIED", 1, 1, 1)).toBe(true);
    expect(canPublishWorldObject("VERIFIED", 0, 1, 1)).toBe(false);
    expect(canPublishWorldObject("DISPUTED", 100, 1, 1)).toBe(false);
    expect(isRuntimeVisible("PUBLISHED")).toBe(true);
    expect(isRuntimeVisible("OUTDATED")).toBe(false);
  });

  it("detects version and GEO consistency errors without involving Spatial AR", () => {
    const valid = validateWorldObjectConsistency({ status: "CAPTURED", publicationStatus: "UNPUBLISHED", version: 2, publishedVersion: 1, latitude: -8, longitude: -79, accuracyMeters: 15, geometry: { type: "Point", coordinates: [-79, -8] } });
    expect(valid.valid).toBe(true);
    const invalid = validateWorldObjectConsistency({ status: "PUBLISHED", publicationStatus: "UNPUBLISHED", version: 1, publishedVersion: 2, latitude: -8, longitude: -79, accuracyMeters: 15, geometry: { type: "Point", coordinates: [-70, -8] } });
    expect(invalid.errors).toEqual(expect.arrayContaining(["PUBLISHED_STATUS_MISMATCH", "INVALID_PUBLISHED_VERSION", "GEOMETRY_COORDINATE_MISMATCH"]));
  });
});
