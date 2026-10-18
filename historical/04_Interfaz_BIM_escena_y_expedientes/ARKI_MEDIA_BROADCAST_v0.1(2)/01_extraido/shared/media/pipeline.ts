import type { MediaMaster, SpeechSegment, LanguageCode } from "./types";
import type { AvatarPerformancePlan } from "../avatar/types";

export interface SpeechProvider {
  synthesize(segment:SpeechSegment):Promise<{audioUri:string; durationMs:number; visemes?:{atMs:number;durationMs:number;viseme:string;weight:number}[]}>;
}
export interface TranslationProvider {
  translate(segment:SpeechSegment,target:LanguageCode):Promise<SpeechSegment>;
}
export interface RenderProvider {
  render(performance:AvatarPerformancePlan):Promise<{videoUri:string}>;
}
export interface EncodeProvider {
  encode(inputUri:string, master:MediaMaster):Promise<{encodedUri:string}>;
}

export class MediaOrchestrator {
  constructor(
    private speech:SpeechProvider,
    private translate:TranslationProvider,
    private render:RenderProvider,
    private encode:EncodeProvider
  ) {}

  // Deliberately orchestrates derived media only. It has no Project State writer.
  async localize(source:SpeechSegment[], targets:LanguageCode[]):Promise<Record<string,SpeechSegment[]>> {
    const out:Record<string,SpeechSegment[]>={};
    for (const lang of targets) {
      out[lang]=[];
      for (const seg of source) out[lang].push(seg.language===lang ? structuredClone(seg) : await this.translate.translate(seg,lang));
    }
    return out;
  }
}
