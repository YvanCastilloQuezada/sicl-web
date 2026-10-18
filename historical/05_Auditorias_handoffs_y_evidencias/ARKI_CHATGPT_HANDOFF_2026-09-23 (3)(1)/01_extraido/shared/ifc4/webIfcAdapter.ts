import { parseIfcText, type IfcParseResult } from "./arkiIfc4";

export type WebIfcParseOptions = { wasmPath?: string };

export async function parseIFC4WithWebIfc(data: Uint8Array, options: WebIfcParseOptions = {}): Promise<IfcParseResult> {
  const module = await import("web-ifc");
  const api = new module.IfcAPI();
  await api.Init(options.wasmPath ? (path) => `${options.wasmPath}/${path}` : undefined, true);
  const modelId = api.OpenModel(data);
  if (modelId < 0) throw new Error("web-ifc no pudo abrir el modelo IFC4");
  try {
    const schema = api.GetModelSchema(modelId);
    const entities = Array.from(api.GetAllLines(modelId) as Iterable<number>).map((expressId: number) => {
      const line = api.GetLine(modelId, expressId, false, false) as { type?: string; GlobalId?: { value?: string } };
      return { expressId, type: line.type ?? "UNKNOWN", globalId: line.GlobalId?.value };
    });
    return { schema, entities, lossReport: { preserved: entities.map((entity: { globalId?: string; expressId: number }) => entity.globalId ?? String(entity.expressId)), degraded: [], lost: [], propertiesLost: [], relationsLost: [] } };
  } finally {
    api.CloseModel(modelId);
  }
}

export function parseIFC4TextFallback(text: string): IfcParseResult { return parseIfcText(text); }
