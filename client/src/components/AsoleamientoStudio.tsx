import { useState, useEffect, useMemo } from "react";
import { X, Sun, MapPin, Calendar, Clock, Info } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getAllUbigeoLocations, type UbigeoLocation } from "../../../shared/arkiUbigeoMap";
import { UBIGEO_HIERARCHY, getProvinces, getDistricts, findLocation } from "../../../shared/arkiUbigeoHierarchy";
import { computeSolarPositionClient, type SolarInput } from "../../../shared/arkiSolarUtils";
import SolarHouse3D, { type SunPathSample } from "./SolarHouse3D";
import { generateRneReportHtml, type BuildingTypology } from "../../../server/gia/heliodon/arkiSolarReport";

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

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapRecenter({ position, zoom }: { position: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, zoom, { animate: true });
    }
  }, [position, zoom, map]);
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
  const [mapCenter, setMapCenter] = useState<[number, number]>([-12.0464, -77.0428]);
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);
  const [houseRotation, setHouseRotation] = useState<number>(180);

  const departments = useMemo(() => Object.keys(UBIGEO_HIERARCHY).sort(), []);
  const provinces = useMemo(() => (department ? getProvinces(department) : []), [department]);
  const districts = useMemo(() => (department && province ? getDistricts(department, province) : []), [department, province]);

  useEffect(() => {
    const defaultLoc = getAllUbigeoLocations().find((l) => l.label === "Lima, Lima, Lima")
      || getAllUbigeoLocations().find((l) => l.province === "Lima" && l.department === "Lima")
      || getAllUbigeoLocations()[0];
    if (defaultLoc) {
      setSelectedLocation(defaultLoc);
      setDepartment(defaultLoc.department);
      setProvince(defaultLoc.province);
      setDistrict(defaultLoc.district);
      setMapCenter([defaultLoc.latitude, defaultLoc.longitude]);
      setMarkerPos([defaultLoc.latitude, defaultLoc.longitude]);
    }
  }, []);

  const handleMapClick = (lat: number, lng: number) => {
    setMarkerPos([lat, lng]);
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

  // FUENTE UNICA DE VERDAD: el slider se DERIVA de la hora.
  // Nunca puede desincronizarse del input de hora (elimina el bug).
  const sliderValue = useMemo(() => {
    const [h, m] = time.split(":").map(Number);
    const hourDecimal = h + m / 60;
    return Math.max(0, Math.min(100, ((hourDecimal - 6) / 12) * 100));
  }, [time]);

  const handleSliderChange = (value: number) => {
    const hour = 6 + (value / 100) * 12;
    const h = Math.floor(hour);
    const m = Math.round((hour - h) * 60);
    setTime(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
  };

  const sunPath: SunPathSample[] = useMemo(() => {
    if (!selectedLocation || !date) return [];
    const samples: SunPathSample[] = [];
    for (let m = 5 * 60; m <= 19 * 60; m += 15) {
      const h = Math.floor(m / 60);
      const mm = m % 60;
      const pos = computeSolarPositionClient({
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        timezoneOffset: selectedLocation.timezoneOffset,
        datetime: `${date}T${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}:00`,
      });
      if (pos.elevation < -2) continue;
      samples.push({ elevation: pos.elevation, azimuth: pos.azimuth, hour: h + mm / 60 });
    }
    return samples;
  }, [selectedLocation, date]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-700 sticky top-0 bg-slate-900 z-10">
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

        <div className="p-4 grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-4">
          <div className="space-y-3">
            <div className="h-[200px] w-full rounded-lg overflow-hidden border border-slate-700 relative">
              <MapContainer center={mapCenter} zoom={14} className="h-full w-full" scrollWheelZoom={true}>
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapClickHandler onMapClick={handleMapClick} />
                <MapRecenter position={markerPos ?? mapCenter} zoom={14} />
                {markerPos && <Marker position={markerPos} />}
              </MapContainer>
              <div className="absolute top-2 left-2 bg-slate-900/80 px-2 py-1 rounded text-xs text-slate-300 pointer-events-none">
                Click en el mapa
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Región</label>
                <select value={department} onChange={(e) => handleDepartmentChange(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-xs text-white">
                  <option value="">...</option>
                  {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Provincia</label>
                <select value={province} onChange={(e) => handleProvinceChange(e.target.value)} disabled={!department}
                  className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-xs text-white disabled:opacity-50">
                  <option value="">...</option>
                  {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Distrito</label>
                <select value={district} onChange={(e) => handleDistrictChange(e.target.value)} disabled={!province}
                  className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-xs text-white disabled:opacity-50">
                  <option value="">...</option>
                  {districts.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            {selectedLocation && (
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {selectedLocation.label} ({selectedLocation.latitude}°, {selectedLocation.longitude}°, {selectedLocation.altitudeM} msnm)
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="flex items-center gap-1 text-xs font-medium text-slate-300 mb-1">
                  <Calendar className="w-3 h-3" /> Fecha
                </label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-xs text-white" />
              </div>
              <div>
                <label className="flex items-center gap-1 text-xs font-medium text-slate-300 mb-1">
                  <Clock className="w-3 h-3" /> Hora
                </label>
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-xs text-white" />
              </div>
            </div>

            <div className="bg-slate-950 rounded-lg border border-slate-800 p-3">
              <h3 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1">
                <Info className="w-3 h-3" /> Datos Solares
              </h3>
              {solarData ? (
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                    <p className="text-[10px] text-slate-500">Elevación</p>
                    <p className="text-lg font-bold text-white">{solarData.elevation}°</p>
                  </div>
                  <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                    <p className="text-[10px] text-slate-500">Azimut</p>
                    <p className="text-lg font-bold text-white">{solarData.azimuth}°</p>
                  </div>
                  <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                    <p className="text-[10px] text-slate-500">Declinación</p>
                    <p className="text-sm font-semibold text-slate-300">{solarData.declination}°</p>
                  </div>
                  <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                    <p className="text-[10px] text-slate-500">Estado</p>
                    <p className={`text-sm font-semibold ${status.color}`}>{status.text}</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 text-center">Selecciona ubicación y fecha</p>
              )}
            </div>

            <div className="bg-slate-950 rounded-lg border border-slate-800 p-3">
              <label className="text-xs text-slate-400 mb-1 block">Rotación de fachada: {houseRotation}°</label>
              <input type="range" min="0" max="360" value={houseRotation}
                onChange={(e) => setHouseRotation(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>N (0°)</span><span>E (90°)</span><span>S (180°)</span><span>O (270°)</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 rounded-lg border border-slate-800 flex flex-col min-h-[600px]">
            <div className="flex-1 relative">
              {solarData && (
                <SolarHouse3D elevation={solarData.elevation} azimuth={solarData.azimuth} houseRotation={houseRotation} sunPath={sunPath} />
              )}
            </div>
            <div className="p-3 border-t border-slate-800">
              <label className="text-xs text-slate-400 mb-1 block">Posición solar: {time}</label>
              <input type="range" min="0" max="100" value={sliderValue}
                onChange={(e) => handleSliderChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Amanecer (06:00)</span><span>Mediodía (12:00)</span><span>Atardecer (18:00)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-700 flex justify-end gap-3 sticky bottom-0 bg-slate-900">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white">Cerrar</button>
          <button className="px-4 py-2 text-sm font-medium bg-yellow-500 hover:bg-yellow-600 text-slate-900 rounded-lg flex items-center gap-2"
            onClick={() => {
              if (!solarData || !selectedLocation) {
                alert("Selecciona una ubicación y fecha para generar el reporte.");
                return;
              }
              const html = generateRneReportHtml({
                location: selectedLocation,
                date,
                time,
                houseRotation,
                solarPosition: solarData,
                sunPath,
                typologies: ["vivienda", "hospital", "escuela", "oficina"],
                projectName: "Proyecto ARKI",
              });
              const blob = new Blob([html], { type: "text/html" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `Reporte-RNE-A040-${selectedLocation.district}-${date}.html`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}>
            <Sun className="w-4 h-4" /> Generar Reporte RNE
          </button>
        </div>
      </div>
    </div>
  );
}
