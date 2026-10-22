import {describe,expect,it} from "vitest";
import {ArkiNamingLedger,ArkiNamingTransactionManager,decideNamingEvent} from "../shared/arkiPersistentNaming";
const d=()=>decideNamingEvent({predecessorIds:["A"],successorIds:["B"],candidates:[{successorId:"B",evidence:{semanticId:"A"},score:.99}]});
const r=(id:string,sequence:number)=>({recordId:id,sequence,recordedAt:"t",decision:d(),evidence:[]});
describe("AGK DELTA-005 P6 transaction rollback atomicity",()=>{
 it("staging does not mutate ledger",()=>{const l=new ArkiNamingLedger(),m=new ArkiNamingTransactionManager(l);m.begin("T");m.stage(r("1",1));expect(l.snapshot()).toHaveLength(0)});
 it("commit publishes staged records",()=>{const l=new ArkiNamingLedger(),m=new ArkiNamingTransactionManager(l);m.begin("T");m.stage(r("1",1));m.commit();expect(l.snapshot()).toHaveLength(1)});
 it("rollback publishes nothing",()=>{const l=new ArkiNamingLedger(),m=new ArkiNamingTransactionManager(l);m.begin("T");m.stage(r("1",1));m.rollback();expect(l.snapshot()).toHaveLength(0)});
 it("ambiguous cannot be staged",()=>{const l=new ArkiNamingLedger(),m=new ArkiNamingTransactionManager(l);m.begin("T");const x=decideNamingEvent({predecessorIds:["A"],successorIds:["B"]});expect(()=>m.stage({recordId:"1",sequence:1,recordedAt:"t",decision:x,evidence:[]})).toThrow("ARKI_NAMING_FAIL_CLOSED")});
 it("nested transaction is rejected",()=>{const m=new ArkiNamingTransactionManager(new ArkiNamingLedger());m.begin("T1");expect(()=>m.begin("T2")).toThrow("ARKI_NAMING_TRANSACTION_ALREADY_OPEN")});
 it("commit without transaction is rejected",()=>expect(()=>new ArkiNamingTransactionManager(new ArkiNamingLedger()).commit()).toThrow("ARKI_NAMING_NO_OPEN_TRANSACTION"));
 it("rollback without transaction is rejected",()=>expect(()=>new ArkiNamingTransactionManager(new ArkiNamingLedger()).rollback()).toThrow("ARKI_NAMING_NO_OPEN_TRANSACTION"));
 it("sequence gap prevents publication",()=>{const l=new ArkiNamingLedger(),m=new ArkiNamingTransactionManager(l);m.begin("T");m.stage(r("2",2));expect(()=>m.commit()).toThrow("ARKI_NAMING_SEQUENCE_VIOLATION");expect(l.snapshot()).toHaveLength(0)});
 it("stale base is rejected",()=>{const l=new ArkiNamingLedger(),m=new ArkiNamingTransactionManager(l);m.begin("T");m.stage(r("2",2));l.append(r("1",1));expect(()=>m.commit()).toThrow("ARKI_NAMING_TRANSACTION_STALE_BASE")});
 it("duplicate staged id is rejected",()=>{const m=new ArkiNamingTransactionManager(new ArkiNamingLedger());m.begin("T");m.stage(r("1",1));expect(()=>m.stage(r("1",2))).toThrow("ARKI_NAMING_DUPLICATE_RECORD")});
});
