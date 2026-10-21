"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const {requestAce88Promotion}=require("./arki-ace88-core-transport.cjs");
const proposal={projectId:"p/1",proposalId:"D",fingerprint:"a".repeat(64),reviewId:"R"};
const gate={tests:"PASS",dependencies:"PASS",frozen:"PASS",evidence:"PASS"};
function proof(){return {signature_b64:"QUJDRA==",payload:{contract:"ARKI_HUMAN_APPROVAL_V2",action:"DEVELOPER_PROPOSAL_APPROVE",projectId:"p/1",proposalId:"D",fingerprint:"a".repeat(64),actorId:"owner",reviewId:"R",keyId:"k1",decision:"APPROVED",issuedAt:new Date(Date.now()-10000).toISOString(),expiresAt:new Date(Date.now()+60000).toISOString(),nonce:"n1"}}}
const args=()=>({proposal,proof:proof(),gate,serviceToken:"TEST_ONLY"});
test("real Core route and schema, but no Web authorization",async()=>{
 let called;
 const result=await requestAce88Promotion({...args(),transport:async x=>{called=x;return {statusCode:200,body:{status:"OK",code:"OK",data:{status:"COMMITTED",proposal_id:"D",snapshot_id:"S",d2_version:1,effects_status:"COMPLETE"}}}}});
 assert.equal(called.path,"/v1/projects/p%2F1/developer-promotions");
 assert.equal(called.body.proposal_fingerprint,"a".repeat(64));
 assert.equal(result.status,"CORE_COMMITTED_REQUIRES_INDEPENDENT_VERIFICATION");
 assert.equal(result.authorized,false);
});
test("missing service token blocks before transport",async()=>assert.equal((await requestAce88Promotion({...args(),serviceToken:"",transport:async()=>{throw Error("should not run")}})).status,"BLOCKED"));
test("Core rejects",async()=>assert.equal((await requestAce88Promotion({...args(),transport:async()=>({statusCode:401,body:{}})})).status,"BLOCKED"));
test("network error fails closed",async()=>assert.equal((await requestAce88Promotion({...args(),transport:async()=>{throw Error("offline")}})).reason,"CORE_UNAVAILABLE"));
test("unexpected receipt fails closed",async()=>assert.equal((await requestAce88Promotion({...args(),transport:async()=>({statusCode:200,body:{status:"OK",code:"OK",data:{status:"COMMITTED",proposal_id:"wrong"}}})})).reason,"CORE_RECEIPT_INVALID"));
test("partial effects do not become verified",async()=>assert.equal((await requestAce88Promotion({...args(),transport:async()=>({statusCode:200,body:{status:"OK",code:"OK",data:{status:"COMMITTED",proposal_id:"D",snapshot_id:"S",d2_version:1,effects_status:"PARTIAL"}}})})).status,"CORE_COMMITTED_EFFECTS_UNVERIFIED"));
