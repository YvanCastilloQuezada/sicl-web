import type { LayoutScale } from "../capabilityFabric/multiscaleLayout";
import type { D2AuthorityToken } from "../d2Authority";

export type SpatialReasoningFailureCode =
  | "SPACE_ID_REQUIRED" | "SPACE_PROVENANCE_INVALID" | "SPACE_LIFECYCLE_INVALID" | "DUPLICATE_SPACE_ID" | "INVALID_SPACE_REFERENCE"
  | "METRIC_SEMANTICS_REQUIRED" | "METRIC_TOLERANCE_REQUIRED" | "METRIC_THRESHOLD_REQUIRED" | "METRIC_UNIT_REQUIRED"
  | "RULE_AUTHORITY_REQUIRED" | "REGULATORY_RECLASSIFICATION_FORBIDDEN" | "RULE_NOT_APPLICABLE"
  | "GENERATION_TRACE_INCONSISTENT" | "CANDIDATE_CANONICALIZATION_FORBIDDEN"
  | "SOLVER_DECLARATION_INTEGRITY_FAILED" | "SOLVER_DECLARATION_MUTATED_AFTER_EXECUTION"
  | "SOLVER_NONDETERMINISM_DETECTED" | "EXECUTION_ENVELOPE_IMMUTABLE"
  | "AREA_SEMANTICS_REQUIRED" | "EXCEPTION_NOT_AUTHORIZED" | "EXCEPTION_SCOPE_INVALID" | "EXCEPTION_DATE_INVALID" | "EXCEPTION_OUTDATED"
  | "CANDIDATE_OUTDATED" | "CANDIDATE_STATUS_INVALID" | "PARTI_INTERPRETATION_REQUIRED" | "PRELIMINARY_GEOMETRY_INVALID";

export type EvidenceClass = "HECHO" | "SUPUESTO" | "OBJETIVO" | "RESTRICCION" | "PREFERENCIA" | "DECISION" | "UNKNOWN";
export type RuleSource = "LAW_REGULATION" | "PROJECT_REQUIREMENT" | "FUNCTIONAL_REQUIREMENT" | "TYPOLOGICAL_KNOWLEDGE" | "BEST_PRACTICE" | "REFERENCE_MANUAL" | "DESIGNER_PREFERENCE" | "PROJECT_DECISION";
export type Enforcement = "REGULATORY_HARD" | "PROJECT_HARD" | "SOFT" | "PREFERENCE" | "ADVISORY";
export type RuleStage = "KNOWLEDGE" | "CANDIDATE_RULE" | "AUTHORIZED_EXECUTABLE_RULE";
export type ApplicabilityStatus = "APPLICABLE" | "NOT_APPLICABLE" | "UNKNOWN";
export type RelationshipType = "AREA" | "DIRECT_ADJACENCY" | "MINIMUM_DISTANCE" | "BARRIER_REQUIRED" | "CIRCULATION_SEPARATION" | "ZONE_SEPARATION" | "REQUIRED_ACCESS" | "ALLOWED_ACCESS" | "PROHIBITED_ACCESS" | "CONTROLLED_ACCESS";
export type SolverClass = "DETERMINISTIC_SOLVER" | "SEEDED_STOCHASTIC_SOLVER" | "DECLARED_NONDETERMINISTIC_SOLVER";
export type ExecutionState = "PREPARED" | "EXECUTING" | "COMPLETED" | "FAILED";

export interface EvidenceRef { evidenceId: string; classification: EvidenceClass; sourceRef: string; }
export interface SpaceIdentity { spaceId: string; provenance: "DECLARED_BY_D2" | "DECLARED_BY_ARCHITECT" | "PROPOSED_BY_LAYOUT" | "DERIVED_BY_LAYOUT"; lifecycle: "CONCEPTUAL" | "TOPOLOGICAL" | "AUTHORIZED_FOR_MATERIALIZATION" | "MATERIALIZED"; }
export interface MetricSemantics { measurementDomain?: "BOUNDARY_CONTACT" | "BOUNDARY_CLEARANCE" | "CENTROID_DISTANCE" | "BOUNDING_BOX_CLEARANCE"; metricType?: "EUCLIDEAN" | "GEODESIC" | "MANHATTAN"; representationSpace?: "PRELIMINARY_SPATIAL_REPRESENTATION"; tolerance?: number; threshold?: number; unit?: string; }
export interface ApplicabilityEnvelope { typologies: readonly string[]; jurisdictions: readonly string[]; scales: readonly LayoutScale[]; applicableToSubtypes?: boolean; appliesToDescendants?: boolean; appliesToAncestors?: boolean; }
export type AreaType = "NET_FLOOR" | "GROSS_FLOOR" | "CONSTRUCTED" | "USABLE" | "FREE";
export type AreaAggregationScope = "SPACE" | "ZONE" | "LEVEL" | "BUILDING" | "SITE";
export interface AreaSemantics { areaType: AreaType; aggregationScope: AreaAggregationScope; target?: number; minimum?: number; maximum?: number; unit: "m2"; }
export interface SpatialRelationship { relationshipId: string; relationshipType: RelationshipType; subjectSpaceId: string; objectSpaceId?: string; metric?: MetricSemantics; area?: AreaSemantics; evidence: readonly EvidenceRef[]; }
export interface SpatialRule { ruleId: string; source: RuleSource; authorityRef?: string; applicability: ApplicabilityEnvelope; enforcement: Enforcement; stage: RuleStage; relationship: SpatialRelationship; evidence: readonly EvidenceRef[]; }
export interface AuthorizedSpatialRule extends SpatialRule { stage: "AUTHORIZED_EXECUTABLE_RULE"; d2AuthorityToken?: D2AuthorityToken; }

export interface UnknownRecord { unknownId: string; subject: string; reason: string; criticality?: "CRITICAL" | "IMPORTANT" | "MINOR"; blocking: boolean; evidence: readonly EvidenceRef[]; resolutionPath: string; }
export type ExceptionVerificationStatus = "UNVERIFIED" | "VERIFIED" | "REJECTED" | "EXPIRED" | "REVOKED" | "OUTDATED";
export interface AuthorizedException { exceptionId:string; affectedRuleId:string; issuingAuthority:string; documentReference:string; documentHash:string; effectiveDate:string; expirationDate?:string; scope:string; proof:string; evidence:readonly EvidenceRef[]; verificationStatus:ExceptionVerificationStatus; }
export interface PartiInterpretation { interpretationId:string; sourceRef:string; sourceVersion:string; ambiguity:string; authorizedInterpretation:string; authorityRef:string; evidence:readonly EvidenceRef[]; programVersion:string; status:"AUTHORIZED"|"OUTDATED"|"REJECTED"; interpretationHash:string; }
export type PreliminaryGeometry =
 | {kind:"AXIS_ALIGNED_BOX";canonical:false;preliminaryGeometry:true;agkOperational:false}
 | {kind:"CONVEX_PRISM";canonical:false;preliminaryGeometry:true;agkOperational:false}
 | {kind:"BOUNDED_CONVEX_POLYHEDRON";canonical:false;preliminaryGeometry:true;agkOperational:false;faceCount:number}
 | {kind:"ABSTRACT_VOLUMETRIC_CELL";canonical:false;preliminaryGeometry:true;agkOperational:false};
export interface ConflictReport { status: "UNSAT"; conflictingRuleIds: readonly string[]; affectedSpaceIds: readonly string[]; reportableMus: readonly (readonly string[])[]; musMinimalityScope: "DISCOVERED_SET"; diagnosticCompleteness: "EXHAUSTIVE" | "BOUNDED" | "PARTIAL"; searchBounds: string; terminationReason: string; possibleResolutionPaths: readonly string[]; }
export interface GenerationTraceEvent { eventId:string; kind:"GENERATED"|"EVALUATED"|"PRUNED"|"RETAINED"; candidateId:string; reason?:string; }
export interface GenerationTrace { events:readonly GenerationTraceEvent[]; terminationReason:string; searchBounds:string; semanticTraceHash:string; }
export interface GenerationMetadata { generated: number; evaluated: number; retained: number; programHash: string; ruleSetHash: string; knowledgePackHashes: readonly string[]; solverVersion: string; solverConfigurationHash: string; searchBounds: string; generationRunId: string; generationCertificationStatus?: "VERIFIED" | "UNVERIFIED" | "FAILED"; semanticTraceHash?: string; trace?:GenerationTrace; }
export interface LayoutCandidate { candidateId: string; programVersion: string; spaceIds: readonly string[]; satisfiedRelationshipIds: readonly string[]; violatedRelationshipIds: readonly string[]; unknownRelationshipIds: readonly string[]; unknowns: readonly UnknownRecord[]; generationMetadata: GenerationMetadata; status:"CURRENT"|"OUTDATED"|"ARCHIVED"|"REJECTED"; partiInterpretationHash?:string; canonical: false; preliminaryGeometry?: PreliminaryGeometry; }

export interface SolverClassDeclaration { declarationId: string; generationRunId: string; solverClass: SolverClass; solverVersion: string; solverConfigurationHash: string; baselineHashes: readonly string[]; searchBounds: string; randomSeed?: string; nondeterminismSource?: string; reproducibilityGuarantee: string; repeatabilityLimitations?: string; declarationHash: string; }
export interface ExecutionEnvelope { generationRunId: string; programHash: string; ruleSetHash: string; knowledgePackHashes: readonly string[]; partiInterpretationHash?: string; solverClassDeclarationHash: string; solverVersion: string; solverConfigurationHash: string; searchBounds: string; randomSeed?: string; envelopeHash: string; executionState: ExecutionState; }
export interface SemanticTrace { candidateIds: readonly string[]; relationshipOutcomes: readonly string[]; conflictMusIds: readonly string[]; }
export interface ReproducibilityCheck { generationCertificationStatus: "VERIFIED" | "UNVERIFIED" | "FAILED"; semanticTraceHash: string; }

export type SpatialResult<T> = { ok: true; value: T } | { ok: false; code: SpatialReasoningFailureCode };
