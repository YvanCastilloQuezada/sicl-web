// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string, fallback?: string) => fallback ?? key }) }));

import SolarTemporalOverlay, { type EnvironmentalScenarioViewState, type SolarAnalysis } from "./SolarTemporalOverlay";

const analysis: SolarAnalysis = {
  example_id: "UPAO-001", analysis_type: "SOLAR", temporal_mode: "INSTANT", selected_date: "2026-09-17", selected_time: "12:00",
  location: { name: "Trujillo, Peru", latitude: -8.11, longitude: -79.03, timezone: "America/Lima", role: "educational_proxy", location_class: "PROXY", provenance: "Open-Meteo", surveyed_site: false, cadastral_location: false, verified_upao_site: false },
  analyses: ["UPAO-001-A", "UPAO-001-B", "UPAO-001-C"].map((alternative_id) => ({ alternative_id, local_timestamp: "2026-09-17T12:00:00-05:00", derived_metrics: { solar_azimuth_degrees: 14.1, solar_elevation_degrees: 79.1, solar_vector_local_enu: [0, 1, 1], wind_speed_m_s: 4.2, wind_direction_degrees: 270, air_temperature_c: 27.0 }, source_values: { shortwave_radiation: 989 }, units: { shortwave_radiation: "W/m²" } })),
  source_data_disclaimer: "Proxy", educational_disclaimer: "Educational", decision_created: false,
};

const mockFetch = () => vi.stubGlobal("fetch", vi.fn((url: string) => Promise.resolve({ ok: true, json: async () => url.includes("capabilities") ? { data: { capability_id: "SOLAR_TEMPORAL_ANALYSIS", spatial_scope: "edificacion", status: "AVAILABLE", reason: "available", required_data: [], missing_data: [], profile_version: "1" } } : { data: analysis } })));

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("SolarTemporalOverlay ESE-P0", () => {
  it("allows selecting multiple existing layers without implying coupled physics", async () => {
    mockFetch();
    const onScenarioChange = vi.fn<(scenario: EnvironmentalScenarioViewState) => void>();
    render(React.createElement(SolarTemporalOverlay, { selectedAlternativeId: "UPAO-001-A", onAnalysisChange: vi.fn(), onScenarioChange }));
    await waitFor(() => expect(screen.getByText("Educational / Trujillo proxy")).toBeTruthy());
    expect(screen.getByText("Layer overlay only; no coupled physics.")).toBeTruthy();
    const shadow = screen.getByLabelText("ANALYTICAL_SOLAR_SHADOW") as HTMLInputElement;
    fireEvent.click(shadow);
    expect(shadow.checked).toBe(false);
    expect(onScenarioChange).toHaveBeenCalledWith(expect.objectContaining({ scenarioType: "PROXY_EDUCATIONAL", activeLayers: expect.not.arrayContaining(["ANALYTICAL_SOLAR_SHADOW"]) }));
  });

  it("updates the shared temporal context when time changes", async () => {
    mockFetch();
    const onScenarioChange = vi.fn();
    render(React.createElement(SolarTemporalOverlay, { selectedAlternativeId: "UPAO-001-B", onAnalysisChange: vi.fn(), onScenarioChange }));
    await waitFor(() => expect(screen.getByText(/America\/Lima/)).toBeTruthy());
    const time = screen.getByLabelText("solar.time") as HTMLInputElement;
    fireEvent.change(time, { target: { value: "13:00" } });
    expect(time.value).toBe("13:00");
    await waitFor(() => expect(onScenarioChange).toHaveBeenCalledWith(expect.objectContaining({ selectedTime: "13:00" })));
  });
  it("keeps weather wind shared while allowing independent layer selection", async () => {
    mockFetch();
    const onScenarioChange = vi.fn();
    render(React.createElement(SolarTemporalOverlay, { selectedAlternativeId: "UPAO-001-C", onAnalysisChange: vi.fn(), onScenarioChange }));
    await waitFor(() => expect(screen.getByText("Weather wind")).toBeTruthy());
    expect(screen.getByText("Speed: 4.2 m/s")).toBeTruthy();
    expect(screen.getByText("From: 270°")).toBeTruthy();
    expect(screen.getByText("27.0 °C")).toBeTruthy();
    const temperature = screen.getByLabelText("AIR_TEMPERATURE") as HTMLInputElement;
    expect(temperature.checked).toBe(true);
    const wind = screen.getByLabelText("WEATHER_WIND") as HTMLInputElement;
    expect(wind.checked).toBe(true);
    fireEvent.click(wind);
    await waitFor(() => expect(onScenarioChange).toHaveBeenCalledWith(expect.objectContaining({ activeLayers: expect.not.arrayContaining(["WEATHER_WIND"]) })));
  });

});
