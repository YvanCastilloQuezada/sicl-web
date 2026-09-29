import type { DesignCandidate } from "../shared/arkiDesignFunnel";
import {
  validateDeveloperProposal,
  type DeveloperFeedbackLoop,
  type DeveloperHumanAction,
  type DeveloperProposal,
  type DeveloperProposalValidation,
  type DeveloperProvenanceRef,
  type DeveloperUnknown,
  type ProposedArchiElementDTO,
} from "../shared/arkiDeveloperProposal";
import { fingerprint } from "./arkiFingerprint";
import type { IntegratedArchitectCycle } from "./arkiIntegratedArchitectCycle";
import type { PartiContract } from "./arkiPartiContract";
import type { CanonicalSpatialElement, CanonicalSpatialRepresentation } from "./arkiD63GeometricBridge";

/**
 * ARKI Architectural Developer (proposal-only).
 *
 * Converts a human-selected design hypothesis, its integrated cycle and the
 * selected PartiContract into a pre-D-2 DeveloperProposal.
 *
 * HARD RULES:
 * - Does not mutate D-2 or call Core.
 * - Does not invent absent geometry or referential relations.
 * - Does not declare canonicality.
 * - Preserves UNKNOWNs and source limitations.
 * - Human Authority remains final; reviewRequired is always true.
 */
export interface DeveloperInput {
  selectedCandidate: DesignCandidate;
  cycle: IntegratedArchitectCycle;
  partiContract: PartiContract;
  explicitInput: {
    envelope: { width: number; height: number };
  };
  parentProposalId?: string;
}

export interface DeveloperResult {
  proposal: DeveloperProposal;
  validation: DeveloperProposalValidation;
  sourceGeometryId: string;
}

const D63_TO_CORE_KIND: Record<CanonicalSpatialElement["element_type"], string | null> = {
  SiteBoundary: "SITE",
  SpatialZone: "SPACE",
  CirculationElement: null,
};

function selectGeometry(
  cycle: IntegratedArchitectCycle,
  partiContract: PartiContract
): CanonicalSpatialRepresentation {
  const geometryIds = new Set(partiContract.geometryIds);
  if (geometryIds.has(cycle.geometry.candidateA.id)) return cycle.geometry.candidateA;
  if (geometryIds.has(cycle.geometry.candidateB.id)) return cycle.geometry.candidateB;
  throw new Error("GEOMETRY_NOT_IN_CYCLE");
}

function proposedId(element: CanonicalSpatialElement): string {
  return `d63-${element.id}`;
}

function provenanceFromElement(element: CanonicalSpatialElement): DeveloperProvenanceRef[] {
  const source =
    typeof element.metadata?.source === "string"
      ? element.metadata.source
      : "D63G:unspecified";
  return [{ source: "d63_geometry_element", ref: source }];
}

function buildElements(
  representation: CanonicalSpatialRepresentation,
  unknowns: DeveloperUnknown[]
): ProposedArchiElementDTO[] {
  const result: ProposedArchiElementDTO[] = [];

  for (const element of representation.elements) {
    const kind = D63_TO_CORE_KIND[element.element_type];

    if (kind === null) {
      unknowns.push({
        field: `${proposedId(element)}.kind`,
        reason: `D6.3 element_type=${element.element_type} has no Core ElementKind mapping`,
        requiredEvidence: "Core must decide the mapping in Commit 8",
      });
      continue;
    }

    result.push({
      provisionalId: proposedId(element),
      kind,
      geometry: element.geometry as unknown as Record<string, unknown>,
      properties: {
        d63_element_type: element.element_type,
        d63_labels: element.labels ?? {},
      },
      provenance: provenanceFromElement(element),
      epistemicStatus: "HYPOTHESIS",
    });
  }

  return result;
}

function collectUnknowns(input: DeveloperInput): DeveloperUnknown[] {
  const unknowns: DeveloperUnknown[] = [];

  for (const value of input.selectedCandidate.unknowns) {
    unknowns.push({
      field: "candidate",
      reason: value,
      requiredEvidence: "Human review or explicit input",
    });
  }

  for (const value of input.cycle.evaluation.unknowns) {
    unknowns.push({
      field: "cycle.evaluation",
      reason: value,
      requiredEvidence: "Human review or explicit evidence",
    });
  }

  for (const value of input.partiContract.unknowns) {
    unknowns.push({
      field: "parti",
      reason: value,
      requiredEvidence: "Human review or explicit evidence",
    });
  }

  unknowns.push({
    field: "relations.architectural_topology",
    reason:
      "D6.3 provides no referential architectural relations; Parti functionalRelationships are free text",
    requiredEvidence:
      "Referential relations must be materialized explicitly before Core promotion",
  });

  return unknowns;
}

function collectHumanActions(hasCirculation: boolean): DeveloperHumanAction[] {
  const actions: DeveloperHumanAction[] = [
    {
      action: "review_proposal",
      reason:
        "DeveloperProposal is pre-D-2 and requires Human Review before any promotion",
    },
  ];

  if (hasCirculation) {
    actions.push({
      action: "decide_circulation_element_mapping",
      reason:
        "CirculationElement cannot be promoted to D-2 without an explicit Core mapping decision",
    });
  }

  return actions;
}

function collectProvenance(
  input: DeveloperInput,
  representation: CanonicalSpatialRepresentation
): DeveloperProvenanceRef[] {
  return [
    { source: "design_funnel_candidate", ref: input.selectedCandidate.id },
    { source: "integrated_cycle", ref: input.cycle.cycleVersion },
    { source: "parti_contract", ref: input.partiContract.partiId },
    { source: "parti_topology", ref: input.partiContract.topologyId },
    ...input.partiContract.provenance.map((ref) => ({
      source: "parti_provenance",
      ref,
    })),
    { source: "d63_geometry", ref: representation.id },
    { source: "d63_input_fingerprint", ref: representation.input_fingerprint },
    { source: "d63_final_status", ref: input.cycle.geometry.finalStatus },
    {
      source: "d63_g12_no_template_hardcoding",
      ref: String(
        input.cycle.geometry.gates.G12_NO_TEMPLATE_HARDCODING ?? "UNKNOWN"
      ),
    },
    {
      source: "explicit_envelope",
      ref: `${input.explicitInput.envelope.width}x${input.explicitInput.envelope.height}`,
    },
  ];
}

function collectFeedbackLoops(
  cycle: IntegratedArchitectCycle,
  hasCirculation: boolean
): DeveloperFeedbackLoop[] {
  const loops: DeveloperFeedbackLoop[] = [];

  if (hasCirculation) {
    loops.push({
      from: "developer",
      to: "parti",
      reason: "CirculationElement has no Core ElementKind mapping",
    });
  }

  if (cycle.geometry.gates.G12_NO_TEMPLATE_HARDCODING === "FAIL") {
    loops.push({
      from: "developer",
      to: "d63",
      reason:
        "Source geometry reports G12_NO_TEMPLATE_HARDCODING=FAIL; limitation preserved",
    });
  }

  return loops;
}

export function developProposal(input: DeveloperInput): DeveloperResult {
  if (input.selectedCandidate.stage !== "SELECTED_FOR_DEVELOPMENT") {
    throw new Error("DEVELOPER_REQUIRES_SELECTED_CANDIDATE");
  }

  if (input.selectedCandidate.projectId !== input.cycle.project.projectId) {
    throw new Error("CANDIDATE_PROJECT_MISMATCH");
  }

  const partiInCycle = input.cycle.parti.partis.find(
    (parti) => parti.partiId === input.partiContract.partiId
  );
  if (!partiInCycle) {
    throw new Error("PARTI_NOT_IN_CYCLE");
  }

  const representation = selectGeometry(input.cycle, input.partiContract);
  const hasCirculation = representation.elements.some(
    (element) => element.element_type === "CirculationElement"
  );

  const unresolvedUnknowns = collectUnknowns(input);
  const proposedElements = buildElements(representation, unresolvedUnknowns);

  // D6.3 does not expose referential architectural relations.
  const proposedRelations: DeveloperProposal["proposedRelations"] = [];

  // D6.3 mutations point to representation IDs, not individual element IDs.
  // Creating element-level derivations here would invent lineage.
  const proposedDerivations: DeveloperProposal["proposedDerivations"] = [];

  const sourceExecutionId = input.cycle.reasoning.reasoningExecutionId;
  const sourceD63 = representation.id;
  const epistemicStatus =
    input.partiContract.humanAuthority.decision === "ACCEPTED"
      ? "PROPOSAL"
      : "HYPOTHESIS";

  const proposalIdSeed = {
    projectId: input.cycle.project.projectId,
    candidateId: input.selectedCandidate.id,
    partiId: input.partiContract.partiId,
    representationId: representation.id,
  };
  const proposalId = `dev-prop-${fingerprint(proposalIdSeed).slice(0, 16)}`;

  const fingerprintInput = {
    proposalId,
    parentProposalId: input.parentProposalId ?? null,
    sourceExecutionId,
    sourceD63,
    epistemicStatus,
    proposedElements,
    proposedRelations,
    proposedDerivations,
    unresolvedUnknowns,
  };

  const proposal: DeveloperProposal = {
    proposalId,
    parentProposalId: input.parentProposalId ?? null,
    sourceExecutionId,
    sourceD63,
    fingerprint: fingerprint(fingerprintInput),
    epistemicStatus,
    proposedElements,
    proposedRelations,
    proposedDerivations,
    unresolvedUnknowns,
    requiredHumanActions: collectHumanActions(hasCirculation),
    provenance: collectProvenance(input, representation),
    reviewRequired: true,
    mutation: null,
    rejectedBecause: null,
    feedbackLoops: collectFeedbackLoops(input.cycle, hasCirculation),
  };

  const validation = validateDeveloperProposal(proposal);
  if (!validation.valid) {
    throw new Error(
      `DEVELOPER_PROPOSAL_INVALID: ${validation.errors.join("; ")}`
    );
  }

  return { proposal, validation, sourceGeometryId: representation.id };
}
