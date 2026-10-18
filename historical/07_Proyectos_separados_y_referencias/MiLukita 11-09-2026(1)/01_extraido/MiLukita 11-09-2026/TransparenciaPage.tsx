import PilotLayout from "@/components/PilotLayout";
import { Badge } from "@/components/ui/badge";
import { BarChart3, CircleHelp, Layers3, ShieldCheck, Sparkles, Vault } from "lucide-react";

const currentReturns = [
  { game: "Ruleta 0–36", rtp: "48,65%", margin: "51,35%", state: "Activo en piloto" },
  { game: "Ruleta 17", rtp: "94,1176%", margin: "5,8824%", state: "Tarifa virtual 1 cr. · staging" },
  { game: "Ruleta 27", rtp: "96,2963%", margin: "3,7037%", state: "Tarifa virtual 1 cr. · staging" },
  { game: "Ruleta 37", rtp: "97,2973%", margin: "2,7027%", state: "Tarifa virtual 1 cr. · staging" },
  { game: "Jackpot 5 posiciones", rtp: "85,04% + pozo", margin: "variable", state: "Activo en piloto" },
  { game: "Bingo Flash / Keno / 75", rtp: "85,05%–85,15%", margin: "14,85%–14,95%", state: "Recalibrado en piloto" },
  { game: "Lotería 19", rtp: "86,48%", margin: "13,52%", state: "Virtual 1 cr." },
  { game: "Lotería 29", rtp: "92,2593%", margin: "7,7407%", state: "Tarifa virtual 1 cr. · staging" },
  { game: "Lotería 39 MJP", rtp: "87,09%", margin: "12,91%", state: "Tarifa virtual 1 cr. · staging" },
  { game: "Lotería 39 · 5/39", rtp: "85,0011%", margin: "14,9989%", state: "Variante separada · tarifa virtual 1 cr." },
  { game: "Lotería 39 + MJP Extra", rtp: "No recalculado", margin: "requiere regla separada", state: "Diferido · no combinar con S/1" },
  { game: "Lotería 49", rtp: "85,08%", margin: "14,92%", state: "Virtual 1 cr." },
  { game: "Lotería 59", rtp: "94,3736%", margin: "5,6264%", state: "Tarifa virtual 1 cr. · staging" },
  { game: "Pick 3 / Pick 4 / Raspa / Sueldo / Loto", rtp: "85,00%–86,03%", margin: "13,97%–15,00%", state: "Staging virtual" },
];

const themedCatalogs = [
  { name: "Baraja clásica", detail: "A, 2–10, J, Q, K", status: "Trío 13 actual" },
  { name: "Fauna peruana", detail: "13 especies predefinidas", status: "Catálogo futuro" },
  { name: "Rutas del Perú", detail: "13 destinos predefinidos", status: "Catálogo futuro" },
  { name: "Gemas y minerales", detail: "13 símbolos visuales", status: "Catálogo futuro" },
];

const lotteryTables = [
  { name: "Lotería 29 · 1 cr.", prizes: "6: 7 000 · 5: 320 · 4: 46 · 3: 6", rtp: "92,2593%" },
  { name: "Lotería 39 MJP · 1 cr.", prizes: "6: 50 000 · 5: 1 167 · 4: 108 · 3: 10 · 2: 1", rtp: "87,09%" },
  { name: "Lotería 39 · 5/39 · 1 cr.", prizes: "5: 27 000 · 4: 300 · 3: 20 · 2: 5", rtp: "85,0011%" },
  { name: "Lotería 39 + MJP Extra", prizes: "Regla separada; no se suma automáticamente al escenario de 1 crédito", rtp: "Pendiente" },
  { name: "Lotería 49 · 1 cr.", prizes: "6: 200 000 · 5: 2 500 · 4: 160 · 3: 21 · 2: 2", rtp: "85,08%" },
  { name: "Lotería 59 · 1 cr.", prizes: "6: 500 000 · 5: 10 000 · 4: 250 · 3: 25 · 2: 5", rtp: "94,3736%" },
];

export default function TransparenciaPage() {
  return (
    <PilotLayout>
      <main className="container py-9 sm:py-14">
        <section className="rounded-[2rem] border border-amber-200/15 bg-gradient-to-br from-[#211b10] to-[#0b1a14] p-7 sm:p-10">
          <Badge className="border border-amber-200/25 bg-amber-200/10 px-3 py-1.5 text-amber-100 hover:bg-amber-200/10"><ShieldCheck className="mr-1.5 h-3.5 w-3.5" /> TABLAS Y REGLAS VISIBLES</Badge>
          <p className="eyebrow mt-6">Transparencia de diseño</p>
          <h1 className="font-display mt-2 max-w-4xl text-4xl leading-tight text-white sm:text-5xl">Temas visuales, RTP y reglas sin letras pequeñas.</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">Las cifras se expresan únicamente en créditos virtuales. La referencia interna 1 crédito = 1 unidad PEN sirve para conciliación de una eventual migración autorizada; no da valor monetario, retiro ni conversión durante este piloto.</p>
        </section>

        <section className="mt-7 rounded-[1.7rem] border border-white/10 bg-[#0a1b14] p-6 sm:p-8">
          <div className="flex items-center gap-3"><BarChart3 className="h-5 w-5 text-cyan-200" /><div><p className="eyebrow">Retorno teórico</p><h2 className="font-display mt-1 text-3xl text-white">RTP del piloto</h2></div></div>
          <div className="mt-5 overflow-x-auto"><table className="w-full min-w-165 text-left text-sm"><thead className="border-b border-white/10 text-xs uppercase tracking-[0.12em] text-slate-400"><tr><th className="px-3 py-3">Modalidad</th><th className="px-3 py-3">RTP</th><th className="px-3 py-3">Margen teórico</th><th className="px-3 py-3">Estado</th></tr></thead><tbody>{currentReturns.map((row) => <tr key={`${row.game}-${row.rtp}`} className="border-b border-white/6"><td className="px-3 py-4 font-bold text-white">{row.game}</td><td className="px-3 py-4 text-cyan-100">{row.rtp}</td><td className="px-3 py-4 text-slate-300">{row.margin}</td><td className="px-3 py-4 text-xs text-slate-400">{row.state}</td></tr>)}</tbody></table></div>
          <p className="mt-4 flex gap-2 text-xs leading-5 text-amber-100/80"><CircleHelp className="h-4 w-4 shrink-0" />Las cifras publicadas se sincronizan con las tablas vigentes del piloto; Lotería 39 MJP y la variante separada 5/39 usan reglas distintas a 1 crédito, y las modalidades por debajo de 85 % quedan marcadas para revisión. MJP Extra es una modalidad opcional con RTP propio, menor por su costo adicional. El RTP es una expectativa de largo plazo, no una garantía individual.</p>
        </section>

        <section className="mt-7 rounded-[1.7rem] border border-cyan-200/15 bg-cyan-300/5 p-6 sm:p-8">
          <p className="eyebrow text-cyan-100">Loterías virtuales recalibradas</p><h2 className="font-display mt-2 text-3xl text-white">Premios visibles por modalidad</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">Todas las cifras son créditos virtuales. Los niveles de premio se liquidan exclusivamente desde la tabla versionada aplicada a la ronda; las tablas S/1 están en transición y no representan una operación monetaria autorizada.</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">{lotteryTables.map((table) => <article key={table.name} className="rounded-xl border border-white/10 bg-black/20 p-4"><div className="flex items-center justify-between gap-3"><p className="font-bold text-white">{table.name}</p><Badge className="border border-cyan-200/25 bg-cyan-200/10 text-cyan-100 hover:bg-cyan-200/10">RTP {table.rtp}</Badge></div><p className="mt-3 text-xs leading-6 text-slate-300">{table.prizes}</p></article>)}</div>
        </section>

        <section className="mt-7 grid gap-5 lg:grid-cols-2">
          <article className="rounded-[1.7rem] border border-rose-200/15 bg-rose-300/5 p-6"><Layers3 className="h-5 w-5 text-rose-200" /><p className="eyebrow mt-4">Índice matemático invariable</p><h2 className="font-display mt-1 text-3xl text-white">Temáticas de Trío 13</h2><p className="mt-3 text-sm leading-6 text-slate-300">Cada tema conserva trece posiciones y la misma probabilidad. Un cambio visual nunca altera la selección, el sorteo ni la tabla de premios.</p><div className="mt-5 grid gap-2 sm:grid-cols-2">{themedCatalogs.map((theme) => <div key={theme.name} className="rounded-xl border border-white/8 bg-black/20 p-3"><p className="font-bold text-white">{theme.name}</p><p className="mt-1 text-xs text-slate-400">{theme.detail}</p><p className="mt-2 text-[11px] font-semibold text-rose-100">{theme.status}</p></div>)}</div></article>
          <article className="rounded-[1.7rem] border border-emerald-300/15 bg-emerald-300/5 p-6"><Vault className="h-5 w-5 text-emerald-300" /><p className="eyebrow mt-4">Créditos y pozos responsables</p><h2 className="font-display mt-1 text-3xl text-white">Referencia interna, no conversión</h2><div className="mt-5 space-y-3 text-sm leading-6 text-slate-300"><div className="rounded-xl border border-white/8 bg-black/20 p-4"><p className="font-bold text-white">Equivalencia contable PEN</p><p className="mt-1">1 crédito virtual se modela internamente como 1 unidad de referencia PEN para diseño y conciliación. No es cobrable, no cambia saldos existentes y no autoriza una migración automática a dinero real.</p></div><div className="rounded-xl border border-white/8 bg-black/20 p-4"><p className="font-bold text-white">MJP Extra y funciones diferidas</p><p className="mt-1">MJP Extra de Lotería 39 está activo como opción virtual versionada. Bola Extra, Crédito Seguro y pozos continúan desactivados. Una futura operación regulada requerirá reglas independientes, certificación y aprobación antes de habilitar medios de pago.</p></div></div><p className="mt-4 flex gap-2 text-xs leading-5 text-emerald-100/75"><Sparkles className="h-4 w-4 shrink-0" />La referencia interna no se usará para estimular pérdidas ni para convertir automáticamente créditos de prueba.</p></article>
        </section>
      </main>
    </PilotLayout>
  );
}
