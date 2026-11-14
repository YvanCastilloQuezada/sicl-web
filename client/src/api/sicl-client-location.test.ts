/** @vitest-environment jsdom */
import { afterEach, describe, expect, it, vi } from "vitest";
import { siclClient } from "./sicl-client";

function jsonResponse(data: unknown): Response {
  return new Response(
    JSON.stringify({
      status: "OK",
      code: "OK",
      message: "ok",
      data,
    }),
    {
      status: 200,
      headers: { "content-type": "application/json" },
    }
  );
}

function makeLocation(projectId: string, locationId: string) {
  return {
    location_id: locationId,
    project_id: projectId,
    spatial_scope: "parcela_sitio",
    geometry_type: "Point",
    geometry: {
      type: "Point",
      coordinates: [-74.5, -8.4],
    },
    crs: "EPSG:4326",
    longitude: -74.5,
    latitude: -8.4,
    status: "CONFIRMED",
    acquisition_method: "MAP_SELECTION",
    provenance: "USER_DECLARED",
  };
}

function makeReport(locationPresent: boolean) {
  return {
    location_present: locationPresent,
    variables: [],
    capabilities: [],
  };
}

describe("siclClient location cache integrity", () => {
  afterEach(() => {
    window.localStorage.removeItem("sims-dei.mock-core");
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("invalidates current location and missing data after confirmation", async () => {
    const projectId = "LOCATION-CACHE-INVALIDATION-001";
    const confirmedLocation = makeLocation(projectId, "LOC-CONFIRMED-001");

    let currentCalls = 0;
    let missingCalls = 0;

    const fetchMock = vi.fn(
      async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
        const url = String(input);

        if (init?.method === "POST" && url.endsWith("/locations")) {
          return jsonResponse({ location: confirmedLocation });
        }

        if (url.endsWith("/locations/current")) {
          currentCalls += 1;

          return jsonResponse({
            location: currentCalls === 1 ? null : confirmedLocation,
          });
        }

        if (url.includes("/missing-data?")) {
          missingCalls += 1;
          return jsonResponse(makeReport(missingCalls > 1));
        }

        throw new Error(`Unexpected request: ${init?.method ?? "GET"} ${url}`);
      }
    );

    vi.stubGlobal("fetch", fetchMock);

    await expect(siclClient.currentLocation(projectId)).resolves.toBeNull();
    await expect(siclClient.missingData(projectId)).resolves.toMatchObject({
      location_present: false,
    });

    await expect(
      siclClient.confirmLocation(projectId, {
        longitude: -74.5,
        latitude: -8.4,
        place_label: "Sitio de prueba",
      })
    ).resolves.toMatchObject({
      location_id: "LOC-CONFIRMED-001",
    });

    await expect(siclClient.currentLocation(projectId)).resolves.toMatchObject({
      location_id: "LOC-CONFIRMED-001",
    });

    await expect(siclClient.missingData(projectId)).resolves.toMatchObject({
      location_present: true,
    });

    expect(currentCalls).toBe(2);
    expect(missingCalls).toBe(2);
  });

  it("does not let an old in-flight request delete or overwrite a newer request", async () => {
    const projectId = "LOCATION-CACHE-RACE-001";
    const oldLocation = makeLocation(projectId, "LOC-OLD");
    const newLocation = makeLocation(projectId, "LOC-NEW");

    let currentCalls = 0;
    let resolveOld!: (response: Response) => void;
    let resolveNew!: (response: Response) => void;

    const fetchMock = vi.fn(
      async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
        const url = String(input);

        if (init?.method === "POST" && url.endsWith("/locations")) {
          return jsonResponse({ location: newLocation });
        }

        if (url.endsWith("/locations/current")) {
          currentCalls += 1;

          if (currentCalls === 1) {
            return new Promise<Response>((resolve) => {
              resolveOld = resolve;
            });
          }

          if (currentCalls === 2) {
            return new Promise<Response>((resolve) => {
              resolveNew = resolve;
            });
          }
        }

        throw new Error(`Unexpected request: ${init?.method ?? "GET"} ${url}`);
      }
    );

    vi.stubGlobal("fetch", fetchMock);

    // Primera lectura: queda pendiente.
    const oldRequest = siclClient.currentLocation(projectId);

    // La confirmación invalida la lectura anterior.
    await siclClient.confirmLocation(projectId, {
      longitude: -74.5,
      latitude: -8.4,
    });

    // Segunda lectura: debe crear una petición nueva.
    const newRequest = siclClient.currentLocation(projectId);

    expect(currentCalls).toBe(2);

    // La respuesta antigua termina mientras la nueva sigue pendiente.
    resolveOld(jsonResponse({ location: oldLocation }));

    await expect(oldRequest).resolves.toMatchObject({
      location_id: "LOC-OLD",
    });

    // Debe reutilizar la petición nueva, no crear una tercera.
    const joinedRequest = siclClient.currentLocation(projectId);

    expect(currentCalls).toBe(2);

    // Ahora termina la petición nueva.
    resolveNew(jsonResponse({ location: newLocation }));

    await expect(Promise.all([newRequest, joinedRequest])).resolves.toEqual([
      newLocation,
      newLocation,
    ]);

    // La caché debe conservar exclusivamente la ubicación nueva.
    await expect(siclClient.currentLocation(projectId)).resolves.toMatchObject({
      location_id: "LOC-NEW",
    });

    expect(currentCalls).toBe(2);
  });

  it("keeps project B cache intact when project A location is confirmed", async () => {
    const projectA = "LOCATION-ISOLATION-A";
    const projectB = "LOCATION-ISOLATION-B";

    const locationAOld = makeLocation(projectA, "A-OLD");
    const locationANew = makeLocation(projectA, "A-NEW");
    const locationB = makeLocation(projectB, "B-ORIGINAL");

    let callsA = 0;
    let callsB = 0;

    const fetchMock = vi.fn(
      async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
        const url = String(input);

        if (init?.method === "POST" && url.endsWith("/locations")) {
          return jsonResponse({ location: locationANew });
        }

        if (url.endsWith("/locations/current") && url.includes(projectA)) {
          callsA += 1;

          return jsonResponse({
            location: callsA === 1 ? locationAOld : locationANew,
          });
        }

        if (url.endsWith("/locations/current") && url.includes(projectB)) {
          callsB += 1;
          return jsonResponse({ location: locationB });
        }

        throw new Error(`Unexpected request: ${init?.method ?? "GET"} ${url}`);
      }
    );

    vi.stubGlobal("fetch", fetchMock);

    await expect(siclClient.currentLocation(projectA)).resolves.toMatchObject({
      location_id: "A-OLD",
    });

    await expect(siclClient.currentLocation(projectB)).resolves.toMatchObject({
      location_id: "B-ORIGINAL",
    });

    await siclClient.confirmLocation(projectA, {
      longitude: -74.5,
      latitude: -8.4,
    });

    await expect(siclClient.currentLocation(projectA)).resolves.toMatchObject({
      location_id: "A-NEW",
    });

    // B debe seguir utilizando su caché original.
    await expect(siclClient.currentLocation(projectB)).resolves.toMatchObject({
      location_id: "B-ORIGINAL",
    });

    expect(callsA).toBe(2);
    expect(callsB).toBe(1);
  });
});
