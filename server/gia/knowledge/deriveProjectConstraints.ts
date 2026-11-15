/**
 * Deriva las restricciones del proyecto para el screening de ideas.
 *
 * Cuatro capas:
 * - ZONING (dura): normativa RNE aplicable (retiros, altura, coeficiente).
 * - TYPOLOGY (dura): programa y capacidad del programa.
 * - SUN (blanda): orientación solar del contexto.
 * - WIND (blanda): ventilación natural del contexto.
 *
 * No es un screening ciego. Es la base para que ARKI decida como arquitecto.
 */

import { validateAgainstRne, type NormativeFact, type NormativeResult } from "../../../shared/arkiNormativeEngine";

export type ConstraintLayer = "ZONING" | "TYPOLOGY" | "SUN" | "WIND";
export type ConstraintSeverity = "HARD" | "SOFT";

export type ProjectConstraint = {
  layer: ConstraintLayer;
  severity: ConstraintSeverity;
  code: string;
  message: string;
  source: string;
  evidenceRequired: boolean;
  /** Valor numérico de la restricción (para comparación en el screening). */
  limitValue?: number;
  /** Variable del candidato contra la que se compara (ej: "floors", "heightM", "footprintM2"). */
  metricKey?: string;
  /** Operador de comparación: "<=", ">=", "==". */
  operator?: "<=" | ">=" | "==";
};

export type ProjectConstraints = {
  hard: ProjectConstraint[];
  soft: ProjectConstraint[];
  normativeResults: NormativeResult[];
};

export type ProjectContext = {
  sunAzimuthDeg?: number;
  sunElevationDeg?: number;
  windDirection?: string;
  windSpeedMs?: number;
};

export function deriveProjectConstraints(input: {
  project: { projectId: string; typology: string; jurisdiction?: string; location?: string };
  context: ProjectContext;
  facts: NormativeFact[];
  programAreaM2?: number;
  siteAreaM2?: number;
}): ProjectConstraints {
  const hard: ProjectConstraint[] = [];
  const soft: ProjectConstraint[] = [];

  // Capa normativa:
  // El catálogo RNE disponible está marcado REFERENCE_SEED.
  // Sus resultados se conservan para revisión y trazabilidad,
  // pero no se convierten automáticamente en restricciones duras.
  // Una referencia provisional no constituye una infracción legal
  // ni una autorización para descartar un candidato.
  const normative = validateAgainstRne({
    typology: input.project.typology,
    facts: input.facts,
  });

  // No se derivan límites genéricos de retiro, altura, COS o CUS.
  // Para incorporarlos se requiere una fuente oficial vigente,
  // jurisdicción y zonificación aplicables, evidencia del predio,
  // variable geométrica compatible y unidades verificadas.
  //
  // Tampoco se compara área de programa con área de terreno:
  // son magnitudes distintas y no existe aquí un CUS verificado.

  // Capa 3 — Asoleamiento (blanda): orientación solar
  if (input.context.sunAzimuthDeg !== undefined) {
    const azimuth = input.context.sunAzimuthDeg;
    // Fachada principal entre 135° y 225° (sur-este a sur-oeste) recibe sol directo en el hemisferio sur
    if (azimuth >= 135 && azimuth <= 225) {
      soft.push({
        layer: "SUN",
        severity: "SOFT",
        code: "SUN_DIRECT_SOUTH_EXPOSURE",
        message: `Fachada orientada al sur (${azimuth}°) recibe sol directo. Penalización por ganancias térmicas.`,
        source: "Design knowledge: Ching, Brown & DeKay (Sun, Wind & Light)",
        evidenceRequired: false,
      });
    }
  }

  // Capa 4 — Vientos (blanda): ventilación natural
  if (input.context.windDirection !== undefined) {
    soft.push({
      layer: "WIND",
      severity: "SOFT",
      code: "WIND_VENTILATION_CHECK",
      message: `Verificar ventilación natural con viento desde ${input.context.windDirection}.`,
      source: "Design knowledge: Brown & DeKay (Sun, Wind & Light)",
      evidenceRequired: false,
    });
  }

  return { hard, soft, normativeResults: normative.results };
}
