"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const {classify,sanitizeUrl,observe,run}=require("./arki-live-pulse.cjs");
test("unconfigured is not alive",()=>assert.equal(classify([]),"UNCONFIGURED"));
test("a failed endpoint degrades aggregate",()=>assert.equal(classify([{state:"UP"},{state:"DOWN"}]),"DEGRADED"));
test("unknown cannot become green",()=>assert.equal(classify([{state:"UP"},{state:"UNKNOWN"}]),"UNKNOWN"));
test("valid endpoints require HTTP(S) without secrets",()=>{
 assert.throws(()=>sanitizeUrl("file:///tmp/x"));
 assert.throws(()=>sanitizeUrl("https://u:p@example.org/health"));
 assert.throws(()=>sanitizeUrl("https://example.org/health?token=abc"));
 assert.equal(sanitizeUrl("https://example.org/health").pathname,"/health");
});
test("2xx observed as reachability only",async()=>{
 const x=await observe("core","https://example.org/health",{fetchFn:async()=>({ok:true,status:200})});
 assert.equal(x.state,"UP");
});
test("500 is DOWN",async()=>{
 const x=await observe("core","https://example.org/health",{fetchFn:async()=>({ok:false,status:500})});
 assert.equal(x.reason,"HTTP_500");
});
test("network errors fail closed and do not leak URLs",async()=>{
 const x=await observe("core","https://example.org/health",{fetchFn:async()=>{throw Error("secret")}});
 assert.equal(x.reason,"NETWORK_ERROR");assert.equal(JSON.stringify(x).includes("secret"),false);
});
test("redirects are never followed",async()=>{
 let opts;await observe("web","https://example.org/health",{fetchFn:async(_,o)=>{opts=o;return {ok:false,status:302}}});
 assert.equal(opts.redirect,"manual");
});
test("no endpoint yields explicit unknown architecture",async()=>{
 const r=await run({});
 assert.equal(r.state,"UNCONFIGURED");assert.equal(r.d2CanonicalState,"NOT_INSPECTED");
 assert.equal(r.eventLog,"NOT_MODIFIED");
});

test("local and IP literal destinations rejected",()=>{
 for(const target of ["http://localhost:3000/health","http://127.0.0.1/health","http://169.254.169.254/latest/meta-data","http://10.0.0.1/health","http://[::1]/health","http://metadata.google.internal/computeMetadata/v1"]) {
   assert.throws(()=>sanitizeUrl(target),undefined,target);
 }
});
test("rejected local URL is never fetched",async()=>{
 let called=false;
 const r=await observe("core","http://127.0.0.1/health",{fetchFn:async()=>{called=true;return {ok:true,status:200}}});
 assert.equal(called,false);
 assert.equal(r.state,"UNKNOWN");
 assert.equal(r.reason,"INVALID_URL");
});
