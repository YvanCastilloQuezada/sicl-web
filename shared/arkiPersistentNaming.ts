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
