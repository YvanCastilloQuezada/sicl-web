import { describe, expect, it } from "vitest";
import { spatialArCatalog } from "./arkiSpatialAr";
import { emptySnapshot, parseSnapshot } from "./siclCore";

describe("ARKI access experience contracts", () => {
  it("exposes honest WebXR capability gates", () => {
    const catalog = spatialArCatalog();
    expect(catalog.version).toBe("ARKI-SPATIAL-AR-1.0");
    expect(catalog.capabilities).toContain("WORLD_TRACKING");
    expect(catalog.capabilities).toContain("SPATIAL_ANCHORING");
    expect(catalog.humanReviewRequired).toBe(true);
  });
  it("round-trips initial intake as project-state data", () => {
    const snapshot = emptySnapshot();
    snapshot.initialIntake = { intent: "Casa", location: "Trujillo", site: "Sí", dimensions: "10 × 20 m", occupants: "UNKNOWN", budget: "UNKNOWN", provenance: "USER_PROVIDED", epistemicStatus: "UNVERIFIED", capturedAt: new Date().toISOString() };
    const parsed = parseSnapshot(JSON.stringify(snapshot));
    expect(parsed.initialIntake?.intent).toBe("Casa");
    expect(parsed.initialIntake?.epistemicStatus).toBe("UNVERIFIED");
    expect(parsed.initialIntake?.provenance).toBe("USER_PROVIDED");
  });
});
