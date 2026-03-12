import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem("theme");
    // Default to dark if no preference stored
    return stored ? stored === "dark" : true;
  });

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Apply theme attribute (used by Navbar.css selectors)
    body.setAttribute("data-theme", isDarkMode ? "dark" : "light");

    // Smooth colour transition on every theme switch
    root.style.setProperty("--theme-transition", "0.4s");
    body.style.transition =
      "background 0.4s ease, color 0.4s ease";

    // CSS variables for consistent use across the app
    if (isDarkMode) {
      root.style.setProperty("--bg-primary",       "#060d1f");
      root.style.setProperty("--bg-secondary",     "#0f2244");
      root.style.setProperty("--surface",          "rgba(255,255,255,0.05)");
      root.style.setProperty("--surface-border",   "rgba(255,255,255,0.09)");
      root.style.setProperty("--text-primary",     "#f0f6ff");
      root.style.setProperty("--text-secondary",   "rgba(200,220,255,0.55)");
      root.style.setProperty("--text-muted",       "rgba(200,220,255,0.30)");
      root.style.setProperty("--accent-blue",      "#38bdf8");
      root.style.setProperty("--accent-purple",    "#818cf8");
      root.style.setProperty("--shadow-color",     "rgba(0,0,0,0.40)");
    } else {
      root.style.setProperty("--bg-primary",       "#1e6dd5");
      root.style.setProperty("--bg-secondary",     "#5bb8f5");
      root.style.setProperty("--surface",          "rgba(255,255,255,0.70)");
      root.style.setProperty("--surface-border",   "rgba(180,210,255,0.55)");
      root.style.setProperty("--text-primary",     "#0f2744");
      root.style.setProperty("--text-secondary",   "rgba(15,39,68,0.65)");
      root.style.setProperty("--text-muted",       "rgba(15,39,68,0.38)");
      root.style.setProperty("--accent-blue",      "#0369a1");
      root.style.setProperty("--accent-purple",    "#4f46e5");
      root.style.setProperty("--shadow-color",     "rgba(0,0,80,0.14)");
    }
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);