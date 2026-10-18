import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const windowHours = 24;
const intervalMinutes = 1;
const duplicateAttemptsPerTick = 1;
const taskUid = "simulation-task-24h";
const startAt = new Date(process.env.SIMULATION_START_AT ?? "2026-08-26T00:00:00.000Z");
const outputPath = resolve(process.env.SIMULATION_OUTPUT ?? "reports/autonomy-24h-simulation.json");
const ticks = Math.floor((windowHours * 60) / intervalMinutes);
const claimKeys = new Set();
let totalAttempts = 0;

for (let tick = 0; tick < ticks; tick += 1) {
  const at = new Date(startAt.getTime() + tick * intervalMinutes * 60_000);
  const bucket = Math.floor(at.getTime() / (intervalMinutes * 60_000));
  const claimKey = `supervised-worker:${taskUid}:${bucket}`;
  for (let attempt = 0; attempt <= duplicateAttemptsPerTick; attempt += 1) {
    totalAttempts += 1;
    claimKeys.add(claimKey);
  }
}

const uniqueClaims = claimKeys.size;
const duplicateClaims = totalAttempts - uniqueClaims;
const report = {
  taskUid,
  startAt: startAt.toISOString(),
  endAt: new Date(startAt.getTime() + ticks * intervalMinutes * 60_000).toISOString(),
  windowHours,
  intervalMinutes,
  ticks,
  totalAttempts,
  uniqueClaims,
  duplicateClaims,
  duplicateRate: Number((duplicateClaims / totalAttempts).toFixed(6)),
  stableClaimKeys: uniqueClaims === ticks,
  passed: uniqueClaims === ticks && duplicateClaims === ticks * duplicateAttemptsPerTick,
  limitations: [
    "Simulación determinista de buckets y claims; no ejecuta cron ni una base de datos real.",
    "No certifica disponibilidad 24/7, carga, latencia ni recuperación de infraestructura.",
    "La autonomía operativa continúa protegida por el kill switch y depende del proveedor de ejecución.",
  ],
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ ...report, outputPath }, null, 2));
process.exitCode = report.passed ? 0 : 1;
