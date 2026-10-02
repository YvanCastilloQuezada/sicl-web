import { describe, expect, it } from "vitest";
import { issueD2AuthorityToken } from "../d2Authority";
import { assertExecutionIntegrity, authorizeException, authorizeRule, beginExecution, buildGenerationTrace, buildUnsatConflictReport, cannotPromoteCandidateToAgk, createCandidate, createPartiInterpretation, createSolverDeclaration, determineApplicability, markCandidateOutdated, prepareExecutionEnvelope, recordUnknown, reclassifyRegulatoryHard, selectCurrentCandidate, validatePreliminaryGeometry, validateRelationship, verifyReproducibility } from "./core";
import type { SpatialRelationship, SpatialRule, SpaceIdentity } from "./types";

const spaces:SpaceIdentity[]=[
 {spaceId:"reception",provenance:"DECLARED_BY_D2",lifecycle:"CONCEPTUAL"},
 {spaceId:"meeting",provenance:"DECLARED_BY_D2",lifecycle:"CONCEPTUAL"},
];
const evidence=[{evidenceId:"e1",classification:"RESTRICCION" as const,sourceRef:"project"}];
const adjacency=(metric?:SpatialRelationship["metric"]):SpatialRelationship=>({relationshipId:"r1",relationshipType:"DIRECT_ADJACENCY",subjectSpaceId:"reception",objectSpaceId:"meeting",metric,evidence});

describe("E2E-002 phase 1 contract spine",()=>{
 it("uses stable space identities and rejects unknown references",()=>{
   expect(validateRelationship({...adjacency({measurementDomain:"BOUNDARY_CONTACT",representationSpace:"PRELIMINARY_SPATIAL_REPRESENTATION",tolerance:10,unit:"mm"}),objectSpaceId:"solver-node-7"},spaces)).toEqual({ok:false,code:"INVALID_SPACE_REFERENCE"});
 });
 it("preserves metric validation precedence",()=>{
   expect(validateRelationship(adjacency({measurementDomain:"BOUNDARY_CONTACT",tolerance:10,unit:"mm"}),spaces)).toEqual({ok:false,code:"METRIC_SEMANTICS_REQUIRED"});
   expect(validateRelationship(adjacency({measurementDomain:"BOUNDARY_CONTACT",representationSpace:"PRELIMINARY_SPATIAL_REPRESENTATION",unit:"mm"}),spaces)).toEqual({ok:false,code:"METRIC_TOLERANCE_REQUIRED"});
   expect(validateRelationship(adjacency({measurementDomain:"BOUNDARY_CONTACT",representationSpace:"PRELIMINARY_SPATIAL_REPRESENTATION",tolerance:10}),spaces)).toEqual({ok:false,code:"METRIC_UNIT_REQUIRED"});
   const distance:SpatialRelationship={...adjacency(),relationshipType:"MINIMUM_DISTANCE",metric:{measurementDomain:"BOUNDARY_CLEARANCE",metricType:"EUCLIDEAN",representationSpace:"PRELIMINARY_SPATIAL_REPRESENTATION",unit:"mm"}};
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
   expect(reclassifyRegulatoryHard(regulatory,"PROJECT_HARD")).toEqual({ok:false,code:"REGULATORY_RECLASSIFICATION_FORBIDDEN"});
 });
 it("requires explicit AREA dimensional semantics",()=>{
   const area:SpatialRelationship={relationshipId:"area-1",relationshipType:"AREA",subjectSpaceId:"reception",evidence};
   expect(validateRelationship(area,spaces)).toEqual({ok:false,code:"AREA_SEMANTICS_REQUIRED"});
   expect(validateRelationship({...area,area:{areaType:"USABLE",aggregationScope:"SPACE",target:20,unit:"m2"}},spaces).ok).toBe(true);
 });
 it("keeps candidates noncanonical and rejects impossible generation counts",()=>{
   const base={candidateId:"c1",programVersion:"p1",spaceIds:["reception","meeting"],satisfiedRelationshipIds:["r1"],violatedRelationshipIds:[],unknownRelationshipIds:[],unknowns:[],generationMetadata:{generated:1,evaluated:1,retained:1,programHash:"p",ruleSetHash:"r",knowledgePackHashes:[],solverVersion:"1",solverConfigurationHash:"cfg",searchBounds:"bounded",generationRunId:"run-1"}};
   const c=createCandidate(base); expect(c.ok).toBe(true); if(!c.ok)return;
   expect(c.value.canonical).toBe(false);
   expect(cannotPromoteCandidateToAgk(c.value)).toEqual({ok:false,code:"CANDIDATE_CANONICALIZATION_FORBIDDEN"});
   expect(createCandidate({...base,generationMetadata:{...base.generationMetadata,generated:1,evaluated:2,retained:1}})).toEqual({ok:false,code:"GENERATION_TRACE_INCONSISTENT"});
 });
 it("fails closed on exceptions and cannot use exception to create applicability",()=>{
   const rule:SpatialRule={ruleId:"reg-1",source:"LAW_REGULATION",authorityRef:"authority",applicability:{typologies:["SMALL_OFFICE"],jurisdictions:["PE-LIM"],scales:["EDIFICACION"]},enforcement:"REGULATORY_HARD",stage:"AUTHORIZED_EXECUTABLE_RULE",relationship:adjacency({measurementDomain:"BOUNDARY_CONTACT",representationSpace:"PRELIMINARY_SPATIAL_REPRESENTATION",tolerance:10,unit:"mm"}),evidence};
   const ex={exceptionId:"ex-1",affectedRuleId:"reg-1",issuingAuthority:"authority",documentReference:"doc",documentHash:"hash",effectiveDate:"2026-01-01",scope:"project",proof:"registry",evidence,verificationStatus:"VERIFIED" as const};
   expect(authorizeException(ex,rule,"NOT_APPLICABLE")).toEqual({ok:false,code:"RULE_NOT_APPLICABLE"});
   expect(authorizeException({...ex,verificationStatus:"UNVERIFIED"},rule,"APPLICABLE")).toEqual({ok:false,code:"EXCEPTION_NOT_AUTHORIZED"});
   expect(authorizeException(ex,rule,"APPLICABLE").ok).toBe(true);
 });
 it("invalidates stale candidates and binds PARTI interpretation",()=>{
   const parti=createPartiInterpretation({interpretationId:"pi-1",sourceRef:"brief",sourceVersion:"1",ambiguity:"entry hierarchy",authorizedInterpretation:"public-to-private gradient",authorityRef:"D2",evidence,programVersion:"p1",status:"AUTHORIZED"});
   const base={candidateId:"c-parti",programVersion:"p1",spaceIds:["reception"],satisfiedRelationshipIds:[],violatedRelationshipIds:[],unknownRelationshipIds:[],unknowns:[],partiInterpretationHash:parti.interpretationHash,generationMetadata:{generated:1,evaluated:1,retained:1,programHash:"p",ruleSetHash:"r",knowledgePackHashes:[],solverVersion:"1",solverConfigurationHash:"cfg",searchBounds:"bounded",generationRunId:"run-p"}};
   const made=createCandidate(base);expect(made.ok).toBe(true);if(!made.ok)return;
   const stale=markCandidateOutdated(made.value,{programHash:"p2",ruleSetHash:"r",knowledgePackHashes:[],partiInterpretationHash:parti.interpretationHash});
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
   const report=buildUnsatConflictReport({conflictingRuleIds:["hard-a","hard-b"],affectedSpaceIds:["meeting"],discoveredMus:[["hard-a","hard-b"]],diagnosticCompleteness:"BOUNDED",searchBounds:"2 rules",terminationReason:"declared bound",possibleResolutionPaths:["D2 may revise project requirement"]});
   expect(report.status).toBe("UNSAT");
   expect(report.diagnosticCompleteness).toBe("BOUNDED");
   expect(report.possibleResolutionPaths[0]).toContain("may");
   expect(()=>buildUnsatConflictReport({conflictingRuleIds:["a","b","c"],affectedSpaceIds:["meeting"],discoveredMus:[["a","b"],["a","b","c"]],diagnosticCompleteness:"PARTIAL",searchBounds:"bounded",terminationReason:"limit"})).toThrow("NON_MINIMAL_MUS");
 });
 it("detects deterministic and seeded semantic nondeterminism but does not fake verification for declared nondeterminism",()=>{
   const base={declarationId:"d-r",generationRunId:"run-r",solverVersion:"1",solverConfigurationHash:"cfg",baselineHashes:["p","r"],searchBounds:"bounded",reproducibilityGuarantee:"semantic-trace"};
   const expected={candidateIds:["c1"],relationshipOutcomes:["r1:SAT"],conflictMusIds:[]};
   const changed={...expected,relationshipOutcomes:["r1:UNSAT"]};
   for(const solverClass of ["DETERMINISTIC_SOLVER","SEEDED_STOCHASTIC_SOLVER"] as const){
     const d=createSolverDeclaration({...base,solverClass,...(solverClass==="SEEDED_STOCHASTIC_SOLVER"?{randomSeed:"42"}:{})});
     expect(verifyReproducibility({declaration:d,expected,observed:changed})).toEqual({ok:false,code:"SOLVER_NONDETERMINISM_DETECTED"});
   }
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
});
