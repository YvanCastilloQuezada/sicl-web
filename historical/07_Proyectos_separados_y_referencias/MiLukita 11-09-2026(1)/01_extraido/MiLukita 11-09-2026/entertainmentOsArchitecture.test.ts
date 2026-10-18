import { describe, expect, it } from "vitest";
import { buildMjpTvManifest, buildOnlineTvManifest } from "./tvManifest";
import type { OnlineTvSession } from "./onlineTvGames";
import { getCircularQrPresentation } from "./circularQr";
import { advanceContingency, enterContingency } from "./contingencyEngine";
import { present } from "../server/lukita/LukitaVoiceEngine";

describe("Entertainment OS architecture", () => {
  it("reuses the same manifest and presentation chain for a second event type", async () => {
    const now = "2026-08-27T12:00:00.000Z";
    const scheduledEvent = buildMjpTvManifest({
      broadcastId: "ARCH-TEST",
      roundId: "ARCH-EVENT-001",
      gameType: "trivia_demo",
      gameName: "TRIVIA_DEMO · Evento sintético",
      state: "open",
      rulesetVersion: "arch-v1",
      openAt: now,
      closeAt: "2026-08-27T12:02:00.000Z",
      drawnAt: null,
      countdown: 120,
      totalParticipants: 0,
      result: null,
      verifyUrl: "/verificar?round=ARCH-EVENT-001",
      virtualOnly: true,
      creditsOnly: true,
      experienceTemplate: "SPECIAL_EVENT",
      experienceId: "TRIVIA_DEMO-EXPERIENCE",
      experiencePhase: "INTERACTION",
      qrProjection: { available: true, signed: true, targetUrl: "/tv-en-linea?event=ARCH-EVENT-001", roundId: "ARCH-EVENT-001" },
    }, now, 1);
    const qr = getCircularQrPresentation(scheduledEvent.qr, "L_CENTRAL");
    expect(scheduledEvent.source).toMatchObject({ system: "MJP_CORE", authoritative: true });
    expect(scheduledEvent.experience.templateId).toBe("SPECIAL_EVENT");
    expect(scheduledEvent.qr.available).toBe(true);
    expect(qr.variant).toBe("L_CENTRAL");
    expect(qr.payload).toBe(scheduledEvent.qr.payload);
    expect(scheduledEvent.nextEvent.available).toBe(false);

    const onlineSession: OnlineTvSession = {
      sessionId: "ARCH-ONLINE-001",
      gameId: "TRIVIA",
      difficulty: "STANDARD",
      contentVersion: "online-tv-content-v1",
      phase: "ACTIVE",
      roundNumber: 1,
      startedAt: now,
      expiresAt: "2026-08-27T12:02:00.000Z",
      score: 0,
      participantCount: 1,
      cooperative: false,
      progress: 0,
      threshold: 1,
    };
    const onlineManifest = buildOnlineTvManifest(onlineSession, now, 2);
    expect(onlineManifest.source).toMatchObject({ system: "MJP_CORE", authoritative: true });
    expect(onlineManifest.onlineTv?.sessionId).toBe(onlineSession.sessionId);
    expect(onlineManifest.qr.targetUrl).toContain(onlineSession.sessionId);
    expect(onlineManifest.brand.commercialName).toBe("MiLukita");
    const presentation = await present("Lukita presenta TRIVIA_DEMO sin alterar el resultado.", "WARM");
    expect(presentation.integration).toBe("PREPRODUCTION_PREVIEW");
    expect(presentation.audio.productionEnabled).toBe(false);
    expect(presentation.lipSync.productionEnabled).toBe(false);
    const contingency = enterContingency("WEBSOCKET_DOWN", { eventId: onlineSession.sessionId, status: "OPEN", gameName: onlineSession.gameId, result: null, verified: false, capturedAt: Date.parse(now) });
    const fallback = advanceContingency(contingency, "FALLBACK");
    expect(fallback.step).toBe("FALLBACK");
    expect(fallback.resultAuthorityPreserved).toBe(true);
  });
});
