export type RetentionEvent = {
  eventType: "session_started" | "session_returned" | "secondary_screen_viewed" | "secondary_screen_returned";
  sessionId: string;
  source: "web" | "secondary_screen";
  gameType?: string;
  payload?: Record<string, unknown>;
  idempotencyKey: string;
};

export function buildRetentionEvents(input: { sessionId: string; day: string; pathname: string; roundId: string | null; lastActiveDay: string | null; lastSecondaryScreenDay: string | null }): RetentionEvent[] {
  const events: RetentionEvent[] = [{ eventType: "session_started", sessionId: input.sessionId, source: "web", idempotencyKey: `session_started:${input.sessionId}:${input.day}` }];
  if (input.lastActiveDay && input.lastActiveDay !== input.day) events.push({ eventType: "session_returned", sessionId: input.sessionId, source: "web", payload: { previousActiveDay: input.lastActiveDay }, idempotencyKey: `session_returned:${input.sessionId}:${input.day}` });
  if (input.pathname.startsWith("/juegos/") && input.roundId) {
    const returned = Boolean(input.lastSecondaryScreenDay && input.lastSecondaryScreenDay !== input.day);
    events.push({ eventType: returned ? "secondary_screen_returned" : "secondary_screen_viewed", sessionId: input.sessionId, source: "secondary_screen", gameType: input.pathname.split("/").filter(Boolean).at(-1), payload: { roundId: input.roundId, entry: "tv_qr" }, idempotencyKey: `secondary_screen:${input.sessionId}:${input.roundId}:${input.day}` });
  }
  return events;
}
