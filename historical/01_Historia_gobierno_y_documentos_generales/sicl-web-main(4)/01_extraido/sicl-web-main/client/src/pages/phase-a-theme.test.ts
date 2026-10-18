/** @vitest-environment jsdom */
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Router } from "wouter";
import i18n from "@/i18n";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import EvidencePage from "@/pages/EvidencePage";
import EvaluationsPage from "@/pages/EvaluationsPage";
import ComparisonsPage from "@/pages/ComparisonsPage";

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: "theme-test-user" }, loading: false }),
}));
vi.mock("@/components/LanguageSelector", () => ({ default: () => null }));
vi.mock("@/components/HelpButton", () => ({ default: () => null }));

const renderPage = (page: React.ReactNode, theme: "light" | "dark") => {
  cleanup();
  return render(React.createElement(
    I18nextProvider,
    { i18n },
    React.createElement(
      LanguageProvider,
      null,
      React.createElement(
        ThemeProvider,
        { defaultTheme: theme, switchable: true },
        React.createElement(Router, { hook: () => ["/", () => undefined] as const }, page),
      ),
    ),
  ));
};

describe("Phase A theme styles", () => {
  beforeEach(() => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ data: { evidence: [], sources: [], evaluations: [], comparisons: [] } }), { status: 200 }));
  });
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    document.documentElement.classList.remove("dark");
  });

  it.each([
    ["Evidence", EvidencePage],
    ["Evaluations", EvaluationsPage],
    ["Comparisons", ComparisonsPage],
  ] as const)("renders %s with readable semantic theme classes in light mode", (_name, Page) => {
    renderPage(React.createElement(Page), "light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(screen.getByRole("main").classList.contains("text-foreground")).toBe(true);
    expect(screen.getAllByRole("heading", { level: 1 }).length).toBeGreaterThan(0);
  });

  it.each([
    ["Evidence", EvidencePage],
    ["Evaluations", EvaluationsPage],
    ["Comparisons", ComparisonsPage],
  ] as const)("renders %s with readable semantic theme classes in dark mode", (_name, Page) => {
    renderPage(React.createElement(Page), "dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(screen.getByRole("main").classList.contains("text-foreground")).toBe(true);
    expect(screen.getAllByRole("heading", { level: 1 }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("textbox").length).toBeGreaterThan(0);
  });
});
