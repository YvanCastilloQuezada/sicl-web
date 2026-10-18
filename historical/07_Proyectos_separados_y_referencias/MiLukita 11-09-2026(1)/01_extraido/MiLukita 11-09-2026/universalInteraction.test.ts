import { describe, expect, it } from "vitest";
import { INITIAL_CONTEXT_STATE } from "./lukaRuntimeContract";
import { areEquivalentUniversalIntents, decideUniversalIntent, universalIntentFromController, universalIntentFromGesture, universalIntentFromTouch, universalIntentFromVoice } from "./universalInteraction";

describe("Fase C · Universal Interaction", () => {
  it("converge voz, tacto y controlador en la misma intención", () => {
    const voice = universalIntentFromVoice("LUKA, quiero ver TV");
    const touch = universalIntentFromTouch("Ver TV");
    const controller = universalIntentFromController("watch-tv");
    expect(areEquivalentUniversalIntents(voice, touch)).toBe(true);
    expect(areEquivalentUniversalIntents(voice, controller)).toBe(true);
  });

  it("mantiene separado contexto de intención y solicita cámara para AR", () => {
    const intent = universalIntentFromVoice("LUKA, quiero estar en la calle");
    const decision = decideUniversalIntent(intent, { permissions: INITIAL_CONTEXT_STATE, connected: true, role: "guest" });
    expect(intent.id).toBe("enter-world");
    expect(decision.status).toBe("NEEDS_CONTEXT");
    if (decision.status === "NEEDS_CONTEXT") expect(decision.permission).toBe("camera");
  });

  it("deniega capabilities reservadas sin convertir intent en autorización", () => {
    const intent = universalIntentFromVoice("LUKA, quiero disminuir las luces");
    const decision = decideUniversalIntent(intent, { permissions: INITIAL_CONTEXT_STATE, connected: true, role: "user" });
    expect(intent.id).toBe("lights-climate");
    expect(decision.status).toBe("DENIED");
  });

  it("conserva equivalencia de gesto de regreso y entrada AR", () => {
    const gesture = universalIntentFromGesture("back");
    const voice = universalIntentFromVoice("Volver a la calle");
    expect(areEquivalentUniversalIntents(gesture, voice)).toBe(true);
  });
});
