import { IfcAPI, type FlatMesh } from "web-ifc";
import wasmUrl from "web-ifc/web-ifc.wasm?url";

export type IfcRenderableElement = { expressID: number; name: string; sourceRepresentation: "BREP" | "CSG" | "MESH" | "UNKNOWN"; positions: Float32Array; indices: Uint32Array };
export type IfcGeometryLoadResult = { schema: string; elements: IfcRenderableElement[]; sourceKinds: string[]; warnings: string[] };

function entityName(line: unknown): string {
  if (!line || typeof line !== "object") return "IFC element";
  const candidate = line as { Name?: { value?: unknown }; ObjectType?: { value?: unknown } };
  const value = candidate.Name?.value ?? candidate.ObjectType?.value;
  return typeof value === "string" && value.trim() ? value : "IFC element";
}
function sourceKind(line: unknown): IfcRenderableElement["sourceRepresentation"] {
  const text = JSON.stringify(line ?? {}).toUpperCase();
  if (text.includes("FACETEDBREP") || text.includes("BREP")) return "BREP";
  if (text.includes("BOOLEANRESULT") || text.includes("CSG")) return "CSG";
  if (text.includes("TRIANGULATED") || text.includes("TESSELLATED")) return "MESH";
  return "UNKNOWN";
}
function vectorArray<T>(vector: { size(): number; get(index: number): T }): T[] { const items: T[] = []; for (let index = 0; index < vector.size(); index += 1) items.push(vector.get(index)); return items; }

export async function loadIfcGeometry(bytes: Uint8Array): Promise<IfcGeometryLoadResult> {
  const api = new IfcAPI();
  api.SetWasmPath(wasmUrl, true);
  await api.Init(undefined, true);
  const modelID = api.OpenModel(bytes, { COORDINATE_TO_ORIGIN: false, ALLOW_INCOMPATIBLE_SCHEMA_ALIASES: false, MEMORY_LIMIT: 512 * 1024 * 1024 });
  if (modelID < 0) throw new Error("IFC_MODEL_OPEN_FAILED");
  const elements: IfcRenderableElement[] = []; const kinds = new Set<string>(); const warnings: string[] = [];
  try {
    const meshes = vectorArray<FlatMesh>(api.LoadAllGeometry(modelID, true));
    for (const mesh of meshes) {
      const geometries = vectorArray(mesh.geometries);
      for (const placed of geometries) {
        const geometry = api.GetGeometry(modelID, placed.geometryExpressID);
        const rawVertices = api.GetVertexArray(geometry.GetVertexData(), geometry.GetVertexDataSize());
        const rawIndices = api.GetIndexArray(geometry.GetIndexData(), geometry.GetIndexDataSize());
        const stride = rawVertices.length % 6 === 0 ? 6 : 3;
        const positions = new Float32Array((rawVertices.length / stride) * 3);
        const transform = placed.flatTransformation;
        for (let index = 0; index < rawVertices.length / stride; index += 1) {
          const x = rawVertices[index * stride]; const y = rawVertices[index * stride + 1]; const z = rawVertices[index * stride + 2];
          positions[index * 3] = transform.length === 16 ? transform[0] * x + transform[4] * y + transform[8] * z + transform[12] : x;
          positions[index * 3 + 1] = transform.length === 16 ? transform[1] * x + transform[5] * y + transform[9] * z + transform[13] : y;
          positions[index * 3 + 2] = transform.length === 16 ? transform[2] * x + transform[6] * y + transform[10] * z + transform[14] : z;
        }
        const line = api.GetLine(modelID, mesh.expressID, true);
        const kind = sourceKind(line); kinds.add(kind);
        elements.push({ expressID: mesh.expressID, name: entityName(line), sourceRepresentation: kind, positions, indices: new Uint32Array(rawIndices) });
        geometry.delete();
      }
      mesh.delete();
    }
    if (!elements.length) warnings.push("IFC model opened but no renderable geometry was returned.");
    if (elements.some((element) => element.sourceRepresentation === "UNKNOWN")) warnings.push("Some IFC representations were triangulated by the adapter but their original representation type could not be identified from the loaded product record.");
    return { schema: api.GetModelSchema(modelID), elements, sourceKinds: Array.from(kinds), warnings };
  } finally { api.CloseModel(modelID); }
}
