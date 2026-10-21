"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const {runMacroOrder}=require("./arki-autonomy-macro-orders.cjs");
const {validate}=require("./arki-autonomy-memory.cjs");
const base={command:"AUDIT_AND_PLAN",parts:[{id:"A",path:"src/a.ts",phase:"F2",dependencies:[]}],
 discovery:{schema:"ARKI-CAPABILITY-DISCOVERY-1",totalFiles:1,unclassified:0,sourceSnapshot:"fixture"},sourceSha:"a".repeat(40)};
test("macro-order creates verifiable history",()=>{const r=runMacroOrder(base);assert.equal(validate(r.journal).count,2);assert.equal(r.plan.work[0].action,"EVIDENCE_OR_AUTHORITY_REVIEW")});
test("reassess appends without losing history",()=>{const a=runMacroOrder(base);const b=runMacroOrder({...base,command:"REASSESS",history:a.journal});assert.equal(b.journal.length,5);assert.equal(validate(b.journal).count,5)});
test("invalid macro-order rejected",()=>assert.throws(()=>runMacroOrder({...base,command:"EXECUTE_CANONICAL"}),/INVALID_MACRO_ORDER/));
test("journal tampering blocks further planning",()=>{const a=runMacroOrder(base);a.journal[0].payload.parts=100;assert.throws(()=>runMacroOrder({...base,history:a.journal}),/MEMORY_INTEGRITY_FAILURE/)});
test("macro-order is deterministic",()=>assert.deepEqual(runMacroOrder(base),runMacroOrder(base)));
