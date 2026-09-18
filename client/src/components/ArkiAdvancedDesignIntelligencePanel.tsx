import React, { useState } from "react";
import { buildD8Exploration } from "./arkiAdvancedDesignIntelligence";
import { buildEngineeringIntelligence } from "./arkiBuildingEngineeringIntelligence";
import { buildGDIProof } from "./arkiGenerativeDesignContinuum";
import { runS1Proof } from "./arkiConstructiveSpatialGeneration";
import { buildD17D32Proof } from "./arkiWorldClassDesignIntelligence";
import { SpatialSvgViewer } from "./UPAO001SpatialViewer";

export function ArkiAdvancedDesignIntelligencePanel() {
  const exploration = buildD8Exploration();
  const worldClass = buildD17D32Proof();
  const engineering = buildEngineeringIntelligence("HOUSING");
  const gdi = buildGDIProof();
  const s1 = runS1Proof();
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
      <p className="text-sm font-semibold">Generation lineage</p>
      <div className="mt-2 flex flex-wrap gap-2" aria-label="Generation lineage">{exploration.generations.generations.map((generation) => <span key={generation.alternativeId} className="rounded-md bg-muted px-3 py-2 text-xs">G{generation.generation} · {generation.alternativeId}{generation.authorizationReference ? " · human-authorized" : ""}</span>)}</div>
      <p className="mt-3 text-xs text-muted-foreground">Lineage is read-only in this panel. Parent geometry is preserved and no automatic revision is executed.</p>
    </div>
    <div className="rounded-md border border-border bg-card p-4 text-card-foreground">
      <p className="text-sm font-semibold">Design pressures and boundaries</p>
      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">{exploration.pressures.map((pressure) => <li key={pressure.id}><strong>{pressure.family}</strong> · {pressure.classification} · {pressure.statement}</li>)}</ul>
      <p className="mt-3 text-xs text-muted-foreground">No score, ranking, winner, automatic decision, structural adequacy, environmental performance or regulatory compliance is claimed.</p>
    </div>
    <div className="rounded-md border border-border bg-card p-4 text-card-foreground">
      <p className="text-sm font-semibold">Concept → parti → massing</p>
      <div className="mt-2 grid gap-2 md:grid-cols-3">{worldClass.result.d32.concepts.map((concept) => <div key={concept.id} className="rounded-md bg-muted p-3 text-xs"><strong>{concept.id}</strong><p className="mt-1">{concept.hypothesis}</p><p className="mt-2 text-muted-foreground">Parti: {worldClass.result.d32.partis.find((parti) => parti.conceptId === concept.id)?.organizingIdea}</p></div>)}</div>
      <p className="mt-3 text-xs text-muted-foreground">Aesthetic interpretation is explicit and human-led. World-class capability remains aspirational, not certified.</p>
    </div>
    <div className="rounded-md border border-border bg-card p-4 text-card-foreground">
      <p className="text-sm font-semibold">Engineering awareness · Housing</p>
      <p className="mt-1 text-sm text-muted-foreground">{engineering.reservations.length} conceptual technical reservations · {engineering.dependencies.length} system dependencies · {engineering.routes.length} conceptual routes</p>
      <div className="mt-2 flex flex-wrap gap-2">{engineering.reservations.slice(0, 6).map((reservation) => <span key={reservation.id} className="rounded-md bg-muted px-2 py-1 text-xs">{reservation.systemId} · CONCEPTUAL</span>)}</div>
      <p className="mt-3 text-xs text-muted-foreground">Shafts, equipment, clearances, maintenance and replacement routes require specialist review. No engineering performance or automatic mutation is claimed.</p>
    </div>
    <div className="rounded-md border border-border bg-card p-4 text-card-foreground">
      <p className="text-sm font-semibold">GDI-P9 → GDI-P24 · Evolution studio</p>
      <p className="mt-1 text-sm text-muted-foreground">{gdi.continuum.phases.length} controlled phases · {gdi.continuum.alternatives.length} hypotheses · {gdi.continuum.comparisons.length} descriptive comparisons</p>
      <div className="mt-2 flex flex-wrap gap-2">{gdi.continuum.alternatives.map((item) => <span key={item.id} className="rounded-md bg-muted px-2 py-1 text-xs">{item.id} · {item.dna.compositionFamily}</span>)}</div>
      <p className="mt-3 text-xs text-muted-foreground">Distance describes difference, not quality. No automatic ranking, winner, decision or mutation is executed.</p>
    </div>
    <div className="rounded-md border border-border bg-card p-4 text-card-foreground">
      <p className="text-sm font-semibold">ARKI-S1 · Conceptual floor plan</p>
      <p className="mt-1 text-sm text-muted-foreground">{s1.plan.spaces.length} spaces · {s1.plan.openings.length} openings · {s1.plan.shafts.length} shaft reservations · {s1.plan.routes.length} conceptual routes</p>
      <div className="mt-2 flex flex-wrap gap-2">{s1.plan.validations.filter((item) => item.id !== "UNKNOWN_PRESERVATION").map((item) => <span key={item.id} className={`rounded-md px-2 py-1 text-xs ${item.state === "PASS" ? "bg-muted" : "bg-amber-100"}`}>{item.id} · {item.state}</span>)}</div>
      <p className="mt-3 text-xs text-muted-foreground">Conceptual floor plan only. Compliance, permit readiness and construction documentation are not claimed.</p>
    </div>
  </section>;
}
