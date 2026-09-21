export type CostEvidenceType = "OBSERVED_PRICE" | "INPUT_UNIT_PRICE" | "APU" | "QUOTATION" | "QUANTITY_TAKEOFF" | "BUDGET" | "IUPC_REFERENCE" | "DERIVED_CALCULATION";
export type CostConfidence = "VERIFIED" | "PARTIALLY_VERIFIED" | "DECLARED" | "ESTIMATE" | "UNKNOWN";
export type TaxStatus = "INCLUDED" | "EXCLUDED" | "NOT_APPLICABLE" | "UNKNOWN";

export type CostEvidence = {
  id: string;
  type: CostEvidenceType;
  code?: string;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  confidence: CostConfidence;
  observedAt?: string;
  baseDate?: string;
  validityUntil?: string;
  region?: string;
  supplier?: string;
  sourceUrl?: string;
  sourceDocument?: string;
  sourcePage?: string;
  taxStatus: TaxStatus;
  taxRate?: number;
  freight?: number;
  installation?: number;
  notes?: string;
};

export type CostModelInput = {
  projectId: string;
  currency: string;
  lines: CostEvidence[];
  overheadRate?: number;
  profitRate?: number;
  taxRate?: number;
  horizonYears?: number;
};

export type CostModelResult = {
  schema: "ARKI-COST-MODEL-1.0";
  projectId: string;
  currency: string;
  directCost: number;
  overhead: number;
  profit: number;
  tax: number;
  total: number;
  lifecycleCost?: number;
  lineCount: number;
  evidenceByType: Record<CostEvidenceType, number>;
  unknowns: string[];
  warnings: string[];
  marketResearch: {
    sourcePolicy: "OFFICIAL_OR_DOCUMENTED_MARKET_SOURCE";
    automaticInternetPurchase: false;
    humanReviewRequired: true;
    priceAdoptionStatus: "CANDIDATES_ONLY" | "READY_FOR_HUMAN_REVIEW";
  };
  status: "DRAFT" | "READY_FOR_HUMAN_REVIEW";
  humanReviewRequired: true;
};

const COST_TYPES: CostEvidenceType[] = ["OBSERVED_PRICE", "INPUT_UNIT_PRICE", "APU", "QUOTATION", "QUANTITY_TAKEOFF", "BUDGET", "IUPC_REFERENCE", "DERIVED_CALCULATION"];

function emptyEvidenceCounts(): Record<CostEvidenceType, number> {
  return Object.fromEntries(COST_TYPES.map((type) => [type, 0])) as Record<CostEvidenceType, number>;
}

function assertRate(name: string, value: number) {
  if (!Number.isFinite(value) || value < 0 || value > 1) throw new Error(`${name}_MUST_BE_BETWEEN_0_AND_1`);
}

export function calculateArkiCostModel(input: CostModelInput): CostModelResult {
  if (!input.projectId.trim()) throw new Error("PROJECT_ID_REQUIRED");
  if (!input.currency.trim()) throw new Error("CURRENCY_REQUIRED");
  const overheadRate = input.overheadRate ?? 0;
  const profitRate = input.profitRate ?? 0;
  const taxRate = input.taxRate ?? 0;
  const horizonYears = input.horizonYears;
  assertRate("OVERHEAD_RATE", overheadRate);
  assertRate("PROFIT_RATE", profitRate);
  assertRate("TAX_RATE", taxRate);

  const counts = emptyEvidenceCounts();
  const unknowns: string[] = [];
  const warnings: string[] = [];
  let directCost = 0;

  for (const line of input.lines) {
    if (!Number.isFinite(line.quantity) || line.quantity < 0) throw new Error(`INVALID_QUANTITY:${line.id}`);
    if (!Number.isFinite(line.unitPrice) || line.unitPrice < 0) throw new Error(`INVALID_UNIT_PRICE:${line.id}`);
    counts[line.type] += 1;
    directCost += line.quantity * line.unitPrice + (line.freight ?? 0) + (line.installation ?? 0);
    if (line.confidence === "UNKNOWN") unknowns.push(`COST_LINE_UNKNOWN:${line.id}`);
    if (!line.sourceUrl && !line.sourceDocument) warnings.push(`MISSING_SOURCE:${line.id}`);
    if (line.taxStatus === "UNKNOWN") warnings.push(`TAX_STATUS_UNKNOWN:${line.id}`);
    if (!line.region) warnings.push(`REGION_UNKNOWN:${line.id}`);
    if (line.type === "IUPC_REFERENCE") warnings.push(`IUPC_IS_REFERENCE_NOT_LOCAL_QUOTATION:${line.id}`);
    if (line.type === "DERIVED_CALCULATION") warnings.push(`DERIVED_VALUE_REQUIRES_FORMULA_TRACE:${line.id}`);
  }

  const overhead = directCost * overheadRate;
  const profit = (directCost + overhead) * profitRate;
  const taxableBase = directCost + overhead + profit;
  const tax = taxableBase * taxRate;
  const total = taxableBase + tax;
  if (!input.lines.length) warnings.push("NO_COST_LINES_PROVIDED");
  if (!input.lines.some((line) => line.type === "QUOTATION" || line.type === "OBSERVED_PRICE")) warnings.push("NO_MARKET_OBSERVATION_OR_QUOTATION");
  if (horizonYears !== undefined && (!Number.isInteger(horizonYears) || horizonYears < 0)) throw new Error("INVALID_LIFECYCLE_HORIZON");

  const lifecycleCost = horizonYears === undefined ? undefined : total * (1 + horizonYears * 0);
  return {
    schema: "ARKI-COST-MODEL-1.0",
    projectId: input.projectId,
    currency: input.currency,
    directCost,
    overhead,
    profit,
    tax,
    total,
    lifecycleCost,
    lineCount: input.lines.length,
    evidenceByType: counts,
    unknowns,
    warnings,
    marketResearch: {
      sourcePolicy: "OFFICIAL_OR_DOCUMENTED_MARKET_SOURCE",
      automaticInternetPurchase: false,
      humanReviewRequired: true,
      priceAdoptionStatus: unknowns.length || warnings.length ? "CANDIDATES_ONLY" : "READY_FOR_HUMAN_REVIEW",
    },
    status: "READY_FOR_HUMAN_REVIEW",
    humanReviewRequired: true,
  };
}

export function arkiCostModuleContract() {
  return {
    version: "ARKI-COST-MODEL-1.0",
    purpose: "Traceable cost and budget support for technical expedients and private projects.",
    acceptedEvidence: COST_TYPES,
    requiredLineage: ["projectId", "unit", "quantity", "unitPrice", "currency", "date", "region", "taxStatus", "source", "confidence"],
    flow: "MARKET_OBSERVATION_OR_QUOTATION → INPUT_UNIT_PRICE → APU → QUANTITY_TAKEOFF → BUDGET → HUMAN_REVIEW",
    protectedRules: ["IUPC is a reference series, not an automatic local quotation.", "No missing price is invented.", "Tax, freight, currency and validity remain explicit.", "Price adoption never becomes approval or professional signoff."],
    automaticInternetPurchase: false,
    humanAuthority: "FINAL",
  } as const;
}
