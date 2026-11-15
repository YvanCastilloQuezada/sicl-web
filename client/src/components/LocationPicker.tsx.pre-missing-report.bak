import { useEffect, useState } from "react";
import { MapPin, CheckCircle2, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiErrorMessage, siclClient, type MissingDataReport, type SpatialLocation } from "@/api/sicl-client";
import LocationMap from "@/components/LocationMap";

type Props = { projectId?: string; onConfirmed?: (location: SpatialLocation, missing?: MissingDataReport) => void };

export default function LocationPicker({ projectId, onConfirmed }: Props) {
  const { t } = useTranslation();
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [label, setLabel] = useState("");
  const [candidate, setCandidate] = useState<{ longitude: number; latitude: number }>();
  const [location, setLocation] = useState<SpatialLocation>();
  const [missing, setMissing] = useState<MissingDataReport>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Cargar la ubicación actual del proyecto
  const refresh = async () => {
    if (!projectId) return;
    try {
      const [current, report] = await Promise.all([
        siclClient.currentLocation(projectId),
        siclClient.missingData(projectId, "parcela_sitio"),
      ]);
      setLocation(current ?? undefined);
      setMissing(report);
      if (current) onConfirmed?.(current, report);
      if (current?.longitude != null && current?.latitude != null) {
        setLongitude(String(current.longitude));
        setLatitude(String(current.latitude));
      }
    } catch (err) {
      // Silenciar el 401 en modo demo
      console.warn("Core no disponible para cargar ubicación:", apiErrorMessage(err));
    }
  };
  useEffect(() => { void refresh(); }, [projectId]);

  // Callback cuando el usuario hace clic en el mapa
  const handleMapClick = (lat: number, lng: number) => {
    setLongitude(lng.toFixed(6));
    setLatitude(lat.toFixed(6));
    setCandidate({ longitude: lng, latitude: lat });
    setError("");
    setMessage("");
  };

  // Confirmar la ubicación seleccionada
  const confirm = async () => {
    if (!candidate) return;
    setBusy(true);
    setError("");
    
    const localLocation = {
      longitude: candidate.longitude,
      latitude: candidate.latitude,
      place_label: label || `${candidate.latitude.toFixed(6)}, ${candidate.longitude.toFixed(6)}`,
      provenance: "LOCAL_DEMO",
      status: "CONFIRMED",
    } as any;

    try {
      if (projectId) {
        try {
          const next = await siclClient.confirmLocation(projectId, localLocation);
          setLocation(next);
          onConfirmed?.(next, missing);
          setMessage("Ubicación confirmada en el Core.");
        } catch (coreErr) {
          // Si el Core falla (401, 500, etc.), usar modo local
          console.warn("Core no disponible, usando modo local:", coreErr);
          setLocation(localLocation);
          onConfirmed?.(localLocation, missing);
          setMessage("Ubicación confirmada en modo local (Core desconectado).");
        }
      } else {
        setLocation(localLocation);
        onConfirmed?.(localLocation, missing);
        setMessage("Ubicación confirmada en modo local.");
      }
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  // Calcular lat/lng para el mapa
  const mapLat = candidate?.latitude ?? (Number(latitude) || -12.0464);
  const mapLng = candidate?.longitude ?? (Number(longitude) || -77.0428);

  return (
    <Card className="border-[#28445b] bg-[#0b2031]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <MapPin className="size-4 text-[#d4ff3a]" /> Ubicación del proyecto
        </CardTitle>
        <p className="text-xs text-[#9eb5c4]">Haz clic en el mapa para seleccionar la ubicación exacta.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* MAPA INTERACTIVO (Leaflet) */}
        <LocationMap lat={mapLat} lng={mapLng} onChange={handleMapClick} />

        {/* INPUTS DE LAT/LNG */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-[#8fa8bc]">Longitud</Label>
            <Input
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="-77.0428"
              className="border-[#28445b] bg-[#071726] text-sm"
            />
          </div>
          <div>
            <Label className="text-xs text-[#8fa8bc]">Latitud</Label>
            <Input
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="-12.0464"
              className="border-[#28445b] bg-[#071726] text-sm"
            />
          </div>
        </div>

        {/* ETIQUETA */}
        <div>
          <Label className="text-xs text-[#8fa8bc]">Etiqueta</Label>
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Ej. Trujillo, parcela piloto"
            className="border-[#28445b] bg-[#071726] text-sm"
          />
        </div>

        {/* MENSAJES */}
        {error && <div className="rounded border border-[#f0a35b] bg-[#2b2118] p-2 text-xs text-[#f6d3aa]">{error}</div>}
        {message && <div className="rounded border border-[#70e1a2] bg-[#0f2a1e] p-2 text-xs text-[#a8f0c2]">{message}</div>}

        {/* BOTÓN CONFIRMAR */}
        <Button
          onClick={confirm}
          disabled={!candidate || busy}
          className="w-full bg-[#d4ff3a] text-[#061522] hover:bg-[#e5ff70]"
        >
          {busy ? "Confirmando…" : "Confirmar ubicación"}
        </Button>

        {/* ESTADO */}
        {location && (
          <div className="flex items-center gap-2 text-xs text-[#70e1a2]">
            <CheckCircle2 className="size-3" /> Sitio confirmado: {location.place_label || `${location.latitude}, ${location.longitude}`}
          </div>
        )}
        {missing && (
          <div className="flex items-center gap-2 text-xs text-[#f0a35b]">
            <AlertTriangle className="size-3" /> Datos faltantes: {missing.fields?.join(", ") || "UNKNOWN"}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
