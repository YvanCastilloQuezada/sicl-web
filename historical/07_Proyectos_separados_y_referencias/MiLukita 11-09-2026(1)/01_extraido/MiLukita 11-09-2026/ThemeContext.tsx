import React, { createContext, useContext, useEffect, useState } from "react";
import { applyAccessibilityPreferences, loadAccessibilityPreferences, persistAccessibilityPreferences, type FontScale } from "@/lib/accessibility";

type Theme = "light" | "dark";
export type { FontScale } from "@/lib/accessibility";

interface ThemeContextType {
  theme: Theme;
  toggleTheme?: () => void;
  switchable: boolean;
  fontScale: FontScale;
  setFontScale: (scale: FontScale) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  reduceMotion: boolean;
  setReduceMotion: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  switchable?: boolean;
}

function initialAccessibilityPreferences() {
  const stored = loadAccessibilityPreferences(localStorage);
  const query = new URLSearchParams(window.location.search);
  if (query.get("a11yPreview") !== "1") return stored;

  return {
    fontScale: query.get("fontScale") === "150" ? 150 : query.get("fontScale") === "125" ? 125 : stored.fontScale,
    highContrast: query.get("highContrast") === "1" ? true : stored.highContrast,
    reduceMotion: query.get("reduceMotion") === "1" ? true : stored.reduceMotion,
  };
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  switchable = false,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (switchable) {
      const stored = localStorage.getItem("theme");
      return (stored as Theme) || defaultTheme;
    }
    return defaultTheme;
  });
  const [accessibility, setAccessibility] = useState(initialAccessibilityPreferences);
  const { fontScale, highContrast, reduceMotion } = accessibility;
  const setFontScale = (scale: FontScale) => setAccessibility(current => ({ ...current, fontScale: scale }));
  const setHighContrast = (enabled: boolean) => setAccessibility(current => ({ ...current, highContrast: enabled }));
  const setReduceMotion = (enabled: boolean) => setAccessibility(current => ({ ...current, reduceMotion: enabled }));

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    if (switchable) {
      localStorage.setItem("theme", theme);
    }
  }, [theme, switchable]);

  useEffect(() => {
    const root = document.documentElement;
    applyAccessibilityPreferences(root, accessibility);
    persistAccessibilityPreferences(localStorage, accessibility);
  }, [accessibility]);

  const toggleTheme = switchable
    ? () => {
        setTheme(prev => (prev === "light" ? "dark" : "light"));
      }
    : undefined;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, switchable, fontScale, setFontScale, highContrast, setHighContrast, reduceMotion, setReduceMotion }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
