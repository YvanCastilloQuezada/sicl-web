import type { VirtualUser } from "./types";

/**
 * Libro mayor exclusivamente en memoria. No importa Drizzle ni abre conexiones.
 * Su propósito es probar conservación de saldo dentro de una simulación cerrada.
 */
export class InMemorySimulationLedger {
  private balances = new Map<number, number>();
  readonly initialTotal: number;
  private totalDebits = 0;
  private totalCredits = 0;

  constructor(users: VirtualUser[], initialBalancePerUser: number) {
    this.initialTotal = users.length * initialBalancePerUser;
    users.forEach(user => this.balances.set(user.id, initialBalancePerUser));
  }

  debit(userId: number, amount: number) {
    const balance = this.balances.get(userId);
    if (balance === undefined) throw new Error("Usuario virtual inexistente.");
    if (amount < 0 || balance < amount) throw new Error("Saldo virtual insuficiente durante la simulación.");
    this.balances.set(userId, balance - amount);
    this.totalDebits += amount;
  }

  credit(userId: number, amount: number) {
    const balance = this.balances.get(userId);
    if (balance === undefined) throw new Error("Usuario virtual inexistente.");
    if (amount < 0) throw new Error("El premio virtual no puede ser negativo.");
    this.balances.set(userId, balance + amount);
    this.totalCredits += amount;
  }

  get finalTotal() {
    return Array.from(this.balances.values()).reduce((sum, balance) => sum + balance, 0);
  }

  get costTotal() {
    return this.totalDebits;
  }

  get prizeTotal() {
    return this.totalCredits;
  }

  get isConsistent() {
    return this.initialTotal - this.totalDebits + this.totalCredits === this.finalTotal;
  }
}
