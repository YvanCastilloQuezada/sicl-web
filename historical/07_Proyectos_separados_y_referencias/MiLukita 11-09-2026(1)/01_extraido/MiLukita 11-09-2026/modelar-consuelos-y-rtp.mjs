import { combination, lotteryMatchProbability } from "../shared/lotteryVariants.ts";

const target = 0.85;
const chooseNearest = (candidates) => candidates.sort((left, right) => Math.abs(left.rtp - target) - Math.abs(right.rtp - target))[0];

const flashCompletionProbability = (completion) => combination(completion - 1, 2) / combination(15, 3);
const flashCandidates = [];
for (const p3 of [33, 34, 35, 36]) for (const p4 of [16, 17, 18, 19]) for (const p5 of [10, 11, 12]) for (const p6 of [5, 6, 7]) for (const p7 of [3, 4]) for (const p8 of [2, 3]) for (const p9 of [1, 2]) for (const consolation of [1, 2, 3, 4, 5]) {
  const payouts = { 3: p3, 4: p4, 5: p5, 6: p6, 7: p7, 8: p8, 9: p9 };
  const base = Object.entries(payouts).reduce((sum, [draw, prize]) => sum + flashCompletionProbability(Number(draw)) * prize, 0);
  const rtp = base + flashCompletionProbability(10) * consolation;
  flashCandidates.push({ rtp, payouts, consolation, extraEvent: "Completar exactamente con la décima bolilla" });
}

const kenoProbability = (hits) => lotteryMatchProbability(80, hits, 10) * combination(70, 20 - hits) / combination(70, 10 - hits) / 1; // overwritten below
const kenoHypergeom = (hits) => combination(10, hits) * combination(70, 20 - hits) / combination(80, 20);
const kenoBonusProbability = kenoHypergeom(4) * (6 / 60);
const kenoCandidates = [];
for (const p5 of [7, 8, 9, 10]) for (const p6 of [16, 17, 18, 19, 20]) for (const p7 of [44, 45, 46, 47, 48, 49, 50]) for (const p8 of [108, 110, 115, 120, 125, 130]) for (const p9 of [268, 270, 275, 280, 285, 290, 300]) for (const p10 of [535, 540, 550, 560, 570, 580, 600]) for (const consolation of [1, 2, 3, 4, 5, 6, 7, 8]) {
  const payouts = { 5: p5, 6: p6, 7: p7, 8: p8, 9: p9, 10: p10 };
  const base = Object.entries(payouts).reduce((sum, [hits, prize]) => sum + kenoHypergeom(Number(hits)) * prize, 0);
  const rtp = base + kenoBonusProbability * consolation;
  kenoCandidates.push({ rtp, payouts, consolation, extraEvent: "Exactamente 4 aciertos en 20 llamadas y quinta coincidencia con la bolilla 21" });
}

const bingo75Patterns = [
  [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
  [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
  [0, 6, 18, 24], [4, 8, 16, 20],
];
function bingo75LineProbability(calls) {
  let total = 0;
  for (let mask = 1; mask < (1 << bingo75Patterns.length); mask += 1) {
    const cells = new Set();
    let selected = 0;
    for (let index = 0; index < bingo75Patterns.length; index += 1) if (mask & (1 << index)) {
      selected += 1;
      bingo75Patterns[index].forEach((cell) => cells.add(cell));
    }
    const size = cells.size;
    const probability = combination(75 - size, calls - size) / combination(75, calls);
    total += selected % 2 === 1 ? probability : -probability;
  }
  return total;
}
const bingo75BaseProbability = bingo75LineProbability(40);
const bingo75BonusProbability = bingo75LineProbability(41) - bingo75BaseProbability;
const bingo75Candidates = [];
for (const basePrize of [1, 2, 3]) for (const consolation of Array.from({ length: 30 }, (_, index) => index + 1)) bingo75Candidates.push({ rtp: bingo75BaseProbability * basePrize + bingo75BonusProbability * consolation, basePrize, consolation, extraEvent: "Sin línea a 40 llamadas y línea completada exactamente con la bolilla 41" });

const jackpotProbability = (matches) => lotteryMatchProbability(20, matches, 5);
const jackpotBonusProbability = jackpotProbability(2) * (3 / 15);
const jackpotCandidates = [];
for (const p3 of [0, 1, 2]) for (const p4 of [3, 4, 5, 6]) for (const p5 of [11600, 11650, 11700, 11750, 11800, 11850, 11900]) for (const consolation of Array.from({ length: 1 }, (_, index) => index + 1)) {
  const payouts = { 3: p3, 4: p4, 5: p5 };
  const base = Object.entries(payouts).reduce((sum, [matches, prize]) => sum + jackpotProbability(Number(matches)) * prize, 0);
  const rtp = base + jackpotBonusProbability * consolation;
  jackpotCandidates.push({ rtp, payouts, consolation, extraEvent: "Exactamente 2 coincidencias principales y tercera coincidencia con la sexta bola" });
}

const rouletteProposals = [
  { game: "ruleta_17", winningOutcomesPerBet: 7, totalPayout: 2, rtp: (7 * 2) / 17 },
  { game: "ruleta_27", winningOutcomesPerBet: 12, totalPayout: 2, rtp: (12 * 2) / 27 },
  { game: "ruleta_37", winningOutcomesPerBet: 16, totalPayout: 2, rtp: (16 * 2) / 37 },
];

console.log(JSON.stringify({
  targetRtp: target,
  bingo: {
    flash: chooseNearest(flashCandidates),
    keno: chooseNearest(kenoCandidates),
    bingo75: { baseLineProbabilityAt40: bingo75BaseProbability, additionalLineProbabilityAt41: bingo75BonusProbability, candidate: chooseNearest(bingo75Candidates) },
  },
  jackpot: { bonusEventProbability: jackpotBonusProbability, candidate: chooseNearest(jackpotCandidates) },
  roulettes: rouletteProposals,
}, null, 2));
