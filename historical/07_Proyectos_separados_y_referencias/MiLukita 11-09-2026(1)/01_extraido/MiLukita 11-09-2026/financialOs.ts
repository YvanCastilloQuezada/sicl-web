export type FinancialEvidence = "FACT" | "PROPOSED" | "REQUIRES_HUMAN" | "UNKNOWN";
export type ForecastScenario = "BASE" | "CONSERVATIVE" | "OPTIMISTIC" | "STRESS";
export type TransactionType = "GAME" | "ADVERTISING" | "SPONSORSHIP" | "DISTRIBUTION" | "SUBSCRIPTION" | "REFUND" | "CHARGEBACK" | "FEE" | "TAX" | "UNKNOWN";

export type TransactionClassification = {
  transactionType: TransactionType;
  economicNature: string | null;
  accountingCategory: string | null;
  cashEffect: "INCREASE" | "DECREASE" | "NONE" | "UNKNOWN";
  revenueEffect: "REVENUE" | "DEFERRED_REVENUE" | "LIABILITY" | "NONE" | "UNKNOWN";
  taxRelevance: "YES" | "NO" | "UNKNOWN";
  confidence: number | null;
  source: string | null;
  evidence: FinancialEvidence;
  approvalStatus: "NOT_REQUIRED" | "PROPOSED" | "REQUIRES_HUMAN" | "CONFIRMED";
};

export type FinancialKpiSnapshot = {
  measuredAt: string | null;
  evidence: FinancialEvidence;
  revenue: number | null;
  cashBalance: number | null;
  operatingCashFlow: number | null;
  burnRate: number | null;
  runwayMonths: number | null;
  grossMargin: number | null;
  contributionMargin: number | null;
  revenueLeakage: number | null;
  chargebackRate: number | null;
  refundRate: number | null;
  budgetVariance: number | null;
  revenueConcentration: number | null;
  unreconciledTransactions: number | null;
  taxObligationCoverage: number | null;
};

export type ForecastEnvelope = { scenario: ForecastScenario; generatedAt: string; dataUsed: readonly string[]; modelVersion: string; assumptions: readonly string[]; uncertainty: string | null; value: number | null; evidence: FinancialEvidence };
export type JurisdictionAssessment = { jurisdiction: string; overall: number | null; businessFit: number | null; taxFit: number | null; regulatoryFit: number | null; operationalFit: number | null; recommendation: string | null; reasons: readonly string[]; risks: readonly string[]; unknowns: readonly string[]; status: "REQUIRES_LEGAL_TAX_VALIDATION" | "UNKNOWN" | "PROPOSED" };

export const FINANCIAL_MODULES = ["ACCOUNTING", "TREASURY", "REVENUE", "COST", "PROFITABILITY", "FORECAST", "TAX", "JURISDICTION", "BUSINESS_MODEL", "TRANSACTION_CLASSIFICATION", "RISK", "REPORTING"] as const;
export const FINANCIAL_AUTHORITY_BOUNDARY = ["MJP_CORE", "RNG", "RTP", "WALLET", "LEDGER", "SETTLEMENT", "RULES"] as const;

export function classifyUnknownTransaction(): TransactionClassification { return { transactionType: "UNKNOWN", economicNature: null, accountingCategory: null, cashEffect: "UNKNOWN", revenueEffect: "UNKNOWN", taxRelevance: "UNKNOWN", confidence: null, source: null, evidence: "UNKNOWN", approvalStatus: "REQUIRES_HUMAN" }; }
export function revenueConcentration(largest: number | null, total: number | null, threshold = 0.5): { value: number | null; alert: boolean; evidence: FinancialEvidence } { if (largest == null || total == null || total <= 0) return { value: null, alert: false, evidence: "UNKNOWN" }; const value = largest / total; return { value, alert: value >= threshold, evidence: "FACT" }; }
export function financialFailSafe(): "CONTINUE_MILUKITA_BLOCK_SENSITIVE_ACTIONS" { return "CONTINUE_MILUKITA_BLOCK_SENSITIVE_ACTIONS"; }
