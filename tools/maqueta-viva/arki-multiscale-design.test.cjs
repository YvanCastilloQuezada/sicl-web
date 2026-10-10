"use strict";
const assert=require("node:assert/strict");
const {SCALES,STRATEGIES,design,learn,normalize}=require("./arki-multiscale-design.cjs");
const sizes={OBJECT:[0.5,0.5],INTERIOR:[10,8],ARCHITECTURE:[50,40],LANDSCAPE:[200,100],URBANISM:[1000,1000],REGIONAL:[20000,10000],MACROREGIONAL:[200000,100000]};
function brief(scale){const [widthM,depthM]=sizes[scale];return {schema:"ARKI-MULTISCALE-BRIEF-1",id:"TEST-"+scale,scale,sourceCommit:"a".repeat(40),site:{widthM,depthM},program:{units:4,targetCoverage:0.3},objectives:{compactness:0.4,openSpace:0.3,connectivity:0.3},constraints:{maxCoverage:0.65,requiredChecks:["LOCAL_NORM","ACCESSIBILITY"]}}}
for(const scale of Object.keys(SCALES)){
 const input=brief(scale),before=JSON.stringify(input),output=design(input);
 assert.equal(output.schema,"ARKI-MULTISCALE-DESIGN-1");
 assert.equal(output.scale,scale);
 assert.equal(output.candidates.length,4);
 assert.ok(Array.isArray(output.paretoStrategies));
 assert.ok(output.paretoStrategies.length>=1);
 assert.equal(output.canonicalMutation,false);
 assert.equal(output.canonicalPromotion,"BLOCKED");
 assert.equal(output.requiredChecks.every(x=>x.status==="NOT_VERIFIED"),true);
 assert.equal(output.simulation,"HEURISTIC_ONLY");
 assert.ok(output.selectedStrategy);
 assert.ok(output.selectedGeometry.length===4);
 assert.equal(JSON.stringify(input),before);
 for(const candidate of output.candidates){
  assert.ok(STRATEGIES.includes(candidate.strategy));
  assert.ok(candidate.shapes.every(s=>s.widthM>0&&s.depthM>0));
  if(candidate.valid)assert.ok(candidate.metrics.coverage<=input.constraints.maxCoverage+1e-8);
 }
}
assert.equal(Object.keys(SCALES).length,7);
assert.throws(()=>normalize({...brief("OBJECT"),scale:"SPACE"}),/INVALID_SCALE/);
assert.throws(()=>normalize({...brief("ARCHITECTURE"),site:{widthM:-1,depthM:10}}),/INVALID_SITE/);
assert.throws(()=>normalize({...brief("ARCHITECTURE"),objectives:{compactness:1,openSpace:1,connectivity:1}}),/INVALID_OBJECTIVE_WEIGHTS/);
assert.throws(()=>normalize({...brief("ARCHITECTURE"),parent:{id:"REG-1",scale:"OBJECT"}}),/INVALID_PARENT_SCALE/);
const parent={...brief("ARCHITECTURE"),parent:{id:"CITY-1",scale:"URBANISM"}};
assert.equal(design(parent).parent.id,"CITY-1");
const result=design(brief("ARCHITECTURE"));
const chosen=result.candidates.find(x=>x.valid);
const feedback={schema:"ARKI-MULTISCALE-FEEDBACK-1",briefDigest:result.briefDigest,sourceCommit:result.sourceCommit,strategy:chosen.strategy,reward:0.8,verifier:"EXTERNAL",evidenceStatus:"INDEPENDENTLY_VERIFIED",evidenceDigest:"b".repeat(64)};
assert.throws(()=>learn(result,feedback),/INDEPENDENT_VERIFICATION_REQUIRED/);
assert.throws(()=>learn(result,{...feedback,reward:4},()=>true),/INVALID_REWARD/);
assert.throws(()=>learn(result,{...feedback,briefDigest:"bad"},()=>true),/FEEDBACK_MISMATCH/);
const entry=learn(result,feedback,()=>true);
assert.equal(entry.canonicalMutation,false);
assert.equal(entry.canonicalPromotion,"BLOCKED");
assert.equal(entry.evidenceStatus,"INDEPENDENTLY_VERIFIED");
const withoutTrust=design(brief("ARCHITECTURE"),[entry]);
assert.equal(withoutTrust.candidates.every(x=>x.historicalAdjustment===0),true);
const withTrust=design(brief("ARCHITECTURE"),[entry],()=>true);
assert.ok(withTrust.candidates.find(x=>x.strategy===chosen.strategy).historicalAdjustment>0);
assert.equal(design(brief("INTERIOR"),[entry],()=>true).candidates.every(x=>x.historicalAdjustment===0),true,"No blind transfer across scales");
assert.equal(design({...brief("ARCHITECTURE"),sourceCommit:"c".repeat(40)},[entry],()=>true).candidates.every(x=>x.historicalAdjustment===0),true,"No transfer across code versions");
const invalid={...brief("OBJECT"),program:{units:64,targetCoverage:0.85},constraints:{maxCoverage:0.05,requiredChecks:[]}};
const noMutation=design(invalid);
assert.equal(noMutation.canonicalMutation,false);
const fs=require("node:fs"),os=require("node:os"),path=require("node:path"),cp=require("node:child_process");
const root=fs.mkdtempSync(path.join(os.tmpdir(),"arki-multiscale-"));
try{
 const input=path.join(root,"brief.json"),output=path.join(root,"result.json");
 fs.writeFileSync(input,JSON.stringify(brief("ARCHITECTURE")));
 const cli=path.join(__dirname,"Run-ARKI-Multiscale-Design.cjs");
 const run=cp.spawnSync(process.execPath,[cli,input,output],{encoding:"utf8",timeout:10000});
 assert.equal(run.status,0,run.stderr);
 const saved=JSON.parse(fs.readFileSync(output,"utf8"));
 assert.equal(saved.scale,"ARCHITECTURE");
 assert.equal(saved.canonicalMutation,false);
 assert.notEqual(cp.spawnSync(process.execPath,[cli,input,output],{encoding:"utf8"}).status,0);
}finally{fs.rmSync(root,{recursive:true,force:true})}
console.log("ARKI_MULTISCALE_DESIGN=PASS; 7_DOMAINS; 4_STRATEGIES; TRUST_GATED_LEARNING; NO_CANONICAL_MUTATION");
