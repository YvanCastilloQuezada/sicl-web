import { describe, expect, it } from "vitest";
import { DEFAULT_LUKITA_SCRIPTS, getLukitaFallback, isLukitaScriptTrigger, normalizeLukitaEdit, renderLukitaScript } from "./lukitaScripts";

describe("Lukita scripts", () => {
  it("renderiza el guion con el nombre del juego", () => {
    expect(renderLukitaScript(DEFAULT_LUKITA_SCRIPTS.EVENT_START, "Lotería 39")).toContain("Lotería 39");
  });
  it("ofrece fallback determinista y seguro", () => {
    expect(getLukitaFallback("DRAW_STARTED", "Ruleta 37")).toContain("motor autorizado");
    expect(DEFAULT_LUKITA_SCRIPTS.DRAW_STARTED.canChangeOfficialState).toBe(false);
  });
  it("reconoce solo disparadores soportados", () => {
    expect(isLukitaScriptTrigger("EVENT_START")).toBe(true);
    expect(isLukitaScriptTrigger("RESULT_VERIFIED")).toBe(true);
    expect(isLukitaScriptTrigger("CHANGE_RESULT")).toBe(false);
  });
  it("conserva el origen IA como borrador no autoritativo", () => {
    const generated = normalizeLukitaEdit(DEFAULT_LUKITA_SCRIPTS.EVENT_START, "Propuesta {game}", "Fallback", "2026-08-26T00:00:00.000Z", "ai_generated");
    expect(generated.source).toBe("ai_generated");
    expect(generated.canChangeOfficialState).toBe(false);
  });
  it("incrementa versión y limita edición del operador", () => {
    const edited = normalizeLukitaEdit(DEFAULT_LUKITA_SCRIPTS.EVENT_START, "  Hola {game}  ", "Fallback seguro", "2026-08-26T00:00:00.000Z");
    expect(edited.version).toBe(2);
    expect(edited.source).toBe("operator_edit");
    expect(edited.text).toBe("Hola {game}");
    expect(edited.canChangeOfficialState).toBe(false);
  });
});
