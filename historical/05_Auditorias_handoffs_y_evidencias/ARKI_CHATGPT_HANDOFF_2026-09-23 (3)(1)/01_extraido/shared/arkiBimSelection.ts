import type { Muro } from "./arkiConstructionOntology";

export type BimElementKind =
  | "wall" | "door" | "window" | "column" | "beam"
  | "slab" | "foundation" | "stair" | "floor"
  | "roof" | "partition" | "space";

export type BimSelectionItem = {
  elementId: string;
  kind: BimElementKind;
  category: string;
  family?: string;
  type?: string;
  discipline: string;
  level: number;
  phase?: string;
  properties: Record<string, string | number | boolean>;
  materials?: Array<{ name: string; thicknessM?: number; function?: string }>;
  metrics?: Record<string, number>;
  cost?: number;
  relatedIds: string[];
};

export type BimSelection = {
  mode: "empty" | "single" | "multiple";
  items: BimSelectionItem[];
  timestamp: string;
};

export function emptySelection(): BimSelection {
  return { mode: "empty", items: [], timestamp: "snapshot:empty" };
}

export function singleSelection(item: BimSelectionItem): BimSelection {
  return { mode: "single", items: [item], timestamp: `snapshot:${item.elementId}` };
}

export function multipleSelection(items: BimSelectionItem[]): BimSelection {
  const ordered = [...items].sort((a, b) => a.elementId.localeCompare(b.elementId));
  return ordered.length === 0 ? emptySelection() : { mode: "multiple", items: ordered, timestamp: `snapshot:${ordered.map((item) => item.elementId).join(",")}` };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function valueRecord(value: Record<string, unknown>): Record<string, string | number | boolean> {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => ["string", "number", "boolean"].includes(typeof item))) as Record<string, string | number | boolean>;
}

function numberRecord(value: Record<string, string | number | boolean>): Record<string, number> {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => typeof item === "number")) as Record<string, number>;
}

export function selectionFromElement(element: unknown, kind: BimElementKind): BimSelectionItem {
  if (!isRecord(element)) throw new Error("BIM element must be an object");
  const elementId = typeof element.id === "string" ? element.id : "";
  if (!elementId) throw new Error("BIM element requires a deterministic id");
  const level = typeof element.level === "number" ? element.level : typeof element.nivel_piso === "number" ? element.nivel_piso : 0;
  const discipline = typeof element.specialty === "string" ? element.specialty : typeof element.especialidad_principal === "string" ? element.especialidad_principal : "arquitectura";
  const properties = valueRecord(element);
  if (kind === "wall") {
    const wall = element as unknown as Muro;
    return { elementId, kind, category: "Muros", family: "Muro constructivo", type: wall.tipo, discipline, level, phase: wall.estado, properties: { nombre: wall.nombre, funcion: wall.funcion, tipo: wall.tipo, longitudM: wall.longitud_m(), alturaM: wall.altura_m, espesorM: wall.espesor_total_m() }, materials: wall.capas.map((layer) => ({ name: layer.nombre, thicknessM: layer.espesor_m, function: layer.funcion })), metrics: { ...wall.metrado, areaBrutaM2: wall.area_bruta_m2(), areaNetaM2: wall.area_neta_m2(), volumeM3: wall.volumen_m3(), weightKg: wall.peso_total_kg() }, cost: wall.partidas.reduce((sum, item) => sum + item.parcial, 0), relatedIds: [...wall.aberturas.map((opening) => opening.id), ...wall.interferencias.map((item) => item.id)] };
  }
  const category = kind === "column" || kind === "beam" || kind === "slab" || kind === "foundation" ? "Estructura" : kind === "door" || kind === "window" ? "Aberturas" : "Elementos constructivos";
  const geometry = isRecord(element.geometry) ? valueRecord(element.geometry) : {};
  const quantity = isRecord(element.quantity) ? numberRecord(valueRecord(element.quantity)) : {};
  const materials = Array.isArray(element.materials) ? element.materials.flatMap((item) => isRecord(item) && typeof item.material === "string" ? [{ name: item.material, thicknessM: typeof item.thicknessM === "number" ? item.thicknessM : undefined, function: typeof item.finish === "string" ? item.finish : undefined }] : []) : undefined;
  const costs = Array.isArray(element.costs) ? element.costs : [];
  return { elementId, kind, category, family: typeof element.name === "string" ? element.name : undefined, type: typeof element.function === "string" ? element.function : undefined, discipline, level, phase: typeof element.status === "string" ? element.status : undefined, properties: { name: typeof element.name === "string" ? element.name : elementId, ...geometry }, materials, metrics: { ...quantity }, cost: costs.reduce((sum, item) => isRecord(item) && typeof item.total === "number" ? sum + item.total : sum, 0), relatedIds: Array.isArray(element.tracesTo) ? element.tracesTo.filter((item): item is string => typeof item === "string") : [] };
}
