import { and, eq, inArray } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { gameRounds, gameRulesets, pilotTickets, walletTransactions } from "../drizzle/schema";
import { VIRTUAL_LOTTERY_TYPES, VIRTUAL_LOTTERY_VARIANTS } from "../shared/lotteryVariants";
import { getDb } from "./db";
import { closeAndDrawRound } from "./pilot";

const ROLLBACK = Symbol("rollback-e2e-lottery-variants");

describe("liquidación persistida aislada de Loterías virtuales", () => {
  it("liquida el premio mayor de cada expediente sin alterar los registros históricos", async () => {
    const db = await getDb();
    if (!db) return;
    const roundPublicIds = VIRTUAL_LOTTERY_TYPES.map((gameType) => `E2E-${gameType.toUpperCase()}-V101`);

    const execution = db.transaction(async (tx) => {
      for (const [index, gameType] of VIRTUAL_LOTTERY_TYPES.entries()) {
        const variant = VIRTUAL_LOTTERY_VARIANTS[gameType];
        const numbers = Array.from({ length: variant.pickCount }, (_, position) => position + 1);
        const rulesetVersion = `e2e-${gameType}-v101`;
        const roundPublicId = roundPublicIds[index];
        const ticketPublicId = `E2E-T-${gameType.toUpperCase()}-WIN`;
        await tx.insert(gameRulesets).values({
          gameType,
          version: rulesetVersion,
          title: `${variant.title} E2E aislada`,
          rulesJson: JSON.stringify({ gameType, pickLimit: variant.pickCount, numberRange: variant.range, loteriaPrizeTable: variant.prizeTable, pilotOnly: true }),
          prizePolicyJson: JSON.stringify({ loteriaPrizeTable: variant.prizeTable, virtualOnly: true, withdrawals: false }),
          isPublished: true,
          createdByUserId: 1,
        });
        const ruleset = (await tx.select().from(gameRulesets).where(and(eq(gameRulesets.gameType, gameType), eq(gameRulesets.version, rulesetVersion))).limit(1))[0];
        await tx.insert(gameRounds).values({ publicId: roundPublicId, gameType, rulesetId: ruleset.id, state: "open", opensAt: new Date(Date.now() - 60_000), closesAt: new Date(Date.now() - 1_000), serverSeedHash: String(index + 1).repeat(64), serverSeedSecret: String(index + 2).repeat(64), jackpotPoolCredits: 0, algorithmVersion: "hmac-sha256-rejection-v1", createdByUserId: 1 });
        const round = (await tx.select().from(gameRounds).where(eq(gameRounds.publicId, roundPublicId)).limit(1))[0];
        await tx.insert(pilotTickets).values({ publicId: ticketPublicId, userId: 1, roundId: round.id, gameType, picksJson: JSON.stringify(numbers), quantity: 1, virtualCost: variant.priceCredits, benefitTier: "e2e", status: "confirmed", ticketHash: String(index + 3).repeat(64) });

        const proof = await closeAndDrawRound(1, roundPublicId, tx, { resultOverride: { numbers, extraNumber: gameType === "loteria_39" ? variant.pickCount + 1 : undefined } });
        const settledTicket = (await tx.select().from(pilotTickets).where(eq(pilotTickets.publicId, ticketPublicId)).limit(1))[0];
        const prizeTransaction = (await tx.select().from(walletTransactions).where(and(eq(walletTransactions.userId, 1), eq(walletTransactions.idempotencyKey, `prize:${ticketPublicId}`))).limit(1))[0];
        expect(proof?.ruleset?.prizes?.loteriaPrizeTable).toEqual(variant.prizeTable);
        expect(settledTicket.virtualPrizeAmount).toBe(variant.prizeTable[variant.pickCount]);
        expect(prizeTransaction.amount).toBe(variant.prizeTable[variant.pickCount]);
      }
      throw ROLLBACK;
    });

    await expect(execution).rejects.toBe(ROLLBACK);
    const leaked = await db.select().from(gameRounds).where(inArray(gameRounds.publicId, roundPublicIds));
    expect(leaked).toHaveLength(0);
  });
});
