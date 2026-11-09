import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createDemoCandidates } from "@shared/arkiDesignFunnel";

interface FunnelGalleryProps {
  params?: {
    tipo?: string;
    area_m2?: number;
    pisos?: number;
    ciudad?: string;
    brief?: string;
  };
  projectId?: string;
}

export default function FunnelGallery({ params, projectId }: FunnelGalleryProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Generar 16 candidatos usando createDemoCandidates (igual que el Funnel real)
  const candidates = useMemo(() => {
    const pid = projectId || `PRO-${Date.now()}`;
    try {
      return createDemoCandidates(pid).map((candidate, index) => ({
        ...candidate,
        metrics: {
          ...candidate.metrics,
          area: (params?.area_m2 || 120000) + index * 1250,
          floors: params?.pisos || 2,
          location: params?.ciudad || "Trujillo",
          brief: params?.brief || "Terminal terrestre",
        },
      }));
    } catch (e) {
      console.error("[FunnelGallery] Error generando candidatos:", e);
      return [];
    }
  }, [params, projectId]);

  if (candidates.length === 0) {
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
          <span className="text-[10px] text-[#8fa8bc]">{candidates.length} propuestas generadas</span>
        </div>
        <div className="flex gap-1">
          {["Planta", "3D", "Corte", "Programa", "Costo", "Técnico"].map(v => (
            <button key={v} className="px-2 py-1 text-[9px] rounded border border-[#28445b] hover:bg-[#1e293b] text-[#8fa8bc]">
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Galería de 16 recuadros (4x4) */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-4 gap-3">
          {candidates.map((candidate, idx) => (
            <div 
              key={candidate.id}
              className={`border rounded-lg overflow-hidden cursor-pointer transition ${
                selected.includes(candidate.id)
                  ? "border-[#d4ff3a] bg-[#102538]"
                  : "border-[#28445b] hover:border-[#d4ff3a]/50"
              }`}
              onClick={() => toggleSelection(candidate.id)}
            >
              {/* Visor conceptual */}
              <div className="relative aspect-square bg-[#0a1825]">
                <div className="absolute inset-0 opacity-30" style={{ 
                  backgroundImage: 'radial-gradient(#d4ff3a 1px, transparent 1px)', 
                  backgroundSize: '12px 12px' 
                }} />
                <div className="absolute inset-3 border border-[#d4ff3a]/30 rounded flex items-center justify-center">
                  <span className="text-[6px] text-[#d4ff3a]/60 text-center">{candidate.flowStrategy || "Conceptual"}</span>
                </div>
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
                <h3 className="text-[8px] font-bold line-clamp-1">{candidate.id || `P${idx + 1}`}</h3>
                <p className="text-[7px] text-[#8fa8bc] mt-0.5">{candidate.metrics?.area?.toFixed(0) || "?"} m²</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Barra inferior */}
      <div className="p-3 border-t border-[#28445b] flex items-center justify-between">
        <span className="text-[10px] text-[#8fa8bc]">
          {candidates.length} propuestas · {selected.length} seleccionadas
        </span>
        <Button 
          size="sm" 
          className="bg-[#d4ff3a] text-black text-[10px] h-7"
          disabled={selected.length === 0}
        >
          Promover a Finalistas ({selected.length})
        </Button>
      </div>
    </div>
  );
}
