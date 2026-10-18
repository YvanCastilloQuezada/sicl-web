import { performance } from "node:perf_hooks";
import { type GameType } from "../pilot";
import { VIRTUAL_LOTTERY_VARIANTS, isVirtualLotteryGameType } from "../../shared/lotteryVariants";
import { InMemorySimulationLedger } from "./database";
import { generatePick, pickVirtualUser, SIMULATOR_GAME_CONFIG } from "./loadGenerator";
import { SeededRandom } from "./random";
import type { SimulationProfile, VirtualUser } from "./types";

export type RoundTicket = { userId: number; picks: number[]; durationMs: number; cost: number; prize: number };
export type SimulatedRound = { gameType: GameType; tickets: RoundTicket[]; totalCost: number; totalPrize: number };

function matchCount(picks: number[], result: number[]) {
  return picks.filter(pick => result.includes(pick)).length;
}

function drawResult(gameType: GameType, random: SeededRandom): number[] {
  if (gameType === "ruleta") return [random.integer(37)];
  if (gameType === "bingo") return [random.integer(3) + 1];
  if (gameType === "jackpot") return random.unique(20, 5);
  if (gameType === "cartas") return random.unique(13, 3);
  if (isVirtualLotteryGameType(gameType)) return random.unique(VIRTUAL_LOTTERY_VARIANTS[gameType].range, VIRTUAL_LOTTERY_VARIANTS[gameType].pickCount);
  return random.unique(49, 6);
}

function basePrize(gameType: GameType, picks: number[], result: number[]): number {
  const matches = matchCount(picks, result);
  if (gameType === "ruleta") return matches === 1 ? 360 : 0;
  if (gameType === "bingo") return matches === 1 ? 82 : 0;
  if (gameType === "cartas") return matches === 3 ? 700 : matches === 2 ? 37 : matches === 1 ? 5 : 0;
  if (isVirtualLotteryGameType(gameType)) return VIRTUAL_LOTTERY_VARIANTS[gameType].prizeTable[matches] ?? 0;
  return matches === 4 ? 1200 : matches === 3 ? 240 : 0;
}

export function simulateRound(gameType: GameType, users: VirtualUser[], ticketsPerRound: number, ledger: InMemorySimulationLedger, random: SeededRandom): SimulatedRound {
  const result = drawResult(gameType, random);
  const config = SIMULATOR_GAME_CONFIG[gameType];
  const tickets: RoundTicket[] = [];
  const jackpotCandidates: { ticketIndex: number; matches: number }[] = [];

  for (let index = 0; index < ticketsPerRound; index += 1) {
    const started = performance.now();
    const user = pickVirtualUser(users, random);
    const picks = generatePick(gameType, random);
    ledger.debit(user.id, config.price);
    const matches = matchCount(picks, result);
    tickets.push({ userId: user.id, picks, durationMs: performance.now() - started, cost: config.price, prize: basePrize(gameType, picks, result) });
    if (gameType === "jackpot") jackpotCandidates.push({ ticketIndex: index, matches });
  }

  if (gameType === "jackpot") {
    const winners = jackpotCandidates.filter(candidate => candidate.matches === 5);
    const virtualPool = 18_400 + Math.round(ticketsPerRound * config.price * 0.35);
    const share = winners.length ? Math.floor(virtualPool / winners.length) : 0;
    winners.forEach(winner => { tickets[winner.ticketIndex].prize = share; });
  }

  tickets.forEach(ticket => { if (ticket.prize > 0) ledger.credit(ticket.userId, ticket.prize); });
  return {
    gameType,
    tickets,
    totalCost: tickets.reduce((sum, ticket) => sum + ticket.cost, 0),
    totalPrize: tickets.reduce((sum, ticket) => sum + ticket.prize, 0),
  };
}

export function chooseGame(roundIndex: number, games: readonly GameType[]): GameType {
  return games[roundIndex % games.length];
}

export function chooseGameConfig(gameType: GameType) {
  return SIMULATOR_GAME_CONFIG[gameType];
}

export function simulateProfile(config: SimulationProfile) {
  const random = new SeededRandom(config.seed);
  const users = Array.from({ length: config.users }, (_, index) => ({ id: index + 1, openId: `sim-user-${index + 1}`, name: `Simulador ${index + 1}` }));
  const ledger = new InMemorySimulationLedger(users, config.initialBalancePerUser);
  const rounds: SimulatedRound[] = [];
  for (let roundIndex = 0; roundIndex < config.totalRounds; roundIndex += 1) {
    rounds.push(simulateRound(chooseGame(roundIndex, config.games), users, config.ticketsPerRound, ledger, random));
  }
  return { rounds, ledger };
}
