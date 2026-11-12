import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polygon, Marker, useMapEvents, useMap } from "react-leaflet";
import { X, MapPin, CheckCircle, Search } from "lucide-react";
// import "leaflet/dist/leaflet.css"; // Desactivado temporalmente por error de loader PNG
import L from "leaflet";

// Fix para los iconos de Leaflet en React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Función para calcular el área de un polígono en metros cuadrados (Fórmula geodésica simple)
const calculateArea = (coords: [number, number][]) => {
  if (coords.length < 3) return 0;
  const R = 6378137; // Radio de la Tierra en metros
  let area = 0;
  for (let i = 0; i < coords.length; i++) {
    const [lat1, lon1] = coords[i];
    const [lat2, lon2] = coords[(i + 1) % coords.length];
    area += (lon2 - lon1) * (2 + Math.sin((lat1 * Math.PI) / 180) + Math.sin((lat2 * Math.PI) / 180));
  }
  area = Math.abs((area * R * R) / 2);
  return area;
};

// Componente interno para manejar los eventos del mapa
function MapEvents({ points, setPoints }: { points: [number, number][], setPoints: (p: [number, number][]) => void }) {
  useMapEvents({
    click(e) {
      setPoints([...points, [e.latlng.lat, e.latlng.lng]]);
    },
  });
  return null;
}

// Componente para centrar el mapa en la búsqueda
function SearchControl({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 16);
  }, [center, map]);
  return null;
}

export default function SiteSelectionModal({ onClose, onSave }: { onClose: () => void, onSave: (area: number) => void }) {
  const [points, setPoints] = useState<[number, number][]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCenter, setSearchCenter] = useState<[number, number] | null>(null);

  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        setSearchCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      }
    } catch (e) {
      console.error("Error buscando ubicación", e);
    }
  };

  const area = calculateArea(points);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-[#0f172a]">
      {/* Barra superior */}
      <div className="flex items-center justify-between p-3 bg-[#0f172a] border-b border-[#1e293b]">
        <h2 className="text-[#e2e8f0] font-bold flex items-center gap-2">
          <MapPin size={18} className="text-[#f0a35b]" /> Selección de Terreno
        </h2>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-[#1e293b] rounded-lg overflow-hidden border border-[#334155]">
            <input
              type="text"
              placeholder="Buscar dirección o ciudad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="bg-transparent px-3 py-1.5 text-sm text-[#e2e8f0] outline-none w-64"
            />
            <button onClick={handleSearch} className="bg-[#334155] px-3 py-1.5 text-[#e2e8f0] hover:bg-[#475569] transition">
              <Search size={16} />
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-[#4ade80] text-sm font-bold">
              Área: {area > 0 ? area.toFixed(2) : 0} m²
            </span>
            <button 
              onClick={() => { onSave(area); onClose(); }}
              className="bg-[#f0a35b] text-black px-4 py-1.5 rounded-lg font-bold flex items-center gap-2 hover:bg-[#e09050]"
            >
              <CheckCircle size={16} /> Usar este Terreno
            </button>
            <button onClick={onClose} className="text-[#64748b] hover:text-[#e2e8f0] p-1"><X size={20} /></button>
          </div>
        </div>
      </div>

      {/* Mapa */}
      <div className="flex-1 relative">
        <MapContainer center={[-12.0464, -77.0428] as [number, number]} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <MapEvents points={points} setPoints={setPoints} />
          <SearchControl center={searchCenter} />
          
          {points.map((p, i) => (
            <Marker key={i} position={p} />
          ))}
          
          {points.length > 1 && (
            <Polygon positions={points} pathOptions={{ color: '#f0a35b', fillColor: '#f0a35b', fillOpacity: 0.3 }} />
          )}
        </MapContainer>
        
        {/* Instrucciones flotantes */}
        <div className="absolute top-4 left-14 bg-[#0f172a]/90 p-3 rounded-lg border border-[#1e293b] z-[1000] text-sm text-[#e2e8f0]">
          Haz clic en el mapa para dibujar el terreno. Los puntos se cerrarán automáticamente.
        </div>
      </div>
    </div>
  );
}
