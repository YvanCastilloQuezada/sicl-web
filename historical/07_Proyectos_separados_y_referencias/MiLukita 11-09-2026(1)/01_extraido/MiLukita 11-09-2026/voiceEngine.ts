import { transcribeAudio, type TranscriptionResponse, type TranscriptionError } from "./_core/voiceTranscription";
import { normalizeVoiceTranscript } from "../shared/voiceProductive";

export type FieldAudioTranscription = TranscriptionResponse | TranscriptionError;

export async function transcribeFieldAudio(input: { audioUrl: string; language?: string; prompt?: string }): Promise<FieldAudioTranscription> {
  let parsed: URL;
  try {
    parsed = new URL(input.audioUrl);
  } catch {
    return { error: "Audio URL is invalid", code: "INVALID_FORMAT" };
  }
  if (parsed.protocol !== "https:") return { error: "Audio URL must use HTTPS", code: "INVALID_FORMAT" };
  return transcribeAudio({
    audioUrl: parsed.toString(),
    language: input.language,
    prompt: input.prompt ? normalizeVoiceTranscript(input.prompt) : undefined,
  });
}
