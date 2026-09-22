import { randomUUID } from "node:crypto";

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
  capacityMin?: number;
  capacityMax?: number;
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
  validation: { status: "PASS" | "UNKNOWN" | "BLOCKED"; checked: string[]; unknowns: string[] };
  alerts: Array<{ code: string; message: string; severity: "INFO" | "WARNING" | "BLOCKER" }>;
  status: "GENERATED_CANDIDATE";
  humanReviewRequired: true;
  projectStateMutation: "NOT_REQUESTED";
};

const p = (id: string, label: string, defaultValue: string | number | boolean, extra: Partial<FamilyParameter> = {}): FamilyParameter => ({ id, label, type: typeof defaultValue as FamilyParameter["type"], defaultValue, ...extra });
const rule = (id: string, code: string, description: string, parameter: string, operator: RuleOperator, value: number | string | boolean | undefined, source: string): FamilyRule => ({ id, code, description, parameter, operator, value, source, required: true });
const program = (primarySpaces: string[], services: string[], circulations: string[]): FamilyProgram => ({ zones: [{ id: "PUBLIC", name: "Área pública", areaRatio: 0.25 }, { id: "SERVICE", name: "Área de servicio", areaRatio: 0.15 }, { id: "PRIMARY", name: "Área principal", areaRatio: 0.6 }], primarySpaces, services, circulations });

function makeAdditionalFamily(input: { id: string; name: string; category: FamilyCategory; description: string; geometryStrategy: DynamicBuildingFamily["geometryStrategy"]; tags: string[]; primary: string[]; services: string[]; variants: Array<{ id: string; name: string; description: string; tags: string[]; extra: string[]; modifiers: Record<string, string | number | boolean> }> }): DynamicBuildingFamily {
  return { id: input.id, name: input.name, description: input.description, category: input.category, scale: input.category === "LANDSCAPE" ? "URBAN" : "COMPLEX", version: "1.0.0", baseProgram: program(input.primary, input.services, ["público", "personal", "servicio", "evacuación"]), variants: input.variants.map((variant) => ({ id: variant.id, name: variant.name, description: variant.description, capacityUnit: "usuarios", modifiers: { floors: 2, courtyardRatio: 0.08, capacity: 300, ...variant.modifiers }, programExtra: variant.extra, ruleIds: ["GEN-EGRESS"], tags: variant.tags })), baseParameters: [p("areaM2", "Área del terreno", 10000, { unit: "m²", min: 100 }), p("capacity", "Capacidad", 300, { unit: "personas", min: 1 }), p("floors", "Niveles", 2, { unit: "niveles", min: 1, max: 80 }), p("courtyardRatio", "Proporción de vacío", 0.08, { unit: "ratio", min: 0, max: 0.8 })], baseRules: [rule("GEN-EGRESS", "RNE-A.130", "Aforo y evacuación requieren validación del proyecto.", "egressValidated", "REQUIRED", true, "RNE de referencia; especialista")], geometryStrategy: input.geometryStrategy, tags: input.tags };
}

const ADDITIONAL_DYNAMIC_FAMILIES: DynamicBuildingFamily[] = [
  makeAdditionalFamily({ id: "FAM-LANDSCAPE", name: "Paisajismo", category: "LANDSCAPE", description: "Parques, plazas, malecones, corredores verdes y humedales.", geometryStrategy: "COURTYARD_MASS", tags: ["paisajismo", "parque", "espacio público", "GH.020"], primary: ["áreas verdes", "senderos", "estancias", "equipamiento"], services: ["riego", "bombas", "servicios higiénicos"], variants: [
    { id: "URBAN_PARK", name: "Parque urbano", description: "Parque de barrio con recreación y vegetación.", tags: ["parque", "verde"], extra: ["juegos infantiles", "ciclovía"], modifiers: { areaM2: 20000, capacity: 5000 } },
    { id: "PUBLIC_PLAZA", name: "Plaza pública", description: "Plaza cívica y cultural.", tags: ["plaza", "cívica"], extra: ["fuente", "pavimento cívico"], modifiers: { areaM2: 5000, capacity: 2000 } },
    { id: "WETLAND", name: "Humedal artificial", description: "Humedal para tratamiento y biodiversidad.", tags: ["humedal", "agua"], extra: ["sendero interpretativo", "mirador de aves"], modifiers: { areaM2: 50000, capacity: 500 } },
  ] }),
  makeAdditionalFamily({ id: "FAM-INDUSTRY", name: "Industria", category: "INDUSTRY", description: "Manufactura, almacenes y centros logísticos.", geometryStrategy: "LINEAR_MASS", tags: ["industria", "manufactura", "logística", "RNE-A.060"], primary: ["producción", "almacén", "patio de maniobras"], services: ["vestuarios", "cuarto eléctrico", "control de calidad"], variants: [
    { id: "WAREHOUSE", name: "Almacén simple", description: "Almacén de mercancías secas.", tags: ["almacén"], extra: ["racks", "muelles"], modifiers: { areaM2: 3000, floors: 1 } },
    { id: "LOGISTICS", name: "Centro logístico", description: "Distribución multi-almacén.", tags: ["logística"], extra: ["muelles múltiples", "patio de maniobras"], modifiers: { areaM2: 25000, floors: 1 } },
    { id: "MANUFACTURING", name: "Planta de manufactura", description: "Producción industrial con líneas y control de calidad.", tags: ["manufactura"], extra: ["líneas de producción", "laboratorio"], modifiers: { areaM2: 15000, floors: 2 } },
  ] }),
  makeAdditionalFamily({ id: "FAM-TRANSPORT", name: "Transporte", category: "TRANSPORT", description: "Terminales, estaciones, aeropuertos y nodos intermodales.", geometryStrategy: "LINEAR_MASS", tags: ["transporte", "terminal", "intermodal"], primary: ["vestíbulo", "andenes", "circulación pública"], services: ["control", "equipaje", "mantenimiento"], variants: [
    { id: "BUS_TERMINAL", name: "Terminal terrestre", description: "Terminal de buses interprovincial.", tags: ["buses", "terminal"], extra: ["andenes", "salas de espera"], modifiers: { areaM2: 18000, capacity: 2500 } },
    { id: "STATION", name: "Estación intermodal", description: "Intercambio de modos de transporte.", tags: ["intermodal", "estación"], extra: ["conexión peatonal", "bicicletas"], modifiers: { areaM2: 12000, capacity: 4000 } },
    { id: "AIRPORT", name: "Terminal aeroportuaria", description: "Terminal de pasajeros con controles y plataforma.", tags: ["aeropuerto", "aviación"], extra: ["check-in", "seguridad", "mangas"], modifiers: { areaM2: 60000, capacity: 12000, floors: 3 } },
  ] }),
  makeAdditionalFamily({ id: "FAM-CULTURE", name: "Cultura", category: "CULTURE", description: "Museos, bibliotecas, teatros y centros culturales.", geometryStrategy: "COURTYARD_MASS", tags: ["cultura", "museo", "teatro"], primary: ["exposición", "auditorio", "espacio comunitario"], services: ["carga cultural", "conservación", "taquilla"], variants: [
    { id: "MUSEUM", name: "Museo", description: "Museo con galerías y conservación.", tags: ["museo"], extra: ["galerías", "depósitos"], modifiers: { areaM2: 8000, capacity: 1200 } },
    { id: "LIBRARY", name: "Biblioteca", description: "Biblioteca pública y digital.", tags: ["biblioteca"], extra: ["salas de lectura", "archivo"], modifiers: { areaM2: 5000, capacity: 600 } },
    { id: "THEATER", name: "Teatro", description: "Teatro y artes escénicas.", tags: ["teatro", "escénico"], extra: ["escenario", "camerinos"], modifiers: { areaM2: 10000, capacity: 1400 } },
  ] }),
  makeAdditionalFamily({ id: "FAM-RESIDENTIAL", name: "Residencial", category: "RESIDENTIAL", description: "Vivienda unifamiliar, multifamiliar y conjunto residencial.", geometryStrategy: "COURTYARD_MASS", tags: ["vivienda", "residencial", "multifamiliar"], primary: ["unidades de vivienda", "áreas comunes", "patios"], services: ["estacionamiento", "cuartos técnicos", "residuos"], variants: [
    { id: "SINGLE", name: "Vivienda unifamiliar", description: "Casa independiente.", tags: ["casa"], extra: ["jardín", "estacionamiento"], modifiers: { areaM2: 300, capacity: 6, floors: 2 } },
    { id: "MULTIFAMILY", name: "Multifamiliar", description: "Edificio de departamentos.", tags: ["departamentos"], extra: ["núcleo vertical", "área común"], modifiers: { areaM2: 3000, capacity: 120, floors: 8 } },
    { id: "HOUSING_COMPLEX", name: "Conjunto residencial", description: "Conjunto de bloques y espacio común.", tags: ["conjunto", "barrial"], extra: ["parque común", "equipamiento vecinal"], modifiers: { areaM2: 20000, capacity: 900, floors: 5 } },
  ] }),
  makeAdditionalFamily({ id: "FAM-HOSPITALITY", name: "Hospedaje", category: "HOSPITALITY", description: "Hoteles, hostales y resorts.", geometryStrategy: "COURTYARD_MASS", tags: ["hotel", "turismo", "hospedaje"], primary: ["habitaciones", "lobby", "restaurante"], services: ["housekeeping", "cocina", "mantenimiento"], variants: [
    { id: "HOTEL", name: "Hotel", description: "Hotel urbano con habitaciones y servicios.", tags: ["hotel"], extra: ["recepción", "salón de eventos"], modifiers: { areaM2: 15000, capacity: 500, floors: 10 } },
    { id: "HOSTEL", name: "Hostal", description: "Hospedaje económico de escala media.", tags: ["hostal"], extra: ["cocina compartida", "terraza"], modifiers: { areaM2: 2500, capacity: 100, floors: 4 } },
    { id: "RESORT", name: "Resort", description: "Complejo turístico con paisaje y recreación.", tags: ["resort", "paisaje"], extra: ["piscinas", "spa", "jardines"], modifiers: { areaM2: 40000, capacity: 700, floors: 4 } },
  ] }),
  makeAdditionalFamily({ id: "FAM-WORSHIP", name: "Culto", category: "WORSHIP", description: "Templos, centros comunitarios y espacios de culto.", geometryStrategy: "COURTYARD_MASS", tags: ["culto", "templo", "comunidad"], primary: ["sala de culto", "patio", "espacio comunitario"], services: ["administración", "servicios", "apoyo social"], variants: [
    { id: "TEMPLE", name: "Templo", description: "Espacio de culto con nave principal.", tags: ["templo"], extra: ["nave", "sacristía"], modifiers: { areaM2: 2500, capacity: 800, floors: 1 } },
    { id: "COMMUNITY_CENTER", name: "Centro comunitario", description: "Centro de reunión y apoyo social.", tags: ["comunidad"], extra: ["aulas", "comedor social"], modifiers: { areaM2: 4000, capacity: 500, floors: 2 } },
  ] }),
];

export const DYNAMIC_BUILDING_FAMILIES: DynamicBuildingFamily[] = [
  ...ADDITIONAL_DYNAMIC_FAMILIES,
  {
    id: "FAM-HEALTH",
    name: "Salud",
    description: "Familia de establecimientos de salud con flujos diferenciados y criticidad configurable.",
    category: "SALUD",
    scale: "COMPLEX",
    version: "1.0.0",
    baseProgram: program(["admisión", "consultorios", "hospitalización"], ["instalaciones MEP", "residuos", "mantenimiento"], ["público", "personal", "servicio", "evacuación"]),
    variants: [
      { id: "GENERAL", name: "Hospital general", description: "Atención general con internamiento.", capacityUnit: "camas", modifiers: { beds: 400, floors: 4, courtyardRatio: 0.18 }, programExtra: ["emergencia", "diagnóstico por imágenes", "centro quirúrgico"], ruleIds: ["HEALTH-FLOW", "HEALTH-EGRESS"], tags: ["hospital", "alta-complejidad"] },
      { id: "CLINIC", name: "Clínica ambulatoria", description: "Atención ambulatoria sin internamiento masivo.", capacityUnit: "consultas/día", modifiers: { beds: 20, floors: 3, courtyardRatio: 0.12 }, programExtra: ["procedimientos ambulatorios", "farmacia"], ruleIds: ["HEALTH-FLOW"], tags: ["clínica", "ambulatorio"] },
      { id: "RURAL", name: "Centro de salud rural", description: "Atención primaria adaptable a baja densidad.", capacityUnit: "consultas/día", modifiers: { beds: 12, floors: 1, courtyardRatio: 0.08 }, programExtra: ["tópico", "residencia de personal"], ruleIds: ["HEALTH-FLOW"], tags: ["rural", "modular"] },
    ],
    baseParameters: [p("areaM2", "Área del terreno", 20000, { unit: "m²", min: 1000 }), p("capacity", "Capacidad", 400, { unit: "personas", min: 1 }), p("floors", "Niveles", 4, { unit: "niveles", min: 1, max: 50 }), p("courtyardRatio", "Proporción de patio", 0.15, { unit: "ratio", min: 0, max: 0.6 })],
    baseRules: [rule("HEALTH-FLOW", "RNE-A.050", "Separar flujos públicos, personal, servicio y evacuación.", "flowSeparation", "REQUIRED", true, "RNE de referencia; validar vigencia"), rule("HEALTH-EGRESS", "RNE-A.130", "La evacuación debe verificarse con aforo y configuración real.", "egressValidated", "REQUIRED", true, "RNE de referencia; especialista" )],
    geometryStrategy: "COURTYARD_MASS",
    tags: ["salud", "MEP", "evacuación", "RNE"],
  },
  {
    id: "FAM-EDUCATION",
    name: "Educación",
    description: "Familia educativa con aulas, espacios comunes, patios y circulación segura.",
    category: "EDUCATION",
    scale: "BUILDING",
    version: "1.0.0",
    baseProgram: program(["aulas", "administración", "espacio común"], ["servicios higiénicos", "cocina", "almacén"], ["alumnos", "personal", "evacuación"]),
    variants: [
      { id: "INITIAL", name: "Inicial", description: "Educación inicial con patio protegido.", capacityUnit: "alumnos", modifiers: { students: 180, floors: 1, courtyardRatio: 0.2 }, programExtra: ["aula psicomotriz", "patio de juegos"], ruleIds: ["EDU-DENSITY", "EDU-EGRESS"], tags: ["inicial", "patio"] },
      { id: "SCHOOL", name: "Colegio", description: "Educación básica con aulas y servicios colectivos.", capacityUnit: "alumnos", modifiers: { students: 900, floors: 3, courtyardRatio: 0.16 }, programExtra: ["laboratorios", "biblioteca", "comedor", "cancha"], ruleIds: ["EDU-DENSITY", "EDU-EGRESS"], tags: ["primaria", "secundaria"] },
      { id: "UNIVERSITY", name: "Campus universitario", description: "Conjunto educativo con investigación y usos mixtos.", capacityUnit: "alumnos", modifiers: { students: 5000, floors: 5, courtyardRatio: 0.1 }, programExtra: ["laboratorios especializados", "auditorio", "investigación"], ruleIds: ["EDU-DENSITY", "EDU-EGRESS"], tags: ["universidad", "campus"] },
    ],
    baseParameters: [p("areaM2", "Área del terreno", 8000, { unit: "m²", min: 500 }), p("capacity", "Capacidad", 900, { unit: "alumnos", min: 1 }), p("floors", "Niveles", 3, { unit: "niveles", min: 1, max: 20 }), p("courtyardRatio", "Proporción de patio", 0.16, { unit: "ratio", min: 0, max: 0.6 })],
    baseRules: [rule("EDU-DENSITY", "RNE-A.040", "La capacidad y el programa deben contrastarse con área educativa y aforo.", "capacity", "MIN", 1, "RNE de referencia; validar programa"), rule("EDU-EGRESS", "RNE-A.130", "La evacuación debe comprobarse con ocupación y rutas reales.", "egressValidated", "REQUIRED", true, "RNE de referencia; especialista")],
    geometryStrategy: "COURTYARD_MASS",
    tags: ["educación", "aulas", "campus"],
  },
  {
    id: "FAM-COMMERCE",
    name: "Comercio",
    description: "Familia comercial para mercados, comercio vecinal y centros comerciales.",
    category: "COMMERCE",
    scale: "COMPLEX",
    version: "1.0.0",
    baseProgram: program(["locales", "circulación comercial", "espacio público"], ["carga y descarga", "residuos", "servicios"], ["público", "servicio", "emergencia"]),
    variants: [
      { id: "MARKET", name: "Mercado", description: "Mercado con puestos y logística separada.", capacityUnit: "usuarios", modifiers: { stalls: 180, floors: 1, courtyardRatio: 0.08 }, programExtra: ["cámara fría", "patio de maniobras"], ruleIds: ["COM-LOAD", "COM-EGRESS"], tags: ["mercado", "abastecimiento"] },
      { id: "MALL", name: "Centro comercial", description: "Centro comercial con ancla y estacionamiento.", capacityUnit: "usuarios", modifiers: { stalls: 120, floors: 4, courtyardRatio: 0.12 }, programExtra: ["ancla comercial", "food court", "estacionamiento"], ruleIds: ["COM-LOAD", "COM-EGRESS"], tags: ["mall", "retail"] },
      { id: "NEIGHBORHOOD", name: "Comercio vecinal", description: "Comercio de proximidad de baja escala.", capacityUnit: "usuarios", modifiers: { stalls: 24, floors: 2, courtyardRatio: 0.05 }, programExtra: ["entrega de última milla"], ruleIds: ["COM-EGRESS"], tags: ["barrial", "proximidad"] },
      { id: "DEPARTMENT_STORE", name: "Tienda departamental", description: "Retail masivo organizado por departamentos.", capacityUnit: "usuarios", modifiers: { stalls: 60, floors: 4, courtyardRatio: 0 }, programExtra: ["área de venta", "carga y descarga", "almacén"], ruleIds: ["COM-LOAD", "COM-EGRESS"], tags: ["retail", "departamental"] },
      { id: "GALLERY", name: "Galería comercial", description: "Locales pequeños alrededor de circulaciones compartidas.", capacityUnit: "locales", modifiers: { stalls: 80, floors: 3, courtyardRatio: 0.08 }, programExtra: ["locales modulares", "pasaje comercial"], ruleIds: ["COM-EGRESS"], tags: ["galería", "locales"] },
    ],
    baseParameters: [p("areaM2", "Área del terreno", 5000, { unit: "m²", min: 200 }), p("capacity", "Aforo", 800, { unit: "personas", min: 1 }), p("floors", "Niveles", 2, { unit: "niveles", min: 1, max: 20 }), p("courtyardRatio", "Proporción de vacío", 0.1, { unit: "ratio", min: 0, max: 0.6 })],
    baseRules: [rule("COM-LOAD", "RNE-A.070", "Separar abastecimiento, carga y descarga del flujo público.", "serviceFlowSeparated", "REQUIRED", true, "RNE de referencia; validar operación"), rule("COM-EGRESS", "RNE-A.130", "El aforo y las salidas requieren verificación especializada.", "egressValidated", "REQUIRED", true, "RNE de referencia; especialista")],
    geometryStrategy: "PODIUM_TOWER",
    tags: ["comercio", "mercado", "retail"],
  },
  {
    id: "FAM-OFFICES",
    name: "Oficinas",
    description: "Familia de oficinas pequeñas, coworking, corporativas y gubernamentales.",
    category: "OFFICES",
    scale: "BUILDING",
    version: "1.0.0",
    baseProgram: program(["puestos de trabajo", "salas de reunión", "lobby"], ["datos", "cuarto eléctrico", "servicios"], ["público", "personal", "mantenimiento", "evacuación"]),
    variants: [
      { id: "SMALL", name: "Oficina pequeña", description: "Unidad de trabajo de baja escala.", capacityUnit: "personas", modifiers: { employees: 25, floors: 1, courtyardRatio: 0 }, programExtra: ["recepción", "sala de reunión"], ruleIds: ["OFF-EGRESS"], tags: ["pequeña", "boutique"] },
      { id: "COWORKING", name: "Coworking", description: "Trabajo flexible y compartido.", capacityUnit: "usuarios", modifiers: { employees: 180, floors: 2, courtyardRatio: 0.08 }, programExtra: ["cabinas", "café", "sala flexible"], ruleIds: ["OFF-EGRESS", "OFF-DATA"], tags: ["coworking", "flexible"] },
      { id: "CORPORATE", name: "Torre corporativa", description: "Oficinas de alta densidad con núcleo vertical.", capacityUnit: "personas", modifiers: { employees: 1200, floors: 18, courtyardRatio: 0.04 }, programExtra: ["lobby corporativo", "amenities", "helipuerto o terraza técnica"], ruleIds: ["OFF-EGRESS", "OFF-DATA"], tags: ["corporativo", "torre"] },
      { id: "GOVERNMENT", name: "Oficina gubernamental", description: "Edificio institucional con atención al ciudadano.", capacityUnit: "personas", modifiers: { employees: 450, floors: 6, courtyardRatio: 0.12 }, programExtra: ["atención al ciudadano", "archivo", "sala de actos"], ruleIds: ["OFF-EGRESS"], tags: ["gubernamental", "institucional"] },
    ],
    baseParameters: [p("areaM2", "Área del terreno", 5000, { unit: "m²", min: 200 }), p("capacity", "Aforo", 300, { unit: "personas", min: 1 }), p("floors", "Niveles", 6, { unit: "niveles", min: 1, max: 80 }), p("courtyardRatio", "Proporción de vacío", 0.08, { unit: "ratio", min: 0, max: 0.6 })],
    baseRules: [rule("OFF-EGRESS", "RNE-A.080", "La ocupación, salidas y circulación requieren verificación del proyecto.", "egressValidated", "REQUIRED", true, "RNE de referencia; especialista"), rule("OFF-DATA", "OFF-MEP-001", "La continuidad de datos y energía debe coordinarse con MEP.", "dataAndPowerValidated", "REQUIRED", true, "Coordinación MEP")],
    geometryStrategy: "PODIUM_TOWER",
    tags: ["oficinas", "corporativo", "coworking", "gobierno"],
  },
  {
    id: "FAM-SPORT",
    name: "Deporte y espectáculos",
    description: "Familia de recintos deportivos y de espectáculos con bowl, cubierta y evacuación masiva.",
    category: "SPORT",
    scale: "COMPLEX",
    version: "1.0.0",
    baseProgram: program(["graderías", "campo o sala", "vestíbulos"], ["vestuarios", "servicios", "prensa y operación"], ["público", "deportistas", "servicio", "evacuación"]),
    variants: [
      { id: "STADIUM", name: "Estadio", description: "Estadio abierto o cubierto para gran aforo.", capacityUnit: "espectadores", modifiers: { spectators: 80000, floors: 3, courtyardRatio: 0, rings: 3 }, programExtra: ["campo", "graderías", "palcos", "cubierta"], ruleIds: ["SPORT-EGRESS", "SPORT-COVER"], tags: ["estadio", "fútbol", "gran-aforo"] },
      { id: "ARENA", name: "Arena multiuso", description: "Recinto cubierto para deporte y eventos.", capacityUnit: "espectadores", modifiers: { spectators: 15000, floors: 4, courtyardRatio: 0, rings: 2 }, programExtra: ["cancha adaptable", "escenario", "producción"], ruleIds: ["SPORT-EGRESS", "SPORT-COVER"], tags: ["arena", "multiuso"] },
      { id: "COMMUNITY", name: "Polideportivo", description: "Equipamiento deportivo comunitario.", capacityUnit: "usuarios", modifiers: { spectators: 1200, floors: 2, courtyardRatio: 0.05, rings: 1 }, programExtra: ["canchas múltiples", "gimnasio"], ruleIds: ["SPORT-EGRESS"], tags: ["polideportivo", "comunitario"] },
    ],
    baseParameters: [p("areaM2", "Área del terreno", 60000, { unit: "m²", min: 1000 }), p("capacity", "Aforo", 80000, { unit: "espectadores", min: 1 }), p("floors", "Niveles", 3, { unit: "niveles", min: 1, max: 20 }), p("rings", "Anillos de gradería", 3, { unit: "anillos", min: 1, max: 6 })],
    baseRules: [rule("SPORT-EGRESS", "RNE-A.130", "La evacuación masiva debe simularse y verificarse con especialista.", "egressValidated", "REQUIRED", true, "RNE de referencia; simulación requerida"), rule("SPORT-COVER", "STRUCT-001", "La cubierta requiere cálculo estructural y viento del sitio.", "coverStructuralValidated", "REQUIRED", true, "Cálculo estructural especializado")],
    geometryStrategy: "ARENA_BOWL",
    tags: ["deporte", "estadio", "evacuación", "cubierta"],
  },
];

const findFamily = (familyId: string) => DYNAMIC_BUILDING_FAMILIES.find((family) => family.id === familyId);

export function listDynamicFamilies(category?: FamilyCategory) { return DYNAMIC_BUILDING_FAMILIES.filter((family) => !category || family.category === category); }
export function getDynamicFamily(familyId: string) { return findFamily(familyId) ?? null; }
export function dynamicFamilySummary() { return { version: "ARKI-DYNAMIC-FAMILY-GENERATOR-1.0", familyCount: DYNAMIC_BUILDING_FAMILIES.length, variantCount: DYNAMIC_BUILDING_FAMILIES.reduce((sum, family) => sum + family.variants.length, 0), categories: Array.from(new Set(DYNAMIC_BUILDING_FAMILIES.map((family) => family.category))), status: "REFERENCE_FAMILIES_REQUIRE_EVIDENCE" as const }; }

function valueAsNumber(value: string | number | boolean | undefined) { return typeof value === "number" ? value : Number(value); }
function buildRules(family: DynamicBuildingFamily, variant: FamilyVariant) { return family.baseRules.filter((item) => variant.ruleIds.includes(item.id) || !variant.ruleIds.length); }
function geometryFor(family: DynamicBuildingFamily, params: Record<string, string | number | boolean>) {
  const area = Math.max(1, valueAsNumber(params.areaM2) || 1);
  const floors = Math.max(1, Math.round(valueAsNumber(params.floors) || 1));
  const footprint = area / floors;
  const width = Math.sqrt(footprint * 1.35);
  const depth = footprint / width;
  const courtyardRatio = Math.max(0, Math.min(0.8, valueAsNumber(params.courtyardRatio) || 0));
  return { type: family.geometryStrategy, footprintM2: Number(footprint.toFixed(2)), widthM: Number(width.toFixed(2)), depthM: Number(depth.toFixed(2)), courtyardM2: Number((footprint * courtyardRatio).toFixed(2)), rings: Number(params.rings) || undefined };
}

export function generateDynamicBuilding(input: { familyId: string; variantId: string; context?: Partial<BuildingContext>; parameters?: Record<string, string | number | boolean> }): GeneratedBuilding {
  const family = findFamily(input.familyId);
  if (!family) throw new Error(`Dynamic family '${input.familyId}' is not registered`);
  const variant = family.variants.find((item) => item.id === input.variantId);
  if (!variant) throw new Error(`Variant '${input.variantId}' is not registered in family '${input.familyId}'`);
  const context: BuildingContext = { country: "PE", ...input.context };
  const parameters: Record<string, string | number | boolean> = Object.fromEntries(family.baseParameters.map((item) => [item.id, item.defaultValue]));
  Object.assign(parameters, variant.modifiers, input.parameters ?? {});
  const rules = buildRules(family, variant);
  const unknowns: string[] = [];
  const alerts: GeneratedBuilding["alerts"] = [];
  for (const parameter of family.baseParameters) {
    const value = parameters[parameter.id];
    if (parameter.type === "number" && !Number.isFinite(valueAsNumber(value))) { unknowns.push(parameter.id); alerts.push({ code: "MISSING_PARAMETER", message: `FALTA_DATO: ${parameter.id}`, severity: "BLOCKER" }); }
    if (typeof parameter.min === "number" && valueAsNumber(value) < parameter.min) alerts.push({ code: "PARAMETER_BELOW_MIN", message: `${parameter.id} debe ser >= ${parameter.min}`, severity: "WARNING" });
    if (typeof parameter.max === "number" && valueAsNumber(value) > parameter.max) alerts.push({ code: "PARAMETER_ABOVE_MAX", message: `${parameter.id} debe ser <= ${parameter.max}`, severity: "WARNING" });
  }
  if (!context.city || !context.jurisdiction) { unknowns.push("site_or_jurisdiction"); alerts.push({ code: "CONTEXT_INCOMPLETE", message: "FALTA_DATO: ciudad o jurisdicción normativa", severity: "WARNING" }); }
  for (const item of rules.filter((rule) => rule.operator === "REQUIRED")) { const key = String(item.parameter); if (parameters[key] !== true) unknowns.push(key); }
  const geometry2d = geometryFor(family, parameters);
  const floors = Math.max(1, Math.round(valueAsNumber(parameters.floors) || 1));
  const capacity = Math.max(0, Math.round(valueAsNumber(parameters.capacity) || valueAsNumber(parameters.spectators) || valueAsNumber(parameters.students) || valueAsNumber(parameters.beds) || 0));
  const builtArea = geometry2d.footprintM2 * floors;
  const geometry3d = { type: "EXTRUSION_FROM_2D", floors, heightM: Number((floors * 3.4).toFixed(2)), massing: family.geometryStrategy } as const;
  const section = { type: "SECTION_FROM_PROGRAM", floors, floorHeightM: 3.4, totalHeightM: geometry3d.heightM, usesByFloor: Array.from({ length: floors }, (_, index) => index === 0 ? family.baseProgram.primarySpaces[0] ?? "acceso" : variant.programExtra[index - 1] ?? "programa principal") };
  const plan = { ...geometry2d };
  return { id: randomUUID(), familyId: family.id, variantId: variant.id, name: `${variant.name} · ${context.city || "sin ciudad"}`, context, parameters, program: { ...family.baseProgram, primarySpaces: [...family.baseProgram.primarySpaces, ...variant.programExtra] }, rules, geometry2d: plan, section, geometry3d, unifiedGeometry: { schema: "ARKI-UNIFIED-GEOMETRY-1.0", plan, section, model3d: geometry3d }, metrics: { footprintM2: geometry2d.footprintM2, builtAreaM2: Number(builtArea.toFixed(2)), capacity, estimatedCostUsdConceptual: Math.round(builtArea * (family.category === "SALUD" ? 1800 : 1200)) }, validation: { status: unknowns.length ? "UNKNOWN" : "PASS", checked: rules.map((item) => item.code), unknowns: Array.from(new Set(unknowns)) }, alerts, status: "GENERATED_CANDIDATE", humanReviewRequired: true, projectStateMutation: "NOT_REQUESTED" };
}

export function searchDynamicFamilies(query: string) { const q = query.trim().toLocaleLowerCase(); return listDynamicFamilies().flatMap((family) => family.variants.map((variant) => ({ familyId: family.id, familyName: family.name, variantId: variant.id, variantName: variant.name, score: q ? Number([family.name, family.description, variant.name, variant.description, ...family.tags, ...variant.tags].join(" ").toLocaleLowerCase().includes(q) ? 1 : 0) : 1 }))).filter((item) => item.score > 0).sort((a, b) => b.score - a.score || a.variantName.localeCompare(b.variantName)); }

export function dynamicFamilyContract() { return { schema: "ARKI-DYNAMIC-FAMILY-GENERATOR-1.0", flow: "FAMILY -> VARIANT -> CONTEXT -> PARAMETERS -> PROGRAM -> RULES -> 2D -> 3D -> METRICS -> GATES", gates: ["HUMAN_REVIEW", "PROFESSIONAL_SIGNATURE", "NO_CORE_MUTATION"], limitations: ["geometry_conceptual", "normative_reference_only", "not_native_revit_family"] as const }; }

export default DYNAMIC_BUILDING_FAMILIES;
export type { DynamicBuildingFamily as ArkiDynamicFamily };
export type { GeneratedBuilding as ArkiGeneratedBuilding };
export type { BuildingContext as ArkiBuildingContext };
export type { FamilyCategory as ArkiFamilyCategory };
export type { FamilyVariant as ArkiFamilyVariant };
export type { FamilyParameter as ArkiFamilyParameter };
export type { FamilyRule as ArkiFamilyRule };
export type { FamilyProgram as ArkiFamilyProgram };

// Explicitly exported aliases keep the contract easy to discover from API/UI code.
export const arkiDynamicFamilyGeneratorVersion = "ARKI-DYNAMIC-FAMILY-GENERATOR-1.0" as const;
export const arkiDynamicFamilyGenerator = { listDynamicFamilies, getDynamicFamily, generateDynamicBuilding, searchDynamicFamilies, dynamicFamilySummary, dynamicFamilyContract };

// Prevent accidental mutation of the registry from callers.
export function cloneDynamicFamily(familyId: string) { const family = getDynamicFamily(familyId); return family ? structuredClone(family) : null; }

// The registry is deliberately small; variants create the large candidate space.
export const dynamicFamilyCount = DYNAMIC_BUILDING_FAMILIES.length;
export const dynamicVariantCount = DYNAMIC_BUILDING_FAMILIES.reduce((total, family) => total + family.variants.length, 0);

// Invariant: every family must have at least one variant and a geometry strategy.
if (DYNAMIC_BUILDING_FAMILIES.some((family) => !family.variants.length || !family.geometryStrategy)) throw new Error("Invalid dynamic family registry");

// Invariant: IDs must be unique across families and variants.
const ids = DYNAMIC_BUILDING_FAMILIES.flatMap((family) => [family.id, ...family.variants.map((variant) => `${family.id}:${variant.id}`)]);
if (new Set(ids).size !== ids.length) throw new Error("Duplicate dynamic family registry ID");

// The generated result is proposal-only by construction; no Core mutation is performed here.
export const DYNAMIC_FAMILY_GOVERNANCE = { persistence: "PROPOSAL_ONLY", humanReviewRequired: true, professionalSignatureRequired: true, canonicalPromotion: "NOT_REQUESTED" } as const;

// Kept as an explicit helper for UI selectors.
export function familyOptions() { return listDynamicFamilies().map((family) => ({ id: family.id, name: family.name, category: family.category, variants: family.variants.map((variant) => ({ id: variant.id, name: variant.name })) })); }

// No arbitrary code, eval, dynamic imports or external execution are used by this generator.
export const dynamicFamilySecurity = { arbitraryCodeExecution: false, dynamicImport: false, externalHostExecution: false } as const;

// Reference-only families can be extended by adding declarative records, not executable code.
export const dynamicFamilyExtensionRule = "ADD_DECLARATIVE_FAMILY_OR_VARIANT_AND_TEST" as const;

// Compact deterministic fingerprint for UI and audit labels.
export function familyFingerprint(familyId: string, variantId: string) { return `${familyId}:${variantId}:ARKI-DYNAMIC-FAMILY-GENERATOR-1.0`; }

// Human-readable next-step status.
export const dynamicFamilyStatus = "PARAMETRIC_CANDIDATE_REQUIRES_PROFESSIONAL_REVIEW" as const;

// Keep exports stable for future UI adapters.
export const DYNAMIC_FAMILY_CATEGORIES: FamilyCategory[] = ["SALUD", "EDUCATION", "COMMERCE", "SPORT", "OFFICES", "LANDSCAPE", "INDUSTRY", "TRANSPORT", "CULTURE", "RESIDENTIAL", "HOSPITALITY", "WORSHIP"];
export const DYNAMIC_FAMILY_SCALES: BuildingScale[] = ["BUILDING", "COMPLEX", "URBAN"];

// Metadata for the generated artifact.
export function generatedBuildingMetadata(building: GeneratedBuilding) { return { schema: "ARKI-GENERATED-BUILDING-1.0", artifactId: building.id, familyId: building.familyId, variantId: building.variantId, status: building.status, humanReviewRequired: building.humanReviewRequired, projectStateMutation: building.projectStateMutation }; }

// A generated building never becomes canonical implicitly.
export const CANONICAL_PROMOTION = "NOT_REQUESTED" as const;

// Stable contract check used by tests and future adapters.
export function isProposalOnly(building: GeneratedBuilding) { return building.status === "GENERATED_CANDIDATE" && building.humanReviewRequired && building.projectStateMutation === "NOT_REQUESTED"; }

// Compatibility alias for callers that prefer Spanish naming.
export const generarEdificacionDinamica = generateDynamicBuilding;
export const listarFamiliasDinamicas = listDynamicFamilies;

// The current registry intentionally starts with a few root families and grows through variants.
export const ROOT_FAMILY_POLICY = "SMALL_ROOT_REGISTRY_WITH_COMPOSABLE_VARIANTS" as const;

// No family count is presented as a completed master inventory.
export const INVENTORY_STATUS = "ROOT_FAMILIES_AND_VARIANTS_IMPLEMENTED; EXPANSION_PENDING" as const;

// End of governed dynamic family contract.
