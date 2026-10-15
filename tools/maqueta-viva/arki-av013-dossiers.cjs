"use strict";
/** AV-013: incident-grounded repair dossiers. Does not invent patches or execute them. */
const fs=require("node:fs"),crypto=require("node:crypto");
const digest=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
function prepare(plan,reproduction){
 if(!plan||plan.schema!=="ARKI-AV008-INVESTIGATION-1"||!Array.isArray(plan.cases)||!/^[a-f0-9]{40}$/.test(plan.webHead))throw Error("INVALID_INVESTIGATION");
 if(!reproduction||reproduction.schema!=="ARKI-AV009-ISOLATED-REPRODUCTION-1"||!Array.isArray(reproduction.cases)||reproduction.webHead!==plan.webHead||reproduction.sourceInvestigationReceipt!==plan.receiptSha256)throw Error("BROKEN_RECEIPT_CHAIN");
 if(plan.cases.length!==reproduction.cases.length||plan.cases.length>8)throw Error("CASE_COUNT_MISMATCH");
 const seen=new Set();
 const dossiers=plan.cases.map(item=>{
  if(!item||typeof item.test!=="string"||seen.has(item.test)||item.classification!=="FAILURE_CONFIRMED_CAUSE_UNKNOWN")throw Error("INVALID_CASE");
  seen.add(item.test);
  const evidence=reproduction.cases.find(x=>x.test===item.test);
  if(!evidence||evidence.previousOutcome!==item.outcome)throw Error("MISMATCHED_INCIDENT");
  const confirmed=evidence.classification==="REPRODUCED"&&evidence.reproductionOutcome===item.outcome;
  return {test:item.test,status:confirmed?"READY_FOR_ROOT_CAUSE_INVESTIGATION":"BLOCKED_NOT_REPRODUCED",reproduction:evidence.classification,rootCause:"UNKNOWN",sourceContract:"NOT_VERIFIED",candidates:[],requiredEvidence:["verified_root_cause","source_contract","candidate_diff","isolated_regression","rollback_proof"],poApproval:"REQUIRED",canonicalMutation:false};
 });
 const result={schema:"ARKI-AV013-REPAIR-DOSSIERS-1",webHead:plan.webHead,sourceInvestigationReceipt:plan.receiptSha256,sourceReproductionReceipt:reproduction.receiptSha256,dossiers,summary:{incidents:dossiers.length,readyForInvestigation:dossiers.filter(x=>x.status==="READY_FOR_ROOT_CAUSE_INVESTIGATION").length,repairsApplied:0},policy:{canonicalMutation:false,repairApplied:false,autoApproval:false,architecturalCompetence:"NOT_DEMONSTRATED"}};
 result.receiptSha256=digest(result);return result;
}
module.exports={prepare};
if(require.main===module){try{if(process.argv.length!==4)throw Error("USAGE: node arki-av013-dossiers.cjs AV008_JSON AV009_JSON");function read(p){const st=fs.lstatSync(p);if(!st.isFile()||st.isSymbolicLink()||st.size>3000000)throw Error("UNSAFE_INPUT");return JSON.parse(fs.readFileSync(p,"utf8"))}process.stdout.write(JSON.stringify(prepare(read(process.argv[2]),read(process.argv[3])),null,2)+"\n")}catch(e){process.stderr.write("ARKI_AV013_FAIL: "+e.message+"\n");process.exitCode=1}}
