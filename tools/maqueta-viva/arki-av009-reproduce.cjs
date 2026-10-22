"use strict";
/** AV-009: reproduce an AV-008 incident in a disposable clone; no canonical writes. */
const fs=require("node:fs"),os=require("node:os"),path=require("node:path"),cp=require("node:child_process"),crypto=require("node:crypto");
const sha=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
function reproduce(root,plan){
 if(!plan||plan.schema!=="ARKI-AV008-INVESTIGATION-1"||!/^[a-f0-9]{40}$/.test(plan.webHead)||!Array.isArray(plan.cases))throw Error("INVALID_PLAN");
 const base=fs.realpathSync(root);
 const head=cp.spawnSync("git",["rev-parse","HEAD"],{cwd:base,encoding:"utf8",timeout:10000});
 if(head.error||head.status!==0||head.stdout.trim()!==plan.webHead)throw Error("STALE_PLAN");
 if(plan.cases.length>8)throw Error("TOO_MANY_INCIDENTS");
 const seen=new Set(),cases=[];
 for(const item of plan.cases){
  const test=item?.test;
  if(typeof test!=="string"||!/^tools\/maqueta-viva\/[a-zA-Z0-9_-]+\.test\.cjs$/.test(test)||seen.has(test)||item.classification!=="FAILURE_CONFIRMED_CAUSE_UNKNOWN"||!["FAIL","TIMEOUT","EXECUTION_ERROR"].includes(item.outcome))throw Error("UNSUPPORTED_CASE");
  seen.add(test);
  const tracked=cp.spawnSync("git",["ls-files","--error-unmatch","--",test],{cwd:base,encoding:"utf8",timeout:10000});
  if(tracked.error||tracked.status!==0)throw Error("UNTRACKED_CASE");
 }
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),"arki-av009-"));
 try{
  if(plan.cases.length){
   const clone=cp.spawnSync("git",["clone","--no-local","--quiet","--no-checkout",base,temp+"/repo"],{encoding:"utf8",timeout:60000,maxBuffer:1024*1024});
   if(clone.error||clone.status!==0)throw Error("ISOLATED_CLONE_FAILED");
   const checkout=cp.spawnSync("git",["checkout","--quiet","--detach",plan.webHead],{cwd:temp+"/repo",encoding:"utf8",timeout:30000});
   if(checkout.error||checkout.status!==0)throw Error("ISOLATED_CHECKOUT_FAILED");
   for(const item of plan.cases){
    const r=cp.spawnSync(process.execPath,["--test",item.test],{cwd:temp+"/repo",encoding:"utf8",timeout:30000,maxBuffer:1024*1024});
    const status=r.error?.code==="ETIMEDOUT"?"TIMEOUT":r.error?"EXECUTION_ERROR":r.status===0?"PASS":"FAIL";
    cases.push({test:item.test,previousOutcome:item.outcome,reproductionOutcome:status,classification:status==="PASS"?"NOT_REPRODUCED":status===item.outcome?"REPRODUCED":"INCONCLUSIVE",stdoutSha256:crypto.createHash("sha256").update(r.stdout||"").digest("hex"),stderrSha256:crypto.createHash("sha256").update(r.stderr||"").digest("hex")});
   }
  }
  const result={schema:"ARKI-AV009-ISOLATED-REPRODUCTION-1",webHead:plan.webHead,sourceInvestigationReceipt:plan.receiptSha256||null,cases,policy:{isolation:"DISPOSABLE_LOCAL_CLONE",canonicalMutation:false,repairApplied:false,competenceVerified:false,poApproval:"PENDING"}};
  result.receiptSha256=sha(result);return result;
 }finally{fs.rmSync(temp,{recursive:true,force:true})}
}
module.exports={reproduce};
if(require.main===module){try{if(process.argv.length!==4)throw Error("USAGE: node arki-av009-reproduce.cjs WEB_DIR AV008_JSON");const p=process.argv[3],st=fs.lstatSync(p);if(!st.isFile()||st.isSymbolicLink()||st.size>3000000)throw Error("UNSAFE_PLAN");process.stdout.write(JSON.stringify(reproduce(process.argv[2],JSON.parse(fs.readFileSync(p,"utf8"))),null,2)+"\n")}catch(e){process.stderr.write("ARKI_AV009_FAIL: "+e.message+"\n");process.exitCode=1}}
