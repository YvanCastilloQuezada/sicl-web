import { describe, expect, it } from "vitest";
import { buildMjpTvManifest } from "./tvManifest";
import { eventFromRound } from "./eventEngine";
import { createExperience, experienceStateFromEvent } from "./experienceEngine";
import { approveSchedule, proposeSchedule, publishSchedule } from "../server/schedulerEngine";

const baseRound = {
  publicId: "ORDER25-E2E-001",
  gameType: "loteria_39",
  gameName: "Lotería 39",
  rulesetPublicId: "lot39-v1",
  openAt: 1_000,
  closeAt: 2_000,
  drawAt: 3_000,
} as const;

function manifestFor(state: "open" | "locked" | "drawn" | "verified", sequence: number) {
  const event = eventFromRound({ ...baseRound, state });
  const experience = createExperience({
    experienceId: "EXP-ORDER25-001",
    eventId: event.eventId,
    gameId: baseRound.gameType,
  });
  return buildMjpTvManifest(
    {
      broadcastId: "MJP-ORDER25-E2E",
      roundId: event.eventId,
      gameType: baseRound.gameType,
      gameName: baseRound.gameName,
      state,
      rulesetVersion: baseRound.rulesetPublicId,
      openAt: new Date(baseRound.openAt).toISOString(),
      closeAt: new Date(baseRound.closeAt).toISOString(),
      drawnAt: state === "drawn" || state === "verified" ? new Date(baseRound.drawAt).toISOString() : null,
      countdown: state === "open" ? 1000 : 0,
      totalParticipants: state === "open" ? 3 : 0,
      result: state === "verified" ? { numbers: [4, 11, 19, 27, 33] } : null,
      verifyUrl: "/verificar?round=ORDER25-E2E-001",
      virtualOnly: true,
      creditsOnly: true,
      eventStatus: state === "verified" ? "RESULT_VERIFIED" : state.toUpperCase(),
      experienceId: experience.experienceId,
      experienceTemplate: experience.templateId,
      experiencePhase: state === "open" ? "INTERACTION" : state === "locked" ? "LOCK" : state === "drawn" ? "DRAW" : "RESULT",
    },
    "2026-08-25T20:00:00.000Z",
    sequence,
  );
}

describe("Orden 25 — flujo E2E aislado Experience OS", () => {
  it("recorre propuesta, evento, experiencia y manifest sin cambiar la autoridad del resultado", () => {
    const proposal = proposeSchedule([
      { gameId: "loteria_39", title: "Lotería 39", frequencyPerWeek: 1, durationMinutes: 5, priority: "HIGH", primeTime: true, minGapMinutes: 10, category: "lottery" },
    ], 0, 1);
    expect(proposal.published).toBe(false);
    expect(proposal.requiresApproval).toBe(true);
    expect(proposal.publicationState).toBe("DRAFT");
    const approved = approveSchedule(proposal, "qa-human");
    expect(approved.publicationState).toBe("APPROVED");
    const published = publishSchedule(approved, "qa-human");
    expect(published.publicationState).toBe("PUBLISHED");
    expect(published.published).toBe(true);

    const open = manifestFor("open", 1);
    const locked = manifestFor("locked", 2);
    const verified = manifestFor("verified", 3);

    expect(open.source.authoritative).toBe(true);
    expect(open.experience.virtualOnly).toBe(true);
    expect(open.participation.mode).toBe("VIRTUAL_CREDITS");
    expect(open.event.status).toBe("OPEN");
    expect(locked.event.status).toBe("LOCKED");
    expect(locked.participation.allowed).toBe(false);
    expect(verified.event.status).toBe("RESULT_VERIFIED");
    expect(verified.result.verified).toBe(true);
    expect(verified.result.value).toEqual({ numbers: [4, 11, 19, 27, 33] });
    expect(verified.verification.public).toBe(true);
    expect(experienceStateFromEvent(eventFromRound({ ...baseRound, state: "locked" }))).toBe("LOCKED");
  });

  it("simula 1000 ciclos aislados y conserva invariantes de crédito, autoridad y secuencia", () => {
    let previousSequence = 0;
    for (let i = 1; i <= 1000; i += 1) {
      const state = i % 4 === 0 ? "verified" : i % 3 === 0 ? "drawn" : i % 2 === 0 ? "locked" : "open";
      const manifest = manifestFor(state, i);
      expect(manifest.sequence).toBeGreaterThan(previousSequence);
      expect(manifest.source.system).toBe("MJP_CORE");
      expect(manifest.experience.virtualOnly).toBe(true);
      expect(manifest.participation.creditsOnly).toBe(true);
      expect(manifest.qr.roundId).toBe(baseRound.publicId);
      if (state !== "open") expect(manifest.participation.allowed).toBe(false);
      if (state === "verified") expect(manifest.result.verified).toBe(true);
      previousSequence = manifest.sequence;
    }
  });
});
