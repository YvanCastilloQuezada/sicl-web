import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { buildRetentionEvents } from "@shared/retentionEvents";
import { getAnalyticsRetryDecision, markAnalyticsEventSent, shouldSendAnalyticsEvent } from "@shared/analyticsResilience";

function getSessionId() {
  const key = "mjp-analytics-session-id";
  const current = window.localStorage.getItem(key);
  if (current) return current;
  const generated = `sess-${crypto.randomUUID()}`;
  window.localStorage.setItem(key, generated);
  return generated;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export default function ProductAnalyticsBeacon() {
  const { isAuthenticated } = useAuth();
  const { mutate: recordEvent } = trpc.operations.recordProductEvent.useMutation();

  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;
    const timers: number[] = [];
    const sessionId = getSessionId();
    const day = todayKey();
    const pathname = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const roundId = params.get("round");
    const isSecondaryScreen = pathname.startsWith("/juegos/") && Boolean(roundId);
    const lastActiveDay = window.localStorage.getItem("mjp-analytics-last-active-day");
    const wasSecondaryScreenDay = window.localStorage.getItem("mjp-analytics-secondary-screen-day");
    const events = buildRetentionEvents({ sessionId, day, pathname, roundId: isSecondaryScreen ? roundId : null, lastActiveDay, lastSecondaryScreenDay: wasSecondaryScreenDay });

    if (isSecondaryScreen) window.localStorage.setItem("mjp-analytics-secondary-screen-day", day);
    window.localStorage.setItem("mjp-analytics-last-active-day", day);

    const sendEvent = (event: (typeof events)[number], attempt = 0) => {
      if (cancelled || !shouldSendAnalyticsEvent(window.localStorage, event.idempotencyKey)) return;

      recordEvent(event, {
        onSuccess: () => {
          markAnalyticsEventSent(window.localStorage, event.idempotencyKey);
        },
        onError: error => {
          const decision = getAnalyticsRetryDecision(error, attempt);
          if (!decision.shouldRetry || cancelled) return;
          const timer = window.setTimeout(() => sendEvent(event, attempt + 1), decision.delayMs);
          timers.push(timer);
        },
      });
    };

    events.forEach((event, index) => {
      const timer = window.setTimeout(() => sendEvent(event), index * 350);
      timers.push(timer);
    });

    return () => {
      cancelled = true;
      timers.forEach(timer => window.clearTimeout(timer));
    };
  }, [isAuthenticated, recordEvent]);

  return null;
}
