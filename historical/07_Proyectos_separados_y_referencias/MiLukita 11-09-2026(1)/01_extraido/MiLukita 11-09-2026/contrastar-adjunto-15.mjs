import { lotteryMatchProbability } from "../shared/lotteryVariants.ts";

const attachmentTables = [
  { key: "lot_19", selection: "3/19", range: 19, picks: 3, declaredRtp: 0.8648, prizes: { 3: 70, 2: 3 } },
  { key: "lot_29", selection: "4/29", range: 29, picks: 4, declaredRtp: 0.8496, prizes: { 4: 80, 3: 15, 2: 2 } },
  { key: "lot_39", selection: "5/39", range: 39, picks: 5, declaredRtp: 0.8625, prizes: { 5: 100_000, 4: 8_000, 3: 600, 2: 50, 1: 5 } },
  { key: "lot_49", selection: "6/49", range: 49, picks: 6, declaredRtp: 0.8493, prizes: { 6: 350_000, 5: 7_000, 4: 500, 3: 50, 2: 5 } },
  { key: "lot_59", selection: "6/59", range: 59, picks: 6, declaredRtp: 0.8505, prizes: { 6: 1_200_000, 5: 6_000, 4: 450, 3: 40, 2: 4 } },
];

const result = attachmentTables.map((table) => {
  const rtp = Object.entries(table.prizes).reduce((sum, [matches, prize]) => sum + lotteryMatchProbability(table.range, Number(matches), table.picks) * prize, 0);
  return {
    ...table,
    computedBaseRtp: rtp,
    computedBaseRtpPercent: Number((rtp * 100).toFixed(8)),
    declaredRtpPercent: table.declaredRtp * 100,
    differencePercentagePoints: Number(((rtp - table.declaredRtp) * 100).toFixed(8)),
  };
});

console.log(JSON.stringify({ source: "pasted_content_15.txt", result }, null, 2));
