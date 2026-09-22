import { ARKI_TYPOLOGIES, getArkiTypology, type ArkiTypology, type TypologyParameter } from "./arkiTypologyLibrary";
import { validateAgainstRne, type NormativeFact } from "./arkiNormativeEngine";
import { generateSpecializedGeometry } from "./arkiSpecializedGeometry";

export const ARKI_TYPOLOGY_EXECUTION_VERSION = "ARKI-TYPOLOGY-EXECUTION-1.0" as const;

export type TypologyExportFormat = "JSON" | "GEOJSON" | "SVG";
export type TypologyExecutionStatus = "AI_PROPOSED" | "HUMAN_REVIEW_REQUIRED";

export type TypologyGenerationInput = {
  typologyId: string;
  overrides?: Record<string, number | boolean | string>;
  country?: string;
  jurisdiction?: string;
};

export type TypologyGeneration = {
  executionVersion: typeof ARKI_TYPOLOGY_EXECUTION_VERSION;
  typology: Pick<ArkiTypology, "id" | "name" | "category" | "scale" | "description">;
  country: string;
  jurisdiction: string;
  parameters: Record<string, number | boolean | string>;
  specializedGeometry?: ReturnType<typeof generateSpecializedGeometry>;
  geometry: { kind: "RECTANGULAR_MASS"; widthM: number; depthM: number; heightM: number; floors: number };
  metrics: Record<string, number | string>;
  spaces: Array<{ name: string; areaM2: number; source: "DERIVED_CONCEPTUAL" }>;
  normativeFacts: NormativeFact[];
  evidenceRequired: string[];
  status: TypologyExecutionStatus;
  humanReviewRequired: true;
  projectStateMutation: "NOT_REQUESTED";
  professionalSignature: "REQUIRED_BEFORE_CONSTRUCTION";
};

export type TypologyValidation = {
  typologyId: string;
  country: string;
  validation: ReturnType<typeof validateAgainstRne>;
  status: TypologyExecutionStatus;
  humanReviewRequired: true;
  canonicalPromotion: "NOT_REQUESTED";
};

const numeric = (value: unknown, fallback: number) => typeof value === "number" && Number.isFinite(value) ? value : fallback;
const bool = (value: unknown, fallback: boolean) => typeof value === "boolean" ? value : fallback;

function parameterValue(parameter: TypologyParameter, overrides: Record<string, number | boolean | string>) {
  const value = overrides[parameter.key] ?? parameter.defaultValue;
  if (parameter.type === "number") {
    const n = numeric(value, numeric(parameter.defaultValue, 0));
    if (parameter.min !== undefined && n < parameter.min) throw new Error(`${parameter.key} must be >= ${parameter.min}`);
    if (parameter.max !== undefined && n > parameter.max) throw new Error(`${parameter.key} must be <= ${parameter.max}`);
    return n;
  }
  if (parameter.type === "boolean") return bool(value, Boolean(parameter.defaultValue));
  return String(value);
}

function categoryDefaults(typology: ArkiTypology, parameters: Record<string, number | boolean | string>) {
  const capacity = numeric(parameters.capacity, 100);
  const area = numeric(parameters.area_m2, 1000);
  const levels = numeric(parameters.levels, 2);
  const multipliers: Record<string, number> = {
    RESIDENTIAL: 32,
    EDUCATION: 12,
    HEALTH: 95,
    CULTURE: 18,
    SPORT: 8,
    OFFICE: 14,
    COMMERCE: 20,
    INDUSTRY: 30,
    TRANSPORT: 24,
    HOSPITALITY: 42,
    WORSHIP: 10,
    LANDSCAPE: 1,
    URBANISM: 1,
  };
  const derivedArea = Math.max(area, capacity * (multipliers[typology.category] ?? 20));
  const floorArea = typology.scale === "SITE" || typology.scale === "DISTRICT" || typology.scale === "CITY" ? derivedArea * 0.35 : derivedArea;
  const footprint = Math.max(25, floorArea / Math.max(levels, 1));
  const widthM = Math.max(5, Math.sqrt(footprint) * 1.35);
  const depthM = Math.max(5, footprint / widthM);
  const heightM = Math.max(3.2, levels * 3.2);
  return { capacity, area, levels, floorArea, widthM, depthM, heightM };
}

function conceptualSpaces(typology: ArkiTypology, floorArea: number, capacity: number) {
  const names: Record<string, string[]> = {
    RESIDENTIAL: ["Unidades y habitaciones", "Áreas comunes", "Circulaciones", "Servicios"],
    EDUCATION: ["Aulas y aprendizaje", "Administración", "Servicios", "Patios y exteriores"],
    HEALTH: ["Atención clínica", "Hospitalización", "Soporte técnico", "Circulaciones limpias y sucias"],
    CULTURE: ["Espacios públicos", "Salas principales", "Soporte y conservación", "Servicios"],
    SPORT: ["Área deportiva", "Gradas y público", "Servicios", "Operación"],
    OFFICE: ["Puestos de trabajo", "Reunión y colaboración", "Servicios", "Circulaciones"],
    COMMERCE: ["Área de venta", "Servicios", "Carga y descarga", "Circulaciones"],
    INDUSTRY: ["Producción o almacenamiento", "Logística", "Administración", "Servicios"],
    TRANSPORT: ["Público y espera", "Operación", "Andenes o plataforma", "Servicios"],
    HOSPITALITY: ["Habitaciones", "Áreas comunes", "Recreación", "Servicios"],
    WORSHIP: ["Espacio ritual", "Comunidad", "Servicios", "Circulaciones"],
    LANDSCAPE: ["Área verde", "Recorridos", "Estancia", "Gestión hídrica"],
    URBANISM: ["Usos urbanos", "Espacio público", "Redes e infraestructura", "Movilidad"],
  };
  const weights = [0.48, 0.2, 0.17, 0.15];
  return (names[typology.category] ?? names.CULTURE).map((name, i) => ({ name, areaM2: Math.round(floorArea * weights[i]), source: "DERIVED_CONCEPTUAL" as const }));
}

export function generateArkiTypology(input: TypologyGenerationInput): TypologyGeneration {
  const typology = getArkiTypology(input.typologyId);
  if (!typology) throw new Error("TYPOLOGY_NOT_FOUND");
  const overrides = input.overrides ?? {};
  const parameters = Object.fromEntries(typology.parameters.map((p) => [p.key, parameterValue(p, overrides)]));
  const derived = categoryDefaults(typology, parameters);
  const metrics: Record<string, number | string> = {
    areaConceptualM2: Math.round(derived.area),
    areaConstructedM2: Math.round(derived.floorArea),
    capacity: derived.capacity,
    levels: derived.levels,
    footprintM2: Math.round(derived.widthM * derived.depthM),
    estimatedCostUsdConceptual: Math.round(derived.floorArea * (typology.category === "HEALTH" ? 1800 : 1200)),
    costStatus: "CONCEPTUAL_ASSUMPTION_NOT_QUOTE",
  };
  const normativeFacts: NormativeFact[] = [
    { variable: "area_m2", value: derived.area, unit: "m²", source: "DERIVED_CONCEPTUAL" },
    { variable: "capacity", value: derived.capacity, unit: "persons", source: "USER_OR_DEFAULT" },
    { variable: "levels", value: derived.levels, unit: "levels", source: "USER_OR_DEFAULT" },
  ];
  return {
    executionVersion: ARKI_TYPOLOGY_EXECUTION_VERSION,
    typology: { id: typology.id, name: typology.name, category: typology.category, scale: typology.scale, description: typology.description },
    country: input.country ?? String(parameters.country ?? "PE"),
    jurisdiction: input.jurisdiction ?? "UNKNOWN",
    parameters,
    specializedGeometry: generateSpecializedGeometry(typology.id, parameters),
    geometry: { kind: "RECTANGULAR_MASS", widthM: Number(derived.widthM.toFixed(2)), depthM: Number(derived.depthM.toFixed(2)), heightM: Number(derived.heightM.toFixed(2)), floors: derived.levels },
    metrics,
    spaces: conceptualSpaces(typology, derived.floorArea, derived.capacity),
    normativeFacts,
    evidenceRequired: [...typology.evidenceRequired, "sitio_verificado", "normativa_vigente", "revisión_de_especialistas"],
    status: "AI_PROPOSED",
    humanReviewRequired: true,
    projectStateMutation: "NOT_REQUESTED",
    professionalSignature: "REQUIRED_BEFORE_CONSTRUCTION",
  };
}

export function validateArkiTypology(input: TypologyGenerationInput & { ruleIds?: string[] }): TypologyValidation {
  const generated = generateArkiTypology(input);
  return {
    typologyId: generated.typology.id,
    country: generated.country,
    validation: validateAgainstRne({ typology: generated.typology.id, facts: generated.normativeFacts, ruleIds: input.ruleIds }),
    status: "AI_PROPOSED",
    humanReviewRequired: true,
    canonicalPromotion: "NOT_REQUESTED",
  };
}

function tokens(text: string) { return new Set(text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(/[^a-z0-9]+/).filter((x) => x.length > 2)); }

export function searchArkiTypologies(query: string, category?: ArkiTypology["category"], topK = 10) {
  const q = tokens(query);
  return ARKI_TYPOLOGIES.filter((t) => !category || t.category === category).map((t) => {
    const haystack = tokens([t.name, t.description, t.category, t.ruleDomains.join(" "), t.metrics.join(" ")].join(" "));
    const score = Array.from(q).reduce((sum, token) => sum + (haystack.has(token) ? 1 : 0), 0) / Math.max(q.size, 1);
    return { typologyId: t.id, name: t.name, category: t.category, scale: t.scale, score: Number(score.toFixed(4)), matchedTokens: Array.from(q).filter((x) => haystack.has(x)) };
  }).filter((x) => x.score > 0 || q.size === 0).sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)).slice(0, Math.max(1, Math.min(topK, 50)));
}

export function exportArkiTypology(generation: TypologyGeneration, format: TypologyExportFormat) {
  const base = { formatVersion: ARKI_TYPOLOGY_EXECUTION_VERSION, generatedAt: new Date().toISOString(), generation };
  if (format === "JSON") return { fileName: `${generation.typology.id}.json`, mimeType: "application/json", content: JSON.stringify(base, null, 2) };
  if (format === "GEOJSON") {
    const { widthM, depthM } = generation.geometry;
    const coordinates = [[[0, 0], [widthM, 0], [widthM, depthM], [0, depthM], [0, 0]]];
    return { fileName: `${generation.typology.id}.geojson`, mimeType: "application/geo+json", content: JSON.stringify({ type: "FeatureCollection", features: [{ type: "Feature", properties: { typologyId: generation.typology.id, status: generation.status }, geometry: { type: "Polygon", coordinates } }] }, null, 2) };
  }
  const { widthM, depthM, heightM } = generation.geometry;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Math.max(widthM, 1)} ${Math.max(depthM, 1)}"><title>${generation.typology.name}</title><rect x="0" y="0" width="${widthM}" height="${depthM}" fill="#e67e22" fill-opacity=".18" stroke="#e67e22"/><text x="4" y="14" font-family="sans-serif" font-size="8">${generation.typology.name} · ${heightM.toFixed(1)} m</text></svg>`;
  return { fileName: `${generation.typology.id}.svg`, mimeType: "image/svg+xml", content: svg };
}

export function arkiTypologyExecutionSummary() {
  return { version: ARKI_TYPOLOGY_EXECUTION_VERSION, registeredTypologies: ARKI_TYPOLOGIES.length, generation: "CONCEPTUAL_RECTANGULAR_MASS", validation: "RNE_REFERENCE_RULES_WITH_UNKNOWN_STATE", semanticSearch: "LEXICAL_DETERMINISTIC_BASELINE", exports: ["JSON", "GEOJSON", "SVG"] as TypologyExportFormat[], gates: ["HUMAN_REVIEW", "PROFESSIONAL_SIGNATURE", "NO_CORE_MUTATION"] };
}
