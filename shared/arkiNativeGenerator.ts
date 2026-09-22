export const ARKI_NATIVE_GENERATOR_VERSION = "ARKI-NATIVE-GENERATOR-1.0" as const;

export type NativeTemplateId =
  | "COURTYARD_HOTEL"
  | "TROPICAL_STADIUM"
  | "URBAN_CORRIDOR"
  | "COMPACT_HOUSE"
  | "LANDSCAPE_CAMPUS"
  | "HOSPITAL_COMPLEX"
  | "INTERPROVINCIAL_TERMINAL";

export type NativeGeometry = {
  kind: "RECTANGULAR_MASS" | "COURTYARD_MASS";
  width: number;
  depth: number;
  height: number;
  floors: number;
  courtyardRatio: number;
};

export type NativeTemplate = {
  id: NativeTemplateId;
  name: string;
  description: string;
  geometry: NativeGeometry;
  tags: string[];
  assumptions: string[];
};

export type NativeAnalysis = {
  templateId: NativeTemplateId | null;
  metrics: {
    floorArea: number;
    conceptualBuiltArea: number;
    totalHeight: number;
    courtyardArea: number;
  };
  alerts: Array<{
    code: "CONCEPTUAL_ONLY" | "DIMENSION_OUT_OF_RANGE" | "COURTYARD_REVIEW" | "HEIGHT_REVIEW";
    severity: "INFO" | "WARNING";
    message: string;
  }>;
  humanReviewRequired: true;
};

export const ARKI_NATIVE_TEMPLATES: readonly NativeTemplate[] = [
  {
    id: "COURTYARD_HOTEL",
    name: "Hotel con patio bioclimático",
    description: "Masa con patio central y vegetación como punto de partida para alojamiento.",
    geometry: { kind: "COURTYARD_MASS", width: 64, depth: 48, height: 3.2, floors: 5, courtyardRatio: 0.28 },
    tags: ["hotel", "patio", "paisaje"],
    assumptions: ["Programa hotelero no definido", "Clima y normativa requieren evidencia local"],
  },
  {
    id: "TROPICAL_STADIUM",
    name: "Estadio tropical conceptual",
    description: "Envolvente compacta para estudiar cobertura, ventilación y flujos de un estadio.",
    geometry: { kind: "COURTYARD_MASS", width: 220, depth: 180, height: 12, floors: 3, courtyardRatio: 0.42 },
    tags: ["estadio", "Iquitos", "bioclimático"],
    assumptions: ["Aforo y evacuación requieren cálculo especializado", "No representa una solución estructural"],
  },
  {
    id: "URBAN_CORRIDOR",
    name: "Corredor urbano integrado",
    description: "Masa de referencia para explorar densidad, mezcla de usos y espacio público.",
    geometry: { kind: "COURTYARD_MASS", width: 180, depth: 70, height: 3.4, floors: 8, courtyardRatio: 0.18 },
    tags: ["ciudad", "movilidad", "espacio público"],
    assumptions: ["Escala urbana conceptual", "No sustituye un plan regulador"],
  },
  {
    id: "COMPACT_HOUSE",
    name: "Vivienda compacta",
    description: "Hipótesis inicial para vivienda de baja escala y rápida exploración.",
    geometry: { kind: "RECTANGULAR_MASS", width: 24, depth: 16, height: 3.2, floors: 2, courtyardRatio: 0.25 },
    tags: ["vivienda", "aprendizaje", "ARK"],
    assumptions: ["Distribución interior pendiente", "Predimensionamiento preliminar únicamente"],
  },
  {
    id: "LANDSCAPE_CAMPUS",
    name: "Campus paisajístico",
    description: "Masa baja con vacío interior para ensayar relaciones entre edificio y paisaje.",
    geometry: { kind: "COURTYARD_MASS", width: 96, depth: 72, height: 3.6, floors: 3, courtyardRatio: 0.35 },
    tags: ["campus", "paisaje", "cultura"],
    assumptions: ["Vegetación y agua se modelan como contexto posterior", "Requiere topografía real"],
  },
  {
    id: "HOSPITAL_COMPLEX",
    name: "Hospital de alta complejidad",
    description: "Masa con patio para explorar relaciones entre atención, soporte y paisaje terapéutico.",
    geometry: { kind: "COURTYARD_MASS", width: 128, depth: 96, height: 4.2, floors: 6, courtyardRatio: 0.24 },
    tags: ["hospital", "salud", "BIM", "MEP"],
    assumptions: ["Programa clínico, flujos limpio/sucio y gases medicinales pendientes", "Requiere coordinación profesional y normativa sanitaria vigente"],
  },
  {
    id: "INTERPROVINCIAL_TERMINAL",
    name: "Terminal terrestre interprovincial",
    description: "Masa de referencia para pasajeros, buses, carga, maniobras y separación de flujos.",
    geometry: { kind: "COURTYARD_MASS", width: 180, depth: 120, height: 5.5, floors: 3, courtyardRatio: 0.32 },
    tags: ["terminal", "movilidad", "buses", "carga"],
    assumptions: ["Aforo, radios de giro y demanda deben verificarse con datos de tránsito", "No sustituye simulación de movilidad ni revisión de evacuación"],
  },
];

export function getNativeTemplate(id: NativeTemplateId) {
  return ARKI_NATIVE_TEMPLATES.find((template) => template.id === id) ?? null;
}

export function analyzeNativeGeometry(geometry: NativeGeometry, templateId: NativeTemplateId | null = null): NativeAnalysis {
  const floorArea = Math.max(0, geometry.width * geometry.depth);
  const courtyardArea = geometry.kind === "COURTYARD_MASS" ? floorArea * Math.max(0, Math.min(1, geometry.courtyardRatio)) : 0;
  const conceptualBuiltArea = floorArea * geometry.floors - courtyardArea * geometry.floors;
  const alerts: NativeAnalysis["alerts"] = [
    { code: "CONCEPTUAL_ONLY", severity: "INFO", message: "Resultado conceptual: requiere programa, normativa y revisión profesional." },
  ];
  if (geometry.width < 8 || geometry.depth < 8 || geometry.floors < 1 || geometry.height <= 0) {
    alerts.push({ code: "DIMENSION_OUT_OF_RANGE", severity: "WARNING", message: "Una o más dimensiones están fuera del rango paramétrico básico." });
  }
  if (geometry.kind === "COURTYARD_MASS" && geometry.courtyardRatio > 0.5) {
    alerts.push({ code: "COURTYARD_REVIEW", severity: "WARNING", message: "La proporción de patio supera 50 % y requiere revisión de programa y estructura." });
  }
  if (geometry.height * geometry.floors > 36) {
    alerts.push({ code: "HEIGHT_REVIEW", severity: "WARNING", message: "La altura total supera 36 m y requiere revisión normativa, estructural y de evacuación." });
  }
  return {
    templateId,
    metrics: {
      floorArea: Number(floorArea.toFixed(2)),
      conceptualBuiltArea: Number(Math.max(0, conceptualBuiltArea).toFixed(2)),
      totalHeight: Number((geometry.height * geometry.floors).toFixed(2)),
      courtyardArea: Number(courtyardArea.toFixed(2)),
    },
    alerts,
    humanReviewRequired: true,
  };
}

export function nativeGeneratorSecurityContract() {
  return {
    version: ARKI_NATIVE_GENERATOR_VERSION,
    execution: "DETERMINISTIC_FIRST_PARTY_GRAPHS_ONLY",
    thirdPartyCodeExecution: "DISABLED",
    humanReviewRequired: true,
    projectStateMutation: "EXPLICIT_SAVE_ONLY",
    externalHosts: "REQUIRED_FOR_NATIVE_RVT_GH_BLEND",
  } as const;
}

export function nativeTemplateSummary() {
  return {
    version: ARKI_NATIVE_GENERATOR_VERSION,
    templates: ARKI_NATIVE_TEMPLATES.length,
    ids: ARKI_NATIVE_TEMPLATES.map((template) => template.id),
    security: nativeGeneratorSecurityContract(),
  };
}
