import { useState } from "react";
import { X, Play, Terminal, Cpu, CheckCircle2 } from "lucide-react";
import ProposalGallery from "./ProposalGallery";

export default function F1DemoScreen({ onClose }: { onClose: () => void }) {
  const [prompt, setPrompt] = useState("Hospital de 200 camas con área de emergencia y helipuerto");
  const [isGenerating, setIsGenerating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);

  const handleRunF1 = () => {
    setIsGenerating(true);
    setProposals([]);
    setLogs(["Iniciando pipeline F1 (ARKI Brain)...", `Analizando prompt: "${prompt}"`]);

    // Simulamos los logs del backend F1
    const steps = [
      "Extrayendo parámetros urbanos y programa arquitectónico...",
      "Calculando volumetría base (16 variantes)...",
      "Aplicando normativa RNE (Retiros, Alturas)...",
      "Generando propuestas geométricas...",
      "F1 completado con éxito. 16 alternativas listas."
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setLogs(prev => [...prev, step]);
        
        // Cuando llega al final, generamos las propuestas
        if (index === steps.length - 1) {
          generateMockProposals();
          setIsGenerating(false);
        }
      }, (index + 1) * 800); // 800ms entre cada log
    });
  };

  const generateMockProposals = () => {
    const strategies = [
      "Monobloque Compacto", "Pabellonado Lineal", "Patio Central", "Forma en H",
      "Forma en U", "Torre Única", "Zócalo + Torre", "Claustro",
      "Orgánico Curvo", "Modular en T", "Modular en L", "Peine",
      "Racimo (Cluster)", "Espiral", "Atrio Central", "Fraccionado"
    ];
    
    const mock = Array.from({ length: 16 }).map((_, i) => ({
      id: `prop-${i}`,
      title: `Alternativa F1-${i + 1}`,
      strategy: strategies[i],
      metrics: { 
        area: 5000 + (i * 150), 
        floors: Math.floor(Math.random() * 4) + 3 
      },
      building: {} // Placeholder para que renderice el 3D
    }));
    
    setProposals(mock);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-[#061522]">
      {/* Header de la Demo */}
      <div className="flex items-center justify-between p-3 border-b border-[#28445b] bg-[#0f172a]">
        <div className="flex items-center gap-3">
          <div className="bg-[#f0a35b] text-black font-bold px-2 py-1 rounded text-xs">F1 DEMO</div>
          <h2 className="text-[#e2e8f0] font-bold text-lg">Sala de Pruebas - Fase 1 (Generación)</h2>
        </div>
        <button onClick={onClose} className="text-[#64748b] hover:text-white bg-[#1e293b] p-1 rounded">
          <X size={20} />
        </button>
      </div>

      {/* Contenido Principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Panel Izquierdo: Controles y Logs */}
        <div className="w-80 border-r border-[#28445b] bg-[#0b1320] flex flex-col p-4">
          <label className="text-xs text-[#8fa8bc] mb-2 font-bold uppercase">Prompt del Proyecto</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-24 bg-[#1e293b] border border-[#334155] rounded-lg p-2 text-sm text-[#e2e8f0] focus:outline-none focus:border-[#38bdf8] resize-none mb-4"
            placeholder="Ej: Hospital de 200 camas..."
          />
          
          <button 
            onClick={handleRunF1}
            disabled={isGenerating}
            className="w-full bg-[#f0a35b] text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-[#e09050] transition disabled:opacity-50 mb-6"
          >
            {isGenerating ? <Cpu className="animate-spin" size={18} /> : <Play size={18} />}
            {isGenerating ? "Procesando F1..." : "Ejecutar Fase 1"}
          </button>

          <div className="flex-1 bg-[#050b14] rounded-lg border border-[#1e293b] p-3 overflow-y-auto font-mono text-[10px] text-[#38bdf8] flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#64748b] border-b border-[#1e293b] pb-2 mb-2">
              <Terminal size={12} /> Consola de Salida ARKI
            </div>
            {logs.length === 0 && <span className="text-[#475569]">Esperando ejecución...</span>}
            {logs.map((log, i) => (
              <div key={i} className="flex items-start gap-1">
                <span className="text-[#f0a35b]">{">"}</span>
                <span>{log}</span>
              </div>
            ))}
            {logs.length > 0 && !isGenerating && (
              <div className="text-[#4ade80] flex items-center gap-1 mt-2">
                <CheckCircle2 size={12} /> Pipeline finalizado.
              </div>
            )}
          </div>
        </div>

        {/* Panel Derecho: Resultados (Galería) */}
        <div className="flex-1 bg-[#061522] relative">
          {proposals.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#64748b]">
              <Cpu size={48} className="mb-4 opacity-20" />
              <p className="text-lg">Ingresa un prompt y ejecuta la Fase 1</p>
              <p className="text-sm mt-2">Aquí aparecerán las alternativas generadas por el motor.</p>
            </div>
          ) : (
            <ProposalGallery proposals={proposals} />
          )}
        </div>
      </div>
    </div>
  );
}
