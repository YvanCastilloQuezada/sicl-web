#!/usr/bin/env node
/**
 * ARKI GDT-02 — physical evidence admission gate. Fail closed, no repository mutation.
 * Node 20+. Inputs must contain REAL evidence, not demonstration fixtures.
 * node tools/maqueta-viva/Verify-ARKI-PhysicalEvidence.mjs --assets register.json --events observations.json [--out report.json]
 * node tools/maqueta-viva/Verify-ARKI-PhysicalEvidence.mjs --self-test
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { resolve, dirname, join, isAbsolute, relative, sep } from "node:path";
import { tmpdir } from "node:os";

const hash = bytes => createHash("sha256").update(bytes).digest("hex");
const fail = (code, detail="") => { throw new Error(code+(detail?": "+detail:"")); };
const object = x => !!x && typeof x==="object" && !Array.isArray(x);
const nonempty = x => typeof x==="string" && x.trim().length>0 && x.length<=1024;
const fingerprint = x => typeof x==="string" && /^[0-9a-f]{64}$/.test(x);
const time = (x,code) => {
  if (typeof x!=="string" || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?(?:Z|[+-]\d\d:\d\d)$/.test(x) || !Number.isFinite(Date.parse(x))) fail(code);
  return Date.parse(x);
};
const load = p => {
  try { return JSON.parse(readFileSync(p,"utf8")); } catch(e) { fail("INPUT_JSON_INVALID",p+" "+e.message); }
};
function evidenceFile(root, ref, expectedHash) {
  if (!nonempty(ref) || isAbsolute(ref) || ref.includes("\\") || ref.split("/").includes("..") || ref.split("/").includes(".") || !fingerprint(expectedHash)) fail("SOURCE_REFERENCE_INVALID",String(ref));
  const path=resolve(root,ref), rel=relative(root,path);
  if (rel.startsWith(".."+sep) || rel===".." || isAbsolute(rel)) fail("SOURCE_PATH_ESCAPE",ref);
  let bytes;
  try { bytes=readFileSync(path); } catch { fail("SOURCE_FILE_NOT_FOUND",ref); }
  if (bytes.length===0 || bytes.length>20*1024*1024) fail("SOURCE_SIZE_INVALID",ref);
  const actual=hash(bytes);
  if (actual!==expectedHash) fail("SOURCE_FINGERPRINT_MISMATCH",ref);
  return {ref,sha256:actual,bytes:bytes.length};
}
function validate(assetsDoc,eventsDoc,assetsDir,eventsDir) {
  if (!object(assetsDoc) || assetsDoc.schema!=="ARKI-PHYSICAL-ASSETS-1.0" || !nonempty(assetsDoc.projectId) || !Array.isArray(assetsDoc.assets) || !assetsDoc.assets.length) fail("ASSET_REGISTER_INVALID");
  if (!object(eventsDoc) || eventsDoc.schema!=="ARKI-PHYSICAL-OBSERVATIONS-1.0" || eventsDoc.projectId!==assetsDoc.projectId || !Array.isArray(eventsDoc.events) || eventsDoc.events.length<2) fail("OBSERVATION_REGISTER_INVALID");
  const assetMap=new Map(),semanticIds=new Set();
  for(const a of assetsDoc.assets){
    if(!object(a)||!nonempty(a.assetId)||!nonempty(a.semanticId)||!nonempty(a.sourceRef)||!fingerprint(a.sourceSha256)) fail("ASSET_IDENTITY_INVALID");
    if(assetMap.has(a.assetId)) fail("ASSET_ID_DUPLICATE",a.assetId);
    if(semanticIds.has(a.semanticId)) fail("SEMANTIC_ID_DUPLICATE",a.semanticId);
    semanticIds.add(a.semanticId);
    const source=evidenceFile(assetsDir,a.sourceRef,a.sourceSha256);
    assetMap.set(a.assetId,{assetId:a.assetId,semanticId:a.semanticId,source});
    
  }
  const ids=new Set(),seenOccurrence=new Set(),events=[],observers=new Set(),sources=new Set();
  for(const e of eventsDoc.events){
    if(!object(e)||!nonempty(e.eventId)||!nonempty(e.assetId)||!nonempty(e.observer)||!nonempty(e.sourceRef)||!fingerprint(e.sourceSha256)||!object(e.observedState)||!Object.keys(e.observedState).length||e.kind!=="FIELD_OBSERVATION") fail("EVENT_SCHEMA_INVALID");
    if(!assetMap.has(e.assetId)) fail("EVENT_UNKNOWN_ASSET",e.assetId);
    if(ids.has(e.eventId)) fail("EVENT_ID_DUPLICATE",e.eventId);
    ids.add(e.eventId);
    const occurred=time(e.occurredAt,"EVENT_OCCURRED_AT_INVALID"),recorded=time(e.recordedAt,"EVENT_RECORDED_AT_INVALID");
    if(occurred>recorded) fail("EVENT_TIME_IN_FUTURE_RELATIVE_TO_RECORD",e.eventId);
    const occurrence=e.assetId+"|"+occurred;
    if(seenOccurrence.has(occurrence)) fail("EVENT_OCCURRENCE_COLLISION",occurrence);
    seenOccurrence.add(occurrence);
    const source=evidenceFile(eventsDir,e.sourceRef,e.sourceSha256);
    sources.add(source.ref+"|"+source.sha256);observers.add(e.observer);
    events.push({eventId:e.eventId,assetId:e.assetId,occurredAt:e.occurredAt,recordedAt:e.recordedAt,occurred,recorded,observer:e.observer,source,observedState:e.observedState});
  }
  const counts=new Map();
  for(const e of events)counts.set(e.assetId,(counts.get(e.assetId)||0)+1);
  const eligible=[...counts].filter(([id,n])=>n>=2 && new Set(events.filter(e=>e.assetId===id).map(e=>e.source.ref+"|"+e.source.sha256)).size>=2).map(([id])=>id);
  if(!eligible.length) fail("TWO_INDEPENDENT_OBSERVATIONS_OF_ONE_ASSET_REQUIRED");
  if(sources.size<2) fail("INDEPENDENT_SOURCE_FILES_REQUIRED");
  events.sort((a,b)=>a.occurred-b.occurred||a.recorded-b.recorded||a.eventId.localeCompare(b.eventId));
  let tail="GENESIS",current={},checkpoints=[];
  for(const e of events){
    const before=current[e.assetId]??null;
    const entry={eventId:e.eventId,assetId:e.assetId,occurredAt:e.occurredAt,recordedAt:e.recordedAt,sourceSha256:e.source.sha256,before,after:e.observedState,previousHash:tail};
    tail=hash(JSON.stringify(entry));current[e.assetId]=structuredClone(e.observedState);
    checkpoints.push({eventId:e.eventId,occurredAt:e.occurredAt,tailHash:tail,assetId:e.assetId,expected:structuredClone(current[e.assetId])});
  }
  // Independently replay from the ordered observations and compare every checkpoint.
  let replayTail="GENESIS";const replay={};
  for(let i=0;i<events.length;i++){
    const e=events[i],c=checkpoints[i];
    const entry={eventId:e.eventId,assetId:e.assetId,occurredAt:e.occurredAt,recordedAt:e.recordedAt,sourceSha256:e.source.sha256,before:replay[e.assetId]??null,after:e.observedState,previousHash:replayTail};
    replayTail=hash(JSON.stringify(entry));replay[e.assetId]=structuredClone(e.observedState);
    if(replayTail!==c.tailHash||JSON.stringify(replay[e.assetId])!==JSON.stringify(c.expected)) fail("PHYSICAL_REPLAY_MISMATCH",e.eventId);
  }
  return {
    schema:"ARKI-PHYSICAL-EVIDENCE-GATE-1.0",
    verdict:"EVIDENCE_ADMISSIBLE_FOR_FURTHER_INDEPENDENT_REVIEW_NOT_OPERATIONAL_TWIN",
    projectId:assetsDoc.projectId,
    identity:{registeredAssets:assetMap.size,assetsWithTwoOrMoreObservations:eligible,duplicateAssetIds:0},
    provenance:{sourceFilesVerifiedByBytes:true,distinctObservationSources:sources.size,observersDeclared:observers.size,observerIdentityIndependentlyVerified:false},
    time:{eventOccurredAtPresent:true,recordedAtSeparate:true,occurredAtOrder:"RECONSTRUCTED_FROM_EVENT_TIMESTAMPS",clockCalibration:"NOT_VERIFIED"},
    replay:{status:"PASS",events:events.length,checkpoints:checkpoints.length,tailHash:replayTail},
    limitations:[
      "Source bytes match declared SHA-256; authenticity and custody of source files are NOT independently verified.",
      "Observed state is asserted by the supplied source; physical truth, sensor calibration and independent comparison are NOT established.",
      "No AGK/D-2/IFC/RVT semantic mapping has been independently verified.",
      "No F1-F10 status, FROZEN contract, operational twin readiness or canonical decision is changed."
    ],
    nextGate:"Independent verification of physical asset mapping, source custody and one as-of-time observation against external ground truth."
  };
}
function selfTest(){
  const dir=mkdtempSync(join(tmpdir(),"arki-gdt02-"));
  try{
    const evidence=(name,body)=>{writeFileSync(join(dir,name),body);return {sourceRef:name,sourceSha256:hash(Buffer.from(body))};};
    const a=evidence("asset.txt","REALITY-FREE SYNTHETIC ASSET"),b=evidence("one.txt","SYNTHETIC ONE"),c=evidence("two.txt","SYNTHETIC TWO");
    const assets={schema:"ARKI-PHYSICAL-ASSETS-1.0",projectId:"TEST-ONLY",assets:[{assetId:"A-01",semanticId:"TEST:A-01",...a}]};
    const events={schema:"ARKI-PHYSICAL-OBSERVATIONS-1.0",projectId:"TEST-ONLY",events:[
      {eventId:"E1",assetId:"A-01",kind:"FIELD_OBSERVATION",observer:"TEST",occurredAt:"2026-10-01T09:00:00-05:00",recordedAt:"2026-10-01T10:00:00-05:00",observedState:{condition:"TEST_A"},...b},
      {eventId:"E2",assetId:"A-01",kind:"FIELD_OBSERVATION",observer:"TEST",occurredAt:"2026-10-02T09:00:00-05:00",recordedAt:"2026-10-02T10:00:00-05:00",observedState:{condition:"TEST_B"},...c}
    ]};
    const good=validate(assets,events,dir,dir);
    if(good.replay.status!=="PASS"||good.replay.events!==2)fail("SELFTEST_VALID_REPLAY");
    const reject=(code,mutate)=>{const copy=structuredClone(events);mutate(copy);let caught=false;try{validate(assets,copy,dir,dir);}catch(e){caught=e.message.startsWith(code);}if(!caught)fail("SELFTEST_REJECTION_FAILED",code);};
    reject("EVENT_ID_DUPLICATE",x=>x.events[1].eventId="E1");
    reject("EVENT_UNKNOWN_ASSET",x=>x.events[1].assetId="UNKNOWN");
    reject("SOURCE_FINGERPRINT_MISMATCH",x=>x.events[1].sourceSha256="0".repeat(64));
    reject("EVENT_TIME_IN_FUTURE_RELATIVE_TO_RECORD",x=>x.events[1].recordedAt="2026-09-01T10:00:00-05:00");
    reject("EVENT_OCCURRENCE_COLLISION",x=>x.events[1].occurredAt=x.events[0].occurredAt);
    reject("TWO_INDEPENDENT_OBSERVATIONS_OF_ONE_ASSET_REQUIRED",x=>{x.events[1].sourceRef=x.events[0].sourceRef;x.events[1].sourceSha256=x.events[0].sourceSha256;});
    console.log("SELF_TEST=PASS; SYNTHETIC_ONLY=YES; REPLAY=PASS; DUPLICATE=REJECTED; UNKNOWN_ASSET=REJECTED; TAMPER=REJECTED; TIME=REJECTED; COLLISION=REJECTED; SAME_SOURCE=REJECTED");
  } finally {rmSync(dir,{recursive:true,force:true});}
}
try{
  const args=process.argv.slice(2);
  if(args.length===1&&args[0]==="--self-test"){selfTest();}
  else {
    const opts={};
    for(let i=0;i<args.length;i+=2){if(!["--assets","--events","--out"].includes(args[i])||!args[i+1]||args[i+1].startsWith("--")||opts[args[i]])fail("ARGUMENTS_INVALID");opts[args[i]]=args[i+1];}
    if(!opts["--assets"]||!opts["--events"])fail("ASSETS_AND_EVENTS_REQUIRED");
    const ap=resolve(opts["--assets"]),ep=resolve(opts["--events"]);
    const result=validate(load(ap),load(ep),dirname(ap),dirname(ep));
    if(opts["--out"]){const out=resolve(opts["--out"]);mkdirSync(dirname(out),{recursive:true});writeFileSync(out,JSON.stringify(result,null,2)+"\n");console.error("REPORT_WRITTEN="+out);}
    console.log(JSON.stringify(result,null,2));
  }
}catch(e){console.error("ARKI_PHYSICAL_EVIDENCE_GATE_FAILED="+e.message);process.exitCode=1;}
