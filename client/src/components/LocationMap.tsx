import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Corregir el ícono por defecto de Leaflet que no carga en Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

type LocationMapProps = {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
};

function LocationMarker({ lat, lng, onChange }: LocationMapProps) {
  const map = useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return lat && lng ? <Marker position={[lat, lng]} /> : null;
}

export default function LocationMap({ lat, lng, onChange }: LocationMapProps) {
  // Si no hay lat/lng válidas, usar un default (Lima, Perú)
  const validLat = Number.isFinite(lat) && lat !== 0 ? lat : -12.0464;
  const validLng = Number.isFinite(lng) && lng !== 0 ? lng : -77.0428;

  return (
    <div className="h-[400px] w-full overflow-hidden rounded-md border border-[#28445b]">
      <MapContainer
        center={[validLat, validLng]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker lat={validLat} lng={validLng} onChange={onChange} />
      </MapContainer>
    </div>
  );
}
