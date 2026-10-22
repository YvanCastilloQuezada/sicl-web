#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),cp=require("node:child_process"),path=require("node:path"),os=require("node:os");
const root=path.resolve(__dirname,"../..");
const out=path.join(root,"ARKI_CONTINUITY_LOCAL_VALIDATION.txt");
const expected=process.argv[2];
const commands=[
 ["Node version","node",["--version"]],
 ["Git version","git",["--version"]],
 ["Continuity unit and adversarial tests","node",["--test","tools/maqueta-viva/arki-continuity-snapshot.test.cjs"]],
 ["Generate living map","node",["tools/maqueta-viva/arki-continuity-snapshot.cjs"]],
 ["Verify generated map","node",["tools/maqueta-viva/arki-continuity-snapshot.cjs","--check"]]
];
const sha=cp.execFileSync("git",["rev-parse","HEAD"],{cwd:root,encoding:"utf8"}).trim();
const branch=cp.execFileSync("git",["branch","--show-current"],{cwd:root,encoding:"utf8"}).trim();
let report=["ARKI LOCAL CONTINUITY VALIDATION","Date: "+new Date().toISOString(),"Branch: "+branch,"HEAD: "+sha,"Expected HEAD: "+(expected||"NOT_SPECIFIED"),"Platform: "+os.platform()+" "+os.release(),"",""];
let failed=Boolean(expected&&sha!==expected);
if(expected&&sha!==expected)report.push("FAIL: HEAD does not match expected commit. Tests skipped.");
else for(const [label,bin,args] of commands){
 const r=cp.spawnSync(bin,args,{cwd:root,encoding:"utf8",timeout:180000,maxBuffer:8*1024*1024,env:{...process.env,ARKI_CONTINUITY_BRANCH:branch}});
 report.push("=== "+label+" ===","Command: "+bin+" "+args.join(" "),"Exit: "+String(r.status),String(r.stdout||""),String(r.stderr||""),r.error?String(r.error):"");
 if(r.status!==0){failed=true;break;}
}
report.push("RESULT: "+(failed?"FAIL":"PASS"));
fs.writeFileSync(out,report.join("\n")+"\n");
console.log("Validation report: "+out+" — "+(failed?"FAIL":"PASS"));
process.exitCode=failed?1:0;
