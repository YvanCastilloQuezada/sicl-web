/**
 * ARKI Delta 6.2 Pipeline
 * 
 * Pipeline básico de promoción de conocimiento.
 * 
 * Etapas:
 * 1. CANDIDATE: idea/evidencia detectada.
 * 2. VALIDATED: validada con tests.
 * 3. PROMOTED: promovida a conocimiento canónico.
 * 4. LEDGER: registrada en el ledger.
 */

export type Delta62Stage = "CANDIDATE" | "VALIDATED" | "PROMOTED" | "LEDGER" | "REJECTED";

export interface Delta62Entry {
  id: string;
  stage: Delta62Stage;
  source: string;
  evidence: string[];
  promotedAt?: string;
  promotedBy?: string;
  reason?: string;
}

export const DELTA62_PIPELINE = {
  schema: "ARKI-DELTA62-PIPELINE-1.0",
  stages: ["CANDIDATE", "VALIDATED", "PROMOTED", "LEDGER"] as const,
  authority: "HUMAN_ONLY",
  autoPromotion: false
} as const;

/**
 * Crea una entrada en la etapa CANDIDATE.
 */
export function createCandidate(id: string, source: string, evidence: string[]): Delta62Entry {
  if (!id || !source) {
    throw new Error("ID_AND_SOURCE_REQUIRED");
  }
  if (evidence.length === 0) {
    throw new Error("EVIDENCE_REQUIRED");
  }
  return {
    id,
    stage: "CANDIDATE",
    source,
    evidence
  };
}

/**
 * Valida una entrada (pasa a VALIDATED).
 */
export function validateEntry(entry: Delta62Entry, testPassed: boolean): Delta62Entry {
  if (entry.stage !== "CANDIDATE") {
    throw new Error("INVALID_STAGE_TRANSITION");
  }
  if (!testPassed) {
    return {
      ...entry,
      stage: "REJECTED",
      reason: "Tests failed"
    };
  }
  return {
    ...entry,
    stage: "VALIDATED"
  };
}

/**
 * Promueve una entrada (requiere autoridad humana).
 */
export function promoteEntry(entry: Delta62Entry, promotedBy: string): Delta62Entry {
  if (entry.stage !== "VALIDATED") {
    throw new Error("INVALID_STAGE_TRANSITION");
  }
  if (!promotedBy) {
    throw new Error("HUMAN_AUTHORITY_REQUIRED");
  }
  return {
    ...entry,
    stage: "PROMOTED",
    promotedAt: new Date().toISOString(),
    promotedBy
  };
}

/**
 * Registra en el ledger.
 */
export function recordInLedger(entry: Delta62Entry): Delta62Entry {
  if (entry.stage !== "PROMOTED") {
    throw new Error("INVALID_STAGE_TRANSITION");
  }
  return {
    ...entry,
    stage: "LEDGER"
  };
}
