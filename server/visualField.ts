import { invokeLLM } from "./_core/llm";

export const VISUAL_OBSERVATION_CLASSES = [
  "BUILDING_VISIBLE", "APPARENT_VISIBLE_LEVEL_COUNT", "ROAD_VISIBLE", "SIDEWALK_VISIBLE",
  "VEHICULAR_ACCESS_APPARENT", "PEDESTRIAN_ACCESS_APPARENT", "VEGETATION_VISIBLE", "TREE_VISIBLE",
  "UTILITY_POLE_VISIBLE", "OVERHEAD_UTILITY_VISIBLE", "WALL_OR_FENCE_VISIBLE", "ADJACENT_BUILDING_VISIBLE",
  "OPEN_SPACE_VISIBLE", "WATER_VISIBLE", "SLOPE_VISUALLY_APPARENT", "OBSTRUCTION_VISIBLE",
  "CONSTRUCTION_ACTIVITY_VISIBLE", "DOCUMENT_TEXT_VISIBLE", "URBAN_PARAMETER_TEXT_VISIBLE",
  "PLAN_SPACE_LABEL_VISIBLE", "PLAN_DIMENSION_ANNOTATION_VISIBLE", "PLAN_ORIENTATION_VISIBLE",
] as const;

type VisualQualifier = "EXACT" | "APPROXIMATE" | "RANGE" | "UNKNOWN";
export type VisualProposal = {
  observation_class: typeof VISUAL_OBSERVATION_CLASSES[number];
  description: string;
  qualifier: VisualQualifier;
  value?: unknown;
  uncertainty?: string;
  provider_explanation?: string;
  epistemic_status: "AI_PROPOSED";
  human_review_required: true;
};

const allowed = new Set<string>(VISUAL_OBSERVATION_CLASSES);
const schema = {
  type: "object",
  properties: {
    observations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          observation_class: { type: "string", enum: VISUAL_OBSERVATION_CLASSES },
          description: { type: "string" },
          qualifier: { type: "string", enum: ["EXACT", "APPROXIMATE", "RANGE", "UNKNOWN"] },
          value: {},
          uncertainty: { type: "string" },
          provider_explanation: { type: "string" },
        },
        required: ["observation_class", "description", "qualifier", "uncertainty", "provider_explanation"],
        additionalProperties: false,
      },
    },
  },
  required: ["observations"],
  additionalProperties: false,
};

function contentText(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) return content.map((part) => typeof part === "string" ? part : JSON.stringify(part)).join("\n");
  return JSON.stringify(content ?? "{}");
}

function safeProposal(raw: unknown): VisualProposal | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const observationClass = String(item.observation_class ?? "");
  if (!allowed.has(observationClass)) return null;
  const qualifier = ["EXACT", "APPROXIMATE", "RANGE", "UNKNOWN"].includes(String(item.qualifier)) ? String(item.qualifier) as VisualQualifier : "UNKNOWN";
  const description = String(item.description ?? "").trim();
  if (!description) return null;
  return { observation_class: observationClass as VisualProposal["observation_class"], description, qualifier, ...(item.value !== undefined ? { value: item.value } : {}), uncertainty: String(item.uncertainty ?? "UNKNOWN"), provider_explanation: String(item.provider_explanation ?? ""), epistemic_status: "AI_PROPOSED", human_review_required: true };
}

export async function analyzeVisualPhoto(imageDataUrl: string, context: { spatialScope: string; mediaId?: string }) {
  const prompt = [
    "Analyze this architectural/site photograph, scanned urban document, or architectural plan for visible content only.",
    "Return only the bounded observation vocabulary in the JSON schema.",
    "For documents and plans, transcribe only legible text, labels, dimensions, orientation marks, or urban-parameter wording as provisional observations in value or description.",
    "Use cautious language: visible, possible, apparent, approximately, or not legible.",
    "Do not infer legal compliance, ownership, boundaries, setbacks, permits, structural safety, survey measurements, or design requirements.",
    "Do not treat a document image as an official source; every observation remains AI_PROPOSED and requires human review.",
    "Do not invent exact dimensions. Use UNKNOWN when occluded, low resolution, or insufficient.",
    `Declared spatial scope: ${context.spatialScope}.`,
  ].join(" ");
  const response = await invokeLLM({
    model: process.env.VISUAL_ANALYSIS_MODEL || "gemini-3-flash-preview",
    messages: [
      { role: "system", content: "You are a conservative architectural field-observation and document-reading assistant. Output structured provisional observations, never facts or decisions." },
      { role: "user", content: [{ type: "text", text: prompt }, { type: "image_url", image_url: { url: imageDataUrl, detail: "auto" } }] },
    ],
    response_format: { type: "json_schema", json_schema: { name: "visual_field_observations", strict: true, schema } },
    max_tokens: 3000,
  });
  const rawContent = response.choices?.[0]?.message?.content;
  let parsed: unknown;
  try { parsed = JSON.parse(contentText(rawContent)); } catch { throw new Error("Visual provider returned malformed structured output"); }
  const rawObservations = parsed && typeof parsed === "object" && Array.isArray((parsed as Record<string, unknown>).observations) ? (parsed as Record<string, unknown>).observations as unknown[] : [];
  const observations = rawObservations.map(safeProposal).filter((item): item is VisualProposal => Boolean(item)).slice(0, 20);
  return { observations, provider: "manus-built-in-llm", model: response.model || process.env.VISUAL_ANALYSIS_MODEL || "gemini-3-flash-preview", analyzed_at: new Date().toISOString(), media_id: context.mediaId ?? null };
}
