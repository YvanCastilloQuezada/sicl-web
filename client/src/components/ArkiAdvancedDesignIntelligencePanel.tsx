import React, { useState } from "react";
import { buildD8Exploration } from "./arkiAdvancedDesignIntelligence";
import { SpatialSvgViewer } from "./UPAO001SpatialViewer";

export function ArkiAdvancedDesignIntelligencePanel() {
  const exploration = buildD8Exploration();
  const [alternativeId, setAlternativeId] = useState(exploration.alternatives[0].alternativeId);
  const selected = exploration.alternatives.find((alternative) => alternative.alternativeId === alternativeId) ?? exploration.alternatives[0];
  return <section aria-label="ARKI advanced design intelligence" className="space-y-4">
    <div className="rounded-md border border-border bg-card p-4 text-card-foreground">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">CONTROLLED DESIGN EXPLORATION</p>
      <h2 className="mt-2 text-xl font-semibold">HOUSE-A21 · A/B/C hypotheses</h2>
      <p className="mt-1 text-sm text-muted-foreground">Visual inspection only. Human Architect remains final authority.</p>
      <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="Architectural alternatives">
        {exploration.alternatives.map((alternative) => <button key={alternative.alternativeId} type="button" role="tab" aria-selected={alternative.alternativeId === selected.alternativeId} onClick={() => setAlternativeId(alternative.alternativeId)} className="rounded-md border border-border px-3 py-2 text-sm hover:bg-accent/10">{alternative.alternativeId} · {alternative.strategy}</button>)}
      </div>
    </div>
    <SpatialSvgViewer representation={selected.representation} language="en" />
    <div className="rounded-md border border-border bg-card p-4 text-card-foreground">
      <p className="text-sm font-semibold">Design pressures and boundaries</p>
      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">{exploration.pressures.map((pressure) => <li key={pressure.id}><strong>{pressure.family}</strong> · {pressure.classification} · {pressure.statement}</li>)}</ul>
      <p className="mt-3 text-xs text-muted-foreground">No score, ranking, winner, automatic decision, structural adequacy, environmental performance or regulatory compliance is claimed.</p>
    </div>
  </section>;
}
