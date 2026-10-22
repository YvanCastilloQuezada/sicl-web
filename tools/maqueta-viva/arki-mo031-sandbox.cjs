"use strict";
/** MO-031B: sandbox-only rehearsal. Never fabricates architectural dependencies. */
const fs=require("node:fs"),crypto=require("node:crypto");
const sha=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
const clone=x=>JSON.parse(JSON.stringify(x));
function rehearse(review,registry){
 if(review?.schema!=="ARKI-MO031-CORRECTION-REVIEW-1"||review.policy?.execution!=="READ_ONLY"||review.policy?.canonicalMutation!==false||review.policy?.autoApproval!==false||!Array.isArray(review.candidates))throw Error("INVALID_REVIEW");
 if(!registry||!Array.isArray(registry.ideas)||!Array.isArray(registry.components))throw Error("INVALID_REGISTRY");
 const original=sha(registry),work=clone(registry),all=[...work.ideas,...work.components],ids=new Set();
 for(const x of all){if(!x||typeof x.id!=="string"||ids.has(x.id))throw Error("INVALID_REGISTRY_ID");ids.add(x.id)}
 const seen=new Set(),out=[];
 for(const c of review.candidates){
  if(!c||typeof c.id!=="string"||seen.has(c.id)||c.decision!=="PENDING_PO"||c.sandbox!=="NOT_EXECUTED"||c.canonicalMutation!==false)throw Error("UNSAFE_CANDIDATE");
  seen.add(c.id);
  const target=all.find(x=>x.id===c.id);
  if(!target){out.push({id:c.id,status:"BLOCKED_MISSING_REGISTRY_TARGET",mutation:"NONE"});continue}
  if(c.action!=="DECLARE_DEPENDENCIES_WITH_EVIDENCE"){out.push({id:c.id,status:"BLOCKED_ACTION_NOT_SUPPORTED",mutation:"NONE"});continue}
  // No dependency is invented. A proposed evidence request is attached to a cloned item only.
  target.mo031Sandbox={action:c.action,evidence:"MISSING",dependencies:"NOT_INFERRED",authorization:"PENDING_PO"};
  out.push({id:c.id,status:"SANDBOX_REHEARSAL_ONLY",mutation:"CLONE_ONLY",requiredEvidence:["DECLARED_DEPENDENCY_IDS","SOURCE_PROVENANCE","INDEPENDENT_VALIDATION"]});
 }
 const mutated=sha(work);
 // Explicit rollback: discard the working clone and reconstitute the original snapshot.
 const restored=clone(registry),rollback=sha(restored)===original;
 if(!rollback||sha(registry)!==original)throw Error("ROLLBACK_INTEGRITY_FAILURE");
 return {schema:"ARKI-MO031-SANDBOX-REHEARSAL-1",reviewReceipt:review.receiptSha256||null,registryBeforeSha256:original,sandboxSha256:mutated,rollbackSha256:sha(restored),rollbackVerified:rollback,candidates:out,policy:{sourceWrites:0,canonicalMutation:false,poApproval:"NOT_GRANTED",architecturalCorrection:"NOT_EXECUTED",execution:"IN_MEMORY_ONLY"},receiptSha256:sha({original,mutated,out})};
}
function read(p){const s=fs.lstatSync(p);if(!s.isFile()||s.isSymbolicLink()||s.size>2e6)throw Error("UNSAFE_INPUT");return JSON.parse(fs.readFileSync(p,"utf8"))}
module.exports={rehearse};
if(require.main===module){try{
 if(process.argv.length!==4)throw Error("USAGE: node arki-mo031-sandbox.cjs REVIEW_JSON REGISTRY_JSON");
 process.stdout.write(JSON.stringify(rehearse(read(process.argv[2]),read(process.argv[3])),null,2)+"\n");
}catch(e){process.stderr.write("ARKI_MO031_SANDBOX_FAIL: "+e.message+"\n");process.exitCode=1}}
