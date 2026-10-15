"use strict";
/** AV-011: opt-in exhaustive tracked-pair test coverage in a disposable Git clone. */
const fs=require("node:fs"),path=require("node:path"),os=require("node:os"),cp=require("node:child_process"),crypto=require("node:crypto");
const {inspect}=require("./arki-av004-evidence.cjs");
const {reconcile}=require("./arki-av003-reconcile.cjs");
const hash=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
const filehash=p=>crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
function cmd(bin,args,cwd,timeout=30000){return cp.spawnSync(bin,args,{cwd,encoding:"utf8",timeout,maxBuffer:2*1024*1024})}
function run(root){
 const base=fs.realpathSync(root);
 const h=cmd("git",["rev-parse","HEAD"],base);
 if(h.error||h.status!==0||!/^[a-f0-9]{40}$/.test(h.stdout.trim()))throw Error("INVALID_HEAD");
 const head=h.stdout.trim();
 const registry=JSON.parse(fs.readFileSync(path.join(base,"tools/maqueta-viva/assembly-registry.json"),"utf8"));
 const inventory=inspect(base,reconcile(registry,base));
 const tests=inventory.trackedPairs.map(x=>x.test);
 if(!tests.length||tests.length>250||new Set(tests).size!==tests.length)throw Error("INVALID_TEST_INVENTORY");
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),"arki-av011-"));
 try{
  const clone=path.join(temp,"repo");
  const c=cmd("git",["clone","--no-local","--quiet","--no-checkout",base,clone],base,90000);
  if(c.error||c.status!==0)throw Error("ISOLATED_CLONE_FAILED: "+(c.stderr||c.error?.message||""));
  const co=cmd("git",["checkout","--quiet","--detach",head],clone,60000);
  if(co.error||co.status!==0)throw Error("ISOLATED_CHECKOUT_FAILED");
  const results=[];
  for(const test of tests){
   if(!/^tools\/maqueta-viva\/[a-zA-Z0-9_.-]+\.test\.cjs$/.test(test))throw Error("UNSAFE_TEST_PATH");
   const full=path.join(clone,test),st=fs.lstatSync(full);
   if(!st.isFile()||st.isSymbolicLink())throw Error("UNSAFE_TEST_FILE");
   const r=cmd(process.execPath,["--test",test],clone,30000);
   const status=r.error?.code==="ETIMEDOUT"?"TIMEOUT":r.error?"EXECUTION_ERROR":r.status===0?"PASS":"FAIL";
   results.push({test,status,exitCode:r.status,sourceSha256:filehash(full),stdoutSha256:crypto.createHash("sha256").update(r.stdout||"").digest("hex"),stderrSha256:crypto.createHash("sha256").update(r.stderr||"").digest("hex"),stderrExcerpt:(r.stderr||"").slice(0,500)});
  }
  const summary={passed:results.filter(x=>x.status==="PASS").length,failed:results.filter(x=>x.status!=="PASS").length};
  const report={schema:"ARKI-AV005-SELF-TEST-1",webHead:head,results,summary,av011:{schema:"ARKI-AV011-FULL-COVERAGE-1",inventoryCount:tests.length,executed:results.length,remaining:0,isolation:"DISPOSABLE_GIT_CLONE",scope:"TRACKED_MAQUETA_VIVA_PAIRS_ONLY"},policy:{execution:"EXPLICIT_OPT_IN",competenceVerified:false,canonicalPromotion:false,poApproval:"PENDING"}};
  report.receiptSha256=hash(report);return report;
 }finally{fs.rmSync(temp,{recursive:true,force:true})}
}
module.exports={run};
if(require.main===module){try{if(process.argv.length!==3)throw Error("USAGE: node arki-av011-full-coverage.cjs WEB_DIR");process.stdout.write(JSON.stringify(run(process.argv[2]),null,2)+"\n")}catch(e){process.stderr.write("ARKI_AV011_FAIL: "+e.message+"\n");process.exitCode=1}}
