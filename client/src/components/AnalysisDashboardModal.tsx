import { useState } from "react";
import { X } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data5D = [
  { mes: 'Ene', costo: 4000 }, { mes: 'Feb', costo: 3000 },
  { mes: 'Mar', costo: 2000 }, { mes: 'Abr', costo: 2780 },
  { mes: 'May', costo: 1890 }, { mes: 'Jun', costo: 2390 },
];

export default function AnalysisDashboardModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState("Costos (5D)");
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl w-[800px] max-w-[90vw] flex flex-col h-[500px]">
        <div className="flex items-center justify-between p-4 border-b border-[#1e293b]">
          <h2 className="text-[#e2e8f0] font-bold">Panel de Análisis y Métricas</h2>
          <button onClick={onClose} className="text-[#64748b] hover:text-[#e2e8f0]"><X size={20} /></button>
        </div>
        <div className="flex border-b border-[#1e293b]">
          {["Costos (5D)", "Energía (6D)", "Cronograma (4D)"].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm ${tab === t ? "text-[#38bdf8] border-b-2 border-[#38bdf8]" : "text-[#64748b]"}`}>{t}</button>
          ))}
        </div>
        <div className="p-6 flex-1">
          {tab === "Costos (5D)" ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data5D}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="mes" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                <Line type="monotone" dataKey="costo" stroke="#38bdf8" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-[#64748b]">
              Resultados de {tab} generados por el Motor de IA.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
