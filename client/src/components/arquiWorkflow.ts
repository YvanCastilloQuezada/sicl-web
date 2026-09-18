import type { Capability, CapabilityContext } from "./arquiCapabilities";
import { deriveArquiCapabilities } from "./arquiCapabilities";

export type ArquiGoal = "UNDERSTAND_SITE" | "CAPTURE_FIELD_INFORMATION" | "REVIEW_VISUAL_EVIDENCE" | "EXPLORE_DESIGN_ALTERNATIVES" | "COMPARE_ALTERNATIVES" | "PREPARE_REGISTERED_AR_VIEW" | "UNKNOWN_GOAL";
export type WorkflowStep = { capabilityId: Capability["id"]; readiness: Capability["status"]; purposeKey: string; action?: Capability["action"] };
export type ArquiWorkflow = { goal: ArquiGoal; currentStep?: WorkflowStep; steps: WorkflowStep[]; unknown: boolean };

const cap = (caps: Capability[], id: Capability["id"]) => caps.find((item) => item.id === id);
const step = (item: Capability, purposeKey: string): WorkflowStep => ({ capabilityId: item.id, readiness: item.status, purposeKey, action: item.action });

export function routeArquiGoal(text: string): ArquiGoal {
  const q = text.trim().toLowerCase();
  if (/\bar\b|terreno.*diseño|diseño.*terreno|registrad/.test(q)) return "PREPARE_REGISTERED_AR_VIEW";
  if (/comparar|alternativas/.test(q)) return /compar/.test(q) ? "COMPARE_ALTERNATIVES" : "EXPLORE_DESIGN_ALTERNATIVES";
  if (/revisar|detectó la ia|detect[oó].*ia|propuesta visual/.test(q)) return "REVIEW_VISUAL_EVIDENCE";
  if (/captur|foto|información del campo/.test(q)) return "CAPTURE_FIELD_INFORMATION";
  if (/terreno|sitio|emplazamiento/.test(q)) return "UNDERSTAND_SITE";
  return "UNKNOWN_GOAL";
}

export function deriveArquiWorkflow(goal: ArquiGoal, context: CapabilityContext): ArquiWorkflow {
  const caps = deriveArquiCapabilities(context);
  const site = cap(caps, "FIELD_CAPTURE");
  const visual = cap(caps, "VISUAL_FIELD_INTELLIGENCE");
  const comparison = cap(caps, "COMPARISON");
  const registration = cap(caps, "REGISTERED_AR_VIEW");
  const steps = goal === "UNDERSTAND_SITE" ? [step(site!, "arqui.workflow_understand_site"), step(visual!, "arqui.workflow_visual_context")] : goal === "CAPTURE_FIELD_INFORMATION" ? [step(site!, "arqui.workflow_capture_field")] : goal === "REVIEW_VISUAL_EVIDENCE" ? [step(visual!, "arqui.workflow_review_visual")] : goal === "EXPLORE_DESIGN_ALTERNATIVES" ? [step(comparison!, "arqui.workflow_explore_alternatives")] : goal === "COMPARE_ALTERNATIVES" ? [step(comparison!, "arqui.workflow_compare_alternatives")] : goal === "PREPARE_REGISTERED_AR_VIEW" ? [step(registration!, "arqui.workflow_registered_ar")] : [];
  return { goal, currentStep: steps.find((item) => item.readiness !== "READY") ?? steps[0], steps, unknown: goal === "UNKNOWN_GOAL" };
}
