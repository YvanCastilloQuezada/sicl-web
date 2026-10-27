"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const {review}=require("./arki-mo031-review.cjs");
const a="a".repeat(40),b="b".repeat(40);
function fixture(){
 return [{schema:"ARKI-MO025-ADVISORY-1",inputFingerprint:"fingerprint",policy:{canonicalMutation:false,poApproval:"NOT_GRANTED"},evidence:"ADVISORY_ONLY_NOT_ARCHITECTURAL_COMPETENCE",proposals:[{id:"P1",phase:"F1",action:"DECLARE_DEPENDENCIES_WITH_EVIDENCE",status:"REVIEW_REQUIRED",authorized:false}]},{schema:"arki.mapa_vivo.v1",head:a,canonical_mutations:0},{schema:"ARKI-LIVE-SYSTEMS-SNAPSHOT-1",sourceCommit:b,canonicalMutation:false,execution:"READ_ONLY"},{expectedCoreHead:a,expectedWebHead:b}];
}
test("real identities yield review-only candidates",()=>{const r=review(...fixture());assert.equal(r.candidates.length,1);assert.equal(r.candidates[0].decision,"PENDING_PO");assert.equal(r.candidates[0].sandbox,"NOT_EXECUTED");assert.equal(r.policy.autoApproval,false)});
test("rejects stale Web identity",()=>{const f=fixture();f[3].expectedWebHead="c".repeat(40);assert.throws(()=>review(...f),/UNBOUND_SOURCE_IDENTITY/)});
test("rejects unauthorized advisory",()=>{const f=fixture();f[0].proposals[0].authorized=true;assert.throws(()=>review(...f),/UNSAFE_PROPOSAL/)});
test("rejects canonical mutation",()=>{const f=fixture();f[1].canonical_mutations=1;assert.throws(()=>review(...f),/INVALID_CORE_SOURCE/)});
test("rejects duplicate proposals",()=>{const f=fixture();f[0].proposals.push({...f[0].proposals[0]});assert.throws(()=>review(...f),/UNSAFE_PROPOSAL/)});
test("receipt deterministic",()=>{const f=fixture();assert.equal(review(...f).receiptSha256,review(...f).receiptSha256)});
