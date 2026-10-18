import type { EpistemicStatus, KState, Scope, UnknownRecord } from "./arkiKnowledgeCorpusFoundation";

/**
 * Block 2 semantic contract.
 * These are bounded candidate rules, not automatically promoted architectural facts.
 */
export type SpaceKind = "SPACE" | "ROOM" | "CIRCULATION_SPACE" | "PATIO" | "GALLERY" | "VOID" | "THRESHOLD" | "CORE" | "EXTERIOR" | "UNKNOWN";
export type BoundaryKind = "OPEN_AIR" | "VISUAL" | "ACOUSTIC" | "ACCESS_CONTROL" | "TEMPORAL" | "VEGETAL" | "MATERIAL" | "GEOMETRIC" | "CONSTRUCTIVE" | "UNKNOWN";
export type BoundaryDecision = "NOT_REQUIRED" | "CONDITIONAL" | "REQUIRED" | "UNKNOWN";

export type SpaceSemanticInput = {
  id: string;
  activities: string[];
  identifiableExtent: boolean;
  enclosure: "OPEN" | "PARTIAL" | "CLOSED" | "UNKNOWN";
  dedicatedUse: boolean | "SHARED" | "UNKNOWN";
  accessCondition: string | null;
  continuity: "CONTINUOUS" | "DISCRETE" | "UNKNOWN";
  evidenceIds?: string[];
};

export type SpaceSemanticClassification = {
  spaceId: string;
  classification: SpaceKind;
  isSpace: true;
  isRoom: boolean;
  why: string;
  epistemicStatus: EpistemicStatus;
  kState: KState;
  evidenceIds: string[];
  unknowns: UnknownRecord[];
};

export type BoundarySemanticInput = {
  boundaryId: string;
  differentiatedActivities: string[];
  requirement: "VISUAL" | "ACOUSTIC" | "ACCESS" | "SECURITY" | "PRIVACY" | "THERMAL" | "UNKNOWN";
  sharedAirAllowed: boolean | "UNKNOWN";
  sharedLightAllowed: boolean | "UNKNOWN";
  sharedCirculationAllowed: boolean | "UNKNOWN";
  separationCanBeTemporal: boolean | "UNKNOWN";
  wallEvidence: boolean | "UNKNOWN";
  evidenceIds?: string[];
};

export type BoundarySemanticResolution = {
  boundaryId: string;
  boundaryKind: BoundaryKind;
  wallDecision: BoundaryDecision;
  requiredEffect: string;
  possibleRealizations: BoundaryKind[];
  why: string;
  epistemicStatus: EpistemicStatus;
  kState: KState;
  evidenceIds: string[];
  unknowns: UnknownRecord[];
};

export type SpatialSemanticRule = {
  knowledgeId: string;
  statement: string;
  epistemicStatus: "HYPOTHESIS";
  kState: "K2_CANDIDATE";
  scope: Scope;
  promotion: "HUMAN_REVIEW_REQUIRED";
};

export const BLOCK_2_RULES: SpatialSemanticRule[] = [
  { knowledgeId: "ARKI-B2-K-SPACE-ROOM-001", statement: "ROOM is a bounded, identifiable SPACE whose enclosure, access and use evidence justify treating it as a discrete room; SPACE does not imply ROOM.", epistemicStatus: "HYPOTHESIS", kState: "K2_CANDIDATE", scope: { scale: "UNIT_FUNCTIONAL", activity: "ANY", scenario: "ARCHITECTURAL_SYNTHESIS" }, promotion: "HUMAN_REVIEW_REQUIRED" },
  { knowledgeId: "ARKI-B2-K-BOUNDARY-WALL-001", statement: "WALL is one constructive realization of a SPATIAL_BOUNDARY; a boundary requirement must be resolved by required effect before selecting a wall.", epistemicStatus: "HYPOTHESIS", kState: "K2_CANDIDATE", scope: { scale: "UNIT_FUNCTIONAL", scenario: "ARCHITECTURAL_SYNTHESIS" }, promotion: "HUMAN_REVIEW_REQUIRED" },
  { knowledgeId: "ARKI-B2-K-BOUNDARY-WALL-002", statement: "Perceptual differentiation with shared air, light and circulation does not automatically require a wall.", epistemicStatus: "HYPOTHESIS", kState: "K2_CANDIDATE", scope: { scale: "UNIT_FUNCTIONAL", scenario: "ARCHITECTURAL_SYNTHESIS" }, promotion: "HUMAN_REVIEW_REQUIRED" },
];

function unknown(id: string, statement: string, blockedScope: Scope): UnknownRecord {
  return { unknownId: id, statement, whyItMatters: "The missing condition changes the possible spatial realization.", affectedCapability: "SPACE_BOUNDARY_SEMANTICS", blockedScope, resolutionPath: "Collect project evidence and obtain human architect review.", resolverAuthority: "HUMAN_ARCHITECT" };
}

export function classifySpace(input: SpaceSemanticInput): SpaceSemanticClassification {
  const evidenceIds = input.evidenceIds ?? [];
  const unknowns: UnknownRecord[] = [];
  const canBeRoom = input.identifiableExtent && input.enclosure === "CLOSED" && input.dedicatedUse !== "SHARED" && input.dedicatedUse !== "UNKNOWN" && Boolean(input.accessCondition) && input.continuity !== "UNKNOWN";
  if (input.enclosure === "UNKNOWN") unknowns.push(unknown(`${input.id}-ENCLOSURE`, "Whether the space is open, partial or closed is unknown.", { scale: "UNIT_FUNCTIONAL" }));
  if (input.dedicatedUse === "UNKNOWN") unknowns.push(unknown(`${input.id}-USE`, "Whether use is dedicated or shared is unknown.", { activity: "UNKNOWN", scale: "UNIT_FUNCTIONAL" }));
  if (!input.accessCondition) unknowns.push(unknown(`${input.id}-ACCESS`, "Access condition is not specified.", { scale: "UNIT_FUNCTIONAL" }));
  const classification: SpaceKind = canBeRoom ? "ROOM" : input.continuity === "CONTINUOUS" ? "SPACE" : "SPACE";
  return { spaceId: input.id, classification, isSpace: true, isRoom: canBeRoom, why: canBeRoom ? "Closed identifiable extent, access and dedicated-use evidence support a room classification." : "The entity remains a SPACE because room-level enclosure, access or use evidence is incomplete or indicates shared/open operation.", epistemicStatus: "HYPOTHESIS", kState: "K2_CANDIDATE", evidenceIds, unknowns };
}

export function resolveSpatialBoundary(input: BoundarySemanticInput): BoundarySemanticResolution {
  const evidenceIds = input.evidenceIds ?? [];
  const unknowns: UnknownRecord[] = [];
  const sharedAll = input.sharedAirAllowed === true && input.sharedLightAllowed === true && input.sharedCirculationAllowed === true;
  const perceptualOnly = ["VISUAL", "PRIVACY"].includes(input.requirement) && sharedAll;
  const wallDecision: BoundaryDecision = perceptualOnly && input.wallEvidence !== true ? "NOT_REQUIRED" : input.requirement === "UNKNOWN" || input.wallEvidence === "UNKNOWN" || input.sharedAirAllowed === "UNKNOWN" || input.sharedLightAllowed === "UNKNOWN" || input.sharedCirculationAllowed === "UNKNOWN" ? "UNKNOWN" : input.wallEvidence === true ? "REQUIRED" : "CONDITIONAL";
  if (input.requirement === "UNKNOWN") unknowns.push(unknown(`${input.boundaryId}-EFFECT`, "The required differentiating effect is unknown.", { scale: "UNIT_FUNCTIONAL" }));
  if (input.wallEvidence === "UNKNOWN") unknowns.push(unknown(`${input.boundaryId}-WALL-EVIDENCE`, "Evidence requiring a wall has not been supplied.", { scale: "UNIT_FUNCTIONAL" }));
  const boundaryKind: BoundaryKind = input.requirement === "VISUAL" ? "VISUAL" : input.requirement === "ACOUSTIC" ? "ACOUSTIC" : input.requirement === "ACCESS" || input.requirement === "SECURITY" ? "ACCESS_CONTROL" : input.separationCanBeTemporal === true ? "TEMPORAL" : "UNKNOWN";
  const possibleRealizations: BoundaryKind[] = boundaryKind === "VISUAL" ? ["VISUAL", "VEGETAL", "MATERIAL", "GEOMETRIC", "CONSTRUCTIVE"] : boundaryKind === "ACCESS_CONTROL" ? ["ACCESS_CONTROL", "TEMPORAL", "MATERIAL", "CONSTRUCTIVE"] : boundaryKind === "UNKNOWN" ? ["UNKNOWN"] : [boundaryKind, "MATERIAL", "CONSTRUCTIVE"];
  return { boundaryId: input.boundaryId, boundaryKind, wallDecision, requiredEffect: input.requirement === "UNKNOWN" ? "UNKNOWN" : input.requirement, possibleRealizations, why: wallDecision === "NOT_REQUIRED" ? "The stated effect is perceptual and the activities may share air, light and circulation; a wall is not required by this input alone." : wallDecision === "REQUIRED" ? "A wall is supported only because explicit wall evidence is present; its dimensions and construction remain separate unknowns." : "The required effect is identified, but the physical realization remains conditional on project evidence.", epistemicStatus: "HYPOTHESIS", kState: "K2_CANDIDATE", evidenceIds, unknowns };
}

export function wallIsBoundaryRealization(boundary: BoundarySemanticResolution): boolean {
  return boundary.possibleRealizations.includes("CONSTRUCTIVE") && boundary.wallDecision !== "NOT_REQUIRED";
}
