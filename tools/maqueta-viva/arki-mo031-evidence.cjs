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
  const valid=declared!==null&&declared.every(x=>typeof x==="string"&&index.has(x)&&x!==c.id);
  return {id:c.id,phase:c.phase,title:r.title||null,origin:r.origin||null,sourceStatus:r.sourceStatus||null,verification:r.verification||null,declaredDependencies:declared,dependencyAssessment:valid?"DECLARED_IDS_PRESENT_NOT_COMPETENCE_VERIFIED":"UNVERIFIED_OR_UNDECLARED",sourceEvidence:[],status:"EVIDENCE_REQUIRED",authorization:"PENDING_PO"};
 });
 const result={schema:"ARKI-MO031-EVIDENCE-BINDING-1",coreHead:review.coreHead,webHead:review.webHead,registryDigest:sha(registry),items,policy:{sourcePresenceNotCompetence:true,canonicalMutation:false,autoApproval:false,execution:"READ_ONLY"}};
 result.receiptSha256=sha(result);return result;
}
function read(p){const s=fs.lstatSync(p);if(!s.isFile()||s.isSymbolicLink()||s.size>2e6)throw Error("UNSAFE_INPUT");return JSON.parse(fs.readFileSync(p,"utf8"))}
module.exports={bind};
if(require.main===module){try{if(process.argv.length!==4)throw Error("USAGE: node arki-mo031-evidence.cjs REVIEW_JSON REGISTRY_JSON");process.stdout.write(JSON.stringify(bind(read(process.argv[2]),read(process.argv[3])),null,2)+"\n")}catch(e){process.stderr.write("ARKI_MO031_EVIDENCE_FAIL: "+e.message+"\n");process.exitCode=1}}
