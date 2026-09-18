import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siclClient, apiErrorMessage } from "@/api/sicl-client";

type Props = { projectId: string };
type Parent = { alternative_id: string; project_id: string; name: string; description: string; parameters: Record<string, unknown>; status: string; version: number; source: string };

const DEFAULT_PARENT: Parent = {
  alternative_id: "UPAO-001-A",
  project_id: "UPAO-001",
  name: "COMPACT",
  description: "Synthetic educational base",
  parameters: { strategy: "compact", footprint_ratio: 0.42, floors: 4, courtyard_ratio: 0, mass_separation: 0 },
  status: "GENERATED",
  version: 1,
  source: "UPAO-001",
};

export default function AdvancedEvolutionPanel({ projectId }: Props) {
  const [target, setTarget] = useState("footprint_ratio");
  const [intensity, setIntensity] = useState("40");
  const [mode, setMode] = useState("MUTATE");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async (payload: Record<string, unknown>) => {
    setBusy(true);
    setError("");
    try {
      setResult(await siclClient.advancedEvolution(projectId, { parent: DEFAULT_PARENT, ...payload }));
    } catch (value) {
      setError(apiErrorMessage(value));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded border border-[#385348] bg-[#fbfaf6] p-4 text-[#1d2925]" aria-label="Design evolution">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-xl text-[#385348]">Design evolution</h3>
          <p className="mt-1 text-xs text-[#718078]">Preserve a design, change one direction, then compare the result. No automatic winner or decision.</p>
        </div>
        <span className="rounded bg-[#dce8df] px-2 py-1 text-xs font-semibold text-[#385348]">{mode === "MUTATE" ? "Directed change" : mode === "EXTREME" ? "Explore an extreme" : "Controlled variation"}</span>
      </div>
      <div className="mt-3 grid gap-2 md:grid-cols-3">
        <label className="text-xs font-semibold">Exploration mode
          <select value={mode} onChange={(event) => setMode(event.target.value)} className="mt-1 h-9 w-full rounded border border-[#b9c4bd] bg-white px-2 text-sm">
            <option value="MUTATE">Directed change</option>
            <option value="EXTREME">Explore more open space</option>
            <option value="SERENDIPITY">Controlled variation</option>
          </select>
        </label>
        <label className="text-xs font-semibold">Design direction
          <Input value={target} onChange={(event) => setTarget(event.target.value)} className="mt-1" />
        </label>
        <label className="text-xs font-semibold">Change intensity: {intensity}
          <input type="range" min="0" max="100" step="10" value={intensity} onChange={(event) => setIntensity(event.target.value)} className="mt-3 w-full" />
        </label>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" onClick={() => run(mode === "EXTREME" ? { mode, direction: "MORE_OPEN_SPACE" } : mode === "SERENDIPITY" ? { mode } : { mode, target, intensity: Number(intensity), inherit: ["strategy"], mutable: [target], bounds: { footprint_ratio: { min: 0.3, max: 0.6 } } })} disabled={busy}>
          {busy ? "Working…" : "Generate a child design"}
        </Button>
        <Button size="sm" variant="outline" onClick={() => run({ mode: "DISTANCE", other: { ...DEFAULT_PARENT, alternative_id: "UPAO-001-B", parameters: { ...DEFAULT_PARENT.parameters, strategy: "courtyard", footprint_ratio: 0.48, courtyard_ratio: 0.3 } } })} disabled={busy}>
          Compare A ↔ B distance
        </Button>
      </div>
      {error && <p className="mt-2 text-sm text-[#a94524]" role="alert">{error}</p>}
      {result && <div className="mt-3 rounded border border-[#d7d8cf] bg-white p-3 text-xs">
        <p className="font-semibold text-[#385348]">Evolution result</p>
        <p className="mt-1 text-[#52645a]">The child keeps its parent identity and records the changed design direction. Distance describes difference; it does not measure quality.</p>
        <details className="mt-3 rounded border border-[#e2e4de] p-2">
          <summary className="cursor-pointer font-semibold text-[#385348]">Technical details</summary>
          <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap text-[#52645a]">{JSON.stringify(result, null, 2)}</pre>
        </details>
      </div>}
    </section>
  );
}

export { DEFAULT_PARENT };
