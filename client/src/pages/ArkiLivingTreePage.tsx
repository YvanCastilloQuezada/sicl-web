import { useState } from "react";

/** AV-021 embeds the separately verified AV-020 read-only local service. */
export default function ArkiLivingTreePage() {
  const [reload, setReload] = useState(0);
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-6 py-4">
        <div>
          <h1 className="text-2xl font-semibold">ARKI · Árbol Vivo</h1>
          <p className="text-sm text-muted-foreground">AV-021 · Expedientes y decisiones verificables · Vista local de solo lectura</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setReload(n => n + 1)} className="rounded border border-border px-4 py-2 text-sm hover:bg-muted">Actualizar vista</button>
          <a href="/arki-command-center" className="rounded border border-border px-4 py-2 text-sm hover:bg-muted">Centro de mando</a>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-6 py-3 text-sm text-muted-foreground">
        Esta vista utiliza el servicio local AV-020 en 127.0.0.1:8765. Si no está iniciado, la vista no mostrará datos.
        No concede aprobaciones ni permisos de escritura. El servicio se ejecuta en el mismo equipo que el navegador.
      </section>
      <iframe
        key={reload}
        title="Árbol Vivo · Evidencias AV-020"
        src="http://127.0.0.1:8765/"
        sandbox="allow-scripts allow-same-origin"
        referrerPolicy="no-referrer"
        className="block h-[75vh] w-full border-0 bg-slate-950"
      />
    </main>
  );
}
