export type AnalyticsRetryDecision = {
  shouldRetry: boolean;
  delayMs: number;
  reason: "rate_limit" | "transient" | "permanent" | "exhausted";
};

const MAX_RETRIES = 2;
const BASE_DELAY_MS = 1200;
const MAX_DELAY_MS = 5000;

function errorText(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    const candidate = error as { message?: unknown; data?: { httpStatus?: unknown } };
    return `${String(candidate.message ?? "")} ${String(candidate.data?.httpStatus ?? "")}`;
  }
  return "";
}

export function isRateLimitError(error: unknown): boolean {
  const text = errorText(error).toLowerCase();
  return text.includes("too many requests") || text.includes("rate limit") || text.includes("429") || text.includes("ratelimit");
}

export function isTransientAnalyticsError(error: unknown): boolean {
  const text = errorText(error).toLowerCase();
  return isRateLimitError(error) || text.includes("timeout") || text.includes("network") || text.includes("aborted") || text.includes("temporarily");
}

export function getAnalyticsRetryDecision(error: unknown, attempt: number): AnalyticsRetryDecision {
  if (attempt >= MAX_RETRIES) return { shouldRetry: false, delayMs: 0, reason: "exhausted" };
  if (isRateLimitError(error)) return { shouldRetry: true, delayMs: Math.min(BASE_DELAY_MS * 2 ** attempt, MAX_DELAY_MS), reason: "rate_limit" };
  if (isTransientAnalyticsError(error)) return { shouldRetry: true, delayMs: Math.min(BASE_DELAY_MS * 2 ** attempt, MAX_DELAY_MS), reason: "transient" };
  return { shouldRetry: false, delayMs: 0, reason: "permanent" };
}

export function getAnalyticsEventStorageKey(idempotencyKey: string): string {
  return `mjp-analytics-sent:${idempotencyKey}`;
}

export function shouldSendAnalyticsEvent(storage: Pick<Storage, "getItem">, idempotencyKey: string): boolean {
  return storage.getItem(getAnalyticsEventStorageKey(idempotencyKey)) !== "1";
}

export function markAnalyticsEventSent(storage: Pick<Storage, "setItem">, idempotencyKey: string): void {
  storage.setItem(getAnalyticsEventStorageKey(idempotencyKey), "1");
}

export const ANALYTICS_RETRY_LIMIT = MAX_RETRIES;
