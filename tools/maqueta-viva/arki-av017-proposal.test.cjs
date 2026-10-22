"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict"),crypto=require("node:crypto");
const {propose}=require("./arki-av017-proposal.cjs");
const hash=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
function fixture(){const r={schema:"ARKI-AV016-SAME-INCIDENT-REPAIR-1",originalHead:"a".repeat(40),isolatedHead:"b".repeat(40),incident:{baseline:"FAIL",source:"test.cjs"},candidates:[{id:"A",label:"ADD",status:"PASS",rollbackVerified:true,canonicalMutation:false},{id:"B",label:"CONSTANT",status:"FAIL",rollbackVerified:true,canonicalMutation:false},{id:"C",label:"COERCE",status:"PASS",rollbackVerified:true,canonicalMutation:false}],policy:{sameIncidentPatchDemonstrated:true,canonicalMutation:false,repairApplied:false}};r.receiptSha256=hash(r);return r}
test("AV-017 prepares PO decision without automatic approval",()=>{const p=propose(fixture());assert.equal(p.decision.status,"AWAITING_PO");assert.equal(p.decision.selected,null);assert.equal(p.decision.recommendation,null);assert.equal(p.policy.canonicalMutation,false);assert.equal(p.alternatives.filter(x=>x.eligibleForReview).length,2)});
test("AV-017 rejects tampered evidence",()=>{const r=fixture();r.candidates[0].status="FAIL";assert.throws(()=>propose(r),/TAMPERED_RECEIPT/)});
test("AV-017 rejects missing rollback even with valid receipt",()=>{const r=fixture();r.candidates[0].rollbackVerified=false;delete r.receiptSha256;r.receiptSha256=hash(r);assert.throws(()=>propose(r),/UNSAFE_CANDIDATE/)});
