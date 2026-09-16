/** @vitest-environment jsdom */
import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import i18n from "@/i18n";
import GuidedShell, { GUIDED_MODE_KEY, humanizeSiclError } from "./GuidedShell";

const counts = { project: true, preference: 1, recommendation: 0, humanReview: 0, decision: 0, audit: 0 };
const renderShell = () => render(React.createElement(I18nextProvider, { i18n }, React.createElement(GuidedShell, { counts, onNavigate: vi.fn() })));

describe("GuidedShell", () => {
  beforeEach(() => {
    localStorage.clear();
    void i18n.changeLanguage("es");
  });
  afterEach(() => cleanup());

  it("defaults to guided mode and identifies the next Camino A step", () => {
    renderShell();
    expect(screen.getByRole("region", { name: "Tu ruta de decisión" })).toBeTruthy();
    expect(screen.getByText("Recomendación")).toBeTruthy();
    expect(screen.getByText("SIGUIENTE PASO")).toBeTruthy();
  });

  it("allows switching to expert mode and back persistently", () => {
    renderShell();
    fireEvent.click(screen.getByRole("button", { name: "Cambiar a modo experto" }));
    expect(localStorage.getItem(GUIDED_MODE_KEY)).toBe("expert");
    expect(screen.getByText(/Modo experto activo/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Volver al modo guiado" }));
    expect(localStorage.getItem(GUIDED_MODE_KEY)).toBe("guided");
    expect(screen.getByText("Tu ruta de decisión")).toBeTruthy();
  });

  it("humanizes common SICL errors without changing the technical code", () => {
    expect(humanizeSiclError("MISSING_REQUIRED_ARGUMENT")).toContain("dato obligatorio");
    expect(humanizeSiclError("PROJECT_REQUIRED")).toContain("proyecto");
    expect(humanizeSiclError("HUMAN_REVIEW_REQUIRED")).toContain("revisión humana");
  });

  it("renders the ten interactive modules with status previews and the onboarding tour", () => {
    renderShell();
    expect(screen.getByRole("link", { name: /Contexto \/ Sitio:/ })).toBeTruthy();
    expect(screen.getByRole("tooltip")).toBeTruthy();
    expect(screen.getByRole("dialog", { name: "Recorrido inicial" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Siguiente" })).toBeTruthy();
  });

  it("opens and filters the canonical RFC-022 catalogs", () => {
    renderShell();
    fireEvent.click(screen.getByRole("button", { name: "Mostrar catálogos" }));
    expect(screen.getByRole("combobox", { name: "Seleccionar catálogo" })).toBeTruthy();
    const filter = screen.getByPlaceholderText("Filtrar opciones…");
    fireEvent.change(filter, { target: { value: "EDIFICACION" } });
    expect(screen.getByRole("button", { name: /EDIFICACION/ })).toBeTruthy();
  });
});
