import type { ApprovedSnapshot } from "./arkiTechnicalDossierCompiler";

export type GateActor = "human" | "ai";
export type GateStatus = "approved" | "not_approved";

export type CriterionId =
  | "data_complete"
  | "architecture_approved"
  | "structural_calculated"
  | "mep_calculated"
  | "clashes_resolved"
  | "norms_verified"
  | "quantities_reconciled"
  | "costs_sustained"
  | "drawings_coordinated"
  | "reports_and_specs"
  | "independent_review"
  | "professional_signature_and_frozen";

export type CriterionEvidence = {
  id: CriterionId;
  satisfied: boolean;
  evidenceRef?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
};

export type ProfessionalSignature = {
  professionalName: string;
  licenseNumber?: string;
  signedAt: string;
  hash: string;
};

export type GateInput = {
  snapshot: ApprovedSnapshot;
  actor: GateActor;
  criteria: CriterionEvidence[];
  professionalSignature?: ProfessionalSignature;
  evaluatedAt?: string;
};

export type GateResult = {
  status: GateStatus;
  missingCriteria: CriterionId[];
  reason: string;
  evaluatedAt: string;
  actor: GateActor;
};

export const PROJECT_GATE_CRITERIA: readonly CriterionId[] = [
  "data_complete",
  "architecture_approved",
  "structural_calculated",
  "mep_calculated",
  "clashes_resolved",
  "norms_verified",
  "quantities_reconciled",
  "costs_sustained",
  "drawings_coordinated",
  "reports_and_specs",
  "independent_review",
  "professional_signature_and_frozen",
] as const;

function isIsoDate(value: string | undefined): boolean {
  return typeof value === "string" && value.length > 0 && !Number.isNaN(Date.parse(value));
}

function reject(input: GateInput, reason: string, missingCriteria: CriterionId[] = []): GateResult {
  return {
    status: "not_approved",
    missingCriteria,
    reason,
    evaluatedAt: input.evaluatedAt ?? new Date().toISOString(),
    actor: input.actor,
  };
}

export function evaluateProjectGate(input: GateInput): GateResult {
  if (input.actor === "ai") {
    return reject(input, "GATE_NEVER_APPROVED_BY_AI");
  }
  if (input.snapshot.approval.gateStatus !== "passed") {
    return reject(input, "E8C_REQUIRES_APPROVED_SNAPSHOT");
  }
  if (!input.snapshot.id || !input.snapshot.version || !isIsoDate(input.snapshot.approval.approvedAt)) {
    return reject(input, "E8C_SNAPSHOT_PROVENANCE_INVALID");
  }

  const byId = new Map<CriterionId, CriterionEvidence>();
  for (const criterion of input.criteria) {
    if (byId.has(criterion.id)) {
      return reject(input, "E8C_DUPLICATE_CRITERION");
    }
    byId.set(criterion.id, criterion);
  }

  const missingCriteria = PROJECT_GATE_CRITERIA.filter((id) => {
    const criterion = byId.get(id);
    return (
      !criterion ||
      !criterion.satisfied ||
      !criterion.evidenceRef ||
      !criterion.verifiedBy ||
      !isIsoDate(criterion.verifiedAt)
    );
  });
  if (missingCriteria.length > 0) {
    return reject(input, "E8C_CRITERIA_INCOMPLETE_OR_UNVERIFIED", [...missingCriteria]);
  }

  const signature = input.professionalSignature;
  if (!signature || !signature.professionalName || !isIsoDate(signature.signedAt) || !signature.hash) {
    return reject(input, "E8C_PROFESSIONAL_SIGNATURE_REQUIRED");
  }

  return {
    status: "approved",
    missingCriteria: [],
    reason: "ALL_CRITERIA_HUMAN_VERIFIED_AND_PROFESSIONALLY_SIGNED",
    evaluatedAt: input.evaluatedAt ?? new Date().toISOString(),
    actor: input.actor,
  };
}
