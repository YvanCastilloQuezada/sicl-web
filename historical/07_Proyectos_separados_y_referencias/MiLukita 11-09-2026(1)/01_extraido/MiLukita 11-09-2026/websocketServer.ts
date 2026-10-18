import type { Server as HttpServer } from "node:http";
import { WebSocketServer, type WebSocket } from "ws";
import { playerSessionManager } from "./playerSessionManager";
import type { LobbySnapshot, RealtimeClientCommand, RealtimeEnvelope } from "../../shared/realtime";
import { authorizeControllerSocket, sendControllerSocketCommand } from "../controllerLab";

function emit(socket: WebSocket, envelope: RealtimeEnvelope): void {
  if (socket.readyState === 1) socket.send(JSON.stringify(envelope));
}
function reply(socket: WebSocket, type: RealtimeEnvelope["type"], payload: unknown, requestId?: string): void {
  emit(socket, { type, requestId, emittedAt: new Date().toISOString(), payload });
}
function broadcast(sockets: Set<WebSocket>, payload: LobbySnapshot, requestId?: string): void {
  for (const socket of Array.from(sockets)) reply(socket, "LOBBY_STATE", payload, requestId);
}
function parseCommand(value: string): RealtimeClientCommand {
  const command = JSON.parse(value) as RealtimeClientCommand;
  if (!command || typeof command !== "object" || typeof command.type !== "string" || typeof command.requestId !== "string") throw new Error("Comando realtime inválido.");
  return command;
}

export function attachRealtimeWebSocket(server: HttpServer): WebSocketServer {
  const wss = new WebSocketServer({ noServer: true, maxPayload: 16 * 1024 });
  const socketsByRound = new Map<string, Set<WebSocket>>();
  const socketTokens = new Map<WebSocket, string>();
  const controllerSocketMeta = new Map<WebSocket, { publicId: string; channel: "mobile" | "screen"; token: string }>();
  const controllerScreens = new Map<string, Set<WebSocket>>();
  const register = (roundId: string, socket: WebSocket, sessionToken: string) => {
    const sockets = socketsByRound.get(roundId) ?? new Set<WebSocket>();
    sockets.add(socket); socketsByRound.set(roundId, sockets); socketTokens.set(socket, sessionToken);
  };
  const unregister = (socket: WebSocket) => {
    socketTokens.delete(socket);
    for (const [roundId, sockets] of Array.from(socketsByRound.entries())) {
      sockets.delete(socket); if (sockets.size === 0) socketsByRound.delete(roundId);
    }
  };
  const broadcastRound = (roundId: string, snapshot: LobbySnapshot, requestId?: string) => {
    const sockets = socketsByRound.get(roundId); if (sockets) broadcast(sockets, snapshot, requestId);
  };

  server.on("upgrade", (request, socket, head) => {
    const url = new URL(request.url ?? "/", "http://localhost");
    if (url.pathname !== "/realtime" && url.pathname !== "/controller-realtime") return;
    wss.handleUpgrade(request, socket, head, (client) => wss.emit("connection", client, request));
  });
  wss.on("connection", (socket, request) => {
    const url = new URL(request.url ?? "/", "http://localhost");
    if (url.pathname === "/controller-realtime") {
      socket.on("message", async (raw) => {
        try {
          const command = JSON.parse(raw.toString()) as { type?: string; publicId?: string; token?: string; channel?: "mobile" | "screen"; requestId?: string; mode?: "REMOTE" | "GAMEPAD" | "TRACKPAD" | "KEYBOARD"; commandType?: "NAVIGATE" | "SELECT" | "BACK" | "HOME" | "EXIT" | "TEXT" | "PLAYBACK" | "QR_VISIBILITY"; payload?: Record<string, string>; sentAt?: number };
          if (command.type === "CONTROLLER_AUTH") {
            if (!command.publicId || !command.token || (command.channel !== "mobile" && command.channel !== "screen")) throw new Error("Autenticación de control incompleta.");
            const authorization = await authorizeControllerSocket({ publicId: command.publicId, token: command.token, channel: command.channel });
            controllerSocketMeta.set(socket, { publicId: authorization.publicId, channel: command.channel, token: command.token });
            if (command.channel === "screen") { const screens = controllerScreens.get(authorization.publicId) ?? new Set<WebSocket>(); screens.add(socket); controllerScreens.set(authorization.publicId, screens); }
            socket.send(JSON.stringify({ type: "CONTROLLER_READY", emittedAt: new Date().toISOString(), payload: { publicId: authorization.publicId, channel: authorization.channel, expiresAt: authorization.expiresAt, coreAccess: "NONE" } }));
            return;
          }
          const meta = controllerSocketMeta.get(socket);
          if (!meta) throw new Error("Primero autentica la sesión del controlador.");
          if (command.type === "CONTROLLER_PING") { socket.send(JSON.stringify({ type: "CONTROLLER_PONG", emittedAt: new Date().toISOString(), payload: { sentAt: command.sentAt ?? Date.now() } })); return; }
          if (command.type !== "CONTROLLER_COMMAND" || meta.channel !== "mobile" || !command.requestId || !command.mode || !command.commandType) throw new Error("Comando del controlador no permitido.");
          const result = await sendControllerSocketCommand({ publicId: meta.publicId, mobileToken: meta.token, requestId: command.requestId, mode: command.mode, commandType: command.commandType, payload: command.payload ?? {} });
          const envelope = JSON.stringify({ type: "CONTROLLER_COMMAND", emittedAt: new Date().toISOString(), requestId: command.requestId, payload: { ...command, id: result.commandId, commandId: result.publicId, coreAccess: "NONE" } });
          for (const screen of Array.from(controllerScreens.get(meta.publicId) ?? [])) if (screen.readyState === 1) screen.send(envelope);
          socket.send(JSON.stringify({ type: "CONTROLLER_COMMAND_ACCEPTED", emittedAt: new Date().toISOString(), requestId: command.requestId, payload: { commandId: result.publicId, duplicate: result.duplicate, coreAccess: "NONE" } }));
        } catch (error) {
          socket.send(JSON.stringify({ type: "CONTROLLER_ERROR", emittedAt: new Date().toISOString(), payload: { message: error instanceof Error ? error.message : "No se pudo procesar el control." } }));
        }
      });
      socket.on("close", () => { const meta = controllerSocketMeta.get(socket); if (meta?.channel === "screen") { const screens = controllerScreens.get(meta.publicId); screens?.delete(socket); if (screens?.size === 0) controllerScreens.delete(meta.publicId); } controllerSocketMeta.delete(socket); });
      return;
    }
    socket.on("message", (raw) => {
      try {
        const command = parseCommand(raw.toString());
        if (command.type === "JOIN") {
          const result = playerSessionManager.join(command);
          register(command.roundId, socket, result.session.sessionToken);
          reply(socket, "SESSION_READY", { session: result.session, player: result.player }, command.requestId);
          broadcastRound(command.roundId, result.lobby, command.requestId);
          return;
        }
        if (command.type === "HEARTBEAT") {
          const result = playerSessionManager.heartbeat(command.sessionToken, command.requestId);
          reply(socket, "HEARTBEAT_ACK", { player: result.player, lastSeenAt: result.session.lastSeenAt }, command.requestId);
          return;
        }
        if (command.type === "RECONNECT") {
          const result = playerSessionManager.reconnect(command.sessionToken, command.deviceId, command.requestId);
          register(result.session.roundId, socket, result.session.sessionToken);
          reply(socket, "RECONNECT_ACCEPTED", { session: result.session, player: result.player }, command.requestId);
          broadcastRound(result.session.roundId, result.lobby, command.requestId);
          reply(socket, "STATE_SYNC", result.lobby, command.requestId);
          return;
        }
        const result = playerSessionManager.leave(command.sessionToken, command.requestId);
        broadcastRound(result.session.roundId, result.lobby, command.requestId);
        reply(socket, "PLAYER_LEFT", { player: result.player }, command.requestId);
      } catch (error) {
        reply(socket, "ERROR", { code: "REALTIME_COMMAND_REJECTED", message: error instanceof Error ? error.message : "No se pudo procesar la acción." });
      }
    });
    socket.on("close", () => {
      const token = socketTokens.get(socket); const snapshot = token ? playerSessionManager.disconnect(token) : undefined;
      if (snapshot) broadcastRound(snapshot.roundId, snapshot);
      unregister(socket);
    });
  });
  const sweepTimer = setInterval(() => {
    for (const snapshot of playerSessionManager.sweep()) broadcastRound(snapshot.roundId, snapshot);
  }, 15_000);
  sweepTimer.unref();
  return wss;
}
