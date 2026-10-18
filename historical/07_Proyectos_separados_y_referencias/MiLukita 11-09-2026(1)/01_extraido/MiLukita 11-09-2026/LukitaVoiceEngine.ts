export type LukitaEmotion = "NEUTRAL" | "WARM" | "EXCITED" | "CALM";
export type PreviewAudio = { status: "PREVIEW_ONLY"; text: string; emotion: LukitaEmotion; testOnly: true; productionEnabled: false };
export type LipSyncPreview = { status: "PREVIEW_ONLY"; cues: Array<{ atMs: number; phoneme: string }>; testOnly: true; productionEnabled: false };

/** Adaptador seguro de preproducción: no llama a proveedores ni genera audio real. */
export async function speak(text: string, emotion: LukitaEmotion = "NEUTRAL"): Promise<PreviewAudio> {
  const normalized = text.trim().slice(0, 500);
  if (!normalized) throw new Error("El guion de prueba no puede estar vacío.");
  return { status: "PREVIEW_ONLY", text: normalized, emotion, testOnly: true, productionEnabled: false };
}

/** Genera únicamente cues aproximados para validar la interfaz; no es lip-sync final. */
export async function generateLipSync(audio: PreviewAudio): Promise<LipSyncPreview> {
  const cues = Array.from(audio.text).filter((character) => /[a-záéíóúñ]/i.test(character)).map((character, index) => ({ atMs: index * 80, phoneme: character.toLowerCase() })).slice(0, 120);
  return { status: "PREVIEW_ONLY", cues, testOnly: true, productionEnabled: false };
}

export async function present(text: string, emotion: LukitaEmotion = "NEUTRAL") {
  const audio = await speak(text, emotion);
  const lipSync = await generateLipSync(audio);
  return { audio, lipSync, integration: "PREPRODUCTION_PREVIEW" as const };
}
