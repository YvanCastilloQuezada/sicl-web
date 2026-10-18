export type RewardKind = "TOURNAMENT_PRIZE" | "COOPERATIVE_ACHIEVEMENT";
export type RewardEntry = { entryId: string; idempotencyKey: string; kind: RewardKind; recipientId: string; amount: number; reason: string; createdAt: string; metadata?: Record<string, string | number | boolean> };

export class VirtualRewardLedger {
  private readonly entries = new Map<string, RewardEntry>();
  private readonly balances = new Map<string, number>();

  award(input: Omit<RewardEntry, "entryId" | "createdAt">, now = Date.now()): RewardEntry {
    if (!Number.isInteger(input.amount) || input.amount <= 0) throw new Error("La recompensa virtual debe ser un entero positivo.");
    const existing = this.entries.get(input.idempotencyKey);
    if (existing) return existing;
    const entry: RewardEntry = { ...input, entryId: `reward-${this.entries.size + 1}`, createdAt: new Date(now).toISOString() };
    this.entries.set(entry.idempotencyKey, entry);
    this.balances.set(entry.recipientId, (this.balances.get(entry.recipientId) ?? 0) + entry.amount);
    return entry;
  }

  balance(recipientId: string): number { return this.balances.get(recipientId) ?? 0; }
  list(recipientId?: string): RewardEntry[] { return Array.from(this.entries.values()).filter((entry) => !recipientId || entry.recipientId === recipientId); }
}
