import { performance } from "node:perf_hooks";
import { PlayerSessionManager } from "../server/realtime/playerSessionManager";

const levels = [1, 10, 25, 50, 75, 100];
const manager = new PlayerSessionManager(100);
const roundId = `load-${Date.now()}`;
const rows: Array<Record<string, number | string>> = [];
let now = Date.now();
const sessions: string[] = [];

for (const target of levels) {
  const start = performance.now();
  while (sessions.length < target) {
    const index = sessions.length;
    const result = manager.join({ roundId, deviceId: `device-${index}`, nickname: `Player ${index}`, avatar: "L", requestId: `join-${index}` }, now);
    sessions.push(result.session.sessionToken);
  }
  const joinMs = performance.now() - start;
  const heartbeatStart = performance.now();
  for (const [index, token] of sessions.entries()) manager.heartbeat(token, `heartbeat-${target}-${index}`, now + 1);
  const heartbeatMs = performance.now() - heartbeatStart;
  const snapshot = manager.snapshot(roundId, now + 1);
  rows.push({ target, connected: snapshot.connectedCount, joinMs: Number(joinMs.toFixed(3)), heartbeatMs: Number(heartbeatMs.toFixed(3)), errors: 0 });
  now += 1;
}

const reconnectStart = performance.now();
for (const [index, token] of sessions.entries()) manager.reconnect(token, `device-${index}`, `reconnect-${index}`, now + 2);
const reconnectMs = performance.now() - reconnectStart;
const leaveStart = performance.now();
for (const [index, token] of sessions.entries()) manager.leave(token, `leave-${index}`, now + 3);
const leaveMs = performance.now() - leaveStart;
const final = manager.snapshot(roundId, now + 3);
const report = { generatedAt: new Date().toISOString(), roundId, levels: rows, reconnect100Ms: Number(reconnectMs.toFixed(3)), leave100Ms: Number(leaveMs.toFixed(3)), finalActive: final.connectedCount, maxPlayers: final.maxPlayers, note: "Prueba local determinista del gestor en memoria; no sustituye carga de red, base de datos ni certificación de infraestructura." };
console.log(JSON.stringify(report, null, 2));
