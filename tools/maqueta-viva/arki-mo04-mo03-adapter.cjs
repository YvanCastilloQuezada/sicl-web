"use strict";
/** MO-04.4: read-only MO-03 receipt -> guarded journal, no canonical propagation. */
const {inspect,appendGuarded}=require("./arki-mo04-guarded.cjs");
const crypto=require("node:crypto");
const SHA=/^[0-9a-f]{64}$/;
function validatePlan(plan){
 if(!plan||plan.schema!=="ARKI-MO03-AUTOMATED-ADVISORY-1"||!SHA.test(plan.receiptSha256||"")||!plan.counts||!Array.isArray(plan.queue)||plan.execution!=="READ_ONLY"||plan.policy?.automaticCanonicalMutation!==false||plan.policy?.automaticCompetencePromotion!==false)throw Error("INVALID_MO03_PLAN");
 const {receiptSha256,...unsigned}=plan;
 if(crypto.createHash("sha256").update(JSON.stringify(unsigned)).digest("hex")!==receiptSha256)throw Error("MO03_RECEIPT_MISMATCH");
 if(plan.counts.activities!==plan.queue.length||plan.counts.inScope+plan.counts.excluded!==plan.counts.activities)throw Error("INVALID_MO03_COUNTS");
 if(plan.queue.some(x=>x.automaticExecution!==false||!["BLOCKED_UNVERIFIED","EXCLUDED_OUT_OF_SCOPE"].includes(x.gate)))throw Error("UNSAFE_MO03_QUEUE");
 return plan;
}
function recordPlan(journal,anchor,plan){
 validatePlan(plan);
 const state=inspect(journal,anchor);
 if(state.replay.events.some(x=>x.kind==="DIAGNOSIS"&&x.sourceReceipt===plan.receiptSha256))return {status:"ALREADY_RECORDED",replay:state.replay};
 const result=appendGuarded(journal,anchor,{kind:"DIAGNOSIS",sourceReceipt:plan.receiptSha256,payload:{schema:plan.schema,coreHead:plan.coreHead,webHead:plan.webHead,counts:structuredClone(plan.counts),activities:plan.queue.map(x=>({id:x.id,gate:x.gate,dependencyState:x.dependencyState,reasons:x.reasons})),execution:"READ_ONLY",authorization:"NOT_GRANTED"}});
 return {status:"RECORDED",replay:result.replay};
}
function treeHistory(journal,anchor){
 const {replay}=inspect(journal,anchor);
 return {schema:"ARKI-MO04-TREE-HISTORY-VIEW-1",events:replay.events.filter(x=>x.kind==="DIAGNOSIS"),head:replay.head,approval:"NOT_INFERRED",canonicalMutation:false};
}
module.exports={validatePlan,recordPlan,treeHistory};
