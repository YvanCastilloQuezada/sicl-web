import {describe,expect,it} from "vitest";
import {
  ArkiNamingLedger, ArkiNamingTransactionManager, decideNamingEvent,
  evidenceFromAgkEnvelope, replayNamingLedger, serializeNamingLedger,
  validateAgkGeometryEvidenceEnvelope, type AgkGeometryEvidenceEnvelope
} from "../shared/arkiPersistentNaming";

const ts="2026-10-05T12:00:00-05:00";
const decision=(a:string,b:string,score=.99)=>decideNamingEvent({
  predecessorIds:[a],successorIds:[b],
  candidates:[{successorId:b,evidence:{semanticId:a,featureId:"F",role:"FACE"},score}]
});
const record=(n:number,a="SEM:A",b=`SEM:A:${n}`)=>({
  recordId:`P10-R${n}`,sequence:n,recordedAt:ts,decision:decision(a,b),
  evidence:[{semanticId:a,featureId:"F",role:"FACE",operationHistory:[`OP-${n}`],
    geometrySignature:`volume:${240-n}`,topologySignature:`faces:${6+n},edges:${24+n*2}`}]
});
const envelope=(over:Partial<AgkGeometryEvidenceEnvelope>={}):AgkGeometryEvidenceEnvelope=>({
  schema:"ARKI_AGK_GEOMETRY_EVIDENCE_V1",authority:"AGK_OCCT",operationId:"P10-OCCT-001",
  revision:1,producedAt:ts,predecessors:["SEM:BOX"],successors:["SEM:BOX_CUT"],
  featureId:"CUT-1",role:"SOLID",operationHistory:["BOX","CUT"],
  geometrySignatures:["volume:207.99999999999997"],topologySignatures:["faces:11,edges:48"],...over
});

describe("AGK DELTA-005 P10 adversarial stress regression",()=>{
  it("accepts the real P9 envelope shape",()=>expect(()=>validateAgkGeometryEvidenceEnvelope(envelope())).not.toThrow());
  it("converts trusted OCCT evidence without granting semantic authority",()=>{const e=evidenceFromAgkEnvelope(envelope());expect(e).toMatchObject({featureId:"CUT-1",role:"SOLID",geometrySignature:"volume:207.99999999999997",topologySignature:"faces:11,edges:48"});expect(e.semanticId).toBeUndefined()});
  it("rejects tampered geometry authority",()=>expect(()=>validateAgkGeometryEvidenceEnvelope({...envelope(),authority:"FOREIGN"} as any)).toThrow("ARKI_NAMING_UNTRUSTED_GEOMETRY_EVIDENCE"));
  it("rejects tampered schema",()=>expect(()=>validateAgkGeometryEvidenceEnvelope({...envelope(),schema:"V0"} as any)).toThrow("ARKI_NAMING_UNTRUSTED_GEOMETRY_EVIDENCE"));
  it("rejects zero revision",()=>expect(()=>validateAgkGeometryEvidenceEnvelope(envelope({revision:0}))).toThrow("ARKI_NAMING_INVALID_GEOMETRY_EVIDENCE"));
  it("rejects blank operation id",()=>expect(()=>validateAgkGeometryEvidenceEnvelope(envelope({operationId:" "}))).toThrow("ARKI_NAMING_INVALID_GEOMETRY_EVIDENCE"));
  it("rejects evidence with no predecessor or successor",()=>expect(()=>validateAgkGeometryEvidenceEnvelope(envelope({predecessors:[],successors:[]}))).toThrow("ARKI_NAMING_EMPTY_GEOMETRY_EVIDENCE"));
  it("fails closed below confidence threshold",()=>expect(decision("A","B",.849).event).toBe("AMBIGUOUS"));
  it("fails closed on competing near-equal candidates",()=>{const d=decideNamingEvent({predecessorIds:["A"],successorIds:["B"],candidates:[{successorId:"B",evidence:{},score:.99},{successorId:"C",evidence:{},score:.91}]});expect(d).toMatchObject({event:"AMBIGUOUS",committed:false})});
  it("preserves with adequate confidence margin",()=>expect(decision("A","B",.95)).toMatchObject({event:"PRESERVE",committed:true}));
  it("records explicit split lineage",()=>expect(decideNamingEvent({predecessorIds:["A"],successorIds:["B","C"],explicitLineage:"SPLIT"}).event).toBe("SPLIT"));
  it("records explicit merge lineage",()=>expect(decideNamingEvent({predecessorIds:["A","B"],successorIds:["C"],explicitLineage:"MERGE"}).event).toBe("MERGE"));
  it("records NEW as first-class event",()=>expect(decideNamingEvent({predecessorIds:[],successorIds:["A"]}).event).toBe("NEW"));
  it("records DELETED as first-class event",()=>expect(decideNamingEvent({predecessorIds:["A"],successorIds:[]}).event).toBe("DELETED"));
  it("stress commits 1000 contiguous records in one transaction",()=>{const l=new ArkiNamingLedger(),m=new ArkiNamingTransactionManager(l);m.begin("P10-1000");for(let i=1;i<=1000;i++)m.stage(record(i));m.commit();expect(l.snapshot()).toHaveLength(1000);expect(l.snapshot().at(-1)?.sequence).toBe(1000)});
  it("1000-record persistence replay is deterministic",()=>{const l=new ArkiNamingLedger();for(let i=1;i<=1000;i++)l.append(record(i));const a=serializeNamingLedger(l),b=serializeNamingLedger(replayNamingLedger(a));expect(b).toBe(a)});
  it("100 repeated replays preserve exact serialization",()=>{const l=new ArkiNamingLedger();for(let i=1;i<=25;i++)l.append(record(i));const base=serializeNamingLedger(l);let s=base;for(let i=0;i<100;i++)s=serializeNamingLedger(replayNamingLedger(s));expect(s).toBe(base)});
  it("tampered sequence in persisted stress ledger is rejected",()=>{const l=new ArkiNamingLedger();for(let i=1;i<=10;i++)l.append(record(i));const x=JSON.parse(serializeNamingLedger(l));x.records[7].sequence=99;expect(()=>replayNamingLedger(JSON.stringify(x))).toThrow("ARKI_NAMING_SEQUENCE_VIOLATION")});
  it("tampered ambiguous decision in persisted ledger is rejected",()=>{const l=new ArkiNamingLedger();l.append(record(1));const x=JSON.parse(serializeNamingLedger(l));x.records[0].decision={...x.records[0].decision,event:"AMBIGUOUS",committed:false};expect(()=>replayNamingLedger(JSON.stringify(x))).toThrow("ARKI_NAMING_FAIL_CLOSED")});
  it("stale 100-record competing writer publishes zero partial records",()=>{const l=new ArkiNamingLedger(),a=new ArkiNamingTransactionManager(l),b=new ArkiNamingTransactionManager(l);a.begin("WIN");b.begin("STALE");a.stage(record(1));a.commit();for(let i=1;i<=100;i++)b.stage({...record(i),recordId:`STALE-${i}`});expect(()=>b.commit()).toThrow("ARKI_NAMING_TRANSACTION_STALE_BASE");expect(l.snapshot().map(x=>x.recordId)).toEqual(["P10-R1"])});
  it("rollback after 500 staged records leaves ledger unchanged",()=>{const l=new ArkiNamingLedger(),m=new ArkiNamingTransactionManager(l);m.begin("ROLLBACK");for(let i=1;i<=500;i++)m.stage(record(i));m.rollback();expect(l.snapshot()).toHaveLength(0)});
  it("geometry perturbation remains evidence not identity",()=>{const a=evidenceFromAgkEnvelope(envelope({geometrySignatures:["volume:208.0"]})),b=evidenceFromAgkEnvelope(envelope({geometrySignatures:["volume:207.9999999"]}));expect(a.geometrySignature).not.toBe(b.geometrySignature);expect(a.semanticId).toBeUndefined();expect(b.semanticId).toBeUndefined()});
  it("rigid-coordinate-like signature change cannot create semantic id",()=>{const e=evidenceFromAgkEnvelope(envelope({geometrySignatures:["bbox:1000,2000,3000"],topologySignatures:["faces:11,edges:48"]}));expect(e.semanticId).toBeUndefined()});
  it("repeated operation history is preserved as provenance",()=>{const e=evidenceFromAgkEnvelope(envelope({operationHistory:Array.from({length:100},(_,i)=>`CUT-${i+1}`)}));expect(e.operationHistory).toHaveLength(100);expect(e.operationHistory?.at(-1)).toBe("CUT-100")});
  it("trusted envelope plus weak naming score still fails closed",()=>{const e=evidenceFromAgkEnvelope(envelope());const d=decideNamingEvent({predecessorIds:["SEM:BOX"],successorIds:["SEM:BOX_CUT"],candidates:[{successorId:"SEM:BOX_CUT",evidence:e,score:.5}]});expect(d).toMatchObject({event:"AMBIGUOUS",committed:false})});
});
