import { describe, expect, it } from "vitest";
import {
  canParticipateInGames,
  canUseGamepadOnTv,
  fallbackRouteForTv,
  isTvOrGamesAuthority,
  preservesMjpCoreBoundary,
  tvConnectionFromSimulation,
  tvConnectionLabel,
} from "./tvGamesProductive";

describe("Fase E.5 TV + Games", () => {
  it("distingue simulación local de conexión real", () => {
    expect(tvConnectionFromSimulation("connected")).toBe("SIMULATED_CONNECTED");
    expect(tvConnectionFromSimulation("idle")).toBe("OFFLINE");
    expect(tvConnectionLabel("SIMULATED_CONNECTED")).toContain("simulación");
    expect(tvConnectionLabel("REAL_CONNECTED")).toContain("protocolo confirmado");
  });

  it("permite participación solo con sesión autorizada y conexión disponible", () => {
    expect(canParticipateInGames({ connection: "SIMULATED_CONNECTED", authenticated: true, capability: "games", isSimulation: true })).toBe(true);
    expect(canParticipateInGames({ connection: "OFFLINE", authenticated: true, capability: "games", isSimulation: true })).toBe(false);
    expect(canParticipateInGames({ connection: "REAL_CONNECTED", authenticated: false, capability: "games", isSimulation: false })).toBe(false);
  });

  it("conserva Gamepad como control sin autoridad y bloquea offline", () => {
    expect(canUseGamepadOnTv({ connection: "SIMULATED_CONNECTED", authenticated: true, capability: "gamepad", isSimulation: true })).toBe(true);
    expect(canUseGamepadOnTv({ connection: "OFFLINE", authenticated: true, capability: "gamepad", isSimulation: true })).toBe(false);
    expect(isTvOrGamesAuthority()).toBe(false);
    expect(preservesMjpCoreBoundary({ connection: "REAL_CONNECTED", authenticated: true, capability: "games", isSimulation: false })).toBe(true);
  });

  it("ofrece fallback explícito cuando TV no está disponible", () => {
    expect(fallbackRouteForTv("OFFLINE")).toBe("qr");
    expect(fallbackRouteForTv("DEGRADED")).toBe("mobile");
    expect(fallbackRouteForTv("REAL_CONNECTED")).toBe("none");
  });
});
