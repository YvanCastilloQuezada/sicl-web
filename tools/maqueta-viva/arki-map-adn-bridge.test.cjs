"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const {inspectMap}=require("./arki-map-adn-bridge.cjs");
const map=JSON.parse(fs.readFileSync(path.resolve(__dirname,"../../docs/arki-master-map/ARKI_MASTER_MAP_STATE.json"),"utf8"));
const commit="a".repeat(40);
const before=JSON.stringify(map),first=inspectMap(map,commit),second=inspectMap(map,commit);
assert.deepEqual(first,second);
assert.equal(JSON.stringify(map),before);
assert.equal(first.findings.length,10);
assert.equal(first.findings.find(x=>x.phase==="F6").action,"NO_AUTOMATIC_CHANGE");
assert.equal(map.roadmap.phases.find(x=>x.id==="F6").status,"RECONCILIATION_REQUIRED");
assert.equal(map.f6_freeze_revocation?.decision,"PERMANENT_FROZEN_REVOCATION");
assert.equal(first.findings.find(x=>x.phase==="F6").action,"RECONCILE_EVIDENCE");
assert.notEqual(first.findings.find(x=>x.phase==="F6").classification,"FROZEN_PROTECTED");
assert.equal(first.observation.metrics.every(x=>x.verified===false),true);
assert.equal(first.proposal.proposals.length,0,"Unverified map claims cannot generate authorized improvement targets");
assert.equal(first.proposal.deficits.every(x=>x.status==="UNKNOWN"||x.status==="DEFICIT_IDENTIFIED"),true);
assert.equal(first.canonicalMutation,false);
assert.equal(first.canonicalPromotion,"BLOCKED");
assert.equal(first.execution,"NOT_EXECUTED");
assert.throws(()=>inspectMap({...map,roadmap:{...map.roadmap,phases:[...map.roadmap.phases.slice(0,9),map.roadmap.phases[0]]}},commit),/INVALID_PHASE_ENTRY/);
assert.throws(()=>inspectMap({...map,roadmap:{...map.roadmap,phases:[]}},commit),/INVALID_PHASES/);
assert.throws(()=>inspectMap(map,"not-a-commit"),/INVALID_SOURCE_COMMIT/);
const changed=structuredClone(map);changed.roadmap.phases[6].status="FROZEN";
const next=inspectMap(changed,commit);
assert.notEqual(next.mapDigest,first.mapDigest);
assert.equal(next.findings.find(x=>x.phase==="F7").action,"NO_AUTOMATIC_CHANGE");
console.log("ARKI_MAP_ADN_BRIDGE=PASS; READ_ONLY; FROZEN_PROTECTED; NO_FAKE_VERIFICATION");
assert.equal(next.findings.find(x=>x.phase==="F6").action,"RECONCILE_EVIDENCE","F7 status change must not re-freeze F6");

for(const [name,mutate] of [
 ["frozen",m=>{m.roadmap.phases.find(p=>p.id==="F6").status="FROZEN";}],
 ["in_progress",m=>{m.roadmap.phases.find(p=>p.id==="F6").status="IN_PROGRESS";}],
 ["missing_revocation",m=>{delete m.f6_freeze_revocation;}],
 ["wrong_authority",m=>{m.f6_freeze_revocation.authority="UNKNOWN";}],
 ["wrong_decision",m=>{m.f6_freeze_revocation.decision="FROZEN";}],
 ["wrong_phase",m=>{m.f6_freeze_revocation.phase="F7";}],
 ["wrong_date",m=>{m.f6_freeze_revocation.date="2026-10-13";}],
 ["wrong_rule",m=>{m.f6_freeze_revocation.rule="AUTO_FREEZE_ALLOWED";}],
 ["missing_evidence",m=>{m.roadmap.phases.find(p=>p.id==="F6").evidence_status="UNKNOWN";}]
]){
 const candidate=structuredClone(map);
 mutate(candidate);
 assert.throws(
   ()=>inspectMap(candidate,commit),
   /INVALID_F6_REVOCATION|F6_REVOCATION_STATUS_CONFLICT/,
   name
 );
}
assert.equal(
 inspectMap(map,commit).findings.find(x=>x.phase==="F6").action,
 "RECONCILE_EVIDENCE"
);
console.log("AV036_F6_ADVERSARIAL_10_OF_10_PASS");
console.log("ARKI_MAP_ADN_BRIDGE=PASS; READ_ONLY; F6_UNFROZEN; F7_FROZEN_PROTECTED; NO_FAKE_VERIFICATION");
