import { and, eq, inArray } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { gameRounds, gameRulesets, pilotTickets, walletTransactions } from "../drizzle/schema";
import { getDb } from "./db";
import { LOTERIA_PRIZE_TABLE_V101, closeAndDrawRound } from "./pilot";

const ROLLBACK = Symbol("rollback-e2e-loteria");

describe("liquidación persistida aislada de Lotería v1.0.1", () => {
  it("ejecuta el cierre sobre tablas reales, aplica 170 000 créditos y revierte todos los datos de prueba", async () => {
    const db = await getDb();
    if (!db) return;

    const rulesetVersion = "e2e-loteria-v101";
    const roundPublicId = "E2E-LOTERIA-V101";
    const ticketPublicIds = ["E2E-T-L101-GANADOR", "E2E-T-L101-SIN-PREMIO"];

    const execution = db.transaction(async (tx) => {
      await tx.insert(gameRulesets).values({
        gameType: "loteria",
        version: rulesetVersion,
        title: "Lotería E2E aislada",
        rulesJson: JSON.stringify({ gameType: "loteria", pickLimit: 6, numberRange: 49, loteriaPrizeTable: LOTERIA_PRIZE_TABLE_V101, pilotOnly: true }),
        prizePolicyJson: JSON.stringify({ loteriaPrizeTable: LOTERIA_PRIZE_TABLE_V101, virtualOnly: true, withdrawals: false }),
        isPublished: true,
        createdByUserId: 1,
      });
      const ruleset = (await tx.select().from(gameRulesets).where(and(eq(gameRulesets.gameType, "loteria"), eq(gameRulesets.version, rulesetVersion))).limit(1))[0];
      await tx.insert(gameRounds).values({
        publicId: roundPublicId,
        gameType: "loteria",
        rulesetId: ruleset.id,
        state: "open",
        opensAt: new Date(Date.now() - 60_000),
        closesAt: new Date(Date.now() - 1_000),
        serverSeedHash: "c".repeat(64),
        serverSeedSecret: "d".repeat(64),
        jackpotPoolCredits: 0,
        algorithmVersion: "hmac-sha256-rejection-v1",
        createdByUserId: 1,
      });
      const round = (await tx.select().from(gameRounds).where(eq(gameRounds.publicId, roundPublicId)).limit(1))[0];
      await tx.insert(pilotTickets).values([
        { publicId: ticketPublicIds[0], userId: 1, roundId: round.id, gameType: "loteria", picksJson: JSON.stringify([1, 2, 3, 4, 5, 6]), quantity: 1, virtualCost: 25, benefitTier: "e2e", status: "confirmed", ticketHash: "1".repeat(64) },
        { publicId: ticketPublicIds[1], userId: 1, roundId: round.id, gameType: "loteria", picksJson: JSON.stringify([7, 8, 9, 10, 11, 12]), quantity: 1, virtualCost: 25, benefitTier: "e2e", status: "confirmed", ticketHash: "2".repeat(64) },
      ]);

      const proof = await closeAndDrawRound(1, roundPublicId, tx, { resultOverride: { numbers: [1, 2, 3, 4, 5, 6] } });
      const settledTickets = await tx.select().from(pilotTickets).where(eq(pilotTickets.roundId, round.id));
      const prizeTransactions = await tx.select().from(walletTransactions).where(and(eq(walletTransactions.userId, 1), eq(walletTransactions.type, "virtual_prize"), inArray(walletTransactions.idempotencyKey, ticketPublicIds.map(id => `prize:${id}`))));

      expect(proof?.ruleset?.version).toBe(rulesetVersion);
      expect(proof?.ruleset?.prizes?.loteriaPrizeTable).toEqual(LOTERIA_PRIZE_TABLE_V101);
      expect(proof?.result).toEqual({ numbers: [1, 2, 3, 4, 5, 6] });
      expect(settledTickets.map(ticket => ticket.virtualPrizeAmount).sort((a, b) => a - b)).toEqual([0, 170_000]);
      expect(prizeTransactions).toHaveLength(1);
      expect(prizeTransactions[0].amount).toBe(170_000);
      throw ROLLBACK;
    });

    await expect(execution).rejects.toBe(ROLLBACK);
    const leaked = await db.select().from(gameRounds).where(eq(gameRounds.publicId, roundPublicId)).limit(1);
    expect(leaked).toHaveLength(0);
  });
});
