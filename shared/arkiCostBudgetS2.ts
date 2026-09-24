export const ARKI_COST_BUDGET_S2_VERSION = "ARKI-PREDICTIVE-ARCHITECTURE-001.S2" as const;

export type CostFidelity = "RAPID_16" | "DEEP_4" | "DEVELOPMENT_1";
export type EpistemicState = "ESTIMATE" | "BOUND" | "UNKNOWN" | "STALE" | "INVALIDATED" | "PROFESSIONAL_VALIDATION_REQUIRED";
export type PriceProvenance = "PROJECT_PROVIDED" | "HISTORICAL_PROJECT" | "DATABASE" | "MARKET_QUOTE" | "PUBLIC_REFERENCE" | "ASSUMED" | "DERIVED" | "UNKNOWN";
export type QuantityProvenance = "GEOMETRIC_QUANTITY" | "INFERRED_QUANTITY" | "ASSUMED_QUANTITY" | "MANUAL_QUANTITY" | "UNKNOWN_QUANTITY";
export type CostScenario = "BASE" | "LOW" | "HIGH";
export type CostGroup = "STRUCTURE" | "ENVELOPE" | "MEP" | "FINISHES" | "SITE_EXTERNAL" | "INDIRECT";
export type CostUnit = "m²" | "m³" | "m" | "kg" | "t" | "unit" | "hour";

export type QuantityRef = { id: string; candidateId: string; group: CostGroup; description: string; quantity: number; unit: CostUnit; provenance: QuantityProvenance; sourceRef: string; revision: number };
export type UnitPriceRef = { id: string; group: CostGroup; price: number; unit: string; currency: string; provenance: PriceProvenance; baseDate: string; location: string; sourceRef: string };
export type CostEstimate = {
  estimateId: string; projectId: string; candidateId: string; generationId: string; fidelityLevel: CostFidelity;
  currency: string; baseDate: string; location: string; estimateMethod: "PARAMETRIC_PROXY" | "COMPARATIVE_TAKEOFF" | "DEVELOPMENT_MODEL";
  quantityRefs: QuantityRef[]; unitPriceRefs: UnitPriceRef[]; assumptions: string[]; exclusions: string[]; unknowns: string[]; contingency: number;
  lowEstimate: number; centralEstimate: number; highEstimate: number; evidenceRefs: string[]; provenance: string[];
  epistemicState: EpistemicState; timestamp: string; scenario: CostScenario; staleReason?: string;
  groups: Partial<Record<CostGroup, number>>; costPerM2?: number; designRevision: number;
};
export type CostDelta = { previousEstimate: string; currentEstimate: string; absoluteDelta: number; percentageDelta: number | null; changedCostGroups: CostGroup[]; designChangeRefs: string[]; assumptionChangeRefs: string[]; priceChangeRefs: string[]; evidenceRefs: string[] };
export type CostCandidateInput = { projectId: string; candidateId: string; generationId: string; areaM2?: number; envelopeM2?: number; roofM2?: number; circulationM2?: number; structuralProxy?: number; facadeComplexity?: number; siteProxy?: number; mepProxy?: number; location?: string; currency?: string; baseDate?: string; designRevision?: number; scenario?: CostScenario; materialAssumptions?: string[] };

const GROUPS: CostGroup[] = ["STRUCTURE", "ENVELOPE", "MEP", "FINISHES", "SITE_EXTERNAL", "INDIRECT"];
const BASE_PRICES: Record<CostGroup, number> = { STRUCTURE: 720, ENVELOPE: 410, MEP: 360, FINISHES: 290, SITE_EXTERNAL: 150, INDIRECT: 120 };
const SCENARIO_FACTOR: Record<CostScenario, number> = { LOW: 0.88, BASE: 1, HIGH: 1.18 };
const iso = () => new Date().toISOString();
const id = (prefix: string, candidateId: string) => `${prefix}-${candidateId}-${Date.now().toString(36)}`;

function finitePositive(name: string, value: number | undefined, required = false): number | undefined {
  if (value === undefined) { if (required) throw new Error(`${name}_REQUIRED`); return undefined; }
  if (!Number.isFinite(value) || value < 0) throw new Error(`INVALID_${name.toUpperCase()}`);
  return value;
}
function assertContext(input: CostCandidateInput) {
  if (!input.projectId.trim()) throw new Error("PROJECT_ID_REQUIRED");
  if (!input.candidateId.trim()) throw new Error("CANDIDATE_ID_REQUIRED");
  if (!input.generationId.trim()) throw new Error("GENERATION_ID_REQUIRED");
  if (!input.currency?.trim()) throw new Error("CURRENCY_REQUIRED");
  if (!input.baseDate?.trim()) throw new Error("BASE_DATE_REQUIRED");
  if (!input.location?.trim()) throw new Error("LOCATION_REQUIRED");
  if (!/^[A-Z]{3}$/.test(input.currency)) throw new Error("CURRENCY_CODE_INVALID");
}
function round(value: number) { return Math.round(value * 100) / 100; }

export function costBudgetS2Contract() {
  return { version: ARKI_COST_BUDGET_S2_VERSION, doctrine: ["COST_NOT_VALUE", "ESTIMATE_NOT_BUDGET", "UNKNOWN_NOT_ZERO", "CHEAPEST_NOT_WINNER"], fidelity: { explorer16: "RAPID_16", finalist4: "DEEP_4", selected1: "DEVELOPMENT_1" }, acceptedUnits: ["m²", "m³", "m", "kg", "t", "unit", "hour"], priceProvenance: ["PROJECT_PROVIDED", "HISTORICAL_PROJECT", "DATABASE", "MARKET_QUOTE", "PUBLIC_REFERENCE", "ASSUMED", "DERIVED", "UNKNOWN"], quantityProvenance: ["GEOMETRIC_QUANTITY", "INFERRED_QUANTITY", "ASSUMED_QUANTITY", "MANUAL_QUANTITY", "UNKNOWN_QUANTITY"], humanAuthorityFinal: true, profitabilitySeparate: true, lifecycleCostSeparate: true } as const;
}

export function estimateCandidateCost(input: CostCandidateInput, fidelity: CostFidelity): CostEstimate {
  assertContext(input);
  const area = finitePositive("areaM2", input.areaM2, true)!;
  const envelope = finitePositive("envelopeM2", input.envelopeM2) ?? round(area * 1.45);
  const roof = finitePositive("roofM2", input.roofM2) ?? round(area * 0.28);
  const circulation = finitePositive("circulationM2", input.circulationM2) ?? round(area * 0.16);
  const scenario = input.scenario ?? "BASE";
  const revision = input.designRevision ?? 1;
  const structuralProxy = finitePositive("structuralProxy", input.structuralProxy) ?? area * 0.12;
  const facadeComplexity = finitePositive("facadeComplexity", input.facadeComplexity) ?? envelope * 0.08;
  const siteProxy = finitePositive("siteProxy", input.siteProxy) ?? area * 0.05;
  const mepProxy = finitePositive("mepProxy", input.mepProxy) ?? area * 0.18;
  const unknowns: string[] = [];
  const assumptions: string[] = ["Unit prices are bounded conceptual references, not market quotations.", "Indirect cost is a proxy and excludes land and financing."];
  const exclusions = ["LAND", "FINANCING", "PROFITABILITY", "FINAL_CONSTRUCTION_PRICE", "PROFESSIONAL_SIGNOFF"];
  if (input.envelopeM2 === undefined) unknowns.push("ENVELOPE_QUANTITY_INFERRED");
  if (input.mepProxy === undefined) unknowns.push("MEP_PROXY_NOT_VERIFIED");
  if (input.location === "UNKNOWN") unknowns.push("LOCATION_UNKNOWN");
  const factor = SCENARIO_FACTOR[scenario];
  const source = "COST-REFERENCE-ASSUMED-S2";
  const quantityRefs: QuantityRef[] = [
    { id: `Q-${input.candidateId}-AREA`, candidateId: input.candidateId, group: "STRUCTURE", description: "Built area structural proxy", quantity: area, unit: "m²", provenance: "GEOMETRIC_QUANTITY", sourceRef: "candidate.metrics.area", revision },
    { id: `Q-${input.candidateId}-ENV`, candidateId: input.candidateId, group: "ENVELOPE", description: "Envelope proxy", quantity: envelope, unit: "m²", provenance: input.envelopeM2 === undefined ? "INFERRED_QUANTITY" : "GEOMETRIC_QUANTITY", sourceRef: "candidate.metrics.envelope", revision },
    { id: `Q-${input.candidateId}-MEP`, candidateId: input.candidateId, group: "MEP", description: "MEP proxy", quantity: mepProxy, unit: "m²", provenance: input.mepProxy === undefined ? "ASSUMED_QUANTITY" : "INFERRED_QUANTITY", sourceRef: "candidate.metrics.mep", revision },
  ];
  const unitPriceRefs: UnitPriceRef[] = GROUPS.map((group) => ({ id: `P-${group}-S2`, group, price: round(BASE_PRICES[group] * factor), unit: "S//m²", currency: input.currency!, provenance: "ASSUMED", baseDate: input.baseDate!, location: input.location!, sourceRef: source }));
  const rawGroups: Record<CostGroup, number> = { STRUCTURE: structuralProxy * BASE_PRICES.STRUCTURE, ENVELOPE: facadeComplexity * BASE_PRICES.ENVELOPE, MEP: mepProxy * BASE_PRICES.MEP, FINISHES: area * BASE_PRICES.FINISHES, SITE_EXTERNAL: siteProxy * BASE_PRICES.SITE_EXTERNAL, INDIRECT: (area + circulation) * BASE_PRICES.INDIRECT };
  const groups = Object.fromEntries(GROUPS.map((group) => [group, round(rawGroups[group] * factor)])) as Partial<Record<CostGroup, number>>;
  const central = round(Object.values(groups).reduce((sum, value) => sum + (value ?? 0), 0));
  const spread = fidelity === "RAPID_16" ? 0.18 : fidelity === "DEEP_4" ? 0.12 : 0.08;
  if (fidelity === "DEVELOPMENT_1") assumptions.push("Development model remains subject to professional quantity and price validation.");
  const epistemicState: EpistemicState = fidelity === "DEVELOPMENT_1" ? "PROFESSIONAL_VALIDATION_REQUIRED" : "BOUND";
  return { estimateId: id("EST", input.candidateId), projectId: input.projectId, candidateId: input.candidateId, generationId: input.generationId, fidelityLevel: fidelity, currency: input.currency!, baseDate: input.baseDate!, location: input.location!, estimateMethod: fidelity === "RAPID_16" ? "PARAMETRIC_PROXY" : fidelity === "DEEP_4" ? "COMPARATIVE_TAKEOFF" : "DEVELOPMENT_MODEL", quantityRefs, unitPriceRefs, assumptions, exclusions, unknowns: Array.from(new Set(unknowns)), contingency: spread, lowEstimate: round(central * (1 - spread)), centralEstimate: central, highEstimate: round(central * (1 + spread)), evidenceRefs: [source, `GEOMETRY:${input.candidateId}:R${revision}`], provenance: [source, "DESIGN_CANDIDATE_METRICS"], epistemicState, timestamp: iso(), scenario, groups, costPerM2: round(central / area), designRevision: revision };
}

export function compareCostEstimates(estimates: CostEstimate[]) {
  if (estimates.length < 2) throw new Error("COST_COMPARISON_REQUIRES_TWO_ESTIMATES");
  const first = estimates[0];
  const mismatch = estimates.some((item) => item.currency !== first.currency || item.baseDate !== first.baseDate || item.location !== first.location || item.scenario !== first.scenario || item.fidelityLevel !== first.fidelityLevel);
  return { comparable: !mismatch, status: mismatch ? "NOT_DIRECTLY_COMPARABLE" as const : "DIRECTLY_COMPARABLE" as const, estimates: estimates.map((estimate) => ({ candidateId: estimate.candidateId, total: estimate.centralEstimate, range: [estimate.lowEstimate, estimate.highEstimate], costPerM2: estimate.costPerM2, groups: estimate.groups, unknowns: estimate.unknowns, epistemicState: estimate.epistemicState })), unknowns: Array.from(new Set(estimates.flatMap((item) => item.unknowns))) };
}

export function markCostStale(estimate: CostEstimate, reason: string): CostEstimate { if (!reason.trim()) throw new Error("STALE_REASON_REQUIRED"); return { ...estimate, epistemicState: "STALE", staleReason: reason, timestamp: iso() }; }
export function recalculateCost(estimate: CostEstimate, input: CostCandidateInput, fidelity = estimate.fidelityLevel): { estimate: CostEstimate; delta: CostDelta } {
  const next = estimateCandidateCost({ ...input, designRevision: Math.max((input.designRevision ?? estimate.designRevision + 1), estimate.designRevision + 1) }, fidelity);
  const changedCostGroups = GROUPS.filter((group) => (estimate.groups[group] ?? 0) !== (next.groups[group] ?? 0));
  return { estimate: next, delta: { previousEstimate: estimate.estimateId, currentEstimate: next.estimateId, absoluteDelta: round(next.centralEstimate - estimate.centralEstimate), percentageDelta: estimate.centralEstimate === 0 ? null : round(((next.centralEstimate - estimate.centralEstimate) / estimate.centralEstimate) * 100), changedCostGroups, designChangeRefs: [`GEOMETRY_REVISION:${next.designRevision}`], assumptionChangeRefs: [], priceChangeRefs: [], evidenceRefs: [...next.evidenceRefs, estimate.estimateId] } };
}

export function validateCostInput(input: CostCandidateInput) {
  assertContext(input);
  const numeric = [input.areaM2, input.envelopeM2, input.roofM2, input.circulationM2, input.structuralProxy, input.facadeComplexity, input.siteProxy, input.mepProxy].filter((value): value is number => value !== undefined);
  if (numeric.some((value) => !Number.isFinite(value))) throw new Error("NON_FINITE_COST_INPUT");
  return { valid: true as const, units: "EXPLICIT", unknownNotZero: true as const, candidateAware: true as const, projectAware: true as const };
}
