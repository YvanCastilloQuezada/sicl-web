import { describe, expect, it } from "vitest";
import { applyAccessibilityPreferences, loadAccessibilityPreferences, persistAccessibilityPreferences } from "./accessibility";

function createMemoryStorage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  };
}

describe("preferencias de accesibilidad", () => {
  it("restaura valores persistidos y normaliza una escala inválida", () => {
    const storage = createMemoryStorage({
      "accessibility-font-scale": "125",
      "accessibility-high-contrast": "true",
      "accessibility-reduce-motion": "false",
    });
    expect(loadAccessibilityPreferences(storage)).toEqual({ fontScale: 125, highContrast: true, reduceMotion: false });
    expect(loadAccessibilityPreferences(createMemoryStorage({ "accessibility-font-scale": "999" })).fontScale).toBe(100);
  });

  it("persiste y aplica escala, contraste y reducción de movimiento", () => {
    const storage = createMemoryStorage();
    const preferences = { fontScale: 150 as const, highContrast: true, reduceMotion: true };
    persistAccessibilityPreferences(storage, preferences);
    expect(loadAccessibilityPreferences(storage)).toEqual(preferences);

    const classes = new Set<string>();
    const root = {
      dataset: {} as DOMStringMap,
      classList: { toggle: (name: string, enabled: boolean) => enabled ? classes.add(name) : classes.delete(name) },
    };
    applyAccessibilityPreferences(root as never, preferences);
    expect(root.dataset.fontScale).toBe("150");
    expect(classes).toEqual(new Set(["a11y-high-contrast", "a11y-reduce-motion"]));
  });
});
