import type { GeneratedBuilding } from "./arkiDynamicFamilies";

export type BuildingVersion = { id: string; label: string; version: string; createdAt?: string; building: GeneratedBuilding };
export type ComparisonMode = "GRID" | "TIMELINE" | "DIFF";

export function compareDynamicBuildings(versions: BuildingVersion[], mode: ComparisonMode = "GRID") {
  if (versions.length < 2) throw new Error("COMPARISON_REQUIRES_TWO_VERSIONS");
  if (versions.length > 4) throw new Error("COMPARISON_MAX_FOUR_VERSIONS");
  const baseline = versions[0];
  const metricKeys = Array.from(new Set(versions.flatMap((item) => Object.keys(item.building.metrics))));
  const metrics = metricKeys.map((key) => ({ key, values: versions.map((item) => Number(item.building.metrics[key as keyof GeneratedBuilding["metrics"]] ?? 0)), deltaFromBaseline: versions.slice(1).map((item) => Number(item.building.metrics[key as keyof GeneratedBuilding["metrics"]] ?? 0) - Number(baseline.building.metrics[key as keyof GeneratedBuilding["metrics"]] ?? 0)) }));
  const parameterKeys = Array.from(new Set(versions.flatMap((item) => Object.keys(item.building.parameters))));
  const parameterDiff = parameterKeys.map((key) => ({ key, values: versions.map((item) => item.building.parameters[key]), changed: new Set(versions.map((item) => JSON.stringify(item.building.parameters[key]))).size > 1 }));
  return { schema: "ARKI-FAMILY-COMPARISON-1.0", mode, versionCount: versions.length, versionIds: versions.map((item) => item.id), metrics, parameterDiff, timeline: versions.map((item) => ({ id: item.id, label: item.label, version: item.version, createdAt: item.createdAt ?? null })), humanReviewRequired: true as const, persistence: "PROPOSAL_ONLY" as const };
}

function esc(value: unknown) { return String(value ?? "").replace(/[&<>\"]+/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char] ?? char)); }
function stepString(value: unknown) { return `'${String(value ?? "").replace(/'/g, "''")}'`; }

export function exportDynamicBuilding(building: GeneratedBuilding, format: "JSON" | "IFC4" | "GEOJSON" | "SVG" | "CSV" | "HTML") {
  const common = { schema: "ARKI-GENERATED-BUILDING-1.0", familyId: building.familyId, variantId: building.variantId, generatedBuilding: building, status: building.status, humanReviewRequired: building.humanReviewRequired };
  if (format === "JSON") return { fileName: `${building.familyId}-${building.variantId}.json`, mimeType: "application/json", content: JSON.stringify(common, null, 2) };
  if (format === "GEOJSON") return { fileName: `${building.familyId}-${building.variantId}.geojson`, mimeType: "application/geo+json", content: JSON.stringify({ type: "FeatureCollection", features: [{ type: "Feature", properties: { familyId: building.familyId, variantId: building.variantId, status: building.status }, geometry: { type: "Polygon", coordinates: [[[0, 0], [building.geometry2d.widthM, 0], [building.geometry2d.widthM, building.geometry2d.depthM], [0, building.geometry2d.depthM], [0, 0]]] } }] }, null, 2) };
  if (format === "SVG") return { fileName: `${building.familyId}-${building.variantId}.svg`, mimeType: "image/svg+xml", content: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${building.geometry2d.widthM} ${building.geometry2d.depthM}"><title>${esc(building.name)}</title><rect width="${building.geometry2d.widthM}" height="${building.geometry2d.depthM}" fill="#f0a35b" fill-opacity=".2" stroke="#f0a35b"/><text x="1" y="4" font-size="2">${esc(building.name)}</text></svg>` };
  if (format === "CSV") return { fileName: `${building.familyId}-${building.variantId}.csv`, mimeType: "text/csv", content: ["metric,value", ...Object.entries(building.metrics).map(([key, value]) => `${key},${JSON.stringify(value)}`)].join("\n") };
  if (format === "HTML") return { fileName: `${building.familyId}-${building.variantId}.html`, mimeType: "text/html", content: `<!doctype html><meta charset="utf-8"><title>${esc(building.name)}</title><h1>${esc(building.name)}</h1><pre>${esc(JSON.stringify(common, null, 2))}</pre>` };
  const entityLines = [
    "ISO-10303-21;",
    "HEADER;FILE_DESCRIPTION(('ARKI GENERATED CANDIDATE'),'2;1');FILE_NAME('ARKI-GENERATED','',('ARKI'),('ARKI'),'ARKI','ARKI','');FILE_SCHEMA(('IFC4'));ENDSEC;",
    "DATA;",
    `#1=IFCPROJECT('${building.id}',${stepString(building.name)},'ARKI Generated Candidate');`,
    `#2=IFCSITE('${building.context.city ?? "UNKNOWN"}',${stepString(building.context.city ?? "UNKNOWN")},'${building.context.country}');`,
    `#3=IFCBUILDING('${building.familyId}',${stepString(building.name)},'${building.status}');`,
    `#4=IFCPROPERTYSET('${building.familyId}:PSET',${stepString(building.name)},'ARKI_FamilyId',${stepString(building.familyId)});`,
    `#5=IFCPROPERTYSET('${building.variantId}:PSET',${stepString(building.name)},'ARKI_VariantId',${stepString(building.variantId)});`,
    "ENDSEC;END-ISO-10303-21;",
  ];
  return { fileName: `${building.familyId}-${building.variantId}.ifc`, mimeType: "application/x-step", content: entityLines.join("\n"), metadata: { schema: "ARKI-IFC4-ENRICHED-1.0", propertySets: ["ARKI_FamilyId", "ARKI_VariantId", "ARKI_Status", "ARKI_HumanReviewRequired"], nativeRvt: false, conceptualGeometryOnly: true } };
}

export const dynamicComparisonContract = { schema: "ARKI-FAMILY-COMPARISON-1.0", maxVersions: 4, modes: ["GRID", "TIMELINE", "DIFF"] as const, exportFormats: ["JSON", "IFC4", "GEOJSON", "SVG", "CSV", "HTML"] as const, humanReviewRequired: true, persistence: "PROPOSAL_ONLY" } as const;
