export type ArquiIntent = "PROJECT_STATE_QUERY" | "KNOWLEDGE_QUERY" | "ACTION_QUERY" | "NAVIGATION_QUERY" | "UNKNOWN_QUERY";
export type ArquiDialogueBasis = "PROJECT_STATE" | "PROJECT_EVIDENCE" | "HUMAN_REVIEW" | "WORK_CONTEXT" | "AVAILABLE_CAPABILITY" | "DESIGN_KNOWLEDGE" | "UNKNOWN";
export type ArquiDialogueContext = { photos: number; pendingReview: number; confirmed: number; totalEvidence: number; locationRegistered: boolean; alternatives: number; hasAnalysis: boolean; workContext: string };
export type ArquiDialogueResponse = { intent: ArquiIntent; answerKey: string; answerParams?: Record<string, unknown>; basis: ArquiDialogueBasis; basisKey: string; action?: { target: string; labelKey: string; params?: Record<string, unknown> } };

export function routeArquiQuestion(question: string, context: ArquiDialogueContext): ArquiDialogueResponse {
  const q = question.trim().toLowerCase();
  if (!q) return { intent: "UNKNOWN_QUERY", answerKey: "arqui.dialogue_empty", basis: "UNKNOWN", basisKey: "arqui.basis_unknown" };
  if (/conocimiento|por qué.*(acceso|peatonal|registrar)|why.*(access|document)/i.test(q)) return { intent: "KNOWLEDGE_QUERY", answerKey: "arqui.dialogue_knowledge_deferred", basis: "DESIGN_KNOWLEDGE", basisKey: "arqui.basis_knowledge" };
  if (/muéstrame|mostrar|quiero ver|ir a|abrir|revisar/.test(q)) {
    if (/evidencia|observaci|review|pendiente/.test(q)) return { intent: "NAVIGATION_QUERY", answerKey: "arqui.dialogue_navigate_review", basis: "AVAILABLE_CAPABILITY", basisKey: "arqui.basis_capability", action: { target: "evidence", labelKey: "arqui.review_action", params: { count: context.pendingReview } } };
    if (/alternativa|compar/.test(q)) return { intent: "NAVIGATION_QUERY", answerKey: "arqui.dialogue_navigate_alternatives", basis: "AVAILABLE_CAPABILITY", basisKey: "arqui.basis_capability", action: { target: "alternatives", labelKey: "arqui.compare_action", params: { count: context.alternatives } } };
    if (/contexto|ubicaci|location/.test(q)) return { intent: "NAVIGATION_QUERY", answerKey: "arqui.dialogue_navigate_context", basis: "AVAILABLE_CAPABILITY", basisKey: "arqui.basis_capability", action: { target: "context", labelKey: "arqui.location_action" } };
  }
  if (/qué puedo hacer|qué debería|siguiente paso|what can i do|what should i do/.test(q)) return { intent: "ACTION_QUERY", answerKey: context.pendingReview > 0 ? "arqui.dialogue_action_review" : "arqui.dialogue_action_context", answerParams: { count: context.pendingReview }, basis: context.pendingReview > 0 ? "HUMAN_REVIEW" : "AVAILABLE_CAPABILITY", basisKey: context.pendingReview > 0 ? "arqui.basis_review" : "arqui.basis_capability", action: context.pendingReview > 0 ? { target: "evidence", labelKey: "arqui.review_action", params: { count: context.pendingReview } } : { target: "context", labelKey: "arqui.location_action" } };
  if (/qué tenemos pendiente|qué falta|pendiente|pending|what remains/.test(q)) return { intent: "PROJECT_STATE_QUERY", answerKey: "arqui.dialogue_pending", answerParams: { count: context.pendingReview }, basis: "PROJECT_EVIDENCE", basisKey: "arqui.basis_project" };
  if (/cuántas fotos|fotos|photos/.test(q)) return { intent: "PROJECT_STATE_QUERY", answerKey: "arqui.dialogue_photos", answerParams: { count: context.photos }, basis: "PROJECT_EVIDENCE", basisKey: "arqui.basis_project" };
  if (/registro espacial|ubicaci|spatialregistration|registered/.test(q)) return { intent: "PROJECT_STATE_QUERY", answerKey: context.locationRegistered ? "arqui.dialogue_registration_yes" : "arqui.dialogue_registration_no", basis: "PROJECT_STATE", basisKey: "arqui.basis_project" };
  if (/alternativas|alternatives/.test(q)) return { intent: "PROJECT_STATE_QUERY", answerKey: "arqui.dialogue_alternatives", answerParams: { count: context.alternatives }, basis: "PROJECT_STATE", basisKey: "arqui.basis_project" };
  if (/contexto de trabajo|en qué contexto|work context/.test(q)) return { intent: "PROJECT_STATE_QUERY", answerKey: "arqui.dialogue_context", answerParams: { context: context.workContext }, basis: "WORK_CONTEXT", basisKey: "arqui.basis_context" };
  if (/qué sabemos|what do we know/.test(q)) return { intent: "PROJECT_STATE_QUERY", answerKey: "arqui.dialogue_known", answerParams: { photos: context.photos, confirmed: context.confirmed }, basis: "PROJECT_STATE", basisKey: "arqui.basis_project" };
  return { intent: "UNKNOWN_QUERY", answerKey: "arqui.dialogue_unknown", basis: "UNKNOWN", basisKey: "arqui.basis_unknown" };
}
