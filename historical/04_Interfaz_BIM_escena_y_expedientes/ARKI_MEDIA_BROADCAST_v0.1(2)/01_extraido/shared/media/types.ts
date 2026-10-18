export type MediaMode = "REALTIME" | "OFFLINE";
export type LanguageCode = "es"|"en"|"pt"|"fr"|"de"|"it"|"zh"|"ja";
export type EpistemicDeliveryState =
  | "DOCUMENTED"|"CODE_EVIDENCE"|"RUNTIME_EVIDENCE"|"VERIFIED"
  | "PROFESSIONAL_VALIDATION_REQUIRED"|"UNKNOWN"|"PROPOSAL";

export interface SourceClaim {
  claimId: string;
  text: string;
  state: EpistemicDeliveryState;
  provenanceIds: string[];
  projectEntityIds?: string[];
}

export interface SpeechSegment {
  id: string;
  language: LanguageCode;
  text: string;
  ssml?: string;
  claims: SourceClaim[];
  startMs?: number;
  durationMs?: number;
}

export interface AudioTrack {
  id: string;
  language: LanguageCode;
  codec: "PCM"|"AAC"|"OPUS";
  uri: string;
  sampleRateHz: number;
  channels: number;
  durationMs: number;
  provenanceIds: string[];
}

export interface CaptionCue {
  startMs: number;
  endMs: number;
  text: string;
}
export interface CaptionTrack {
  language: LanguageCode;
  format: "WEBVTT"|"TTML"|"SRT";
  cues: CaptionCue[];
}

export interface VideoProfile {
  codec: "H264"|"H265"|"AV1";
  width: number; height: number;
  fps: number;
  bitrateKbps: number;
  hdr?: "SDR"|"HDR10"|"HLG";
}

export interface MediaMaster {
  masterId: string;
  projectRevisionId?: string;
  mode: MediaMode;
  video: VideoProfile;
  audio: AudioTrack[];
  captions: CaptionTrack[];
  provenanceIds: string[];
  humanApprovedForDistribution: boolean;
}
