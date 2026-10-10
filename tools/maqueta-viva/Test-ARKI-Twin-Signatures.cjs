"use strict";
// Cross-platform, independent contract test; never a real AGK/Core execution.
const {mkdtempSync,readFileSync,writeFileSync,rmSync}=require("node:fs");
const {tmpdir}=require("node:os");
const {join}=require("node:path");
const {spawnSync}=require("node:child_process");
const assert=require("node:assert/strict");
const dir=mkdtempSync(join(tmpdir(),"arki-twin-signatures-"));
const gen=join(__dirname,"Generate-ARKI-Twin-Signed-Fixture.cjs");
const verify=join(__dirname,"Verify-ARKI-Twin-Receipts.cjs");
function run(script,args){
 const result=spawnSync(process.execPath,[script,...args],{encoding:"utf8",timeout:15000});
 if(result.error)throw result.error;
 return result;
}
try{
 const created=run(gen,[dir]);assert.equal(created.status,0,created.stderr);
 const key=join(dir,"ARKI-TWIN-SYNTHETIC-PUBLIC-KEY.json");
 const signed=join(dir,"ARKI-TWIN-SYNTHETIC-SIGNED-RECEIPTS.json");
 const valid=run(verify,[key,signed]);assert.equal(valid.status,0,valid.stderr);
 assert.match(valid.stdout,/SIGNATURE_VALID_KEY_PROVENANCE_UNVERIFIED/);
 assert.match(valid.stdout,/CANONICAL_PROMOTION=BLOCKED/);
 const fingerprint=valid.stdout.match(/KEY_FINGERPRINT_SHA256=([0-9a-f]{64})/);
 assert.ok(fingerprint);
 assert.equal(run(verify,[key,signed,fingerprint[1]]).status,0);
 assert.notEqual(run(verify,[key,signed,"0".repeat(64)]).status,0);
 const payload=JSON.parse(readFileSync(signed,"utf8"));
 payload.payload=payload.payload.replace('"UNKNOWN"','"SUCCESS"');
 const tampered=join(dir,"tampered.json");writeFileSync(tampered,JSON.stringify(payload));
 const rejected=run(verify,[key,tampered]);
 assert.notEqual(rejected.status,0,"Tampered payload must be rejected");
 assert.match(rejected.stderr,/ARKI_RECEIPT_VERIFICATION_FAIL/);
 console.log("ARKI_TWIN_SIGNATURE_CONTRACT=PASS");
 console.log("SYNTHETIC_ONLY; REAL_CORE_AGK_EXECUTION=NOT_VERIFIED");
}catch(error){console.error("ARKI_TWIN_SIGNATURE_CONTRACT=FAIL: "+error.message);process.exitCode=1}
finally{rmSync(dir,{recursive:true,force:true})}
