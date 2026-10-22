"use strict";
/** AV-005: opt-in bounded execution of explicitly allowed local self-tests.
 * No implicit execution in the hourly live cycle; no competence promotion.
 */
const cp=require("node:child_process"),fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const allowed=Object.freeze(["arki-mo031-evidence.test.cjs","arki-av002-precedence.test.cjs","arki-av003-reconcile.test.cjs","arki-av004-evidence.test.cjs"]);
const hash=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
function evaluate(root,selection=allowed){
 if(!Array.isArray(selection)||selection.length===0||selection.length>allowed.length||new Set(selection).size!==selection.length||selection.some(x=>!allowed.includes(x)))throw Error("TEST_NOT_ALLOWLISTED");
 const base=fs.realpathSync(root);
 const head=cp.spawnSync("git",["rev-parse","HEAD"],{cwd:base,encoding:"utf8",timeout:10000});
 if(head.error||head.status!==0||!/^[a-f0-9]{40}$/.test(head.stdout.trim()))throw Error("INVALID_HEAD");
 const results=[];
 for(const name of selection){
  const rel="tools/maqueta-viva/"+name,full=path.join(base,rel),st=fs.lstatSync(full);
  if(!st.isFile()||st.isSymbolicLink())throw Error("UNSAFE_TEST");
  const tracked=cp.spawnSync("git",["ls-files","--error-unmatch","--",rel],{cwd:base,encoding:"utf8",timeout:10000});
  if(tracked.status!==0||tracked.error)throw Error("UNTRACKED_TEST");
  const r=cp.spawnSync(process.execPath,["--test",rel],{cwd:base,encoding:"utf8",timeout:30000,maxBuffer:1024*1024,env:{...process.env,NODE_ENV:"test"}});
  results.push({test:rel,status:r.error?.code==="ETIMEDOUT"?"TIMEOUT":r.error?"EXECUTION_ERROR":r.status===0?"PASS":"FAIL",exitCode:r.status,stdoutSha256:crypto.createHash("sha256").update(r.stdout||"").digest("hex"),stderrSha256:crypto.createHash("sha256").update(r.stderr||"").digest("hex")});
 }
 const report={schema:"ARKI-AV005-SELF-TEST-1",webHead:head.stdout.trim(),results,summary:{passed:results.filter(x=>x.status==="PASS").length,failed:results.filter(x=>x.status!=="PASS").length},policy:{execution:"EXPLICIT_OPT_IN",competenceVerified:false,canonicalPromotion:false,poApproval:"PENDING"}};
 report.receiptSha256=hash(report);return report;
}
module.exports={evaluate,allowed};
if(require.main===module){try{if(process.argv.length!==3)throw Error("USAGE: node arki-av005-self-test.cjs WEB_DIR");process.stdout.write(JSON.stringify(evaluate(process.argv[2]),null,2)+"\n")}catch(e){process.stderr.write("ARKI_AV005_FAIL: "+e.message+"\n");process.exitCode=1}}
