"use strict";
/** AV-006: bind a self-test receipt to the same Web commit, without invented proposal links. */
const crypto=require("node:crypto");
const sha=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
function assess(cycle,report){
 if(!cycle||cycle.schema!=="ARKI-LIVE-CYCLE-1"||!cycle.evidenceInventory||!report||report.schema!=="ARKI-AV005-SELF-TEST-1")throw Error("INVALID_INPUT");
 if(!/^[a-f0-9]{40}$/.test(report.webHead)||cycle.webHead!==report.webHead)throw Error("STALE_SELF_TEST");
 if(!Array.isArray(report.results)||!Array.isArray(cycle.evidenceInventory.trackedPairs))throw Error("INVALID_RESULTS");
 const known=new Set(cycle.evidenceInventory.trackedPairs.map(x=>x.test));
 const seen=new Set();
 const modules=report.results.map(r=>{
  if(!r||typeof r.test!=="string"||!known.has(r.test)||seen.has(r.test)||!["PASS","FAIL","TIMEOUT","EXECUTION_ERROR"].includes(r.status))throw Error("UNBOUND_TEST_RESULT");
  seen.add(r.test);
  return {test:r.test,status:r.status==="PASS"?"TEST_PASSED":"TEST_FAILED",outcome:r.status,scope:"TECHNICAL_TEST_ONLY",architecturalCompetence:"NOT_DEMONSTRATED"};
 });
 const untested=cycle.evidenceInventory.trackedPairs.filter(x=>!seen.has(x.test)).map(x=>x.test);
 const proposals=cycle.evidenceInventory.proposals.map(p=>({id:p.id,status:"UNVERIFIED",reason:"NO_EXPLICIT_TEST_TO_CAPABILITY_CONTRACT",affectedByFailure:"UNKNOWN"}));
 const failed=modules.filter(x=>x.status==="TEST_FAILED");
 const result={schema:"ARKI-AV006-DIAGNOSTIC-1",webHead:cycle.webHead,sourceReceipt:report.receiptSha256||null,modules,untested,proposals,incidents:failed.map(x=>({test:x.test,kind:"CONFIRMED_TEST_FAILURE",action:"ISOLATE_AND_INVESTIGATE",candidateRepairs:[],poApproval:"REQUIRED"})),counts:{passed:modules.length-failed.length,failed:failed.length,untested:untested.length,proposalsVerified:0},policy:{f6:"UNLOCKED_BY_PO",canonicalMutation:false,autoRepair:false,competenceClaim:false,poApproval:"PENDING"}};
 result.receiptSha256=sha(result);return result;
}
module.exports={assess};
