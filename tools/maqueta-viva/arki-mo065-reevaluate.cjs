"use strict";
/** MO-06.5: deterministic read-only comparison of two inventory snapshots.
 * Affected means declared dependency adjacency, NOT verified real-world impact.
 */
const crypto=require("node:crypto");
const {prioritize}=require("./arki-mo063-priority.cjs");
const digest=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
function index(registry){
 const items=[...(registry.ideas||[]),...(registry.components||[])],map=new Map();
 for(const x of items){if(typeof x.id!=="string"||!x.id||map.has(x.id))throw Error("INVALID_OR_DUPLICATE_ID");map.set(x.id,x)}
 return map;
}
function reevaluate(before,after){
 const a=index(before),b=index(after),ids=[...new Set([...a.keys(),...b.keys()])].sort();
 const changed=ids.filter(id=>!a.has(id)||!b.has(id)||digest(a.get(id))!==digest(b.get(id)));
 const reverse=new Map();
 for(const [id,item] of b)for(const dep of Array.isArray(item.dependencies)?item.dependencies:[]){
  if(!reverse.has(dep))reverse.set(dep,new Set());reverse.get(dep).add(id);
 }
 const impacted=new Set(changed),queue=[...changed];
 for(let i=0;i<queue.length;i++)for(const next of reverse.get(queue[i])||[])if(!impacted.has(next)){impacted.add(next);queue.push(next)}
 const oldQueue=prioritize(before),newQueue=prioritize(after);
 const result={schema:"ARKI-MO065-INCREMENTAL-REEVALUATION-1",
  beforeReceipt:oldQueue.receiptSha256,afterReceipt:newQueue.receiptSha256,
  changedIds:changed,affectedIds:[...impacted].sort(),unchangedIds:ids.filter(id=>a.has(id)&&b.has(id)&&!impacted.has(id)),
  queueChanged:oldQueue.receiptSha256!==newQueue.receiptSha256,
  currentQueue:newQueue.queue,
  policy:{impact:"DECLARED_GRAPH_ONLY",unknownDependencies:"NOT_INFERRED",historicalEvents:"NOT_MODIFIED",canonicalMutation:false,automaticExecution:false,poApproval:"REQUIRED"}};
 result.receiptSha256=digest(result);return result;
}
module.exports={reevaluate};
if(require.main===module){const fs=require("node:fs");try{const [p,q]=process.argv.slice(2);if(!p||!q||process.argv.length!==4)throw Error("USAGE: node arki-mo065-reevaluate.cjs BEFORE.json AFTER.json");process.stdout.write(JSON.stringify(reevaluate(JSON.parse(fs.readFileSync(p,"utf8")),JSON.parse(fs.readFileSync(q,"utf8"))),null,2)+"\n")}catch(e){process.stderr.write("ARKI_MO065_FAIL "+e.message+"\n");process.exitCode=1}}
