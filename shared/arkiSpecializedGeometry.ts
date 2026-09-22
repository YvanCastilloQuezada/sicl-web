export const ARKI_SPECIALIZED_GEOMETRY_VERSION = "ARKI-SPECIALIZED-GEOMETRY-1.0" as const;

export type SpecializedGeometry = { generator: string; typologyId: string; zones: Array<{ id: string; type: string; x: number; y: number; width: number; depth: number; level: number }>; circulation: Array<{ from: string; to: string; kind: string }>; metrics: Record<string, number>; status: "CONCEPTUAL"; humanReviewRequired: true };

const GENERATORS: Record<string, string> = {
  HEALTH_HOSPITAL_GENERAL: "hospital", HEALTH_HOSPITAL_ESPECIALIZADO: "hospital", TRANS_AEROPUERTO: "airport", TRANS_TERMINAL: "terminal", SPORT_ESTADIO: "stadium", TRANS_PUERTO: "port", TRANS_ESTACION_METRO: "station", IND_PLANTA_MANUFACTURA: "industry", IND_ALMACEN: "industry", IND_CENTRO_LOGISTICO: "logistics", LAND_HUMEDAL_ARTIFICIAL: "wetland", LAND_PARQUE_METROPOLITANO: "park", LAND_RECUPERACION_RIBERENA: "riverfront", URB_CIUDAD: "city", URB_SECTOR: "city", URB_BARRIO: "neighborhood", TRANS_PUERTO_LACUSTRE: "lake_terminal", INF_PLANTA_TRATAMIENTO_AGUA: "water_plant",
};

export const SPECIALIZED_TYPOLOGY_IDS = Object.keys(GENERATORS) as string[];

export function generateSpecializedGeometry(typologyId: string, parameters: Record<string, unknown>): SpecializedGeometry | null {
  const generator = GENERATORS[typologyId];
  if (!generator) return null;
  const area = Math.max(100, Number(parameters.area_m2 ?? parameters.area_total_m2 ?? 1000));
  const width = Math.max(10, Math.sqrt(area));
  const depth = Math.max(10, area / width);
  const zoneTypes = generator === "hospital" ? ["emergency", "outpatient", "inpatient", "surgery", "diagnostics", "services"] : generator === "airport" ? ["terminal", "security", "platform", "cargo", "parking"] : generator === "stadium" ? ["field", "stands", "concourse", "services", "roof"] : generator === "wetland" ? ["inlet", "treatment", "habitat", "outlet"] : ["primary", "support", "circulation", "services"];
  const zones = zoneTypes.map((type, index) => ({ id: `${typologyId}-${type}`, type, x: Number(((index % 3) * width / 3).toFixed(2)), y: Number((Math.floor(index / 3) * depth / 2).toFixed(2)), width: Number((width / 3 - 2).toFixed(2)), depth: Number((depth / 2 - 2).toFixed(2)), level: generator === "hospital" && index === 2 ? 2 : 1 }));
  return { generator, typologyId, zones, circulation: zones.slice(1).map((zone, index) => ({ from: zones[index].id, to: zone.id, kind: generator === "hospital" ? "CLEAN_DIRTY_SEPARATION_REQUIRED" : "PRIMARY_FLOW" })), metrics: { area_m2: Number(area.toFixed(2)), footprint_m2: Number((width * depth).toFixed(2)), zone_count: zones.length, conceptual_capacity: Math.max(1, Math.round(Number(parameters.capacity ?? parameters.aforo ?? 100))) }, status: "CONCEPTUAL", humanReviewRequired: true };
}

export function specializedGeometryCatalog() { return { version: ARKI_SPECIALIZED_GEOMETRY_VERSION, generatorCount: SPECIALIZED_TYPOLOGY_IDS.length, generators: [...SPECIALIZED_TYPOLOGY_IDS], execution: "DETERMINISTIC_CONCEPTUAL_ONLY", professionalReviewRequired: true }; }
