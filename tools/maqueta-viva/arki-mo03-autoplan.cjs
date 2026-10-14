"use strict";
/** MO-03: automatic, advisory-only work queue. No inferred competence or approval. */
const crypto=require("node:crypto");
const {build}=require("./arki-arbol-vivo-auto.cjs");
const {reconcileCoreMapaVivo}=require("./arki-core-mapa-vivo-bridge.cjs");
const sha=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
function planMo03({registry,coreMap,webSnapshot,expectedCoreHead}){
 const tree=build(registry);
 const bridge=reconcileCoreMapaVivo(coreMap,webSnapshot,{expectedCoreHead});
 const phaseStatus=new Map(webSnapshot.map.findings.map(x=>[x.phase,x]));
 const problems=new Set(bridge.issues.filter(x=>x.phase).map(x=>x.phase));
 const registryItems=[...registry.ideas,...registry.components];
 const registryById=new Map(registryItems.map(x=>[x.id,x]));
 const queue=[...tree.order,...tree.excluded].map((item,index)=>{
  const source=phaseStatus.get(item.phase);
  const reasons=[];
  const declared=registryById.get(item.id);
  const dependencyIssues=tree.dependencyCoverage.issues.filter(x=>x.id===item.id);
  const structuralBlocked=item.prerequisiteStatus!=="DECLARED_NOT_COMPETENCE_VERIFIED";
  const dependencyState=dependencyIssues.some(x=>x.code==="DEPENDENCIES_UNDECLARED")?"UNDECLARED":dependencyIssues.length||structuralBlocked?"STRUCTURALLY_BLOCKED":"DECLARED_NOT_VERIFIED";
  if(item.excluded)reasons.push("EXPLICITLY_OUT_OF_SCOPE");
  else if(!item.phase)reasons.push("PHASE_UNASSIGNED");
  if(structuralBlocked&&!item.excluded)reasons.push("DEPENDENCY_STRUCTURE_BLOCKED");
  if(source?.classification==="FROZEN_PROTECTED")reasons.push("FROZEN_PROTECTED");
  if(problems.has(item.phase))reasons.push("CORE_WEB_DISCREPANCY");
  if(!item.excluded)reasons.push("COMPETENCE_NOT_VERIFIED");
  return {id:item.id,phase:item.phase,priorityRank:index+1,priorityScore:item.priorityScore,dependsOn:item.dependsOn,dependencyState,dependencyIssues,gate:item.excluded?"EXCLUDED_OUT_OF_SCOPE":"BLOCKED_UNVERIFIED",reasons,proposedAction:item.excluded?"NO_ACTION_OUT_OF_SCOPE":dependencyState==="UNDECLARED"?"DECLARE_DEPENDENCIES_WITH_EVIDENCE":reasons.includes("DEPENDENCY_STRUCTURE_BLOCKED")?"RECONCILE_DEPENDENCIES":reasons.includes("PHASE_UNASSIGNED")?"RECONCILE_PHASE":reasons.includes("CORE_WEB_DISCREPANCY")?"RECONCILE_CORE_WEB_EVIDENCE":"COLLECT_INDEPENDENT_COMPETENCE_EVIDENCE",automaticExecution:false};
 });
 const findings=[...bridge.issues.map(x=>({...x,origin:"CORE_WEB"})),...tree.issues.map(x=>({...x,origin:"TREE"}))];
 const result={schema:"ARKI-MO03-AUTOMATED-ADVISORY-1",coreHead:bridge.coreHead,webHead:bridge.webHead,sourceRegistry:registry.updated_at||null,phaseStatuses:webSnapshot.map.findings.map(x=>({phase:x.phase,classification:x.classification,authority:"WEB_MAP_CLAIM_ONLY"})),counts:{activities:queue.length,inScope:queue.filter(x=>x.gate!=="EXCLUDED_OUT_OF_SCOPE").length,excluded:queue.filter(x=>x.gate==="EXCLUDED_OUT_OF_SCOPE").length,blocked:queue.filter(x=>x.gate==="BLOCKED_UNVERIFIED").length,dependenciesUndeclared:queue.filter(x=>x.dependencyState==="UNDECLARED"&&x.gate!=="EXCLUDED_OUT_OF_SCOPE").length,dependenciesStructurallyBlocked:queue.filter(x=>x.dependencyState==="STRUCTURALLY_BLOCKED"&&x.gate!=="EXCLUDED_OUT_OF_SCOPE").length,dependenciesDeclaredUnverified:queue.filter(x=>x.dependencyState==="DECLARED_NOT_VERIFIED"&&x.gate!=="EXCLUDED_OUT_OF_SCOPE").length,findings:findings.length},findings,queue,policy:{f6FrozenRevocation:"HONOR_CURRENT_MAP_STATUS",automaticAnalysis:true,automaticCanonicalMutation:false,automaticCompetencePromotion:false,approval:"SPECIFIC_PO_AUTHORIZATION_REQUIRED",agk:"NOT_EXECUTED"},execution:"READ_ONLY"};
 result.receiptSha256=sha(result);return result;
}
module.exports={planMo03};
if(require.main===module){
 try{
  const fs=require("node:fs"),path=require("node:path");
  const [coreFile,webFile,expected]=process.argv.slice(2);
  if(!coreFile||!webFile||process.argv.length>5)throw Error("USAGE: node arki-mo03-autoplan.cjs CORE_JSON WEB_JSON [EXPECTED_CORE_SHA]");
  function read(file){const s=fs.lstatSync(file);if(!s.isFile()||s.isSymbolicLink()||s.size>2000000)throw Error("UNSAFE_INPUT_FILE");return JSON.parse(fs.readFileSync(file,"utf8"));}
  const registry=read(path.join(__dirname,"assembly-registry.json"));
  process.stdout.write(JSON.stringify(planMo03({registry,coreMap:read(coreFile),webSnapshot:read(webFile),expectedCoreHead:expected}),null,2)+"\n");
 }catch(e){process.stderr.write("ARKI_MO03_FAIL: "+e.message+"\n");process.exitCode=1;}
}
