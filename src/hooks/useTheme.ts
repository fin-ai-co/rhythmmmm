import { useState, useEffect, useCallback } from "react";

type Mode = "dark" | "light";
type ColorTheme = "blue" | "purple" | "green" | "orange" | "rose";

const STORAGE_MODE = "discipline-mode";
const STORAGE_COLOR = "discipline-color-theme";

export const useTheme = () => {
  const [mode, setModeState] = useState<Mode>(() => {
    return (localStorage.getItem(STORAGE_MODE) as Mode) || "dark";
  });
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    return (localStorage.getItem(STORAGE_COLOR) as ColorTheme) || "blue";
  });

  const applyTheme = useCallback((m: Mode, c: ColorTheme) => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.remove("theme-blue", "theme-purple", "theme-green", "theme-orange", "theme-rose");
    if (m === "dark") root.classList.add("dark");
    root.classList.add(`theme-${c}`);
  }, []);

  useEffect(() => {
    applyTheme(mode, colorTheme);
  }, [mode, colorTheme, applyTheme]);

  const setMode = (m: Mode) => {
    localStorage.setItem(STORAGE_MODE, m);
    setModeState(m);
  };

  const setColorTheme = (c: ColorTheme) => {
    localStorage.setItem(STORAGE_COLOR, c);
    setColorThemeState(c);
  };

  return { mode, colorTheme, setMode, setColorTheme };
};

export type { Mode, ColorTheme };
