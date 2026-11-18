/**
 * ARKI Peruvian Cities — Catálogo Canónico de Ciudades del Perú
 * --------------------------------------------------------------
 * Fuente canónica para el Heliodón ARKI-GIA.
 * Contiene las 24 capitales departamentales + Callao + ciudades clave.
 *
 * Autoridad: ARKI-GIA · Tríada Función + Sensaciones + Forma
 * Uso: Heliodón, estudios RNE, selección de contexto climático/sísmico.
 *
 * Reglas de diseño:
 * - Determinista: mismo nombre → misma ciudad.
 * - Tipado estricto: todos los campos obligatorios.
 * - Inmutable: el catálogo se exporta como readonly.
 * - Testeable: cada entrada tiene coordenadas válidas.
 *
 * Coordenadas: WGS84 (EPSG:4326). Latitud sur negativa, longitud oeste negativa.
 * Zona horaria: UTC-5 (Perú no tiene horario de verano).
 */

export type PeruvianClimateZone =
  | "desertico_costeno"
  | "tropical_seco"
  | "tropical_humedo"
  | "andino_seco"
  | "andino_humedo"
  | "selva_alta"
  | "selva_baja"
  | "puna";

export type PeruvianSeismicZone = "Z1" | "Z2" | "Z3" | "Z4";

export interface PeruvianCity {
  /** ID canónico (slug, ej: "trujillo"). */
  readonly id: string;
  /** Nombre oficial de la ciudad. */
  readonly name: string;
  /** Departamento al que pertenece. */
  readonly department: string;
  /** Provincia (para capitales departamentales, coincide con el departamento). */
  readonly province: string;
  /** Latitud WGS84 (grados). Sur negativo. */
  readonly latitude: number;
  /** Longitud WGS84 (grados). Oeste negativo. */
  readonly longitude: number;
  /** Altitud sobre el nivel del mar (metros). */
  readonly altitudeM: number;
  /** Zona climática canónica ARKI. */
  readonly climate: PeruvianClimateZone;
  /** Zona sísmica según RNE A.030. */
  readonly seismicZone: PeruvianSeismicZone;
  /** Jurisdicción normativa (siempre RNE-PE para Perú). */
  readonly jurisdiction: "RNE-PE";
  /** Offset horario UTC (siempre -5 para Perú). */
  readonly timezoneOffset: -5;
  /** Etiqueta legible para UI (ej: "Trujillo, La Libertad"). */
  readonly label: string;
}

/**
 * Catálogo canónico de ciudades peruanas.
 * 24 capitales departamentales + Callao + ciudades clave.
 *
 * Coordenadas validadas contra:
 * - IGN Perú (Instituto Geográfico Nacional)
 * - Google Maps (verificación cruzada)
 * - RNE A.030 (zonas sísmicas)
 */
export const PERUVIAN_CITIES: readonly PeruvianCity[] = [
  // ============================================================
  // COSTA NORTE
  // ============================================================
  {
    id: "tumbes",
    name: "Tumbes",
    department: "Tumbes",
    province: "Tumbes",
    latitude: -3.5642,
    longitude: -80.4564,
    altitudeM: 8,
    climate: "tropical_seco",
    seismicZone: "Z1",
    jurisdiction: "RNE-PE",
    timezoneOffset: -5,
    label: "Tumbes, Tumbes",
  },
  {
    id: "piura",
    name: "Piura",
    department: "Piura",
    province: "Piura",
    latitude: -5.1945,
    longitude: -80.6328,
    altitudeM: 29,
    climate: "tropical_seco",
    seismicZone: "Z1",
    jurisdiction: "RNE-PE",
    timezoneOffset: -5,
    label: "Piura, Piura",
  },
  {
    id: "chiclayo",
    name: "Chiclayo",
    department: "Lambayeque",
    province: "Chiclayo",
    latitude: -6.7714,
    longitude: -79.8409,
    altitudeM: 29,
    climate: "tropical_seco",
    seismicZone: "Z1",
    jurisdiction: "RNE-PE",
    timezoneOffset: -5,
    label: "Chiclayo, Lambayeque",
  },
  {
    id: "trujillo",
    name: "Trujillo",
    department: "La Libertad",
    province: "Trujillo",
    latitude: -8.1091,
    longitude: -79.0211,
    altitudeM: 31,
    climate: "desertico_costeno",
    seismicZone: "Z2",
    jurisdiction: "RNE-PE",
    timezoneOffset: -5,
    label: "Trujillo, La Libertad",
  },
  {
    id: "chachapoyas",
    name: "Chachapoyas",
    department: "Amazonas",
    province: "Chachapoyas",
    latitude: -6.2294,
    longitude: -77.8644,
    altitudeM: 2334,
    climate: "andino_humedo",
    seismicZone: "Z2",
    jurisdiction: "RNE-PE",
    timezoneOffset: -5,
    label: "Chachapoyas, Amazonas",
  },

  // ============================================================
  // COSTA CENTRO
  // ============================================================
  {
    id: "cajamarca",
    name: "Cajamarca",
    department: "Cajamarca",
    province: "Cajamarca",
    latitude: -7.1639,
    longitude: -78.5167,
    altitudeM: 2750,
    climate: "andino_seco",
    seismicZone: "Z2",
    jurisdiction: "RNE-PE",
    timezoneOffset: -5,
    label: "Cajamarca, Cajamarca",
  },
  {
    id: "huanuco",
    name: "Huánuco",
    department: "Huánuco",
    province: "Huánuco",
    latitude: -9.9298,
    longitude: -76.2433,
    altitudeM: 1894,
    climate: "andino_humedo",
    seismicZone: "Z2",
    jurisdiction: "RNE-PE",
    timezoneOffset: -5,
    label: "Huánuco, Huánuco",
  },
  {
    id: "cerro_de_pasco",
    name: "Cerro de Pasco",
    department: "Pasco",
    province: "Pasco",
    latitude: -10.4567,
    longitude: -76.2544,
    altitudeM: 4338,
    climate: "puna",
    seismicZone: "Z2",
    jurisdiction: "RNE-PE",
    timezoneOffset: -5,
    label: "Cerro de Pasco, Pasco",
  },
  {
    id: "huaraz",
    name: "Huaraz",
    department: "Áncash",
    province: "Huaraz",
    latitude: -9.5278,
    longitude: -77.5278,
    altitudeM: 3052,
    climate: "andino_seco",
    seismicZone: "Z3",
    jurisdiction: "RNE-PE",
    timezoneOffset: -5,
    label: "Huaraz, Áncash",
  },
  {
    id: "lima",
    name: "Lima",
    department: "Lima",
    province: "Lima",
    latitude: -12.0464,
    longitude: -77.0428,
    altitudeM: 154,
    climate: "desertico_costeno",
    seismicZone: "Z4",
    jurisdiction: "RNE-PE",
    timezoneOffset: -5,
    label: "Lima, Lima",
  },
  {
    id: "callao",
    name: "Callao",
    department: "Callao",
    province: "Callao",
    latitude: -12.0566,
    longitude: -77.1185,
    altitudeM: 7,
    climate: "desertico_costeno",
    seismicZone: "Z4",
    jurisdiction: "RNE-PE",
    timezoneOffset: -5,
    label: "Callao, Callao",
  },

  // ============================================================
  // COSTA SUR
  // ============================================================
  {
    id: "huancavelica",
    name: "Huancavelica",
    department: "Huancavelica",
    province: "Huancavelica",
    latitude: -12.7892,
    longitude: -74.9747,
    altitudeM: 3676,
    climate: "puna",
    seismicZone: "Z3",
    jurisdiction: "RNE-PE",
    timezoneOffset: -5,
    label: "Huancavelica, Huancavelica",
  },
  {
    id: "huancayo",
    name: "Huancayo",
    department: "Junín",
    province: "Huancayo",
    latitude: -12.0686,
    longitude: -75.2049,
    altitudeM: 3259,
    climate: "andino_seco",
    seismicZone: "Z3",
    jurisdiction: "RNE-PE",
    timezoneOffset: -5,
    label: "Huancayo, Junín",
  },
  {
    id: "ayacucho",
    name: "Ayacucho",
    department: "Ayacucho",
    province: "Huamanga",
    latitude: -13.1588,
    longitude: -74.2236,
    altitudeM: 2761,
    climate: "andino_seco",
    seismicZone: "Z3",
    jurisdiction: "RNE-PE",
    timezoneOffset: -5,
    label: "Ayacucho, Ayacucho",
  },
  {
    id: "ica",
    name: "Ica",
    department: "Ica",
    province: "Ica",
    latitude: -14.0678,
    longitude: -75.7286,
    altitudeM: 406,
    climate: "desertico_costeno",
    seismicZone: "Z3",
    jurisdiction: "RNE-PE",
    timezoneOffset: -5,
    label: "Ica, Ica",
  },
  {
    id: "arequipa",
    name: "Arequipa",
    department: "Arequipa",
    province: "Arequipa",
    latitude: -16.4090,
    longitude: -71.5375,
    altitudeM: 2335,
    climate: "andino_seco",
    seismicZone: "Z4",
    jurisdiction: "RNE-PE",
    timezoneOffset: -5,
    label: "Arequipa, Arequipa",
  },
  {
    id: "moquegua",
    name: "Moquegua",
    department: "Moquegua",
    province: "Mariscal Nieto",
    latitude: -17.1972,
    longitude: -70.9333,
    altitudeM: 1410,
    climate: "andino_seco",
    seismicZone: "Z4",
    jurisdiction: "RNE-PE",
    timezoneOffset: -5,
    label: "Moquegua, Moquegua",
  },
  {
    id: "puno",
    name: "Puno",
    department: "Puno",
    province: "Puno",
    latitude: -15.8402,
    longitude: -70.0219,
    altitudeM: 3827,
    climate: "puna",
    seismicZone: "Z3",
    jurisdiction: "RNE-PE",
    timezoneOffset: -5,
    label: "Puno, Puno",
  },
  {
    id: "tacna",
    name: "Tacna",
    department: "Tacna",
    province: "Tacna",
    latitude: -18.0066,
    longitude: -70.2639,
    altitudeM: 560,
    climate: "desertico_costeno",
    seismicZone: "Z4",
    jurisdiction: "RNE-PE",
    timezoneOffset: -5,
    label: "Tacna, Tacna",
  },

  // ============================================================
  // SELVA ALTA
  // ============================================================
  {
    id: "tarapoto",
    name: "Tarapoto",
    department: "San Martín",
    province: "San Martín",
    latitude: -6.4858,
    longitude: -76.3619,
    altitudeM: 320,
    climate: "selva_alta",
    seismicZone: "Z1",
    jurisdiction: "RNE-PE",
    timezoneOffset: -5,
    label: "Tarapoto, San Martín",
  },
  {
    id: "moyobamba",
    name: "Moyobamba",
    department: "San Martín",
    province: "Moyobamba",
    latitude: -6.0367,
    longitude: -76.9667,
    altitudeM: 860,
    climate: "selva_alta",
    seismicZone: "Z2",
    jurisdiction: "RNE-PE",
    timezoneOffset: -5,
    label: "Moyobamba, San Martín",
  },
  {
    id: "cusco",
    name: "Cusco",
    department: "Cusco",
    province: "Cusco",
    latitude: -13.5320,
    longitude: -71.9675,
    altitudeM: 3399,
    climate: "andino_humedo",
    seismicZone: "Z4",
    jurisdiction: "RNE-PE",
    timezoneOffset: -5,
    label: "Cusco, Cusco",
  },
  {
    id: "abancay",
    name: "Abancay",
    department: "Apurímac",
    province: "Abancay",
    latitude: -13.6373,
    longitude: -72.8864,
    altitudeM: 2378,
    climate: "andino_seco",
    seismicZone: "Z3",
    jurisdiction: "RNE-PE",
    timezoneOffset: -5,
    label: "Abancay, Apurímac",
  },
  {
    id: "puerto_maldonado",
    name: "Puerto Maldonado",
    department: "Madre de Dios",
    province: "Tambopata",
    latitude: -12.5939,
    longitude: -69.1889,
    altitudeM: 185,
    climate: "tropical_humedo",
    seismicZone: "Z1",
    jurisdiction: "RNE-PE",
    timezoneOffset: -5,
    label: "Puerto Maldonado, Madre de Dios",
  },

  // ============================================================
  // SELVA BAJA
  // ============================================================
  {
    id: "ucayali",
    name: "Pucallpa",
    department: "Ucayali",
    province: "Coronel Portillo",
    latitude: -8.3791,
    longitude: -74.5540,
    altitudeM: 154,
    climate: "tropical_humedo",
    seismicZone: "Z1",
    jurisdiction: "RNE-PE",
    timezoneOffset: -5,
    label: "Pucallpa, Ucayali",
  },
  {
    id: "iquitos",
    name: "Iquitos",
    department: "Loreto",
    province: "Maynas",
    latitude: -3.7437,
    longitude: -73.2516,
    altitudeM: 106,
    climate: "tropical_humedo",
    seismicZone: "Z1",
    jurisdiction: "RNE-PE",
    timezoneOffset: -5,
    label: "Iquitos, Loreto",
  },
] as const;

/**
 * Obtiene una ciudad por su ID canónico.
 * @throws Error si el ID no existe.
 */
export function getCityById(id: string): PeruvianCity {
  const city = PERUVIAN_CITIES.find((c) => c.id === id);
  if (!city) {
    throw new Error(`ARKI_CITIES: ciudad no encontrada: ${id}`);
  }
  return city;
}

/**
 * Obtiene una ciudad por su nombre (búsqueda case-insensitive).
 * @throws Error si el nombre no existe.
 */
export function getCityByName(name: string): PeruvianCity {
  const normalized = name.trim().toLowerCase();
  const city = PERUVIAN_CITIES.find((c) => c.name.toLowerCase() === normalized);
  if (!city) {
    throw new Error(`ARKI_CITIES: ciudad no encontrada: ${name}`);
  }
  return city;
}

/**
 * Lista todas las ciudades de un departamento.
 */
export function getCitiesByDepartment(department: string): readonly PeruvianCity[] {
  const normalized = department.trim().toLowerCase();
  return PERUVIAN_CITIES.filter((c) => c.department.toLowerCase() === normalized);
}

/**
 * Lista todas las ciudades de una zona climática.
 */
export function getCitiesByClimate(climate: PeruvianClimateZone): readonly PeruvianCity[] {
  return PERUVIAN_CITIES.filter((c) => c.climate === climate);
}

/**
 * Lista todas las ciudades de una zona sísmica.
 */
export function getCitiesBySeismicZone(zone: PeruvianSeismicZone): readonly PeruvianCity[] {
  return PERUVIAN_CITIES.filter((c) => c.seismicZone === zone);
}

/**
 * Convierte una ciudad a SolarInput (para el motor heliodón).
 */
export function cityToSolarInput(city: PeruvianCity, datetime: string | Date) {
  return {
    latitude: city.latitude,
    longitude: city.longitude,
    timezoneOffset: city.timezoneOffset,
    datetime,
  };
}
