export type GameKey = "ruleta" | "jackpot" | "bingo" | "loteria_19" | "loteria_29" | "loteria_39" | "loteria_39_5" | "loteria_49" | "loteria_59" | "cartas" | "sueldo_vida" | "raspa_digital" | "pick_3" | "pick_4" | "loto_diario" | "loto_express";

export type GameDefinition = {
  key: GameKey;
  name: string;
  eyebrow: string;
  description: string;
  price: number;
  pickLimit: number;
  numberRange: number;
  prize: string;
  color: string;
  roundId: string;
  closesIn: string;
};

export const games: GameDefinition[] = [
  { key: "sueldo_vida", name: "Sueldo de por vida", eyebrow: "01 · Premio recurrente virtual", description: "Elige cuatro números de 30. El premio mayor se divide en 24 cuotas mensuales de créditos virtuales, siempre sin dinero real ni valor cobrable.", price: 1, pickLimit: 4, numberRange: 30, prize: "24 cuotas virtuales de 913 cr. · RTP teórico 86,0299%", color: "from-amber-200 via-yellow-300 to-emerald-200", roundId: "Sorteo semanal virtual", closesIn: "Cierre programado" },
  { key: "raspa_digital", name: "Raspa Digital", eyebrow: "02 · Revelación verificable", description: "Escoge una de veinte casillas. La revelación usa una semilla comprometida y un cierre breve; no hay tarjetas físicas, pagos ni retiros.", price: 1, pickLimit: 1, numberRange: 20, prize: "17 créditos virtuales · RTP teórico 85,0000%", color: "from-fuchsia-200 via-pink-300 to-amber-200", roundId: "Ronda breve virtual", closesIn: "Hasta 1 minuto" },
  { key: "pick_3", name: "Pick 3", eyebrow: "03 · Dígitos en orden", description: "Combina tres dígitos del 0 al 9; se permiten repeticiones y el orden decide las coincidencias exactas.", price: 1, pickLimit: 3, numberRange: 10, prize: "Hasta 500 créditos virtuales · RTP teórico 85,1000%", color: "from-cyan-200 via-sky-300 to-violet-200", roundId: "Ronda rápida virtual", closesIn: "Cada 30 min" },
  { key: "pick_4", name: "Pick 4", eyebrow: "03 · Dígitos en orden", description: "Combina cuatro dígitos del 0 al 9; se permiten repeticiones y se premian las posiciones exactas.", price: 1, pickLimit: 4, numberRange: 10, prize: "Hasta 4 000 créditos virtuales · RTP teórico 85,1800%", color: "from-indigo-200 via-violet-300 to-fuchsia-200", roundId: "Ronda frecuente virtual", closesIn: "Cada 2 horas" },
  { key: "loto_diario", name: "Loto Diario", eyebrow: "04 · Sorteo diario", description: "Elige cuatro números de 20 para un sorteo virtual diario, con una tabla corta de premios enteros y verificables.", price: 1, pickLimit: 4, numberRange: 20, prize: "Hasta 2 000 créditos virtuales · RTP teórico 85,2012%", color: "from-emerald-200 via-teal-300 to-cyan-200", roundId: "Sorteo diario virtual", closesIn: "Diario · 00:00 UTC" },
  { key: "loto_express", name: "Loto Express", eyebrow: "05 · Números rápidos", description: "Elige tres números distintos de 10 para una ronda rápida virtual. Es una modalidad numérica, separada de Bingo Flash.", price: 1, pickLimit: 3, numberRange: 10, prize: "Hasta 60 créditos virtuales · RTP teórico 85,0000%", color: "from-lime-200 via-emerald-300 to-teal-200", roundId: "Ronda rápida virtual", closesIn: "Cada 30 min" },
  { key: "ruleta", name: "Ruleta", eyebrow: "Giro de precisión", description: "Elige una casilla y acompaña un giro de servidor con evidencia pública.", price: 1, pickLimit: 1, numberRange: 37, prize: "32 créditos virtuales por coincidencia exacta · RTP teórico 86,4865%", color: "from-cyan-300 via-emerald-300 to-yellow-200", roundId: "Ronda conectada", closesIn: "Ronda verificable" },
  { key: "jackpot", name: "Jackpot", eyebrow: "Bóveda de la semana", description: "Construye una combinación de cinco posiciones para una tabla virtual verificable.", price: 1, pickLimit: 5, numberRange: 20, prize: "Hasta 11 750 créditos virtuales · RTP teórico 84,98%", color: "from-yellow-200 via-amber-400 to-orange-300", roundId: "Ronda conectada", closesIn: "Ronda verificable" },
  { key: "bingo", name: "Bingo", eyebrow: "Cartilla en vivo", description: "Selecciona una de cinco cartillas virtuales y sigue los llamados de una ronda transparente.", price: 1, pickLimit: 1, numberRange: 5, prize: "5 créditos virtuales por cartilla ganadora · RTP teórico 100%", color: "from-fuchsia-200 via-pink-300 to-violet-300", roundId: "Ronda conectada", closesIn: "Ronda verificable" },
  { key: "loteria_29", name: "Lotería 29", eyebrow: "Dominio accesible · 6/29", description: "Selecciona seis números entre 1 y 29. La tabla virtual se calcula y verifica con semilla comprometida.", price: 1, pickLimit: 6, numberRange: 29, prize: "Hasta 7 000 créditos virtuales · RTP teórico 92,2593%", color: "from-teal-200 via-emerald-300 to-lime-200", roundId: "Ronda conectada", closesIn: "Ronda verificable" },
  { key: "loteria_39", name: "Lotería 39", eyebrow: "Dominio medio · 6/39", description: "Selecciona seis números entre 1 y 39. Puedes añadir MJP Extra de forma opcional: cuesta 1 crédito por boleto y duplica 2–5 aciertos cuando coincide.", price: 1, pickLimit: 6, numberRange: 39, prize: "Base 1 crédito · MJP Extra separado +1 crédito · RTP base 87,0902%", color: "from-sky-200 via-cyan-300 to-emerald-200", roundId: "Ronda conectada", closesIn: "Ronda verificable" },
  { key: "loteria_39_5", name: "Lotería 39 · 5/39", eyebrow: "Variante independiente · 5/39", description: "Selecciona cinco números entre 1 y 39. Es distinta de Lotería 39 MJP 6/39 y usa un comprobante separado.", price: 1, pickLimit: 5, numberRange: 39, prize: "Hasta 50 000 créditos virtuales · RTP teórico 109,3986%", color: "from-cyan-200 via-sky-300 to-indigo-200", roundId: "Ronda conectada", closesIn: "Ronda verificable" },
  { key: "loteria_49", name: "Lotería 49", eyebrow: "Dominio amplio · 6/49", description: "Selecciona seis números entre 1 y 49 en una variante virtual con tabla recalibrada y trazable.", price: 1, pickLimit: 6, numberRange: 49, prize: "Hasta 200 000 créditos virtuales · RTP teórico 85,08%", color: "from-indigo-200 via-blue-300 to-cyan-200", roundId: "Ronda conectada", closesIn: "Ronda verificable" },
  { key: "loteria_59", name: "Lotería 59", eyebrow: "Dominio extenso · 6/59", description: "Selecciona seis números entre 1 y 59. Esta modalidad conserva el mismo carácter gratuito y no convertible del piloto.", price: 1, pickLimit: 6, numberRange: 59, prize: "Hasta 500 000 créditos virtuales · RTP teórico 94,3736%", color: "from-violet-200 via-fuchsia-300 to-rose-200", roundId: "Ronda conectada", closesIn: "Ronda verificable" },
  { key: "loteria_19", name: "Lotería 19", eyebrow: "Lotería autorizada · 3/19", description: "Selecciona tres números entre 1 y 19 en una tabla virtual verificable de premio entero.", price: 1, pickLimit: 3, numberRange: 19, prize: "Hasta 70 créditos virtuales · RTP teórico 86,48%", color: "from-lime-200 via-emerald-300 to-cyan-200", roundId: "Ronda conectada", closesIn: "Ronda verificable" },
  { key: "cartas", name: "Trío 13", eyebrow: "Cartas de precisión", description: "Elige tres rangos entre trece; el servidor revela tres cartas sin reemplazo y publica la evidencia verificable.", price: 1, pickLimit: 3, numberRange: 13, prize: "Hasta 48 créditos virtuales · RTP teórico 86,89%", color: "from-rose-200 via-amber-300 to-emerald-200", roundId: "Ronda conectada", closesIn: "Ronda verificable" },
];

export const volumeBenefits = [
  { minimum: 1, label: "Tarifa uniforme", discount: 0, multiplier: "x1.00", note: "1–2 participaciones" },
  { minimum: 3, label: "Tarifa uniforme", discount: 0, multiplier: "x1.00", note: "3–5 participaciones" },
  { minimum: 6, label: "Tarifa uniforme", discount: 0, multiplier: "x1.00", note: "6 o más participaciones" },
];

export const pilotProof = {
  roundId: "RP-R-0141",
  game: "Ruleta",
  ruleset: "ruleta-v1.1.0",
  serverSeedHash: "a64c2ed1c6d6e0e696e5a89ea8d7930a3f4790ae1b30d032dc8bc8f60f5d08e4",
  revealedSeed: "rp-pilot-0141-emerald-orbit",
  publicSeed: "PILOTO-2026-ROUND-0141",
  ticketSetHash: "3520609a154a13bfcb83666df361d78b77b1ffd805a0c03852f0b6f5422367f4",
  result: "17 negro",
  algorithm: "HMAC-SHA-256 + rechazo uniforme v1",
};

export function getGame(key: string | undefined) {
  return games.find((game) => game.key === key) ?? games[0];
}
