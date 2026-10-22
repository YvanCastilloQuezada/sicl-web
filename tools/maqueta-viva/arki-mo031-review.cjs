"use strict";
/** MO-031: evidence-bound correction review. No repository writes or auto approval. */
const fs=require("node:fs"),crypto=require("node:crypto");
const SHA=/^[a-f0-9]{40}$/;
const digest=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
function review(report,core,web,{expectedCoreHead,expectedWebHead}={}){
 if(!report||report.schema!=="ARKI-MO025-ADVISORY-1"||report.policy?.canonicalMutation!==false||report.policy?.poApproval!=="NOT_GRANTED"||report.evidence!=="ADVISORY_ONLY_NOT_ARCHITECTURAL_COMPETENCE")throw Error("INVALID_ADVISORY");
 if(!core||core.schema!=="arki.mapa_vivo.v1"||!SHA.test(core.head||"")||core.canonical_mutations!==0)throw Error("INVALID_CORE_SOURCE");
 if(!web||web.schema!=="ARKI-LIVE-SYSTEMS-SNAPSHOT-1"||!SHA.test(web.sourceCommit||"")||web.canonicalMutation!==false||web.execution!=="READ_ONLY")throw Error("INVALID_WEB_SOURCE");
 if(!SHA.test(expectedCoreHead||"")||!SHA.test(expectedWebHead||"")||core.head!==expectedCoreHead||web.sourceCommit!==expectedWebHead)throw Error("UNBOUND_SOURCE_IDENTITY");
 if(!Array.isArray(report.proposals)||report.proposals.length>100)throw Error("INVALID_PROPOSALS");
 const seen=new Set();
 const candidates=report.proposals.map(p=>{
  if(!p||typeof p.id!=="string"||!p.id||seen.has(p.id)||!/^F(?:10|[1-9])$/.test(p.phase||"")||typeof p.action!=="string"||!p.action||p.status!=="REVIEW_REQUIRED"||p.authorized!==false)throw Error("UNSAFE_PROPOSAL");
  seen.add(p.id);
  return {id:p.id,phase:p.phase,action:p.action,decision:"PENDING_PO",sandbox:"NOT_EXECUTED",tests:"NOT_EXECUTED",rollback:"REQUIRED_BEFORE_EXECUTION",canonicalMutation:false};
 });
 return {schema:"ARKI-MO031-CORRECTION-REVIEW-1",coreHead:core.head,webHead:web.sourceCommit,advisoryFingerprint:report.inputFingerprint||null,candidates,policy:{execution:"READ_ONLY",autoApproval:false,canonicalMutation:false,agkExecuted:false,competenceVerified:false},receiptSha256:digest({coreHead:core.head,webHead:web.sourceCommit,candidates})};
}
function read(p){const s=fs.lstatSync(p);if(!s.isFile()||s.isSymbolicLink()||s.size>2e6)throw Error("UNSAFE_INPUT");return JSON.parse(fs.readFileSync(p,"utf8"))}
module.exports={review};
if(require.main===module){try{
 const [report,core,web,coreHead,webHead]=process.argv.slice(2);
 if(process.argv.length!==7)throw Error("USAGE: node arki-mo031-review.cjs ADVISORY_JSON CORE_JSON WEB_JSON CORE_SHA WEB_SHA");
 process.stdout.write(JSON.stringify(review(read(report),read(core),read(web),{expectedCoreHead:coreHead,expectedWebHead:webHead}),null,2)+"\n");
}catch(e){process.stderr.write("ARKI_MO031_REVIEW_FAIL: "+e.message+"\n");process.exitCode=1}}
