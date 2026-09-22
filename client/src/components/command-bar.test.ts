/** @vitest-environment jsdom */
import i18n from "@/i18n";
import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CommandBar, { COMMAND_HISTORY_KEY, COMMAND_LANGUAGE_KEY, commandSuggestions, normalizeLocalizedCommand, validateCommand } from "./CommandBar";
import { GUIDED_MODE_KEY } from "./GuidedShell";

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
    expect(commandSuggestions("OBJ")).toContain("OBJ-SET");
    expect(commandSuggestions("OBJ-SET", { objectives: ["CLIMATE"] })).toEqual(["CLIMATE"]);
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

  it("normalizes the active Spanish aliases while retaining status metadata", () => {
    expect(commandSuggestions("/PROY", {}, "es")).toContain("/PROYECTO CREAR");
    expect(normalizeLocalizedCommand("/PROYECTO CREAR P-001", "es")).toMatchObject({
      canonical: "/PROJECT CREATE P-001",
      aliasUsed: true,
      aliasStatus: "ACTIVE",
    });
  });

  it("supports Tab completion", () => {
    render(React.createElement(CommandBar));
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    const input = commandInput();
    fireEvent.change(input, { target: { value: "OBJ" } });
    fireEvent.keyDown(input, { key: "Tab" });
    expect((input as HTMLInputElement).value).toBe("OBJ-SET");
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
    fireEvent.change(input, { target: { value: "STA-TUS" } });
    fireEvent.keyDown(input, { key: "Enter" });
    await waitFor(() => expect(screen.getByText(/Comando ejecutado|Command executed/)).toBeTruthy());
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/v1/projects/UPAO-001/commands"), expect.objectContaining({ method: "POST" }));
  });

  it("persists and navigates command history", () => {
    localStorage.setItem(COMMAND_HISTORY_KEY, JSON.stringify(["STA-TUS", "HIS-TOR"]));
    render(React.createElement(CommandBar));
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    const input = commandInput();
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect((input as HTMLInputElement).value).toBe("STA-TUS");
  });

  it("renders translated labels from the active locale", () => {
    render(React.createElement(CommandBar));
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(screen.getByText(/Barra de comandos SICL|SICL Command Bar/)).toBeTruthy();
    expect(projectInput()).toBeTruthy();
  });

  it("filters localized aliases and exposes their English canonical command", () => {
    render(React.createElement(CommandBar));
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    const search = screen.getByLabelText(/Buscar alias por idioma|Search aliases by language/);
    fireEvent.change(search, { target: { value: "PROYECTO" } });
    const result = screen.getByText("/PROYECTO CREAR");
    expect(result).toBeTruthy();
    expect(result.getAttribute("title")).toBe("/PROJECT CREATE");
  });

  it("persists the preferred command language from the settings panel", () => {
    render(React.createElement(CommandBar));
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    fireEvent.click(screen.getByRole("button", { name: /Configuración|Settings/ }));
    const select = screen.getByLabelText(/Idioma predeterminado de comandos|Default command language/);
    fireEvent.change(select, { target: { value: "fr" } });
    fireEvent.click(screen.getByRole("button", { name: /Guardar idioma|Save language/ }));
    expect(localStorage.getItem(COMMAND_LANGUAGE_KEY)).toBe("fr");
    expect(screen.getByText(/Preferencia de idioma guardada|Language preference saved|Préférence de langue enregistrée/)).toBeTruthy();
  });

  it("opens and focuses alias search with Ctrl/Cmd+Shift+L", async () => {
    render(React.createElement(CommandBar));
    fireEvent.keyDown(window, { key: "l", ctrlKey: true, shiftKey: true });
    const search = screen.getByLabelText(/Buscar alias por idioma|Search aliases by language/);
    expect(screen.getByRole("dialog")).toBeTruthy();
    await waitFor(() => expect(document.activeElement).toBe(search));
  });

  it("exports the selected locale aliases as CSV", () => {
    const createObjectURL = vi.fn().mockReturnValue("blob:test");
    const revokeObjectURL = vi.fn();
    vi.stubGlobal("URL", { ...URL, createObjectURL, revokeObjectURL });
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);
    render(React.createElement(CommandBar));
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    fireEvent.click(screen.getByRole("button", { name: /Exportar alias CSV|Export aliases CSV/ }));
    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(createObjectURL.mock.calls[0][0]).toBeInstanceOf(Blob);
    expect(click).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:test");
    click.mockRestore();
  });

  it("shows command descriptions, required arguments and interactive examples", () => {
    render(React.createElement(CommandBar));
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    fireEvent.change(commandInput(), { target: { value: "PRO-CRE" } });
    expect(screen.getByText(/Crea un espacio de trabajo|Creates a workspace/)).toBeTruthy();
    expect(screen.getByText(/project_id · (required|obligatorio|obrigatório|obligatoire|erforderlich|обязательно|必填)/)).toBeTruthy();
    const example = screen.getByRole("button", { name: /PRO-CRE DEMO-001/ });
    fireEvent.click(example);
    expect((commandInput() as HTMLInputElement).value).toContain("PRO-CRE DEMO-001");
  });

  it("persists the beginner or expert experience mode from settings", () => {
    render(React.createElement(CommandBar));
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    fireEvent.click(screen.getByRole("button", { name: /Configuración|Settings/ }));
    const select = screen.getByLabelText(/Modo de experiencia|Experience mode/);
    fireEvent.change(select, { target: { value: "expert" } });
    expect(localStorage.getItem(GUIDED_MODE_KEY)).toBe("expert");
  });
});
