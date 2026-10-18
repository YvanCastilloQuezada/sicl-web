export const LUKITA_VIEWER_MAX_AUTO_RETRIES = 1;

export function getLukitaViewerRetryDelay(attempt: number) {
  const safeAttempt = Math.max(0, Math.floor(attempt));
  return Math.min(8_000, 1_500 * 2 ** safeAttempt);
}

export function shouldRetryLukitaViewer(attempt: number, maxRetries = LUKITA_VIEWER_MAX_AUTO_RETRIES) {
  return Number.isFinite(attempt) && attempt < maxRetries;
}

export function getLukitaViewerRecoveryMessage(state: "loading" | "ready" | "mock" | "fallback") {
  if (state === "ready") return "Modelo local cargado";
  if (state === "loading") return "Cargando modelo…";
  if (state === "fallback") return "Fuente no disponible · respaldo activado";
  return "Mock local listo";
}
