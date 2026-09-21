import { AlertTriangle, CheckCircle2, Clock3, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

const kindLabels: Record<string, string> = { RATE_LIMIT: "Rate limit", ORIGIN_BLOCK: "Origen bloqueado", CSP_REPORT: "CSP report", WS_BLOCK: "WebSocket bloqueado" };

export default function SecurityEventsPage() {
  const query = trpc.security.recentEvents.useQuery({ limit: 100 }, { retry: false });
  const events = query.data?.events ?? [];
  return (
    <main className="min-h-screen bg-background p-5 text-foreground md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">ARKI SECURITY</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Registros de seguridad</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Eventos recientes de CSP, rate limiting, origen y WebSocket. La consulta exige rol administrativo.</p>
          </div>
          <Badge variant="outline" className="gap-2"><ShieldAlert className="h-3.5 w-3.5" />CSP enforcement · producción</Badge>
        </header>
        {query.isError ? (
          <Card><CardContent className="flex items-center gap-3 p-6 text-sm text-destructive"><AlertTriangle className="h-5 w-5" />No tienes permisos administrativos o el registro no está disponible.</CardContent></Card>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <Card><CardContent className="p-5"><p className="text-xs uppercase text-muted-foreground">Eventos retenidos</p><p className="mt-2 text-3xl font-semibold">{events.length}</p></CardContent></Card>
              <Card><CardContent className="p-5"><p className="text-xs uppercase text-muted-foreground">Ventana</p><p className="mt-2 text-lg font-semibold">Ring buffer · 500</p></CardContent></Card>
              <Card><CardContent className="p-5"><p className="text-xs uppercase text-muted-foreground">Estado</p><p className="mt-2 flex items-center gap-2 text-lg font-semibold"><CheckCircle2 className="h-5 w-5 text-emerald-500" />Protegido</p></CardContent></Card>
            </div>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Clock3 className="h-5 w-5 text-primary" />Bloqueos y reportes recientes</CardTitle></CardHeader>
              <CardContent>
                {events.length === 0 ? <p className="py-10 text-center text-sm text-muted-foreground">No hay eventos de seguridad recientes.</p> : <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-border text-xs uppercase text-muted-foreground"><tr><th className="px-3 py-3">Fecha</th><th className="px-3 py-3">Tipo</th><th className="px-3 py-3">Ruta</th><th className="px-3 py-3">Estado</th><th className="px-3 py-3">Detalle</th></tr></thead><tbody>{events.map((event) => <tr key={event.id} className="border-b border-border/60"><td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{new Date(event.at).toLocaleString()}</td><td className="px-3 py-3"><Badge variant={event.kind === "CSP_REPORT" ? "secondary" : "destructive"}>{kindLabels[event.kind] ?? event.kind}</Badge></td><td className="px-3 py-3 font-mono text-xs">{event.path}</td><td className="px-3 py-3">{event.status}</td><td className="max-w-[360px] truncate px-3 py-3 text-muted-foreground" title={event.detail}>{event.detail}</td></tr>)}</tbody></table></div>}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </main>
  );
}
