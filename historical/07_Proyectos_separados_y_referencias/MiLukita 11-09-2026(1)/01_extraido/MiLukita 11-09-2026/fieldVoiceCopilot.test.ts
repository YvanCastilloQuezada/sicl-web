import { describe, expect, it } from "vitest";
import { appRouter } from "../server/routers";
import { voiceUnavailable } from "../server/fieldVoiceCopilot";
import { FIELD_VOICE_INTENTS, capabilityForFieldIntent, interpretControlledIntent, requiresFieldConfirmation, transitionFieldState, type FieldCopilotContext } from "./fieldVoiceCopilot";

const context: FieldCopilotContext = { gps: "READY", camera: "READY", connectivity: "ONLINE", sync: "IDLE", state: "READY_TO_CAPTURE", role: "MAPPER_OPERATOR" };

describe("Order 57 Field Voice Copilot backend contract", () => {
  it("exposes only controlled Field Voice procedures", () => {
    const procedures = Object.keys((appRouter as any)._def.procedures);
    expect(procedures).toContain("fieldVoice.transcribe");
    expect(procedures).toContain("fieldVoice.interpret");
    expect(procedures).toContain("fieldVoice.execute");
    expect(procedures).toContain("fieldVoice.voiceUnavailable");
  });

  it("interprets known Spanish commands and rejects arbitrary ambiguity", () => {
    const capture = interpretControlledIntent("LUKA, toma una foto", "INT-1");
    expect(capture.intent).toBe("CAPTURE_PHOTO");
    expect(capture.confidence).toBeGreaterThanOrEqual(.9);
    const unknown = interpretControlledIntent("haz cualquier cosa que consideres", "INT-2");
    expect(unknown.intent).toBeNull();
    expect(unknown.reason).toBe("NEEDS_CLARIFICATION");
  });

  it("requires confirmation for sensitive field operations", () => {
    expect(requiresFieldConfirmation("SAVE_CAPTURE")).toBe(true);
    expect(requiresFieldConfirmation("DELETE_CAPTURE")).toBe(true);
    expect(requiresFieldConfirmation("SEND_TO_EYE")).toBe(true);
    expect(requiresFieldConfirmation("SHOW_STATUS")).toBe(false);
  });

  it("maps capabilities and never grants verify/publish/critical conflict resolution", () => {
    expect(capabilityForFieldIntent("GET_GPS")).toBe("READ");
    expect(capabilityForFieldIntent("SAVE_CAPTURE")).toBe("WRITE");
    expect(FIELD_VOICE_INTENTS).not.toContain("VERIFY" as never);
    expect(FIELD_VOICE_INTENTS).not.toContain("PUBLISH" as never);
    expect(FIELD_VOICE_INTENTS).not.toContain("RESOLVE_CRITICAL_CONFLICT" as never);
  });

  it("advances the controlled state machine without inventing states", () => {
    expect(transitionFieldState("IDLE", "START_SESSION", context)).toBe("SESSION_STARTING");
    expect(transitionFieldState("READY_TO_CAPTURE", "CAPTURE_PHOTO", context)).toBe("CAPTURING");
    expect(transitionFieldState("READY_TO_CAPTURE", "SYNC", { ...context, connectivity: "OFFLINE" })).toBe("OFFLINE");
    expect(transitionFieldState("REVIEWING", "FINISH_SESSION", context)).toBe("SESSION_FINISHED");
  });

  it("returns a manual fallback without storing audio", () => {
    expect(voiceUnavailable()).toEqual({ code: "VOICE_UNAVAILABLE", manualFallback: true, message: expect.stringContaining("controles manuales") });
  });
});
