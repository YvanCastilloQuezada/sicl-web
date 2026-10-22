"use strict";
/** AV-017: evidence-bound PO decision proposal, never a write authorization. */
const fs=require("node:fs"),crypto=require("node:crypto");
const digest=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
function propose(report){
 if(!report||report.schema!=="ARKI-AV016-SAME-INCIDENT-REPAIR-1"||!/^[a-f0-9]{40}$/.test(report.originalHead)||!/^[a-f0-9]{40}$/.test(report.isolatedHead)||report.incident?.baseline!=="FAIL"||report.policy?.sameIncidentPatchDemonstrated!==true||report.policy?.canonicalMutation!==false||report.policy?.repairApplied!==false||!Array.isArray(report.candidates)||report.candidates.length!==3||!report.receiptSha256)throw Error("UNVERIFIED_EXPERIMENT");
 const {receiptSha256,...unsigned}=report;
 if(digest(unsigned)!==receiptSha256)throw Error("TAMPERED_RECEIPT");
 const seen=new Set();
 const alternatives=report.candidates.map(c=>{
  if(!c||!["A","B","C"].includes(c.id)||seen.has(c.id)||!["PASS","FAIL","TIMEOUT","EXECUTION_ERROR"].includes(c.status)||c.rollbackVerified!==true||c.canonicalMutation!==false)throw Error("UNSAFE_CANDIDATE");
  seen.add(c.id);
  return {id:c.id,label:c.label,status:c.status,eligibleForReview:c.status==="PASS",rollbackVerified:true,sourceEvidence:{stdoutSha256:c.stdoutSha256,stderrSha256:c.stderrSha256}};
 });
 if(seen.size!==3)throw Error("INCOMPLETE_ALTERNATIVES");
 const eligible=alternatives.filter(a=>a.eligibleForReview);
 const proposal={schema:"ARKI-AV017-PO-PROPOSAL-1",sourceReceipt:report.receiptSha256,originalHead:report.originalHead,isolatedHead:report.isolatedHead,scope:"CONTROLLED_FIXTURE_ONLY",incident:{...report.incident},alternatives,decision:{status:"AWAITING_PO",selected:null,recommendation:eligible.length===1?eligible[0].id:null,reason:eligible.length===1?"SOLE_PASSING_CANDIDATE":"NO_UNIQUE_WINNER",authorizationToken:null},risk:{realSystemRepairDemonstrated:false,fullCoreRegressionDemonstrated:false,sourceContractVerified:false},policy:{canonicalMutation:false,approved:false,automaticPromotion:false,poApproval:"REQUIRED",rollback:"MANDATORY"}};
 proposal.receiptSha256=digest(proposal);return proposal;
}
module.exports={propose};
if(require.main===module){try{if(process.argv.length!==3)throw Error("USAGE: node arki-av017-proposal.cjs AV016_JSON");const p=process.argv[2],s=fs.lstatSync(p);if(!s.isFile()||s.isSymbolicLink()||s.size>3000000)throw Error("UNSAFE_INPUT");process.stdout.write(JSON.stringify(propose(JSON.parse(fs.readFileSync(p,"utf8"))),null,2)+"\n")}catch(e){process.stderr.write("ARKI_AV017_FAIL: "+e.message+"\n");process.exitCode=1}}
