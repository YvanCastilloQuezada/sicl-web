import type { CoreProject } from "@/api/sicl-client";

export type OperationKind = "PRESENTATION" | "CHANGE_HEIGHT" | "APPLY_PREPARED" | "DELEGATE" | "STOP" | "INVALID" | "UNSUPPORTED" | "UNKNOWN";
export type PreparedAction = {
  projectId: string;
  alternativeId: string;
  alternative: Record<string, unknown>;
  operationType: "CHANGE_HEIGHT";
  parameters: { floors: number };
  source: "USER_PROVIDED";
  authority: "EXPLICIT_COMMAND" | "PREPARED_APPLY" | "DELEGATED_INPUT";
  request: string;
  fingerprint: string;
};

export type ParsedCommand = { kind: OperationKind; alternativeId?: string; floors?: number; request: string; reason?: string };

function alternativesOf(project: CoreProject | undefined): Record<string, Record<string, unknown>> {
  const raw = project?.alternatives;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  return Object.fromEntries(Object.entries(raw).map(([id, value]) => [id, value && typeof value === "object" ? value as Record<string, unknown> : {}]));
}

export function listAlternativeIds(project: CoreProject | undefined): string[] { return Object.keys(alternativesOf(project)); }

export function parseArquiOperation(command: string): ParsedCommand {
  const request = command.trim();
  const q = request.toLowerCase();
  const explicitAlternative = q.match(/(?:alternative|alternativa)\s*([a-z0-9-]+)/i)?.[1]?.toUpperCase();
  if (!q) return { kind: "UNKNOWN", request };
  if (/^(stop|cancel|detener|para|no cambies nada)/.test(q)) return { kind: "STOP", request };
  if (/^(do it|apply that|apply|hazlo|aplícalo|aplicar)$/i.test(q)) return { kind: "APPLY_PREPARED", request };
  if (/^(enter|ingresa|introduce|use|usa)\s+.*(floor|piso|nivel)/i.test(q) || /^\d+(?:[.,]\d+)?\s*(floor|floors|piso|pisos|nivel|niveles)/i.test(q)) {
    const match = q.match(/(\d+(?:[.,]\d+)?)/);
    return match ? { kind: "DELEGATE", alternativeId: explicitAlternative, floors: Number(match[1].replace(",", ".")), request } : { kind: "INVALID", alternativeId: explicitAlternative, request, reason: "A numeric floor count is required." };
  }
  const alternative = q.match(/(?:alternative|alternativa)\s*([a-z0-9-]+)/i)?.[1]?.toUpperCase();
  if (/^(show|open|view|display|muestra|mostrar|abre|abrir|ver)\b/.test(q) && alternative) return { kind: "PRESENTATION", alternativeId: alternative, request };
  if (/(?:height|altura)\s*(?:to|a|=)\s*(banana|[0-9.,]+)\s*(m|metros?)?/i.test(q)) {
    const value = q.match(/(?:height|altura)\s*(?:to|a|=)\s*(banana|[0-9.,]+)/i)?.[1];
    if (!value || value === "banana") return { kind: "INVALID", alternativeId: alternative, request, reason: "Height must be a supported numeric value." };
    return { kind: "UNSUPPORTED", alternativeId: alternative, request, reason: "The canonical operation currently accepts floor count, not direct height." };
  }
  const floorMatch = q.match(/(?:floor|floors|piso|pisos|nivel|niveles)\s*(?:to|a|=)\s*(banana|[0-9.,]+)/i) || q.match(/(?:change|cambia|set|establece)\s+(?:.*?\s+)?(?:to|a)\s*(banana|[0-9.,]+)\s*(?:floors?|pisos?|niveles?)/i);
  if (floorMatch) {
    const value = floorMatch[1];
    if (value === "banana") return { kind: "INVALID", alternativeId: alternative, request, reason: "Floor count must be numeric." };
    const floors = Number(value.replace(",", "."));
    return Number.isInteger(floors) && floors > 0 && floors <= 100 ? { kind: "CHANGE_HEIGHT", alternativeId: alternative, floors, request } : { kind: "INVALID", alternativeId: alternative, request, reason: "Floor count must be an integer from 1 to 100." };
  }
  if (/(add|remove|merge|offset|step|añade|elimina|fusiona|desplaza|escalona)/i.test(q)) return { kind: "UNSUPPORTED", alternativeId: alternative, request, reason: "That operation is not currently supported by the canonical capability." };
  return { kind: "UNKNOWN", request };
}

export function prepareHeightAction(projectId: string, project: CoreProject | undefined, parsed: ParsedCommand, authority: PreparedAction["authority"] = "EXPLICIT_COMMAND"): PreparedAction | { error: string } {
  if (parsed.kind !== "CHANGE_HEIGHT" && parsed.kind !== "DELEGATE") return { error: parsed.reason ?? "A supported floor-count action is required." };
  const alternatives = alternativesOf(project);
  const ids = Object.keys(alternatives);
  const alternativeId = parsed.alternativeId ?? (ids.length === 1 ? ids[0] : undefined);
  if (!alternativeId) return { error: "Select one explicit alternative before changing its height." };
  const alternative = alternatives[alternativeId];
  if (!alternative) return { error: `Alternative ${alternativeId} was not found in this project.` };
  if (!parsed.floors) return { error: "A floor count is required." };
  const fingerprint = `${projectId}:${alternativeId}:CHANGE_HEIGHT:${parsed.floors}`;
  return { projectId, alternativeId, alternative: { alternative_id: alternativeId, project_id: projectId, ...alternative }, operationType: "CHANGE_HEIGHT", parameters: { floors: parsed.floors }, source: "USER_PROVIDED", authority, request: parsed.request, fingerprint };
}

export function verifyHeightResult(result: Record<string, unknown>, action: PreparedAction): { verified: boolean; message: string } {
  const child = result.proposed_child && typeof result.proposed_child === "object" ? result.proposed_child as Record<string, unknown> : {};
  const params = child.parameters && typeof child.parameters === "object" ? child.parameters as Record<string, unknown> : {};
  const verified = Number(params.floors) === action.parameters.floors && String(child.project_id ?? action.projectId) === action.projectId && String(child.alternative_id ?? "").startsWith(action.alternativeId);
  return verified ? { verified: true, message: `Verified: ${action.alternativeId} floors changed to ${action.parameters.floors}.` } : { verified: false, message: "Execution returned, but readback did not verify the requested change." };
}

export function capabilitiesForP9(): string[] { return ["P8 capability registry", "P7 subject resolution", "P6 workflow guidance", "existing spatial operation preview/execute", "existing project state readback"]; }
export { alternativesOf };
export default { parseArquiOperation, prepareHeightAction, verifyHeightResult };
