import { describe, expect, it } from "vitest";
import { closeAndDrawRound } from "./pilot";

describe("claim transaccional de cierre", () => {
  it("abre una transacción y bloquea la ronda antes de consultar su estado", async () => {
    let transactionStarted = false;
    let lockQuery = "";
    const db = {
      transaction: async (callback: (tx: { execute: (query: unknown) => Promise<unknown> }) => Promise<unknown>) => {
        transactionStarted = true;
        return callback({
          execute: async (query: { queryChunks?: unknown[] }) => {
            lockQuery = JSON.stringify(query.queryChunks ?? query);
            return [[], []];
          },
        });
      },
    };

    await expect(closeAndDrawRound(undefined, "RP-R-NOT-FOUND", db)).rejects.toThrow("No se encontró la ronda");
    expect(transactionStarted).toBe(true);
    expect(lockQuery).toContain("publicId");
  });
});
