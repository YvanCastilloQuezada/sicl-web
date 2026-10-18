import type { ExperienceMetric } from "../../shared/entertainmentOs";

export type ExperienceObservation = {
  qrConversion: number | null;
  dwellSeconds: number | null;
  returnRate: number | null;
  errors: number | null;
};

export type ExperienceProposal = {
  mode: "PROPOSE_ONLY";
  reason: string;
  recommendation: string;
  affectedMetrics: Array<keyof ExperienceObservation>;
  actionsExecuted: false;
};

export function observeExperience(metrics: ExperienceMetric[]): ExperienceObservation {
  const errors = metrics.filter((metric) => metric.result === "BLOCKED").length;
  const recovered = metrics.filter((metric) => metric.result === "RECOVERED").length;
  const qrEvents = metrics.filter((metric) => metric.action.includes("QR")).length;
  return {
    qrConversion: qrEvents ? Number((recovered / qrEvents).toFixed(4)) : null,
    dwellSeconds: metrics.length ? Number((metrics.reduce((sum, metric) => sum + (metric.durationMs ?? 0), 0) / metrics.length / 1000).toFixed(2)) : null,
    returnRate: null,
    errors,
  };
}

export function proposeExperienceOptimization(observation: ExperienceObservation): ExperienceProposal {
  if (observation.qrConversion !== null && observation.qrConversion < 0.5) {
    return { mode: "PROPOSE_ONLY", reason: "Conversión QR observada por debajo del umbral configurado.", recommendation: "Evaluar ampliar la visibilidad del QR y el tiempo de exposición.", affectedMetrics: ["qrConversion"], actionsExecuted: false };
  }
  if (observation.errors !== null && observation.errors > 0) {
    return { mode: "PROPOSE_ONLY", reason: "Se observaron eventos bloqueados.", recommendation: "Revisar el fallback y la causa antes de cambiar la experiencia.", affectedMetrics: ["errors"], actionsExecuted: false };
  }
  return { mode: "PROPOSE_ONLY", reason: "No se detectó una señal suficiente para proponer cambio.", recommendation: "Mantener la configuración actual y seguir observando.", affectedMetrics: [], actionsExecuted: false };
}
