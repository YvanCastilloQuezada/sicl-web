"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const {prepareAce88Request,CONTRACT,ACTION}=require("./arki-ace88-preflight-adapter.cjs");
const proposal={projectId:"P",proposalId:"D",fingerprint:"fp",reviewId:"R"};
const gate={tests:"PASS",dependencies:"PASS",frozen:"PASS",evidence:"PASS"};
function proof(){return {signature_b64:"QUJDRA==",payload:{contract:CONTRACT,action:ACTION,projectId:"P",proposalId:"D",fingerprint:"fp",actorId:"owner",reviewId:"R",keyId:"k1",decision:"APPROVED",issuedAt:new Date(Date.now()-10000).toISOString(),expiresAt:new Date(Date.now()+60000).toISOString(),nonce:"n1"}}}
function check(p=proposal,pr=proof(),g=gate){return prepareAce88Request({proposal:p,proof:pr,gate:g})}
test("prepare request but never authorize",()=>{const r=check();assert.equal(r.status,"READY_FOR_CORE_VERIFICATION");assert.equal(r.authorized,false);assert.equal(r.coreVerification,"REQUIRED");assert.equal(r.request.approval_payload.contract,CONTRACT)});
test("reject unsigned approval",()=>assert.equal(check(proposal,{payload:proof().payload}).status,"BLOCKED"));
test("reject changed fingerprint",()=>assert.equal(check({...proposal,fingerprint:"changed"}).reason,"AUTHORITY_BINDING_MISMATCH"));
test("reject changed review",()=>assert.equal(check({...proposal,reviewId:"changed"}).reason,"AUTHORITY_BINDING_MISMATCH"));
test("reject unknown evidence",()=>assert.equal(check(proposal,proof(),{...gate,evidence:"UNKNOWN"}).reason,"PRECONDITIONS_NOT_VERIFIED"));
test("reject frozen failure",()=>assert.equal(check(proposal,proof(),{...gate,frozen:"FAIL"}).reason,"PRECONDITIONS_NOT_VERIFIED"));
test("reject expired",()=>{const p=proof();p.payload.expiresAt=new Date(Date.now()-1000).toISOString();assert.equal(check(proposal,p).reason,"AUTHORITY_EXPIRED_OR_INVALID")});
test("reject extra fields",()=>{const p=proof();p.payload.admin=true;assert.equal(check(proposal,p).reason,"INVALID_AUTHORITY_FIELDS")});
test("reject wrong action",()=>{const p=proof();p.payload.action="ANY";assert.equal(check(proposal,p).reason,"INVALID_AUTHORITY_SCOPE")});
test("reject bad signature encoding",()=>{const p=proof();p.signature_b64="bad!";assert.equal(check(proposal,p).reason,"INVALID_SIGNATURE_ENCODING")});
