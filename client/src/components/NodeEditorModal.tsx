import { X } from "lucide-react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";

const initialNodes = [
  { id: '1', position: { x: 50, y: 50 }, data: { label: 'Área Terreno (150m²)' }, style: { background: '#1e293b', color: '#fff', border: '1px solid #38bdf8', borderRadius: '8px' } },
  { id: '2', position: { x: 50, y: 150 }, data: { label: 'Pisos Permitidos (5)' }, style: { background: '#1e293b', color: '#fff', border: '1px solid #38bdf8', borderRadius: '8px' } },
  { id: '3', position: { x: 350, y: 100 }, data: { label: 'Generar Volumen 3D' }, style: { background: '#f0a35b', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '8px' } },
];
const initialEdges = [
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#38bdf8' } },
  { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#38bdf8' } },
];

export default function NodeEditorModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-[#0a1825]">
      <div className="flex items-center justify-between p-3 border-b border-[#1e293b] bg-[#0f172a]">
        <h2 className="text-[#e2e8f0] font-bold">Generador Paramétrico Visual (Nodos)</h2>
        <button onClick={onClose} className="text-[#64748b] hover:text-[#e2e8f0] bg-[#1e293b] p-1 rounded"><X size={20} /></button>
      </div>
      <div className="flex-1">
        <ReactFlow nodes={initialNodes} edges={initialEdges} fitView>
          <Background color="#1e293b" gap={16} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
