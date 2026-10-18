import { and, eq, inArray } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { gameRounds, gameRulesets, pilotTickets, walletTransactions } from "../drizzle/schema";
import { MJP_EXTRA_39, VIRTUAL_LOTTERY_VARIANTS, lotteryExtraTheoreticalRtp } from "../shared/lotteryVariants";
import { getDb } from "./db";
import { calculateTicketPrize, closeAndDrawRound } from "./pilot";

const ROLLBACK = Symbol("rollback-e2e-mjp-extra");

describe("MJP Extra de Lotería 39", () => {
  it("calcula el RTP exacto aprobado y duplica solo coincidencias elegibles con número Extra", () => {
    const variant = VIRTUAL_LOTTERY_VARIANTS.loteria_39;
    expect(lotteryExtraTheoreticalRtp(variant)).toBeCloseTo(0.4484144607983617, 12);
    const result = { numbers: [1, 2, 3, 4, 5, 6], extraNumber: 7 };
    expect(calculateTicketPrize("loteria_39", [1, 2, 3, 4, 5, 8], result, 1, 0, 82, variant.prizeTable, 7)).toBe(2_334);
    expect(calculateTicketPrize("loteria_39", [1, 2, 3, 4, 5, 8], result, 1, 0, 82, variant.prizeTable)).toBe(1_167);
    expect(calculateTicketPrize("loteria_39", [1, 2, 3, 4, 5, 6], result, 1, 0, 82, variant.prizeTable, 7)).toBe(50_000);
  });

  it("liquida el premio MJP Extra sobre registros reales y revierte todo el expediente", async () => {
    const db = await getDb();
    if (!db) return;
    const roundPublicId = "E2E-MJP-39-V101";
    const ticketPublicId = "E2E-T-MJP-39-EXTRA";
    const execution = db.transaction(async (tx) => {
      const variant = VIRTUAL_LOTTERY_VARIANTS.loteria_39;
      await tx.insert(gameRulesets).values({ gameType: "loteria_39", version: "e2e-mjp-v101", title: "MJP Extra E2E aislado", rulesJson: JSON.stringify({ gameType: "loteria_39", pickLimit: 6, numberRange: 39, loteriaPrizeTable: variant.prizeTable, mjpExtra: MJP_EXTRA_39, pilotOnly: true }), prizePolicyJson: JSON.stringify({ loteriaPrizeTable: variant.prizeTable, mjpExtra: MJP_EXTRA_39, virtualOnly: true, withdrawals: false }), isPublished: true, createdByUserId: 1 });
      const ruleset = (await tx.select().from(gameRulesets).where(and(eq(gameRulesets.gameType, "loteria_39"), eq(gameRulesets.version, "e2e-mjp-v101"))).limit(1))[0];
      await tx.insert(gameRounds).values({ publicId: roundPublicId, gameType: "loteria_39", rulesetId: ruleset.id, state: "open", opensAt: new Date(Date.now() - 60_000), closesAt: new Date(Date.now() - 1_000), serverSeedHash: "a".repeat(64), serverSeedSecret: "b".repeat(64), jackpotPoolCredits: 0, algorithmVersion: "hmac-sha256-rejection-v1", createdByUserId: 1 });
      const round = (await tx.select().from(gameRounds).where(eq(gameRounds.publicId, roundPublicId)).limit(1))[0];
      await tx.insert(pilotTickets).values({ publicId: ticketPublicId, userId: 1, roundId: round.id, gameType: "loteria_39", picksJson: JSON.stringify([1, 2, 3, 4, 5, 8]), extraPick: 7, quantity: 1, virtualCost: 7, benefitTier: "e2e-mjp", status: "confirmed", ticketHash: "c".repeat(64) });
      const proof = await closeAndDrawRound(1, roundPublicId, tx, { resultOverride: { numbers: [1, 2, 3, 4, 5, 6], extraNumber: 7 } });
      const ticket = (await tx.select().from(pilotTickets).where(eq(pilotTickets.publicId, ticketPublicId)).limit(1))[0];
      const prize = (await tx.select().from(walletTransactions).where(and(eq(walletTransactions.userId, 1), eq(walletTransactions.idempotencyKey, `prize:${ticketPublicId}`))).limit(1))[0];
      expect(proof?.ruleset?.prizes?.mjpExtra).toEqual(MJP_EXTRA_39);
      expect(ticket.virtualPrizeAmount).toBe(2_334);
      expect(JSON.parse(ticket.resultJson!).mjpExtraApplied).toBe(true);
      expect(prize.amount).toBe(2_334);
      throw ROLLBACK;
    });
    await expect(execution).rejects.toBe(ROLLBACK);
    expect(await db.select().from(gameRounds).where(inArray(gameRounds.publicId, [roundPublicId]))).toHaveLength(0);
  });
});
