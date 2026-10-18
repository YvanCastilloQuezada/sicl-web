import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = (file: string) => readFileSync(resolve(root, file), "utf8");

describe("Fase B · consolidación de presencia LUKA", () => {
  it("formaliza MobileShell y lo monta sobre App/providers/rutas", () => {
    const shell = read("client/src/components/MobileShell.tsx");
    const app = read("client/src/App.tsx");
    expect(shell).toContain("data-mobile-shell");
    expect(shell).toContain("/luka-context-qr");
    expect(app).toContain("<MobileShell><Router /></MobileShell>");
  });

  it("mantiene L★ en el shell y la entrada pública única de LukaUniversalEntry", () => {
    const shell = read("client/src/components/MobileShell.tsx");
    const app = read("client/src/App.tsx");
    const home = read("client/src/pages/Home.tsx");
    expect(shell).toContain("L★ · abrir QR contextual");
    expect(app).toContain('path={"/luka-entry"}');
    expect(home).toContain('enter("/luka-entry?entry=portal")');
  });

  it("define estados de presencia y no expone los laboratorios en la entrada pública", () => {
    const entry = read("client/src/components/LukaUniversalEntry.tsx");
    for (const state of ["PRESENCE", "LISTENING", "SPEAKING", "THINKING", "SILENT"]) expect(entry).toContain(state);
    expect(entry).toContain("data-luka-presence-state");
    expect(entry).not.toContain("SmartTvConnectionSimulator");
    expect(entry).not.toContain("LukaRuntimeLab");
    expect(entry).not.toContain("LukaDevControlPanel");
  });
});
