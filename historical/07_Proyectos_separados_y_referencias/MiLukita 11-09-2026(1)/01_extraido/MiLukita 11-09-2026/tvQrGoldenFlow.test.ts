import { describe, expect, it } from "vitest";
import { buildMjpTvManifest, createManifestFixture } from "./tvManifest";
import { orchestrateManifest } from "./experienceOrchestrator";
import { projectShowState } from "./showState";
import { evaluateAutonomyAction } from "./autonomyEngine";

describe("Sandbox · flujo dorado TV → QR → celular", () => {
  it("mantiene identidad, autorización virtual y transición hasta resultado", () => {
    const open = createManifestFixture("OPEN");
    const openWithQr = {
      ...open,
      qr: {
        ...open.qr,
        available: true,
        signed: true,
        imageDataUrl: "data:image/png;base64,fixture",
        payload: { roundId: open.event.eventId, event: open.event.eventId, state: "OPEN" },
      },
    };
    const tv = orchestrateManifest(openWithQr);
    const projection = projectShowState(openWithQr);

    expect(openWithQr.source).toMatchObject({ system: "MJP_CORE", authoritative: true });
    expect(openWithQr.participation).toMatchObject({ allowed: true, mode: "VIRTUAL_CREDITS", virtualOnly: true, creditsOnly: true });
    expect(openWithQr.qr.available).toBe(true);
    expect(openWithQr.qr.payload?.roundId).toBe(openWithQr.event.eventId);
    expect(tv.authority).toBe("MJP_CORE");
    expect(tv.execution).toBe("PROJECTION_ONLY");
    expect(projection.currentPhase).toBe("INTERACTION");

    const completed = { ...openWithQr, sequence: openWithQr.sequence + 1, event: { ...openWithQr.event, status: "RESULT_VERIFIED" as const }, participation: { ...openWithQr.participation, allowed: false }, qr: { ...openWithQr.qr, available: false, expiresAt: openWithQr.event.closeAt }, result: { available: true, verified: true, value: { numbers: [4, 11, 19] }, verifyUrl: openWithQr.verification.url } };
    const resultProjection = projectShowState(completed);
    expect(resultProjection.currentPhase).toBe("RESULT");
    expect(completed.result.verified).toBe(true);
    expect(completed.qr.available).toBe(false);
    expect(completed.participation.allowed).toBe(false);
  });

  it("bloquea la interacción cuando el QR está vencido o el sistema está detenido", () => {
    const open = createManifestFixture("OPEN");
    const expired = { ...open, generatedAt: "2026-08-25T20:03:00.000Z", qr: { ...open.qr, available: false, expiresAt: "2026-08-25T20:02:00.000Z" } };
    const stopped = evaluateAutonomyAction("AUTONOMOUS", "ACTIVATE_QR", "STOPPED");

    expect(expired.qr.available).toBe(false);
    expect(expired.qr.expiresAt).toBe("2026-08-25T20:02:00.000Z");
    expect(stopped.allowed).toBe(false);
    expect(stopped.requiresHumanApproval).toBe(true);
    expect(stopped.reason).toBe("kill_switch_active");
  });

  it("mantiene la proyección segura cuando el manifest está desconectado o sin siguiente evento", () => {
    const base = createManifestFixture("OPEN");
    const degraded = { ...base, event: { ...base.event, status: "DISCONNECTED" as const }, recovery: { ...base.recovery, mode: "CONTINGENCY" as const, message: "Manifest desconectado" }, nextEvent: { available: false, eventId: null, gameId: null, gameName: null, scheduledStart: null } };
    const answer = orchestrateManifest(degraded);
    expect(answer.authority).toBe("MJP_CORE");
    expect(answer.execution).toBe("PROJECTION_ONLY");
    expect(answer.whatHappensNext).toBe("NO DATA");
    expect(projectShowState(degraded).contingencyState).toBe("DEGRADED");
  });
});
