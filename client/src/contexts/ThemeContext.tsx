import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type ThemePreference = Theme | "system";

interface ThemeContextType {
  theme: Theme;
  preference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => void;
  toggleTheme: () => void;
  switchable: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemePreference;
  switchable?: boolean;
}

function systemTheme(): Theme {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  switchable = false,
}: ThemeProviderProps) {
  const [preference, setPreference] = useState<ThemePreference>(() => {
    if (!switchable || typeof window === "undefined") return defaultTheme;
    const stored = localStorage.getItem("theme-preference") ?? localStorage.getItem("theme");
    return stored === "light" || stored === "dark" || stored === "system" ? stored : defaultTheme;
  });
  const [theme, setTheme] = useState<Theme>(() => preference === "system" ? systemTheme() : preference);

  useEffect(() => {
    const applyTheme = () => {
      const resolved = preference === "system" ? systemTheme() : preference;
      setTheme(resolved);
      document.documentElement.classList.toggle("dark", resolved === "dark");
    };
    applyTheme();
    if (!switchable || preference !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", applyTheme);
    return () => media.removeEventListener("change", applyTheme);
  }, [preference, switchable]);

  const setThemePreference = (next: ThemePreference) => {
    setPreference(next);
    if (switchable) {
      localStorage.setItem("theme-preference", next);
      localStorage.setItem("theme", next);
    }
  };

  const toggleTheme = () => setThemePreference(theme === "light" ? "dark" : "light");

  return (
    <ThemeContext.Provider value={{ theme, preference, setThemePreference, toggleTheme, switchable }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}

export type { Theme, ThemePreference };
