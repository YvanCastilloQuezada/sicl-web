import {describe,expect,it} from "vitest";
import {ArkiNamingLedger,decideNamingEvent,replayNamingLedger,serializeNamingLedger} from "../shared/arkiPersistentNaming";
const d=()=>decideNamingEvent({predecessorIds:["A"],successorIds:["B"],candidates:[{successorId:"B",evidence:{semanticId:"A"},score:.99}]});
const r=(id:string,sequence:number)=>({recordId:id,sequence,recordedAt:"2026-10-05T10:55:00-05:00",decision:d(),evidence:[{semanticId:"A",featureId:"F"}]});
describe("AGK DELTA-005 P7 persistence and replay",()=>{
 it("serializes canonical schema",()=>{const l=new ArkiNamingLedger();l.append(r("R1",1));expect(JSON.parse(serializeNamingLedger(l)).schema).toBe("ARKI_NAMING_LEDGER_V1")});
 it("round trips one record",()=>{const l=new ArkiNamingLedger();l.append(r("R1",1));expect(replayNamingLedger(serializeNamingLedger(l)).snapshot()).toEqual(l.snapshot())});
 it("round trips ordered multi-record ledger",()=>{const l=new ArkiNamingLedger();l.append(r("R1",1));l.append(r("R2",2));expect(replayNamingLedger(serializeNamingLedger(l)).snapshot().map(x=>x.sequence)).toEqual([1,2])});
 it("replay is deterministic",()=>{const l=new ArkiNamingLedger();l.append(r("R1",1));const a=serializeNamingLedger(replayNamingLedger(serializeNamingLedger(l)));const b=serializeNamingLedger(replayNamingLedger(serializeNamingLedger(l)));expect(a).toBe(b)});
 it("rejects malformed JSON",()=>expect(()=>replayNamingLedger("{")).toThrow("ARKI_NAMING_PERSISTENCE_INVALID_JSON"));
 it("rejects wrong schema",()=>expect(()=>replayNamingLedger(JSON.stringify({schema:"OTHER",records:[]}))).toThrow("ARKI_NAMING_PERSISTENCE_INVALID_SCHEMA"));
 it("rejects missing records array",()=>expect(()=>replayNamingLedger(JSON.stringify({schema:"ARKI_NAMING_LEDGER_V1"}))).toThrow("ARKI_NAMING_PERSISTENCE_INVALID_SCHEMA"));
 it("rejects sequence gaps during replay",()=>expect(()=>replayNamingLedger(JSON.stringify({schema:"ARKI_NAMING_LEDGER_V1",records:[r("R2",2)]}))).toThrow("ARKI_NAMING_SEQUENCE_VIOLATION"));
 it("rejects duplicate record IDs during replay",()=>expect(()=>replayNamingLedger(JSON.stringify({schema:"ARKI_NAMING_LEDGER_V1",records:[r("R1",1),r("R1",2)]}))).toThrow("ARKI_NAMING_DUPLICATE_RECORD"));
 it("rejects ambiguous decisions during replay",()=>{const x={...r("R1",1),decision:decideNamingEvent({predecessorIds:["A"],successorIds:["B"]})};expect(()=>replayNamingLedger(JSON.stringify({schema:"ARKI_NAMING_LEDGER_V1",records:[x]}))).toThrow("ARKI_NAMING_FAIL_CLOSED")});
 it("rejects blank record identity",()=>{const x={...r("",1)};expect(()=>replayNamingLedger(JSON.stringify({schema:"ARKI_NAMING_LEDGER_V1",records:[x]}))).toThrow("ARKI_NAMING_PERSISTENCE_INVALID_RECORD")});
 it("preserves evidence payload",()=>{const l=new ArkiNamingLedger();l.append(r("R1",1));expect(replayNamingLedger(serializeNamingLedger(l)).snapshot()[0].evidence[0]).toEqual({semanticId:"A",featureId:"F"})});
});
