export const VOICE_AUDIO_MAX_BYTES = 16 * 1024 * 1024;
export const VOICE_TRANSCRIPT_MAX_CHARS = 500;

export type VoiceProductiveState = "IDLE" | "LISTENING" | "TRANSCRIBING" | "THINKING" | "SPEAKING" | "FALLBACK_TOUCH";
export type VoiceBoundary = "VOICE_IS_INTENT_ONLY" | "VOICE_REQUIRES_CAPABILITY_GATE" | "VOICE_CANNOT_PUBLISH" | "VOICE_CANNOT_VERIFY" | "VOICE_CANNOT_MODIFY_CORE";

export const VOICE_BOUNDARIES: readonly VoiceBoundary[] = [
  "VOICE_IS_INTENT_ONLY",
  "VOICE_REQUIRES_CAPABILITY_GATE",
  "VOICE_CANNOT_PUBLISH",
  "VOICE_CANNOT_VERIFY",
  "VOICE_CANNOT_MODIFY_CORE",
];

export function normalizeVoiceTranscript(text: string): string {
  return text.normalize("NFC").trim().slice(0, VOICE_TRANSCRIPT_MAX_CHARS);
}

export function buildVoiceFallback(reason = "VOICE_UNAVAILABLE") {
  return { state: "FALLBACK_TOUCH" as const, reason, manualFallback: true as const, audioStored: false as const };
}

export function ttsTextForIntent(text: string): string {
  return normalizeVoiceTranscript(text).slice(0, 280);
}

export function voiceCannotAuthorize(): false { return false; }
