import { useState } from "react";
import { X, Upload, FileText, Eye, CheckCircle, Search, File } from "lucide-react";

export default function ProjectDocumentsModal({ onClose }: { onClose: () => void }) {
  const [files, setFiles] = useState<{name: string, size: string}[]>([
    { name: "Certificado_SUNARP_CR.pdf", size: "2.4 MB" },
    { name: "Plano_Catastral_Antiguo.dwg", size: "5.1 MB" }
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFiles([...files, { name: file.name, size: (file.size / 1024 / 1024).toFixed(1) + " MB" }]);
    }
  };

  const handleAnalyze = () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);
    
    // Simulamos la llamada a la Visión IA (ARKI Brain)
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult({
        zonificacion: "R3 - Residencial Densidad Media",
        areaTerreno: "150.00 m²",
        frente: "8.50 ml",
        alturaMaxima: "15.00 ml (5 pisos)",
        retiros: "Frontal 3m, Lateral 2m",
        coeficiente: "2.1",
      });
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl shadow-2xl w-[1000px] max-w-full flex flex-col h-[80vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1e293b] bg-[#0b1320]">
          <h2 className="text-[#e2e8f0] font-bold text-lg flex items-center gap-2">
            <FileText size={20} className="text-[#38bdf8]" /> Documentos del Proyecto (Registros Públicos)
          </h2>
          <button onClick={onClose} className="text-[#64748b] hover:text-[#e2e8f0] bg-[#1e293b] p-1 rounded">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Panel Izquierdo: Lista de Archivos */}
          <div className="w-1/3 border-r border-[#1e293b] flex flex-col bg-[#0f172a]">
            <div className="p-4">
              <label className="w-full flex items-center justify-center gap-2 bg-[#1e293b] border border-dashed border-[#38bdf8] text-[#38bdf8] py-3 rounded-lg cursor-pointer hover:bg-[#38bdf8]/10 transition">
                <Upload size={18} /> Subir Documento (CR, DWG, PDF)
                <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.dwg,.cr,.jpg,.png" />
              </label>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
              {files.map((f, i) => (
                <div 
                  key={i} 
                  onClick={() => { setSelectedFile(f.name); setAnalysisResult(null); }}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition ${selectedFile === f.name ? 'bg-[#1e293b] border border-[#38bdf8]' : 'bg-[#0b1320] border border-[#1e293b] hover:bg-[#1e293b]'}`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <File size={16} className="text-[#64748b] flex-shrink-0" />
                    <div className="truncate">
                      <p className="text-sm text-[#e2e8f0] truncate">{f.name}</p>
                      <p className="text-[10px] text-[#64748b]">{f.size}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Panel Derecho: Visor y Análisis */}
          <div className="flex-1 flex flex-col bg-[#0b1320] relative">
            {!selectedFile ? (
              <div className="flex-1 flex flex-col items-center justify-center text-[#64748b]">
                <Search size={40} className="mb-4 opacity-50" />
                <p>Selecciona un documento para ver su análisis inteligente.</p>
              </div>
            ) : (
              <>
                {/* Visor del documento (Placeholder) */}
                <div className="flex-1 p-4 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[#e2e8f0] font-semibold">{selectedFile}</h3>
                    <button 
                      onClick={handleAnalyze} 
                      disabled={isAnalyzing}
                      className="bg-[#f0a35b] text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-[#e09050] transition disabled:opacity-50"
                    >
                      <Eye size={16} /> {isAnalyzing ? "Analizando con IA..." : "Extraer Parámetros con Visión IA"}
                    </button>
                  </div>

                  <div className="flex-1 bg-[#0f172a] border border-[#1e293b] rounded-lg flex items-center justify-center relative overflow-hidden">
                    <p className="text-[#64748b] text-sm z-10">[Vista previa del documento]</p>
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-[#0f172a]/80 flex items-center justify-center z-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#38bdf8]"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Resultados del Análisis */}
                {analysisResult && (
                  <div className="h-1/3 border-t border-[#1e293b] bg-[#0f172a] p-4 overflow-y-auto">
                    <h3 className="text-[#4ade80] font-bold flex items-center gap-2 mb-3">
                      <CheckCircle size={16} /> Parámetros Urbanos Extraídos
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#1e293b] p-3 rounded-lg border border-[#334155]">
                        <p className="text-[10px] text-[#64748b] uppercase">Zonificación</p>
                        <p className="text-sm text-[#e2e8f0]">{analysisResult.zonificacion}</p>
                      </div>
                      <div className="bg-[#1e293b] p-3 rounded-lg border border-[#334155]">
                        <p className="text-[10px] text-[#64748b] uppercase">Área del Terreno</p>
                        <p className="text-sm text-[#e2e8f0]">{analysisResult.areaTerreno}</p>
                      </div>
                      <div className="bg-[#1e293b] p-3 rounded-lg border border-[#334155]">
                        <p className="text-[10px] text-[#64748b] uppercase">Frente</p>
                        <p className="text-sm text-[#e2e8f0]">{analysisResult.frente}</p>
                      </div>
                      <div className="bg-[#1e293b] p-3 rounded-lg border border-[#334155]">
                        <p className="text-[10px] text-[#64748b] uppercase">Altura Máxima</p>
                        <p className="text-sm text-[#e2e8f0]">{analysisResult.alturaMaxima}</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
