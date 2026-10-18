import { and, eq, inArray } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { gameRounds, gameRulesets, pilotTickets, walletTransactions } from "../drizzle/schema";
import { getDb } from "./db";
import { closeAndDrawRound } from "./pilot";

const ROLLBACK = Symbol("rollback-simplified-games");

describe("liquidación reversible de modalidades simplificadas", () => {
  it("liquida pagos recalibrados y consuelos de Ruleta 7, Flash, Keno y Bingo 75", async () => {
    const db = await getDb();
    if (!db) return;
    const execution = db.transaction(async (tx) => {
      const cases = [
        { gameType: "ruleta_7" as const, suffix: "R7", picks: [0], result: { number: 1, color: "rojo", parity: "impar" }, expectedPrize: 2 },
        { gameType: "bingo_flash" as const, suffix: "BF", picks: [1, 2, 3], result: { calls: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }, expectedPrize: 34 },
        { gameType: "bingo_flash" as const, suffix: "BFC", picks: [1, 2, 10], result: { calls: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }, expectedPrize: 1 },
        { gameType: "bingo_keno" as const, suffix: "BK", picks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], result: { calls: Array.from({ length: 21 }, (_, index) => index + 1) }, expectedPrize: 580 },
        { gameType: "bingo_keno" as const, suffix: "BKC", picks: [1, 2, 3, 4, 21, 30, 40, 50, 60, 70], result: { calls: Array.from({ length: 21 }, (_, index) => index + 1) }, expectedPrize: 1 },
        { gameType: "bingo_75" as const, suffix: "B75", picks: [1, 2, 3, 4, 5, 16, 17, 18, 19, 20, 31, 32, 33, 34, 46, 47, 48, 49, 50, 61, 62, 63, 64, 65], result: { calls: Array.from({ length: 41 }, (_, index) => index + 1) }, expectedPrize: 1 },
      ];
      const ticketIds: string[] = [];
      for (const item of cases) {
        const version = `e2e-${item.suffix.toLowerCase()}-v100`;
        const roundPublicId = `E2E-${item.suffix}-V100`;
        await tx.insert(gameRulesets).values({ gameType: item.gameType, version, title: `E2E ${item.suffix}`, rulesJson: JSON.stringify({ gameType: item.gameType, pilotOnly: true }), prizePolicyJson: JSON.stringify({ virtualOnly: true, withdrawals: false }), isPublished: true, createdByUserId: 1 });
        const ruleset = (await tx.select().from(gameRulesets).where(and(eq(gameRulesets.gameType, item.gameType), eq(gameRulesets.version, version))).limit(1))[0];
        await tx.insert(gameRounds).values({ publicId: roundPublicId, gameType: item.gameType, rulesetId: ruleset.id, state: "open", opensAt: new Date(Date.now() - 60_000), closesAt: new Date(Date.now() - 1_000), serverSeedHash: "a".repeat(64), serverSeedSecret: "b".repeat(64), jackpotPoolCredits: 0, algorithmVersion: "hmac-sha256-rejection-v1", createdByUserId: 1 });
        const round = (await tx.select().from(gameRounds).where(eq(gameRounds.publicId, roundPublicId)).limit(1))[0];
        const ticketPublicId = `E2E-T-${item.suffix}`;
        ticketIds.push(ticketPublicId);
        await tx.insert(pilotTickets).values({ publicId: ticketPublicId, userId: 1, roundId: round.id, gameType: item.gameType, picksJson: JSON.stringify(item.picks), quantity: 1, virtualCost: 1, benefitTier: "e2e", status: "confirmed", ticketHash: item.suffix.padEnd(64, "0") });
        await closeAndDrawRound(1, roundPublicId, tx, { resultOverride: item.result });
        const settled = (await tx.select().from(pilotTickets).where(eq(pilotTickets.publicId, ticketPublicId)).limit(1))[0];
        expect(settled.virtualPrizeAmount).toBe(item.expectedPrize);
      }
      const prizes = await tx.select().from(walletTransactions).where(and(eq(walletTransactions.userId, 1), eq(walletTransactions.type, "virtual_prize"), inArray(walletTransactions.idempotencyKey, ticketIds.map((id) => `prize:${id}`))));
      expect(prizes).toHaveLength(cases.length);
      throw ROLLBACK;
    });
    await expect(execution).rejects.toBe(ROLLBACK);
  });
});
