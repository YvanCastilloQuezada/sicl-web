import fs from "node:fs";
import path from "node:path";
import { GAME_TYPES, type GameType } from "../server/pilot";
import { simulateProfile } from "../server/simulator/engine";
import { SIMULATOR_GAME_CONFIG } from "../server/simulator/loadGenerator";
import { theoreticalRtp } from "../server/simulator/reporter";

const OUTPUT = path.resolve(process.cwd(), "docs/reporte-simulacion-50k.json");
const ROUNDS = 100;
const TICKETS_PER_ROUND = 500;
const results = GAME_TYPES.map((gameType: GameType) => {
  const simulation = simulateProfile({ name: `${gameType}-50k`, totalRounds: ROUNDS, ticketsPerRound: TICKETS_PER_ROUND, users: 100, games: [gameType], seed: `task-26-${gameType}-50k-v1`, initialBalancePerUser: 5_000_000, outputReport: OUTPUT, targetP95Ms: 500, rtpTolerance: 0.2 });
  const tickets = simulation.rounds.flatMap((round) => round.tickets);
  const totalCost = tickets.reduce((sum, ticket) => sum + ticket.cost, 0);
  const totalPrize = tickets.reduce((sum, ticket) => sum + ticket.prize, 0);
  return { gameType, rounds: ROUNDS, tickets: tickets.length, priceCredits: SIMULATOR_GAME_CONFIG[gameType].price, totalCostCredits: totalCost, totalPrizeCredits: totalPrize, observedRtp: totalCost ? totalPrize / totalCost : 0, theoreticalRtp: theoreticalRtp(gameType, tickets.length), winningTickets: tickets.filter((ticket) => ticket.prize > 0).length };
});
fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, JSON.stringify({ generatedAt: new Date().toISOString(), scope: "virtual-only workload; not proof of real-money profitability", roundsPerGame: ROUNDS, ticketsPerGame: TICKETS_PER_ROUND, results }, null, 2));
console.table(results.map(({ gameType, tickets, totalCostCredits, totalPrizeCredits, observedRtp, theoreticalRtp: expected }) => ({ gameType, tickets, totalCostCredits, totalPrizeCredits, observedRtp: Number((observedRtp * 100).toFixed(4)), theoreticalRtp: Number((expected * 100).toFixed(4)) })));
console.log(`Reporte escrito en ${OUTPUT}`);
