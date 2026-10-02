import { fingerprint } from "../arkiFingerprint";
import { verifyD2AuthorityToken, type D2AuthorityToken } from "../d2Authority";
import type { ApplicabilityEnvelope, AuthorizedException, ConflictReport, ExecutionEnvelope, GenerationMetadata, GenerationTrace, LayoutCandidate, PartiInterpretation, PreliminaryGeometry, ReproducibilityCheck, SemanticTrace, SolverClassDeclaration, SpatialRelationship, SpatialResult, SpatialRule, SpaceIdentity, UnknownRecord } from "./types";
import type { LayoutScale } from "../capabilityFabric/multiscaleLayout";

const validMetricNumber = (v: number | undefined) => typeof v === "number" && Number.isFinite(v) && v >= 0;
function deepFreeze<T>(value:T):T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    for (const key of Object.getOwnPropertyNames(value)) deepFreeze((value as Record<string, unknown>)[key]);
    Object.freeze(value);
  }
  return value;
}

export function validateSpaces(spaces: readonly SpaceIdentity[]): SpatialResult<readonly SpaceIdentity[]> {
  if (spaces.some(s => !s.spaceId.trim())) return { ok:false, code:"SPACE_ID_REQUIRED" };
  if (new Set(spaces.map(s=>s.spaceId)).size !== spaces.length) return { ok:false, code:"DUPLICATE_SPACE_ID" };
  return { ok:true, value:Object.freeze([...spaces]) };
}

export function validateRelationship(rel: SpatialRelationship, spaces: readonly SpaceIdentity[]): SpatialResult<SpatialRelationship> {
  const ids=new Set(spaces.map(s=>s.spaceId));
  if (!ids.has(rel.subjectSpaceId) || (rel.objectSpaceId !== undefined && !ids.has(rel.objectSpaceId))) return {ok:false,code:"INVALID_SPACE_REFERENCE"};
  if (rel.relationshipType==="AREA") {
    if(rel.objectSpaceId!==undefined || !rel.area?.areaType || !rel.area.aggregationScope || !rel.area.unit || (rel.area.target===undefined && rel.area.minimum===undefined && rel.area.maximum===undefined)) return {ok:false,code:"AREA_SEMANTICS_REQUIRED"};
    const values=[rel.area.minimum,rel.area.target,rel.area.maximum].filter((v):v is number=>v!==undefined);
    if(values.some(v=>!Number.isFinite(v) || v<0) || (rel.area.minimum!==undefined && rel.area.target!==undefined && rel.area.minimum>rel.area.target) || (rel.area.target!==undefined && rel.area.maximum!==undefined && rel.area.target>rel.area.maximum) || (rel.area.minimum!==undefined && rel.area.maximum!==undefined && rel.area.minimum>rel.area.maximum)) return {ok:false,code:"AREA_SEMANTICS_REQUIRED"};
  }
  if (rel.relationshipType==="DIRECT_ADJACENCY") {
    const m=rel.metric;
    if (!m?.measurementDomain || !m.representationSpace) return {ok:false,code:"METRIC_SEMANTICS_REQUIRED"};
    if (!validMetricNumber(m.tolerance)) return {ok:false,code:"METRIC_TOLERANCE_REQUIRED"};
    if (!m.unit) return {ok:false,code:"METRIC_UNIT_REQUIRED"};
  }
  if (rel.relationshipType==="MINIMUM_DISTANCE") {
    const m=rel.metric;
    if (!m?.measurementDomain || !m.metricType || !m.representationSpace) return {ok:false,code:"METRIC_SEMANTICS_REQUIRED"};
    if (!validMetricNumber(m.threshold)) return {ok:false,code:"METRIC_THRESHOLD_REQUIRED"};
    if (!m.unit) return {ok:false,code:"METRIC_UNIT_REQUIRED"};
  }
  return {ok:true,value:rel};
}

export function determineApplicability(envelope: ApplicabilityEnvelope, context:{typology:string;jurisdiction:string;scale:LayoutScale}): "APPLICABLE"|"NOT_APPLICABLE"|"UNKNOWN" {
  // V0.5: missing applicability evidence is UNKNOWN; no implicit inheritance.
  if(envelope.typologies.length===0 || envelope.jurisdictions.length===0 || envelope.scales.length===0) return "UNKNOWN";
  return envelope.typologies.includes(context.typology) && envelope.jurisdictions.includes(context.jurisdiction) && envelope.scales.includes(context.scale) ? "APPLICABLE" : "NOT_APPLICABLE";
}

export function authorizeRule(rule: SpatialRule, token?: D2AuthorityToken): SpatialResult<SpatialRule> {
  if (rule.enforcement==="REGULATORY_HARD" && rule.source!=="LAW_REGULATION") return {ok:false,code:"RULE_AUTHORITY_REQUIRED"};
  if (rule.source==="LAW_REGULATION" && rule.enforcement==="REGULATORY_HARD" && (!rule.authorityRef || rule.evidence.length===0)) return {ok:false,code:"RULE_AUTHORITY_REQUIRED"};
  // No CANDIDATE_RULE may self-promote. D-2 is the Phase-1 authorization boundary.
  if (rule.stage!=="AUTHORIZED_EXECUTABLE_RULE" && (!token || !verifyD2AuthorityToken(token,rule.ruleId))) return {ok:false,code:"RULE_AUTHORITY_REQUIRED"};
  if (rule.stage==="AUTHORIZED_EXECUTABLE_RULE" && token && !verifyD2AuthorityToken(token,rule.ruleId)) return {ok:false,code:"RULE_AUTHORITY_REQUIRED"};
  return {ok:true,value:deepFreeze({...rule,stage:"AUTHORIZED_EXECUTABLE_RULE",...(token?{d2AuthorityToken:token}:{})})};
}

export function reclassifyRegulatoryHard(rule: SpatialRule, enforcement: SpatialRule["enforcement"]): SpatialResult<SpatialRule> {
  if (rule.enforcement==="REGULATORY_HARD" && enforcement!=="REGULATORY_HARD") return {ok:false,code:"REGULATORY_RECLASSIFICATION_FORBIDDEN"};
  return {ok:true,value:{...rule,enforcement}};
}

export function validateGenerationMetadata(m: GenerationMetadata): SpatialResult<GenerationMetadata> {
  if (m.retained>m.evaluated || m.evaluated>m.generated) return {ok:false,code:"GENERATION_TRACE_INCONSISTENT"};
  return {ok:true,value:m};
}

export function createCandidate(input: Omit<LayoutCandidate,"canonical"|"status"> & {canonical?: boolean;status?:LayoutCandidate["status"]}): SpatialResult<LayoutCandidate> {
  if (input.canonical===true) return {ok:false,code:"CANDIDATE_CANONICALIZATION_FORBIDDEN"};
  if (input.status!==undefined && input.status!=="CURRENT") return {ok:false,code:"CANDIDATE_STATUS_INVALID"};
  const metadata=validateGenerationMetadata(input.generationMetadata); if(!metadata.ok)return metadata;
  return {ok:true,value:deepFreeze({...input,status:"CURRENT" as const,canonical:false as const})};
}

function declarationPayload(d: Omit<SolverClassDeclaration,"declarationHash">){ return d; }
export function createSolverDeclaration(input: Omit<SolverClassDeclaration,"declarationHash">): SolverClassDeclaration {
  if(input.solverClass==="SEEDED_STOCHASTIC_SOLVER" && !input.randomSeed) throw new Error("SOLVER_DECLARATION_INTEGRITY_FAILED");
  if(input.solverClass==="DECLARED_NONDETERMINISTIC_SOLVER" && (!input.nondeterminismSource || !input.repeatabilityLimitations)) throw new Error("SOLVER_DECLARATION_INTEGRITY_FAILED");
  return deepFreeze({...input,declarationHash:fingerprint(declarationPayload(input))});
}

function envelopePayload(e: Omit<ExecutionEnvelope,"envelopeHash">){ return e; }
export function prepareExecutionEnvelope(input: Omit<ExecutionEnvelope,"envelopeHash"|"executionState">): ExecutionEnvelope {
  const prepared={...input,executionState:"PREPARED" as const};
  return deepFreeze({...prepared,envelopeHash:fingerprint(envelopePayload(prepared))});
}

export function beginExecution(envelope:ExecutionEnvelope,declaration:SolverClassDeclaration):SpatialResult<ExecutionEnvelope>{
  if(envelope.executionState!=="PREPARED" || envelope.solverClassDeclarationHash!==declaration.declarationHash || envelope.generationRunId!==declaration.generationRunId || envelope.solverVersion!==declaration.solverVersion || envelope.solverConfigurationHash!==declaration.solverConfigurationHash || envelope.searchBounds!==declaration.searchBounds || envelope.randomSeed!==declaration.randomSeed) return {ok:false,code:"SOLVER_DECLARATION_INTEGRITY_FAILED"};
  const executing={...envelope,executionState:"EXECUTING" as const};
  return {ok:true,value:deepFreeze({...executing,envelopeHash:fingerprint(envelopePayload(executing))})};
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
  return deepFreeze({...input,evidence:[...input.evidence]});
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
  const normalizedRaw=input.discoveredMus.map(set=>{
    const unique=Array.from(new Set(set));
    if(unique.length===0 || unique.some(id=>!universe.has(id))) throw new Error("INVALID_MUS");
    return unique;
  });
  const seen=new Set<string>();
  const normalized=normalizedRaw.filter(set=>{const key=[...set].sort().join("\\u0000");if(seen.has(key))return false;seen.add(key);return true;});
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

export function authorizeException(exception:AuthorizedException, rule:SpatialRule, applicability:"APPLICABLE"|"NOT_APPLICABLE"|"UNKNOWN"):SpatialResult<AuthorizedException>{
  if(applicability!=="APPLICABLE") return {ok:false,code:"RULE_NOT_APPLICABLE"};
  if(exception.affectedRuleId!==rule.ruleId || exception.verificationStatus!=="VERIFIED" || !exception.issuingAuthority || !exception.documentReference || !exception.documentHash || !exception.scope || !exception.proof || exception.evidence.length===0) return {ok:false,code:"EXCEPTION_NOT_AUTHORIZED"};
  return {ok:true,value:deepFreeze({...exception,evidence:[...exception.evidence]})};
}

export function markCandidateOutdated(candidate:LayoutCandidate,current:{programHash:string;ruleSetHash:string;knowledgePackHashes:readonly string[];partiInterpretationHash?:string}):LayoutCandidate{
  const m=candidate.generationMetadata;
  const changed=m.programHash!==current.programHash || m.ruleSetHash!==current.ruleSetHash || JSON.stringify(m.knowledgePackHashes)!==JSON.stringify(current.knowledgePackHashes) || candidate.partiInterpretationHash!==current.partiInterpretationHash;
  return changed?Object.freeze({...candidate,status:"OUTDATED" as const}):candidate;
}
export function selectCurrentCandidate(candidate:LayoutCandidate):SpatialResult<LayoutCandidate>{
  return candidate.status==="CURRENT"?{ok:true,value:candidate}:{ok:false,code:"CANDIDATE_OUTDATED"};
}

export function createPartiInterpretation(input:Omit<PartiInterpretation,"interpretationHash">):PartiInterpretation{
  const snapshot=structuredClone(input); return deepFreeze({...snapshot,interpretationHash:fingerprint(snapshot)});
}

export function validatePreliminaryGeometry(g:PreliminaryGeometry):SpatialResult<PreliminaryGeometry>{
  if(g.canonical!==false || g.preliminaryGeometry!==true || g.agkOperational!==false) return {ok:false,code:"PRELIMINARY_GEOMETRY_INVALID"};
  if(g.kind==="BOUNDED_CONVEX_POLYHEDRON" && (g.faceCount<4 || g.faceCount>64)) return {ok:false,code:"PRELIMINARY_GEOMETRY_INVALID"};
  return {ok:true,value:g};
}

export function buildGenerationTrace(input:{events:GenerationTrace["events"];terminationReason:string;searchBounds:string}):SpatialResult<GenerationTrace>{
  const generated=input.events.filter(e=>e.kind==="GENERATED").length;
  const evaluated=input.events.filter(e=>e.kind==="EVALUATED").length;
  const retained=input.events.filter(e=>e.kind==="RETAINED").length;
  if(retained>evaluated || evaluated>generated || input.events.some(e=>e.kind==="PRUNED" && !e.reason)) return {ok:false,code:"GENERATION_TRACE_INCONSISTENT"};
  if(input.events.length===0) return {ok:false,code:"GENERATION_TRACE_INCONSISTENT"};
  const semantic=input.events.map(e=>({kind:e.kind,candidateId:e.candidateId,reason:e.reason??null}));
  return {ok:true,value:Object.freeze({events:Object.freeze([...input.events]),terminationReason:input.terminationReason,searchBounds:input.searchBounds,semanticTraceHash:fingerprint({events:semantic,terminationReason:input.terminationReason,searchBounds:input.searchBounds})})};
}
