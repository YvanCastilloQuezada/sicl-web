export const ENTERTAINMENT_OS_STATES = [
  "SCHEDULED",
  "ANNOUNCING",
  "OPEN",
  "LIVE",
  "CLOSING",
  "RESULT",
  "COMPLETED",
  "RECOVERING",
  "PAUSED",
  "STOPPED",
] as const;

export type EntertainmentOsState = (typeof ENTERTAINMENT_OS_STATES)[number];

export type ExperienceEvent = {
  eventId: string;
  eventType: string;
  scheduledAt: string;
  startAt: string | null;
  endAt: string | null;
  currentState: EntertainmentOsState;
  nextEventId: string | null;
  presentationState: "IDLE" | "ACTIVE" | "FALLBACK";
  qrState: "UNAVAILABLE" | "READY" | "EXPIRED";
  lukitaState: "HIDDEN" | "PRESENTING" | "OPTIONAL";
  recoveryState: "NONE" | "DETECTING" | "FALLBACK" | "RECOVERED";
  authoritativeSource: "MJP_CORE";
  virtualOnly: true;
};

export type PresentationDecision = {
  eventId: string;
  showLukita: boolean;
  message: string;
  durationSeconds: number;
  animation: "NONE" | "FADE" | "PULSE";
  contentKey: string;
  sourceState: EntertainmentOsState;
  authority: "PRESENTATION_ONLY";
  result: null;
};

export type AgentPermission = {
  read: true;
  propose: boolean;
  alert: boolean;
  modifyGame: false;
  modifyResult: false;
};

export const ENTERTAINMENT_OS_AGENT_PERMISSIONS: Record<string, AgentPermission> = {
  "LUKITA_DIRECTOR": { read: true, propose: true, alert: false, modifyGame: false, modifyResult: false },
  "EXPERIENCE_AGENT": { read: true, propose: true, alert: false, modifyGame: false, modifyResult: false },
  "AUDITOR": { read: true, propose: false, alert: false, modifyGame: false, modifyResult: false },
  "WATCHDOG": { read: true, propose: false, alert: true, modifyGame: false, modifyResult: false },
  "RECOVERY": { read: true, propose: true, alert: true, modifyGame: false, modifyResult: false },
};

export type ExperienceMetric = {
  timestamp: string;
  eventId: string | null;
  executionId: string;
  instanceId: string;
  state: EntertainmentOsState | "UNKNOWN";
  action: string;
  result: "OBSERVED" | "PROPOSED" | "FALLBACK" | "RECOVERED" | "BLOCKED";
  error: string | null;
  recovery: string | null;
  durationMs: number | null;
};

export const CHAOS_SCENARIOS = [
  "QR_FAIL",
  "TV_FAIL",
  "WEBSOCKET_FAIL",
  "AVATAR_FAIL",
  "SCHEDULER_FAIL",
  "CONTENT_FAIL",
  "AGENT_FAIL",
  "NETWORK_FAIL",
  "DATABASE_FAIL",
  "STREAM_FAIL",
  "HEARTBEAT_FAIL",
] as const;

export type ChaosScenario = (typeof CHAOS_SCENARIOS)[number];

export function buildPresentationDecision(event: Pick<ExperienceEvent, "eventId" | "currentState" | "lukitaState">): PresentationDecision {
  const active = event.currentState !== "STOPPED" && event.currentState !== "PAUSED" && event.lukitaState !== "HIDDEN";
  return {
    eventId: event.eventId,
    showLukita: active,
    message: active ? "Lukita presenta información autorizada del evento." : "La experiencia continúa sin presentación de Lukita.",
    durationSeconds: active ? 8 : 0,
    animation: active ? "FADE" : "NONE",
    contentKey: active ? "event-context" : "safe-idle",
    sourceState: event.currentState,
    authority: "PRESENTATION_ONLY",
    result: null,
  };
}

export function isAuthoritativeField(field: string): boolean {
  return ["rng", "rules", "result", "rtp", "wallet", "credits", "ledger", "liquidation", "mjpTvManifest"].includes(field);
}
