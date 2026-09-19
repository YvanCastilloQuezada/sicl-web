export type CanonicalTypologyId =
  | "RESIDENTIAL"
  | "HOSPITALITY"
  | "CARE"
  | "EDUCATION"
  | "OFFICE"
  | "HEALTHCARE"
  | "LABORATORY"
  | "INDUSTRY"
  | "LOGISTICS"
  | "TRANSPORT"
  | "RETAIL"
  | "MARKET"
  | "RESTAURANT"
  | "LIBRARY"
  | "MUSEUM"
  | "SPORTS"
  | "RELIGIOUS"
  | "CIVIC"
  | "JUSTICE"
  | "EMERGENCY"
  | "MIXED_USE"
  | "CAMPUS"
  | "URBAN_PUBLIC_REALM";

/** Legacy aggregate IDs remain accepted at integration boundaries. */
export type LegacyTypologyId =
  | "HOSPITALITY_COMMERCE"
  | "OFFICE_RELIGIOUS"
  | "INDUSTRY_LABORATORY_AGRICULTURE"
  | "SPORTS_CULTURE";

export type TypologyId = CanonicalTypologyId | LegacyTypologyId;

export const CANONICAL_TYPOLOGY_IDS: CanonicalTypologyId[] = [
  "RESIDENTIAL", "HOSPITALITY", "CARE", "EDUCATION", "OFFICE", "HEALTHCARE", "LABORATORY", "INDUSTRY", "LOGISTICS", "TRANSPORT", "RETAIL", "MARKET", "RESTAURANT", "LIBRARY", "MUSEUM", "SPORTS", "RELIGIOUS", "CIVIC", "JUSTICE", "EMERGENCY", "MIXED_USE", "CAMPUS", "URBAN_PUBLIC_REALM",
];

export const LEGACY_TYPOLOGY_ALIASES: Record<LegacyTypologyId, CanonicalTypologyId[]> = {
  HOSPITALITY_COMMERCE: ["HOSPITALITY", "RETAIL", "MARKET", "RESTAURANT"],
  OFFICE_RELIGIOUS: ["OFFICE", "RELIGIOUS"],
  INDUSTRY_LABORATORY_AGRICULTURE: ["LABORATORY", "INDUSTRY"],
  SPORTS_CULTURE: ["SPORTS", "MUSEUM"],
};

export type FlowKind = "PUBLIC" | "USER" | "STAFF" | "SERVICE" | "GOODS" | "WASTE" | "EMERGENCY" | "VERTICAL" | "CLEAN_STERILE" | "DIRTY" | "VEHICLE";
export type FunctionalRelationKind = "REQUIRED" | "PREFERRED" | "ALLOWED_WITH_FILTER" | "CONFLICT";

export type TypologyFunctionalProfile = {
  id: CanonicalTypologyId;
  name: string;
  sourceFamilies: Array<"NEUFERT" | "PLAZOLA">;
  programGroups: string[];
  flows: FlowKind[];
  zoningGradient: string[];
  relations: Array<{ from: string; to: string; kind: FunctionalRelationKind; reason: string }>;
  recurringInterfaces: string[];
  validationQuestions: string[];
  epistemicStatus: "SOURCE_DERIVED_HYPOTHESIS";
  humanReviewRequired: true;
};

const baseRelations = (primary: string, service = "SERVICE") => [
  { from: "PUBLIC_ENTRY", to: primary, kind: "REQUIRED" as const, reason: "Arrival requires a legible and controlled transition to the primary function." },
  { from: service, to: primary, kind: "ALLOWED_WITH_FILTER" as const, reason: "Service may interface with the primary function only through a controlled operational boundary." },
  { from: "PUBLIC", to: service, kind: "CONFLICT" as const, reason: "Public and service operations require separation or an explicitly validated interface." },
];

const profile = (id: CanonicalTypologyId, name: string, programGroups: string[], flows: FlowKind[], zoningGradient: string[], relations = baseRelations(programGroups[0])): TypologyFunctionalProfile => ({
  id,
  name,
  sourceFamilies: ["NEUFERT", "PLAZOLA"],
  programGroups,
  flows,
  zoningGradient,
  relations,
  recurringInterfaces: ["controlled entry", "primary-function threshold", "service interface", "emergency route", "maintenance access"],
  validationQuestions: ["Are the principal users and operations explicit?", "Are public, staff, service and emergency flows separated where required?", "Are interfaces and unknown project inputs visible?", "Is the proposed organization reviewed by a human architect?"],
  epistemicStatus: "SOURCE_DERIVED_HYPOTHESIS",
  humanReviewRequired: true,
});

export const ARKI_TYPOLOGY_FUNCTIONAL_PROFILES: TypologyFunctionalProfile[] = [
  {
    id: "RESIDENTIAL", name: "Vivienda, apartamentos y jardines", sourceFamilies: ["NEUFERT", "PLAZOLA"],
    programGroups: ["arrival", "public_social", "service", "private", "exterior", "vertical"], flows: ["PUBLIC", "USER", "SERVICE", "EMERGENCY", "VERTICAL", "VEHICLE"], zoningGradient: ["EXTERIOR", "ARRIVAL_FILTER", "PUBLIC_SOCIAL", "SEMI_PRIVATE", "PRIVATE", "SERVICE"],
    relations: [
      { from: "ENTRY", to: "LIVING", kind: "REQUIRED", reason: "Arrival must distribute without crossing bedrooms." },
      { from: "DINING", to: "KITCHEN", kind: "PREFERRED", reason: "Serving and food preparation should be short and legible." },
      { from: "DINING", to: "KITCHEN", kind: "ALLOWED_WITH_FILTER", reason: "A door, counter, screen or low wall is a project choice; an open connection is valid when smoke, privacy and safety permit." },
      { from: "PUBLIC_SOCIAL", to: "BEDROOM", kind: "CONFLICT", reason: "Direct visual exposure weakens domestic privacy." },
      { from: "BEDROOM", to: "BATHROOM", kind: "PREFERRED", reason: "Night use and privacy support proximity." },
      { from: "ENTRY", to: "STAIR", kind: "REQUIRED", reason: "Upper levels require an explicit route." },
    ],
    recurringInterfaces: ["entry door", "open kitchen-dining connection", "service counter or low wall", "bathroom door", "stair landing", "window", "patio threshold"],
    validationQuestions: ["Can a visitor reach social rooms without crossing private rooms?", "Can food move kitchen → dining without an unnecessary door?", "Are bathrooms visually buffered from social rooms?", "Is the upper floor reached by a real continuous stair?", "Are service and waste routes known?"], epistemicStatus: "SOURCE_DERIVED_HYPOTHESIS", humanReviewRequired: true,
  },
  profile("HOSPITALITY", "Hoteles y alojamiento", ["arrival", "guest", "housekeeping", "food", "back_of_house", "service"], ["PUBLIC", "USER", "STAFF", "SERVICE", "GOODS", "WASTE", "EMERGENCY", "VERTICAL"], ["PUBLIC_FRONT", "GUEST", "STAFF", "BACK_OF_HOUSE", "TECHNICAL"]),
  profile("CARE", "Residencias y centros de cuidado", ["arrival", "residents", "care_staff", "family", "therapy", "service", "emergency"], ["PUBLIC", "USER", "STAFF", "SERVICE", "WASTE", "EMERGENCY", "VERTICAL"], ["PUBLIC", "SUPERVISED", "RESIDENT", "CARE_RESTRICTED", "SERVICE"]),
  {
    id: "EDUCATION", name: "Escuelas, colleges, bibliotecas y residencias estudiantiles", sourceFamilies: ["NEUFERT", "PLAZOLA"], programGroups: ["arrival", "learning", "staff", "library_media", "food", "play", "service", "escape"], flows: ["PUBLIC", "USER", "STAFF", "SERVICE", "GOODS", "WASTE", "EMERGENCY"], zoningGradient: ["PUBLIC_ENTRY", "SUPERVISED_SHARED", "LEARNING", "STAFF_RESTRICTED", "SERVICE"], relations: [{ from: "RECEPTION", to: "LEARNING", kind: "REQUIRED", reason: "Arrival must be supervised and legible." }, { from: "KITCHEN_SERVICE", to: "DINING", kind: "REQUIRED", reason: "Food service needs a dedicated operational sequence." }, { from: "WASTE_SERVICE", to: "LEARNING", kind: "CONFLICT", reason: "Waste movement should not pass through learning areas without a controlled interface." }], recurringInterfaces: ["supervised entrance", "covered transition", "classroom door", "library threshold", "servery", "service access", "multiple exits"], validationQuestions: ["Are student, staff, food and waste flows distinguished?", "Can supervision occur without exposing restricted rooms?", "Are acoustic buffers and escape paths explicit?"], epistemicStatus: "SOURCE_DERIVED_HYPOTHESIS", humanReviewRequired: true,
  },
  profile("OFFICE", "Oficinas y lugares de trabajo", ["arrival", "reception", "work", "meeting", "archive", "support", "service"], ["PUBLIC", "USER", "STAFF", "SERVICE", "GOODS", "EMERGENCY", "VERTICAL"], ["PUBLIC", "RECEPTION", "SHARED", "WORK_RESTRICTED", "SERVICE"]),
  profile("HEALTHCARE", "Clínicas, hospitales y centros de salud", ["public_arrival", "outpatient", "emergency", "clinical", "clean_sterile", "dirty", "staff", "logistics"], ["PUBLIC", "USER", "STAFF", "SERVICE", "GOODS", "WASTE", "EMERGENCY", "CLEAN_STERILE", "DIRTY"], ["PUBLIC", "AMBULATORY", "CLINICAL", "CLEAN_STERILE", "STAFF", "DIRTY_SERVICE"], [{ from: "PUBLIC_RECEPTION", to: "OUTPATIENT", kind: "REQUIRED", reason: "Ambulatory users need a controlled public-to-clinical transition." }, { from: "EMERGENCY", to: "CLINICAL_SUPPORT", kind: "REQUIRED", reason: "Emergency operations depend on short protected support routes." }, { from: "CLEAN_STERILE", to: "DIRTY", kind: "CONFLICT", reason: "Clean and dirty workflows require separation or an explicitly validated filter." }, { from: "PUBLIC", to: "OPERATING_ROOM", kind: "CONFLICT", reason: "Sterile clinical areas cannot be directly public." }]),
  profile("LABORATORY", "Laboratorios y centros de investigación", ["arrival", "sample_receipt", "research", "clean_process", "dirty_process", "equipment", "waste", "staff"], ["USER", "STAFF", "SERVICE", "GOODS", "WASTE", "EMERGENCY", "CLEAN_STERILE", "DIRTY"], ["PUBLIC_CONTROL", "RESEARCH", "CLEAN_PROCESS", "HAZARD_RESTRICTED", "WASTE_SERVICE"]),
  profile("INDUSTRY", "Industria y talleres", ["workers", "raw_material", "process", "product", "equipment", "waste", "maintenance"], ["USER", "STAFF", "SERVICE", "GOODS", "WASTE", "EMERGENCY", "VEHICLE"], ["PUBLIC_CONTROL", "WORK", "PROCESS", "HAZARD_RESTRICTED", "SERVICE_WASTE"]),
  profile("LOGISTICS", "Almacenes, distribución y logística", ["arrival", "receiving", "storage", "sorting", "dispatch", "fleet", "staff", "waste"], ["STAFF", "SERVICE", "GOODS", "WASTE", "EMERGENCY", "VEHICLE"], ["CONTROL", "RECEIVING", "STORAGE", "DISPATCH", "SERVICE"]),
  profile("TRANSPORT", "Terminales, estaciones, aeropuertos y estacionamientos", ["landside", "transfer", "pedestrian", "vehicle", "baggage", "cargo", "security", "emergency"], ["PUBLIC", "USER", "STAFF", "SERVICE", "GOODS", "WASTE", "EMERGENCY", "VEHICLE"], ["PUBLIC_LANDSIDE", "CONTROLLED_TRANSFER", "RESTRICTED_OPERATIONAL", "SERVICE"]),
  profile("RETAIL", "Tiendas y comercio minorista", ["arrival", "display", "sales", "checkout", "stock", "staff", "waste"], ["PUBLIC", "USER", "STAFF", "SERVICE", "GOODS", "WASTE", "EMERGENCY"], ["PUBLIC", "SALES", "STAFF", "STOCK", "SERVICE"]),
  profile("MARKET", "Mercados y comercio alimentario", ["arrival", "stalls", "fresh_goods", "storage", "waste", "staff", "service"], ["PUBLIC", "USER", "STAFF", "SERVICE", "GOODS", "WASTE", "EMERGENCY"], ["PUBLIC", "SALES", "FOOD_SERVICE", "STORAGE", "WASTE"]),
  profile("RESTAURANT", "Restaurantes y alimentación", ["arrival", "dining", "kitchen", "delivery", "staff", "storage", "waste"], ["PUBLIC", "USER", "STAFF", "SERVICE", "GOODS", "WASTE", "EMERGENCY"], ["PUBLIC_FRONT", "DINING", "KITCHEN", "BACK_OF_HOUSE", "SERVICE"]),
  profile("LIBRARY", "Bibliotecas y centros de información", ["arrival", "lending", "reading", "collections", "digital", "staff", "service"], ["PUBLIC", "USER", "STAFF", "SERVICE", "GOODS", "EMERGENCY"], ["PUBLIC", "SHARED_READING", "QUIET_READING", "STAFF", "COLLECTIONS"]),
  profile("MUSEUM", "Museos y centros de exposición", ["arrival", "exhibition", "education", "collection", "conservation", "staff", "service"], ["PUBLIC", "USER", "STAFF", "SERVICE", "GOODS", "EMERGENCY"], ["PUBLIC", "EXHIBITION", "CONTROLLED_COLLECTION", "STAFF", "SERVICE"]),
  profile("SPORTS", "Deportes y recreación", ["arrival", "spectator", "athlete", "changing", "field", "staff", "service", "egress"], ["PUBLIC", "USER", "STAFF", "SERVICE", "GOODS", "WASTE", "EMERGENCY"], ["PUBLIC_ARRIVAL", "SPECTATOR", "ATHLETE", "TECHNICAL", "SERVICE"]),
  profile("RELIGIOUS", "Edificios religiosos y de culto", ["arrival", "worship", "procession", "community", "administration", "service"], ["PUBLIC", "USER", "STAFF", "SERVICE", "EMERGENCY"], ["PUBLIC", "RITUAL", "COMMUNITY", "STAFF", "SERVICE"]),
  profile("CIVIC", "Edificios cívicos y administración pública", ["arrival", "public_service", "waiting", "administration", "meeting", "archive", "service"], ["PUBLIC", "USER", "STAFF", "SERVICE", "GOODS", "EMERGENCY"], ["PUBLIC", "SERVICE", "CONTROLLED", "ADMINISTRATION", "SERVICE"]),
  profile("JUSTICE", "Juzgados y justicia", ["arrival", "public_hearing", "judicial", "secure", "evidence", "staff", "service"], ["PUBLIC", "USER", "STAFF", "SERVICE", "GOODS", "EMERGENCY"], ["PUBLIC", "CONTROLLED_HEARING", "SECURE", "STAFF", "SERVICE"]),
  profile("EMERGENCY", "Estaciones de bomberos, policía y respuesta", ["arrival", "dispatch", "operations", "vehicle", "rest", "equipment", "service"], ["PUBLIC", "STAFF", "SERVICE", "VEHICLE", "EMERGENCY"], ["PUBLIC_CONTROL", "DISPATCH", "OPERATIONS", "VEHICLE", "SERVICE"]),
  profile("MIXED_USE", "Edificios de uso mixto", ["arrival", "shared", "residential", "commercial", "office", "service", "vertical"], ["PUBLIC", "USER", "STAFF", "SERVICE", "GOODS", "WASTE", "EMERGENCY", "VERTICAL"], ["PUBLIC", "SHARED", "PROGRAM_SPECIFIC", "RESTRICTED", "SERVICE"]),
  profile("CAMPUS", "Campus y conjuntos de edificios", ["arrival", "academic_or_program", "shared", "landscape", "service", "mobility", "emergency"], ["PUBLIC", "USER", "STAFF", "SERVICE", "GOODS", "WASTE", "EMERGENCY", "VEHICLE"], ["PUBLIC", "SHARED_CAMPUS", "PROGRAM_CLUSTERS", "SERVICE", "LANDSCAPE"]),
  profile("URBAN_PUBLIC_REALM", "Espacio público urbano, calles y plazas", ["arrival", "movement", "stay", "commerce", "landscape", "service", "emergency"], ["PUBLIC", "USER", "SERVICE", "GOODS", "WASTE", "EMERGENCY", "VEHICLE"], ["MOVEMENT", "STAY", "ACTIVE_EDGE", "SERVICE", "EMERGENCY"]),
];

const profileById = new Map(ARKI_TYPOLOGY_FUNCTIONAL_PROFILES.map((item) => [item.id, item]));

export function getTypologyFunctionalProfile(id: TypologyId): TypologyFunctionalProfile {
  const direct = profileById.get(id as CanonicalTypologyId);
  if (direct) return direct;
  const alias = LEGACY_TYPOLOGY_ALIASES[id as LegacyTypologyId]?.[0];
  const resolved = alias ? profileById.get(alias) : undefined;
  if (!resolved) throw new Error(`Unknown typology: ${id}`);
  return resolved;
}

export function validateFunctionalRelation(profile: TypologyFunctionalProfile, from: string, to: string): FunctionalRelationKind | "UNKNOWN" {
  return profile.relations.find((item) => item.from === from && item.to === to)?.kind ?? "UNKNOWN";
}

export function buildFunctionalKnowledgeLesson(id: TypologyId) {
  const profile = getTypologyFunctionalProfile(id);
  return { typology: profile.id, principle: "Function before beauty: program → flows → zones → relations → interfaces → geometry.", sourceFamilies: profile.sourceFamilies, exercises: ["Draw the functional organigram before placing coordinates.", "Create one valid alternative and one intentionally invalid flow.", "Explain every open connection, door, filter and conflict.", "Preserve UNKNOWN where the source or project data is insufficient."], profile };
}
