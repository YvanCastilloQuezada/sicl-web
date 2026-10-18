import { desc, eq } from "drizzle-orm";
import { auditEvents, gameRounds, operationalEvents, pilotTickets } from "../drizzle/schema";
import { getDb } from "./db";
import { appendOperationalEvent } from "./eventStore";

export type AuditSeverity = "PASS" | "WARNING" | "ANOMALY" | "CRITICAL";
export type AuditCheck = { key: string; status: AuditSeverity; message: string; evidence?: Record<string, unknown> };

function statusFor(checks: AuditCheck[]): AuditSeverity {
  if (checks.some((check) => check.status === "CRITICAL")) return "CRITICAL";
  if (checks.some((check) => check.status === "ANOMALY")) return "ANOMALY";
  if (checks.some((check) => check.status === "WARNING")) return "WARNING";
  return "PASS";
}

export function summarizeRoundAudit(checks: AuditCheck[]): AuditSeverity {
  return statusFor(checks);
}

export async function auditRound(publicId: string, actorUserId?: number) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible para el Auditor Agent.");
  const round = (await db.select().from(gameRounds).where(eq(gameRounds.publicId, publicId)).limit(1))[0];
  if (!round) {
    const checks: AuditCheck[] = [{ key: "round", status: "CRITICAL", message: "La ronda no existe", evidence: { publicId } }];
    return { publicId, finalStatus: "CRITICAL" as const, checks };
  }
  const tickets = await db.select().from(pilotTickets).where(eq(pilotTickets.roundId, round.id));
  const events = await db.select().from(auditEvents).where(eq(auditEvents.entityPublicId, publicId));
  const checks: AuditCheck[] = [];
  const now = Date.now();
  const closesAt = new Date(round.closesAt).getTime();
  const hasResult = Boolean(round.resultJson && round.revealedServerSeed && round.ticketSetHash);
  const settledTickets = tickets.filter((ticket) => ticket.status === "settled");
  const invalidTickets = tickets.filter((ticket) => ticket.gameType !== round.gameType || ticket.roundId !== round.id);
  const malformedResult = round.resultJson ? (() => { try { JSON.parse(round.resultJson); return false; } catch { return true; } })() : false;

  checks.push({ key: "round", status: "PASS", message: "La ronda existe y su identificador es trazable", evidence: { publicId, gameType: round.gameType, state: round.state } });
  checks.push({ key: "participations", status: invalidTickets.length ? "ANOMALY" : "PASS", message: invalidTickets.length ? "Existen participaciones que no coinciden con la ronda" : "Las participaciones pertenecen a la ronda y modalidad", evidence: { total: tickets.length, invalid: invalidTickets.length } });
  checks.push({ key: "cutoff", status: round.state === "open" && closesAt < now ? "WARNING" : "PASS", message: round.state === "open" && closesAt < now ? "La ronda abierta superó su cierre temporal" : "El corte temporal es compatible con el estado", evidence: { closesAt: round.closesAt, state: round.state } });
  checks.push({ key: "draw", status: ["draft", "open", "locked"].includes(round.state) ? "WARNING" : malformedResult ? "CRITICAL" : hasResult ? "PASS" : "ANOMALY", message: ["draft", "open", "locked"].includes(round.state) ? "La ronda aún no debe tener resultado final" : malformedResult ? "El resultado persistido no es JSON válido" : hasResult ? "La evidencia del resultado está completa" : "Falta evidencia completa del resultado", evidence: { hasResult, hasRevealedSeed: Boolean(round.revealedServerSeed), hasTicketSetHash: Boolean(round.ticketSetHash) } });
  checks.push({ key: "prizes", status: settledTickets.every((ticket) => ticket.virtualPrizeAmount >= 0) ? "PASS" : "CRITICAL", message: settledTickets.every((ticket) => ticket.virtualPrizeAmount >= 0) ? "Los premios liquidados son créditos virtuales no negativos" : "Existe un premio liquidado inválido", evidence: { settledTickets: settledTickets.length } });
  checks.push({ key: "settlement", status: round.state === "settled" && !round.settledAt ? "ANOMALY" : "PASS", message: round.state === "settled" && !round.settledAt ? "La ronda liquidada no tiene marca de tiempo" : "La liquidación es consistente con la evidencia disponible", evidence: { state: round.state, settledAt: round.settledAt } });
  checks.push({ key: "events", status: events.length ? "PASS" : "WARNING", message: events.length ? "La ronda tiene eventos de auditoría" : "La ronda no tiene eventos de auditoría asociados", evidence: { count: events.length } });
  checks.push({ key: "publication", status: ["settled", "archived"].includes(round.state) ? "PASS" : "WARNING", message: ["settled", "archived"].includes(round.state) ? "La ronda está en un estado publicable" : "La ronda todavía no está en estado publicable", evidence: { state: round.state } });

  const finalStatus = statusFor(checks);
  await appendOperationalEvent({
    eventType: "AUDITOR_ROUND_COMPLETED",
    aggregateType: "round",
    aggregateId: publicId,
    actorUserId,
    source: "auditor_agent",
    payload: { finalStatus, checks },
    correlationId: `audit:${publicId}`,
    idempotencyKey: `audit:${publicId}:${round.state}:${round.settledAt?.getTime() ?? "pending"}`,
  });
  return { publicId, gameType: round.gameType, state: round.state, finalStatus, checks };
}

export async function listRecentAudits(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(operationalEvents).where(eq(operationalEvents.eventType, "AUDITOR_ROUND_COMPLETED")).orderBy(desc(operationalEvents.createdAt)).limit(Math.min(Math.max(limit, 1), 100));
}
