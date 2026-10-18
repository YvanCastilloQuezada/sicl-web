import { SeededRandom } from "../server/simulator/random";
import { VirtualRewardLedger } from "../server/rewards/rewardLedger";

const totalGames = 1_000;
const targetVictoryRate = 0.85;
const random = new SeededRandom("milukita-boss-fight-1000-v1");
const ledger = new VirtualRewardLedger();
let victories = 0;
let totalRewards = 0;
const byKind = { TOURNAMENT_PRIZE: 0, COOPERATIVE_ACHIEVEMENT: 0 };
for (let index = 1; index <= totalGames; index += 1) {
  const won = random.next() < targetVictoryRate;
  if (!won) continue;
  victories += 1;
  const tournament = ledger.award({ idempotencyKey: `simulation:tournament:${index}`, kind: "TOURNAMENT_PRIZE", recipientId: `player-${(index % 20) + 1}`, amount: 100, reason: "Victoria simulada" });
  const cooperative = ledger.award({ idempotencyKey: `simulation:cooperative:${index}`, kind: "COOPERATIVE_ACHIEVEMENT", recipientId: `team-${(index % 5) + 1}`, amount: 25, reason: "Logro cooperativo simulado" });
  totalRewards += tournament.amount + cooperative.amount;
  byKind.TOURNAMENT_PRIZE += tournament.amount; byKind.COOPERATIVE_ACHIEVEMENT += cooperative.amount;
}
const victoryRate = victories / totalGames;
const report = { generatedAt: new Date().toISOString(), seed: "milukita-boss-fight-1000-v1", totalGames, targetVictoryRate, victories, defeats: totalGames - victories, observedVictoryRate: Number(victoryRate.toFixed(4)), observedVictoryRatePercent: `${(victoryRate * 100).toFixed(2)}%`, totalRewards, byKind, entries: ledger.list().length, interpretation: "La simulación mide una muestra reproducible bajo una probabilidad objetivo; no demuestra una garantía de victoria, rentabilidad, RTP ni desempeño de usuarios reales." };
console.log(JSON.stringify(report, null, 2));
