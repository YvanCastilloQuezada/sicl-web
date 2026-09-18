export type VisualFieldProposal = { evidence_id: string; observation_class: string; description: string; qualifier: string; status: string };

type VisualFieldResult = { proposals: VisualFieldProposal[]; projectId: string; mediaId: string | null; decisionCreated: boolean; humanReviewRequired: boolean };

async function callVisualField<T>(operation: "analyze" | "review", input: Record<string, unknown>): Promise<T> {
  const response = await fetch(`/api/trpc/visualField.${operation}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ json: input }) });
  const body = await response.json() as { result?: { data?: { json?: T } }; error?: { json?: { message?: string } } };
  if (!response.ok) throw new Error(body.error?.json?.message || "Visual field request failed");
  return body.result?.data?.json as T;
}

export function analyzeVisualField(input: { projectId: string; spatialScope: string; mediaId: string }) {
  return callVisualField<VisualFieldResult>("analyze", input);
}

export function reviewVisualField(input: { projectId: string; evidenceId: string; action: "CONFIRM" | "CORRECT" | "REJECT"; correctedValue?: unknown; correctedDescription?: string; reason: string }) {
  return callVisualField<{ evidenceId: string; action: string; review: unknown; decisionCreated: boolean }>("review", input);
}
