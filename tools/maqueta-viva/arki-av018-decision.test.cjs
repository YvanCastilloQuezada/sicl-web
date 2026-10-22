"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict"),crypto=require("node:crypto");
const {record}=require("./arki-av018-decision.cjs");
const hash=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
function proposal(){const p={schema:"ARKI-AV017-PO-PROPOSAL-1",scope:"CONTROLLED_FIXTURE_ONLY",originalHead:"a".repeat(40),decision:{status:"AWAITING_PO"},policy:{approved:false,canonicalMutation:false},alternatives:[{id:"A",status:"PASS",eligibleForReview:true,rollbackVerified:true},{id:"B",status:"FAIL",eligibleForReview:false,rollbackVerified:true},{id:"C",status:"PASS",eligibleForReview:true,rollbackVerified:true}]};p.receiptSha256=hash(p);return p}
test("AV-018 records experimental approval but forbids Core writes",()=>{const r=record(proposal(),"APPROVE_EXPERIMENT","A","PO:owner");assert.equal(r.decisionStatus,"EXPERIMENT_APPROVED");assert.equal(r.rights.coreWrite,false);assert.equal(r.rights.canonicalIntegration,false)});
test("AV-018 blocks failed candidate",()=>assert.throws(()=>record(proposal(),"APPROVE_EXPERIMENT","B","PO:owner"),/CANDIDATE_NOT_ELIGIBLE/));
test("AV-018 blocks forged proposal",()=>{const p=proposal();p.alternatives[1].status="PASS";assert.throws(()=>record(p,"APPROVE_EXPERIMENT","B","PO:owner"),/TAMPERED_PROPOSAL/)});
test("AV-018 records investigation request without selection",()=>{const r=record(proposal(),"REQUEST_INVESTIGATION",null,"PO:owner");assert.equal(r.selected,null);assert.equal(r.decisionStatus,"MORE_INVESTIGATION_REQUIRED")});
test("AV-018 prevents repeated decision on same receipt",()=>{const p=proposal();const r=record(p,"REJECT",null,"PO:owner");assert.throws(()=>record(p,"REJECT",null,"PO:owner",r),/PROPOSAL_ALREADY_DECIDED/)});
