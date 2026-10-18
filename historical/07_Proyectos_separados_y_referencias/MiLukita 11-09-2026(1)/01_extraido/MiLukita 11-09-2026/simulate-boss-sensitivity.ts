import { SeededRandom } from "../server/simulator/random";
import { VirtualRewardLedger } from "../server/rewards/rewardLedger";

const scenarios = [
  { name: "EASY", targetVictoryRate: 0.95, reward: 50 },
  { name: "STANDARD", targetVictoryRate: 0.85, reward: 100 },
  { name: "HARD", targetVictoryRate: 0.75, reward: 150 },
  { name: "EXPERT", targetVictoryRate: 0.6, reward: 250 },
] as const;
const gamesPerScenario = 1_000;
const results = scenarios.map((scenario) => {
  const random = new SeededRandom(`milukita-boss-${scenario.name.toLowerCase()}-v1`);
  const ledger = new VirtualRewardLedger();
  let victories = 0;
  for (let index = 1; index <= gamesPerScenario; index += 1) if (random.next() < scenario.targetVictoryRate) { victories += 1; ledger.award({ idempotencyKey: `${scenario.name}:t:${index}`, kind: "TOURNAMENT_PRIZE", recipientId: `player-${index % 20}`, amount: scenario.reward, reason: `${scenario.name} victory` }); }
  const rate = victories / gamesPerScenario;
  return { difficulty: scenario.name, targetVictoryRate: scenario.targetVictoryRate, victories, defeats: gamesPerScenario - victories, observedVictoryRate: Number(rate.toFixed(4)), observedVictoryRatePercent: `${(rate * 100).toFixed(2)}%`, totalRewards: ledger.list().reduce((sum, entry) => sum + entry.amount, 0), entries: ledger.list().length };
});
console.log(JSON.stringify({ generatedAt: new Date().toISOString(), gamesPerScenario, results, interpretation: "Sensitivity analysis only. Results are deterministic samples under configured targets and do not guarantee victory, RTP, profitability or user outcomes." }, null, 2));
