import { describe, expect, it } from "vitest";
import { buildMjpTvManifest, createManifestFixture } from "../shared/tvManifest";

describe("MjpTvManifest v1", () => {
  const input = {
    broadcastId: "MULTI-JUEGOS-PERU-TV",
    roundId: "ROUND-001",
    gameType: "loteria_39",
    gameName: "Lotería 39",
    state: "open" as const,
    rulesetVersion: "loteria-39-v1",
    openAt: "2026-08-25T20:00:00.000Z",
    closeAt: "2026-08-25T20:02:00.000Z",
    drawnAt: null,
    countdown: 90,
    totalParticipants: 4,
    result: null,
    verifyUrl: "/verificar?round=ROUND-001",
    virtualOnly: true as const,
    creditsOnly: true as const,
    eventStatus: "LIVE",
  };

  it("mantiene a MJP Core como fuente autoritativa y bloquea dinero real", () => {
    const manifest = buildMjpTvManifest(input, "2026-08-25T20:00:30.000Z", 7);
    expect(manifest.schema).toBe("mjp-tv-manifest-v1");
    expect(manifest.source).toMatchObject({ system: "MJP_CORE", authoritative: true });
    expect(manifest.participation).toMatchObject({ allowed: true, mode: "VIRTUAL_CREDITS", virtualOnly: true, creditsOnly: true });
    expect(manifest.event.status).toBe("OPEN");
    expect(manifest.countdown.seconds).toBe(90);
    expect(manifest.result.available).toBe(false);
  });

  it("proyecta una ronda bloqueada como LOCKED y cierra la participación", () => {
    const manifest = buildMjpTvManifest({ ...input, state: "locked", eventStatus: "LOCKED" }, "2026-08-25T20:03:00.000Z", 8);
    expect(manifest.event.status).toBe("LOCKED");
    expect(manifest.participation.allowed).toBe(false);
    expect(manifest.countdown.seconds).toBeNull();
  });

  it.each(["DRAWING", "RESULT_VERIFIED", "CONTINGENCY"] as const)("crea fixture aislado para %s", (state) => {
    const manifest = state === "CONTINGENCY" ? { ...createManifestFixture("OPEN"), recovery: { mode: "CONTINGENCY" as const, lastConfirmedAt: "2026-08-25T20:00:00.000Z", lastConfirmedEventId: "FIXTURE-20260825", message: "Fixture de contingencia" } } : createManifestFixture(state);
    expect(manifest.source.authoritative).toBe(true);
    expect(manifest.participation.virtualOnly).toBe(true);
    expect(manifest.event.eventId).toContain("FIXTURE");
    expect(manifest.sequence).toBe(9001);
    if (state === "CONTINGENCY") expect(manifest.recovery.mode).toBe("CONTINGENCY");
  });
});
