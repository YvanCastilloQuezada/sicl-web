import type { OnlineTvSession } from "./onlineTvGames";

export const MJP_TV_MANIFEST_VERSION = "mjp-tv-manifest-v1" as const;

export const TV_MANIFEST_STATES = [
  "SCHEDULED",
  "OPEN",
  "LOCKED",
  "DRAWING",
  "RESULT_VERIFIED",
  "COMPLETED",
  "CANCELLED",
  "RECOVERY",
  "DISCONNECTED",
] as const;

export type MjpTvManifestState = (typeof TV_MANIFEST_STATES)[number];

export type MjpTvManifestQr = {
  available: boolean;
  roundId: string | null;
  targetUrl: string | null;
  verifyUrl: string | null;
  expiresAt: string | null;
  signed: boolean;
  version: string | null;
  imageDataUrl: string | null;
  payload: Record<string, string> | null;
};

export type MjpTvManifest = {
  schema: typeof MJP_TV_MANIFEST_VERSION;
  brand: { commercialName: "MiLukita"; hostName: "Lukita"; tvName: "MiLukita TV"; eventsName: "MiLukita Eventos"; virtualOnly: true };
  generatedAt: string;
  sequence: number;
  source: { system: "MJP_CORE"; authoritative: true; broadcastId: string };
  experience: {
    experienceId: string;
    templateId: "LOTTERY_STANDARD" | "LOTTERY_JACKPOT" | "BINGO_STANDARD" | "ROULETTE_STANDARD" | "TRIO_STANDARD" | "SPECIAL_EVENT";
    phase: "INTRO" | "COUNTDOWN" | "OPEN" | "INTERACTION" | "LOCK" | "SUSPENSE" | "DRAW" | "RESULT" | "VERIFICATION" | "CELEBRATION" | "NEXT_EVENT";
    tvMode: "SHOW" | "MINIMAL";
    mobileMode: "CONTROLLER" | "INFO";
    interactionMode: "ENTERTAINMENT_ONLY" | "GAME_PARTICIPATION";
    virtualOnly: true;
  };
  event: {
    eventId: string;
    eventType: "GAME_DRAW";
    gameId: string;
    gameName: string;
    status: MjpTvManifestState;
    rulesVersion: string | null;
    openAt: string | null;
    closeAt: string | null;
    drawnAt: string | null;
  };
  participation: {
    allowed: boolean;
    confirmedCount: number;
    mode: "VIRTUAL_CREDITS";
    virtualOnly: true;
    creditsOnly: true;
  };
  countdown: { seconds: number | null; basedOn: "SERVER_CLOSE_AT" | "NONE" };
  qr: MjpTvManifestQr;
  result: { available: boolean; verified: boolean; value: unknown | null; verifyUrl: string | null };
  nextEvent: { available: boolean; eventId: string | null; gameId: string | null; gameName: string | null; scheduledStart: string | null };
  recovery: { mode: "NORMAL" | "CONTINGENCY"; lastConfirmedAt: string | null; lastConfirmedEventId: string | null; message: string | null };
  verification: { public: boolean; url: string | null };
  onlineTv?: { sessionId: string; gameId: string; difficulty: string; contentVersion: string; cooperative: boolean; progress: number; threshold: number; participantCount: number };
};

type BroadcastInput = {
  broadcastId: string;
  roundId: string;
  gameType: string;
  gameName: string;
  state: "scheduled" | "open" | "locked" | "drawn" | "verified" | "cancelled" | string;
  rulesetVersion: string;
  openAt: string;
  closeAt: string;
  drawnAt: string | null;
  countdown: number;
  totalParticipants: number;
  result: unknown;
  verifyUrl: string;
  virtualOnly: true;
  creditsOnly: true;
  eventStatus: string;
  experienceId?: string;
  experienceTemplate?: "LOTTERY_STANDARD" | "LOTTERY_JACKPOT" | "BINGO_STANDARD" | "ROULETTE_STANDARD" | "TRIO_STANDARD" | "SPECIAL_EVENT";
  experiencePhase?: "INTRO" | "COUNTDOWN" | "OPEN" | "INTERACTION" | "LOCK" | "SUSPENSE" | "DRAW" | "RESULT" | "VERIFICATION" | "CELEBRATION" | "NEXT_EVENT";
  qrProjection?: Partial<MjpTvManifestQr>;
  nextEventProjection?: Partial<MjpTvManifest["nextEvent"]>;
};

function manifestState(state: string, eventStatus: string): MjpTvManifestState {
  if (eventStatus === "RESULT_VERIFIED" || state === "verified") return "RESULT_VERIFIED";
  if (eventStatus === "COMPLETED" || state === "cancelled") return state === "cancelled" ? "CANCELLED" : "COMPLETED";
  if (state === "open") return "OPEN";
  if (state === "locked") return "LOCKED";
  if (state === "drawn") return "DRAWING";
  return "SCHEDULED";
}

export function buildMjpTvManifest(input: BroadcastInput, generatedAt = new Date().toISOString(), sequence = 1): MjpTvManifest {
  const status = manifestState(input.state, input.eventStatus);
  const open = status === "OPEN";
  const experienceId = input.experienceId ?? `EXP-${input.roundId}`;
  const templateId = input.experienceTemplate ?? (input.gameType.includes("bingo") ? "BINGO_STANDARD" : input.gameType.includes("ruleta") ? "ROULETTE_STANDARD" : input.gameType.includes("trio") || input.gameType.includes("cartas") ? "TRIO_STANDARD" : input.gameType.includes("jackpot") || input.gameType.includes("extra") ? "LOTTERY_JACKPOT" : "LOTTERY_STANDARD");
  const phase = input.experiencePhase ?? (status === "OPEN" ? "INTERACTION" : status === "LOCKED" ? "LOCK" : status === "DRAWING" ? "DRAW" : status === "RESULT_VERIFIED" || status === "COMPLETED" ? "RESULT" : "COUNTDOWN");
  const hasResult = input.result !== null && input.result !== undefined;
  return {
    schema: MJP_TV_MANIFEST_VERSION,
    brand: { commercialName: "MiLukita", hostName: "Lukita", tvName: "MiLukita TV", eventsName: "MiLukita Eventos", virtualOnly: true },
    generatedAt,
    sequence,
    source: { system: "MJP_CORE", authoritative: true, broadcastId: input.broadcastId },
    experience: { experienceId, templateId, phase, tvMode: "SHOW", mobileMode: "CONTROLLER", interactionMode: "GAME_PARTICIPATION", virtualOnly: true },
    event: { eventId: input.roundId, eventType: "GAME_DRAW", gameId: input.gameType, gameName: input.gameName, status, rulesVersion: input.rulesetVersion, openAt: input.openAt, closeAt: input.closeAt, drawnAt: input.drawnAt },
    participation: { allowed: open, confirmedCount: input.totalParticipants, mode: "VIRTUAL_CREDITS", virtualOnly: true, creditsOnly: true },
    countdown: { seconds: open ? Math.max(0, input.countdown) : null, basedOn: open ? "SERVER_CLOSE_AT" : "NONE" },
    qr: { available: false, roundId: input.roundId, targetUrl: null, verifyUrl: input.verifyUrl, expiresAt: open ? input.closeAt : null, signed: false, version: null, imageDataUrl: null, payload: null, ...input.qrProjection },
    result: { available: hasResult, verified: status === "RESULT_VERIFIED" || status === "COMPLETED", value: hasResult ? input.result : null, verifyUrl: hasResult ? input.verifyUrl : null },
    nextEvent: { available: false, eventId: null, gameId: null, gameName: null, scheduledStart: null, ...input.nextEventProjection },
    recovery: { mode: "NORMAL", lastConfirmedAt: generatedAt, lastConfirmedEventId: input.roundId, message: null },
    verification: { public: true, url: input.verifyUrl },
  };
}

export type ManifestFixtureState = Exclude<MjpTvManifestState, "DISCONNECTED">;

export function createManifestFixture(state: ManifestFixtureState, now = "2026-08-25T20:00:00.000Z"): MjpTvManifest {
  const close = "2026-08-25T20:02:00.000Z";
  const base = buildMjpTvManifest({ broadcastId: "MJP-TV-FIXTURE", roundId: "FIXTURE-20260825", gameType: "loteria_39", gameName: "Lotería 39 · Fixture", state: state === "OPEN" ? "open" : state === "LOCKED" ? "locked" : state === "DRAWING" ? "drawn" : state === "CANCELLED" ? "cancelled" : "draft", rulesetVersion: "fixture-v1", openAt: now, closeAt: close, drawnAt: state === "DRAWING" || state === "RESULT_VERIFIED" || state === "COMPLETED" ? close : null, countdown: state === "OPEN" ? 120 : 0, totalParticipants: state === "OPEN" ? 2 : 0, result: state === "RESULT_VERIFIED" || state === "COMPLETED" ? { numbers: [4, 11, 19, 27, 33] } : null, verifyUrl: "/verificar?round=FIXTURE-20260825", virtualOnly: true, creditsOnly: true, eventStatus: state }, now, 9001);
  return { ...base, event: { ...base.event, status: state }, qr: { ...base.qr, available: state === "OPEN", signed: state === "OPEN", version: state === "OPEN" ? "qr-round-v1" : null, targetUrl: state === "OPEN" ? "/juegos/loteria_39?round=FIXTURE-20260825" : null } };
}

export function buildOnlineTvManifest(session: OnlineTvSession, generatedAt = new Date().toISOString(), sequence = 1): MjpTvManifest {
  const definitionName = session.gameId;
  const openAt = session.startedAt;
  const closeAt = session.expiresAt;
  const seconds = Math.max(0, Math.ceil((Date.parse(closeAt) - Date.parse(generatedAt)) / 1000));
  const complete = session.phase === "RESULT" || session.phase === "FINISHED";
  return {
    schema: MJP_TV_MANIFEST_VERSION,
    brand: { commercialName: "MiLukita", hostName: "Lukita", tvName: "MiLukita TV", eventsName: "MiLukita Eventos", virtualOnly: true },
    generatedAt,
    sequence,
    source: { system: "MJP_CORE", authoritative: true, broadcastId: `ONLINE-${session.sessionId}` },
    experience: { experienceId: `ONLINE-EXP-${session.sessionId}`, templateId: "SPECIAL_EVENT", phase: complete ? "RESULT" : "INTERACTION", tvMode: "SHOW", mobileMode: "CONTROLLER", interactionMode: "GAME_PARTICIPATION", virtualOnly: true },
    event: { eventId: session.sessionId, eventType: "GAME_DRAW", gameId: `ONLINE_${session.gameId}`, gameName: definitionName, status: complete ? "COMPLETED" : "OPEN", rulesVersion: session.contentVersion, openAt, closeAt, drawnAt: complete ? generatedAt : null },
    participation: { allowed: session.phase === "ACTIVE", confirmedCount: session.participantCount, mode: "VIRTUAL_CREDITS", virtualOnly: true, creditsOnly: true },
    countdown: { seconds: session.phase === "ACTIVE" ? seconds : null, basedOn: session.phase === "ACTIVE" ? "SERVER_CLOSE_AT" : "NONE" },
    qr: { available: false, roundId: session.sessionId, targetUrl: `/tv-en-linea?session=${session.sessionId}`, verifyUrl: null, expiresAt: session.phase === "ACTIVE" ? closeAt : null, signed: false, version: null, imageDataUrl: null, payload: null },
    result: { available: complete, verified: false, value: complete ? { score: session.score, progress: session.progress } : null, verifyUrl: null },
    nextEvent: { available: false, eventId: null, gameId: null, gameName: null, scheduledStart: null },
    recovery: { mode: "NORMAL", lastConfirmedAt: generatedAt, lastConfirmedEventId: session.sessionId, message: null },
    verification: { public: false, url: null },
    onlineTv: { sessionId: session.sessionId, gameId: session.gameId, difficulty: session.difficulty, contentVersion: session.contentVersion, cooperative: session.cooperative, progress: session.progress, threshold: session.threshold, participantCount: session.participantCount },
  };
}
