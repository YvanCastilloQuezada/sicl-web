import { describe, expect, it } from "vitest";
import { traceCandidateMetrics } from "../../../shared/arkiMetrics";

describe("ARKI traced metrics", () => {
  it("preserves zero as a valid calculated value", () => {
    const result = traceCandidateMetrics({
      footprintM2: 0,
    }, "fixture.metrics");

    expect(result.footprintM2.value).toBe(0);
    expect(result.footprintM2.method).toBe("CALCULATED");
    expect(result.footprintM2.evidenceLevel).toBe("CONCEPTUAL");
  });

  it("marks absent and non-finite values unavailable, never as zero", () => {
    const result = traceCandidateMetrics({
      builtAreaM2: Number.NaN,
    }, "fixture.metrics");

    expect(result.builtAreaM2.value).toBeNull();
    expect(result.builtAreaM2.method).toBe("UNAVAILABLE");
    expect(result.builtAreaM2.evidenceLevel).toBe("NONE");
    expect(result.capacity.value).toBeNull();
    expect(result.capacity.method).toBe("UNAVAILABLE");
  });

  it("preserves proxy values while declaring their limitations", () => {
    const result = traceCandidateMetrics({
      complianceScore: 1,
      energyUseIntensity: 0,
    }, "fixture.building.metrics");

    expect(result.complianceScore.value).toBe(1);
    expect(result.complianceScore.method).toBe("PROXY");
    expect(result.complianceScore.evidenceLevel).toBe("CONCEPTUAL");
    expect(result.complianceScore.limitations.length).toBeGreaterThan(0);

    expect(result.energyUseIntensity.value).toBe(0);
    expect(result.energyUseIntensity.method).toBe("PROXY");
    expect(result.energyUseIntensity.unit).toBe("UNVERIFIED_UNIT");
  });

  it("records the actual metric path as provenance", () => {
    const result = traceCandidateMetrics({
      capacity: 250,
    }, "generatedBuilding.metrics");

    expect(result.capacity.provenance).toBe(
      "generatedBuilding.metrics.capacity",
    );
    expect(result.capacity.value).toBe(250);
  });

  it("does not label conceptual cost as verified", () => {
    const result = traceCandidateMetrics({
      estimatedCostUsdConceptual: 125000,
    });

    expect(result.estimatedCostUsdConceptual.method).toBe("PROXY");
    expect(result.estimatedCostUsdConceptual.evidenceLevel).toBe("CONCEPTUAL");
  });
});
