import type { ProfessionalIssue, ProfessionalProjection } from "./arkiProfessionalState";
import type { BimViewerModel } from "./arkiBimViewer";
import { coordinateMepModels } from "./arkiMepCoordination";
import { calculateArkiCostModel, type CostModelInput } from "./arkiCostIntelligence";

export function projectMepCoordinationToF7(input: {
  projectionId: string;
  models: BimViewerModel[];
  semanticIds: string[];
  agkObjectIds: string[];
  sourceClaimIds: string[];
}) {
  const result = coordinateMepModels({ models: input.models });
  const issues: ProfessionalIssue[] = [];
  const unknowns: string[] = [];

  if ("reason" in result) {
    unknowns.push(`MEP_COORDINATION_BLOCKED:${result.reason}`);
  } else {
    for (const clash of result.interferences) {
      issues.push({
        issueId: clash.id,
        kind: "CLASH",
        status: clash.status === "RESOLVED" ? "RESOLVED" : "OPEN",
        semanticIds: [clash.leftElementId, clash.rightElementId],
        evidence: [`MEP_COORDINATION:${clash.id}`],
        reason: clash.reason,
      });
    }
    for (const item of result.unknowns) {
      unknowns.push(`MEP:${item.elementId}:${item.requiredEvidence}`);
    }
  }

  const projection: ProfessionalProjection = {
    projectionId: input.projectionId,
    discipline: "MEP",
    semanticIds: input.semanticIds,
    agkObjectIds: input.agkObjectIds,
    sourceClaimIds: input.sourceClaimIds,
    evidenceState: unknowns.length || issues.some(i => i.status === "OPEN") ? "PARTIAL" : "VERIFIED",
    unknowns,
    specialistReviewRequired: true,
  };
  return { projection, issues, source: result };
}

export function projectCostModelToF7(input: CostModelInput & {
  projectionId: string;
  semanticIds: string[];
  agkObjectIds: string[];
  sourceClaimIds: string[];
}) {
  const result = calculateArkiCostModel(input);
  const unknowns = [...result.unknowns, ...result.warnings.map(w => `COST_WARNING:${w}`)];
  const issues: ProfessionalIssue[] = unknowns.map((reason, index) => ({
    issueId: `COST-${String(index + 1).padStart(6, "0")}`,
    kind: "ECONOMIC",
    status: "OPEN",
    semanticIds: input.semanticIds,
    evidence: [],
    reason,
  }));
  const projection: ProfessionalProjection = {
    projectionId: input.projectionId,
    discipline: "COST",
    semanticIds: input.semanticIds,
    agkObjectIds: input.agkObjectIds,
    sourceClaimIds: input.sourceClaimIds,
    evidenceState: unknowns.length ? "PARTIAL" : "VERIFIED",
    unknowns,
    specialistReviewRequired: true,
  };
  return { projection, issues, source: result };
}

export const F7_ADAPTER_AUTHORITY_CONTRACT = Object.freeze({
  mep: "PROJECTION_ONLY",
  cost: "PROJECTION_ONLY",
  canonicalMutation: false,
  rule: "Adapters translate existing evidence into F7 projections/issues and never mutate Core, D-2 or AGK canonical state.",
} as const);
