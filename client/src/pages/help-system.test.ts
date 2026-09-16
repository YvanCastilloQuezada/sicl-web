/** @vitest-environment jsdom */
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { describe, expect, it } from "vitest";
import { Router } from "wouter";
import i18n from "@/i18n";
import HelpButton from "@/components/HelpButton";
import HelpPage from "@/pages/HelpPage";
import HelpArticlePage from "@/pages/HelpArticlePage";
import { MANUALS } from "@/config/manuals";

const renderWithProviders = (node: React.ReactNode) => render(
  React.createElement(I18nextProvider, { i18n },
    React.createElement(Router, { hook: () => ["/", () => undefined] as const }, node),
  ),
);

describe("help system", () => {
  it("renders the HelpButton and opens a dropdown with three manuals", async () => {
    await i18n.changeLanguage("es");
    renderWithProviders(React.createElement(HelpButton));
    const button = screen.getByRole("button", { name: "Ayuda" });
    expect(button).toBeTruthy();
    fireEvent.click(button);
    expect(screen.getByText("Manual de Usuario")).toBeTruthy();
    expect(screen.getByText("Manual Operativo")).toBeTruthy();
    expect(screen.getByText("Referencia de Comandos")).toBeTruthy();
    expect(screen.getAllByText("Ver aquí")).toHaveLength(3);
  });

  it("renders the help index cards and links each manual", async () => {
    await i18n.changeLanguage("en");
    renderWithProviders(React.createElement(HelpPage));
    expect(screen.getByRole("heading", { name: "Help Center" })).toBeTruthy();
    expect(screen.getAllByRole("link", { name: "View here" })).toHaveLength(3);
    MANUALS.forEach((manual) => expect(manual.path).toMatch(/^\/help\//));
  });

  it("renders Markdown content for a manual article", async () => {
    await i18n.changeLanguage("es");
    renderWithProviders(React.createElement(HelpArticlePage, { manualId: "user" }));
    expect(screen.getByRole("link", { name: "Volver al índice" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /Manual de Usuario de SiMS-DeI y SICL/ })).toBeTruthy();
  });

  it("keeps help labels translated across all supported languages", async () => {
    for (const [language, expected] of [["es", "Ayuda"], ["en", "Help"], ["pt", "Ajuda"], ["it", "Aiuto"], ["fr", "Aide"], ["de", "Hilfe"], ["ru", "Помощь"], ["zh", "帮助"]] as const) {
      await i18n.changeLanguage(language);
      expect(i18n.t("help.button")).toBe(expected);
    }
  });
});
