export const PLAYER_STATUSES = ["ACTIVE", "IDLE", "LEFT", "DISCONNECTED"] as const;
export type PlayerStatus = (typeof PLAYER_STATUSES)[number];

export type ConcurrentPlayer = {
  id: string;
  sessionId: string;
  deviceId: string;
  nickname: string;
  avatar: string;
  status: PlayerStatus;
  joinedAt: string;
  lastActiveAt: string;
  score: number;
  roundScores: Record<string, number>;
  totalWins: number;
  totalGames: number;
  totalHits: number;
  totalDamage: number;
  tokens: number;
};

export type PlayerSession = {
  sessionId: string;
  sessionToken: string;
  roundId: string;
  playerId: string;
  deviceId: string;
  connected: boolean;
  createdAt: string;
  lastSeenAt: string;
};

export type LobbySnapshot = {
  roundId: string;
  state: "WAITING" | "ACTIVE" | "CLOSING" | "FINISHED";
  players: ConcurrentPlayer[];
  connectedCount: number;
  maxPlayers: number;
  updatedAt: string;
};

export const REALTIME_EVENT_TYPES = [
  "SESSION_READY",
  "LOBBY_STATE",
  "PLAYER_JOINED",
  "PLAYER_UPDATED",
  "PLAYER_LEFT",
  "RECONNECT_ACCEPTED",
  "STATE_SYNC",
  "HEARTBEAT_ACK",
  "ERROR",
] as const;
export type RealtimeEventType = (typeof REALTIME_EVENT_TYPES)[number];

export type RealtimeEnvelope<T = unknown> = {
  type: RealtimeEventType;
  requestId?: string;
  emittedAt: string;
  payload: T;
};

export type RealtimeClientCommand =
  | { type: "JOIN"; requestId: string; roundId: string; deviceId: string; nickname: string; avatar: string; sessionToken?: string }
  | { type: "HEARTBEAT"; requestId: string; sessionToken: string }
  | { type: "RECONNECT"; requestId: string; sessionToken: string; deviceId: string }
  | { type: "LEAVE"; requestId: string; sessionToken: string };

export function createPlayerId(roundId: string, deviceId: string): string {
  return `player:${roundId}:${deviceId}`;
}

export function validateNickname(nickname: string): string {
  const value = nickname.trim().replace(/\s+/g, " ");
  if (value.length < 2 || value.length > 24) throw new Error("El nickname debe tener entre 2 y 24 caracteres.");
  return value;
}

export function validateDeviceId(deviceId: string): string {
  const value = deviceId.trim();
  if (value.length < 4 || value.length > 96) throw new Error("El dispositivo no es válido.");
  return value;
}
