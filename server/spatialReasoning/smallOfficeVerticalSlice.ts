import { createCandidate, determineApplicability, validateRelationship } from "./core";
import type { LayoutCandidate, SpatialRelationship, SpaceIdentity } from "./types";

export function smallOfficeVerticalSlice(): { spaces: readonly SpaceIdentity[]; relationships: readonly SpatialRelationship[]; candidate: LayoutCandidate } {
 const spaces:SpaceIdentity[]=[
  {spaceId:"reception",provenance:"DECLARED_BY_D2",lifecycle:"CONCEPTUAL"},
  {spaceId:"open-workspace",provenance:"DECLARED_BY_D2",lifecycle:"CONCEPTUAL"},
  {spaceId:"meeting-room",provenance:"DECLARED_BY_D2",lifecycle:"CONCEPTUAL"},
  {spaceId:"service",provenance:"DECLARED_BY_D2",lifecycle:"CONCEPTUAL"},
 ];
 const ev=[{evidenceId:"project-brief",classification:"RESTRICCION" as const,sourceRef:"PROJECT_REQUIREMENT"}];
 const relationships:SpatialRelationship[]=[
  {relationshipId:"access-1",relationshipType:"REQUIRED_ACCESS",subjectSpaceId:"reception",objectSpaceId:"open-workspace",evidence:ev},
  {relationshipId:"adj-1",relationshipType:"DIRECT_ADJACENCY",subjectSpaceId:"reception",objectSpaceId:"meeting-room",metric:{measurementDomain:"BOUNDARY_CONTACT",representationSpace:"PRELIMINARY_SPATIAL_REPRESENTATION",tolerance:10,unit:"mm"},evidence:ev},
  {relationshipId:"sep-1",relationshipType:"BARRIER_REQUIRED",subjectSpaceId:"service",objectSpaceId:"meeting-room",evidence:ev},
   {relationshipId:"area-open-1",relationshipType:"AREA",subjectSpaceId:"open-workspace",area:{areaType:"USABLE",aggregationScope:"SPACE",target:60,unit:"m2"},evidence:ev},
 ];
 for(const r of relationships){const v=validateRelationship(r,spaces);if(!v.ok)throw new Error(v.code);}
 if(determineApplicability({typologies:["SMALL_OFFICE"],jurisdictions:["PE-LIM"],scales:["EDIFICACION"]},{typology:"SMALL_OFFICE",jurisdiction:"PE-LIM",scale:"EDIFICACION"})!=="APPLICABLE")throw new Error("RULE_NOT_APPLICABLE");
 const result=createCandidate({candidateId:"small-office-c1",programVersion:"small-office-v1",spaceIds:spaces.map(s=>s.spaceId),satisfiedRelationshipIds:relationships.map(r=>r.relationshipId),violatedRelationshipIds:[],unknownRelationshipIds:[],unknowns:[],generationMetadata:{generated:1,evaluated:1,retained:1,programHash:"small-office-v1",ruleSetHash:"project-requirements-v1",knowledgePackHashes:[],solverVersion:"phase1-contract-spine",solverConfigurationHash:"no-optimizer",searchBounds:"single-candidate-contract-slice",generationRunId:"small-office-run-1"}});
 if(!result.ok)throw new Error(result.code);
 return {spaces:Object.freeze(spaces),relationships:Object.freeze(relationships),candidate:result.value};
}
