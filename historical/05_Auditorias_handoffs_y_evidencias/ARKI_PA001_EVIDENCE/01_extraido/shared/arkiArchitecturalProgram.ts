import type { ConstructionModel, ConstructionSpace } from "./arkiConstructionOntology";

export type ProgramEpistemicState = "REQUIRED" | "PREFERRED" | "PROHIBITED" | "OBSERVED" | "INFERRED" | "SATISFIED" | "VIOLATED" | "UNKNOWN" | "NOT_APPLICABLE" | "PROFESSIONAL_VALIDATION_REQUIRED";
export type ProgramRelationType = "ADJACENT_TO" | "NEAR" | "SEPARATED_FROM" | "DIRECT_ACCESS_TO" | "CONTROLLED_ACCESS_TO" | "VISUAL_CONNECTION_TO" | "VISUAL_SEPARATION_FROM" | "SHARES_SERVICE_WITH" | "FUNCTIONALLY_DEPENDS_ON" | "FLOW_CONNECTED_TO" | "MUST_NOT_CROSS_WITH";
export type ProgramPriority = "MANDATORY" | "HIGH" | "MEDIUM" | "LOW" | "PREFERENCE";
export type ProgramSource = "CLIENT_REQUIREMENT" | "REGULATION" | "STANDARD" | "DESIGN_BRIEF" | "ARCHITECTURAL_KNOWLEDGE" | "PROJECT_EVIDENCE" | "PROFESSIONAL_JUDGMENT" | "INFERENCE" | "UNKNOWN_SOURCE";
export type ProgramApplicability = { buildingType?: string; spaceTypes?: string[]; jurisdiction?: string; scale?: string; userTypes?: string[]; projectPhase?: string; scenario?: string; source?: string; validFrom?: string; validTo?: string };
export type ProgramEvidence = { kind: "reference" | "fixture" | "calculation" | "observation" | "human_review"; reference: string; detail?: string };
export type ProgramProvenance = { source: ProgramSource; reference?: string; transformations: string[] };
export type AreaRequirement = { minM2?: number; maxM2?: number };
export type ProgramSpaceRequirement = { id: string; name: string; spaceType: string; activities: string[]; userTypes: string[]; occupancy?: number; area?: AreaRequirement; dimensions?: { minWidthM?: number; minDepthM?: number; minHeightM?: number }; access?: string[]; privacy?: "public" | "semi-public" | "private" | "restricted"; environmental?: Record<string, string | number>; services?: string[]; accessibility?: string[]; relationships: ProgramRelationship[]; evidence: ProgramEvidence[]; provenance: ProgramProvenance; epistemicState: ProgramEpistemicState; applicability: ProgramApplicability };
export type ArchitecturalProgram = { schema: "ARKI-ARCHITECTURAL-PROGRAM-1.0"; id: string; name: string; spaces: ProgramSpaceRequirement[]; provenance: ProgramProvenance };
export type ProgramRelationship = { id: string; sourceSpace: string; targetSpace: string; relationType: ProgramRelationType; priority: ProgramPriority; epistemicState: ProgramEpistemicState; evidence: ProgramEvidence[]; provenance: ProgramProvenance; applicability: ProgramApplicability };
export type ObservedProgramRelationship = Omit<ProgramRelationship, "priority" | "epistemicState"> & { priority?: ProgramPriority; epistemicState: "OBSERVED" | "INFERRED" | "UNKNOWN" };
export type ObservedProjectState = { projectId: string; spaces: ConstructionSpace[]; relationships: ObservedProgramRelationship[] };
export type ProgramProblem = { kind: "CONFLICT_DETECTED" | "MISSING_REQUIREMENT" | "UNKNOWN" | "VIOLATED" | "NOT_APPLICABLE"; relationIds: string[]; message: string };
export type ProgramEvaluationResult = { schema: "ARKI-PROGRAM-EVALUATION-1.0"; projectId: string; satisfiedRelations: string[]; violatedRelations: string[]; unknownRelations: string[]; notApplicableRelations: string[]; missingRequirements: string[]; conflicts: string[]; diagnostics: ProgramProblem[]; evidence: ProgramEvidence[]; provenance: ProgramProvenance; computedAt: "DETERMINISTIC" };

export function observedProjectFromConstructionModel(model: ConstructionModel): ObservedProjectState { return { projectId: model.projectId, spaces: model.spaces.map((space) => ({ ...space, wallIds: [...space.wallIds], requisitos: [...space.requisitos] })), relationships: [] }; }
const key = (source: string, target: string, type: string) => `${source}|${target}|${type}`;
const exact = (observed: ObservedProgramRelationship[], expected: ProgramRelationship) => observed.find((item) => item.sourceSpace === expected.sourceSpace && item.targetSpace === expected.targetSpace && item.relationType === expected.relationType);
const opposite: Partial<Record<ProgramRelationType, ProgramRelationType>> = { ADJACENT_TO: "SEPARATED_FROM", SEPARATED_FROM: "ADJACENT_TO", DIRECT_ACCESS_TO: "SEPARATED_FROM" };
const oppositeOf = (relationType: ProgramRelationType): ProgramRelationType | undefined => opposite[relationType];
const isApplicable = (relationship: ProgramRelationship) => relationship.applicability !== undefined && Object.keys(relationship.applicability).length > 0;

export function evaluateArchitecturalProgram(program: ArchitecturalProgram, observed: ObservedProjectState): ProgramEvaluationResult {
  const allRequirements = program.spaces.flatMap((space) => [space, ...space.relationships]);
  const dedup = new Map<string, ProgramRelationship>();
  for (const relationship of program.spaces.flatMap((space) => space.relationships)) dedup.set(key(relationship.sourceSpace, relationship.targetSpace, relationship.relationType), relationship);
  const relationships = Array.from(dedup.values()).sort((a, b) => a.id.localeCompare(b.id));
  const spaceIds = new Set(observed.spaces.map((space) => space.id));
  const satisfiedRelations: string[] = [], violatedRelations: string[] = [], unknownRelations: string[] = [], notApplicableRelations: string[] = [], conflicts: string[] = [], diagnostics: ProgramProblem[] = [];
  for (const relationship of relationships) {
    if (!isApplicable(relationship)) { notApplicableRelations.push(relationship.id); diagnostics.push({ kind: "NOT_APPLICABLE", relationIds: [relationship.id], message: "Applicability is not declared." }); continue; }
    if (!spaceIds.has(relationship.sourceSpace) || !spaceIds.has(relationship.targetSpace)) { unknownRelations.push(relationship.id); diagnostics.push({ kind: "UNKNOWN", relationIds: [relationship.id], message: "Required space is missing from observed Project State." }); continue; }
    const conflicting = relationships.find((other) => other.id !== relationship.id && other.sourceSpace === relationship.sourceSpace && other.targetSpace === relationship.targetSpace && oppositeOf(relationship.relationType) === other.relationType && other.priority === relationship.priority);
    if (conflicting) { conflicts.push(relationship.id, conflicting.id); diagnostics.push({ kind: "CONFLICT_DETECTED", relationIds: [relationship.id, conflicting.id], message: "Contradictory relations have equal priority; neither is selected silently." }); continue; }
    const found = exact(observed.relationships, relationship);
    if (found) { satisfiedRelations.push(relationship.id); continue; }
    const oppositeFound = observed.relationships.some((item) => item.sourceSpace === relationship.sourceSpace && item.targetSpace === relationship.targetSpace && item.relationType === oppositeOf(relationship.relationType));
    if (oppositeFound && relationship.priority === "MANDATORY") { violatedRelations.push(relationship.id); diagnostics.push({ kind: "VIOLATED", relationIds: [relationship.id], message: "Observed project contains an explicit incompatible relation." }); continue; }
    unknownRelations.push(relationship.id); diagnostics.push({ kind: "UNKNOWN", relationIds: [relationship.id], message: relationship.priority === "PREFERENCE" ? "Preference is not demonstrated; it is not treated as a mandatory violation." : "Insufficient project evidence to determine satisfaction." });
  }
  const missingRequirements = program.spaces.filter((space) => !spaceIds.has(space.id)).map((space) => space.id).sort();
  for (const id of missingRequirements) diagnostics.push({ kind: "MISSING_REQUIREMENT", relationIds: [], message: `Program space ${id} is absent from Project State.` });
  return { schema: "ARKI-PROGRAM-EVALUATION-1.0", projectId: observed.projectId, satisfiedRelations: Array.from(new Set(satisfiedRelations)).sort(), violatedRelations: Array.from(new Set(violatedRelations)).sort(), unknownRelations: Array.from(new Set(unknownRelations)).sort(), notApplicableRelations: Array.from(new Set(notApplicableRelations)).sort(), missingRequirements, conflicts: Array.from(new Set(conflicts)).sort(), diagnostics, evidence: program.spaces.flatMap((space) => space.evidence), provenance: { ...program.provenance, transformations: [...program.provenance.transformations] }, computedAt: "DETERMINISTIC" };
}

export function createProgram(input: Omit<ArchitecturalProgram, "schema">): ArchitecturalProgram { return { schema: "ARKI-ARCHITECTURAL-PROGRAM-1.0", ...input, spaces: input.spaces.map((space) => ({ ...space, relationships: [...space.relationships], evidence: [...space.evidence] })) }; }
export function programRelationship(input: Omit<ProgramRelationship, "id"> & { id?: string }): ProgramRelationship { return { ...input, id: input.id ?? key(input.sourceSpace, input.targetSpace, input.relationType) }; }
export function programStateFromSpaces(projectId: string, spaces: ConstructionSpace[], relationships: ObservedProgramRelationship[] = []): ObservedProjectState { return { projectId, spaces, relationships }; }
