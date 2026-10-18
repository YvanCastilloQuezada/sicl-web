import { eq } from "drizzle-orm";
import { territorialRoleAssignments, users } from "../drizzle/schema";
import { getDb } from "./db";
import { appendGovernanceAudit } from "./auditGovernance";
import {
  capabilityForFieldIntent,
  interpretControlledIntent,
  isKnownFieldIntent,
  isMapperDeniedAction,
  requiresFieldConfirmation,
  transitionFieldState,
  type FieldCopilotContext,
  type FieldCopilotState,
  type FieldVoiceIntent,
  type IntentInterpretation,
} from "../shared/fieldVoiceCopilot";

export type VoiceFailure = { code: "VOICE_UNAVAILABLE"; manualFallback: true; message: string };
export type FieldExecution = { intentId: string; intent: FieldVoiceIntent; operation: string; nextState: FieldCopilotState; authorized: true; confirmationUsed: boolean };

const mapperReadIntents = new Set<FieldVoiceIntent>(["START_SESSION", "GET_GPS", "SHOW_STATUS", "HELP", "CANCEL_ACTION"]);
const mapperWriteIntents = new Set<FieldVoiceIntent>(["CAPTURE_PHOTO", "RECORD_OBSERVATION", "SAVE_CAPTURE", "DISCARD_CAPTURE", "DELETE_CAPTURE", "SEND_TO_EYE", "SYNC", "FINISH_SESSION"]);

async function loadRole(actorUserId: number) {
  const db = await getDb();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const assignment = (await db.select({ role: territorialRoleAssignments.role }).from(territorialRoleAssignments).where(eq(territorialRoleAssignments.userId, actorUserId)).limit(1))[0];
  if (assignment?.role) return assignment.role;
  const user = (await db.select({ role: users.role }).from(users).where(eq(users.id, actorUserId)).limit(1))[0];
  return user?.role === "admin" ? "HUMAN_AUTHORITY" : "USER";
}

export function defaultFieldCopilotContext(role: FieldCopilotContext["role"] = "USER"): FieldCopilotContext {
  return { gps: "UNKNOWN", camera: "UNKNOWN", connectivity: "ONLINE", sync: "IDLE", state: "IDLE", role };
}

export function interpretFieldVoice(text: string, intentId: string): IntentInterpretation {
  return interpretControlledIntent(text.slice(0, 500), intentId);
}

export async function recordFieldIntent(input: { actorUserId: number; intentId: string; intent: IntentInterpretation; sessionId?: string; context: FieldCopilotContext }) {
  return appendGovernanceAudit({
    actorUserId: input.actorUserId,
    action: "INTENT_DETECTED",
    resource: "FIELD_COPILOT_INTENT",
    resourceId: input.intentId,
    correlationId: `field-copilot:${input.sessionId ?? "none"}:${input.intentId}`,
    newState: { intent: input.intent.intent, confidence: input.intent.confidence, needsClarification: input.intent.needsClarification },
    metadata: { sessionId: input.sessionId ?? null, context: input.context, candidates: input.intent.candidates },
  });
}

export async function authorizeFieldIntent(input: { actorUserId: number; interpretation: IntentInterpretation; context: FieldCopilotContext; confirmed?: boolean }) {
  const intent = input.interpretation.intent;
  if (!intent || input.interpretation.needsClarification) throw new Error("NEEDS_CLARIFICATION");
  if (isMapperDeniedAction(intent)) throw new Error("FIELD_COPILOT_ACTION_DENIED");
  const role = await loadRole(input.actorUserId);
  if (role !== "MAPPER_OPERATOR" && role !== "EYE_REVIEWER" && role !== "HUMAN_AUTHORITY") throw new Error("FIELD_ROLE_REQUIRED");
  if (role !== "MAPPER_OPERATOR" && mapperWriteIntents.has(intent)) throw new Error("MAPPER_ROLE_REQUIRED");
  if (!mapperReadIntents.has(intent) && !mapperWriteIntents.has(intent)) throw new Error("FIELD_CAPABILITY_DENIED");
  if (requiresFieldConfirmation(intent) && input.confirmed !== true) throw new Error("CONFIRMATION_REQUIRED");
  const nextState = transitionFieldState(input.context.state, intent, input.context);
  if (intent === "CAPTURE_PHOTO" && nextState === input.context.state) throw new Error("CAMERA_OR_GPS_NOT_READY");
  if (intent === "SYNC" && input.context.connectivity === "OFFLINE") throw new Error("OFFLINE_SYNC_QUEUED");
  return { role, intent, capability: capabilityForFieldIntent(intent), nextState, confirmationRequired: requiresFieldConfirmation(intent) };
}

export async function executeFieldIntent(input: { actorUserId: number; intentId: string; interpretation: IntentInterpretation; context: FieldCopilotContext; confirmed?: boolean; sessionId?: string }) {
  const authorized = await authorizeFieldIntent(input);
  const execution: FieldExecution = { intentId: input.intentId, intent: authorized.intent, operation: authorized.intent, nextState: authorized.nextState, authorized: true, confirmationUsed: Boolean(input.confirmed) };
  await appendGovernanceAudit({
    actorUserId: input.actorUserId,
    action: "ACTION_EXECUTED",
    resource: "FIELD_COPILOT_INTENT",
    resourceId: input.intentId,
    correlationId: `field-copilot:${input.sessionId ?? "none"}:${input.intentId}`,
    previousState: { state: input.context.state },
    newState: { state: execution.nextState, intent: execution.intent, operation: execution.operation },
    metadata: { confirmationUsed: execution.confirmationUsed, role: authorized.role },
  });
  return execution;
}

export function voiceUnavailable(): VoiceFailure {
  return { code: "VOICE_UNAVAILABLE", manualFallback: true, message: "La entrada de voz no está disponible. Continúa mediante los controles manuales; no se guardó audio." };
}

export function isFieldIntent(value: string): value is FieldVoiceIntent {
  return isKnownFieldIntent(value);
}
