export const AUTONOMY_SIMULATION_DEFAULTS = {
  windowHours: 24,
  intervalMinutes: 1,
  duplicateAttemptsPerTick: 1,
} as const;

export type AutonomySimulationOptions = {
  startAt?: Date;
  windowHours?: number;
  intervalMinutes?: number;
  duplicateAttemptsPerTick?: number;
  taskUid?: string;
};

export type AutonomySimulationSample = {
  attempt: number;
  at: string;
  taskUid: string;
  bucket: number;
  claimKey: string;
  execution: "PRIMARY" | "DUPLICATE";
  expectedAction: "EXECUTE" | "SKIP_DUPLICATE";
};

export type AutonomySimulationReport = {
  taskUid: string;
  startAt: string;
  endAt: string;
  windowHours: number;
  intervalMinutes: number;
  ticks: number;
  totalAttempts: number;
  uniqueClaims: number;
  duplicateClaims: number;
  duplicateRate: number;
  stableClaimKeys: boolean;
  passed: boolean;
  samples: AutonomySimulationSample[];
  limitations: string[];
};

function bucketFor(at: Date, intervalMinutes: number) {
  return Math.floor(at.getTime() / (intervalMinutes * 60_000));
}

function claimKeyFor(taskUid: string, bucket: number) {
  return `supervised-worker:${taskUid}:${bucket}`;
}

export function simulateAutonomyWindow(options: AutonomySimulationOptions = {}): AutonomySimulationReport {
  const windowHours = options.windowHours ?? AUTONOMY_SIMULATION_DEFAULTS.windowHours;
  const intervalMinutes = options.intervalMinutes ?? AUTONOMY_SIMULATION_DEFAULTS.intervalMinutes;
  const duplicateAttemptsPerTick = options.duplicateAttemptsPerTick ?? AUTONOMY_SIMULATION_DEFAULTS.duplicateAttemptsPerTick;
  const taskUid = options.taskUid ?? "simulation-task-24h";
  const startAt = options.startAt ?? new Date("2026-08-26T00:00:00.000Z");

  if (!Number.isInteger(windowHours) || windowHours <= 0) throw new Error("windowHours debe ser un entero positivo.");
  if (!Number.isInteger(intervalMinutes) || intervalMinutes <= 0) throw new Error("intervalMinutes debe ser un entero positivo.");
  if (!Number.isInteger(duplicateAttemptsPerTick) || duplicateAttemptsPerTick < 0) throw new Error("duplicateAttemptsPerTick no puede ser negativo.");

  const ticks = Math.floor((windowHours * 60) / intervalMinutes);
  const samples: AutonomySimulationSample[] = [];
  const seen = new Set<string>();
  let attempt = 0;

  for (let tick = 0; tick < ticks; tick += 1) {
    const at = new Date(startAt.getTime() + tick * intervalMinutes * 60_000);
    const bucket = bucketFor(at, intervalMinutes);
    const claimKey = claimKeyFor(taskUid, bucket);
    const attemptsAtTick = 1 + duplicateAttemptsPerTick;
    for (let duplicateIndex = 0; duplicateIndex < attemptsAtTick; duplicateIndex += 1) {
      const duplicate = duplicateIndex > 0;
      attempt += 1;
      samples.push({ attempt, at: at.toISOString(), taskUid, bucket, claimKey, execution: duplicate ? "DUPLICATE" : "PRIMARY", expectedAction: duplicate ? "SKIP_DUPLICATE" : "EXECUTE" });
      seen.add(claimKey);
    }
  }

  const uniqueClaims = seen.size;
  const totalAttempts = samples.length;
  const duplicateClaims = totalAttempts - uniqueClaims;
  const stableClaimKeys = samples.every((sample) => sample.claimKey === claimKeyFor(sample.taskUid, sample.bucket));
  const passed = ticks > 0 && uniqueClaims === ticks && duplicateClaims === ticks * duplicateAttemptsPerTick && stableClaimKeys;

  return {
    taskUid,
    startAt: startAt.toISOString(),
    endAt: new Date(startAt.getTime() + ticks * intervalMinutes * 60_000).toISOString(),
    windowHours,
    intervalMinutes,
    ticks,
    totalAttempts,
    uniqueClaims,
    duplicateClaims,
    duplicateRate: totalAttempts ? Number((duplicateClaims / totalAttempts).toFixed(6)) : 0,
    stableClaimKeys,
    passed,
    samples,
    limitations: [
      "Simulación determinista de claves y duplicados; no ejecuta la base de datos ni cron real.",
      "No constituye certificación de disponibilidad 24/7 ni prueba de carga en producción.",
      "La autonomía sigue sujeta al scheduler, al proveedor de ejecución y al kill switch operativo.",
    ],
  };
}

export function summarizeAutonomySimulation(report: AutonomySimulationReport) {
  return {
    passed: report.passed,
    windowHours: report.windowHours,
    ticks: report.ticks,
    totalAttempts: report.totalAttempts,
    uniqueClaims: report.uniqueClaims,
    duplicateClaims: report.duplicateClaims,
    duplicateRate: report.duplicateRate,
    stableClaimKeys: report.stableClaimKeys,
  };
}
