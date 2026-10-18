import { randomUUID } from "node:crypto";
import {
  createPlayerId,
  validateDeviceId,
  validateNickname,
  type ConcurrentPlayer,
  type LobbySnapshot,
  type PlayerSession,
  type PlayerStatus,
} from "../../shared/realtime";

export const REALTIME_MAX_PLAYERS = 100;
export const REALTIME_IDLE_AFTER_MS = 30_000;
export const REALTIME_DISCONNECT_AFTER_MS = 90_000;
export const REALTIME_SESSION_TTL_MS = 15 * 60_000;

type JoinInput = { roundId: string; deviceId: string; nickname: string; avatar: string; sessionToken?: string; requestId: string };
type CommandResult = { session: PlayerSession; player: ConcurrentPlayer; lobby: LobbySnapshot; duplicate?: boolean };

function nowIso(now: number): string { return new Date(now).toISOString(); }

export class PlayerSessionManager {
  private readonly sessions = new Map<string, PlayerSession>();
  private readonly players = new Map<string, ConcurrentPlayer>();
  private readonly requestResults = new Map<string, CommandResult>();

  constructor(private readonly maxPlayers = REALTIME_MAX_PLAYERS) {}

  join(input: JoinInput, now = Date.now()): CommandResult {
    const duplicate = this.requestResults.get(`join:${input.requestId}`);
    if (duplicate) return { ...duplicate, duplicate: true };
    if (!input.roundId.trim()) throw new Error("La ronda es obligatoria.");
    const deviceId = validateDeviceId(input.deviceId);
    const nickname = validateNickname(input.nickname);
    const existingSession = input.sessionToken ? this.findByToken(input.sessionToken) : undefined;
    if (existingSession && existingSession.roundId === input.roundId && existingSession.deviceId === deviceId) {
      const result = this.reconnectExisting(existingSession, now);
      this.requestResults.set(`join:${input.requestId}`, result);
      return result;
    }
    const activeCount = Array.from(this.players.values()).filter((player) => player.status === "ACTIVE" || player.status === "IDLE").length;
    if (activeCount >= this.maxPlayers) throw new Error(`La sala alcanzó el máximo de ${this.maxPlayers} jugadores.`);
    const sessionId = randomUUID();
    const sessionToken = randomUUID();
    const timestamp = nowIso(now);
    const playerId = createPlayerId(input.roundId, deviceId);
    const player: ConcurrentPlayer = {
      id: playerId, sessionId, deviceId, nickname, avatar: input.avatar.trim().slice(0, 120), status: "ACTIVE",
      joinedAt: timestamp, lastActiveAt: timestamp, score: 0, roundScores: {}, totalWins: 0, totalGames: 0,
      totalHits: 0, totalDamage: 0, tokens: 0,
    };
    const session: PlayerSession = { sessionId, sessionToken, roundId: input.roundId, playerId, deviceId, connected: true, createdAt: timestamp, lastSeenAt: timestamp };
    this.players.set(playerId, player); this.sessions.set(sessionId, session);
    const result = { session, player, lobby: this.snapshot(input.roundId, now) };
    this.requestResults.set(`join:${input.requestId}`, result);
    return result;
  }

  heartbeat(sessionToken: string, requestId: string, now = Date.now()): CommandResult {
    const duplicate = this.requestResults.get(`heartbeat:${requestId}`);
    if (duplicate) return { ...duplicate, duplicate: true };
    const session = this.requireSession(sessionToken);
    const player = this.requirePlayer(session.playerId);
    const timestamp = nowIso(now);
    session.lastSeenAt = timestamp; session.connected = true; player.lastActiveAt = timestamp; player.status = "ACTIVE";
    const result = { session, player, lobby: this.snapshot(session.roundId, now) };
    this.requestResults.set(`heartbeat:${requestId}`, result);
    return result;
  }

  reconnect(sessionToken: string, deviceId: string, requestId: string, now = Date.now()): CommandResult {
    const duplicate = this.requestResults.get(`reconnect:${requestId}`);
    if (duplicate) return { ...duplicate, duplicate: true };
    const session = this.requireSession(sessionToken);
    if (session.deviceId !== validateDeviceId(deviceId)) throw new Error("El dispositivo no coincide con la sesión.");
    const result = this.reconnectExisting(session, now);
    this.requestResults.set(`reconnect:${requestId}`, result);
    return result;
  }

  disconnect(sessionToken: string, now = Date.now()): LobbySnapshot | undefined {
    const session = this.findByToken(sessionToken);
    if (!session) return undefined;
    const player = this.players.get(session.playerId);
    if (!player || player.status === "LEFT") return this.snapshot(session.roundId, now);
    session.connected = false;
    player.status = "DISCONNECTED";
    return this.snapshot(session.roundId, now);
  }

  leave(sessionToken: string, requestId: string, now = Date.now()): CommandResult {
    const duplicate = this.requestResults.get(`leave:${requestId}`);
    if (duplicate) return { ...duplicate, duplicate: true };
    const session = this.requireSession(sessionToken); const player = this.requirePlayer(session.playerId);
    player.status = "LEFT"; session.connected = false; session.lastSeenAt = nowIso(now);
    const result = { session, player, lobby: this.snapshot(session.roundId, now) };
    this.requestResults.set(`leave:${requestId}`, result);
    return result;
  }

  sweep(now = Date.now()): LobbySnapshot[] {
    const affected = new Set<string>();
    for (const session of Array.from(this.sessions.values())) {
      const lastSeen = Date.parse(session.lastSeenAt);
      const player = this.players.get(session.playerId);
      if (!player || player.status === "LEFT") continue;
      const age = now - lastSeen;
      if (age >= REALTIME_SESSION_TTL_MS) { player.status = "LEFT"; session.connected = false; affected.add(session.roundId); }
      else if (age >= REALTIME_DISCONNECT_AFTER_MS) { player.status = "DISCONNECTED"; session.connected = false; affected.add(session.roundId); }
      else if (age >= REALTIME_IDLE_AFTER_MS) { player.status = "IDLE"; affected.add(session.roundId); }
    }
    return Array.from(affected).map((roundId) => this.snapshot(roundId, now));
  }

  snapshot(roundId: string, now = Date.now()): LobbySnapshot {
    const players = Array.from(this.players.values()).filter((player) => {
      const session = this.sessions.get(player.sessionId); return session?.roundId === roundId && player.status !== "LEFT";
    });
    return { roundId, state: "WAITING", players, connectedCount: players.filter((player) => player.status === "ACTIVE").length, maxPlayers: this.maxPlayers, updatedAt: nowIso(now) };
  }

  getSession(sessionToken: string): PlayerSession | undefined { return this.findByToken(sessionToken); }
  private findByToken(token: string): PlayerSession | undefined { return Array.from(this.sessions.values()).find((session) => session.sessionToken === token); }
  private requireSession(token: string): PlayerSession { const session = this.findByToken(token); if (!session) throw new Error("La sesión realtime no existe o expiró."); return session; }
  private requirePlayer(playerId: string): ConcurrentPlayer { const player = this.players.get(playerId); if (!player) throw new Error("El jugador no existe."); return player; }
  private reconnectExisting(session: PlayerSession, now: number): CommandResult {
    const player = this.requirePlayer(session.playerId); const timestamp = nowIso(now);
    session.connected = true; session.lastSeenAt = timestamp; player.status = "ACTIVE"; player.lastActiveAt = timestamp;
    return { session, player, lobby: this.snapshot(session.roundId, now) };
  }
}

export const playerSessionManager = new PlayerSessionManager();
