"use strict";
/** MO-07.2: multirepository semantic reconstruction. Advisory; no execution claims. */
const fs=require("node:fs"),path=require("node:path"),cp=require("node:child_process"),crypto=require("node:crypto");
const {audit}=require("./arki-mo071-evidence-inventory.cjs");
const sha=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
const ROLES={web:"INTERFACE_AND_COORDINATION",core:"CANONICAL_SPATIAL_DECISION_DOMAIN",acs:"EXPERIMENTAL_CAPABILITY_LAB_NOT_RUNTIME"};
const LIMIT=120000;
function index(root){
 if(!root||!fs.existsSync(root)||!fs.existsSync(path.join(root,".git")))return {status:"NOT_AVAILABLE",files:[]};
 try{
  const names=cp.execFileSync("git",["-C",root,"ls-files","-z"],{encoding:"utf8",maxBuffer:16*1024*1024,timeout:15000}).split("\0").filter(Boolean);
  return {status:"INDEXED_TRACKED_FILES",files:names.filter(n=>!n.includes("node_modules/")).sort()};
 }catch{return {status:"INDEX_FAILED",files:[]}}
}
function locate(reference,repos){
 const raw=reference.replace(/:\d+(?:[-,]\d+)*.*$/,"").trim().replace(/^`|`$/g,"");
 if(!raw||raw.includes("..")||path.isAbsolute(raw))return {reference,status:"UNSAFE_OR_UNRESOLVED_REFERENCE",matches:[]};
 const base=path.posix.basename(raw);
 const matches=[];
 for(const [name,repo] of Object.entries(repos)){
  if(repo.status!=="INDEXED_TRACKED_FILES")continue;
  const candidates=repo.files.filter(f=>f===raw||f.endsWith("/"+raw)||path.posix.basename(f)===base);
  for(const f of candidates.slice(0,12))matches.push({repository:name,path:f,match:f===raw?"EXACT":f.endsWith("/"+raw)?"SUFFIX":"BASENAME_ONLY"});
 }
 return {reference,status:matches.length?"CANDIDATE_PATHS_NOT_BEHAVIOR_VERIFIED":"NOT_LOCATED_IN_INDEXED_REPOSITORIES",matches:matches.slice(0,24)};
}
function enrich(registry,roots){
 const web=roots.web||null;
 const base=audit(registry,web||process.cwd());
 const repos=Object.fromEntries(["web","core","acs"].map(k=>[k,index(roots[k])]));
 const pieces=base.pieces.map(p=>{
  const original=[...registry.ideas,...registry.components].find(x=>x.id===p.id);
  const title=String(p.name||"").trim();
  const purpose=p.purpose||("Hipótesis por verificar: la capacidad «"+title+"» debería aportar al diseño arquitectónico multiobjetivo y multiescala; especificar entradas, salidas, restricciones y criterios de aceptación.");
  const inferred=!p.purpose;
  const refs=[...String(original.sourceEvidence||"").matchAll(/`([^`]+)`/g)].map(m=>m[1]);
  const code=refs.map(r=>locate(r,repos));
  const issues=[...p.missingEvidence];
  if(inferred)issues.push("PURPOSE_RECONSTRUCTED_NOT_VALIDATED");
  if(!refs.length)issues.push("NO_EXPLICIT_CODE_REFERENCES");
  if(code.some(c=>c.status==="NOT_LOCATED_IN_INDEXED_REPOSITORIES"))issues.push("REFERENCES_NOT_LOCATED");
  return {id:p.id,kind:p.kind,name:p.name,mission:"SUPER_ARCHITECT_MULTI_OBJECTIVE_MULTI_SCALE",
   purpose:{text:purpose,epistemicStatus:inferred?"HYPOTHESIS_FROM_NAME_AND_MISSION":"HISTORICAL_DOCUMENTARY_INTERPRETATION",source:inferred?"TITLE_PLUS_APPROVED_MISSION":original.origin||"REGISTRY"},
   expectedContract:{inputs:"UNKNOWN_REQUIRES_SPECIFICATION",outputs:"UNKNOWN_REQUIRES_SPECIFICATION",constraints:"UNKNOWN_REQUIRES_SPECIFICATION",multiobjectiveCriteria:"UNKNOWN_REQUIRES_SPECIFICATION",applicableScales:"UNKNOWN_REQUIRES_SPECIFICATION"},
   historicalPhase:p.historicalPhase,phaseAssessment:"HISTORICAL_PROPOSAL_UNVERIFIED",codeCandidates:code,
   behaviorVerification:"NOT_PERFORMED",semanticAlignment:"REQUIRES_HUMAN_OR_TEST_REVIEW",
   predecessors:{declared:p.declaredDependencies,candidates:[],status:"NOT_INFERRED_WITHOUT_CONTRACT_EVIDENCE"},
   knownGap:p.knownGap,openQuestions:[...new Set(issues)],promotion:"BLOCKED_PENDING_EVIDENCE"};
 });
 const result={schema:"ARKI-MO072-MULTIREPO-SEMANTIC-RECONSTRUCTION-1",repositories:Object.fromEntries(Object.entries(repos).map(([k,v])=>[k,{role:ROLES[k],status:v.status,trackedFiles:v.files.length}])),
  summary:{total:pieces.length,hypothesizedPurposes:pieces.filter(x=>x.purpose.epistemicStatus==="HYPOTHESIS_FROM_NAME_AND_MISSION").length,documentaryPurposes:pieces.filter(x=>x.purpose.epistemicStatus==="HISTORICAL_DOCUMENTARY_INTERPRETATION").length,verifiedBehaviors:0},
  pieces,policy:{noFabricatedContracts:true,noInferredDependencies:true,noCanonicalWrites:true,noAgkExecution:true,noKnowledgePromotion:true,poApprovalRequired:true}};
 result.receiptSha256=sha(result);return result;
}
module.exports={enrich,locate,index};
if(require.main===module){
 const root=path.resolve(__dirname,"../..");
 const roots={web:root,core:process.argv[2]&&path.resolve(process.argv[2]),acs:process.argv[3]&&path.resolve(process.argv[3])};
 const registry=JSON.parse(fs.readFileSync(path.join(__dirname,"assembly-registry.json"),"utf8"));
 process.stdout.write(JSON.stringify(enrich(registry,roots),null,2)+"\n");
}
