import { describe, expect, it } from "vitest";
import { buildVoiceFallback, normalizeVoiceTranscript, ttsTextForIntent, voiceCannotAuthorize, VOICE_BOUNDARIES } from "./voiceProductive";

describe("Fase E.2 · Voice Productivo", () => {
  it("normaliza y limita transcripciones sin reemplazar su contenido", () => {
    const text = "  ¿Dónde está la comisaría?  ";
    expect(normalizeVoiceTranscript(text)).toBe(text.trim());
    expect(normalizeVoiceTranscript("x".repeat(700))).toHaveLength(500);
  });

  it("mantiene fallback táctil y no conserva audio cuando voz no está disponible", () => {
    expect(buildVoiceFallback()).toEqual({ state: "FALLBACK_TOUCH", reason: "VOICE_UNAVAILABLE", manualFallback: true, audioStored: false });
  });

  it("limita TTS a una respuesta corta y mantiene la frontera de autoridad", () => {
    expect(ttsTextForIntent("  LUKA confirma la acción.  ")).toBe("LUKA confirma la acción.");
    expect(voiceCannotAuthorize()).toBe(false);
    expect(VOICE_BOUNDARIES).toContain("VOICE_REQUIRES_CAPABILITY_GATE");
    expect(VOICE_BOUNDARIES).toContain("VOICE_CANNOT_PUBLISH");
  });
});
