"use strict";
/** ARKI local/offline CI runner. No GitHub Actions, checkout, source writes or promotion. */
const {spawnSync}=require("node:child_process");
const path=require("node:path");
const fs=require("node:fs");
const root=path.resolve(__dirname,"../..");
const dir=path.join(root,"tools","maqueta-viva");
const tests=[
 "test-arki-assembly-planner.cjs",
 "test-arki-assembly-strategies.cjs",
 "test-arki-capability-inventory.cjs",
 "test-arki-discovery.cjs",
 "arki-arbol-vivo-auto.test.cjs",
 "arki-map-adn-bridge.test.cjs",
 "arki-adn-observer.test.cjs",
 "arki-adn-mejora-continua.test.cjs",
 "test-arki-autonomy-orchestrator.cjs",
 "test-arki-autonomy-memory.cjs",
 "test-Verify-ARKI-Journal.cjs",
 "test-Reconcile-ARKI-Branches.cjs",
 "arki-ace88-preflight-adapter.test.cjs",
 "arki-ace88-core-transport.test.cjs",
 "arki-dependency-coverage.test.cjs",
 "arki-relational-learning.test.cjs",
 "arki-relational-evidence.test.cjs",
 "arki-relational-discovery.test.cjs",
 "arki-twin-three-alternatives.test.cjs",
 "arki-live-systems-coordinator.test.cjs",
 "arki-core-mapa-vivo-bridge.test.cjs",
 "arki-mo03-autoplan.test.cjs",
 "arki-mo04-journal.test.cjs",
 "arki-mo04-persistence.test.cjs",
 "test-arki-autonomy-macro-orders.cjs",
 "test-maqueta-viva.cjs",
 "test-github-evidence.cjs"
];
function cmd(bin,args){return spawnSync(bin,args,{cwd:root,encoding:"utf8",timeout:120000,maxBuffer:8*1024*1024});}
function main(){
 const expected=process.argv[2];
 if(process.argv.length>3||(expected&&!/^[0-9a-f]{40}$/.test(expected)))throw Error("USAGE: node tools/maqueta-viva/Run-ARKI-Offline-CI.cjs [EXPECTED_SHA]");
 const sha=cmd("git",["rev-parse","HEAD"]);
 if(sha.status!==0)throw Error("GIT_HEAD_UNAVAILABLE");
 const head=sha.stdout.trim();
 if(expected&&head!==expected)throw Error("HEAD_SHA_MISMATCH");
 const dirty=cmd("git",["status","--porcelain"]);
 if(dirty.status!==0||dirty.stdout.trim())throw Error("WORKTREE_NOT_CLEAN");
 const node=cmd(process.execPath,["--version"]);
 if(node.status!==0)throw Error("NODE_VERSION_UNAVAILABLE");
 const major=Number(node.stdout.trim().replace(/^v/,"").split(".")[0]);
 if(major!==22)throw Error("NODE_22_REQUIRED");
 const report={schema:"ARKI-OFFLINE-CI-1",head,node:node.stdout.trim(),githubActions:"NOT_USED",e3Windows:"NOT_EXECUTED",canonicalMutation:false,results:[]};
 for(const name of tests){
  const file=path.join(dir,name);
  if(!fs.existsSync(file)){report.results.push({name,status:"MISSING"});continue;}
  const result=cmd(process.execPath,[file]);
  report.results.push({name,status:result.error?"ERROR":result.signal?"SIGNAL":result.status===0?"PASS":"FAIL",exitCode:result.status,signal:result.signal||null,error:result.error?.message||null,stdout:(result.stdout||"").slice(-3000),stderr:(result.stderr||"").slice(-3000)});
 }
 const after=cmd("git",["rev-parse","HEAD"]);
 const finalStatus=cmd("git",["status","--porcelain"]);
 report.integrity=after.status===0&&after.stdout.trim()===head&&finalStatus.status===0&&!finalStatus.stdout.trim()?"PASS":"FAIL";
 report.status=report.results.every(x=>x.status==="PASS")&&report.integrity==="PASS"?"PASS":"FAIL";
 process.stdout.write(JSON.stringify(report,null,2)+"\n");
 if(report.status!=="PASS")process.exitCode=1;
}
try{main()}catch(e){process.stderr.write("ARKI_OFFLINE_CI_FAIL: "+e.message+"\n");process.exitCode=1;}
