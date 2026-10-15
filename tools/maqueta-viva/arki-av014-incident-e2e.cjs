"use strict";
/** AV-014: end-to-end controlled incident through real diagnostic/investigation/reproduction/dossier engines. */
const fs=require("node:fs"),os=require("node:os"),path=require("node:path"),cp=require("node:child_process"),crypto=require("node:crypto");
const {assess}=require("./arki-av006-diagnostic.cjs");
const {investigate}=require("./arki-av008-investigate.cjs");
const {reproduce}=require("./arki-av009-reproduce.cjs");
const {prepare}=require("./arki-av013-dossiers.cjs");
const sha=s=>crypto.createHash("sha256").update(s).digest("hex");
function command(bin,args,cwd){const r=cp.spawnSync(bin,args,{cwd,encoding:"utf8",timeout:60000,maxBuffer:1048576});if(r.error||r.status!==0)throw Error("COMMAND_FAILED "+bin+": "+(r.stderr||r.error?.message||r.status));return r.stdout.trim()}
function run(root,cycle){
 if(cycle?.schema!=="ARKI-LIVE-CYCLE-1"||!cycle.evidenceInventory?.trackedPairs)throw Error("INVALID_CYCLE");
 const base=fs.realpathSync(root),originalHead=command("git",["rev-parse","HEAD"],base);
 if(originalHead!==cycle.webHead)throw Error("STALE_CYCLE");
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),"arki-av014-"));
 try{
  const clone=path.join(temp,"repo");
  command("git",["clone","--no-local","--quiet",base,clone],base);
  command("git",["config","user.name","ARKI Isolated Test"],clone);
  command("git",["config","user.email","arki-test@localhost.invalid"],clone);
  const rel="tools/maqueta-viva/arki-av014-controlled-failure.test.cjs";
  const source="tools/maqueta-viva/arki-av014-controlled-failure.cjs";
  fs.writeFileSync(path.join(clone,source),'"use strict";module.exports={sum:(a,b)=>a-b};\n');
  fs.writeFileSync(path.join(clone,rel),'"use strict";const {test}=require("node:test"),assert=require("node:assert/strict");const {sum}=require("./arki-av014-controlled-failure.cjs");test("controlled defect",()=>assert.equal(sum(2,3),5));\n');
  command("git",["add","--",source,rel],clone);
  command("git",["commit","--quiet","-m","test: disposable controlled incident"],clone);
  const head=command("git",["rev-parse","HEAD"],clone);
  const testRun=cp.spawnSync(process.execPath,["--test",rel],{cwd:clone,encoding:"utf8",timeout:30000,maxBuffer:1048576});
  if(testRun.error||testRun.status===0)throw Error("CONTROLLED_FAILURE_NOT_DETECTED");
  const receipt={schema:"ARKI-AV005-SELF-TEST-1",webHead:head,results:[{test:rel,status:"FAIL",exitCode:testRun.status,stdoutSha256:sha(testRun.stdout||""),stderrSha256:sha(testRun.stderr||"")}],summary:{passed:0,failed:1}};
  receipt.receiptSha256=sha(JSON.stringify(receipt));
  const isolatedCycle={...cycle,webHead:head,evidenceInventory:{...cycle.evidenceInventory,trackedPairs:[...cycle.evidenceInventory.trackedPairs,{source,test:rel,status:"TRACKED_PAIR_NOT_EXECUTED"}]}};
  const diagnosis=assess(isolatedCycle,receipt),plan=investigate(diagnosis),reproduction=reproduce(clone,plan),dossiers=prepare(plan,reproduction);
  if(diagnosis.incidents.length!==1||reproduction.cases[0]?.classification!=="REPRODUCED"||dossiers.summary.readyForInvestigation!==1)throw Error("INCIDENT_CHAIN_NOT_PROVEN");
  if(command("git",["rev-parse","HEAD"],base)!==originalHead)throw Error("CANONICAL_HEAD_CHANGED");
  return {schema:"ARKI-AV014-CONTROLLED-INCIDENT-1",originalHead,isolatedHead:head,baseline:"FAIL",diagnosticIncidents:diagnosis.incidents.length,reproduction:reproduction.cases[0].classification,dossiers:dossiers.summary.readyForInvestigation,receipts:{diagnostic:diagnosis.receiptSha256,investigation:plan.receiptSha256,reproduction:reproduction.receiptSha256,dossier:dossiers.receiptSha256},policy:{canonicalMutation:false,repairApplied:false,poApproval:"REQUIRED",scope:"CONTROLLED_DISPOSABLE_FIXTURE"}};
 }finally{fs.rmSync(temp,{recursive:true,force:true})}
}
module.exports={run};
if(require.main===module){try{if(process.argv.length!==4)throw Error("USAGE: node arki-av014-incident-e2e.cjs WEB_DIR LIVE_CYCLE_JSON");const p=process.argv[3],st=fs.lstatSync(p);if(!st.isFile()||st.isSymbolicLink()||st.size>3000000)throw Error("UNSAFE_CYCLE");process.stdout.write(JSON.stringify(run(process.argv[2],JSON.parse(fs.readFileSync(p,"utf8"))),null,2)+"\n")}catch(e){process.stderr.write("ARKI_AV014_FAIL: "+e.message+"\n");process.exitCode=1}}
