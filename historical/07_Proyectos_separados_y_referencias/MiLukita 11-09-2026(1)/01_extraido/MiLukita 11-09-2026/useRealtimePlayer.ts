import { useCallback, useEffect, useRef, useState } from "react";
import type { ConcurrentPlayer, LobbySnapshot, PlayerSession, RealtimeEnvelope } from "@shared/realtime";

export type RealtimeConnectionStatus = "idle" | "connecting" | "connected" | "reconnecting" | "error" | "closed";

type Options = { roundId: string | null; nickname: string; avatar: string };
type Result = { session: PlayerSession; player: ConcurrentPlayer };

function requestId(prefix: string): string { return `${prefix}-${crypto.randomUUID()}`; }
function sessionKey(roundId: string): string { return `milukita-realtime-session:${roundId}`; }
function deviceKey(): string {
  const key = "milukita-realtime-device";
  const stored = window.localStorage.getItem(key);
  if (stored) return stored;
  const value = `device-${crypto.randomUUID()}`;
  window.localStorage.setItem(key, value);
  return value;
}

export function useRealtimePlayer({ roundId, nickname, avatar }: Options) {
  const [status, setStatus] = useState<RealtimeConnectionStatus>("idle");
  const [player, setPlayer] = useState<ConcurrentPlayer | null>(null);
  const [session, setSession] = useState<PlayerSession | null>(null);
  const [lobby, setLobby] = useState<LobbySnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const heartbeatRef = useRef<number | null>(null);
  const reconnectAttemptRef = useRef(0);
  const sessionRef = useRef<PlayerSession | null>(null);

  const clearHeartbeat = useCallback(() => {
    if (heartbeatRef.current !== null) window.clearInterval(heartbeatRef.current);
    heartbeatRef.current = null;
  }, []);

  const disconnect = useCallback((sendLeave = false) => {
    const socket = socketRef.current;
    clearHeartbeat();
    if (sendLeave && socket?.readyState === WebSocket.OPEN && sessionRef.current) {
      socket.send(JSON.stringify({ type: "LEAVE", requestId: requestId("leave"), sessionToken: sessionRef.current.sessionToken }));
    }
    socket?.close(); socketRef.current = null;
    if (sendLeave && roundId) window.localStorage.removeItem(sessionKey(roundId));
    setStatus("closed");
  }, [clearHeartbeat, roundId]);

  const connect = useCallback(() => {
    if (!roundId || !nickname.trim() || socketRef.current?.readyState === WebSocket.OPEN || socketRef.current?.readyState === WebSocket.CONNECTING) return;
    setStatus(reconnectAttemptRef.current ? "reconnecting" : "connecting"); setError(null);
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const socket = new WebSocket(`${protocol}//${window.location.host}/realtime`);
    socketRef.current = socket;
    socket.addEventListener("open", () => {
      reconnectAttemptRef.current = 0; setStatus("connected");
      const stored = window.localStorage.getItem(sessionKey(roundId));
      const common = { requestId: requestId(stored ? "reconnect" : "join"), deviceId: deviceKey() };
      socket.send(JSON.stringify(stored ? { type: "RECONNECT", ...common, sessionToken: stored } : { type: "JOIN", ...common, roundId, nickname: nickname.trim(), avatar }));
      clearHeartbeat();
      heartbeatRef.current = window.setInterval(() => {
        const token = window.localStorage.getItem(sessionKey(roundId));
        if (token && socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type: "HEARTBEAT", requestId: requestId("heartbeat"), sessionToken: token }));
      }, 20_000);
    });
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data) as RealtimeEnvelope<any>;
      if (message.type === "SESSION_READY" || message.type === "RECONNECT_ACCEPTED") {
        const result = message.payload as Result; sessionRef.current = result.session; setSession(result.session); setPlayer(result.player);
        window.localStorage.setItem(sessionKey(roundId), result.session.sessionToken);
      } else if (message.type === "LOBBY_STATE" || message.type === "STATE_SYNC") setLobby(message.payload as LobbySnapshot);
      else if (message.type === "ERROR") { setError(message.payload?.message ?? "No se pudo sincronizar la sala."); setStatus("error"); }
    });
    socket.addEventListener("error", () => { setError("La conexión realtime no está disponible. Puedes reintentar sin perder tu sesión."); setStatus("error"); });
    socket.addEventListener("close", () => { clearHeartbeat(); socketRef.current = null; setStatus("closed"); });
  }, [avatar, clearHeartbeat, nickname, roundId]);

  useEffect(() => { if (roundId && nickname.trim()) connect(); return () => disconnect(false); }, [connect, disconnect, nickname, roundId]);
  return { status, player, session, lobby, error, connect, disconnect: () => disconnect(true) };
}
