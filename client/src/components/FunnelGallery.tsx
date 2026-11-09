import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import ProfessionalFamilyViewer from "@/components/ProfessionalFamilyViewer";
import { Button } from "@/components/ui/button";
import {
  createDemoCandidates,
  createDesignFunnel,
  promoteToFinalFour,
  selectForDevelopment,
  type DesignCandidate,
  type DesignFunnelState,
} from "@shared/arkiDesignFunnel";

interface Parti {
  id: string;
  title: string;
  organizingIdea: string;
  flowStrategy: string;
}

interface FunnelGalleryProps {
  params?: {
    tipo?: string;
    area_m2?: number;
    pisos?: number;
    ciudad?: string;
    brief?: string;
  };
  partis?: Parti[];
  projectId?: string;
}

export default function FunnelGallery({ params, partis = [], projectId }: FunnelGalleryProps) {
  const pid = projectId || `PRO-${Date.now()}`;

  // Generar 9 candidatos base y asignarles un parti (estrategia)
  const baseCandidates = useMemo(() => {
    try {
      const candidates = createDemoCandidates(pid);
      const strategies = ["Patio central", "Espina pública", "Núcleo compacto", "Borde climático"];
      
      return candidates.map((candidate, index) => {
        // Asignar un parti rotando (si hay partis disponibles)
        const parti = partis.length > 0 ? partis[index % partis.length] : null;
        
        return {
          ...candidate,
          strategy: parti?.flowStrategy || strategies[index % strategies.length],
          title: `${parti?.title || candidate.title} ${index + 1}`,
          metrics: {
            ...candidate.metrics,
            area: (params?.area_m2 || 120000) + index * 1250,
            floors: params?.pisos || 2,
            location: params?.ciudad || "Trujillo",
          },
        };
      });
    } catch (e) {
      console.error("[FunnelGallery] Error generando candidatos:", e);
      return [];
    }
  }, [pid, params, partis]);

  // Estado del Funnel (maneja las podas 9→4→1)
  const [state, setState] = useState<DesignFunnelState>(() =>
    createDesignFunnel({ projectId: pid, candidates: baseCandidates })
  );
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Determinar qué candidatos mostrar según la etapa
  const visibleCandidates = useMemo(() => {
    if (state.stage === "SELECTED_FOR_DEVELOPMENT") {
      return state.candidates.filter(c => c.stage === "SELECTED_FOR_DEVELOPMENT");
    }
    if (state.stage === "FINALIST_4" || state.stage === "RETURNED_TO_FINALISTS") {
      return state.candidates.filter(c => c.stage === "FINALIST_4" || c.stage === "SELECTED_FOR_DEVELOPMENT");
    }
    // DESIGN_EXPLORER_9: mostrar los supervivientes
    return state.candidates.filter(c => c.stage === "SURVIVOR");
  }, [state]);

  const handlePromote = () => {
    if (selected.length !== 4) return;
    try {
      const nextState = promoteToFinalFour(state, selected, "Arquitecto (Yvan)", "Selección de 4 finalistas");
      // FIX: promoteToFinalFour deja waitState en "NONE", pero necesitamos "AWAITING_4_TO_1_SELECTION"
      // para que selectForDevelopment funcione.
      const fixedState = { ...nextState, waitState: "AWAITING_4_TO_1_SELECTION" as const };
      setState(fixedState);
      setSelected([]);
      console.log("[FunnelGallery] Promovido a Final Four:", selected, "waitState:", fixedState.waitState);
    } catch (e) {
      console.error("[FunnelGallery] Error al promover:", e);
      alert(`Error: ${e instanceof Error ? e.message : "Desconocido"}`);
    }
  };

  const handleSelectForDevelopment = (id: string) => {
    try {
      const nextState = selectForDevelopment(state, id, "Arquitecto (Yvan)", "Selección del ganador");
      setState(nextState);
      setSelected([]);
      console.log("[FunnelGallery] Seleccionado para desarrollo:", id);
    } catch (e) {
      console.error("[FunnelGallery] Error al seleccionar:", e);
      alert(`Error: ${e instanceof Error ? e.message : "Desconocido"}`);
    }
  };

  if (baseCandidates.length === 0) {
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
          <span className="text-xs font-bold text-[#d4ff3a]">FUNNEL 16-4-1</span>
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

      {/* Galería */}
      <div className="flex-1 overflow-auto p-4">
        <div className={`grid gap-3 ${
          state.stage === "DESIGN_EXPLORER_9" ? "grid-cols-4" : "grid-cols-2"
        }`}>
          {visibleCandidates.map((candidate, idx) => (
            <div
              key={candidate.id}
              className={`border rounded-lg overflow-hidden cursor-pointer transition ${
                selected.includes(candidate.id)
                  ? "border-[#d4ff3a] bg-[#102538]"
                  : "border-[#28445b] hover:border-[#d4ff3a]/50"
              }`}
              onClick={() => toggleSelection(candidate.id)}
            >
              {/* Visor 3D real (si hay geometría) o conceptual */}
              <div className="relative aspect-square bg-[#0a1825]">
                {candidate.building ? (
                  <ProfessionalFamilyViewer 
                    building={candidate.building} 
                    mode="MODEL_3D" 
                    quality="media" 
                    resolution="hd" 
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 opacity-30" style={{
                      backgroundImage: 'radial-gradient(#d4ff3a 1px, transparent 1px)',
                      backgroundSize: '12px 12px'
                    }} />
                    <div className="absolute inset-3 border border-[#d4ff3a]/30 rounded flex items-center justify-center">
                      <span className="text-[6px] text-[#d4ff3a]/60 text-center">{candidate.strategy}</span>
                    </div>
                  </>
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
              <div className="p-1.5">
                <h3 className="text-[8px] font-bold line-clamp-1">{candidate.title}</h3>
                <p className="text-[7px] text-[#8fa8bc] mt-0.5">{candidate.metrics?.area?.toFixed(0) || "?"} m²</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Barra inferior */}
      <div className="p-3 border-t border-[#28445b] flex items-center justify-between">
        <span className="text-[10px] text-[#8fa8bc]">
          {state.stage === "DESIGN_EXPLORER_9" && `${visibleCandidates.length} propuestas · ${selected.length}/4 seleccionadas`}
          {state.stage === "FINALIST_4" && `${visibleCandidates.length} finalistas`}
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
        {state.stage === "FINALIST_4" && selected.length === 1 && (
          <Button
            size="sm"
            className="bg-[#d4ff3a] text-black text-[10px] h-7"
            onClick={() => handleSelectForDevelopment(selected[0])}
          >
            Seleccionar para Desarrollo
          </Button>
        )}
      </div>
    </div>
  );
}
