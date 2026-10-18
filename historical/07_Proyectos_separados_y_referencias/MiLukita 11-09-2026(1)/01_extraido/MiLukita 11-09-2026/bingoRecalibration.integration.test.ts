import { and, eq, inArray } from "drizzle-orm";
import { afterAll, describe, expect, it } from "vitest";
import { gameRounds, gameRulesets, pilotTickets, virtualWallets, walletTransactions } from "../drizzle/schema";
import { getDb } from "./db";
import { closeAndDrawRound } from "./pilot";

const ROLLBACK = Symbol("rollback-e2e-bingo");

describe("liquidación persistida aislada de Bingo v1.0.1", () => {
  afterAll(async () => {
    // La conexión administrada por Drizzle se reutiliza en otras pruebas; no se cierra aquí.
  });

  it("ejecuta closeAndDrawRound sobre tablas reales dentro de una transacción revertida y acredita 82 créditos", async () => {
    const db = await getDb();
    if (!db) return;

    const rulesetVersion = "e2e-bingo-v101";
    const roundPublicId = "E2E-BINGO-V101";
    const ticketPublicIds = ["E2E-T-B101-1", "E2E-T-B101-2", "E2E-T-B101-3"];

    const execution = db.transaction(async (tx) => {
      await tx.insert(gameRulesets).values({
        gameType: "bingo",
        version: rulesetVersion,
        title: "Bingo E2E aislado",
        rulesJson: JSON.stringify({ gameType: "bingo", pickLimit: 1, numberRange: 3, pilotOnly: true }),
        prizePolicyJson: JSON.stringify({ bingoCartillaPrize: 82, virtualOnly: true, withdrawals: false }),
        isPublished: true,
        createdByUserId: 1,
      });
      const ruleset = (await tx.select().from(gameRulesets).where(and(eq(gameRulesets.gameType, "bingo"), eq(gameRulesets.version, rulesetVersion))).limit(1))[0];
      await tx.insert(gameRounds).values({
        publicId: roundPublicId,
        gameType: "bingo",
        rulesetId: ruleset.id,
        state: "open",
        opensAt: new Date(Date.now() - 60_000),
        closesAt: new Date(Date.now() - 1_000),
        serverSeedHash: "a".repeat(64),
        serverSeedSecret: "b".repeat(64),
        jackpotPoolCredits: 0,
        algorithmVersion: "hmac-sha256-rejection-v1",
        createdByUserId: 1,
      });
      const round = (await tx.select().from(gameRounds).where(eq(gameRounds.publicId, roundPublicId)).limit(1))[0];
      await tx.insert(pilotTickets).values([1, 2, 3].map((pick, index) => ({
        publicId: ticketPublicIds[index],
        userId: 1,
        roundId: round.id,
        gameType: "bingo",
        picksJson: JSON.stringify([pick]),
        quantity: 1,
        virtualCost: 35,
        benefitTier: "e2e",
        status: "confirmed",
        ticketHash: `${index + 1}`.repeat(64),
      })));

      const proof = await closeAndDrawRound(1, roundPublicId, tx);
      const settledTickets = await tx.select().from(pilotTickets).where(eq(pilotTickets.roundId, round.id));
      const winningTickets = settledTickets.filter(ticket => ticket.virtualPrizeAmount === 82);
      const newPrizeTransactions = await tx.select().from(walletTransactions).where(and(eq(walletTransactions.userId, 1), eq(walletTransactions.type, "virtual_prize"), inArray(walletTransactions.idempotencyKey, ticketPublicIds.map(id => `prize:${id}`))));

      expect(proof?.ruleset?.version).toBe(rulesetVersion);
      expect(proof?.ruleset?.prizes?.bingoCartillaPrize).toBe(82);
      expect(settledTickets).toHaveLength(3);
      expect(winningTickets).toHaveLength(1);
      expect(winningTickets[0].virtualPrizeAmount).toBe(82);
      expect(settledTickets.some(ticket => ticket.virtualPrizeAmount === 450)).toBe(false);
      expect(newPrizeTransactions).toHaveLength(1);
      expect(newPrizeTransactions[0].amount).toBe(82);
      expect((await tx.select().from(virtualWallets).where(eq(virtualWallets.userId, 1)).limit(1))[0].balance).toBeGreaterThanOrEqual(82);
      throw ROLLBACK;
    });

    await expect(execution).rejects.toBe(ROLLBACK);
    const leaked = await db.select().from(gameRounds).where(eq(gameRounds.publicId, roundPublicId)).limit(1);
    expect(leaked).toHaveLength(0);
  });
});
