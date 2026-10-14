"use strict";
/** Árbol Gemelo Digital: compare exactly three independently measured alternatives.
 * Pure evaluator; cannot fabricate experiments, choose winner, or mutate canonical tree.
 */
const crypto=require("node:crypto");
const hash=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
const finite=x=>typeof x==="number"&&Number.isFinite(x)&&x>=0;
function evaluateThree({ideaId,baseline,alternatives,dependencyGate,sourceCommit}={}){
 if(typeof ideaId!=="string"||!ideaId.trim()||!/^[0-9a-f]{40}$/.test(sourceCommit||""))throw Error("INVALID_IDENTITY");
 if(!baseline||!finite(baseline.timeMs)||!finite(baseline.cost)||!finite(baseline.quality)||baseline.quality>100)throw Error("INVALID_BASELINE");
 if(!Array.isArray(alternatives)||alternatives.length!==3)throw Error("EXACTLY_THREE_REQUIRED");
 const ids=new Set();
 const results=alternatives.map(a=>{
  if(!a||typeof a.id!=="string"||!a.id.trim()||ids.has(a.id))throw Error("INVALID_ALTERNATIVE_ID");
  ids.add(a.id);
  if(!["MEASURED","HYPOTHETICAL"].includes(a.evidenceLevel))throw Error("INVALID_EVIDENCE_LEVEL");
  if(!finite(a.timeMs)||!finite(a.cost)||!finite(a.quality)||a.quality>100||!finite(a.risk)||a.risk>100||!Number.isInteger(a.testsPassed)||!Number.isInteger(a.testsTotal)||a.testsTotal<1||a.testsPassed<0||a.testsPassed>a.testsTotal)throw Error("INVALID_METRICS");
  if(a.evidenceLevel==="MEASURED"&&(!a.evidence||!/^[0-9a-f]{64}$/.test(a.evidence.digest||"")||a.evidence.sourceCommit!==sourceCommit||a.evidence.verifiedBy!=="INDEPENDENT_VERIFIER"))throw Error("MEASURED_EVIDENCE_REQUIRED");
  const speedImprovementPct=baseline.timeMs>0?Number(((baseline.timeMs-a.timeMs)/baseline.timeMs*100).toFixed(1)):null;
  const costChangePct=baseline.cost>0?Number(((a.cost-baseline.cost)/baseline.cost*100).toFixed(1)):null;
  return {id:a.id,title:String(a.title||a.id),evidenceLevel:a.evidenceLevel,metrics:{timeMs:a.timeMs,cost:a.cost,quality:a.quality,risk:a.risk,testsPassed:a.testsPassed,testsTotal:a.testsTotal,speedImprovementPct,costChangePct},comparison:"NOT_RANKED_ACROSS_UNVERIFIED_EVIDENCE",eligibleForOwnerDecision:a.evidenceLevel==="MEASURED"&&a.testsPassed===a.testsTotal&&dependencyGate==="PASS"&&a.risk<=50,implementation:"NOT_EXECUTED"};
 });
 const comparable=results.every(r=>r.evidenceLevel==="MEASURED");
 const status=dependencyGate!=="PASS"?"DEPENDENCIES_BLOCKED":comparable?"THREE_MEASURED_OPTIONS_FOR_OWNER_REVIEW":"SIMULATION_EVIDENCE_INCOMPLETE";
 const output={schema:"ARKI-TWIN-THREE-ALTERNATIVES-1",ideaId,sourceCommit,baseline,dependencyGate:dependencyGate||"UNKNOWN",status,alternatives:results,selectedAlternative:null,ownerDecision:"PENDING",canonicalMutation:false,implementation:"NOT_EXECUTED"};
 return {...output,receiptSha256:hash(output)};
}
module.exports={evaluateThree};
