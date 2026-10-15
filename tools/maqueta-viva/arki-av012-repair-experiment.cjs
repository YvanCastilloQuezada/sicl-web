"use strict";
/** AV-012: three repair candidates against a controlled defect in disposable workspace. */
const fs=require("node:fs"),os=require("node:os"),path=require("node:path"),cp=require("node:child_process"),crypto=require("node:crypto");
const sha=s=>crypto.createHash("sha256").update(s).digest("hex");
function testAt(dir){
 const env={...process.env};
 delete env.NODE_TEST_CONTEXT;
 delete env.NODE_OPTIONS;
 const r=cp.spawnSync(process.execPath,["--test","repair.test.cjs"],{cwd:dir,env,encoding:"utf8",timeout:15000,maxBuffer:1048576});
 return {status:r.error?.code==="ETIMEDOUT"?"TIMEOUT":r.error?"EXECUTION_ERROR":r.status===0?"PASS":"FAIL",stdoutSha256:sha(r.stdout||""),stderrSha256:sha(r.stderr||"")};
}
function experiment(){
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),"arki-av012-"));
 try{
  const source=path.join(temp,"calculation.cjs"),test=path.join(temp,"repair.test.cjs");
  const broken='"use strict";module.exports={sum:(a,b)=>a-b};\n';
  fs.writeFileSync(source,broken);
  fs.writeFileSync(test,'"use strict";const {test}=require("node:test"),assert=require("node:assert/strict");const {sum}=require("./calculation.cjs");test("sum of positive values",()=>assert.equal(sum(2,3),5));test("sum of signed values",()=>assert.equal(sum(-2,3),1));\n');
  const baseline=testAt(temp);
  if(baseline.status!=="FAIL")throw Error("BASELINE_NOT_FAILING");
  const variants=[
   {id:"A",label:"CORRECT_ADDITION",code:'"use strict";module.exports={sum:(a,b)=>a+b};\n'},
   {id:"B",label:"INCORRECT_CONSTANT",code:'"use strict";module.exports={sum:(a,b)=>5};\n'},
   {id:"C",label:"CORRECT_NUMBER_COERCION",code:'"use strict";module.exports={sum:(a,b)=>Number(a)+Number(b)};\n'}
  ];
  const candidates=variants.map(v=>{
   fs.writeFileSync(source,v.code);
   const outcome=testAt(temp);
   fs.writeFileSync(source,broken);
   if(fs.readFileSync(source,"utf8")!==broken)throw Error("ROLLBACK_FAILED");
   return {id:v.id,label:v.label,status:outcome.status,stdoutSha256:outcome.stdoutSha256,stderrSha256:outcome.stderrSha256,rollbackVerified:true,canonicalMutation:false};
  });
  const passing=candidates.filter(x=>x.status==="PASS");
  const result={schema:"ARKI-AV012-REPAIR-EXPERIMENT-1",scope:"CONTROLLED_FIXTURE_ONLY",baseline,tests:2,candidates,comparison:{passing:passing.length,failing:candidates.length-passing.length,recommendedCandidate:passing.length?passing[0].id:null,recommendationStatus:"EXPERIMENTAL_ONLY"},policy:{canonicalMutation:false,repairPromoted:false,poApproval:"REQUIRED",architecturalCompetence:"NOT_DEMONSTRATED"}};
  result.receiptSha256=sha(JSON.stringify(result));return result;
 }finally{fs.rmSync(temp,{recursive:true,force:true})}
}
module.exports={experiment};
if(require.main===module){try{process.stdout.write(JSON.stringify(experiment(),null,2)+"\n")}catch(e){process.stderr.write("ARKI_AV012_FAIL: "+e.message+"\n");process.exitCode=1}}
