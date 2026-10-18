import type { Server } from "node:http";
import { WebSocketServer, type WebSocket } from "ws";

export type ParametricRealtimeEvent = { type: "UPLOAD_STARTED" | "VALIDATION_PROGRESS" | "REVIEW_REQUIRED" | "UPLOAD_COMPLETED" | "UPLOAD_FAILED"; projectId: string; artifactId?: string; fileName?: string; progress: number; message: string; humanReviewRequired: boolean; at: string };

const channels = new Map<string, Set<WebSocket>>();
let attached = false;

export function publishParametricEvent(channel: string, event: ParametricRealtimeEvent) {
  const subscribers = channels.get(channel);
  if (!subscribers) return;
  const payload = JSON.stringify(event);
  subscribers.forEach((socket) => { if (socket.readyState === 1) socket.send(payload); });
}

export function attachParametricWebSocket(server: Server) {
  if (attached) return;
  attached = true;
  const wss = new WebSocketServer({ server, path: "/ws/parametric" });
  wss.on("connection", (socket) => {
    let channel: string | null = null;
    socket.on("message", (raw) => {
      try {
        const message = JSON.parse(raw.toString()) as { type?: string; channel?: string };
        if (message.type !== "subscribe" || !message.channel || !/^project:[A-Za-z0-9-]{3,128}$/.test(message.channel)) {
          socket.send(JSON.stringify({ type: "UPLOAD_FAILED", progress: 0, message: "Invalid subscription", humanReviewRequired: true, at: new Date().toISOString() }));
          return;
        }
        channel = message.channel;
        const subscribers = channels.get(channel) ?? new Set<WebSocket>();
        subscribers.add(socket);
        channels.set(channel, subscribers);
        socket.send(JSON.stringify({ type: "VALIDATION_PROGRESS", progress: 0, message: "Subscribed to governed progress channel", humanReviewRequired: true, at: new Date().toISOString() }));
      } catch {
        socket.send(JSON.stringify({ type: "UPLOAD_FAILED", progress: 0, message: "Invalid WebSocket message", humanReviewRequired: true, at: new Date().toISOString() }));
      }
    });
    socket.on("close", () => { if (channel) { const subscribers = channels.get(channel); subscribers?.delete(socket); if (subscribers && subscribers.size === 0) channels.delete(channel); } });
  });
  return wss;
}
