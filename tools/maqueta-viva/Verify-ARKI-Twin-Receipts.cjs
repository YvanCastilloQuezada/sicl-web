"use strict";
/**
 * Offline independent verification of the signed-envelope contract.
 * This checks signature bytes and optional out-of-band key fingerprint.
 * It DOES NOT attest to producer identity or to real Core/AGK execution.
 * node Verify-ARKI-Twin-Receipts.cjs public-key.json signed-receipts.json [expected-fingerprint]
 */
const fs=require("node:fs");
const {createHash,createPublicKey,verify}=require("node:crypto");
const assert=require("node:assert/strict");
function read(file){
 const stat=fs.statSync(file);
 if(stat.size>200000)throw Error("INPUT_TOO_LARGE");
 return JSON.parse(fs.readFileSync(file,"utf8"));
}
function validate(key,envelope){
 assert.equal(key.schema,"ARKI-TWIN-PUBLIC-KEY-1");
 assert.match(key.keyId,/^[a-zA-Z0-9_.-]{1,80}$/);
 assert.equal(key.jwk.kty,"EC");assert.equal(key.jwk.crv,"P-256");assert.equal(key.jwk.alg,"ES256");
 assert.equal(key.jwk.ext,true);assert.deepEqual(key.jwk.key_ops,["verify"]);
 assert.equal(key.jwk.d,undefined,"Private keys are forbidden");
 assert.equal(envelope.schema,"ARKI-TWIN-SIGNED-RECEIPTS-1");
 assert.equal(envelope.algorithm,"ECDSA-P256-SHA256");
 assert.equal(envelope.keyId,key.keyId);
 assert.ok(typeof envelope.payload==="string"&&envelope.payload.length>0&&envelope.payload.length<=150000);
 assert.match(envelope.signature,/^[A-Za-z0-9_-]+$/);
 const receipts=JSON.parse(envelope.payload);
 assert.equal(receipts.schema,"ARKI-TWIN-EXECUTION-RECEIPTS-1");
 assert.ok(Array.isArray(receipts.receipts)&&receipts.receipts.length>=1&&receipts.receipts.length<=200);
 const seen=new Set();
 for(const x of receipts.receipts){
  assert.match(x.id,/^[a-zA-Z0-9_-]{1,80}$/);assert.ok(!seen.has(x.id));seen.add(x.id);
  assert.ok(["Core","AGK","Agent","Other"].includes(x.producer));
  assert.ok(["SUCCESS","FAILURE","UNKNOWN"].includes(x.outcome));
  assert.ok(typeof x.timestamp==="string"&&/^\d{4}-\d{2}-\d{2}T/.test(x.timestamp)&&Number.isFinite(Date.parse(x.timestamp)));
  assert.ok(typeof x.operation==="string"&&x.operation.length>0&&x.operation.length<=120);
  assert.match(x.commit,/^[0-9a-f]{40}$/);
  if(x.phaseId!==undefined)assert.match(x.phaseId,/^F[1-9][0-9]*$/);
 }
 const fingerprint=createHash("sha256").update("P-256:"+key.jwk.x+":"+key.jwk.y,"utf8").digest("hex");
 const signature=Buffer.from(envelope.signature,"base64url");
 const valid=verify("sha256",Buffer.from(envelope.payload,"utf8"),{key:createPublicKey({key:key.jwk,format:"jwk"}),dsaEncoding:"ieee-p1363"},signature);
 return {valid,fingerprint,count:receipts.receipts.length};
}
try{
 if(process.argv.length<4||process.argv.length>5)throw Error("USAGE: node Verify-ARKI-Twin-Receipts.cjs public-key.json signed-receipts.json [expected-fingerprint]");
 const key=read(process.argv[2]),envelope=read(process.argv[3]),result=validate(key,envelope);
 if(!result.valid)throw Error("INVALID_SIGNATURE");
 if(process.argv[4]){
  if(!/^[0-9a-f]{64}$/i.test(process.argv[4]))throw Error("INVALID_EXPECTED_FINGERPRINT");
  if(process.argv[4].toLowerCase()!==result.fingerprint)throw Error("FINGERPRINT_MISMATCH");
 }
 console.log("SIGNATURE_VALID_KEY_PROVENANCE_UNVERIFIED");
 console.log("KEY_FINGERPRINT_SHA256="+result.fingerprint);
 console.log("RECEIPTS="+result.count);
 console.log("OPERATIONAL_VERIFICATION=NOT_VERIFIED");
 console.log("CANONICAL_PROMOTION=BLOCKED");
}catch(error){console.error("ARKI_RECEIPT_VERIFICATION_FAIL: "+error.message);process.exitCode=1}
