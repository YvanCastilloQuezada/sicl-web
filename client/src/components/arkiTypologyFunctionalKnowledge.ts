export type TypologyId =
  | "RESIDENTIAL"
  | "EDUCATION"
  | "HEALTHCARE"
  | "HOSPITALITY_COMMERCE"
  | "OFFICE_RELIGIOUS"
  | "INDUSTRY_LABORATORY_AGRICULTURE"
  | "SPORTS_CULTURE"
  | "TRANSPORT";

export type FlowKind =
  | "PUBLIC"
  | "USER"
  | "STAFF"
  | "SERVICE"
  | "GOODS"
  | "WASTE"
  | "EMERGENCY"
  | "VERTICAL"
  | "CLEAN_STERILE"
  | "DIRTY"
  | "VEHICLE";

export type FunctionalRelationKind = "REQUIRED" | "PREFERRED" | "ALLOWED_WITH_FILTER" | "CONFLICT";

export type TypologyFunctionalProfile = {
  id: TypologyId;
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

export const ARKI_TYPOLOGY_FUNCTIONAL_PROFILES: TypologyFunctionalProfile[] = [
  {
    id: "RESIDENTIAL",
    name: "Vivienda, apartamentos y jardines",
    sourceFamilies: ["NEUFERT", "PLAZOLA"],
    programGroups: ["arrival", "public_social", "service", "private", "exterior", "vertical"],
    flows: ["PUBLIC", "USER", "SERVICE", "EMERGENCY", "VERTICAL", "VEHICLE"],
    zoningGradient: ["EXTERIOR", "ARRIVAL_FILTER", "PUBLIC_SOCIAL", "SEMI_PRIVATE", "PRIVATE", "SERVICE"],
    relations: [
      { from: "ENTRY", to: "LIVING", kind: "REQUIRED", reason: "Arrival must distribute without crossing bedrooms." },
      { from: "DINING", to: "KITCHEN", kind: "PREFERRED", reason: "Serving and food preparation should be short and legible." },
      { from: "DINING", to: "KITCHEN", kind: "ALLOWED_WITH_FILTER", reason: "A door, counter, screen or low wall is a project choice; an open connection is valid when smoke, privacy and safety permit." },
      { from: "PUBLIC_SOCIAL", to: "BEDROOM", kind: "CONFLICT", reason: "Direct visual exposure weakens domestic privacy." },
      { from: "BEDROOM", to: "BATHROOM", kind: "PREFERRED", reason: "Night use and privacy support proximity." },
      { from: "ENTRY", to: "STAIR", kind: "REQUIRED", reason: "Upper levels require an explicit route." },
    ],
    recurringInterfaces: ["entry door", "open kitchen-dining connection", "service counter or low wall", "bathroom door", "stair landing", "window", "patio threshold"],
    validationQuestions: ["Can a visitor reach social rooms without crossing private rooms?", "Can food move kitchen → dining without an unnecessary door?", "Are bathrooms visually buffered from social rooms?", "Is the upper floor reached by a real continuous stair?", "Are service and waste routes known?"],
    epistemicStatus: "SOURCE_DERIVED_HYPOTHESIS",
    humanReviewRequired: true,
  },
  {
    id: "EDUCATION",
    name: "Escuelas, colleges, bibliotecas y residencias estudiantiles",
    sourceFamilies: ["NEUFERT", "PLAZOLA"],
    programGroups: ["arrival", "learning", "staff", "library_media", "food", "play", "service", "escape"],
    flows: ["PUBLIC", "USER", "STAFF", "SERVICE", "GOODS", "WASTE", "EMERGENCY"],
    zoningGradient: ["PUBLIC_ENTRY", "SUPERVISED_SHARED", "LEARNING", "STAFF_RESTRICTED", "SERVICE"],
    relations: [
      { from: "RECEPTION", to: "LEARNING", kind: "REQUIRED", reason: "Arrival must be supervised and legible." },
      { from: "KITCHEN_SERVICE", to: "DINING", kind: "REQUIRED", reason: "Food service needs a dedicated operational sequence." },
      { from: "WASTE_SERVICE", to: "LEARNING", kind: "CONFLICT", reason: "Waste movement should not pass through learning areas without a controlled interface." },
    ],
    recurringInterfaces: ["supervised entrance", "covered transition", "classroom door", "library threshold", "servery", "service access", "multiple exits"],
    validationQuestions: ["Are student, staff, food and waste flows distinguished?", "Can supervision occur without exposing restricted rooms?", "Are acoustic buffers and escape paths explicit?"],
    epistemicStatus: "SOURCE_DERIVED_HYPOTHESIS",
    humanReviewRequired: true,
  },
  {
    id: "HEALTHCARE",
    name: "Clínicas, hospitales, urgencias y centros de salud",
    sourceFamilies: ["NEUFERT", "PLAZOLA"],
    programGroups: ["public_arrival", "outpatient", "emergency", "clinical", "clean_sterile", "dirty", "staff", "logistics"],
    flows: ["PUBLIC", "USER", "STAFF", "SERVICE", "GOODS", "WASTE", "EMERGENCY", "CLEAN_STERILE", "DIRTY"],
    zoningGradient: ["PUBLIC", "AMBULATORY", "CLINICAL", "CLEAN_STERILE", "STAFF", "DIRTY_SERVICE"],
    relations: [
      { from: "PUBLIC_RECEPTION", to: "OUTPATIENT", kind: "REQUIRED", reason: "Ambulatory users need a controlled public-to-clinical transition." },
      { from: "EMERGENCY", to: "CLINICAL_SUPPORT", kind: "REQUIRED", reason: "Emergency operations depend on short protected support routes." },
      { from: "CLEAN_STERILE", to: "DIRTY", kind: "CONFLICT", reason: "Clean and dirty workflows require separation or an explicitly validated filter." },
      { from: "PUBLIC", to: "OPERATING_ROOM", kind: "CONFLICT", reason: "Sterile clinical areas cannot be directly public." },
    ],
    recurringInterfaces: ["controlled entry", "bed/trolley door", "nurse station", "clean/dirty transition", "service lift", "waste route", "fire compartment interface"],
    validationQuestions: ["Are public, staff, bed, clean and dirty routes separated?", "Where is infection-control evidence?", "Are gases, HVAC, fire and health authority inputs present?"],
    epistemicStatus: "SOURCE_DERIVED_HYPOTHESIS",
    humanReviewRequired: true,
  },
  {
    id: "HOSPITALITY_COMMERCE",
    name: "Restaurantes, hoteles, tiendas y bancos",
    sourceFamilies: ["NEUFERT", "PLAZOLA"],
    programGroups: ["front_of_house", "back_of_house", "guest", "staff", "goods", "waste", "security"],
    flows: ["PUBLIC", "USER", "STAFF", "SERVICE", "GOODS", "WASTE", "EMERGENCY", "VEHICLE"],
    zoningGradient: ["PUBLIC_FRONT", "CONTROLLED_PUBLIC", "STAFF", "BACK_OF_HOUSE", "TECHNICAL"],
    relations: [
      { from: "CUSTOMER", to: "FRONT_OF_HOUSE", kind: "REQUIRED", reason: "Customer experience begins with legible arrival." },
      { from: "KITCHEN_SERVICE", to: "DINING", kind: "REQUIRED", reason: "Service must connect to front-of-house without uncontrolled crossing." },
      { from: "GOODS_RECEIPT", to: "CUSTOMER", kind: "CONFLICT", reason: "Goods and customer flows need separation or scheduled interface." },
    ],
    recurringInterfaces: ["lobby", "servery", "loading door", "staff entrance", "cash/security threshold", "service lift"],
    validationQuestions: ["Are front and back of house separated?", "Can goods and waste move without crossing customers?", "Are security and emergency interfaces explicit?"],
    epistemicStatus: "SOURCE_DERIVED_HYPOTHESIS",
    humanReviewRequired: true,
  },
  {
    id: "OFFICE_RELIGIOUS",
    name: "Oficinas y edificios religiosos",
    sourceFamilies: ["NEUFERT", "PLAZOLA"],
    programGroups: ["visitor", "reception", "work", "meeting", "archive", "worship", "community", "service"],
    flows: ["PUBLIC", "USER", "STAFF", "SERVICE", "GOODS", "EMERGENCY"],
    zoningGradient: ["PUBLIC", "RECEPTION", "SHARED", "WORK_RESTRICTED", "SERVICE"],
    relations: [
      { from: "RECEPTION", to: "WORK", kind: "REQUIRED", reason: "Visitors need a controlled transition to work areas." },
      { from: "WORSHIP", to: "COMMUNITY", kind: "PREFERRED", reason: "Religious buildings often combine ritual and community use." },
      { from: "PUBLIC", to: "ARCHIVE", kind: "CONFLICT", reason: "Documents and equipment require controlled access." },
    ],
    recurringInterfaces: ["reception", "meeting threshold", "archive access", "worship entrance", "processional or ceremonial transition"],
    validationQuestions: ["Is the client's tradition represented explicitly?", "Are public and restricted work routes separated?", "Are acoustic and ceremonial sequences intentional?"],
    epistemicStatus: "SOURCE_DERIVED_HYPOTHESIS",
    humanReviewRequired: true,
  },
  {
    id: "INDUSTRY_LABORATORY_AGRICULTURE",
    name: "Industria, laboratorios, talleres, granjas y almacenes",
    sourceFamilies: ["NEUFERT", "PLAZOLA"],
    programGroups: ["workers", "raw_material", "process", "product", "equipment", "waste", "maintenance", "animals"],
    flows: ["USER", "STAFF", "SERVICE", "GOODS", "WASTE", "EMERGENCY", "VEHICLE", "CLEAN_STERILE", "DIRTY"],
    zoningGradient: ["PUBLIC_CONTROL", "WORK", "PROCESS", "HAZARD_RESTRICTED", "SERVICE_WASTE"],
    relations: [
      { from: "RAW_MATERIAL", to: "PROCESS", kind: "REQUIRED", reason: "Process sequence must be legible and dimensioned by equipment." },
      { from: "PROCESS", to: "WASTE", kind: "PREFERRED", reason: "Waste must have a controlled exit route." },
      { from: "PUBLIC", to: "HAZARDOUS_PROCESS", kind: "CONFLICT", reason: "Risk requires controlled access and specialist review." },
    ],
    recurringInterfaces: ["loading dock", "vehicle gate", "equipment clearance", "extract/ventilation interface", "maintenance access", "waste route"],
    validationQuestions: ["What is the actual process and unit load?", "Are hazards and maintenance routes known?", "Which engineering disciplines must verify the proposal?"],
    epistemicStatus: "SOURCE_DERIVED_HYPOTHESIS",
    humanReviewRequired: true,
  },
  {
    id: "SPORTS_CULTURE",
    name: "Deportes, ocio, teatros y cines",
    sourceFamilies: ["NEUFERT", "PLAZOLA"],
    programGroups: ["spectator", "athlete", "stage", "technical", "wet", "staff", "service", "egress"],
    flows: ["PUBLIC", "USER", "STAFF", "SERVICE", "GOODS", "WASTE", "EMERGENCY"],
    zoningGradient: ["PUBLIC_ARRIVAL", "SPECTATOR", "ATHLETE", "TECHNICAL", "SERVICE"],
    relations: [
      { from: "SPECTATOR", to: "FOYER", kind: "REQUIRED", reason: "Audience arrival requires a legible gathering threshold." },
      { from: "ATHLETE", to: "CHANGING", kind: "REQUIRED", reason: "Athlete flow depends on a hygienic change sequence." },
      { from: "SPECTATOR", to: "STAGE_TECHNICAL", kind: "CONFLICT", reason: "Technical and public flows need controlled separation." },
    ],
    recurringInterfaces: ["turnstile", "foyer", "changing room", "wet threshold", "stage/service door", "mass egress route"],
    validationQuestions: ["Are audience, athlete, stage and service flows separate?", "Is simultaneous evacuation traceable?", "Are acoustic, hygiene and maintenance requirements explicit?"],
    epistemicStatus: "SOURCE_DERIVED_HYPOTHESIS",
    humanReviewRequired: true,
  },
  {
    id: "TRANSPORT",
    name: "Estacionamientos, terminales, estaciones y aeropuertos",
    sourceFamilies: ["NEUFERT", "PLAZOLA"],
    programGroups: ["landside", "airside_or_operational", "pedestrian", "vehicle", "baggage", "cargo", "security", "emergency"],
    flows: ["PUBLIC", "USER", "STAFF", "SERVICE", "GOODS", "WASTE", "EMERGENCY", "VEHICLE"],
    zoningGradient: ["PUBLIC_LANDSIDE", "CONTROLLED_TRANSFER", "RESTRICTED_OPERATIONAL", "SERVICE"],
    relations: [
      { from: "PUBLIC_ENTRY", to: "TRANSFER", kind: "REQUIRED", reason: "Passenger movement must be legible from arrival to departure." },
      { from: "BAGGAGE_CARGO", to: "PASSENGER", kind: "ALLOWED_WITH_FILTER", reason: "Logistics may interface through controlled screened systems." },
      { from: "PUBLIC", to: "RESTRICTED_OPERATIONAL", kind: "CONFLICT", reason: "Operational security requires controlled access." },
    ],
    recurringInterfaces: ["curb", "ticketing", "security filter", "platform/gate", "ramp", "loading", "vehicle-pedestrian crossing"],
    validationQuestions: ["Are vehicle and pedestrian networks explicit?", "Where are security and operational boundaries?", "What demand, fleet, authority and emergency data are missing?"],
    epistemicStatus: "SOURCE_DERIVED_HYPOTHESIS",
    humanReviewRequired: true,
  },
];

export function getTypologyFunctionalProfile(id: TypologyId): TypologyFunctionalProfile {
  const profile = ARKI_TYPOLOGY_FUNCTIONAL_PROFILES.find((item) => item.id === id);
  if (!profile) throw new Error(`Unknown typology: ${id}`);
  return profile;
}

export function validateFunctionalRelation(profile: TypologyFunctionalProfile, from: string, to: string): FunctionalRelationKind | "UNKNOWN" {
  const relation = profile.relations.find((item) => item.from === from && item.to === to);
  return relation?.kind ?? "UNKNOWN";
}

export function buildFunctionalKnowledgeLesson(id: TypologyId) {
  const profile = getTypologyFunctionalProfile(id);
  return {
    typology: profile.id,
    principle: "Function before beauty: program → flows → zones → relations → interfaces → geometry.",
    sourceFamilies: profile.sourceFamilies,
    exercises: [
      "Draw the functional organigram before placing coordinates.",
      "Create one valid alternative and one intentionally invalid flow.",
      "Explain every open connection, door, filter and conflict.",
      "Preserve UNKNOWN where the source or project data is insufficient.",
    ],
    profile,
  };
}

