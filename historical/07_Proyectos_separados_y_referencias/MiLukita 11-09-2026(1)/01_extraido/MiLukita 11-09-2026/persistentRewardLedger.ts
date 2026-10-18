import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { virtualRewardLedger, virtualWallets, walletTransactions } from "../../drizzle/schema";
import type { RewardKind } from "./rewardLedger";

export async function listPersistentVirtualRewards(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible para consultar recompensas virtuales.");
  return db.select().from(virtualRewardLedger).where(eq(virtualRewardLedger.userId, userId));
}

export async function awardPersistentVirtualReward(input: { userId: number; kind: RewardKind; amount: number; reason: string; idempotencyKey: string; metadata?: Record<string, string | number | boolean> }) {
  if (!Number.isInteger(input.amount) || input.amount <= 0) throw new Error("La recompensa virtual debe ser un entero positivo.");
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible para registrar la recompensa virtual.");
  return db.transaction(async (tx) => {
    const existing = await tx.select().from(virtualRewardLedger).where(eq(virtualRewardLedger.idempotencyKey, input.idempotencyKey)).limit(1);
    if (existing[0]) return { ledger: existing[0], duplicate: true } as const;
    const wallets = await tx.select().from(virtualWallets).where(eq(virtualWallets.userId, input.userId)).limit(1);
    const current = wallets[0];
    const balanceAfter = (current?.balance ?? 0) + input.amount;
    if (!current) await tx.insert(virtualWallets).values({ userId: input.userId, balance: balanceAfter });
    else await tx.update(virtualWallets).set({ balance: balanceAfter }).where(eq(virtualWallets.userId, input.userId));
    const publicId = `RW-${randomUUID().replaceAll("-", "").slice(0, 20).toUpperCase()}`;
    const [ledger] = await tx.insert(virtualRewardLedger).values({ publicId, userId: input.userId, kind: input.kind, amount: input.amount, reason: input.reason, idempotencyKey: input.idempotencyKey, metadataJson: input.metadata ? JSON.stringify(input.metadata) : null }).$returningId();
    await tx.insert(walletTransactions).values({ publicId: `WT-${randomUUID().replaceAll("-", "").slice(0, 20).toUpperCase()}`, userId: input.userId, type: input.kind === "TOURNAMENT_PRIZE" ? "tournament_reward" : "cooperative_achievement", amount: input.amount, balanceAfter, idempotencyKey: `reward:${input.idempotencyKey}`, description: input.reason.slice(0, 255), metadataJson: input.metadata ? JSON.stringify(input.metadata) : null });
    return { ledger: { ...ledger, publicId, userId: input.userId, kind: input.kind, amount: input.amount, reason: input.reason, idempotencyKey: input.idempotencyKey }, duplicate: false } as const;
  });
}
