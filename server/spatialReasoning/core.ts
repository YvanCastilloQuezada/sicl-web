import { fingerprint } from "../arkiFingerprint";
import { verifyD2AuthorityToken, type D2AuthorityToken } from "../d2Authority";
import type { ApplicabilityEnvelope, ConflictReport, ExecutionEnvelope, GenerationMetadata, LayoutCandidate, ReproducibilityCheck, SemanticTrace, SolverClassDeclaration, SpatialRelationship, SpatialResult, SpatialRule, SpaceIdentity, UnknownRecord } from "./types";

const dimensional = (v: number | undefined) => v !== undefined;

export function validateSpaces(spaces: readonly SpaceIdentity[]): SpatialResult<readonly SpaceIdentity[]> {
  if (spaces.some(s => !s.spaceId.trim())) return { ok:false, code:"SPACE_ID_REQUIRED" };
  if (new Set(spaces.map(s=>s.spaceId)).size !== spaces.length) return { ok:false, code:"DUPLICATE_SPACE_ID" };
  return { ok:true, value:Object.freeze([...spaces]) };
}

export function validateRelationship(rel: SpatialRelationship, spaces: readonly SpaceIdentity[]): SpatialResult<SpatialRelationship> {
  const ids=new Set(spaces.map(s=>s.spaceId));
  if (!ids.has(rel.subjectSpaceId) || (rel.objectSpaceId !== undefined && !ids.has(rel.objectSpaceId))) return {ok:false,code:"INVALID_SPACE_REFERENCE"};
  if (rel.relationshipType==="DIRECT_ADJACENCY") {
    const m=rel.metric;
    if (!m?.measurementDomain || !m.representationSpace) return {ok:false,code:"METRIC_SEMANTICS_REQUIRED"};
    if (!dimensional(m.tolerance)) return {ok:false,code:"METRIC_TOLERANCE_REQUIRED"};
    if (!m.unit) return {ok:false,code:"METRIC_UNIT_REQUIRED"};
  }
  if (rel.relationshipType==="MINIMUM_DISTANCE") {
    const m=rel.metric;
    if (!m?.measurementDomain || !m.metricType || !m.representationSpace) return {ok:false,code:"METRIC_SEMANTICS_REQUIRED"};
    if (!dimensional(m.threshold)) return {ok:false,code:"METRIC_THRESHOLD_REQUIRED"};
    if (!m.unit) return {ok:false,code:"METRIC_UNIT_REQUIRED"};
  }
  return {ok:true,value:rel};
}

export function determineApplicability(envelope: ApplicabilityEnvelope, context:{typology:string;jurisdiction:string;scale:string}): "APPLICABLE"|"NOT_APPLICABLE" {
  // V0.5: no implicit subtype, territorial or scale inheritance.
  return envelope.typologies.includes(context.typology) && envelope.jurisdictions.includes(context.jurisdiction) && envelope.scales.includes(context.scale as never) ? "APPLICABLE" : "NOT_APPLICABLE";
}

export function authorizeRule(rule: SpatialRule, token?: D2AuthorityToken): SpatialResult<SpatialRule> {
  if (rule.source==="LAW_REGULATION" && rule.enforcement==="REGULATORY_HARD") {
    if (!rule.authorityRef || rule.evidence.length===0) return {ok:false,code:"RULE_AUTHORITY_REQUIRED"};
    return {ok:true,value:{...rule,stage:"AUTHORIZED_EXECUTABLE_RULE"}};
  }
  if (rule.enforcement==="REGULATORY_HARD" && rule.source!=="LAW_REGULATION") return {ok:false,code:"RULE_AUTHORITY_REQUIRED"};
  if (rule.stage==="AUTHORIZED_EXECUTABLE_RULE") {
    if (!token || !verifyD2AuthorityToken(token,rule.ruleId)) return {ok:false,code:"RULE_AUTHORITY_REQUIRED"};
  }
  if (["TYPOLOGICAL_KNOWLEDGE","BEST_PRACTICE","REFERENCE_MANUAL","DESIGNER_PREFERENCE"].includes(rule.source) && rule.enforcement==="PROJECT_HARD") {
    if (!token || !verifyD2AuthorityToken(token,rule.ruleId)) return {ok:false,code:"RULE_AUTHORITY_REQUIRED"};
  }
  return {ok:true,value:{...rule,stage:"AUTHORIZED_EXECUTABLE_RULE"}};
}

export function reclassifyRegulatoryHard(rule: SpatialRule, enforcement: SpatialRule["enforcement"]): SpatialResult<SpatialRule> {
  if (rule.enforcement==="REGULATORY_HARD" && enforcement!=="REGULATORY_HARD") return {ok:false,code:"REGULATORY_RECLASSIFICATION_FORBIDDEN"};
  return {ok:true,value:{...rule,enforcement}};
}

export function validateGenerationMetadata(m: GenerationMetadata): SpatialResult<GenerationMetadata> {
  if (m.retained>m.evaluated || m.evaluated>m.generated) return {ok:false,code:"GENERATION_TRACE_INCONSISTENT"};
  return {ok:true,value:m};
}

export function createCandidate(input: Omit<LayoutCandidate,"canonical"> & {canonical?: boolean}): SpatialResult<LayoutCandidate> {
  if (input.canonical===true) return {ok:false,code:"CANDIDATE_CANONICALIZATION_FORBIDDEN"};
  const metadata=validateGenerationMetadata(input.generationMetadata); if(!metadata.ok)return metadata;
  return {ok:true,value:Object.freeze({...input,canonical:false as const})};
}

function declarationPayload(d: Omit<SolverClassDeclaration,"declarationHash">){ return d; }
export function createSolverDeclaration(input: Omit<SolverClassDeclaration,"declarationHash">): SolverClassDeclaration {
  return Object.freeze({...input,declarationHash:fingerprint(declarationPayload(input))});
}

function envelopePayload(e: Omit<ExecutionEnvelope,"envelopeHash">){ return e; }
export function prepareExecutionEnvelope(input: Omit<ExecutionEnvelope,"envelopeHash"|"executionState">): ExecutionEnvelope {
  const prepared={...input,executionState:"PREPARED" as const};
  return Object.freeze({...prepared,envelopeHash:fingerprint(envelopePayload(prepared))});
}

export function beginExecution(envelope:ExecutionEnvelope,declaration:SolverClassDeclaration):SpatialResult<ExecutionEnvelope>{
  if(envelope.executionState!=="PREPARED" || envelope.solverClassDeclarationHash!==declaration.declarationHash || envelope.generationRunId!==declaration.generationRunId || envelope.solverVersion!==declaration.solverVersion || envelope.solverConfigurationHash!==declaration.solverConfigurationHash || envelope.searchBounds!==declaration.searchBounds || envelope.randomSeed!==declaration.randomSeed) return {ok:false,code:"SOLVER_DECLARATION_INTEGRITY_FAILED"};
  const executing={...envelope,executionState:"EXECUTING" as const};
  return {ok:true,value:Object.freeze({...executing,envelopeHash:fingerprint(envelopePayload(executing))})};
}

export function assertExecutionIntegrity(sealed:ExecutionEnvelope,current:ExecutionEnvelope,declaration:SolverClassDeclaration):SpatialResult<ExecutionEnvelope>{
  if(sealed.executionState!=="EXECUTING") return {ok:false,code:"SOLVER_DECLARATION_INTEGRITY_FAILED"};
  if(sealed.solverClassDeclarationHash!==declaration.declarationHash) return {ok:false,code:"SOLVER_DECLARATION_MUTATED_AFTER_EXECUTION"};
  const immutable=["generationRunId","programHash","ruleSetHash","solverClassDeclarationHash","solverVersion","solverConfigurationHash","searchBounds","randomSeed"] as const;
  if(immutable.some(k=>JSON.stringify(sealed[k])!==JSON.stringify(current[k])) || JSON.stringify(sealed.knowledgePackHashes)!==JSON.stringify(current.knowledgePackHashes) || sealed.partiInterpretationHash!==current.partiInterpretationHash) return {ok:false,code:"EXECUTION_ENVELOPE_IMMUTABLE"};
  return {ok:true,value:sealed};
}

export function cannotPromoteCandidateToAgk(_candidate:LayoutCandidate): SpatialResult<never> {
  return {ok:false,code:"CANDIDATE_CANONICALIZATION_FORBIDDEN"};
}

export function recordUnknown(input: UnknownRecord): UnknownRecord {
  if (!input.unknownId.trim() || !input.subject.trim() || !input.reason.trim() || !input.resolutionPath.trim()) {
    throw new Error("UNKNOWN_RECORD_INCOMPLETE");
  }
  return Object.freeze({...input,evidence:Object.freeze([...input.evidence])});
}

export function buildUnsatConflictReport(input: {
  conflictingRuleIds: readonly string[];
  affectedSpaceIds: readonly string[];
  discoveredMus: readonly (readonly string[])[];
  diagnosticCompleteness: ConflictReport["diagnosticCompleteness"];
  searchBounds: string;
  terminationReason: string;
  possibleResolutionPaths?: readonly string[];
}): ConflictReport {
  if (input.conflictingRuleIds.length < 2) throw new Error("UNSAT_REQUIRES_CONFLICT");
  const universe=new Set(input.conflictingRuleIds);
  const normalized=input.discoveredMus.map(set=>{
    const unique=[...new Set(set)];
    if(unique.length===0 || unique.some(id=>!universe.has(id))) throw new Error("INVALID_MUS");
    return unique;
  });
  for(let i=0;i<normalized.length;i++){
    const current=new Set(normalized[i]);
    if(normalized.some((other,j)=>j!==i && other.length<current.size && other.every(id=>current.has(id)))) throw new Error("NON_MINIMAL_MUS");
  }
  const mus=normalized.map(set=>Object.freeze(set));
  return Object.freeze({
    status:"UNSAT",
    conflictingRuleIds:Object.freeze([...input.conflictingRuleIds]),
    affectedSpaceIds:Object.freeze([...input.affectedSpaceIds]),
    reportableMus:Object.freeze(mus),
    diagnosticCompleteness:input.diagnosticCompleteness,
    searchBounds:input.searchBounds,
    terminationReason:input.terminationReason,
    possibleResolutionPaths:Object.freeze([...(input.possibleResolutionPaths??[])])
  });
}

export function semanticTraceHash(trace: SemanticTrace): string {
  return fingerprint({
    candidateIds:[...trace.candidateIds],
    relationshipOutcomes:[...trace.relationshipOutcomes],
    conflictMusIds:[...trace.conflictMusIds]
  });
}

export function verifyReproducibility(input:{
  declaration:SolverClassDeclaration;
  expected:SemanticTrace;
  observed:SemanticTrace;
}): SpatialResult<ReproducibilityCheck> {
  const expectedHash=semanticTraceHash(input.expected);
  const observedHash=semanticTraceHash(input.observed);
  if(input.declaration.solverClass==="DECLARED_NONDETERMINISTIC_SOLVER"){
    return {ok:true,value:{generationCertificationStatus:"UNVERIFIED",semanticTraceHash:observedHash}};
  }
  if(expectedHash!==observedHash) return {ok:false,code:"SOLVER_NONDETERMINISM_DETECTED"};
  return {ok:true,value:{generationCertificationStatus:"VERIFIED",semanticTraceHash:observedHash}};
}
