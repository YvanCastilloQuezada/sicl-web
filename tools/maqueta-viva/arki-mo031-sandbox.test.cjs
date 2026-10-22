"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const {rehearse}=require("./arki-mo031-sandbox.cjs");
const crypto=require("node:crypto");
const sha=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
function fixtures(){return [{schema:"ARKI-MO031-CORRECTION-REVIEW-1",receiptSha256:"receipt",policy:{execution:"READ_ONLY",canonicalMutation:false,autoApproval:false},candidates:[{id:"A",decision:"PENDING_PO",sandbox:"NOT_EXECUTED",canonicalMutation:false,action:"DECLARE_DEPENDENCIES_WITH_EVIDENCE"}]},{ideas:[{id:"A",dependsOn:[]}],components:[]}]}
test("sandbox rehearses missing evidence and restores source",()=>{const [r,g]=fixtures(),before=sha(g),x=rehearse(r,g);assert.equal(x.rollbackVerified,true);assert.equal(sha(g),before);assert.equal(x.candidates[0].status,"SANDBOX_REHEARSAL_ONLY");assert.notEqual(x.sandboxSha256,x.registryBeforeSha256)});
test("no fabricated dependency",()=>{const [r,g]=fixtures();const x=rehearse(r,g);assert.deepEqual(g.ideas[0].dependsOn,[]);assert.equal(x.candidates[0].requiredEvidence.includes("DECLARED_DEPENDENCY_IDS"),true)});
test("missing target blocked",()=>{const [r,g]=fixtures();r.candidates[0].id="MISSING";assert.equal(rehearse(r,g).candidates[0].status,"BLOCKED_MISSING_REGISTRY_TARGET")});
test("unsupported action blocked",()=>{const [r,g]=fixtures();r.candidates[0].action="EXECUTE_AGK";assert.equal(rehearse(r,g).candidates[0].status,"BLOCKED_ACTION_NOT_SUPPORTED")});
test("rejects automatic approval",()=>{const [r,g]=fixtures();r.policy.autoApproval=true;assert.throws(()=>rehearse(r,g),/INVALID_REVIEW/)});
test("rejects unsafe candidate",()=>{const [r,g]=fixtures();r.candidates[0].decision="APPROVED";assert.throws(()=>rehearse(r,g),/UNSAFE_CANDIDATE/)});
test("rejects duplicate candidates",()=>{const [r,g]=fixtures();r.candidates.push({...r.candidates[0]});assert.throws(()=>rehearse(r,g),/UNSAFE_CANDIDATE/)});
test("rejects duplicate registry IDs",()=>{const [r,g]=fixtures();g.components.push({id:"A"});assert.throws(()=>rehearse(r,g),/INVALID_REGISTRY_ID/)});
test("deterministic rehearsal receipt",()=>{const [r,g]=fixtures();assert.equal(rehearse(r,g).receiptSha256,rehearse(r,g).receiptSha256)});
