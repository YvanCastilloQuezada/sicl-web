import { useState } from "react";
import { X, Play, Terminal, CheckCircle2, Loader2, Cpu, Box, LayoutDashboard, Image as ImageIcon, Layers } from "lucide-react";
import ProfessionalFamilyViewer from "./ProfessionalFamilyViewer";

export default function FullPipelineRunner({ onClose }: { onClose: () => void }) {
  const [prompt, setPrompt] = useState("Hospital de 200 camas con helipuerto");
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [logs, setLogs] = useState<{ phase: string, text: string, status: 'pending' | 'running' | 'done' }[]>([]);
  const [currentPhase, setCurrentPhase] = useState(0);
  
  // Estado para el visor 3D final
  const [activeTab, setActiveTab] = useState<'3D' | 'PLAN' | 'SECTION' | 'RENDER'>('3D');

  // Datos simulados del edificio generado para el visor 3D
  const generatedBuilding = {
    geometry3d: { floors: 5, heightM: 20, massing: "COURTYARD_MASS" },
    geometry2d: { widthM: 80, depthM: 60, footprintM2: 4800, courtyardM2: 800 }
  };

  const pipelineSteps = [
    { phase: "F1", text: "Interpretando prompt y extrayendo parámetros (NLP)..." },
    { phase: "F1", text: "Generando 16 alternativas volumétricas..." },
    { phase: "F2", text: "Filtrando a 4 propuestas finalistas..." },
    { phase: "F3", text: "Seleccionando la propuesta ganadora..." },
    { phase: "F4", text: "Generando Anteproyecto y Ficha de Viabilidad (Invierte.pe)..." },
    { phase: "F5", text: "Armando Expediente Técnico (Planos, Memorias, Presupuesto)..." },
    { phase: "F6", text: "Analizando Ingeniería (Clash Detection, Estructuras, 6D Energía)..." },
    { phase: "F7", text: "Preparando Licitación y Bases de Concurso (OECE)..." },
    { phase: "F8", text: "Simulando Ejecución de Obra y Cronograma 4D..." },
    { phase: "F9", text: "Generando Actas de Recepción y JPRD..." },
    { phase: "F10", text: "Plan de Facility Management y Operación 7D listo." },
  ];

  const runPipeline = () => {
    setIsRunning(true);
    setIsComplete(false);
    setLogs([]);
    setCurrentPhase(0);
    setActiveTab('3D');

    let stepIndex = 0;
    
    const executeStep = () => {
      if (stepIndex >= pipelineSteps.length) {
        setIsRunning(false);
        setIsComplete(true); // ¡Aquí mostramos el visor!
        return;
      }

      const step = pipelineSteps[stepIndex];
      setCurrentPhase(stepIndex + 1);
      
      setLogs(prev => [...prev, { ...step, status: 'running' }]);

      setTimeout(() => {
        setLogs(prev => {
          const newLogs = [...prev];
          newLogs[newLogs.length - 1].status = 'done';
          return newLogs;
        });
        stepIndex++;
        executeStep();
      }, 500 + Math.random() * 300); // Un poco más rápido para no aburrir
    };

    executeStep();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0a1825] border border-[#1e293b] rounded-xl w-[1200px] max-w-[95vw] flex flex-col h-[85vh] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1e293b] bg-[#0f172a]">
          <h2 className="text-[#e2e8f0] font-bold flex items-center gap-2">
            <Cpu size={20} className="text-[#f0a35b]" /> Pipeline Maestro y Estudio de Diseño
          </h2>
          <button onClick={onClose} className="text-[#64748b] hover:text-white"><X size={20}/></button>
        </div>

        {/* Barra de Prompt */}
        <div className="p-4 bg-[#0b1320] border-b border-[#1e293b] flex gap-2">
          <input 
            type="text" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isRunning}
            className="flex-1 bg-[#1e293b] border border-[#334155] rounded-lg px-4 py-2 text-sm text-[#e2e8f0] focus:outline-none focus:border-[#38bdf8]"
            placeholder="Describe el proyecto a generar..."
          />
          <button 
            onClick={runPipeline}
            disabled={isRunning || !prompt}
            className="bg-[#f0a35b] text-black font-bold px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-[#e09050] transition disabled:opacity-50"
          >
            {isRunning ? <Loader2 className="animate-spin" size={18}/> : <Play size={18}/>}
            {isRunning ? "Procesando..." : "Generar Proyecto"}
          </button>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="flex-1 relative overflow-hidden bg-[#061522]">
          
          {/* VISTA 1: CONSOLA MIENTRAS CORRE */}
          {!isComplete && (
            <div className="absolute inset-0 flex p-4 gap-4">
              <div className="flex-1 bg-[#050b14] rounded-lg border border-[#1e293b] p-4 overflow-y-auto font-mono text-xs">
                <div className="flex items-center gap-2 text-[#64748b] border-b border-[#1e293b] pb-2 mb-4">
                  <Terminal size={14} /> ARKI Brain Execution Logs
                </div>
                <div className="space-y-3">
                  {logs.map((log, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        log.phase.startsWith('F1') ? 'bg-[#38bdf8]/20 text-[#38bdf8]' : 
                        log.phase.startsWith('F4') ? 'bg-[#fbbf24]/20 text-[#fbbf24]' : 'bg-[#4ade80]/20 text-[#4ade80]'
                      }`}>{log.phase}</span>
                      <span className={`flex-1 ${log.status === 'running' ? 'text-[#e2e8f0] animate-pulse' : 'text-[#8fa8bc]'}`}>
                        {log.text}
                      </span>
                      {log.status === 'done' && <CheckCircle2 size={14} className="text-[#4ade80]" />}
                      {log.status === 'running' && <Loader2 size={14} className="text-[#f0a35b] animate-spin" />}
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-64 bg-[#0f172a] border border-[#1e293b] p-4 rounded-lg flex flex-col items-center justify-center text-center">
                 <div className="text-4xl font-bold text-[#f0a35b] mb-2">{currentPhase}<span className="text-lg text-[#64748b]">/11</span></div>
                 <p className="text-[#38bdf8] text-sm font-bold animate-pulse">Ejecutando IA...</p>
              </div>
            </div>
          )}

          {/* VISTA 2: ESTUDIO DE DISEÑO (SPLIT SCREEN) AL TERMINAR */}
          {isComplete && (
            <div className="absolute inset-0 flex flex-col">
              {/* Barra de Herramientas de Diseño */}
              <div className="flex items-center gap-1 p-2 bg-[#0f172a] border-b border-[#1e293b]">
                <span className="text-xs font-bold text-[#4ade80] px-3 border-r border-[#1e293b] mr-2 flex items-center gap-1">
                  <CheckCircle2 size={14} /> Proyecto Generado
                </span>
                <button onClick={() => setActiveTab('3D')} className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 ${activeTab === '3D' ? 'bg-[#38bdf8] text-black font-bold' : 'text-[#e2e8f0] hover:bg-[#1e293b]'}`}>
                  <Box size={14}/> Perspectiva 3D
                </button>
                <button onClick={() => setActiveTab('PLAN')} className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 ${activeTab === 'PLAN' ? 'bg-[#38bdf8] text-black font-bold' : 'text-[#e2e8f0] hover:bg-[#1e293b]'}`}>
                  <LayoutDashboard size={14}/> Planta
                </button>
                <button onClick={() => setActiveTab('SECTION')} className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 ${activeTab === 'SECTION' ? 'bg-[#38bdf8] text-black font-bold' : 'text-[#e2e8f0] hover:bg-[#1e293b]'}`}>
                  <Layers size={14}/> Corte / Elevación
                </button>
                <button onClick={() => setActiveTab('RENDER')} className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 ${activeTab === 'RENDER' ? 'bg-[#38bdf8] text-black font-bold' : 'text-[#e2e8f0] hover:bg-[#1e293b]'}`}>
                  <ImageIcon size={14}/> Render Fotorrealista
                </button>
              </div>

              {/* Split Screen: Izquierda 3D Fijo / Derecha Cambia según Pestaña */}
              <div className="flex-1 flex p-2 gap-2">
                
                {/* Panel Izquierdo: Siempre muestra el 3D */}
                <div className="flex-1 bg-[#0a1825] rounded-lg border border-[#28445b] relative overflow-hidden shadow-lg">
                  <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-[10px] text-[#38bdf8] z-10 border border-[#38bdf8]/30">Modelo 3D (IFC)</div>
                  <ProfessionalFamilyViewer building={generatedBuilding} mode="MODEL_3D" quality="alta" resolution="hd" />
                </div>

                {/* Panel Derecho: Cambia según la pestaña */}
                <div className="flex-1 bg-[#0a1825] rounded-lg border border-[#28445b] relative overflow-hidden shadow-lg">
                  <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-[10px] text-[#f0a35b] z-10 border border-[#f0a35b]/30 uppercase">
                    {activeTab === '3D' ? 'Vista 3D Alterna' : activeTab === 'PLAN' ? 'Planta Arquitectónica' : activeTab === 'SECTION' ? 'Corte Transversal' : 'Render IA'}
                  </div>

                  {activeTab === '3D' && (
                    <ProfessionalFamilyViewer building={generatedBuilding} mode="MODEL_3D" quality="alta" resolution="hd" />
                  )}
                  {activeTab === 'PLAN' && (
                    <ProfessionalFamilyViewer building={generatedBuilding} mode="PLAN" quality="alta" resolution="hd" />
                  )}
                  {activeTab === 'SECTION' && (
                    <ProfessionalFamilyViewer building={generatedBuilding} mode="SECTION" quality="alta" resolution="hd" />
                  )}
                  {activeTab === 'RENDER' && (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-[#090e14]">
                       <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" alt="Render"/>
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                         <p className="text-white text-sm">Render conceptual generado por ARKI (Fase 3)</p>
                       </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
