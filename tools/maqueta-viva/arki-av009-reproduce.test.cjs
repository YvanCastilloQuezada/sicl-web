"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const {reproduce}=require("./arki-av009-reproduce.cjs");
const cp=require("node:child_process");
const head=cp.execFileSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).trim();
const base={schema:"ARKI-AV008-INVESTIGATION-1",webHead:head,cases:[]};
test("AV-009 empty incident list makes no experiments or canonical changes",()=>{
 const r=reproduce(process.cwd(),base);
 assert.equal(r.cases.length,0);assert.equal(r.policy.canonicalMutation,false);assert.equal(r.policy.repairApplied,false);
});
test("AV-009 refuses stale plan and fabricated test paths",()=>{
 assert.throws(()=>reproduce(process.cwd(),{...base,webHead:"b".repeat(40)}),/STALE_PLAN/);
 assert.throws(()=>reproduce(process.cwd(),{...base,cases:[{test:"../../escape.test.cjs",outcome:"FAIL",classification:"FAILURE_CONFIRMED_CAUSE_UNKNOWN"}]}),/UNSUPPORTED_CASE/);
});
test("AV-009 rejects untracked fabricated incident",()=>{
 assert.throws(()=>reproduce(process.cwd(),{...base,cases:[{test:"tools/maqueta-viva/nonexistent.test.cjs",outcome:"FAIL",classification:"FAILURE_CONFIRMED_CAUSE_UNKNOWN"}]}),/UNTRACKED_CASE/);
});
