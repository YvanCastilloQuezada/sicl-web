import type { CirculationEvidenceGraph } from "./circulationEvidenceGraph";

export type A21RelationType = "REQUIRED_ADJACENCY" | "PREFERRED_ADJACENCY" | "REQUIRED_SEPARATION" | "PREFERRED_SEPARATION" | "DIRECT_ACCESS" | "CONTROLLED_ACCESS" | "VISUAL_CONNECTION" | "NO_VISUAL_CONNECTION" | "SEQUENTIAL_RELATION" | "VERTICAL_RELATION";
export type A21EpistemicState = "HUMAN_CONFIRMED" | "PROJECT_FACT" | "OBSERVED_GEOMETRY" | "DERIVED_RELATION" | "AI_PROPOSED" | "HYPOTHESIS" | "UNKNOWN" | "CONFLICTING";
export type A21RelationStatus = "PROPOSED" | "CONFIRMED" | "UNKNOWN" | "CONFLICTING";
export type ZoneType = "PUBLIC" | "SEMI_PUBLIC" | "PRIVATE" | "SERVICE" | "ACCESS" | "WORK" | "REST" | "TRANSITION" | "OUTDOOR" | "UNKNOWN";
export type CirculationIntentType = "PRIMARY_SPINE" | "SECONDARY_ROUTE" | "SERVICE_ROUTE" | "PRIVATE_ROUTE" | "VERTICAL_CONNECTION" | "LOOP_INTENT" | "SEQUENCE_INTENT" | "ACCESS_INTENT" | "UNKNOWN";
export type CirculationIntentValidationState = "INTENT_NOT_OBSERVED" | "OBSERVED_PARTIAL" | "OBSERVED" | "UNVERIFIED" | "CONFLICTING" | "INSUFFICIENT_EVIDENCE";

export type ProgramNode = { programId: string; name: string; zoneType?: ZoneType; privacyLevel?: string; accessRequirements?: string[]; levelPreference?: string; provenance: string[] };
export type AdjacencyRequirement = { adjacencyId: string; sourceProgramId: string; targetProgramId: string; relationType: A21RelationType; priority: "MUST" | "SHOULD" | "COULD" | "UNKNOWN"; strength?: number; sameLevelRequirement?: boolean; privacyEffect?: string; circulationEffect?: string; rationale?: string; source: "PROJECT_STATE" | "HUMAN_INPUT" | "AI_PROPOSED"; provenance: string[]; epistemicState: A21EpistemicState; status: A21RelationStatus };
export type SpatialZoneProposal = { zoneId: string; name: string; zoneType: ZoneType; programItemIds: string[]; privacyLevel?: string; accessLevel?: string; circulationRole?: string; rationale: string; supportingRelationIds: string[]; excludedRelationIds: string[]; provenance: string[]; epistemicState: A21EpistemicState; status: "PROPOSED" | "HUMAN_CONFIRMED" | "REJECTED" | "UNKNOWN"; noGeometryMutation: true; noDecision: true };
export type CirculationIntent = { circulationIntentId: string; originZoneId?: string; originProgramId?: string; destinationZoneId?: string; destinationProgramId?: string; sequence: string[]; routeType: CirculationIntentType; privacyLevel?: string; priority: "MUST" | "SHOULD" | "COULD" | "UNKNOWN"; requiredContinuity: boolean; levelStrategy?: string; accessStrategy?: string; rationale: string; provenance: string[]; epistemicState: A21EpistemicState; status: "PROPOSED" | "HUMAN_CONFIRMED" | "REJECTED" | "UNKNOWN" };
export type CirculationIntentValidation = { circulationIntentId: string; state: CirculationIntentValidationState; observedEdgeIds: string[]; unverifiedNodes: string[]; missingEvidence: string[]; contradictions: string[]; evidenceRefs: string[]; graphId: string; accessibleRoute: "NOT_ASSESSED"; compliance: "NOT_ASSESSED"; humanReviewRequired: true; noAutomaticRepair: true; noDecision: true; noRecommendation: true };

export function deriveAdjacencyRequirements(nodes: ProgramNode[], relations: Array<Partial<AdjacencyRequirement> & Pick<AdjacencyRequirement, "sourceProgramId" | "targetProgramId">>): AdjacencyRequirement[] {
  return relations.map((relation, index) => ({ adjacencyId: relation.adjacencyId ?? `a21-adjacency-${index + 1}`, sourceProgramId: relation.sourceProgramId, targetProgramId: relation.targetProgramId, relationType: relation.relationType ?? "REQUIRED_ADJACENCY", priority: relation.priority ?? "UNKNOWN", strength: relation.strength, sameLevelRequirement: relation.sameLevelRequirement, privacyEffect: relation.privacyEffect, circulationEffect: relation.circulationEffect, rationale: relation.rationale, source: relation.source ?? "AI_PROPOSED", provenance: relation.provenance ?? [`A21.relation[${index}]`], epistemicState: relation.epistemicState ?? "AI_PROPOSED", status: relation.status ?? "PROPOSED" }));
}

export function detectAdjacencyConflicts(requirements: AdjacencyRequirement[]): string[] {
  const conflicts: string[] = [];
  for (const requirement of requirements) {
    const inverse = requirements.find((other) => other.sourceProgramId === requirement.sourceProgramId && other.targetProgramId === requirement.targetProgramId && ((requirement.relationType === "REQUIRED_ADJACENCY" && other.relationType === "REQUIRED_SEPARATION") || (requirement.relationType === "REQUIRED_SEPARATION" && other.relationType === "REQUIRED_ADJACENCY")));
    if (inverse) conflicts.push(`${requirement.adjacencyId}|${inverse.adjacencyId}`);
  }
  return Array.from(new Set(conflicts));
}

export function proposeFunctionalZones(nodes: ProgramNode[], requirements: AdjacencyRequirement[]): SpatialZoneProposal[] {
  const grouped = new Map<ZoneType, ProgramNode[]>();
  for (const node of nodes) { const type = node.zoneType ?? "UNKNOWN"; grouped.set(type, [...(grouped.get(type) ?? []), node]); }
  return Array.from(grouped.entries()).map(([zoneType, members]) => {
    const ids = new Set(members.map((member) => member.programId));
    const supporting = requirements.filter((relation) => ids.has(relation.sourceProgramId) && ids.has(relation.targetProgramId)).map((relation) => relation.adjacencyId);
    const excluded = requirements.filter((relation) => ids.has(relation.sourceProgramId) !== ids.has(relation.targetProgramId)).map((relation) => relation.adjacencyId);
    return { zoneId: `a21-zone-${zoneType.toLowerCase()}`, name: `${zoneType} zone`, zoneType, programItemIds: members.map((member) => member.programId), privacyLevel: members.map((member) => member.privacyLevel).filter(Boolean)[0], accessLevel: members.flatMap((member) => member.accessRequirements ?? []).join(", ") || undefined, circulationRole: zoneType === "ACCESS" ? "ENTRY" : zoneType === "SERVICE" ? "SERVICE_SUPPORT" : "PROGRAM_CLUSTER", rationale: `Proposed grouping by functional type ${zoneType}; architect confirmation is required before treating the zone as a project decision.`, supportingRelationIds: supporting, excludedRelationIds: excluded, provenance: ["A21.deriveFunctionalZones", ...members.flatMap((member) => member.provenance)], epistemicState: "AI_PROPOSED", status: "PROPOSED", noGeometryMutation: true, noDecision: true };
  });
}

export function validateCirculationIntent(intent: CirculationIntent, graph: CirculationEvidenceGraph): CirculationIntentValidation {
  const nodes = new Set(graph.nodes.map((node) => node.id));
  const sequence = intent.sequence.filter(Boolean);
  const unverifiedNodes = sequence.filter((id) => !nodes.has(id));
  const missingEvidence: string[] = [];
  const contradictions: string[] = [];
  if (!sequence.length) missingEvidence.push("CIRCULATION_SEQUENCE");
  if (!intent.originZoneId && !intent.originProgramId) missingEvidence.push("ORIGIN");
  if (!intent.destinationZoneId && !intent.destinationProgramId) missingEvidence.push("DESTINATION");
  const observedEdgeIds = graph.edges.filter((edge) => sequence.includes(edge.from) && sequence.includes(edge.to) && edge.state === "OBSERVED").map((edge) => edge.id);
  if (unverifiedNodes.length) missingEvidence.push("UNVERIFIED_SEQUENCE_NODES");
  if (intent.requiredContinuity && sequence.length > 1 && observedEdgeIds.length < sequence.length - 1) missingEvidence.push("CONTINUITY_EVIDENCE");
  if (intent.routeType === "LOOP_INTENT" && graph.loop === "UNKNOWN") missingEvidence.push("LOOP_EVIDENCE");
  if (intent.routeType === "PRIMARY_SPINE" && graph.spine === "UNKNOWN") missingEvidence.push("SPINE_EVIDENCE");
  if (intent.epistemicState === "CONFLICTING") contradictions.push("INTENT_MARKED_CONFLICTING");
  const state: CirculationIntentValidationState = contradictions.length ? "CONFLICTING" : !sequence.length || missingEvidence.includes("ORIGIN") || missingEvidence.includes("DESTINATION") ? "INSUFFICIENT_EVIDENCE" : observedEdgeIds.length === sequence.length - 1 && missingEvidence.length === 0 ? "OBSERVED" : observedEdgeIds.length > 0 ? "OBSERVED_PARTIAL" : "UNVERIFIED";
  return { circulationIntentId: intent.circulationIntentId, state, observedEdgeIds, unverifiedNodes, missingEvidence, contradictions, evidenceRefs: [...graph.provenance, ...observedEdgeIds.map((id) => `A20-P1.edge:${id}`)], graphId: graph.graphId, accessibleRoute: "NOT_ASSESSED", compliance: "NOT_ASSESSED", humanReviewRequired: true, noAutomaticRepair: true, noDecision: true, noRecommendation: true };
}

export function validateA21SpatialModel(zones: SpatialZoneProposal[], requirements: AdjacencyRequirement[]): boolean { return zones.every((zone) => zone.noGeometryMutation && zone.noDecision && zone.programItemIds.length > 0 && zone.provenance.length > 0) && requirements.every((relation) => relation.provenance.length > 0); }
