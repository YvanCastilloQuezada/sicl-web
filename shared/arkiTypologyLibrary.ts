export const ARKI_TYPOLOGY_LIBRARY_VERSION = "ARKI-TYPOLOGY-LIBRARY-1.0" as const;

export type TypologyCategory = "RESIDENTIAL" | "EDUCATION" | "HEALTH" | "CULTURE" | "SPORT" | "OFFICE" | "COMMERCE" | "INDUSTRY" | "TRANSPORT" | "HOSPITALITY" | "WORSHIP" | "LANDSCAPE" | "URBANISM";
export type TypologyScale = "OBJECT" | "BUILDING" | "SITE" | "CAMPUS" | "DISTRICT" | "CITY";
export type TypologyParameterType = "number" | "boolean" | "string";

export type TypologyParameter = { key: string; label: string; type: TypologyParameterType; unit?: string; defaultValue: number | boolean | string; min?: number; max?: number; required: boolean };
export type ArkiTypology = {
  id: string;
  name: string;
  category: TypologyCategory;
  scale: TypologyScale;
  description: string;
  parameters: TypologyParameter[];
  ruleDomains: string[];
  metrics: string[];
  evidenceRequired: string[];
  status: "REFERENCE_TEMPLATE";
};

type Definition = [string, string, TypologyCategory, TypologyScale, string, string[], string[]];
const definitions: Definition[] = [
  ["RES_UNIFAMILIAR", "Vivienda unifamiliar", "RESIDENTIAL", "BUILDING", "Casa para un núcleo familiar.", ["habitabilidad", "accesibilidad", "seguridad"], ["areaConstruida", "ocupacion", "niveles"]],
  ["RES_MULTIFAMILIAR", "Vivienda multifamiliar", "RESIDENTIAL", "BUILDING", "Edificio de unidades residenciales y áreas comunes.", ["habitabilidad", "accesibilidad", "evacuacion"], ["areaConstruida", "unidades", "densidad"]],
  ["RES_CONJUNTO_HABITACIONAL", "Conjunto habitacional", "RESIDENTIAL", "SITE", "Conjunto de viviendas con espacio colectivo.", ["urbanismo", "habitabilidad", "espacioPublico"], ["unidades", "densidad", "areaLibre"]],
  ["RES_VIVIENDA_SOCIAL", "Vivienda social", "RESIDENTIAL", "BUILDING", "Vivienda prioritaria con optimización de costo y acceso.", ["habitabilidad", "accesibilidad", "costo"], ["areaUtil", "unidades", "costoConceptual"]],
  ["EDU_INICIAL", "Educación inicial", "EDUCATION", "BUILDING", "Centro para primera infancia.", ["educacion", "seguridad", "accesibilidad"], ["aulas", "aforo", "areaExterior"]],
  ["EDU_PRIMARIA", "Escuela primaria", "EDUCATION", "BUILDING", "Infraestructura educativa para educación primaria.", ["educacion", "evacuacion", "accesibilidad"], ["aulas", "aforo", "areaPorAlumno"]],
  ["EDU_SECUNDARIA", "Escuela secundaria", "EDUCATION", "BUILDING", "Infraestructura educativa para educación secundaria.", ["educacion", "evacuacion", "seguridad"], ["aulas", "aforo", "areaPorAlumno"]],
  ["EDU_UNIVERSIDAD", "Universidad", "EDUCATION", "CAMPUS", "Campus universitario con enseñanza, investigación y servicios.", ["educacion", "urbanismo", "accesibilidad"], ["aforo", "edificabilidad", "areaVerde"]],
  ["HEALTH_PUESTO", "Puesto de salud", "HEALTH", "BUILDING", "Atención primaria de escala local.", ["salud", "bioseguridad", "accesibilidad"], ["consultorios", "aforo", "areaAtencion"]],
  ["HEALTH_CENTRO", "Centro de salud", "HEALTH", "BUILDING", "Atención ambulatoria y servicios de diagnóstico básicos.", ["salud", "bioseguridad", "MEP"], ["consultorios", "procedimientos", "areaAtencion"]],
  ["HEALTH_HOSPITAL_GENERAL", "Hospital general", "HEALTH", "BUILDING", "Hospital con emergencia, hospitalización y soporte clínico.", ["salud", "bioseguridad", "evacuacion", "MEP"], ["camas", "quirófanos", "areaPorCama"]],
  ["HEALTH_HOSPITAL_ESPECIALIZADO", "Hospital especializado", "HEALTH", "BUILDING", "Hospital especializado con alta complejidad técnica.", ["salud", "bioseguridad", "gasesMedicinales", "MEP"], ["camas", "UCI", "quirófanos"]],
  ["CULT_BIBLIOTECA", "Biblioteca", "CULTURE", "BUILDING", "Biblioteca pública o académica.", ["cultura", "accesibilidad", "evacuacion"], ["puestosLectura", "aforo", "areaColeccion"]],
  ["CULT_MUSEO", "Museo", "CULTURE", "BUILDING", "Museo para exposición, conservación y educación.", ["cultura", "conservacion", "seguridad"], ["salas", "aforo", "areaExposicion"]],
  ["CULT_TEATRO", "Teatro", "CULTURE", "BUILDING", "Teatro con sala, escenario y soporte técnico.", ["cultura", "acustica", "evacuacion"], ["butacas", "escenario", "aforo"]],
  ["CULT_CENTRO_CULTURAL", "Centro cultural", "CULTURE", "BUILDING", "Centro multifuncional para artes y comunidad.", ["cultura", "accesibilidad", "evacuacion"], ["salas", "aforo", "areaPublica"]],
  ["SPORT_ESTADIO", "Estadio", "SPORT", "SITE", "Recinto deportivo masivo con gradas y cobertura.", ["deporte", "evacuacion", "accesibilidad", "clima"], ["aforo", "campo", "tiempoEvacuacion"]],
  ["SPORT_COLISEO", "Coliseo", "SPORT", "BUILDING", "Recinto cubierto para eventos deportivos.", ["deporte", "evacuacion", "acustica"], ["aforo", "gradas", "areaDeportiva"]],
  ["SPORT_PISCINA", "Piscina deportiva", "SPORT", "BUILDING", "Complejo acuático para entrenamiento y competencia.", ["deporte", "salud", "MEP"], ["vasos", "aforo", "areaAgua"]],
  ["SPORT_CANCHA", "Cancha deportiva", "SPORT", "SITE", "Cancha y servicios deportivos de barrio o campus.", ["deporte", "accesibilidad", "paisajismo"], ["areaDeportiva", "aforo", "areaLibre"]],
  ["OFFICE_CORPORATIVO", "Edificio corporativo", "OFFICE", "BUILDING", "Edificio de oficinas para organización privada.", ["oficinas", "accesibilidad", "evacuacion", "MEP"], ["puestos", "edificabilidad", "areaPorPuesto"]],
  ["OFFICE_COWORKING", "Coworking", "OFFICE", "BUILDING", "Espacio flexible de trabajo compartido.", ["oficinas", "accesibilidad", "acustica"], ["puestos", "salas", "areaPorPuesto"]],
  ["OFFICE_GUBERNAMENTAL", "Edificio gubernamental", "OFFICE", "BUILDING", "Edificio para atención y administración pública.", ["oficinas", "accesibilidad", "seguridad", "evacuacion"], ["puestos", "aforo", "areaAtencion"]],
  ["COMMERCE_CENTRO_COMERCIAL", "Centro comercial", "COMMERCE", "BUILDING", "Conjunto comercial con circulación pública y servicios.", ["comercio", "evacuacion", "accesibilidad", "estacionamiento"], ["areaComercial", "aforo", "locales"]],
  ["COMMERCE_MERCADO", "Mercado", "COMMERCE", "BUILDING", "Mercado de abastos y comercio local.", ["comercio", "salubridad", "evacuacion"], ["puestos", "aforo", "areaVenta"]],
  ["COMMERCE_TIENDA", "Tienda departamental", "COMMERCE", "BUILDING", "Tienda de gran superficie.", ["comercio", "evacuacion", "accesibilidad"], ["areaVenta", "aforo", "niveles"]],
  ["IND_PLANTA_MANUFACTURA", "Planta de manufactura", "INDUSTRY", "SITE", "Planta industrial con procesos y logística.", ["industria", "seguridad", "ambiente", "MEP"], ["areaProduccion", "capacidad", "consumoEnergia"]],
  ["IND_ALMACEN", "Almacén", "INDUSTRY", "BUILDING", "Almacén para almacenamiento y despacho.", ["industria", "seguridad", "logistica"], ["volumenAlmacen", "posiciones", "flujoCarga"]],
  ["IND_CENTRO_LOGISTICO", "Centro logístico", "INDUSTRY", "SITE", "Centro de transferencia y distribución.", ["industria", "transporte", "seguridad"], ["vehiculos", "muelles", "flujoCarga"]],
  ["TRANS_TERMINAL", "Terminal terrestre", "TRANSPORT", "SITE", "Terminal de pasajeros con buses, taxis y operación logística.", ["transporte", "evacuacion", "accesibilidad", "seguridad"], ["buses", "pasajerosHora", "andenes"]],
  ["TRANS_AEROPUERTO", "Aeropuerto", "TRANSPORT", "SITE", "Aeropuerto con terminal, plataforma y flujos segregados.", ["transporte", "OACI", "seguridad", "evacuacion"], ["posiciones", "pasajerosHora", "plataforma"]],
  ["TRANS_PUERTO", "Puerto", "TRANSPORT", "SITE", "Infraestructura portuaria para pasajeros o carga.", ["transporte", "maritimo", "ambiente", "seguridad"], ["muelles", "carga", "calado"]],
  ["TRANS_ESTACION_METRO", "Estación de metro", "TRANSPORT", "BUILDING", "Estación de transporte masivo urbano.", ["transporte", "evacuacion", "accesibilidad"], ["pasajerosHora", "andenes", "conexiones"]],
  ["HOSP_HOTEL", "Hotel", "HOSPITALITY", "BUILDING", "Hotel con habitaciones, servicios y áreas comunes.", ["hospedaje", "accesibilidad", "evacuacion"], ["habitaciones", "camas", "areaComunal"]],
  ["HOSP_HOSTAL", "Hostal", "HOSPITALITY", "BUILDING", "Hospedaje de escala económica.", ["hospedaje", "habitabilidad", "seguridad"], ["habitaciones", "camas", "aforo"]],
  ["HOSP_RESORT", "Resort", "HOSPITALITY", "SITE", "Complejo turístico con alojamiento, paisaje y recreación.", ["hospedaje", "paisajismo", "ambiente", "accesibilidad"], ["habitaciones", "areaRecreativa", "areaVerde"]],
  ["WORSHIP_IGLESIA", "Iglesia", "WORSHIP", "BUILDING", "Edificio de culto comunitario.", ["culto", "acustica", "evacuacion"], ["aforo", "nave", "areaComunal"]],
  ["WORSHIP_TEMPLO", "Templo", "WORSHIP", "BUILDING", "Edificio de culto con valor simbólico y comunitario.", ["culto", "patrimonio", "accesibilidad"], ["aforo", "espacioRitual", "areaPublica"]],
  ["LAND_PARQUE_URBANO", "Parque urbano", "LANDSCAPE", "SITE", "Espacio verde de recreación y encuentro.", ["paisajismo", "ambiente", "accesibilidad"], ["areaVerde", "aforo", "permeabilidad"]],
  ["LAND_PLAZA", "Plaza", "LANDSCAPE", "SITE", "Espacio público cívico y representativo.", ["paisajismo", "urbanismo", "accesibilidad"], ["areaPublica", "aforo", "sombra"]],
  ["LAND_ALAMEDA", "Alameda", "LANDSCAPE", "SITE", "Eje peatonal arbolado.", ["paisajismo", "movilidad", "accesibilidad"], ["longitud", "sombra", "permeabilidad"]],
  ["LAND_MALECON", "Malecón", "LANDSCAPE", "SITE", "Espacio público lineal junto a borde de agua.", ["paisajismo", "riesgo", "ambiente"], ["longitud", "areaPublica", "proteccionBorde"]],
  ["LAND_JARDIN_BOTANICO", "Jardín botánico", "LANDSCAPE", "SITE", "Colección vegetal, investigación y educación.", ["paisajismo", "ambiente", "agua"], ["areaColeccion", "especies", "areaVerde"]],
  ["LAND_CORREDOR_VERDE", "Corredor verde", "LANDSCAPE", "DISTRICT", "Conector ecológico y peatonal urbano.", ["paisajismo", "urbanismo", "movilidad"], ["longitud", "conectividad", "areaVerde"]],
  ["LAND_HUMEDAL_ARTIFICIAL", "Humedal artificial", "LANDSCAPE", "SITE", "Sistema paisajístico para tratamiento y biodiversidad.", ["agua", "ambiente", "biodiversidad"], ["caudal", "areaTratamiento", "retencion"]],
  ["LAND_PARQUE_METROPOLITANO", "Parque metropolitano", "LANDSCAPE", "DISTRICT", "Gran parque de escala metropolitana.", ["paisajismo", "urbanismo", "ambiente"], ["areaVerde", "aforo", "conectividad"]],
  ["LAND_RECUPERACION_RIBERENA", "Recuperación ribereña", "LANDSCAPE", "DISTRICT", "Restauración ecológica y urbana de un borde fluvial.", ["paisajismo", "riesgo", "ambiente", "agua"], ["longitud", "areaRestaurada", "proteccionBorde"]],
  ["URB_MANZANA", "Manzana urbana", "URBANISM", "DISTRICT", "Unidad urbana para mezcla de usos y espacio público.", ["urbanismo", "movilidad", "habitabilidad"], ["densidad", "edificabilidad", "areaPublica"]],
  ["URB_BARRIO", "Barrio", "URBANISM", "DISTRICT", "Conjunto urbano de proximidad y servicios.", ["urbanismo", "vivienda", "movilidad", "equipamiento"], ["habitantes", "densidad", "equipamientos"]],
  ["URB_SECTOR", "Sector urbano", "URBANISM", "DISTRICT", "Sector urbano con redes, usos y centralidades.", ["urbanismo", "movilidad", "agua", "energia"], ["habitantes", "densidad", "redes"]],
  ["URB_CIUDAD", "Ciudad", "URBANISM", "CITY", "Sistema urbano multiescalar con infraestructura y territorio.", ["urbanismo", "movilidad", "ambiente", "riesgo", "economia"], ["habitantes", "suelo", "emisiones"]],
  ["WORSHIP_CATEDRAL", "Catedral", "WORSHIP", "BUILDING", "Complejo de culto de gran escala.", ["culto", "patrimonio", "acustica"], ["aforo", "nave", "altura"]],
  ["WORSHIP_CAPILLA", "Capilla", "WORSHIP", "BUILDING", "Espacio de culto de escala local.", ["culto", "acustica", "accesibilidad"], ["aforo", "areaPublica", "nave"]],
  ["WORSHIP_MEZQUITA", "Mezquita", "WORSHIP", "BUILDING", "Complejo de culto islámico.", ["culto", "patrimonio", "accesibilidad"], ["aforo", "patio", "altura"]],
  ["WORSHIP_SINAGOGA", "Sinagoga", "WORSHIP", "BUILDING", "Complejo de culto y comunidad.", ["culto", "patrimonio", "seguridad"], ["aforo", "salas", "areaPublica"]],
  ["LAND_JARDIN_BOTANICO_AVANZADO", "Jardín botánico avanzado", "LANDSCAPE", "SITE", "Colección vegetal con investigación y educación.", ["paisajismo", "ambiente", "agua"], ["especies", "areaColeccion", "visitantes"]],
  ["LAND_PARQUE_LINEAL", "Parque lineal", "LANDSCAPE", "DISTRICT", "Eje verde y de movilidad activa.", ["paisajismo", "movilidad", "biodiversidad"], ["longitud", "sombra", "conectividad"]],
  ["URB_CONJUNTO_HABITACIONAL", "Conjunto habitacional urbano", "URBANISM", "SITE", "Conjunto residencial con servicios y espacio colectivo.", ["urbanismo", "vivienda", "movilidad"], ["unidades", "densidad", "areaLibre"]],
  ["URB_CENTRO_URBANO", "Centro urbano", "URBANISM", "DISTRICT", "Centralidad urbana de usos mixtos.", ["urbanismo", "movilidad", "economia"], ["densidad", "edificabilidad", "empleo"]],
  ["INF_PLANTA_TRATAMIENTO_AGUA", "Planta de tratamiento de agua", "INDUSTRY", "SITE", "Infraestructura de potabilización.", ["agua", "ambiente", "industria"], ["caudal", "areaTratamiento", "consumoEnergia"]],
  ["INF_PLANTA_TRATAMIENTO_RESIDUAL", "Planta de tratamiento residual", "INDUSTRY", "SITE", "Infraestructura de saneamiento.", ["agua", "ambiente", "salubridad"], ["caudal", "eficiencia", "lodos"]],
  ["INF_PLANTA_DESALINIZADORA", "Planta desalinizadora", "INDUSTRY", "SITE", "Producción de agua desalinizada.", ["agua", "energia", "ambiente"], ["caudal", "salmuera", "consumoEnergia"]],
  ["INF_RELLENO_SANITARIO", "Relleno sanitario", "INDUSTRY", "SITE", "Gestión controlada de residuos.", ["ambiente", "salubridad", "riesgo"], ["toneladasDia", "vidaUtil", "area"]],
  ["INF_PLANTA_SOLAR", "Planta solar", "INDUSTRY", "SITE", "Generación fotovoltaica.", ["energia", "ambiente", "infraestructura"], ["potencia", "areaPaneles", "almacenamiento"]],
  ["INF_PLANTA_EOLICA", "Planta eólica", "INDUSTRY", "SITE", "Generación eólica.", ["energia", "ambiente", "infraestructura"], ["potencia", "aerogeneradores", "distanciaSeguridad"]],
  ["SPECIAL_EDIFICIO_FLOTANTE", "Edificio flotante", "URBANISM", "SITE", "Edificación adaptada a cuerpo de agua.", ["agua", "riesgo", "estructura"], ["flotabilidad", "area", "calado"]],
  ["SPECIAL_ESTRUCTURA_TENSADA", "Estructura tensada", "SPORT", "SITE", "Gran cubierta de membrana y tensores.", ["estructura", "clima", "evacuacion"], ["luz", "areaCubierta", "viento"]],
  ["SPECIAL_CENTRO_DATOS", "Centro de datos", "INDUSTRY", "BUILDING", "Infraestructura digital de alta disponibilidad.", ["energia", "MEP", "seguridad"], ["racks", "potencia", "redundancia"]],
  ["TRANS_TERMINAL_LACUSTRE", "Terminal lacustre", "TRANSPORT", "SITE", "Terminal de embarque y conexión territorial.", ["transporte", "agua", "turismo"], ["muelles", "pasajerosHora", "calado"]],
];

const commonParameters: TypologyParameter[] = [
  { key: "area_m2", label: "Área del ámbito", type: "number", unit: "m²", defaultValue: 1000, min: 1, max: 10_000_000, required: true },
  { key: "capacity", label: "Capacidad o aforo", type: "number", unit: "personas", defaultValue: 100, min: 1, max: 2_000_000, required: true },
  { key: "levels", label: "Niveles", type: "number", unit: "niveles", defaultValue: 2, min: 1, max: 100, required: true },
  { key: "country", label: "País normativo", type: "string", defaultValue: "PE", required: true },
  { key: "professionalReview", label: "Revisión profesional", type: "boolean", defaultValue: true, required: true },
];

export const ARKI_TYPOLOGIES: ArkiTypology[] = definitions.map(([id, name, category, scale, description, ruleDomains, metrics]) => ({
  id, name, category, scale, description,
  parameters: commonParameters.map((parameter) => ({ ...parameter })),
  ruleDomains, metrics,
  evidenceRequired: ["programa", "sitio", "normativa_vigente", "especialista_responsable"],
  status: "REFERENCE_TEMPLATE",
}));

export function listArkiTypologies(category?: TypologyCategory) { return category ? ARKI_TYPOLOGIES.filter((item) => item.category === category) : ARKI_TYPOLOGIES; }
export function getArkiTypology(id: string) { return ARKI_TYPOLOGIES.find((item) => item.id === id) ?? null; }
export function arkiTypologySummary() { return { version: ARKI_TYPOLOGY_LIBRARY_VERSION, total: ARKI_TYPOLOGIES.length, categories: Array.from(new Set(ARKI_TYPOLOGIES.map((item) => item.category))), status: "REFERENCE_TEMPLATES_REQUIRE_EVIDENCE" as const }; }
export function instantiateArkiTypology(id: string, overrides: Record<string, number | boolean | string> = {}) {
  const typology = getArkiTypology(id);
  if (!typology) return null;
  const parameters = Object.fromEntries(typology.parameters.map((parameter) => [parameter.key, overrides[parameter.key] ?? parameter.defaultValue]));
  return { typologyId: typology.id, typologyName: typology.name, parameters, ruleDomains: typology.ruleDomains, metrics: typology.metrics, humanReviewRequired: true as const, status: "AI_PROPOSED" as const };
}

export const ARKI_TYPOLOGY_COUNT = ARKI_TYPOLOGIES.length;
if (ARKI_TYPOLOGY_COUNT < 40) throw new Error("ARKI typology library must contain at least 40 typologies");

export default ARKI_TYPOLOGIES;
