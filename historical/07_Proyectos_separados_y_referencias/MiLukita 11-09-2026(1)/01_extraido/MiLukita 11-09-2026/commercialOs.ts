export type CommercialAgentMode = "OBSERVE" | "ANALYZE" | "INSIGHT" | "PROPOSE_ONLY";
export type CommercialStatus = "NEW" | "QUALIFIED" | "CONTACTED" | "RESPONDED" | "MEETING" | "PROPOSAL" | "NEGOTIATION" | "WON" | "LOST" | "PAUSED";
export type InventoryStatus = "AVAILABLE" | "RESERVED" | "SOLD" | "EXPIRED";
export type EvidenceState = "NO_DATA" | "OBSERVED" | "SIMULATED" | "VERIFIED";

export type AudienceSnapshot = {
  measuredAt: string | null;
  evidence: EvidenceState;
  dau: number | null;
  wau: number | null;
  mau: number | null;
  sessionDurationSeconds: number | null;
  eventCompletionRate: number | null;
  qrScanRate: number | null;
  returnRate: number | null;
  engagementRate: number | null;
  conversionRate: number | null;
};

export type CommercialInventorySlot = {
  id: string;
  type: "EVENT_SPONSOR" | "SEGMENT" | "QR" | "WEB" | "MOBILE" | "SOCIAL";
  label: string;
  durationSeconds: number | null;
  status: InventoryStatus;
  priceCredits: number | null;
  campaignId: string | null;
};

export type CommercialLead = {
  id: string;
  companyName: string;
  category: string;
  source: "AUTHORIZED_IMPORT" | "MANUAL" | "PUBLIC_BUSINESS_DATA";
  score: number | null;
  status: CommercialStatus;
  consentState: "UNKNOWN" | "AUTHORIZED" | "OPTED_OUT";
  lastContactedAt: string | null;
};

export type CommercialProposal = {
  id: string;
  leadId: string | null;
  title: string;
  packageLabel: string;
  suggestedPrice: number | null;
  status: "DRAFT" | "PENDING_HUMAN_APPROVAL" | "APPROVED" | "REJECTED";
  generatedAt: string;
  actionsExecuted: false;
};

export type CommercialOsState = {
  audience: AudienceSnapshot;
  inventory: CommercialInventorySlot[];
  leads: CommercialLead[];
  proposals: CommercialProposal[];
  agentMode: CommercialAgentMode;
  externalIntegrationsEnabled: false;
  realMoneyEnabled: false;
  authorityBoundary: readonly string[];
};

export const COMMERCIAL_AUTHORITY_BOUNDARY = [
  "MJP_CORE",
  "RNG",
  "RTP",
  "RULES",
  "WALLET",
  "CREDITS",
  "LEDGER",
  "SETTLEMENT",
  "MjpTvManifest",
] as const;

export function createEmptyCommercialState(): CommercialOsState {
  return {
    audience: { measuredAt: null, evidence: "NO_DATA", dau: null, wau: null, mau: null, sessionDurationSeconds: null, eventCompletionRate: null, qrScanRate: null, returnRate: null, engagementRate: null, conversionRate: null },
    inventory: [
      { id: "slot-live-event", type: "EVENT_SPONSOR", label: "Evento patrocinado MiLukita LIVE", durationSeconds: null, status: "AVAILABLE", priceCredits: null, campaignId: null },
      { id: "slot-qr", type: "QR", label: "QR comercial TV → móvil", durationSeconds: null, status: "AVAILABLE", priceCredits: null, campaignId: null },
      { id: "slot-segment", type: "SEGMENT", label: "Segmento presentado por marca", durationSeconds: null, status: "AVAILABLE", priceCredits: null, campaignId: null },
    ],
    leads: [],
    proposals: [],
    agentMode: "PROPOSE_ONLY",
    externalIntegrationsEnabled: false,
    realMoneyEnabled: false,
    authorityBoundary: COMMERCIAL_AUTHORITY_BOUNDARY,
  };
}

export function qualifyLead(score: number | null): "LOW" | "MEDIUM" | "HIGH" | "PRIORITY" | "NO_DATA" {
  if (score == null) return "NO_DATA";
  if (score <= 30) return "LOW";
  if (score <= 60) return "MEDIUM";
  if (score <= 80) return "HIGH";
  return "PRIORITY";
}

export function commercialCanMutateCore(): false { return false; }

export function filterCommercialPipeline(leads: readonly CommercialLead[], status: CommercialStatus | "ALL"): CommercialLead[] {
  return leads.filter((lead) => status === "ALL" || lead.status === status);
}
