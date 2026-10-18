import { combination, lotteryMatchProbability } from "../shared/lotteryVariants";

type LotteryTable = Record<number, number>;

function lotteryRtp(range: number, prizes: LotteryTable) {
  return Object.entries(prizes).reduce((total, [matches, prize]) => total + lotteryMatchProbability(range, Number(matches)) * prize, 0);
}

function jackpotProbability(matches: number) {
  return (combination(5, matches) * combination(15, 5 - matches)) / combination(20, 5);
}

function trioProbability(matches: number) {
  return (combination(3, matches) * combination(10, 3 - matches)) / combination(13, 3);
}

const proposals = {
  ruleta: { exacta: 31 },
  bingo: { cartillaGanadora: 4, totalCartillas: 5 },
  jackpot: { 5: 11_750, 4: 5, 3: 1 },
  trio13: { 3: 48, 2: 2, 1: 1 },
  loteria_29: { 6: 7_000, 5: 320, 4: 46, 3: 5 },
  loteria_39: { 6: 50_000, 5: 1_167, 4: 108, 3: 10, 2: 1 },
  loteria_49: { 6: 200_000, 5: 2_500, 4: 160, 3: 21, 2: 2 },
  loteria_59: { 6: 500_000, 5: 10_000, 4: 250, 3: 25, 2: 4 },
};

const report = {
  ruleta: proposals.ruleta.exacta / 37,
  bingo: proposals.bingo.cartillaGanadora / proposals.bingo.totalCartillas,
  jackpot: Object.entries(proposals.jackpot).reduce((total, [matches, prize]) => total + jackpotProbability(Number(matches)) * prize, 0),
  trio13: Object.entries(proposals.trio13).reduce((total, [matches, prize]) => total + trioProbability(Number(matches)) * prize, 0),
  loteria: lotteryRtp(49, proposals.loteria_49),
  loteria_29: lotteryRtp(29, proposals.loteria_29),
  loteria_39: lotteryRtp(39, proposals.loteria_39),
  loteria_49: lotteryRtp(49, proposals.loteria_49),
  loteria_59: lotteryRtp(59, proposals.loteria_59),
};

console.table(Object.entries(report).map(([game, rtp]) => ({ juego: game, rtp: Number((rtp * 100).toFixed(6)), premioEsperadoPorBoleto: Number(rtp.toFixed(8)) })));
console.table([29, 39, 49, 59].flatMap((range) => [2, 3, 4, 5, 6].map((matches) => ({ rango: range, aciertos: matches, probabilidad: Number(lotteryMatchProbability(range, matches).toFixed(10)) }))));
console.table([1, 2, 3, 4, 5].map((matches) => ({ juego: "jackpot", aciertos: matches, probabilidad: Number(jackpotProbability(matches).toFixed(10)) })).concat([1, 2, 3].map((matches) => ({ juego: "trio13", aciertos: matches, probabilidad: Number(trioProbability(matches).toFixed(10)) }))));
console.log(JSON.stringify({ proposals, report }, null, 2));
