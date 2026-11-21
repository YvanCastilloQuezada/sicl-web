/**
 * ARKI Architect Decision — fail-closed screening.
 *
 * SURVIVOR: elegible y con restricciones duras verificadas.
 * ARCHIVED: incumplimiento duro demostrado o fallo explícito.
 * HELD: incertidumbre o evidencia insuficiente.
 *
 * La ausencia de evidencia nunca se interpreta como cumplimiento.
 */

import type { DesignCandidate } from "../../../shared/arkiDesignFunnel";
import type {
  ProjectConstraint,
  ProjectConstraints,
} from "./deriveProjectConstraints";

export type ScreeningDecision = "SURVIVOR" | "ARCHIVED" | "HELD";

export type ScreeningResult = {
  candidateId: string;
  decision: ScreeningDecision;
  severity: "HARD" | "SOFT" | "UNKNOWN" | "NONE";
  failureReasons: string[];
  softPenalties: string[];
  unknownReasons: string[];
};

type ConstraintEvaluation =
  | { status: "PASS" }
  | { status: "FAIL"; reason: string }
  | { status: "UNKNOWN"; reason: string };

function evaluateHardConstraint(
  candidate: DesignCandidate,
  constraint: ProjectConstraint,
): ConstraintEvaluation {
  const prefix = `${constraint.layer}:${constraint.code}`;

  if (
    constraint.limitValue === undefined ||
    constraint.metricKey === undefined ||
    constraint.operator === undefined
  ) {
    return {
      status: "UNKNOWN",
      reason: `${prefix}:VERIFICATION_NOT_IMPLEMENTED`,
    };
  }

  const value = candidate.metrics[constraint.metricKey];

  if (typeof value !== "number" || !Number.isFinite(value)) {
    return {
      status: "UNKNOWN",
      reason: `${prefix}:METRIC_MISSING_OR_INVALID:${constraint.metricKey}`,
    };
  }

  let passes: boolean;

  switch (constraint.operator) {
    case "<=":
      passes = value <= constraint.limitValue;
      break;
    case ">=":
      passes = value >= constraint.limitValue;
      break;
    case "==":
      passes = value === constraint.limitValue;
      break;
    default:
      return {
        status: "UNKNOWN",
        reason: `${prefix}:UNSUPPORTED_OPERATOR`,
      };
  }

  return passes
    ? { status: "PASS" }
    : {
        status: "FAIL",
        reason: `${prefix}:LIMIT_VIOLATED:${value}${constraint.operator}${constraint.limitValue}`,
      };
}

export function screenCandidate(
  candidate: DesignCandidate,
  constraints: ProjectConstraints,
): ScreeningResult {
  const failureReasons: string[] = [];
  const softPenalties = constraints.soft.map(
    (constraint) => `${constraint.layer}:${constraint.code}`,
  );
  const unknownReasons: string[] = [];

  // Un fallo explícito nunca puede entrar al Funnel.
  if (candidate.status === "FAILED") {
    failureReasons.push(
      ...(candidate.failureReasons.length > 0
        ? candidate.failureReasons
        : ["CANDIDATE_STATUS_FAILED"]),
    );

    return {
      candidateId: candidate.id,
      decision: "ARCHIVED",
      severity: "HARD",
      failureReasons,
      softPenalties,
      unknownReasons,
    };
  }

  // UNKNOWN no equivale a incumplimiento, pero tampoco a aprobación.
  if (candidate.status === "UNKNOWN") {
    unknownReasons.push(
      ...(candidate.unknowns.length > 0
        ? candidate.unknowns
        : ["CANDIDATE_STATUS_UNKNOWN"]),
    );
  }

  // Las restricciones duras se evalúan individualmente.
  for (const constraint of constraints.hard) {
    const evaluation = evaluateHardConstraint(candidate, constraint);

    if (evaluation.status === "FAIL") {
      failureReasons.push(evaluation.reason);
    } else if (evaluation.status === "UNKNOWN") {
      unknownReasons.push(evaluation.reason);
    }
  }

  if (failureReasons.length > 0) {
    return {
      candidateId: candidate.id,
      decision: "ARCHIVED",
      severity: "HARD",
      failureReasons,
      softPenalties,
      unknownReasons,
    };
  }

  if (unknownReasons.length > 0) {
    return {
      candidateId: candidate.id,
      decision: "HELD",
      severity: "UNKNOWN",
      failureReasons: [],
      softPenalties,
      unknownReasons,
    };
  }

  return {
    candidateId: candidate.id,
    decision: "SURVIVOR",
    severity: softPenalties.length > 0 ? "SOFT" : "NONE",
    failureReasons: [],
    softPenalties,
    unknownReasons: [],
  };
}

export function arkiArchitectDecision(
  candidates: DesignCandidate[],
  constraints: ProjectConstraints,
): {
  survivors: DesignCandidate[];
  archived: ScreeningResult[];
  held: ScreeningResult[];
} {
  const survivors: DesignCandidate[] = [];
  const archived: ScreeningResult[] = [];
  const held: ScreeningResult[] = [];

  for (const candidate of candidates) {
    const result = screenCandidate(candidate, constraints);

    if (result.decision === "SURVIVOR") {
      survivors.push({
        ...candidate,
        stage: "SURVIVOR",
        unknowns: [...candidate.unknowns, ...result.softPenalties],
      });
    } else if (result.decision === "ARCHIVED") {
      archived.push(result);
    } else {
      held.push(result);
    }
  }

  return { survivors, archived, held };
}
