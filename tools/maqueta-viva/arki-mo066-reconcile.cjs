"use strict";
/** MO-06.6: read-only reconciliation across operational, diagnosis, queue and history. */
const crypto=require("node:crypto");
const {project}=require("./arki-mo05-operational.cjs");
const {propose}=require("./arki-mo055-proposals.cjs");
const {diagnose}=require("./arki-mo061-cause-triage.cjs");
const {cluster}=require("./arki-mo062-workstreams.cjs");
const {prioritize}=require("./arki-mo063-priority.cjs");
const {inspectQueue}=require("./arki-mo064-history.cjs");
const {reevaluate}=require("./arki-mo065-reevaluate.cjs");
const hash=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
function reconcile({registry,journal,anchor,previousRegistry}){
 const operational=project(registry),proposals=propose(registry),triage=diagnose(registry),groups=cluster(registry),queue=prioritize(registry);
 if(proposals.sourceReceipt!==operational.receiptSha256||triage.sourceReceipt!==operational.receiptSha256||triage.proposalReceipt!==proposals.receiptSha256||groups.sourceReceipt!==triage.receiptSha256||queue.sourceReceipt!==groups.receiptSha256)throw Error("SOURCE_RECEIPT_MISMATCH");
 const history=journal&&anchor?inspectQueue(journal,anchor,registry):null;
 const delta=previousRegistry?reevaluate(previousRegistry,registry):null;
 const checks={
  provenanceChain:"VERIFIED",
  activityCounts:operational.summary.total===triage.summary.activities&&triage.summary.activities===groups.summary.activities?"CONSISTENT":"INCONSISTENT",
  proposals:proposals.summary.proposals===triage.summary.proposals?"CONSISTENT":"INCONSISTENT",
  history:history?history.status:"NOT_CONFIGURED",
  sourceComparison:delta?delta.queueChanged?"QUEUE_CHANGED":"QUEUE_UNCHANGED":"NOT_PROVIDED"
 };
 const result={schema:"ARKI-MO066-CONTINUITY-RECONCILIATION-1",receipts:{operational:operational.receiptSha256,proposals:proposals.receiptSha256,triage:triage.receiptSha256,groups:groups.receiptSha256,queue:queue.receiptSha256},
  summary:{activities:operational.summary.total,reportedIssues:triage.summary.reportedIssues,proposals:proposals.summary.proposals,workstreams:groups.summary.workstreams,queueItems:queue.queue.length},
  checks,history:history?history.history:null,delta:delta?{changedIds:delta.changedIds,affectedIds:delta.affectedIds,receipt:delta.receiptSha256}:null,
  readiness:checks.activityCounts==="CONSISTENT"&&checks.proposals==="CONSISTENT"&&(!history||history.status==="RECOVERED_MATCH")?"ADVISORY_CONSISTENT":"REVIEW_REQUIRED",
  policy:{canonicalMutation:false,agkExecution:false,simulationExecuted:false,poApproval:"REQUIRED",learning:"DEFERRED"}};
 result.receiptSha256=hash(result);return result;
}
module.exports={reconcile};
if(require.main===module){
 const fs=require("node:fs"),path=require("node:path");
 try{const [journal,anchor,previous]=process.argv.slice(2);
 if(Boolean(journal)!==Boolean(anchor))throw Error("JOURNAL_AND_ANCHOR_REQUIRED_TOGETHER");
 const read=p=>JSON.parse(fs.readFileSync(p,"utf8"));
 const registry=read(path.join(__dirname,"assembly-registry.json"));
 process.stdout.write(JSON.stringify(reconcile({registry,journal,anchor,previousRegistry:previous?read(previous):null}),null,2)+"\n");
 }catch(e){process.stderr.write("ARKI_MO066_FAIL "+e.message+"\n");process.exitCode=1}
}
