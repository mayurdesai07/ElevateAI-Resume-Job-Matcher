"use client";

import { useState, useEffect } from "react";

export type ThemeMode = "light" | "dark";

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read stored preference or default to light
    const stored = localStorage.getItem("elevate_theme") as ThemeMode | null;
    const initialTheme: ThemeMode = stored === "dark" ? "dark" : "light";
    setThemeState(initialTheme);
    applyThemeToDocument(initialTheme);
    setMounted(true);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "elevate_theme" && e.newValue) {
        const newTheme = e.newValue as ThemeMode;
        setThemeState(newTheme);
        applyThemeToDocument(newTheme);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const applyThemeToDocument = (t: ThemeMode) => {
    const root = document.documentElement;
    if (t === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    applyThemeToDocument(newTheme);
    localStorage.setItem("elevate_theme", newTheme);
  };

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
  };

  return {
    theme,
    isDark: theme === "dark",
    isLight: theme === "light",
    toggleTheme,
    setTheme,
    mounted,
  };
}
