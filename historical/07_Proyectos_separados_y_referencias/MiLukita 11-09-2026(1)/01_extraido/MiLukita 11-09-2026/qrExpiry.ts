export function getQrExpiryState(expiresAt: string | null | undefined, now = Date.now()) {
  const timestamp = expiresAt ? Date.parse(expiresAt) : Number.NaN;
  if (!Number.isFinite(timestamp)) return { expiresAt: timestamp, secondsRemaining: null as number | null, expired: false };
  const secondsRemaining = Math.max(0, Math.ceil((timestamp - now) / 1000));
  return { expiresAt: timestamp, secondsRemaining, expired: timestamp <= now };
}

export function getQrProgressPercent(secondsRemaining: number | null, initialSeconds: number | null) {
  if (secondsRemaining === null || initialSeconds === null || initialSeconds <= 0) return 0;
  return Math.max(0, Math.min(100, (secondsRemaining / initialSeconds) * 100));
}

export function getQrProgressTone(secondsRemaining: number | null): "normal" | "critical" {
  return secondsRemaining !== null && secondsRemaining < 30 ? "critical" : "normal";
}
