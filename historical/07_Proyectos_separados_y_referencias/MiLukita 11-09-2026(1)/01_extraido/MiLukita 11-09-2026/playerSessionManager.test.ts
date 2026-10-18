import { describe, expect, it } from "vitest";
import { PlayerSessionManager, REALTIME_DISCONNECT_AFTER_MS, REALTIME_IDLE_AFTER_MS, REALTIME_MAX_PLAYERS } from "./playerSessionManager";

describe("PlayerSessionManager", () => {
  it("crea una sesión y devuelve el jugador en el lobby", () => {
    const manager = new PlayerSessionManager();
    const result = manager.join({ requestId: "join-000001", roundId: "round-001", deviceId: "device-001", nickname: "Ana", avatar: "avatar-a" }, 1_000);
    expect(result.player.status).toBe("ACTIVE");
    expect(result.lobby.connectedCount).toBe(1);
    expect(result.session.roundId).toBe("round-001");
  });

  it("hace join idempotente por requestId", () => {
    const manager = new PlayerSessionManager();
    const input = { requestId: "join-000002", roundId: "round-001", deviceId: "device-002", nickname: "Luis", avatar: "avatar-b" };
    const first = manager.join(input, 1_000); const second = manager.join(input, 2_000);
    expect(second.duplicate).toBe(true);
    expect(second.session.sessionId).toBe(first.session.sessionId);
    expect(second.lobby.players).toHaveLength(1);
  });

  it("respeta el máximo de 100 jugadores", () => {
    const manager = new PlayerSessionManager(REALTIME_MAX_PLAYERS);
    for (let index = 0; index < REALTIME_MAX_PLAYERS; index += 1) manager.join({ requestId: `join-${String(index).padStart(6, "0")}`, roundId: "round-100", deviceId: `device-${index}`, nickname: `P${index}`, avatar: "default" }, 1_000);
    expect(() => manager.join({ requestId: "join-overflow", roundId: "round-100", deviceId: "device-overflow", nickname: "Overflow", avatar: "default" }, 1_000)).toThrow("máximo");
  });

  it("pasa a IDLE y luego DISCONNECTED sin perder la sesión", () => {
    const manager = new PlayerSessionManager();
    const result = manager.join({ requestId: "join-000003", roundId: "round-002", deviceId: "device-003", nickname: "Rosa", avatar: "default" }, 1_000);
    const idle = manager.sweep(1_000 + REALTIME_IDLE_AFTER_MS);
    expect(idle[0]?.players[0]?.status).toBe("IDLE");
    const disconnected = manager.sweep(1_000 + REALTIME_DISCONNECT_AFTER_MS);
    expect(disconnected[0]?.players[0]?.status).toBe("DISCONNECTED");
    const reconnected = manager.reconnect(result.session.sessionToken, "device-003", "reconnect-0003", 100_000);
    expect(reconnected.player.status).toBe("ACTIVE");
  });

  it("actualiza heartbeat y permite salida idempotente", () => {
    const manager = new PlayerSessionManager();
    const result = manager.join({ requestId: "join-000004", roundId: "round-003", deviceId: "device-004", nickname: "Mia", avatar: "default" }, 1_000);
    const heartbeat = manager.heartbeat(result.session.sessionToken, "heartbeat-0004", 10_000);
    expect(heartbeat.player.lastActiveAt).toBe(new Date(10_000).toISOString());
    const left = manager.leave(result.session.sessionToken, "leave-0004", 11_000);
    const leftAgain = manager.leave(result.session.sessionToken, "leave-0004", 12_000);
    expect(left.player.status).toBe("LEFT");
    expect(leftAgain.duplicate).toBe(true);
  });
});
