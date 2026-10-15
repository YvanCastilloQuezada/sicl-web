"use strict";
/** MO-05.3: verified restart continuity for advisory operational projections.
 * Explicit checkpoint writes only; read/recovery never grants authority.
 */
const {project}=require("./arki-mo05-operational.cjs");
const {inspect,appendGuarded}=require("./arki-mo04-guarded.cjs");
function readContinuity(journal,anchor,registry){
 const current=project(registry);
 const state=inspect(journal,anchor);
 const observations=state.replay.events.filter(e=>e.kind==="OBSERVATION");
 const latest=observations.at(-1)||null;
 const matching=observations.filter(e=>e.sourceReceipt===current.receiptSha256);
 return {schema:"ARKI-MO053-CONTINUITY-1",currentReceipt:current.receiptSha256,
  history:{length:state.replay.length,head:state.replay.head,observations:observations.length},
  restartStatus:!latest?"NO_CHECKPOINT":latest.sourceReceipt===current.receiptSha256?"RECOVERED_MATCH":"SOURCE_CHANGED_REVIEW_REQUIRED",
  checkpointRecorded:matching.length>0,sourceChanged:!!latest&&latest.sourceReceipt!==current.receiptSha256,
  policy:{canonicalMutation:false,approval:"NOT_INFERRED",execution:"NOT_AUTHORIZED"},projection:current};
}
function checkpoint(journal,anchor,registry){
 const before=readContinuity(journal,anchor,registry);
 if(before.restartStatus==="RECOVERED_MATCH")return {status:"ALREADY_RECORDED",...before};
 const p=before.projection;
 appendGuarded(journal,anchor,{kind:"OBSERVATION",sourceReceipt:p.receiptSha256,
  payload:{schema:p.schema,counts:p.summary,sourceCut:p.sourceCut,authority:"ADVISORY_ONLY",approval:"NOT_GRANTED"}});
 const after=readContinuity(journal,anchor,registry);
 if(after.restartStatus!=="RECOVERED_MATCH")throw Error("CHECKPOINT_RECOVERY_FAILED");
 return {status:"RECORDED",...after};
}
module.exports={readContinuity,checkpoint};
if(require.main===module){
 const fs=require("node:fs"),path=require("node:path");
 try{
 const [journal,anchor,mode]=process.argv.slice(2);
 if(!journal||!anchor||!["inspect","checkpoint"].includes(mode)||process.argv.length!==5)throw Error("USAGE: node arki-mo053-continuity.cjs JOURNAL_ABSOLUTE ANCHOR_ABSOLUTE inspect|checkpoint");
 const registry=JSON.parse(fs.readFileSync(path.join(__dirname,"assembly-registry.json"),"utf8"));
 const result=mode==="checkpoint"?checkpoint(journal,anchor,registry):readContinuity(journal,anchor,registry);
 const {projection,...report}=result;process.stdout.write(JSON.stringify(report,null,2)+"\n");
 }catch(e){process.stderr.write("ARKI_MO053_FAIL "+e.message+"\n");process.exitCode=1}
}
