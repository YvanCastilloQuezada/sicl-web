import type { IncomingMessage, Server } from "node:http";
import { WebSocketServer, type WebSocket } from "ws";

export type ParametricRealtimeEvent = { type: "UPLOAD_STARTED" | "VALIDATION_PROGRESS" | "REVIEW_REQUIRED" | "UPLOAD_COMPLETED" | "UPLOAD_FAILED" | "CURSOR_MOVED" | "PRESENCE_JOINED" | "PRESENCE_LEFT"; projectId: string; artifactId?: string; fileName?: string; progress: number; message: string; humanReviewRequired: boolean; at: string; participantId?: string; displayName?: string; x?: number; y?: number; color?: string };

const channels = new Map<string, Set<WebSocket>>();
let attached = false;
const MAX_MESSAGE_BYTES = 16 * 1024;
const MAX_SUBSCRIBERS_PER_CHANNEL = 50;
const MAX_MESSAGES_PER_MINUTE = 30;

function allowedOrigin(request: IncomingMessage) {
  const origin = request.headers.origin;
  if (!origin) return true;
  const host = request.headers.host;
  const expected = host ? `${request.headers["x-forwarded-proto"] === "https" ? "https" : "http"}://${host}` : "";
  const configured = (process.env.ARKI_ALLOWED_ORIGINS ?? "").split(",").map((value) => value.trim()).filter(Boolean);
  return origin === expected || configured.includes(origin);
}

export function publishParametricEvent(channel: string, event: ParametricRealtimeEvent) {
  const subscribers = channels.get(channel);
  if (!subscribers) return;
  const payload = JSON.stringify(event);
  subscribers.forEach((socket) => { if (socket.readyState === 1) socket.send(payload); });
}

export function publishCollaborativeCursor(channel: string, input: { projectId: string; participantId: string; displayName?: string; x: number; y: number; color?: string }) {
  if (!Number.isFinite(input.x) || !Number.isFinite(input.y) || input.participantId.length > 128) return false;
  publishParametricEvent(channel, { type: "CURSOR_MOVED", projectId: input.projectId, participantId: input.participantId, displayName: input.displayName?.slice(0, 80), x: input.x, y: input.y, color: input.color, progress: 0, message: "Collaborative cursor update", humanReviewRequired: false, at: new Date().toISOString() });
  return true;
}

export function attachParametricWebSocket(server: Server) {
  if (attached) return;
  attached = true;
  const wss = new WebSocketServer({ server, path: "/ws/parametric", maxPayload: MAX_MESSAGE_BYTES });
  wss.on("connection", (socket, request) => {
    if (!allowedOrigin(request)) {
      socket.close(1008, "Origin not allowed");
      return;
    }
    let channel: string | null = null;
    let messages = 0;
    let windowReset = Date.now() + 60_000;
    const heartbeat = setInterval(() => {
      if (socket.readyState !== 1) return;
      socket.ping();
    }, 30_000);
    socket.on("message", (raw) => {
      const now = Date.now();
      if (now >= windowReset) { messages = 0; windowReset = now + 60_000; }
      messages += 1;
      if (messages > MAX_MESSAGES_PER_MINUTE) {
        socket.close(1008, "Message rate limit exceeded");
        return;
      }
      if (Buffer.byteLength(raw.toString(), "utf8") > MAX_MESSAGE_BYTES) {
        socket.close(1009, "Message too large");
        return;
      }
      try {
        const message = JSON.parse(raw.toString()) as { type?: string; channel?: string; projectId?: string; participantId?: string; displayName?: string; x?: number; y?: number; color?: string };
        if (message.type === "cursor" && channel && message.projectId && message.participantId && Number.isFinite(message.x) && Number.isFinite(message.y)) {
          publishCollaborativeCursor(channel, { projectId: message.projectId, participantId: message.participantId, displayName: message.displayName, x: message.x as number, y: message.y as number, color: message.color });
          return;
        }
        if (message.type !== "subscribe" || !message.channel || !/^project:[A-Za-z0-9-]{3,128}$/.test(message.channel)) {
          socket.send(JSON.stringify({ type: "UPLOAD_FAILED", progress: 0, message: "Invalid subscription", humanReviewRequired: true, at: new Date().toISOString() }));
          return;
        }
        if (channel && channel !== message.channel) {
          socket.close(1008, "Only one channel per socket");
          return;
        }
        const subscribers = channels.get(message.channel) ?? new Set<WebSocket>();
        if (!subscribers.has(socket) && subscribers.size >= MAX_SUBSCRIBERS_PER_CHANNEL) {
          socket.close(1013, "Channel capacity reached");
          return;
        }
        channel = message.channel;
        subscribers.add(socket);
        channels.set(channel, subscribers);
        socket.send(JSON.stringify({ type: "VALIDATION_PROGRESS", progress: 0, message: "Subscribed to governed progress channel", humanReviewRequired: true, at: new Date().toISOString() }));
      } catch {
        socket.send(JSON.stringify({ type: "UPLOAD_FAILED", progress: 0, message: "Invalid WebSocket message", humanReviewRequired: true, at: new Date().toISOString() }));
      }
    });
    socket.on("close", () => {
      clearInterval(heartbeat);
      if (channel) {
        const subscribers = channels.get(channel);
        subscribers?.delete(socket);
        if (subscribers && subscribers.size === 0) channels.delete(channel);
      }
    });
  });
  return wss;
}
