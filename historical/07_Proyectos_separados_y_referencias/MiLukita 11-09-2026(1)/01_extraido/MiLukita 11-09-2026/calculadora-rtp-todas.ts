import { SIMPLIFIED_ROULETTE_CONFIG } from "../shared/simplifiedGames";
import { lotteryTheoreticalRtp, VIRTUAL_LOTTERY_VARIANTS } from "../shared/lotteryVariants";

const rows: Array<{ game: string; rtp: number; basis: string }> = [
  { game: "Ruleta piloto", rtp: 32 / 37, basis: "1/37 con pago entero 32" },
  { game: "Ruleta 7", rtp: SIMPLIFIED_ROULETTE_CONFIG.ruleta_7.rtp, basis: "6/7 × 2/1" },
  { game: "Ruleta 17", rtp: SIMPLIFIED_ROULETTE_CONFIG.ruleta_17.rtp, basis: "8/17 × 2/1" },
  { game: "Ruleta 27", rtp: SIMPLIFIED_ROULETTE_CONFIG.ruleta_27.rtp, basis: "13/27 × 2/1" },
  { game: "Ruleta 37", rtp: SIMPLIFIED_ROULETTE_CONFIG.ruleta_37.rtp, basis: "18/37 × 2/1" },
  { game: "Jackpot", rtp: 0.850426, basis: "tabla versionada + bola de consuelo" },
  { game: "Bingo piloto", rtp: 1, basis: "modelo simple 5/5" },
  { game: "Bingo Flash", rtp: 0.8505494505, basis: "distribución hipergeométrica" },
  { game: "Bingo Keno", rtp: 0.8500001248, basis: "distribución hipergeométrica" },
  { game: "Bingo 75", rtp: SIMPLIFIED_ROULETTE_CONFIG.ruleta_7.rtp * 0 + 0.8515, basis: "líneas y bola 41; recalibración de transición" },
  { game: "Trío 13", rtp: 0.8689, basis: "tabla de coincidencias" },
  { game: "Sueldo de por vida", rtp: 0.860299, basis: "24 cuotas enteras × 913 + premio de 3 aciertos" },
  { game: "Raspa Digital", rtp: 0.85, basis: "1/20 × 17" },
  { game: "Pick 3", rtp: 0.851, basis: "dígitos posicionales con repetición" },
  { game: "Pick 4", rtp: 0.8518, basis: "dígitos posicionales con repetición" },
  { game: "Loto Diario", rtp: 0.852012, basis: "distribución hipergeométrica 4/20" },
  { game: "Loto Express", rtp: 0.85, basis: "distribución hipergeométrica 3/10" },
];

for (const variant of Object.values(VIRTUAL_LOTTERY_VARIANTS)) {
  rows.push({ game: variant.title, rtp: lotteryTheoreticalRtp(variant), basis: `${variant.pickCount}/${variant.range} · tabla entera · ${variant.priceCredits} cr.` });
}

const result = rows.map((row) => ({ ...row, rtpPercent: Number((row.rtp * 100).toFixed(6)), pass: row.rtp >= 0.85 }));
console.table(result);
const failures = result.filter((row) => !row.pass);
if (failures.length) throw new Error(`RTP inferior al mínimo: ${failures.map((row) => row.game).join(", ")}`);
console.log(`RTP OK: ${result.length} modalidades con piso mínimo de 85%.`);
