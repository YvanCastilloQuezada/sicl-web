import type { SpatialElement, SpatialRepresentation } from "../components/UPAO001SpatialViewer";
import { deriveMasses } from "../components/UPAO001MassingViewer3D";

export type ExportFormat = "ifc" | "dxf" | "glb";
export type ExportMetadata = { projectId: string; alternativeId: string; alternativeName: string; timestamp?: string; provenance?: string; units?: string; coordinateSystem?: string };

type Ring = Array<[number, number]>;
function polygonRing(element: SpatialElement): Ring {
  const c: any = element.geometry.coordinates;
  if (element.geometry.type === "polygon" && Array.isArray(c?.[0])) return c[0].filter((p: any) => Array.isArray(p) && typeof p[0] === "number" && typeof p[1] === "number");
  if (element.geometry.type === "multipolygon" && Array.isArray(c?.[0]?.[0])) return c[0][0].filter((p: any) => Array.isArray(p) && typeof p[0] === "number" && typeof p[1] === "number");
  return [];
}
function massRing(element: SpatialElement): Ring {
  const c: any = element.geometry.coordinates;
  if (element.geometry.type === "volume" && Array.isArray(c)) {
    const points = c.filter((p: any) => Array.isArray(p) && typeof p[0] === "number" && typeof p[1] === "number");
    return points.slice(0, Math.floor(points.length / 2)).map((p: number[]) => [p[0], p[1]] as [number, number]);
  }
  return polygonRing(element);
}
function fmt(n: number) { return Number(n.toFixed(6)); }
function safeName(value: string) { return value.replace(/[^A-Za-z0-9_-]+/g, "_"); }
export function exportFileName(meta: ExportMetadata, format: ExportFormat) { return `SiMS-DeI_${safeName(meta.projectId)}_${safeName(meta.alternativeId)}_${safeName(meta.alternativeName)}.${format}`; }
function rings(rep: SpatialRepresentation) { return rep.elements.map((e) => ({ element: e, ring: e.element_type === "BuildingMass" ? massRing(e) : polygonRing(e), height: Number(e.metadata?.height ?? 0), base: Number(e.metadata?.base_elevation ?? 0) })).filter((x) => x.ring.length >= 3); }

export function spatialToDxf(rep: SpatialRepresentation, meta: ExportMetadata): string {
  const lines: string[] = ["0", "SECTION", "2", "HEADER", "9", "$INSUNITS", "70", "6", "9", "$INSBASE", "10", "0", "20", "0", "0", "ENDSEC", "0", "SECTION", "2", "TABLES", "0", "TABLE", "2", "LAYER", "70", "5"];
  const layers = ["SIMS_SITE", "SIMS_BUILDING", "SIMS_ZONE", "SIMS_CIRCULATION", "SIMS_REFERENCE"];
  for (const layer of layers) lines.push("0", "LAYER", "2", layer, "70", "0", "62", layer === "SIMS_BUILDING" ? "1" : "7", "6", "CONTINUOUS");
  lines.push("0", "ENDTAB", "0", "ENDSEC", "0", "SECTION", "2", "ENTITIES");
  const layerFor = (e: SpatialElement) => e.element_type === "SiteBoundary" ? "SIMS_SITE" : e.element_type === "BuildingMass" ? "SIMS_BUILDING" : e.element_type === "SpatialZone" ? "SIMS_ZONE" : e.element_type === "CirculationElement" ? "SIMS_CIRCULATION" : "SIMS_REFERENCE";
  for (const { element, ring } of rings(rep)) {
    lines.push("0", "LWPOLYLINE", "8", layerFor(element), "90", String(ring.length), "70", "1");
    for (const [x, y] of ring) lines.push("10", String(fmt(x)), "20", String(fmt(y)));
    if (element.element_type === "BuildingMass" && Number(element.metadata?.height) > 0) lines.push("39", String(fmt(Number(element.metadata?.height))));
  }
  lines.push("0", "ENDSEC", "0", "EOF");
  return lines.join("\n") + `\n999\nSiMS-DeI ${meta.projectId} ${meta.alternativeId} | units=${meta.units ?? "m"} | crs=${meta.coordinateSystem ?? "LOCAL_ENU"}\n`;
}

function ifcEsc(value: string) { return value.replace(/'/g, "\\X2\\0027\\X0\\"); }
export function spatialToIfc(rep: SpatialRepresentation, meta: ExportMetadata): string {
  const e: string[] = []; let id = 1; const add = (name: string, args: string[]) => { e.push(`#${id}=${name}(${args.join(",")});`); return id++; };
  const owner = add("IFCOWNERHISTORY", ["$", "$"]);
  const unit = add("IFCSIUNIT", ["*", ".LENGTHUNIT.", "$", ".METRE."]); const units = add("IFCUNITASSIGNMENT", [`(#${unit})`]);
  const ctx = add("IFCGEOMETRICREPRESENTATIONCONTEXT", ["'Body'", "'Model'", "3", "1.E-05", "#0", "#0"]);
  const project = add("IFCPROJECT", [`'${ifcEsc(meta.projectId)}'`, `'${ifcEsc(meta.projectId)}'`, `'SiMS-DeI spatial/massing exchange'`, "$", "$", `#${owner}`, "$", `#${ctx}`, `#${units}`]);
  const site = add("IFCSITE", [`'${meta.projectId}-SITE'`, `'${meta.projectId}-SITE'`, "'Educational site'", "$", "$", "#0", "$", ".ELEMENT.", "(0.,0.,0.)", "$", "$", "$", "$", ".ELEMENT."]); const building = add("IFCBUILDING", [`'${meta.alternativeId}-BUILDING'`, `'${meta.alternativeName}'`, `'${ifcEsc(meta.alternativeName)} massing'`, "$", "$", "#0", "$", ".ELEMENT.", "(0.,0.,0.)", "$", "$", "$", "$", ".ELEMENT."]); const storey = add("IFCBUILDINGSTOREY", [`'${meta.alternativeId}-STOREY'`, `'${meta.alternativeName} Level 1'`, "'Spatial massing level'", "$", "$", "#0", "$", ".ELEMENT.", "(0.,0.,0.)", "0."]);
  const relProject = add("IFCRELAGGREGATES", [`'${meta.projectId}-REL'`, `#${owner}`, "'Project contains site'", "$", `#${project}`, `(#${site})`]); const relSite = add("IFCRELAGGREGATES", [`'${meta.projectId}-REL-SITE'`, `#${owner}`, "'Site contains building'", "$", `#${site}`, `(#${building})`]); const relBuilding = add("IFCRELAGGREGATES", [`'${meta.projectId}-REL-BLDG'`, `#${owner}`, "'Building contains storey'", "$", `#${building}`, `(#${storey})`]);
  const masses = deriveMasses(rep);
  for (const mass of masses) {
    const pts = mass.ring.map(([x,y]) => `(${fmt(x)},${fmt(y)})`).join(","); const poly = add("IFCPOLYLINE", [`(${mass.ring.map(([x,y]) => `#${add("IFCCARTESIANPOINT", [`(${fmt(x)},${fmt(y)},0.)`])}`).join(",")})`]); const profile = add("IFCARBITRARYCLOSEDPROFILEDEF", [".AREA.", `'${mass.element.id}'`, `#${poly}`]); const dir = add("IFCDIRECTION", ["(0.,0.,1.)"]); const pos = add("IFCAXIS2PLACEMENT3D", [`#${add("IFCCARTESIANPOINT", ["(0.,0.,0.)"] )}`, "$", "$"]); const solid = add("IFCEXTRUDEDAREASOLID", [`#${profile}`, `#${pos}`, `#${dir}`, String(fmt(mass.height))]); const shapeRep = add("IFCSHAPEREPRESENTATION", [`#${ctx}`, "'Body'", "'SweptSolid'", `(#${solid})`]); const shape = add("IFCPRODUCTDEFINITIONSHAPE", ["$", "$", `(#${shapeRep})`]); const proxy = add("IFCBUILDINGELEMENTPROXY", [`'${ifcEsc(mass.element.id)}'`, `#${owner}`, `'${ifcEsc(mass.element.id)}'`, `'${ifcEsc(meta.alternativeName)} massing object'`, "$", "$", `#${shape}`, "$", ".ELEMENT."]); add("IFCRELCONTAINEDINSPATIALSTRUCTURE", [`'${mass.element.id}-REL'`, `#${owner}`, "'Massing contained in storey'", "$", `(#${proxy})`, `#${storey}`]); void pts; void relProject; void relSite; void relBuilding;
  }
  return `ISO-10303-21;\nHEADER;\nFILE_DESCRIPTION(('SiMS-DeI spatial/massing exchange'),'2;1');\nFILE_NAME('${exportFileName(meta, "ifc")}',('${meta.timestamp ?? new Date().toISOString()}'),('SiMS-DeI'),'SiMS-DeI','SiMS-DeI','SiMS-DeI','');\nFILE_SCHEMA(('IFC4'));\nENDSEC;\nDATA;\n#0=IFCCARTESIANPOINT((0.,0.,0.));\n${e.join("\n")}\nENDSEC;\nEND-ISO-10303-21;\n`;
}

function bytes(text: string) { return new TextEncoder().encode(text); }
function pad4(data: Uint8Array) { const n = (4 - (data.length % 4)) % 4; const out = new Uint8Array(data.length+n); out.set(data); return out; }
export function spatialToGlb(rep: SpatialRepresentation, meta: ExportMetadata): Uint8Array {
  const positions: number[] = [];
  const indices: number[] = [];
  const meshes = deriveMasses(rep);
  let vertex = 0;
  for (const mass of meshes) {
    const ring = mass.ring;
    for (const z of [mass.base, mass.base + mass.height]) {
      for (const [x, y] of ring) positions.push(x, z, -y);
    }
    const n = ring.length;
    for (let i = 1; i < n - 1; i++) indices.push(vertex, vertex + i, vertex + i + 1, vertex + n, vertex + n + i + 1, vertex + n + i);
    vertex += n * 2;
  }
  const posBytes = new Uint8Array(new Float32Array(positions).buffer);
  const idxBytes = new Uint8Array(new Uint32Array(indices).buffer);
  const bin = new Uint8Array(posBytes.length + idxBytes.length);
  bin.set(posBytes); bin.set(idxBytes, posBytes.length);
  const xs = positions.filter((_, i) => i % 3 === 0);
  const ys = positions.filter((_, i) => i % 3 === 1);
  const zs = positions.filter((_, i) => i % 3 === 2);
  const gltf = {
    asset: { version: "2.0", generator: "SiMS-DeI" }, scene: 0,
    scenes: [{ nodes: meshes.map((_, i) => i) }],
    nodes: meshes.map((_, i) => ({ mesh: i, name: `${meta.alternativeId}-mass-${i + 1}` })),
    meshes: meshes.map(() => ({ primitives: [{ attributes: { POSITION: 0 }, indices: 1 }] })),
    buffers: [{ byteLength: bin.length }],
    bufferViews: [{ buffer: 0, byteOffset: 0, byteLength: posBytes.length, target: 34962 }, { buffer: 0, byteOffset: posBytes.length, byteLength: idxBytes.length, target: 34963 }],
    accessors: [{ bufferView: 0, componentType: 5126, count: positions.length / 3, type: "VEC3", min: [Math.min(...xs), Math.min(...ys), Math.min(...zs)], max: [Math.max(...xs), Math.max(...ys), Math.max(...zs)] }, { bufferView: 1, componentType: 5125, count: indices.length, type: "SCALAR" }],
    extras: { project_id: meta.projectId, alternative_id: meta.alternativeId, provenance: meta.provenance ?? "SiMS-DeI SpatialRepresentation" },
  };
  const jsonBytes = pad4(bytes(JSON.stringify(gltf)));
  const binBytes = pad4(bin);
  const total = 12 + 8 + jsonBytes.length + 8 + binBytes.length;
  const out = new Uint8Array(total); const view = new DataView(out.buffer);
  view.setUint32(0, 0x46546c67, true); view.setUint32(4, 2, true); view.setUint32(8, total, true);
  let off = 12; view.setUint32(off, jsonBytes.length, true); view.setUint32(off + 4, 0x4e4f534a, true); out.set(jsonBytes, off + 8); off += 8 + jsonBytes.length;
  view.setUint32(off, binBytes.length, true); view.setUint32(off + 4, 0x004e4942, true); out.set(binBytes, off + 8);
  return out;
}
export function downloadExport(data: string | Uint8Array, filename: string, mime: string) { const blob = typeof data === "string" ? new Blob([data], { type: mime }) : new Blob([data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer], { type: mime }); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url); }

export type ExportTarget = "IFC" | "DXF" | "GLB";
export type ExportFamily = "CAD" | "BIM" | "GIS" | "3D_MODEL" | "MEDIA";
export type ExportCapabilityStatus = "AVAILABLE" | "REQUIRES_DATA" | "NOT_AVAILABLE" | "NOT_APPLICABLE";
export type InteroperabilityRole = "PRIMARY" | "CO_PRIMARY" | "SUPPORTING" | "CONTEXTUAL" | "NOT_APPLICABLE";
export type GeoreferencingRole = "OPTIONAL" | "CONTEXTUAL" | "IMPORTANT" | "ESSENTIAL";
export type ExportCapability = {
  family: ExportFamily;
  target?: ExportTarget;
  format: string;
  status: ExportCapabilityStatus;
  role: InteroperabilityRole;
  reason: string;
  requiredData: string[];
  semanticLevel: "MASSING" | "SPATIAL" | "VISUAL" | "MEDIA" | "NONE";
  gisInputRole: InteroperabilityRole;
  gisContextRole: InteroperabilityRole;
  gisExportRole: InteroperabilityRole;
  georeferencingRole: GeoreferencingRole;
};

const SCOPES = ["objeto", "espacio", "sistema", "edificacion", "parcela_sitio", "zona_barrio_sector", "distrito_ciudad", "provincia_metropoli", "region", "macro_region", "pais"] as const;
type Scope = typeof SCOPES[number];
const scopeRank = (scope: string) => Math.max(0, SCOPES.indexOf(scope as Scope));

/** V1.1 policy: capability state and professional role are independent dimensions. */
export function resolveExportCapabilities(
  representation: SpatialRepresentation,
  availableData: string[] = [],
  targetWorkflow = "architectural"
): ExportCapability[] {
  const scope = representation.spatial_scope as string;
  const rank = scopeRank(scope);
  const hasGeometry = representation.elements.some((e) => Array.isArray(e.geometry?.coordinates));
  const hasMass = representation.elements.some((e) => e.element_type === "BuildingMass");
  const has = (key: string) => availableData.includes(key);
  const geometryState = (implemented: boolean, relevant = true): ExportCapabilityStatus => !relevant ? "NOT_APPLICABLE" : !hasGeometry && !has("geometry") ? "REQUIRES_DATA" : implemented ? "AVAILABLE" : "NOT_AVAILABLE";
  const bimRole: InteroperabilityRole = rank <= 3 ? "PRIMARY" : rank <= 6 ? "SUPPORTING" : "CONTEXTUAL";
  const cadRole: InteroperabilityRole = rank <= 3 ? "SUPPORTING" : rank <= 6 ? "CO_PRIMARY" : "SUPPORTING";
  const gisRole: InteroperabilityRole = rank <= 3 ? "CONTEXTUAL" : rank <= 6 ? "CO_PRIMARY" : "PRIMARY";
  const visualRole: InteroperabilityRole = rank <= 3 ? "PRIMARY" : rank <= 6 ? "SUPPORTING" : "CONTEXTUAL";
  const geoRole: GeoreferencingRole = rank <= 2 ? "OPTIONAL" : rank <= 5 ? "CONTEXTUAL" : rank <= 6 ? "IMPORTANT" : "ESSENTIAL";
  const gisState: ExportCapabilityStatus = "NOT_AVAILABLE";
  const mediaState = geometryState(true);
  const media: ExportCapability = { family: "MEDIA", format: "PNG/WebM", status: mediaState, role: "SUPPORTING", reason: "Presentation artifact; not editable spatial data.", requiredData: ["visual workspace"], semanticLevel: "MEDIA", gisInputRole: "NOT_APPLICABLE", gisContextRole: "NOT_APPLICABLE", gisExportRole: "NOT_APPLICABLE", georeferencingRole: geoRole };
  const gis: ExportCapability = { family: "GIS", format: "UNSELECTED_OPEN_FORMAT", status: gisState, role: gisRole, reason: "GIS is professionally relevant at this scope, but GIS export is not implemented in V1.1.", requiredData: ["georeferenced geometry", "CRS", "provenance"], semanticLevel: "SPATIAL", gisInputRole: rank <= 3 ? "CONTEXTUAL" : "PRIMARY", gisContextRole: gisRole, gisExportRole: gisRole, georeferencingRole: geoRole };
  const bimRelevant = SCOPES.includes(scope as Scope);
  const bim: ExportCapability = { family: "BIM", target: "IFC", format: "IFC4", status: geometryState(scope === "edificacion" && hasMass, bimRelevant), role: bimRole, reason: scope === "edificacion" ? "Massing-only IFC exchange; never construction BIM." : "BIM may be professionally useful here, but the current IFC adapter is limited to architectural massing.", requiredData: ["geometry", "units", "placement"], semanticLevel: scope === "edificacion" ? "MASSING" : "SPATIAL", gisInputRole: "NOT_APPLICABLE", gisContextRole: "NOT_APPLICABLE", gisExportRole: "NOT_APPLICABLE", georeferencingRole: geoRole };
  const cad: ExportCapability = { family: "CAD", target: "DXF", format: "DXF", status: geometryState(scope === "edificacion" || scope === "parcela_sitio", true), role: cadRole, reason: "CAD may support linework, footprints or survey/reference exchange; technical availability does not determine primary role.", requiredData: ["geometry", "units", "orientation"], semanticLevel: "SPATIAL", gisInputRole: "NOT_APPLICABLE", gisContextRole: "NOT_APPLICABLE", gisExportRole: "NOT_APPLICABLE", georeferencingRole: geoRole };
  const model3d: ExportCapability = { family: "3D_MODEL", target: "GLB", format: "GLB", status: geometryState(scope === "edificacion", SCOPES.includes(scope as Scope)), role: visualRole, reason: "3D visualization can coexist with GIS and does not imply BIM semantics.", requiredData: ["geometry", "units"], semanticLevel: "VISUAL", gisInputRole: "NOT_APPLICABLE", gisContextRole: "NOT_APPLICABLE", gisExportRole: "NOT_APPLICABLE", georeferencingRole: geoRole };
  void targetWorkflow;
  return [cad, bim, gis, model3d, media];
}
