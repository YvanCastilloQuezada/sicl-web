// @vitest-environment jsdom

import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, cleanup } from "@testing-library/react";
import LocationPicker from "@/components/LocationPicker";
import {
  siclClient,
  type MissingDataReport,
  type SpatialLocation,
} from "@/api/sicl-client";

vi.mock("@/api/sicl-client", () => ({
  apiErrorMessage: (error: unknown) =>
    error instanceof Error ? error.message : String(error),
  siclClient: {
    currentLocation: vi.fn(),
    missingData: vi.fn(),
    confirmLocation: vi.fn(),
  },
}));

vi.mock("@/components/LocationMap", () => ({
  default: ({
    onChange,
  }: {
    lat: number;
    lng: number;
    onChange: (lat: number, lng: number) => void;
  }) => (
    <button
      type="button"
      onClick={() => onChange(-8.11, -79.02)}
    >
      Mock map: select B
    </button>
  ),
}));

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

function location(
  id: string,
  projectId: string,
  longitude: number,
  latitude: number
): SpatialLocation {
  return {
    location_id: id,
    project_id: projectId,
    status: "CONFIRMED",
    longitude,
    latitude,
    place_label: id,
    geometry: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
  } as SpatialLocation;
}

const initialReport = {
  location_present: false,
  variables: [],
  capabilities: [],
} as MissingDataReport;

const reportWithOldData = {
  location_present: false,
  variables: [
    {
      canonical_variable_id: "OLD_REPORT",
      state: "MISSING",
    },
  ],
  capabilities: [],
} as MissingDataReport;

const client = vi.mocked(siclClient);

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
});

describe("LocationPicker concurrency and report integrity", () => {
  it("preserves selection B when confirmation A resolves later", async () => {
    const post = deferred<SpatialLocation>();
    const verification = deferred<SpatialLocation>();
    const refreshedReport = deferred<MissingDataReport>();
    const onConfirmed = vi.fn();

    client.currentLocation
      .mockResolvedValueOnce(null)
      .mockReturnValueOnce(verification.promise);

    client.missingData
      .mockResolvedValueOnce(initialReport)
      .mockReturnValueOnce(refreshedReport.promise);

    client.confirmLocation.mockReturnValueOnce(post.promise);

    render(
      <LocationPicker
        projectId="project-1"
        onConfirmed={onConfirmed}
      />
    );

    await waitFor(() => {
      expect(client.currentLocation).toHaveBeenCalledTimes(1);
      expect(client.missingData).toHaveBeenCalledTimes(1);
    });

    fireEvent.change(screen.getByPlaceholderText("-77.0428"), {
      target: { value: "-77.04" },
    });

    fireEvent.change(screen.getByPlaceholderText("-12.0464"), {
      target: { value: "-12.04" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Confirmar ubicación" })
    );

    await waitFor(() => {
      expect(client.confirmLocation).toHaveBeenCalledTimes(1);
    });

    // El usuario cambia la selección mientras A sigue pendiente.
    fireEvent.click(
      screen.getByRole("button", { name: "Mock map: select B" })
    );

    expect(
      (screen.getByPlaceholderText("-77.0428") as HTMLInputElement).value
    ).toBe("-79.020000");

    expect(
      (screen.getByPlaceholderText("-12.0464") as HTMLInputElement).value
    ).toBe("-8.110000");

    const persistedA = location("loc-A", "project-1", -77.04, -12.04);

    post.resolve(persistedA);

    await waitFor(() => {
      expect(client.currentLocation).toHaveBeenCalledTimes(2);
    });

    verification.resolve(persistedA);

    await waitFor(() => {
      expect(client.missingData).toHaveBeenCalledTimes(2);
    });

    refreshedReport.resolve(initialReport);

    await screen.findByText(
      /nueva selección pendiente de confirmación/
    );

    // A está confirmada en Core, pero B sigue siendo la selección del usuario.
    expect(
      (screen.getByPlaceholderText("-77.0428") as HTMLInputElement).value
    ).toBe("-79.020000");

    expect(
      (screen.getByPlaceholderText("-12.0464") as HTMLInputElement).value
    ).toBe("-8.110000");

    expect(onConfirmed).toHaveBeenCalledTimes(1);
    expect(onConfirmed.mock.calls[0][0]).toMatchObject({
      location_id: "loc-A",
      project_id: "project-1",
    });
  });

  it("preserves the previous missing-data report when refresh fails", async () => {
    const persistedA = location("loc-A", "project-1", -77.04, -12.04);
    const refreshedReport = deferred<MissingDataReport>();
    const onConfirmed = vi.fn();

    client.currentLocation
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(persistedA);

    client.missingData
      .mockResolvedValueOnce(reportWithOldData)
      .mockReturnValueOnce(refreshedReport.promise);

    client.confirmLocation.mockResolvedValueOnce(persistedA);

    render(
      <LocationPicker
        projectId="project-1"
        onConfirmed={onConfirmed}
      />
    );

    await screen.findByText(/OLD_REPORT/);

    fireEvent.change(screen.getByPlaceholderText("-77.0428"), {
      target: { value: "-77.04" },
    });

    fireEvent.change(screen.getByPlaceholderText("-12.0464"), {
      target: { value: "-12.04" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Confirmar ubicación" })
    );

    await waitFor(() => {
      expect(client.missingData).toHaveBeenCalledTimes(2);
    });

    refreshedReport.reject(new Error("Core missing-data unavailable"));

    await screen.findByText(/no se pudo actualizar el reporte de datos/i);

    expect(screen.getByText(/OLD_REPORT/)).toBeTruthy();
    expect(onConfirmed).toHaveBeenCalledTimes(1);
    expect(onConfirmed.mock.calls[0]).toHaveLength(1);
  });

  it("does not accept a previous project's pending confirmation", async () => {
    const post = deferred<SpatialLocation>();
    const onConfirmed = vi.fn();

    client.currentLocation
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    client.missingData
      .mockResolvedValueOnce(initialReport)
      .mockResolvedValueOnce(initialReport);

    client.confirmLocation.mockReturnValueOnce(post.promise);

    const view = render(
      <LocationPicker projectId="project-1" onConfirmed={onConfirmed} />
    );

    await waitFor(() => {
      expect(client.currentLocation).toHaveBeenCalledTimes(1);
    });

    fireEvent.change(screen.getByPlaceholderText("-77.0428"), {
      target: { value: "-77.04" },
    });

    fireEvent.change(screen.getByPlaceholderText("-12.0464"), {
      target: { value: "-12.04" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Confirmar ubicación" })
    );

    await waitFor(() => {
      expect(client.confirmLocation).toHaveBeenCalledTimes(1);
    });

    view.rerender(
      <LocationPicker projectId="project-2" onConfirmed={onConfirmed} />
    );

    await waitFor(() => {
      expect(client.currentLocation).toHaveBeenCalledTimes(2);
    });

    post.resolve(location("loc-old", "project-1", -77.04, -12.04));

    await waitFor(() => {
      expect(client.confirmLocation).toHaveBeenCalledTimes(1);
    });

    expect(client.currentLocation).toHaveBeenCalledTimes(2);
    expect(onConfirmed).not.toHaveBeenCalled();

    expect(
      (screen.getByPlaceholderText("-77.0428") as HTMLInputElement).value
    ).toBe("");
  });

  it("does not update the component after unmount during confirmation", async () => {
    const post = deferred<SpatialLocation>();
    const onConfirmed = vi.fn();

    client.currentLocation.mockResolvedValueOnce(null);
    client.missingData.mockResolvedValueOnce(initialReport);
    client.confirmLocation.mockReturnValueOnce(post.promise);

    const view = render(
      <LocationPicker projectId="project-1" onConfirmed={onConfirmed} />
    );

    await waitFor(() => {
      expect(client.currentLocation).toHaveBeenCalledTimes(1);
    });

    fireEvent.change(screen.getByPlaceholderText("-77.0428"), {
      target: { value: "-77.04" },
    });

    fireEvent.change(screen.getByPlaceholderText("-12.0464"), {
      target: { value: "-12.04" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Confirmar ubicación" })
    );

    await waitFor(() => {
      expect(client.confirmLocation).toHaveBeenCalledTimes(1);
    });

    view.unmount();

    post.resolve(location("loc-unmounted", "project-1", -77.04, -12.04));

    await waitFor(() => {
      expect(client.confirmLocation).toHaveBeenCalledTimes(1);
    });

    expect(client.currentLocation).toHaveBeenCalledTimes(1);
    expect(onConfirmed).not.toHaveBeenCalled();
  });

});
