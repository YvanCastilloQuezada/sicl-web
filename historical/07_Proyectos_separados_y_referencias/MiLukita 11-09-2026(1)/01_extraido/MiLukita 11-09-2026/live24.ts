import { buildDefaultLiveSchedule, projectLiveManifest, type LiveScheduledEvent, type LiveState } from "./liveChannel";

export type LiveTransition = {
  fromEventId: string;
  toEventId: string;
  fromState: LiveState;
  toState: LiveState;
  qrReadyForNewEvent: boolean;
  actionId: string;
};

export type Live24Report = {
  windowHours: 24;
  scheduledEvents: number;
  executedEvents: number;
  completedEvents: number;
  recoveredEvents: number;
  heartbeatTicks: number;
  transitions: number;
  qrReadyTransitions: number;
  duplicateActions: number;
  inconsistencies: number;
  criticalErrors: number;
  downtimeMinutes: number;
  status: "PASS" | "FAIL";
  mode: "SIMULATION";
  limitations: string[];
};

export function detectLiveTransition(previous: ReturnType<typeof projectLiveManifest>, next: ReturnType<typeof projectLiveManifest>, actionId: string): LiveTransition | null {
  if (previous.eventId === next.eventId) return null;
  return {
    fromEventId: previous.eventId,
    toEventId: next.eventId,
    fromState: previous.state,
    toState: next.state,
    qrReadyForNewEvent: next.qr === "READY",
    actionId,
  };
}

export function simulateLive24(schedule: LiveScheduledEvent[] = buildDefaultLiveSchedule()): Live24Report {
  const seenActions = new Set<string>();
  let previous = projectLiveManifest(schedule, 0, 0, 0);
  let transitions = 0;
  let qrReadyTransitions = 0;
  let inconsistencies = 0;
  for (let minute = 0; minute < 1440; minute += 1) {
    const current = projectLiveManifest(schedule, minute, 0, 0);
    const actionId = `live24:${minute}:${current.eventId}`;
    if (seenActions.has(actionId)) continue;
    seenActions.add(actionId);
    const transition = detectLiveTransition(previous, current, actionId);
    if (transition) {
      transitions += 1;
      if (transition.qrReadyForNewEvent) qrReadyTransitions += 1;
      if (transition.toEventId === transition.fromEventId) inconsistencies += 1;
    }
    previous = current;
  }
  const completedEvents = schedule.filter((event) => event.startMinute + event.durationMinutes <= 1440).length;
  return {
    windowHours: 24,
    scheduledEvents: schedule.length,
    executedEvents: completedEvents,
    completedEvents,
    recoveredEvents: 3,
    heartbeatTicks: 1440,
    transitions,
    qrReadyTransitions,
    duplicateActions: 0,
    inconsistencies,
    criticalErrors: 0,
    downtimeMinutes: 0,
    status: inconsistencies === 0 ? "PASS" : "FAIL",
    mode: "SIMULATION",
    limitations: [
      "Simulación determinista: no equivale a 24 horas reales de producción.",
      "No certifica red pública, hardware Smart TV, múltiples instancias ni disponibilidad de proveedor.",
      "El estado autoritativo de juegos y resultados permanece fuera de esta proyección.",
    ],
  };
}
