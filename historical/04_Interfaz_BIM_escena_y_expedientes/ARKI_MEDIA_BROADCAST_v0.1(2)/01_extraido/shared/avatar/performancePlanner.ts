import type { AvatarPerformancePlan, GestureCue } from "./types";
import type { SpeechSegment } from "../media/types";

const EMPHASIS=/\b(importante|important|attention|atención|warning|advertencia|critical|crítico)\b/i;
const COMPARE=/\b(compar|versus|vs\.?|difference|diferencia)\b/i;

export function planBoundedGestures(speech: SpeechSegment[]): GestureCue[] {
  const out:GestureCue[]=[];
  let cursor=0;
  for (const s of speech) {
    const duration=s.durationMs ?? Math.max(1200, s.text.length*45);
    if (EMPHASIS.test(s.text)) out.push({id:`g-${s.id}-caution`,kind:"CAUTION",startMs:cursor,durationMs:Math.min(1600,duration),intensity:.65});
    else if (COMPARE.test(s.text)) out.push({id:`g-${s.id}-compare`,kind:"COMPARE_LEFT_RIGHT",startMs:cursor,durationMs:Math.min(1800,duration),intensity:.55});
    else out.push({id:`g-${s.id}-beat`,kind:"BEAT",startMs:cursor,durationMs:Math.min(900,duration),intensity:.35});
    cursor+=duration;
  }
  return out;
}

export function createPerformancePlan(
  performanceId:string, speech:SpeechSegment[], sourceRevisionId?:string
):AvatarPerformancePlan {
  if (!speech.length) throw new Error("EMPTY_SPEECH");
  const language=speech[0].language;
  if (speech.some(s=>s.language!==language)) throw new Error("MIXED_LANGUAGE_PERFORMANCE");
  return {
    performanceId, language, speech,
    visemes:[], // provider adapter fills this; empty is not fake lip-sync evidence
    gestures:planBoundedGestures(speech),
    facial:[], state:"SPEAKING", sourceRevisionId,
    generatedFromCanonicalReadModel:Boolean(sourceRevisionId),
    canMutateProjectState:false
  };
}
