export const CONTINGENCY_CAUSES = ["CONNECTION", "YOUTUBE", "AVATAR", "QR", "BACKEND", "TRANSMISSION", "TV_CLIENT", "SYNC", "MOBILE", "DATABASE", "EVENT_TIMEOUT", "DRAW_FAILURE", "REALTIME", "SCHEDULER", "CONTENT"] as const;
export type ContingencyCause = (typeof CONTINGENCY_CAUSES)[number];
export type ContingencyStep = "DETECT" | "ISOLATE" | "FALLBACK" | "RECOVER" | "VERIFY" | "CONTINUE";
export type ConfirmedSnapshot = { eventId: string; status: string; gameName: string; result: unknown | null; verified: boolean; capturedAt: number };
export type ContingencyState = { mode: "NORMAL" | "CONTINGENCY"; cause?: ContingencyCause; step?: ContingencyStep; message: string; lastConfirmed: ConfirmedSnapshot | null; resultAuthorityPreserved: true };

export function enterContingency(cause: ContingencyCause, lastConfirmed: ConfirmedSnapshot | null, step: ContingencyStep = "DETECT"): ContingencyState {
  return { mode: "CONTINGENCY", cause, step, message: "Estamos restableciendo el servicio. Mostramos únicamente el último estado confirmado.", lastConfirmed, resultAuthorityPreserved: true };
}

export function advanceContingency(state: ContingencyState, step: ContingencyStep): ContingencyState {
  if (state.mode !== "CONTINGENCY") throw new Error("Solo un estado de contingencia puede avanzar.");
  if (state.step === "CONTINUE" && step !== "VERIFY") throw new Error("Una contingencia continuada no puede retroceder.");
  return { ...state, step, resultAuthorityPreserved: true };
}

export function resolveContingency(): ContingencyState {
  return { mode: "NORMAL", message: "La señal y el estado del evento están disponibles.", lastConfirmed: null, resultAuthorityPreserved: true };
}
