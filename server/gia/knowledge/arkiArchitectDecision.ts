/**
 * Capa de decisión de ARKI como arquitecto.
 *
 * ARKI decide cuáles candidatos anular y cuáles se quedan antes de que lleguen al Funnel.
 *
 * Regla:
 * - Si viola una restricción dura (zonificación, tipología) → ARCHIVED.
 * - Si viola una restricción blanda (asoleamiento, vientos) → SURVIVOR con penalty.
 * - Si no viola nada → SURVIVOR limpio.
 *
 * La decisión es trazable: cada anulación tiene un failureReason explícito.
 */

import type { DesignCandidate } from "../../../shared/arkiDesignFunnel";
import type { ProjectConstraint, ProjectConstraints } from "./deriveProjectConstraints";

export type ScreeningResult = {
  candidateId: string;
  decision: "SURVIVOR" | "ARCHIVED";
  severity: "HARD" | "SOFT" | "NONE";
  failureReasons: string[];
  softPenalties: string[];
};

export function screenCandidate(
  candidate: DesignCandidate,
  constraints: ProjectConstraints,
): ScreeningResult {
  const failureReasons: string[] = [];
  const softPenalties: string[] = [];

  // Regla 1 — Restricciones duras (matan)
  for (const constraint of constraints.hard) {
    // Si el candidato viola la restricción, se archiva.
    // (En esta fase, asumimos que el candidato viola la restricción si el candidato
    // no tiene evidencia de cumplirla. Es una simplificación inicial.)
    if (!hasEvidence(candidate, constraint)) {
      failureReasons.push(`${constraint.layer}:${constraint.code}:${constraint.message}`);
    }
  }

  // Regla 2 — Restricciones blandas (penalizan)
  for (const constraint of constraints.soft) {
    softPenalties.push(`${constraint.layer}:${constraint.code}`);
  }

  if (failureReasons.length > 0) {
    return {
      candidateId: candidate.id,
      decision: "ARCHIVED",
      severity: "HARD",
      failureReasons,
      softPenalties,
    };
  }

  return {
    candidateId: candidate.id,
    decision: "SURVIVOR",
    severity: softPenalties.length > 0 ? "SOFT" : "NONE",
    failureReasons: [],
    softPenalties,
  };
}

function hasEvidence(candidate: DesignCandidate, constraint: ProjectConstraint): boolean {
  // Si la restricción tiene limitValue y metricKey, comparamos numéricamente.
  if (constraint.limitValue !== undefined && constraint.metricKey !== undefined) {
    const candidateValue = candidate.metrics[constraint.metricKey];
    console.log(`[hasEvidence] ${constraint.code}: metricKey=${constraint.metricKey}, candidateValue=${candidateValue}, limitValue=${constraint.limitValue}, operator=${constraint.operator}`);
    if (typeof candidateValue !== "number") {
      // Sin valor numérico, no podemos verificar. Asumimos que cumple (no matar por falta de dato).
      return true;
    }
    if (constraint.operator === "<=") return candidateValue <= constraint.limitValue;
    if (constraint.operator === ">=") return candidateValue >= constraint.limitValue;
    if (constraint.operator === "==") return candidateValue === constraint.limitValue;
    return true;
  }
  // Si no hay valor numérico, buscamos el código en la evidencia (fallback).
  return candidate.evidence.some((item) => item.includes(constraint.code));
}

/**
 * Aplica el screening a N candidatos y devuelve:
 * - Los SURVIVOR (los que llegan al Funnel).
 * - Los ARCHIVED (los que ARKI decidió anular, con su motivo).
 */
export function arkiArchitectDecision(
  candidates: DesignCandidate[],
  constraints: ProjectConstraints,
): { survivors: DesignCandidate[]; archived: ScreeningResult[] } {
  const survivors: DesignCandidate[] = [];
  const archived: ScreeningResult[] = [];

  for (const candidate of candidates) {
    const result = screenCandidate(candidate, constraints);
    if (result.decision === "SURVIVOR") {
      survivors.push({
        ...candidate,
        stage: "SURVIVOR",
        unknowns: [...candidate.unknowns, ...result.softPenalties],
      });
    } else {
      archived.push(result);
    }
  }

  return { survivors, archived };
}
