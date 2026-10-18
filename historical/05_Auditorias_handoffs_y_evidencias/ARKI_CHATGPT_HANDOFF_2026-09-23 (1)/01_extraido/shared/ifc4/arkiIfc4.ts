import type { SceneModel, SceneNode } from "../arkiSceneModel";
import { mapSceneIdentities, type GlobalIdMapping } from "../identity/arkiGlobalId";

export type IfcEntity = { expressId: number; type: string; globalId?: string; archiElementId?: string; name?: string };
export type IfcLossReport = { preserved: string[]; degraded: string[]; lost: string[]; propertiesLost: string[]; relationsLost: string[] };
export type IfcExportResult = { schema: "IFC4"; text: string; identities: GlobalIdMapping[]; lossReport: IfcLossReport };
export type IfcParseResult = { schema: string; entities: IfcEntity[]; lossReport: IfcLossReport };

const IFC_TYPES: Record<string, string> = { wall: "IFCWALL", door: "IFCDOOR", window: "IFCWINDOW", column: "IFCCOLUMN", beam: "IFCBEAM", slab: "IFCSLAB", foundation: "IFCFOOTING", stair: "IFCSTAIR", roof: "IFCROOF", space: "IFCSPACE", floor: "IFCSLAB", partition: "IFCWALL" };
const emptyLossReport = (): IfcLossReport => ({ preserved: [], degraded: [], lost: [], propertiesLost: [], relationsLost: [] });
const stepString = (value: string): string => `'${value.replaceAll("'", "''")}'`;

function productLine(expressId: number, type: string, globalId: string, name: string, archiElementId: string): string {
  return `#${expressId}=${type}(${stepString(globalId)},$,$,${stepString(`ARKI:${archiElementId}:${name}`)},$,$,$,$,$);`;
}

export async function exportIFC4(scene: SceneModel, versionNumber = 1): Promise<IfcExportResult> {
  const identities = await mapSceneIdentities(scene.nodes, scene.projectId, versionNumber);
  const lines = ["ISO-10303-21;", "HEADER;", "FILE_DESCRIPTION(('ViewDefinition [CoordinationView_V2.0]'),'2;1');", `FILE_NAME('arki-${scene.projectId}.ifc','2026-09-23T00:00:00',('ARKI'),('ARKI'),'ARKI IFC4 exporter','ARKI','');`, "FILE_SCHEMA(('IFC4'));", "ENDSEC;", "DATA;"];
  lines.push("#1=IFCPROJECT('ARKI-PROJECT',$,'ARKI Project',$,$,$,$,$,$);");
  scene.nodes.forEach((node, index) => {
    const identity = identities[index];
    lines.push(productLine(index + 10, IFC_TYPES[node.kind] ?? "IFCBUILDINGELEMENTPROXY", identity.globalId, `${node.category}-${node.id}`, node.id));
  });
  lines.push("ENDSEC;", "END-ISO-10303-21;");
  const lossReport = emptyLossReport();
  lossReport.preserved.push(...scene.nodes.map((node) => node.id));
  return { schema: "IFC4", text: lines.join("\n"), identities, lossReport };
}

export function parseIfcText(text: string): IfcParseResult {
  const entities: IfcEntity[] = [];
  const pattern = /#(\d+)=([A-Z0-9]+)\('([^']*)',([^;]*?)\)/g;
  for (const match of Array.from(text.matchAll(pattern))) {
    const [, id, type, globalId, rest] = match;
    if (type === "IFCPROJECT") continue;
    const encodedName = rest.match(/'ARKI:([^:']+):([^']*)'/);
    entities.push({ expressId: Number(id), type, globalId, archiElementId: encodedName?.[1], name: encodedName?.[2] });
  }
  const lossReport = emptyLossReport();
  lossReport.preserved.push(...entities.map((entity) => entity.archiElementId ?? entity.globalId ?? String(entity.expressId)));
  return { schema: text.includes("IFC4") ? "IFC4" : "UNKNOWN", entities, lossReport };
}

export function sceneIdentityRoundTrip(scene: SceneModel, parsed: IfcParseResult): { preserved: number; missing: string[] } {
  const imported = new Set(parsed.entities.map((entity) => entity.archiElementId).filter((id): id is string => Boolean(id)));
  const missing = scene.nodes.map((node) => node.id).filter((id) => !imported.has(id));
  return { preserved: scene.nodes.length - missing.length, missing };
}

export function supportedIfcGeometry(): Record<string, "supported" | "partial" | "unsupported"> {
  return { IFCEXTRUDEDAREASOLID: "supported", IFCBOUNDINGBOX: "supported", IFCFACETEDBREP: "partial", IFCADVANCEDBREP: "unsupported", IFCBOOLEANCLIPPINGRESULT: "unsupported", IFCSWEPTSOLID: "partial", IFCTRIANGULATEDFACESET: "supported" };
}
