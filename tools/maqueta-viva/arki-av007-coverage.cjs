"use strict";
/** AV-007: bounded explicit batch from tracked inventory. Not scheduled or automatic. */
const fs=require("node:fs"),path=require("node:path"),cp=require("node:child_process"),crypto=require("node:crypto");
const {inspect}=require("./arki-av004-evidence.cjs");
const {reconcile}=require("./arki-av003-reconcile.cjs");
const sha=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
const allow=Object.freeze(["arki-mo031-evidence.test.cjs","arki-av002-precedence.test.cjs","arki-av003-reconcile.test.cjs","arki-av004-evidence.test.cjs","arki-av005-self-test.test.cjs","arki-av006-diagnostic.test.cjs"]);
function run(root,selection=allow){
 if(!Array.isArray(selection)||!selection.length||selection.length>8||new Set(selection).size!==selection.length||selection.some(x=>!allow.includes(x)))throw Error("UNAUTHORIZED_TEST_SELECTION");
 const base=fs.realpathSync(root),registry=JSON.parse(fs.readFileSync(path.join(base,"tools/maqueta-viva/assembly-registry.json"),"utf8"));
 const inventory=inspect(base,reconcile(registry,base)),known=new Set(inventory.trackedPairs.map(x=>x.test));
 const head=cp.spawnSync("git",["rev-parse","HEAD"],{cwd:base,encoding:"utf8",timeout:10000});
 if(head.error||head.status!==0||!/^[a-f0-9]{40}$/.test(head.stdout.trim()))throw Error("INVALID_HEAD");
 const results=[];
 for(const name of selection){
  const rel="tools/maqueta-viva/"+name;
  if(!known.has(rel))throw Error("TEST_NOT_IN_INVENTORY");
  const full=path.join(base,rel),st=fs.lstatSync(full);
  if(!st.isFile()||st.isSymbolicLink())throw Error("UNSAFE_TEST");
  const r=cp.spawnSync(process.execPath,["--test",rel],{cwd:base,encoding:"utf8",timeout:30000,maxBuffer:1048576});
  const status=r.error?.code==="ETIMEDOUT"?"TIMEOUT":r.error?"EXECUTION_ERROR":r.status===0?"PASS":"FAIL";
  results.push({test:rel,status,exitCode:r.status,stdoutSha256:crypto.createHash("sha256").update(r.stdout||"").digest("hex"),stderrSha256:crypto.createHash("sha256").update(r.stderr||"").digest("hex")});
 }
 const report={schema:"ARKI-AV005-SELF-TEST-1",webHead:head.stdout.trim(),results,summary:{passed:results.filter(x=>x.status==="PASS").length,failed:results.filter(x=>x.status!=="PASS").length},av007:{schema:"ARKI-AV007-COVERAGE-1",inventoryCount:inventory.trackedPairs.length,executed:results.length,remaining:inventory.trackedPairs.length-results.length,selection:"EXPLICIT_ALLOWLIST"},policy:{execution:"EXPLICIT_OPT_IN",competenceVerified:false,canonicalPromotion:false,poApproval:"PENDING"}};
 report.receiptSha256=sha(report);return report;
}
module.exports={run,allow};
if(require.main===module){try{if(process.argv.length!==3)throw Error("USAGE: node arki-av007-coverage.cjs WEB_DIR");process.stdout.write(JSON.stringify(run(process.argv[2]),null,2)+"\n")}catch(e){process.stderr.write("ARKI_AV007_FAIL: "+e.message+"\n");process.exitCode=1}}
