import { describe, expect, it } from "vitest";
import {
  ANALYTICS_RETRY_LIMIT,
  getAnalyticsEventStorageKey,
  getAnalyticsRetryDecision,
  isRateLimitError,
  markAnalyticsEventSent,
  shouldSendAnalyticsEvent,
} from "./analyticsResilience";

describe("analytics resilience", () => {
  it("detects rate-limit errors without relying on one exact error shape", () => {
    expect(isRateLimitError(new Error("Too many requests. Please try again later."))).toBe(true);
    expect(isRateLimitError({ message: "rate limit", data: { httpStatus: 429 } })).toBe(true);
    expect(isRateLimitError(new Error("validation failed"))).toBe(false);
  });

  it("uses bounded exponential backoff and stops after the retry limit", () => {
    const first = getAnalyticsRetryDecision(new Error("429"), 0);
    const last = getAnalyticsRetryDecision(new Error("429"), ANALYTICS_RETRY_LIMIT);
    expect(first.shouldRetry).toBe(true);
    expect(first.delayMs).toBe(1200);
    expect(last.shouldRetry).toBe(false);
    expect(last.reason).toBe("exhausted");
  });

  it("deduplicates an event only after a successful send", () => {
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    };
    expect(shouldSendAnalyticsEvent(storage, "session_started:test:2026-08-26")).toBe(true);
    markAnalyticsEventSent(storage, "session_started:test:2026-08-26");
    expect(getAnalyticsEventStorageKey("session_started:test:2026-08-26")).toBe("mjp-analytics-sent:session_started:test:2026-08-26");
    expect(shouldSendAnalyticsEvent(storage, "session_started:test:2026-08-26")).toBe(false);
  });
});
