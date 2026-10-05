export const ARKI_NAMING_EVENTS = [
  "PRESERVE","REMAP","SPLIT","MERGE","NEW","DELETED","AMBIGUOUS",
] as const;
export type ArkiNamingEvent = typeof ARKI_NAMING_EVENTS[number];

export type ArkiSemanticId = string;
export type ArkiFeatureId = string;

export interface NamingEvidence {
  semanticId?: ArkiSemanticId;
  featureId?: ArkiFeatureId;
  role?: string;
  context?: readonly string[];
  operationHistory?: readonly string[];
  geometrySignature?: string;
  topologySignature?: string;
  tolerance?: number;
}

export interface NamingCandidate {
  successorId: string;
  evidence: NamingEvidence;
  score: number;
}

export interface NamingDecision {
  event: ArkiNamingEvent;
  predecessorIds: readonly string[];
  successorIds: readonly string[];
  confidence: number;
  committed: boolean;
  reason: string;
}

const clamp=(v:number)=>Math.max(0,Math.min(1,v));

export function decideNamingEvent(input:{
  predecessorIds: readonly string[];
  successorIds: readonly string[];
  candidates?: readonly NamingCandidate[];
  explicitLineage?: "SPLIT"|"MERGE";
  confidenceThreshold?: number;
}): NamingDecision {
  const p=[...input.predecessorIds], s=[...input.successorIds];
  const threshold=input.confidenceThreshold ?? 0.85;
  if(input.explicitLineage==="SPLIT" && p.length===1 && s.length>1)
    return {event:"SPLIT",predecessorIds:p,successorIds:s,confidence:1,committed:true,reason:"explicit ARKI lineage"};
  if(input.explicitLineage==="MERGE" && p.length>1 && s.length===1)
    return {event:"MERGE",predecessorIds:p,successorIds:s,confidence:1,committed:true,reason:"explicit ARKI lineage"};
  if(p.length===0 && s.length>0)
    return {event:"NEW",predecessorIds:p,successorIds:s,confidence:1,committed:true,reason:"no predecessor"};
  if(p.length>0 && s.length===0)
    return {event:"DELETED",predecessorIds:p,successorIds:s,confidence:1,committed:true,reason:"no successor"};
  const ranked=[...(input.candidates??[])].sort((a,b)=>b.score-a.score);
  if(p.length===1 && s.length===1 && ranked.length){
    const best=clamp(ranked[0].score), second=ranked[1]?.score ?? -1;
    if(best>=threshold && best-second>=0.1)
      return {event:"PRESERVE",predecessorIds:p,successorIds:s,confidence:best,committed:true,reason:"unique high-confidence evidence"};
  }
  return {event:"AMBIGUOUS",predecessorIds:p,successorIds:s,confidence:ranked[0]?clamp(ranked[0].score):0,committed:false,reason:"insufficient or competing evidence; fail closed"};
}

export function assertNamingCommitAllowed(decision:NamingDecision): void {
  if(decision.event==="AMBIGUOUS" || !decision.committed)
    throw new Error("ARKI_NAMING_FAIL_CLOSED");
}


export interface NamingLedgerRecord {
  recordId: string;
  sequence: number;
  recordedAt: string;
  decision: NamingDecision;
  evidence: readonly NamingEvidence[];
}

export class ArkiNamingLedger {
  private readonly records: NamingLedgerRecord[] = [];
  append(record: NamingLedgerRecord): NamingLedgerRecord {
    assertNamingCommitAllowed(record.decision);
    if (this.records.some((r) => r.recordId === record.recordId))
      throw new Error("ARKI_NAMING_DUPLICATE_RECORD");
    const last=this.records.at(-1);
    if (last && record.sequence !== last.sequence + 1)
      throw new Error("ARKI_NAMING_SEQUENCE_VIOLATION");
    if (!last && record.sequence !== 1)
      throw new Error("ARKI_NAMING_SEQUENCE_VIOLATION");
    const frozen=Object.freeze({...record,decision:Object.freeze({...record.decision}),evidence:Object.freeze([...record.evidence])});
    this.records.push(frozen);
    return frozen;
  }
  snapshot(): readonly NamingLedgerRecord[] {
    return Object.freeze([...this.records]);
  }
}


export interface AgkGeometryEvidenceEnvelope {
  schema: "ARKI_AGK_GEOMETRY_EVIDENCE_V1";
  authority: "AGK_OCCT";
  operationId: string;
  revision: number;
  producedAt: string;
  predecessors: readonly string[];
  successors: readonly string[];
  featureId?: string;
  role?: string;
  operationHistory?: readonly string[];
  geometrySignatures?: readonly string[];
  topologySignatures?: readonly string[];
}

export function validateAgkGeometryEvidenceEnvelope(e: AgkGeometryEvidenceEnvelope): void {
  if (e.schema !== "ARKI_AGK_GEOMETRY_EVIDENCE_V1" || e.authority !== "AGK_OCCT")
    throw new Error("ARKI_NAMING_UNTRUSTED_GEOMETRY_EVIDENCE");
  if (!e.operationId.trim() || !Number.isInteger(e.revision) || e.revision < 1 || !e.producedAt.trim())
    throw new Error("ARKI_NAMING_INVALID_GEOMETRY_EVIDENCE");
  if (e.predecessors.length === 0 && e.successors.length === 0)
    throw new Error("ARKI_NAMING_EMPTY_GEOMETRY_EVIDENCE");
}

export function evidenceFromAgkEnvelope(e: AgkGeometryEvidenceEnvelope): NamingEvidence {
  validateAgkGeometryEvidenceEnvelope(e);
  return {
    featureId:e.featureId,
    role:e.role,
    operationHistory:e.operationHistory,
    geometrySignature:e.geometrySignatures?.join("|"),
    topologySignature:e.topologySignatures?.join("|"),
  };
}


export interface NamingTransaction {
  transactionId: string;
  baseSequence: number;
  staged: readonly NamingLedgerRecord[];
  state: "OPEN" | "COMMITTED" | "ROLLED_BACK";
}

export class ArkiNamingTransactionManager {
  private tx?: NamingTransaction;
  constructor(private readonly ledger: ArkiNamingLedger) {}
  begin(transactionId:string): NamingTransaction {
    if(this.tx?.state==="OPEN") throw new Error("ARKI_NAMING_TRANSACTION_ALREADY_OPEN");
    this.tx={transactionId,baseSequence:this.ledger.snapshot().length,staged:[],state:"OPEN"}; return this.tx;
  }
  stage(record:NamingLedgerRecord): void {
    if(!this.tx || this.tx.state!=="OPEN") throw new Error("ARKI_NAMING_NO_OPEN_TRANSACTION");
    assertNamingCommitAllowed(record.decision);
    if(this.tx.staged.some(r=>r.recordId===record.recordId)) throw new Error("ARKI_NAMING_DUPLICATE_RECORD");
    this.tx={...this.tx,staged:[...this.tx.staged,record]};
  }
  commit(): readonly NamingLedgerRecord[] {
    if(!this.tx || this.tx.state!=="OPEN") throw new Error("ARKI_NAMING_NO_OPEN_TRANSACTION");
    const expected=this.ledger.snapshot().length+1;
    if(this.tx.baseSequence!==this.ledger.snapshot().length) throw new Error("ARKI_NAMING_TRANSACTION_STALE_BASE");
    this.tx.staged.forEach((r,i)=>{if(r.sequence!==expected+i) throw new Error("ARKI_NAMING_SEQUENCE_VIOLATION")});
    const staged=this.tx.staged;
    for(const r of staged) this.ledger.append(r);
    this.tx={...this.tx,state:"COMMITTED"};
    return staged;
  }
  rollback(): void {
    if(!this.tx || this.tx.state!=="OPEN") throw new Error("ARKI_NAMING_NO_OPEN_TRANSACTION");
    this.tx={...this.tx,staged:[],state:"ROLLED_BACK"};
  }
  current(): NamingTransaction|undefined { return this.tx ? {...this.tx,staged:[...this.tx.staged]} : undefined; }
}


export interface NamingLedgerSnapshotV1 {
  schema: "ARKI_NAMING_LEDGER_V1";
  records: readonly NamingLedgerRecord[];
}

export function serializeNamingLedger(ledger: ArkiNamingLedger): string {
  return JSON.stringify({schema:"ARKI_NAMING_LEDGER_V1",records:ledger.snapshot()} satisfies NamingLedgerSnapshotV1);
}

export function replayNamingLedger(serialized:string): ArkiNamingLedger {
  let parsed: unknown;
  try { parsed=JSON.parse(serialized); } catch { throw new Error("ARKI_NAMING_PERSISTENCE_INVALID_JSON"); }
  if(!parsed || typeof parsed!=="object") throw new Error("ARKI_NAMING_PERSISTENCE_INVALID_SCHEMA");
  const x=parsed as {schema?:unknown;records?:unknown};
  if(x.schema!=="ARKI_NAMING_LEDGER_V1" || !Array.isArray(x.records))
    throw new Error("ARKI_NAMING_PERSISTENCE_INVALID_SCHEMA");
  const ledger=new ArkiNamingLedger();
  for(const raw of x.records){
    if(!raw || typeof raw!=="object") throw new Error("ARKI_NAMING_PERSISTENCE_INVALID_RECORD");
    const r=raw as NamingLedgerRecord;
    if(typeof r.recordId!=="string" || !r.recordId.trim() || !Number.isInteger(r.sequence) ||
       typeof r.recordedAt!=="string" || !r.recordedAt.trim() || !r.decision || !Array.isArray(r.evidence))
      throw new Error("ARKI_NAMING_PERSISTENCE_INVALID_RECORD");
    ledger.append(r);
  }
  return ledger;
}
