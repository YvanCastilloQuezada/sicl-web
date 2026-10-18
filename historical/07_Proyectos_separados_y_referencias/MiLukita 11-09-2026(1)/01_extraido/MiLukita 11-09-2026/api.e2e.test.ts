import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { and, eq } from "drizzle-orm";
import { afterEach, describe, expect, it } from "vitest";
import { auditEvents, gameBatchPreviews, gameRounds, marketBatchPreviews, marketEvents, marketPositions, pilotTickets, playerMissionProgress, playerSettings, users, virtualPlanEnrollments, virtualWallets, walletTransactions, type User } from "../drizzle/schema";
import { createApp } from "./_core/index";
import { getRequestMetadata } from "./_core/requestMeta";
import { getDb } from "./db";
import { bootstrapPilotRules } from "./pilot";
import { isHumanTicketId } from "../shared/ticketIdentifiers";

const servers: ReturnType<typeof createServer>[] = [];
const isolatedUser: User = {
  id: 987_654_321,
  openId: "e2e-isolated-user",
  name: "Usuario HTTP E2E aislado",
  email: "e2e.invalid@example.test",
  loginMethod: "test",
  role: "user",
  createdAt: new Date("2026-08-24T00:00:00.000Z"),
  updatedAt: new Date("2026-08-24T00:00:00.000Z"),
  lastSignedIn: new Date("2026-08-24T00:00:00.000Z"),
};

async function createIsolatedFixture() {
  const db = await getDb();
  if (!db) throw new Error("La base de datos es necesaria para esta prueba HTTP aislada.");
  const openId = `e2e-http-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  await db.insert(users).values({ openId, name: "Usuario temporal HTTP E2E", email: `${openId}@example.test`, loginMethod: "test", role: "user" });
  const user = (await db.select().from(users).where(eq(users.openId, openId)).limit(1))[0];
  return { db, user };
}

async function cleanIsolatedFixture(fixture: Awaited<ReturnType<typeof createIsolatedFixture>>) {
  const { db, user } = fixture;
  await db.delete(auditEvents).where(eq(auditEvents.actorUserId, user.id));
  await db.delete(gameBatchPreviews).where(eq(gameBatchPreviews.userId, user.id));
  await db.delete(marketBatchPreviews).where(eq(marketBatchPreviews.userId, user.id));
  await db.delete(pilotTickets).where(eq(pilotTickets.userId, user.id));
  await db.delete(marketPositions).where(eq(marketPositions.userId, user.id));
  await db.delete(walletTransactions).where(eq(walletTransactions.userId, user.id));
  await db.delete(virtualPlanEnrollments).where(eq(virtualPlanEnrollments.userId, user.id));
  await db.delete(playerMissionProgress).where(eq(playerMissionProgress.userId, user.id));
  await db.delete(playerSettings).where(eq(playerSettings.userId, user.id));
  await db.delete(virtualWallets).where(eq(virtualWallets.userId, user.id));
  await db.delete(marketEvents).where(eq(marketEvents.createdByUserId, user.id));
  await db.delete(users).where(eq(users.id, user.id));
  expect(await db.select().from(users).where(eq(users.id, user.id)).limit(1)).toHaveLength(0);
}

async function start(withUser: User | null) {
  const app = await createApp({
    createContextOverride: async ({ req, res }) => ({ req, res, user: withUser, request: getRequestMetadata(req) }),
  });
  const server = createServer(app);
  servers.push(server);
  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
  return `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
}

async function trpcQuery(base: string, procedure: string, input: unknown = null) {
  const payload = encodeURIComponent(JSON.stringify({ 0: { json: input } }));
  return fetch(`${base}/api/trpc/${procedure}?batch=1&input=${payload}`);
}

async function trpcMutation(base: string, procedure: string, input: unknown) {
  return fetch(`${base}/api/trpc/${procedure}?batch=1`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ 0: { json: input } }),
  });
}

afterEach(async () => {
  await Promise.all(servers.splice(0).map(server => new Promise<void>(resolve => server.close(() => resolve()))));
});

describe("API HTTP end-to-end del piloto", () => {
  it("expone salud, identidad sintética y lecturas públicas sin crear usuarios ni datos de prueba", async () => {
    const base = await start(isolatedUser);
    expect((await fetch(`${base}/health`)).status).toBe(200);
    expect((await fetch(`${base}/health/db`)).status).toBe(200);

    const authResponse = await trpcQuery(base, "auth.me");
    expect(authResponse.status).toBe(200);
    const authPayload = await authResponse.json();
    expect(authPayload[0].result.data.json).toMatchObject({ id: isolatedUser.id, openId: isolatedUser.openId, role: "user" });

    const roundsResponse = await trpcQuery(base, "games.rounds");
    expect(roundsResponse.status).toBe(200);
    const roundsPayload = await roundsResponse.json();
    const rounds = roundsPayload[0].result.data.json as Array<{ publicId: string }>;
    expect(Array.isArray(rounds)).toBe(true);

    if (rounds[0]) {
      const proofResponse = await trpcQuery(base, "games.verify", { publicId: rounds[0].publicId });
      expect(proofResponse.status).toBe(200);
      expect((await proofResponse.json())[0].result.data.json.publicId).toBe(rounds[0].publicId);
    }

    const marketsResponse = await trpcQuery(base, "market.list");
    expect(marketsResponse.status).toBe(200);
    expect(Array.isArray((await marketsResponse.json())[0].result.data.json)).toBe(true);

    const plansResponse = await trpcQuery(base, "plans.list");
    expect(plansResponse.status).toBe(200);
    const plansPayload = (await plansResponse.json())[0].result.data.json;
    expect(plansPayload).toMatchObject({ virtualOnly: true, automaticPurchase: false });
    expect(plansPayload.plans).toHaveLength(5);

    const rtpResponse = await trpcQuery(base, "rtpDashboard.public");
    expect(rtpResponse.status).toBe(200);
    expect((await rtpResponse.json())[0].result.data.json).toMatchObject({ virtualOnly: true });
  });

  it("mantiene el rechazo no autenticado y procesa una reserva autenticada con usuario temporal que se elimina al finalizar", async () => {
    const base = await start(null);
    const walletResponse = await trpcQuery(base, "wallet.summary");
    expect(walletResponse.status).toBe(401);
    expect((await walletResponse.json())[0].error.json.data.code).toBe("UNAUTHORIZED");

    const reserveResponse = await trpcMutation(base, "games.reserveTicket", {
      roundPublicId: "RP-L-9TLIRCPN",
      picks: [1, 2, 3, 4, 5, 6],
      quantity: 1,
      idempotencyKey: "e2e-reserve-isolated-0001",
    });
    expect(reserveResponse.status).toBe(401);
    expect((await reserveResponse.json())[0].error.json.data.code).toBe("UNAUTHORIZED");

    const fixture = await createIsolatedFixture();
    const roundSnapshots: Array<{ publicId: string; state: "draft" | "open" | "locked" | "drawn" | "settled" | "archived"; opensAt: Date; closesAt: Date }> = [];
    try {
      await bootstrapPilotRules(1);
      const authenticatedBase = await start(fixture.user);
      const roundsResponse = await trpcQuery(authenticatedBase, "games.rounds");
      const rounds = (await roundsResponse.json())[0].result.data.json as Array<{ publicId: string; gameType: string }>;
      const lotteryVariants = [
        { gameType: "loteria_19", price: 1, picks: [1, 2, 3] },
        { gameType: "loteria_29", price: 1, picks: [1, 2, 3, 4, 5, 6] },
        { gameType: "loteria_39", price: 1, picks: [1, 2, 3, 4, 5, 6] },
        { gameType: "loteria_49", price: 1, picks: [1, 2, 3, 4, 5, 6] },
        { gameType: "loteria_59", price: 1, picks: [1, 2, 3, 4, 5, 6] },
      ];
      const lotteryRounds = lotteryVariants.map((variant) => ({ ...variant, round: rounds.find(round => round.gameType === variant.gameType) }));
            expect(lotteryRounds.every(({ round }) => Boolean(round))).toBe(true);
      const testOpensAt = new Date(Date.now() - 60_000);
      const testClosesAt = new Date(Date.now() + 60 * 60 * 1000);
      for (const { round } of lotteryRounds) {
        const persistedRound = (await fixture.db.select({ publicId: gameRounds.publicId, state: gameRounds.state, opensAt: gameRounds.opensAt, closesAt: gameRounds.closesAt }).from(gameRounds).where(eq(gameRounds.publicId, round!.publicId)).limit(1))[0];
        if (!persistedRound) throw new Error(`No se encontró la ronda E2E ${round!.publicId}`);
        roundSnapshots.push(persistedRound);
        await fixture.db.update(gameRounds).set({ state: "open", opensAt: testOpensAt, closesAt: testClosesAt }).where(eq(gameRounds.publicId, round!.publicId));
      }
      const walletBefore = await trpcQuery(authenticatedBase, "wallet.summary");
      expect(walletBefore.status).toBe(200);
      const beforeBalance = (await walletBefore.json())[0].result.data.json.wallet.balance as number;

      let expectedDebit = 0;
      for (const variant of lotteryRounds) {
        const authenticatedReserve = await trpcMutation(authenticatedBase, "games.reserveTicket", {
          roundPublicId: variant.round!.publicId,
          picks: variant.picks,
          quantity: 1,
          idempotencyKey: `e2e-reserve-${variant.gameType}-${Date.now()}`,
        });
        const reserveResponsePayload = await authenticatedReserve.json();
        expect(authenticatedReserve.status, JSON.stringify(reserveResponsePayload)).toBe(200);
        const reservePayload = reserveResponsePayload[0].result.data.json;
        expect(reservePayload.virtualCost).toBe(variant.price);
        expect(isHumanTicketId(reservePayload.publicId)).toBe(true);
        expectedDebit += variant.price;
      }

      const mjpReserve = await trpcMutation(authenticatedBase, "games.reserveTicket", {
        roundPublicId: lotteryRounds.find(({ gameType }) => gameType === "loteria_39")!.round!.publicId,
        picks: [1, 2, 3, 4, 5, 6],
        extraPick: 7,
        quantity: 1,
        idempotencyKey: `e2e-mjp-extra-${Date.now()}`,
      });
      const mjpPayload = await mjpReserve.json();
      expect(mjpReserve.status, JSON.stringify(mjpPayload)).toBe(200);
      expect(mjpPayload[0].result.data.json.virtualCost).toBe(2);
      expectedDebit += 2;

      const mixedBatch = await trpcMutation(authenticatedBase, "games.reserveTicketBatch", {
        roundPublicId: lotteryRounds.find(({ gameType }) => gameType === "loteria_39")!.round!.publicId,
        manual: [{ picks: [1, 2, 3, 4, 5, 6], copies: 3 }],
        randomCount: 7,
        randomMjpExtra: false,
        idempotencyKey: `e2e-mixed-batch-${Date.now()}`,
      });
      const mixedBatchPayload = await mixedBatch.json();
      expect(mixedBatch.status, JSON.stringify(mixedBatchPayload)).toBe(200);
      const mixedBatchResult = mixedBatchPayload[0].result.data.json;
      expect(mixedBatchResult).toMatchObject({ totalTickets: 10, virtualCost: 9 });
      expect(mixedBatchResult.tickets).toHaveLength(10);
      expect(mixedBatchResult.tickets.slice(0, 3).map((ticket: { publicId: string }) => ticket.publicId)).toHaveLength(3);
      expectedDebit += 9;

      const previewResponse = await trpcMutation(authenticatedBase, "games.previewTicketBatch", {
        roundPublicId: lotteryRounds.find(({ gameType }) => gameType === "loteria_39")!.round!.publicId,
        manual: [{ picks: [8, 9, 10, 11, 12, 13], copies: 2 }],
        randomCount: 3,
        randomMjpExtra: false,
      });
      const previewPayload = await previewResponse.json();
      expect(previewResponse.status, JSON.stringify(previewPayload)).toBe(200);
      const preview = previewPayload[0].result.data.json;
      expect(preview).toMatchObject({ totalTickets: 5 });
      expect(preview.selectionHash).toMatch(/^[a-f0-9]{64}$/);
      expect(preview.signature).toMatch(/^[a-f0-9]{64}$/);
      expect(preview.selections).toHaveLength(5);

      const confirmPreviewResponse = await trpcMutation(authenticatedBase, "games.confirmTicketBatchPreview", { previewPublicId: preview.publicId, idempotencyKey: `e2e-preview-confirm-${Date.now()}` });
      const confirmPreviewPayload = await confirmPreviewResponse.json();
      expect(confirmPreviewResponse.status, JSON.stringify(confirmPreviewPayload)).toBe(200);
      const confirmedPreview = confirmPreviewPayload[0].result.data.json;
      expect(confirmedPreview).toMatchObject({ totalTickets: 5, virtualCost: 5, previewPublicId: preview.publicId, selectionHash: preview.selectionHash });
      expectedDebit += 5;

      const historyResponse = await trpcQuery(authenticatedBase, "batches.mine", { gameType: "loteria_39" });
      const historyPayload = await historyResponse.json();
      expect(historyPayload[0].result.data.json.batches.some((batch: { publicId: string }) => batch.publicId === confirmedPreview.batchPublicId)).toBe(true);
      const receiptResponse = await trpcQuery(authenticatedBase, "batches.receipt", { batchPublicId: confirmedPreview.batchPublicId });
      const receiptPayload = await receiptResponse.json();
      expect(receiptPayload[0].result.data.json).toMatchObject({ batchPublicId: confirmedPreview.batchPublicId, previewPublicId: preview.publicId, virtualOnly: true, noRealMoney: true });
      expect(receiptPayload[0].result.data.json.tickets).toHaveLength(5);

      const universalBatches = [
        { gameType: "ruleta", picks: [17], expectedCost: 2 },
        { gameType: "jackpot", picks: [1, 2, 3, 4, 5], expectedCost: 2 },
        { gameType: "bingo", picks: [1], expectedCost: 2 },
        { gameType: "cartas", picks: [1, 7, 13], expectedCost: 2 },
        { gameType: "bingo_75", picks: [1, 2, 3, 4, 5, 16, 17, 18, 19, 20, 31, 32, 33, 34, 46, 47, 48, 49, 50, 61, 62, 63, 64, 65], expectedCost: 2 },
      ];
      const universalRoundIds = new Set(universalBatches.map((batch) => rounds.find((candidate) => candidate.gameType === batch.gameType)?.publicId).filter((publicId): publicId is string => Boolean(publicId)));
      for (const publicId of universalRoundIds) {
        const persistedRound = (await fixture.db.select({ publicId: gameRounds.publicId, state: gameRounds.state, opensAt: gameRounds.opensAt, closesAt: gameRounds.closesAt }).from(gameRounds).where(eq(gameRounds.publicId, publicId)).limit(1))[0];
        if (!persistedRound) throw new Error(`No se encontró la ronda universal E2E ${publicId}`);
        roundSnapshots.push(persistedRound);
        await fixture.db.update(gameRounds).set({ state: "open", opensAt: testOpensAt, closesAt: testClosesAt }).where(eq(gameRounds.publicId, publicId));
      }
      for (const batch of universalBatches) {
        const round = rounds.find((candidate) => candidate.gameType === batch.gameType);
        expect(round, `Falta una ronda abierta de ${batch.gameType}`).toBeTruthy();
        const universalPreviewResponse = await trpcMutation(authenticatedBase, "games.previewTicketBatch", { roundPublicId: round!.publicId, manual: [{ picks: batch.picks, copies: 1 }], randomCount: 1, randomMjpExtra: false });
        const universalPreviewPayload = await universalPreviewResponse.json();
        expect(universalPreviewResponse.status, JSON.stringify(universalPreviewPayload)).toBe(200);
        const universalPreview = universalPreviewPayload[0].result.data.json;
        expect(universalPreview).toMatchObject({ totalTickets: 2 });
        expect(universalPreview.selections[0]).toMatchObject({ picks: batch.picks, source: "manual" });
        const universalConfirmResponse = await trpcMutation(authenticatedBase, "games.confirmTicketBatchPreview", { previewPublicId: universalPreview.publicId, idempotencyKey: `e2e-universal-${batch.gameType}-${Date.now()}` });
        const universalConfirmPayload = await universalConfirmResponse.json();
        expect(universalConfirmResponse.status, JSON.stringify(universalConfirmPayload)).toBe(200);
        expect(universalConfirmPayload[0].result.data.json).toMatchObject({ totalTickets: 2, virtualCost: batch.expectedCost, previewPublicId: universalPreview.publicId });
        expectedDebit += batch.expectedCost;
      }
      const rouletteBatchHistory = await trpcQuery(authenticatedBase, "batches.mine", { gameType: "ruleta" });
      expect((await rouletteBatchHistory.json())[0].result.data.json.batches.some((batch: { gameType: string }) => batch.gameType === "ruleta")).toBe(true);

      const marketPublicId = `E2E-MKT-${Date.now()}`;
      await fixture.db.insert(marketEvents).values({ publicId: marketPublicId, title: "Mercado E2E de lote virtual", description: "Mercado curado aislado para validar posiciones firmadas sin dinero real.", category: "tecnologia", sourceLabel: "Fuente E2E", sourceUrl: "https://example.test/e2e-market", resolutionRule: "Se resuelve SÍ si la fuente E2E publica la condición especificada.", state: "open", yesPriceCredits: 1, noPriceCredits: 1, payoutCredits: 2, closesAt: new Date(Date.now() + 60 * 60 * 1000), pilotOnly: true, createdByUserId: fixture.user.id });
      const marketPreviewResponse = await trpcMutation(authenticatedBase, "market.previewBatch", { marketPublicId, manual: [{ side: "yes", copies: 2 }], randomCount: 1 });
      const marketPreviewPayload = await marketPreviewResponse.json();
      expect(marketPreviewResponse.status, JSON.stringify(marketPreviewPayload)).toBe(200);
      const marketPreview = marketPreviewPayload[0].result.data.json;
      expect(marketPreview).toMatchObject({ totalPositions: 3, estimatedCost: 3, pilotOnly: true });
      expect(marketPreview.selectionHash).toMatch(/^[a-f0-9]{64}$/);
      const marketConfirmResponse = await trpcMutation(authenticatedBase, "market.confirmBatchPreview", { previewPublicId: marketPreview.publicId, idempotencyKey: `e2e-market-batch-${Date.now()}` });
      const marketConfirmPayload = await marketConfirmResponse.json();
      expect(marketConfirmResponse.status, JSON.stringify(marketConfirmPayload)).toBe(200);
      const marketConfirm = marketConfirmPayload[0].result.data.json;
      expect(marketConfirm).toMatchObject({ totalPositions: 3, virtualCost: 3, previewPublicId: marketPreview.publicId, pilotOnly: true });
      expect(marketConfirm.positions).toHaveLength(3);
      const marketHistoryResponse = await trpcQuery(authenticatedBase, "market.batchesMine");
      expect((await marketHistoryResponse.json())[0].result.data.json.batches.some((batch: { publicId: string }) => batch.publicId === marketConfirm.batchPublicId)).toBe(true);
      const marketReceiptResponse = await trpcQuery(authenticatedBase, "market.batchReceipt", { batchPublicId: marketConfirm.batchPublicId });
      expect((await marketReceiptResponse.json())[0].result.data.json).toMatchObject({ batchPublicId: marketConfirm.batchPublicId, totalPositions: 3, virtualOnly: true, noRealMoney: true });

      const planResponse = await trpcMutation(authenticatedBase, "plans.enroll", {
        planCode: "mes_16",
        gameType: "loteria_59",
        picks: [1, 2, 3, 4, 5, 6],
      });
      expect(planResponse.status).toBe(200);
      const planPayload = (await planResponse.json())[0].result.data.json;
      expect(planPayload).toMatchObject({ remainingConfirmations: 16 });
      expect(planPayload.disclosure).toContain("confirmación explícita");

      const plannedReserve = await trpcMutation(authenticatedBase, "games.reserveTicket", {
        roundPublicId: lotteryRounds.find(({ gameType }) => gameType === "loteria_59")!.round!.publicId,
        picks: [1, 2, 3, 4, 5, 6],
        quantity: 10,
        idempotencyKey: `e2e-assisted-plan-${Date.now()}`,
        planPublicId: planPayload.publicId,
      });
      const plannedReservePayload = await plannedReserve.json();
      expect(plannedReserve.status, JSON.stringify(plannedReservePayload)).toBe(200);
      expect(plannedReservePayload[0].result.data.json.virtualCost).toBe(10);
      expectedDebit += 10;

      const planListResponse = await trpcQuery(authenticatedBase, "plans.mine");
      const planListPayload = (await planListResponse.json())[0].result.data.json;
      expect(planListPayload.find((plan: { publicId: string }) => plan.publicId === planPayload.publicId)).toMatchObject({ remainingConfirmations: 6, status: "active" });

      const cancelResponse = await trpcMutation(authenticatedBase, "plans.updateStatus", { publicId: planPayload.publicId, action: "cancel" });
      expect(cancelResponse.status).toBe(200);
      expect((await cancelResponse.json())[0].result.data.json.status).toBe("cancelled");

      const walletAfter = await trpcQuery(authenticatedBase, "wallet.summary");
      expect((await walletAfter.json())[0].result.data.json.wallet.balance).toBeGreaterThan(0);
      const ticketDebits = await fixture.db.select({ amount: walletTransactions.amount }).from(walletTransactions).where(and(eq(walletTransactions.userId, fixture.user.id), eq(walletTransactions.type, "ticket_debit")));
      expect(ticketDebits).toHaveLength(32);
      expect(ticketDebits.reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0)).toBe(expectedDebit);
    } finally {
      for (const snapshot of roundSnapshots) {
        await fixture.db.update(gameRounds).set({ state: snapshot.state, opensAt: snapshot.opensAt, closesAt: snapshot.closesAt }).where(eq(gameRounds.publicId, snapshot.publicId));
      }
      await cleanIsolatedFixture(fixture);
    }
  }, 120_000);
});
