import { createContext, useContext, useState } from "react";

const UnitContext = createContext();

export function UnitProvider({ children }) {
  const [unit, setUnit] = useState(() => {
    // Persist preference across sessions
    return localStorage.getItem("unit") || "metric"; // default °C
  });

  const toggle = () => {
    setUnit((u) => {
      const next = u === "metric" ? "imperial" : "metric";
      localStorage.setItem("unit", next);
      return next;
    });
  };

  // Alias so both useUnit().toggle and useUnit().toggleUnit work
  // (keeps compatibility with any component using either name)
  return (
    <UnitContext.Provider value={{ unit, toggle, toggleUnit: toggle }}>
      {children}
    </UnitContext.Provider>
  );
}

export const useUnit = () => useContext(UnitContext);