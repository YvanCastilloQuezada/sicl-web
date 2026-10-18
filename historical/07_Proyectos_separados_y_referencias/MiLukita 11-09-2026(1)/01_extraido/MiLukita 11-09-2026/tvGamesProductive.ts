import type { SmartTvSimulationState } from "./smartTvSimulationContract";

export const TV_CONNECTION_STATES = ["REAL_CONNECTED", "SIMULATED_CONNECTED", "DEGRADED", "OFFLINE"] as const;
export type TvConnectionState = (typeof TV_CONNECTION_STATES)[number];

export type TvGamesContext = {
  connection: TvConnectionState;
  authenticated: boolean;
  capability: "tv" | "games" | "gamepad";
  isSimulation: boolean;
};

export function tvConnectionFromSimulation(state: SmartTvSimulationState): TvConnectionState {
  if (state === "connected") return "SIMULATED_CONNECTED";
  if (state === "scanning" || state === "found" || state === "connecting") return "DEGRADED";
  return "OFFLINE";
}

export function tvConnectionLabel(state: TvConnectionState): string {
  if (state === "REAL_CONNECTED") return "TV conectada · protocolo confirmado";
  if (state === "SIMULATED_CONNECTED") return "TV conectada · simulación local";
  if (state === "DEGRADED") return "Conexión en preparación";
  return "TV no conectada · fallback disponible";
}

export function canParticipateInGames(context: TvGamesContext): boolean {
  return context.authenticated && (context.connection === "REAL_CONNECTED" || context.connection === "SIMULATED_CONNECTED");
}

export function canUseGamepadOnTv(context: TvGamesContext): boolean {
  return context.authenticated && context.capability === "gamepad" && context.connection !== "OFFLINE";
}

export function isTvOrGamesAuthority(): boolean {
  return false;
}

export function preservesMjpCoreBoundary(context: TvGamesContext): boolean {
  return context.capability !== ("mjp-core" as TvGamesContext["capability"]);
}

export function fallbackRouteForTv(connection: TvConnectionState): "mobile" | "qr" | "none" {
  if (connection === "OFFLINE") return "qr";
  if (connection === "DEGRADED") return "mobile";
  return "none";
}
