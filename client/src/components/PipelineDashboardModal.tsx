import { X, CheckCircle2, Circle, Clock, ArrowRight, Layers, FileText, HardHat, Shield, Activity } from "lucide-react";

export default function PipelineDashboardModal({ onClose, onNavigate }: { onClose: () => void, onNavigate: (phase: string) => void }) {
  const phases = [
    { id: 'f1', name: 'F1: Diseño Generativo', status: 'completed', desc: 'Generación de 16 alternativas', icon: <Layers size={16} /> },
    { id: 'f2', name: 'F2: Finalistas', status: 'completed', desc: 'Selección de 4 propuestas', icon: <Layers size={16} /> },
    { id: 'f3', name: 'F3: Ganador', status: 'completed', desc: 'Selección de 1 propuesta maestra', icon: <CheckCircle2 size={16} /> },
    { id: 'f4', name: 'F4: Anteproyecto', status: 'in-progress', desc: 'Viabilidad y PreInversión', icon: <FileText size={16} /> },
    { id: 'f5', name: 'F5: Expediente Técnico', status: 'pending', desc: 'Documentación técnica (Invierte.pe)', icon: <FileText size={16} /> },
    { id: 'f6', name: 'F6: Ingeniería BIM', status: 'pending', desc: 'Clash Detection y Análisis (4D-6D)', icon: <Activity size={16} /> },
    { id: 'f7', name: 'F7: Licitación', status: 'pending', desc: 'Procesos OECE y Contratos', icon: <Shield size={16} /> },
    { id: 'f8', name: 'F8: Ejecución', status: 'pending', desc: 'Supervisión de obra y Valorizaciones', icon: <HardHat size={16} /> },
    { id: 'f9', name: 'F9: Entrega', status: 'pending', desc: 'Recepción y JPRD', icon: <CheckCircle2 size={16} /> },
    { id: 'f10', name: 'F10: Operación', status: 'pending', desc: 'Mantenimiento (7D)', icon: <Clock size={16} /> },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl shadow-2xl w-[900px] max-w-full flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between p-4 border-b border-[#1e293b] bg-[#0b1320]">
          <h2 className="text-[#e2e8f0] font-bold text-lg flex items-center gap-2">
            <Activity size={20} className="text-[#f0a35b]" /> Pipeline Maestro del Proyecto (F1 - F10)
          </h2>
          <button onClick={onClose} className="text-[#64748b] hover:text-[#e2e8f0] bg-[#1e293b] p-1 rounded">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="flex flex-col space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#38bdf8] before:via-[#1e293b] before:to-[#1e293b]">
            {phases.map((phase, idx) => (
              <div key={phase.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                
                {/* Icono en la línea de tiempo */}
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#0f172a] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow z-10 ${
                  phase.status === 'completed' ? 'bg-[#4ade80] text-black' : 
                  phase.status === 'in-progress' ? 'bg-[#f0a35b] text-black animate-pulse' : 
                  'bg-[#1e293b] text-[#64748b]'
                }`}>
                  {phase.icon}
                </div>

                {/* Tarjeta de la fase */}
                <div 
                  onClick={() => onNavigate(phase.id)}
                  className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#1e293b] p-4 rounded-lg border border-[#334155] hover:border-[#38bdf8] cursor-pointer transition group-hover:shadow-lg"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-bold text-sm ${phase.status === 'completed' ? 'text-[#4ade80]' : phase.status === 'in-progress' ? 'text-[#f0a35b]' : 'text-[#e2e8f0]'}`}>
                      {phase.name}
                    </h3>
                    <ArrowRight size={16} className="text-[#64748b] group-hover:text-[#38bdf8] transition" />
                  </div>
                  <p className="text-xs text-[#8fa8bc]">{phase.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t border-[#1e293b] bg-[#0b1320] text-center text-xs text-[#64748b]">
          Haz clic en cualquier fase para abrir la herramienta correspondiente.
        </div>
      </div>
    </div>
  );
}
