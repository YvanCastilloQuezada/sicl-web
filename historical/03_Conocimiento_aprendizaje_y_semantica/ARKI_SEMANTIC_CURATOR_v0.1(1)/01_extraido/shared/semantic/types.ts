export type ArkiSemanticId = `arki-sem:${string}`;
export type ArkiEntityId = string;

export type SemanticScale =
  | "COUNTRY" | "REGION" | "PROVINCE_METROPOLITAN" | "CITY" | "DISTRICT"
  | "NEIGHBORHOOD" | "BLOCK_PUBLIC_REALM" | "SITE" | "BUILDING"
  | "SYSTEM_ZONE" | "SPACE" | "ACTIVITY" | "OBJECT" | "COMPONENT" | "HUMAN";

export type EpistemicState =
  | "DOCUMENTED" | "CODE_EVIDENCE" | "RUNTIME_EVIDENCE" | "IMPLEMENTED"
  | "VERIFIED" | "E2E_VERIFIED" | "PROFESSIONAL_VALIDATION_REQUIRED"
  | "UNKNOWN" | "PROPOSAL";

export type SemanticStatus = "ACTIVE" | "DEPRECATED" | "PROPOSED";

export type ExternalStandard =
  | "IFC4_3_ADD2" | "BSDD" | "IDS" | "REVIT" | "CAD_ACIR" | "GIS" | "GBXML" | "CUSTOM";

export type MappingKind =
  | "EXACT" | "NARROWER" | "BROADER" | "RELATED" | "REPRESENTATION" | "NO_EQUIVALENT";

export interface ProvenanceRef {
  sourceId: string;
  sourceType: "STANDARD" | "CODE" | "DOCUMENT" | "HUMAN" | "IMPORT" | "OBSERVATION" | "OTHER";
  locator?: string;
  retrievedAt?: string;
  authority?: string;
}

export interface ExternalSemanticMapping {
  standard: ExternalStandard;
  version?: string;
  externalId: string;
  kind: MappingKind;
  provenance: ProvenanceRef[];
  notes?: string;
}

export interface QuantityDefinition {
  key: string;
  dimension: "LENGTH" | "AREA" | "VOLUME" | "MASS" | "COUNT" | "TIME" | "COST" | "ENERGY" | "POWER" | "OTHER";
  canonicalUnit: string;
  derived?: boolean;
}

export interface RelationshipDefinition {
  predicate: string;
  targetSemanticIds?: ArkiSemanticId[];
  inversePredicate?: string;
  cardinality?: "ONE" | "ZERO_OR_ONE" | "MANY";
  scaleConstraints?: SemanticScale[];
}

export interface SemanticConcept {
  id: ArkiSemanticId;
  canonicalName: string;
  definition: string;
  status: SemanticStatus;
  scales: SemanticScale[];
  parentIds: ArkiSemanticId[];
  properties: string[];
  quantities: QuantityDefinition[];
  relationships: RelationshipDefinition[];
  mappings: ExternalSemanticMapping[];
  provenance: ProvenanceRef[];
  epistemicState: EpistemicState;
  schemaVersion: string;
  validFrom?: string;
  deprecatedBy?: ArkiSemanticId;
  aliases?: string[];
  tags?: string[];
}

export interface ExternalIdentity {
  system: ExternalStandard | string;
  externalId: string;
  version?: string;
}

export interface ArkiObjectIdentity {
  arkiEntityId: ArkiEntityId;
  semanticId: ArkiSemanticId;
  externalIdentities: ExternalIdentity[];
  lineage: {
    createdFrom?: string[];
    supersedes?: ArkiEntityId[];
    derivedFrom?: ArkiEntityId[];
  };
  provenance: ProvenanceRef[];
  epistemicState: EpistemicState;
}

export type SemanticChangeKind =
  | "ADD_CONCEPT" | "UPDATE_CONCEPT" | "DEPRECATE_CONCEPT"
  | "ADD_MAPPING" | "ADD_ALIAS";

export interface SemanticChangeProposal {
  proposalId: string;
  kind: SemanticChangeKind;
  targetId?: ArkiSemanticId;
  candidate?: SemanticConcept;
  mapping?: ExternalSemanticMapping;
  alias?: string;
  rationale: string;
  provenance: ProvenanceRef[];
  requestedBy: string;
}

export type CuratorDecision =
  | "REUSE_EXISTING"
  | "MAP_TO_EXISTING"
  | "PROPOSE_NEW"
  | "REJECT_DUPLICATE"
  | "REJECT_UNSUPPORTED"
  | "REQUIRES_HUMAN_AUTHORITY";

export interface CuratorFinding {
  code: string;
  severity: "INFO" | "WARNING" | "ERROR";
  message: string;
  conceptIds?: ArkiSemanticId[];
}

export interface CuratorReview {
  proposalId: string;
  decision: CuratorDecision;
  findings: CuratorFinding[];
  suggestedSemanticId?: ArkiSemanticId;
  canonicalMutation: false;
}
