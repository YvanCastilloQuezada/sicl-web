import { describe, expect, it } from "vitest";
import { normativeContract, RNE_PERU_REFERENCE_RULES, validateAgainstRne } from "../shared/arkiNormativeEngine";
import { ARKI_EXECUTION_BOUNDARIES, authorizeExecutionBoundary } from "../shared/arkiExecutionGovernance";

describe("ARKI improvements 2", () => {
  it("loads the RNE reference seed with traceable legal references", () => {
    expect(RNE_PERU_REFERENCE_RULES.length).toBeGreaterThanOrEqual(50);
    expect(RNE_PERU_REFERENCE_RULES.every((rule) => rule.id.startsWith("RNE-") && rule.legalReference.length > 0)).toBe(true);
    expect(normativeContract().humanReviewRequired).toBe(true);
  });

  it("distinguishes pass, fail and unknown instead of assuming compliance", () => {
    const result = validateAgainstRne({
      typology: "Estadio",
      facts: [
        { variable: "altura_libre_estadio_m", value: 20 },
        { variable: "tiempo_evacuacion_min", value: 18 },
      ],
    });
    expect(result.pass).toBeGreaterThan(0);
    expect(result.fail).toBeGreaterThan(0);
    expect(result.unknown).toBeGreaterThan(0);
    expect(result.canonicalPromotion).toBe("NOT_REQUESTED");
  });

  it("keeps sandbox and marketplace fail-closed", () => {
    expect(ARKI_EXECUTION_BOUNDARIES.sandbox.enabled).toBe(false);
    expect(ARKI_EXECUTION_BOUNDARIES.marketplace.enabled).toBe(false);
    expect(authorizeExecutionBoundary("SANDBOX_STAGING").allowed).toBe(false);
    expect(authorizeExecutionBoundary("MARKETPLACE_FROZEN", true).allowed).toBe(false);
  });
});
