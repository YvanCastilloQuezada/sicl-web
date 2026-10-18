function choose(n, k) {
  if (k < 0 || k > n) return 0n;
  const limit = Math.min(k, n - k);
  let result = 1n;
  for (let i = 1; i <= limit; i += 1) result = (result * BigInt(n - limit + i)) / BigInt(i);
  return result;
}

function probability(totalNumbers, pickCount, matches) {
  return Number(choose(pickCount, matches) * choose(totalNumbers - pickCount, pickCount - matches)) / Number(choose(totalNumbers, pickCount));
}

const candidates = [
  { id: "Lot 19", totalNumbers: 19, pickCount: 3, prizes: { 3: 70, 2: 3 }, statedRtp: 0.851 },
  { id: "Lot 29", totalNumbers: 29, pickCount: 4, prizes: { 4: 80, 3: 15, 2: 1.5 }, statedRtp: 0.853 },
  { id: "Lot 39", totalNumbers: 39, pickCount: 5, prizes: { 5: 100000, 4: 8000, 3: 600, 2: 50, 1: 5 }, statedRtp: 0.852 },
  { id: "Lot 49", totalNumbers: 49, pickCount: 6, prizes: { 6: 350000, 5: 7000, 4: 500, 3: 50, 2: 5 }, statedRtp: 0.851 },
  { id: "Lot 59", totalNumbers: 59, pickCount: 6, prizes: { 6: 1200000, 5: 6000, 4: 450, 3: 40, 2: 4 }, statedRtp: 0.852 },
];

const results = candidates.map((candidate) => {
  const contribution = Object.entries(candidate.prizes).map(([matches, prize]) => ({ matches: Number(matches), prize, probability: probability(candidate.totalNumbers, candidate.pickCount, Number(matches)) }));
  const rtp = contribution.reduce((sum, row) => sum + row.probability * row.prize, 0);
  const probabilities = Array.from({ length: candidate.pickCount + 1 }, (_, matches) => ({ matches, probability: probability(candidate.totalNumbers, candidate.pickCount, matches) }));
  return { id: candidate.id, statedRtp: candidate.statedRtp, calculatedRtp: rtp, houseEdge: 1 - rtp, contribution, probabilities };
});

console.log(JSON.stringify(results, null, 2));
