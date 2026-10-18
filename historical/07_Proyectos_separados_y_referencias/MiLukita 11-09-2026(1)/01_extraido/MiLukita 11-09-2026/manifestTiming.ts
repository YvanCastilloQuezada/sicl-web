import type { MjpTvManifest } from "./tvManifest";

export type ManifestTimingWindow = {
  issuedAt: string | null;
  expiresAt: string | null;
  durationSeconds: number | null;
  elapsedSeconds: number | null;
  remainingSeconds: number | null;
  progressPercent: number | null;
  authoritative: boolean;
};

export function isQrExpiringSoon(remainingSeconds: number | null | undefined, thresholdSeconds = 10): boolean {
  return Number.isFinite(remainingSeconds) && (remainingSeconds as number) >= 0 && (remainingSeconds as number) < thresholdSeconds;
}

export function getManifestTimingWindow(manifest: Pick<MjpTvManifest, "generatedAt" | "event" | "countdown" | "qr">, now = Date.now()): ManifestTimingWindow {
  const issuedAt = manifest.event.openAt ?? manifest.generatedAt;
  const expiresAt = manifest.qr.expiresAt ?? manifest.event.closeAt;
  const issuedMs = Date.parse(issuedAt);
  const expiresMs = expiresAt ? Date.parse(expiresAt) : Number.NaN;
  if (!Number.isFinite(issuedMs) || !Number.isFinite(expiresMs) || expiresMs <= issuedMs) {
    return { issuedAt: Number.isFinite(issuedMs) ? issuedAt : null, expiresAt: Number.isFinite(expiresMs) ? expiresAt : null, durationSeconds: null, elapsedSeconds: null, remainingSeconds: manifest.countdown.seconds ?? null, progressPercent: null, authoritative: false };
  }
  const durationSeconds = Math.max(0, Math.round((expiresMs - issuedMs) / 1000));
  const elapsedSeconds = Math.min(durationSeconds, Math.max(0, Math.floor((now - issuedMs) / 1000)));
  const remainingSeconds = Math.max(0, Math.ceil((expiresMs - now) / 1000));
  return { issuedAt, expiresAt, durationSeconds, elapsedSeconds, remainingSeconds, progressPercent: durationSeconds === 0 ? 100 : Math.min(100, (elapsedSeconds / durationSeconds) * 100), authoritative: true };
}
