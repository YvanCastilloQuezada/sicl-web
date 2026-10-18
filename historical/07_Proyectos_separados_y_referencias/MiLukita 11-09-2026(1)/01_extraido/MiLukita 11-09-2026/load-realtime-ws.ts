import { WebSocket } from "ws";
import { performance } from "node:perf_hooks";

type Client = { socket: WebSocket; token: string; deviceId: string };
const url = process.env.REALTIME_WS_URL ?? "ws://127.0.0.1:3000/realtime";
const roundId = `ws-load-${Date.now()}`;
const count = Number(process.env.REALTIME_WS_CLIENTS ?? 100);
const durationMs = Number(process.env.REALTIME_WS_DURATION_MS ?? 0);
const timeouts = new Set<NodeJS.Timeout>();
const percentile = (values: number[], p: number) => { const sorted = [...values].sort((a, b) => a - b); return sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * p) - 1)] ?? 0; };
const waitFor = (socket: WebSocket, expected: string, timeoutMs = 5_000) => new Promise<{ latency: number; payload?: { session?: { sessionToken?: string } } }>((resolve, reject) => { const started = performance.now(); const timer = setTimeout(() => { timeouts.delete(timer); reject(new Error(`Timeout esperando ${expected}`)); }, timeoutMs); timeouts.add(timer); const onMessage = (raw: Buffer) => { try { const envelope = JSON.parse(raw.toString()) as { type?: string }; if (envelope.type !== expected) return; clearTimeout(timer); timeouts.delete(timer); socket.off("message", onMessage); resolve({ latency: performance.now() - started, payload: envelope.payload as { session?: { sessionToken?: string } } | undefined }); } catch { /* ignorar mensajes no relacionados */ } }; socket.on("message", onMessage); });
const open = (deviceId: string) => new Promise<WebSocket>((resolve, reject) => { const socket = new WebSocket(url); const timer = setTimeout(() => { socket.terminate(); reject(new Error("Timeout abriendo WebSocket")); }, 5_000); socket.once("open", () => { clearTimeout(timer); resolve(socket); }); socket.once("error", (error) => { clearTimeout(timer); reject(error); }); });
const join = async (index: number): Promise<{ client: Client; latency: number }> => { const deviceId = `ws-device-${index}`; const socket = await open(deviceId); const requestId = `ws-join-${index}-${Date.now()}`; const response = waitFor(socket, "SESSION_READY"); socket.send(JSON.stringify({ type: "JOIN", requestId, roundId, deviceId, nickname: `WS ${index}`, avatar: "L" })); const ready = await response; return { client: { socket, token: ready.payload?.session?.sessionToken ?? "", deviceId }, latency: ready.latency }; };
const clients: Client[] = []; const errors: string[] = []; const joinLatencies: number[] = []; const reconnectLatencies: number[] = [];
try {
  const joined = await Promise.allSettled(Array.from({ length: count }, (_, index) => join(index)));
  joined.forEach((result) => { if (result.status === "fulfilled") { clients.push(result.value.client); joinLatencies.push(result.value.latency); } else errors.push(String(result.reason)); });
  clients.forEach((client) => client.socket.close());
  await new Promise((resolve) => setTimeout(resolve, 150));
  const reconnections = await Promise.allSettled(clients.map(async (client, index) => { const socket = await open(client.deviceId); const response = waitFor(socket, "RECONNECT_ACCEPTED"); socket.send(JSON.stringify({ type: "RECONNECT", requestId: `ws-reconnect-${index}-${Date.now()}`, sessionToken: client.token, deviceId: client.deviceId })); const result = await response; client.socket = socket; return result.latency; }));
  reconnections.forEach((result) => result.status === "fulfilled" ? reconnectLatencies.push(result.value) : errors.push(String(result.reason)));
  if (durationMs > 0) {
    const heartbeat = setInterval(() => clients.forEach((client) => client.socket.readyState === WebSocket.OPEN && client.socket.ping()), 20_000);
    await new Promise((resolve) => setTimeout(resolve, durationMs));
    clearInterval(heartbeat);
  }
} finally { clients.forEach((client) => client.socket.close()); timeouts.forEach(clearTimeout); }
console.log(JSON.stringify({ generatedAt: new Date().toISOString(), url, roundId, requestedClients: count, joined: joinLatencies.length, reconnected: reconnectLatencies.length, errors: errors.length, joinMs: { p50: Number(percentile(joinLatencies, .5).toFixed(3)), p95: Number(percentile(joinLatencies, .95).toFixed(3)), p99: Number(percentile(joinLatencies, .99).toFixed(3)) }, reconnectMs: { p50: Number(percentile(reconnectLatencies, .5).toFixed(3)), p95: Number(percentile(reconnectLatencies, .95).toFixed(3)), p99: Number(percentile(reconnectLatencies, .99).toFixed(3)) }, errorSamples: errors.slice(0, 5), durationMs, note: "Staging local sobre WebSocket; no equivale a certificación multiinstancia, red pública o carga de base de datos." }, null, 2));
