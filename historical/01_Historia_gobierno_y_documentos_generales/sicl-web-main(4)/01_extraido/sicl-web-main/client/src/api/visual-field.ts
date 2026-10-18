export type VisualFieldProposal = {
  evidence_id: string;
  observation_class: string;
  description: string;
  qualifier: "EXACT" | "APPROXIMATE" | "RANGE" | "UNKNOWN";
  value?: unknown;
  uncertainty?: string;
  provider_explanation?: string;
  status: "AI_PROPOSED" | string;
  model?: string;
  epistemic_status?: "AI_PROPOSED";
  human_review_required?: true;
};

export type VisualFieldResult = {
  proposals: VisualFieldProposal[];
  projectId: string;
  mediaId: string | null;
  decisionCreated: false;
  humanReviewRequired: true;
};

export async function analyzeVisualField(input: { projectId: string; spatialScope: string; imageDataUrl: string }): Promise<VisualFieldResult> {
  const response = await fetch("/api/trpc/visualField.analyze", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ json: input }) });
  const body = await response.json() as { result?: { data?: { json?: VisualFieldResult } }; error?: { json?: { message?: string } } };
  if (!response.ok) throw new Error(body.error?.json?.message || "No se pudo analizar la referencia visual");
  const result = body.result?.data?.json;
  if (!result) throw new Error("La visión artificial no devolvió observaciones estructuradas");
  return result;
}

export async function ingestVisualSource(input: { projectId: string; fileName: string; mimeType: string; dataUrl: string; sourceType?: string; ocrKind?: string }): Promise<{ sourceId: string; version: number; humanReviewRequired: true }> {
  const response = await fetch("/api/trpc/visualField.ingest", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ json: { ...input, sourceType: input.sourceType ?? "PHOTO_SOURCE", ocrKind: input.ocrKind ?? "PHOTO_OF_DOCUMENT", spatialScope: "PROJECT_SITE", language: "eng", runOcr: true, analyzeVisual: true } }) });
  const body = await response.json() as { result?: { data?: { json?: { sourceId: string; version: number; humanReviewRequired: true } } }; error?: { json?: { message?: string } } };
  if (!response.ok) throw new Error(body.error?.json?.message || "No se pudo guardar la fuente multimedia");
  const result = body.result?.data?.json;
  if (!result) throw new Error("La ingestión no devolvió un identificador de fuente");
  return result;
}
