import { describe, expect, it } from "vitest";
import { ArkiNamingLedger, assertNamingCommitAllowed, decideNamingEvent, evidenceFromAgkEnvelope, validateAgkGeometryEvidenceEnvelope, type AgkGeometryEvidenceEnvelope } from "../shared/arkiPersistentNaming";

const env=(x:Partial<AgkGeometryEvidenceEnvelope>={}):AgkGeometryEvidenceEnvelope=>({schema:"ARKI_AGK_GEOMETRY_EVIDENCE_V1",authority:"AGK_OCCT",operationId:"OP:ORDERED",revision:1,producedAt:"2026-10-05T03:17:56-05:00",predecessors:["A"],successors:["B"],...x});

describe("AGK DELTA-005 P5 ordered hardening",()=>{
 describe("01 schema and provenance",()=>{
  it("rejects blank operation id",()=>expect(()=>validateAgkGeometryEvidenceEnvelope(env({operationId:" "}))).toThrow("ARKI_NAMING_INVALID_GEOMETRY_EVIDENCE"));
  it("rejects fractional revision",()=>expect(()=>validateAgkGeometryEvidenceEnvelope(env({revision:1.5}))).toThrow("ARKI_NAMING_INVALID_GEOMETRY_EVIDENCE"));
  it("preserves topology evidence in adapter",()=>expect(evidenceFromAgkEnvelope(env({topologySignatures:["F=6","E=24"]})).topologySignature).toBe("F=6|E=24"));
 });
 describe("02 confidence boundary",()=>{
  it("accepts threshold exactly",()=>expect(decideNamingEvent({predecessorIds:["A"],successorIds:["B"],confidenceThreshold:.85,candidates:[{successorId:"B",evidence:{role:"ROOF"},score:.85}]}).event).toBe("PRESERVE"));
  it("rejects just below threshold",()=>expect(decideNamingEvent({predecessorIds:["A"],successorIds:["B"],confidenceThreshold:.85,candidates:[{successorId:"B",evidence:{role:"ROOF"},score:.849999}]}).event).toBe("AMBIGUOUS"));
  it("rejects close competing candidate",()=>expect(decideNamingEvent({predecessorIds:["A"],successorIds:["B"],candidates:[{successorId:"B",evidence:{},score:.95},{successorId:"C",evidence:{},score:.86}]}).event).toBe("AMBIGUOUS"));
 });
 describe("03 lineage shape guards",()=>{
  it("does not call one-to-one a split",()=>expect(decideNamingEvent({predecessorIds:["A"],successorIds:["B"],explicitLineage:"SPLIT"}).event).toBe("AMBIGUOUS"));
  it("does not call one-to-one a merge",()=>expect(decideNamingEvent({predecessorIds:["A"],successorIds:["B"],explicitLineage:"MERGE"}).event).toBe("AMBIGUOUS"));
 });
 describe("04 ledger ordering",()=>{
  const accepted=()=>decideNamingEvent({predecessorIds:["A"],successorIds:["B"],candidates:[{successorId:"B",evidence:{semanticId:"A"},score:.99}]});
  it("accepts contiguous sequence",()=>{const l=new ArkiNamingLedger();l.append({recordId:"1",sequence:1,recordedAt:"t1",decision:accepted(),evidence:[]});l.append({recordId:"2",sequence:2,recordedAt:"t2",decision:accepted(),evidence:[]});expect(l.snapshot().map(x=>x.sequence)).toEqual([1,2])});
  it("rejects repeated sequence through duplicate-independent id",()=>{const l=new ArkiNamingLedger();l.append({recordId:"1",sequence:1,recordedAt:"t1",decision:accepted(),evidence:[]});expect(()=>l.append({recordId:"2",sequence:1,recordedAt:"t2",decision:accepted(),evidence:[]})).toThrow("ARKI_NAMING_SEQUENCE_VIOLATION")});
 });
 describe("05 deterministic decision replay",()=>{
  it("same input yields same decision",()=>{const x={predecessorIds:["A"],successorIds:["B"],candidates:[{successorId:"B",evidence:{role:"ROOF"},score:.97}]} as const;expect(decideNamingEvent(x)).toEqual(decideNamingEvent(x))});
 });
 describe("06 tamper/fail closed",()=>{
  it("ambiguous cannot be committed",()=>{const d=decideNamingEvent({predecessorIds:["A"],successorIds:["B"]});expect(()=>assertNamingCommitAllowed(d)).toThrow("ARKI_NAMING_FAIL_CLOSED")});
 });
});
