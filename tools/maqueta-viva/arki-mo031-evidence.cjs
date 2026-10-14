"use strict";
/** MO-031D: bind review candidates to registry facts, never inferred competence. */
const fs=require("node:fs"),crypto=require("node:crypto");
const sha=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
function bind(review,registry){
 if(review?.schema!=="ARKI-MO031-CORRECTION-REVIEW-1"||review.policy?.execution!=="READ_ONLY"||review.policy?.autoApproval!==false||review.policy?.canonicalMutation!==false||!Array.isArray(review.candidates))throw Error("INVALID_REVIEW");
 if(!registry||!Array.isArray(registry.ideas)||!Array.isArray(registry.components))throw Error("INVALID_REGISTRY");
 const entries=[...registry.ideas,...registry.components],index=new Map();
 for(const x of entries){if(!x||typeof x.id!=="string"||index.has(x.id))throw Error("DUPLICATE_OR_INVALID_ID");index.set(x.id,x)}
 const seen=new Set(),items=review.candidates.map(c=>{
  if(!c||typeof c.id!=="string"||seen.has(c.id)||c.decision!=="PENDING_PO"||c.canonicalMutation!==false)throw Error("INVALID_CANDIDATE");
  seen.add(c.id);const r=index.get(c.id);
  if(!r)return {id:c.id,status:"BLOCKED_TARGET_NOT_FOUND",verifiedDependencies:[],sourceEvidence:[]};
  const declared=Array.isArray(r.dependsOn)?r.dependsOn:null;
  const valid=declared!==null&&declared.length===new Set(declared).size&&declared.every(x=>typeof x==="string"&&index.has(x)&&x!==c.id);
  function reaches(start,target,visited=new Set()){
   if(start===target)return true;
   if(visited.has(start))return false;
   visited.add(start);
   const node=index.get(start),deps=node?.dependsOn;
   return Array.isArray(deps)&&deps.some(d=>typeof d==="string"&&reaches(d,target,visited));
  }
  const cyclic=valid&&declared.some(d=>reaches(d,c.id));
  const assessment=!valid?"UNVERIFIED_OR_UNDECLARED":cyclic?"CYCLIC_DEPENDENCY_BLOCKED":"DECLARED_IDS_PRESENT_NOT_COMPETENCE_VERIFIED";
  return {id:c.id,phase:c.phase,title:r.title||null,origin:r.origin||null,sourceStatus:r.sourceStatus||null,verification:r.verification||null,declaredDependencies:declared,dependencyAssessment:assessment,sourceEvidence:[],status:"EVIDENCE_REQUIRED",authorization:"PENDING_PO"};
 });
 const result={schema:"ARKI-MO031-EVIDENCE-BINDING-1",coreHead:review.coreHead,webHead:review.webHead,registryDigest:sha(registry),items,policy:{sourcePresenceNotCompetence:true,canonicalMutation:false,autoApproval:false,execution:"READ_ONLY"}};
 result.receiptSha256=sha(result);return result;
}

/** AV-001: independently detect a structural defect, compare three reversible in-memory
 * repair strategies, and keep all outcomes as unapproved candidates.
 * Never invent missing dependencies or treat structural validity as competence.
 */
function repairExperiment(registry){
 if(!registry||!Array.isArray(registry.ideas)||!Array.isArray(registry.components))throw Error("INVALID_REGISTRY");
 const entries=[...registry.ideas,...registry.components];
 const ids=new Set();
 for(const x of entries){if(!x||typeof x.id!=="string"||!x.id||ids.has(x.id))throw Error("INVALID_REGISTRY_IDS");ids.add(x.id)}
 const defect=entries.find(x=>Array.isArray(x.dependsOn)&&x.dependsOn.length!==new Set(x.dependsOn).size);
 if(!defect)return {schema:"ARKI-AV001-REPAIR-EXPERIMENT-1",status:"NO_SUPPORTED_DEFECT_FOUND",candidates:[],canonicalMutation:false,poApproval:"PENDING"};
 const original=JSON.stringify(registry),beforeDigest=sha(registry);
 const strategies=[
  {id:"A",method:"KEEP_FIRST_OCCURRENCE",transform:a=>[...new Set(a)]},
  {id:"B",method:"KEEP_LAST_OCCURRENCE",transform:a=>a.filter((v,i)=>a.lastIndexOf(v)===i)},
  {id:"C",method:"REMOVE_ALL_REPEATED_REFERENCES",transform:a=>a.filter(v=>a.indexOf(v)===a.lastIndexOf(v))}
 ];
 const candidates=strategies.map(s=>{
  const clone=JSON.parse(original);
  const node=[...clone.ideas,...clone.components].find(x=>x.id===defect.id);
  node.dependsOn=s.transform(node.dependsOn);
  const structurallyValid=node.dependsOn.length===new Set(node.dependsOn).size&&node.dependsOn.every(d=>typeof d==="string"&&ids.has(d)&&d!==node.id);
  const preservesDistinctDependencies=[...new Set(defect.dependsOn)].every(d=>node.dependsOn.includes(d));
  return {id:s.id,method:s.method,structurallyValid,preservesDistinctDependencies,removedOccurrences:defect.dependsOn.length-node.dependsOn.length,afterDigest:sha(clone),eligible:structurallyValid&&preservesDistinctDependencies};
 });
 if(JSON.stringify(registry)!==original||sha(registry)!==beforeDigest)throw Error("SANDBOX_MUTATION_DETECTED");
 const result={schema:"ARKI-AV001-REPAIR-EXPERIMENT-1",status:"CANDIDATES_EVALUATED_NOT_APPLIED",defect:{kind:"DUPLICATE_DEPENDENCY",id:defect.id,occurrences:defect.dependsOn.length,unique:new Set(defect.dependsOn).size},beforeDigest,candidates,rollbackVerified:true,canonicalMutation:false,poApproval:"PENDING",learning:"CANDIDATE_NOT_PROMOTED_DELTA62_NOT_EXECUTED"};
 result.receiptSha256=sha(result);return result;
}
function read(p){const s=fs.lstatSync(p);if(!s.isFile()||s.isSymbolicLink()||s.size>2e6)throw Error("UNSAFE_INPUT");return JSON.parse(fs.readFileSync(p,"utf8"))}
module.exports={bind,repairExperiment};
if(require.main===module){try{if(process.argv.length!==4)throw Error("USAGE: node arki-mo031-evidence.cjs REVIEW_JSON REGISTRY_JSON");process.stdout.write(JSON.stringify(bind(read(process.argv[2]),read(process.argv[3])),null,2)+"\n")}catch(e){process.stderr.write("ARKI_MO031_EVIDENCE_FAIL: "+e.message+"\n");process.exitCode=1}}
