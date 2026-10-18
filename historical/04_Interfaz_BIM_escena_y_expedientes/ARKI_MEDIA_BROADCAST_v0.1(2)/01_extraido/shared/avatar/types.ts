import type { LanguageCode, SpeechSegment } from "../media/types";

export type AvatarState = "IDLE"|"LISTENING"|"SPEAKING"|"EXPLAINING"|"WARNING"|"UNKNOWN";
export type GestureKind =
  | "IDLE"|"BEAT"|"POINT"|"PRESENT"|"COMPARE_LEFT_RIGHT"|"CAUTION"
  | "NOD"|"HEAD_SHAKE"|"GAZE_TARGET"|"CUSTOM";

export interface VisemeCue { atMs:number; durationMs:number; viseme:string; weight:number; }
export interface GestureCue {
  id:string; kind:GestureKind; startMs:number; durationMs:number;
  targetEntityId?:string; intensity?:number;
}
export interface FacialCue {
  startMs:number; durationMs:number;
  expression:"NEUTRAL"|"FOCUS"|"EMPHASIS"|"CONCERN"|"POSITIVE";
  intensity:number;
}
export interface AvatarPerformancePlan {
  performanceId:string;
  language:LanguageCode;
  speech:SpeechSegment[];
  visemes:VisemeCue[];
  gestures:GestureCue[];
  facial:FacialCue[];
  state:AvatarState;
  sourceRevisionId?:string;
  generatedFromCanonicalReadModel:boolean;
  canMutateProjectState:false;
}
