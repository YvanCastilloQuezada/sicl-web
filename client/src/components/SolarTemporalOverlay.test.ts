// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string, fallback?: string) => fallback ?? key }) }));

import SolarTemporalOverlay, { type EnvironmentalScenarioViewState, type SolarAnalysis } from "./SolarTemporalOverlay";

const analysis: SolarAnalysis = {
  example_id: "UPAO-001", analysis_type: "SOLAR", temporal_mode: "INSTANT", selected_date: "2026-09-17", selected_time: "12:00",
  location: { name: "Trujillo, Peru", latitude: -8.11, longitude: -79.03, timezone: "America/Lima", role: "educational_proxy", location_class: "PROXY", provenance: "Open-Meteo", surveyed_site: false, cadastral_location: false, verified_upao_site: false },
  analyses: ["UPAO-001-A", "UPAO-001-B", "UPAO-001-C"].map((alternative_id) => ({ alternative_id, local_timestamp: "2026-09-17T12:00:00-05:00", derived_metrics: { solar_azimuth_degrees: 14.1, solar_elevation_degrees: 79.1, solar_vector_local_enu: [0, 1, 1], wind_speed_m_s: 4.2, wind_direction_degrees: 270, wind_gusts_m_s: 7.5, air_temperature_c: 27.0, apparent_temperature_c: 27.5, relative_humidity_percent: 65, dew_point_c: 20, precipitation_mm: 0, rain_mm: 0, showers_mm: 0, precipitation_probability_percent: 10, cloud_cover_percent: 25, cloud_cover_low_percent: 10, cloud_cover_mid_percent: 20, cloud_cover_high_percent: 30, pressure_msl_hpa: 1012, surface_pressure_hpa: 1008 }, source_values: { shortwave_radiation: 989 }, units: { shortwave_radiation: "W/m²" } })),
  source_data_disclaimer: "Proxy", educational_disclaimer: "Educational", decision_created: false,
};

const mockFetch = () => vi.stubGlobal("fetch", vi.fn((url: string) => Promise.resolve({ ok: true, json: async () => url.includes("capabilities") ? { data: { capability_id: "SOLAR_TEMPORAL_ANALYSIS", spatial_scope: "edificacion", status: "AVAILABLE", reason: "available", required_data: [], missing_data: [], profile_version: "1" } } : { data: analysis } })));

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("SolarTemporalOverlay OM-ELB-P1", () => {
  it("allows selecting multiple independent layers without implying coupled physics", async () => {
    mockFetch();
    const onScenarioChange = vi.fn<(scenario: EnvironmentalScenarioViewState) => void>();
    render(React.createElement(SolarTemporalOverlay, { selectedAlternativeId: "UPAO-001-A", onAnalysisChange: vi.fn(), onScenarioChange }));
    await waitFor(() => expect(screen.getByText("Educational / Trujillo proxy")).toBeTruthy());
    expect(screen.getByText("Layer overlay only; no coupled physics.")).toBeTruthy();
    const humidity = screen.getByLabelText("HUMIDITY") as HTMLInputElement;
    const cloud = screen.getByLabelText("CLOUD_TOTAL") as HTMLInputElement;
    fireEvent.click(humidity);
    fireEvent.click(cloud);
    expect(humidity.checked).toBe(true);
    expect(cloud.checked).toBe(true);
    expect(onScenarioChange).toHaveBeenCalledWith(expect.objectContaining({ scenarioType: "PROXY_EDUCATIONAL", activeLayers: expect.arrayContaining(["HUMIDITY", "CLOUD_TOTAL"]) }));
  });

  it("keeps solar-only defaults and updates the shared temporal context", async () => {
    mockFetch();
    const onScenarioChange = vi.fn();
    render(React.createElement(SolarTemporalOverlay, { selectedAlternativeId: "UPAO-001-B", onAnalysisChange: vi.fn(), onScenarioChange }));
    await waitFor(() => expect(screen.getByText(/America\/Lima/)).toBeTruthy());
    expect((screen.getByLabelText("WEATHER_WIND") as HTMLInputElement).checked).toBe(false);
    expect((screen.getByLabelText("AIR_TEMPERATURE") as HTMLInputElement).checked).toBe(false);
    const time = screen.getByLabelText("solar.time") as HTMLInputElement;
    fireEvent.change(time, { target: { value: "13:00" } });
    await waitFor(() => expect(onScenarioChange).toHaveBeenCalledWith(expect.objectContaining({ selectedTime: "13:00" })));
  });

  it("shows selected wind and weather context for A/B/C under one timestamp", async () => {
    mockFetch();
    const onScenarioChange = vi.fn();
    render(React.createElement(SolarTemporalOverlay, { selectedAlternativeId: "UPAO-001-C", onAnalysisChange: vi.fn(), onScenarioChange }));
    await waitFor(() => expect(screen.getByText("Educational / Trujillo proxy")).toBeTruthy());
    fireEvent.click(screen.getByLabelText("WEATHER_WIND"));
    fireEvent.click(screen.getByLabelText("WIND_GUSTS"));
    expect(screen.getByText("Speed: 4.2 m/s · From: 270°")).toBeTruthy();
    expect(screen.getByText("Gusts: 7.5 m/s")).toBeTruthy();
  });
});
