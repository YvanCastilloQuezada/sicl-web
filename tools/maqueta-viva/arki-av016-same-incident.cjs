"use strict";
/** AV-016: three candidates on the EXACT same controlled incident, disposable clone only. */
const fs=require("node:fs"),os=require("node:os"),path=require("node:path"),cp=require("node:child_process"),crypto=require("node:crypto");
const hash=s=>crypto.createHash("sha256").update(s).digest("hex");
function exec(bin,args,cwd){const r=cp.spawnSync(bin,args,{cwd,encoding:"utf8",timeout:60000,maxBuffer:1048576});if(r.error||r.status!==0)throw Error("GIT_OPERATION_FAILED");return r.stdout.trim()}
function check(cwd,rel){const env={...process.env};delete env.NODE_TEST_CONTEXT;delete env.NODE_OPTIONS;const r=cp.spawnSync(process.execPath,["--test",rel],{cwd,env,encoding:"utf8",timeout:30000,maxBuffer:1048576});return {status:r.error?.code==="ETIMEDOUT"?"TIMEOUT":r.error?"EXECUTION_ERROR":r.status===0?"PASS":"FAIL",stdoutSha256:hash(r.stdout||""),stderrSha256:hash(r.stderr||"")}}
function run(root,cycle){
 if(cycle?.schema!=="ARKI-LIVE-CYCLE-1"||!Array.isArray(cycle.evidenceInventory?.trackedPairs))throw Error("INVALID_CYCLE");
 const base=fs.realpathSync(root),originalHead=exec("git",["rev-parse","HEAD"],base);
 if(originalHead!==cycle.webHead)throw Error("STALE_CYCLE");
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),"arki-av016-"));
 try{
  const clone=path.join(temp,"repo");exec("git",["clone","--no-local","--quiet",base,clone],base);
  exec("git",["config","user.name","ARKI Isolated Test"],clone);
  exec("git",["config","user.email","arki-test@localhost.invalid"],clone);
  const source="tools/maqueta-viva/arki-av014-controlled-failure.cjs",test="tools/maqueta-viva/arki-av014-controlled-failure.test.cjs";
  const broken='"use strict";module.exports={sum:(a,b)=>a-b};\n';
  fs.writeFileSync(path.join(clone,source),broken);
  fs.writeFileSync(path.join(clone,test),'"use strict";const {test}=require("node:test"),assert=require("node:assert/strict");const {sum}=require("./arki-av014-controlled-failure.cjs");test("positive",()=>assert.equal(sum(2,3),5));test("signed",()=>assert.equal(sum(-2,3),1));\n');
  exec("git",["add","--",source,test],clone);
  exec("git",["commit","--quiet","-m","test: isolated controlled defect"],clone);
  const isolatedHead=exec("git",["rev-parse","HEAD"],clone),baseline=check(clone,test);
  if(baseline.status!=="FAIL")throw Error("BASELINE_NOT_FAILING");
  const variants=[{id:"A",label:"ADDITION",code:'"use strict";module.exports={sum:(a,b)=>a+b};\n'},{id:"B",label:"CONSTANT",code:'"use strict";module.exports={sum:(a,b)=>5};\n'},{id:"C",label:"NUMBER_COERCION",code:'"use strict";module.exports={sum:(a,b)=>Number(a)+Number(b)};\n'}];
  const candidates=variants.map(v=>{
   fs.writeFileSync(path.join(clone,source),v.code);
   const outcome=check(clone,test);
   fs.writeFileSync(path.join(clone,source),broken);
   const rollbackVerified=fs.readFileSync(path.join(clone,source),"utf8")===broken&&exec("git",["status","--porcelain"],clone)==="";
   if(!rollbackVerified)throw Error("ROLLBACK_FAILED");
   return {id:v.id,label:v.label,status:outcome.status,stdoutSha256:outcome.stdoutSha256,stderrSha256:outcome.stderrSha256,rollbackVerified,canonicalMutation:false};
  });
  if(exec("git",["rev-parse","HEAD"],base)!==originalHead)throw Error("CANONICAL_HEAD_CHANGED");
  const result={schema:"ARKI-AV016-SAME-INCIDENT-REPAIR-1",originalHead,isolatedHead,incident:{source,test,baseline:baseline.status,baselineStdoutSha256:baseline.stdoutSha256},candidates,comparison:{passing:candidates.filter(x=>x.status==="PASS").length,rejected:candidates.filter(x=>x.status!=="PASS").length,selected:null},policy:{scope:"CONTROLLED_FIXTURE_ONLY",sameIncidentPatchDemonstrated:true,canonicalMutation:false,repairApplied:false,poApproval:"REQUIRED",automaticPromotion:false}};
  result.receiptSha256=hash(JSON.stringify(result));return result;
 }finally{fs.rmSync(temp,{recursive:true,force:true})}
}
module.exports={run};
if(require.main===module){try{if(process.argv.length!==4)throw Error("USAGE: node arki-av016-same-incident.cjs WEB_DIR LIVE_CYCLE_JSON");const p=process.argv[3],st=fs.lstatSync(p);if(!st.isFile()||st.isSymbolicLink()||st.size>3000000)throw Error("UNSAFE_CYCLE");process.stdout.write(JSON.stringify(run(process.argv[2],JSON.parse(fs.readFileSync(p,"utf8"))),null,2)+"\n")}catch(e){process.stderr.write("ARKI_AV016_FAIL: "+e.message+"\n");process.exitCode=1}}
