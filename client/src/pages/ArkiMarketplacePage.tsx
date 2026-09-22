import { useMemo } from "react";
import { Link } from "wouter";
import { ShieldCheck, BarChart3, BookOpen, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

export default function ArkiMarketplacePage() {
  const contract = trpc.parametricRuntime.marketplaceContract.useQuery();
  const api = trpc.parametricRuntime.marketplaceApi.useQuery();
  const features = trpc.parametricRuntime.marketplaceFeatures.useQuery();
  const sampleEvents = useMemo(() => ({ events: [
    { typologyId: "RES_HOUSING", ok: true, score: 0.92, at: new Date().toISOString() },
    { typologyId: "RES_HOUSING", ok: true, score: 0.88, at: new Date().toISOString() },
    { typologyId: "HEALTH_HOSPITAL", ok: false, score: 0.41, at: new Date().toISOString() },
  ] }), []);
  const analytics = trpc.parametricRuntime.analytics.useQuery(sampleEvents);
  const rows = analytics.data?.rows ?? [];
  return <main className="min-h-screen bg-background text-foreground p-6 md:p-10">
    <div className="mx-auto max-w-7xl space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">ARKI / GOVERNED EXTENSIONS</p><h1 className="mt-2 text-3xl font-semibold">Marketplace de tipologías</h1><p className="mt-2 max-w-3xl text-muted-foreground">Catálogo declarativo para compartir propuestas, compararlas y revisarlas. No ejecuta código de terceros ni publica automáticamente.</p></div>
        <Button asChild variant="outline"><Link href="/arki-parametric-runtime">Volver al Runtime</Link></Button>
      </header>
      <section className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader><CardTitle className="flex items-center gap-2 text-sm"><ShieldCheck className="h-4 w-4"/>Contrato</CardTitle></CardHeader><CardContent><Badge variant="secondary">{contract.data?.contractVersion ?? "Cargando"}</Badge></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2 text-sm"><Lock className="h-4 w-4"/>Publicación</CardTitle></CardHeader><CardContent><Badge variant="outline">Revisión humana</Badge></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2 text-sm"><BookOpen className="h-4 w-4"/>DSL</CardTitle></CardHeader><CardContent><Badge variant="outline">Sin eval / sin imports</Badge></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2 text-sm"><BarChart3 className="h-4 w-4"/>Analítica</CardTitle></CardHeader><CardContent><Badge variant="outline">Determinista</Badge></CardContent></Card>
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <Card><CardHeader><CardTitle>Capacidades activas</CardTitle></CardHeader><CardContent><div className="grid grid-cols-2 gap-3 text-sm">{Object.entries(features.data ?? {}).map(([key, value]) => <div key={key} className="rounded-lg border border-border p-3"><span className="text-muted-foreground">{key}</span><div className="font-medium">{String(value)}</div></div>)}</div></CardContent></Card>
        <Card><CardHeader><CardTitle>Uso de tipologías</CardTitle></CardHeader><CardContent><div className="space-y-3">{rows.map((row) => <div key={row.typologyId} className="flex items-center justify-between rounded-lg border border-border p-3"><span>{row.typologyId}</span><span className="text-sm text-muted-foreground">{row.uses} usos · {row.failures} fallos · {(row.approvalRate * 100).toFixed(0)}% OK</span></div>)}{rows.length === 0 && <p className="text-sm text-muted-foreground">Sin eventos registrados todavía.</p>}<p className="text-xs text-muted-foreground">{analytics.data?.disclaimer ?? "Los analytics no sustituyen revisión profesional."}</p></div></CardContent></Card>
      </section>
      <Card><CardHeader><CardTitle>API preparada</CardTitle></CardHeader><CardContent><ul className="space-y-2 text-sm">{(api.data?.endpoints ?? []).map((endpoint) => <li key={endpoint} className="rounded border border-border px-3 py-2 font-mono">{endpoint}</li>)}</ul><p className="mt-4 text-sm text-muted-foreground">Persistencia productiva, moderación operativa y distribución externa permanecen detrás de sus gates; esta vista no muta el Core.</p></CardContent></Card>
    </div>
  </main>;
}
