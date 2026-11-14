import React, { useEffect, useRef, useState } from "react";
import { MapPin, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  apiErrorMessage,
  siclClient,
  type MissingDataReport,
  type SpatialLocation,
} from "@/api/sicl-client";
import LocationMap from "@/components/LocationMap";

type Props = {
  projectId?: string;
  onConfirmed?: (
    location: SpatialLocation,
    missing?: MissingDataReport
  ) => void;
};

type CoordinateCandidate = {
  longitude: number;
  latitude: number;
};

function parseCandidate(
  longitudeText: string,
  latitudeText: string
): CoordinateCandidate | undefined {
  // No convertir campos vacíos en cero.
  if (!longitudeText.trim() || !latitudeText.trim()) return undefined;

  const longitude = Number(longitudeText);
  const latitude = Number(latitudeText);

  if (
    !Number.isFinite(longitude) ||
    !Number.isFinite(latitude) ||
    longitude < -180 ||
    longitude > 180 ||
    latitude < -90 ||
    latitude > 90
  ) {
    return undefined;
  }

  return { longitude, latitude };
}

function matchesCandidate(
  location: SpatialLocation,
  candidate: CoordinateCandidate,
  projectId: string
): boolean {
  const coordinates = location.geometry?.coordinates;

  return (
    location.project_id === projectId &&
    location.status === "CONFIRMED" &&
    coordinates?.length >= 2 &&
    Math.abs(coordinates[0] - candidate.longitude) < 1e-7 &&
    Math.abs(coordinates[1] - candidate.latitude) < 1e-7
  );
}

export default function LocationPicker({ projectId, onConfirmed }: Props) {
  const onConfirmedRef = useRef(onConfirmed);
  onConfirmedRef.current = onConfirmed;

  // Una operación nueva invalida las respuestas asíncronas anteriores.
  const operationRef = useRef(0);
  // Identifica la selección del usuario independientemente de la petición HTTP.
  const selectionRevisionRef = useRef(0);

  useEffect(() => {
    return () => {
      operationRef.current += 1;
    };
  }, []);

  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [label, setLabel] = useState("");
  const [candidate, setCandidate] = useState<CoordinateCandidate>();
  const [location, setLocation] = useState<SpatialLocation>();
  const [missing, setMissing] = useState<MissingDataReport>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Recuperar contexto canónico al abrir o cambiar de proyecto.
  useEffect(() => {
    let active = true;
    const requestId = ++operationRef.current;

    setLocation(undefined);
    setMissing(undefined);
    setError("");
    setMessage("");
    setCandidate(undefined);
    setLongitude("");
    setLatitude("");
    setBusy(false);

    if (!projectId) return () => { active = false; };

    const refresh = async () => {
      const [locationResult, reportResult] = await Promise.allSettled([
        siclClient.currentLocation(projectId),
        siclClient.missingData(projectId, "parcela_sitio"),
      ]);

      if (!active || operationRef.current !== requestId) return;

      const current =
        locationResult.status === "fulfilled"
          ? locationResult.value
          : null;

      const report =
        reportResult.status === "fulfilled"
          ? reportResult.value
          : undefined;

      if (current) {
        setLocation(current);

        const coordinates = current.geometry?.coordinates;
        const lng = current.longitude ?? coordinates?.[0];
        const lat = current.latitude ?? coordinates?.[1];

        if (lng != null && lat != null) {
          setLongitude(String(lng));
          setLatitude(String(lat));
        }

        // La ubicación proviene del endpoint canónico current.
        onConfirmedRef.current?.(current, report);
      }

      if (report) {
        setMissing(report);
      }

      if (locationResult.status === "rejected") {
        setError(
          `No se pudo recuperar la ubicación del Core: ${apiErrorMessage(locationResult.reason)}`
        );
      } else if (reportResult.status === "rejected") {
        setError(
          `Ubicación recuperada, pero no se pudo cargar missing-data: ${apiErrorMessage(reportResult.reason)}`
        );
      }
    };

    void refresh();

    return () => {
      active = false;
    };
  }, [projectId]);

  const updateCandidate = (
    nextLongitude: string,
    nextLatitude: string,
    showValidationError = false
  ) => {
    const parsed = parseCandidate(nextLongitude, nextLatitude);

    setCandidate(parsed);

    if (parsed) {
      setError("");
    } else if (showValidationError) {
      setError(
        "Coordenadas inválidas o incompletas. Longitud: -180 a 180; latitud: -90 a 90."
      );
    }
  };

  const handleLongitudeChange = (value: string) => {
    selectionRevisionRef.current += 1;
    setLongitude(value);
    updateCandidate(value, latitude);
    setMessage("");
  };

  const handleLatitudeChange = (value: string) => {
    selectionRevisionRef.current += 1;
    setLatitude(value);
    updateCandidate(longitude, value);
    setMessage("");
  };

  const handleMapClick = (lat: number, lng: number) => {
    selectionRevisionRef.current += 1;
    const nextLongitude = lng.toFixed(6);
    const nextLatitude = lat.toFixed(6);

    setLongitude(nextLongitude);
    setLatitude(nextLatitude);
    updateCandidate(nextLongitude, nextLatitude);
    setError("");
    setMessage("");
  };

  const confirm = async () => {
    if (!candidate || !projectId || busy) {
      if (!projectId) {
        setError("No hay un proyecto seleccionado. No se puede confirmar la ubicación.");
      }
      return;
    }

    const selected = { ...candidate };
    const requestProjectId = projectId;
    const selectionRevision = selectionRevisionRef.current;
    const operationId = ++operationRef.current;
    const isCurrentOperation = () =>
      operationRef.current === operationId;
    const isCurrentSelection = () =>
      selectionRevisionRef.current === selectionRevision;

    setBusy(true);
    setError("");
    setMessage("");

    try {
      // Fase 1: persistencia en Core.
      const posted = await siclClient.confirmLocation(requestProjectId, {
        longitude: selected.longitude,
        latitude: selected.latitude,
        place_label: label.trim() || undefined,
      });

      if (!isCurrentOperation()) return;

      // Fase 2: recuperación independiente para verificar persistencia.
      const verified = await siclClient.currentLocation(requestProjectId);

      if (!isCurrentOperation()) return;

      if (
        !verified ||
        verified.location_id !== posted.location_id ||
        !matchesCandidate(verified, selected, requestProjectId)
      ) {
        // Se conserva candidate para permitir reintento o inspección.
        setError(
          "El POST respondió, pero no se pudo verificar la ubicación persistida. La selección se conserva como candidata."
        );
        return;
      }

      // La ubicación sí quedó persistida y recuperada.
      // La selección pendiente solo se limpia si el usuario no la cambió.
      setLocation(verified);

      if (isCurrentSelection()) {
        setCandidate(undefined);

        const coordinates = verified.geometry.coordinates;
        setLongitude(String(coordinates[0]));
        setLatitude(String(coordinates[1]));
      } else {
        setMessage(
          "La ubicación anterior quedó persistida y verificada en SICL Core. Hay una nueva selección pendiente de confirmación."
        );
      }

      // Fase 3: el reporte es independiente de la persistencia.
      try {
        const refreshedMissing = await siclClient.missingData(
          requestProjectId,
          "parcela_sitio"
        );

        if (!isCurrentOperation()) return;

        setMissing(refreshedMissing);
        setMessage("Ubicación persistida y verificada en SICL Core.");
        setError("");

        onConfirmedRef.current?.(verified, refreshedMissing);
      } catch (reportError) {
        if (!isCurrentOperation()) return;

        // Se conserva el último reporte disponible. La consulta fallida
        // no demuestra que el reporte anterior haya dejado de ser válido.
        setMessage("Ubicación persistida y verificada en SICL Core.");
        setError(
          `La ubicación está confirmada, pero no se pudo actualizar el reporte de datos: ${apiErrorMessage(reportError)}`
        );

        // No enviar undefined para que el componente padre no borre
        // el último reporte que sí pudo recuperar.
        onConfirmedRef.current?.(verified);
      }
    } catch (err) {
      if (!isCurrentOperation()) return;

      setError(
        `No se pudo completar la confirmación o su verificación: ${apiErrorMessage(err)}. La selección no se declara confirmada.`
      );
    } finally {
      if (isCurrentOperation()) {
        setBusy(false);
      }
    }
  };

  const parsedInputs = parseCandidate(longitude, latitude);
  const storedCoordinates = location?.geometry?.coordinates;
  const storedLng = storedCoordinates?.[0];
  const storedLat = storedCoordinates?.[1];

  const mapLat =
    candidate?.latitude ??
    parsedInputs?.latitude ??
    (typeof storedLat === "number" && Number.isFinite(storedLat)
      ? storedLat
      : Number.NaN);

  const mapLng =
    candidate?.longitude ??
    parsedInputs?.longitude ??
    (typeof storedLng === "number" && Number.isFinite(storedLng)
      ? storedLng
      : Number.NaN);

  return (
    <Card className="border-[#28445b] bg-[#0b2031]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <MapPin className="size-4 text-[#d4ff3a]" />
          Ubicación del proyecto
        </CardTitle>
        <p className="text-xs text-[#9eb5c4]">
          Selecciona un punto en el mapa o ingresa las coordenadas manualmente.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <LocationMap
          lat={mapLat}
          lng={mapLng}
          onChange={handleMapClick}
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-[#8fa8bc]">Longitud</Label>
            <Input
              value={longitude}
              onChange={(event) => handleLongitudeChange(event.target.value)}
              onBlur={() => updateCandidate(longitude, latitude, true)}
              placeholder="-77.0428"
              className="border-[#28445b] bg-[#071726] text-sm"
            />
          </div>

          <div>
            <Label className="text-xs text-[#8fa8bc]">Latitud</Label>
            <Input
              value={latitude}
              onChange={(event) => handleLatitudeChange(event.target.value)}
              onBlur={() => updateCandidate(longitude, latitude, true)}
              placeholder="-12.0464"
              className="border-[#28445b] bg-[#071726] text-sm"
            />
          </div>
        </div>

        <div>
          <Label className="text-xs text-[#8fa8bc]">Etiqueta</Label>
          <Input
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="Ej. Trujillo, parcela piloto"
            className="border-[#28445b] bg-[#071726] text-sm"
          />
        </div>

        {error && (
          <div
            role="alert"
            className="rounded border border-[#f0a35b] bg-[#2b2118] p-2 text-xs text-[#f6d3aa]"
          >
            {error}
          </div>
        )}

        {message && (
          <div
            role="status"
            className="rounded border border-[#70e1a2] bg-[#0f2a1e] p-2 text-xs text-[#a8f0c2]"
          >
            {message}
          </div>
        )}

        <Button
          onClick={confirm}
          disabled={!candidate || busy || !projectId}
          className="w-full bg-[#d4ff3a] text-[#061522] hover:bg-[#e5ff70]"
        >
          {busy ? "Confirmando y verificando…" : "Confirmar ubicación"}
        </Button>

        {location && (
          <div className="flex items-center gap-2 text-xs text-[#70e1a2]">
            <CheckCircle2 className="size-3" />
            Sitio confirmado:{" "}
            {location.place_label ||
              `${location.geometry.coordinates[1]}, ${location.geometry.coordinates[0]}`}
          </div>
        )}

        {missing && (
          <div className="flex items-start gap-2 text-xs text-[#f0a35b]">
            <AlertTriangle className="mt-0.5 size-3 shrink-0" />
            <div>
              <strong>Reporte de datos del sitio:</strong>
              <ul className="mt-1 space-y-1">
                {missing.variables.map((item) => (
                  <li key={item.canonical_variable_id}>
                    {item.canonical_variable_id}: {item.state}
                  </li>
                ))}

                {missing.capabilities.map((item) => (
                  <li key={item.capability_id}>
                    {item.capability_id}: {item.state}
                    {item.missing_requirements?.length
                      ? ` — Requisitos: ${item.missing_requirements.join(", ")}`
                      : ""}
                  </li>
                ))}
              </ul>

              {missing.variables.length === 0 &&
                missing.capabilities.length === 0 && (
                  <p>El Core no reportó variables ni capacidades detalladas.</p>
                )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
