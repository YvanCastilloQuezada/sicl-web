export const LUKITA_SCRIPT_TRIGGERS = ["EVENT_START", "EVENT_CLOSING", "DRAW_STARTED", "RESULT_VERIFIED", "TRANSITION", "INTERACTION"] as const;
export type LukitaScriptTrigger = (typeof LUKITA_SCRIPT_TRIGGERS)[number];

export type LukitaScriptRecord = {
  trigger: LukitaScriptTrigger;
  locale: "es-PE";
  text: string;
  fallback: string;
  enabled: boolean;
  version: number;
  updatedAt: string;
  source: "deterministic_template" | "operator_edit" | "ai_generated";
  category: string;
  tags: string[];
  canChangeOfficialState: false;
};

export const DEFAULT_LUKITA_SCRIPTS: Record<LukitaScriptTrigger, LukitaScriptRecord> = {
  EVENT_START: { trigger: "EVENT_START", locale: "es-PE", text: "Comienza {game}. Revisa las reglas y participa con créditos virtuales.", fallback: "Bienvenidos a MiLukita Eventos. El servidor conserva la autoridad.", enabled: true, version: 1, updatedAt: "2026-08-26T00:00:00.000Z", source: "deterministic_template", category: "general", tags: [], canChangeOfficialState: false },
  EVENT_CLOSING: { trigger: "EVENT_CLOSING", locale: "es-PE", text: "La participación de {game} está por cerrar.", fallback: "La ronda está por cerrar. Revisa el estado oficial en pantalla.", enabled: true, version: 1, updatedAt: "2026-08-26T00:00:00.000Z", source: "deterministic_template", category: "general", tags: [], canChangeOfficialState: false },
  DRAW_STARTED: { trigger: "DRAW_STARTED", locale: "es-PE", text: "El sorteo virtual ha comenzado. El resultado lo determina el motor autorizado.", fallback: "El sorteo está en curso. Espera el resultado oficial.", enabled: true, version: 1, updatedAt: "2026-08-26T00:00:00.000Z", source: "deterministic_template", category: "general", tags: [], canChangeOfficialState: false },
  RESULT_VERIFIED: { trigger: "RESULT_VERIFIED", locale: "es-PE", text: "El resultado ha sido verificado. Puedes consultar su evidencia pública.", fallback: "El resultado está disponible en el verificador público.", enabled: true, version: 1, updatedAt: "2026-08-26T00:00:00.000Z", source: "deterministic_template", category: "general", tags: [], canChangeOfficialState: false },
  TRANSITION: { trigger: "TRANSITION", locale: "es-PE", text: "Pasamos al siguiente evento del programa.", fallback: "En breve continuaremos con el siguiente evento.", enabled: true, version: 1, updatedAt: "2026-08-26T00:00:00.000Z", source: "deterministic_template", category: "general", tags: [], canChangeOfficialState: false },
  INTERACTION: { trigger: "INTERACTION", locale: "es-PE", text: "Ahora puedes responder la interacción de entretenimiento.", fallback: "Puedes seguir la interacción desde la pantalla secundaria.", enabled: true, version: 1, updatedAt: "2026-08-26T00:00:00.000Z", source: "deterministic_template", category: "general", tags: [], canChangeOfficialState: false },
};

export function renderLukitaScript(record: LukitaScriptRecord, game: string): string {
  const text = record.enabled ? record.text : record.fallback;
  return text.replaceAll("{game}", game.trim() || "el evento");
}

export function getLukitaFallback(trigger: LukitaScriptTrigger, game: string): string {
  return renderLukitaScript(DEFAULT_LUKITA_SCRIPTS[trigger], game);
}

export function normalizeLukitaEdit(record: LukitaScriptRecord, text: string, fallback: string, updatedAt = new Date().toISOString(), source: LukitaScriptRecord["source"] = "operator_edit"): LukitaScriptRecord {
  return { ...record, text: text.trim().slice(0, 280) || record.text, fallback: fallback.trim().slice(0, 280) || record.fallback, version: record.version + 1, updatedAt, source, canChangeOfficialState: false };
}

export function isLukitaScriptTrigger(value: string): value is LukitaScriptTrigger {
  return (LUKITA_SCRIPT_TRIGGERS as readonly string[]).includes(value);
}
