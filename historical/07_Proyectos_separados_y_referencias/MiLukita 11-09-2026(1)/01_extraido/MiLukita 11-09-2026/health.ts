export type OperationalHealthState = "HEALTHY" | "DEGRADED" | "DISCONNECTED" | "PAUSED" | "STOPPED" | "RECOVERING";
export type AgentOperationalStatus = "ALERT_ONLY" | "READ_ONLY" | "UNKNOWN";

export type UnifiedHealth = {
  state: OperationalHealthState;
  timestamp: string;
  eventId: string | null;
  instanceId: string | null;
  heartbeatId: string | null;
  watchdogStatus: AgentOperationalStatus;
  auditorStatus: AgentOperationalStatus;
  reason: string | null;
  lastKnownGood: string | null;
  virtualOnly: true;
};

export function buildUnifiedHealth(input: Partial<UnifiedHealth> & Pick<UnifiedHealth, "state">): UnifiedHealth {
  return {
    state: input.state,
    timestamp: input.timestamp ?? new Date().toISOString(),
    eventId: input.eventId ?? null,
    instanceId: input.instanceId ?? null,
    heartbeatId: input.heartbeatId ?? null,
    watchdogStatus: input.watchdogStatus ?? "UNKNOWN",
    auditorStatus: input.auditorStatus ?? "UNKNOWN",
    reason: input.reason ?? null,
    lastKnownGood: input.lastKnownGood ?? null,
    virtualOnly: true,
  };
}
