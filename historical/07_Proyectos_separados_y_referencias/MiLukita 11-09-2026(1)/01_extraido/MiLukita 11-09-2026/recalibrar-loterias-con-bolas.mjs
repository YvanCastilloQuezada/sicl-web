function choose(n, k) {
  if (k < 0 || k > n) return 0n;
  const limit = Math.min(k, n - k);
  let result = 1n;
  for (let i = 1; i <= limit; i += 1) result = (result * BigInt(n - limit + i)) / BigInt(i);
  return result;
}

function matchProbability(total, picks, matches) {
  return Number(choose(picks, matches) * choose(total - picks, picks - matches)) / Number(choose(total, picks));
}

function extraMatchProbability(total, picks, extraBalls) {
  return Array.from({ length: picks + 1 }, (_, matches) => {
    const remainingTicketNumbers = picks - matches;
    const pool = total - picks;
    const noExtraMatch = Number(choose(pool - remainingTicketNumbers, extraBalls)) / Number(choose(pool, extraBalls));
    return matchProbability(total, picks, matches) * (1 - noExtraMatch);
  }).reduce((sum, value) => sum + value, 0);
}

const plans = [
  { id: "Lot 19", total: 19, picks: 3, configurations: [
    { balls: 0, cost: 1, prizes: { 3: 70, 2: 16 }, consolation: 0 },
    { balls: 1, cost: 2, prizes: { 3: 70, 2: 17 }, consolation: 5 },
  ]},
  { id: "Lot 29", total: 29, picks: 4, configurations: [
    { balls: 0, cost: 1, prizes: { 4: 80, 3: 39, 2: 9 }, consolation: 0 },
    { balls: 1, cost: 2, prizes: { 4: 80, 3: 59, 2: 10 }, consolation: 5 },
  ]},
  { id: "Lot 39", total: 39, picks: 5, configurations: [
    { balls: 0, cost: 1, prizes: { 5: 100000, 4: 100, 3: 5, 2: 2, 1: 1 }, consolation: 0 },
    { balls: 1, cost: 2, prizes: { 5: 100000, 4: 250, 3: 10, 2: 3, 1: 1 }, consolation: 5 },
  ]},
  { id: "Lot 49", total: 49, picks: 6, configurations: [
    { balls: 0, cost: 1, prizes: { 6: 350000, 5: 100, 4: 20, 3: 8, 2: 5 }, consolation: 0 },
    { balls: 1, cost: 2, prizes: { 6: 350000, 5: 50, 4: 20, 3: 7, 2: 7 }, consolation: 5 },
    { balls: 2, cost: 3, prizes: { 6: 350000, 5: 100, 4: 25, 3: 9, 2: 9 }, consolation: 5 },
  ]},
  { id: "Lot 59", total: 59, picks: 6, configurations: [
    { balls: 0, cost: 1, prizes: { 6: 1200000, 5: 50, 4: 13, 3: 13, 2: 7 }, consolation: 0 },
    { balls: 1, cost: 2, prizes: { 6: 1200000, 5: 50, 4: 27, 3: 27, 2: 9 }, consolation: 5 },
    { balls: 2, cost: 3, prizes: { 6: 1200000, 5: 100, 4: 40, 3: 35, 2: 12 }, consolation: 5 },
    { balls: 3, cost: 4, prizes: { 6: 1200000, 5: 200, 4: 70, 3: 50, 2: 15 }, consolation: 5 },
  ]},
];

const report = plans.flatMap((plan) => plan.configurations.map((configuration) => {
  const expectedBase = Object.entries(configuration.prizes).reduce((sum, [matches, prize]) => sum + matchProbability(plan.total, plan.picks, Number(matches)) * prize, 0);
  const extraProbability = configuration.balls ? extraMatchProbability(plan.total, plan.picks, configuration.balls) : 0;
  const expectedConsolation = extraProbability * configuration.consolation;
  const rtp = (expectedBase + expectedConsolation) / configuration.cost;
  return { lottery: plan.id, balls: configuration.balls, cost: configuration.cost, prizes: configuration.prizes, consolation: configuration.consolation, extraMatchProbability: extraProbability, expectedBase, expectedConsolation, rtp, houseEdge: 1 - rtp };
}));

console.log(JSON.stringify(report, null, 2));
