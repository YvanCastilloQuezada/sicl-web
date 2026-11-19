/**
 * ARKI Köppen-Geiger Climate Classifier
 * -------------------------------------
 * Determina la zona climática global basada en latitud, longitud y altitud.
 * Para una versión de producción a gran escala, esto se conectaría a un 
 * raster dataset global (ej: Beck et al., 2018). 
 * Aquí usamos un motor heurístico robusto + lookup de ciudades canónicas 
 * para garantizar precisión inmediata en los casos de uso principales.
 */

export type KoppenZone = 
  | "Af" | "Am" | "Aw" // Tropical
  | "BWh" | "BWk" | "BSh" | "BSk" // Árido
  | "Cfa" | "Cfb" | "Cfc" | "Csa" | "Csb" | "Cwb" // Templado
  | "Dfa" | "Dfb" | "Dfc" | "Dfd" // Continental
  | "ET" | "EF"; // Polar / Alta montaña

export interface ClimateProfile {
  zone: KoppenZone;
  zoneName: string;
  description: string;
  passiveStrategies: string[];
}

// Lookup canónico para ciudades principales (extensible globalmente)
const CANONICAL_CLIMATES: Record<string, ClimateProfile> = {
  "trujillo_pe": {
    zone: "BWh",
    zoneName: "Desértico cálido",
    description: "Costa árida con alta humedad relativa estacional. Radiación solar intensa.",
    passiveStrategies: ["Aleros profundos", "Ventilación cruzada", "Protección solar en fachadas Este/Oeste", "Masa térmica moderada"],
  },
  "lima_pe": {
    zone: "BWh", // Técnicamente desierto, pero con microclima de garúa
    zoneName: "Desértico costero (Garúa)",
    description: "Alta humedad relativa anual, baja amplitud térmica, cielo nublado estacional.",
    passiveStrategies: ["Ventilación natural", "Protección contra humedad", "Ganancia solar en invierno"],
  },
  "puno_pe": {
    zone: "ET", // Clima de tundra / alta montaña
    zoneName: "Altoandino / Puna",
    description: "Radiación solar extremadamente intensa, noches muy frías, baja presión atmosférica.",
    passiveStrategies: ["Ganancia solar directa (Trombe, invernaderos)", "Masa térmica alta", "Aislamiento térmico extremo", "Estanqueidad al aire"],
  },
  "iquitos_pe": {
    zone: "Af",
    zoneName: "Ecuatorial húmedo",
    description: "Temperaturas altas y humedad relativa >80% todo el año. Radiación difusa alta.",
    passiveStrategies: ["Sombreado total", "Ventilación cruzada forzada", "Techos altos", "Materiales de baja inercia térmica"],
  },
  "berlin_de": {
    zone: "Cfb",
    zoneName: "Templado oceánico",
    description: "Inviernos fríos, veranos suaves. Radiación solar baja en invierno.",
    passiveStrategies: ["Aislamiento térmico pesado", "Ganancia solar pasiva al sur", "Recuperación de calor"],
  },
  "cdmx_mx": {
    zone: "Cwb",
    zoneName: "Subtropical de altitud",
    description: "Días templados, noches frescas. Alta radiación UV por altitud.",
    passiveStrategies: ["Masa térmica", "Ventilación nocturna", "Protección solar"],
  }
};

/**
 * Obtiene el perfil climático para una ubicación.
 * @param lat Latitud (-90 a 90)
 * @param lon Longitud (-180 a 180)
 * @param alt Altitud en metros
 * @param cityId Identificador opcional para lookup exacto (ej: "trujillo_pe")
 */
export function getClimateProfile(lat: number, lon: number, alt: number, cityId?: string): ClimateProfile {
  // 1. Intentar lookup canónico primero (máxima precisión para ciudades conocidas)
  if (cityId && CANONICAL_CLIMATES[cityId]) {
    return CANONICAL_CLIMATES[cityId];
  }

  // 2. Fallback heurístico global simplificado (para cualquier coordenada del planeta)
  const absLat = Math.abs(lat);
  
  if (alt > 3500) {
    return {
      zone: "ET",
      zoneName: "Alta montaña / Puna",
      description: "Condiciones de alta altitud: alta radiación, bajas temperaturas nocturnas.",
      passiveStrategies: ["Ganancia solar directa", "Aislamiento térmico", "Masa térmica"],
    };
  }
  
  if (absLat < 15) {
    return alt < 500 
      ? { zone: "Af", zoneName: "Tropical húmedo", description: "Cálido y húmedo todo el año.", passiveStrategies: ["Ventilación cruzada", "Sombreado"] }
      : { zone: "Aw", zoneName: "Tropical de sabana", description: "Estación seca y húmeda marcada.", passiveStrategies: ["Ventilación", "Protección solar"] };
  }
  
  if (absLat >= 15 && absLat < 30) {
    return { zone: "BWh", zoneName: "Desértico cálido", description: "Árido, alta radiación solar.", passiveStrategies: ["Masa térmica", "Sombreado profundo", "Ventilación nocturna"] };
  }
  
  if (absLat >= 30 && absLat < 45) {
    return { zone: "Cfb", zoneName: "Templado", description: "Estaciones marcadas, radiación moderada.", passiveStrategies: ["Aislamiento", "Ganancia solar pasiva"] };
  }
  
  if (absLat >= 45 && absLat < 60) {
    return { zone: "Dfb", zoneName: "Continental húmedo", description: "Inviernos fríos, veranos cálidos.", passiveStrategies: ["Aislamiento pesado", "Estanqueidad", "Ganancia solar"] };
  }

  return {
    zone: "ET",
    zoneName: "Polar / Alta montaña",
    description: "Condiciones extremas.",
    passiveStrategies: ["Aislamiento extremo", "Protección contra viento"],
  };
}
