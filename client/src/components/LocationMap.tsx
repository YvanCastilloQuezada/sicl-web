import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
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

  return Number.isFinite(lat) && Number.isFinite(lng)
    ? <Marker position={[lat, lng]} />
    : null;
}

function MapCenterSync({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  const hasCenteredRef = useRef(false);

  useEffect(() => {
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    const zoom = hasCenteredRef.current ? map.getZoom() : 13;

    map.setView([lat, lng], zoom, { animate: false });
    hasCenteredRef.current = true;
  }, [lat, lng, map]);

  return null;
}

export default function LocationMap({ lat, lng, onChange }: LocationMapProps) {
  const hasCoordinates = Number.isFinite(lat) && Number.isFinite(lng);
  const center: [number, number] = hasCoordinates ? [lat, lng] : [0, 0];

  return (
    <div className="h-[400px] w-full overflow-hidden rounded-md border border-[#28445b]">
      <MapContainer
        center={center}
        zoom={hasCoordinates ? 13 : 2}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapCenterSync lat={lat} lng={lng} />
        <LocationMarker lat={lat} lng={lng} onChange={onChange} />
      </MapContainer>
    </div>
  );
}
