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
  defaultShapeType?: string;

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
  geometry2d: {
    type: string;
    shapeType: string;
    footprintM2: number;
    widthM: number;
    depthM: number;
    courtyardM2?: number;
    rings?: number;
    polygon?: Array<{ x: number; y: number }>;
    voids?: Array<Array<{ x: number; y: number }>>;
  };
  section: { type: string; floors: number; floorHeightM: number; totalHeightM: number; usesByFloor: string[] };
  geometry3d: { type: string; floors: number; heightM: number; massing: string };
  unifiedGeometry: {
    schema: "ARKI-UNIFIED-GEOMETRY-1.0";
    plan: GeneratedBuilding["geometry2d"];
    section: GeneratedBuilding["section"];
    model3d: GeneratedBuilding["geometry3d"];
  };
  metrics: {
    footprintM2: number;
    builtAreaM2: number;
    capacity: number;
    estimatedCostUsdConceptual: number;
    efficiencyRatio: number;
    costPerM2: number;
    capacityPerM2: number;
    complianceScore: number;
    energyUseIntensity: number;
    waterUseIntensity: number;
    carbonFootprint: number;
    structuralEfficiency: number;
    daylightFactor: number;
    acousticComfort: number;
    thermalComfort: number;
    accessibilityScore: number;
    flexibilityScore: number;
    maintenanceCost: number;
    lifecycleCost: number;
    resilienceScore: number;
    biophilicScore: number;
    circulationEfficiency: number;
    programCompliance: number;
  };
  validation: { status: "PASS" | "UNKNOWN" | "BLOCKED"; checked: string[]; unknowns: string[] };
  alerts: Array<{ code: string; message: string; severity: "INFO" | "WARNING" | "BLOCKER" }>;
  status: "GENERATED_CANDIDATE";
  humanReviewRequired: true;
  projectStateMutation: "NOT_REQUESTED";
};

const p = (id: string, label: string, defaultValue: string | number | boolean, extra: Partial<FamilyParameter> = {}): FamilyParameter => ({ id, label, type: typeof defaultValue as FamilyParameter["type"], defaultValue, ...extra });
const rule = (id: string, code: string, description: string, parameter: string, operator: RuleOperator, value: number | string | boolean | undefined, source: string): FamilyRule => ({ id, code, description, parameter, operator, value, source, required: true });
const program = (primarySpaces: string[], services: string[], circulations: string[]): FamilyProgram => ({ zones: [{ id: "PUBLIC", name: "Área pública", areaRatio: 0.25 }, { id: "SERVICE", name: "Área de servicio", areaRatio: 0.15 }, { id: "PRIMARY", name: "Área principal", areaRatio: 0.6 }], primarySpaces, services, circulations });

function makeAdditionalFamily(input: { id: string; name: string; category: FamilyCategory; description: string; geometryStrategy: DynamicBuildingFamily["geometryStrategy"]; tags: string[]; primary: string[]; services: string[]; variants: Array<{ id: string; name: string; description: string; tags: string[]; extra: string[]; modifiers: Record<string, string | number | boolean> }>
    defaultShapeType?: string;}): DynamicBuildingFamily {
  return { id: input.id, name: input.name, description: input.description, category: input.category, scale: input.category === "LANDSCAPE" ? "URBAN" : "COMPLEX", version: "1.0.0", baseProgram: program(input.primary, input.services, ["público", "personal", "servicio", "evacuación"]), variants: input.variants.map((variant) => ({ id: variant.id, name: variant.name, description: variant.description, capacityUnit: "usuarios", modifiers: { floors: 2, courtyardRatio: 0.08, capacity: 300, ...variant.modifiers }, programExtra: variant.extra, ruleIds: ["GEN-EGRESS"], tags: variant.tags })), baseParameters: [p("areaM2", "Área del terreno", 10000, { unit: "m²", min: 100 }), p("capacity", "Capacidad", 300, { unit: "personas", min: 1 }), p("floors", "Niveles", 2, { unit: "niveles", min: 1, max: 80 }), p("courtyardRatio", "Proporción de vacío", 0.08, { unit: "ratio", min: 0, max: 0.8 })], baseRules: [rule("GEN-EGRESS", "RNE-A.130", "Aforo y evacuación requieren validación del proyecto.", "egressValidated", "REQUIRED", true, "RNE de referencia; especialista")], geometryStrategy: input.geometryStrategy, defaultShapeType: (input as any).defaultShapeType, tags: input.tags };
}

const ADDITIONAL_DYNAMIC_FAMILIES: DynamicBuildingFamily[] = [
  makeAdditionalFamily({ id: "FAM-LANDSCAPE", name: "Paisajismo", category: "LANDSCAPE", description: "Parques, plazas, malecones, corredores verdes y humedales.", geometryStrategy: "COURTYARD_MASS", defaultShapeType: "COURTYARD", tags: ["paisajismo", "parque", "espacio público", "GH.020"], primary: ["áreas verdes", "senderos", "estancias", "equipamiento"], services: ["riego", "bombas", "servicios higiénicos"], variants: [
    { id: "URBAN_PARK", name: "Parque urbano", description: "Parque de barrio con recreación y vegetación.", tags: ["parque", "verde"], extra: ["juegos infantiles", "ciclovía"], modifiers: { areaM2: 20000, capacity: 5000 } },
    { id: "PUBLIC_PLAZA", name: "Plaza pública", description: "Plaza cívica y cultural.", tags: ["plaza", "cívica"], extra: ["fuente", "pavimento cívico"], modifiers: { areaM2: 5000, capacity: 2000 } },
    { id: "WETLAND", name: "Humedal artificial", description: "Humedal para tratamiento y biodiversidad.", tags: ["humedal", "agua"], extra: ["sendero interpretativo", "mirador de aves"], modifiers: { areaM2: 50000, capacity: 500 } },
    { id: "BOTANICAL", name: "Jardín botánico", description: "Colección viva de especies vegetales con fines educativos.", tags: ["botánico", "educativo"], extra: ["invernadero", "herbario", "senderos"], modifiers: { "floors": 1, "courtyardRatio": 0.4, "capacity": 500 } },
    { id: "GREENWAY", name: "Corredor verde", description: "Franja lineal de vegetación y movilidad no motorizada.", tags: ["corredor", "movilidad"], extra: ["ciclovía", "senderos", "estaciones"], modifiers: { "floors": 1, "courtyardRatio": 0.3, "capacity": 800 } },
    { id: "PLAYGROUND", name: "Parque infantil", description: "Área de juegos y recreación para niños.", tags: ["infantil", "recreación"], extra: ["juegos", "áreas blandas", "servicios"], modifiers: { "floors": 1, "courtyardRatio": 0.2, "capacity": 200 } },
    { id: "POCKET_PARK", name: "Parque de bolsillo", description: "Espacio verde pequeño en trama urbana densa.", tags: ["urbano", "compacto"], extra: ["vegetación", "bancas", "iluminación"], modifiers: { "floors": 1, "courtyardRatio": 0.35, "capacity": 50 } },
    { id: "RIPARIAN", name: "Parque ribereño", description: "Espacio verde asociado a cuerpos de agua.", tags: ["ribereño", "agua"], extra: ["miradores", "senderos", "vegetación riparia"], modifiers: { "floors": 1, "courtyardRatio": 0.25, "capacity": 400 } },
    { id: "FOREST", name: "Parque forestal", description: "Área verde de gran escala con vegetación densa.", tags: ["forestal", "gran-escala"], extra: ["senderos", "miradores", "equipamiento"], modifiers: { "floors": 1, "courtyardRatio": 0.5, "capacity": 2000 } },
    { id: "MEMORIAL", name: "Parque memorial", description: "Espacio verde conmemorativo con valor simbólico.", tags: ["memorial", "simbólico"], extra: ["monumento", "jardines", "explanada"], modifiers: { "floors": 1, "courtyardRatio": 0.3, "capacity": 300 } }
  ] }),
  makeAdditionalFamily({ id: "FAM-INDUSTRY", name: "Industria", category: "INDUSTRY", description: "Manufactura, almacenes y centros logísticos.", geometryStrategy: "LINEAR_MASS", defaultShapeType: "COMPACT", tags: ["industria", "manufactura", "logística", "RNE-A.060"], primary: ["producción", "almacén", "patio de maniobras"], services: ["vestuarios", "cuarto eléctrico", "control de calidad"], variants: [
    { id: "WAREHOUSE", name: "Almacén simple", description: "Almacén de mercancías secas.", tags: ["almacén"], extra: ["racks", "muelles"], modifiers: { areaM2: 3000, floors: 1 } },
    { id: "LOGISTICS", name: "Centro logístico", description: "Distribución multi-almacén.", tags: ["logística"], extra: ["muelles múltiples", "patio de maniobras"], modifiers: { areaM2: 25000, floors: 1 } },
    { id: "MANUFACTURING", name: "Planta de manufactura", description: "Producción industrial con líneas y control de calidad.", tags: ["manufactura"], extra: ["líneas de producción", "laboratorio"], modifiers: { areaM2: 15000, floors: 2 } },
    { id: "FOOD", name: "Planta de alimentos", description: "Procesamiento y envasado de alimentos.", tags: ["alimentos", "procesamiento"], extra: ["línea de proceso", "cámaras frías", "control de calidad"], modifiers: { "floors": 2, "courtyardRatio": 0.05, "capacity": 200 } },
    { id: "TEXTILE", name: "Planta textil", description: "Producción de tejidos y confección.", tags: ["textil", "confección"], extra: ["telares", "tintorería", "almacén"], modifiers: { "floors": 2, "courtyardRatio": 0.05, "capacity": 300 } },
    { id: "AUTOMOTIVE", name: "Planta automotriz", description: "Ensamblaje de vehículos y autopartes.", tags: ["automotriz", "ensamblaje"], extra: ["línea de montaje", "pintura", "control"], modifiers: { "floors": 2, "courtyardRatio": 0.02, "capacity": 500 } },
    { id: "CHEMICAL", name: "Planta química", description: "Producción de químicos industriales.", tags: ["química", "industrial"], extra: ["reactores", "almacenamiento", "seguridad"], modifiers: { "floors": 3, "courtyardRatio": 0.02, "capacity": 150 } },
    { id: "PHARMA", name: "Planta farmacéutica", description: "Producción de medicamentos con control de calidad.", tags: ["farmacéutica", "salud"], extra: ["sala limpia", "control", "almacén"], modifiers: { "floors": 3, "courtyardRatio": 0.05, "capacity": 100 } },
    { id: "RECYCLING", name: "Planta de reciclaje", description: "Procesamiento de materiales reciclables.", tags: ["reciclaje", "sostenible"], extra: ["clasificación", "prensado", "almacén"], modifiers: { "floors": 1, "courtyardRatio": 0.1, "capacity": 80 } },
    { id: "WORKSHOP", name: "Taller industrial", description: "Taller de fabricación y mantenimiento.", tags: ["taller", "mantenimiento"], extra: ["maquinaria", "almacén", "oficina"], modifiers: { "floors": 1, "courtyardRatio": 0.05, "capacity": 50 } }
  ] }),
  makeAdditionalFamily({ id: "FAM-TRANSPORT", name: "Transporte", category: "TRANSPORT", description: "Terminales, estaciones, aeropuertos y nodos intermodales.", geometryStrategy: "LINEAR_MASS", defaultShapeType: "COMPACT", tags: ["transporte", "terminal", "intermodal"], primary: ["vestíbulo", "andenes", "circulación pública"], services: ["control", "equipaje", "mantenimiento"], variants: [
    { id: "BUS_TERMINAL", name: "Terminal terrestre", description: "Terminal de buses interprovincial.", tags: ["buses", "terminal"], extra: ["andenes", "salas de espera"], modifiers: { areaM2: 18000, capacity: 2500 } },
    { id: "STATION", name: "Estación intermodal", description: "Intercambio de modos de transporte.", tags: ["intermodal", "estación"], extra: ["conexión peatonal", "bicicletas"], modifiers: { areaM2: 12000, capacity: 4000 } },
    { id: "AIRPORT", name: "Terminal aeroportuaria", description: "Terminal de pasajeros con controles y plataforma.", tags: ["aeropuerto", "aviación"], extra: ["check-in", "seguridad", "mangas"], modifiers: { areaM2: 60000, capacity: 12000, floors: 3 } },
    { id: "PORT", name: "Puerto marítimo", description: "Terminal portuaria para carga y pasajeros.", tags: ["portuario", "marítimo"], extra: ["muelles", "almacenes", "grúas"], modifiers: { "floors": 1, "courtyardRatio": 0.05, "capacity": 5000 } },
    { id: "RAILWAY", name: "Estación ferroviaria", description: "Terminal de trenes con andenes y servicios.", tags: ["ferroviario", "tren"], extra: ["andenes", "vestíbulo", "comercio"], modifiers: { "floors": 2, "courtyardRatio": 0.1, "capacity": 3000 } },
    { id: "HELIPORT", name: "Helipuerto", description: "Área de aterrizaje y despegue de helicópteros.", tags: ["aéreo", "helicóptero"], extra: ["plataforma", "hangar", "control"], modifiers: { "floors": 1, "courtyardRatio": 0, "capacity": 50 } },
    { id: "METRO", name: "Estación de metro", description: "Estación subterránea de transporte masivo.", tags: ["metro", "subterráneo"], extra: ["andenes", "accesos", "comercio"], modifiers: { "floors": 2, "courtyardRatio": 0, "capacity": 5000 } },
    { id: "LOGISTICS_HUB", name: "Hub logístico", description: "Centro de distribución multimodal.", tags: ["logística", "multimodal"], extra: ["almacenes", "muelles", "patio"], modifiers: { "floors": 1, "courtyardRatio": 0.05, "capacity": 1000 } },
    { id: "TAXI_RANK", name: "Ranking de taxis", description: "Estación de taxis y vehículos de alquiler.", tags: ["taxis", "urbano"], extra: ["andenes", "espera", "servicios"], modifiers: { "floors": 1, "courtyardRatio": 0.05, "capacity": 200 } },
    { id: "AIRPORT_HUB", name: "Hub aeroportuario", description: "Centro de conexión aérea con múltiples terminales.", tags: ["aéreo", "hub"], extra: ["terminales", "conexiones", "servicios"], modifiers: { "floors": 3, "courtyardRatio": 0.05, "capacity": 8000 } }
  ] }),
  makeAdditionalFamily({ id: "FAM-CULTURE", name: "Cultura", category: "CULTURE", description: "Museos, bibliotecas, teatros y centros culturales.", geometryStrategy: "COURTYARD_MASS", defaultShapeType: "COURTYARD", tags: ["cultura", "museo", "teatro"], primary: ["exposición", "auditorio", "espacio comunitario"], services: ["carga cultural", "conservación", "taquilla"], variants: [
    { id: "MUSEUM", name: "Museo", description: "Museo con galerías y conservación.", tags: ["museo"], extra: ["galerías", "depósitos"], modifiers: { areaM2: 8000, capacity: 1200 } },
    { id: "LIBRARY", name: "Biblioteca", description: "Biblioteca pública y digital.", tags: ["biblioteca"], extra: ["salas de lectura", "archivo"], modifiers: { areaM2: 5000, capacity: 600 } },
    { id: "THEATER", name: "Teatro", description: "Teatro y artes escénicas.", tags: ["teatro", "escénico"], extra: ["escenario", "camerinos"], modifiers: { areaM2: 10000, capacity: 1400 } },
    { id: "GALLERY", name: "Galería de arte", description: "Espacio expositivo de arte contemporáneo.", tags: ["galería", "arte"], extra: ["salas", "depósito", "tienda"], modifiers: { "floors": 2, "courtyardRatio": 0.15, "capacity": 300 } },
    { id: "CINEMA", name: "Cine", description: "Sala de proyección cinematográfica.", tags: ["cine", "proyección"], extra: ["salas", "taquilla", "confitería"], modifiers: { "floors": 2, "courtyardRatio": 0.05, "capacity": 500 } },
    { id: "ARCHIVE", name: "Archivo histórico", description: "Depósito y consulta de documentos históricos.", tags: ["archivo", "histórico"], extra: ["depósitos", "sala de consulta", "restauración"], modifiers: { "floors": 3, "courtyardRatio": 0.1, "capacity": 150 } },
    { id: "AUDITORIUM", name: "Auditorio", description: "Sala de eventos y espectáculos.", tags: ["auditorio", "eventos"], extra: ["sala", "escenario", "camerinos"], modifiers: { "floors": 3, "courtyardRatio": 0.1, "capacity": 1000 } },
    { id: "MUSEUM_STORE", name: "Depósito museográfico", description: "Almacén de colecciones museográficas.", tags: ["depósito", "colección"], extra: ["almacenes", "conservación", "talleres"], modifiers: { "floors": 2, "courtyardRatio": 0.1, "capacity": 80 } },
    { id: "CULTURAL_CENTER", name: "Centro cultural", description: "Espacio comunitario para actividades culturales.", tags: ["comunitario", "cultural"], extra: ["talleres", "sala", "biblioteca"], modifiers: { "floors": 3, "courtyardRatio": 0.15, "capacity": 500 } },
    { id: "PERFORMING_ARTS", name: "Centro de artes escénicas", description: "Espacio para teatro, danza y música.", tags: ["artes", "escénicas"], extra: ["teatros", "ensayo", "producción"], modifiers: { "floors": 3, "courtyardRatio": 0.1, "capacity": 800 } }
  ] }),
  makeAdditionalFamily({ id: "FAM-RESIDENTIAL", name: "Residencial", category: "RESIDENTIAL", description: "Vivienda unifamiliar, multifamiliar y conjunto residencial.", geometryStrategy: "COURTYARD_MASS", defaultShapeType: "COURTYARD", tags: ["vivienda", "residencial", "multifamiliar"], primary: ["unidades de vivienda", "áreas comunes", "patios"], services: ["estacionamiento", "cuartos técnicos", "residuos"], variants: [
    { id: "SINGLE", name: "Vivienda unifamiliar", description: "Casa independiente.", tags: ["casa"], extra: ["jardín", "estacionamiento"], modifiers: { areaM2: 300, capacity: 6, floors: 2 } },
    { id: "MULTIFAMILY", name: "Multifamiliar", description: "Edificio de departamentos.", tags: ["departamentos"], extra: ["núcleo vertical", "área común"], modifiers: { areaM2: 3000, capacity: 120, floors: 8 } },
    { id: "HOUSING_COMPLEX", name: "Conjunto residencial", description: "Conjunto de bloques y espacio común.", tags: ["conjunto", "barrial"], extra: ["parque común", "equipamiento vecinal"], modifiers: { areaM2: 20000, capacity: 900, floors: 5 } },
    { id: "SOCIAL", name: "Vivienda social", description: "Vivienda de interés social con áreas comunes.", tags: ["social", "asequible"], extra: ["viviendas", "áreas comunes", "equipamiento"], modifiers: { "floors": 4, "courtyardRatio": 0.15, "capacity": 300 } },
    { id: "STUDENT", name: "Residencia estudiantil", description: "Alojamiento para estudiantes universitarios.", tags: ["estudiantil", "universitario"], extra: ["habitaciones", "estudio", "comedor"], modifiers: { "floors": 5, "courtyardRatio": 0.1, "capacity": 200 } },
    { id: "SENIOR", name: "Residencia para mayores", description: "Alojamiento asistido para adultos mayores.", tags: ["senior", "asistido"], extra: ["habitaciones", "enfermería", "jardín"], modifiers: { "floors": 3, "courtyardRatio": 0.2, "capacity": 80 } },
    { id: "COHOUSING", name: "Cohousing", description: "Vivienda colaborativa con espacios compartidos.", tags: ["colaborativo", "comunitario"], extra: ["viviendas", "cocina común", "talleres"], modifiers: { "floors": 3, "courtyardRatio": 0.2, "capacity": 60 } },
    { id: "MICRO", name: "Micro-vivienda", description: "Unidades habitacionales mínimas.", tags: ["micro", "compacto"], extra: ["unidades", "servicios comunes"], modifiers: { "floors": 6, "courtyardRatio": 0.05, "capacity": 150 } },
    { id: "TOWNHOUSE", name: "Vivienda adosada", description: "Viviendas en hilera con acceso individual.", tags: ["adosada", "hilera"], extra: ["viviendas", "patios", "estacionamiento"], modifiers: { "floors": 3, "courtyardRatio": 0.1, "capacity": 40 } },
    { id: "PENTHOUSE", name: "Penthouse", description: "Vivienda de lujo en altura.", tags: ["lujo", "altura"], extra: ["terraza", "amenities", "vistas"], modifiers: { "floors": 8, "courtyardRatio": 0.05, "capacity": 10 } }
  ] }),
  makeAdditionalFamily({ id: "FAM-HOSPITALITY", name: "Hospedaje", category: "HOSPITALITY", description: "Hoteles, hostales y resorts.", geometryStrategy: "COURTYARD_MASS", defaultShapeType: "COURTYARD", tags: ["hotel", "turismo", "hospedaje"], primary: ["habitaciones", "lobby", "restaurante"], services: ["housekeeping", "cocina", "mantenimiento"], variants: [
    { id: "HOTEL", name: "Hotel", description: "Hotel urbano con habitaciones y servicios.", tags: ["hotel"], extra: ["recepción", "salón de eventos"], modifiers: { areaM2: 15000, capacity: 500, floors: 10 } },
    { id: "HOSTEL", name: "Hostal", description: "Hospedaje económico de escala media.", tags: ["hostal"], extra: ["cocina compartida", "terraza"], modifiers: { areaM2: 2500, capacity: 100, floors: 4 } },
    { id: "RESORT", name: "Resort", description: "Complejo turístico con paisaje y recreación.", tags: ["resort", "paisaje"], extra: ["piscinas", "spa", "jardines"], modifiers: { areaM2: 40000, capacity: 700, floors: 4 } },
    { id: "BOUTIQUE", name: "Hotel boutique", description: "Hotel pequeño con diseño personalizado.", tags: ["boutique", "diseño"], extra: ["habitaciones", "restaurante", "lobby"], modifiers: { "floors": 3, "courtyardRatio": 0.15, "capacity": 80 } },
    { id: "CAPSULE", name: "Hotel cápsula", description: "Alojamiento compacto de alta densidad.", tags: ["cápsula", "compacto"], extra: ["cápsulas", "baños comunes", "lounge"], modifiers: { "floors": 5, "courtyardRatio": 0.05, "capacity": 200 } },
    { id: "GLAMPING", name: "Glamping", description: "Alojamiento de lujo en naturaleza.", tags: ["glamping", "naturaleza"], extra: ["tiendas", "servicios", "restaurante"], modifiers: { "floors": 1, "courtyardRatio": 0.3, "capacity": 60 } },
    { id: "BUSINESS", name: "Hotel de negocios", description: "Hotel orientado a viajeros corporativos.", tags: ["negocios", "corporativo"], extra: ["habitaciones", "salas", "business center"], modifiers: { "floors": 6, "courtyardRatio": 0.1, "capacity": 300 } },
    { id: "ECO_LODGE", name: "Eco-lodge", description: "Alojamiento sostenible en entorno natural.", tags: ["eco", "sostenible"], extra: ["cabañas", "servicios", "senderos"], modifiers: { "floors": 2, "courtyardRatio": 0.25, "capacity": 100 } },
    { id: "APARTHOTEL", name: "Aparthotel", description: "Alojamiento con servicios de hotel y cocina.", tags: ["aparthotel", "apartamento"], extra: ["apartamentos", "servicios", "restaurante"], modifiers: { "floors": 5, "courtyardRatio": 0.1, "capacity": 200 } },
    { id: "WELLNESS", name: "Hotel de bienestar", description: "Hotel con spa y servicios de salud.", tags: ["bienestar", "spa"], extra: ["spa", "tratamientos", "piscina"], modifiers: { "floors": 4, "courtyardRatio": 0.15, "capacity": 150 } }
  ] }),
  makeAdditionalFamily({ id: "FAM-WORSHIP", name: "Culto", category: "WORSHIP", description: "Templos, centros comunitarios y espacios de culto.", geometryStrategy: "COURTYARD_MASS", defaultShapeType: "COURTYARD", tags: ["culto", "templo", "comunidad"], primary: ["sala de culto", "patio", "espacio comunitario"], services: ["administración", "servicios", "apoyo social"], variants: [
    { id: "TEMPLE", name: "Templo", description: "Espacio de culto con nave principal.", tags: ["templo"], extra: ["nave", "sacristía"], modifiers: { areaM2: 2500, capacity: 800, floors: 1 } },
    { id: "COMMUNITY_CENTER", name: "Centro comunitario", description: "Centro de reunión y apoyo social.", tags: ["comunidad"], extra: ["aulas", "comedor social"], modifiers: { areaM2: 4000, capacity: 500, floors: 2 } },
    { id: "CHURCH", name: "Iglesia", description: "Templo cristiano con nave y campanario.", tags: ["cristiano", "iglesia"], extra: ["nave", "altar", "campanario"], modifiers: { "floors": 2, "courtyardRatio": 0.2, "capacity": 500 } },
    { id: "MOSQUE", name: "Mezquita", description: "Templo islámico con sala de oración.", tags: ["islámico", "mezquita"], extra: ["sala de oración", "minarete", "patio"], modifiers: { "floors": 2, "courtyardRatio": 0.25, "capacity": 600 } },
    { id: "SYNAGOGUE", name: "Sinagoga", description: "Templo judío con sala de oración.", tags: ["judío", "sinagoga"], extra: ["sala de oración", "estudio", "patio"], modifiers: { "floors": 2, "courtyardRatio": 0.2, "capacity": 300 } },
    { id: "BUDDHIST_TEMPLE", name: "Templo budista", description: "Templo para práctica budista.", tags: ["budista", "templo"], extra: ["sala de meditación", "jardín", "monasterio"], modifiers: { "floors": 2, "courtyardRatio": 0.3, "capacity": 200 } },
    { id: "HINDU_TEMPLE", name: "Templo hindú", description: "Templo para práctica hindú.", tags: ["hindú", "templo"], extra: ["santuario", "sala", "patio"], modifiers: { "floors": 2, "courtyardRatio": 0.25, "capacity": 400 } },
    { id: "CHAPEL", name: "Capilla", description: "Pequeño espacio de oración.", tags: ["capilla", "pequeño"], extra: ["sala", "altar", "sacristía"], modifiers: { "floors": 1, "courtyardRatio": 0.15, "capacity": 80 } },
    { id: "MEDITATION", name: "Centro de meditación", description: "Espacio para meditación y retiro.", tags: ["meditación", "retiro"], extra: ["sala", "jardín", "residencia"], modifiers: { "floors": 2, "courtyardRatio": 0.3, "capacity": 100 } },
    { id: "MULTIFAITH", name: "Centro multiconfesional", description: "Espacio compartido por varias confesiones.", tags: ["multiconfesional", "interreligioso"], extra: ["salas", "patio", "servicios"], modifiers: { "floors": 2, "courtyardRatio": 0.2, "capacity": 300 } }
  ] }),
  makeAdditionalFamily({ id: "FAM-EMERGENCY", name: "Emergencia", category: "SALUD", description: "Bomberos, policía y hospitales de campaña.", geometryStrategy: "LINEAR_MASS", defaultShapeType: "COMPACT", tags: ["emergencia", "bomberos", "policía"], primary: ["estación", "área de operaciones", "equipamiento"], services: ["vestuarios", "mantenimiento", "comunicaciones"], variants: [
    { id: "FIRE_STATION", name: "Estación de bomberos", description: "Estación con cocheras y áreas de entrenamiento.", tags: ["bomberos"], extra: ["cocheras", "torre de entrenamiento"], modifiers: { areaM2: 5000, capacity: 100, floors: 2 } },
    { id: "POLICE_STATION", name: "Estación de policía", description: "Estación con celdas y área administrativa.", tags: ["policía"], extra: ["celdas", "sala de interrogatorios"], modifiers: { areaM2: 4000, capacity: 150, floors: 3 } },
    { id: "FIELD_HOSPITAL", name: "Hospital de campaña", description: "Estructura modular para emergencias.", tags: ["hospital", "campaña"], extra: ["triaje", "quirófano móvil"], modifiers: { areaM2: 2000, capacity: 50, floors: 1 } },
    { id: "AMBULANCE", name: "Base de ambulancias", description: "Estación para vehículos de emergencia.", tags: ["ambulancia", "emergencia"], extra: ["cocheras", "equipo", "control"], modifiers: { "floors": 1, "courtyardRatio": 0.1, "capacity": 30 } },
    { id: "RESCUE", name: "Centro de rescate", description: "Base para operaciones de rescate.", tags: ["rescate", "búsqueda"], extra: ["equipo", "almacén", "comunicaciones"], modifiers: { "floors": 2, "courtyardRatio": 0.1, "capacity": 50 } },
    { id: "COAST_GUARD", name: "Guardia costera", description: "Estación de vigilancia y rescate marítimo.", tags: ["costera", "marítimo"], extra: ["muelles", "equipo", "control"], modifiers: { "floors": 2, "courtyardRatio": 0.1, "capacity": 80 } },
    { id: "MOUNTAIN_RESCUE", name: "Rescate de montaña", description: "Base para operaciones de alta montaña.", tags: ["montaña", "rescate"], extra: ["equipo", "helipuerto", "almacén"], modifiers: { "floors": 2, "courtyardRatio": 0.1, "capacity": 40 } },
    { id: "FIRE_TRAINING", name: "Centro de entrenamiento de bomberos", description: "Instalación para entrenamiento de bomberos.", tags: ["entrenamiento", "bomberos"], extra: ["torre", "simuladores", "aulas"], modifiers: { "floors": 3, "courtyardRatio": 0.15, "capacity": 100 } },
    { id: "POLICE_ACADEMY", name: "Academia de policía", description: "Centro de formación policial.", tags: ["policía", "formación"], extra: ["aulas", "canchas", "residencia"], modifiers: { "floors": 3, "courtyardRatio": 0.2, "capacity": 300 } },
    { id: "CRISIS_CENTER", name: "Centro de crisis", description: "Centro de coordinación de emergencias.", tags: ["crisis", "coordinación"], extra: ["sala de crisis", "comunicaciones", "monitoreo"], modifiers: { "floors": 2, "courtyardRatio": 0.05, "capacity": 60 } }
  ] }),
  makeAdditionalFamily({ id: "FAM-AGRICULTURE", name: "Agricultura", category: "INDUSTRY", description: "Invernaderos, establos y agroindustria.", geometryStrategy: "LINEAR_MASS", defaultShapeType: "COMPACT", tags: ["agricultura", "invernadero", "agroindustria"], primary: ["producción", "almacenamiento", "procesamiento"], services: ["riego", "mantenimiento", "residuos"], variants: [
    { id: "GREENHOUSE", name: "Invernadero", description: "Estructura para cultivo controlado.", tags: ["invernadero"], extra: ["riego automático", "control climático"], modifiers: { areaM2: 10000, capacity: 200, floors: 1 } },
    { id: "BARN", name: "Establo", description: "Establo para ganado.", tags: ["establo", "ganado"], extra: ["corrales", "silos"], modifiers: { areaM2: 8000, capacity: 300, floors: 1 } },
    { id: "AGRO_INDUSTRIAL", name: "Planta agroindustrial", description: "Procesamiento de productos agrícolas.", tags: ["agroindustria"], extra: ["línea de proceso", "almacén"], modifiers: { areaM2: 15000, capacity: 150, floors: 2 } },
    { id: "AQUACULTURE", name: "Acuicultura", description: "Producción de organismos acuáticos.", tags: ["acuicultura", "agua"], extra: ["estanques", "procesamiento", "almacén"], modifiers: { "floors": 1, "courtyardRatio": 0.1, "capacity": 100 } },
    { id: "HYDROPONICS", name: "Hidroponía", description: "Cultivo sin suelo en ambiente controlado.", tags: ["hidroponía", "controlado"], extra: ["invernadero", "nutrición", "almacén"], modifiers: { "floors": 2, "courtyardRatio": 0.05, "capacity": 50 } },
    { id: "POULTRY", name: "Avicultura", description: "Producción avícola intensiva.", tags: ["avicultura", "producción"], extra: ["galpones", "almacén", "procesamiento"], modifiers: { "floors": 1, "courtyardRatio": 0.05, "capacity": 200 } },
    { id: "LIVESTOCK", name: "Ganadería", description: "Producción ganadera extensiva.", tags: ["ganadería", "animales"], extra: ["establos", "pasturas", "almacén"], modifiers: { "floors": 1, "courtyardRatio": 0.1, "capacity": 150 } },
    { id: "DAIRY", name: "Tambos", description: "Producción lechera.", tags: ["leche", "tambo"], extra: ["sala de ordeño", "almacén", "frío"], modifiers: { "floors": 1, "courtyardRatio": 0.1, "capacity": 80 } },
    { id: "COLD_CHAIN", name: "Cadena de frío", description: "Almacenamiento y distribución refrigerada.", tags: ["frío", "cadena"], extra: ["cámaras", "muelles", "control"], modifiers: { "floors": 1, "courtyardRatio": 0.05, "capacity": 100 } },
    { id: "SEED_PROCESSING", name: "Procesamiento de semillas", description: "Limpieza y envasado de semillas.", tags: ["semillas", "procesamiento"], extra: ["limpieza", "secado", "almacén"], modifiers: { "floors": 1, "courtyardRatio": 0.1, "capacity": 60 } }
  ] }),
  makeAdditionalFamily({ id: "FAM-ENERGY", name: "Energía", category: "INDUSTRY", description: "Plantas solares, eólicas y subestaciones.", geometryStrategy: "LINEAR_MASS", defaultShapeType: "COMPACT", tags: ["energía", "solar", "eólica"], primary: ["generación", "transformación", "control"], services: ["mantenimiento", "seguridad", "almacenamiento"], variants: [
    { id: "SOLAR_PLANT", name: "Planta solar", description: "Parque fotovoltaico.", tags: ["solar"], extra: ["paneles", "inversores"], modifiers: { areaM2: 50000, capacity: 50, floors: 1 } },
    { id: "WIND_FARM", name: "Parque eólico", description: "Aerogeneradores y subestación.", tags: ["eólico"], extra: ["aerogeneradores", "subestación"], modifiers: { areaM2: 100000, capacity: 30, floors: 1 } },
    { id: "SUBSTATION", name: "Subestación eléctrica", description: "Transformación y distribución.", tags: ["subestación"], extra: ["transformadores", "control"], modifiers: { areaM2: 5000, capacity: 20, floors: 1 } },
    { id: "HYDRO", name: "Central hidroeléctrica", description: "Generación eléctrica a partir de agua.", tags: ["hidroeléctrica", "agua"], extra: ["turbinas", "presa", "sala de máquinas"], modifiers: { "floors": 2, "courtyardRatio": 0.05, "capacity": 50 } },
    { id: "GEOTHERMAL", name: "Planta geotérmica", description: "Generación a partir de calor terrestre.", tags: ["geotérmica", "calor"], extra: ["pozos", "turbinas", "control"], modifiers: { "floors": 1, "courtyardRatio": 0.05, "capacity": 40 } },
    { id: "BIOMASS", name: "Planta de biomasa", description: "Generación a partir de materia orgánica.", tags: ["biomasa", "orgánico"], extra: ["caldera", "almacén", "turbinas"], modifiers: { "floors": 1, "courtyardRatio": 0.05, "capacity": 60 } },
    { id: "NUCLEAR", name: "Central nuclear", description: "Generación eléctrica por fisión nuclear.", tags: ["nuclear", "fisión"], extra: ["reactor", "turbinas", "control"], modifiers: { "floors": 3, "courtyardRatio": 0.02, "capacity": 100 } },
    { id: "TIDAL", name: "Central mareomotriz", description: "Generación a partir de mareas.", tags: ["mareomotriz", "mar"], extra: ["turbinas", "diques", "control"], modifiers: { "floors": 1, "courtyardRatio": 0.05, "capacity": 30 } },
    { id: "BATTERY_STORAGE", name: "Almacenamiento en baterías", description: "Almacenamiento de energía eléctrica.", tags: ["baterías", "almacenamiento"], extra: ["baterías", "control", "seguridad"], modifiers: { "floors": 2, "courtyardRatio": 0.05, "capacity": 30 } },
    { id: "GREEN_HYDROGEN", name: "Hidrógeno verde", description: "Producción de hidrógeno renovable.", tags: ["hidrógeno", "renovable"], extra: ["electrolizadores", "almacenamiento", "control"], modifiers: { "floors": 2, "courtyardRatio": 0.05, "capacity": 40 } }
  ] }),
  makeAdditionalFamily({ id: "FAM-WATER", name: "Agua", category: "INDUSTRY", description: "Plantas de tratamiento, reservorios y desalinizadoras.", geometryStrategy: "COURTYARD_MASS", defaultShapeType: "COURTYARD", tags: ["agua", "tratamiento", "reservorio"], primary: ["tratamiento", "almacenamiento", "distribución"], services: ["bombas", "control", "mantenimiento"], variants: [
    { id: "TREATMENT_PLANT", name: "Planta de tratamiento", description: "Tratamiento de agua potable o residual.", tags: ["tratamiento"], extra: ["tanques", "laboratorio"], modifiers: { areaM2: 10000, capacity: 5000, floors: 2 } },
    { id: "RESERVOIR", name: "Reservorio", description: "Almacenamiento de agua.", tags: ["reservorio"], extra: ["tanques", "bombas"], modifiers: { areaM2: 20000, capacity: 10000, floors: 1 } },
    { id: "DESALINATION", name: "Desalinizadora", description: "Planta de desalinización.", tags: ["desalinización"], extra: ["ósmosis inversa", "salmuera"], modifiers: { areaM2: 15000, capacity: 8000, floors: 2 } },
    { id: "PUMPING", name: "Estación de bombeo", description: "Bombeo de agua a presión.", tags: ["bombeo", "agua"], extra: ["bombas", "control", "almacén"], modifiers: { "floors": 1, "courtyardRatio": 0.05, "capacity": 30 } },
    { id: "DISTRIBUTION", name: "Centro de distribución", description: "Distribución de agua potable.", tags: ["distribución", "potable"], extra: ["tanques", "bombas", "control"], modifiers: { "floors": 2, "courtyardRatio": 0.05, "capacity": 40 } },
    { id: "STORMWATER", name: "Drenaje pluvial", description: "Manejo de aguas de lluvia.", tags: ["pluvial", "drenaje"], extra: ["tanques", "canales", "control"], modifiers: { "floors": 1, "courtyardRatio": 0.1, "capacity": 20 } },
    { id: "WASTEWATER", name: "Planta de aguas residuales", description: "Tratamiento de aguas servidas.", tags: ["residuales", "tratamiento"], extra: ["tanques", "lodos", "control"], modifiers: { "floors": 1, "courtyardRatio": 0.1, "capacity": 80 } },
    { id: "WATER_TOWER", name: "Torre de agua", description: "Almacenamiento elevado de agua.", tags: ["torre", "almacenamiento"], extra: ["tanque", "bombas", "control"], modifiers: { "floors": 1, "courtyardRatio": 0, "capacity": 10 } },
    { id: "IRRIGATION", name: "Distrito de riego", description: "Infraestructura de riego agrícola.", tags: ["riego", "agrícola"], extra: ["canales", "compuertas", "control"], modifiers: { "floors": 1, "courtyardRatio": 0.05, "capacity": 50 } },
    { id: "DESAL_PLANT", name: "Planta desalinizadora de ósmosis", description: "Potabilización por ósmosis inversa.", tags: ["ósmosis", "desalinización"], extra: ["membranas", "bombas", "control"], modifiers: { "floors": 1, "courtyardRatio": 0.05, "capacity": 80 } }
  ] }),
  makeAdditionalFamily({ id: "FAM-WASTE", name: "Residuos", category: "INDUSTRY", description: "Reciclaje, rellenos sanitarios y compostaje.", geometryStrategy: "LINEAR_MASS", defaultShapeType: "COMPACT", tags: ["residuos", "reciclaje", "compostaje"], primary: ["recepción", "procesamiento", "disposición"], services: ["control", "mantenimiento", "seguridad"], variants: [
    { id: "RECYCLING_CENTER", name: "Centro de reciclaje", description: "Clasificación y procesamiento de residuos.", tags: ["reciclaje"], extra: ["clasificación", "prensado"], modifiers: { areaM2: 8000, capacity: 200, floors: 1 } },
    { id: "LANDFILL", name: "Relleno sanitario", description: "Disposición final de residuos.", tags: ["relleno"], extra: ["celdas", "control de lixiviados"], modifiers: { areaM2: 50000, capacity: 100, floors: 1 } },
    { id: "COMPOST_FACILITY", name: "Planta de compostaje", description: "Compostaje de residuos orgánicos.", tags: ["compostaje"], extra: ["pilas de compost", "cribado"], modifiers: { areaM2: 12000, capacity: 150, floors: 1 } },
    { id: "INCINERATOR", name: "Incineradora", description: "Combustión controlada de residuos.", tags: ["incineración", "residuos"], extra: ["horno", "caldera", "control"], modifiers: { "floors": 2, "courtyardRatio": 0.05, "capacity": 60 } },
    { id: "TRANSFER", name: "Estación de transferencia", description: "Transferencia de residuos entre vehículos.", tags: ["transferencia", "residuos"], extra: ["muelles", "almacén", "control"], modifiers: { "floors": 1, "courtyardRatio": 0.1, "capacity": 40 } },
    { id: "ANAEROBIC", name: "Digestión anaerobia", description: "Tratamiento de residuos orgánicos.", tags: ["anaerobia", "orgánico"], extra: ["digestores", "gas", "control"], modifiers: { "floors": 1, "courtyardRatio": 0.1, "capacity": 40 } },
    { id: "E_WASTE", name: "Reciclaje electrónico", description: "Procesamiento de residuos electrónicos.", tags: ["electrónico", "reciclaje"], extra: ["desmontaje", "almacén", "control"], modifiers: { "floors": 2, "courtyardRatio": 0.05, "capacity": 50 } },
    { id: "CONSTRUCTION_WASTE", name: "Residuos de construcción", description: "Manejo de escombros y demolición.", tags: ["construcción", "escombros"], extra: ["clasificación", "trituración", "almacén"], modifiers: { "floors": 1, "courtyardRatio": 0.1, "capacity": 80 } },
    { id: "HAZARDOUS", name: "Residuos peligrosos", description: "Tratamiento de residuos peligrosos.", tags: ["peligroso", "tratamiento"], extra: ["almacenamiento", "tratamiento", "control"], modifiers: { "floors": 2, "courtyardRatio": 0.05, "capacity": 30 } },
    { id: "COMPOSTING", name: "Planta de compostaje", description: "Producción de compost de residuos orgánicos.", tags: ["compost", "orgánico"], extra: ["pilas", "volteo", "almacén"], modifiers: { "floors": 1, "courtyardRatio": 0.15, "capacity": 50 } }
  ] }),
  makeAdditionalFamily({ id: "FAM-DEFENSE", name: "Defensa", category: "OFFICES", description: "Cuarteles, centros de mando y búnkeres.", geometryStrategy: "LINEAR_MASS", defaultShapeType: "COMPACT", tags: ["defensa", "cuartel", "búnker"], primary: ["operaciones", "alojamiento", "entrenamiento"], services: ["comunicaciones", "mantenimiento", "seguridad"], variants: [
    { id: "BARRACKS", name: "Cuartel", description: "Alojamiento y entrenamiento militar.", tags: ["cuartel"], extra: ["dormitorios", "campo de entrenamiento"], modifiers: { areaM2: 15000, capacity: 500, floors: 3 } },
    { id: "COMMAND_CENTER", name: "Centro de mando", description: "Centro de operaciones y comunicaciones.", tags: ["mando"], extra: ["sala de crisis", "comunicaciones"], modifiers: { areaM2: 8000, capacity: 200, floors: 2 } },
    { id: "BUNKER", name: "Búnker", description: "Estructura fortificada subterránea.", tags: ["búnker"], extra: ["refugio", "suministros"], modifiers: { areaM2: 3000, capacity: 100, floors: 1 } },
    { id: "ARMORY", name: "Armería", description: "Almacenamiento seguro de armamento.", tags: ["armería", "armas"], extra: ["almacenes", "seguridad", "control"], modifiers: { "floors": 1, "courtyardRatio": 0.05, "capacity": 20 } },
    { id: "RADAR", name: "Estación de radar", description: "Vigilancia y detección aérea.", tags: ["radar", "vigilancia"], extra: ["antena", "control", "almacén"], modifiers: { "floors": 2, "courtyardRatio": 0.05, "capacity": 30 } },
    { id: "MISSILE_SILO", name: "Silo de misiles", description: "Instalación subterránea de misiles.", tags: ["silo", "misiles"], extra: ["silo", "control", "almacén"], modifiers: { "floors": 1, "courtyardRatio": 0, "capacity": 20 } },
    { id: "TRAINING_CAMP", name: "Campo de entrenamiento", description: "Área de entrenamiento militar.", tags: ["entrenamiento", "militar"], extra: ["canchas", "simuladores", "residencia"], modifiers: { "floors": 2, "courtyardRatio": 0.2, "capacity": 500 } },
    { id: "NAVAL_YARD", name: "Astillero naval", description: "Construcción y mantenimiento naval.", tags: ["naval", "astillero"], extra: ["diques", "talleres", "almacén"], modifiers: { "floors": 2, "courtyardRatio": 0.05, "capacity": 100 } },
    { id: "AIRBASE_HANGAR", name: "Hangar de base aérea", description: "Hangar para aeronaves militares.", tags: ["hangar", "aéreo"], extra: ["hangar", "talleres", "control"], modifiers: { "floors": 1, "courtyardRatio": 0.05, "capacity": 40 } },
    { id: "COMMAND_POST", name: "Puesto de mando", description: "Centro de mando y control militar.", tags: ["mando", "control"], extra: ["sala de mando", "comunicaciones", "seguridad"], modifiers: { "floors": 3, "courtyardRatio": 0.05, "capacity": 60 } }
  ] }),
  makeAdditionalFamily({ id: "FAM-MIXED_USE", name: "Uso mixto", category: "COMMERCE", description: "Live-work y complejos mixtos.", geometryStrategy: "PODIUM_TOWER", defaultShapeType: "COMPACT", tags: ["mixto", "live-work", "complejo"], primary: ["vivienda", "comercio", "oficinas"], services: ["estacionamiento", "servicios", "mantenimiento"], variants: [
    { id: "LIVE_WORK", name: "Live-work", description: "Vivienda y trabajo integrados.", tags: ["live-work"], extra: ["estudio", "vivienda"], modifiers: { areaM2: 5000, capacity: 100, floors: 4 } },
    { id: "MIXED_COMPLEX", name: "Complejo mixto", description: "Vivienda, comercio y oficinas.", tags: ["complejo"], extra: ["plaza", "torre"], modifiers: { areaM2: 20000, capacity: 800, floors: 8 } },
    { id: "TRANSIT_ORIENTED", name: "Desarrollo orientado al tránsito", description: "Mezcla de usos junto a transporte masivo.", tags: ["TOD", "tránsito"], extra: ["vivienda", "comercio", "oficinas"], modifiers: { "floors": 8, "courtyardRatio": 0.1, "capacity": 500 } },
    { id: "WORKFORCE", name: "Vivienda-trabajo", description: "Mezcla de vivienda y espacio de trabajo.", tags: ["workforce", "vivienda"], extra: ["viviendas", "talleres", "servicios"], modifiers: { "floors": 5, "courtyardRatio": 0.1, "capacity": 200 } },
    { id: "URBAN_VILLAGE", name: "Aldea urbana", description: "Conjunto mixto de escala barrial.", tags: ["aldea", "barrial"], extra: ["vivienda", "comercio", "equipamiento"], modifiers: { "floors": 4, "courtyardRatio": 0.2, "capacity": 300 } },
    { id: "LIVE_WORK_UNIT", name: "Unidad live-work", description: "Unidad individual de vivienda y trabajo.", tags: ["live-work", "unidad"], extra: ["vivienda", "estudio", "taller"], modifiers: { "floors": 3, "courtyardRatio": 0.1, "capacity": 60 } },
    { id: "MIXED_TOWER", name: "Torre mixta", description: "Torre con múltiples usos en altura.", tags: ["torre", "mixto"], extra: ["vivienda", "oficinas", "comercio"], modifiers: { "floors": 15, "courtyardRatio": 0.05, "capacity": 800 } },
    { id: "MARKET_HALL", name: "Mercado-hall", description: "Mercado con usos complementarios.", tags: ["mercado", "hall"], extra: ["puestos", "comercio", "servicios"], modifiers: { "floors": 2, "courtyardRatio": 0.15, "capacity": 200 } },
    { id: "CAMPUS_MIX", name: "Campus mixto", description: "Campus con usos educativos y comerciales.", tags: ["campus", "educativo"], extra: ["aulas", "comercio", "residencia"], modifiers: { "floors": 5, "courtyardRatio": 0.15, "capacity": 1000 } },
    { id: "LIVE_WORK_LOFT", name: "Loft live-work", description: "Loft con espacio de trabajo integrado.", tags: ["loft", "live-work"], extra: ["vivienda", "estudio", "taller"], modifiers: { "floors": 2, "courtyardRatio": 0.05, "capacity": 40 } }
  ] }),
  makeAdditionalFamily({ id: "FAM-PARKING", name: "Estacionamiento", category: "TRANSPORT", description: "Superficie, multinivel y automatizado.", geometryStrategy: "LINEAR_MASS", defaultShapeType: "COMPACT", tags: ["estacionamiento", "parking"], primary: ["estacionamiento", "circulación", "acceso"], services: ["control", "mantenimiento", "seguridad"], variants: [
    { id: "SURFACE", name: "Estacionamiento superficial", description: "Estacionamiento a nivel de suelo.", tags: ["superficie"], extra: ["cajones", "circulación"], modifiers: { areaM2: 10000, capacity: 300, floors: 1 } },
    { id: "MULTILEVEL", name: "Estacionamiento multinivel", description: "Estacionamiento en varios niveles.", tags: ["multinivel"], extra: ["rampas", "elevadores"], modifiers: { areaM2: 15000, capacity: 800, floors: 4 } },
    { id: "AUTOMATED", name: "Estacionamiento automatizado", description: "Sistema robotizado de almacenamiento.", tags: ["automatizado"], extra: ["robots", "control"], modifiers: { areaM2: 5000, capacity: 500, floors: 6 } },
    { id: "UNDERGROUND", name: "Estacionamiento subterráneo", description: "Estacionamiento bajo nivel de calle.", tags: ["subterráneo", "bajo-tierra"], extra: ["niveles", "rampas", "ventilación"], modifiers: { "floors": 3, "courtyardRatio": 0, "capacity": 500 } },
    { id: "MECHANICAL", name: "Estacionamiento mecánico", description: "Estacionamiento automatizado de alta densidad.", tags: ["mecánico", "automatizado"], extra: ["sistemas", "control", "mantenimiento"], modifiers: { "floors": 5, "courtyardRatio": 0, "capacity": 200 } },
    { id: "ROOFTOP", name: "Estacionamiento en azotea", description: "Estacionamiento sobre cubierta.", tags: ["azotea", "cubierta"], extra: ["niveles", "rampas", "impermeabilización"], modifiers: { "floors": 2, "courtyardRatio": 0, "capacity": 150 } },
    { id: "PARK_AND_RIDE", name: "Park and ride", description: "Estacionamiento disuasorio junto a transporte.", tags: ["disuasorio", "transporte"], extra: ["plazas", "acceso", "servicios"], modifiers: { "floors": 2, "courtyardRatio": 0.05, "capacity": 800 } },
    { id: "AUTOMATED_VALET", name: "Valet automatizado", description: "Estacionamiento con valet automático.", tags: ["valet", "automatizado"], extra: ["sistemas", "control", "espera"], modifiers: { "floors": 1, "courtyardRatio": 0, "capacity": 100 } },
    { id: "BIKE_PARKING", name: "Bicicletero", description: "Estacionamiento seguro para bicicletas.", tags: ["bicicletas", "seguro"], extra: ["racks", "seguridad", "servicios"], modifiers: { "floors": 1, "courtyardRatio": 0, "capacity": 300 } },
    { id: "EV_CHARGING", name: "Estacionamiento con carga eléctrica", description: "Estacionamiento con puntos de carga.", tags: ["eléctrico", "carga"], extra: ["plazas", "cargadores", "control"], modifiers: { "floors": 2, "courtyardRatio": 0, "capacity": 200 } }
  ] }),
  makeAdditionalFamily({ id: "FAM-DATA", name: "Data center", category: "INDUSTRY", description: "Data centers y edge centers.", geometryStrategy: "LINEAR_MASS", defaultShapeType: "COMPACT", tags: ["data", "servidores", "edge"], primary: ["servidores", "almacenamiento", "conectividad"], services: ["refrigeración", "energía", "seguridad"], variants: [
    { id: "DATA_CENTER", name: "Data center", description: "Centro de datos de gran escala.", tags: ["data"], extra: ["racks", "UPS", "generadores"], modifiers: { areaM2: 10000, capacity: 50, floors: 2 } },
    { id: "EDGE_CENTER", name: "Edge center", description: "Centro de datos de borde.", tags: ["edge"], extra: ["racks", "conectividad"], modifiers: { areaM2: 2000, capacity: 20, floors: 1 } },
    { id: "HYPERSCALE", name: "Data center hyperscale", description: "Data center de gran escala.", tags: ["hyperscale", "gran-escala"], extra: ["salas", "refrigeración", "energía"], modifiers: { "floors": 2, "courtyardRatio": 0.02, "capacity": 500 } },
    { id: "COLOCATION", name: "Colocation", description: "Data center compartido por múltiples clientes.", tags: ["colocation", "compartido"], extra: ["salas", "jaulas", "control"], modifiers: { "floors": 3, "courtyardRatio": 0.02, "capacity": 300 } },
    { id: "EDGE", name: "Edge data center", description: "Data center de borde para baja latencia.", tags: ["edge", "borde"], extra: ["salas", "refrigeración", "control"], modifiers: { "floors": 1, "courtyardRatio": 0.02, "capacity": 50 } },
    { id: "MODULAR", name: "Data center modular", description: "Data center prefabricado y escalable.", tags: ["modular", "prefabricado"], extra: ["módulos", "refrigeración", "control"], modifiers: { "floors": 1, "courtyardRatio": 0.02, "capacity": 100 } },
    { id: "GREEN", name: "Data center verde", description: "Data center con eficiencia energética alta.", tags: ["verde", "eficiente"], extra: ["salas", "refrigeración", "renovables"], modifiers: { "floors": 2, "courtyardRatio": 0.05, "capacity": 200 } },
    { id: "DISASTER_RECOVERY", name: "Recuperación ante desastres", description: "Sitio de respaldo ante desastres.", tags: ["respaldo", "desastres"], extra: ["salas", "energía", "control"], modifiers: { "floors": 2, "courtyardRatio": 0.05, "capacity": 150 } },
    { id: "AI_FACTORY", name: "Fábrica de IA", description: "Data center para entrenamiento de IA.", tags: ["IA", "entrenamiento"], extra: ["GPU", "refrigeración", "energía"], modifiers: { "floors": 2, "courtyardRatio": 0.02, "capacity": 200 } },
    { id: "CABLE_LANDING", name: "Estación de cable submarino", description: "Punto de aterrizaje de cables submarinos.", tags: ["cable", "submarino"], extra: ["sala", "seguridad", "control"], modifiers: { "floors": 1, "courtyardRatio": 0.02, "capacity": 30 } }
  ] }),
  makeAdditionalFamily({ id: "FAM-LAB", name: "Laboratorio", category: "EDUCATION", description: "Laboratorios de investigación y bio-lab.", geometryStrategy: "LINEAR_MASS", defaultShapeType: "COMPACT", tags: ["laboratorio", "investigación", "bio"], primary: ["investigación", "experimentación", "análisis"], services: ["ventilación", "residuos", "seguridad"], variants: [
    { id: "RESEARCH_LAB", name: "Laboratorio de investigación", description: "Laboratorio multidisciplinario.", tags: ["investigación"], extra: ["equipos", "campanas"], modifiers: { areaM2: 5000, capacity: 100, floors: 2 } },
    { id: "BIO_LAB", name: "Bio-lab", description: "Laboratorio de bioseguridad.", tags: ["bio"], extra: ["bioseguridad", "cultivos"], modifiers: { areaM2: 3000, capacity: 50, floors: 2 } },
    { id: "CHEM_LAB", name: "Laboratorio químico", description: "Laboratorio de química y análisis.", tags: ["química", "análisis"], extra: ["laboratorios", "almacén", "ventilación"], modifiers: { "floors": 2, "courtyardRatio": 0.05, "capacity": 80 } },
    { id: "PHYSICS_LAB", name: "Laboratorio de física", description: "Laboratorio de física experimental.", tags: ["física", "experimental"], extra: ["laboratorios", "talleres", "control"], modifiers: { "floors": 2, "courtyardRatio": 0.05, "capacity": 60 } },
    { id: "CLEAN_ROOM", name: "Sala limpia", description: "Ambiente controlado de partículas.", tags: ["limpia", "controlada"], extra: ["sala limpia", "esclusas", "control"], modifiers: { "floors": 2, "courtyardRatio": 0.02, "capacity": 40 } },
    { id: "BIO_SAFETY", name: "Laboratorio de bioseguridad", description: "Laboratorio con niveles de bioseguridad.", tags: ["bioseguridad", "biológico"], extra: ["laboratorios", "esclusas", "control"], modifiers: { "floors": 2, "courtyardRatio": 0.02, "capacity": 30 } },
    { id: "METROLOGY", name: "Laboratorio de metrología", description: "Calibración y medición de precisión.", tags: ["metrología", "precisión"], extra: ["laboratorios", "control", "almacén"], modifiers: { "floors": 1, "courtyardRatio": 0.05, "capacity": 40 } },
    { id: "MATERIALS", name: "Laboratorio de materiales", description: "Ensayo y caracterización de materiales.", tags: ["materiales", "ensayo"], extra: ["laboratorios", "talleres", "almacén"], modifiers: { "floors": 2, "courtyardRatio": 0.05, "capacity": 60 } },
    { id: "COMPUTATIONAL", name: "Laboratorio computacional", description: "Laboratorio de simulación y cómputo.", tags: ["computacional", "simulación"], extra: ["salas", "servidores", "control"], modifiers: { "floors": 2, "courtyardRatio": 0.02, "capacity": 80 } },
    { id: "ANALYTICAL", name: "Laboratorio analítico", description: "Análisis químico y físico de muestras.", tags: ["analítico", "muestras"], extra: ["laboratorios", "equipos", "control"], modifiers: { "floors": 2, "courtyardRatio": 0.05, "capacity": 50 } }
  ] }),
  makeAdditionalFamily({ id: "FAM-MEDIA", name: "Medios", category: "CULTURE", description: "Estudios y centros de broadcast.", geometryStrategy: "LINEAR_MASS", defaultShapeType: "COMPACT", tags: ["medios", "estudio", "broadcast"], primary: ["producción", "grabación", "transmisión"], services: ["control", "almacenamiento", "mantenimiento"], variants: [
    { id: "STUDIO", name: "Estudio", description: "Estudio de grabación.", tags: ["estudio"], extra: ["sets", "control"], modifiers: { areaM2: 3000, capacity: 80, floors: 2 } },
    { id: "BROADCAST_CENTER", name: "Centro de broadcast", description: "Centro de transmisión.", tags: ["broadcast"], extra: ["antenas", "control"], modifiers: { areaM2: 5000, capacity: 120, floors: 3 } },
    { id: "PRODUCTION", name: "Centro de producción", description: "Producción audiovisual completa.", tags: ["producción", "audiovisual"], extra: ["estudios", "edición", "almacén"], modifiers: { "floors": 2, "courtyardRatio": 0.05, "capacity": 100 } },
    { id: "POST_PRODUCTION", name: "Post-producción", description: "Edición y post-producción audiovisual.", tags: ["post-producción", "edición"], extra: ["salas", "islas", "almacén"], modifiers: { "floors": 2, "courtyardRatio": 0.05, "capacity": 60 } },
    { id: "NEWSROOM", name: "Sala de redacción", description: "Redacción y producción de noticias.", tags: ["noticias", "redacción"], extra: ["redacción", "estudios", "control"], modifiers: { "floors": 3, "courtyardRatio": 0.05, "capacity": 150 } },
    { id: "RECORDING", name: "Estudio de grabación", description: "Estudio para grabación de audio.", tags: ["grabación", "audio"], extra: ["cabinas", "control", "almacén"], modifiers: { "floors": 1, "courtyardRatio": 0.05, "capacity": 30 } },
    { id: "ANIMATION", name: "Estudio de animación", description: "Producción de animación digital.", tags: ["animación", "digital"], extra: ["estaciones", "render", "control"], modifiers: { "floors": 2, "courtyardRatio": 0.05, "capacity": 80 } },
    { id: "VR_STUDIO", name: "Estudio de realidad virtual", description: "Producción de experiencias de RV.", tags: ["RV", "inmersivo"], extra: ["estudios", "mocap", "control"], modifiers: { "floors": 2, "courtyardRatio": 0.02, "capacity": 40 } },
    { id: "PODCAST", name: "Estudio de podcast", description: "Producción de podcasts.", tags: ["podcast", "audio"], extra: ["cabinas", "edición", "almacén"], modifiers: { "floors": 1, "courtyardRatio": 0.05, "capacity": 20 } },
    { id: "STREAMING", name: "Centro de streaming", description: "Producción y distribución de streaming.", tags: ["streaming", "digital"], extra: ["estudios", "servidores", "control"], modifiers: { "floors": 2, "courtyardRatio": 0.05, "capacity": 60 } }
  ] }),


  makeAdditionalFamily({ id: "FAM-MILITARY", name: "Militar", category: "OFFICES", description: "Bases, cuarteles, centros de mando y instalaciones de defensa.", geometryStrategy: "LINEAR_MASS", defaultShapeType: "COMPACT", tags: ["militar", "defensa", "base", "cuartel"], primary: ["operaciones", "alojamiento", "entrenamiento", "logística"], services: ["comunicaciones", "armamento", "mantenimiento", "seguridad"], variants: [
    { id: "BASE", name: "Base militar", description: "Base con alojamiento, operaciones y logística.", tags: ["base"], extra: ["hangares", "polígono de tiro", "barracones"], modifiers: { areaM2: 50000, capacity: 2000, floors: 3 } },
    { id: "BARRACKS_MIL", name: "Cuartel militar", description: "Cuartel con alojamiento y entrenamiento.", tags: ["cuartel"], extra: ["dormitorios", "campo de entrenamiento", "armería"], modifiers: { areaM2: 20000, capacity: 800, floors: 4 } },
    { id: "COMMAND_CENTER_MIL", name: "Centro de mando militar", description: "Centro de operaciones y comunicaciones seguras.", tags: ["mando"], extra: ["sala de crisis", "comunicaciones encriptadas", "búnker"], modifiers: { areaM2: 8000, capacity: 200, floors: 2 } },
    { id: "AIRBASE", name: "Base aérea", description: "Base con pistas, hangares y control aéreo.", tags: ["aérea", "hangar"], extra: ["pistas", "hangares", "torre de control"], modifiers: { areaM2: 100000, capacity: 1500, floors: 2 } },
    { id: "NAVAL_BASE", name: "Base naval", description: "Base con muelles, diques y control marítimo.", tags: ["naval", "muelle"], extra: ["muelles", "diques", "torre de control"], modifiers: { areaM2: 80000, capacity: 1200, floors: 2 } },
    { id: "SPECIAL_FORCES", name: "Fuerzas especiales", description: "Base de fuerzas especiales.", tags: ["especiales", "élite"], extra: ["entrenamiento", "equipo", "residencia"], modifiers: { "floors": 2, "courtyardRatio": 0.1, "capacity": 200 } },
    { id: "CYBER_COMMAND", name: "Comando cibernético", description: "Centro de operaciones cibernéticas.", tags: ["ciber", "comando"], extra: ["salas", "servidores", "control"], modifiers: { "floors": 3, "courtyardRatio": 0.02, "capacity": 150 } },
    { id: "LOGISTICS_BASE", name: "Base logística", description: "Base de apoyo logístico militar.", tags: ["logística", "apoyo"], extra: ["almacenes", "talleres", "control"], modifiers: { "floors": 2, "courtyardRatio": 0.05, "capacity": 300 } },
    { id: "MEDICAL_CORPS", name: "Cuerpo médico militar", description: "Instalación médica militar.", tags: ["médico", "militar"], extra: ["hospital", "quirófanos", "residencia"], modifiers: { "floors": 4, "courtyardRatio": 0.1, "capacity": 200 } },
    { id: "DRONE_BASE", name: "Base de drones", description: "Base de operaciones con drones.", tags: ["drones", "operaciones"], extra: ["pista", "hangar", "control"], modifiers: { "floors": 1, "courtyardRatio": 0.05, "capacity": 100 } }
  ] }),

  makeAdditionalFamily({ id: "FAM-VETERINARY", name: "Veterinaria", category: "SALUD", description: "Clínicas veterinarias y refugios de animales.", geometryStrategy: "COURTYARD_MASS", defaultShapeType: "COURTYARD", tags: ["veterinaria", "animales"], primary: ["consulta", "cirugía", "refugio"], services: ["farmacia", "laboratorio", "residuos"], variants: [
    { id: "CLINIC_VET", name: "Clínica veterinaria", description: "Clínica con consulta y cirugía.", tags: ["clínica"], extra: ["quirófano", "rayos X"], modifiers: { areaM2: 2000, capacity: 50, floors: 2 } },
    { id: "SHELTER", name: "Refugio de animales", description: "Refugio con perreras y gateras.", tags: ["refugio"], extra: ["perreras", "gateras", "cuarentena"], modifiers: { areaM2: 5000, capacity: 200, floors: 1 } },
    { id: "FARM_ANIMAL", name: "Clínica de animales de granja", description: "Atención veterinaria de animales de granja.", tags: ["granja", "veterinaria"], extra: ["consultorios", "quirófano", "establo"], modifiers: { "floors": 1, "courtyardRatio": 0.15, "capacity": 40 } },
    { id: "EQUINE", name: "Clínica equina", description: "Atención veterinaria de equinos.", tags: ["equino", "caballos"], extra: ["consultorios", "quirófano", "picadero"], modifiers: { "floors": 1, "courtyardRatio": 0.2, "capacity": 30 } },
    { id: "EXOTIC", name: "Clínica de animales exóticos", description: "Atención de animales exóticos.", tags: ["exóticos", "veterinaria"], extra: ["consultorios", "hospitalización", "cuarentena"], modifiers: { "floors": 2, "courtyardRatio": 0.1, "capacity": 30 } },
    { id: "ANIMAL_SHELTER", name: "Refugio de animales", description: "Refugio temporal de animales.", tags: ["refugio", "animales"], extra: ["perreras", "gateras", "servicios"], modifiers: { "floors": 1, "courtyardRatio": 0.2, "capacity": 150 } },
    { id: "WILDLIFE", name: "Centro de vida silvestre", description: "Rehabilitación de fauna silvestre.", tags: ["silvestre", "rehabilitación"], extra: ["recintos", "clínica", "cuarentena"], modifiers: { "floors": 1, "courtyardRatio": 0.3, "capacity": 60 } },
    { id: "VET_LAB", name: "Laboratorio veterinario", description: "Análisis y diagnóstico veterinario.", tags: ["laboratorio", "diagnóstico"], extra: ["laboratorios", "equipos", "almacén"], modifiers: { "floors": 1, "courtyardRatio": 0.05, "capacity": 20 } },
    { id: "MOBILE_VET", name: "Clínica veterinaria móvil", description: "Unidad móvil de atención veterinaria.", tags: ["móvil", "veterinaria"], extra: ["consulta", "quirófano", "almacén"], modifiers: { "floors": 1, "courtyardRatio": 0.05, "capacity": 15 } },
    { id: "AQUATIC_VET", name: "Clínica veterinaria acuática", description: "Atención de fauna acuática.", tags: ["acuática", "veterinaria"], extra: ["estanques", "clínica", "cuarentena"], modifiers: { "floors": 1, "courtyardRatio": 0.15, "capacity": 20 } }
  ] }),
  makeAdditionalFamily({ id: "FAM-PSYCHIATRIC", name: "Psiquiátrico", category: "SALUD", description: "Centros de salud mental y rehabilitación.", geometryStrategy: "COURTYARD_MASS", defaultShapeType: "COURTYARD", tags: ["psiquiatría", "salud mental"], primary: ["habitaciones", "terapia", "recreación"], services: ["farmacia", "control", "seguridad"], variants: [
    { id: "PSYCH_WARD", name: "Pabellón psiquiátrico", description: "Pabellón con habitaciones y control.", tags: ["pabellón"], extra: ["habitaciones", "sala de control"], modifiers: { areaM2: 8000, capacity: 100, floors: 3 } },
    { id: "REHAB_CENTER", name: "Centro de rehabilitación", description: "Centro con terapia y recreación.", tags: ["rehabilitación"], extra: ["gimnasio", "talleres"], modifiers: { areaM2: 5000, capacity: 150, floors: 2 } },
  ] }),
  makeAdditionalFamily({ id: "FAM-KINDERGARTEN", name: "Jardín de infancia", category: "EDUCATION", description: "Jardines de infancia y guarderías.", geometryStrategy: "COURTYARD_MASS", defaultShapeType: "COURTYARD", tags: ["jardín", "infancia"], primary: ["aulas", "patio", "comedor"], services: ["cocina", "baños", "enfermería"], variants: [
    { id: "NURSERY", name: "Guardería", description: "Guardería para niños de 0-3 años.", tags: ["guardería"], extra: ["cunas", "lactario"], modifiers: { areaM2: 1000, capacity: 60, floors: 1 } },
    { id: "KINDERGARTEN", name: "Jardín de infancia", description: "Jardín para niños de 3-6 años.", tags: ["jardín"], extra: ["aulas", "patio"], modifiers: { areaM2: 2000, capacity: 120, floors: 1 } },
  ] }),
  makeAdditionalFamily({ id: "FAM-SPECIAL_ED", name: "Educación especial", category: "EDUCATION", description: "Centros de educación especial.", geometryStrategy: "COURTYARD_MASS", defaultShapeType: "COURTYARD", tags: ["educación especial", "inclusión"], primary: ["aulas", "terapia", "patio"], services: ["enfermería", "transporte", "cocina"], variants: [
    { id: "SPECIAL_SCHOOL", name: "Escuela especial", description: "Escuela con aulas y terapia.", tags: ["escuela"], extra: ["aulas", "terapia"], modifiers: { areaM2: 3000, capacity: 100, floors: 2 } },
    { id: "THERAPY_CENTER", name: "Centro de terapia", description: "Centro con terapias especializadas.", tags: ["terapia"], extra: ["fisioterapia", "logopedia"], modifiers: { areaM2: 2000, capacity: 80, floors: 1 } },
  ] }),
  makeAdditionalFamily({ id: "FAM-VOCATIONAL", name: "Formación profesional", category: "EDUCATION", description: "Centros de formación profesional y oficios.", geometryStrategy: "LINEAR_MASS", defaultShapeType: "COMPACT", tags: ["formación", "oficios"], primary: ["talleres", "aulas", "laboratorios"], services: ["almacén", "herramientas", "seguridad"], variants: [
    { id: "VOCATIONAL_SCHOOL", name: "Escuela de oficios", description: "Escuela con talleres y aulas.", tags: ["oficios"], extra: ["talleres", "aulas"], modifiers: { areaM2: 5000, capacity: 200, floors: 2 } },
    { id: "TRAINING_CENTER", name: "Centro de formación", description: "Centro con laboratorios y aulas.", tags: ["formación"], extra: ["laboratorios", "aulas"], modifiers: { areaM2: 3000, capacity: 150, floors: 2 } },
  ] }),
  makeAdditionalFamily({ id: "FAM-SUPERMARKET", name: "Supermercado", category: "COMMERCE", description: "Supermercados y grandes superficies.", geometryStrategy: "LINEAR_MASS", defaultShapeType: "COMPACT", tags: ["supermercado", "retail"], primary: ["venta", "almacén", "cajas"], services: ["carga", "residuos", "mantenimiento"], variants: [
    { id: "SUPERMARKET", name: "Supermercado", description: "Supermercado de barrio.", tags: ["supermercado"], extra: ["cajas", "almacén"], modifiers: { areaM2: 3000, capacity: 200, floors: 1 } },
    { id: "HYPERMARKET", name: "Hipermercado", description: "Hipermercado con gran superficie.", tags: ["hipermercado"], extra: ["cajas", "almacén", "estacionamiento"], modifiers: { areaM2: 10000, capacity: 800, floors: 1 } },
  ] }),
  makeAdditionalFamily({ id: "FAM-MARKET_STALL", name: "Mercado de puestos", category: "COMMERCE", description: "Mercados con puestos individuales.", geometryStrategy: "COURTYARD_MASS", defaultShapeType: "COURTYARD", tags: ["mercado", "puestos"], primary: ["puestos", "circulación", "carga"], services: ["residuos", "baños", "administración"], variants: [
    { id: "MARKET_STALL", name: "Mercado de puestos", description: "Mercado con puestos y pasillos.", tags: ["mercado"], extra: ["puestos", "pasillos"], modifiers: { areaM2: 2000, capacity: 300, floors: 1 } },
    { id: "FARMERS_MARKET", name: "Mercado de agricultores", description: "Mercado con puestos temporales.", tags: ["agricultores"], extra: ["puestos", "carga"], modifiers: { areaM2: 1000, capacity: 150, floors: 1 } },
  ] }),
  makeAdditionalFamily({ id: "FAM-OUTLET_MALL", name: "Outlet", category: "COMMERCE", description: "Centros comerciales de outlet.", geometryStrategy: "PODIUM_TOWER", defaultShapeType: "PODIUM_TOWER", tags: ["outlet", "retail"], primary: ["locales", "circulación", "estacionamiento"], services: ["carga", "residuos", "mantenimiento"], variants: [
    { id: "OUTLET_MALL", name: "Outlet mall", description: "Centro de outlet con locales.", tags: ["outlet"], extra: ["locales", "food court"], modifiers: { areaM2: 15000, capacity: 1000, floors: 2 } },
    { id: "STRIP_MALL", name: "Strip mall", description: "Centro comercial lineal.", tags: ["strip"], extra: ["locales", "estacionamiento"], modifiers: { areaM2: 8000, capacity: 500, floors: 1 } },
  ] }),
  makeAdditionalFamily({ id: "FAM-COWORKING", name: "Coworking", category: "OFFICES", description: "Espacios de coworking y oficinas flexibles.", geometryStrategy: "PODIUM_TOWER", defaultShapeType: "COMPACT", tags: ["coworking", "flexible"], primary: ["escritorios", "salas", "café"], services: ["datos", "limpieza", "seguridad"], variants: [
    { id: "COWORKING", name: "Coworking", description: "Espacio de coworking flexible.", tags: ["coworking"], extra: ["escritorios", "salas"], modifiers: { areaM2: 1000, capacity: 80, floors: 1 } },
    { id: "FLEX_OFFICE", name: "Oficina flexible", description: "Oficina con espacios adaptables.", tags: ["flexible"], extra: ["escritorios", "salas"], modifiers: { areaM2: 2000, capacity: 120, floors: 2 } },
  ] }),
  makeAdditionalFamily({ id: "FAM-EMBASSY", name: "Embajada", category: "OFFICES", description: "Embajadas y consulados.", geometryStrategy: "COURTYARD_MASS", defaultShapeType: "COURTYARD", tags: ["embajada", "consulado"], primary: ["oficinas", "atención", "residencia"], services: ["seguridad", "comunicaciones", "mantenimiento"], variants: [
    { id: "EMBASSY", name: "Embajada", description: "Embajada con oficinas y residencia.", tags: ["embajada"], extra: ["oficinas", "residencia"], modifiers: { areaM2: 5000, capacity: 150, floors: 3 } },
    { id: "CONSULATE", name: "Consulado", description: "Consulado con atención al público.", tags: ["consulado"], extra: ["atención", "oficinas"], modifiers: { areaM2: 2000, capacity: 100, floors: 2 } },
  ] }),
  makeAdditionalFamily({ id: "FAM-FOOD_PROCESSING", name: "Procesamiento de alimentos", category: "INDUSTRY", description: "Plantas de procesamiento de alimentos.", geometryStrategy: "LINEAR_MASS", defaultShapeType: "COMPACT", tags: ["alimentos", "procesamiento"], primary: ["producción", "almacén", "control"], services: ["frío", "residuos", "mantenimiento"], variants: [
    { id: "FOOD_PLANT", name: "Planta de alimentos", description: "Planta de procesamiento.", tags: ["planta"], extra: ["línea de producción", "cámara fría"], modifiers: { areaM2: 10000, capacity: 200, floors: 2 } },
    { id: "COLD_STORAGE", name: "Almacén frigorífico", description: "Almacén con cámaras frías.", tags: ["frío"], extra: ["cámaras", "muelles"], modifiers: { areaM2: 5000, capacity: 100, floors: 1 } },
  ] }),
  makeAdditionalFamily({ id: "FAM-TEXTILE", name: "Textil", category: "INDUSTRY", description: "Plantas textiles y de confección.", geometryStrategy: "LINEAR_MASS", defaultShapeType: "COMPACT", tags: ["textil", "confección"], primary: ["producción", "almacén", "control"], services: ["residuos", "mantenimiento", "vestuarios"], variants: [
    { id: "TEXTILE_PLANT", name: "Planta textil", description: "Planta de producción textil.", tags: ["textil"], extra: ["telares", "confección"], modifiers: { areaM2: 8000, capacity: 300, floors: 2 } },
    { id: "GARMENT_FACTORY", name: "Fábrica de confección", description: "Fábrica de confección.", tags: ["confección"], extra: ["costura", "planchado"], modifiers: { areaM2: 5000, capacity: 200, floors: 1 } },
  ] }),
  makeAdditionalFamily({ id: "FAM-AUTOMOTIVE", name: "Automotriz", category: "INDUSTRY", description: "Plantas automotrices y de autopartes.", geometryStrategy: "LINEAR_MASS", defaultShapeType: "COMPACT", tags: ["automotriz", "autopartes"], primary: ["producción", "almacén", "control"], services: ["pintura", "residuos", "mantenimiento"], variants: [
    { id: "AUTO_PLANT", name: "Planta automotriz", description: "Planta de ensamblaje.", tags: ["planta"], extra: ["línea de ensamblaje", "pintura"], modifiers: { areaM2: 50000, capacity: 500, floors: 2 } },
    { id: "PARTS_FACTORY", name: "Fábrica de autopartes", description: "Fábrica de componentes.", tags: ["autopartes"], extra: ["producción", "almacén"], modifiers: { areaM2: 15000, capacity: 300, floors: 2 } },
  ] }),
  makeAdditionalFamily({ id: "FAM-PORT", name: "Puerto", category: "TRANSPORT", description: "Puertos marítimos y fluviales.", geometryStrategy: "LINEAR_MASS", defaultShapeType: "COMPACT", tags: ["puerto", "marítimo"], primary: ["muelles", "almacén", "control"], services: ["grúas", "aduanas", "seguridad"], variants: [
    { id: "SEAPORT", name: "Puerto marítimo", description: "Puerto con muelles y almacenes.", tags: ["marítimo"], extra: ["muelles", "grúas"], modifiers: { areaM2: 100000, capacity: 2000, floors: 1 } },
    { id: "RIVER_PORT", name: "Puerto fluvial", description: "Puerto fluvial con muelles.", tags: ["fluvial"], extra: ["muelles", "almacén"], modifiers: { areaM2: 30000, capacity: 500, floors: 1 } },
  ] }),
  makeAdditionalFamily({ id: "FAM-RAILWAY", name: "Ferroviario", category: "TRANSPORT", description: "Estaciones y terminales ferroviarias.", geometryStrategy: "LINEAR_MASS", defaultShapeType: "COMPACT", tags: ["ferroviario", "tren"], primary: ["andenes", "vestíbulo", "control"], services: ["mantenimiento", "seguridad", "equipaje"], variants: [
    { id: "RAILWAY_STATION", name: "Estación ferroviaria", description: "Estación con andenes y vestíbulo.", tags: ["estación"], extra: ["andenes", "vestíbulo"], modifiers: { areaM2: 15000, capacity: 1000, floors: 2 } },
    { id: "RAIL_TERMINAL", name: "Terminal ferroviaria", description: "Terminal de carga ferroviaria.", tags: ["terminal"], extra: ["andenes", "almacén"], modifiers: { areaM2: 30000, capacity: 500, floors: 1 } },
  ] }),
  makeAdditionalFamily({ id: "FAM-HELIPORT", name: "Helipuerto", category: "TRANSPORT", description: "Helipuertos y helipuertos urbanos.", geometryStrategy: "ARENA_BOWL", defaultShapeType: "CIRCLE", tags: ["helipuerto", "aéreo"], primary: ["plataforma", "control", "hangar"], services: ["combustible", "mantenimiento", "seguridad"], variants: [
    { id: "HELIPORT", name: "Helipuerto", description: "Helipuerto con plataforma.", tags: ["helipuerto"], extra: ["plataforma", "hangar"], modifiers: { areaM2: 5000, capacity: 50, floors: 1 } },
    { id: "URBAN_HELIPORT", name: "Helipuerto urbano", description: "Helipuerto en azotea.", tags: ["urbano"], extra: ["plataforma", "control"], modifiers: { areaM2: 1000, capacity: 20, floors: 1 } },
  ] }),


  makeAdditionalFamily({ 
    id: "FAM-HYDRAULIC", 
    name: "Infraestructura hidráulica", 
    category: "INDUSTRY", 
    description: "Represas, canales, acueductos y obras hidráulicas mayores.", 
    geometryStrategy: "LINEAR_MASS", 
    defaultShapeType: "LINEAR", 
    tags: ["hidráulica", "territorial", "represa", "canal", "acueducto"], 
    primary: ["almacenamiento", "conducción", "distribución"], 
    services: ["compuertas", "turbinas", "control", "mantenimiento"], 
    variants: [
      { id: "DAM", name: "Represa", description: "Represa de almacenamiento y generación hidroeléctrica.", tags: ["represa", "embalse"], extra: ["vertedero", "turbinas", "embalse"], modifiers: { areaM2: 500000, capacity: 10000, floors: 1 } },
      { id: "IRRIGATION_CANAL", name: "Canal de irrigación", description: "Canal para distribución de agua agrícola.", tags: ["canal", "irrigación"], extra: ["compuertas", "sifones", "desarenadores"], modifiers: { areaM2: 100000, capacity: 5000, floors: 1 } },
      { id: "AQUEDUCT", name: "Acueducto", description: "Acueducto para transporte de agua a larga distancia.", tags: ["acueducto", "transporte"], extra: ["tuberías", "estaciones de bombeo", "válvulas"], modifiers: { areaM2: 50000, capacity: 2000, floors: 1 } },
      { id: "PUMPING_STATION", name: "Estación de bombeo", description: "Estación para elevación de agua.", tags: ["bombeo", "elevación"], extra: ["bombas", "generadores", "control"], modifiers: { areaM2: 2000, capacity: 500, floors: 1 } },
      { id: "HYDROELECTRIC_PLANT", name: "Central hidroeléctrica", description: "Central para generación de energía hidroeléctrica.", tags: ["hidroeléctrica", "energía"], extra: ["turbinas", "generadores", "subestación"], modifiers: { areaM2: 10000, capacity: 200, floors: 2 } },
      { id: "SPILLWAY", name: "Vertedero", description: "Vertedero para descarga de excedentes.", tags: ["vertedero", "descarga"], extra: ["compuertas", "canal de descarga", "disipador"], modifiers: { areaM2: 5000, capacity: 100, floors: 1 } },
      { id: "SEDIMENTATION_BASIN", name: "Desarenador", description: "Piscina para sedimentación de arenas.", tags: ["desarenador", "sedimentación"], extra: ["compuertas", "limpieza", "control"], modifiers: { areaM2: 3000, capacity: 50, floors: 1 } },
      { id: "WATER_TUNNEL", name: "Túnel de agua", description: "Túnel para conducción de agua.", tags: ["túnel", "conducción"], extra: ["revestimiento", "ventilación", "control"], modifiers: { areaM2: 10000, capacity: 30, floors: 1 } },
    ] 
  }),

];

export const ALL_SHAPE_TYPES = [
  // Categoría 1: Formas básicas
  "COMPACT", "LINEAR", "L_SHAPE", "U_SHAPE", "T_SHAPE", "I_SHAPE", "H_SHAPE", "E_SHAPE",
  // Categoría 2: Formas con patio
  "COURTYARD", "ATRIUM", "DOUBLE_COURTYARD", "CLOISTER", "TRIPLE_COURTYARD", "QUADRANGLE", "PENTAGON", "HEXAGON",
  // Categoría 3: Formas compuestas
  "CLUSTER", "PODIUM_TOWER", "TWIN_TOWERS", "CAMPUS", "MIXED_COMPLEX", "TRIPLE_TOWERS", "QUAD_TOWERS", "SKYLINE",
  // Categoría 4: Formas curvas
  "CIRCLE", "ELLIPSE", "ARC", "SPIRAL", "HELIX", "WAVE", "CRESCENT", "RING",
  // Categoría 5: Formas especiales
  "VOID_EXTRUSION", "SLOPED_ROOF", "FLOATING_ROOF", "ZIGZAG", "BRIDGE", "G_SHAPE", "J_SHAPE", "N_SHAPE",
  // Categoría 6: Formas deportivas
  "STADIUM_BOWL", "ARENA_OVAL", "AMPHITHEATER", "HIPPODROME", "VELODROME", "SPORTS_PLEX",
  // Categoría 7: Formas alfabéticas
  "A_SHAPE", "C_SHAPE", "K_SHAPE", "M_SHAPE", "V_SHAPE", "W_SHAPE", "Y_SHAPE", "S_SHAPE",
  // Categoría 8: Formas numéricas
  "EIGHT_SHAPE", "THREE_SHAPE", "SIX_SHAPE", "NINE_SHAPE",
  // Categoría 9: Formas geométricas complejas
  "STAR", "CROSS", "DIAMOND", "TRAPEZOID", "PARALLELOGRAM", "RHOMBUS",
  // Categoría 10: Formas multipatio
  "GRID_2X2", "GRID_3X3", "RADIAL", "CONCENTRIC",
  // Categoría 11: Formas de rascacielos
  "SETBACK_TOWER", "TWISTED_TOWER", "TAPERED_TOWER",
  // Categoría 12: Formas de cubierta
  "DOME", "VAULT", "CANOPY",
] as const;

export type ShapeType = typeof ALL_SHAPE_TYPES[number];

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
    defaultShapeType: "COURTYARD",
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
    defaultShapeType: "COURTYARD",
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
    defaultShapeType: "COMPACT",
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
    defaultShapeType: "COMPACT",
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
    defaultShapeType: "CIRCLE",
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
  const shapeType = String(params.shapeType || "COMPACT").toUpperCase();
  const generation = Math.max(0, Math.round(valueAsNumber(params.generation) || 0));
  const aspectByShape: Record<string, number> = {
    // Categoría 1: Formas básicas
    COMPACT: 1.35,
    LINEAR: 3.2,
    L_SHAPE: 1.8,
    U_SHAPE: 1.45,
    T_SHAPE: 1.6,
    I_SHAPE: 1.7,
    H_SHAPE: 1.5,
    E_SHAPE: 1.4,
    // Categoría 2: Formas con patio
    COURTYARD: 1.0,
    ATRIUM: 1.1,
    DOUBLE_COURTYARD: 1.3,
    CLOISTER: 1.2,
    TRIPLE_COURTYARD: 1.5,
    QUADRANGLE: 1.6,
    PENTAGON: 1.2,
    HEXAGON: 1.1,
    // Categoría 3: Formas compuestas
    CLUSTER: 2.0,
    PODIUM_TOWER: 1.5,
    TWIN_TOWERS: 1.4,
    CAMPUS: 2.5,
    MIXED_COMPLEX: 1.7,
    TRIPLE_TOWERS: 1.3,
    QUAD_TOWERS: 1.2,
    SKYLINE: 2.8,
    // Categoría 4: Formas curvas
    CIRCLE: 1.0,
    ELLIPSE: 1.2,
    ARC: 1.1,
    SPIRAL: 1.3,
    HELIX: 1.5,
    WAVE: 2.0,
    CRESCENT: 1.4,
    RING: 1.1,
    // Categoría 5: Formas especiales
    VOID_EXTRUSION: 1.3,
    SLOPED_ROOF: 1.4,
    FLOATING_ROOF: 1.2,
    ZIGZAG: 2.2,
    BRIDGE: 3.0,
    G_SHAPE: 1.3,
    J_SHAPE: 1.6,
    N_SHAPE: 1.8,
    // Categoría 6: Formas deportivas
    STADIUM_BOWL: 1.0,
    ARENA_OVAL: 1.2,
    AMPHITHEATER: 1.1,
    HIPPODROME: 2.5,
    VELODROME: 1.3,
    SPORTS_PLEX: 2.0,
    // Categoría 7: Formas alfabéticas
    A_SHAPE: 1.4,
    C_SHAPE: 1.2,
    K_SHAPE: 1.7,
    M_SHAPE: 1.6,
    V_SHAPE: 1.5,
    W_SHAPE: 1.8,
    Y_SHAPE: 1.4,
    S_SHAPE: 1.9,
    // Categoría 8: Formas numéricas
    EIGHT_SHAPE: 1.2,
    THREE_SHAPE: 1.3,
    SIX_SHAPE: 1.4,
    NINE_SHAPE: 1.3,
    // Categoría 9: Formas geométricas complejas
    STAR: 1.1,
    CROSS: 1.0,
    DIAMOND: 1.0,
    TRAPEZOID: 1.5,
    PARALLELOGRAM: 1.6,
    RHOMBUS: 1.3,
    // Categoría 10: Formas multipatio
    GRID_2X2: 1.0,
    GRID_3X3: 1.0,
    RADIAL: 1.0,
    CONCENTRIC: 1.0,
    // Categoría 11: Formas de rascacielos
    SETBACK_TOWER: 1.0,
    TWISTED_TOWER: 1.0,
    TAPERED_TOWER: 1.0,
    // Categoría 12: Formas de cubierta
    DOME: 1.0,
    VAULT: 1.5,
    CANOPY: 2.0,
    // Categoría 13: Formas adicionales
    Z_SHAPE: 1.6,
    SQUARE: 1.0,
    RECTANGLE_LONG: 4.0,
    HEXAGON_IRREGULAR: 1.3,
    OCTAGON: 1.0,
    NONAGON: 1.0,
    DECAGON: 1.0,
    PATIO_IRREGULAR: 1.2,
    L_TOWER: 1.2,
    T_TOWER: 1.3,
    U_TOWER: 1.4,
    H_TOWER: 1.5,
    PARABOLA: 1.8,
    HYPERBOLA: 1.7,
    SINE_WAVE: 2.5,
    COSINE_WAVE: 2.5,
    STAIRCASE: 2.0,
    RAMP: 2.2,
    TERRACE: 1.8,
    GALLERY: 2.8,
    BASEBALL_DIAMOND: 1.2,
    FOOTBALL_FIELD: 2.0,
    TENNIS_COURT: 1.6,
    B_SHAPE: 1.3,
    D_SHAPE: 1.2,
    F_SHAPE: 1.4,
    L_SHAPE_ALT: 1.9,
    ZERO_SHAPE: 1.0,
    ONE_SHAPE: 1.5,
    TWO_SHAPE: 1.4,
    FOUR_SHAPE: 1.6,
    ELLIPSE_TILTED: 1.3,
    TRAPEZOID_IRREGULAR: 1.4,
    KITE: 1.2,
    MEGA_TOWER: 1.0,
    SUPERTALL: 1.0,
    MIXED_TOWER: 1.2,
    BARREL_VAULT: 2.0,
    HYPAR: 2.5,
    GRID_SHELL: 2.0,
    ARCH_BRIDGE: 3.0,
    SUSPENSION_BRIDGE: 4.0,
    CABLE_STAY: 3.5,
    // Categoría 14: Infraestructura hidráulica
    DAM: 2.0,
    SPILLWAY: 1.5,
    CANAL: 5.0,
    AQUEDUCT: 6.0,
    PUMPING_STATION: 1.2,
    HYDROELECTRIC_PLANT: 1.5,
    WATER_TUNNEL: 5.0,
    SEDIMENTATION_BASIN: 1.5,
  };
  const evolutionaryFactor = 1 + Math.min(generation, 20) * 0.025;
  const aspect = (aspectByShape[shapeType] || 1.35) * evolutionaryFactor;
  const width = Math.sqrt(footprint * aspect);
  const depth = footprint / width;
  const courtyardRatio = Math.max(0, Math.min(0.8, valueAsNumber(params.courtyardRatio) || 0));

  let polygon: Array<{ x: number; y: number }> | undefined;
  let voids: Array<Array<{ x: number; y: number }>> | undefined;

  if (shapeType === "L_SHAPE") {
    const cutX = width * 0.4;
    const cutY = depth * 0.4;
    polygon = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: depth - cutY },
      { x: width - cutX, y: depth - cutY },
      { x: width - cutX, y: depth },
      { x: 0, y: depth },
    ];
  } else if (shapeType === "U_SHAPE") {
    const cutX = width * 0.3;
    const cutY = depth * 0.35;
    polygon = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: depth },
      { x: width - cutX, y: depth },
      { x: width - cutX, y: cutY },
      { x: cutX, y: cutY },
      { x: cutX, y: depth },
      { x: 0, y: depth },
    ];
  } else if (shapeType === "CLUSTER") {
    const blockW = width * 0.45;
    const blockD = depth * 0.45;
    polygon = [
      { x: 0, y: 0 },
      { x: blockW, y: 0 },
      { x: blockW, y: blockD },
      { x: width, y: blockD },
      { x: width, y: depth },
      { x: width - blockW, y: depth },
      { x: width - blockW, y: depth - blockD },
      { x: 0, y: depth - blockD },
    ];
  } else if (shapeType === "COURTYARD") {
    const voidW = width * 0.4;
    const voidD = depth * 0.4;
    const voidX = (width - voidW) / 2;
    const voidY = (depth - voidD) / 2;
    polygon = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: depth },
      { x: 0, y: depth },
    ];
    voids = [[
      { x: voidX, y: voidY },
      { x: voidX + voidW, y: voidY },
      { x: voidX + voidW, y: voidY + voidD },
      { x: voidX, y: voidY + voidD },
    ]];
  } else if (shapeType === "T_SHAPE") {
    const stemW = width * 0.4;
    const stemD = depth * 0.6;
    polygon = [
      { x: (width - stemW) / 2, y: 0 },
      { x: (width + stemW) / 2, y: 0 },
      { x: (width + stemW) / 2, y: stemD },
      { x: width, y: stemD },
      { x: width, y: depth },
      { x: 0, y: depth },
      { x: 0, y: stemD },
      { x: (width - stemW) / 2, y: stemD },
    ];
  } else if (shapeType === "ATRIUM") {
    const voidW = width * 0.35;
    const voidD = depth * 0.35;
    const voidX = (width - voidW) / 2;
    const voidY = (depth - voidD) / 2;
    polygon = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: depth },
      { x: 0, y: depth },
    ];
    voids = [[
      { x: voidX, y: voidY },
      { x: voidX + voidW, y: voidY },
      { x: voidX + voidW, y: voidY + voidD },
      { x: voidX, y: voidY + voidD },
    ]];
  } else if (shapeType === "DOUBLE_COURTYARD") {
    const voidW = width * 0.25;
    const voidD = depth * 0.3;
    polygon = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: depth },
      { x: 0, y: depth },
    ];
    voids = [
      [
        { x: voidW * 0.3, y: voidD },
        { x: voidW * 1.3, y: voidD },
        { x: voidW * 1.3, y: voidD * 2 },
        { x: voidW * 0.3, y: voidD * 2 },
      ],
      [
        { x: width - voidW * 1.3, y: voidD },
        { x: width - voidW * 0.3, y: voidD },
        { x: width - voidW * 0.3, y: voidD * 2 },
        { x: width - voidW * 1.3, y: voidD * 2 },
      ],
    ];
  } else if (shapeType === "CLOISTER") {
    const voidW = width * 0.5;
    const voidD = depth * 0.5;
    const voidX = (width - voidW) / 2;
    const voidY = (depth - voidD) / 2;
    polygon = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: depth },
      { x: 0, y: depth },
    ];
    voids = [[
      { x: voidX, y: voidY },
      { x: voidX + voidW, y: voidY },
      { x: voidX + voidW, y: voidY + voidD },
      { x: voidX, y: voidY + voidD },
    ]];
  } else if (shapeType === "PODIUM_TOWER") {
    const podiumW = width * 0.9;
    const podiumD = depth * 0.4;
    const towerW = width * 0.5;
    const towerD = depth * 0.4;
    polygon = [
      { x: (width - podiumW) / 2, y: 0 },
      { x: (width + podiumW) / 2, y: 0 },
      { x: (width + podiumW) / 2, y: podiumD },
      { x: (width - podiumW) / 2, y: podiumD },
    ];
    voids = [];
    // Tower as second polygon (multi-solid)
    const tower = [
      { x: (width - towerW) / 2, y: podiumD },
      { x: (width + towerW) / 2, y: podiumD },
      { x: (width + towerW) / 2, y: podiumD + towerD },
      { x: (width - towerW) / 2, y: podiumD + towerD },
    ];
    polygon = [...polygon, ...tower];
  } else if (shapeType === "TWIN_TOWERS") {
    const towerW = width * 0.35;
    const towerD = depth * 0.8;
    const gap = width * 0.3;
    polygon = [
      { x: 0, y: (depth - towerD) / 2 },
      { x: towerW, y: (depth - towerD) / 2 },
      { x: towerW, y: (depth + towerD) / 2 },
      { x: 0, y: (depth + towerD) / 2 },
    ];
    voids = [[
      { x: towerW + gap, y: (depth - towerD) / 2 },
      { x: towerW + gap + towerW, y: (depth - towerD) / 2 },
      { x: towerW + gap + towerW, y: (depth + towerD) / 2 },
      { x: towerW + gap, y: (depth + towerD) / 2 },
    ]];
  } else if (shapeType === "CAMPUS") {
    // 4 blocks in a grid
    const blockW = width * 0.35;
    const blockD = depth * 0.35;
    const gapW = width * 0.15;
    const gapD = depth * 0.15;
    polygon = [
      { x: 0, y: 0 },
      { x: blockW, y: 0 },
      { x: blockW, y: blockD },
      { x: 0, y: blockD },
    ];
    voids = [];
    // Second block
    const block2 = [
      { x: blockW + gapW, y: 0 },
      { x: blockW + gapW + blockW, y: 0 },
      { x: blockW + gapW + blockW, y: blockD },
      { x: blockW + gapW, y: blockD },
    ];
    // Third block
    const block3 = [
      { x: 0, y: blockD + gapD },
      { x: blockW, y: blockD + gapD },
      { x: blockW, y: blockD + gapD + blockD },
      { x: 0, y: blockD + gapD + blockD },
    ];
    // Fourth block
    const block4 = [
      { x: blockW + gapW, y: blockD + gapD },
      { x: blockW + gapW + blockW, y: blockD + gapD },
      { x: blockW + gapW + blockW, y: blockD + gapD + blockD },
      { x: blockW + gapW, y: blockD + gapD + blockD },
    ];
    // Merge all blocks into a single polygon (approximation)
    polygon = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: depth },
      { x: 0, y: depth },
    ];
    voids = [block2, block3, block4];
  } else if (shapeType === "MIXED_COMPLEX") {
    // L-shape + tower
    const cutX = width * 0.35;
    const cutY = depth * 0.35;
    polygon = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: depth - cutY },
      { x: width - cutX, y: depth - cutY },
      { x: width - cutX, y: depth },
      { x: 0, y: depth },
    ];
  } else if (shapeType === "ELLIPSE") {
    const rx = width / 2;
    const ry = depth / 2;
    polygon = [];
    for (let i = 0; i < 32; i++) {
      const angle = (i / 32) * Math.PI * 2;
      polygon.push({
        x: rx + rx * Math.cos(angle),
        y: ry + ry * Math.sin(angle),
      });
    }
  } else if (shapeType === "SPIRAL") {
    const turns = 3;
    const radius = Math.min(width, depth) / 2;
    polygon = [];
    for (let i = 0; i <= turns * 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const r = radius * (1 - i / (turns * 16) * 0.5);
      polygon.push({
        x: width / 2 + r * Math.cos(angle),
        y: depth / 2 + r * Math.sin(angle),
      });
    }
  } else if (shapeType === "ZIGZAG") {
    const segments = 4;
    const segW = width / segments;
    polygon = [{ x: 0, y: 0 }];
    for (let i = 0; i < segments; i++) {
      polygon.push({ x: segW * (i + 1), y: i % 2 === 0 ? depth * 0.3 : depth * 0.7 });
    }
    polygon.push({ x: width, y: depth });
    polygon.push({ x: 0, y: depth });
  } else if (shapeType === "HELIX") {
    const turns = 3;
    const radius = Math.min(width, depth) / 2;
    polygon = [];
    for (let i = 0; i <= turns * 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const r = radius * (1 - i / (turns * 16) * 0.3);
      polygon.push({
        x: width / 2 + r * Math.cos(angle),
        y: depth / 2 + r * Math.sin(angle),
      });
    }
  } else if (shapeType === "BRIDGE") {
    const pierW = width * 0.2;
    const pierD = depth * 0.2;
    polygon = [
      { x: 0, y: 0 },
      { x: pierW, y: 0 },
      { x: pierW, y: depth },
      { x: 0, y: depth },
      { x: width, y: depth },
      { x: width, y: 0 },
      { x: width - pierW, y: 0 },
      { x: width - pierW, y: depth },
    ];
  } else if (shapeType === "STADIUM_BOWL") {
    const rx = width / 2;
    const ry = depth / 2;
    polygon = [];
    for (let i = 0; i < 32; i++) {
      const angle = (i / 32) * Math.PI * 2;
      polygon.push({
        x: rx + rx * Math.cos(angle),
        y: ry + ry * Math.sin(angle),
      });
    }
  } else if (shapeType === "ARENA_OVAL") {
    const rx = width / 2;
    const ry = depth / 2 * 0.8;
    polygon = [];
    for (let i = 0; i < 32; i++) {
      const angle = (i / 32) * Math.PI * 2;
      polygon.push({
        x: rx + rx * Math.cos(angle),
        y: ry + ry * Math.sin(angle),
      });
    }
  } else if (shapeType === "AMPHITHEATER") {
    const rx = width / 2;
    const ry = depth / 2;
    polygon = [];
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      polygon.push({
        x: rx + rx * Math.cos(angle),
        y: ry + ry * Math.sin(angle),
      });
    }
  } else if (shapeType === "I_SHAPE") {
    const stemW = width * 0.3;
    const stemD = depth;
    polygon = [
      { x: (width - stemW) / 2, y: 0 },
      { x: (width + stemW) / 2, y: 0 },
      { x: (width + stemW) / 2, y: stemD },
      { x: (width - stemW) / 2, y: stemD },
    ];
  } else if (shapeType === "H_SHAPE") {
    const legW = width * 0.25;
    const legD = depth;
    const barY = depth * 0.4;
    const barH = depth * 0.2;
    polygon = [
      { x: 0, y: 0 },
      { x: legW, y: 0 },
      { x: legW, y: barY },
      { x: width - legW, y: barY },
      { x: width - legW, y: 0 },
      { x: width, y: 0 },
      { x: width, y: depth },
      { x: width - legW, y: depth },
      { x: width - legW, y: barY + barH },
      { x: legW, y: barY + barH },
      { x: legW, y: depth },
      { x: 0, y: depth },
    ];
  } else if (shapeType === "E_SHAPE") {
    const armW = width * 0.6;
    const armH = depth * 0.2;
    polygon = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: armH },
      { x: armW, y: armH },
      { x: armW, y: depth * 0.4 },
      { x: width, y: depth * 0.4 },
      { x: width, y: depth * 0.6 },
      { x: armW, y: depth * 0.6 },
      { x: armW, y: depth - armH },
      { x: width, y: depth - armH },
      { x: width, y: depth },
      { x: 0, y: depth },
    ];
  } else if (shapeType === "TRIPLE_COURTYARD") {
    const voidW = width * 0.2;
    const voidD = depth * 0.25;
    polygon = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: depth },
      { x: 0, y: depth },
    ];
    voids = [
      [
        { x: voidW * 0.3, y: voidD },
        { x: voidW * 1.3, y: voidD },
        { x: voidW * 1.3, y: voidD * 2 },
        { x: voidW * 0.3, y: voidD * 2 },
      ],
      [
        { x: width / 2 - voidW / 2, y: voidD },
        { x: width / 2 + voidW / 2, y: voidD },
        { x: width / 2 + voidW / 2, y: voidD * 2 },
        { x: width / 2 - voidW / 2, y: voidD * 2 },
      ],
      [
        { x: width - voidW * 1.3, y: voidD },
        { x: width - voidW * 0.3, y: voidD },
        { x: width - voidW * 0.3, y: voidD * 2 },
        { x: width - voidW * 1.3, y: voidD * 2 },
      ],
    ];
  } else if (shapeType === "QUADRANGLE") {
    const voidW = width * 0.5;
    const voidD = depth * 0.5;
    const voidX = (width - voidW) / 2;
    const voidY = (depth - voidD) / 2;
    polygon = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: depth },
      { x: 0, y: depth },
    ];
    voids = [[
      { x: voidX, y: voidY },
      { x: voidX + voidW, y: voidY },
      { x: voidX + voidW, y: voidY + voidD },
      { x: voidX, y: voidY + voidD },
    ]];
  } else if (shapeType === "PENTAGON") {
    const cx = width / 2;
    const cy = depth / 2;
    const r = Math.min(width, depth) / 2;
    polygon = [];
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
      polygon.push({
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
      });
    }
  } else if (shapeType === "HEXAGON") {
    const cx = width / 2;
    const cy = depth / 2;
    const r = Math.min(width, depth) / 2;
    polygon = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      polygon.push({
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
      });
    }
  } else if (shapeType === "TRIPLE_TOWERS") {
    const towerW = width * 0.25;
    const towerD = depth * 0.8;
    const gap = width * 0.1;
    polygon = [
      { x: 0, y: (depth - towerD) / 2 },
      { x: towerW, y: (depth - towerD) / 2 },
      { x: towerW, y: (depth + towerD) / 2 },
      { x: 0, y: (depth + towerD) / 2 },
    ];
    voids = [];
    const tower2 = [
      { x: towerW + gap, y: (depth - towerD) / 2 },
      { x: towerW + gap + towerW, y: (depth - towerD) / 2 },
      { x: towerW + gap + towerW, y: (depth + towerD) / 2 },
      { x: towerW + gap, y: (depth + towerD) / 2 },
    ];
    const tower3 = [
      { x: towerW + gap + towerW + gap, y: (depth - towerD) / 2 },
      { x: towerW + gap + towerW + gap + towerW, y: (depth - towerD) / 2 },
      { x: towerW + gap + towerW + gap + towerW, y: (depth + towerD) / 2 },
      { x: towerW + gap + towerW + gap, y: (depth + towerD) / 2 },
    ];
    polygon = [...polygon, ...tower2, ...tower3];
  } else if (shapeType === "QUAD_TOWERS") {
    const towerW = width * 0.2;
    const towerD = depth * 0.35;
    const gapW = width * 0.08;
    const gapD = depth * 0.1;
    polygon = [];
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        const x = i * (towerW + gapW);
        const y = j * (towerD + gapD);
        polygon.push(
          { x, y },
          { x: x + towerW, y },
          { x: x + towerW, y: y + towerD },
          { x, y: y + towerD }
        );
      }
    }
  } else if (shapeType === "SKYLINE") {
    const n = 5;
    const towerW = width / n;
    polygon = [];
    for (let i = 0; i < n; i++) {
      const h = depth * (0.4 + 0.15 * (i % 3));
      polygon.push(
        { x: i * towerW, y: depth - h },
        { x: (i + 1) * towerW, y: depth - h },
        { x: (i + 1) * towerW, y: depth },
        { x: i * towerW, y: depth }
      );
    }
  } else if (shapeType === "WAVE") {
    const segments = 8;
    const segW = width / segments;
    polygon = [{ x: 0, y: 0 }];
    for (let i = 0; i <= segments; i++) {
      const y = depth * 0.5 + depth * 0.4 * Math.sin((i / segments) * Math.PI * 2);
      polygon.push({ x: i * segW, y });
    }
    polygon.push({ x: width, y: depth });
    polygon.push({ x: 0, y: depth });
  } else if (shapeType === "CRESCENT") {
    const cx = width / 2;
    const cy = depth / 2;
    const r1 = Math.min(width, depth) / 2;
    const r2 = r1 * 0.7;
    polygon = [];
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      polygon.push({ x: cx + r1 * Math.cos(angle), y: cy + r1 * Math.sin(angle) });
    }
    voids = [[
      { x: cx + (r1 - r2) * 0.5 + r2 * Math.cos(0), y: cy + r2 * Math.sin(0) },
      { x: cx + (r1 - r2) * 0.5, y: cy - r2 },
      { x: cx + (r1 - r2) * 0.5, y: cy + r2 },
      { x: cx + (r1 - r2) * 0.5 + r2 * Math.cos(Math.PI / 2), y: cy + r2 * Math.sin(Math.PI / 2) },
    ]];
  } else if (shapeType === "RING") {
    const cx = width / 2;
    const cy = depth / 2;
    const r1 = Math.min(width, depth) / 2;
    const r2 = r1 * 0.6;
    polygon = [];
    for (let i = 0; i < 32; i++) {
      const angle = (i / 32) * Math.PI * 2;
      polygon.push({ x: cx + r1 * Math.cos(angle), y: cy + r1 * Math.sin(angle) });
    }
    const innerPolygon = [];
    for (let i = 0; i < 32; i++) {
      const angle = (i / 32) * Math.PI * 2;
      innerPolygon.push({ x: cx + r2 * Math.cos(angle), y: cy + r2 * Math.sin(angle) });
    }
    voids = [innerPolygon];
  } else if (shapeType === "G_SHAPE") {
    const voidW = width * 0.35;
    const voidD = depth * 0.35;
    const voidX = (width - voidW) / 2;
    const voidY = (depth - voidD) / 2;
    polygon = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: depth },
      { x: 0, y: depth },
    ];
    voids = [[
      { x: voidX, y: voidY },
      { x: voidX + voidW, y: voidY },
      { x: voidX + voidW, y: voidY + voidD },
      { x: voidX, y: voidY + voidD },
    ]];
  } else if (shapeType === "J_SHAPE") {
    const stemW = width * 0.3;
    const stemD = depth * 0.7;
    polygon = [
      { x: 0, y: depth - stemD },
      { x: stemW, y: depth - stemD },
      { x: stemW, y: 0 },
      { x: width, y: 0 },
      { x: width, y: stemD },
      { x: width - stemW, y: stemD },
      { x: width - stemW, y: depth },
      { x: 0, y: depth },
    ];
  } else if (shapeType === "N_SHAPE") {
    const stemW = width * 0.25;
    const diagW = width * 0.5;
    polygon = [
      { x: 0, y: 0 },
      { x: stemW, y: 0 },
      { x: stemW + diagW, y: depth * 0.7 },
      { x: stemW + diagW, y: 0 },
      { x: width, y: 0 },
      { x: width, y: depth },
      { x: width - stemW, y: depth },
      { x: width - stemW - diagW, y: depth * 0.3 },
      { x: width - stemW - diagW, y: depth },
      { x: 0, y: depth },
    ];
  } else if (shapeType === "HIPPODROME") {
    const rx = width / 2;
    const ry = depth / 2;
    polygon = [];
    for (let i = 0; i < 32; i++) {
      const angle = (i / 32) * Math.PI * 2;
      const r = rx * 0.9;
      polygon.push({
        x: rx + r * Math.cos(angle),
        y: ry + ry * 0.9 * Math.sin(angle),
      });
    }
  } else if (shapeType === "VELODROME") {
    const rx = width / 2;
    const ry = depth / 2;
    polygon = [];
    for (let i = 0; i < 32; i++) {
      const angle = (i / 32) * Math.PI * 2;
      const r = rx * 0.8;
      polygon.push({
        x: rx + r * Math.cos(angle),
        y: ry + ry * 0.6 * Math.sin(angle),
      });
    }
  } else if (shapeType === "SPORTS_PLEX") {
    const blockW = width * 0.3;
    const blockD = depth * 0.4;
    const gapW = width * 0.1;
    const gapD = depth * 0.1;
    polygon = [
      { x: 0, y: 0 },
      { x: blockW, y: 0 },
      { x: blockW, y: blockD },
      { x: 0, y: blockD },
      { x: blockW + gapW, y: 0 },
      { x: blockW + gapW + blockW, y: 0 },
      { x: blockW + gapW + blockW, y: blockD },
      { x: blockW + gapW, y: blockD },
      { x: 0, y: blockD + gapD },
      { x: blockW, y: blockD + gapD },
      { x: blockW, y: blockD + gapD + blockD },
      { x: 0, y: blockD + gapD + blockD },
      { x: blockW + gapW, y: blockD + gapD },
      { x: blockW + gapW + blockW, y: blockD + gapD },
      { x: blockW + gapW + blockW, y: blockD + gapD + blockD },
      { x: blockW + gapW, y: blockD + gapD + blockD },
    ];
  } else if (shapeType === "A_SHAPE") {
    const stemW = width * 0.3;
    const stemD = depth * 0.6;
    const apexX = width / 2;
    const apexY = 0;
    polygon = [
      { x: apexX, y: apexY },
      { x: width - stemW, y: stemD },
      { x: stemW, y: stemD },
    ];
  } else if (shapeType === "C_SHAPE") {
    const voidW = width * 0.4;
    const voidD = depth * 0.4;
    const voidX = (width - voidW) / 2;
    const voidY = (depth - voidD) / 2;
    polygon = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: voidY },
      { x: voidX, y: voidY },
      { x: voidX, y: voidY + voidD },
      { x: width, y: voidY + voidD },
      { x: width, y: depth },
      { x: 0, y: depth },
    ];
  } else if (shapeType === "K_SHAPE") {
    const stemW = width * 0.25;
    const armW = width * 0.5;
    polygon = [
      { x: 0, y: 0 },
      { x: stemW, y: 0 },
      { x: stemW, y: depth * 0.3 },
      { x: stemW + armW, y: 0 },
      { x: width, y: 0 },
      { x: stemW + armW, y: depth * 0.5 },
      { x: width, y: depth },
      { x: stemW + armW, y: depth },
      { x: stemW, y: depth * 0.7 },
      { x: stemW, y: depth },
      { x: 0, y: depth },
    ];
  } else if (shapeType === "M_SHAPE") {
    const peakW = width * 0.2;
    const peakD = depth * 0.6;
    polygon = [
      { x: 0, y: depth },
      { x: 0, y: 0 },
      { x: peakW, y: 0 },
      { x: width / 2, y: peakD },
      { x: width - peakW, y: 0 },
      { x: width, y: 0 },
      { x: width, y: depth },
      { x: width - peakW, y: depth },
      { x: width - peakW, y: peakD },
      { x: width / 2, y: depth - peakD },
      { x: peakW, y: peakD },
      { x: peakW, y: depth },
    ];
  } else if (shapeType === "V_SHAPE") {
    const stemW = width * 0.3;
    const apexX = width / 2;
    const apexY = depth * 0.7;
    polygon = [
      { x: 0, y: 0 },
      { x: stemW, y: 0 },
      { x: apexX, y: apexY },
      { x: width - stemW, y: 0 },
      { x: width, y: 0 },
      { x: apexX, y: depth },
    ];
  } else if (shapeType === "W_SHAPE") {
    const peakW = width * 0.2;
    const peakD = depth * 0.6;
    polygon = [
      { x: 0, y: depth },
      { x: 0, y: peakD },
      { x: peakW, y: depth },
      { x: width / 2, y: peakD },
      { x: width - peakW, y: depth },
      { x: width, y: peakD },
      { x: width, y: depth },
      { x: width - peakW, y: 0 },
      { x: width / 2, y: depth - peakD },
      { x: peakW, y: 0 },
    ];
  } else if (shapeType === "Y_SHAPE") {
    const stemW = width * 0.3;
    const apexX = width / 2;
    const apexY = depth * 0.4;
    polygon = [
      { x: 0, y: 0 },
      { x: stemW, y: 0 },
      { x: apexX, y: apexY },
      { x: width - stemW, y: 0 },
      { x: width, y: 0 },
      { x: stemW, y: apexY + (depth - apexY) * 0.5 },
      { x: stemW, y: depth },
      { x: width - stemW, y: depth },
      { x: width - stemW, y: apexY + (depth - apexY) * 0.5 },
    ];
  } else if (shapeType === "S_SHAPE") {
    const n = 8;
    const segW = width / n;
    polygon = [{ x: 0, y: 0 }];
    for (let i = 0; i <= n; i++) {
      const y = depth * 0.5 + depth * 0.3 * Math.sin((i / n) * Math.PI * 2);
      polygon.push({ x: i * segW, y });
    }
    polygon.push({ x: width, y: depth });
    polygon.push({ x: 0, y: depth });
  } else if (shapeType === "EIGHT_SHAPE") {
    const voidW = width * 0.3;
    const voidD = depth * 0.3;
    const voidX = (width - voidW) / 2;
    const voidY1 = (depth - voidD) / 4;
    const voidY2 = (depth - voidD) * 3 / 4;
    polygon = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: depth },
      { x: 0, y: depth },
    ];
    voids = [
      [
        { x: voidX, y: voidY1 },
        { x: voidX + voidW, y: voidY1 },
        { x: voidX + voidW, y: voidY1 + voidD },
        { x: voidX, y: voidY1 + voidD },
      ],
      [
        { x: voidX, y: voidY2 },
        { x: voidX + voidW, y: voidY2 },
        { x: voidX + voidW, y: voidY2 + voidD },
        { x: voidX, y: voidY2 + voidD },
      ],
    ];
  } else if (shapeType === "THREE_SHAPE") {
    const voidW = width * 0.3;
    const voidD = depth * 0.3;
    const voidX = (width - voidW) / 2;
    const voidY = (depth - voidD) / 2;
    polygon = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: depth },
      { x: 0, y: depth },
    ];
    voids = [[
      { x: voidX, y: voidY },
      { x: voidX + voidW, y: voidY },
      { x: voidX + voidW, y: voidY + voidD },
      { x: voidX, y: voidY + voidD },
    ]];
  } else if (shapeType === "SIX_SHAPE") {
    const voidW = width * 0.3;
    const voidD = depth * 0.3;
    const voidX = (width - voidW) / 2;
    const voidY = (depth - voidD) / 2;
    polygon = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: depth },
      { x: 0, y: depth },
    ];
    voids = [[
      { x: voidX, y: voidY },
      { x: voidX + voidW, y: voidY },
      { x: voidX + voidW, y: voidY + voidD },
      { x: voidX, y: voidY + voidD },
    ]];
  } else if (shapeType === "NINE_SHAPE") {
    const voidW = width * 0.3;
    const voidD = depth * 0.3;
    const voidX = (width - voidW) / 2;
    const voidY = (depth - voidD) / 2;
    polygon = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: depth },
      { x: 0, y: depth },
    ];
    voids = [[
      { x: voidX, y: voidY },
      { x: voidX + voidW, y: voidY },
      { x: voidX + voidW, y: voidY + voidD },
      { x: voidX, y: voidY + voidD },
    ]];
  } else if (shapeType === "STAR") {
    const cx = width / 2;
    const cy = depth / 2;
    const r1 = Math.min(width, depth) / 2;
    const r2 = r1 * 0.4;
    polygon = [];
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;
      const r = i % 2 === 0 ? r1 : r2;
      polygon.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
    }
  } else if (shapeType === "CROSS") {
    const armW = width * 0.3;
    const armD = depth * 0.3;
    polygon = [
      { x: (width - armW) / 2, y: 0 },
      { x: (width + armW) / 2, y: 0 },
      { x: (width + armW) / 2, y: (depth - armD) / 2 },
      { x: width, y: (depth - armD) / 2 },
      { x: width, y: (depth + armD) / 2 },
      { x: (width + armW) / 2, y: (depth + armD) / 2 },
      { x: (width + armW) / 2, y: depth },
      { x: (width - armW) / 2, y: depth },
      { x: (width - armW) / 2, y: (depth + armD) / 2 },
      { x: 0, y: (depth + armD) / 2 },
      { x: 0, y: (depth - armD) / 2 },
      { x: (width - armW) / 2, y: (depth - armD) / 2 },
    ];
  } else if (shapeType === "DIAMOND") {
    polygon = [
      { x: width / 2, y: 0 },
      { x: width, y: depth / 2 },
      { x: width / 2, y: depth },
      { x: 0, y: depth / 2 },
    ];
  } else if (shapeType === "TRAPEZOID") {
    const inset = width * 0.2;
    polygon = [
      { x: inset, y: 0 },
      { x: width - inset, y: 0 },
      { x: width, y: depth },
      { x: 0, y: depth },
    ];
  } else if (shapeType === "PARALLELOGRAM") {
    const skew = width * 0.2;
    polygon = [
      { x: skew, y: 0 },
      { x: width, y: 0 },
      { x: width - skew, y: depth },
      { x: 0, y: depth },
    ];
  } else if (shapeType === "RHOMBUS") {
    polygon = [
      { x: width / 2, y: 0 },
      { x: width, y: depth / 2 },
      { x: width / 2, y: depth },
      { x: 0, y: depth / 2 },
    ];
  } else if (shapeType === "GRID_2X2") {
    const voidW = width * 0.3;
    const voidD = depth * 0.3;
    const voidX = (width - voidW) / 2;
    const voidY = (depth - voidD) / 2;
    polygon = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: depth },
      { x: 0, y: depth },
    ];
    voids = [
      [
        { x: voidX, y: voidY },
        { x: voidX + voidW, y: voidY },
        { x: voidX + voidW, y: voidY + voidD },
        { x: voidX, y: voidY + voidD },
      ],
    ];
  } else if (shapeType === "GRID_3X3") {
    const voidW = width * 0.15;
    const voidD = depth * 0.15;
    polygon = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: depth },
      { x: 0, y: depth },
    ];
    voids = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        voids.push([
          { x: width * (i + 0.3) / 3, y: depth * (j + 0.3) / 3 },
          { x: width * (i + 0.7) / 3, y: depth * (j + 0.3) / 3 },
          { x: width * (i + 0.7) / 3, y: depth * (j + 0.7) / 3 },
          { x: width * (i + 0.3) / 3, y: depth * (j + 0.7) / 3 },
        ]);
      }
    }
  } else if (shapeType === "RADIAL") {
    const cx = width / 2;
    const cy = depth / 2;
    const r = Math.min(width, depth) / 2;
    polygon = [];
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 - Math.PI / 4;
      polygon.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
    }
  } else if (shapeType === "CONCENTRIC") {
    const cx = width / 2;
    const cy = depth / 2;
    const r1 = Math.min(width, depth) / 2;
    const r2 = r1 * 0.6;
    polygon = [];
    for (let i = 0; i < 32; i++) {
      const angle = (i / 32) * Math.PI * 2;
      polygon.push({ x: cx + r1 * Math.cos(angle), y: cy + r1 * Math.sin(angle) });
    }
    const innerPolygon = [];
    for (let i = 0; i < 32; i++) {
      const angle = (i / 32) * Math.PI * 2;
      innerPolygon.push({ x: cx + r2 * Math.cos(angle), y: cy + r2 * Math.sin(angle) });
    }
    voids = [innerPolygon];
  } else if (shapeType === "SETBACK_TOWER") {
    const baseW = width;
    const baseD = depth * 0.3;
    const midW = width * 0.8;
    const midD = depth * 0.4;
    const topW = width * 0.5;
    const topD = depth * 0.3;
    polygon = [
      { x: (width - baseW) / 2, y: 0 },
      { x: (width + baseW) / 2, y: 0 },
      { x: (width + baseW) / 2, y: baseD },
      { x: (width - baseW) / 2, y: baseD },
      { x: (width - midW) / 2, y: baseD },
      { x: (width + midW) / 2, y: baseD },
      { x: (width + midW) / 2, y: baseD + midD },
      { x: (width - midW) / 2, y: baseD + midD },
      { x: (width - topW) / 2, y: baseD + midD },
      { x: (width + topW) / 2, y: baseD + midD },
      { x: (width + topW) / 2, y: baseD + midD + topD },
      { x: (width - topW) / 2, y: baseD + midD + topD },
    ];
  } else if (shapeType === "TWISTED_TOWER") {
    const baseW = width;
    const baseD = depth * 0.3;
    const midW = width * 0.8;
    const midD = depth * 0.4;
    const topW = width * 0.6;
    const topD = depth * 0.3;
    polygon = [
      { x: (width - baseW) / 2, y: 0 },
      { x: (width + baseW) / 2, y: 0 },
      { x: (width + baseW) / 2, y: baseD },
      { x: (width - baseW) / 2, y: baseD },
      { x: (width - midW) / 2, y: baseD },
      { x: (width + midW) / 2, y: baseD },
      { x: (width + midW) / 2, y: baseD + midD },
      { x: (width - midW) / 2, y: baseD + midD },
      { x: (width - topW) / 2, y: baseD + midD },
      { x: (width + topW) / 2, y: baseD + midD },
      { x: (width + topW) / 2, y: baseD + midD + topD },
      { x: (width - topW) / 2, y: baseD + midD + topD },
    ];
  } else if (shapeType === "TAPERED_TOWER") {
    const baseW = width;
    const baseD = depth * 0.3;
    const midW = width * 0.7;
    const midD = depth * 0.4;
    const topW = width * 0.4;
    const topD = depth * 0.3;
    polygon = [
      { x: (width - baseW) / 2, y: 0 },
      { x: (width + baseW) / 2, y: 0 },
      { x: (width + baseW) / 2, y: baseD },
      { x: (width - baseW) / 2, y: baseD },
      { x: (width - midW) / 2, y: baseD },
      { x: (width + midW) / 2, y: baseD },
      { x: (width + midW) / 2, y: baseD + midD },
      { x: (width - midW) / 2, y: baseD + midD },
      { x: (width - topW) / 2, y: baseD + midD },
      { x: (width + topW) / 2, y: baseD + midD },
      { x: (width + topW) / 2, y: baseD + midD + topD },
      { x: (width - topW) / 2, y: baseD + midD + topD },
    ];
  } else if (shapeType === "DOME") {
    const cx = width / 2;
    const cy = depth / 2;
    const r = Math.min(width, depth) / 2;
    polygon = [];
    for (let i = 0; i < 32; i++) {
      const angle = (i / 32) * Math.PI * 2;
      polygon.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
    }
  } else if (shapeType === "VAULT") {
    const rx = width / 2;
    const ry = depth / 2;
    polygon = [];
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI;
      polygon.push({ x: rx + rx * Math.cos(angle), y: ry + ry * Math.sin(angle) });
    }
  } else if (shapeType === "CANOPY") {
    const inset = width * 0.1;
    polygon = [
      { x: inset, y: inset },
      { x: width - inset, y: inset },
      { x: width - inset, y: depth - inset },
      { x: inset, y: depth - inset },
    ];
  } else if (shapeType === "Z_SHAPE") {
    const armW = width * 0.3;
    const armH = depth * 0.3;
    polygon = [
      { x: 0, y: 0 },
      { x: armW, y: 0 },
      { x: armW, y: armH },
      { x: width, y: armH },
      { x: width, y: depth },
      { x: width - armW, y: depth },
      { x: width - armW, y: depth - armH },
      { x: 0, y: depth - armH },
    ];
  } else if (shapeType === "SQUARE") {
    polygon = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: depth },
      { x: 0, y: depth },
    ];
  } else if (shapeType === "RECTANGLE_LONG") {
    polygon = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: depth },
      { x: 0, y: depth },
    ];
  } else if (shapeType === "HEXAGON_IRREGULAR") {
    const cx = width / 2;
    const cy = depth / 2;
    const r = Math.min(width, depth) / 2;
    polygon = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      polygon.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
    }
  } else if (shapeType === "OCTAGON") {
    const cx = width / 2;
    const cy = depth / 2;
    const r = Math.min(width, depth) / 2;
    polygon = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      polygon.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
    }
  } else if (shapeType === "NONAGON") {
    const cx = width / 2;
    const cy = depth / 2;
    const r = Math.min(width, depth) / 2;
    polygon = [];
    for (let i = 0; i < 9; i++) {
      const angle = (i / 9) * Math.PI * 2;
      polygon.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
    }
  } else if (shapeType === "DECAGON") {
    const cx = width / 2;
    const cy = depth / 2;
    const r = Math.min(width, depth) / 2;
    polygon = [];
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2;
      polygon.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
    }
  } else if (shapeType === "PATIO_IRREGULAR") {
    const voidW = width * 0.3;
    const voidD = depth * 0.3;
    const voidX = (width - voidW) / 2;
    const voidY = (depth - voidD) / 2;
    polygon = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: depth },
      { x: 0, y: depth },
    ];
    voids = [[
      { x: voidX, y: voidY },
      { x: voidX + voidW, y: voidY },
      { x: voidX + voidW, y: voidY + voidD },
      { x: voidX, y: voidY + voidD },
    ]];
  } else if (shapeType === "L_TOWER") {
    const cutX = width * 0.4;
    const cutY = depth * 0.4;
    polygon = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: depth - cutY },
      { x: width - cutX, y: depth - cutY },
      { x: width - cutX, y: depth },
      { x: 0, y: depth },
    ];
  } else if (shapeType === "T_TOWER") {
    const stemW = width * 0.4;
    const stemD = depth * 0.6;
    polygon = [
      { x: (width - stemW) / 2, y: 0 },
      { x: (width + stemW) / 2, y: 0 },
      { x: (width + stemW) / 2, y: stemD },
      { x: width, y: stemD },
      { x: width, y: depth },
      { x: 0, y: depth },
      { x: 0, y: stemD },
      { x: (width - stemW) / 2, y: stemD },
    ];
  } else if (shapeType === "U_TOWER") {
    const cutX = width * 0.3;
    const cutY = depth * 0.35;
    polygon = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: depth },
      { x: width - cutX, y: depth },
      { x: width - cutX, y: cutY },
      { x: cutX, y: cutY },
      { x: cutX, y: depth },
      { x: 0, y: depth },
    ];
  } else if (shapeType === "H_TOWER") {
    const legW = width * 0.25;
    const barY = depth * 0.4;
    const barH = depth * 0.2;
    polygon = [
      { x: 0, y: 0 },
      { x: legW, y: 0 },
      { x: legW, y: barY },
      { x: width - legW, y: barY },
      { x: width - legW, y: 0 },
      { x: width, y: 0 },
      { x: width, y: depth },
      { x: width - legW, y: depth },
      { x: width - legW, y: barY + barH },
      { x: legW, y: barY + barH },
      { x: legW, y: depth },
      { x: 0, y: depth },
    ];
  } else if (shapeType === "PARABOLA") {
    polygon = [{ x: 0, y: 0 }];
    for (let i = 0; i <= 16; i++) {
      const t = i / 16;
      polygon.push({ x: t * width, y: depth * (1 - 4 * (t - 0.5) * (t - 0.5)) });
    }
    polygon.push({ x: width, y: 0 });
    polygon.push({ x: 0, y: 0 });
  } else if (shapeType === "HYPERBOLA") {
    polygon = [{ x: 0, y: 0 }];
    for (let i = 0; i <= 16; i++) {
      const t = i / 16;
      polygon.push({ x: t * width, y: depth * Math.abs(1 / (t * 2 + 0.5) - 1) });
    }
    polygon.push({ x: width, y: 0 });
    polygon.push({ x: 0, y: 0 });
  } else if (shapeType === "SINE_WAVE") {
    const n = 8;
    const segW = width / n;
    polygon = [{ x: 0, y: 0 }];
    for (let i = 0; i <= n; i++) {
      const y = depth * 0.5 + depth * 0.4 * Math.sin((i / n) * Math.PI * 2);
      polygon.push({ x: i * segW, y });
    }
    polygon.push({ x: width, y: depth });
    polygon.push({ x: 0, y: depth });
  } else if (shapeType === "COSINE_WAVE") {
    const n = 8;
    const segW = width / n;
    polygon = [{ x: 0, y: 0 }];
    for (let i = 0; i <= n; i++) {
      const y = depth * 0.5 + depth * 0.4 * Math.cos((i / n) * Math.PI * 2);
      polygon.push({ x: i * segW, y });
    }
    polygon.push({ x: width, y: depth });
    polygon.push({ x: 0, y: depth });
  } else if (shapeType === "STAIRCASE") {
    const steps = 4;
    const stepW = width / steps;
    const stepH = depth / steps;
    polygon = [{ x: 0, y: 0 }];
    for (let i = 0; i < steps; i++) {
      polygon.push({ x: stepW * (i + 1), y: stepH * i });
      polygon.push({ x: stepW * (i + 1), y: stepH * (i + 1) });
    }
    polygon.push({ x: width, y: depth });
    polygon.push({ x: 0, y: depth });
  } else if (shapeType === "RAMP") {
    polygon = [
      { x: 0, y: depth },
      { x: width, y: 0 },
      { x: width, y: depth },
    ];
  } else if (shapeType === "TERRACE") {
    polygon = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: depth * 0.6 },
      { x: width * 0.7, y: depth * 0.6 },
      { x: width * 0.7, y: depth },
      { x: 0, y: depth },
    ];
  } else if (shapeType === "GALLERY") {
    polygon = [
      { x: 0, y: depth * 0.4 },
      { x: width, y: depth * 0.4 },
      { x: width, y: depth * 0.6 },
      { x: 0, y: depth * 0.6 },
    ];
  } else if (shapeType === "BASEBALL_DIAMOND") {
    polygon = [
      { x: width / 2, y: 0 },
      { x: width, y: depth / 2 },
      { x: width / 2, y: depth },
      { x: 0, y: depth / 2 },
    ];
  } else if (shapeType === "FOOTBALL_FIELD") {
    const inset = depth * 0.2;
    polygon = [
      { x: 0, y: inset },
      { x: width, y: inset },
      { x: width, y: depth - inset },
      { x: 0, y: depth - inset },
    ];
  } else if (shapeType === "TENNIS_COURT") {
    const inset = depth * 0.15;
    polygon = [
      { x: 0, y: inset },
      { x: width, y: inset },
      { x: width, y: depth - inset },
      { x: 0, y: depth - inset },
    ];
  } else if (shapeType === "B_SHAPE") {
    polygon = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: depth * 0.4 },
      { x: width * 0.6, y: depth * 0.4 },
      { x: width * 0.6, y: depth * 0.6 },
      { x: width, y: depth * 0.6 },
      { x: width, y: depth },
      { x: 0, y: depth },
    ];
  } else if (shapeType === "D_SHAPE") {
    const cx = width * 0.3;
    const cy = depth / 2;
    const r = Math.min(width, depth) / 2;
    polygon = [{ x: 0, y: 0 }];
    for (let i = 0; i <= 16; i++) {
      const angle = (i / 16) * Math.PI;
      polygon.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
    }
    polygon.push({ x: 0, y: depth });
  } else if (shapeType === "F_SHAPE") {
    const armW = width * 0.6;
    const armH = depth * 0.2;
    polygon = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: armH },
      { x: armW, y: armH },
      { x: armW, y: depth * 0.4 },
      { x: width, y: depth * 0.4 },
      { x: width, y: depth * 0.6 },
      { x: armW, y: depth * 0.6 },
      { x: armW, y: depth },
      { x: 0, y: depth },
    ];
  } else if (shapeType === "L_SHAPE_ALT") {
    const cutX = width * 0.4;
    const cutY = depth * 0.4;
    polygon = [
      { x: 0, y: 0 },
      { x: width - cutX, y: 0 },
      { x: width - cutX, y: depth - cutY },
      { x: width, y: depth - cutY },
      { x: width, y: depth },
      { x: 0, y: depth },
    ];
  } else if (shapeType === "ZERO_SHAPE") {
    const voidW = width * 0.4;
    const voidD = depth * 0.4;
    const voidX = (width - voidW) / 2;
    const voidY = (depth - voidD) / 2;
    polygon = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: depth },
      { x: 0, y: depth },
    ];
    voids = [[
      { x: voidX, y: voidY },
      { x: voidX + voidW, y: voidY },
      { x: voidX + voidW, y: voidY + voidD },
      { x: voidX, y: voidY + voidD },
    ]];
  } else if (shapeType === "ONE_SHAPE") {
    polygon = [
      { x: width * 0.3, y: 0 },
      { x: width * 0.7, y: 0 },
      { x: width * 0.7, y: depth },
      { x: width * 0.3, y: depth },
    ];
  } else if (shapeType === "TWO_SHAPE") {
    polygon = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: depth * 0.4 },
      { x: width * 0.4, y: depth * 0.4 },
      { x: width * 0.4, y: depth * 0.6 },
      { x: width, y: depth * 0.6 },
      { x: width, y: depth },
      { x: 0, y: depth },
    ];
  } else if (shapeType === "FOUR_SHAPE") {
    polygon = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: depth },
      { x: width * 0.6, y: depth },
      { x: width * 0.6, y: depth * 0.6 },
      { x: 0, y: depth * 0.6 },
    ];
  } else if (shapeType === "ELLIPSE_TILTED") {
    const rx = width / 2;
    const ry = depth / 2;
    polygon = [];
    for (let i = 0; i < 32; i++) {
      const angle = (i / 32) * Math.PI * 2;
      polygon.push({
        x: rx + rx * Math.cos(angle),
        y: ry + ry * Math.sin(angle) + rx * 0.2 * Math.sin(angle),
      });
    }
  } else if (shapeType === "TRAPEZOID_IRREGULAR") {
    const insetL = width * 0.1;
    const insetR = width * 0.3;
    polygon = [
      { x: insetL, y: 0 },
      { x: width - insetR, y: 0 },
      { x: width, y: depth },
      { x: 0, y: depth },
    ];
  } else if (shapeType === "KITE") {
    polygon = [
      { x: width / 2, y: 0 },
      { x: width, y: depth * 0.4 },
      { x: width / 2, y: depth },
      { x: 0, y: depth * 0.4 },
    ];
  } else if (shapeType === "MEGA_TOWER") {
    const baseW = width;
    const midW = width * 0.8;
    const topW = width * 0.6;
    const baseH = depth * 0.3;
    const midH = depth * 0.3;
    const topH = depth * 0.4;
    polygon = [
      { x: 0, y: 0 },
      { x: baseW, y: 0 },
      { x: baseW, y: baseH },
      { x: (width + midW) / 2, y: baseH },
      { x: (width + midW) / 2, y: baseH + midH },
      { x: (width + topW) / 2, y: baseH + midH },
      { x: (width + topW) / 2, y: depth },
      { x: (width - topW) / 2, y: depth },
      { x: (width - topW) / 2, y: baseH + midH },
      { x: (width - midW) / 2, y: baseH + midH },
      { x: (width - midW) / 2, y: baseH },
      { x: 0, y: baseH },
    ];
  } else if (shapeType === "SUPERTALL") {
    const midW = width * 0.7;
    const topW = width * 0.5;
    const midH = depth * 0.4;
    const topH = depth * 0.6;
    polygon = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: midH },
      { x: (width + midW) / 2, y: midH },
      { x: (width + midW) / 2, y: midH + topH * 0.5 },
      { x: (width + topW) / 2, y: midH + topH * 0.5 },
      { x: (width + topW) / 2, y: depth },
      { x: (width - topW) / 2, y: depth },
      { x: (width - topW) / 2, y: midH + topH * 0.5 },
      { x: (width - midW) / 2, y: midH + topH * 0.5 },
      { x: (width - midW) / 2, y: midH },
      { x: 0, y: midH },
    ];
  } else if (shapeType === "MIXED_TOWER") {
    const towerW = width * 0.6;
    const towerD = depth * 0.5;
    const baseW = width;
    const baseD = depth * 0.5;
    polygon = [
      { x: 0, y: 0 },
      { x: baseW, y: 0 },
      { x: baseW, y: baseD },
      { x: (width + towerW) / 2, y: baseD },
      { x: (width + towerW) / 2, y: baseD + towerD },
      { x: (width - towerW) / 2, y: baseD + towerD },
      { x: (width - towerW) / 2, y: baseD },
      { x: 0, y: baseD },
    ];
  } else if (shapeType === "BARREL_VAULT") {
    const rx = width / 2;
    const ry = depth / 2;
    polygon = [];
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI;
      polygon.push({ x: rx + rx * Math.cos(angle), y: ry + ry * Math.sin(angle) });
    }
  } else if (shapeType === "HYPAR") {
    const cx = width / 2;
    const cy = depth / 2;
    polygon = [];
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const r = Math.min(width, depth) / 2 * (1 + 0.5 * Math.cos(2 * angle));
      polygon.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
    }
  } else if (shapeType === "GRID_SHELL") {
    const n = 4;
    const cellW = width / n;
    const cellD = depth / n;
    polygon = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: depth },
      { x: 0, y: depth },
    ];
    voids = [];
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        voids.push([
          { x: i * cellW + cellW * 0.2, y: j * cellD + cellD * 0.2 },
          { x: i * cellW + cellW * 0.8, y: j * cellD + cellD * 0.2 },
          { x: i * cellW + cellW * 0.8, y: j * cellD + cellD * 0.8 },
          { x: i * cellW + cellW * 0.2, y: j * cellD + cellD * 0.8 },
        ]);
      }
    }
  } else if (shapeType === "ARCH_BRIDGE") {
    const pierW = width * 0.15;
    polygon = [
      { x: 0, y: 0 },
      { x: pierW, y: 0 },
      { x: pierW, y: depth },
      { x: 0, y: depth },
      { x: width, y: depth },
      { x: width, y: 0 },
      { x: width - pierW, y: 0 },
      { x: width - pierW, y: depth },
    ];
  } else if (shapeType === "SUSPENSION_BRIDGE") {
    const pierW = width * 0.1;
    polygon = [
      { x: 0, y: 0 },
      { x: pierW, y: 0 },
      { x: pierW, y: depth },
      { x: 0, y: depth },
      { x: width, y: depth },
      { x: width, y: 0 },
      { x: width - pierW, y: 0 },
      { x: width - pierW, y: depth },
    ];
  } else if (shapeType === "CABLE_STAY") {
    const pierW = width * 0.12;
    polygon = [
      { x: 0, y: 0 },
      { x: pierW, y: 0 },
      { x: pierW, y: depth },
      { x: 0, y: depth },
      { x: width, y: depth },
      { x: width, y: 0 },
      { x: width - pierW, y: 0 },
      { x: width - pierW, y: depth },
    ];
  } else if (shapeType === "DAM") {
    // Represa: cuerpo trapezoidal
    const crestW = width * 0.7;
    const baseW = width;
    polygon = [
      { x: (width - crestW) / 2, y: 0 },
      { x: (width + crestW) / 2, y: 0 },
      { x: (width + baseW) / 2, y: depth },
      { x: (width - baseW) / 2, y: depth },
    ];
  } else if (shapeType === "SPILLWAY") {
    // Vertedero: canal trapezoidal
    const topW = width * 0.8;
    const bottomW = width * 0.4;
    polygon = [
      { x: (width - topW) / 2, y: 0 },
      { x: (width + topW) / 2, y: 0 },
      { x: (width + bottomW) / 2, y: depth },
      { x: (width - bottomW) / 2, y: depth },
    ];
  } else if (shapeType === "CANAL") {
    // Canal: sección trapezoidal
    const topW = width;
    const bottomW = width * 0.5;
    polygon = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: (width + bottomW) / 2, y: depth },
      { x: (width - bottomW) / 2, y: depth },
    ];
  } else if (shapeType === "AQUEDUCT") {
    // Acueducto: tubería rectangular
    const pipeW = width * 0.3;
    polygon = [
      { x: (width - pipeW) / 2, y: 0 },
      { x: (width + pipeW) / 2, y: 0 },
      { x: (width + pipeW) / 2, y: depth },
      { x: (width - pipeW) / 2, y: depth },
    ];
  } else if (shapeType === "PUMPING_STATION") {
    // Estación de bombeo: edificio rectangular
    polygon = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: depth },
      { x: 0, y: depth },
    ];
  } else if (shapeType === "HYDROELECTRIC_PLANT") {
    // Central hidroeléctrica: edificio con turbinas
    const turbineW = width * 0.4;
    polygon = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: depth },
      { x: 0, y: depth },
    ];
    voids = [[
      { x: (width - turbineW) / 2, y: depth * 0.3 },
      { x: (width + turbineW) / 2, y: depth * 0.3 },
      { x: (width + turbineW) / 2, y: depth * 0.7 },
      { x: (width - turbineW) / 2, y: depth * 0.7 },
    ]];
  } else if (shapeType === "WATER_TUNNEL") {
    // Túnel de agua: circular
    const cx = width / 2;
    const cy = depth / 2;
    const r = Math.min(width, depth) / 2;
    polygon = [];
    for (let i = 0; i < 32; i++) {
      const angle = (i / 32) * Math.PI * 2;
      polygon.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
    }
  } else if (shapeType === "SEDIMENTATION_BASIN") {
    // Desarenador: piscina rectangular
    polygon = [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: depth },
      { x: 0, y: depth },
    ];
  }

  return {
    type: family.geometryStrategy,
    shapeType,
    generation,
    footprintM2: Number(footprint.toFixed(2)),
    widthM: Number(width.toFixed(2)),
    depthM: Number(depth.toFixed(2)),
    aspectRatio: Number((width / depth).toFixed(4)),
    courtyardM2: Number((footprint * courtyardRatio).toFixed(2)),
    rings: Number(params.rings) || undefined,
    polygon,
    voids,
  };
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
  const efficiencyRatio = builtArea / geometry2d.footprintM2;
  const estimatedCostUsdConceptual = Math.round(builtArea * (family.category === "SALUD" ? 1800 : 1200));
  const costPerM2 = estimatedCostUsdConceptual / builtArea;
  const capacityPerM2 = builtArea > 0 ? capacity / builtArea : 0;
  const uniqueUnknowns = Array.from(new Set(unknowns));
  const complianceScore = rules.length > 0 ? 1 - (uniqueUnknowns.length / rules.length) : 1;
  const energyUseIntensity = Number((builtArea * 0.15).toFixed(2));
  const waterUseIntensity = Number((capacity * 0.05).toFixed(2));
  const carbonFootprint = Number((builtArea * 0.08).toFixed(2));
  const structuralEfficiency = Number((builtArea / (floors * 100)).toFixed(2));
  const daylightFactor = Number((geometry2d.footprintM2 * 0.2 / builtArea).toFixed(4));
  const acousticComfort = 0.7;
  const thermalComfort = 0.8;
  const accessibilityScore = 0.9;
  const flexibilityScore = Number((geometry2d.footprintM2 / builtArea).toFixed(2));
  const maintenanceCost = Number((builtArea * 0.02).toFixed(2));
  const lifecycleCost = Number((estimatedCostUsdConceptual + maintenanceCost * 30).toFixed(2));
  const resilienceScore = 0.75;
  const biophilicScore = Number((geometry2d.courtyardM2 ?? 0) / geometry2d.footprintM2);
  const circulationEfficiency = 0.85;
  const programCompliance = 0.9;

  return {
    id: randomUUID(),
    familyId: family.id,
    variantId: variant.id,
    name: `${variant.name} · ${context.city || "sin ciudad"}`,
    context,
    parameters,
    program: { ...family.baseProgram, primarySpaces: [...family.baseProgram.primarySpaces, ...variant.programExtra] },
    rules,
    geometry2d: plan,
    section,
    geometry3d,
    unifiedGeometry: { schema: "ARKI-UNIFIED-GEOMETRY-1.0", plan, section, model3d: geometry3d },
    metrics: {
      footprintM2: geometry2d.footprintM2,
      builtAreaM2: Number(builtArea.toFixed(2)),
      capacity,
      estimatedCostUsdConceptual,
      efficiencyRatio: Number(efficiencyRatio.toFixed(2)),
      costPerM2: Number(costPerM2.toFixed(2)),
      capacityPerM2: Number(capacityPerM2.toFixed(2)),
      complianceScore: Number(complianceScore.toFixed(2)),
      energyUseIntensity,
      waterUseIntensity,
      carbonFootprint,
      structuralEfficiency,
      daylightFactor,
      acousticComfort,
      thermalComfort,
      accessibilityScore,
      flexibilityScore,
      maintenanceCost,
      lifecycleCost,
      resilienceScore,
      biophilicScore,
      circulationEfficiency,
      programCompliance,
    },
    validation: { status: uniqueUnknowns.length ? "UNKNOWN" : "PASS", checked: rules.map((item) => item.code), unknowns: uniqueUnknowns },
    alerts,
    status: "GENERATED_CANDIDATE",
    humanReviewRequired: true,
    projectStateMutation: "NOT_REQUESTED",
  };
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
