import { createServer } from "node:http";
import { afterEach, describe, expect, it } from "vitest";
import WebSocket from "ws";
import { attachRealtimeWebSocket } from "./websocketServer";

const openSocket = (url: string) => new Promise<WebSocket>((resolve, reject) => {
  const socket = new WebSocket(url);
  socket.once("open", () => resolve(socket));
  socket.once("error", reject);
});
const collectMessages = (socket: WebSocket, count: number) => new Promise<any[]>((resolve, reject) => {
  const messages: any[] = [];
  const onMessage = (raw: WebSocket.RawData) => {
    messages.push(JSON.parse(raw.toString()));
    if (messages.length === count) { cleanup(); resolve(messages); }
  };
  const onError = (error: Error) => { cleanup(); reject(error); };
  const cleanup = () => { socket.off("message", onMessage); socket.off("error", onError); };
  socket.on("message", onMessage); socket.once("error", onError);
});

describe("realtime websocket", () => {
  let server: ReturnType<typeof createServer> | undefined;
  afterEach(async () => {
    if (!server) return;
    await new Promise<void>((resolve) => server?.close(() => resolve()));
    server = undefined;
  });

  it("acepta JOIN y HEARTBEAT con estado de lobby", async () => {
    server = createServer(); attachRealtimeWebSocket(server);
    await new Promise<void>((resolve) => server?.listen(0, "127.0.0.1", () => resolve()));
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("No se obtuvo el puerto de prueba.");
    const socket = await openSocket(`ws://127.0.0.1:${address.port}/realtime`);
    const joinMessages = collectMessages(socket, 2);
    socket.send(JSON.stringify({ type: "JOIN", requestId: "join-ws-01", roundId: "round-ws-01", deviceId: "device-ws-01", nickname: "Luz", avatar: "default" }));
    const [ready, lobby] = await joinMessages;
    expect(ready.type).toBe("SESSION_READY");
    expect(lobby.type).toBe("LOBBY_STATE");
    expect(lobby.payload.connectedCount).toBe(1);
    const heartbeatMessages = collectMessages(socket, 1);
    socket.send(JSON.stringify({ type: "HEARTBEAT", requestId: "heartbeat-ws-01", sessionToken: ready.payload.session.sessionToken }));
    const [heartbeat] = await heartbeatMessages;
    expect(heartbeat.type).toBe("HEARTBEAT_ACK");
    await new Promise<void>((resolve) => { socket.once("close", () => resolve()); socket.close(); });
  });
});
