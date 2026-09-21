import { createHash } from "node:crypto";

export type Ifc4ElementKind = "PROJECT" | "SITE" | "BUILDING" | "STOREY" | "SPACE" | "WALL" | "SLAB" | "COLUMN" | "BEAM" | "DOOR" | "WINDOW" | "EQUIPMENT" | "FURNISHING" | "PROXY" | "UNKNOWN";
export type IfcBox = { min: [number, number, number]; max: [number, number, number] };
export type Ifc4Element = { expressId: number; entity: string; kind: Ifc4ElementKind; globalId: string | null; name: string | null; box: IfcBox | null; properties: Record<string, string | number | boolean>; geometryStatus: "VERIFIED" | "NOT_DECODED" };

const ENTITY_KIND: Record<string, Ifc4ElementKind> = { IFCPROJECT: "PROJECT", IFCSITE: "SITE", IFCBUILDING: "BUILDING", IFCBUILDINGSTOREY: "STOREY", IFCSPACE: "SPACE", IFCWALL: "WALL", IFCWALLSTANDARDCASE: "WALL", IFCSLAB: "SLAB", IFCCOLUMN: "COLUMN", IFCBEAM: "BEAM", IFCDOOR: "DOOR", IFCWINDOW: "WINDOW", IFCEQUIPMENTELEMENT: "EQUIPMENT", IFCFURNISHINGELEMENT: "FURNISHING", IFCBUILDINGELEMENTPROXY: "PROXY" };
const PRODUCT_ENTITIES = new Set(Object.keys(ENTITY_KIND));

function decodeString(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed === "$" || trimmed === "*") return null;
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) return trimmed.slice(1, -1).replace(/''/g, "'");
  return trimmed;
}
function splitArgs(raw: string): string[] {
  const values: string[] = []; let current = ""; let depth = 0; let quoted = false;
  for (let i = 0; i < raw.length; i += 1) { const char = raw[i]; if (char === "'" && raw[i - 1] !== "\\") quoted = !quoted; if (!quoted && char === "(") depth += 1; if (!quoted && char === ")") depth -= 1; if (!quoted && depth === 0 && char === ",") { values.push(current.trim()); current = ""; } else current += char; }
  if (current.trim()) values.push(current.trim()); return values;
}
function numberValue(value: string): number | null { const parsed = Number(value.trim()); return Number.isFinite(parsed) ? parsed : null; }
function stableGeometryFingerprint(value: unknown): string { return createHash("sha256").update(JSON.stringify(value)).digest("hex"); }
function entityRecords(source: string) { const records: Array<{ expressId: number; entity: string; args: string[] }> = []; const regex = /#(\d+)\s*=\s*([A-Z0-9_]+)\s*\(([^;]*)\)\s*;/g; let match: RegExpExecArray | null; while ((match = regex.exec(source))) records.push({ expressId: Number(match[1]), entity: match[2], args: splitArgs(match[3]) }); return records; }

export function parseIfc4(source: string | Buffer) {
  const text = Buffer.isBuffer(source) ? source.toString("utf8") : source;
  const checksum = `sha256:${createHash("sha256").update(text).digest("hex")}`;
  const schemaMatch = text.match(/FILE_SCHEMA\s*\(\s*\(('([^']+)'|"([^"]+)")\s*\)\s*\)/i);
  const schema = schemaMatch?.[2] ?? schemaMatch?.[3] ?? null;
  if (!schema || !schema.toUpperCase().startsWith("IFC4")) return { status: "REJECTED" as const, reason: "IFC4_SCHEMA_REQUIRED", schema, checksum, elements: [] as Ifc4Element[] };
  const records = entityRecords(text); const elements: Ifc4Element[] = [];
  for (const record of records) {
    if (!PRODUCT_ENTITIES.has(record.entity)) continue;
    const globalId = decodeString(record.args[0]); const name = decodeString(record.args[2]);
    elements.push({ expressId: record.expressId, entity: record.entity, kind: ENTITY_KIND[record.entity], globalId, name, box: null, properties: {}, geometryStatus: "NOT_DECODED" });
  }
  const units = records.filter((record) => record.entity === "IFCSIUNIT").map((record) => record.args.map(decodeString).filter(Boolean).join(" "));
  return { status: "PARSED" as const, schema, checksum, recordCount: records.length, elements, units, warnings: ["STEP entities and semantic products parsed; BRep/CSG/mesh geometry requires a geometry adapter."], geometryDecoded: false as const, humanReviewRequired: true as const };
}

export function attachDecodedGeometry(parsed: ReturnType<typeof parseIfc4>, geometry: Array<{ expressId: number; box: IfcBox; properties?: Record<string, string | number | boolean> }>) {
  if (parsed.status !== "PARSED") return parsed;
  const byId = new Map(geometry.map((item) => [item.expressId, item]));
  const elements = parsed.elements.map((element) => { const decoded = byId.get(element.expressId); return decoded ? { ...element, box: decoded.box, properties: decoded.properties ?? {}, geometryStatus: "VERIFIED" as const } : element; });
  return { ...parsed, elements, geometryDecoded: geometry.length > 0, warnings: geometry.length > 0 ? [] : parsed.warnings };
}

export function validateIfcRoundTrip(input: { before: Array<{ id: string; kind: string; box: IfcBox }>; after: Array<{ id: string; kind: string; box: IfcBox }>; tolerance?: number }) {
  const tolerance = input.tolerance ?? 0.001; if (!Number.isFinite(tolerance) || tolerance <= 0) throw new Error("INVALID_ROUND_TRIP_TOLERANCE");
  const afterById = new Map(input.after.map((item) => [item.id, item])); const missing: string[] = []; const mismatches: Array<{ id: string; reason: string; before: IfcBox; after?: IfcBox }> = [];
  const close = (a: number, b: number) => Math.abs(a - b) <= tolerance;
  for (const item of input.before) { const candidate = afterById.get(item.id); if (!candidate) { missing.push(item.id); continue; } if (item.kind !== candidate.kind || item.box.min.some((value, index) => !close(value, candidate.box.min[index])) || item.box.max.some((value, index) => !close(value, candidate.box.max[index]))) mismatches.push({ id: item.id, reason: item.kind !== candidate.kind ? "SEMANTIC_KIND_CHANGED" : "GEOMETRY_OUTSIDE_TOLERANCE", before: item.box, after: candidate.box }); }
  const unexpected = input.after.filter((item) => !input.before.some((before) => before.id === item.id)).map((item) => item.id);
  return { schema: "ARKI-IFC4-ROUND-TRIP-1.0", tolerance, beforeCount: input.before.length, afterCount: input.after.length, missing, unexpected, mismatches, status: missing.length || unexpected.length || mismatches.length ? "FAIL" as const : "PASS" as const, geometryFingerprintBefore: stableGeometryFingerprint(input.before.map((item) => [item.id, item.kind, item.box])), geometryFingerprintAfter: stableGeometryFingerprint(input.after.map((item) => [item.id, item.kind, item.box])), humanReviewRequired: true as const, limitations: ["Validation covers the normalized element set supplied to the validator; it does not prove every IFC representation, material, topology, parametric constraint or native Revit feature survived." ] };
}

export function ifc4Contract() { return { schema: "ARKI-IFC4-1.0", formats: ["IFC4", "IFC4X3"], flow: "UPLOAD → CHECKSUM → SAFE STEP PARSE → NORMALIZE → GEOMETRY ADAPTER → ROUND-TRIP VALIDATION → HUMAN REVIEW", executesFileCode: false, nativeRvtClaim: false, geometryStatusPolicy: "No decoded geometry means no geometric PASS", humanReviewRequired: true as const }; }
