import { describe, expect, it } from "vitest";
import {
  LUKITA_LIVE_ARCHITECTURE_CONTRACT,
  deriveLukitaBehavior,
  deriveLukitaScale,
  isLukitaLivePresentationOnly,
  isSafeLukitaPoint,
  type LukitaPoint,
} from "./lukitaLiveArchitecture";

const point: LukitaPoint = {
  pointId: "huanchaco-demo-01",
  name: "Lukita Huanchaco",
  location: { latitude: -8.082, longitude: -79.120 },
  orientation: { headingDegrees: 90 },
  spatialAnchor: "GPS_APPROXIMATE",
  scaleProfile: "LUKITA_LIVE_DEFAULT",
  activationRadiusM: 50,
  interactionRadiusM: 5,
  visibility: "REVIEW",
  experienceIds: ["lukita-live-demo"],
  assetVersion: "foundation-candidate-01",
  audioProfile: null,
  publicQrId: "experience-qr-demo",
  scheduleId: null,
  createdAt: "2026-08-28T00:00:00.000Z",
  updatedAt: "2026-08-28T00:00:00.000Z",
};

describe("Lukita Live architecture contract", () => {
  it("keeps the protagonist and protected core separated", () => {
    expect(LUKITA_LIVE_ARCHITECTURE_CONTRACT.protagonist).toBe("LUKITA");
    expect(LUKITA_LIVE_ARCHITECTURE_CONTRACT.authority.lukita).toBe("PRESENTATION_ONLY");
    expect(LUKITA_LIVE_ARCHITECTURE_CONTRACT.authority.mjpCore).toBe("AUTHORITATIVE_GAME_TRUTH");
    expect(LUKITA_LIVE_ARCHITECTURE_CONTRACT.irreversibleCapabilities).toContain("MJP_CORE_MUTATION");
    expect(isLukitaLivePresentationOnly()).toBe(true);
  });

  it("maps spatial distance to documented continuous scale bands", () => {
    expect(deriveLukitaScale(null).band).toBe("DISCOVERY");
    expect(deriveLukitaScale(2).targetHeightM).toBeCloseTo(1.88, 2);
    expect(deriveLukitaScale(10).targetHeightM).toBeGreaterThan(2);
    expect(deriveLukitaScale(20)).toMatchObject({ band: "BEACON", targetHeightM: 8 });
    expect(deriveLukitaScale(500).behaviorHint).toBe("DISCOVER");
  });

  it("derives contextual behavior without reading game truth", () => {
    expect(deriveLukitaBehavior({ distanceM: 3, orientation: "FACING", session: "ACTIVE", timeOfDay: "DAY", locationState: "AT_POINT", experience: "NONE", interaction: "LOOKING", presenceCount: 1 })).toBe("LUKITA_GREETING");
    expect(deriveLukitaBehavior({ distanceM: 3, orientation: "FACING", session: "ACTIVE", timeOfDay: "DAY", locationState: "AT_POINT", experience: "EVENT", interaction: "NONE", presenceCount: 1 })).toBe("LUKITA_DANCE");
    expect(deriveLukitaBehavior({ distanceM: 100, orientation: "UNKNOWN", session: "DISCOVERING", timeOfDay: "UNKNOWN", locationState: "OUTSIDE_RADIUS", experience: "NONE", interaction: "NONE", presenceCount: null })).toBe("LUKITA_DISCOVERY");
  });

  it("validates a LukitaPoint as a reviewable spatial entity", () => {
    expect(isSafeLukitaPoint(point)).toBe(true);
    expect(isSafeLukitaPoint({ ...point, location: { latitude: 95, longitude: -79.120 } })).toBe(false);
    expect(isSafeLukitaPoint({ ...point, interactionRadiusM: 80 })).toBe(false);
    expect(isSafeLukitaPoint({ ...point, assetVersion: "" })).toBe(false);
  });
});
