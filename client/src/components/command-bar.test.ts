/** @vitest-environment jsdom */
import i18n from "@/i18n";
import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CommandBar, { COMMAND_HISTORY_KEY, commandSuggestions, normalizeLocalizedCommand, validateCommand } from "./CommandBar";

const commandInput = () => screen.getByLabelText(/Comando SICL|SICL command/);
const projectInput = () => screen.getByLabelText(/Proyecto|Project/);

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
  void i18n.changeLanguage("es");
});

afterEach(() => cleanup());

describe("CommandBar", () => {
  it("opens with Ctrl+K and closes with Escape", () => {
    render(React.createElement(CommandBar));
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(screen.getByRole("dialog")).toBeTruthy();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("suggests command names and context values", () => {
    expect(commandSuggestions("/OBJ")).toContain("/OBJECTIVE SET");
    expect(commandSuggestions("/OBJECTIVE SET", { objectives: ["CLIMATE"] })).toEqual(["CLIMATE"]);
  });

  it("normalizes active French and German aliases to canonical commands", () => {
    expect(normalizeLocalizedCommand("/PROJET CRÉER P-001", "fr")).toMatchObject({
      canonical: "/PROJECT CREATE P-001",
      aliasUsed: true,
      aliasStatus: "ACTIVE",
    });
    expect(normalizeLocalizedCommand("/PROJEKT ERSTELLEN P-001", "de")).toMatchObject({
      canonical: "/PROJECT CREATE P-001",
      aliasUsed: true,
      aliasStatus: "ACTIVE",
    });
  });

  it("keeps proposed Spanish aliases visible but not executable", () => {
    expect(commandSuggestions("/PROY", {}, "es")).toContain("/PROYECTO CREAR");
    expect(normalizeLocalizedCommand("/PROYECTO CREAR P-001", "es")).toMatchObject({
      canonical: "/PROJECT CREATE P-001",
      aliasUsed: true,
      aliasStatus: "PROPOSED",
    });
  });

  it("supports Tab completion", () => {
    render(React.createElement(CommandBar));
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    const input = commandInput();
    fireEvent.change(input, { target: { value: "/OBJ" } });
    fireEvent.keyDown(input, { key: "Tab" });
    expect((input as HTMLInputElement).value).toBe("/OBJECTIVE SET");
  });

  it("rejects invalid syntax without making a request", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    render(React.createElement(CommandBar));
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    const input = commandInput();
    fireEvent.change(input, { target: { value: "OBJECTIVE SET" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByText(/Sintaxis inválida|Invalid syntax/)).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(validateCommand("OBJECTIVE SET")).toBeTruthy();
  });

  it("executes a valid command through the canonical v1 endpoint", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ status: "OK", code: "OK", message: "ok", data: {} }), { status: 200 })));
    render(React.createElement(CommandBar));
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    fireEvent.change(projectInput(), { target: { value: "UPAO-001" } });
    const input = commandInput();
    fireEvent.change(input, { target: { value: "/STATUS" } });
    fireEvent.keyDown(input, { key: "Enter" });
    await waitFor(() => expect(screen.getByText(/Comando ejecutado|Command executed/)).toBeTruthy());
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/v1/projects/UPAO-001/commands"), expect.objectContaining({ method: "POST" }));
  });

  it("persists and navigates command history", () => {
    localStorage.setItem(COMMAND_HISTORY_KEY, JSON.stringify(["/STATUS", "/HISTORY"]));
    render(React.createElement(CommandBar));
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    const input = commandInput();
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect((input as HTMLInputElement).value).toBe("/STATUS");
  });

  it("renders translated labels from the active locale", () => {
    render(React.createElement(CommandBar));
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(screen.getByText(/Barra de comandos SICL|SICL Command Bar/)).toBeTruthy();
    expect(projectInput()).toBeTruthy();
  });
});
