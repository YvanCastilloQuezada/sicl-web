import { describe, expect, it } from "vitest";
import { compareCostEstimates, costBudgetS2Contract, estimateCandidateCost, markCostStale, recalculateCost, validateCostInput, type CostCandidateInput } from "../shared/arkiCostBudgetS2";

const base: CostCandidateInput = { projectId: "P-S2", candidateId: "A01", generationId: "GEN-007", areaM2: 12000, location: "Trujillo", currency: "PEN", baseDate: "2026-09-24", designRevision: 1, scenario: "BASE" };

describe("ARKI S2 cost and budget intelligence", () => {
  it("exposes the governed contract and doctrine", () => {
    const contract = costBudgetS2Contract();
    expect(contract.version).toContain("S2");
    expect(contract.doctrine).toContain("UNKNOWN_NOT_ZERO");
    expect(contract.fidelity.selected1).toBe("DEVELOPMENT_1");
    expect(contract.humanAuthorityFinal).toBe(true);
  });
  it("rejects missing context instead of inventing it", () => {
    expect(() => estimateCandidateCost({ ...base, location: "" }, "RAPID_16")).toThrow("LOCATION_REQUIRED");
    expect(() => estimateCandidateCost({ ...base, currency: "USDOLLAR" }, "RAPID_16")).toThrow("CURRENCY_CODE_INVALID");
    expect(() => estimateCandidateCost({ ...base, areaM2: undefined }, "RAPID_16")).toThrow("areaM2_REQUIRED");
  });
  it("produces bounded rapid estimates with explicit proxies and unknowns", () => {
    const estimate = estimateCandidateCost(base, "RAPID_16");
    expect(estimate.lowEstimate).toBeLessThan(estimate.centralEstimate);
    expect(estimate.centralEstimate).toBeLessThan(estimate.highEstimate);
    expect(estimate.unknowns).toContain("ENVELOPE_QUANTITY_INFERRED");
    expect(estimate.exclusions).toContain("PROFITABILITY");
    expect(estimate.epistemicState).toBe("BOUND");
  });
  it("propagates candidate geometry into cost groups", () => {
    const a = estimateCandidateCost(base, "RAPID_16");
    const b = estimateCandidateCost({ ...base, candidateId: "A02", areaM2: 16000, envelopeM2: 28000, mepProxy: 4000 }, "RAPID_16");
    expect(b.centralEstimate).toBeGreaterThan(a.centralEstimate);
    expect(b.groups.MEP).toBeGreaterThan(a.groups.MEP!);
  });
  it("uses progressive fidelity without claiming final budget", () => {
    const rapid = estimateCandidateCost(base, "RAPID_16");
    const deep = estimateCandidateCost({ ...base, envelopeM2: 18000, mepProxy: 2400 }, "DEEP_4");
    const dev = estimateCandidateCost({ ...base, envelopeM2: 18000, mepProxy: 2400, structuralProxy: 1700, designRevision: 3 }, "DEVELOPMENT_1");
    expect(rapid.estimateMethod).toBe("PARAMETRIC_PROXY");
    expect(deep.estimateMethod).toBe("COMPARATIVE_TAKEOFF");
    expect(dev.estimateMethod).toBe("DEVELOPMENT_MODEL");
    expect(dev.epistemicState).toBe("PROFESSIONAL_VALIDATION_REQUIRED");
    expect(dev.exclusions).toContain("FINAL_CONSTRUCTION_PRICE");
  });
  it("keeps low, base and high scenarios explicit", () => {
    const low = estimateCandidateCost({ ...base, scenario: "LOW" }, "RAPID_16");
    const high = estimateCandidateCost({ ...base, scenario: "HIGH" }, "RAPID_16");
    expect(low.scenario).toBe("LOW");
    expect(high.centralEstimate).toBeGreaterThan(low.centralEstimate);
  });
  it("marks stale estimates and requires a reason", () => {
    const estimate = estimateCandidateCost(base, "DEEP_4");
    expect(() => markCostStale(estimate, "")).toThrow("STALE_REASON_REQUIRED");
    const stale = markCostStale(estimate, "Geometry revision changed");
    expect(stale.epistemicState).toBe("STALE");
    expect(stale.staleReason).toBe("Geometry revision changed");
  });
  it("recalculates and emits an auditable delta", () => {
    const estimate = estimateCandidateCost(base, "DEEP_4");
    const { estimate: next, delta } = recalculateCost(estimate, { ...base, areaM2: 15000, candidateId: "A01" });
    expect(next.designRevision).toBeGreaterThan(estimate.designRevision);
    expect(delta.previousEstimate).toBe(estimate.estimateId);
    expect(delta.absoluteDelta).not.toBe(0);
    expect(delta.designChangeRefs.length).toBeGreaterThan(0);
  });
  it("rejects incomparable currency/date/location/fidelity silently", () => {
    const a = estimateCandidateCost(base, "RAPID_16");
    const b = estimateCandidateCost({ ...base, candidateId: "A02", currency: "USD" }, "RAPID_16");
    const comparison = compareCostEstimates([a, b]);
    expect(comparison.comparable).toBe(false);
    expect(comparison.status).toBe("NOT_DIRECTLY_COMPARABLE");
  });
  it("compares same-basis candidates and preserves unknowns", () => {
    const a = estimateCandidateCost(base, "DEEP_4");
    const b = estimateCandidateCost({ ...base, candidateId: "A02", areaM2: 12500 }, "DEEP_4");
    const comparison = compareCostEstimates([a, b]);
    expect(comparison.comparable).toBe(true);
    expect(comparison.estimates).toHaveLength(2);
    expect(comparison.unknowns).toContain("ENVELOPE_QUANTITY_INFERRED");
  });
  it("validates finite inputs and never treats NaN as zero", () => {
    expect(() => validateCostInput({ ...base, areaM2: Number.NaN })).toThrow("NON_FINITE_COST_INPUT");
    expect(validateCostInput(base).unknownNotZero).toBe(true);
  });
  it("rejects negative geometry and negative prices cannot enter through proxies", () => {
    expect(() => estimateCandidateCost({ ...base, facadeComplexity: -1 }, "RAPID_16")).toThrow("INVALID_FACADECOMPLEXITY");
    expect(() => estimateCandidateCost({ ...base, areaM2: -10 }, "RAPID_16")).toThrow("INVALID_AREAM2");
  });
  it("does not encode profitability as construction cost", () => {
    const estimate = estimateCandidateCost(base, "DEVELOPMENT_1");
    expect(estimate.exclusions).toContain("PROFITABILITY");
    expect(estimate.groups.INDIRECT).toBeDefined();
  });
});

// Mutation guards: these assertions intentionally fail if a future mutant removes a gate,
// turns UNKNOWN into zero, or makes the cheapest candidate an automatic winner.
describe("S2 mutation guards", () => {
  it("guards against removing candidate identity and project identity", () => {
    expect(() => estimateCandidateCost({ ...base, candidateId: "" }, "RAPID_16")).toThrow("CANDIDATE_ID_REQUIRED");
    expect(() => estimateCandidateCost({ ...base, projectId: "" }, "RAPID_16")).toThrow("PROJECT_ID_REQUIRED");
  });
  it("guards against replacing a missing evidence context with a fake default", () => {
    const estimate = estimateCandidateCost(base, "RAPID_16");
    expect(estimate.provenance).toContain("COST-REFERENCE-ASSUMED-S2");
    expect(estimate.unknowns.length).toBeGreaterThan(0);
  });
  it("guards against automatic winner selection", () => {
    const result = compareCostEstimates([estimateCandidateCost(base, "RAPID_16"), estimateCandidateCost({ ...base, candidateId: "A02", areaM2: 9000 }, "RAPID_16")]);
    expect(result).not.toHaveProperty("winner");
    expect(result).not.toHaveProperty("selectedCandidateId");
  });
});
