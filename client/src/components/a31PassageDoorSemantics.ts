import type { ResidentialPlan } from "./residentialConstructivePlan";
import { deriveA30OpeningConnections, deriveA30OpeningObservations, legacyOpeningEvidence, type A30OpeningEvidence, type A30OpeningObservation } from "./a30ArchitecturalOpenings";

export type A31PassageRole = "INTERNAL_PASSAGE" | "ENTRY_PASSAGE" | "SERVICE_PASSAGE" | "UNKNOWN";
export type A31DoorOperation = "SWING" | "SLIDING" | "FOLDING" | "AUTOMATIC" | "UNKNOWN";
export type A31ThresholdState = "PRESENT" | "ABSENT" | "UNKNOWN";
export type A31SemanticState = "OBSERVED" | "UNVERIFIED" | "STALE" | "NOT_ESTABLISHED";

export type A31DoorEvidence = {
  sourceOpeningId: string;
  passageRole: A31PassageRole;
  operation: A31DoorOperation;
  clearWidthM: number;
  threshold: { state: A31ThresholdState; heightM?: number; evidenceRefs: string[] };
  leafCount?: number;
  swingDirection?: "INWARD" | "OUTWARD" | "BOTH" | "NOT_APPLICABLE" | "UNKNOWN";
  fireRating?: string;
  sourceAlternativeId: string;
  geometryVersion: string;
  evidenceRefs: string[];
  provenance: string[];
  epistemicState: "FACT" | "HYPOTHESIS" | "DERIVED" | "UNKNOWN";
  humanReviewState: "REQUIRED" | "CONFIRMED" | "NOT_STARTED";
};

export type A31PassageDoorObservation = {
  openingId: string;
  levelId: string;
  fromSpaceId: string;
  toSpaceId?: string;
  a30Binding: A30OpeningObservation["bindingState"];
  a30Connection: "CONNECTION_OBSERVED" | "CONNECTION_UNVERIFIED" | "CONNECTION_NOT_ESTABLISHED" | "NOT_APPLICABLE";
  passageRole: A31PassageRole;
  doorSemantics: A31SemanticState;
  operation: A31DoorOperation;
  clearWidthM?: number;
  clearWidthState: "OBSERVED" | "DECLARED" | "UNKNOWN";
  threshold: { state: A31ThresholdState; heightM?: number; evidenceRefs: string[] };
  leafCount?: number;
  swingDirection: A31DoorEvidence["swingDirection"];
  fireRating?: string;
  evidenceRefs: string[];
  provenance: string[];
  epistemicState: A31DoorEvidence["epistemicState"];
  humanReviewState: A31DoorEvidence["humanReviewState"];
  accessibility: "NOT_ASSESSED";
  regulatoryStatus: "NOT_ASSESSED";
  warnings: string[];
};

function missingObservation(plan: ResidentialPlan, opening: A30OpeningObservation): A31PassageDoorObservation {
  return {
    openingId: opening.openingId,
    levelId: opening.levelId,
    fromSpaceId: opening.hostSpaceId,
    toSpaceId: opening.relatedSpaceId,
    a30Binding: opening.bindingState,
    a30Connection: "NOT_APPLICABLE",
    passageRole: "UNKNOWN",
    doorSemantics: opening.staleReasons.length ? "STALE" : "NOT_ESTABLISHED",
    operation: "UNKNOWN",
    clearWidthState: "UNKNOWN",
    threshold: { state: "UNKNOWN", evidenceRefs: [] },
    swingDirection: "UNKNOWN",
    evidenceRefs: opening.evidenceRefs,
    provenance: [...opening.provenance, "A31 legacy opening audit"],
    epistemicState: "UNKNOWN",
    humanReviewState: "REQUIRED",
    accessibility: "NOT_ASSESSED",
    regulatoryStatus: "NOT_ASSESSED",
    warnings: ["A30 opening evidence has no explicit A31 passage/door evidence.", "Legacy ResidentialOpening.kind is not promoted to Door semantics."]
  };
}

export function deriveA31PassageDoorObservation(plan: ResidentialPlan, opening: A30OpeningObservation, evidence?: A31DoorEvidence): A31PassageDoorObservation {
  if (!evidence || evidence.sourceOpeningId !== opening.openingId) return missingObservation(plan, opening);
  const sameSource = evidence.sourceAlternativeId === plan.alternativeId;
  const sameGeometry = evidence.geometryVersion === "HOUSE-001-EXPLICIT:v1";
  const a30Connection = opening.relatedSpaceId ? deriveA30OpeningConnections(plan, [opening])[0]?.state ?? "CONNECTION_NOT_ESTABLISHED" : "NOT_APPLICABLE";
  const validBinding = opening.bindingState === "VALID" && sameSource && sameGeometry;
  const validWidth = Number.isFinite(evidence.clearWidthM) && evidence.clearWidthM > 0;
  const warnings = [...(!validBinding ? ["A31 evidence is not bound to a current valid A30 opening."] : []), ...(!validWidth ? ["CLEAR_WIDTH is missing or invalid."] : []), ...(evidence.threshold.state === "PRESENT" && evidence.threshold.heightM === undefined ? ["Threshold presence is asserted without measured height."] : [])];
  return {
    openingId: opening.openingId,
    levelId: opening.levelId,
    fromSpaceId: opening.hostSpaceId,
    toSpaceId: opening.relatedSpaceId,
    a30Binding: opening.bindingState,
    a30Connection,
    passageRole: evidence.passageRole,
    doorSemantics: validBinding && validWidth ? "OBSERVED" : sameSource && sameGeometry ? "UNVERIFIED" : "STALE",
    operation: evidence.operation,
    clearWidthM: evidence.clearWidthM,
    clearWidthState: "OBSERVED",
    threshold: evidence.threshold,
    leafCount: evidence.leafCount,
    swingDirection: evidence.swingDirection,
    fireRating: evidence.fireRating,
    evidenceRefs: [...opening.evidenceRefs, ...evidence.evidenceRefs],
    provenance: [...opening.provenance, ...evidence.provenance, "A31.deriveA31PassageDoorObservation"],
    epistemicState: evidence.epistemicState,
    humanReviewState: evidence.humanReviewState,
    accessibility: "NOT_ASSESSED",
    regulatoryStatus: "NOT_ASSESSED",
    warnings
  };
}

export function auditA31PassageDoorSemantics(plan: ResidentialPlan): { state: "PARTIAL_BUT_REUSABLE"; observations: A31PassageDoorObservation[]; legacyCount: number; explicitDoorCount: number; warnings: string[] } {
  const a30 = deriveA30OpeningObservations(plan, legacyOpeningEvidence(plan));
  const observations = a30.map((opening) => deriveA31PassageDoorObservation(plan, opening));
  return { state: "PARTIAL_BUT_REUSABLE", observations, legacyCount: observations.length, explicitDoorCount: observations.filter((item) => item.doorSemantics === "OBSERVED").length, warnings: ["No A31 door evidence is present in HOUSE-001.", "Existing kind=DOOR values remain legacy metadata.", "Accessibility and regulatory status remain NOT_ASSESSED."] };
}

export function validateA31DoorEvidence(evidence: A31DoorEvidence): string[] {
  const errors: string[] = [];
  if (!evidence.sourceOpeningId) errors.push("SOURCE_OPENING_REQUIRED");
  if (!Number.isFinite(evidence.clearWidthM) || evidence.clearWidthM <= 0) errors.push("CLEAR_WIDTH_INVALID");
  if (!evidence.evidenceRefs.length) errors.push("EVIDENCE_REQUIRED");
  if (!evidence.provenance.length) errors.push("PROVENANCE_REQUIRED");
  if (evidence.threshold.state === "PRESENT" && evidence.threshold.heightM !== undefined && evidence.threshold.heightM < 0) errors.push("THRESHOLD_HEIGHT_INVALID");
  return errors;
}

export function buildA31SyntheticDoorEvidence(plan: ResidentialPlan, opening: A30OpeningEvidence): A31DoorEvidence {
  return { sourceOpeningId: opening.openingId, passageRole: "INTERNAL_PASSAGE", operation: "SWING", clearWidthM: 0.9, threshold: { state: "ABSENT", evidenceRefs: ["TEST_FIXTURE:threshold-absent"] }, leafCount: 1, swingDirection: "INWARD", sourceAlternativeId: plan.alternativeId, geometryVersion: "HOUSE-001-EXPLICIT:v1", evidenceRefs: ["TEST_FIXTURE:A31-DOOR"], provenance: ["human supplied test fixture"], epistemicState: "FACT", humanReviewState: "REQUIRED" };
}
