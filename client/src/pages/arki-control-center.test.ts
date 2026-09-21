/** @vitest-environment jsdom */
import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import ArkiControlCenterPage from "@/pages/ArkiControlCenterPage";
import { ARKI_CONTROL_CENTER_PATH } from "@/components/AppHeader";

if (!("ResizeObserver" in globalThis)) {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  Object.defineProperty(globalThis, "ResizeObserver", { configurable: true, writable: true, value: ResizeObserverMock });
}

afterEach(() => cleanup());

describe("ARKI Control Center MC-00/MC-01", () => {
  it("keeps the temporary header target stable", () => {
    expect(ARKI_CONTROL_CENTER_PATH).toBe("/control-center");
  });

  it("shows interactive status proportions and combined registry controls", () => {
    render(React.createElement(ArkiControlCenterPage));
    expect(screen.getByText("Status proportion")).toBeTruthy();
    expect(screen.getAllByRole("button", { name: /READY/ }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: /BLOCKED/ }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: /FROZEN/ }).length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText(/Buscar SICL/)).toBeTruthy();
    expect(screen.getByRole("button", { name: "Buscar" })).toBeTruthy();
  });

  it("offers autocomplete for registry identifiers and exposes the MC-01 pilot view", () => {
    render(React.createElement(ArkiControlCenterPage));
    const search = screen.getByPlaceholderText(/Buscar SICL/);
    fireEvent.focus(search);
    fireEvent.change(search, { target: { value: "MC-01" } });
    expect(screen.getByText("Corporación ARKI")).toBeTruthy();
    const suggestion = screen.getByText("Corporación ARKI").closest("button");
    expect(suggestion).toBeTruthy();
    fireEvent.mouseDown(suggestion as HTMLButtonElement);
    fireEvent.click(screen.getByRole("button", { name: "Corporation" }));
    expect(screen.getByText("MC-01 / PILOT")).toBeTruthy();
    expect(screen.getByText(/Vista inicial autorizada/)).toBeTruthy();
  });
});
