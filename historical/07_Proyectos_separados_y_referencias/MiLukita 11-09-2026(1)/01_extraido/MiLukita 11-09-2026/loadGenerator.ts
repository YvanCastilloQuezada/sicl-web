import type { GameType } from "../pilot";
import { SeededRandom } from "./random";
import type { VirtualUser } from "./types";

export const SIMULATOR_GAME_CONFIG: Record<GameType, { price: number; pickLimit: number; range: number; startAt: number }> = {
  ruleta: { price: 20, pickLimit: 1, range: 37, startAt: 0 },
  ruleta_7: { price: 1, pickLimit: 1, range: 4, startAt: 0 },
  ruleta_17: { price: 1, pickLimit: 1, range: 4, startAt: 0 },
  ruleta_27: { price: 1, pickLimit: 1, range: 4, startAt: 0 },
  ruleta_37: { price: 1, pickLimit: 1, range: 4, startAt: 0 },
  jackpot: { price: 45, pickLimit: 5, range: 20, startAt: 1 },
  bingo: { price: 35, pickLimit: 1, range: 3, startAt: 1 },
  bingo_flash: { price: 1, pickLimit: 3, range: 15, startAt: 1 },
  bingo_keno: { price: 1, pickLimit: 10, range: 80, startAt: 1 },
  bingo_75: { price: 1, pickLimit: 24, range: 75, startAt: 1 },
  loteria_19: { price: 1, pickLimit: 3, range: 19, startAt: 1 },
  loteria_29: { price: 1, pickLimit: 6, range: 29, startAt: 1 },
  loteria_39: { price: 1, pickLimit: 6, range: 39, startAt: 1 },
  loteria_39_5: { price: 1, pickLimit: 5, range: 39, startAt: 1 },
  loteria_49: { price: 1, pickLimit: 6, range: 49, startAt: 1 },
  loteria_59: { price: 1, pickLimit: 6, range: 59, startAt: 1 },
  cartas: { price: 10, pickLimit: 3, range: 13, startAt: 1 },
  sueldo_vida: { price: 1, pickLimit: 4, range: 30, startAt: 1 },
  raspa_digital: { price: 1, pickLimit: 1, range: 20, startAt: 1 },
  pick_3: { price: 1, pickLimit: 3, range: 10, startAt: 0 },
  pick_4: { price: 1, pickLimit: 4, range: 10, startAt: 0 },
  loto_diario: { price: 1, pickLimit: 4, range: 20, startAt: 1 },
  loto_express: { price: 1, pickLimit: 3, range: 10, startAt: 1 },
};

export function generatePick(gameType: GameType, random: SeededRandom): number[] {
  const config = SIMULATOR_GAME_CONFIG[gameType];
  if (gameType === "pick_3" || gameType === "pick_4") {
    return Array.from({ length: config.pickLimit }, () => config.startAt + random.integer(config.range));
  }
  return random.unique(config.range, config.pickLimit, config.startAt);
}

export function createVirtualUsers(count: number): VirtualUser[] {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    openId: `sim-user-${index + 1}`,
    name: `Simulador ${index + 1}`,
  }));
}

export function pickVirtualUser(users: VirtualUser[], random: SeededRandom): VirtualUser {
  return users[random.integer(users.length)];
}
