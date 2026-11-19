/**
 * ARKI — Métricas cuantitativas con trazabilidad epistémica.
 *
 * Los valores conceptuales no equivalen a resultados verificados.
 * Un valor numérico igual a cero es válido y no significa ausencia.
 */

export type MetricMethod =
  | "CALCULATED"
  | "ESTIMATED"
  | "PROXY"
  | "UNAVAILABLE";

export type MetricEvidenceLevel =
  | "VERIFIED"
  | "CONCEPTUAL"
  | "NONE";

export interface TracedMetric {
  value: number | null;
  unit: string;
  method: MetricMethod;
  evidenceLevel: MetricEvidenceLevel;
  provenance: string;
  evidenceRefs: string[];
  limitations: string[];
}

export interface CandidateTracedMetrics {
  footprintM2: TracedMetric;
  builtAreaM2: TracedMetric;
  capacity: TracedMetric;
  estimatedCostUsdConceptual: TracedMetric;
  efficiencyRatio: TracedMetric;
  costPerM2: TracedMetric;
  capacityPerM2: TracedMetric;
  complianceScore: TracedMetric;
  energyUseIntensity: TracedMetric;
  waterUseIntensity: TracedMetric;
  carbonFootprint: TracedMetric;
  structuralEfficiency: TracedMetric;
}

export type GeneratedMetricValues = Partial<
  Record<keyof CandidateTracedMetrics, number | null | undefined>
>;

type MetricDefinition = {
  unit: string;
  method: Exclude<MetricMethod, "UNAVAILABLE">;
  limitations: string[];
};

const DEFINITIONS: Record<keyof CandidateTracedMetrics, MetricDefinition> = {
  footprintM2: {
    unit: "m²",
    method: "CALCULATED",
    limitations: ["Geometría conceptual; no equivale a levantamiento verificado."],
  },
  builtAreaM2: {
    unit: "m²",
    method: "CALCULATED",
    limitations: ["Resultado del generador; requiere validación de áreas por nivel."],
  },
  capacity: {
    unit: "personas",
    method: "ESTIMATED",
    limitations: ["Capacidad conceptual; requiere programa y aforo normativo."],
  },
  estimatedCostUsdConceptual: {
    unit: "USD",
    method: "PROXY",
    limitations: ["Costo conceptual; no equivale a presupuesto ni cotización."],
  },
  efficiencyRatio: {
    unit: "ratio",
    method: "PROXY",
    limitations: ["La razón geométrica no demuestra eficiencia funcional."],
  },
  costPerM2: {
    unit: "USD/m²",
    method: "PROXY",
    limitations: ["Deriva de costo conceptual; no es costo comprobado."],
  },
  capacityPerM2: {
    unit: "personas/m²",
    method: "ESTIMATED",
    limitations: ["Densidad conceptual; requiere validación del uso y normativa."],
  },
  complianceScore: {
    unit: "score",
    method: "PROXY",
    limitations: ["Cobertura de reglas del generador; no demuestra cumplimiento normativo."],
  },
  energyUseIntensity: {
    unit: "UNVERIFIED_UNIT",
    method: "PROXY",
    limitations: ["No existe simulación energética validada en este generador."],
  },
  waterUseIntensity: {
    unit: "UNVERIFIED_UNIT",
    method: "PROXY",
    limitations: ["No existe cálculo hidráulico validado en este generador."],
  },
  carbonFootprint: {
    unit: "UNVERIFIED_UNIT",
    method: "PROXY",
    limitations: ["No existe análisis de ciclo de vida validado."],
  },
  structuralEfficiency: {
    unit: "UNVERIFIED_UNIT",
    method: "PROXY",
    limitations: ["No equivale a cálculo o verificación estructural."],
  },
};

export function traceCandidateMetrics(
  source: GeneratedMetricValues,
  sourcePath = "generatedBuilding.metrics",
): CandidateTracedMetrics {
  const result = {} as CandidateTracedMetrics;

  for (const key of Object.keys(DEFINITIONS) as Array<keyof CandidateTracedMetrics>) {
    const definition = DEFINITIONS[key];
    const rawValue = source[key];
    const valid = typeof rawValue === "number" && Number.isFinite(rawValue);

    result[key] = {
      value: valid ? rawValue : null,
      unit: definition.unit,
      method: valid ? definition.method : "UNAVAILABLE",
      evidenceLevel: valid ? "CONCEPTUAL" : "NONE",
      provenance: `${sourcePath}.${key}`,
      evidenceRefs: [],
      limitations: valid
        ? [...definition.limitations]
        : ["Dato ausente o no numérico; no debe sustituirse por cero."],
    };
  }

  return result;
}
