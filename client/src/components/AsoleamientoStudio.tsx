import { useState, useEffect, useMemo } from "react";
import { X, Sun, MapPin, Calendar, Clock, Info, Search } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getAllUbigeoLocations, type UbigeoLocation } from "../../../shared/arkiUbigeoMap";
import { UBIGEO_HIERARCHY, getProvinces, getDistricts, findLocation } from "../../../shared/arkiUbigeoHierarchy";
import { computeSolarPositionClient, type SolarInput } from "../../../shared/arkiSolarUtils";

// Fix para iconos de Leaflet en Webpack/Vite
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface AsoleamientoStudioProps {
  isOpen: boolean;
  onClose: () => void;
}


// ARKI: componente que hace volar el mapa a la selección actual
// (MapContainer ignora 'center' después del montaje; useMap + setView lo corrige)
function MapRecenter({ position, zoom }: { position: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, zoom, { animate: true });
    }
  }, [position, zoom, map]);
  return null;
}

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function AsoleamientoStudio({ isOpen, onClose }: AsoleamientoStudioProps) {
  const [selectedLocation, setSelectedLocation] = useState<UbigeoLocation | null>(null);
  const [department, setDepartment] = useState<string>("");
  const [province, setProvince] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState<string>("12:00");
  const [mapCenter, setMapCenter] = useState<[number, number]>([-12.0464, -77.0428]); // Centro de Perú
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);
  const [houseRotation, setHouseRotation] = useState<number>(0); // Rotación de la casa (0 = norte)

  const departments = useMemo(() => Object.keys(UBIGEO_HIERARCHY).sort(), []);
  const provinces = useMemo(() => (department ? getProvinces(department) : []), [department]);
  const districts = useMemo(() => (department && province ? getDistricts(department, province) : []), [department, province]);

  useEffect(() => {
    // Default: Trujillo
    const defaultLoc = getAllUbigeoLocations().find((l) => l.label === "Lima, Lima, Lima") || getAllUbigeoLocations().find((l) => l.province === "Lima" && l.department === "Lima") || getAllUbigeoLocations()[0];
    if (defaultLoc) {
      setSelectedLocation(defaultLoc);
      setDepartment(defaultLoc.department);
      setProvince(defaultLoc.province);
      setDistrict(defaultLoc.district);
      setMapCenter([defaultLoc.latitude, defaultLoc.longitude]);
      setMarkerPos([defaultLoc.latitude, defaultLoc.longitude]);
      setSliderValue(50);
    }
  }, []);

  const handleMapClick = (lat: number, lng: number) => {
    setMarkerPos([lat, lng]);
    // Encontrar la localidad Ubigeo más cercana
    const allLocs = getAllUbigeoLocations();
    let nearest = allLocs[0];
    let minDist = Infinity;
    for (const loc of allLocs) {
      const dist = haversineDistance(lat, lng, loc.latitude, loc.longitude);
      if (dist < minDist) {
        minDist = dist;
        nearest = loc;
      }
    }
    if (nearest) {
      setSelectedLocation(nearest);
      setDepartment(nearest.department);
      setProvince(nearest.province);
      setDistrict(nearest.district);
    }
  };

  const handleDepartmentChange = (dept: string) => {
    setDepartment(dept);
    setProvince("");
    setDistrict("");
    setSelectedLocation(null);
  };

  const handleProvinceChange = (prov: string) => {
    setProvince(prov);
    setDistrict("");
    setSelectedLocation(null);
  };

  const handleDistrictChange = (dist: string) => {
    setDistrict(dist);
    const loc = findLocation(department, province, dist);
    if (loc) {
      setSelectedLocation(loc);
      setMapCenter([loc.latitude, loc.longitude]);
      setMarkerPos([loc.latitude, loc.longitude]);
    }
  };

  
  const handleSliderChange = (value: number) => {
    // Slider 0-100 → hora 6-18
    const hour = 6 + (value / 100) * 12;
    const h = Math.floor(hour);
    const m = Math.round((hour - h) * 60);
    setTime(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
  };

  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
    // Hora → slider
    const [h, m] = newTime.split(":").map(Number);
    const hourDecimal = h + m / 60;
    const sliderValue = ((hourDecimal - 6) / 12) * 100;
    setSliderValue(Math.max(0, Math.min(100, sliderValue)));
  };

  const solarData = useMemo(() => {
    if (!selectedLocation || !date || !time) return null;
    const input: SolarInput = {
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      timezoneOffset: selectedLocation.timezoneOffset,
      datetime: `${date}T${time}:00`,
    };
    return computeSolarPositionClient(input);
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
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 sticky top-0 bg-slate-900 z-10">
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
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Map + Selects */}
          <div className="space-y-4">
            {/* Map */}
            <div className="h-[300px] w-full rounded-lg overflow-hidden border border-slate-700 relative">
              <MapContainer center={mapCenter} zoom={6} className="h-full w-full" scrollWheelZoom={true}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapClickHandler onMapClick={handleMapClick} />
                <MapRecenter position={markerPos ?? mapCenter} zoom={12} />
                {markerPos && <Marker position={markerPos} />}
              </MapContainer>
              <div className="absolute top-2 left-2 bg-slate-900/80 px-2 py-1 rounded text-xs text-slate-300 pointer-events-none">
                Click en el mapa para seleccionar ubicación
              </div>
            </div>

            {/* Cascading Selects */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Región</label>
                <select
                  value={department}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-sm text-white focus:ring-1 focus:ring-yellow-500"
                >
                  <option value="">Seleccionar...</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Provincia</label>
                <select
                  value={province}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  disabled={!department}
                  className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-sm text-white focus:ring-1 focus:ring-yellow-500 disabled:opacity-50"
                >
                  <option value="">Seleccionar...</option>
                  {provinces.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Distrito</label>
                <select
                  value={district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  disabled={!province}
                  className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-sm text-white focus:ring-1 focus:ring-yellow-500 disabled:opacity-50"
                >
                  <option value="">Seleccionar...</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {selectedLocation && (
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {selectedLocation.label}{selectedLocation.approx ? " (≈ capital provincial)" : ""} (Lat: {selectedLocation.latitude}°, Lon: {selectedLocation.longitude}°, Alt: {selectedLocation.altitudeM} msnm)
              </div>
            )}

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
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
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>
          </div>

          {/* Right: Solar Data */}
          <div className="bg-slate-950 rounded-lg border border-slate-800 p-6 flex flex-col">
            <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
              <Info className="w-4 h-4" /> Datos Solares Calculados
            </h3>
            {solarData ? (
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                  <p className="text-xs text-slate-500 mb-1">Elevación</p>
                  <p className="text-3xl font-bold text-white">{solarData.elevation}°</p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                  <p className="text-xs text-slate-500 mb-1">Azimut</p>
                  <p className="text-3xl font-bold text-white">{solarData.azimuth}°</p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                  <p className="text-xs text-slate-500 mb-1">Declinación</p>
                  <p className="text-2xl font-semibold text-slate-300">{solarData.declination}°</p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                  <p className="text-xs text-slate-500 mb-1">Estado</p>
                  <p className={`text-xl font-semibold ${status.color}`}>{status.text}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center">Selecciona una ubicación y fecha para calcular.</p>
            )}
            
            {/* Visor 3D Interactivo */}
            <div className="mt-6 pt-6 border-t border-slate-800">
              <h4 className="text-sm font-semibold text-slate-300 mb-3">Visualización 3D</h4>
              
              {/* Controles de rotación de la casa */}
              <div className="mb-3">
                <label className="text-xs text-slate-400 mb-1 block">
                  Rotación de fachada: {houseRotation}°
                </label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={houseRotation}
                  onChange={(e) => setHouseRotation(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Norte (0°)</span>
                  <span>Este (90°)</span>
                  <span>Sur (180°)</span>
                  <span>Oeste (270°)</span>
                </div>
              </div>

              {/* Canvas 3D */}
              <div className="h-[300px] w-full bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
                {solarData && (
                  <SolarHouse3D
                    elevation={solarData.elevation}
                    azimuth={solarData.azimuth}
                    houseRotation={houseRotation}
                  />
                )}
              </div>

              {/* Slider de hora sincronizado */}
              {solarData && solarData.elevation > 0 && (
                <div className="mt-4">
                  <label className="text-xs text-slate-400 mb-1 block">
                    Posición solar: {time}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderValue}
                    onChange={(e) => handleSliderChange(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>Amanecer (06:00)</span>
                    <span>Mediodía (12:00)</span>
                    <span>Atardecer (18:00)</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 flex justify-end gap-3 sticky bottom-0 bg-slate-900">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
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
