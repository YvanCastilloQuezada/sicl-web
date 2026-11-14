import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ArkiSolidRenderer from "@/components/ArkiSolidRenderer";
import type { RenderData } from "../../../server/gia/visualization/types";
import { FIXTURES, loadFixture, type FixtureId } from "@/lib/fixtures";

export default function ArkiSolidViewerPage() {
  const [selectedFixtureId, setSelectedFixtureId] = useState<string>(FIXTURES[0].id);
  const [funnelStage, setFunnelStage] = useState<"25" | "16" | "9" | "4" | "1">("9");
  const [renders, setRenders] = useState<RenderData[]>([]);
  const [selectedPartiId, setSelectedPartiId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const getRenderData = trpc.visualization.getRenderDataForAllPartis.useMutation({
    onSuccess: (result) => {
      setRenders(result.renderDatas);
      setSelectedPartiId(result.renderDatas[0]?.partiId ?? null);
      setError("");
    },
    onError: (err) => setError(err.message),
  });

  const handleLoad = async () => {
    setError("");
    try {
      const input = await loadFixture(selectedFixtureId as FixtureId);
      getRenderData.mutate({ input, funnelStage });
    } catch (e) {
      setError(`Error cargando fixture: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const handleExportPng = (dataUrl: string) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `arki-solid-${selectedPartiId ?? "parti"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedRender = renders.find((r) => r.partiId === selectedPartiId) ?? null;

  return (
    <div className="space-y-6 p-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d07b4a]">ARKI · Visualization</p>
        <h1 className="mt-2 font-serif text-4xl tracking-[-0.04em]">Sólido 3D por PARTI</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#718078]">
          Render nativo del RenderData calculado por ARKI. Cada PARTI tiene su geometría, sus materiales del motor de sostenibilidad y su iluminación. Sin IA que invente.
        </p>
      </header>

      <Card className="border-[#d4d8d0] bg-[#fbfaf6] shadow-none">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Cargar proyecto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <select
              value={selectedFixtureId}
              onChange={(e) => setSelectedFixtureId(e.target.value)}
              className="w-full max-w-sm rounded-md border border-[#b9c4bd] bg-transparent p-2 text-sm text-[#2b3a33]"
            >
              {FIXTURES.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
            <select
              value={funnelStage}
              onChange={(e) => setFunnelStage(e.target.value as any)}
              className="w-full max-w-[120px] rounded-md border border-[#b9c4bd] bg-transparent p-2 text-sm text-[#2b3a33]"
            >
              <option value="25">Funnel: 25</option>
              <option value="16">Funnel: 16</option>
              <option value="9">Funnel: 9</option>
              <option value="4">Funnel: 4</option>
              <option value="1">Funnel: 1</option>
            </select>
            <Button onClick={handleLoad} disabled={getRenderData.isPending}>
              {getRenderData.isPending ? "Calculando…" : "Calcular RenderData"}
            </Button>
          </div>
          {error && <div role="alert" className="rounded-lg border border-[#d07b4a] bg-[#fff4ed] p-3 text-sm text-[#a95e35]">{error}</div>}
        </CardContent>
      </Card>

      {renders.length > 0 && (
        <>
          <Card className="border-[#d4d8d0] bg-[#fbfaf6] shadow-none">
            <CardHeader>
              <CardTitle className="font-serif text-xl">PARTIs ({renders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {renders.map((rd) => (
                  <button
                    key={rd.partiId}
                    type="button"
                    onClick={() => setSelectedPartiId(rd.partiId)}
                    className={`rounded-md border px-4 py-2 text-sm font-semibold ${
                      selectedPartiId === rd.partiId
                        ? "border-[#d07b4a] bg-[#d07b4a] text-white"
                        : "border-[#b9c4bd] bg-transparent text-[#2b3a33]"
                    }`}
                  >
                    {rd.partiId} · {rd.flowStrategy}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#d4d8d0] bg-[#fbfaf6] shadow-none">
            <CardHeader>
              <CardTitle className="font-serif text-xl">
                {selectedRender ? `${selectedRender.partiId} — ${selectedRender.organizingIdea}` : "Visor 3D"}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[600px] p-0">
              {selectedRender ? (
                <ArkiSolidRenderer renderData={selectedRender} onExportPng={handleExportPng} />
              ) : (
                <div className="flex h-full items-center justify-center bg-[#0d223d] text-[#9eb6ce]">
                  Selecciona un PARTI y haz clic en "Calcular RenderData" para ver el sólido 3D aquí.
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
