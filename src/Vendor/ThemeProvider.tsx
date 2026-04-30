import { createContext, useContext, useState, useEffect } from "react";

const ToggleContext = createContext();

export const ToggleProvider = ({ children }) => {
  const [enabled, setEnabled] = useState(false);

  const toggle = () => setEnabled(prev => !prev);

  // load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("toggle");
    if (saved !== null) setEnabled(JSON.parse(saved));
  }, []);

  // save to localStorage
  useEffect(() => {
    localStorage.setItem("toggle", JSON.stringify(enabled));
  }, [enabled]);

  // ✅ APPLY GLOBAL THEME HERE
  useEffect(() => {
    document.body.classList.toggle("dark", enabled);
    document.body.classList.toggle("light", !enabled);
  }, [enabled]);

  return (
    <ToggleContext.Provider value={{ enabled, toggle }}>
      {children}
    </ToggleContext.Provider>
  );
};

export const useToggle = () => useContext(ToggleContext);