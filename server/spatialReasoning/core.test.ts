import { describe, expect, it } from "vitest";
import { issueD2AuthorityToken } from "../d2Authority";
import { archiveCandidate, assertExecutionIntegrity, authorizeException, authorizeRule, beginExecution, buildGenerationTrace, buildUnsatConflictReport, cannotPromoteCandidateToAgk, createCandidate, createPartiInterpretation, createSolverDeclaration, determineApplicability, markCandidateOutdated, prepareExecutionEnvelope, recordUnknown, reclassifyRegulatoryHard, rejectCandidate, requirePartiInterpretation, selectCurrentCandidate, validatePreliminaryGeometry, validateRelationship, validateSpaces, verifyReproducibility } from "./core";
import { spaceId, type MetricSemantics, type SpatialRelationship, type SpatialRule, type SpaceIdentity } from "./types";

const spaces:SpaceIdentity[]=[
 {spaceId:spaceId("reception"),provenance:"DECLARED_BY_D2",lifecycle:"CONCEPTUAL"},
 {spaceId:spaceId("meeting"),provenance:"DECLARED_BY_D2",lifecycle:"CONCEPTUAL"},
];
const evidence=[{evidenceId:"e1",classification:"RESTRICCION" as const,sourceRef:"project"}];
const adjacency=(metric?:unknown):SpatialRelationship=>({relationshipId:"r1",relationshipType:"DIRECT_ADJACENCY",subjectSpaceId:spaceId("reception"),objectSpaceId:spaceId("meeting"),metric:metric as SpatialRelationship["metric"],evidence});

describe("E2E-002 phase 1 contract spine",()=>{
 it("uses stable space identities and rejects unknown references",()=>{
   expect(validateRelationship({...adjacency({measurementDomain:"BOUNDARY_CONTACT",representationSpace:"PRELIMINARY_SPATIAL_REPRESENTATION",tolerance:10,unit:"mm"}),objectSpaceId:spaceId("solver-node-7")},spaces)).toEqual({ok:false,code:"INVALID_SPACE_REFERENCE"});
 });
 it("preserves metric validation precedence",()=>{
   expect(validateRelationship(adjacency({measurementDomain:"BOUNDARY_CONTACT",tolerance:10,unit:"mm"}),spaces)).toEqual({ok:false,code:"METRIC_SEMANTICS_REQUIRED"});
   expect(validateRelationship(adjacency({measurementDomain:"BOUNDARY_CONTACT",representationSpace:"PRELIMINARY_SPATIAL_REPRESENTATION",unit:"mm"}),spaces)).toEqual({ok:false,code:"METRIC_TOLERANCE_REQUIRED"});
   expect(validateRelationship(adjacency({measurementDomain:"BOUNDARY_CONTACT",representationSpace:"PRELIMINARY_SPATIAL_REPRESENTATION",tolerance:10}),spaces)).toEqual({ok:false,code:"METRIC_UNIT_REQUIRED"});
   const distance:SpatialRelationship={...adjacency(),relationshipType:"MINIMUM_DISTANCE",metric:{measurementDomain:"BOUNDARY_CLEARANCE",metricType:"EUCLIDEAN",representationSpace:"PRELIMINARY_SPATIAL_REPRESENTATION",unit:"mm"} as SpatialRelationship["metric"]};
   expect(validateRelationship(distance,spaces)).toEqual({ok:false,code:"METRIC_THRESHOLD_REQUIRED"});
 });
 it("fails closed on applicability and does not infer hierarchy",()=>{
   const env={typologies:["HOSPITAL"],jurisdictions:["PE-LIM"],scales:["EDIFICACION"] as const};
   expect(determineApplicability(env,{typology:"HOSPITAL_PSYCHIATRIC",jurisdiction:"PE-LIM",scale:"EDIFICACION"})).toBe("NOT_APPLICABLE");
   expect(determineApplicability(env,{typology:"HOSPITAL",jurisdiction:"PE",scale:"EDIFICACION"})).toBe("NOT_APPLICABLE");
 });
 it("blocks false hardness and regulatory reclassification",()=>{
   const rule:SpatialRule={ruleId:"rule-1",source:"REFERENCE_MANUAL",applicability:{typologies:["SMALL_OFFICE"],jurisdictions:["PE-LIM"],scales:["EDIFICACION"]},enforcement:"PROJECT_HARD",stage:"CANDIDATE_RULE",relationship:adjacency({measurementDomain:"BOUNDARY_CONTACT",representationSpace:"PRELIMINARY_SPATIAL_REPRESENTATION",tolerance:10,unit:"mm"}),evidence};
   expect(authorizeRule(rule)).toEqual({ok:false,code:"RULE_AUTHORITY_REQUIRED"});
   expect(authorizeRule(rule,issueD2AuthorityToken("rule-1")).ok).toBe(true);
   const regulatory={...rule,source:"LAW_REGULATION" as const,enforcement:"REGULATORY_HARD" as const,authorityRef:"verified-regulator"};
   expect(authorizeRule(regulatory)).toEqual({ok:false,code:"RULE_AUTHORITY_REQUIRED"});
   expect(authorizeRule(regulatory,issueD2AuthorityToken("rule-1")).ok).toBe(true);
   expect(reclassifyRegulatoryHard(regulatory,"PROJECT_HARD")).toEqual({ok:false,code:"REGULATORY_RECLASSIFICATION_FORBIDDEN"});
 });
 it("requires explicit AREA dimensional semantics",()=>{
   const area:SpatialRelationship={relationshipId:"area-1",relationshipType:"AREA",subjectSpaceId:spaceId("reception"),evidence};
   expect(validateRelationship(area,spaces)).toEqual({ok:false,code:"AREA_SEMANTICS_REQUIRED"});
   expect(validateRelationship({...area,area:{areaType:"USABLE",aggregationScope:"SPACE",target:20,unit:"m2"}},spaces).ok).toBe(true);
 });
 it("keeps candidates noncanonical and rejects impossible generation counts",()=>{
   const base={candidateId:"c1",programVersion:"p1",spaceIds:[spaceId("reception"),spaceId("meeting")],satisfiedRelationshipIds:["r1"],violatedRelationshipIds:[],unknownRelationshipIds:[],unknowns:[],generationMetadata:{generated:1,evaluated:1,retained:1,programHash:"p",ruleSetHash:"r",knowledgePackHashes:[],solverVersion:"1",solverConfigurationHash:"cfg",searchBounds:"bounded",generationRunId:"run-1"}};
   const c=createCandidate(base); expect(c.ok).toBe(true); if(!c.ok)return;
   expect(c.value.canonical).toBe(false);
   expect(cannotPromoteCandidateToAgk(c.value)).toEqual({ok:false,code:"CANDIDATE_CANONICALIZATION_FORBIDDEN"});
    expect(createCandidate({...base,status:"ARCHIVED"})).toEqual({ok:false,code:"CANDIDATE_STATUS_INVALID"});
   expect(createCandidate({...base,generationMetadata:{...base.generationMetadata,generated:1,evaluated:2,retained:1}})).toEqual({ok:false,code:"GENERATION_TRACE_INCONSISTENT"});
 });
 it("fails closed on exceptions and cannot use exception to create applicability",()=>{
   const rule:SpatialRule={ruleId:"reg-1",source:"LAW_REGULATION",authorityRef:"authority",applicability:{typologies:["SMALL_OFFICE"],jurisdictions:["PE-LIM"],scales:["EDIFICACION"]},enforcement:"REGULATORY_HARD",stage:"AUTHORIZED_EXECUTABLE_RULE",relationship:adjacency({measurementDomain:"BOUNDARY_CONTACT",representationSpace:"PRELIMINARY_SPATIAL_REPRESENTATION",tolerance:10,unit:"mm"}),evidence};
   const ex={exceptionId:"ex-1",affectedRuleId:"reg-1",issuingAuthority:"authority",documentReference:"doc",documentHash:"hash",effectiveDate:"2026-01-01",scope:"reg-1",proof:"registry",evidence,verificationStatus:"VERIFIED" as const};
   expect(authorizeException(ex,rule,"NOT_APPLICABLE","2026-10-02")).toEqual({ok:false,code:"RULE_NOT_APPLICABLE"});
   expect(authorizeException({...ex,verificationStatus:"UNVERIFIED"},rule,"APPLICABLE","2026-10-02")).toEqual({ok:false,code:"EXCEPTION_NOT_AUTHORIZED"});
   expect(authorizeException(ex,rule,"APPLICABLE","2026-10-02").ok).toBe(true);
 });
 it("invalidates stale candidates and binds PARTI interpretation",()=>{
   const parti=createPartiInterpretation({interpretationId:"pi-1",sourceRef:"brief",sourceVersion:"1",ambiguity:"entry hierarchy",authorizedInterpretation:"public-to-private gradient",authorityRef:"D2",evidence,programVersion:"p1",status:"AUTHORIZED"}); expect(parti.ok).toBe(true); if(!parti.ok)return;
   const base={candidateId:"c-parti",programVersion:"p1",spaceIds:[spaceId("reception")],satisfiedRelationshipIds:[],violatedRelationshipIds:[],unknownRelationshipIds:[],unknowns:[],partiInterpretationHash:parti.value.interpretationHash,generationMetadata:{generated:1,evaluated:1,retained:1,programHash:"p",ruleSetHash:"r",knowledgePackHashes:[],solverVersion:"1",solverConfigurationHash:"cfg",searchBounds:"bounded",generationRunId:"run-p"}};
   const made=createCandidate(base);expect(made.ok).toBe(true);if(!made.ok)return;
   const stale=markCandidateOutdated(made.value,{programHash:"p2",ruleSetHash:"r",knowledgePackHashes:[],partiInterpretationHash:parti.value.interpretationHash});
   expect(stale.status).toBe("OUTDATED"); expect(selectCurrentCandidate(stale)).toEqual({ok:false,code:"CANDIDATE_OUTDATED"});
 });
 it("restricts preliminary geometry and generation trace",()=>{
   expect(validatePreliminaryGeometry({kind:"AXIS_ALIGNED_BOX",canonical:false,preliminaryGeometry:true,agkOperational:false}).ok).toBe(true);
   expect(validatePreliminaryGeometry({kind:"BOUNDED_CONVEX_POLYHEDRON",canonical:false,preliminaryGeometry:true,agkOperational:false,faceCount:100})).toEqual({ok:false,code:"PRELIMINARY_GEOMETRY_INVALID"});
   expect(buildGenerationTrace({events:[{eventId:"1",kind:"GENERATED",candidateId:"c"},{eventId:"2",kind:"EVALUATED",candidateId:"c"},{eventId:"3",kind:"PRUNED",candidateId:"c"}],terminationReason:"bound",searchBounds:"1"})).toEqual({ok:false,code:"GENERATION_TRACE_INCONSISTENT"});
   const trace=buildGenerationTrace({events:[{eventId:"1",kind:"GENERATED",candidateId:"c"},{eventId:"2",kind:"EVALUATED",candidateId:"c"},{eventId:"3",kind:"RETAINED",candidateId:"c"}],terminationReason:"bound",searchBounds:"1"});
   expect(trace.ok).toBe(true);
 });
 it("prebinds solver declaration and rejects timestamp-only/unbound execution",()=>{
   const d=createSolverDeclaration({declarationId:"d1",generationRunId:"run-1",solverClass:"DETERMINISTIC_SOLVER",solverVersion:"1",solverConfigurationHash:"cfg",baselineHashes:["p","r"],searchBounds:"bounded",reproducibilityGuarantee:"semantic-trace"});
   const e=prepareExecutionEnvelope({generationRunId:"run-1",programHash:"p",ruleSetHash:"r",knowledgePackHashes:[],solverClassDeclarationHash:"forged",solverVersion:"1",solverConfigurationHash:"cfg",searchBounds:"bounded"});
   expect(beginExecution(e,d)).toEqual({ok:false,code:"SOLVER_DECLARATION_INTEGRITY_FAILED"});
 });
 it("keeps UNKNOWN explicit and produces bounded UNSAT diagnostics",()=>{
   const u=recordUnknown({unknownId:"u1",subject:"meeting acoustic separation",reason:"assembly not selected",blocking:true,evidence:[],resolutionPath:"select and verify assembly"});
   expect(u.blocking).toBe(true);
   const report=buildUnsatConflictReport({conflictingRuleIds:["hard-a","hard-b"],affectedSpaceIds:[spaceId("meeting")],discoveredMus:[["hard-a","hard-b"]],diagnosticCompleteness:"BOUNDED",searchBounds:"2 rules",terminationReason:"declared bound",possibleResolutionPaths:["D2 may revise project requirement"]});
   expect(report.status).toBe("UNSAT");
   expect(report.diagnosticCompleteness).toBe("BOUNDED");
   expect(report.possibleResolutionPaths[0]).toContain("may");
   expect(()=>buildUnsatConflictReport({conflictingRuleIds:["a","b","c"],affectedSpaceIds:[spaceId("meeting")],discoveredMus:[["a","b"],["a","b","c"]],diagnosticCompleteness:"PARTIAL",searchBounds:"bounded",terminationReason:"limit"})).toThrow("NON_MINIMAL_MUS");
 });
 it("detects deterministic and seeded semantic nondeterminism but does not fake verification for declared nondeterminism",()=>{
   const base={declarationId:"d-r",generationRunId:"run-r",solverVersion:"1",solverConfigurationHash:"cfg",baselineHashes:["p","r"],searchBounds:"bounded",reproducibilityGuarantee:"semantic-trace"};
   const expected={candidateIds:["c1"],relationshipOutcomes:["r1:SAT"],conflictMusIds:[]};
   const changed={...expected,relationshipOutcomes:["r1:UNSAT"]};
   for(const solverClass of ["DETERMINISTIC_SOLVER","SEEDED_STOCHASTIC_SOLVER"] as const){
     const d=createSolverDeclaration({...base,solverClass,...(solverClass==="SEEDED_STOCHASTIC_SOLVER"?{randomSeed:"42"}:{})});
     expect(verifyReproducibility({declaration:d,expected,observed:changed})).toEqual({ok:false,code:"SOLVER_NONDETERMINISM_DETECTED"});
   }
   expect(()=>createSolverDeclaration({...base,solverClass:"DECLARED_NONDETERMINISTIC_SOLVER"})).toThrow("SOLVER_DECLARATION_INTEGRITY_FAILED");
   expect(()=>createSolverDeclaration({...base,solverClass:"SEEDED_STOCHASTIC_SOLVER"})).toThrow("SOLVER_DECLARATION_INTEGRITY_FAILED");
   const nondet=createSolverDeclaration({...base,solverClass:"DECLARED_NONDETERMINISTIC_SOLVER",nondeterminismSource:"external heuristic",repeatabilityLimitations:"not repeatable"});
   const check=verifyReproducibility({declaration:nondet,expected,observed:changed});
   expect(check.ok).toBe(true); if(check.ok) expect(check.value.generationCertificationStatus).toBe("UNVERIFIED");
 });
 it("blocks post-facto solver reclassification and envelope mutation",()=>{
   const d=createSolverDeclaration({declarationId:"d1",generationRunId:"run-1",solverClass:"DETERMINISTIC_SOLVER",solverVersion:"1",solverConfigurationHash:"cfg",baselineHashes:["p","r"],searchBounds:"bounded",reproducibilityGuarantee:"semantic-trace"});
   const p=prepareExecutionEnvelope({generationRunId:"run-1",programHash:"p",ruleSetHash:"r",knowledgePackHashes:[],solverClassDeclarationHash:d.declarationHash,solverVersion:"1",solverConfigurationHash:"cfg",searchBounds:"bounded"});
   const begun=beginExecution(p,d); expect(begun.ok).toBe(true); if(!begun.ok)return;
   const post=createSolverDeclaration({declarationId:"d2",generationRunId:d.generationRunId,solverClass:"DECLARED_NONDETERMINISTIC_SOLVER",solverVersion:d.solverVersion,solverConfigurationHash:d.solverConfigurationHash,baselineHashes:d.baselineHashes,searchBounds:d.searchBounds,nondeterminismSource:"post-facto",reproducibilityGuarantee:d.reproducibilityGuarantee,repeatabilityLimitations:"none"});
   expect(assertExecutionIntegrity(begun.value,begun.value,post)).toEqual({ok:false,code:"SOLVER_DECLARATION_MUTATED_AFTER_EXECUTION"});
   expect(assertExecutionIntegrity(begun.value,{...begun.value,programHash:"changed"},d)).toEqual({ok:false,code:"EXECUTION_ENVELOPE_IMMUTABLE"});
 });
 it("closes consolidated Red Team counterexamples",()=>{
   const env={typologies:[] as string[],jurisdictions:["PE-LIM"],scales:["EDIFICACION"] as const};
   expect(determineApplicability(env,{typology:"SMALL_OFFICE",jurisdiction:"PE-LIM",scale:"EDIFICACION"})).toBe("UNKNOWN");
   expect(validateRelationship(adjacency({measurementDomain:"BOUNDARY_CONTACT",representationSpace:"PRELIMINARY_SPATIAL_REPRESENTATION",tolerance:Number.NaN,unit:"mm"}),spaces)).toEqual({ok:false,code:"METRIC_TOLERANCE_REQUIRED"});
   const area:SpatialRelationship={relationshipId:"area-x",relationshipType:"AREA",subjectSpaceId:spaceId("reception"),area:{areaType:"USABLE",aggregationScope:"SPACE",minimum:50,target:40,maximum:30,unit:"m2"},evidence};
   expect(validateRelationship(area,spaces)).toEqual({ok:false,code:"AREA_SEMANTICS_REQUIRED"});
   expect(validateRelationship({...area,area:{areaType:"USABLE",aggregationScope:"SPACE",target:20,unit:"m2"},objectSpaceId:spaceId("meeting")},spaces)).toEqual({ok:false,code:"AREA_SEMANTICS_REQUIRED"});
   const base={candidateId:"immutable",programVersion:"p1",spaceIds:[spaceId("reception")],satisfiedRelationshipIds:[],violatedRelationshipIds:[],unknownRelationshipIds:[],unknowns:[],generationMetadata:{generated:1,evaluated:1,retained:1,programHash:"p",ruleSetHash:"r",knowledgePackHashes:["k"],solverVersion:"1",solverConfigurationHash:"cfg",searchBounds:"bounded",generationRunId:"run-i"}};
   const made=createCandidate(base); expect(made.ok).toBe(true); if(!made.ok)return;
   expect(Object.isFrozen(made.value.spaceIds)).toBe(true);
   expect(Object.isFrozen(made.value.generationMetadata.knowledgePackHashes)).toBe(true);
   const report=buildUnsatConflictReport({conflictingRuleIds:["a","b"],affectedSpaceIds:[spaceId("reception")],discoveredMus:[["a","b"],["b","a"]],diagnosticCompleteness:"BOUNDED",searchBounds:"2",terminationReason:"bound"});
   expect(report.reportableMus).toHaveLength(1);
   const t1=buildGenerationTrace({events:[{eventId:"uuid-1",kind:"GENERATED",candidateId:"c"},{eventId:"uuid-2",kind:"EVALUATED",candidateId:"c"}],terminationReason:"done",searchBounds:"1"});
   const t2=buildGenerationTrace({events:[{eventId:"other-1",kind:"GENERATED",candidateId:"c"},{eventId:"other-2",kind:"EVALUATED",candidateId:"c"}],terminationReason:"done",searchBounds:"1"});
   expect(t1.ok&&t2.ok&&t1.value.semanticTraceHash===t2.value.semanticTraceHash).toBe(true);
   expect(buildGenerationTrace({events:[],terminationReason:"none",searchBounds:"0"})).toEqual({ok:false,code:"GENERATION_TRACE_INCONSISTENT"});
 });

 it("rejects caller-controlled AUTHORIZED stage without a real D2 token",()=>{
   const rule:SpatialRule={ruleId:"preauthorized-forgery",source:"FUNCTIONAL_REQUIREMENT",applicability:{typologies:["SMALL_OFFICE"],jurisdictions:["PE-LIM"],scales:["EDIFICACION"]},enforcement:"PROJECT_HARD",stage:"AUTHORIZED_EXECUTABLE_RULE",relationship:adjacency({measurementDomain:"BOUNDARY_CONTACT",representationSpace:"PRELIMINARY_SPATIAL_REPRESENTATION",tolerance:0,unit:"mm"}),evidence};
   expect(authorizeRule(rule)).toEqual({ok:false,code:"RULE_AUTHORITY_REQUIRED"});
   expect(authorizeRule(rule,issueD2AuthorityToken(rule.ruleId)).ok).toBe(true);
 });

 it("uses canonical Spatial Reasoning hashes without changing the global fingerprint contract",()=>{
   const a=createSolverDeclaration({declarationId:"canonical",generationRunId:"run",solverClass:"DETERMINISTIC_SOLVER",solverVersion:"1",solverConfigurationHash:"cfg",baselineHashes:["p","r"],searchBounds:"bounded",reproducibilityGuarantee:"semantic"});
   const b=createSolverDeclaration({searchBounds:"bounded",baselineHashes:["p","r"],solverConfigurationHash:"cfg",solverVersion:"1",solverClass:"DETERMINISTIC_SOLVER",generationRunId:"run",declarationId:"canonical",reproducibilityGuarantee:"semantic"});
   expect(a.declarationHash).toBe(b.declarationHash);
   const omitted=createSolverDeclaration({declarationId:"undefined",generationRunId:"run-u",solverClass:"DETERMINISTIC_SOLVER",solverVersion:"1",solverConfigurationHash:"cfg",baselineHashes:["p"],searchBounds:"bounded",reproducibilityGuarantee:"semantic"});
   const explicitUndefined=createSolverDeclaration({declarationId:"undefined",generationRunId:"run-u",solverClass:"DETERMINISTIC_SOLVER",solverVersion:"1",solverConfigurationHash:"cfg",baselineHashes:["p"],searchBounds:"bounded",reproducibilityGuarantee:"semantic",repeatabilityLimitations:undefined});
   expect(omitted.declarationHash).not.toBe(explicitUndefined.declarationHash);
 });

 it("labels MUS minimality honestly and deep-freezes remaining returned state",()=>{
   const report=buildUnsatConflictReport({conflictingRuleIds:["a","b"],affectedSpaceIds:[spaceId("reception")],discoveredMus:[["a","b"]],diagnosticCompleteness:"BOUNDED",searchBounds:"2",terminationReason:"bound"});
   expect(report.musMinimalityScope).toBe("DISCOVERED_SET");
   const rule:SpatialRule={ruleId:"freeze-rule",source:"FUNCTIONAL_REQUIREMENT",applicability:{typologies:["SMALL_OFFICE"],jurisdictions:["PE-LIM"],scales:["EDIFICACION"]},enforcement:"PROJECT_HARD",stage:"CANDIDATE_RULE",relationship:adjacency({measurementDomain:"BOUNDARY_CONTACT",representationSpace:"PRELIMINARY_SPATIAL_REPRESENTATION",tolerance:0,unit:"mm"}),evidence};
   const reclassified=reclassifyRegulatoryHard(rule,"SOFT"); expect(reclassified.ok).toBe(true);
   if(reclassified.ok) expect(Object.isFrozen(reclassified.value.relationship.evidence)).toBe(true);
   const base={candidateId:"freeze-select",programVersion:"p1",spaceIds:[spaceId("reception")],satisfiedRelationshipIds:[],violatedRelationshipIds:[],unknownRelationshipIds:[],unknowns:[],generationMetadata:{generated:1,evaluated:1,retained:1,programHash:"p",ruleSetHash:"r",knowledgePackHashes:["k"],solverVersion:"1",solverConfigurationHash:"cfg",searchBounds:"bounded",generationRunId:"run-f"}};
   const made=createCandidate(base); expect(made.ok).toBe(true); if(!made.ok)return;
   const selected=selectCurrentCandidate(made.value); expect(selected.ok).toBe(true);
   if(selected.ok) expect(Object.isFrozen(selected.value.generationMetadata.knowledgePackHashes)).toBe(true);
 });


 it("closes remaining Phase 1 fail-closed debt",()=>{
   const rule:SpatialRule={ruleId:"reg-final",source:"LAW_REGULATION",authorityRef:"authority",applicability:{typologies:["SMALL_OFFICE"],jurisdictions:["PE-LIM"],scales:["EDIFICACION"]},enforcement:"REGULATORY_HARD",stage:"AUTHORIZED_EXECUTABLE_RULE",relationship:adjacency({measurementDomain:"BOUNDARY_CONTACT",representationSpace:"PRELIMINARY_SPATIAL_REPRESENTATION",tolerance:0,unit:"mm"}),evidence};
   const ex={exceptionId:"ex-final",affectedRuleId:"reg-final",issuingAuthority:"authority",documentReference:"doc",documentHash:"hash",effectiveDate:"2026-01-01",expirationDate:"2026-12-31",scope:"reg-final",proof:"registry",evidence,verificationStatus:"VERIFIED" as const};
   expect(authorizeException({...ex,scope:"other"},rule,"APPLICABLE","2026-10-02")).toEqual({ok:false,code:"EXCEPTION_SCOPE_INVALID"});
   expect(authorizeException({...ex,effectiveDate:"2026-11-01"},rule,"APPLICABLE","2026-10-02")).toEqual({ok:false,code:"EXCEPTION_DATE_INVALID"});
   expect(authorizeException({...ex,expirationDate:"2026-09-30"},rule,"APPLICABLE","2026-10-02")).toEqual({ok:false,code:"EXCEPTION_DATE_INVALID"});
   expect(authorizeException(ex,rule,"APPLICABLE","2026-10-02").ok).toBe(true);

   expect(createPartiInterpretation({interpretationId:"pi-empty",sourceRef:"brief",sourceVersion:"1",ambiguity:"ambiguous",authorizedInterpretation:"",authorityRef:"D2",evidence,programVersion:"p1",status:"AUTHORIZED"})).toEqual({ok:false,code:"PARTI_INTERPRETATION_REQUIRED"});
   expect(createPartiInterpretation({interpretationId:"pi-rejected",sourceRef:"brief",sourceVersion:"1",ambiguity:"ambiguous",authorizedInterpretation:"chosen",authorityRef:"D2",evidence,programVersion:"p1",status:"REJECTED"})).toEqual({ok:false,code:"PARTI_INTERPRETATION_REQUIRED"});

   const base={candidateId:"lifecycle",programVersion:"p1",spaceIds:[spaceId("reception")],satisfiedRelationshipIds:[],violatedRelationshipIds:[],unknownRelationshipIds:[],unknowns:[],generationMetadata:{generated:1,evaluated:1,retained:1,programHash:"p",ruleSetHash:"r",knowledgePackHashes:[],solverVersion:"1",solverConfigurationHash:"cfg",searchBounds:"bounded",generationRunId:"run-l"}};
   const made=createCandidate(base); expect(made.ok).toBe(true); if(!made.ok)return;
   const archived=archiveCandidate(made.value); expect(archived.ok).toBe(true); if(archived.ok) expect(archived.value.status).toBe("ARCHIVED");
   const rejected=rejectCandidate(made.value); expect(rejected.ok).toBe(true); if(rejected.ok) expect(rejected.value.status).toBe("REJECTED");
   const validParti=createPartiInterpretation({interpretationId:"pi-valid",sourceRef:"brief",sourceVersion:"1",ambiguity:"ambiguous",authorizedInterpretation:"chosen",authorityRef:"D2",evidence,programVersion:"p1",status:"AUTHORIZED"});
   expect(validParti.ok).toBe(true); if(validParti.ok) expect(requirePartiInterpretation(validParti.value).ok).toBe(true);

   expect(validateSpaces([{spaceId:spaceId("x"),provenance:"INVALID" as SpaceIdentity["provenance"],lifecycle:"CONCEPTUAL"}])).toEqual({ok:false,code:"SPACE_PROVENANCE_INVALID"});
   expect(validateSpaces([{spaceId:spaceId("x"),provenance:"DECLARED_BY_D2",lifecycle:"INVALID" as SpaceIdentity["lifecycle"]}])).toEqual({ok:false,code:"SPACE_LIFECYCLE_INVALID"});
 });

 it("treats knowledge-pack identity as order independent while preserving membership",()=>{
   const d=createSolverDeclaration({declarationId:"order",generationRunId:"run-order",solverClass:"DETERMINISTIC_SOLVER",solverVersion:"1",solverConfigurationHash:"cfg",baselineHashes:["p","r"],searchBounds:"bounded",reproducibilityGuarantee:"semantic"});
   const prepared=prepareExecutionEnvelope({generationRunId:"run-order",programHash:"p",ruleSetHash:"r",knowledgePackHashes:["pack-a","pack-b"],solverClassDeclarationHash:d.declarationHash,solverVersion:"1",solverConfigurationHash:"cfg",searchBounds:"bounded"});
   const begun=beginExecution(prepared,d); expect(begun.ok).toBe(true); if(!begun.ok)return;
   expect(assertExecutionIntegrity(begun.value,{...begun.value,knowledgePackHashes:["pack-b","pack-a"]},d).ok).toBe(true);
   expect(assertExecutionIntegrity(begun.value,{...begun.value,knowledgePackHashes:["pack-a","pack-c"]},d)).toEqual({ok:false,code:"EXECUTION_ENVELOPE_IMMUTABLE"});
 });

});
