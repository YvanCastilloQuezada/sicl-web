"use strict";
/** MO-06.4: append-only advisory investigation queue with verified replay. */
const crypto=require("node:crypto");
const {prioritize}=require("./arki-mo063-priority.cjs");
const {inspect,appendGuarded}=require("./arki-mo04-guarded.cjs");
const hash=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
function inspectQueue(journal,anchor,registry){
 const queue=prioritize(registry),state=inspect(journal,anchor);
 const events=state.replay.events.filter(e=>e.kind==="PROPOSAL");
 const latest=events.at(-1)||null;
 return {schema:"ARKI-MO064-INVESTIGATION-HISTORY-1",sourceReceipt:queue.receiptSha256,
  history:{length:state.replay.length,head:state.replay.head,proposalEvents:events.length},
  status:!latest?"NO_QUEUE_RECORDED":latest.sourceReceipt===queue.receiptSha256?"RECOVERED_MATCH":"QUEUE_CHANGED_REVIEW_REQUIRED",
  policy:{canonicalMutation:false,poApproval:"NOT_INFERRED",automaticExecution:false}};
}
function recordQueue(journal,anchor,registry){
 const before=inspectQueue(journal,anchor,registry);
 if(before.status==="RECOVERED_MATCH")return {recordStatus:"ALREADY_RECORDED",...before};
 const queue=prioritize(registry);
 appendGuarded(journal,anchor,{kind:"PROPOSAL",sourceReceipt:queue.receiptSha256,
  payload:{schema:queue.schema,queue:queue.queue.map(x=>({id:x.id,issueCode:x.issueCode,evidenceStatus:x.evidenceStatus,affectedCount:x.affectedActivities.length})),
   authority:"ADVISORY_ONLY",execution:"BLOCKED",approval:"NOT_GRANTED"}});
 const after=inspectQueue(journal,anchor,registry);
 if(after.status!=="RECOVERED_MATCH")throw Error("MO064_REPLAY_MISMATCH");
 return {recordStatus:"RECORDED",...after};
}
module.exports={inspectQueue,recordQueue};
if(require.main===module){
 const fs=require("node:fs"),path=require("node:path");
 try{const [journal,anchor,mode]=process.argv.slice(2);
 if(!journal||!anchor||!["inspect","record"].includes(mode)||process.argv.length!==5)throw Error("USAGE: node arki-mo064-history.cjs JOURNAL_ABSOLUTE ANCHOR_ABSOLUTE inspect|record");
 const registry=JSON.parse(fs.readFileSync(path.join(__dirname,"assembly-registry.json"),"utf8"));
 process.stdout.write(JSON.stringify(mode==="record"?recordQueue(journal,anchor,registry):inspectQueue(journal,anchor,registry),null,2)+"\n");
 }catch(e){process.stderr.write("ARKI_MO064_FAIL "+e.message+"\n");process.exitCode=1}
}
