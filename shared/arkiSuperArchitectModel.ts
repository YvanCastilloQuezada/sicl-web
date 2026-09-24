export type SuperViewMode = "PLAN" | "SECTION" | "MODEL_3D";
export type SuperFamily = "HOSPITAL" | "RESIDENTIAL" | "OFFICE" | "HOTEL" | "SCHOOL" | "STADIUM";

export type SuperArchitectInputs = {
  family: SuperFamily;
  siteWidthM: number;
  siteDepthM: number;
  setbacksM: number;
  floors: number;
  floorHeightM: number;
  occupancy: number;
  courtyardRatio: number;
  coreCount: number;
  gridSpanM: number;
  greenRatio: number;
  windowRatio: number;
  parkingRatio: number;
};

export type SuperArchitectModel = {
  inputs: SuperArchitectInputs;
  footprintM2: number;
  buildableFootprintM2: number;
  builtAreaM2: number;
  totalHeightM: number;
  courtyardM2: number;
  greenAreaM2: number;
  parkingStalls: number;
  structuralBays: { x: number; y: number };
  columnCount: number;
  estimatedWaterM3Day: number;
  estimatedPowerKW: number;
  egressWidthM: number;
  program: Array<{ label: string; areaM2: number; ratio: number }>;
  alerts: Array<{ code: string; severity: "INFO" | "WARNING" | "BLOCKER"; message: string }>;
  unknowns: string[];
  propagation: string[];
};

export const SUPER_FAMILY_LABELS: Record<SuperFamily, string> = {
  HOSPITAL: "Hospital",
  RESIDENTIAL: "Vivienda multifamiliar",
  OFFICE: "Oficinas",
  HOTEL: "Hotel",
  SCHOOL: "Centro educativo",
  STADIUM: "Estadio",
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const n = (value: number, fallback: number) => Number.isFinite(value) ? value : fallback;

export function createSuperArchitectModel(raw: SuperArchitectInputs): SuperArchitectModel {
  const inputs: SuperArchitectInputs = {
    ...raw,
    siteWidthM: clamp(n(raw.siteWidthM, 100), 10, 1000),
    siteDepthM: clamp(n(raw.siteDepthM, 100), 10, 1000),
    setbacksM: clamp(n(raw.setbacksM, 5), 0, 100),
    floors: Math.round(clamp(n(raw.floors, 4), 1, 80)),
    floorHeightM: clamp(n(raw.floorHeightM, 3.4), 2.4, 12),
    occupancy: Math.round(clamp(n(raw.occupancy, 400), 1, 200000)),
    courtyardRatio: clamp(n(raw.courtyardRatio, 0.15), 0, 0.65),
    coreCount: Math.round(clamp(n(raw.coreCount, 2), 1, 30)),
    gridSpanM: clamp(n(raw.gridSpanM, 7.2), 3, 18),
    greenRatio: clamp(n(raw.greenRatio, 0.25), 0, 0.9),
    windowRatio: clamp(n(raw.windowRatio, 0.35), 0, 0.85),
    parkingRatio: clamp(n(raw.parkingRatio, 0.35), 0, 2),
  };
  const footprintM2 = inputs.siteWidthM * inputs.siteDepthM;
  const buildableWidth = Math.max(0, inputs.siteWidthM - inputs.setbacksM * 2);
  const buildableDepth = Math.max(0, inputs.siteDepthM - inputs.setbacksM * 2);
  const buildableFootprintM2 = buildableWidth * buildableDepth;
  const courtyardM2 = buildableFootprintM2 * inputs.courtyardRatio;
  const effectiveFloorArea = Math.max(0, buildableFootprintM2 - courtyardM2);
  const builtAreaM2 = effectiveFloorArea * inputs.floors;
  const greenAreaM2 = footprintM2 * inputs.greenRatio;
  const parkingStalls = Math.round((builtAreaM2 / 80) * inputs.parkingRatio);
  const structuralBays = { x: Math.max(1, Math.ceil(buildableWidth / inputs.gridSpanM)), y: Math.max(1, Math.ceil(buildableDepth / inputs.gridSpanM)) };
  const columnCount = (structuralBays.x + 1) * (structuralBays.y + 1) * inputs.floors;
  const occupancyFactor = inputs.family === "STADIUM" ? 0.04 : inputs.family === "HOSPITAL" ? 0.7 : 0.5;
  const estimatedWaterM3Day = Number((inputs.occupancy * occupancyFactor * 0.12).toFixed(1));
  const estimatedPowerKW = Math.round(builtAreaM2 * (inputs.family === "HOSPITAL" ? 0.09 : 0.055));
  const egressWidthM = Number(Math.max(1.2, inputs.occupancy / 160).toFixed(2));
  const primaryRatio = inputs.family === "HOSPITAL" ? 0.55 : inputs.family === "STADIUM" ? 0.7 : 0.62;
  const program = [
    { label: "Área principal", areaM2: Number((builtAreaM2 * primaryRatio).toFixed(1)), ratio: primaryRatio },
    { label: "Circulación y evacuación", areaM2: Number((builtAreaM2 * 0.16).toFixed(1)), ratio: 0.16 },
    { label: "Servicios y soporte", areaM2: Number((builtAreaM2 * 0.12).toFixed(1)), ratio: 0.12 },
    { label: "Núcleos y cuartos técnicos", areaM2: Number((builtAreaM2 * 0.08).toFixed(1)), ratio: 0.08 },
    { label: "Reserva / flexibilidad", areaM2: Number((builtAreaM2 * (1 - primaryRatio - 0.36)).toFixed(1)), ratio: 1 - primaryRatio - 0.36 },
  ];
  const alerts: SuperArchitectModel["alerts"] = [
    { code: "CONCEPTUAL", severity: "INFO", message: "Geometría y métricas conceptuales; requieren validación profesional." },
  ];
  const unknowns: string[] = [];
  const propagation = [
    `Área de terreno: ${footprintM2.toFixed(0)} m² → huella edificable, áreas verdes y estacionamientos.`,
    `Niveles: ${inputs.floors} × ${inputs.floorHeightM.toFixed(2)} m → altura total ${ (inputs.floors * inputs.floorHeightM).toFixed(2) } m y superficie construida.`,
    `Aforo: ${inputs.occupancy} → ancho conceptual de evacuación ${egressWidthM} m, agua ${estimatedWaterM3Day} m³/día y potencia ${estimatedPowerKW} kW.`,
    `Retiro: ${inputs.setbacksM} m → rectángulo edificable ${buildableWidth.toFixed(1)} × ${buildableDepth.toFixed(1)} m.`,
    `Retícula: ${inputs.gridSpanM.toFixed(1)} m → ${structuralBays.x} × ${structuralBays.y} crujías y ${columnCount} posiciones conceptuales.`,
  ];
  if (buildableWidth <= 0 || buildableDepth <= 0) alerts.push({ code: "NO_BUILDABLE_AREA", severity: "BLOCKER", message: "Los retiros consumen toda el área edificable." });
  if (inputs.occupancy > 1000 && egressWidthM < 2) alerts.push({ code: "EGRESS_REVIEW", severity: "WARNING", message: "El ancho conceptual de evacuación requiere revisión especializada." });
  if (inputs.floors > 20) alerts.push({ code: "HIGH_RISE", severity: "WARNING", message: "Altura y sistema resistente requieren análisis estructural especializado." });
  if (inputs.family === "STADIUM" && inputs.occupancy < 10000) alerts.push({ code: "STADIUM_CAPACITY", severity: "WARNING", message: "Aforo bajo para una tipología estadio; revisar programa." });
  return { inputs, footprintM2, buildableFootprintM2, builtAreaM2, totalHeightM: Number((inputs.floors * inputs.floorHeightM).toFixed(2)), courtyardM2, greenAreaM2, parkingStalls, structuralBays, columnCount, estimatedWaterM3Day, estimatedPowerKW, egressWidthM, program, alerts, unknowns, propagation };
}

export const defaultSuperArchitectInputs: SuperArchitectInputs = { family: "HOSPITAL", siteWidthM: 140, siteDepthM: 140, setbacksM: 8, floors: 5, floorHeightM: 4.2, occupancy: 400, courtyardRatio: 0.18, coreCount: 4, gridSpanM: 7.2, greenRatio: 0.32, windowRatio: 0.35, parkingRatio: 0.4 };
