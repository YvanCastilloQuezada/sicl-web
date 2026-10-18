import { describe, expect, it } from "vitest";
import { SharedClaimStore } from "./dualInstanceSimulation";

describe("P0 · concurrencia y aislamiento de claims", () => {
  it("garantiza que dos procesos simultáneos no pueden capturar el mismo bucket de evento", async () => {
    const store = new SharedClaimStore();
    const eventId = "CONCURRENCY-P0-TEST";
    const now = new Date("2026-08-27T12:00:00.000Z");

    // Simulación de carrera: dos instancias intentan el claim al mismo tiempo
    const [instanceA, instanceB] = await Promise.all([
      store.claim(eventId, now, "instance-a"),
      store.claim(eventId, now, "instance-b"),
    ]);

    // Verificación de exclusión mutua
    const acquired = [instanceA, instanceB].filter(c => c.acquired);
    expect(acquired).toHaveLength(1);
    expect(store.size()).toBe(1);
    
    // El que falló debe tener la misma clave que el que ganó
    const winner = acquired[0];
    const loser = [instanceA, instanceB].find(c => !c.acquired)!;
    expect(loser.key).toBe(winner.key);
    expect(loser.instanceId).not.toBe(winner.instanceId);
  });

  it("permite claims distintos para eventos o ventanas temporales diferentes", async () => {
    const store = new SharedClaimStore();
    const now = new Date("2026-08-27T12:00:00.000Z");
    const later = new Date("2026-08-27T12:01:00.000Z");

    const event1 = await store.claim("EVENT-1", now, "instance-a");
    const event2 = await store.claim("EVENT-2", now, "instance-a");
    const event1Later = await store.claim("EVENT-1", later, "instance-a");

    expect(event1.acquired).toBe(true);
    expect(event2.acquired).toBe(true);
    expect(event1Later.acquired).toBe(true);
    expect(store.size()).toBe(3);
  });

  it("mantiene la idempotencia ante reintentos de la misma instancia", async () => {
    const store = new SharedClaimStore();
    const eventId = "IDEMPOTENCY-TEST";
    const now = new Date("2026-08-27T12:00:00.000Z");

    const first = await store.claim(eventId, now, "instance-a");
    const second = await store.claim(eventId, now, "instance-a");

    expect(first.acquired).toBe(true);
    expect(second.acquired).toBe(false); // Ya existe el claim en el store
    expect(store.size()).toBe(1);
  });
});
