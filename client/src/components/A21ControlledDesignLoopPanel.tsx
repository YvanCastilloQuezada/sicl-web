import React from "react";
import { SpatialSvgViewer } from "./UPAO001SpatialViewer";
import { buildA21ControlledDesignLoop } from "./arkiA21ControlledDesignLoop";

export function A21ControlledDesignLoopPanel({ loop = buildA21ControlledDesignLoop() }: { loop?: ReturnType<typeof buildA21ControlledDesignLoop> }) {
  return <section aria-label="A21 controlled architectural design loop" className="space-y-4">
    <div className="rounded-xl border border-primary/30 bg-card p-4 text-card-foreground">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">VISUAL FIRST — DATA ON DEMAND</p>
      <h2 className="mt-1 text-xl font-semibold">HOUSE-A21 controlled design loop</h2>
      <p className="mt-1 text-sm text-muted-foreground">Parent ↔ child · authorized revision · automatic winner: none · Human Architect remains final authority.</p>
    </div>
    <div className="grid gap-4 xl:grid-cols-2">
      <div data-testid="a21-parent-visual"><h3 className="mb-2 font-semibold">Parent · {loop.parent.alternativeId}</h3><SpatialSvgViewer representation={loop.visual.parent} language="es" /></div>
      <div data-testid="a21-child-visual"><h3 className="mb-2 font-semibold">Child · {loop.child?.alternativeId ?? "—"}</h3>{loop.visual.child ? <SpatialSvgViewer representation={loop.visual.child} language="es" /> : <p className="text-sm text-muted-foreground">Child representation unavailable.</p>}</div>
    </div>
    <div role="status" className="rounded-lg border border-border bg-muted/30 p-3 text-sm text-foreground">Changed elements: {loop.visual.differenceElementIds.join(", ") || "none"}. Comparison remains observational and non-decisional.</div>
  </section>;
}
