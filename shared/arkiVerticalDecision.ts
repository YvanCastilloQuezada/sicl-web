export type VerticalSystemKind = "LEVEL_BASED" | "SPECIAL_VOLUME" | "HYBRID";

export type VerticalDimensionKind =
  | "FLOOR_TO_FLOOR"
  | "CLEAR_HEIGHT"
  | "ELEVATION"
  | "SPECIAL_VERTICAL";

export type VerticalTarget =
  | { kind: "ELEMENT"; elementProvisionalId: string }
  | { kind: "GROUP"; groupId: string; members: string[] }
  | { kind: "LEVEL"; levelId: string }
  | { kind: "SPECIAL_VOLUME"; volumeId: string; members: string[] }
  | { kind: "WHOLE_PARTI" };

export type VerticalStatus = "RESOLVED" | "UNKNOWN" | "CONFLICTING";
export type VerticalEpistemicStatus = "FACT" | "HYPOTHESIS" | "ASSUMPTION" | "UNKNOWN";
export type VerticalDecisionAuthority = "ARCHITECTURAL_DECISION" | "HUMAN_AUTHORITY" | "UNRESOLVED";

export type CorpusLocator = {
  corpusRef: string;
  corpusVersion?: string;
  work?: string;
  edition?: string;
  volume?: string;
  page?: string;
  section?: string;
};

export type RegulatorySourceAuthority =
  | "RNE"
  | "LOCAL_MUNICIPAL"
  | "SECTOR_SPECIFIC"
  | "INTERNATIONAL"
  | "OTHER_REGULATION";
export type RegulatoryApplicability = "APPLICABLE" | "NOT_APPLICABLE" | "REQUIRES_DETERMINATION";
export type RegulatoryConstraint = {
  kind: "MIN" | "MAX" | "REQUIRED";
  height_mm: number;
  sourceAuthority: RegulatorySourceAuthority;
  jurisdiction?: string;
  buildingType?: string;
  spaceUse?: string;
  applicability: RegulatoryApplicability;
  evidenceRef: string;
  quote?: string;
};

export type DesignReferenceKind =
  | "NEUFERT"
  | "PLAZOLA"
  | "PRECEDENT"
  | "ARCHITECTURAL_LITERATURE"
  | "SIMULATION"
  | "OTHER_REFERENCE";
export type DesignReference = {
  kind: DesignReferenceKind;
  description: string;
  heightRange_mm?: { min: number; max: number };
  evidenceRef: string;
  corpusLocator?: CorpusLocator;
};

export type DesignDriverKind =
  | "SPACE_USE" | "SPATIAL_SCALE" | "TYPOLOGY" | "CLIMATE" | "OCCUPANCY"
  | "VENTILATION" | "THERMAL_COMFORT" | "EQUIPMENT" | "OPERATION"
  | "PROPORTION" | "ARCHITECTURAL_INTENT" | "OTHER";
export type DesignDriverInfluence = "INCREASES" | "DECREASES" | "NEUTRAL" | "CONDITIONAL" | "UNKNOWN";
export type DesignDriver = {
  kind: DesignDriverKind;
  description: string;
  influence: DesignDriverInfluence;
  condition?: string;
  note?: string;
};

export type VerticalExceptionKind =
  | "DOUBLE_HEIGHT" | "VOID" | "ATRIUM" | "AUDITORIUM" | "INDUSTRIAL_VOLUME"
  | "HANGAR" | "EQUIPMENT_REQUIREMENT" | "TECHNICAL_SPACE" | "SPLIT_LEVEL" | "OTHER";
export type VerticalException = {
  kind: VerticalExceptionKind;
  reasoning: string;
  evidenceRefs: string[];
};

export type VerticalEvidence =
  | { kind: "REGULATION"; ref: string; quote?: string }
  | { kind: "OWNER_BRIEF"; ref: string; quote?: string }
  | { kind: "PRECEDENT"; ref: string; note?: string }
  | { kind: "SITE_OBSERVATION"; ref: string }
  | { kind: "ARCHITECT_DECISION"; ref: string; reasoning?: string }
  | { kind: "SIMULATION"; ref: string; note: string };

export type VerticalDecision = {
  decisionId: string;
  target: VerticalTarget;
  dimensionKind: VerticalDimensionKind;
  selectedDimension_mm: number | null;
  regulatoryConstraints: RegulatoryConstraint[];
  designReferences: DesignReference[];
  designDrivers: DesignDriver[];
  reasoning: string;
  status: VerticalStatus;
  epistemicStatus: VerticalEpistemicStatus;
  decisionAuthority: VerticalDecisionAuthority;
  evidence: VerticalEvidence[];
  provenance: string[];
  unknowns: string[];
  conflicts: string[];
  verticalException?: VerticalException;
  humanAuthorityRequired: boolean;
  humanAuthorityRef?: string;
};
