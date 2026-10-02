import { describe, expect, it } from "vitest";
import { issueD2AuthorityToken } from "../d2Authority";
import { assertExecutionIntegrity, authorizeRule, beginExecution, cannotPromoteCandidateToAgk, createCandidate, createSolverDeclaration, determineApplicability, prepareExecutionEnvelope, reclassifyRegulatoryHard, validateRelationship } from "./core";
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
 it("keeps candidates noncanonical and rejects impossible generation counts",()=>{
   const base={candidateId:"c1",programVersion:"p1",spaceIds:["reception","meeting"],satisfiedRelationshipIds:["r1"],violatedRelationshipIds:[],unknownRelationshipIds:[],unknowns:[],generationMetadata:{generated:1,evaluated:1,retained:1,programHash:"p",ruleSetHash:"r",knowledgePackHashes:[],solverVersion:"1",solverConfigurationHash:"cfg",searchBounds:"bounded",generationRunId:"run-1"}};
   const c=createCandidate(base); expect(c.ok).toBe(true); if(!c.ok)return;
   expect(c.value.canonical).toBe(false);
   expect(cannotPromoteCandidateToAgk(c.value)).toEqual({ok:false,code:"CANDIDATE_CANONICALIZATION_FORBIDDEN"});
   expect(createCandidate({...base,generationMetadata:{...base.generationMetadata,generated:1,evaluated:2,retained:1}})).toEqual({ok:false,code:"GENERATION_TRACE_INCONSISTENT"});
 });
 it("prebinds solver declaration and rejects timestamp-only/unbound execution",()=>{
   const d=createSolverDeclaration({declarationId:"d1",generationRunId:"run-1",solverClass:"DETERMINISTIC_SOLVER",solverVersion:"1",solverConfigurationHash:"cfg",baselineHashes:["p","r"],searchBounds:"bounded",reproducibilityGuarantee:"semantic-trace"});
   const e=prepareExecutionEnvelope({generationRunId:"run-1",programHash:"p",ruleSetHash:"r",knowledgePackHashes:[],solverClassDeclarationHash:"forged",solverVersion:"1",solverConfigurationHash:"cfg",searchBounds:"bounded"});
   expect(beginExecution(e,d)).toEqual({ok:false,code:"SOLVER_DECLARATION_INTEGRITY_FAILED"});
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
