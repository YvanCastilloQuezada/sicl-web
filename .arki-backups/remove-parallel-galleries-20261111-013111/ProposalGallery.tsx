import { useState, useMemo, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProfessionalFamilyViewer from "@/components/ProfessionalFamilyViewer";
import {
  createDesignFunnel,
  promoteToFinalFour,
  selectForDevelopment,
  type DesignFunnelState,
  type DesignCandidate,
} from "@shared/arkiDesignFunnel";

interface Proposal {
  id: string;
  title: string;
  strategy: string;
  metrics: {
    area: number;
    floors: number;
  };
  building: any;
}

export default function ProposalGallery({ proposals = [], projectId = "PRO-TERMINAL-001" }: { proposals?: Proposal[]; projectId?: string }) {
  const [selected, setSelected] = useState<string[]>([]);

  // Convertir las propuestas a candidatos válidos para el Funnel
  const candidates: DesignCandidate[] = useMemo(() => {
    return proposals.map((p, idx) => ({
      id: p.id,
      projectId,
      generationId: "GEN-001",
      stage: "SURVIVOR" as const,
      status: "ELIGIBLE" as const,
      title: p.title,
      strategy: p.strategy,
      preview: "PREVIEW_LOCAL_CONCEPTUAL",
      metrics: {
        area: p.metrics.area,
        efficiency: "80%",
        cost: 100 + idx * 3,
      },
      epistemic: {
        facts: [{ kind: "FACT", id: `FACT-${idx}-01`, statement: "Candidate belongs to the current generated design set.", evidenceRefs: ["ELIGIBILITY_SCREENING"], provenance: ["GEN-001"] }],
        assumptions: [{ kind: "ASSUMPTION", id: `ASSUMPTION-${idx}-01`, statement: "Conceptual strategy remains subject to deeper technical verification.", evidenceRefs: [], provenance: ["GEN-001"] }],
        preferences: [{ kind: "PREFERENCE", id: `PREFERENCE-${idx}-01`, statement: "Preserve the declared architectural strategy during comparison.", evidenceRefs: ["FUNCTIONAL_FIT"], provenance: ["GEN-001"] }],
        requirements: [{ kind: "REQUIREMENT", id: `REQUIREMENT-${idx}-01`, statement: "Human review is required before development selection.", evidenceRefs: ["HUMAN_SELECTION_EVIDENCE"], provenance: ["ARKI-F5"] }],
        objectives: [{ kind: "OBJECTIVE", id: `OBJECTIVE-${idx}-01`, statement: "Optimize the candidate according to the declared architectural objectives.", evidenceRefs: [], provenance: ["GEN-001"] }],
        constraints: [{ kind: "CONSTRAINT", id: `CONSTRAINT-${idx}-01`, statement: "Candidate must satisfy site, regulatory and budget constraints.", evidenceRefs: [], provenance: ["GEN-001"] }],
        unknowns: [{ kind: "UNKNOWN", id: `UNKNOWN-${idx}-01`, statement: "Altitude, structure, norm and site remain unresolved.", evidenceRefs: [], provenance: ["GEN-001"] }],
      },
      unknowns: ["Conceptual: altura/estructura/norma/sitio aún no resueltos"],
      evidence: ["USER_DEMO_BRIEF"],
      provenance: [`BRIEF:${p.title}`],
    }));
  }, [proposals, projectId]);

  // Estado del Funnel (poda 9→4→1) - solo se crea si hay 9 candidatos
  const [state, setState] = useState<DesignFunnelState | null>(null);

  useEffect(() => {
    if (candidates.length === 9 && !state) {
      try {
        const funnel = createDesignFunnel({ projectId, candidates });
        setState(funnel);
      } catch (e) {
        console.error("[ProposalGallery] Error creando Funnel:", e);
      }
    }
  }, [candidates, projectId, state]);

  const toggleSelection = (id: string) => {
    if (state.stage === "DESIGN_EXPLORER_9") {
      setSelected(prev =>
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      );
    } else if (state.stage === "FINALIST_4") {
      setSelected([id]);
    }
  };

  const handlePromote = () => {
    if (selected.length !== 4) return;
    try {
      const nextState = promoteToFinalFour(state, selected, "Arquitecto (Yvan)", "Selección de 4 finalistas");
      const fixedState = { ...nextState, waitState: "AWAITING_4_TO_1_SELECTION" as const };
      setState(fixedState);
      setSelected([]);
      console.log("[ProposalGallery] Promovido a Final Four:", selected);
    } catch (e) {
      console.error("[ProposalGallery] Error al promover:", e);
      alert(`Error: ${e instanceof Error ? e.message : "Desconocido"}`);
    }
  };

  const handleSelectForDevelopment = () => {
    if (selected.length !== 1) return;
    try {
      const nextState = selectForDevelopment(state, selected[0], "Arquitecto (Yvan)", "Selección del ganador");
      setState(nextState);
      setSelected([]);
      console.log("[ProposalGallery] Seleccionado para desarrollo:", selected[0]);
    } catch (e) {
      console.error("[ProposalGallery] Error al seleccionar:", e);
      alert(`Error: ${e instanceof Error ? e.message : "Desconocido"}`);
    }
  };

  // Determinar qué candidatos mostrar según la etapa
  const visibleCandidates = useMemo(() => {
    if (!state) return [];
    if (state.stage === "SELECTED_FOR_DEVELOPMENT") {
      return state.candidates.filter(c => c.stage === "SELECTED_FOR_DEVELOPMENT");
    }
    if (state.stage === "FINALIST_4" || state.stage === "RETURNED_TO_FINALISTS") {
      return state.candidates.filter(c => c.stage === "FINALIST_4" || c.stage === "SELECTED_FOR_DEVELOPMENT");
    }
    return state.candidates.filter(c => c.stage === "SURVIVOR");
  }, [state]);

  // Mapear candidatos a propuestas (para la geometría)
  const proposalMap = useMemo(() => {
    const map: Record<string, Proposal> = {};
    if (proposals) {
      proposals.forEach(p => { map[p.id] = p; });
    }
    return map;
  }, [proposals]);

  if (!state) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#061522] text-[#64748b] space-y-4 p-8">
        <div className="w-20 h-20 rounded-full bg-[#1e293b] flex items-center justify-center border border-[#28445b]">
          <span className="text-4xl">⏳</span>
        </div>
        <p className="text-sm text-center">Generando propuestas... ({proposals.length}/9)</p>
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#061522] text-[#64748b] space-y-4 p-8">
        <div className="w-20 h-20 rounded-full bg-[#1e293b] flex items-center justify-center border border-[#28445b]">
          <span className="text-4xl">🔲</span>
        </div>
        <p className="text-sm text-center">Pídele a ARKI que genere un edificio para ver las propuestas aquí.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#061522] text-[#d7e8f2]">
      {/* Barra superior */}
      <div className="flex items-center justify-between p-3 border-b border-[#28445b]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#d4ff3a]">PROPUESTAS GENERADAS</span>
          <span className="text-[10px] text-[#8fa8bc]">|</span>
          <span className="text-[10px] text-[#8fa8bc]">
            {state.stage === "DESIGN_EXPLORER_9" && `${visibleCandidates.length} explorando`}
            {state.stage === "FINALIST_4" && `${visibleCandidates.length} finalistas`}
            {state.stage === "SELECTED_FOR_DEVELOPMENT" && `1 seleccionado`}
          </span>
        </div>
        <div className="flex gap-1">
          {["Planta", "3D", "Corte", "Programa", "Costo", "Técnico"].map(v => (
            <button key={v} className="px-2 py-1 text-[9px] rounded border border-[#28445b] hover:bg-[#1e293b] text-[#8fa8bc]">
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Galería de propuestas */}
      <div className="flex-1 overflow-auto p-4">
        <div className={`grid gap-3 ${
          state.stage === "DESIGN_EXPLORER_9" ? "grid-cols-3" : "grid-cols-2"
        }`}>
          {visibleCandidates.map((candidate, idx) => {
            const proposal = proposalMap[candidate.id];
            const hasBuilding = proposal?.building;
            return (
              <div
                key={candidate.id}
                className={`border rounded-lg overflow-hidden cursor-pointer transition ${
                  selected.includes(candidate.id)
                    ? "border-[#d4ff3a] bg-[#102538]"
                    : "border-[#28445b] hover:border-[#d4ff3a]/50"
                }`}
                onClick={() => toggleSelection(candidate.id)}
              >
                {/* Visor 3D */}
                <div className="relative aspect-square bg-[#0a1825]">
                  {hasBuilding ? (
                    <ProfessionalFamilyViewer
                      building={proposal.building}
                      mode="MODEL_3D"
                      quality="media"
                      resolution="hd"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[10px] text-[#475569]">Sin geometría</span>
                    </div>
                  )}
                  <Badge className="absolute top-1 right-1 bg-[#061522]/80 text-[#d4ff3a] border-[#d4ff3a]/30 text-[7px] px-1 py-0">
                    P{String(idx + 1).padStart(2, '0')}
                  </Badge>
                  {selected.includes(candidate.id) && (
                    <Badge className="absolute top-1 left-1 bg-[#d4ff3a] text-black text-[7px] px-1 py-0">
                      ✓
                    </Badge>
                  )}
                </div>

                {/* Datos */}
                <div className="p-2">
                  <h3 className="text-[9px] font-bold line-clamp-1">{candidate.title}</h3>
                  <p className="text-[8px] text-[#8fa8bc] mt-0.5">{candidate.strategy}</p>
                  <div className="flex justify-between text-[7px] text-[#8fa8bc] mt-1">
                    <span>{candidate.metrics?.area ? `${candidate.metrics.area.toFixed(0)} m²` : "—"}</span>
                    <span>{proposal?.metrics.floors ? `${proposal.metrics.floors} pisos` : "—"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Barra inferior con acciones */}
      <div className="p-3 border-t border-[#28445b] flex items-center justify-between">
        <span className="text-[10px] text-[#8fa8bc]">
          {state.stage === "DESIGN_EXPLORER_9" && `${visibleCandidates.length} propuestas · ${selected.length}/4 seleccionadas`}
          {state.stage === "FINALIST_4" && `${visibleCandidates.length} finalistas · ${selected.length}/1 seleccionado`}
          {state.stage === "SELECTED_FOR_DEVELOPMENT" && "✅ Seleccionado para desarrollo"}
        </span>
        {state.stage === "DESIGN_EXPLORER_9" && (
          <Button
            size="sm"
            className="bg-[#d4ff3a] text-black text-[10px] h-7"
            disabled={selected.length !== 4}
            onClick={handlePromote}
          >
            Promover a Finalistas ({selected.length}/4)
          </Button>
        )}
        {state.stage === "FINALIST_4" && (
          <Button
            size="sm"
            className="bg-[#d4ff3a] text-black text-[10px] h-7"
            disabled={selected.length !== 1}
            onClick={handleSelectForDevelopment}
          >
            Seleccionar para Desarrollo
          </Button>
        )}
      </div>
    </div>
  );
}
