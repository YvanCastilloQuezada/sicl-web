import { useEffect, useState } from "react";
import UPAO001SpatialComparison from "@/components/UPAO001SpatialComparison";
import type { TransportPayload } from "@/components/UPAO001SpatialViewer";

export default function SpatialComparisonPage() {
  const [payload, setPayload] = useState<TransportPayload | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    fetch("/api/core/v1/projects/UPAO-001/spatial-representations", { headers: { accept: "application/json" } })
      .then(async (response) => { if (!response.ok) throw new Error(`Core spatial representation unavailable (${response.status})`); return response.json() as Promise<{ data: TransportPayload }>; })
      .then((body) => { if (active) setPayload(body.data); })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : "Spatial comparison unavailable"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  return <main className="min-h-screen bg-background px-4 py-8 text-foreground md:px-8"><div className="mx-auto max-w-[1600px]">{loading && <div role="status" className="rounded border border-border bg-card p-8 text-card-foreground">Loading spatial comparison…</div>}{error && <div role="alert" className="rounded border border-destructive bg-card p-8 text-card-foreground"><h1 className="font-semibold">Spatial comparison unavailable</h1><p className="mt-2 text-sm text-muted-foreground">{error}</p><p className="mt-2 text-sm text-muted-foreground">The comparison does not fabricate geometry. Configure the Core server-side transport and retry.</p></div>}{payload && <UPAO001SpatialComparison payload={payload} />}</div></main>;
}
