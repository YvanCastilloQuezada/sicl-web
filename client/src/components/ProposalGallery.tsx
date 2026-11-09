import { Badge } from "@/components/ui/badge";
import ProfessionalFamilyViewer from "@/components/ProfessionalFamilyViewer";

interface Proposal {
  id?: string;
  title?: string;
  strategy?: string;
  metrics?: {
    area?: number;
    floors?: number;
  };
  building?: any;
}

export default function ProposalGallery({ proposals = [] }: { proposals?: Proposal[] }) {
  if (!proposals || proposals.length === 0) {
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
          <span className="text-[10px] text-[#8fa8bc]">{proposals.length} alternativas</span>
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
        <div className="grid grid-cols-3 gap-3">
          {proposals.map((proposal, idx) => {
            // Valores por defecto para evitar errores
            const area = proposal.metrics?.area ?? 0;
            const floors = proposal.metrics?.floors ?? 0;
            const title = proposal.title ?? `Alternativa ${idx + 1}`;
            const strategy = proposal.strategy ?? "Conceptual";
            const hasBuilding = proposal.building !== undefined && proposal.building !== null;

            return (
              <div
                key={proposal.id ?? `prop-${idx}`}
                className="border rounded-lg overflow-hidden border-[#28445b] hover:border-[#d4ff3a] transition"
              >
                {/* Visor 3D real (si hay geometría) o conceptual */}
                <div className="relative aspect-square bg-[#0a1825]">
                  {hasBuilding ? (
                    <ProfessionalFamilyViewer
                      building={proposal.building}
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
                        <span className="text-[6px] text-[#d4ff3a]/60 text-center">{strategy}</span>
                      </div>
                    </>
                  )}
                  <Badge className="absolute top-1 right-1 bg-[#061522]/80 text-[#d4ff3a] border-[#d4ff3a]/30 text-[7px] px-1 py-0">
                    P{String(idx + 1).padStart(2, '0')}
                  </Badge>
                </div>

                {/* Datos */}
                <div className="p-2">
                  <h3 className="text-[9px] font-bold line-clamp-1">{title}</h3>
                  <p className="text-[8px] text-[#8fa8bc] mt-0.5">{strategy}</p>
                  <div className="flex justify-between text-[7px] text-[#8fa8bc] mt-1">
                    <span>{area > 0 ? `${area.toFixed(0)} m²` : "—"}</span>
                    <span>{floors > 0 ? `${floors} pisos` : "—"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
