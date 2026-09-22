import { analyzeNativeGeometry, ARKI_NATIVE_TEMPLATES, getNativeTemplate, type NativeGeometry, type NativeTemplateId, type NativeAnalysis } from "./arkiNativeGenerator";

export const ARKI_GENERATIVE_ASSISTANT_VERSION = "ARKI-GENERATIVE-ASSISTANT-1.0" as const;
export type AssistantProvider = "DETERMINISTIC_FIRST_PARTY" | "REMOTE_LLM_PENDING";
export type ProposalStatus = "AI_PROPOSED" | "RECALCULATION_REQUIRED" | "HUMAN_REVIEW_REQUIRED" | "ACCEPTED" | "REJECTED";
export type AssistantAction = "proponer_parametros" | "aplicar_plantilla" | "listar_plantillas" | "explicar_parametro" | "simular_cambio";

export type ParameterProposal = {
  id: string;
  action: Exclude<AssistantAction, "listar_plantillas" | "explicar_parametro" | "simular_cambio">;
  params: Partial<NativeGeometry>;
  templateId: NativeTemplateId | null;
  reason: string;
  status: ProposalStatus;
  risk: "LOW" | "MEDIUM" | "HIGH";
  provider: AssistantProvider;
  sourceText: string;
  humanReviewRequired: true;
  createdAt: string;
};

export type ProposalSimulation = {
  before: NativeAnalysis;
  after: NativeAnalysis;
  changedFields: string[];
  requiresRecalculation: boolean;
};

export const ARKI_ASSISTANT_TOOLS = [
  { name: "proponer_parametros", description: "Propone parámetros sin aplicarlos.", mutatesProjectState: false },
  { name: "aplicar_plantilla", description: "Propone cargar una plantilla; la aprobación es separada.", mutatesProjectState: false },
  { name: "listar_plantillas", description: "Lista plantillas de primera parte.", mutatesProjectState: false },
  { name: "explicar_parametro", description: "Explica un parámetro y su nivel de riesgo.", mutatesProjectState: false },
  { name: "simular_cambio", description: "Calcula antes/después sin modificar el proyecto activo.", mutatesProjectState: false },
] as const;

function slug(text: string) { return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
function id() { return `PROP-${Date.now().toString(36).toUpperCase()}`; }

export function proposeFromNaturalLanguage(sourceText: string, current: NativeGeometry): ParameterProposal {
  const normalized = slug(sourceText);
  let params: Partial<NativeGeometry> = {};
  let templateId: NativeTemplateId | null = null;
  let reason = "No se identificó una plantilla exacta; se propone revisar los parámetros explícitos.";
  let risk: ParameterProposal["risk"] = "MEDIUM";

  if (normalized.includes("estadio") && (normalized.includes("80000") || normalized.includes("80 000"))) {
    templateId = "TROPICAL_STADIUM";
    params = { ...getNativeTemplate(templateId)!.geometry };
    reason = "Se detectó un encargo de estadio de gran aforo; se propone una hipótesis tropical conceptual, no un diseño aprobado.";
    risk = "HIGH";
  } else if (normalized.includes("hotel") && normalized.includes("patio")) {
    templateId = "COURTYARD_HOTEL";
    params = { ...getNativeTemplate(templateId)!.geometry };
    reason = "Se detectó hotel con patio; se propone la plantilla de patio bioclimático para exploración inicial.";
    risk = "MEDIUM";
  } else if (normalized.includes("vivienda") || normalized.includes("casa")) {
    templateId = "COMPACT_HOUSE";
    params = { ...getNativeTemplate(templateId)!.geometry };
    reason = "Se detectó un encargo de vivienda; se propone una masa compacta inicial.";
    risk = "LOW";
  } else if (normalized.includes("campus") || normalized.includes("paisaj")) {
    templateId = "LANDSCAPE_CAMPUS";
    params = { ...getNativeTemplate(templateId)!.geometry };
    reason = "Se detectó una relación edificio-paisaje; se propone un campus con vacío interior.";
    risk = "MEDIUM";
  } else {
    params = { width: current.width, depth: current.depth, height: current.height, floors: current.floors, courtyardRatio: current.courtyardRatio, kind: current.kind };
  }

  return { id: id(), action: templateId ? "aplicar_plantilla" : "proponer_parametros", params, templateId, reason, status: "AI_PROPOSED", risk, provider: "DETERMINISTIC_FIRST_PARTY", sourceText, humanReviewRequired: true, createdAt: new Date().toISOString() };
}

export function simulateProposal(current: NativeGeometry, proposal: ParameterProposal): ProposalSimulation {
  const afterGeometry = { ...current, ...proposal.params } as NativeGeometry;
  const before = analyzeNativeGeometry(current);
  const after = analyzeNativeGeometry(afterGeometry, proposal.templateId);
  const changedFields = Object.keys(proposal.params).filter((key) => current[key as keyof NativeGeometry] !== proposal.params[key as keyof NativeGeometry]);
  return { before, after, changedFields, requiresRecalculation: changedFields.length > 0 };
}

export function approveProposal(proposal: ParameterProposal): ParameterProposal {
  if (proposal.status !== "AI_PROPOSED" && proposal.status !== "HUMAN_REVIEW_REQUIRED" && proposal.status !== "RECALCULATION_REQUIRED") return proposal;
  return { ...proposal, status: "ACCEPTED" };
}

export function rejectProposal(proposal: ParameterProposal): ParameterProposal {
  return { ...proposal, status: "REJECTED" };
}

export function assistantCatalog() {
  return { version: ARKI_GENERATIVE_ASSISTANT_VERSION, provider: "DETERMINISTIC_FIRST_PARTY" as const, remoteProviders: "PENDING_EXPLICIT_CONFIGURATION", tools: ARKI_ASSISTANT_TOOLS, proposalIsNotApproval: true, templates: ARKI_NATIVE_TEMPLATES.length };
}
