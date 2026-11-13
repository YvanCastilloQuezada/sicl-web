/**
 * Cliente HTTP para consultar el conocimiento de diseño de sicl-core (RFC-026).
 *
 * Antes de generar PARTIs, ARKI consulta:
 * - RFC-004: 15 principios de diseño (Ching, Zumthor, Alexander, Neufert).
 * - RFC-026: DesignKnowledgeAgent (patrones contextualizados).
 *
 * Este cliente es de solo lectura. No muta sicl-core.
 */

const SICL_CORE_URL = process.env.SICL_CORE_URL ?? "http://127.0.0.1:8000";

export type DesignPrinciple = {
  principle_id: string;
  name: string;
  category: string;
  description: string;
  applicable_scales: string[];
  source: string;
};

export type DesignKnowledgeQuery = {
  scale?: string;
  context?: string;
  objectives?: string[];
  constraints?: string[];
};

export type DesignKnowledgeItem = {
  item_id: string;
  source_id: string;
  content: string;
  scales: string[];
  authority: "NORMATIVE" | "HEURISTIC" | "REFERENCE";
};

export type DesignKnowledgeResponse = {
  items: DesignKnowledgeItem[];
  conflicts: string[];
  human_review_required: boolean;
};

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${SICL_CORE_URL}${path}`, init);
  if (!res.ok) {
    throw new Error(`sicl-core ${path} → ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}

export async function fetchDesignPrinciples(): Promise<DesignPrinciple[]> {
  const data = await fetchJson<{ principles?: DesignPrinciple[] }>(
    "/v1/design/principles"
  );
  return data.principles ?? [];
}

export async function queryDesignKnowledge(
  query: DesignKnowledgeQuery
): Promise<DesignKnowledgeResponse> {
  return fetchJson<DesignKnowledgeResponse>("/v1/design-knowledge/query", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(query),
  });
}

/**
 * Consulta el conocimiento aplicable a un proyecto antes de generar PARTIs.
 *
 * Devuelve los principios y patrones que el projectBrain debe considerar
 * al proponer los flowStrategies (linear-separation, central-hub, nested-rings).
 */
export async function knowledgeForProject(input: {
  typology: string;
  scale: string;
  objectives: string[];
  constraints: string[];
}): Promise<{
  principles: DesignPrinciple[];
  items: DesignKnowledgeItem[];
  humanReviewRequired: boolean;
}> {
  const [principles, response] = await Promise.all([
    fetchDesignPrinciples().catch(() => []),
    queryDesignKnowledge({
      scale: input.scale,
      context: input.typology,
      objectives: input.objectives,
      constraints: input.constraints,
    }).catch(() => ({ items: [], conflicts: [], human_review_required: true })),
  ]);
  return {
    principles,
    items: response.items,
    humanReviewRequired: response.human_review_required,
  };
}
