"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const {prepare}=require("./arki-av013-dossiers.cjs");
const head="a".repeat(40);
const plan={schema:"ARKI-AV008-INVESTIGATION-1",webHead:head,receiptSha256:"receipt-1",cases:[{test:"tools/maqueta-viva/example.test.cjs",outcome:"FAIL",classification:"FAILURE_CONFIRMED_CAUSE_UNKNOWN"}]};
const reproduction={schema:"ARKI-AV009-ISOLATED-REPRODUCTION-1",webHead:head,sourceInvestigationReceipt:"receipt-1",receiptSha256:"receipt-2",cases:[{test:"tools/maqueta-viva/example.test.cjs",previousOutcome:"FAIL",reproductionOutcome:"FAIL",classification:"REPRODUCED"}]};
test("AV-013 admits only reproduced evidence, never auto-approves",()=>{const r=prepare(plan,reproduction);assert.equal(r.summary.readyForInvestigation,1);assert.equal(r.dossiers[0].candidates.length,0);assert.equal(r.policy.canonicalMutation,false)});
test("AV-013 blocks broken provenance",()=>assert.throws(()=>prepare(plan,{...reproduction,sourceInvestigationReceipt:"wrong"})));
test("AV-013 blocks unreproduced cases",()=>{const r=prepare(plan,{...reproduction,cases:[{...reproduction.cases[0],classification:"NOT_REPRODUCED",reproductionOutcome:"PASS"}]});assert.equal(r.summary.readyForInvestigation,0)});
