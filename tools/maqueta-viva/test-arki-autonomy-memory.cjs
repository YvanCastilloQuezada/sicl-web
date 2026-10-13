"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const {record,validate,summarize}=require("./arki-autonomy-memory.cjs");
const input={type:"DEFICIT",subject:"F6",sourceSha:"a".repeat(40),evidenceRef:"ci:123",payload:{reason:"unknown"}};
test("append and verify journal",()=>{const h=record([],input);assert.equal(validate(h).count,1);assert.equal(summarize(h).byType.DEFICIT,1)});
test("deterministic replay",()=>assert.deepEqual(record([],input),record([],input)));
test("detect tampering",()=>{const h=record([],input);h[0].payload.reason="changed";assert.throws(()=>validate(h),/MEMORY_INTEGRITY_FAILURE/)});
test("detect reordered or missing events",()=>{const h=record(record([],input),input);assert.throws(()=>validate(h.slice(1)),/MEMORY_INTEGRITY_FAILURE/)});
test("reject invalid provenance",()=>assert.throws(()=>record([],{...input,sourceSha:"bad"}),/INVALID_MEMORY_EVENT/));
