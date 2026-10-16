"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),net=require("node:net");
const {sanitizeUrl,observe}=require("./REC-006/arki-live-pulse.cjs");
const {evaluateThree}=require("./REC-003/arki-twin-three-alternatives.cjs");
const sha="a".repeat(40),digest="b".repeat(64);
test("MO06: reject URL-encoded credentials and query secrets",()=>{
 for(const u of ["https://u:p@example.org/","https://example.org/?key=x","file:///etc/passwd"]){
  assert.throws(()=>sanitizeUrl(u));
 }
});
test("MO06: reject IPv4 numeric and IPv6 literal variants (adversarial)",()=>{
 for(const u of ["http://2130706433/","http://0x7f000001/","http://0177.0.0.1/","http://[::ffff:127.0.0.1]/","http://[2001:db8::1]/"]){
  assert.throws(()=>sanitizeUrl(u),undefined,u);
 }
});
test("MO06: reject non-HTTPS remote endpoint unless explicitly trusted",()=>{
 // Security policy requirement: public HTTP allows on-path manipulation.
 assert.throws(()=>sanitizeUrl("http://example.org/health"));
});
test("MO06: a hostname with private DNS result must not reach fetch",async()=>{
 // DNS rebinding must be blocked at connection layer; fake fetch exposes current gap.
 let calls=0;
 const r=await observe("core","https://rebind.example.org/health",{
  resolveFn:async()=>[{address:"127.0.0.1",family:4}],
  fetchFn:async()=>{calls++;return {ok:true,status:200}}
 });
 assert.equal(calls,0);
 assert.notEqual(r.state,"UP");
});
test("MO06: measured self-attestation never enables owner decision",()=>{
 const alternatives=["A","B","C"].map(id=>({id,evidenceLevel:"MEASURED",timeMs:90,cost:90,quality:80,risk:20,testsPassed:1,testsTotal:1,evidence:{digest,sourceCommit:sha,verifiedBy:"INDEPENDENT_VERIFIER"}}));
 const r=evaluateThree({ideaId:"I-01",sourceCommit:sha,baseline:{timeMs:100,cost:100,quality:70},alternatives,dependencyGate:"PASS"});
 assert.equal(r.selectedAlternative,null);
 assert(r.alternatives.every(a=>a.eligibleForOwnerDecision===false));
 assert.equal(r.status,"MEASUREMENTS_CLAIMED_INDEPENDENT_VERIFICATION_REQUIRED");
});
