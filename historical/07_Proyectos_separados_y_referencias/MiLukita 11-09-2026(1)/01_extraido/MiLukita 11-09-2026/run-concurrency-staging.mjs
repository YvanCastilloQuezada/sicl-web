import { performance } from "node:perf_hooks";
import { randomBytes } from "node:crypto";

const stagingUrl = process.env.STAGING_DATABASE_URL;
const pilotUrl = process.env.DATABASE_URL;
const allow = process.env.ALLOW_STAGING_DB_TEST === "1";
const reportPath = process.env.CONCURRENCY_REPORT_PATH ?? "audit-package/staging-concurrency-report.json";

async function writeReport(report) {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
}

if (!stagingUrl) {
  const report = { status: "BLOCKED", reason: "STAGING_DATABASE_URL no está configurada; no se ejecutó ninguna consulta." };
  await writeReport(report);
  console.log(JSON.stringify(report));
  process.exit(0);
}
if (!allow) {
  const report = { status: "BLOCKED", reason: "Se requiere ALLOW_STAGING_DB_TEST=1 para autorizar la prueba." };
  await writeReport(report);
  console.log(JSON.stringify(report));
  process.exit(0);
}
if (pilotUrl && stagingUrl === pilotUrl) {
  const report = { status: "BLOCKED", reason: "STAGING_DATABASE_URL coincide con DATABASE_URL; se evita tocar la base del piloto." };
  await writeReport(report);
  console.log(JSON.stringify(report));
  process.exit(0);
}

process.env.DATABASE_URL = stagingUrl;
const [{ getDb }, schema, drizzle] = await Promise.all([
  import("../server/db.ts"),
  import("../drizzle/schema.ts"),
  import("drizzle-orm"),
]);
const db = await getDb();
if (!db || typeof db.transaction !== "function") throw new Error("Staging no expone un adaptador transaccional compatible.");
const { gameRounds, gameRulesets } = schema;
const { desc, eq, sql } = drizzle;
const { closeAndDrawRound } = await import("../server/pilot.ts");
const publicId = `STG-CONC-${Date.now()}-${randomBytes(4).toString("hex").toUpperCase()}`;
let roundId;
const startedAt = new Date().toISOString();
try {
  const ruleset = (await db.select().from(gameRulesets).where(eq(gameRulesets.gameType, "ruleta")).orderBy(desc(gameRulesets.createdAt)).limit(1))[0];
  if (!ruleset) throw new Error("No existe ruleset de ruleta para crear el fixture aislado.");
  const now = new Date();
  const secret = randomBytes(32).toString("hex");
  const serverSeedHash = randomBytes(32).toString("hex");
  await db.insert(gameRounds).values({
    publicId,
    gameType: "ruleta",
    rulesetId: ruleset.id,
    state: "locked",
    opensAt: new Date(now.getTime() - 60_000),
    closesAt: new Date(now.getTime() - 1_000),
    serverSeedHash,
    serverSeedSecret: secret,
    jackpotPoolCredits: 0,
    algorithmVersion: "staging-concurrency-v1",
  });
  roundId = (await db.select({ id: gameRounds.id }).from(gameRounds).where(eq(gameRounds.publicId, publicId)).limit(1))[0]?.id;
  if (!roundId) throw new Error("No se pudo crear el fixture de ronda.");
  const t0 = performance.now();
  const results = await Promise.allSettled([
    closeAndDrawRound(undefined, publicId),
    closeAndDrawRound(undefined, publicId),
  ]);
  const elapsedMs = Number((performance.now() - t0).toFixed(2));
  const settled = results.filter((item) => item.status === "fulfilled");
  const rejected = results.filter((item) => item.status === "rejected");
  const finalRound = (await db.select().from(gameRounds).where(eq(gameRounds.id, roundId)).limit(1))[0];
  const report = {
    status: finalRound?.state === "settled" && settled.length === 2 ? "PASS" : "FAIL",
    environment: "staging",
    startedAt,
    finishedAt: new Date().toISOString(),
    publicId,
    workers: 2,
    elapsedMs,
    fulfilled: settled.length,
    rejected: rejected.length,
    rejectionReasons: rejected.map((item) => item.reason instanceof Error ? item.reason.message : String(item.reason)),
    finalState: finalRound?.state ?? null,
    settlementEvidence: settled.map((item) => item.status === "fulfilled" ? { publicId: item.value?.publicId, state: item.value?.state } : null),
    safety: "Fixture aislado; se elimina en finally. No se usa DATABASE_URL cuando coincide con staging.",
  };
  await writeReport(report);
  console.log(JSON.stringify(report));
  if (report.status !== "PASS") process.exitCode = 1;
} finally {
  if (roundId) await db.delete(gameRounds).where(eq(gameRounds.id, roundId));
  await db.$client?.end?.();
}
