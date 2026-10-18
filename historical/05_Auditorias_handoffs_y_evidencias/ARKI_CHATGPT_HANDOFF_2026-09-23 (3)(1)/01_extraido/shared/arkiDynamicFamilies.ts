import { generateConstructionModel, type ConstructionModel } from "./arkiConstructionOntology";

export type FamilyCategory = "SALUD" | "EDUCATION" | "COMMERCE" | "SPORT" | "OFFICES" | "LANDSCAPE" | "INDUSTRY" | "TRANSPORT" | "CULTURE" | "RESIDENTIAL" | "HOSPITALITY" | "WORSHIP";
export type BuildingScale = "BUILDING" | "COMPLEX" | "URBAN";
export type RuleOperator = "MIN" | "MAX" | "EXACT" | "REQUIRED";

export type FamilyParameter = {
  id: string;
  label: string;
  type: "number" | "string" | "boolean";
  unit?: string;
  defaultValue: string | number | boolean;
  min?: number;
  max?: number;
};

export type FamilyVariant = {
  id: string;
  name: string;
  description: string;
  capacityUnit: string;
  modifiers: Record<string, string | number | boolean>;
  programExtra: string[];
  ruleIds: string[];
  tags: string[];
};

export type FamilyRule = {
  id: string;
  code: string;
  description: string;
  parameter: string;
  operator: RuleOperator;
  value?: number | string | boolean;
  unit?: string;
  source: string;
  required: boolean;
};

export type FamilyProgram = {
  zones: Array<{ id: string; name: string; areaRatio: number }>;
  primarySpaces: string[];
  services: string[];
  circulations: string[];
};

export type BuildingContext = {
  country: string;
  region?: string;
  city?: string;
  climate?: string;
  seismicZone?: string;
  jurisdiction?: string;
};

export type DynamicBuildingFamily = {
  id: string;
  name: string;
  description: string;
  category: FamilyCategory;
  scale: BuildingScale;
  version: string;
  baseProgram: FamilyProgram;
  variants: FamilyVariant[];
  baseParameters: FamilyParameter[];
  baseRules: FamilyRule[];
  geometryStrategy: "COURTYARD_MASS" | "LINEAR_MASS" | "ARENA_BOWL" | "PODIUM_TOWER";
  tags: string[];
};

export type GeneratedBuilding = {
  id: string;
  familyId: string;
  variantId: string;
  name: string;
  context: BuildingContext;
  parameters: Record<string, string | number | boolean>;
  program: FamilyProgram;
  rules: FamilyRule[];
  geometry2d: { type: string; footprintM2: number; widthM: number; depthM: number; courtyardM2?: number; rings?: number };
  section: { type: string; floors: number; floorHeightM: number; totalHeightM: number; usesByFloor: string[] };
  geometry3d: { type: string; floors: number; heightM: number; massing: string };
  unifiedGeometry: { schema: "ARKI-UNIFIED-GEOMETRY-1.0"; plan: GeneratedBuilding["geometry2d"]; section: GeneratedBuilding["section"]; model3d: GeneratedBuilding["geometry3d"] };
  metrics: { footprintM2: number; builtAreaM2: number; capacity: number; estimatedCostUsdConceptual: number };
  constructionModel?: ConstructionModel;
  validation: { status: "PASS" | "UNKNOWN" | "BLOCKED"; checked: string[]; unknowns: string[] };
  alerts: Array<{ code: string; message: string; severity: "INFO" | "WARNING" | "BLOCKER" }>;
  status: "GENERATED_CANDIDATE";
  humanReviewRequired: true;
  projectStateMutation: "NOT_REQUESTED";
};

const p = (id: string, label: string, defaultValue: string | number | boolean, extra: Partial<FamilyParameter> = {}): FamilyParameter => ({ id, label, type: typeof defaultValue as FamilyParameter["type"], defaultValue, ...extra });
const rule = (id: string, code: string, description: string, parameter: string, operator: RuleOperator, value: number | string | boolean | undefined, source: string): FamilyRule => ({ id, code, description, parameter, operator, value, source, required: true });
const program = (primarySpaces: string[], services: string[], circulations: string[]): FamilyProgram => ({ zones: [{ id: "PUBLIC", name: "Área pública", areaRatio: 0.25 }, { id: "SERVICE", name: "Área de servicio", areaRatio: 0.15 }, { id: "PRIMARY", name: "Área principal", areaRatio: 0.6 }], primarySpaces, services, circulations });

const baseParameters = [p("areaM2", "Área del terreno", 10000, { unit: "m²", min: 100 }), p("capacity", "Capacidad", 300, { unit: "personas", min: 1 }), p("floors", "Niveles", 2, { unit: "niveles", min: 1, max: 80 }), p("courtyardRatio", "Proporción de vacío", 0.08, { unit: "ratio", min: 0, max: 0.8 })];
const baseRules = [rule("GEN-EGRESS", "RNE-A.130", "Aforo y evacuación requieren validación del proyecto.", "egressValidated", "REQUIRED", true, "RNE de referencia; especialista")];

function family(input: { id: string; name: string; category: FamilyCategory; description: string; geometryStrategy: DynamicBuildingFamily["geometryStrategy"]; scale?: BuildingScale; tags: string[]; primary: string[]; services: string[]; variants: Array<{ id: string; name: string; description: string; tags: string[]; extra?: string[]; modifiers?: Record<string, string | number | boolean> }> }): DynamicBuildingFamily {
  return {
    id: input.id,
    name: input.name,
    description: input.description,
    category: input.category,
    scale: input.scale ?? (input.category === "LANDSCAPE" ? "URBAN" : "COMPLEX"),
    version: "1.0.0",
    baseProgram: program(input.primary, input.services, ["público", "personal", "servicio", "evacuación"]),
    variants: input.variants.map((variant) => ({ id: variant.id, name: variant.name, description: variant.description, capacityUnit: "usuarios", modifiers: { floors: 2, courtyardRatio: 0.08, capacity: 300, ...(variant.modifiers ?? {}) }, programExtra: variant.extra ?? [], ruleIds: ["GEN-EGRESS"], tags: variant.tags })),
    baseParameters,
    baseRules,
    geometryStrategy: input.geometryStrategy,
    tags: input.tags,
  };
}

export const DYNAMIC_BUILDING_FAMILIES: DynamicBuildingFamily[] = [
  family({ id: "FAM-HEALTH", name: "Salud", category: "SALUD", description: "Hospitales, clínicas y centros de atención con flujos segregados.", geometryStrategy: "PODIUM_TOWER", tags: ["hospital", "clínica", "RNE-A.050"], primary: ["consultorios", "hospitalización", "diagnóstico", "emergencia"], services: ["farmacia", "laboratorio", "residuos", "mantenimiento"], variants: [{ id: "GENERAL", name: "Hospital general", description: "Atención integral con emergencia y hospitalización.", tags: ["hospital"], extra: ["emergencia", "UCI"], modifiers: { areaM2: 20000, capacity: 400, floors: 4 } }, { id: "CLINIC", name: "Clínica ambulatoria", description: "Consultas y procedimientos de corta estancia.", tags: ["clínica"], extra: ["imagenología", "procedimientos"], modifiers: { areaM2: 6500, capacity: 180, floors: 3 } }, { id: "COMMUNITY", name: "Centro comunitario", description: "Atención primaria cercana y flexible.", tags: ["primaria"], extra: ["tópico", "promoción de salud"], modifiers: { areaM2: 1800, capacity: 80, floors: 2 } }] }),
  family({ id: "FAM-EDUCATION", name: "Educación", category: "EDUCATION", description: "Escuelas y campus que combinan aprendizaje, comunidad y patios.", geometryStrategy: "COURTYARD_MASS", tags: ["colegio", "campus", "educación"], primary: ["aulas", "laboratorios", "biblioteca", "comedor"], services: ["administración", "cocina", "almacén", "portería"], variants: [{ id: "SCHOOL", name: "Colegio", description: "Comunidad educativa de escala barrial.", tags: ["escuela"], extra: ["patio cívico", "losa deportiva"], modifiers: { areaM2: 9000, capacity: 900, floors: 3 } }, { id: "CAMPUS", name: "Campus superior", description: "Conjunto académico con espacios de encuentro.", tags: ["universidad"], extra: ["talleres", "auditorio"], modifiers: { areaM2: 30000, capacity: 4000, floors: 5 } }, { id: "EARLY", name: "Primera infancia", description: "Aprendizaje temprano con escala protegida.", tags: ["inicial"], extra: ["jardín sensorial", "psicomotricidad"], modifiers: { areaM2: 3500, capacity: 240, floors: 2 } }] }),
  family({ id: "FAM-COMMERCE", name: "Comercio", category: "COMMERCE", description: "Mercados, retail y galerías para intercambio urbano.", geometryStrategy: "LINEAR_MASS", tags: ["retail", "mercado", "comercio"], primary: ["ventas", "exhibición", "patio de comidas"], services: ["carga", "residuos", "administración"], variants: [{ id: "MARKET", name: "Mercado", description: "Mercado público de productos y encuentro.", tags: ["mercado"], extra: ["cámaras frigoríficas", "plaza de acceso"], modifiers: { areaM2: 8000, capacity: 1400, floors: 2 } }, { id: "RETAIL", name: "Centro retail", description: "Comercio contemporáneo de mediana escala.", tags: ["retail"], extra: ["anclas", "estacionamiento"], modifiers: { areaM2: 18000, capacity: 2600, floors: 3 } }, { id: "GALLERY", name: "Galería barrial", description: "Frente activo con unidades comerciales flexibles.", tags: ["barrial"], extra: ["terrazas", "servicios comunes"], modifiers: { areaM2: 3000, capacity: 500, floors: 3 } }] }),
  family({ id: "FAM-SPORT", name: "Deporte", category: "SPORT", description: "Complejos deportivos, estadios y centros acuáticos.", geometryStrategy: "ARENA_BOWL", tags: ["deporte", "estadio", "recreación"], primary: ["cancha", "graderías", "salas deportivas"], services: ["vestuarios", "control", "primeros auxilios"], variants: [{ id: "ARENA", name: "Arena multiuso", description: "Recinto flexible para deporte y eventos.", tags: ["arena"], extra: ["graderías", "backstage"], modifiers: { areaM2: 22000, capacity: 9000, floors: 3 } }, { id: "AQUATIC", name: "Centro acuático", description: "Piscinas competitivas y recreativas.", tags: ["piscina"], extra: ["graderías", "sala técnica"], modifiers: { areaM2: 12000, capacity: 1800, floors: 2 } }, { id: "NEIGHBORHOOD", name: "Polideportivo", description: "Equipamiento deportivo comunitario.", tags: ["barrio"], extra: ["cancha cubierta", "salón múltiple"], modifiers: { areaM2: 6500, capacity: 750, floors: 2 } }] }),
  family({ id: "FAM-OFFICES", name: "Oficinas", category: "OFFICES", description: "Espacios de trabajo, innovación y colaboración.", geometryStrategy: "PODIUM_TOWER", tags: ["oficina", "coworking", "corporativo"], primary: ["área de trabajo", "salas", "lounge", "terraza"], services: ["recepción", "cuarto técnico", "comedor"], variants: [{ id: "CORPORATE", name: "Torre corporativa", description: "Oficinas de alta densidad y servicios comunes.", tags: ["corporativo"], extra: ["sky lobby", "auditorio"], modifiers: { areaM2: 24000, capacity: 2200, floors: 12 } }, { id: "COWORK", name: "Coworking", description: "Trabajo flexible y comunidad creativa.", tags: ["flexible"], extra: ["cabinas", "eventos"], modifiers: { areaM2: 6000, capacity: 650, floors: 5 } }, { id: "CIVIC", name: "Oficina pública", description: "Atención y administración pública.", tags: ["cívica"], extra: ["módulos de atención", "archivo"], modifiers: { areaM2: 10000, capacity: 900, floors: 4 } }] }),
  family({ id: "FAM-LANDSCAPE", name: "Paisajismo", category: "LANDSCAPE", description: "Parques, plazas, malecones, corredores verdes y humedales.", geometryStrategy: "COURTYARD_MASS", scale: "URBAN", tags: ["paisajismo", "parque", "espacio público"], primary: ["áreas verdes", "senderos", "estancias", "equipamiento"], services: ["riego", "bombas", "servicios higiénicos"], variants: [{ id: "URBAN_PARK", name: "Parque urbano", description: "Parque de barrio con recreación y vegetación.", tags: ["parque", "verde"], extra: ["juegos infantiles", "ciclovía"], modifiers: { areaM2: 20000, capacity: 5000, floors: 1 } }, { id: "PUBLIC_PLAZA", name: "Plaza pública", description: "Plaza cívica y cultural.", tags: ["plaza", "cívica"], extra: ["fuente", "pavimento cívico"], modifiers: { areaM2: 5000, capacity: 2000, floors: 1 } }, { id: "WETLAND", name: "Humedal artificial", description: "Humedal para tratamiento y biodiversidad.", tags: ["humedal", "agua"], extra: ["sendero interpretativo", "mirador de aves"], modifiers: { areaM2: 50000, capacity: 500, floors: 1 } }] }),
  family({ id: "FAM-INDUSTRY", name: "Industria", category: "INDUSTRY", description: "Manufactura, almacenes y centros logísticos.", geometryStrategy: "LINEAR_MASS", tags: ["industria", "manufactura", "logística"], primary: ["producción", "almacén", "patio de maniobras"], services: ["vestuarios", "cuarto eléctrico", "control de calidad"], variants: [{ id: "WAREHOUSE", name: "Almacén simple", description: "Almacén de mercancías secas.", tags: ["almacén"], extra: ["racks", "muelles"], modifiers: { areaM2: 3000, capacity: 100, floors: 1 } }, { id: "LOGISTICS", name: "Centro logístico", description: "Distribución multi-almacén.", tags: ["logística"], extra: ["muelles múltiples", "patio de maniobras"], modifiers: { areaM2: 25000, capacity: 850, floors: 1 } }, { id: "MANUFACTURING", name: "Planta de manufactura", description: "Producción industrial con control de calidad.", tags: ["manufactura"], extra: ["líneas de producción", "laboratorio"], modifiers: { areaM2: 15000, capacity: 900, floors: 2 } }] }),
  family({ id: "FAM-TRANSPORT", name: "Transporte", category: "TRANSPORT", description: "Terminales, estaciones y nodos intermodales.", geometryStrategy: "LINEAR_MASS", tags: ["transporte", "terminal", "intermodal"], primary: ["vestíbulo", "andenes", "circulación pública"], services: ["control", "equipaje", "mantenimiento"], variants: [{ id: "BUS_TERMINAL", name: "Terminal terrestre", description: "Terminal de buses interprovincial.", tags: ["buses"], extra: ["andenes", "salas de espera"], modifiers: { areaM2: 18000, capacity: 2500, floors: 2 } }, { id: "STATION", name: "Estación intermodal", description: "Intercambio de modos de transporte.", tags: ["intermodal"], extra: ["conexión peatonal", "bicicletas"], modifiers: { areaM2: 12000, capacity: 4000, floors: 3 } }, { id: "AIRPORT", name: "Terminal aeroportuaria", description: "Terminal de pasajeros con controles.", tags: ["aeropuerto"], extra: ["check-in", "seguridad", "mangas"], modifiers: { areaM2: 60000, capacity: 12000, floors: 3 } }] }),
  family({ id: "FAM-CULTURE", name: "Cultura", category: "CULTURE", description: "Museos, bibliotecas, teatros y centros culturales.", geometryStrategy: "COURTYARD_MASS", tags: ["cultura", "museo", "teatro"], primary: ["exposición", "auditorio", "espacio comunitario"], services: ["carga cultural", "conservación", "taquilla"], variants: [{ id: "MUSEUM", name: "Museo", description: "Museo con galerías y conservación.", tags: ["museo"], extra: ["galerías", "depósitos"], modifiers: { areaM2: 8000, capacity: 700, floors: 3 } }, { id: "LIBRARY", name: "Biblioteca", description: "Biblioteca pública de aprendizaje continuo.", tags: ["biblioteca"], extra: ["mediateca", "maker space"], modifiers: { areaM2: 5000, capacity: 500, floors: 3 } }, { id: "THEATER", name: "Teatro", description: "Artes escénicas y encuentro ciudadano.", tags: ["teatro"], extra: ["escenario", "camerinos"], modifiers: { areaM2: 10000, capacity: 1200, floors: 4 } }] }),
  family({ id: "FAM-RESIDENTIAL", name: "Residencial", category: "RESIDENTIAL", description: "Vivienda colectiva, conjuntos y residencias compactas.", geometryStrategy: "COURTYARD_MASS", tags: ["vivienda", "residencial", "departamentos"], primary: ["unidades", "áreas comunes", "jardín"], services: ["conserjería", "lavandería", "cuarto técnico"], variants: [{ id: "MIDRISE", name: "Conjunto medio", description: "Vivienda colectiva con patio común.", tags: ["conjunto"], extra: ["juegos", "salón vecinal"], modifiers: { areaM2: 14000, capacity: 420, floors: 6 } }, { id: "TOWER", name: "Torre residencial", description: "Densidad vertical con amenidades.", tags: ["torre"], extra: ["roof garden", "gimnasio"], modifiers: { areaM2: 18000, capacity: 600, floors: 16 } }, { id: "SOCIAL", name: "Vivienda social", description: "Conjunto eficiente y accesible.", tags: ["social"], extra: ["patio productivo", "guardería"], modifiers: { areaM2: 10000, capacity: 360, floors: 5 } }] }),
  family({ id: "FAM-HOSPITALITY", name: "Hospitalidad", category: "HOSPITALITY", description: "Hoteles, hostales y resorts orientados a la experiencia.", geometryStrategy: "PODIUM_TOWER", tags: ["hotel", "turismo", "hospitalidad"], primary: ["habitaciones", "lobby", "restaurante", "eventos"], services: ["cocina", "housekeeping", "lavandería"], variants: [{ id: "BUSINESS", name: "Hotel ejecutivo", description: "Hospedaje conectado a negocios y movilidad.", tags: ["negocios"], extra: ["salas de reunión", "business lounge"], modifiers: { areaM2: 16000, capacity: 450, floors: 10 } }, { id: "RESORT", name: "Resort", description: "Hospitalidad de ocio integrada al paisaje.", tags: ["resort"], extra: ["piscina", "spa", "club infantil"], modifiers: { areaM2: 30000, capacity: 700, floors: 5 } }, { id: "HOSTEL", name: "Hostal urbano", description: "Hospedaje compacto para estancias cortas.", tags: ["hostal"], extra: ["cocina común", "terraza"], modifiers: { areaM2: 4500, capacity: 180, floors: 5 } }] }),
  family({ id: "FAM-WORSHIP", name: "Culto", category: "WORSHIP", description: "Espacios de recogimiento, reunión y comunidad.", geometryStrategy: "ARENA_BOWL", tags: ["culto", "comunidad", "espiritual"], primary: ["nave", "sala de reunión", "patio ceremonial"], services: ["sacristía", "oficina", "mantenimiento"], variants: [{ id: "TEMPLE", name: "Templo comunitario", description: "Espacio de culto y encuentro vecinal.", tags: ["templo"], extra: ["salón comunal", "jardín"], modifiers: { areaM2: 3500, capacity: 700, floors: 2 } }, { id: "CATHEDRAL", name: "Gran nave", description: "Espacio ceremonial de gran escala.", tags: ["gran escala"], extra: ["capillas", "órgano"], modifiers: { areaM2: 9000, capacity: 1800, floors: 2 } }, { id: "MULTIFAITH", name: "Centro multiconfesional", description: "Comunidad flexible y plural.", tags: ["plural"], extra: ["salas de reflexión", "cocina comunitaria"], modifiers: { areaM2: 5000, capacity: 850, floors: 3 } }] }),
];

export function listDynamicFamilies(category?: FamilyCategory) { return category ? DYNAMIC_BUILDING_FAMILIES.filter((item) => item.category === category) : DYNAMIC_BUILDING_FAMILIES; }
export function searchDynamicFamilies(query: string) { const normalized = query.trim().toLowerCase(); if (!normalized) return DYNAMIC_BUILDING_FAMILIES; return DYNAMIC_BUILDING_FAMILIES.filter((item) => [item.name, item.description, item.category, ...item.tags, ...item.variants.flatMap((variant) => [variant.name, variant.description, ...variant.tags])].join(" ").toLowerCase().includes(normalized)); }
export function familyOptions() { return DYNAMIC_BUILDING_FAMILIES.map((item) => ({ id: item.id, name: item.name, category: item.category, variantCount: item.variants.length })); }
export function dynamicFamilySummary() { return { schema: "ARKI-DYNAMIC-FAMILIES-1.0", familyCount: DYNAMIC_BUILDING_FAMILIES.length, variantCount: DYNAMIC_BUILDING_FAMILIES.reduce((sum, item) => sum + item.variants.length, 0), categories: Array.from(new Set(DYNAMIC_BUILDING_FAMILIES.map((item) => item.category))), inventoryStatus: "ROOT_FAMILIES_AND_VARIANTS_IMPLEMENTED; EXPANSION_PENDING" as const }; }

const safeNumber = (value: unknown, fallback: number) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const round = (value: number, digits = 1) => Number(value.toFixed(digits));

export function generateDynamicBuilding(input: { familyId: string; variantId: string; context?: Partial<BuildingContext>; parameters?: Record<string, string | number | boolean> }): GeneratedBuilding {
  const selectedFamily = DYNAMIC_BUILDING_FAMILIES.find((item) => item.id === input.familyId) ?? DYNAMIC_BUILDING_FAMILIES[0];
  const selectedVariant = selectedFamily.variants.find((item) => item.id === input.variantId) ?? selectedFamily.variants[0];
  const raw = { ...selectedVariant.modifiers, ...(input.parameters ?? {}) };
  const areaM2 = Math.max(100, safeNumber(raw.areaM2, 10000));
  const capacity = Math.max(1, Math.round(safeNumber(raw.capacity, 300)));
  const floors = Math.max(1, Math.min(80, Math.round(safeNumber(raw.floors, 2))));
  const courtyardRatio = Math.max(0, Math.min(0.8, safeNumber(raw.courtyardRatio, 0.08)));
  const aspect = selectedFamily.geometryStrategy === "LINEAR_MASS" ? 2.1 : selectedFamily.geometryStrategy === "PODIUM_TOWER" ? 1.35 : 1.55;
  const widthM = Math.max(12, Math.sqrt(areaM2 * aspect));
  const depthM = Math.max(12, areaM2 / widthM);
  const footprintM2 = round(areaM2 * (selectedFamily.category === "LANDSCAPE" ? 0.68 : 0.46));
  const heightM = round(floors * (selectedFamily.category === "LANDSCAPE" ? 0.15 : 3.6));
  const courtyardM2 = selectedFamily.geometryStrategy === "COURTYARD_MASS" ? round(footprintM2 * courtyardRatio) : 0;
  const costRate: Record<FamilyCategory, number> = { SALUD: 2100, EDUCATION: 1250, COMMERCE: 1100, SPORT: 1450, OFFICES: 1750, LANDSCAPE: 280, INDUSTRY: 850, TRANSPORT: 1600, CULTURE: 1900, RESIDENTIAL: 980, HOSPITALITY: 1800, WORSHIP: 1350 };
  const program: FamilyProgram = { ...selectedFamily.baseProgram, primarySpaces: [...selectedFamily.baseProgram.primarySpaces, ...selectedVariant.programExtra] };
  const city = input.context?.city ?? "Sin ciudad";
  const context: BuildingContext = { country: input.context?.country ?? "PE", city, jurisdiction: input.context?.jurisdiction ?? "RNE-PE", region: input.context?.region, climate: input.context?.climate, seismicZone: input.context?.seismicZone };
  const unknowns = ["Compatibilidad normativa local", "Topografía y condiciones del suelo", "Validación estructural, sanitaria y de evacuación"];
  const alerts = [
    { code: "PROPOSAL_ONLY", message: "Candidato conceptual: requiere revisión humana antes de incorporarse al estado del proyecto.", severity: "INFO" as const },
    { code: "RNE_REVIEW", message: "Las reglas RNE son referencias; el expediente debe ser validado por especialistas.", severity: "WARNING" as const },
    ...(city === "Sin ciudad" ? [{ code: "CONTEXT_MISSING", message: "Agrega una ciudad para completar el contexto de la propuesta.", severity: "WARNING" as const }] : []),
  ];
  const id = typeof globalThis.crypto?.randomUUID === "function" ? globalThis.crypto.randomUUID() : `arki-${Date.now()}`;
  return {
    id, familyId: selectedFamily.id, variantId: selectedVariant.id, name: `${selectedFamily.name} · ${selectedVariant.name}`,
    context, parameters: { areaM2: round(areaM2), capacity, floors, courtyardRatio }, program, rules: selectedFamily.baseRules,
    geometry2d: { type: selectedFamily.geometryStrategy, footprintM2, widthM: round(widthM), depthM: round(depthM), courtyardM2, rings: selectedFamily.geometryStrategy === "ARENA_BOWL" ? 3 : undefined },
    section: { type: selectedFamily.geometryStrategy, floors, floorHeightM: selectedFamily.category === "LANDSCAPE" ? 0.15 : 3.6, totalHeightM: heightM, usesByFloor: Array.from({ length: floors }, (_, index) => index === 0 ? "Acceso / área pública" : index === floors - 1 ? "Servicios / cubierta" : "Programa principal") },
    geometry3d: { type: "CONCEPTUAL_MASSING", floors, heightM, massing: selectedFamily.geometryStrategy },
    unifiedGeometry: { schema: "ARKI-UNIFIED-GEOMETRY-1.0", plan: { type: selectedFamily.geometryStrategy, footprintM2, widthM: round(widthM), depthM: round(depthM), courtyardM2, rings: selectedFamily.geometryStrategy === "ARENA_BOWL" ? 3 : undefined }, section: { type: selectedFamily.geometryStrategy, floors, floorHeightM: selectedFamily.category === "LANDSCAPE" ? 0.15 : 3.6, totalHeightM: heightM, usesByFloor: Array.from({ length: floors }, (_, index) => index === 0 ? "Acceso / área pública" : "Programa principal") }, model3d: { type: "CONCEPTUAL_MASSING", floors, heightM, massing: selectedFamily.geometryStrategy } },
    metrics: { footprintM2, builtAreaM2: round(footprintM2 * floors), capacity, estimatedCostUsdConceptual: Math.round(footprintM2 * floors * costRate[selectedFamily.category]) },
    constructionModel: generateConstructionModel({ projectId: id, name: `${selectedFamily.name} · ${selectedVariant.name}`, widthM, depthM, floors, familyCategory: selectedFamily.category }),
    validation: { status: "UNKNOWN", checked: ["Estructura declarativa", "Programa base", "Geometría unificada", "Métricas conceptuales"], unknowns },
    alerts, status: "GENERATED_CANDIDATE", humanReviewRequired: true, projectStateMutation: "NOT_REQUESTED",
  };
}

export function generatedBuildingMetadata(building: GeneratedBuilding) { return { schema: "ARKI-GENERATED-BUILDING-1.0", artifactId: building.id, familyId: building.familyId, variantId: building.variantId, status: building.status, humanReviewRequired: building.humanReviewRequired, projectStateMutation: building.projectStateMutation }; }
export function isProposalOnly(building: GeneratedBuilding) { return building.status === "GENERATED_CANDIDATE" && building.humanReviewRequired && building.projectStateMutation === "NOT_REQUESTED"; }
export const generarEdificacionDinamica = generateDynamicBuilding;
export const listarFamiliasDinamicas = listDynamicFamilies;
export const CANONICAL_PROMOTION = "NOT_REQUESTED" as const;
export const ROOT_FAMILY_POLICY = "SMALL_ROOT_REGISTRY_WITH_COMPOSABLE_VARIANTS" as const;
export const INVENTORY_STATUS = "ROOT_FAMILIES_AND_VARIANTS_IMPLEMENTED; EXPANSION_PENDING" as const;
