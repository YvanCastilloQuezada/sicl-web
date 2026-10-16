"use strict";
/** MO-07 E3 preflight: real client entrypoint checks; NOT a browser E3 pass. */
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"../..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
test("MO07: App router exposes real ARKI command and control routes",()=>{
 const app=read("client/src/App.tsx");
 for(const route of ["/control-center","/arki-command-center","/arki-super-architect"])
  assert(app.includes('path={"'+route+'"}'),"MISSING_ROUTE:"+route);
});
test("MO07: routed pages exist as TypeScript components",()=>{
 for(const file of ["client/src/pages/ArkiControlCenterPage.tsx",
  "client/src/pages/ArkiSuperarchitectCommandCenterPage.tsx",
  "client/src/pages/ArkiSuperArchitectViewerPage.tsx"])
  assert(fs.statSync(path.join(root,file)).isFile(),file);
});
test("MO07: experimental recovered coordinator remains outside browser router",()=>{
 const app=read("client/src/App.tsx");
 assert(!app.includes("arki-live-systems-coordinator.cjs"),
  "RECOVERED_NODE_COORDINATOR_CANNOT_BE_IMPORTED_DIRECTLY_IN_BROWSER");
});
test("MO07: real browser E3 is not asserted by this preflight",()=>{
 const manifest={e3Browser:"NOT_EXECUTED",liveSystemUI:"NOT_ATTESTED",ownerApproval:"NOT_EXERCISED",
  canonicalMutation:false};
 assert.equal(manifest.e3Browser,"NOT_EXECUTED");
 assert.equal(manifest.ownerApproval,"NOT_EXERCISED");
});
