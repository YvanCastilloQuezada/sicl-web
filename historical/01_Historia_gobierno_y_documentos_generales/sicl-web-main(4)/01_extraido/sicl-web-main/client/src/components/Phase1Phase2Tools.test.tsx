/** @vitest-environment jsdom */
import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import i18n from "@/i18n";
import { CommandBuilder, EpistemicLegend, SyntheticDemoCard } from "./Phase1Phase2Tools";

const renderWithI18n = (node: React.ReactNode) => render(React.createElement(I18nextProvider, { i18n }, node));

describe("Phase 1 epistemic and Phase 2 learning tools", () => {
  beforeEach(() => void i18n.changeLanguage("es"));
  afterEach(() => cleanup());

  it("shows distinct Fact, Assumption and Preference labels", () => {
    renderWithI18n(React.createElement(EpistemicLegend));
    expect(screen.getByText("HECHO")).toBeTruthy();
    expect(screen.getByText("SUPUESTO")).toBeTruthy();
    expect(screen.getByText("PREFERENCIA")).toBeTruthy();
  });

  it("reveals synthetic demo data and labels it as non-production", () => {
    renderWithI18n(React.createElement(SyntheticDemoCard));
    expect(screen.getByText("DATOS SINTÉTICOS")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Explorar demo" }));
    expect(screen.getByText("La fachada recibe radiación solar de la tarde.")).toBeTruthy();
    expect(screen.getByText("El sombreado exterior reducirá la carga térmica.")).toBeTruthy();
  });

  it("generates a canonical command from visual form fields", () => {
    const onCommandChange = vi.fn();
    renderWithI18n(React.createElement(CommandBuilder, { onCommandChange }));
    expect(screen.getByText(/PROJECT CREATE/)).toBeTruthy();
    const name = screen.getByLabelText("name");
    fireEvent.change(name, { target: { value: "Biblioteca central" } });
    expect(screen.getByText(/Biblioteca central/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Copiar comando" }));
    expect(onCommandChange).toHaveBeenCalledWith(expect.stringContaining("Biblioteca central"));
  });
});
