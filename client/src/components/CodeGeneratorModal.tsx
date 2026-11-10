import { X, Play } from "lucide-react";
export default function CodeGeneratorModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl w-[800px] max-w-[90vw] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-[#1e293b]">
          <h2 className="text-[#e2e8f0] font-bold">Generador de Código Paramétrico</h2>
          <button onClick={onClose} className="text-[#64748b] hover:text-[#e2e8f0]"><X size={20} /></button>
        </div>
        <div className="p-4 flex-1">
          <pre className="bg-[#0a1825] p-4 rounded-lg text-[#38bdf8] text-sm overflow-x-auto">
{`# ARKI Parametric Python (Dynamo)
import clr
clr.AddReference('ProtoGeometry')
from Autodesk.DesignScript.Geometry import *

# Parámetros del proyecto
area = IN[0]
pisos = IN[1]

# Lógica generativa
base = Rectangle.ByWidthLength(area, area)
edificio = base.Extrude(pisos * 3.5)

OUT = edificio`}
          </pre>
        </div>
        <div className="p-4 border-t border-[#1e293b] flex justify-end gap-2">
          <button className="bg-[#38bdf8] text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2"><Play size={16} /> Ejecutar Script</button>
        </div>
      </div>
    </div>
  );
}
