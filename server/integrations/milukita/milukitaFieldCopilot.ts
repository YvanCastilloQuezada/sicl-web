export const MILUQUITA_FIELD_INTENTS = [
  "START_SESSION",
  "GET_GPS",
  "CAPTURE_PHOTO",
  "RECORD_OBSERVATION",
  "SAVE_CAPTURE",
  "DISCARD_CAPTURE",
  "SEND_TO_REVIEW",
  "SYNC",
  "SHOW_STATUS",
  "FINISH_SESSION",
  "CANCEL_ACTION",
  "HELP",
] as const;

export type MiluquitaFieldIntent = (typeof MILUQUITA_FIELD_INTENTS)[number];

export const FIELD_COPILOT_STATES = [
  "IDLE",
  "SESSION_STARTING",
  "GPS_WAITING",
  "GPS_READY",
  "READY_TO_CAPTURE",
  "CAPTURING",
  "PHOTO_CAPTURED",
  "OBSERVATION_LISTENING",
  "OBSERVATION_RECORDED",
  "REVIEWING",
  "SAVING",
  "SAVED",
  "SYNCING",
  "OFFLINE",
  "SYNC_ERROR",
  "CONFLICT",
  "SESSION_FINISHED",
] as const;

export type FieldCopilotState = (typeof FIELD_COPILOT_STATES)[number];

const CONFIRMATION_REQUIRED = new Set<MiluquitaFieldIntent>([
  "SAVE_CAPTURE",
  "DISCARD_CAPTURE",
  "SEND_TO_REVIEW",
  "FINISH_SESSION",
]);

const READ_INTENTS = new Set<MiluquitaFieldIntent>([
  "START_SESSION",
  "GET_GPS",
  "SHOW_STATUS",
  "HELP",
  "CANCEL_ACTION",
]);

const WRITE_INTENTS = new Set<MiluquitaFieldIntent>([
  "CAPTURE_PHOTO",
  "RECORD_OBSERVATION",
  "SAVE_CAPTURE",
  "DISCARD_CAPTURE",
  "SEND_TO_REVIEW",
  "SYNC",
  "FINISH_SESSION",
]);

export function isKnownFieldIntent(value: string): value is MiluquitaFieldIntent {
  return (MILUQUITA_FIELD_INTENTS as readonly string[]).includes(value);
}

export function requiresFieldConfirmation(intent: MiluquitaFieldIntent) {
  return CONFIRMATION_REQUIRED.has(intent);
}

export function capabilityForFieldIntent(intent: MiluquitaFieldIntent): "READ" | "WRITE" | "DENY" {
  if (READ_INTENTS.has(intent)) return "READ";
  if (WRITE_INTENTS.has(intent)) return "WRITE";
  return "DENY";
}

export function isForbiddenCanonicalAction(value: string) {
  return ["VERIFY", "PUBLISH", "DECISION_COMMIT", "RESOLVE_CRITICAL_CONFLICT", "MODIFY_MJP_CORE"].includes(value.toUpperCase());
}

export type FieldIntentInterpretation = {
  intentId: string;
  intent: MiluquitaFieldIntent | null;
  confidence: number;
  candidates: MiluquitaFieldIntent[];
  needsClarification: boolean;
  requiresConfirmation: boolean;
  capability: "READ" | "WRITE" | "DENY" | "UNKNOWN";
  reason?: string;
};

export function interpretFieldIntent(text: string, intentId: string): FieldIntentInterpretation {
  const normalized = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  const matches: Array<{ intent: MiluquitaFieldIntent; terms: string[]; confidence: number }> = [
    { intent: "START_SESSION", terms: ["iniciar sesion", "comenzar sesion", "empezar levantamiento"], confidence: 0.96 },
    { intent: "GET_GPS", terms: ["gps", "ubicacion", "mi ubicacion", "donde estoy"], confidence: 0.95 },
    { intent: "CAPTURE_PHOTO", terms: ["tomar foto", "toma una foto", "capturar foto", "fotografia"], confidence: 0.96 },
    { intent: "RECORD_OBSERVATION", terms: ["registrar observacion", "anotar observacion", "grabar observacion"], confidence: 0.95 },
    { intent: "SAVE_CAPTURE", terms: ["guardar captura", "guardar registro", "guardar"], confidence: 0.90 },
    { intent: "DISCARD_CAPTURE", terms: ["descartar captura", "descartar"], confidence: 0.94 },
    { intent: "SEND_TO_REVIEW", terms: ["enviar a revision", "enviar revision", "enviar al ojo"], confidence: 0.95 },
    { intent: "SYNC", terms: ["sincronizar", "subir pendientes"], confidence: 0.96 },
    { intent: "SHOW_STATUS", terms: ["estado", "como vamos", "mostrar estado"], confidence: 0.88 },
    { intent: "FINISH_SESSION", terms: ["terminar sesion", "finalizar sesion", "cerrar levantamiento"], confidence: 0.95 },
    { intent: "CANCEL_ACTION", terms: ["cancelar", "anular accion", "detener"], confidence: 0.90 },
    { intent: "HELP", terms: ["ayuda", "que puedo decir", "comandos"], confidence: 0.98 },
  ];
  const found = matches.filter((item) => item.terms.some((term) => normalized.includes(term))).sort((a, b) => b.confidence - a.confidence);
  const best = found[0];
  const ambiguous = found.length > 1 && best && found[1].confidence >= best.confidence - 0.05;
  if (!best || ambiguous || best.confidence < 0.75) {
    return { intentId, intent: null, confidence: best?.confidence ?? 0, candidates: found.map((item) => item.intent), needsClarification: true, requiresConfirmation: false, capability: "UNKNOWN", reason: "NEEDS_CLARIFICATION" };
  }
  return { intentId, intent: best.intent, confidence: best.confidence, candidates: found.map((item) => item.intent), needsClarification: false, requiresConfirmation: requiresFieldConfirmation(best.intent), capability: capabilityForFieldIntent(best.intent) };
}

export function transitionFieldState(current: FieldCopilotState, intent: MiluquitaFieldIntent, context: { gps: "UNKNOWN" | "DENIED" | "SEARCHING" | "READY"; camera: "UNKNOWN" | "DENIED" | "READY"; connectivity: "ONLINE" | "OFFLINE" }) {
  if (intent === "START_SESSION") return "SESSION_STARTING" as const;
  if (intent === "GET_GPS") return context.gps === "READY" ? "GPS_READY" as const : "GPS_WAITING" as const;
  if (intent === "CAPTURE_PHOTO") return context.camera === "READY" && context.gps === "READY" ? "CAPTURING" as const : current;
  if (intent === "RECORD_OBSERVATION") return "OBSERVATION_LISTENING" as const;
  if (intent === "SAVE_CAPTURE") return "SAVING" as const;
  if (intent === "SYNC") return context.connectivity === "OFFLINE" ? "OFFLINE" as const : "SYNCING" as const;
  if (intent === "FINISH_SESSION") return "SESSION_FINISHED" as const;
  if (intent === "CANCEL_ACTION") return current === "SESSION_FINISHED" ? current : "REVIEWING" as const;
  if (intent === "DISCARD_CAPTURE") return "REVIEWING" as const;
  return current;
}
