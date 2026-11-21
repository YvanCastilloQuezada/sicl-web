import { describe, expect, it } from "vitest";
import { deriveProjectConstraints } from "./deriveProjectConstraints";

describe("deriveProjectConstraints — evidence boundary", () => {
  it("does not invent hard zoning limits from jurisdiction and typology alone", () => {
    const result = deriveProjectConstraints({
      project: {
        projectId: "P-001",
        typology: "FAM-RESIDENTIAL",
        jurisdiction: "RNE-PE",
        location: "Peru",
      },
      context: {},
      facts: [],
    });

    expect(result.hard).toEqual([]);
    expect(result.normativeResults.length).toBeGreaterThan(0);
    expect(result.normativeResults.every((item) => item.status === "UNKNOWN")).toBe(true);
  });

  it("does not derive a CUS decision from program and site areas without a verified rule", () => {
    const result = deriveProjectConstraints({
      project: {
        projectId: "P-002",
        typology: "FAM-EDUCATION",
        jurisdiction: "RNE-PE",
      },
      context: {},
      facts: [],
    });

    expect(result.hard.some((item) => item.code === "PROGRAM_EXCEEDS_CUS")).toBe(false);
  });

  it("keeps solar and wind knowledge as soft constraints when context exists", () => {
    const result = deriveProjectConstraints({
      project: {
        projectId: "P-003",
        typology: "FAM-RESIDENTIAL",
      },
      context: {
        sunAzimuthDeg: 180,
        windDirection: "SE",
      },
      facts: [],
    });

    expect(result.soft.map((item) => item.code)).toContain("SUN_DIRECT_SOUTH_EXPOSURE");
    expect(result.soft.map((item) => item.code)).toContain("WIND_VENTILATION_CHECK");
  });
});
