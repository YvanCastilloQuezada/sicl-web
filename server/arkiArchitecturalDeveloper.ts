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
import { validatePartiContract, type PartiContract } from "./arkiPartiContract";
import type { CanonicalSpatialElement, CanonicalSpatialRepresentation } from "./arkiD63GeometricBridge";
import { resolveSpecialVolumeGeometry } from "./arkiVerticalSpecialVolumeGeometryResolver";
import { materializeD63Geometry } from "./arkiGeometryKernel";

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
  /** Verified corpus locators available to this execution; absent refs fail closed. */
  verifiedCorpusRefs?: ReadonlySet<string>;
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

function readMappedElementType(element: CanonicalSpatialElement):
  | { ok: true; elementType: CanonicalSpatialElement["element_type"]; kind: string | null }
  | { ok: false; reason: string } {
  let observed: unknown;
  try {
    observed = (element as unknown as Record<string, unknown>).element_type;
  } catch {
    return { ok: false, reason: "UNKNOWN_D63_ELEMENT_TYPE:<unreadable>" };
  }
  if (typeof observed !== "string") {
    return { ok: false, reason: "UNKNOWN_D63_ELEMENT_TYPE:<invalid-runtime-type>" };
  }
  if (!Object.prototype.hasOwnProperty.call(D63_TO_CORE_KIND, observed)) {
    return { ok: false, reason: `UNKNOWN_D63_ELEMENT_TYPE:${observed}` };
  }
  const elementType = observed as CanonicalSpatialElement["element_type"];
  return { ok: true, elementType, kind: D63_TO_CORE_KIND[elementType] };
}

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
  parti: PartiContract,
  unknowns: DeveloperUnknown[]
): ProposedArchiElementDTO[] {
  const result: ProposedArchiElementDTO[] = [];
  const decisions = new Map(parti.verticalDecisions.map((d) => [d.decisionId, d]));
  const levels = parti.verticalSystem.levels ?? [];
  const levelsById = new Map(levels.map((level) => [level.levelId, level]));
  const volumes = parti.verticalSystem.specialVolumes ?? [];

  for (const element of representation.elements) {
    const pid = proposedId(element);
    const mapped = readMappedElementType(element);
    if (!mapped.ok) {
      unknowns.push({
        field: `${pid}.kind`,
        reason: mapped.reason,
        requiredEvidence: "Recognized D6.3 element_type and explicit D6.3 → Core mapping",
      });
      continue;
    }
    const { elementType, kind } = mapped;

    if (kind === null) {
      unknowns.push({
        field: `${pid}.kind`,
        reason: `NO_CORE_ELEMENT_KIND_MAPPING:${elementType}`,
        requiredEvidence: "Explicit semantic mapping with sufficient architectural evidence",
      });
      continue;
    }

    if (kind !== "SPACE") {
      unknowns.push({ field: `${pid}.height_mm`, reason: `Vertical authority for Core kind ${kind} is not defined in this microblock`, requiredEvidence: "Element-kind-specific vertical decision contract" });
      continue;
    }

    const memberLevels = levels.filter((level) => level.members.includes(pid));
    const memberVolumes = volumes.filter((volume) => volume.members.includes(pid));
    if (memberLevels.length > 1 || memberVolumes.length > 1 || (memberLevels.length && memberVolumes.length)) {
      unknowns.push({ field: `${pid}.vertical_membership`, reason: "Element has conflicting vertical-system membership", requiredEvidence: "Exactly one applicable level or special volume" });
      continue;
    }

    if (memberVolumes.length === 1) {
      const resolution = resolveSpecialVolumeGeometry(memberVolumes[0], levelsById, decisions);
      if (!resolution.ok) {
        unknowns.push({
          field: `${pid}.vertical_geometry`,
          reason: `SPECIAL_VOLUME_GEOMETRY_RESOLUTION_FAILED:${resolution.code}`,
          requiredEvidence: "Resolve the referenced vertical-system authority before Developer materialization",
        });
        continue;
      }

      const vertical = resolution.value;
      const bridgedGeometry = materializeD63Geometry(pid, {
        geometry: element.geometry,
        coordinateSystem: representation.coordinate_system,
        units: representation.units,
        baseElevation_mm: vertical.baseElevation_mm,
        verticalExtent_mm: vertical.verticalExtent_mm,
      });
      if (!bridgedGeometry.ok) {
        unknowns.push({
          field: `${pid}.geometry`,
          reason: `D6_3_TO_D2_GEOMETRY_BRIDGE_FAILED:${bridgedGeometry.code}`,
          requiredEvidence: "Provide D6.3 geometry satisfying the strict D-2 geometry bridge contract",
        });
        continue;
      }
      result.push({
        provisionalId: pid,
        kind,
        geometry: bridgedGeometry.value.objects[0].geometry,
        properties: { d63_element_type: elementType },
        provenance: [
          ...provenanceFromElement(element),
          { source: "vertical_dimension_decision", ref: vertical.verticalExtentProvenance.decisionId },
          { source: "vertical_elevation_decision", ref: vertical.baseElevationProvenance.levelDecisionId },
          { source: "vertical_base_declaration", ref: vertical.baseElevationProvenance.declarationId },
        ],
        epistemicStatus: decisions.get(vertical.verticalExtentProvenance.decisionId)!.epistemicStatus,
      });
      continue;
    }

    if (memberLevels.length !== 1) {
      unknowns.push({ field: `${pid}.height_mm`, reason: "LEVEL_MEMBERSHIP_GAP: SPACE belongs to no VerticalLevel", requiredEvidence: "Exactly one VerticalLevel membership and RESOLVED CLEAR_HEIGHT" });
      continue;
    }

    const level = memberLevels[0];
    const elevationDecision = decisions.get(level.elevationDecisionId);
    const base = level.clearHeightDecisionId ? decisions.get(level.clearHeightDecisionId) : undefined;
    const elementOverrides = parti.verticalDecisions.filter((d) => d.dimensionKind === "CLEAR_HEIGHT" && d.status === "RESOLVED" && (
      (d.target.kind === "ELEMENT" && d.target.elementProvisionalId === pid) ||
      (d.target.kind === "GROUP" && d.target.members.includes(pid))
    ));
    const values = new Set(elementOverrides.map((d) => d.selectedDimension_mm));
    if (values.size > 1) {
      unknowns.push({ field: `${pid}.height_mm`, reason: "CONFLICTING: equally applicable vertical overrides have incompatible values", requiredEvidence: "Resolve vertical decision conflict in Parti" });
      continue;
    }

    const heightDecision = elementOverrides.length ? elementOverrides[0] : base;
    if (elementOverrides.length && !heightDecision?.verticalException) {
      unknowns.push({ field: `${pid}.height_mm`, reason: "CONFLICTING: element/group height cannot override LEVEL without a justified verticalException", requiredEvidence: "Typed verticalException with reasoning and evidence" });
      continue;
    }
    if (!heightDecision || heightDecision.dimensionKind !== "CLEAR_HEIGHT" || heightDecision.status !== "RESOLVED") {
      unknowns.push({ field: `${pid}.height_mm`, reason: "CLEAR_HEIGHT decision is missing or unresolved", requiredEvidence: "RESOLVED CLEAR_HEIGHT decision for the containing level" });
      continue;
    }
    if (!elevationDecision || elevationDecision.dimensionKind !== "ELEVATION" || elevationDecision.status !== "RESOLVED") {
      unknowns.push({ field: `${pid}.z_mm`, reason: "ELEVATION decision is missing or unresolved", requiredEvidence: "RESOLVED ELEVATION decision for the containing level" });
      continue;
    }

    const height = heightDecision.selectedDimension_mm;
    if (height === null || height <= 0) {
      unknowns.push({ field: `${pid}.height_mm`, reason: "Resolved vertical decision has no positive height", requiredEvidence: "Positive resolved vertical dimension" });
      continue;
    }
    if (elevationDecision.selectedDimension_mm === null) {
      unknowns.push({ field: `${pid}.z_mm`, reason: "Resolved ELEVATION decision has no value", requiredEvidence: "Resolved ELEVATION value for the containing level" });
      continue;
    }

    const bridgedGeometry = materializeD63Geometry(pid, {
      geometry: element.geometry,
      coordinateSystem: representation.coordinate_system,
      units: representation.units,
      baseElevation_mm: elevationDecision.selectedDimension_mm,
      verticalExtent_mm: height,
    });
    if (!bridgedGeometry.ok) {
      unknowns.push({
        field: `${pid}.geometry`,
        reason: `D6_3_TO_D2_GEOMETRY_BRIDGE_FAILED:${bridgedGeometry.code}`,
        requiredEvidence: "Provide D6.3 geometry satisfying the strict D-2 geometry bridge contract",
      });
      continue;
    }

    result.push({
      provisionalId: pid,
      kind,
      geometry: bridgedGeometry.value.objects[0].geometry,
      properties: { d63_element_type: elementType },
      provenance: [
        ...provenanceFromElement(element),
        { source: "vertical_dimension_decision", ref: heightDecision.decisionId },
        { source: "vertical_elevation_decision", ref: elevationDecision.decisionId },
      ],
      epistemicStatus: heightDecision.epistemicStatus,
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
  if (fingerprint(partiInCycle) !== fingerprint(input.partiContract)) {
    throw new Error("PARTI_CONTRACT_MISMATCH");
  }

  const partiValidation = validatePartiContract(input.partiContract, input.verifiedCorpusRefs);
  if (partiValidation.status !== "PASS") {
    throw new Error(`PARTI_CONTRACT_INVALID: ${partiValidation.violations.join(";")}`);
  }

  const representation = selectGeometry(input.cycle, input.partiContract);
  const unresolvedUnknowns = collectUnknowns(input);
  const proposedElements = buildElements(representation, input.partiContract, unresolvedUnknowns);
  const hasCirculation = unresolvedUnknowns.some(
    (item) => item.reason === "NO_CORE_ELEMENT_KIND_MAPPING:CirculationElement"
  );

  // D6.3 does not expose referential architectural relations.
  const proposedRelations: DeveloperProposal["proposedRelations"] = [];

  // D6.3 mutations point to representation IDs, not individual element IDs.
  // Creating element-level derivations here would invent lineage.
  const proposedDerivations: DeveloperProposal["proposedDerivations"] = [];

  const sourceExecutionId = `${input.cycle.project.projectId}-cycle`;
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
    explicitInput: input.explicitInput,
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
