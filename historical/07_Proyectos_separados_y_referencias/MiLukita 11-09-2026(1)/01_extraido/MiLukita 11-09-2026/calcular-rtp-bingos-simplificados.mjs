const comb = (n, r) => {
  if (r < 0 || r > n) return 0n;
  const k = Math.min(r, n - r);
  let value = 1n;
  for (let i = 1; i <= k; i += 1) value = (value * BigInt(n - k + i)) / BigInt(i);
  return value;
};

const ratio = (numerator, denominator) => Number(numerator) / Number(denominator);
const percent = (value) => `${(value * 100).toFixed(8)}%`;

const flashPayouts = { 3: 39, 4: 20, 5: 13, 6: 7, 7: 4, 8: 3, 9: 2 };
const flashDenominator = comb(15, 3);
const flashRtp = Object.entries(flashPayouts).reduce((sum, [draw, payout]) => sum + ratio(comb(Number(draw) - 1, 2), flashDenominator) * payout, 0);

const kenoBasePayouts = { 10: 670, 9: 335, 8: 135, 7: 55, 6: 20, 5: 10 };
const kenoDenominator = comb(80, 20);
const kenoBaseRtp = Object.entries(kenoBasePayouts).reduce((sum, [hits, payout]) => sum + ratio(comb(10, Number(hits)) * comb(70, 20 - Number(hits)), kenoDenominator) * payout, 0);

const bingo75Patterns = [
  [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
  [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
  [0, 6, 18, 24], [4, 8, 16, 20],
];
const bingo75Denominator = comb(75, 40);
let bingo75Numerator = 0n;
for (let mask = 1; mask < (1 << bingo75Patterns.length); mask += 1) {
  const required = new Set();
  let included = 0;
  for (let pattern = 0; pattern < bingo75Patterns.length; pattern += 1) {
    if (mask & (1 << pattern)) {
      included += 1;
      bingo75Patterns[pattern].forEach((cell) => required.add(cell));
    }
  }
  const term = comb(75 - required.size, 40 - required.size);
  bingo75Numerator += included % 2 ? term : -term;
}
const bingo75LineProbability = ratio(bingo75Numerator, bingo75Denominator);
const bingo75Payout = 2;
const bingo75Rtp = bingo75LineProbability * bingo75Payout;

console.log(JSON.stringify({
  flash: { payoutByCompletionDraw: flashPayouts, rtp: flashRtp, rtpPercent: percent(flashRtp) },
  keno: { proposedPayoutByHits: kenoBasePayouts, rtp: kenoBaseRtp, rtpPercent: percent(kenoBaseRtp) },
  bingo75: {
    pattern: "cualquiera de 12 líneas (filas, columnas o diagonales), con centro libre",
    draws: 40,
    payoutMultiplier: bingo75Payout,
    probability: bingo75LineProbability,
    rtp: bingo75Rtp,
    rtpPercent: percent(bingo75Rtp),
  },
}, null, 2));
