import { describe, expect, it } from "vitest";
import { BossFightEngine } from "./games/bossFightEngine";

describe("BossFightEngine", () => {
  it("no acepta impactos antes de iniciar y cambia a ACTIVE al iniciar", () => {
    const engine = new BossFightEngine("round-1", "fight-1", 1_000);
    expect(engine.hit({ playerId: "p1", requestId: "r1", clientTime: 1_000, aim: { x: 0, y: 0 } }).reason).toBe("WRONG_PHASE");
    expect(engine.start(2_000).phase).toBe("ACTIVE");
  });

  it("actualiza la posición siguiendo patrones server-side", () => {
    const engine = new BossFightEngine("round-1", "fight-1", 0);
    engine.start(0);
    const first = engine.tick(1_000);
    const second = engine.tick(2_000);
    expect(first.updatedAt).toBe(1_000);
    expect(second.updatedAt).toBe(2_000);
    expect(second.bossPosition).not.toEqual({ x: 0, y: 0 });
  });

  it("acepta un impacto cercano y rechaza el request repetido", () => {
    const engine = new BossFightEngine("round-1", "fight-1", 0);
    engine.start(0);
    const state = engine.tick(0);
    const input = { playerId: "p1", requestId: "hit-1", clientTime: 0, aim: state.bossPosition };
    const hit = engine.hit(input, 0);
    expect(hit.accepted).toBe(true);
    expect(hit.damage).toBe(10);
    expect(engine.hit(input, 0).reason).toBe("DUPLICATE");
  });

  it("rechaza impactos fuera de alcance sin dañar al boss", () => {
    const engine = new BossFightEngine("round-1", "fight-1", 0);
    engine.start(0);
    const before = engine.getState().bossHealth;
    const result = engine.hit({ playerId: "p1", requestId: "far-1", clientTime: 0, aim: { x: 9, y: 9 } }, 0);
    expect(result.reason).toBe("OUT_OF_RANGE");
    expect(result.state.bossHealth).toBe(before);
  });
});
