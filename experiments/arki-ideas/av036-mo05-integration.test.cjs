"use strict";
/** MO-05: integration contract of recovered experimental modules; NOT browser E3. */
const test=require("node:test"),assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const {composeLiveSystems}=require("./REC-001/arki-live-systems-coordinator.cjs");
const {run:runPulse}=require("./REC-006/arki-live-pulse.cjs");
const root=path.resolve(__dirname,"../..");
const registryPath=path.join(__dirname,"REC-001/assembly-registry.json");
const mapPath=path.join(root,"docs/arki-master-map/ARKI_MASTER_MAP_STATE.json");
const sha="b".repeat(40); // Test fixture only; NOT an attested commit.
const read=()=>({
 registry:JSON.parse(fs.readFileSync(registryPath,"utf8")),
 map:JSON.parse(fs.readFileSync(mapPath,"utf8"))
});
const digest=p=>crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
test("MO05: real recovered registry and map compose deterministically, read only",()=>{
 const before=[digest(registryPath),digest(mapPath)];
 const a=composeLiveSystems({...read(),sourceCommit:sha});
 const b=composeLiveSystems({...read(),sourceCommit:sha});
 assert.equal(a.receiptSha256,b.receiptSha256);
 assert.equal(a.canonicalMutation,false);
 assert.equal(a.execution,"READ_ONLY");
 assert.equal(a.owner.decision,"PENDING");
 assert.equal(a.owner.authorization,"SPECIFIC_APPROVAL_REQUIRED");
 assert.equal(a.twin.simulation,"NOT_EXECUTED_BY_COMPOSER");
 assert.equal(a.twin.evidence,"REQUIRES_INDEPENDENT_VALIDATION");
 assert.deepEqual([digest(registryPath),digest(mapPath)],before);
});
test("MO05: incomplete alternatives cannot propagate to owner approval",()=>{
 const {registry,map}=read(),id=registry.ideas[0].id;
 assert.throws(()=>composeLiveSystems({registry,map,sourceCommit:sha,
  alternativesByIdea:{[id]:[]}}),/INCOMPLETE_TWIN_INPUT/);
});
test("MO05: hypothetical alternatives stay blocked in composed twin",()=>{
 const {registry,map}=read(),id=registry.ideas[0].id;
 const baseline={timeMs:100,cost:100,quality:70};
 const alternatives=["A","B","C"].map(id=>({id,evidenceLevel:"HYPOTHETICAL",
  timeMs:90,cost:90,quality:80,risk:20,testsPassed:1,testsTotal:1}));
 const result=composeLiveSystems({registry,map,sourceCommit:sha,
  baselineByIdea:{[id]:baseline},alternativesByIdea:{[id]:alternatives}});
 assert.equal(result.twin.decisions.length,1);
 assert.equal(result.twin.decisions[0].selectedAlternative,null);
 assert(result.twin.decisions[0].alternatives.every(x=>x.eligibleForOwnerDecision===false));
 assert.equal(result.owner.decision,"PENDING");
 assert.equal(result.canonicalMutation,false);
});
test("MO05: unknown health does not assert architectural readiness",async()=>{
 const result=await runPulse({});
 assert.equal(result.architecturalState,"UNKNOWN");
 assert.equal(result.d2CanonicalState,"NOT_INSPECTED");
 assert.equal(result.agkCanonicalState,"NOT_INSPECTED");
 assert.equal(result.eventLog,"NOT_MODIFIED");
});
