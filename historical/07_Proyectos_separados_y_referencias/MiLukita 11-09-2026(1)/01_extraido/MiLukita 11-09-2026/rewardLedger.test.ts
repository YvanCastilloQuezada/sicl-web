import { describe, expect, it } from "vitest";
import { VirtualRewardLedger } from "./rewards/rewardLedger";

describe("VirtualRewardLedger", () => {
  it("registra premios de torneo y acumula saldo virtual", () => {
    const ledger = new VirtualRewardLedger();
    const entry = ledger.award({ idempotencyKey: "tournament:1:player:1", kind: "TOURNAMENT_PRIZE", recipientId: "player-1", amount: 250, reason: "Primer puesto" }, 0);
    expect(entry.kind).toBe("TOURNAMENT_PRIZE");
    expect(ledger.balance("player-1")).toBe(250);
  });
  it("registra logros cooperativos e impide doble abono", () => {
    const ledger = new VirtualRewardLedger();
    const input = { idempotencyKey: "coop:boss-1:team-1", kind: "COOPERATIVE_ACHIEVEMENT" as const, recipientId: "team-1", amount: 40, reason: "Jefe derrotado" };
    const first = ledger.award(input, 0);
    const duplicate = ledger.award(input, 1_000);
    expect(duplicate).toEqual(first);
    expect(ledger.balance("team-1")).toBe(40);
    expect(ledger.list("team-1")).toHaveLength(1);
  });
});
