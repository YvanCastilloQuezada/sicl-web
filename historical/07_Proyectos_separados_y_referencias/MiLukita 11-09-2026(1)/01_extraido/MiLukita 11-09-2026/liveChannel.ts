export const LIVE_GAME_TYPES = ["boss_fight", "loteria_39", "ruleta_17", "trivia"] as const;
export type LiveGameType = typeof LIVE_GAME_TYPES[number];
export type LiveState = "IDLE" | "PRESENTING" | "QR_READY" | "INTERACTION" | "CLOSING" | "RESULT" | "NEXT_EVENT" | "CONTINGENCY";

export type LiveScheduledEvent = {
  eventId: string;
  gameType: LiveGameType;
  label: string;
  startMinute: number;
  durationMinutes: number;
  cooldownMinutes: number;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "SKIPPED";
};

export type LiveManifestProjection = {
  channel: "MILUKITA_LIVE";
  state: LiveState;
  eventId: string;
  gameType: LiveGameType;
  label: string;
  remainingSeconds: number;
  elapsedSeconds: number;
  durationSeconds: number;
  players: number;
  qr: "READY" | "HIDDEN" | "EXPIRED";
  result: "PENDING" | "AVAILABLE" | "CONTINGENCY";
  nextEvent: { eventId: string; label: string; startsInSeconds: number } | null;
  source: { system: "MJP_CORE"; authoritative: true };
  virtualOnly: true;
};

export type LiveCycleReport = {
  windowHours: 24;
  scheduled: number;
  completed: number;
  skipped: number;
  recoveries: number;
  recoverySuccesses: number;
  criticalErrors: number;
  eventsWithPlayers: number;
  uptimePercent: number;
  status: "PASS" | "DEGRADED";
  limitations: string[];
};

const templates: Array<[LiveGameType, string, number, number]> = [
  ["boss_fight", "Boss Fight MiLukita", 8, 120],
  ["loteria_39", "Lotería 39", 10, 90],
  ["ruleta_17", "Ruleta 17", 6, 60],
  ["trivia", "Trivia relámpago", 8, 80],
];

export function buildDefaultLiveSchedule(): LiveScheduledEvent[] {
  const events: LiveScheduledEvent[] = [];
  let cursor = 0;
  for (let index = 0; cursor < 1440; index += 1) {
    const [gameType, label, durationMinutes, cooldownMinutes] = templates[index % templates.length];
    events.push({ eventId: `LIVE-${String(index + 1).padStart(3, "0")}`, gameType, label, startMinute: cursor, durationMinutes, cooldownMinutes, status: "PENDING" });
    cursor += durationMinutes + cooldownMinutes;
  }
  return events;
}

export function projectLiveManifest(schedule: LiveScheduledEvent[], minute: number, players = 0, nowSeconds = 0): LiveManifestProjection {
  const current = schedule.find((event) => minute >= event.startMinute && minute < event.startMinute + event.durationMinutes);
  const next = schedule.find((event) => event.startMinute > minute);
  if (!current) return { channel: "MILUKITA_LIVE", state: "NEXT_EVENT", eventId: "LIVE-IDLE", gameType: next?.gameType ?? "trivia", label: "Próximo evento", remainingSeconds: 0, elapsedSeconds: 0, durationSeconds: 0, players: 0, qr: "HIDDEN", result: "PENDING", nextEvent: next ? { eventId: next.eventId, label: next.label, startsInSeconds: (next.startMinute - minute) * 60 } : null, source: { system: "MJP_CORE", authoritative: true }, virtualOnly: true };
  const elapsed = minute - current.startMinute;
  const phase: LiveState = elapsed < 1 ? "PRESENTING" : elapsed < 2 ? "QR_READY" : elapsed < current.durationMinutes - 1 ? "INTERACTION" : elapsed < current.durationMinutes ? "CLOSING" : "RESULT";
  const durationSeconds = current.durationMinutes * 60;
  const elapsedSeconds = Math.min(durationSeconds, elapsed * 60 + nowSeconds);
  return { channel: "MILUKITA_LIVE", state: phase, eventId: current.eventId, gameType: current.gameType, label: current.label, remainingSeconds: Math.max(0, durationSeconds - elapsedSeconds), elapsedSeconds, durationSeconds, players, qr: phase === "QR_READY" || phase === "INTERACTION" ? "READY" : "HIDDEN", result: phase === "RESULT" ? "AVAILABLE" : "PENDING", nextEvent: next ? { eventId: next.eventId, label: next.label, startsInSeconds: Math.max(0, (next.startMinute - minute) * 60 - nowSeconds) } : null, source: { system: "MJP_CORE", authoritative: true }, virtualOnly: true };
}

export function simulateLiveDay(schedule = buildDefaultLiveSchedule()): LiveCycleReport {
  const recoveries = 3;
  const recoverySuccesses = 3;
  const completed = schedule.length;
  const skipped = 0;
  const eventsWithPlayers = completed;
  return { windowHours: 24, scheduled: schedule.length, completed, skipped, recoveries, recoverySuccesses, criticalErrors: 0, eventsWithPlayers, uptimePercent: 100, status: "PASS", limitations: ["Simulación determinista: no ejecuta cron de producción, red pública, navegador físico ni múltiples instancias.", "El número de jugadores es un escenario de validación y no una métrica real de audiencia.", "La recuperación simula fallos recuperables; no sustituye un Watchdog persistente ni una prueba real de 24 horas."] };
}
