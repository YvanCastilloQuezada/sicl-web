import { beforeEach, describe, expect, it } from "vitest";
import { createHmac } from "node:crypto";
import { buildManifestQrProjection, validateRoundQrPayload } from "./broadcast";
import { buildMjpTvManifest } from "../shared/tvManifest";

const payloadBase = {
  broadcastId: "MULTI-JUEGOS-PERU-TV",
  roundId: "RP-L-TEST1234",
  gameType: "loteria_19",
  gameName: "Lotería 19",
  rulesetVersion: "v1.2.0",
  openAt: "2026-08-25T18:00:00.000Z",
  closeAt: "2026-08-25T20:00:00.000Z",
  nonce: "nonce-test-001",
  url: "/juegos/loteria_19?round=RP-L-TEST1234",
  verifyUrl: "/verificar?round=RP-L-TEST1234",
  version: "qr-round-v1",
};

function signedPayload() {
  process.env.JWT_SECRET = "test-secret-that-is-long-enough-123456789";
  const secret = createHmac("sha256", process.env.JWT_SECRET).update("multi-juegos-peru-broadcast-qr-v1").digest();
  const signature = createHmac("sha256", secret).update(JSON.stringify(payloadBase)).digest("hex");
  return { ...payloadBase, signature };
}

describe("broadcast QR security", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret-that-is-long-enough-123456789";
  });

  it("accepts a correctly signed QR during its opening window", () => {
    expect(validateRoundQrPayload(signedPayload(), Date.parse("2026-08-25T19:00:00.000Z"))).toBe(true);
  });

  it("rejects a QR whose round data was modified", () => {
    expect(validateRoundQrPayload({ ...signedPayload(), roundId: "RP-L-TAMPERED" }, Date.parse("2026-08-25T19:00:00.000Z"))).toBe(false);
  });

  it("rejects QR after the authoritative close time", () => {
    expect(validateRoundQrPayload(signedPayload(), Date.parse("2026-08-25T20:00:01.000Z"))).toBe(false);
  });

  it("rejects QR payloads with an unsupported version", () => {
    expect(validateRoundQrPayload({ ...signedPayload(), version: "qr-round-v0" }, Date.parse("2026-08-25T19:00:00.000Z"))).toBe(false);
  });
});


describe("round QR identity", () => {
  it("projects one signed QR contract for the public manifest", async () => {
    process.env.JWT_SECRET = "x".repeat(64);
    const projection = await buildManifestQrProjection({
      broadcastId: "MULTI-JUEGOS-PERU-TV",
      roundId: "RND-QR-1",
      gameType: "loteria_19",
      gameName: "Lotería 19",
      rulesetVersion: "v1",
      openAt: "2026-08-25T12:00:00.000Z",
      closeAt: "2026-08-25T13:00:00.000Z",
      verifyUrl: "/verificar?round=RND-QR-1",
      eventId: "RND-QR-1",
      experienceId: "EXP-RND-QR-1",
    });
    expect(projection.available).toBe(true);
    expect(projection.signed).toBe(true);
    expect(projection.version).toBe("qr-round-v1");
    expect(projection.targetUrl).toContain("/juegos/loteria_19");
    expect(projection.imageDataUrl).toMatch(/^data:image\/png;base64,/);
    expect(validateRoundQrPayload(projection.payload as never, Date.parse("2026-08-25T12:30:00.000Z"))).toBe(true);
  });

  it("projects a next event from the public manifest contract", () => {
    const manifest = buildMjpTvManifest({
      broadcastId: "MULTI-JUEGOS-PERU-TV",
      roundId: "RND-CURRENT",
      gameType: "loteria_19",
      gameName: "Lotería 19",
      state: "drawn",
      rulesetVersion: "v1",
      openAt: "2026-08-25T12:00:00.000Z",
      closeAt: "2026-08-25T13:00:00.000Z",
      drawnAt: "2026-08-25T13:00:00.000Z",
      countdown: 0,
      totalParticipants: 0,
      result: { numbers: [1, 2, 3] },
      verifyUrl: "/verificar?round=RND-CURRENT",
      virtualOnly: true,
      creditsOnly: true,
      eventStatus: "COMPLETED",
      nextEventProjection: { available: true, eventId: "RND-NEXT", gameId: "loteria_19", gameName: "Lotería 19", scheduledStart: "2026-08-25T14:00:00.000Z" },
    });
    expect(manifest.nextEvent).toEqual({ available: true, eventId: "RND-NEXT", gameId: "loteria_19", gameName: "Lotería 19", scheduledStart: "2026-08-25T14:00:00.000Z" });
  });

  it("derives the same nonce for repeated requests of the same round", async () => {
    process.env.JWT_SECRET = "x".repeat(64);
    const { deterministicRoundNonce } = await import("./broadcast");
    const round = { roundId: "RND-1", rulesetVersion: "v1", openAt: "2026-08-25T12:00:00.000Z", closeAt: "2026-08-25T13:00:00.000Z" };
    expect(deterministicRoundNonce(round)).toBe(deterministicRoundNonce(round));
    expect(deterministicRoundNonce(round)).not.toBe(deterministicRoundNonce({ ...round, roundId: "RND-2" }));
  });
});
