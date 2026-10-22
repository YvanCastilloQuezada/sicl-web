import { validateAgainstRne, type NormativeFact } from "../shared/arkiNormativeEngine";
import type { ProfessionalIssue, ProfessionalProjection } from "./arkiProfessionalState";

export function projectNormativeEvaluationToF7(input: {
  projectionId: string;
  typology?: string;
  facts: NormativeFact[];
  ruleIds?: string[];
  semanticIds: string[];
  agkObjectIds: string[];
  sourceClaimIds: string[];
  officialSourceVerification?: string[];
}) {
  const result = validateAgainstRne({ typology: input.typology, facts: input.facts, ruleIds: input.ruleIds });
  const official = input.officialSourceVerification ?? [];
  const issues: ProfessionalIssue[] = [];
  const unknowns: string[] = [];

  if (!official.length) unknowns.push("NORMATIVE_SOURCE_NOT_OFFICIALLY_VERIFIED");
  for (const item of result.results) {
    if (item.status === "UNKNOWN") unknowns.push(`NORMATIVE_FACT_UNKNOWN:${item.ruleId}`);
    if (item.status === "FAIL") {
      issues.push({
        issueId: `NORM-${item.ruleId}`,
        kind: "JURISDICTION",
        status: "OPEN",
        semanticIds: input.semanticIds,
        evidence: official,
        reason: `REFERENCE_SEED_FAIL:${item.ruleId}:${item.legalReference}`,
      });
    }
  }

  const projection: ProfessionalProjection = {
    projectionId: input.projectionId,
    discipline: "ARCHITECTURE",
    semanticIds: input.semanticIds,
    agkObjectIds: input.agkObjectIds,
    sourceClaimIds: input.sourceClaimIds,
    evidenceState: official.length > 0 && unknowns.length === 0 && issues.length === 0 ? "VERIFIED" : "PARTIAL",
    unknowns,
    specialistReviewRequired: true,
  };
  return {
    projection,
    issues,
    source: result,
    complianceClaim: official.length > 0 ? "EVALUATION_REQUIRES_PROFESSIONAL_REVIEW" as const : "NOT_VERIFIED" as const,
    canonicalPromotion: false as const,
  };
}

export const F7_NORMATIVE_BOUNDARY = Object.freeze({
  referenceSeedIsProfessionalProof: false,
  officialSourceVerificationRequired: true,
  professionalSignoffRequired: true,
  canonicalMutation: false,
} as const);
