import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import QRCode from "qrcode";
import { z } from "zod";
import { and, asc, eq, gt, inArray, sql } from "drizzle-orm";
import { broadcastSignalMetrics, gameRounds, gameRulesets, pilotTickets } from "../drizzle/schema";
import { getDb } from "./db";
import { GAME_TYPES } from "./pilot";
import { eventFromRound } from "../shared/eventEngine";
import { buildMjpTvManifest } from "../shared/tvManifest";

export const BROADCAST_ID = "MULTI-JUEGOS-PERU-TV";
const QR_VERSION = "qr-round-v1";
const QR_TTL_SECONDS = 60 * 60;

export const syncStateSchema = z.enum(["scheduled", "open", "locked", "drawing", "drawn", "verified", "cancelled"]);
export type BroadcastSyncState = z.infer<typeof syncStateSchema>;

export type RoundQrPayload = {
  broadcastId: string;
  roundId: string;
  gameType: string;
  gameName: string;
  rulesetVersion: string;
  openAt: string;
  closeAt: string;
  nonce: string;
  url: string;
  verifyUrl: string;
  version: string;
  signature: string;
  eventId?: string;
  experienceId?: string;
  expiresAt?: string;
  sessionToken?: string;
};

const secret = () => {
  const value = process.env.JWT_SECRET;
  if (!value || value.length < 32) throw new Error("JWT_SECRET debe estar configurado para firmar QR.");
  return createHmac("sha256", value).update("multi-juegos-peru-broadcast-qr-v1").digest();
};

function canonicalPayload(payload: Omit<RoundQrPayload, "signature">) {
  const base: Record<string, string> = {
    broadcastId: payload.broadcastId,
    roundId: payload.roundId,
    gameType: payload.gameType,
    gameName: payload.gameName,
    rulesetVersion: payload.rulesetVersion,
    openAt: payload.openAt,
    closeAt: payload.closeAt,
    nonce: payload.nonce,
    url: payload.url,
    verifyUrl: payload.verifyUrl,
    version: payload.version,
  };
  if (payload.eventId || payload.experienceId || payload.expiresAt || payload.sessionToken) {
    base.eventId = payload.eventId ?? payload.roundId;
    base.experienceId = payload.experienceId ?? `EXP-${payload.roundId}`;
    base.expiresAt = payload.expiresAt ?? payload.closeAt;
    base.sessionToken = payload.sessionToken ?? "";
  }
  return JSON.stringify(base);
}

function signPayload(payload: Omit<RoundQrPayload, "signature">) {
  return createHmac("sha256", secret()).update(canonicalPayload(payload)).digest("hex");
}

export function deterministicRoundNonce(round: Pick<RoundQrPayload, "roundId" | "rulesetVersion" | "openAt" | "closeAt">) {
  return createHmac("sha256", secret())
    .update(`${QR_VERSION}:${round.roundId}:${round.rulesetVersion}:${round.openAt}:${round.closeAt}`)
    .digest("hex")
    .slice(0, 32);
}

export function validateRoundQrPayload(payload: RoundQrPayload, now = Date.now()) {
  if (!payload || payload.version !== QR_VERSION || !payload.signature) return false;
  const expected = signPayload({ ...payload, signature: undefined } as Omit<RoundQrPayload, "signature">);
  const received = Buffer.from(payload.signature, "hex");
  const calculated = Buffer.from(expected, "hex");
  if (received.length !== calculated.length || !timingSafeEqual(received, calculated)) return false;
  const closeAt = Date.parse(payload.closeAt);
  const openAt = Date.parse(payload.openAt);
  return Number.isFinite(openAt) && Number.isFinite(closeAt) && now >= openAt - 5 * 60_000 && now <= closeAt;
}

function stateForRound(state: string, closesAt: Date, now = Date.now()): BroadcastSyncState {
  if (state === "draft") return "scheduled";
  if (state === "open" && closesAt.getTime() <= now) return "locked";
  if (state === "open") return "open";
  if (state === "locked") return "locked";
  if (state === "drawn" || state === "settled") return "drawn";
  if (state === "archived") return "cancelled";
  return "scheduled";
}

function displayName(gameType: string) {
  const names: Record<string, string> = {
    loteria_19: "Lotería 19", loteria_29: "Lotería 29", loteria_39: "Lotería 39 MJP",
    loteria_39_5: "Lotería 39 Cinco", loteria_49: "Lotería 49", loteria_59: "Lotería 59",
    pick_3: "Loto 3", pick_4: "Loto 4", loto_express: "Loto Express", loto_diario: "Loto Diario",
    bingo_flash: "Bingo Rápido", bingo_keno: "Bingo Números", bingo_75: "Bingo Americano",
    ruleta: "Ruleta Clásica", ruleta_7: "Ruleta Mini", ruleta_17: "Ruleta Clásica 17", ruleta_27: "Ruleta Europea 27", ruleta_37: "Ruleta Premium 37",
    jackpot: "Jackpot", cartas: "Trío 13", raspa_digital: "Raspa", sueldo_vida: "Sueldo de por vida", bingo: "Bingo Diario",
  };
  return names[gameType] ?? gameType;
}

export async function getBroadcastRound(roundId: string) {
  const db = await getDb();
  if (!db) return null;
  const round = (await db.select().from(gameRounds).where(eq(gameRounds.publicId, roundId)).limit(1))[0];
  if (!round) return null;
  const ruleset = (await db.select().from(gameRulesets).where(eq(gameRulesets.id, round.rulesetId)).limit(1))[0];
  const countRows = await db.select({ count: sql<number>`count(*)` }).from(pilotTickets).where(and(eq(pilotTickets.roundId, round.id), eq(pilotTickets.status, "confirmed")));
  const syncState = stateForRound(round.state, round.closesAt);
  const result = round.resultJson ? JSON.parse(round.resultJson) : null;
  const event = eventFromRound({ publicId: round.publicId, gameType: round.gameType, state: syncState, openAt: round.opensAt, closeAt: round.closesAt, drawAt: round.drawnAt, rulesetPublicId: ruleset?.version ?? null }, displayName(round.gameType));
  const nextRound = (await db.select({ publicId: gameRounds.publicId, gameType: gameRounds.gameType, opensAt: gameRounds.opensAt }).from(gameRounds).where(and(eq(gameRounds.gameType, round.gameType), gt(gameRounds.opensAt, new Date()), inArray(gameRounds.state, ["draft", "open", "locked"]))).orderBy(asc(gameRounds.opensAt)).limit(1))[0];
  const nextEventProjection = nextRound ? { available: true, eventId: nextRound.publicId, gameId: nextRound.gameType, gameName: displayName(nextRound.gameType), scheduledStart: nextRound.opensAt.toISOString() } : undefined;
  const stateSequence: Record<string, number> = { scheduled: 1, open: 2, locked: 3, drawn: 4, verified: 5, cancelled: 6 };
  const manifestSequence = Math.floor(round.opensAt.getTime() / 1000) * 10 + (stateSequence[syncState] ?? 0);
  const generatedAt = new Date().toISOString();
  const commonInput = {
    broadcastId: BROADCAST_ID,
    roundId: round.publicId,
    gameType: round.gameType,
    gameName: displayName(round.gameType),
    state: syncState,
    rulesetVersion: ruleset?.version ?? "sin-regla",
    openAt: round.opensAt.toISOString(),
    closeAt: round.closesAt.toISOString(),
    drawnAt: round.drawnAt?.toISOString() ?? null,
    countdown: Math.max(0, Math.floor((round.closesAt.getTime() - Date.now()) / 1000)),
    totalParticipants: Number(countRows[0]?.count ?? 0),
    result,
    verifyUrl: `/verificar?round=${encodeURIComponent(round.publicId)}`,
    virtualOnly: true as const,
    creditsOnly: true as const,
    eventStatus: event.status,
  };
  const manifestBase = buildMjpTvManifest(commonInput, generatedAt, manifestSequence);
  const qrProjection = syncState === "open" ? await buildManifestQrProjection({
    broadcastId: BROADCAST_ID,
    roundId: round.publicId,
    gameType: round.gameType,
    gameName: displayName(round.gameType),
    rulesetVersion: ruleset?.version ?? "sin-regla",
    openAt: round.opensAt.toISOString(),
    closeAt: round.closesAt.toISOString(),
    verifyUrl: commonInput.verifyUrl,
    eventId: manifestBase.event.eventId,
    experienceId: manifestBase.experience.experienceId,
  }) : undefined;
  return {
    roundId: round.publicId,
    broadcastId: BROADCAST_ID,
    gameType: round.gameType,
    gameName: displayName(round.gameType),
    rulesetVersion: commonInput.rulesetVersion,
    state: syncState,
    openAt: commonInput.openAt,
    closeAt: commonInput.closeAt,
    drawnAt: commonInput.drawnAt,
    countdown: commonInput.countdown,
    totalParticipants: commonInput.totalParticipants,
    result,
    verifyUrl: commonInput.verifyUrl,
    virtualOnly: true,
    creditsOnly: true,
    manifest: buildMjpTvManifest({ ...commonInput, qrProjection, nextEventProjection }, generatedAt, manifestSequence),
    event,
  } as const;
}

export async function getBroadcastRounds() {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select({ publicId: gameRounds.publicId }).from(gameRounds).where(sql`${gameRounds.state} in ('open','locked','drawn','settled')`).orderBy(sql`${gameRounds.createdAt} desc`).limit(30);
  const states = await Promise.all(rows.map((row) => getBroadcastRound(row.publicId)));
  return states.filter(Boolean);
}

export async function buildManifestQrProjection(input: Omit<RoundQrPayload, "nonce" | "signature" | "url" | "version" | "expiresAt" | "sessionToken">) {
  const payloadWithoutSignature = {
    ...input,
    nonce: deterministicRoundNonce(input),
    url: `/juegos/${input.gameType}?round=${encodeURIComponent(input.roundId)}&broadcast=${encodeURIComponent(input.broadcastId)}&experience=${encodeURIComponent(input.experienceId ?? `EXP-${input.roundId}`)}`,
    version: QR_VERSION,
    expiresAt: input.closeAt,
    sessionToken: randomBytes(18).toString("base64url"),
  } satisfies Omit<RoundQrPayload, "signature">;
  const payload: RoundQrPayload = { ...payloadWithoutSignature, signature: signPayload(payloadWithoutSignature) };
  const imageDataUrl = await QRCode.toDataURL(JSON.stringify(payload), { width: 420, margin: 2, errorCorrectionLevel: "M" });
  return {
    available: true,
    roundId: payload.roundId,
    targetUrl: payload.url,
    verifyUrl: payload.verifyUrl,
    expiresAt: payload.expiresAt ?? payload.closeAt,
    signed: true,
    version: payload.version,
    imageDataUrl,
    payload: Object.fromEntries(Object.entries(payload).filter(([, value]) => typeof value === "string")) as Record<string, string>,
  };
}

export async function createRoundQr(roundId: string, broadcastId = BROADCAST_ID) {
  const round = await getBroadcastRound(roundId);
  if (!round) throw new Error("No se encontró la ronda solicitada.");
  if (round.state !== "open" || !round.manifest.qr.available || !round.manifest.qr.imageDataUrl || !round.manifest.qr.payload) throw new Error("El QR solo puede generarse mientras la ronda está abierta.");
  const payload = round.manifest.qr.payload as unknown as RoundQrPayload;
  if (payload.broadcastId !== broadcastId) throw new Error("El QR no pertenece a la emisión solicitada.");
  return { qrCode: round.manifest.qr.imageDataUrl, payload, expiresIn: QR_TTL_SECONDS, valid: validateRoundQrPayload(payload) };
}

export const supportedBroadcastGames = GAME_TYPES;

export type BroadcastSignalInput = {
  broadcastId?: string;
  videoId?: string;
  source: "local_probe" | "youtube_api" | "operator";
  status: "healthy" | "degraded" | "offline" | "unknown";
  latencyMs?: number;
  droppedFramesPercent?: number;
  detail?: string;
};

export async function recordBroadcastSignal(input: BroadcastSignalInput) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible para registrar la señal.");
  const publicId = `SIG-${randomBytes(10).toString("hex").toUpperCase()}`;
  await db.insert(broadcastSignalMetrics).values({
    publicId,
    broadcastId: input.broadcastId ?? BROADCAST_ID,
    videoId: input.videoId ?? null,
    source: input.source,
    status: input.status,
    latencyMs: input.latencyMs ?? null,
    droppedFramesPercent: input.droppedFramesPercent ?? null,
    detail: input.detail?.slice(0, 255) ?? null,
  });
  return { publicId, recorded: true, virtualOnly: true };
}

export async function getBroadcastSignalMetrics(limit = 60) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(broadcastSignalMetrics).orderBy(sql`${broadcastSignalMetrics.measuredAt} desc`).limit(Math.min(Math.max(limit, 1), 500));
}
