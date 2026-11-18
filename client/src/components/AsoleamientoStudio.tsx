import { useState, useEffect } from "react";
import { X, Sun, MapPin, Calendar, Clock, Info } from "lucide-react";
import { getAllUbigeoLocations, getUbigeoByLabel, type UbigeoLocation } from "@/../shared/arkiUbigeoMap";
import { computeSolarPositionClient, type SolarInput } from "@/../shared/arkiSolarUtils";

interface AsoleamientoStudioProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AsoleamientoStudio({ isOpen, onClose }: AsoleamientoStudioProps) {
  const [locations, setLocations] = useState<UbigeoLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<UbigeoLocation | null>(null);
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState<string>("12:00");
  const [solarData, setSolarData] = useState<any>(null);

  useEffect(() => {
    setLocations(getAllUbigeoLocations());
    // Default a Trujillo (ciudad del autor) o Lima
    const defaultLoc = getUbigeoByLabel("Trujillo, La Libertad") || getAllUbigeoLocations()[0];
    setSelectedLocation(defaultLoc);
  }, []);

  useEffect(() => {
    if (selectedLocation && date && time) {
      const input: SolarInput = {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        timezoneOffset: selectedLocation.timezoneOffset,
        datetime: `${date}T${time}:00`,
      };
      const pos = computeSolarPositionClient(input);
      setSolarData(pos);
    }
  }, [selectedLocation, date, time]);

  if (!isOpen) return null;

  const getSunStatus = (elevation: number) => {
    if (elevation < 0) return { text: "Noche", color: "text-slate-400" };
    if (elevation < 15) return { text: "Amanecer/Atardecer", color: "text-orange-400" };
    if (elevation < 60) return { text: "Día (Sol medio)", color: "text-yellow-400" };
    return { text: "Día (Sol alto/Cenit)", color: "text-red-400" };
  };

  const status = solarData ? getSunStatus(solarData.elevation) : { text: "Calculando...", color: "text-slate-400" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Sun className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Estudio de Asoleamiento (Heliodón ARKI)</h2>
              <p className="text-sm text-slate-400">Análisis solar canónico según normativa RNE-PE</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Controls */}
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <MapPin className="w-4 h-4" /> Ubicación (Ubigeo Perú)
              </label>
              <select
                value={selectedLocation?.label || ""}
                onChange={(e) => setSelectedLocation(getUbigeoByLabel(e.target.value) || null)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                {locations.map((loc) => (
                  <option key={loc.label} value={loc.label}>
                    {loc.label}
                  </option>
                ))}
              </select>
              {selectedLocation && (
                <p className="text-xs text-slate-500 mt-1">
                  Lat: {selectedLocation.latitude}° | Lon: {selectedLocation.longitude}° | Alt: Uso de capital provincial
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                  <Calendar className="w-4 h-4" /> Fecha
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                  <Clock className="w-4 h-4" /> Hora
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" /> Datos Solares Calculados
              </h3>
              {solarData ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Elevación</p>
                    <p className="text-2xl font-bold text-white">{solarData.elevation}°</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Azimut</p>
                    <p className="text-2xl font-bold text-white">{solarData.azimuth}°</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Declinación</p>
                    <p className="text-lg font-semibold text-slate-300">{solarData.declination}°</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Estado</p>
                    <p className={`text-lg font-semibold ${status.color}`}>{status.text}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500">Selecciona una ubicación y fecha para calcular.</p>
              )}
            </div>
          </div>

          {/* Right: Visual Placeholder (Ready for 3D integration) */}
          <div className="bg-slate-950 rounded-lg border border-slate-800 flex flex-col items-center justify-center p-8 min-h-[300px] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5" />
            <Sun className="w-16 h-16 text-yellow-500/30 mb-4" />
            <p className="text-slate-400 text-center font-medium">Visualización 3D del Heliodón</p>
            <p className="text-slate-600 text-sm text-center mt-2 max-w-xs">
              Próximamente: Integración con UPAO001MassingViewer3D para mostrar sombras dinámicas en tiempo real sobre la masa del edificio.
            </p>
            {solarData && solarData.elevation > 0 && (
              <div className="mt-6 w-full max-w-xs">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Amanecer</span>
                  <span>Cenit</span>
                  <span>Atardecer</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full relative">
                  <div 
                    className="absolute top-0 w-4 h-4 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50 transform -translate-y-1 transition-all duration-500"
                    style={{ 
                      left: `${Math.max(0, Math.min(100, ((solarData.hourAngle + 90) / 180) * 100))}%`,
                      bottom: `${Math.max(0, Math.min(80, solarData.elevation))}%`
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Cerrar
          </button>
          <button 
            className="px-4 py-2 text-sm font-medium bg-yellow-500 hover:bg-yellow-600 text-slate-900 rounded-lg transition-colors flex items-center gap-2"
            onClick={() => alert("Funcionalidad de exportación de reporte RNE en desarrollo (MO-HELIODON-03)")}
          >
            <Sun className="w-4 h-4" />
            Generar Reporte RNE
          </button>
        </div>
      </div>
    </div>
  );
}
