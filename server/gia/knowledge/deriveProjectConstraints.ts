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

  // Capa 1 — Zonificación (dura): normativa aplicable
  const normative = validateAgainstRne({
    typology: input.project.typology,
    facts: input.facts,
  });

  for (const result of normative.results) {
    if (result.status === "FAIL") {
      hard.push({
        layer: "ZONING",
        severity: "HARD",
        code: result.ruleId,
        message: result.message,
        source: result.legalReference,
        evidenceRequired: true,
      });
    }
  }

  // Capa 1b — Restricciones duras por defecto (derivadas de jurisdicción y tipología)
  // Estas restricciones se aplican SIEMPRE, sin depender de los facts del proyecto.
  if (input.project.jurisdiction === "RNE-PE") {
    // Retiro frontal mínimo (RNE A.010): 3 m para vivienda, 5 m para comercio/salud
    const isResidential = input.project.typology.toLowerCase().includes("vivienda") || input.project.typology.toLowerCase().includes("residencial");
    const isHealthOrCommerce = input.project.typology.toLowerCase().includes("salud") || input.project.typology.toLowerCase().includes("comercio");
    const minRetiro = isHealthOrCommerce ? 5 : isResidential ? 3 : 4;

    hard.push({
      layer: "ZONING",
      severity: "HARD",
      code: "RNE-A.010-RETIRO-FRONTAL",
      message: `Retiro frontal mínimo ${minRetiro} m para tipología ${input.project.typology}.`,
      source: "RNE A.010 Art. 8 (referencia; verificar contra texto oficial)",
      evidenceRequired: true,
      limitValue: minRetiro,
      metricKey: "setbackM",
      operator: ">=",
    });

    // Altura máxima referencial por zonificación
    const maxFloors = isHealthOrCommerce ? 7 : isResidential ? 5 : 10;
    hard.push({
      layer: "ZONING",
      severity: "HARD",
      code: "RNE-A.010-ALTURA-MAX",
      message: `Altura máxima referencial ${maxFloors} pisos para tipología ${input.project.typology}.`,
      source: "RNE A.010 / zonificación referencial (verificar contra texto oficial)",
      evidenceRequired: true,
      limitValue: maxFloors,
      metricKey: "floors",
      operator: "<=",
    });

    // Coeficiente de ocupación máximo
    const maxCOS = isHealthOrCommerce ? 0.7 : isResidential ? 0.6 : 0.8;
    hard.push({
      layer: "ZONING",
      severity: "HARD",
      code: "RNE-A.010-COS-MAX",
      message: `Coeficiente de ocupación máximo ${maxCOS} para tipología ${input.project.typology}.`,
      source: "RNE A.010 / zonificación referencial (verificar contra texto oficial)",
      evidenceRequired: true,
      limitValue: maxCOS,
      metricKey: "footprintM2",
      operator: "<=",
    });
  }

  // Capa 2 — Tipología (dura): programa y capacidad
  if (input.programAreaM2 !== undefined && input.siteAreaM2 !== undefined) {
    const maxBuildable = input.siteAreaM2 * 2.5; // CUS aproximado
    if (input.programAreaM2 > maxBuildable) {
      hard.push({
        layer: "TYPOLOGY",
        severity: "HARD",
        code: "PROGRAM_EXCEEDS_CUS",
        message: `Programa (${input.programAreaM2} m²) excede la capacidad del sitio (${maxBuildable.toFixed(0)} m² con CUS 2.5).`,
        source: "RNE A.010 / CUS referencial",
        evidenceRequired: true,
      });
    }
  }

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
