import fs from "node:fs";
import path from "node:path";

type SimulationRow = { gameType: string; tickets: number; priceCredits: number; totalCostCredits: number; totalPrizeCredits: number; observedRtp: number; theoreticalRtp: number; winningTickets: number };
const input = path.resolve(process.cwd(), "docs/reporte-simulacion-50k.json");
const output = path.resolve(process.cwd(), "docs/reporte-ingresos-egresos.csv");
const report = JSON.parse(fs.readFileSync(input, "utf8")) as { results: SimulationRow[] };
const pct = (name: string) => Number(process.env[name] ?? 0);
const fixed = Number(process.env.GATEWAY_FIXED_CREDITS ?? 0);
const rows = report.results.map((row) => {
  const gross = row.totalCostCredits;
  const taxes = gross * (pct("SUNAT_EFFECTIVE_RATE") + pct("ISC_EFFECTIVE_RATE")) / 100;
  const gateway = gross * pct("GATEWAY_PERCENT") / 100 + fixed;
  const marketing = gross * pct("MARKETING_RATE") / 100;
  const technology = gross * pct("TECHNOLOGY_RATE") / 100;
  const net = gross - row.totalPrizeCredits - taxes - gateway - marketing - technology;
  return { ...row, grossCredits: gross, taxesCredits: taxes, gatewayCredits: gateway, marketingCredits: marketing, technologyCredits: technology, netCredits: net, marginNet: gross ? net / gross : 0, prizeFrequency: row.tickets ? row.winningTickets / row.tickets : 0 };
});
const headers = Object.keys(rows[0] ?? { gameType: "" });
const csv = [headers.join(","), ...rows.map((row) => headers.map((key) => JSON.stringify(row[key as keyof typeof row] ?? "")).join(","))].join("\n") + "\n";
fs.writeFileSync(output, csv);
console.log(`Reporte escrito en ${output}`);
console.log("Parámetros de costos: todas las tasas se leen de variables de entorno y por defecto son 0; no son costos reales ni recomendación tributaria.");
