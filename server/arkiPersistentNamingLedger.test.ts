import { describe, expect, it } from "vitest";
import { ArkiNamingLedger, decideNamingEvent } from "../shared/arkiPersistentNaming";

describe("ARKI naming decision ledger integration",()=>{
 const preserve=()=>decideNamingEvent({predecessorIds:["SEM:ROOF"],successorIds:["BREP:F1"],candidates:[{successorId:"BREP:F1",evidence:{semanticId:"SEM:ROOF",featureId:"F:BOX",role:"ROOF"},score:.98}]});
 it("records accepted decisions with evidence",()=>{
  const l=new ArkiNamingLedger(); l.append({recordId:"N-1",sequence:1,recordedAt:"2026-10-05T03:12:21-05:00",decision:preserve(),evidence:[{semanticId:"SEM:ROOF",featureId:"F:BOX",role:"ROOF"}]});
  expect(l.snapshot()).toHaveLength(1);
 });
 it("rejects ambiguous decisions",()=>{
  const l=new ArkiNamingLedger(); const d=decideNamingEvent({predecessorIds:["A"],successorIds:["B"],candidates:[{successorId:"B",evidence:{geometrySignature:"near"},score:.7}]});
  expect(()=>l.append({recordId:"N-1",sequence:1,recordedAt:"x",decision:d,evidence:[]})).toThrow("ARKI_NAMING_FAIL_CLOSED");
 });
 it("rejects duplicate record ids",()=>{
  const l=new ArkiNamingLedger(),r={recordId:"N-1",sequence:1,recordedAt:"x",decision:preserve(),evidence:[]};
  l.append(r); expect(()=>l.append({...r,sequence:2})).toThrow("ARKI_NAMING_DUPLICATE_RECORD");
 });
 it("rejects sequence gaps",()=>{
  const l=new ArkiNamingLedger();
  expect(()=>l.append({recordId:"N-2",sequence:2,recordedAt:"x",decision:preserve(),evidence:[]})).toThrow("ARKI_NAMING_SEQUENCE_VIOLATION");
 });
 it("returns an immutable snapshot boundary",()=>{
  const l=new ArkiNamingLedger();l.append({recordId:"N-1",sequence:1,recordedAt:"x",decision:preserve(),evidence:[]});
  expect(Object.isFrozen(l.snapshot())).toBe(true);
 });
});
