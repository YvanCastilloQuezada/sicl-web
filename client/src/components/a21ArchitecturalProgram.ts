import {
  detectAdjacencyConflicts,
  deriveAdjacencyRequirements,
  proposeFunctionalZones,
  type AdjacencyRequirement,
  type ProgramNode,
  type SpatialZoneProposal,
} from "./a21SpatialRelationships";
import { buildA29ReadModel } from "./a29BoundaryConnectivity";
import { summarizeA30OpeningAudit } from "./a30ArchitecturalOpenings";
import { generateVerifiedResidentialPlan, type ResidentialPlan } from "./residentialConstructivePlan";

export type A21Direction = "DIRECTED" | "BIDIRECTIONAL";
export type A21SourceClass = "HUMAN_REQUESTED" | "DERIVED" | "AI_PROPOSED" | "UNKNOWN";
export type A21ConflictState = "NONE" | "CONFLICTING";

export type A21ProgramItem = ProgramNode & {
  levelIntent: "N1" | "N2" | "MULTILEVEL" | "UNKNOWN";
  privacyCharacter: "PUBLIC" | "PRIVATE" | "SERVICE" | "TRANSITION" | "UNKNOWN";
};

export type A21RelationshipRecord = {
  sourceNode: string;
  targetNode: string;
  relationship: AdjacencyRequirement["relationType"];
  priority: AdjacencyRequirement["priority"];
  direction: A21Direction;
  sourceClass: A21SourceClass;
  sourceIntent: string;
  epistemicState: AdjacencyRequirement["epistemicState"];
  conflictState: A21ConflictState;
  provenance: string[];
};

export type A21HouseProof = {
  proofId: "HOUSE-A21";
  program: A21ProgramItem[];
  relationships: A21RelationshipRecord[];
  humanSourcedEdges: A21RelationshipRecord[];
  derivedEdges: A21RelationshipRecord[];
  aiProposedEdges: A21RelationshipRecord[];
  unknownRelationships: string[];
  conflicts: string[];
  zones: SpatialZoneProposal[];
  levelOrganization: Array<{ levelId: string; intent: string; source: "HUMAN_INPUT"; epistemicState: "HUMAN_CONFIRMED" }>;
  privacyTransition: string[];
  explanation: string;
  geometryCreated: false;
  decisionCreated: false;
  winnerCreated: false;
  regulatoryClaimCreated: false;
  provenance: string[];
};

export type A21HouseComparison = {
  intendedRelationship: string;
  currentObservationSource: string[];
  a29Result: string;
  a30Result: string;
  a20Result: "NOT_USED_FOR_P1_P2";
  matchState: "OBSERVED_MATCH" | "OBSERVED_MISMATCH" | "NOT_DEMONSTRATED" | "UNKNOWN";
  unknown: string[];
  notes: string[];
};

const human = (sourceIntent: string, sourceProgramId: string, targetProgramId: string, relationType: AdjacencyRequirement["relationType"], priority: AdjacencyRequirement["priority"], extra: Partial<AdjacencyRequirement> = {}): Partial<AdjacencyRequirement> & Pick<AdjacencyRequirement, "sourceProgramId" | "targetProgramId"> => ({
  sourceProgramId,
  targetProgramId,
  relationType,
  priority,
  source: "HUMAN_INPUT",
  epistemicState: "HUMAN_CONFIRMED",
  status: "CONFIRMED",
  rationale: sourceIntent,
  provenance: [`HOUSE-A21.human-intent:${sourceIntent}`],
  ...extra,
});

function buildHouseProgram(): A21ProgramItem[] {
  return [
    { programId: "LIVING_DINING", name: "Living / dining", zoneType: "PUBLIC", privacyLevel: "SOCIAL", levelPreference: "N1", privacyCharacter: "PUBLIC", levelIntent: "N1", provenance: ["HOUSE-A21.program.human"] },
    { programId: "KITCHEN", name: "Kitchen", zoneType: "SERVICE", privacyCharacter: "SERVICE", levelIntent: "N1", provenance: ["HOUSE-A21.program.human"] },
    { programId: "SOCIAL_BATH", name: "Social bath", zoneType: "SERVICE", privacyCharacter: "SERVICE", levelIntent: "N1", provenance: ["HOUSE-A21.program.human"] },
    { programId: "MAIN_BEDROOM", name: "Main bedroom", zoneType: "PRIVATE", privacyLevel: "HIGH", privacyCharacter: "PRIVATE", levelIntent: "N2", provenance: ["HOUSE-A21.program.human"] },
    { programId: "BEDROOM_2", name: "Bedroom 2", zoneType: "PRIVATE", privacyLevel: "HIGH", privacyCharacter: "PRIVATE", levelIntent: "N2", provenance: ["HOUSE-A21.program.human"] },
    { programId: "PRIVATE_BATH", name: "Private bath", zoneType: "SERVICE", privacyCharacter: "SERVICE", levelIntent: "N2", provenance: ["HOUSE-A21.program.human"] },
    { programId: "GROUND_CIRCULATION", name: "Ground circulation", zoneType: "TRANSITION", privacyCharacter: "TRANSITION", levelIntent: "N1", provenance: ["HOUSE-A21.program.human"] },
    { programId: "UPPER_CIRCULATION", name: "Upper circulation", zoneType: "TRANSITION", privacyCharacter: "TRANSITION", levelIntent: "N2", provenance: ["HOUSE-A21.program.human"] },
    { programId: "ACCESS", name: "Access", zoneType: "ACCESS", privacyCharacter: "TRANSITION", levelIntent: "N1", provenance: ["HOUSE-A21.program.human"] },
    { programId: "PATIO", name: "Patio", zoneType: "OUTDOOR", privacyCharacter: "PUBLIC", levelIntent: "N1", provenance: ["HOUSE-A21.program.human"] },
  ];
}

export function buildHouseA21Proof(): A21HouseProof {
  const program = buildHouseProgram();
  const relations = deriveAdjacencyRequirements(program, [
    human("separate social areas from bedrooms", "LIVING_DINING", "MAIN_BEDROOM", "REQUIRED_SEPARATION", "MUST", { sameLevelRequirement: false }),
    human("separate social areas from bedrooms", "LIVING_DINING", "BEDROOM_2", "REQUIRED_SEPARATION", "MUST", { sameLevelRequirement: false }),
    human("relate kitchen and dining", "KITCHEN", "LIVING_DINING", "PREFERRED_ADJACENCY", "SHOULD", { sameLevelRequirement: true }),
    human("maintain visual relation between living/dining and patio", "LIVING_DINING", "PATIO", "VISUAL_CONNECTION", "SHOULD"),
    human("control access to main bedroom from private circulation", "UPPER_CIRCULATION", "MAIN_BEDROOM", "CONTROLLED_ACCESS", "MUST", { sameLevelRequirement: true }),
    human("connect entry to social zone", "ACCESS", "LIVING_DINING", "SEQUENTIAL_RELATION", "MUST", { sameLevelRequirement: true }),
    human("connect N1 and N2 through a vertical core", "GROUND_CIRCULATION", "UPPER_CIRCULATION", "VERTICAL_RELATION", "MUST", { sameLevelRequirement: false }),
  ]);
  const conflicts = detectAdjacencyConflicts(relations);
  const conflictIds = new Set(conflicts.flatMap((pair) => pair.split("|")));
  const byId = new Map(relations.map((relation) => [relation.adjacencyId, relation]));
  const records: A21RelationshipRecord[] = relations.map((relation) => ({
    sourceNode: relation.sourceProgramId,
    targetNode: relation.targetProgramId,
    relationship: relation.relationType,
    priority: relation.priority,
    direction: relation.relationType === "VISUAL_CONNECTION" || relation.relationType === "REQUIRED_SEPARATION" ? "BIDIRECTIONAL" : "DIRECTED",
    sourceClass: relation.source === "HUMAN_INPUT" ? "HUMAN_REQUESTED" : relation.source === "AI_PROPOSED" ? "AI_PROPOSED" : "DERIVED",
    sourceIntent: relation.rationale ?? "No rationale supplied",
    epistemicState: relation.epistemicState,
    conflictState: conflictIds.has(relation.adjacencyId) ? "CONFLICTING" : "NONE",
    provenance: relation.provenance,
  }));
  const zones = proposeFunctionalZones(program, relations);
  const explanation = "Has pedido separar las áreas sociales de los dormitorios, relacionar cocina y comedor, mantener una relación visual entre estar/comedor y patio, y controlar el acceso al dormitorio principal desde la circulación privada. A partir de esas condiciones, la organización funcional propuesta agrupa estar/comedor en la zona pública, cocina y baños en servicio, dormitorios en la zona privada, y circulación y acceso como transición. Esta organización es una hipótesis previa a la geometría y aún no demuestra una planta construible.";
  return {
    proofId: "HOUSE-A21",
    program,
    relationships: records,
    humanSourcedEdges: records.filter((record) => record.sourceClass === "HUMAN_REQUESTED"),
    derivedEdges: records.filter((record) => record.sourceClass === "DERIVED"),
    aiProposedEdges: records.filter((record) => record.sourceClass === "AI_PROPOSED"),
    unknownRelationships: ["BEDROOM_2↔PRIVATE_BATH adjacency not supplied", "Exact accessibility requirements not supplied", "Regulatory requirements not derived"],
    conflicts: conflicts.map((pair) => `Conflict preserved: ${pair}`),
    zones,
    levelOrganization: [{ levelId: "N1", intent: "Predominantly social/service/access", source: "HUMAN_INPUT", epistemicState: "HUMAN_CONFIRMED" }, { levelId: "N2", intent: "Predominantly private", source: "HUMAN_INPUT", epistemicState: "HUMAN_CONFIRMED" }],
    privacyTransition: ["ACCESS → PUBLIC/SOCIAL", "PUBLIC/SOCIAL → TRANSITION/CIRCULATION", "TRANSITION/CIRCULATION → PRIVATE"],
    explanation,
    geometryCreated: false,
    decisionCreated: false,
    winnerCreated: false,
    regulatoryClaimCreated: false,
    provenance: ["HOUSE-A21 human fixture", "A21-P0R", "A21-P1", "A21-P2"],
  };
}

export function buildHouseA21Comparison(plan: ResidentialPlan = generateVerifiedResidentialPlan()): A21HouseComparison {
  const a29 = buildA29ReadModel(plan);
  const a30 = summarizeA30OpeningAudit(plan);
  const kitchenLivingIntent = a29.intentObservations.find((item) => item.from === "LIVING" && item.to === "KITCHEN");
  const opening = a30.existingOpenings.find((item) => item.openingId === "DOOR-LIVING-KITCHEN");
  return {
    intendedRelationship: "KITCHEN ↔ LIVING_DINING / PREFERRED_ADJACENCY",
    currentObservationSource: ["A29 read-only boundary observation", "A30 read-only opening audit", "HOUSE-001-EXPLICIT:v1"],
    a29Result: kitchenLivingIntent?.result === "GEOMETRIC_ADJACENCY_OBSERVED" ? "GEOMETRIC_ADJACENCY_OBSERVED" : "NOT_DEMONSTRATED",
    a30Result: opening?.bindingState === "UNKNOWN" ? "DIRECT_CONNECTION_NOT_DEMONSTRATED" : `OPENING_${opening?.bindingState ?? "UNKNOWN"}`,
    a20Result: "NOT_USED_FOR_P1_P2",
    matchState: kitchenLivingIntent?.result === "GEOMETRIC_ADJACENCY_OBSERVED" ? "OBSERVED_MATCH" : "NOT_DEMONSTRATED",
    unknown: ["Existing HOUSE-001 geometry cannot prove the original human intent", "A shared boundary does not by itself prove architectural quality or regulatory compliance"],
    notes: ["Comparison is read-only and does not mutate HOUSE-001", "Intent is generated from the HOUSE-A21 human fixture, never from existing rectangles", "A30 legacy opening has no explicit extent, so direct connection remains limited"],
  };
}

export function validateHouseA21Proof(proof: A21HouseProof): boolean {
  const ids = new Set(proof.program.map((item) => item.programId));
  return proof.relationships.every((edge) => ids.has(edge.sourceNode) && ids.has(edge.targetNode) && edge.provenance.length > 0 && edge.sourceClass === "HUMAN_REQUESTED")
    && proof.zones.every((zone) => zone.noGeometryMutation && zone.noDecision && zone.provenance.length > 0)
    && proof.geometryCreated === false && proof.decisionCreated === false && proof.winnerCreated === false && proof.regulatoryClaimCreated === false;
}

export function buildA21NegativeControls() {
  const nodes: ProgramNode[] = ["BEDROOM", "STUDY"].map((programId) => ({ programId, name: programId, provenance: ["negative-fixture"] }));
  const noIntent = deriveAdjacencyRequirements(nodes, []);
  const conflict = deriveAdjacencyRequirements(nodes, [human("conflicting fixture", "BEDROOM", "STUDY", "REQUIRED_ADJACENCY", "MUST"), human("conflicting fixture", "BEDROOM", "STUDY", "REQUIRED_SEPARATION", "MUST")]);
  const labelOnly = deriveAdjacencyRequirements([{ programId: "KITCHEN", name: "Kitchen", provenance: ["negative-fixture"] }], []);
  return { missingIntent: { relationshipCount: noIntent.length, state: "UNKNOWN" as const }, conflict: { conflictCount: detectAdjacencyConflicts(conflict).length, preserved: true }, labelOnly: { relationshipCount: labelOnly.length, inferredAdjacency: false }, geometry: { polygons: 0, positions: 0, dimensions: 0, openings: 0, doors: 0, windows: 0, walls: 0 } };
}
